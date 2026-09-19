import React from "react";
import { Testa, Vuoto } from "../components/Sezione";
import {
  ARCHIVIO,
  comprimiFoto,
  dataBreve,
  nuovoId,
  oggiISO,
  SPAZIO_PIENO,
  usaArchivio,
} from "../lib/archivio";

interface Progetto {
  id: string;
  titolo: string;
  categoria: string;
  stato: string;
  data: string;
  foto?: string;
  concept?: string;
  materiali?: string;
  note?: string;
}
interface Stato {
  progetti: Progetto[];
}
const INIZIALE: Stato = { progetti: [] };

const CATEGORIE = ["Anello", "Collana", "Orecchini", "Bracciale", "Concept", "Disegno", "Altro"];
const STATI = ["Idea", "In sviluppo", "Completato", "Da migliorare", "Portfolio finale"];

const COLORE_STATO: Record<string, string> = {
  Idea: "var(--t-calendario-b)",
  "In sviluppo": "var(--t-design-b)",
  Completato: "var(--t-sport-b)",
  "Da migliorare": "var(--t-diario-b)",
  "Portfolio finale": "var(--t-trofei-b)",
};

export const Portfolio = () => {
  const [stato, aggiorna] = usaArchivio<Stato>(ARCHIVIO.portfolio, INIZIALE);
  const [aperto, setAperto] = React.useState<Progetto | null>(null);
  const [nuovo, setNuovo] = React.useState(false);
  const [errore, setErrore] = React.useState("");
  const [bozza, setBozza] = React.useState<Progetto>({
    id: "",
    titolo: "",
    categoria: "Anello",
    stato: "Idea",
    data: oggiISO(),
  });

  const apriNuovo = () => {
    setBozza({ id: nuovoId(), titolo: "", categoria: "Anello", stato: "Idea", data: oggiISO() });
    setNuovo(true);
  };

  const salva = () => {
    if (!bozza.titolo.trim()) return;
    aggiorna((v) => ({
      progetti: [bozza, ...v.progetti.filter((p) => p.id !== bozza.id)],
    }));
    setNuovo(false);
    setAperto(null);
  };

  const elimina = (id: string) => {
    aggiorna((v) => ({ progetti: v.progetti.filter((p) => p.id !== id) }));
    setAperto(null);
  };

  const scegliFoto = async (f?: File) => {
    if (!f) return;
    try {
      setBozza((b) => ({ ...b, foto: "" }));
      const dato = await comprimiFoto(f);
      setBozza((b) => ({ ...b, foto: dato }));
      setErrore("");
    } catch {
      setErrore(SPAZIO_PIENO);
    }
  };

  const conta = (s: string) => stato.progetti.filter((p) => p.stato === s).length;

  return (
    <div>
      <Testa icona="💼" tinta="portfolio" titolo="Portfolio" sotto="Mostra il tuo talento." />

      <section className="riquadro">
        <div className="riquadro-testa">
          <h2>{stato.progetti.length} progetti</h2>
          <button className="btn-tenue" onClick={apriNuovo}>
            + Nuovo progetto
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STATI.map((s) => (
            <span
              key={s}
              className="etichetta"
              style={{ background: COLORE_STATO[s], color: "var(--text)" }}
            >
              {s} {conta(s)}
            </span>
          ))}
        </div>
      </section>

      {stato.progetti.length === 0 ? (
        <section className="riquadro">
          <Vuoto
            icona="💍"
            testo="Il portfolio è vuoto. Aggiungi il primo disegno: per l'università conta più di qualunque voto."
          />
        </section>
      ) : (
        <div className="griglia-progetti">
          {stato.progetti.map((p) => (
            <button
              key={p.id}
              className="progetto"
              onClick={() => {
                setBozza(p);
                setAperto(p);
              }}
            >
              <span className="progetto-foto">
                {p.foto ? <img src={p.foto} alt="" /> : "💎"}
              </span>
              <span className="progetto-corpo">
                <strong>{p.titolo}</strong>
                <small>
                  {p.categoria} · {dataBreve(p.data)}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}

      {(nuovo || aperto) && (
        <>
          <div
            className="velo"
            onClick={() => {
              setNuovo(false);
              setAperto(null);
            }}
          />
          <div
            className="riquadro"
            style={{ position: "fixed", inset: "8% 5% auto", zIndex: 60, maxHeight: "80vh", overflow: "auto" }}
          >
            <div className="riquadro-testa">
              <h2>{nuovo ? "Nuovo progetto" : "Progetto"}</h2>
              <button
                className="btn-mini"
                onClick={() => {
                  setNuovo(false);
                  setAperto(null);
                }}
              >
                Chiudi
              </button>
            </div>

            <label className="foto-scelta">
              {bozza.foto ? <img src={bozza.foto} alt="" /> : <span>📷 Foto del progetto</span>}
              <input type="file" accept="image/*" onChange={(e) => scegliFoto(e.target.files?.[0])} />
            </label>
            {errore && <p className="small" style={{ color: "var(--red)" }}>{errore}</p>}

            <label className="campo">
              <span>Titolo</span>
              <input
                value={bozza.titolo}
                onChange={(e) => setBozza({ ...bozza, titolo: e.target.value })}
                placeholder="Anello con incassatura a griffe"
              />
            </label>
            <div className="campi-2">
              <label className="campo">
                <span>Tipo</span>
                <select
                  value={bozza.categoria}
                  onChange={(e) => setBozza({ ...bozza, categoria: e.target.value })}
                >
                  {CATEGORIE.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="campo">
                <span>Stato</span>
                <select
                  value={bozza.stato}
                  onChange={(e) => setBozza({ ...bozza, stato: e.target.value })}
                >
                  {STATI.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="campo">
              <span>Concept</span>
              <textarea
                value={bozza.concept || ""}
                onChange={(e) => setBozza({ ...bozza, concept: e.target.value })}
                placeholder="Da dove nasce l'idea, cosa vuoi raccontare."
              />
            </label>
            <label className="campo">
              <span>Materiali e tecniche</span>
              <input
                value={bozza.materiali || ""}
                onChange={(e) => setBozza({ ...bozza, materiali: e.target.value })}
                placeholder="Oro bianco, diamanti, incassatura a pavé"
              />
            </label>
            <label className="campo">
              <span>Cosa migliorare</span>
              <input
                value={bozza.note || ""}
                onChange={(e) => setBozza({ ...bozza, note: e.target.value })}
              />
            </label>

            <button className="btn-pieno" onClick={salva} disabled={!bozza.titolo.trim()}>
              Salva il progetto
            </button>
            {aperto && !nuovo && (
              <button
                className="btn-mini"
                style={{ marginTop: 10 }}
                onClick={() => elimina(aperto.id)}
              >
                Elimina
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
