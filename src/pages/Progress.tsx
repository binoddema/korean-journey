import React from "react";
import { useStore } from "../store";
import { TOPICS } from "../data";
import { ACHIEVEMENTS, derive } from "../lib/progress";
import { todayStr } from "../lib/srs";
import { Bar, Card, CardTitle } from "../components/ui";
import { PageHeader } from "../components/Layout";
import { BarChart, Donut, LineChart } from "../components/Charts";

const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export const ProgressPage = () => {
  const { state } = useStore();
  const d = derive(state);

  const last30 = React.useMemo(() => {
    const out: { date: string; day: number; label: string }[] = [];
    for (let i = 29; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      out.push({
        date: todayStr(dt),
        day: dt.getDate(),
        label: i % 7 === 0 ? `${dt.getDate()}/${dt.getMonth() + 1}` : "",
      });
    }
    return out;
  }, []);

  const exercisesSeries = last30.map((x) => state.log[x.date]?.exercises ?? 0);
  const cumulative: number[] = [];
  let run = Math.max(
    0,
    d.seenWords - last30.reduce((a, x) => a + (state.log[x.date]?.newWords ?? 0), 0)
  );
  last30.forEach((x) => {
    run += state.log[x.date]?.newWords ?? 0;
    cumulative.push(run);
  });

  const week = React.useMemo(() => {
    const out: { label: string; date: string; done: boolean }[] = [];
    const now = new Date();
    const dow = (now.getDay() + 6) % 7;
    for (let i = 0; i < 7; i++) {
      const dt = new Date();
      dt.setDate(now.getDate() - dow + i);
      const key = todayStr(dt);
      out.push({ label: DAYS[i], date: key, done: (state.log[key]?.exercises ?? 0) > 0 });
    }
    return out;
  }, [state.log]);

  const slices = [
    { label: "Imparate", value: d.learnedWords, color: "var(--green)" },
    { label: "Da ripassare", value: d.dueWords, color: "var(--orange)" },
    { label: "Difficili", value: d.hardWords, color: "var(--red)" },
    { label: "Nuove", value: d.newWords, color: "var(--track-strong)" },
  ];

  return (
    <>
      <PageHeader icon="📊" title="Progressi" sub="Il tuo viaggio di apprendimento del coreano" />

      <Card className="pad stat-row">
        <div className="stat-box">
          <span className="sb-icon blue">📘</span>
          <strong>{d.lessonsDone}</strong>
          <small>Lezioni completate di {d.totalLessons}</small>
          <Bar value={(d.lessonsDone / d.totalLessons) * 100} />
        </div>
        <div className="stat-box">
          <span className="sb-icon green">🆕</span>
          <strong>{d.seenWords}</strong>
          <small>Vocaboli incontrati di {d.totalWords}</small>
          <Bar value={(d.seenWords / d.totalWords) * 100} color="var(--green)" />
        </div>
        <div className="stat-box">
          <span className="sb-icon violet">🧠</span>
          <strong>{d.dueWords}</strong>
          <small>Parole da ripassare</small>
          <Bar value={d.seenWords ? (d.dueWords / d.seenWords) * 100 : 0} color="var(--accent)" />
        </div>
        <div className="stat-box">
          <span className="sb-icon orange">✏️</span>
          <strong>{state.totals.exercises}</strong>
          <small>Esercizi completati</small>
          <Bar value={Math.min(100, state.totals.exercises / 5)} color="var(--orange)" />
        </div>
        <div className="stat-box">
          <span className="sb-icon red">🎯</span>
          <strong>{d.accuracy}%</strong>
          <small>Accuratezza media negli esercizi</small>
          <Bar value={d.accuracy} color="var(--red)" />
        </div>
      </Card>

      <div className="grid-2">
        <Card className="pad">
          <CardTitle title="Progresso per topic" />
          <ul className="topic-progress-list">
            {TOPICS.map((t) => {
              const done = t.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
              return (
                <li key={t.id}>
                  <span className="tc-num" style={{ background: t.color }}>
                    {t.id}
                  </span>
                  <span className="tpl-main">
                    <strong>{t.title}</strong>
                    <small className="muted">{t.desc}</small>
                  </span>
                  <span className="tpl-count muted">
                    {done} / {t.lessons.length}
                  </span>
                  <span className="tpl-bar">
                    <Bar value={d.topicPct[t.id]} color={t.color} />
                  </span>
                  <b>{d.topicPct[t.id]}%</b>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="col">
          <Card className="pad">
            <CardTitle emoji="🔥" title="La tua streak" />
            <h2>{state.streak} giorni consecutivi</h2>
            <p className="muted">Record personale: {state.bestStreak} giorni</p>
            <div className="week-strip">
              {week.map((w) => (
                <div key={w.date} className="week-day">
                  <small>{w.label}</small>
                  <span className={w.done ? "done" : ""}>{w.done ? "✓" : ""}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="pad">
            <CardTitle title="Attività negli ultimi 30 giorni" sub="Esercizi completati al giorno" />
            <BarChart data={exercisesSeries} labels={last30.map((x) => x.label)} />
          </Card>
        </div>
      </div>

      <div className="grid-2">
        <Card className="pad">
          <CardTitle title="Apprendimento del vocabolario" sub="Parole incontrate nel tempo" />
          <LineChart data={cumulative} labels={last30.map((x) => x.label)} />
        </Card>

        <Card className="pad">
          <CardTitle title="Distribuzione parole" />
          <div className="donut-wrap">
            <Donut slices={slices} total={d.totalWords} />
            <ul className="legend">
              {slices.map((s) => (
                <li key={s.label}>
                  <i style={{ background: s.color }} />
                  <span>{s.label}</span>
                  <b>
                    {s.value} ({Math.round((s.value / d.totalWords) * 100)}%)
                  </b>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card className="pad">
        <CardTitle title="I tuoi achievement" />
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const p = a.progress(state, d);
            const got = p.now >= p.goal;
            return (
              <div key={a.id} className={`ach ${got ? "got" : ""}`}>
                <span className="ach-emoji">{got ? a.emoji : "🔒"}</span>
                <strong>{a.title}</strong>
                <small className="muted">{got ? a.desc : `${Math.min(p.now, p.goal)} / ${p.goal}`}</small>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="pad tip">
        💡 <b>Consiglio</b> — Ripassa le parole difficili ogni giorno: bastano cinque minuti per
        spostarle nella memoria a lungo termine.
      </Card>
    </>
  );
};
