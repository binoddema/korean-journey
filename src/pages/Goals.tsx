import React from "react";
import { useStore } from "../store";
import { ACHIEVEMENTS, buildPlan, dailyGoals, derive, longGoals, topicReadiness } from "../lib/progress";
import { todayStr } from "../lib/srs";
import { Bar, Card, CardTitle, Ring } from "../components/ui";
import { PageHeader } from "../components/Layout";

const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export const Goals = () => {
  const { state } = useStore();
  const d = derive(state);
  const daily = dailyGoals(state);
  const plan = buildPlan(state, d);
  const readiness = topicReadiness(d);
  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

      <Card className="pad plan">
        <CardTitle
          emoji="🇰🇷"
          title="Piano fino alla Corea"
          sub={`Obiettivo: ${plan.monthly} parole nuove al mese entro il ${fmtDate(plan.goalDate)}`}
        />
        <div className="plan-grid">
          <div className="plan-ring">
            <Ring
              value={(plan.done / Math.max(1, plan.available)) * 100}
              size={132}
              label={`${plan.done}`}
              sub={`di ${plan.available} parole`}
            />
          </div>
          <ul className="kv plan-kv">
            <li>
              <span>Giorni al trasferimento</span>
              <b>{plan.daysLeft} ({plan.monthsLeft} mesi)</b>
            </li>
            <li>
              <span>Ritmo richiesto</span>
              <b>{plan.perDay} parole al giorno</b>
            </li>
            <li>
              <span>Dovresti essere a</span>
              <b>{plan.expected} parole</b>
            </li>
            <li>
              <span>Sei a</span>
              <b className={plan.onTrack ? "green" : "red"}>
                {plan.done} parole ({plan.delta >= 0 ? "+" : ""}
                {plan.delta})
              </b>
            </li>
            <li>
              <span>Per finire tutto il corso servono</span>
              <b>{plan.neededPerDay} parole al giorno</b>
            </li>
            <li>
              <span>Al ritmo attuale arrivi a</span>
              <b>{plan.projected} parole</b>
            </li>
          </ul>
        </div>
        <p className={`plan-verdict ${plan.onTrack ? "ok" : "late"}`}>
          {plan.onTrack
            ? `Sei in pari con il piano: continua così e arrivi in Corea con ${plan.projected} parole in memoria.`
            : `Sei indietro di ${Math.abs(plan.delta)} parole. Recuperi con qualche sessione in più nella banca vocaboli: bastano ${plan.neededPerDay} parole al giorno.`}
        </p>

        <h3 className="plan-sub">Copertura per topic</h3>
        <ul className="readiness">
          {readiness.map((r) => (
            <li key={r.topic.id} className={r.topic.id <= 4 ? "priority" : ""}>
              <span className="tc-num" style={{ background: r.topic.color }}>
                {r.topic.id}
              </span>
              <span className="rd-main">
                <strong>{r.topic.short}</strong>
                <small className="muted">
                  {r.learned} imparate · {r.seen} incontrate su {r.total}
                </small>
              </span>
              <span className="rd-bar">
                <Bar value={r.pct} color={r.topic.color} />
              </span>
              <b>{r.pct}%</b>
            </li>
          ))}
        </ul>
        <p className="muted small">
          I topic 1–4 sono la tua priorità: coprono la lingua di tutti i giorni, il lavoro e le
          situazioni pratiche. Il topic 5 è il livello che ti porta verso il TOPIK intermedio.
        </p>
      </Card>

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
