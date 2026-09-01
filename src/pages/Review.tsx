import React from "react";
import { useStore } from "../store";
import { ALL_VOCAB, getVocab } from "../data";
import { buildReviewExercises } from "../lib/exercises";
import {
  difficultyHint,
  difficultyLabel,
  dueLabel,
  isDue,
  statusLabel,
  todayStr,
} from "../lib/srs";
import type { Difficulty, Vocab } from "../types";
import { AudioButton, Card, CardTitle, Empty } from "../components/ui";
import { PageHeader } from "../components/Layout";
import { ExerciseSession, type SessionSummary } from "../components/Exercise";

type Filter = "all" | Difficulty;

export const Review = () => {
  const { state, rate } = useStore();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [running, setRunning] = React.useState(false);
  const [summary, setSummary] = React.useState<SessionSummary | null>(null);
  const [expanded, setExpanded] = React.useState(false);

  const today = todayStr();
  const dueCards = ALL_VOCAB.filter((v) => state.srs[v.id] && isDue(state.srs[v.id], today));
  const byDiff = (dif: Difficulty) =>
    ALL_VOCAB.filter((v) => state.srs[v.id]?.last === dif && state.srs[v.id].due <= today);

  const hard = byDiff("hard");
  const medium = byDiff("medium");
  const easy = byDiff("easy");

  const list: Vocab[] =
    filter === "all" ? dueCards : dueCards.filter((v) => state.srs[v.id].last === filter);
  const visible = expanded ? list : list.slice(0, 5);

  const upcoming = React.useMemo(() => {
    const map = new Map<string, number>();
    Object.values(state.srs).forEach((c) => {
      if (c.status === "new") return;
      map.set(c.due, (map.get(c.due) ?? 0) + 1);
    });
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = todayStr(d);
      return { key, day: d.getDate(), count: map.get(key) ?? 0 };
    });
  }, [state.srs]);

  const items = React.useMemo(
    () => buildReviewExercises(list.slice(0, state.settings.maxReviews), state.settings.difficulty),
    [running]
  );

  if (running) {
    return (
      <>
        <PageHeader icon="🧠" title="Ripasso in corso" sub="Rispondi e le parole si riprogrammano da sole" />
        <Card className="pad">
          {summary ? (
            <div className="mini-result">
              <h2>
                Ripasso completato: {summary.correct}/{summary.total}
              </h2>
              <p className="muted">
                Le parole sbagliate torneranno oggi stesso, quelle giuste tra qualche giorno.
              </p>
              <button
                className="btn primary lg"
                onClick={() => {
                  setRunning(false);
                  setSummary(null);
                }}
              >
                Torna al ripasso
              </button>
            </div>
          ) : (
            <ExerciseSession
              items={items}
              isReview
              onDone={setSummary}
              onQuit={() => setRunning(false)}
            />
          )}
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        icon="🧠"
        title="Ripasso"
        sub="Rivedi le parole che hai imparato e rafforza la memoria."
      />

      <Card className="pad">
        <CardTitle title="Da ripassare oggi" />
        <div className="review-summary">
          <div className="rs-box hard">
            <strong>{hard.length}</strong>
            <span>Difficili</span>
            <small>Da ripassare oggi</small>
          </div>
          <div className="rs-box medium">
            <strong>{medium.length}</strong>
            <span>Medie</span>
            <small>Da ripassare domani</small>
          </div>
          <div className="rs-box easy">
            <strong>{easy.length}</strong>
            <span>Facili</span>
            <small>Ripassa tra più giorni</small>
          </div>
          <div className="rs-total">
            <small>Totale parole</small>
            <strong>{dueCards.length}</strong>
            <button
              className="btn primary"
              disabled={dueCards.length === 0}
              onClick={() => {
                setSummary(null);
                setRunning(true);
              }}
            >
              ▶ Inizia ripasso
            </button>
          </div>
        </div>
      </Card>

      <div className="grid-2">
        <Card className="pad">
          <div className="filters">
            {(
              [
                ["all", `Tutte (${dueCards.length})`],
                ["hard", `Difficili (${hard.length})`],
                ["medium", `Medie (${medium.length})`],
                ["easy", `Facili (${easy.length})`],
              ] as [Filter, string][]
            ).map(([f, label]) => (
              <button
                key={f}
                className={`filter ${filter === f ? "on" : ""} ${f}`}
                onClick={() => setFilter(f)}
              >
                {label}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <Empty
              emoji="🌱"
              title="Nessuna parola in scadenza"
              text="Studia una lezione: i vocaboli nuovi entrano automaticamente nel ciclo di ripasso."
            />
          ) : (
            <ul className="review-list">
              {visible.map((v) => {
                const card = state.srs[v.id];
                return (
                  <li key={v.id}>
                    <div className="rl-word">
                      <span className="rl-emoji">{v.emoji ?? "🔤"}</span>
                      <div>
                        <p className="ko">
                          {v.ko} <span className="romanization">{v.ro}</span>
                        </p>
                        <p className="muted">{v.it}</p>
                        <span className={`tag ${card.last ?? "medium"}`}>
                          {card.last ? difficultyLabel[card.last] : statusLabel[card.status]}
                        </span>
                      </div>
                    </div>
                    <div className="rl-ex">
                      {v.exKo ? (
                        <>
                          <p className="ko small">{v.exKo}</p>
                          <p className="muted small">= {v.exIt}</p>
                        </>
                      ) : (
                        <p className="muted small">{v.ro}</p>
                      )}
                    </div>
                    <div className="rl-meta">
                      <small className="muted">Prossima revisione</small>
                      <b className={card.due <= today ? "due" : ""}>{dueLabel(card.due)}</b>
                      <AudioButton text={v.ko} size="sm" />
                    </div>
                    <div className="rl-actions">
                      {(["hard", "medium", "easy"] as Difficulty[]).map((dd) => (
                        <button key={dd} className={`rate ${dd}`} onClick={() => rate(v.id, dd)}>
                          {difficultyLabel[dd]}
                        </button>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {list.length > 5 && (
            <button className="btn ghost" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Mostra meno" : `Mostra altre ${list.length - 5} parole ▾`}
            </button>
          )}
        </Card>

        <div className="col">
          <Card className="pad">
            <CardTitle title="Come funziona lo spaced repetition" />
            <ul className="srs-legend">
              {(["hard", "medium", "easy"] as Difficulty[]).map((dd) => (
                <li key={dd}>
                  <span className={`dot ${dd}`} />
                  <div>
                    <strong>{difficultyLabel[dd]}</strong>
                    <small className="muted">{difficultyHint[dd]}</small>
                  </div>
                </li>
              ))}
            </ul>
            <p className="muted small">
              Ogni vocabolo passa da Nuovo → In apprendimento → Da ripassare → Imparato. Le parole
              sbagliate tornano subito in cima.
            </p>
          </Card>

          <Card className="pad">
            <CardTitle title="Prossimi 14 giorni" />
            <div className="cal-strip">
              {upcoming.map((u) => (
                <div key={u.key} className="cal-day" title={`${u.count} parole`}>
                  <span className={`cal-dot ${u.count > 8 ? "many" : u.count > 0 ? "some" : ""}`} />
                  <small>{u.day}</small>
                </div>
              ))}
            </div>
            <div className="cal-legend">
              <span>
                <i className="cal-dot many" /> molte parole
              </span>
              <span>
                <i className="cal-dot some" /> poche parole
              </span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export const reviewVocabById = getVocab;
