import { attivo, sb, sessione } from "./nuvola";

/* ============================================================
   Sincronizzazione in blocco.
   Ogni archivio è una riga sulla tabella "archivi".
   In locale continua a scrivere localStorage, quindi l'app
   funziona anche senza rete.
   ============================================================ */

const ARCHIVI = ["korean-journey-v1", "design-v1", "sport-v1"];

export type Esito = { ok: boolean; messaggio: string };

const tsLocale = (nome: string) => Number(localStorage.getItem(`ts:${nome}`) ?? 0);
const segnaTs = (nome: string, ts: number) =>
  localStorage.setItem(`ts:${nome}`, String(ts));

/* ---------------- salita ---------------- */

export async function caricaTutto(): Promise<Esito> {
  if (!attivo || !sb) return { ok: false, messaggio: "Sincronizzazione non attiva." };

  const s = await sessione();
  if (!s) return { ok: false, messaggio: "Non hai effettuato l'accesso." };

  let mandati = 0;

  for (const nome of ARCHIVI) {
    const grezzo = localStorage.getItem(nome);
    if (!grezzo) continue;

    let contenuto: unknown;
    try {
      contenuto = JSON.parse(grezzo);
    } catch {
      continue;
    }

    const adesso = new Date().toISOString();
    const { error } = await sb.from("archivi").upsert(
      { utente: s.user.id, nome, contenuto, aggiornato: adesso },
      { onConflict: "utente,nome" }
    );

    if (error) return { ok: false, messaggio: `Errore su ${nome}: ${error.message}` };

    segnaTs(nome, Date.parse(adesso));
    mandati++;
  }

  return {
    ok: true,
    messaggio: mandati
      ? `Salvati ${mandati} archivi sul server.`
      : "Non c'era niente da salvare.",
  };
}

/* ---------------- discesa ---------------- */

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

  for (const riga of data) {
    if (!ARCHIVI.includes(riga.nome)) continue;
    const tsServer = Date.parse(riga.aggiornato);
    if (tsServer > tsLocale(riga.nome)) {
      localStorage.setItem(riga.nome, JSON.stringify(riga.contenuto));
      segnaTs(riga.nome, tsServer);
      presi++;
    }
  }

  return {
    ok: true,
    messaggio: presi
      ? `Scaricati ${presi} archivi. Ricarica la pagina per vederli.`
      : "Era già tutto aggiornato.",
  };
}

/* ---------------- avvio automatico ---------------- */

export function avviaSincro() {
  if (!attivo) return () => {};

  // Prima salita subito dopo l'accesso: così la tabella non resta vuota
  // anche se l'app viene chiusa di colpo.
  caricaTutto();

  const ogniTanto = setInterval(caricaTutto, 30 * 1000);

  const allUscita = () => {
    caricaTutto();
  };

  window.addEventListener("pagehide", allUscita);
  window.addEventListener("blur", allUscita);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") allUscita();
  });

  return () => {
    clearInterval(ogniTanto);
    window.removeEventListener("pagehide", allUscita);
    window.removeEventListener("blur", allUscita);
  };
}
