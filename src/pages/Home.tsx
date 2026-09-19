import React from "react";
import { useStore } from "../store";
import { derive, levelInfo } from "../lib/progress";
import { missioni, quadro } from "../lib/quadro";
import { Avanzamento } from "../components/Sezione";
import { SEZIONI, type Page } from "../pagine";
import { dataLunga, euro, oggiISO } from "../lib/archivio";

const saluto = () => {
  const o = new Date().getHours();
  if (o < 6) return "Ancora sveglio";
  if (o < 12) return "Buongiorno";
  if (o < 18) return "Buon pomeriggio";
  return "Buonasera";
};

export const Home = ({
  onNav,
}: {
  onNav: (p: Page) => void;
  onStart?: (id: string) => void;
}) => {
  const { state } = useStore();
  const d = derive(state);
  const q = quadro(state, d);
  const m = missioni(q);
  const lvl = levelInfo(state.xp);
  const principale = m.find((x) => !x.fatto);
  const altre = m.filter((x) => x !== principale);
  const fatte = m.filter((x) => x.fatto).length;

  return (
    <div>
      <header className="saluto">
        <span className="saluto-anelli" />
        <h1>
          {saluto()}
          {state.name ? `, ${state.name}` : ""}
        </h1>
        <p>
          {fatte === m.length
            ? "Tutto fatto per oggi. Domani si continua."
            : `${dataLunga(oggiISO())} · ${fatte} attività su ${m.length} completate.`}
        </p>
      </header>

      <div className="stat-riga">
        <div className="stat-box">
          <b>🔥 {state.streak}</b>
          <small>giorni di fila</small>
        </div>
        <div className="stat-box">
          <b>🏆 {lvl.level}</b>
          <small>livello</small>
        </div>
        <div className="stat-box">
          <b>⭐ {state.xp}</b>
          <small>XP totali</small>
        </div>
      </div>

      {principale && (
        <section className="riquadro">
          <div className="riquadro-testa">
            <h2>Adesso</h2>
            <span className="etichetta" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              la più importante
            </span>
          </div>
          <button className="riga" style={{ borderTop: 0 }} onClick={() => onNav(principale.pagina as Page)}>
            <span className="riga-icona" style={{ background: `var(--t-${principale.tinta}-b)` }}>
              {principale.icona}
            </span>
            <span className="riga-corpo">
              <strong>{principale.titolo}</strong>
              <small>{principale.dettaglio}</small>
            </span>
            <span className="riga-fine">›</span>
          </button>
        </section>
      )}

      <section className="riquadro">
        <h2>Il resto della giornata</h2>
        {altre.map((a) => (
          <button key={a.id} className="riga" onClick={() => onNav(a.pagina as Page)}>
            <span className="riga-icona" style={{ background: `var(--t-${a.tinta}-b)` }}>
              {a.fatto ? "✓" : a.icona}
            </span>
            <span className="riga-corpo">
              <strong style={{ opacity: a.fatto ? 0.55 : 1 }}>{a.titolo}</strong>
              <small>{a.dettaglio}</small>
            </span>
            <span className="riga-fine">›</span>
          </button>
        ))}
      </section>

      {q.calendario.oggi.length > 0 && (
        <section className="riquadro">
          <div className="riquadro-testa">
            <h2>In agenda</h2>
            <button className="btn-mini" onClick={() => onNav("calendario")}>
              Calendario
            </button>
          </div>
          {q.calendario.oggi.map((e, i) => (
            <div className="riga" key={i}>
              <span className="riga-icona" style={{ background: "var(--t-calendario-b)" }}>
                {e.dalle ? "🕐" : "📅"}
              </span>
              <span className="riga-corpo">
                <strong style={{ textDecoration: e.fatto ? "line-through" : "none" }}>{e.titolo}</strong>
                <small>
                  {e.dalle ? `${e.dalle} · ` : ""}
                  {e.categoria}
                </small>
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="riquadro">
        <h2>Le tue sezioni</h2>
        <div className="griglia-sezioni">
          {SEZIONI.filter((s) => s.id !== "settings").map((s) => (
            <button key={s.id} className="tessera" onClick={() => onNav(s.id)}>
              <span className="tessera-icona" style={{ background: `var(--t-${s.tinta}-b)` }}>
                {s.icona}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="riquadro">
        <h2>A che punto sei</h2>
        <div style={{ marginBottom: 14 }}>
          <Avanzamento
            valore={lvl.pct}
            colore="var(--t-coreano)"
            sinistra="Coreano"
            destra={lvl.next ? `${state.xp} / ${lvl.next} XP` : "livello massimo"}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Avanzamento
            valore={q.risparmio.pct}
            colore="var(--t-risparmio)"
            sinistra="Risparmio"
            destra={`${euro(q.risparmio.totale)} / ${euro(q.risparmio.obiettivo)}`}
          />
        </div>
        <Avanzamento
          valore={Math.min(100, q.portfolio.progetti * 10)}
          colore="var(--t-portfolio)"
          sinistra="Portfolio"
          destra={`${q.portfolio.progetti} progetti`}
        />
      </section>
    </div>
  );
};
