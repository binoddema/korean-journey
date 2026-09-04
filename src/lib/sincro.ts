import { attivo, scarica, carica, quandoAggiornato } from "./nuvola";

/* ============================================================
   Sincronizzazione in blocco.
   All'apertura: se il server ha una versione più recente di
   quella locale, la scarica. Alla chiusura e ogni due minuti:
   manda su quella locale.
   Il resto dell'app continua a leggere e scrivere in
   localStorage, quindi funziona anche senza rete.
   ============================================================ */

const ARCHIVI = ["korean-journey-v1", "design-v1", "sport-v1"];

/** Data dell'ultima modifica locale, per archivio. */
function segnaLocale(nome: string) {
  localStorage.setItem(`ts:${nome}`, String(Date.now()));
}

function tsLocale(nome: string): number {
  return Number(localStorage.getItem(`ts:${nome}`) ?? 0);
}

/** Chiamata all'avvio, dopo l'accesso. */
export async function scaricaTutto() {
  if (!attivo) return;
  for (const nome of ARCHIVI) {
    const tsServer = await quandoAggiornato(nome);
    if (tsServer > tsLocale(nome)) {
      const dati = await scarica<unknown>(nome);
      if (dati) {
        localStorage.setItem(nome, JSON.stringify(dati));
        localStorage.setItem(`ts:${nome}`, String(tsServer));
      }
    }
  }
}

/** Manda su gli archivi cambiati. */
export async function caricaTutto() {
  if (!attivo) return;
  for (const nome of ARCHIVI) {
    const grezzo = localStorage.getItem(nome);
    if (!grezzo) continue;
    try {
      await carica(nome, JSON.parse(grezzo));
    } catch {
      /* archivio illeggibile: si salta */
    }
  }
}

/** Avvia la sincronizzazione periodica e alla chiusura. */
export function avviaSincro() {
  if (!attivo) return () => {};

  const ogniTanto = setInterval(caricaTutto, 2 * 60 * 1000);

  const allUscita = () => {
    for (const n of ARCHIVI) segnaLocale(n);
    caricaTutto();
  };
  window.addEventListener("pagehide", allUscita);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") allUscita();
  });

  return () => {
    clearInterval(ogniTanto);
    window.removeEventListener("pagehide", allUscita);
  };
}
