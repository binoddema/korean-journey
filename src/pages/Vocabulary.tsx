import React from "react";
import { useStore } from "../store";
import { ALL_VOCAB, TOPICS, UNITS, TOTAL_BANK } from "../data";
import type { ParsedUnit } from "../data/bank";
import { buildUnitDrill } from "../lib/exercises";
import { statusLabel } from "../lib/srs";
import type { RuntimeExercise, Vocab } from "../types";
import { AudioButton, Bar, Card, CardTitle, Empty, VocabCard } from "../components/ui";
import { PageHeader } from "../components/Layout";
import { ExerciseSession, type SessionSummary } from "../components/Exercise";

type Mode =
  | { kind: "browse" }
  | { kind: "study"; unit: ParsedUnit; words: Vocab[]; index: number }
  | { kind: "drill"; unit: ParsedUnit; items: RuntimeExercise[] };

export const Vocabulary = () => {
  const { state, seeVocab } = useStore();
  const [mode, setMode] = React.useState<Mode>({ kind: "browse" });
  const [topic, setTopic] = React.useState<number | "all">("all");
  const [tag, setTag] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [openUnit, setOpenUnit] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<SessionSummary | null>(null);

  const stats = (u: ParsedUnit) => {
    const seen = u.words.filter((w) => state.srs[w.id]).length;
    const learned = u.words.filter((w) => state.srs[w.id]?.status === "learned").length;
    return { seen, learned, pct: Math.round((seen / Math.max(1, u.words.length)) * 100) };
  };

  const units = UNITS.filter(
    (u) => (topic === "all" || u.topic === topic) && (!tag || u.tag === tag)
  );

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return ALL_VOCAB.filter(
      (v) =>
        v.ko.includes(q) ||
        v.ro.toLowerCase().includes(q) ||
        v.it.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [query]);

  const startStudy = (u: ParsedUnit) => {
    const fresh = u.words.filter((w) => !state.srs[w.id]);
    const words = (fresh.length ? fresh : u.words).slice(0, state.settings.newPerDay);
    seeVocab(words.map((w) => w.id));
    setMode({ kind: "study", unit: u, words, index: 0 });
  };

  const startDrill = (u: ParsedUnit, onlySeen: boolean) => {
    const pool = onlySeen ? u.words.filter((w) => state.srs[w.id]) : u.words;
    const words = [...pool].sort(() => Math.random() - 0.5).slice(0, 15);
    // gli esercizi si generano una volta sola: la sessione non deve cambiare a ogni risposta
    setSummary(null);
    setMode({ kind: "drill", unit: u, items: buildUnitDrill(words, state.settings.difficulty) });
  };

  /* ---------- sessione flashcard ---------- */
  if (mode.kind === "study") {
    const v = mode.words[mode.index];
    const last = mode.index + 1 >= mode.words.length;
    return (
      <>
        <PageHeader
          icon={mode.unit.emoji}
          title={mode.unit.title}
          sub={`Parola ${mode.index + 1} di ${mode.words.length}`}
        />
        <Card className="pad">
          <Bar value={((mode.index + 1) / mode.words.length) * 100} />
          <div className="study-card">
            <VocabCard v={v} index={mode.index} />
          </div>
          <div className="row-between">
            <button
              className="btn ghost"
              disabled={mode.index === 0}
              onClick={() => setMode({ ...mode, index: mode.index - 1 })}
            >
              ← Precedente
            </button>
            {last ? (
              <button className="btn primary" onClick={() => startDrill(mode.unit, true)}>
                Mettiti alla prova →
              </button>
            ) : (
              <button className="btn primary" onClick={() => setMode({ ...mode, index: mode.index + 1 })}>
                Prossima →
              </button>
            )}
          </div>
          <button className="btn ghost sm" onClick={() => setMode({ kind: "browse" })}>
            Torna alla banca vocaboli
          </button>
        </Card>
      </>
    );
  }

  /* ---------- sessione di esercizi su un'unità ---------- */
  if (mode.kind === "drill") {
    const items = mode.items;
    return (
      <>
        <PageHeader icon={mode.unit.emoji} title={mode.unit.title} sub="Allenamento sull'unità" />
        <Card className="pad">
          {summary ? (
            <div className="mini-result">
              <h2>
                Score: {summary.correct}/{summary.total}
              </h2>
              <p className="muted">
                Le parole sbagliate sono già in coda per il ripasso di oggi.
              </p>
              <div className="row">
                <button className="btn primary" onClick={() => startDrill(mode.unit, true)}>
                  Un altro giro
                </button>
                <button className="btn ghost" onClick={() => setMode({ kind: "browse" })}>
                  Torna alla banca
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <Empty
              emoji="📭"
              title="Nessuna parola da allenare"
              text="Studia prima qualche parola di questa unità."
              action={
                <button className="btn primary" onClick={() => startStudy(mode.unit)}>
                  Studia le parole
                </button>
              }
            />
          ) : (
            <ExerciseSession
              items={items}
              isReview
              onDone={setSummary}
              onQuit={() => setMode({ kind: "browse" })}
            />
          )}
        </Card>
      </>
    );
  }

  /* ---------- elenco unità ---------- */
  const totalSeen = ALL_VOCAB.filter((v) => state.srs[v.id]).length;

  return (
    <>
      <PageHeader
        icon="📔"
        title="Vocabolario"
        sub={`${TOTAL_BANK} parole tematiche oltre a quelle delle lezioni`}
      />

      <Card className="pad">
        <div className="vocab-toolbar">
          <input
            className="ex-input"
            placeholder="Cerca in coreano, in romanizzazione o in italiano…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="filters">
            <button
              className={`filter ${tag === "verbi" ? "on" : ""}`}
              onClick={() => setTag(tag === "verbi" ? null : "verbi")}
            >
              🏃 Solo verbi
            </button>
            <button
              className={`filter ${tag === "gioielleria" ? "on" : ""}`}
              onClick={() => setTag(tag === "gioielleria" ? null : "gioielleria")}
            >
              💎 Gioielleria
            </button>
            <button className={`filter ${topic === "all" ? "on" : ""}`} onClick={() => setTopic("all")}>
              Tutti i topic
            </button>
            {TOPICS.map((t) => (
              <button
                key={t.id}
                className={`filter ${topic === t.id ? "on" : ""}`}
                onClick={() => setTopic(t.id)}
              >
                {t.emoji} {t.short}
              </button>
            ))}
          </div>
        </div>
        <p className="muted small">
          {totalSeen} parole già incontrate su {ALL_VOCAB.length} disponibili.
        </p>
      </Card>

      {query.trim() && (
        <Card className="pad">
          <CardTitle title={`Risultati (${results.length})`} />
          {results.length === 0 ? (
            <p className="muted">Nessuna parola trovata.</p>
          ) : (
            <ul className="search-list">
              {results.map((v) => (
                <li key={v.id}>
                  <span className="ko">{v.ko}</span>
                  <span className="romanization">{v.ro}</span>
                  <span>{v.it}</span>
                  <span className="muted small">
                    {state.srs[v.id] ? statusLabel[state.srs[v.id].status] : "Nuovo"}
                  </span>
                  <AudioButton text={v.ko} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <div className="unit-grid">
        {units.map((u) => {
          const st = stats(u);
          const t = TOPICS.find((x) => x.id === u.topic)!;
          const isOpen = openUnit === u.id;
          return (
            <Card key={u.id} className="pad unit-card">
              <div className="unit-head">
                <span className="unit-emoji" style={{ background: `${t.color}1a` }}>
                  {u.emoji}
                </span>
                <div className="unit-main">
                  <strong>{u.title}</strong>
                  <small className="muted">{u.desc}</small>
                  <small className="muted">
                    Topic {u.topic} · {u.words.length} parole · {st.learned} imparate
                  </small>
                </div>
              </div>
              <div className="row-progress">
                <Bar value={st.pct} color={t.color} />
                <span>{st.pct}%</span>
              </div>
              <div className="row">
                <button className="btn primary sm" onClick={() => startStudy(u)}>
                  Studia {Math.min(state.settings.newPerDay, Math.max(1, u.words.length - st.seen))} nuove
                </button>
                <button className="btn outline sm" onClick={() => startDrill(u, false)}>
                  Allenati
                </button>
                <button className="btn ghost sm" onClick={() => setOpenUnit(isOpen ? null : u.id)}>
                  {isOpen ? "Nascondi" : "Vedi parole"}
                </button>
              </div>
              {isOpen && (
                <ul className="word-list">
                  {u.words.map((w) => (
                    <li key={w.id}>
                      <span className="ko">
                        {w.emoji ? `${w.emoji} ` : ""}
                        {w.ko}
                      </span>
                      <span className="romanization">{w.ro}</span>
                      <span>{w.it}</span>
                      <span className={`mini-tag ${state.srs[w.id]?.status ?? "new"}`}>
                        {state.srs[w.id] ? statusLabel[state.srs[w.id].status] : "Nuovo"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
};
