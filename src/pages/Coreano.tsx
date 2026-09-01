import React from "react";
import { useStore } from "../store";
import { derive } from "../lib/progress";
import { Card } from "../components/ui";
import { PageHeader, type Page } from "../components/Layout";

const VOCI: { id: Page; icon: string; titolo: string; sotto: string }[] = [
  { id: "review", icon: "🧠", titolo: "Ripasso", sotto: "Le parole che scadono oggi" },
  { id: "courses", icon: "📚", titolo: "Corsi", sotto: "Lezioni guidate, una alla volta" },
  { id: "exercises", icon: "✏️", titolo: "Esercizi", sotto: "Allenamento libero sui vocaboli" },
  { id: "vocab", icon: "📔", titolo: "Vocabolario", sotto: "Tutte le unità tematiche" },
];

export const Coreano = ({ onNav }: { onNav: (p: Page) => void }) => {
  const { state } = useStore();
  const d = derive(state);

  return (
    <>
      <PageHeader
        icon="한"
        title="Coreano"
        sub={
          d.dueWords > 0
            ? `${d.dueWords} parole da ripassare oggi`
            : "Ripasso in pari"
        }
      />

      <div className="griglia-coreano">
        {VOCI.map((v) => (
          <Card key={v.id} className="pad">
            <button className="voce-coreano" onClick={() => onNav(v.id)}>
              <span className="vc-icona">{v.icon}</span>
              <span className="vc-testo">
                <strong>{v.titolo}</strong>
                <small className="muted">{v.sotto}</small>
              </span>
              {v.id === "review" && d.dueWords > 0 && (
                <span className="vc-badge">{d.dueWords}</span>
              )}
              <span className="vc-freccia">›</span>
            </button>
          </Card>
        ))}
      </div>
    </>
  );
};
