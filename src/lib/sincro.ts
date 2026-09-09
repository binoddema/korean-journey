import { attivo, sb, sessione } from "./nuvola";

/* ============================================================
   Sincronizzazione.

   Tre regole, in ordine di importanza:

   1. Dopo l'accesso si SCARICA per primo, sempre.
   2. Un archivio vuoto non sostituisce mai uno pieno,
      né in salita né in discesa.
   3. Il salvataggio parte da solo dopo ogni modifica, non
      solo a intervalli: se chiudi di colpo, è già partito.
   ============================================================ */

const ARCHIVI = ["korean-journey-v1", "design-v1", "sport-v1"];

export type Esito = { ok: boolean; messaggio: string };

const tsLocale = (nome: string) => Number(localStorage.getItem(`ts:${nome}`) ?? 0);
const segnaTs = (nome: string, ts: number) =>
  localStorage.setItem(`ts:${nome}`, String(ts));

/* ------------------------------------------------------------------
   Quanto "pesa" un archivio.
   Serve a non far vincere il vuoto sul pieno.
   ------------------------------------------------------------------ */

function consistenza(nome: string, dati: unknown): number {
  if (!dati || typeof dati !== "object") return 0;
  const d = dati as Record<string, unknown>;

  if (nome === "korean-journey-v1") {
    const xp = Number(d.xp ?? 0);
    const srs = Object.keys((d.srs as object) ?? {}).length;
    const log = Object.keys((d.log as object) ?? {}).length;
    return xp + srs + log;
  }

  if (nome === "design-v1") {
    return Array.isArray(dati) ? dati.length : 0;
  }

  if (nome === "sport-v1") {
    const storico = Array.isArray(d.storico) ? d.storico.length : 0;
    const miei = Object.keys((d.miei as object) ?? {}).length;
    const peso = Array.isArray(d.peso) ? d.peso.length : 0;
    return storico + miei + peso;
  }

  return 1;
}

function leggiLocale(nome: string): unknown | null {
  const grezzo = localStorage.getItem(nome);
  if (!grezzo) return null;
  try {
    return JSON.parse(grezzo);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------
   Discesa — si chiama per prima, dopo l'accesso
   ------------------------------------------------------------------ */

export async function scaricaTutto(): Promise<Esito> {
  if (!attivo || !sb) return { ok: false, messaggio: "Sincronizzazione non attiva." };

  const s = await sessione();
  if (!s) return { ok: false, messaggio: "Non hai effettuato l'accesso." };

  const { data, error } = await sb
    .from("archivi")
    .select("nome, contenuto, aggiornato");

  if (error) return { ok: false, messaggio: error.message };
  if (!data || data.length === 0)
    return { ok: true, messaggio: "Sul server non c'è ancora niente." };

  let presi = 0;
  let protetti = 0;

  for (const riga of data) {
    if (!ARCHIVI.includes(riga.nome)) continue;

    const pesoServer = consistenza(riga.nome, riga.contenuto);
    const pesoLocale = consistenza(riga.nome, leggiLocale(riga.nome));

    // Regola 2: il vuoto non cancella il pieno.
    if (pesoServer < pesoLocale) {
      protetti++;
      continue;
    }

    const tsServer = Date.parse(riga.aggiornato);
    if (tsServer > tsLocale(riga.nome) || pesoServer > pesoLocale) {
      localStorage.setItem(riga.nome, JSON.stringify(riga.contenuto));
      segnaTs(riga.nome, tsServer);
      presi++;
    }
  }

  const parti: string[] = [];
  if (presi) parti.push(`scaricati ${presi} archivi`);
  if (protetti)
    parti.push(
      `${protetti} non toccati: sul telefono hai più dati che sul server`
    );
  if (!parti.length) parti.push("era già tutto aggiornato");

  return { ok: true, messaggio: parti.join(", ") + "." };
}

/* ------------------------------------------------------------------
   Salita
   ------------------------------------------------------------------ */

export async function caricaTutto(): Promise<Esito> {
  if (!attivo || !sb) return { ok: false, messaggio: "Sincronizzazione non attiva." };

  const s = await sessione();
  if (!s) return { ok: false, messaggio: "Non hai effettuato l'accesso." };

  let mandati = 0;
  let saltati = 0;

  for (const nome of ARCHIVI) {
    const locale = leggiLocale(nome);
    if (locale === null) continue;

    const pesoLocale = consistenza(nome, locale);

    // Regola 2, in salita: non mandare un archivio vuoto
    // se sul server ce n'è uno con dei dati.
    if (pesoLocale === 0) {
      const { data } = await sb
        .from("archivi")
        .select("contenuto")
        .eq("nome", nome)
        .maybeSingle();
      if (data && consistenza(nome, data.contenuto) > 0) {
        saltati++;
        continue;
      }
    }

    const adesso = new Date().toISOString();
    const { error } = await sb.from("archivi").upsert(
      { utente: s.user.id, nome, contenuto: locale, aggiornato: adesso },
      { onConflict: "utente,nome" }
    );

    if (error) return { ok: false, messaggio: `Errore su ${nome}: ${error.message}` };

    segnaTs(nome, Date.parse(adesso));
    mandati++;
  }

  const parti: string[] = [];
  if (mandati) parti.push(`salvati ${mandati} archivi`);
  if (saltati)
    parti.push(`${saltati} saltati: erano vuoti e sul server ci sono dati`);
  if (!parti.length) parti.push("non c'era niente da salvare");

  return { ok: true, messaggio: parti.join(", ") + "." };
}

/* ------------------------------------------------------------------
   Salvataggio automatico dopo ogni modifica
   ------------------------------------------------------------------ */

let attesa: ReturnType<typeof setTimeout> | null = null;

/** Chiede un salvataggio: parte dopo 3 secondi di quiete. */
export function segnalaModifica() {
  if (!attivo) return;
  if (attesa) clearTimeout(attesa);
  attesa = setTimeout(() => {
    attesa = null;
    caricaTutto();
  }, 3000);
}

/* ------------------------------------------------------------------
   Avvio
   ------------------------------------------------------------------ */

export function avviaSincro() {
  if (!attivo) return () => {};

  // Regola 3: intercetta ogni scrittura negli archivi dell'app
  // e programma un salvataggio. Così non serve ricordarsi niente.
  const scritturaOriginale = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (chiave: string, valore: string) => {
    scritturaOriginale(chiave, valore);
    if (ARCHIVI.includes(chiave)) segnalaModifica();
  };

  const ogniTanto = setInterval(caricaTutto, 60 * 1000);

  const allUscita = () => {
    caricaTutto();
  };

  window.addEventListener("pagehide", allUscita);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") allUscita();
  });

  return () => {
    clearInterval(ogniTanto);
    localStorage.setItem = scritturaOriginale;
    window.removeEventListener("pagehide", allUscita);
  };
}
