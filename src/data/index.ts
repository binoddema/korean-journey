import type { Lesson, LessonSeed, Topic, Vocab } from "../types";
import { parseBank, type ParsedUnit } from "./bank";
import { topic1 } from "./t1";
import { topic2 } from "./t2";
import { topic3 } from "./t3";
import { topic4 } from "./t4";
import { topic5 } from "./t5";

interface TopicMeta {
  id: number;
  title: string;
  short: string;
  desc: string;
  emoji: string;
  color: string;
  seeds: LessonSeed[];
}

const META: TopicMeta[] = [
  {
    id: 1,
    title: "Fondamenta del coreano",
    short: "Fondamenti",
    desc: "Hangul, pronuncia, saluti, numeri e le basi della lingua.",
    emoji: "🏯",
    color: "#3b6fe0",
    seeds: topic1,
  },
  {
    id: 2,
    title: "Vita quotidiana",
    short: "Vita quotidiana",
    desc: "Casa, famiglia, cibo, routine e le particelle di base.",
    emoji: "🏠",
    color: "#f0902b",
    seeds: topic2,
  },
  {
    id: 3,
    title: "Conversazione",
    short: "Conversazione",
    desc: "Fare domande, parlare del passato, esprimere gusti ed emozioni.",
    emoji: "💬",
    color: "#28a56b",
    seeds: topic3,
  },
  {
    id: 4,
    title: "Situazioni reali",
    short: "Situazioni reali",
    desc: "Ristorante, trasporti, negozi, hotel: il coreano che ti serve in viaggio.",
    emoji: "🧳",
    color: "#e0526e",
    seeds: topic4,
  },
  {
    id: 5,
    title: "Coreano intermedio",
    short: "Intermedio",
    desc: "Connettivi, onorifici, espressioni naturali e cultura.",
    emoji: "🚀",
    color: "#7b5be0",
    seeds: topic5,
  },
];

let day = 0;

export const TOPICS: Topic[] = META.map((m) => {
  const lessons: Lesson[] = m.seeds.map((seed, i) => {
    day += 1;
    const id = `t${m.id}l${i + 1}`;
    const vocab: Vocab[] = seed.vocab.map((v, k) => ({ ...v, id: `${id}#${k}` }));
    return { ...seed, id, topicId: m.id, day, vocab };
  });
  return {
    id: m.id,
    title: m.title,
    short: m.short,
    desc: m.desc,
    emoji: m.emoji,
    color: m.color,
    lessons,
  };
});

export const ALL_LESSONS: Lesson[] = TOPICS.flatMap((t) => t.lessons);
export const LESSON_VOCAB: Vocab[] = ALL_LESSONS.flatMap((l) => l.vocab);

/** Banca vocaboli: parole tematiche extra, senza duplicati con le lezioni. */
export const UNITS: ParsedUnit[] = parseBank(new Set(LESSON_VOCAB.map((v) => v.ko)));
export const BANK_VOCAB: Vocab[] = UNITS.flatMap((u) => u.words);

export const ALL_VOCAB: Vocab[] = [...LESSON_VOCAB, ...BANK_VOCAB];

const vocabIndex = new Map<string, Vocab>(ALL_VOCAB.map((v) => [v.id, v]));
const lessonIndex = new Map<string, Lesson>(ALL_LESSONS.map((l) => [l.id, l]));
const unitIndex = new Map<string, ParsedUnit>(UNITS.map((u) => [u.id, u]));
export const getUnit = (id: string) => unitIndex.get(id);
export const unitsOfTopic = (topic: number) => UNITS.filter((u) => u.topic === topic);

export const getVocab = (id: string) => vocabIndex.get(id);
export const getLesson = (id: string) => lessonIndex.get(id);
export const getTopic = (id: number) => TOPICS.find((t) => t.id === id);

export const TOTAL_LESSONS = ALL_LESSONS.length;
export const TOTAL_VOCAB = ALL_VOCAB.length;
export const TOTAL_BANK = BANK_VOCAB.length;
