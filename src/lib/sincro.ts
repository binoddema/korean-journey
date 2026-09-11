import { attivo, sb, sessione } from "./nuvola";

/* ============================================================
   Sincronizzazione con revisioni.

   Ripresa dalla logica di cloud.js: una riga per utente, un
   numero di revisione che cresce a ogni scrittura, e una
   scrittura che avviene solo se il server è ancora alla
   revisione attesa. Se nel frattempo ha scritto un altro
   dispositivo, non si sovrascrive: si mette da parte una copia
   di entrambe le versioni e si chiede.

   Il locale resta la fonte immediata: l'app non aspetta mai
   la rete.
   ============================================================ */

const ARCHIVI = ["korean-journey-v1", "design-v1", "sport-v1"] as const;
const META = "kj.meta";

type Stato = Record<string, unknown>;
type Meta = { uid?: string; rev?: number; sporco?: boolean };

export type Esito = { ok: boolean; messaggio: string };

export type Situazione =
  | "spento"
  | "sincronizzo"
  | "ok"
  | "errore"
  | "conflitto";

export type Conflitto = {
  locale: Stato;
  remoto: { data: Stato; rev: number; device?: string; updated_at?: string };
  motivo: string;
};

let situazione: Situazione = "spento";
let messaggio = "";
export let conflittoAperto: Conflitto | null = null;

const ascoltatori = new Set<() => void>();

export function osserva(f: () => void) {
  ascoltatori.add(f);
  return () => ascoltatori.delete(f);
}

export const leggiSituazione = () => ({ situazione, messaggio });

function segnala(s: Situazione, m = "") {
  situazione = s;
  messaggio = m;
  ascoltatori.forEach((f) => f());
}

/* ---------------- meta locale ---------------- */

function meta(): Meta {
  try {
    return JSON.parse(localStorage.getItem(META) ?? "{}") as Meta;
  } catch {
    return {};
  }
}

function scriviMeta(p: Meta) {
  const m = { ...meta(), ...p };
  localStorage.setItem(META, JSON.stringify(m));
}

function dispositivo(): string {
  const ua = navigator.userAgent || "";
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows";
  return "altro";
}

/* ---------------- stato locale ---------------- */

/** Raccoglie i tre archivi in un unico oggetto. */
function raccogli(): Stato {
  const s: Stato = {};
  for (const nome of ARCHIVI) {
    const grezzo = localStorage.getItem(nome);
    if (!grezzo) continue;
    try {
      s[nome] = JSON.parse(grezzo);
    } catch {
      /* archivio illeggibile: si salta */
    }
  }
  return s;
}

/** Riscrive i tre archivi da un oggetto arrivato dal server. */
function applicaInLocale(dati: Stato) {
  for (const nome of ARCHIVI) {
    if (dati[nome] === undefined) continue;
    scritturaOriginale(nome, JSON.stringify(dati[nome]));
  }
}

/** Quanto "pesa" uno stato: serve a distinguere il vuoto dal pieno. */
function quantita(s: Stato | null): number {
  if (!s) return 0;
  try {
    return JSON.stringify(s).length;
  } catch {
    return 0;
  }
}

const diverso = (a: unknown, b: unknown) => {
  try {
    return JSON.stringify(a) !== JSON.stringify(b);
  } catch {
    return true;
  }
};

/* ---------------- server ---------------- */

async function leggiRemoto() {
  const { data, error } = await sb!
    .from("app_state")
    .select("data,rev,device,updated_at")
    .maybeSingle();
  if (error) throw error;
  return data as
    | { data: Stato; rev: number; device?: string; updated_at?: string }
    | null;
}

async function backup(dati: Stato | null, rev: number, motivo: string) {
  if (!dati) return;
  const s = await sessione();
  if (!s) return;
  // Il backup non deve mai bloccare il resto.
  await sb!
    .from("app_state_backup")
    .insert({ user_id: s.user.id, data: dati, rev, motivo })
    .then(
      () => {},
      () => {}
    );
}

/**
 * Scrive lo stato. Se attesoRev è un numero, la scrittura avviene
 * solo se il server è ancora a quella revisione.
 * Restituisce la nuova revisione, o null se qualcun altro ha scritto prima.
 */
async function scriviRemoto(dati: Stato, attesoRev: number | null): Promise<number | null> {
  const s = await sessione();
  if (!s) return null;

  const nuovoRev = (attesoRev ?? 0) + 1;

  if (attesoRev === null) {
    const { data, error } = await sb!
      .from("app_state")
      .upsert(
        { user_id: s.user.id, data: dati, rev: nuovoRev, device: dispositivo() },
        { onConflict: "user_id" }
      )
      .select("rev")
      .single();
    if (error) throw error;
    return data.rev as number;
  }

  const { data, error } = await sb!
    .from("app_state")
    .update({ data: dati, rev: nuovoRev, device: dispositivo() })
    .eq("user_id", s.user.id)
    .eq("rev", attesoRev)
    .select("rev");

  if (error) throw error;
  if (!data || data.length === 0) return null; // qualcun altro ha scritto
  return data[0].rev as number;
}

/* ---------------- esiti ---------------- */

function adotta(dati: Stato, rev: number, uid: string) {
  // Lo store dell'app ha già letto gli archivi all'avvio: se scriviamo
  // e basta, lui li risovrascrive con quelli vecchi. Quindi, quando i
  // dati arrivati sono diversi da quelli in memoria, ricarichiamo.
  const prima = raccogli();
  applicaInLocale(dati);
  scriviMeta({ uid, rev, sporco: false });
  if (diverso(prima, dati)) {
    setTimeout(() => window.location.reload(), 150);
  }
}

async function spingi(dati: Stato, attesoRev: number | null, uid: string) {
  const rev = await scriviRemoto(dati, attesoRev);
  if (rev === null) {
    // Il server è cambiato sotto di noi: si riprova da capo.
    return sincronizza();
  }
  scriviMeta({ uid, rev, sporco: false });
  segnala("ok", "Salvato.");
}

async function apriConflitto(locale: Stato, remoto: NonNullable<Awaited<ReturnType<typeof leggiRemoto>>>, motivo: string) {
  await backup(remoto.data, remoto.rev, "conflitto-server");
  await backup(locale, 0, "conflitto-locale");
  conflittoAperto = { locale, remoto, motivo };
  segnala("conflitto", motivo);
}

/* ---------------- sincronizzazione ---------------- */

export async function sincronizza(): Promise<void> {
  if (!attivo || !sb) return segnala("spento");

  const s = await sessione();
  if (!s) return segnala("spento", "Non hai effettuato l'accesso.");

  segnala("sincronizzo");

  try {
    const locale = raccogli();
    const remoto = await leggiRemoto();
    const m = meta();

    // 1. Account nuovo: porto su quello che c'è sul dispositivo.
    if (!remoto) {
      await backup(locale, 0, "primo caricamento");
      const rev = await scriviRemoto(locale, null);
      scriviMeta({ uid: s.user.id, rev: rev ?? 1, sporco: false });
      return segnala("ok", "Dati del dispositivo caricati sul server.");
    }

    const stessoUtente = m.uid === s.user.id;
    const revLocale = stessoUtente ? m.rev ?? 0 : null;
    const sporco = Boolean(m.sporco);

    // 2. Primo accesso con questo account su questo dispositivo.
    if (!stessoUtente) {
      if (quantita(locale) < 400 || !diverso(locale, remoto.data)) {
        adotta(remoto.data, remoto.rev, s.user.id);
        return segnala("ok", "Dati scaricati dal server.");
      }
      return apriConflitto(
        locale,
        remoto,
        "primo accesso con questo account su questo dispositivo"
      );
    }

    // 3. Stessa revisione.
    if (revLocale === remoto.rev) {
      if (sporco) return spingi(locale, remoto.rev, s.user.id);

      // Anche senza modifiche segnalate, i contenuti possono essere
      // diversi: un salvataggio interrotto, un'uscita e rientro, un
      // contrassegno perso. Non fidarsi del contrassegno: guardare i dati.
      if (!diverso(locale, remoto.data))
        return segnala("ok", "Era già tutto aggiornato.");

      const qLocale = quantita(locale);
      const qRemoto = quantita(remoto.data);

      if (qLocale > qRemoto) {
        await backup(remoto.data, remoto.rev, "sorpasso-locale");
        return spingi(locale, remoto.rev, s.user.id);
      }
      if (qRemoto > qLocale) {
        adotta(remoto.data, remoto.rev, s.user.id);
        return segnala("ok", "Aggiornato dal server.");
      }
      return apriConflitto(locale, remoto, "due versioni della stessa misura");
    }

    // 4. Il dispositivo è avanti: una scrittura non era andata a buon fine.
    if ((revLocale ?? 0) > remoto.rev) {
      return spingi(locale, remoto.rev, s.user.id);
    }

    // 5. Il server è avanti e qui non ci sono modifiche.
    if (!sporco) {
      // Prima di adottarlo: se in locale c'è molto più materiale,
      // il contrassegno si è perso e i dati buoni sono questi.
      if (quantita(locale) > quantita(remoto.data) && diverso(locale, remoto.data)) {
        await backup(remoto.data, remoto.rev, "sorpasso-locale");
        return spingi(locale, remoto.rev, s.user.id);
      }
      adotta(remoto.data, remoto.rev, s.user.id);
      return segnala("ok", "Aggiornato da un altro dispositivo.");
    }

    // 6. Server avanti E modifiche locali non inviate: conflitto vero.
    if (!diverso(locale, remoto.data)) {
      adotta(remoto.data, remoto.rev, s.user.id);
      return segnala("ok", "Era già tutto aggiornato.");
    }
    return apriConflitto(locale, remoto, "modifiche su due dispositivi");
  } catch (e) {
    segnala("errore", e instanceof Error ? e.message : "Errore di rete.");
  }
}

/* ---------------- risoluzione del conflitto ---------------- */

export async function risolviConflitto(scelta: "questo" | "server") {
  const c = conflittoAperto;
  if (!c) return;
  const s = await sessione();
  if (!s) return;

  conflittoAperto = null;

  if (scelta === "server") {
    adotta(c.remoto.data, c.remoto.rev, s.user.id);
    return segnala("ok", "Adottata la versione del server.");
  }

  scriviMeta({ uid: s.user.id, rev: c.remoto.rev, sporco: true });
  await spingi(c.locale, c.remoto.rev, s.user.id);
}

/* ---------------- salvataggio automatico ---------------- */

let attesa: ReturnType<typeof setTimeout> | null = null;

export function salvaOra() {
  return sincronizza();
}

function programmaSalvataggio() {
  scriviMeta({ sporco: true });
  if (attesa) clearTimeout(attesa);
  attesa = setTimeout(() => {
    attesa = null;
    sincronizza();
  }, 2500);
}

/* La scrittura originale, usata quando applichiamo dati arrivati dal
   server: non deve far ripartire un salvataggio. */
let scritturaOriginale: (chiave: string, valore: string) => void = (k, v) =>
  localStorage.setItem(k, v);

export function avviaSincro() {
  if (!attivo) return () => {};

  scritturaOriginale = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (chiave: string, valore: string) => {
    scritturaOriginale(chiave, valore);
    if ((ARCHIVI as readonly string[]).includes(chiave)) programmaSalvataggio();
  };

  const ogniTanto = setInterval(sincronizza, 2 * 60 * 1000);

  const allUscita = () => {
    if (meta().sporco) sincronizza();
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

/* ------------------------------------------------------------------
   Ripristino da file di backup.

   Non passa dallo store dell'app: scrive direttamente negli archivi,
   spedisce al server forzando la scrittura, e solo alla fine ricarica.
   È la via di sicurezza quando qualcosa si è disallineato.
   ------------------------------------------------------------------ */

export async function ripristinaDaFile(testo: string): Promise<Esito> {
  let contenuto: unknown;
  try {
    contenuto = JSON.parse(testo);
  } catch {
    return { ok: false, messaggio: "Il file non è leggibile." };
  }
  if (!contenuto || typeof contenuto !== "object")
    return { ok: false, messaggio: "Il file non contiene dati validi." };

  const c = contenuto as Record<string, unknown>;

  // Due formati possibili: il backup completo dell'app (i tre archivi
  // insieme) oppure il solo archivio del coreano, com'è l'esportazione
  // delle Impostazioni.
  const stato: Stato = {};
  const haArchivi = ARCHIVI.some((n) => c[n] !== undefined);

  if (haArchivi) {
    for (const nome of ARCHIVI) if (c[nome] !== undefined) stato[nome] = c[nome];
  } else if ("xp" in c || "srs" in c || "log" in c) {
    stato["korean-journey-v1"] = contenuto;
    // gli altri due restano quelli già presenti sul dispositivo
    for (const nome of ["design-v1", "sport-v1"] as const) {
      const g = localStorage.getItem(nome);
      if (g) {
        try {
          stato[nome] = JSON.parse(g);
        } catch {
          /* si salta */
        }
      }
    }
  } else {
    return { ok: false, messaggio: "Non riconosco il formato del file." };
  }

  const xpDi = (s: Stato | null) =>
    Number(
      (s?.["korean-journey-v1"] as Record<string, unknown> | undefined)?.xp ?? 0
    );
  const xp = xpDi(stato);

  // Senza collegamento non si va avanti: scrivere solo in locale è
  // quello che finora faceva sparire i dati al riavvio, perché poi il
  // server rimandava indietro la versione vecchia.
  if (!attivo || !sb) {
    return {
      ok: false,
      messaggio:
        "Il collegamento al server non è configurato su questo sito. " +
        "Non procedo: in locale il ripristino verrebbe cancellato al riavvio.",
    };
  }

  const s = await sessione();
  if (!s) {
    return {
      ok: false,
      messaggio:
        "Non risulti collegato. Fai l'accesso con la tua email, poi ripeti " +
        "il ripristino.",
    };
  }

  try {
    const remoto = await leggiRemoto();
    if (remoto) await backup(remoto.data, remoto.rev, "prima-del-ripristino");

    const nuovoRev = (remoto?.rev ?? 0) + 1;
    const { error } = await sb
      .from("app_state")
      .upsert(
        {
          user_id: s.user.id,
          data: stato,
          rev: nuovoRev,
          device: dispositivo(),
        },
        { onConflict: "user_id" }
      );
    if (error)
      return { ok: false, messaggio: "Il server ha rifiutato: " + error.message };

    // Controprova: si rilegge davvero quello che c'è sul server, invece
    // di fidarsi del fatto che la scrittura non abbia dato errore.
    const verifica = await leggiRemoto();
    const xpServer = xpDi(verifica?.data ?? null);

    if (xpServer !== xp) {
      return {
        ok: false,
        messaggio:
          `Scrittura accettata ma sul server risultano ${xpServer} XP invece ` +
          `di ${xp}. Non applico niente in locale: i dati sul dispositivo ` +
          `restano come sono.`,
      };
    }

    applicaInLocale(stato);
    scriviMeta({ uid: s.user.id, rev: verifica?.rev ?? nuovoRev, sporco: false });
    conflittoAperto = null;
    segnala("ok", "Ripristino completato.");

    return {
      ok: true,
      messaggio:
        `Fatto: ${xp} XP scritti sul dispositivo e verificati sul server ` +
        `(revisione ${verifica?.rev ?? nuovoRev}). Ora ricarica l'app.`,
    };
  } catch (e) {
    return {
      ok: false,
      messaggio: e instanceof Error ? e.message : "Errore di rete.",
    };
  }
}
