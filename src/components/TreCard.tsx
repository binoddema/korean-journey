import React from "react";
import { Card } from "./ui";
import type { Page } from "./Layout";
import { esercizioDelGiorno } from "../data/design";
import { SCHEDE, trova } from "../data/sport";

/* ------------------------------------------------------------------
   Legge gli archivi di design e sport senza passare dallo store
   del coreano: restano tre sezioni indipendenti.
   ------------------------------------------------------------------ */

function sessioniDesign(): { esercizioId: string; data: string }[] {
  try {
    const s = localStorage.getItem("design-v1");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function statoSport(): { storico: { data: string; esercizioId: string }[] } {
  try {
    const s = localStorage.getItem("sport-v1");
    return s ? JSON.parse(s) : { storico: [] };
  } catch {
    return { storico: [] };
  }
}

/** La scheda proposta è quella successiva all'ultima registrata. */
function schedaDiOggi(storico: { esercizioId: string }[]) {
  const ultimo = storico[0];
  if (!ultimo) return SCHEDE[0];
  const i = SCHEDE.findIndex((s) => s.esercizi.includes(ultimo.esercizioId));
  if (i < 0) return SCHEDE[0];
  return SCHEDE[(i + 1) % SCHEDE.length];
}

const oggiISO = () => new Date().toISOString().slice(0, 10);

export const TreCard = ({
  onNav,
  onStartLezione,
  lezione,
  parole,
}: {
  onNav: (p: Page) => void;
  onStartLezione: () => void;
  lezione: string;
  parole: number;
}) => {
  const design = sessioniDesign();
  const sport = statoSport();

  const esDesign = esercizioDelGiorno(
    new Date(),
    design.map((s) => s.esercizioId)
  );
  const designFatto = design.some((s) => s.data === oggiISO());

  const scheda = schedaDiOggi(sport.storico);
  const sportFattoOggi = sport.storico.some((r) => r.data === oggiISO());
  const primo = trova(scheda.esercizi[0]);

  return (
    <div className="tre-card">
      <Card className="pad tc-blocco">
        <span className="tc-eti tc-kr">Coreano</span>
        <strong className="tc-titolo">{lezione}</strong>
        <small className="muted">
          {parole > 0 ? `${parole} parole da ripassare prima` : "Ripasso in pari"}
        </small>
        <button className="btn primary" onClick={onStartLezione}>
          Inizia la lezione
        </button>
      </Card>

      <Card className="pad tc-blocco">
        <span className="tc-eti tc-ds">Design</span>
        <strong className="tc-titolo">{esDesign.titolo}</strong>
        <small className="muted">
          {designFatto ? "Sessione di oggi già registrata" : `${esDesign.minuti} minuti`}
        </small>
        <button className="btn outline" onClick={() => onNav("design")}>
          {designFatto ? "Fai un'altra sessione" : "Apri"}
        </button>
      </Card>

      <Card className="pad tc-blocco">
        <span className="tc-eti tc-sp">Allenamento</span>
        <strong className="tc-titolo">{scheda.nome.replace(" — ", ": ")}</strong>
        <small className="muted">
          {sportFattoOggi
            ? "Oggi hai già registrato qualcosa"
            : primo
            ? `Si comincia da ${primo.nome.toLowerCase()}`
            : `${scheda.esercizi.length} esercizi`}
        </small>
        <button className="btn outline" onClick={() => onNav("sport")}>
          Apri
        </button>
      </Card>
    </div>
  );
};
