import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppState, Difficulty, Settings } from "./types";
import { addDays, autoRate, newCard, rateCard, todayStr } from "./lib/srs";
import { ACHIEVEMENTS, derive } from "./lib/progress";

const KEY = "korean-journey-v1";

export const defaultSettings: Settings = {
  lang: "it",
  difficulty: "principiante",
  newPerDay: 10,
  maxReviews: 20,
  autoAudio: true,
  showRomanization: true,
  showHooks: true,
  slowAudio: false,
  detailedGrammar: true,
  dark: false,
  accent: "#5b4be0",
  reminder: true,
  reminderTime: "19:00",
  reminderDays: [1, 2, 3, 4, 5, 6, 7],
  monthlyWords: 120,
  goalDate: addDays(todayStr(), 730),
};

export const initialState: AppState = {
  name: "",
  startDate: todayStr(),
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastStudyDate: null,
  completedLessons: [],
  srs: {},
  achievements: [],
  log: {},
  totals: { correct: 0, wrong: 0, exercises: 0, minutes: 0 },
  settings: defaultSettings,
};

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      totals: { ...initialState.totals, ...(parsed.totals ?? {}) },
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return initialState;
  }
};

interface LessonResult {
  lessonId: string;
  newWords: number;
  exercises: number;
  correct: number;
  wrong: number;
  minutes: number;
}

interface Store {
  state: AppState;
  setName: (name: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  /** registra una risposta a un esercizio (aggiorna SRS, XP, statistiche) */
  answer: (vocabId: string | undefined, correct: boolean, isReview: boolean) => void;
  /** valutazione manuale nella pagina Ripasso */
  rate: (vocabId: string, rating: Difficulty) => void;
  /** marca i vocaboli come «visti» quando compaiono nello step vocabolario */
  seeVocab: (ids: string[]) => void;
  completeLesson: (r: LessonResult) => number;
  reset: () => void;
  importState: (raw: string) => boolean;
  exportState: () => string;
}

const Ctx = createContext<Store | null>(null);

const bumpStreak = (s: AppState): AppState => {
  const today = todayStr();
  if (s.lastStudyDate === today) return s;
  const yesterday = addDays(today, -1);
  const streak = s.lastStudyDate === yesterday ? s.streak + 1 : 1;
  return {
    ...s,
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    lastStudyDate: today,
  };
};

const logToday = (
  s: AppState,
  patch: Partial<{ xp: number; exercises: number; newWords: number; reviews: number; lessons: number; minutes: number }>
): AppState => {
  const d = todayStr();
  const cur = s.log[d] ?? {
    date: d,
    xp: 0,
    exercises: 0,
    newWords: 0,
    reviews: 0,
    lessons: 0,
    minutes: 0,
  };
  return {
    ...s,
    log: {
      ...s.log,
      [d]: {
        ...cur,
        xp: cur.xp + (patch.xp ?? 0),
        exercises: cur.exercises + (patch.exercises ?? 0),
        newWords: cur.newWords + (patch.newWords ?? 0),
        reviews: cur.reviews + (patch.reviews ?? 0),
        lessons: cur.lessons + (patch.lessons ?? 0),
        minutes: cur.minutes + (patch.minutes ?? 0),
      },
    },
  };
};

const checkAchievements = (s: AppState): AppState => {
  const d = derive(s);
  const unlocked = ACHIEVEMENTS.filter((a) => {
    const p = a.progress(s, d);
    return p.now >= p.goal;
  }).map((a) => a.id);
  const merged = Array.from(new Set([...s.achievements, ...unlocked]));
  return merged.length === s.achievements.length ? s : { ...s, achievements: merged };
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota piena o storage non disponibile: l'app continua a funzionare */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.dark ? "dark" : "light";
    document.documentElement.style.setProperty("--accent", state.settings.accent);
  }, [state.settings.dark, state.settings.accent]);

  const setName = useCallback((name: string) => setState((s) => ({ ...s, name })), []);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    []
  );

  const seeVocab = useCallback((ids: string[]) => {
    setState((s) => {
      const srs = { ...s.srs };
      let added = 0;
      ids.forEach((id) => {
        if (!srs[id]) {
          srs[id] = newCard();
          added += 1;
        }
      });
      if (added === 0) return s;
      let next = bumpStreak({ ...s, srs });
      next = logToday(next, { newWords: added });
      return checkAchievements(next);
    });
  }, []);

  const answer = useCallback(
    (vocabId: string | undefined, correct: boolean, isReview: boolean) => {
      setState((s) => {
        const srs = { ...s.srs };
        if (vocabId) {
          const card = srs[vocabId] ?? newCard();
          srs[vocabId] = autoRate(card, correct);
        }
        let next: AppState = {
          ...s,
          srs,
          totals: {
            ...s.totals,
            correct: s.totals.correct + (correct ? 1 : 0),
            wrong: s.totals.wrong + (correct ? 0 : 1),
            exercises: s.totals.exercises + 1,
          },
          xp: s.xp + (correct ? 10 : 2),
        };
        next = bumpStreak(next);
        next = logToday(next, {
          exercises: 1,
          xp: correct ? 10 : 2,
          reviews: isReview ? 1 : 0,
          minutes: 1,
        });
        return checkAchievements(next);
      });
    },
    []
  );

  const rate = useCallback((vocabId: string, rating: Difficulty) => {
    setState((s) => {
      const card = s.srs[vocabId] ?? newCard();
      let next: AppState = { ...s, srs: { ...s.srs, [vocabId]: rateCard(card, rating) } };
      next = bumpStreak(next);
      next = logToday(next, { reviews: 1, xp: 5 });
      next = { ...next, xp: next.xp + 5 };
      return checkAchievements(next);
    });
  }, []);

  const completeLesson = useCallback((r: LessonResult) => {
    const bonus = 100;
    setState((s) => {
      const already = s.completedLessons.includes(r.lessonId);
      let next: AppState = {
        ...s,
        xp: s.xp + bonus,
        completedLessons: already ? s.completedLessons : [...s.completedLessons, r.lessonId],
        totals: { ...s.totals, minutes: s.totals.minutes + r.minutes },
      };
      next = bumpStreak(next);
      next = logToday(next, { lessons: already ? 0 : 1, xp: bonus, minutes: r.minutes });
      return checkAchievements(next);
    });
    return bonus;
  }, []);

  const reset = useCallback(() => setState({ ...initialState, settings: defaultSettings }), []);

  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importState = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      if (typeof parsed !== "object" || parsed === null) return false;
      setState({
        ...initialState,
        ...parsed,
        totals: { ...initialState.totals, ...(parsed.totals ?? {}) },
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      state,
      setName,
      updateSettings,
      answer,
      rate,
      seeVocab,
      completeLesson,
      reset,
      importState,
      exportState,
    }),
    [state, setName, updateSettings, answer, rate, seeVocab, completeLesson, reset, importState, exportState]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStore = (): Store => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore va usato dentro <StoreProvider>");
  return ctx;
};
