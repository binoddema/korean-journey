import React from "react";
import { Testa, Vuoto } from "../components/Sezione";
import { ARCHIVIO, dataLunga, nuovoId, oggiISO, usaArchivio } from "../lib/archivio";

interface Evento {
  id: string;
  titolo: string;
  categoria: string;
  data: string;
  dalle?: string;
  alle?: string;
  note?: string;
  fatto?: boolean;
  ognuna?: boolean; /* ogni settimana, stesso giorno */
}
interface Stato {
  eventi: Evento[];
}
const INIZIALE: Stato = { eventi: [] };

const CATEGORIE: { nome: string; icona: string; tinta: string }[] = [
  { nome: "Coreano", icona: "🇰🇷", tinta: "coreano" },
  { nome: "Design", icona: "🎨", tinta: "design" },
  { nome: "Sport", icona: "🏋️", tinta: "sport" },
  { nome: "Università", icona: "🎓", tinta: "universita" },
  { nome: "Portfolio", icona: "💼", tinta: "portfolio" },
  { nome: "Lavoro", icona: "💍", tinta: "oggi" },
  { nome: "Personale", icona: "•", tinta: "diario" },
];
const tintaDi = (c: string) => CATEGORIE.find((x) => x.nome === c)?.tinta || "oggi";
const iconaDi = (c: string) => CATEGORIE.find((x) => x.nome === c)?.icona || "•";

const GIORNI = ["L", "M", "M", "G", "V", "S", "D"];

/** Gli eventi di un giorno, incluse le ripetizioni settimanali. */
export function eventiDelGiorno(eventi: Evento[], iso: string) {
  const g = new Date(iso).getDay();
  return eventi
    .filter(
      (e) =>
        e.data === iso ||
        (e.ognuna && e.data <= iso && new Date(e.data).getDay() === g)
    )
    .sort((a, b) => (a.dalle || "").localeCompare(b.dalle || ""));
}

export const Calendario = () => {
  const [stato, aggiorna] = usaArchivio<Stato>(ARCHIVIO.calendario, INIZIALE);
  const [scelto, setScelto] = React.useState(oggiISO());
  const [mese, setMese] = React.useState(() => {
    const d = new Date();
    return { anno: d.getFullYear(), mese: d.getMonth() };
  });
  const [nuovo, setNuovo] = React.useState(false);
  const [bozza, setBozza] = React.useState<Evento>({
    id: "",
    titolo: "",
    categoria: "Coreano",
    data: oggiISO(),
    dalle: "18:00",
    alle: "19:00",
  });

  const primo = new Date(mese.anno, mese.mese, 1);
  const inizio = (primo.getDay() + 6) % 7; /* lunedì = 0 */
  const giorniMese = new Date(mese.anno, mese.mese + 1, 0).getDate();
  const nomeMese = primo.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

  const isoDi = (g: number) =>
    `${mese.anno}-${`${mese.mese + 1}`.padStart(2, "0")}-${`${g}`.padStart(2, "0")}`;

  const delGiorno = eventiDelGiorno(stato.eventi, scelto);

  const salva = () => {
    if (!bozza.titolo.trim()) return;
    aggiorna((v) => ({
      eventi: [...v.eventi.filter((e) => e.id !== bozza.id), { ...bozza, id: bozza.id || nuovoId() }],
    }));
    setNuovo(false);
  };

  const apriNuovo = () => {
    setBozza({
      id: nuovoId(),
      titolo: "",
      categoria: "Coreano",
      data: scelto,
      dalle: "18:00",
      alle: "19:00",
    });
    setNuovo(true);
  };

  return (
    <div>
      <Testa icona="📅" tinta="calendario" titolo="Calendario" sotto="Organizza il tuo tempo." />

      <section className="riquadro">
        <div className="mese-testa">
          <button
            onClick={() =>
              setMese((m) => (m.mese === 0 ? { anno: m.anno - 1, mese: 11 } : { ...m, mese: m.mese - 1 }))
            }
            aria-label="Mese precedente"
          >
            ‹
          </button>
          <strong style={{ textTransform: "capitalize" }}>{nomeMese}</strong>
          <button
            onClick={() =>
              setMese((m) => (m.mese === 11 ? { anno: m.anno + 1, mese: 0 } : { ...m, mese: m.mese + 1 }))
            }
            aria-label="Mese successivo"
          >
            ›
          </button>
        </div>
        <div className="mese">
          {GIORNI.map((g, i) => (
            <div className="mese-nome" key={i}>
              {g}
            </div>
          ))}
          {Array.from({ length: inizio }).map((_, i) => (
            <div key={`v${i}`} />
          ))}
          {Array.from({ length: giorniMese }).map((_, i) => {
            const iso = isoDi(i + 1);
            const ha = eventiDelGiorno(stato.eventi, iso).length > 0;
            return (
              <button
                key={iso}
                className={`mese-giorno ${iso === scelto ? "scelto" : ""} ${
                  iso === oggiISO() ? "oggi" : ""
                }`}
                onClick={() => setScelto(iso)}
              >
                {i + 1}
                {ha && <i />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="riquadro">
        <div className="riquadro-testa">
          <h2>{dataLunga(scelto)}</h2>
          <button className="btn-tenue" onClick={apriNuovo}>
            + Evento
          </button>
        </div>
        {delGiorno.length === 0 ? (
          <Vuoto icona="🕊" testo="Giornata libera. Lasciala così, oppure aggiungi un impegno." />
        ) : (
          delGiorno.map((e) => (
            <div className="riga" key={e.id}>
              <span className="riga-icona" style={{ background: `var(--t-${tintaDi(e.categoria)}-b)` }}>
                {iconaDi(e.categoria)}
              </span>
              <span className="riga-corpo">
                <strong style={{ textDecoration: e.fatto ? "line-through" : "none" }}>
                  {e.titolo}
                </strong>
                <small>
                  {e.dalle && `${e.dalle}${e.alle ? ` – ${e.alle}` : ""} · `}
                  {e.categoria}
                  {e.ognuna ? " · ogni settimana" : ""}
                </small>
              </span>
              <button
                className="btn-mini"
                onClick={() =>
                  aggiorna((v) => ({
                    eventi: v.eventi.map((x) => (x.id === e.id ? { ...x, fatto: !x.fatto } : x)),
                  }))
                }
              >
                {e.fatto ? "↺" : "✓"}
              </button>
              <button
                className="btn-mini"
                onClick={() => aggiorna((v) => ({ eventi: v.eventi.filter((x) => x.id !== e.id) }))}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </section>

      {nuovo && (
        <>
          <div className="velo" onClick={() => setNuovo(false)} />
          <div
            className="riquadro"
            style={{ position: "fixed", inset: "12% 5% auto", zIndex: 60, maxHeight: "76vh", overflow: "auto" }}
          >
            <div className="riquadro-testa">
              <h2>Nuovo evento</h2>
              <button className="btn-mini" onClick={() => setNuovo(false)}>
                Chiudi
              </button>
            </div>
            <label className="campo">
              <span>Titolo</span>
              <input
                value={bozza.titolo}
                onChange={(e) => setBozza({ ...bozza, titolo: e.target.value })}
                placeholder="Lezione di coreano"
              />
            </label>
            <label className="campo">
              <span>Categoria</span>
              <select
                value={bozza.categoria}
                onChange={(e) => setBozza({ ...bozza, categoria: e.target.value })}
              >
                {CATEGORIE.map((c) => (
                  <option key={c.nome}>{c.nome}</option>
                ))}
              </select>
            </label>
            <label className="campo">
              <span>Giorno</span>
              <input
                type="date"
                value={bozza.data}
                onChange={(e) => setBozza({ ...bozza, data: e.target.value })}
              />
            </label>
            <div className="campi-2">
              <label className="campo">
                <span>Dalle</span>
                <input
                  type="time"
                  value={bozza.dalle || ""}
                  onChange={(e) => setBozza({ ...bozza, dalle: e.target.value })}
                />
              </label>
              <label className="campo">
                <span>Alle</span>
                <input
                  type="time"
                  value={bozza.alle || ""}
                  onChange={(e) => setBozza({ ...bozza, alle: e.target.value })}
                />
              </label>
            </div>
            <label className="campo" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={!!bozza.ognuna}
                onChange={(e) => setBozza({ ...bozza, ognuna: e.target.checked })}
              />
              <span style={{ margin: 0 }}>Ripeti ogni settimana in questo giorno</span>
            </label>
            <button className="btn-pieno" onClick={salva} disabled={!bozza.titolo.trim()}>
              Salva evento
            </button>
          </div>
        </>
      )}
    </div>
  );
};
