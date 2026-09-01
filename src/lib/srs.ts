import type { Difficulty, SrsCard, SrsStatus } from "../types";

export const todayStr = (d: Date = new Date()): string => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

export const addDays = (dateStr: string, days: number): string => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return todayStr(d);
};

export const daysBetween = (a: string, b: string): number =>
  Math.round(
    (new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) /
      86400000
  );

export const newCard = (): SrsCard => ({
  status: "new",
  interval: 0,
  due: todayStr(),
  right: 0,
  wrong: 0,
  last: null,
});

/** Applica una valutazione alla carta e restituisce la carta aggiornata. */
export const rateCard = (card: SrsCard, rating: Difficulty): SrsCard => {
  const today = todayStr();
  let interval = card.interval;
  let status: SrsStatus;

  if (rating === "hard") {
    interval = 0;
    status = "learning";
  } else if (rating === "medium") {
    interval = 1;
    status = "review";
  } else {
    interval = card.interval <= 1 ? 3 : Math.min(card.interval * 2, 60);
    status = interval >= 7 ? "learned" : "review";
  }

  return {
    status,
    interval,
    due: addDays(today, interval),
    right: card.right + (rating === "hard" ? 0 : 1),
    wrong: card.wrong + (rating === "hard" ? 1 : 0),
    last: rating,
  };
};

/** Valutazione automatica in base alla risposta data in un esercizio. */
export const autoRate = (card: SrsCard, correct: boolean): SrsCard => {
  if (!correct) return rateCard(card, "hard");
  const rating: Difficulty = card.right >= 2 ? "easy" : "medium";
  return rateCard(card, rating);
};

export const isDue = (card: SrsCard, today = todayStr()): boolean =>
  card.status !== "new" && card.due <= today;

export const statusLabel: Record<SrsStatus, string> = {
  new: "Nuovo",
  learning: "In apprendimento",
  review: "Da ripassare",
  learned: "Imparato",
};

export const difficultyOf = (card: SrsCard): Difficulty => {
  if (card.last === null) return "medium";
  return card.last;
};

export const difficultyLabel: Record<Difficulty, string> = {
  hard: "Difficile",
  medium: "Media",
  easy: "Facile",
};

export const difficultyHint: Record<Difficulty, string> = {
  hard: "Ripassa ancora oggi",
  medium: "Ripassa domani",
  easy: "Ripassa tra più giorni",
};

export const dueLabel = (due: string): string => {
  const diff = daysBetween(todayStr(), due);
  if (diff <= 0) return "Oggi";
  if (diff === 1) return "Domani";
  return `Tra ${diff} giorni`;
};
