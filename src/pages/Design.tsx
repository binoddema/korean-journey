import React from "react";
import { Card } from "../components/ui";
import { PageHeader } from "../components/Layout";
import {
  AREE,
  ESERCIZI,
  perArea,
  areaDelGiorno,
  esercizioDelGiorno,
  type Area,
  type Esercizio,
} from "../data/design";

/* ------------------------------------------------------------------
   Archivio locale — chiave separata da quella del coreano
   ------------------------------------------------------------------ */

type Sessione = {
  id: string;
  esercizioId: string;
  area: Area;
  data: string;
  minuti: number;
  foto?: string;
  nota?: string;
};

const CHIAVE = "design-v1";

function leggi(): Sessione[] {
  try {
    const s = localStorage.getItem(CHIAVE);
    return s ? (JSON.parse(s) as Sessione[]) : [];
  } catch {
    return [];
  }
}

function salva(v: Sessione[]) {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(v));
  } catch {
    alert(
      "Spazio esaurito. Vai in Portfolio ed elimina qualche foto vecchia: le immagini occupano molto."
    );
  }
}

/* Riduce la foto prima di salvarla: le immagini piene saturano lo spazio. */
function riduci(file: File): Promise<string> {
  return new Promise((ris, err) => {
    const lettore = new FileReader();
    lettore.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        const scala = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scala);
        c.height = Math.round(img.height * scala);
        const ctx = c.getContext("2d");
        if (!ctx) return err(new Error("canvas"));
        ctx.drawImage(img, 0, 0, c.width, c.height);
        ris(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => err(new Error("immagine"));
      img.src = String(lettore.result);
    };
    lettore.onerror = () => err(new Error("lettura"));
    lettore.readAsDataURL(file);
  });
}

const oggiISO = () => new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------
   Timer
   ------------------------------------------------------------------ */

const Timer = ({
  minuti,
  onFine,
}: {
  minuti: number;
  onFine: (minutiFatti: number) => void;
}) => {
  const [restanti, setRestanti] = React.useState(minuti * 60);
  const [attivo, setAttivo] = React.useState(false);

  React.useEffect(() => {
    if (!attivo) return;
    const t = setInterval(() => {
      setRestanti((r) => {
        if (r <= 1) {
          clearInterval(t);
          setAttivo(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [attivo]);

  const mm = String(Math.floor(restanti / 60)).padStart(2, "0");
  const ss = String(restanti % 60).padStart(2, "0");
  const fatti = Math.max(1, Math.round((minuti * 60 - restanti) / 60));

  return (
    <div className="ds-timer">
      <strong className="ds-tempo">
        {mm}:{ss}
      </strong>
      <small className="muted">minuti previsti</small>

      <div className="ds-timer-btn">
        {restanti > 0 && (
          <button
            className="btn primary lg"
            onClick={() => setAttivo((a) => !a)}
            style={{ marginTop: 10 }}
          >
            {attivo ? "Pausa" : restanti === minuti * 60 ? "Inizia" : "Riprendi"}
          </button>
        )}
        <button
          className="btn outline lg"
          onClick={() => onFine(fatti)}
          style={{ marginTop: 8 }}
        >
          Ho finito
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
   Schermata dell'esercizio
   ------------------------------------------------------------------ */

const Sessione = ({
  esercizio,
  onEsci,
  onSalva,
}: {
  esercizio: Esercizio;
  onEsci: () => void;
  onSalva: (s: Sessione) => void;
}) => {
  const [minutiFatti, setMinutiFatti] = React.useState<number | null>(null);
  const [foto, setFoto] = React.useState<string | undefined>();
  const [nota, setNota] = React.useState("");
  const [caricando, setCaricando] = React.useState(false);

  const scegliFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCaricando(true);
    try {
      setFoto(await riduci(f));
    } catch {
      alert("Non sono riuscito a leggere l'immagine.");
    }
    setCaricando(false);
  };

  const concludi = () => {
    onSalva({
      id: `${Date.now()}`,
      esercizioId: esercizio.id,
      area: esercizio.area,
      data: oggiISO(),
      minuti: minutiFatti ?? esercizio.minuti,
      foto,
      nota: nota.trim() || undefined,
    });
  };

  return (
    <div className="ds-sessione">
      <button className="btn ghost sm" onClick={onEsci}>
        ‹ Indietro
      </button>

      <h1 className="ds-titolo">{esercizio.titolo}</h1>
      <p className="lead">{esercizio.consegna}</p>

      <div className="ds-nota-coach">
        <p>{esercizio.scopo}</p>
      </div>

      {minutiFatti === null ? (
        <Card className="pad">
          <Timer minuti={esercizio.minuti} onFine={setMinutiFatti} />
        </Card>
      ) : (
        <Card className="pad">
          <h3>Sessione da {minutiFatti} minuti</h3>

          <label className="ds-foto">
            {foto ? (
              <img src={foto} alt="Lavoro finito" />
            ) : (
              <span className="ds-foto-vuota">
                {caricando ? "Sto caricando…" : "📷 Foto del lavoro finito"}
              </span>
            )}
            <input type="file" accept="image/*" onChange={scegliFoto} hidden />
          </label>

          <textarea
            className="ex-input"
            rows={3}
            placeholder="Com'è andata? Cosa non ha funzionato?"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            style={{ marginTop: 12 }}
          />

          <button className="btn primary lg" onClick={concludi}>
            Registra la sessione
          </button>
        </Card>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------
   Pagina
   ------------------------------------------------------------------ */

export const Design = () => {
  const [sessioni, setSessioni] = React.useState<Sessione[]>(() => leggi());
  const [apertura, setApertura] = React.useState<Esercizio | null>(null);
  const [areaAperta, setAreaAperta] = React.useState<Area | null>(null);

  const fatti = sessioni.map((s) => s.esercizioId);
  const oggi = esercizioDelGiorno(new Date(), fatti);
  const fattoOggi = sessioni.some((s) => s.data === oggiISO());

  const registra = (s: Sessione) => {
    const nuove = [s, ...sessioni];
    setSessioni(nuove);
    salva(nuove);
    setApertura(null);
  };

  if (apertura)
    return (
      <Sessione
        esercizio={apertura}
        onEsci={() => setApertura(null)}
        onSalva={registra}
      />
    );

  if (areaAperta) {
    const area = AREE.find((a) => a.id === areaAperta)!;
    return (
      <>
        <button className="btn ghost sm" onClick={() => setAreaAperta(null)}>
          ‹ Design
        </button>
        <PageHeader icon={area.icona} title={area.nome} sub={area.sotto} />

        {areaAperta === "libro" ? (
          <Card className="pad">
            <p className="muted" style={{ margin: 0 }}>
              La lettura non è ancora collegata. Quando avrai il libro in PDF potremo
              impostare capitoli e verifiche.
            </p>
          </Card>
        ) : (
          <div className="griglia-coreano">
            {perArea(areaAperta).map((e) => {
              const fatto = fatti.includes(e.id);
              return (
                <Card key={e.id} className="pad">
                  <button className="voce-coreano" onClick={() => setApertura(e)}>
                    <span className="vc-icona">{fatto ? "✓" : "○"}</span>
                    <span className="vc-testo">
                      <strong>{e.titolo}</strong>
                      <small className="muted">{e.minuti} min · {e.consegna}</small>
                    </span>
                    <span className="vc-freccia">›</span>
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        icon="✎"
        title="Design"
        sub={
          fattoOggi
            ? "Sessione di oggi registrata"
            : `${sessioni.length} sessioni · ${ESERCIZI.length - fatti.length} esercizi ancora da fare`
        }
      />

      <Card className="pad ds-oggi">
        <span className="ex-label">Esercizio di oggi</span>
        <h2 style={{ marginTop: 6 }}>{oggi.titolo}</h2>
        <p className="muted">{oggi.consegna}</p>
        <button className="btn primary lg" onClick={() => setApertura(oggi)}>
          {fattoOggi ? "Fai un'altra sessione" : "Inizia"}
        </button>
      </Card>

      <div className="griglia-coreano">
        {AREE.map((a) => {
          const tot = perArea(a.id).length;
          const done = perArea(a.id).filter((e) => fatti.includes(e.id)).length;
          return (
            <Card key={a.id} className="pad">
              <button className="voce-coreano" onClick={() => setAreaAperta(a.id)}>
                <span className="vc-icona">{a.icona}</span>
                <span className="vc-testo">
                  <strong>{a.nome}</strong>
                  <small className="muted">{a.sotto}</small>
                </span>
                {tot > 0 && (
                  <span className="vc-badge">
                    {done}/{tot}
                  </span>
                )}
                <span className="vc-freccia">›</span>
              </button>
            </Card>
          );
        })}
      </div>

      {sessioni.length > 0 && (
        <Card className="pad">
          <h3>Ultime sessioni</h3>
          <ul className="ds-storico">
            {sessioni.slice(0, 6).map((s) => {
              const e = ESERCIZI.find((x) => x.id === s.esercizioId);
              return (
                <li key={s.id}>
                  {s.foto ? <img src={s.foto} alt="" /> : <span className="ds-vuoto" />}
                  <div>
                    <strong>{e?.titolo ?? "Sessione"}</strong>
                    <small className="muted">
                      {s.data} · {s.minuti} min
                    </small>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
};
