/* ==========================================================================
   Il quadro della giornata: raccoglie in un punto solo quello che sta
   succedendo in tutte le sezioni. Lo usano Oggi, il Coach e i Trofei, così
   dicono tutti la stessa cosa.
   ========================================================================== */
import { ARCHIVIO, leggiArchivio, oggiISO } from "./archivio";
import type { Derived } from "./progress";
import type { AppState } from "../types";

interface SessioneDesign {
  data: string;
  minuti: number;
  area: string;
}
interface RegistroSport {
  data: string;
  esercizioId: string;
}

export interface Quadro {
  coreano: { daRipassare: number; xpOggi: number; fatto: boolean };
  design: { minutiOggi: number; minutiSettimana: number; fatto: boolean };
  sport: { giorniSettimana: number; fatto: boolean };
  risparmio: { totale: number; obiettivo: number; pct: number };
  diario: { scritto: boolean; pagine: number };
  portfolio: { progetti: number };
  universita: { prossima?: { titolo: string; data: string } };
  calendario: { oggi: { titolo: string; dalle?: string; categoria: string; fatto?: boolean }[] };
}

const seiGiorniFa = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
};

function leggiLista<T>(nome: string): T[] {
  try {
    const g = localStorage.getItem(nome);
    const v = g ? JSON.parse(g) : [];
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

export function quadro(state: AppState, d: Derived): Quadro {
  const oggi = oggiISO();
  const daSettimana = seiGiorniFa();

  const design = leggiLista<SessioneDesign>("design-v1");
  const minutiOggi = design
    .filter((s) => s.data === oggi)
    .reduce((t, s) => t + (s.minuti || 0), 0);
  const minutiSettimana = design
    .filter((s) => s.data >= daSettimana)
    .reduce((t, s) => t + (s.minuti || 0), 0);

  const sport = leggiArchivio<{ storico: RegistroSport[] }>("sport-v1", { storico: [] });
  const giorniSport = new Set(
    (sport.storico || []).filter((r) => r.data >= daSettimana).map((r) => r.data)
  );

  const risp = leggiArchivio<{
    obiettivo: number;
    movimenti: { tipo: string; importo: number }[];
  }>(ARCHIVIO.risparmio, { obiettivo: 15000, movimenti: [] });
  const totale = (risp.movimenti || []).reduce(
    (t, m) => t + (m.tipo === "risparmio" ? m.importo : -m.importo),
    0
  );

  const diario = leggiArchivio<{ voci: { data: string }[] }>(ARCHIVIO.diario, { voci: [] });
  const portfolio = leggiArchivio<{ progetti: unknown[] }>(ARCHIVIO.portfolio, { progetti: [] });

  const uni = leggiArchivio<{ scadenze: { titolo: string; data: string; fatto: boolean }[] }>(
    ARCHIVIO.universita,
    { scadenze: [] }
  );
  const prossima = (uni.scadenze || [])
    .filter((s) => !s.fatto && s.data >= oggi)
    .sort((a, b) => a.data.localeCompare(b.data))[0];

  const cal = leggiArchivio<{
    eventi: {
      titolo: string;
      data: string;
      dalle?: string;
      categoria: string;
      fatto?: boolean;
      ognuna?: boolean;
    }[];
  }>(ARCHIVIO.calendario, { eventi: [] });
  const g = new Date(oggi).getDay();
  const eventiOggi = (cal.eventi || [])
    .filter(
      (e) => e.data === oggi || (e.ognuna && e.data <= oggi && new Date(e.data).getDay() === g)
    )
    .sort((a, b) => (a.dalle || "").localeCompare(b.dalle || ""));

  const xpOggi = state.log?.[oggi]?.xp ?? 0;

  return {
    coreano: { daRipassare: d.dueWords, xpOggi, fatto: xpOggi > 0 },
    design: { minutiOggi, minutiSettimana, fatto: minutiOggi > 0 },
    sport: { giorniSettimana: giorniSport.size, fatto: giorniSport.has(oggi) },
    risparmio: {
      totale,
      obiettivo: risp.obiettivo || 0,
      pct: risp.obiettivo ? (totale / risp.obiettivo) * 100 : 0,
    },
    diario: {
      scritto: (diario.voci || []).some((v) => v.data === oggi),
      pagine: (diario.voci || []).length,
    },
    portfolio: { progetti: (portfolio.progetti || []).length },
    universita: { prossima },
    calendario: { oggi: eventiOggi },
  };
}

export interface Missione {
  id: string;
  titolo: string;
  dettaglio: string;
  icona: string;
  tinta: string;
  pagina: string;
  fatto: boolean;
  peso: number;
}

/** Le attività della giornata, già in ordine di priorità. */
export function missioni(q: Quadro): Missione[] {
  const lista: Missione[] = [
    {
      id: "ripasso",
      titolo: q.coreano.daRipassare > 0 ? "Ripassa le parole in scadenza" : "Sessione di coreano",
      dettaglio:
        q.coreano.daRipassare > 0
          ? `${q.coreano.daRipassare} parole ti aspettano`
          : "Ripasso in pari: puoi aggiungere parole nuove",
      icona: "🇰🇷",
      tinta: "coreano",
      pagina: q.coreano.daRipassare > 0 ? "review" : "coreano",
      fatto: q.coreano.fatto && q.coreano.daRipassare === 0,
      peso: q.coreano.daRipassare > 0 ? 100 : 60,
    },
    {
      id: "design",
      titolo: "Esercizio di design",
      dettaglio: q.design.fatto
        ? `${q.design.minutiOggi} minuti fatti oggi`
        : "L'esercizio di oggi ti aspetta",
      icona: "🎨",
      tinta: "design",
      pagina: "design",
      fatto: q.design.fatto,
      peso: 70,
    },
    {
      id: "sport",
      titolo: "Allenamento",
      dettaglio: q.sport.fatto
        ? "Fatto oggi"
        : `${q.sport.giorniSettimana} allenamenti negli ultimi 7 giorni`,
      icona: "🏋️",
      tinta: "sport",
      pagina: "sport",
      fatto: q.sport.fatto,
      peso: 40,
    },
    {
      id: "diario",
      titolo: "Scrivi il diario",
      dettaglio: q.diario.scritto ? "Pagina di oggi scritta" : "Due righe su com'è andata",
      icona: "📔",
      tinta: "diario",
      pagina: "diario",
      fatto: q.diario.scritto,
      peso: 20,
    },
  ];
  return lista.sort((a, b) => Number(a.fatto) - Number(b.fatto) || b.peso - a.peso);
}
