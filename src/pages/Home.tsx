import React from "react";
import { useStore } from "../store";
import { ALL_LESSONS, TOPICS } from "../data";
import { ACHIEVEMENTS, derive } from "../lib/progress";
import { Bar, Card, CardTitle } from "../components/ui";
import { StatChips } from "../components/Layout";
import type { Page } from "../components/Layout";

export const Home = ({
  onNav,
  onStart,
}: {
  onNav: (p: Page) => void;
  onStart: (lessonId: string) => void;
}) => {
  const { state, setName } = useStore();
  const d = derive(state);
  const [draft, setDraft] = React.useState("");

  const current =
    ALL_LESSONS.find((l) => !state.completedLessons.includes(l.id)) ??
    ALL_LESSONS[ALL_LESSONS.length - 1];
  const topic = TOPICS.find((t) => t.id === current.topicId)!;
  const lessonProgress = Math.round(
    (topic.lessons.filter((l) => state.completedLessons.includes(l.id)).length /
      topic.lessons.length) *
      100
  );
  const todayLog = state.log[new Date().toISOString().slice(0, 10)];

  return (
    <>
      <header className="page-head">
        <div className="ph-left">
          <div>
            <h1>
              안녕하세요{state.name ? `, ${state.name}` : ""}! 👋
            </h1>
            <p className="muted">Sei sulla strada giusta! 화이팅 💪</p>
          </div>
        </div>
        <StatChips />
      </header>

      {!state.name && (
        <Card className="pad name-card">
          <CardTitle emoji="✨" title="Come ti chiami?" sub="Serve solo per salutarti: resta sul tuo dispositivo." />
          <div className="row">
            <input
              className="ex-input"
              value={draft}
              placeholder="Il tuo nome"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && draft.trim() && setName(draft.trim())}
            />
            <button className="btn primary" disabled={!draft.trim()} onClick={() => setName(draft.trim())}>
              Salva
            </button>
          </div>
        </Card>
      )}

      <div className="grid-2">
        <Card className="pad today">
          <CardTitle emoji="📚" title="Studio di oggi" />
          <h2>
            Giorno {current.day} — {current.title} {current.emoji}
          </h2>
          <div className="row-progress">
            <Bar value={lessonProgress} />
            <span>{lessonProgress}%</span>
          </div>
          <p className="muted small">Progresso del {topic.short}</p>
          <ul className="today-list">
            <li>🆕 {current.vocab.length} vocaboli</li>
            <li>
              📖 {current.grammar.length}{" "}
              {current.grammar.length === 1 ? "argomento grammaticale" : "argomenti grammaticali"}
            </li>
            <li>💬 {current.phrases.length} frasi utili</li>
            <li>✏️ ~{current.ex.length + 20} esercizi</li>
            <li>🧠 {d.dueWords} parole da ripassare</li>
          </ul>
          <button className="btn primary lg" onClick={() => onStart(current.id)}>
            ▶ Inizia la lezione
          </button>
        </Card>

        <div className="col">
          <Card className="pad">
            <CardTitle emoji="📊" title="I tuoi progressi" />
            <div className="topic-progress">
              {TOPICS.map((t) => (
                <div key={t.id} className="tp-row">
                  <div className="tp-head">
                    <span>
                      Topic {t.id} — {t.short}
                    </span>
                    <b>{d.topicPct[t.id]}%</b>
                  </div>
                  <Bar value={d.topicPct[t.id]} color={t.color} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="pad review-card">
            <CardTitle emoji="🧠" title="Ripasso" sub={`${d.dueWords} parole da ripassare`} />
            <button className="btn outline" onClick={() => onNav("review")}>
              Inizia ripasso
            </button>
          </Card>

          <Card className="pad">
            <CardTitle emoji="🎯" title="Il tuo obiettivo" sub={`${state.settings.newPerDay} vocaboli oggi`} />
            <div className="row-progress">
              <Bar
                value={Math.min(100, ((todayLog?.newWords ?? 0) / state.settings.newPerDay) * 100)}
                color="var(--green)"
              />
              <span>
                {Math.min(todayLog?.newWords ?? 0, state.settings.newPerDay)}/{state.settings.newPerDay}
              </span>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid-2">
        <Card className="pad">
          <CardTitle
            title="I tuoi topic"
            action={
              <button className="btn ghost sm" onClick={() => onNav("courses")}>
                Vedi tutti i topic
              </button>
            }
          />
          <div className="topic-cards">
            {TOPICS.map((t) => (
              <button key={t.id} className="topic-card" onClick={() => onNav("courses")}>
                <span className="tc-num" style={{ background: t.color }}>
                  {t.id}
                </span>
                <span className="tc-emoji">{t.emoji}</span>
                <strong>{t.short}</strong>
                <small>
                  {t.lessons.filter((l) => state.completedLessons.includes(l.id)).length} /{" "}
                  {t.lessons.length} lezioni
                </small>
                <Bar value={d.topicPct[t.id]} color={t.color} height={6} />
              </button>
            ))}
          </div>
        </Card>

        <Card className="pad">
          <CardTitle emoji="🏆" title="Achievements" />
          <ul className="ach-list">
            {ACHIEVEMENTS.slice(0, 5).map((a) => {
              const got = state.achievements.includes(a.id);
              return (
                <li key={a.id} className={got ? "got" : ""}>
                  <span>{got ? a.emoji : "🔒"}</span>
                  {a.title}
                </li>
              );
            })}
          </ul>
          <button className="btn ghost sm" onClick={() => onNav("goals")}>
            Vedi tutti
          </button>
        </Card>
      </div>
    </>
  );
};
