import React from "react";
import { Card } from "./ui";
import { attivo, sessione, esci } from "../lib/nuvola";
import { caricaTutto, scaricaTutto, type Esito } from "../lib/sincro";

export const Sincronizzazione = () => {
  const [email, setEmail] = React.useState<string | null>(null);
  const [esito, setEsito] = React.useState<Esito | null>(null);
  const [attesa, setAttesa] = React.useState(false);

  React.useEffect(() => {
    if (attivo) sessione().then((s) => setEmail(s?.user.email ?? null));
  }, []);

  if (!attivo) return null;

  const azione = async (f: () => Promise<Esito>) => {
    setAttesa(true);
    setEsito(null);
    setEsito(await f());
    setAttesa(false);
  };

  return (
    <Card className="pad">
      <h3>Sincronizzazione</h3>
      <p className="muted" style={{ fontSize: ".88rem" }}>
        {email ?? "Non hai effettuato l'accesso"}
      </p>

      <div className="row" style={{ gap: 8 }}>
        <button
          className="btn primary"
          disabled={attesa}
          onClick={() => azione(caricaTutto)}
        >
          Salva sul server
        </button>
        <button
          className="btn outline"
          disabled={attesa}
          onClick={() => azione(scaricaTutto)}
        >
          Scarica dal server
        </button>
      </div>

      {attesa && (
        <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>
          Un momento…
        </p>
      )}

      {esito && (
        <div
          className={esito.ok ? "note" : "accesso-errore"}
          style={{ marginTop: 10 }}
        >
          {esito.messaggio}
        </div>
      )}

      <button
        className="btn ghost"
        style={{ marginTop: 12 }}
        onClick={() => esci()}
      >
        Esci dall'account
      </button>
    </Card>
  );
};
