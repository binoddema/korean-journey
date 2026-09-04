import { createClient, type Session } from "@supabase/supabase-js";

/* ============================================================
   Collegamento a Supabase.
   I due valori stanno in .env (VITE_SUPABASE_URL e
   VITE_SUPABASE_KEY). Se mancano, l'app continua a funzionare
   solo in locale: nessuna schermata di login, nessun errore.
   ============================================================ */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

export const attivo = Boolean(URL && KEY);

export const sb = attivo
  ? createClient(URL!, KEY!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/* ---------------- autenticazione ---------------- */

export async function sessione(): Promise<Session | null> {
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

export function alCambioSessione(f: (s: Session | null) => void) {
  if (!sb) return () => {};
  const { data } = sb.auth.onAuthStateChange((_e, s) => f(s));
  return () => data.subscription.unsubscribe();
}

export async function registrati(email: string, password: string) {
  if (!sb) throw new Error("Supabase non configurato");
  const { error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
}

export async function accedi(email: string, password: string) {
  if (!sb) throw new Error("Supabase non configurato");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function esci() {
  if (sb) await sb.auth.signOut();
}

/* ---------------- archivi ----------------
   Un archivio per sezione: "coreano", "design", "sport".
   Il contenuto è lo stesso oggetto che oggi sta in
   localStorage, quindi il resto dell'app non cambia.
------------------------------------------------- */

export async function scarica<T>(nome: string): Promise<T | null> {
  if (!sb) return null;
  const { data, error } = await sb
    .from("archivi")
    .select("contenuto, aggiornato")
    .eq("nome", nome)
    .maybeSingle();
  if (error || !data) return null;
  return data.contenuto as T;
}

export async function carica(nome: string, contenuto: unknown) {
  if (!sb) return;
  const s = await sessione();
  if (!s) return;
  await sb.from("archivi").upsert(
    {
      utente: s.user.id,
      nome,
      contenuto,
      aggiornato: new Date().toISOString(),
    },
    { onConflict: "utente,nome" }
  );
}

/** Data dell'ultimo salvataggio sul server, per capire chi è più recente. */
export async function quandoAggiornato(nome: string): Promise<number> {
  if (!sb) return 0;
  const { data } = await sb
    .from("archivi")
    .select("aggiornato")
    .eq("nome", nome)
    .maybeSingle();
  return data ? new Date(data.aggiornato).getTime() : 0;
}

/* ---------------- foto ---------------- */

/** Carica una foto (data URL) e restituisce il percorso salvato. */
export async function caricaFoto(dataUrl: string, id: string): Promise<string | null> {
  if (!sb) return null;
  const s = await sessione();
  if (!s) return null;

  const risposta = await fetch(dataUrl);
  const blob = await risposta.blob();
  const percorso = `${s.user.id}/${id}.jpg`;

  const { error } = await sb.storage
    .from("portfolio")
    .upload(percorso, blob, { contentType: "image/jpeg", upsert: true });

  return error ? null : percorso;
}

/** Indirizzo temporaneo per mostrare una foto salvata. */
export async function urlFoto(percorso: string): Promise<string | null> {
  if (!sb) return null;
  const { data } = await sb.storage
    .from("portfolio")
    .createSignedUrl(percorso, 60 * 60);
  return data?.signedUrl ?? null;
}

export async function eliminaFoto(percorso: string) {
  if (!sb) return;
  await sb.storage.from("portfolio").remove([percorso]);
}
