import React from "react";
import { useStore } from "../store";
import { derive } from "../lib/progress";
import { Avanzamento, Testa } from "../components/Sezione";
import type { Page } from "../pagine";

const VOCI: { id: Page; icona: string; titolo: string; sotto: string }[] = [
  { id: "review", icona: "🧠", titolo: "Ripasso", sotto: "Le parole che scadono oggi" },
  { id: "courses", icona: "📚", titolo: "Lezioni", sotto: "Il percorso guidato, una alla volta" },
  { id: "exercises", icona: "✏️", titolo: "Esercizi", sotto: "Allenamento libero sui vocaboli" },
  { id: "vocab", icona: "📔", titolo: "Vocabolario", sotto: "Tutte le unità tematiche" },
  { id: "progress", icona: "📊", titolo: "Progressi", sotto: "Grafici e precisione" },
  { id: "goals", icona: "🎯", titolo: "Obiettivi", sotto: "Ritmo mensile e data della Corea" },
];

/* Scala indicativa: i livelli TOPIK ufficiali si misurano con l'esame,
   qui servono solo a dare un orizzonte al percorso. */
const SCALA = [
  { nome: "Hangeul", parole: 0 },
  { nome: "TOPIK 1", parole: 60 },
  { nome: "TOPIK 2", parole: 160 },
  { nome: "TOPIK 3", parole: 400 },
  { nome: "TOPIK 4", parole: 800 },
  { nome: "TOPIK 5", parole: 1400 },
  { nome: "TOPIK 6", parole: 2200 },
];

export const Coreano = ({ onNav }: { onNav: (p: Page) => void }) => {
  const { state } = useStore();
  const d = derive(state);

  const indice = Math.max(
    0,
    SCALA.filter((s) => d.learnedWords >= s.parole).length - 1
  );
  const attuale = SCALA[indice];
  const prossimo = SCALA[indice + 1];
  const pct = prossimo
    ? ((d.learnedWords - attuale.parole) / (prossimo.parole - attuale.parole)) * 100
    : 100;

  return (
    <div>
      <Testa
        icona="🇰🇷"
        tinta="coreano"
        titolo="Coreano"
        sotto={d.dueWords > 0 ? `${d.dueWords} parole da ripassare oggi` : "Ripasso in pari."}
      />

      <section className="riquadro">
        <p className="small muted" style={{ margin: 0 }}>
          Livello stimato
        </p>
        <h2 style={{ fontSize: "1.6rem", margin: "2px 0 12px" }}>{attuale.nome}</h2>
        <Avanzamento
          valore={pct}
          colore="var(--t-coreano)"
          sinistra={`${d.learnedWords} parole imparate`}
          destra={prossimo ? `${prossimo.parole} per ${prossimo.nome}` : "scala completata"}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {SCALA.slice(1).map((s, i) => (
            <span
              key={s.nome}
              className="etichetta"
              style={{
                background: i + 1 <= indice ? "var(--t-coreano)" : "var(--t-coreano-b)",
                color: i + 1 <= indice ? "#fff" : "var(--text)",
              }}
            >
              {s.nome.replace("TOPIK ", "T")}
            </span>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>
          La scala è indicativa: il livello ufficiale si ottiene solo con l'esame TOPIK.
        </p>
      </section>

      <section className="riquadro">
        <h2>Studio di oggi</h2>
        {VOCI.map((v) => (
          <button key={v.id} className="riga" onClick={() => onNav(v.id)}>
            <span className="riga-icona" style={{ background: "var(--t-coreano-b)" }}>
              {v.icona}
            </span>
            <span className="riga-corpo">
              <strong>{v.titolo}</strong>
              <small>{v.sotto}</small>
            </span>
            {v.id === "review" && d.dueWords > 0 && (
              <span className="etichetta" style={{ background: "var(--t-coreano)", color: "#fff" }}>
                {d.dueWords}
              </span>
            )}
            <span className="riga-fine">›</span>
          </button>
        ))}
      </section>

      <section className="riquadro">
        <h2>I topic</h2>
        {Object.entries(d.topicWords).map(([n, w]) => (
          <div key={n} style={{ marginBottom: 14 }}>
            <Avanzamento
              valore={w.total ? (w.learned / w.total) * 100 : 0}
              colore="var(--t-coreano)"
              sinistra={`Topic ${n}`}
              destra={`${w.learned} / ${w.total} parole`}
            />
          </div>
        ))}
      </section>
    </div>
  );
};
