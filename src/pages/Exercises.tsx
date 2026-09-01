import React from "react";
import { useStore } from "../store";
import { ALL_LESSONS, ALL_VOCAB } from "../data";
import { buildPractice } from "../lib/exercises";
import { derive } from "../lib/progress";
import { Card, CardTitle, Empty, Ring } from "../components/ui";
import { PageHeader } from "../components/Layout";
import { ExerciseSession, type SessionSummary } from "../components/Exercise";

type Kind = "ko-it" | "it-ko" | "listen" | "match" | "written";

const KINDS: { id: Kind; n: number; label: string; icon: string; desc: string }[] = [
  { id: "ko-it", n: 1, label: "Riconosci la parola", icon: "📖", desc: "Vedi il coreano, scegli il significato" },
  { id: "it-ko", n: 2, label: "Italiano → Coreano", icon: "🔁", desc: "Dal significato alla parola coreana" },
  { id: "listen", n: 3, label: "Ascolto", icon: "🎧", desc: "Riconosci la parola che senti" },
  { id: "match", n: 4, label: "Abbinamento", icon: "🧩", desc: "Collega parole e significati" },
  { id: "written", n: 5, label: "Grammatica e frasi", icon: "✏️", desc: "Completa, costruisci e traduci" },
];

export const Exercises = () => {
  const { state } = useStore();
  const d = derive(state);
  const [kind, setKind] = React.useState<Kind | null>(null);
  const [summary, setSummary] = React.useState<SessionSummary | null>(null);
  const [seed, setSeed] = React.useState(0);

  const pool = React.useMemo(() => {
    const seen = ALL_VOCAB.filter((v) => state.srs[v.id]);
    return seen.length >= 8 ? seen : ALL_VOCAB.slice(0, 20);
  }, [state.srs]);

  const writtenPool = React.useMemo(() => {
    const done = ALL_LESSONS.filter(
      (l) => state.completedLessons.includes(l.id) || state.completedLessons.length === 0
    );
    return done.flatMap((l) => l.ex);
  }, [state.completedLessons]);

  const items = React.useMemo(
    () => (kind ? buildPractice(pool, kind, writtenPool) : []),
    [kind, seed]
  );

  return (
    <>
      <PageHeader icon="✏️" title="Esercizi" sub="Metti in pratica ciò che hai imparato!" />

      <div className="grid-2">
        <Card className="pad">
          {!kind && (
            <>
              <CardTitle title="Scegli un tipo di esercizio" sub={`${pool.length} vocaboli disponibili`} />
              <div className="kind-grid">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    className="kind-card"
                    onClick={() => {
                      setSummary(null);
                      setSeed((s) => s + 1);
                      setKind(k.id);
                    }}
                  >
                    <span className="kind-icon">{k.icon}</span>
                    <strong>{k.label}</strong>
                    <small className="muted">{k.desc}</small>
                  </button>
                ))}
              </div>
            </>
          )}

          {kind && !summary && items.length > 0 && (
            <ExerciseSession
              items={items}
              isReview={false}
              onDone={setSummary}
              onQuit={() => setKind(null)}
            />
          )}

          {kind && !summary && items.length === 0 && (
            <Empty
              emoji="🧩"
              title="Non ci sono ancora abbastanza dati"
              text="Completa almeno una lezione: gli esercizi si costruiscono sui vocaboli che hai già visto."
              action={
                <button className="btn primary" onClick={() => setKind(null)}>
                  Torna indietro
                </button>
              }
            />
          )}

          {kind && summary && (
            <div className="mini-result">
              <h2>
                Score: {summary.correct}/{summary.total}
              </h2>
              <p className="muted">
                Accuratezza {Math.round((summary.correct / Math.max(1, summary.total)) * 100)}%
              </p>
              {summary.wrong.length > 0 && (
                <div className="errors">
                  <b>Errori da rivedere</b>
                  <ul>
                    {summary.wrong.map((w, i) => (
                      <li key={i}>{w.ex.why}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="row">
                <button
                  className="btn primary"
                  onClick={() => {
                    setSummary(null);
                    setSeed((s) => s + 1);
                  }}
                >
                  Un altro giro
                </button>
                <button className="btn ghost" onClick={() => setKind(null)}>
                  Cambia tipo
                </button>
              </div>
            </div>
          )}
        </Card>

        <div className="col">
          <Card className="pad">
            <CardTitle title="Progresso esercizi" />
            <div className="row-center">
              <Ring value={d.accuracy} label={`${d.accuracy}%`} sub="accuratezza" />
            </div>
            <ul className="kv">
              <li>
                <span>Esercizi completati</span>
                <b>{state.totals.exercises}</b>
              </li>
              <li>
                <span>Risposte corrette</span>
                <b className="green">{state.totals.correct}</b>
              </li>
              <li>
                <span>Risposte sbagliate</span>
                <b className="red">{state.totals.wrong}</b>
              </li>
            </ul>
          </Card>

          <Card className="pad">
            <CardTitle title="Tipi di esercizio" />
            <ul className="type-list">
              {KINDS.map((k) => (
                <li key={k.id} className={kind === k.id ? "on" : ""}>
                  <span className="type-n">{k.n}</span>
                  <span>{k.label}</span>
                </li>
              ))}
            </ul>
            <p className="muted small">
              Ogni risposta aggiorna lo stato del vocabolo nel sistema di ripasso.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};
