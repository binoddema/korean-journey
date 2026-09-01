import type { Exercise, Lesson, RuntimeExercise, Vocab } from "../types";
import { ALL_VOCAB } from "../data";

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
        why: `${v.ko} (${v.ro}) = ${v.it}. ${v.hook}`,
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
  const others = pickDistractors(pool, v, 3, "ko");
  const options = shuffle([v, ...others]);
  return {
    k: "listen",
    say: v.ko,
    o: options.map((o) => o.ko),
    a: options.findIndex((o) => o.id === v.id),
    why: `Hai sentito ${v.ko} (${v.ro}) = ${v.it}.`,
  };
};

const matchFrom = (list: Vocab[]): Exercise => ({
  k: "match",
  pairs: list.map((v) => ({ ko: v.ko, it: v.it })),
  why: "Abbinamento completato: rivedi le coppie che ti hanno rallentato.",
});

let counter = 0;
const wrap = (ex: Exercise, vocabId?: string): RuntimeExercise => {
  counter += 1;
  return { id: `ex${counter}`, ex, vocabId };
};

/** Esercizi della lezione: generati dai vocaboli + quelli scritti a mano + ripasso. */
export const buildLessonExercises = (
  lesson: Lesson,
  reviewVocab: Vocab[]
): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  const vocab = lesson.vocab;
  const speakable = vocab.filter((v) => !v.letter);
  const out: RuntimeExercise[] = [];

  shuffle(vocab)
    .slice(0, 3)
    .forEach((v) => out.push(wrap(mcFrom(v, pool, "ko-it"), v.id)));

  shuffle(vocab)
    .slice(0, 2)
    .forEach((v) => out.push(wrap(mcFrom(v, pool, "it-ko"), v.id)));

  if (speakable.length > 0) {
    const v = shuffle(speakable)[0];
    out.push(wrap(listenFrom(v, pool), v.id));
  }

  if (speakable.length >= 4) {
    out.push(wrap(matchFrom(shuffle(speakable).slice(0, 4))));
  }

  lesson.ex.forEach((e) => out.push(wrap(e)));

  shuffle(reviewVocab)
    .slice(0, 4)
    .forEach((v) =>
      out.push(
        wrap(mcFrom(v, pool, Math.random() > 0.5 ? "ko-it" : "it-ko"), v.id)
      )
    );

  return out;
};

/** Test finale: 10 domande sui vocaboli e sulla grammatica della lezione. */
export const buildLessonTest = (lesson: Lesson): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  const out: RuntimeExercise[] = [];
  shuffle(lesson.vocab)
    .slice(0, 6)
    .forEach((v, i) =>
      out.push(wrap(mcFrom(v, pool, i % 2 === 0 ? "ko-it" : "it-ko"), v.id))
    );
  shuffle(lesson.ex)
    .slice(0, 4)
    .forEach((e) => out.push(wrap(e)));
  return out;
};

/** Sessione di ripasso su una lista di vocaboli da rivedere. */
export const buildReviewExercises = (list: Vocab[]): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  const out: RuntimeExercise[] = [];
  list.forEach((v, i) => {
    if (!v.letter && i % 4 === 3) out.push(wrap(listenFrom(v, pool), v.id));
    else out.push(wrap(mcFrom(v, pool, i % 2 === 0 ? "ko-it" : "it-ko"), v.id));
  });
  return out;
};

/** Allenamento libero su un tipo di esercizio. */
export const buildPractice = (
  list: Vocab[],
  kind: "ko-it" | "it-ko" | "listen" | "match" | "written",
  writtenPool: Exercise[]
): RuntimeExercise[] => {
  const pool = ALL_VOCAB;
  if (kind === "written") {
    return shuffle(writtenPool).slice(0, 10).map((e) => wrap(e));
  }
  if (kind === "match") {
    const speakable = shuffle(list.filter((v) => !v.letter));
    const groups: RuntimeExercise[] = [];
    for (let i = 0; i + 4 <= speakable.length && groups.length < 5; i += 4) {
      groups.push(wrap(matchFrom(speakable.slice(i, i + 4))));
    }
    return groups;
  }
  const picked = shuffle(list).slice(0, 10);
  return picked.map((v) =>
    kind === "listen" && !v.letter
      ? wrap(listenFrom(v, pool), v.id)
      : wrap(mcFrom(v, pool, kind === "it-ko" ? "it-ko" : "ko-it"), v.id)
  );
};

export const exerciseTypeLabel: Record<Exercise["k"], string> = {
  mc: "Scelta multipla",
  fill: "Completa la frase",
  build: "Costruisci la frase",
  trans: "Traduzione",
  listen: "Ascolto",
  match: "Abbinamento",
};

/** Normalizza una risposta scritta per il confronto. */
export const normalize = (s: string): string =>
  s
    .trim()
    .toLowerCase()
    .replace(/[.!?,·"'’]/g, "")
    .replace(/\s+/g, " ");
