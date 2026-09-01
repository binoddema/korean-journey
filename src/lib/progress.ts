import type { AppState, SrsCard } from "../types";
import { TOTAL_LESSONS, TOTAL_VOCAB, TOPICS } from "../data";
import { isDue, todayStr } from "./srs";

export const LEVELS = [0, 200, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5800];
export const LEVEL_NAMES = [
  "Primi passi",
  "Lettore di Hangul",
  "Korean Starter",
  "Korean Beginner",
  "Korean Explorer",
  "Korean Talker",
  "Korean Traveler",
  "Korean Speaker",
  "Korean Pro",
  "Korean Master",
  "한국어 고수",
];

export interface LevelInfo {
  level: number;
  name: string;
  floor: number;
  next: number | null;
  pct: number;
}

export const levelInfo = (xp: number): LevelInfo => {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) idx = i;
  const floor = LEVELS[idx];
  const next = idx + 1 < LEVELS.length ? LEVELS[idx + 1] : null;
  const pct = next ? Math.round(((xp - floor) / (next - floor)) * 100) : 100;
  return { level: idx + 1, name: LEVEL_NAMES[idx], floor, next, pct };
};

export interface Derived {
  learnedWords: number;
  seenWords: number;
  dueWords: number;
  hardWords: number;
  mediumWords: number;
  easyWords: number;
  newWords: number;
  lessonsDone: number;
  totalLessons: number;
  totalWords: number;
  accuracy: number;
  topicPct: Record<number, number>;
  overallPct: number;
}

export const derive = (s: AppState): Derived => {
  const cards = Object.values(s.srs);
  const today = todayStr();
  const count = (f: (c: SrsCard) => boolean) => cards.filter(f).length;

  const topicPct: Record<number, number> = {};
  TOPICS.forEach((t) => {
    const done = t.lessons.filter((l) => s.completedLessons.includes(l.id)).length;
    topicPct[t.id] = Math.round((done / t.lessons.length) * 100);
  });

  const total = s.totals.correct + s.totals.wrong;

  return {
    learnedWords: count((c) => c.status === "learned"),
    seenWords: cards.length,
    dueWords: count((c) => isDue(c, today)),
    hardWords: count((c) => c.last === "hard"),
    mediumWords: count((c) => c.last === "medium"),
    easyWords: count((c) => c.last === "easy"),
    newWords: TOTAL_VOCAB - cards.length,
    lessonsDone: s.completedLessons.length,
    totalLessons: TOTAL_LESSONS,
    totalWords: TOTAL_VOCAB,
    accuracy: total === 0 ? 0 : Math.round((s.totals.correct / total) * 100),
    topicPct,
    overallPct: Math.round((s.completedLessons.length / TOTAL_LESSONS) * 100),
  };
};

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  progress: (s: AppState, d: Derived) => { now: number; goal: number };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    title: "Prima lezione completata",
    desc: "Hai completato la tua prima lezione",
    emoji: "📗",
    progress: (_s, d) => ({ now: d.lessonsDone, goal: 1 }),
  },
  {
    id: "words-50",
    title: "50 parole viste",
    desc: "Hai incontrato 50 vocaboli",
    emoji: "5️⃣",
    progress: (_s, d) => ({ now: d.seenWords, goal: 50 }),
  },
  {
    id: "words-100",
    title: "100 parole viste",
    desc: "Hai incontrato 100 vocaboli",
    emoji: "💯",
    progress: (_s, d) => ({ now: d.seenWords, goal: 100 }),
  },
  {
    id: "streak-7",
    title: "7 giorni consecutivi",
    desc: "Hai studiato per una settimana di fila",
    emoji: "🔥",
    progress: (s) => ({ now: s.streak, goal: 7 }),
  },
  {
    id: "topic-1",
    title: "Topic 1 completato",
    desc: "Hai finito le fondamenta del coreano",
    emoji: "🏯",
    progress: (_s, d) => ({ now: d.topicPct[1] ?? 0, goal: 100 }),
  },
  {
    id: "learned-50",
    title: "50 parole imparate",
    desc: "50 vocaboli sono passati allo stato «imparato»",
    emoji: "🧠",
    progress: (_s, d) => ({ now: d.learnedWords, goal: 50 }),
  },
  {
    id: "xp-1000",
    title: "1000 XP",
    desc: "Hai superato i mille punti esperienza",
    emoji: "⭐",
    progress: (s) => ({ now: s.xp, goal: 1000 }),
  },
  {
    id: "all-topics",
    title: "Corso completato",
    desc: "Hai completato tutte le lezioni disponibili",
    emoji: "🏆",
    progress: (_s, d) => ({ now: d.lessonsDone, goal: d.totalLessons }),
  },
];

export interface DailyGoal {
  id: string;
  title: string;
  emoji: string;
  now: number;
  goal: number;
  xp: number;
}

export const dailyGoals = (s: AppState): DailyGoal[] => {
  const log = s.log[todayStr()];
  const g = (n: number | undefined) => n ?? 0;
  return [
    { id: "lesson", title: "Studia una lezione", emoji: "📘", now: g(log?.lessons), goal: 1, xp: 40 },
    { id: "new", title: `Impara ${s.settings.newPerDay} vocaboli`, emoji: "🆕", now: g(log?.newWords), goal: s.settings.newPerDay, xp: 30 },
    { id: "ex", title: "Completa 15 esercizi", emoji: "✏️", now: g(log?.exercises), goal: 15, xp: 30 },
    { id: "rev", title: "Ripassa 10 parole", emoji: "🧠", now: g(log?.reviews), goal: 10, xp: 20 },
  ];
};

export interface LongGoal {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  now: number;
  goal: number;
  xp: number;
  unit: string;
}

export const longGoals = (s: AppState, d: Derived): LongGoal[] => [
  {
    id: "topic1",
    title: "Completa il Topic 1 — Fondamenta",
    desc: "Impara le basi e inizia a leggere il coreano.",
    emoji: "📖",
    now: TOPICS[0].lessons.filter((l) => s.completedLessons.includes(l.id)).length,
    goal: TOPICS[0].lessons.length,
    xp: 300,
    unit: "lezioni completate",
  },
  {
    id: "words",
    title: `Impara ${d.totalWords} vocaboli`,
    desc: "Tutti i vocaboli del corso, uno alla volta.",
    emoji: "🎓",
    now: d.learnedWords,
    goal: d.totalWords,
    xp: 500,
    unit: "parole imparate",
  },
  {
    id: "course",
    title: "Sostieni una conversazione",
    desc: "Arriva alla fine del percorso e parla di te in coreano.",
    emoji: "💬",
    now: d.lessonsDone,
    goal: d.totalLessons,
    xp: 500,
    unit: "lezioni completate",
  },
];
