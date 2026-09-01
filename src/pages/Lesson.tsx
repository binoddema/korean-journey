import React from "react";
import type { Lesson as LessonType, Vocab } from "../types";
import { useStore } from "../store";
import { ALL_LESSONS, ALL_VOCAB, getTopic } from "../data";
import { buildLessonExercises, buildLessonTest, buildReviewExercises } from "../lib/exercises";
import { isDue } from "../lib/srs";
import { AudioButton, Bar, Card, Chip, VocabCard } from "../components/ui";
import { ExerciseSession, type SessionSummary } from "../components/Exercise";

const STEPS = [
  "Introduzione",
  "Vocaboli",
  "Grammatica",
  "Esempi",
  "Esercizi",
  "Ripasso",
  "Test finale",
  "Risultato",
];

export const LessonPage = ({
  lesson,
  onExit,
}: {
  lesson: LessonType;
  onExit: () => void;
}) => {
  const { state, seeVocab, completeLesson } = useStore();
  const [step, setStep] = React.useState(0);
  const [vIdx, setVIdx] = React.useState(0);
  const [exSum, setExSum] = React.useState<SessionSummary | null>(null);
  const [revSum, setRevSum] = React.useState<SessionSummary | null>(null);
  const [testSum, setTestSum] = React.useState<SessionSummary | null>(null);
  const startedAt = React.useRef(Date.now());
  const topic = getTopic(lesson.topicId)!;

  const reviewVocab = React.useMemo<Vocab[]>(() => {
    const own = new Set(lesson.vocab.map((v) => v.id));
    return ALL_VOCAB.filter((v) => !own.has(v.id) && state.srs[v.id] && isDue(state.srs[v.id])).slice(
      0,
      10
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const exercises = React.useMemo(
    () => buildLessonExercises(lesson, reviewVocab.slice(0, 4)),
    [lesson.id, reviewVocab]
  );
  const reviewItems = React.useMemo(
    () => buildReviewExercises(reviewVocab),
    [lesson.id, reviewVocab]
  );
  const test = React.useMemo(() => buildLessonTest(lesson), [lesson.id]);

  React.useEffect(() => {
    if (step === 1) seeVocab(lesson.vocab.map((v) => v.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const nextLesson = ALL_LESSONS.find((l) => l.day === lesson.day + 1);

  const finishLesson = () => {
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    completeLesson({
      lessonId: lesson.id,
      newWords: lesson.vocab.length,
      exercises: (exSum?.total ?? 0) + (testSum?.total ?? 0),
      correct: (exSum?.correct ?? 0) + (testSum?.correct ?? 0),
      wrong: (exSum?.wrong.length ?? 0) + (testSum?.wrong.length ?? 0),
      minutes,
    });
    setStep(7);
  };

  const totalAnswers =
    (exSum?.total ?? 0) + (revSum?.total ?? 0) + (testSum?.total ?? 0);
  const totalCorrect =
    (exSum?.correct ?? 0) + (revSum?.correct ?? 0) + (testSum?.correct ?? 0);
  const accuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="btn ghost sm" onClick={onExit}>
          ← Esci
        </button>
        <div className="crumbs">
          Topic {topic.id} — {topic.short} <span>›</span> Giorno {lesson.day} — {lesson.title}{" "}
          {lesson.emoji}
        </div>
      </div>

      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === step ? "on" : ""} ${i < step ? "done" : ""}`}>
            <span className="step-n">{i < step ? "✓" : i + 1}</span>
            <span className="step-l">{s}</span>
          </div>
        ))}
      </div>
      <Bar value={((step + 1) / STEPS.length) * 100} />

      {step === 0 && (
        <Card className="pad">
          <h2>
            Giorno {lesson.day} — {lesson.title} {lesson.emoji}
          </h2>
          <p className="lead">{lesson.intro}</p>
          <ul className="today-list">
            <li>🆕 {lesson.vocab.length} vocaboli</li>
            <li>📖 {lesson.grammar.length} {lesson.grammar.length === 1 ? "argomento grammaticale" : "argomenti grammaticali"}</li>
            <li>💬 {lesson.phrases.length} frasi utili</li>
            <li>✏️ {exercises.length + test.length} esercizi</li>
            <li>🧠 {reviewVocab.length} parole da ripassare</li>
          </ul>
          <button className="btn primary lg" onClick={() => setStep(1)}>
            ▶ Inizia la lezione
          </button>
        </Card>
      )}

      {step === 1 && (
        <Card className="pad">
          <div className="vocab-nav">
            <span className="muted">
              Vocabolo {vIdx + 1} di {lesson.vocab.length}
            </span>
            <Bar value={((vIdx + 1) / lesson.vocab.length) * 100} />
          </div>
          <VocabCard v={lesson.vocab[vIdx]} index={vIdx} />
          <div className="row-between">
            <button className="btn ghost" disabled={vIdx === 0} onClick={() => setVIdx(vIdx - 1)}>
              ← Precedente
            </button>
            {vIdx + 1 < lesson.vocab.length ? (
              <button className="btn primary" onClick={() => setVIdx(vIdx + 1)}>
                Prossimo →
              </button>
            ) : (
              <button className="btn primary" onClick={() => setStep(2)}>
                Vai alla grammatica →
              </button>
            )}
          </div>
        </Card>
      )}

      {step === 2 && (
        <>
          {lesson.grammar.map((g, i) => (
            <Card key={i} className="pad grammar">
              <h2>{g.title}</h2>
              <p>
                <b>Quando si usa:</b> {g.when}
              </p>
              <p>
                <b>Come si forma:</b> {g.how}
              </p>
              <div className="g-examples">
                {g.examples.map((e, k) => (
                  <div key={k} className="g-ex">
                    <p className="ko">
                      {e.ko} <AudioButton text={e.ko} size="sm" />
                    </p>
                    {state.settings.showRomanization && <p className="romanization">{e.ro}</p>}
                    <p className="muted">= {e.it}</p>
                  </div>
                ))}
              </div>
              {g.exceptions && (
                <p className="note">
                  <b>Da sapere:</b> {g.exceptions}
                </p>
              )}
              {state.settings.detailedGrammar && (
                <div className="mistakes">
                  <b>Errori tipici di chi parla italiano</b>
                  <ul>
                    {g.mistakes.map((m, k) => (
                      <li key={k}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
          <button className="btn primary lg" onClick={() => setStep(3)}>
            Vedi le frasi utili →
          </button>
        </>
      )}

      {step === 3 && (
        <Card className="pad">
          <h2>Frasi utili di oggi</h2>
          <div className="phrases">
            {lesson.phrases.map((p, i) => (
              <div key={i} className="phrase">
                <div>
                  <p className="ko">{p.ko}</p>
                  {state.settings.showRomanization && <p className="romanization">{p.ro}</p>}
                  <p className="muted">= {p.it}</p>
                </div>
                <div className="phrase-right">
                  {p.reg && <Chip tone={`reg-${p.reg}`}>{p.reg}</Chip>}
                  <AudioButton text={p.ko} />
                </div>
              </div>
            ))}
          </div>
          <button className="btn primary lg" onClick={() => setStep(4)}>
            Vai agli esercizi →
          </button>
        </Card>
      )}

      {step === 4 && (
        <Card className="pad">
          {exSum ? (
            <div className="mini-result">
              <h2>Esercizi completati</h2>
              <p className="lead">
                {exSum.correct} risposte corrette su {exSum.total}
              </p>
              <button className="btn primary lg" onClick={() => setStep(5)}>
                Continua →
              </button>
            </div>
          ) : (
            <ExerciseSession items={exercises} isReview={false} onDone={setExSum} />
          )}
        </Card>
      )}

      {step === 5 && (
        <Card className="pad">
          {reviewItems.length === 0 ? (
            <div className="mini-result">
              <h2>Niente da ripassare 🎉</h2>
              <p className="muted">
                Le parole delle lezioni precedenti non sono ancora in scadenza. Torna qui domani.
              </p>
              <button className="btn primary lg" onClick={() => setStep(6)}>
                Vai al test finale →
              </button>
            </div>
          ) : revSum ? (
            <div className="mini-result">
              <h2>Ripasso completato</h2>
              <p className="lead">
                {revSum.correct} risposte corrette su {revSum.total}
              </p>
              <button className="btn primary lg" onClick={() => setStep(6)}>
                Vai al test finale →
              </button>
            </div>
          ) : (
            <ExerciseSession items={reviewItems} isReview onDone={setRevSum} />
          )}
        </Card>
      )}

      {step === 6 && (
        <Card className="pad">
          {testSum ? (
            <div className="mini-result">
              <h2>
                Score: {testSum.correct}/{testSum.total}
              </h2>
              {testSum.wrong.length > 0 && (
                <div className="errors">
                  <b>Da rivedere</b>
                  <ul>
                    {testSum.wrong.map((w, i) => (
                      <li key={i}>{w.ex.why}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="btn primary lg" onClick={finishLesson}>
                Vedi il risultato →
              </button>
            </div>
          ) : (
            <>
              <h2>Test finale</h2>
              <p className="muted">Dieci domande su tutto quello che hai visto oggi.</p>
              <ExerciseSession items={test} isReview={false} onDone={setTestSum} />
            </>
          )}
        </Card>
      )}

      {step === 7 && (
        <Card className="pad result">
          <div className="result-emoji">🎉</div>
          <h2>Lezione completata!</h2>
          <p className="xp-gain">+100 XP</p>
          <div className="result-grid">
            <div>
              <strong>{lesson.vocab.length}</strong>
              <small>Nuove parole</small>
            </div>
            <div>
              <strong>
                {totalCorrect}/{totalAnswers}
              </strong>
              <small>Risposte corrette</small>
            </div>
            <div>
              <strong>{accuracy}%</strong>
              <small>Accuratezza</small>
            </div>
          </div>
          {nextLesson && (
            <p className="muted">
              Domani: Giorno {nextLesson.day} — {nextLesson.title} {nextLesson.emoji}
            </p>
          )}
          <button className="btn primary lg" onClick={onExit}>
            Torna alla home
          </button>
        </Card>
      )}
    </div>
  );
};
