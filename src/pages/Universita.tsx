import React from "react";
import { Avanzamento, Testa, Vuoto } from "../components/Sezione";
import { ARCHIVIO, dataLunga, nuovoId, oggiISO, usaArchivio } from "../lib/archivio";

interface Scadenza {
  id: string;
  titolo: string;
  data: string;
  fatto: boolean;
}
interface Requisito {
  id: string;
  testo: string;
  stato: "da verificare" | "in corso" | "pronto";
}
interface Stato {
  universita: string;
  dipartimento: string;
  citta: string;
  partenza: string;
  scadenze: Scadenza[];
  requisiti: Requisito[];
}

const INIZIALE: Stato = {
  universita: "Kookmin University",
  dipartimento: "Metalwork & Jewelry",
  citta: "Seoul",
  partenza: "",
  scadenze: [],
  requisiti: [
    { id: "r1", testo: "TOPIK richiesto per gli stranieri", stato: "da verificare" },
    { id: "r2", testo: "Portfolio: numero di lavori e formato", stato: "da verificare" },
    { id: "r3", testo: "Prova pratica di disegno", stato: "da verificare" },
    { id: "r4", testo: "Documenti e traduzioni legalizzate", stato: "da verificare" },
    { id: "r5", testo: "Costi, borse di studio e scadenze di iscrizione", stato: "da verificare" },
  ],
};

const GIRO: Record<Requisito["stato"], Requisito["stato"]> = {
  "da verificare": "in corso",
  "in corso": "pronto",
  pronto: "da verificare",
};
const COLORE: Record<Requisito["stato"], string> = {
  "da verificare": "var(--t-diario-b)",
  "in corso": "var(--t-design-b)",
  pronto: "var(--t-sport-b)",
};

export const Universita = () => {
  const [stato, aggiorna] = usaArchivio<Stato>(ARCHIVIO.universita, INIZIALE);
  const [titolo, setTitolo] = React.useState("");
  const [data, setData] = React.useState(oggiISO());
  const [modifica, setModifica] = React.useState(false);

  const pronti = stato.requisiti.filter((r) => r.stato === "pronto").length;
  const pct = stato.requisiti.length ? (pronti / stato.requisiti.length) * 100 : 0;
  const prossime = [...stato.scadenze]
    .filter((s) => !s.fatto)
    .sort((a, b) => a.data.localeCompare(b.data));

  const aggiungi = () => {
    if (!titolo.trim()) return;
    aggiorna((v) => ({
      ...v,
      scadenze: [...v.scadenze, { id: nuovoId(), titolo: titolo.trim(), data, fatto: false }],
    }));
    setTitolo("");
  };

  const giorniA = (iso: string) => {
    const g = Math.round(
      (new Date(iso).getTime() - new Date(oggiISO()).getTime()) / 86400000
    );
    if (g === 0) return "oggi";
    if (g < 0) return `${-g} giorni fa`;
    return `fra ${g} giorni`;
  };

  return (
    <div>
      <Testa icona="🎓" tinta="universita" titolo="Università" sotto="Il percorso, il futuro." />

      <section className="riquadro">
        <div className="riquadro-testa">
          <h2>{stato.universita}</h2>
          <button className="btn-mini" onClick={() => setModifica((v) => !v)}>
            {modifica ? "Fatto" : "Cambia"}
          </button>
        </div>
        {modifica ? (
          <>
            <label className="campo">
              <span>Università</span>
              <input
                value={stato.universita}
                onChange={(e) => aggiorna({ universita: e.target.value })}
              />
            </label>
            <div className="campi-2">
              <label className="campo">
                <span>Dipartimento</span>
                <input
                  value={stato.dipartimento}
                  onChange={(e) => aggiorna({ dipartimento: e.target.value })}
                />
              </label>
              <label className="campo">
                <span>Città</span>
                <input value={stato.citta} onChange={(e) => aggiorna({ citta: e.target.value })} />
              </label>
            </div>
            <label className="campo">
              <span>Data di partenza che hai in mente</span>
              <input
                type="date"
                value={stato.partenza}
                onChange={(e) => aggiorna({ partenza: e.target.value })}
              />
            </label>
          </>
        ) : (
          <p className="muted" style={{ marginBottom: 12 }}>
            {stato.dipartimento} · {stato.citta}
            {stato.partenza ? ` · partenza ${dataLunga(stato.partenza)}` : ""}
          </p>
        )}
        <Avanzamento
          valore={pct}
          colore="var(--t-universita)"
          sinistra={`${pronti} requisiti su ${stato.requisiti.length} pronti`}
          destra={`${Math.round(pct)}%`}
        />
      </section>

      <section className="riquadro">
        <h2>Requisiti</h2>
        <p className="small muted">
          Tocca un requisito per cambiarne lo stato. Finché è "da verificare", il dato non è
          confermato dall'università.
        </p>
        {stato.requisiti.map((r) => (
          <button
            key={r.id}
            className="riga"
            onClick={() =>
              aggiorna((v) => ({
                ...v,
                requisiti: v.requisiti.map((x) =>
                  x.id === r.id ? { ...x, stato: GIRO[x.stato] } : x
                ),
              }))
            }
          >
            <span className="riga-icona" style={{ background: COLORE[r.stato] }}>
              {r.stato === "pronto" ? "✓" : r.stato === "in corso" ? "…" : "?"}
            </span>
            <span className="riga-corpo">
              <strong>{r.testo}</strong>
              <small>{r.stato}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="riquadro">
        <h2>Scadenze</h2>
        {prossime.length === 0 ? (
          <Vuoto icona="🗓" testo="Nessuna scadenza. Aggiungi le date di iscrizione appena le trovi." />
        ) : (
          prossime.map((s) => (
            <div className="riga" key={s.id}>
              <span className="riga-icona" style={{ background: "var(--t-universita-b)" }}>
                📌
              </span>
              <span className="riga-corpo">
                <strong>{s.titolo}</strong>
                <small>
                  {dataLunga(s.data)} · {giorniA(s.data)}
                </small>
              </span>
              <button
                className="btn-mini"
                onClick={() =>
                  aggiorna((v) => ({
                    ...v,
                    scadenze: v.scadenze.filter((x) => x.id !== s.id),
                  }))
                }
              >
                ✓
              </button>
            </div>
          ))
        )}
        <div className="campi-2" style={{ marginTop: 12 }}>
          <label className="campo">
            <span>Cosa scade</span>
            <input value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Iscrizione" />
          </label>
          <label className="campo">
            <span>Quando</span>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </label>
        </div>
        <button className="btn-pieno" onClick={aggiungi} disabled={!titolo.trim()}>
          Aggiungi scadenza
        </button>
      </section>
    </div>
  );
};
