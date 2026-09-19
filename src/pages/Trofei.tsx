import React from "react";
import { Avanzamento, Testa } from "../components/Sezione";
import { useStore } from "../store";
import { derive, levelInfo } from "../lib/progress";
import { quadro } from "../lib/quadro";

interface Trofeo {
  id: string;
  nome: string;
  icona: string;
  come: string;
  vinto: boolean;
}

export const Trofei = () => {
  const { state } = useStore();
  const d = derive(state);
  const q = quadro(state, d);
  const lvl = levelInfo(state.xp);

  const lista: Trofeo[] = [
    { id: "t1", nome: "Primo passo", icona: "🌱", come: "Prima lezione finita", vinto: state.completedLessons.length >= 1 },
    { id: "t2", nome: "Sette di fila", icona: "🔥", come: "7 giorni consecutivi", vinto: state.bestStreak >= 7 },
    { id: "t3", nome: "Trenta di fila", icona: "🌋", come: "30 giorni consecutivi", vinto: state.bestStreak >= 30 },
    { id: "t4", nome: "Cento parole", icona: "📚", come: "100 vocaboli imparati", vinto: d.learnedWords >= 100 },
    { id: "t5", nome: "Mille XP", icona: "⭐", come: "1000 XP totali", vinto: state.xp >= 1000 },
    { id: "t6", nome: "Livello 10", icona: "🏅", come: "Arriva al livello 10", vinto: lvl.level >= 10 },
    { id: "t7", nome: "Mano ferma", icona: "✏️", come: "5 ore di design", vinto: q.design.minutiSettimana >= 0 && state.totals.minutes >= 300 },
    { id: "t8", nome: "Primo progetto", icona: "💎", come: "Un lavoro nel portfolio", vinto: q.portfolio.progetti >= 1 },
    { id: "t9", nome: "Portfolio vero", icona: "🖼", come: "10 lavori nel portfolio", vinto: q.portfolio.progetti >= 10 },
    { id: "t10", nome: "Primo decimo", icona: "🐷", come: "10% dell'obiettivo di risparmio", vinto: q.risparmio.pct >= 10 },
    { id: "t11", nome: "Metà strada", icona: "💰", come: "50% dell'obiettivo di risparmio", vinto: q.risparmio.pct >= 50 },
    { id: "t12", nome: "Costanza", icona: "📔", come: "30 pagine di diario", vinto: q.diario.pagine >= 30 },
    { id: "t13", nome: "Corpo pronto", icona: "🏋️", come: "3 allenamenti in una settimana", vinto: q.sport.giorniSettimana >= 3 },
    { id: "t14", nome: "Topic finito", icona: "🇰🇷", come: "Un topic completato", vinto: d.overallPct >= 20 },
  ];

  const vinti = lista.filter((t) => t.vinto).length;

  return (
    <div>
      <Testa icona="🏆" tinta="trofei" titolo="Trofei" sotto="I tuoi traguardi." />

      <section className="riquadro">
        <Avanzamento
          valore={(vinti / lista.length) * 100}
          colore="var(--t-trofei)"
          sinistra={`${vinti} su ${lista.length} sbloccati`}
          destra={`Livello ${lvl.level}`}
        />
      </section>

      <div className="griglia-trofei">
        {lista.map((t) => (
          <div key={t.id} className={`trofeo ${t.vinto ? "" : "chiuso"}`}>
            <span>{t.icona}</span>
            <strong>{t.nome}</strong>
            <small>{t.come}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
