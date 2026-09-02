import React from "react";
import { Card } from "../components/ui";
import { PageHeader } from "../components/Layout";
import { ESERCIZI, SCHEDE, trova, cerca, type Esercizio } from "../data/sport";

/* ------------------------------------------------------------------
   Archivio locale
   ------------------------------------------------------------------ */

type Valori = { serie: number; ripetizioni: string; peso?: number; recupero: number };
type Registro = { data: string; esercizioId: string; valori: Valori };

type Stato = {
  /** ultimi valori usati, per esercizio */
  miei: Record<string, Valori>;
  storico: Registro[];
  peso: { data: string; kg: number }[];
};

const CHIAVE = "sport-v1";

function leggi(): Stato {
  try {
    const s = localStorage.getItem(CHIAVE);
    if (s) return JSON.parse(s) as Stato;
  } catch {
    /* archivio illeggibile: si riparte puliti */
  }
  return { miei: {}, storico: [], peso: [] };
}

function salva(s: Stato) {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(s));
  } catch {
    /* spazio esaurito */
  }
}

const oggiISO = () => new Date().toISOString().slice(0, 10);

const valoriDi = (e: Esercizio, st: Stato): Valori =>
  st.miei[e.id] ?? {
    serie: e.serie,
    ripetizioni: e.ripetizioni,
    peso: e.peso,
    recupero: e.recupero,
  };

const etichetta = (e: Esercizio, v: Valori) => {
  const rip = e.secondi ? `${v.ripetizioni}s` : v.ripetizioni;
  const kg = v.peso != null ? ` · ${v.peso} kg` : "";
  return `${v.serie}×${rip}${kg}`;
};

/* ------------------------------------------------------------------
   Scheda di un esercizio
   ------------------------------------------------------------------ */

const Dettaglio = ({
  esercizio,
  stato,
  onIndietro,
  onRegistra,
}: {
  esercizio: Esercizio;
  stato: Stato;
  onIndietro: () => void;
  onRegistra: (v: Valori) => void;
}) => {
  const iniziali = valoriDi(esercizio, stato);
  const [v, setV] = React.useState<Valori>(iniziali);

  const precedenti = stato.storico
    .filter((r) => r.esercizioId === esercizio.id)
    .slice(0, 5);

  const num = (campo: "serie" | "peso" | "recupero", passo: number, min: number) =>
    setV((x) => ({
      ...x,
      [campo]: Math.max(min, Number(((x[campo] ?? 0) + passo).toFixed(1))),
    }));

  return (
    <div className="sp-dettaglio">
      <button className="btn ghost sm" onClick={onIndietro}>
        ‹ Indietro
      </button>

      <div className="sp-testa">
        <div
          className="sp-disegno"
          dangerouslySetInnerHTML={{ __html: esercizio.disegno }}
        />
        <div>
          <h1 className="sp-nome">{esercizio.nome}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {etichetta(esercizio, v)} · recupero {v.recupero}s
          </p>
        </div>
      </div>

      <Card className="pad">
        <h3>Come si fa</h3>
        <p style={{ margin: "0 0 10px" }}>{esercizio.come}</p>
        <div className="sp-errore">
          <strong>Errore da evitare. </strong>
          {esercizio.errore}
        </div>
      </Card>

      <Card className="pad">
        <h3>I tuoi valori</h3>

        <div className="setting">
          <div className="s-left">
            <strong>Serie</strong>
          </div>
          <div className="stepper-ctrl">
            <button onClick={() => num("serie", -1, 1)}>−</button>
            <span>{v.serie}</span>
            <button onClick={() => num("serie", 1, 1)}>+</button>
          </div>
        </div>

        <div className="setting">
          <div className="s-left">
            <strong>{esercizio.secondi ? "Secondi" : "Ripetizioni"}</strong>
          </div>
          <input
            className="ex-input sp-input"
            value={v.ripetizioni}
            onChange={(e) => setV({ ...v, ripetizioni: e.target.value })}
          />
        </div>

        {v.peso != null && (
          <div className="setting">
            <div className="s-left">
              <strong>Peso (kg)</strong>
            </div>
            <div className="stepper-ctrl">
              <button onClick={() => num("peso", -0.5, 0)}>−</button>
              <span>{v.peso}</span>
              <button onClick={() => num("peso", 0.5, 0)}>+</button>
            </div>
          </div>
        )}

        <div className="setting">
          <div className="s-left">
            <strong>Recupero (s)</strong>
          </div>
          <div className="stepper-ctrl">
            <button onClick={() => num("recupero", -15, 0)}>−</button>
            <span>{v.recupero}</span>
            <button onClick={() => num("recupero", 15, 0)}>+</button>
          </div>
        </div>

        <button className="btn primary lg" onClick={() => onRegistra(v)}>
          Registra
        </button>
      </Card>

      {precedenti.length > 0 && (
        <Card className="pad">
          <h3>Ultime volte</h3>
          <ul className="kv">
            {precedenti.map((r, i) => (
              <li key={i}>
                <span>{r.data}</span>
                <b>{etichetta(esercizio, r.valori)}</b>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------
   Pagina
   ------------------------------------------------------------------ */

export const Sport = () => {
  const [stato, setStato] = React.useState<Stato>(() => leggi());
  const [aperto, setAperto] = React.useState<Esercizio | null>(null);
  const [query, setQuery] = React.useState("");
  const [schedaAperta, setSchedaAperta] = React.useState<string | null>(null);
  const [pesoOggi, setPesoOggi] = React.useState("");

  const risultati = cerca(query);

  const registra = (v: Valori) => {
    if (!aperto) return;
    const nuovo: Stato = {
      ...stato,
      miei: { ...stato.miei, [aperto.id]: v },
      storico: [{ data: oggiISO(), esercizioId: aperto.id, valori: v }, ...stato.storico].slice(
        0,
        400
      ),
    };
    setStato(nuovo);
    salva(nuovo);
    setAperto(null);
  };

  const registraPeso = () => {
    const kg = parseFloat(pesoOggi.replace(",", "."));
    if (!kg || kg < 30 || kg > 250) return;
    const nuovo: Stato = {
      ...stato,
      peso: [{ data: oggiISO(), kg }, ...stato.peso].slice(0, 200),
    };
    setStato(nuovo);
    salva(nuovo);
    setPesoOggi("");
  };

  if (aperto)
    return (
      <Dettaglio
        esercizio={aperto}
        stato={stato}
        onIndietro={() => setAperto(null)}
        onRegistra={registra}
      />
    );

  const scheda = SCHEDE.find((s) => s.id === schedaAperta);

  if (scheda)
    return (
      <>
        <button className="btn ghost sm" onClick={() => setSchedaAperta(null)}>
          ‹ Sport
        </button>
        <PageHeader icon="🏋" title={scheda.nome} />
        <div className="griglia-coreano">
          {scheda.esercizi.map((id) => {
            const e = trova(id);
            if (!e) return null;
            const v = valoriDi(e, stato);
            return (
              <Card key={id} className="pad">
                <button className="voce-coreano" onClick={() => setAperto(e)}>
                  <span
                    className="sp-mini"
                    dangerouslySetInnerHTML={{ __html: e.disegno }}
                  />
                  <span className="vc-testo">
                    <strong>{e.nome}</strong>
                    <small className="muted">{etichetta(e, v)}</small>
                  </span>
                  <span className="vc-freccia">›</span>
                </button>
              </Card>
            );
          })}
        </div>
      </>
    );

  const ultimoPeso = stato.peso[0];

  return (
    <>
      <PageHeader
        icon="🏋"
        title="Sport"
        sub={`${stato.storico.length} esercizi registrati`}
      />

      <input
        className="ex-input"
        placeholder="Cerca un esercizio…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {risultati.length > 0 && (
        <div className="griglia-coreano">
          {risultati.map((e) => {
            const v = valoriDi(e, stato);
            return (
              <Card key={e.id} className="pad">
                <button className="voce-coreano" onClick={() => setAperto(e)}>
                  <span
                    className="sp-mini"
                    dangerouslySetInnerHTML={{ __html: e.disegno }}
                  />
                  <span className="vc-testo">
                    <strong>{e.nome}</strong>
                    <small className="muted">{etichetta(e, v)}</small>
                  </span>
                  <span className="vc-freccia">›</span>
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {query.trim() === "" && (
        <>
          <div className="griglia-coreano">
            {SCHEDE.map((s) => (
              <Card key={s.id} className="pad">
                <button className="voce-coreano" onClick={() => setSchedaAperta(s.id)}>
                  <span className="vc-icona">💪</span>
                  <span className="vc-testo">
                    <strong>{s.nome}</strong>
                    <small className="muted">{s.esercizi.length} esercizi</small>
                  </span>
                  <span className="vc-freccia">›</span>
                </button>
              </Card>
            ))}
          </div>

          <Card className="pad">
            <h3>Peso corporeo</h3>
            <p className="muted" style={{ fontSize: ".88rem" }}>
              È l'indicatore che dice la verità nel tempo. Segnalo una volta a settimana,
              sempre nello stesso momento della giornata.
            </p>
            <div className="row">
              <input
                className="ex-input sp-input"
                inputMode="decimal"
                placeholder="kg"
                value={pesoOggi}
                onChange={(e) => setPesoOggi(e.target.value)}
                style={{ marginBottom: 0 }}
              />
              <button className="btn primary" onClick={registraPeso}>
                Salva
              </button>
            </div>
            {ultimoPeso && (
              <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
                Ultimo: {ultimoPeso.kg} kg il {ultimoPeso.data}
              </p>
            )}
          </Card>

          {stato.storico.length > 0 && (
            <Card className="pad">
              <h3>Ultimi allenamenti</h3>
              <ul className="kv">
                {stato.storico.slice(0, 8).map((r, i) => {
                  const e = trova(r.esercizioId);
                  return (
                    <li key={i}>
                      <span>
                        {r.data} · {e?.nome ?? r.esercizioId}
                      </span>
                      <b>{e ? etichetta(e, r.valori) : ""}</b>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          <p className="muted center" style={{ fontSize: ".82rem" }}>
            {ESERCIZI.length} esercizi disponibili
          </p>
        </>
      )}
    </>
  );
};
