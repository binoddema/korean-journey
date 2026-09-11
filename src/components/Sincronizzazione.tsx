import React from "react";
import { Card } from "./ui";
import { attivo, sessione, esci } from "../lib/nuvola";
import {
  sincronizza,
  osserva,
  leggiSituazione,
  conflittoAperto,
  risolviConflitto,
  ripristinaDaFile,
  type Esito,
} from "../lib/sincro";

const ETICHETTE: Record<string, string> = {
  spento: "Non attiva",
  sincronizzo: "Sincronizzo…",
  ok: "Tutto salvato",
  errore: "Errore",
  conflitto: "Serve una scelta",
};

export const Sincronizzazione = () => {
  const [email, setEmail] = React.useState<string | null>(null);
  const [ripristino, setRipristino] = React.useState<Esito | null>(null);
  const [attesa, setAttesa] = React.useState(false);
  const [, forza] = React.useReducer((n: number) => n + 1, 0);

  React.useEffect(() => {
    if (attivo) sessione().then((s) => setEmail(s?.user.email ?? null));
    const stacca = osserva(forza);
    return () => {
      stacca();
    };
  }, []);

  if (!attivo) return null;

  const { situazione, messaggio } = leggiSituazione();
  const c = conflittoAperto;

  const quando = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("it-IT") : "";

  return (
    <Card className="pad">
      <h3>Sincronizzazione</h3>
      <p className="muted" style={{ fontSize: ".88rem", marginBottom: 4 }}>
        {email ?? "Non hai effettuato l'accesso"}
      </p>

      <p style={{ fontSize: ".9rem", marginBottom: 12 }}>
        <strong>{ETICHETTE[situazione] ?? situazione}</strong>
        {messaggio && <span className="muted"> — {messaggio}</span>}
      </p>

      {c ? (
        <div className="sync-conflitto">
          <p style={{ fontSize: ".9rem" }}>
            Ci sono due versioni diverse dei tuoi dati: {c.motivo}. Ho messo da
            parte una copia di entrambe, quindi nessuna delle due andrà persa.
            Scegli quale tenere come buona.
          </p>
          <div className="row" style={{ gap: 8 }}>
            <button
              className="btn primary"
              onClick={() => risolviConflitto("questo")}
            >
              Tieni questo dispositivo
            </button>
            <button
              className="btn outline"
              onClick={() => risolviConflitto("server")}
            >
              Tieni il server
              {c.remoto.device ? ` (${c.remoto.device})` : ""}
            </button>
          </div>
          {c.remoto.updated_at && (
            <p className="muted" style={{ fontSize: ".8rem", marginTop: 8 }}>
              Il server è stato aggiornato il {quando(c.remoto.updated_at)}.
            </p>
          )}
        </div>
      ) : (
        <button
          className="btn outline"
          disabled={situazione === "sincronizzo"}
          onClick={() => sincronizza()}
        >
          Sincronizza adesso
        </button>
      )}

      <p className="muted" style={{ fontSize: ".82rem", marginTop: 12 }}>
        Il salvataggio è automatico: parte da solo dopo ogni sessione. Questo
        pulsante serve solo se vuoi forzarlo.
      </p>

      <div className="sync-ripristino">
        <h4>Ripristina da un backup</h4>
        <p className="muted" style={{ fontSize: ".84rem" }}>
          Carica un file esportato. Sostituisce i dati di questo dispositivo e
          del server, dopo averne messo da parte una copia.
        </p>
        <label className="btn outline sm" style={{ display: "inline-block" }}>
          {attesa ? "Un momento…" : "Scegli il file"}
          <input
            type="file"
            accept="application/json,.json"
            hidden
            disabled={attesa}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setAttesa(true);
              setRipristino(null);
              const testo = await f.text();
              setRipristino(await ripristinaDaFile(testo));
              setAttesa(false);
            }}
          />
        </label>
        {ripristino && (
          <div
            className={ripristino.ok ? "note" : "accesso-errore"}
            style={{ marginTop: 10 }}
          >
            {ripristino.messaggio}
          </div>
        )}
      </div>

      <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => esci()}>
        Esci dall'account
      </button>
    </Card>
  );
};
