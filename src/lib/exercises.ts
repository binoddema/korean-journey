import type { Difficulty as _D, Exercise, Lesson, RuntimeExercise, Settings, Vocab } from "../types";
import { ALL_VOCAB } from "../data";

export type Level = Settings["difficulty"];

/** Le forme come «-아/어 보다» non si dettano né si ascoltano da sole. */
const speakableWord = (v: Vocab) => !v.letter && !v.ko.startsWith("-");

export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickDistractors = (
  pool: Vocab[],
  exclude: Vocab,
  n: number,
  key: "ko" | "it"
): Vocab[] => {
  const seen = new Set([exclude[key]]);
  const out: Vocab[] = [];
  for (const v of shuffle(pool)) {
    if (v.id === exclude.id || seen.has(v[key])) continue;
    seen.add(v[key]);
    out.push(v);
    if (out.length === n) break;
  }
  return out;
};

const mcFrom = (
  v: Vocab,
  pool: Vocab[],
  dir: "ko-it" | "it-ko"
): Exercise => {
  const key = dir === "ko-it" ? "it" : "ko";
  const others = pickDistractors(pool, v, 3, key);
  const options = shuffle([v, ...others]);
  const answer = options.findIndex((o) => o.id === v.id);
  return dir === "ko-it"
    ? {
        k: "mc",
        label: v.letter ? "Riconosci la lettera" : "Riconosci la parola",
        q: `Cosa significa ${v.ko}?`,
        say: v.letter ? undefined : v.ko,
        o: options.map((o) => o.it),
        a: answer,
        why: `${v.ko} (${v.ro}) = ${v.it}.${v.hook ? " " + v.hook : ""}`,
      }
    : {
        k: "mc",
        label: "Italiano → Coreano",
        q: `Come si dice «${v.it}»?`,
        o: options.map((o) => o.ko),
        a: answer,
        why: `${v.it} = ${v.ko} (${v.ro}).`,
      };
};

const listenFrom = (v: Vocab, pool: Vocab[]): Exercise => {
  const others = pickDistractors(pool.filter(speakableWord), v, 3, "ko");
  const options = shuffle([v, ...others]);
  return {
    k: "listen",
    say: v.ko,
    o: options.map((o) => o.ko),
    a: options.findIndex((o) => o.id === v.id),
    why: `Hai sentito ${v.ko} (${v.ro}) = ${v.it}.`,
  };
};

const writeFrom = (v: Vocab): Exercise => ({
  k: "trans",
  q: v.it,
  a: v.ko,
  why: `${v.it} = ${v.ko} (${v.ro}).${v.hook ? " " + v.hook : ""}`,
});

const dictateFrom = (v: Vocab): Exercise => ({
  k: "dictate",
  say: v.ko,
  a: v.ko,
  why: `Hai sentito ${v.ko} (${v.ro}) = ${v.it}.`,
});

const matchFrom = (list: Vocab[]): Exercise => ({
  k: "match",
  pairs: list.map((v) => ({ ko: v.ko, it: v.it })),
  why: "Abbinamento completato: rivedi le coppie che ti hanno rallentato.",
});

/** Sceglie il tipo di esercizio per un vocabolo in base al livello impostato. */
const vocabExercise = (v: Vocab, pool: Vocab[], level: Level, i: number): Exercise => {
  if (level === "principiante") {
    if (speakableWord(v) && i % 5 === 4) return listenFrom(v, pool);
    return mcFrom(v, pool, i % 2 === 0 ? "ko-it" : "it-ko");
  }
  if (level === "intermedio") {
    const mod = i % 4;
    if (mod === 0) return mcFrom(v, pool, "ko-it");
    if (mod === 1) return writeFrom(v);
    if (mod === 2 && speakableWord(v)) return listenFrom(v, pool);
    if (mod === 3 && speakableWord(v)) return dictateFrom(v);
    return mcFrom(v, pool, "it-ko");
  }
  // avanzato: si scrive quasi sempre
  if (speakableWord(v) && i % 3 === 2) return dictateFrom(v);
  if (i % 3 === 1) return mcFrom(v, pool, "ko-it");
  return writeFrom(v);
};

let counter = 0;
const wrap = (ex: Exercise, vocabId?: string): RuntimeExercise => {
  counter += 1;
  return { id: `ex${counter}`, ex, vocabId };
};

/** Esercizi della lezione: generati dai vocaboli + quelli scritti a mano + ripasso. */
export const buildLessonExercises = (
  lesson: Lesson,
  reviewVocab: Vocab[],
  level: Level = "principiante"
): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  const speakable = lesson.vocab.filter(speakableWord);
  const out: RuntimeExercise[] = [];

  // ogni vocabolo della lezione viene esercitato almeno una volta
  shuffle(lesson.vocab).forEach((v, i) => out.push(wrap(vocabExercise(v, pool, level, i), v.id)));

  if (speakable.length >= 4) {
    out.push(wrap(matchFrom(shuffle(speakable).slice(0, 4))));
  }

  lesson.ex.forEach((e) => out.push(wrap(e)));

  shuffle(reviewVocab)
    .slice(0, 6)
    .forEach((v, i) => out.push(wrap(vocabExercise(v, pool, level, i + 1), v.id)));

  return out;
};

/** Test finale: 10 domande sui vocaboli e sulla grammatica della lezione. */
export const buildLessonTest = (
  lesson: Lesson,
  level: Level = "principiante"
): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  const out: RuntimeExercise[] = [];
  shuffle(lesson.vocab)
    .slice(0, 6)
    .forEach((v, i) => out.push(wrap(vocabExercise(v, pool, level, i), v.id)));
  shuffle(lesson.ex)
    .slice(0, 4)
    .forEach((e) => out.push(wrap(e)));
  return out;
};

/** Sessione di ripasso su una lista di vocaboli da rivedere. */
export const buildReviewExercises = (
  list: Vocab[],
  level: Level = "principiante"
): RuntimeExercise[] =>
  list.map((v, i) => wrap(vocabExercise(v, ALL_VOCAB, level, i), v.id));

/** Sessione su un gruppo di vocaboli scelto (unità della banca, ricerca…). */
export const buildUnitDrill = (
  list: Vocab[],
  level: Level = "principiante"
): RuntimeExercise[] => {
  const out = list.map((v, i) => wrap(vocabExercise(v, ALL_VOCAB, level, i), v.id));
  const speakable = shuffle(list.filter(speakableWord));
  for (let i = 0; i + 4 <= speakable.length && i < 8; i += 4) {
    out.push(wrap(matchFrom(speakable.slice(i, i + 4))));
  }
  return shuffle(out);
};

/** Allenamento libero su un tipo di esercizio. */
export const buildPractice = (
  list: Vocab[],
  kind: "ko-it" | "it-ko" | "listen" | "match" | "written" | "write" | "dictate" | "misto",
  writtenPool: Exercise[],
  level: Level = "principiante",
  size = 10
): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  if (kind === "written") {
    return shuffle(writtenPool).slice(0, size).map((e) => wrap(e));
  }
  if (kind === "misto") {
    return shuffle(list)
      .slice(0, size)
      .map((v, i) => wrap(vocabExercise(v, pool, level, i), v.id));
  }
  if (kind === "match") {
    const speakable = shuffle(list.filter(speakableWord));
    const groups: RuntimeExercise[] = [];
    for (let i = 0; i + 4 <= speakable.length && groups.length < 5; i += 4) {
      groups.push(wrap(matchFrom(speakable.slice(i, i + 4))));
    }
    return groups;
  }
  const picked = shuffle(list).slice(0, size);
  return picked.map((v) => {
    if (kind === "listen" && speakableWord(v)) return wrap(listenFrom(v, pool), v.id);
    if (kind === "dictate" && speakableWord(v)) return wrap(dictateFrom(v), v.id);
    if (kind === "write") return wrap(writeFrom(v), v.id);
    return wrap(mcFrom(v, pool, kind === "it-ko" ? "it-ko" : "ko-it"), v.id);
  });
};

export const exerciseTypeLabel: Record<Exercise["k"], string> = {
  mc: "Scelta multipla",
  fill: "Completa la frase",
  build: "Costruisci la frase",
  trans: "Traduzione",
  listen: "Ascolto",
  match: "Abbinamento",
  dictate: "Dettato",
};

/** Normalizza una risposta scritta per il confronto. */
export const normalize = (s: string): string =>
  s
    .trim()
    .toLowerCase()
    .replace(/[.!?,·"'’]/g, "")
    .replace(/\s+/g, " ");
