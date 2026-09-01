import React from "react";
import { useStore } from "../store";
import { TOPICS, TOTAL_LESSONS, TOTAL_VOCAB } from "../data";
import { derive } from "../lib/progress";
import { Bar, Card, CardTitle, Ring } from "../components/ui";
import { PageHeader } from "../components/Layout";

export const Courses = ({ onStart }: { onStart: (lessonId: string) => void }) => {
  const { state } = useStore();
  const d = derive(state);
  const [open, setOpen] = React.useState<number | null>(
    TOPICS.find((t) => t.lessons.some((l) => !state.completedLessons.includes(l.id)))?.id ?? 1
  );

  return (
    <>
      <PageHeader icon="📖" title="Corsi" sub="Il tuo percorso di apprendimento del coreano" />

      <div className="grid-2">
        <div className="col">
          {TOPICS.map((t) => {
            const done = t.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
            const isOpen = open === t.id;
            return (
              <Card key={t.id} className="topic-row">
                <button className="topic-row-head" onClick={() => setOpen(isOpen ? null : t.id)}>
                  <span className="tr-emoji" style={{ background: `${t.color}1a` }}>
                    {t.emoji}
                  </span>
                  <span className="tr-main">
                    <span className="tr-title">
                      <span className="tc-num" style={{ background: t.color }}>
                        {t.id}
                      </span>
                      {t.title}
                    </span>
                    <span className="muted">{t.desc}</span>
                    <span className="muted small">
                      {done} / {t.lessons.length} lezioni
                    </span>
                  </span>
                  <span className="tr-right">
                    <b>{d.topicPct[t.id]}%</b>
                    <Bar value={d.topicPct[t.id]} color={t.color} height={6} />
                    <span className="chevron">{isOpen ? "▾" : "›"}</span>
                  </span>
                </button>

                {isOpen && (
                  <ul className="lesson-list">
                    {t.lessons.map((l) => {
                      const completed = state.completedLessons.includes(l.id);
                      return (
                        <li key={l.id}>
                          <button onClick={() => onStart(l.id)}>
                            <span className={`ll-state ${completed ? "done" : ""}`}>
                              {completed ? "✓" : l.day}
                            </span>
                            <span className="ll-main">
                              <strong>
                                Giorno {l.day} — {l.title} {l.emoji}
                              </strong>
                              <small className="muted">
                                {l.vocab.length} vocaboli · {l.grammar.length} grammatica ·{" "}
                                {l.phrases.length} frasi
                              </small>
                            </span>
                            <span className="ll-cta">{completed ? "Rifai" : "Studia"}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>

        <div className="col">
          <Card className="pad">
            <CardTitle title="Il tuo percorso" />
            <p className="muted">
              5 topic · {TOTAL_LESSONS} lezioni · {TOTAL_VOCAB} vocaboli
            </p>
            <div className="path-strip">
              {TOPICS.map((t) => (
                <span
                  key={t.id}
                  className={`path-dot ${d.topicPct[t.id] === 100 ? "full" : d.topicPct[t.id] > 0 ? "part" : ""}`}
                  style={{ borderColor: t.color }}
                  title={t.title}
                >
                  {t.emoji}
                </span>
              ))}
              <span className="path-flag">🏁</span>
            </div>
            <p className="pill">{d.lessonsDone} lezioni completate</p>
          </Card>

          <Card className="pad">
            <CardTitle emoji="💡" title="Suggerimento" />
            <p className="muted">
              Studiare venti minuti ogni giorno vale più di tre ore nel weekend: la memoria a lungo
              termine si costruisce con la ripetizione distribuita.
            </p>
          </Card>

          <Card className="pad">
            <CardTitle title="Progresso generale" />
            <div className="row-center">
              <Ring value={d.overallPct} sub="completato" />
            </div>
            <ul className="kv">
              <li>
                <span>Lezioni completate</span>
                <b>
                  {d.lessonsDone} / {d.totalLessons}
                </b>
              </li>
              <li>
                <span>Vocaboli incontrati</span>
                <b>
                  {d.seenWords} / {d.totalWords}
                </b>
              </li>
              <li>
                <span>Da ripassare</span>
                <b>{d.dueWords}</b>
              </li>
              <li>
                <span>Tempo di studio</span>
                <b>
                  {Math.floor(state.totals.minutes / 60)}h {state.totals.minutes % 60}m
                </b>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
};
