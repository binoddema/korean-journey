import React from "react";
import { useStore } from "../store";
import { ACHIEVEMENTS, dailyGoals, derive, longGoals } from "../lib/progress";
import { todayStr } from "../lib/srs";
import { Bar, Card, CardTitle, Ring } from "../components/ui";
import { PageHeader } from "../components/Layout";

const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export const Goals = () => {
  const { state } = useStore();
  const d = derive(state);
  const daily = dailyGoals(state);
  const long = longGoals(state, d);
  const allDone = daily.every((g) => g.now >= g.goal);

  const resetIn = React.useMemo(() => {
    const now = new Date();
    const end = new Date();
    end.setHours(24, 0, 0, 0);
    const mins = Math.round((end.getTime() - now.getTime()) / 60000);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }, []);

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

  const weekMinutes = week.reduce((a, w) => a + (state.log[w.date]?.minutes ?? 0), 0);

  return (
    <>
      <PageHeader icon="⭐" title="Obiettivi" sub="Fissa i tuoi obiettivi e raggiungili passo dopo passo 💪" />

      <div className="grid-2">
        <div className="col">
          <Card className="pad">
            <CardTitle
              title="Obiettivi giornalieri"
              sub="Completa tutti gli obiettivi per ottenere il bonus XP"
              action={<span className="muted small">Si azzera tra {resetIn}</span>}
            />
            <div className="goal-grid">
              {daily.map((g) => {
                const done = g.now >= g.goal;
                return (
                  <div key={g.id} className={`goal ${done ? "done" : ""}`}>
                    <span className="goal-icon">{g.emoji}</span>
                    <strong>{g.title}</strong>
                    <span className="goal-count">
                      {Math.min(g.now, g.goal)} / {g.goal}
                    </span>
                    <Bar value={(g.now / g.goal) * 100} />
                    <small>{done ? "✅ completato" : `+${g.xp} XP`}</small>
                  </div>
                );
              })}
              <div className={`goal bonus ${allDone ? "done" : ""}`}>
                <span className="goal-icon">🎁</span>
                <strong>Bonus completamento</strong>
                <small>Completa tutti gli obiettivi giornalieri</small>
                <span className="bonus-xp">+50 XP</span>
              </div>
            </div>
          </Card>

          <Card className="pad">
            <CardTitle title="Obiettivi a lungo termine" sub="I tuoi traguardi principali" />
            <ul className="long-goals">
              {long.map((g) => (
                <li key={g.id}>
                  <Ring value={(g.now / g.goal) * 100} size={64} stroke={7} />
                  <div className="lg-main">
                    <strong>
                      {g.emoji} {g.title}
                    </strong>
                    <small className="muted">{g.desc}</small>
                    <small className="lg-count">
                      {g.now} / {g.goal} {g.unit}
                    </small>
                  </div>
                  <span className="lg-xp">+{g.xp} XP</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="col">
          <Card className="pad center">
            <CardTitle emoji="🔥" title="La tua streak" />
            <Ring value={Math.min(100, (state.streak / 7) * 100)} size={120} label={`${state.streak}`} sub="giorni" />
            <p className="muted">Record: {state.bestStreak} giorni</p>
            <div className="week-strip">
              {week.map((w) => (
                <div key={w.date} className="week-day">
                  <small>{w.label}</small>
                  <span className={w.done ? "done" : ""}>{w.done ? "🔥" : ""}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="pad">
            <CardTitle title="Achievement" />
            <ul className="ach-list full">
              {ACHIEVEMENTS.map((a) => {
                const p = a.progress(state, d);
                const got = p.now >= p.goal;
                return (
                  <li key={a.id} className={got ? "got" : ""}>
                    <span>{got ? a.emoji : "🔒"}</span>
                    <div>
                      <strong>{a.title}</strong>
                      <small className="muted">{a.desc}</small>
                    </div>
                    <b>{got ? "✅" : `${Math.min(p.now, p.goal)}/${p.goal}`}</b>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="pad">
            <CardTitle title="Tempo di studio questa settimana" />
            <h2>
              {Math.floor(weekMinutes / 60)}h {weekMinutes % 60}m
            </h2>
            <Bar value={Math.min(100, (weekMinutes / 600) * 100)} color="var(--accent)" />
            <p className="muted small">Obiettivo: 10h a settimana</p>
          </Card>
        </div>
      </div>
    </>
  );
};
