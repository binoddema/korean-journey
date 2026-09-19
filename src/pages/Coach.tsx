import React from "react";
import { Testa } from "../components/Sezione";
import { useStore } from "../store";
import { derive } from "../lib/progress";
import { missioni, quadro } from "../lib/quadro";
import { dataLunga, euro } from "../lib/archivio";
import type { Page } from "../pagine";

/**
 * Il coach non inventa: legge quello che hai fatto davvero e dice una cosa
 * alla volta. Niente frasi di incoraggiamento generiche.
 */
export const Coach = ({ onNav }: { onNav: (p: Page) => void }) => {
  const { state } = useStore();
  const d = derive(state);
  const q = quadro(state, d);
  const m = missioni(q);
  const prima = m.find((x) => !x.fatto);
  const fatte = m.filter((x) => x.fatto).length;

  const giudizio = () => {
    if (fatte === m.length) return "Giornata piena. Chiudi qui e riposa: domani serve la stessa costanza, non il doppio.";
    if (q.coreano.daRipassare > 12)
      return `Hai ${q.coreano.daRipassare} parole in scadenza. Il ripasso viene prima di tutto: senza, quelle di ieri si perdono e il lavoro fatto si annulla.`;
    if (fatte === 0) return "Non hai ancora iniziato. Fai solo la prima attività: quindici minuti valgono più di un piano perfetto rimandato.";
    return "Sei a metà. Finisci quello che conta di più e lascia stare il resto se il tempo è poco.";
  };

  const osservazioni: string[] = [];
  if (q.sport.giorniSettimana === 0) osservazioni.push("Nessun allenamento negli ultimi sette giorni.");
  if (q.design.minutiSettimana < 60)
    osservazioni.push(
      `Design: ${q.design.minutiSettimana} minuti in una settimana. Per il portfolio universitario non basta.`
    );
  if (q.portfolio.progetti === 0)
    osservazioni.push("Il portfolio è vuoto. È il documento che pesa di più in ammissione.");
  if (q.risparmio.pct < 5)
    osservazioni.push(`Risparmio fermo a ${euro(q.risparmio.totale)} sull'obiettivo.`);
  if (q.universita.prossima)
    osservazioni.push(
      `Scadenza: ${q.universita.prossima.titolo}, ${dataLunga(q.universita.prossima.data)}.`
    );

  return (
    <div>
      <Testa icona="🧭" tinta="coach" titolo="Coach" sotto="Cosa conta adesso." />

      <div className="coach-bolla">
        <p>{giudizio()}</p>
      </div>

      {prima && (
        <section className="riquadro">
          <h2>Fai questo, adesso</h2>
          <button
            className="riga"
            onClick={() => onNav(prima.pagina as Page)}
            style={{ borderTop: 0 }}
          >
            <span className="riga-icona" style={{ background: `var(--t-${prima.tinta}-b)` }}>
              {prima.icona}
            </span>
            <span className="riga-corpo">
              <strong>{prima.titolo}</strong>
              <small>{prima.dettaglio}</small>
            </span>
            <span className="riga-fine">›</span>
          </button>
        </section>
      )}

      <section className="riquadro">
        <h2>Come stai andando</h2>
        {osservazioni.length === 0 ? (
          <p className="muted">
            Nessun ritardo da segnalare. Tieni questo ritmo: è quello che ti porta in Corea.
          </p>
        ) : (
          osservazioni.map((o, i) => (
            <div className="riga" key={i}>
              <span className="riga-icona" style={{ background: "var(--t-coach-b)" }}>
                !
              </span>
              <span className="riga-corpo">{o}</span>
            </div>
          ))
        )}
      </section>

      <section className="riquadro">
        <h2>La settimana</h2>
        <div className="riga">
          <span className="riga-icona" style={{ background: "var(--t-coreano-b)" }}>🇰🇷</span>
          <span className="riga-corpo">
            <strong>Coreano</strong>
            <small>{state.streak} giorni di fila · {state.xp} XP</small>
          </span>
        </div>
        <div className="riga">
          <span className="riga-icona" style={{ background: "var(--t-design-b)" }}>🎨</span>
          <span className="riga-corpo">
            <strong>Design</strong>
            <small>{q.design.minutiSettimana} minuti in 7 giorni</small>
          </span>
        </div>
        <div className="riga">
          <span className="riga-icona" style={{ background: "var(--t-sport-b)" }}>🏋️</span>
          <span className="riga-corpo">
            <strong>Sport</strong>
            <small>{q.sport.giorniSettimana} allenamenti in 7 giorni</small>
          </span>
        </div>
      </section>
    </div>
  );
};
