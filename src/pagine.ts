/* Elenco delle sezioni dell'app: usato dalla griglia di Oggi, dal menu e
   dalla barra in basso. Sta in un file suo per non creare giri di import. */

export type Page =
  | "home"
  | "diario"
  | "coreano"
  | "design"
  | "risparmio"
  | "sport"
  | "portfolio"
  | "calendario"
  | "universita"
  | "coach"
  | "trofei"
  | "settings"
  | "courses"
  | "vocab"
  | "review"
  | "exercises"
  | "progress"
  | "goals";

export interface Sezione {
  id: Page;
  label: string;
  icona: string;
  tinta: string;
  sottotitolo: string;
}

export const SEZIONI: Sezione[] = [
  { id: "diario", label: "Diario", icona: "📔", tinta: "diario", sottotitolo: "Racconta la tua giornata." },
  { id: "coreano", label: "Coreano", icona: "🇰🇷", tinta: "coreano", sottotitolo: "Impara, un giorno alla volta." },
  { id: "design", label: "Design", icona: "🎨", tinta: "design", sottotitolo: "Crea, esplora, migliora." },
  { id: "risparmio", label: "Risparmio", icona: "🐷", tinta: "risparmio", sottotitolo: "Il tuo futuro inizia oggi." },
  { id: "sport", label: "Sport", icona: "🏋️", tinta: "sport", sottotitolo: "Più movimento, più energia." },
  { id: "portfolio", label: "Portfolio", icona: "💼", tinta: "portfolio", sottotitolo: "Mostra il tuo talento." },
  { id: "calendario", label: "Calendario", icona: "📅", tinta: "calendario", sottotitolo: "Organizza il tuo tempo." },
  { id: "universita", label: "Università", icona: "🎓", tinta: "universita", sottotitolo: "Il percorso, il futuro." },
  { id: "coach", label: "Coach", icona: "🧭", tinta: "coach", sottotitolo: "Cosa conta adesso." },
  { id: "trofei", label: "Trofei", icona: "🏆", tinta: "trofei", sottotitolo: "I tuoi traguardi." },
  { id: "settings", label: "Impostazioni", icona: "⚙️", tinta: "oggi", sottotitolo: "Personalizza l'app." },
];

export const sezione = (id: Page) => SEZIONI.find((s) => s.id === id);
