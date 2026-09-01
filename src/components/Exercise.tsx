import React from "react";
import type { Exercise, RuntimeExercise } from "../types";
import { exerciseTypeLabel, normalize, shuffle } from "../lib/exercises";
import { AudioButton, Bar } from "./ui";
import { speak } from "../lib/speech";
import { useStore } from "../store";

const typeNumber: Record<Exercise["k"], number> = {
  mc: 4,
  fill: 5,
  build: 6,
  trans: 7,
  listen: 8,
  match: 3,
};

const label = (ex: Exercise) =>
  ex.k === "mc" && ex.label
    ? ex.label
    : exerciseTypeLabel[ex.k];

export interface Answered {
  correct: boolean;
  vocabId?: string;
  ex: Exercise;
}

export const ExerciseView = ({
  item,
  onAnswered,
  onNext,
  isLast,
}: {
  item: RuntimeExercise;
  onAnswered: (a: Answered) => void;
  onNext: () => void;
  isLast: boolean;
}) => {
  const { state } = useStore();
  const ex = item.ex;
  const [picked, setPicked] = React.useState<number | null>(null);
  const [text, setText] = React.useState("");
  const [built, setBuilt] = React.useState<string[]>([]);
  const [done, setDone] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);
  const [matchSel, setMatchSel] = React.useState<string | null>(null);
  const [matched, setMatched] = React.useState<string[]>([]);
  const [matchErr, setMatchErr] = React.useState(0);
  const [wrongFlash, setWrongFlash] = React.useState<string | null>(null);

  const shuffledWords = React.useMemo(
    () => (ex.k === "build" ? shuffle(ex.w) : []),
    [item.id]
  );
  const rightCol = React.useMemo(
    () => (ex.k === "match" ? shuffle(ex.pairs.map((p) => p.it)) : []),
    [item.id]
  );

  React.useEffect(() => {
    setPicked(null);
    setText("");
    setBuilt([]);
    setDone(false);
    setCorrect(false);
    setMatchSel(null);
    setMatched([]);
    setMatchErr(0);
  }, [item.id]);

  React.useEffect(() => {
    if (ex.k === "listen" && state.settings.autoAudio) speak(ex.say, state.settings.slowAudio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const finish = (ok: boolean) => {
    setCorrect(ok);
    setDone(true);
    onAnswered({ correct: ok, vocabId: item.vocabId, ex });
  };

  const choose = (i: number) => {
    if (done) return;
    setPicked(i);
    if (ex.k === "mc" || ex.k === "fill" || ex.k === "listen") finish(i === ex.a);
  };

  const checkText = () => {
    if (done || ex.k !== "trans") return;
    const answers = [ex.a, ...(ex.alt ?? [])].map(normalize);
    finish(answers.includes(normalize(text)));
  };

  const checkBuild = () => {
    if (done || ex.k !== "build") return;
    finish(normalize(built.join(" ")) === normalize(ex.a));
  };

  const tapMatch = (ko: string | null, it: string | null) => {
    if (ex.k !== "match" || done) return;
    if (ko) {
      setMatchSel(ko);
      return;
    }
    if (!it || !matchSel) return;
    const pair = ex.pairs.find((p) => p.ko === matchSel);
    if (pair && pair.it === it) {
      const next = [...matched, matchSel];
      setMatched(next);
      setMatchSel(null);
      if (next.length === ex.pairs.length) finish(matchErr === 0);
    } else {
      setMatchErr((n) => n + 1);
      setWrongFlash(it);
      setTimeout(() => setWrongFlash(null), 500);
      setMatchSel(null);
    }
  };

  const optionState = (i: number) => {
    if (!done) return picked === i ? "picked" : "";
    if ("a" in ex && i === ex.a) return "right";
    if (picked === i) return "wrong";
    return "dim";
  };

  return (
    <div className="exercise">
      <div className="ex-label">
        TIPO {typeNumber[ex.k]} — {label(ex)}
      </div>

      {(ex.k === "mc" || ex.k === "fill") && (
        <>
          <h2 className="ex-q">
            {ex.q}
            {ex.say && <AudioButton text={ex.say} />}
          </h2>
          <div className="options">
            {ex.o.map((o, i) => (
              <button key={i} className={`option ${optionState(i)}`} onClick={() => choose(i)}>
                <span className="opt-letter">{"ABCD"[i]}</span>
                <span className="opt-text">{o}</span>
                {done && i === ex.a && <span className="opt-mark">✅</span>}
                {done && picked === i && i !== ex.a && <span className="opt-mark">❌</span>}
              </button>
            ))}
          </div>
        </>
      )}

      {ex.k === "listen" && (
        <>
          <h2 className="ex-q">Ascolta e scegli quello che hai sentito</h2>
          <button className="big-audio" onClick={() => speak(ex.say, state.settings.slowAudio)}>
            🔊 Ascolta
          </button>
          <div className="options">
            {ex.o.map((o, i) => (
              <button key={i} className={`option ${optionState(i)}`} onClick={() => choose(i)}>
                <span className="opt-letter">{"ABCD"[i]}</span>
                <span className="opt-text ko">{o}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {ex.k === "build" && (
        <>
          <h2 className="ex-q">{ex.q}</h2>
          <div className="build-line">
            {built.length === 0 && <span className="muted">Tocca le parole nell'ordine giusto</span>}
            {built.map((w, i) => (
              <button
                key={`${w}-${i}`}
                className="word-chip in"
                onClick={() => !done && setBuilt(built.filter((_, k) => k !== i))}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="build-pool">
            {shuffledWords.map((w, i) => (
              <button
                key={`${w}-${i}`}
                className="word-chip"
                disabled={done || built.includes(w)}
                onClick={() => setBuilt([...built, w])}
              >
                {w}
              </button>
            ))}
          </div>
          {!done && (
            <button className="btn primary" disabled={built.length === 0} onClick={checkBuild}>
              Controlla
            </button>
          )}
        </>
      )}

      {ex.k === "trans" && (
        <>
          <h2 className="ex-q">Traduci: «{ex.q}»</h2>
          <input
            className="ex-input ko"
            value={text}
            disabled={done}
            placeholder="Scrivi in coreano…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkText()}
          />
          {!done && (
            <button className="btn primary" disabled={!text.trim()} onClick={checkText}>
              Controlla
            </button>
          )}
        </>
      )}

      {ex.k === "match" && (
        <>
          <h2 className="ex-q">Abbina ogni parola al suo significato</h2>
          <div className="match-grid">
            <div>
              {ex.pairs.map((p) => (
                <button
                  key={p.ko}
                  className={`match-item ko ${matched.includes(p.ko) ? "ok" : ""} ${
                    matchSel === p.ko ? "sel" : ""
                  }`}
                  disabled={matched.includes(p.ko)}
                  onClick={() => tapMatch(p.ko, null)}
                >
                  {p.ko}
                </button>
              ))}
            </div>
            <div>
              {rightCol.map((it) => {
                const isOk = ex.pairs.some((p) => p.it === it && matched.includes(p.ko));
                return (
                  <button
                    key={it}
                    className={`match-item ${isOk ? "ok" : ""} ${wrongFlash === it ? "bad" : ""}`}
                    disabled={isOk}
                    onClick={() => tapMatch(null, it)}
                  >
                    {it}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {done && (
        <div className={`feedback ${correct ? "ok" : "bad"}`}>
          <strong>{correct ? "✅ Corretto!" : "❌ Non ci siamo"}</strong>
          {!correct && "a" in ex && (ex.k === "mc" || ex.k === "fill" || ex.k === "listen") && (
            <p>
              La risposta corretta è <b>{ex.o[ex.a]}</b>.
            </p>
          )}
          {!correct && ex.k === "build" && (
            <p>
              La risposta corretta è <b>{ex.a}</b>.
            </p>
          )}
          {!correct && ex.k === "trans" && (
            <p>
              La risposta corretta è <b>{ex.a}</b>.
            </p>
          )}
          <p className="why">🧠 {ex.why}</p>
          <button className="btn primary" onClick={onNext}>
            {isLast ? "Concludi" : "Prossima →"}
          </button>
        </div>
      )}
    </div>
  );
};

export interface SessionSummary {
  total: number;
  correct: number;
  wrong: Answered[];
}

export const ExerciseSession = ({
  items,
  isReview,
  onDone,
  onQuit,
}: {
  items: RuntimeExercise[];
  isReview: boolean;
  onDone: (s: SessionSummary) => void;
  onQuit?: () => void;
}) => {
  const { answer } = useStore();
  const [i, setI] = React.useState(0);
  const [correctCount, setCorrect] = React.useState(0);
  const [wrong, setWrong] = React.useState<Answered[]>([]);

  const handleAnswered = (a: Answered) => {
    answer(a.vocabId, a.correct, isReview);
    if (a.correct) setCorrect((c) => c + 1);
    else setWrong((w) => [...w, a]);
  };

  const next = () => {
    if (i + 1 >= items.length) {
      onDone({ total: items.length, correct: correctCount, wrong });
    } else {
      setI(i + 1);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="session">
      <div className="session-top">
        <span className="muted">
          {i + 1} / {items.length}
        </span>
        <Bar value={((i + 1) / items.length) * 100} />
        {onQuit && (
          <button className="btn ghost sm" onClick={onQuit}>
            Esci
          </button>
        )}
      </div>
      <ExerciseView
        item={items[i]}
        onAnswered={handleAnswered}
        onNext={next}
        isLast={i + 1 >= items.length}
      />
    </div>
  );
};
