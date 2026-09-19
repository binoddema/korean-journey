import React from "react";

/** Testata colorata che apre ogni sezione. */
export const Testa = ({
  icona,
  tinta,
  titolo,
  sotto,
}: {
  icona: string;
  tinta: string;
  titolo: string;
  sotto?: string;
}) => (
  <header className="sez-testa">
    <span className="sez-icona" style={{ background: `var(--t-${tinta}-b)` }}>
      {icona}
    </span>
    <div>
      <h1>{titolo}</h1>
      {sotto && <p>{sotto}</p>}
    </div>
  </header>
);

/** Barra di avanzamento con etichette ai due lati. */
export const Avanzamento = ({
  valore,
  colore,
  sinistra,
  destra,
}: {
  valore: number;
  colore?: string;
  sinistra?: string;
  destra?: string;
}) => (
  <div>
    <div className="avanz">
      <i
        style={{
          width: `${Math.max(0, Math.min(100, valore))}%`,
          background: colore,
        }}
      />
    </div>
    {(sinistra || destra) && (
      <div className="avanz-testo">
        <span>{sinistra}</span>
        <span>{destra}</span>
      </div>
    )}
  </div>
);

/** Schermata vuota: dice cosa fare, non si limita a dire che non c'è nulla. */
export const Vuoto = ({ icona, testo }: { icona: string; testo: string }) => (
  <div className="vuoto">
    <span>{icona}</span>
    {testo}
  </div>
);
