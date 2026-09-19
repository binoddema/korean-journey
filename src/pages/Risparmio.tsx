import React from "react";
import { Avanzamento, Testa, Vuoto } from "../components/Sezione";
import {
  ARCHIVIO,
  dataBreve,
  euro,
  nuovoId,
  oggiISO,
  usaArchivio,
} from "../lib/archivio";

interface Movimento {
  id: string;
  data: string;
  tipo: "risparmio" | "spesa";
  importo: number;
  categoria: string;
  nota?: string;
}
interface Stato {
  obiettivo: number;
  movimenti: Movimento[];
}
const INIZIALE: Stato = { obiettivo: 15000, movimenti: [] };

const CATEGORIE = [
  { nome: "Corea", icona: "✈️" },
  { nome: "Università", icona: "🎓" },
  { nome: "Casa", icona: "🏠" },
  { nome: "Cibo", icona: "🍜" },
  { nome: "Materiali", icona: "💎" },
  { nome: "Svago", icona: "🎧" },
  { nome: "Altro", icona: "•" },
];

export const Risparmio = () => {
  const [stato, aggiorna] = usaArchivio<Stato>(ARCHIVIO.risparmio, INIZIALE);
  const [tipo, setTipo] = React.useState<"risparmio" | "spesa">("risparmio");
  const [importo, setImporto] = React.useState("");
  const [categoria, setCategoria] = React.useState("Corea");
  const [nota, setNota] = React.useState("");
  const [modifica, setModifica] = React.useState(false);

  const messiDaParte = stato.movimenti
    .filter((m) => m.tipo === "risparmio")
    .reduce((t, m) => t + m.importo, 0);
  const spesi = stato.movimenti
    .filter((m) => m.tipo === "spesa")
    .reduce((t, m) => t + m.importo, 0);
  const totale = messiDaParte - spesi;
  const pct = stato.obiettivo > 0 ? (totale / stato.obiettivo) * 100 : 0;
  const manca = Math.max(0, stato.obiettivo - totale);

  const perCategoria = CATEGORIE.map((c) => ({
    ...c,
    somma: stato.movimenti
      .filter((m) => m.categoria === c.nome)
      .reduce((t, m) => t + (m.tipo === "risparmio" ? m.importo : -m.importo), 0),
  })).filter((c) => c.somma !== 0);

  const aggiungi = () => {
    const n = Number(importo.replace(",", "."));
    if (!n || n <= 0) return;
    const m: Movimento = {
      id: nuovoId(),
      data: oggiISO(),
      tipo,
      importo: Math.round(n * 100) / 100,
      categoria,
      nota: nota.trim() || undefined,
    };
    aggiorna((v) => ({ ...v, movimenti: [m, ...v.movimenti] }));
    setImporto("");
    setNota("");
  };

  const elimina = (id: string) =>
    aggiorna((v) => ({ ...v, movimenti: v.movimenti.filter((m) => m.id !== id) }));

  return (
    <div>
      <Testa icona="🐷" tinta="risparmio" titolo="Risparmio" sotto="Il tuo futuro inizia oggi." />

      <section className="riquadro">
        <div className="riquadro-testa">
          <h2>Obiettivo</h2>
          <button className="btn-mini" onClick={() => setModifica((v) => !v)}>
            {modifica ? "Fatto" : "Cambia"}
          </button>
        </div>

        {modifica ? (
          <label className="campo">
            <span>Quanto vuoi mettere da parte</span>
            <input
              type="number"
              inputMode="decimal"
              value={stato.obiettivo}
              onChange={(e) => aggiorna({ obiettivo: Number(e.target.value) || 0 })}
            />
          </label>
        ) : (
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 10px" }}>
            {euro(stato.obiettivo)}
          </p>
        )}

        <Avanzamento
          valore={pct}
          colore="var(--t-risparmio)"
          sinistra={`${euro(totale)} messi da parte`}
          destra={`${Math.round(pct)}%`}
        />
        <p className="small muted" style={{ marginTop: 10 }}>
          {manca > 0
            ? `Mancano ${euro(manca)} all'obiettivo.`
            : "Obiettivo raggiunto. Puoi alzarlo o iniziare a spendere per la partenza."}
        </p>
      </section>

      <section className="riquadro">
        <h2>Registra un movimento</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            className={`btn-mini ${tipo === "risparmio" ? "attivo" : ""}`}
            onClick={() => setTipo("risparmio")}
          >
            + Risparmio
          </button>
          <button
            className={`btn-mini ${tipo === "spesa" ? "attivo" : ""}`}
            onClick={() => setTipo("spesa")}
          >
            − Spesa
          </button>
        </div>
        <div className="campi-2">
          <label className="campo">
            <span>Importo</span>
            <input
              type="number"
              inputMode="decimal"
              value={importo}
              onChange={(e) => setImporto(e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="campo">
            <span>Categoria</span>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {CATEGORIE.map((c) => (
                <option key={c.nome}>{c.nome}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="campo">
          <span>Nota</span>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Facoltativa" />
        </label>
        <button className="btn-pieno" onClick={aggiungi} disabled={!importo}>
          Aggiungi
        </button>
      </section>

      {perCategoria.length > 0 && (
        <section className="riquadro">
          <h2>Per categoria</h2>
          {perCategoria.map((c) => (
            <div className="riga" key={c.nome}>
              <span className="riga-icona" style={{ background: "var(--t-risparmio-b)" }}>
                {c.icona}
              </span>
              <span className="riga-corpo">
                <strong>{c.nome}</strong>
              </span>
              <span
                className="riga-fine"
                style={{ color: c.somma >= 0 ? "var(--green)" : "var(--red)" }}
              >
                {c.somma >= 0 ? "+" : "−"} {euro(Math.abs(c.somma))}
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="riquadro">
        <h2>Cronologia</h2>
        {stato.movimenti.length === 0 ? (
          <Vuoto icona="💶" testo="Nessun movimento. Registra il primo risparmio qui sopra." />
        ) : (
          stato.movimenti.slice(0, 40).map((m) => (
            <div className="riga" key={m.id}>
              <span
                className="riga-icona"
                style={{
                  background: m.tipo === "risparmio" ? "var(--t-sport-b)" : "var(--t-diario-b)",
                }}
              >
                {m.tipo === "risparmio" ? "🐷" : "🧾"}
              </span>
              <span className="riga-corpo">
                <strong>{m.nota || m.categoria}</strong>
                <small>
                  {dataBreve(m.data)} · {m.categoria}
                </small>
              </span>
              <span
                className="riga-fine"
                style={{ color: m.tipo === "risparmio" ? "var(--green)" : "var(--red)" }}
              >
                {m.tipo === "risparmio" ? "+" : "−"} {euro(m.importo)}
              </span>
              <button className="btn-mini" onClick={() => elimina(m.id)} aria-label="Elimina">
                ✕
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
