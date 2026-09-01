/* Tipi condivisi di Korean Journey */

export type Register = "formale" | "educato" | "informale" | "colloquiale";

/** Un vocabolo (o una lettera dell'Hangul) */
export interface Vocab {
  /** assegnato automaticamente: `${lessonId}#${index}` */
  id: string;
  ko: string;
  ro: string;
  it: string;
  emoji?: string;
  /** memory hook: come ricordarla */
  hook: string;
  exKo: string;
  exIt: string;
  reg?: Register;
  /** true per le lettere dell'Hangul (niente audio "parola") */
  letter?: boolean;
}

/** Vocabolo come scritto nei file dati (senza id) */
export type VocabSeed = Omit<Vocab, "id">;

export interface GrammarExample {
  ko: string;
  ro: string;
  it: string;
}

export interface Grammar {
  title: string;
  when: string;
  how: string;
  examples: GrammarExample[];
  /** errori tipici di chi parla italiano */
  mistakes: string[];
  exceptions?: string;
}

/** Frase utile della lezione */
export interface Phrase {
  ko: string;
  ro: string;
  it: string;
  reg?: Register;
}

/* ---------- Esercizi ---------- */

export interface ExMultiple {
  k: "mc";
  q: string;
  o: string[];
  a: number;
  why: string;
  /** testo coreano da pronunciare accanto alla domanda */
  say?: string;
  label?: string;
}
export interface ExFill {
  k: "fill";
  q: string;
  o: string[];
  a: number;
  why: string;
  say?: string;
}
export interface ExBuild {
  k: "build";
  q: string;
  w: string[];
  a: string;
  why: string;
}
export interface ExTranslate {
  k: "trans";
  q: string;
  a: string;
  alt?: string[];
  why: string;
}
export interface ExListen {
  k: "listen";
  say: string;
  o: string[];
  a: number;
  why: string;
}
export interface ExMatch {
  k: "match";
  pairs: { ko: string; it: string }[];
  why: string;
}

export type Exercise =
  | ExMultiple
  | ExFill
  | ExBuild
  | ExTranslate
  | ExListen
  | ExMatch;

/** esercizio con id runtime e vocabolo collegato (per lo spaced repetition) */
export interface RuntimeExercise {
  id: string;
  vocabId?: string;
  ex: Exercise;
}

/* ---------- Lezioni e topic ---------- */

export interface LessonSeed {
  title: string;
  emoji: string;
  intro: string;
  vocab: VocabSeed[];
  grammar: Grammar[];
  phrases: Phrase[];
  /** esercizi scritti a mano, specifici della lezione */
  ex: Exercise[];
}

export interface Lesson extends Omit<LessonSeed, "vocab"> {
  id: string;
  topicId: number;
  /** numero progressivo globale: "Giorno 7" */
  day: number;
  vocab: Vocab[];
}

export interface Topic {
  id: number;
  title: string;
  short: string;
  desc: string;
  emoji: string;
  color: string;
  lessons: Lesson[];
}

/* ---------- Stato utente ---------- */

export type SrsStatus = "new" | "learning" | "review" | "learned";
export type Difficulty = "hard" | "medium" | "easy";

export interface SrsCard {
  status: SrsStatus;
  /** giorni di intervallo corrente */
  interval: number;
  /** data (YYYY-MM-DD) della prossima revisione */
  due: string;
  right: number;
  wrong: number;
  last: Difficulty | null;
}

export interface Settings {
  lang: "it";
  difficulty: "principiante" | "intermedio" | "avanzato";
  newPerDay: number;
  maxReviews: number;
  autoAudio: boolean;
  showRomanization: boolean;
  showHooks: boolean;
  slowAudio: boolean;
  detailedGrammar: boolean;
  dark: boolean;
  accent: string;
  reminder: boolean;
  reminderTime: string;
  reminderDays: number[];
}

export interface DayLog {
  date: string;
  xp: number;
  exercises: number;
  newWords: number;
  reviews: number;
  lessons: number;
  minutes: number;
}

export interface AppState {
  name: string;
  xp: number;
  streak: number;
  bestStreak: number;
  lastStudyDate: string | null;
  completedLessons: string[];
  srs: Record<string, SrsCard>;
  achievements: string[];
  log: Record<string, DayLog>;
  totals: { correct: number; wrong: number; exercises: number; minutes: number };
  settings: Settings;
}
