import React from "react";
import { Testa, Vuoto } from "../components/Sezione";
import {
  ARCHIVIO,
  comprimiFoto,
  dataLunga,
  nuovoId,
  oggiISO,
  SPAZIO_PIENO,
  usaArchivio,
} from "../lib/archivio";

interface Voce {
  id: string;
  data: string;
  testo: string;
  foto?: string;
  umore?: string;
}
interface Stato {
  voci: Voce[];
}
const INIZIALE: Stato = { voci: [] };

const UMORI = ["😀", "🙂", "😐", "😕", "😤"];

export const Diario = () => {
  const [stato, aggiorna] = usaArchivio<Stato>(ARCHIVIO.diario, INIZIALE);
  const [testo, setTesto] = React.useState("");
  const [foto, setFoto] = React.useState<string | undefined>();
  const [umore, setUmore] = React.useState("🙂");
  const [errore, setErrore] = React.useState("");
  const [aperta, setAperta] = React.useState<string | null>(null);

  const voci = [...stato.voci].sort((a, b) => b.data.localeCompare(a.data));
  const diOggi = stato.voci.find((v) => v.data === oggiISO());

  React.useEffect(() => {
    if (diOggi) {
      setTesto(diOggi.testo);
      setFoto(diOggi.foto);
      setUmore(diOggi.umore || "🙂");
    }
  }, [diOggi?.id]);

  const salva = () => {
    if (!testo.trim() && !foto) return;
    const voce: Voce = {
      id: diOggi?.id || nuovoId(),
      data: oggiISO(),
      testo: testo.trim(),
      foto,
      umore,
    };
    aggiorna((v) => ({
      voci: [...v.voci.filter((x) => x.data !== voce.data), voce],
    }));
    setErrore("");
  };

  const elimina = (id: string) =>
    aggiorna((v) => ({ voci: v.voci.filter((x) => x.id !== id) }));

  const scegliFoto = async (f?: File) => {
    if (!f) return;
    try {
      setFoto(await comprimiFoto(f));
      setErrore("");
    } catch {
      setErrore(SPAZIO_PIENO);
    }
  };

  const voceAperta = voci.find((v) => v.id === aperta);

  return (
    <div>
      <Testa icona="📔" tinta="diario" titolo="Diario" sotto="Racconta la tua giornata." />

      <section className="riquadro">
        <div className="riquadro-testa">
          <h2>{dataLunga(oggiISO())}</h2>
          <div style={{ display: "flex", gap: 4 }}>
            {UMORI.map((u) => (
              <button
                key={u}
                className={`btn-mini ${umore === u ? "attivo" : ""}`}
                onClick={() => setUmore(u)}
                aria-label={`Umore ${u}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <label className="campo">
          <textarea
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="Cosa hai fatto oggi? Cosa è andato bene, cosa no."
          />
        </label>

        <label className="foto-scelta">
          {foto ? (
            <img src={foto} alt="Foto del giorno" />
          ) : (
            <span>📷 Aggiungi una foto</span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => scegliFoto(e.target.files?.[0])}
          />
        </label>

        {errore && <p className="small" style={{ color: "var(--red)" }}>{errore}</p>}

        <button className="btn-pieno" onClick={salva} disabled={!testo.trim() && !foto}>
          {diOggi ? "Aggiorna la giornata" : "Salva la giornata"}
        </button>
      </section>

      <section className="riquadro">
        <h2>Le mie giornate</h2>
        {voci.length === 0 ? (
          <Vuoto icona="✍️" testo="Nessuna pagina ancora. Scrivi due righe qui sopra: fra un mese saranno una cronaca." />
        ) : (
          voci.map((v) => (
            <button key={v.id} className="diario-giorno" onClick={() => setAperta(v.id)}>
              {v.foto ? (
                <img src={v.foto} alt="" />
              ) : (
                <span className="riga-icona" style={{ background: "var(--t-diario-b)" }}>
                  {v.umore || "📔"}
                </span>
              )}
              <span className="riga-corpo">
                <strong>{dataLunga(v.data)}</strong>
                <span className="diario-testo">{v.testo || "Solo una foto."}</span>
              </span>
            </button>
          ))
        )}
      </section>

      {voceAperta && (
        <>
          <div className="velo" onClick={() => setAperta(null)} />
          <div className="riquadro" style={{ position: "fixed", inset: "12% 6% auto", zIndex: 60, maxHeight: "76vh", overflow: "auto" }}>
            <div className="riquadro-testa">
              <h2>{dataLunga(voceAperta.data)}</h2>
              <button className="btn-mini" onClick={() => setAperta(null)}>Chiudi</button>
            </div>
            {voceAperta.foto && (
              <img src={voceAperta.foto} alt="" style={{ width: "100%", borderRadius: 16, marginBottom: 12 }} />
            )}
            <p style={{ whiteSpace: "pre-wrap" }}>{voceAperta.testo}</p>
            <button
              className="btn-mini"
              onClick={() => {
                elimina(voceAperta.id);
                setAperta(null);
              }}
            >
              Elimina la pagina
            </button>
          </div>
        </>
      )}
    </div>
  );
};
