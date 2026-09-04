import React from "react";
import { Card } from "./ui";
import { accedi, registrati, esci, sessione, alCambioSessione, attivo } from "../lib/nuvola";
import type { Session } from "@supabase/supabase-js";

/* ------------------------------------------------------------------
   Stato dell'accesso, usato dal resto dell'app
   ------------------------------------------------------------------ */

export function useSessione() {
  const [s, setS] = React.useState<Session | null>(null);
  const [pronto, setPronto] = React.useState(!attivo);

  React.useEffect(() => {
    if (!attivo) return;
    sessione().then((x) => {
      setS(x);
      setPronto(true);
    });
    return alCambioSessione(setS);
  }, []);

  return { sessione: s, pronto };
}

/* ------------------------------------------------------------------
   Schermata di accesso
   ------------------------------------------------------------------ */

export const Accesso = () => {
  const [modo, setModo] = React.useState<"accedi" | "registra">("accedi");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errore, setErrore] = React.useState<string | null>(null);
  const [avviso, setAvviso] = React.useState<string | null>(null);
  const [attesa, setAttesa] = React.useState(false);

  const invia = async () => {
    setErrore(null);
    setAvviso(null);

    if (!email.includes("@")) return setErrore("Controlla l'indirizzo email.");
    if (password.length < 8)
      return setErrore("La password deve avere almeno 8 caratteri.");

    setAttesa(true);
    try {
      if (modo === "registra") {
        await registrati(email, password);
        setAvviso(
          "Account creato. Se ti arriva una email di conferma, aprila prima di accedere."
        );
        setModo("accedi");
      } else {
        await accedi(email, password);
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : "Qualcosa non ha funzionato.";
      setErrore(
        m.includes("Invalid login")
          ? "Email o password non corrette."
          : m.includes("already registered")
          ? "Questo indirizzo è già registrato: usa Accedi."
          : m
      );
    }
    setAttesa(false);
  };

  return (
    <div className="accesso">
      <Card className="pad">
        <h1 style={{ fontSize: "1.5rem" }}>
          {modo === "accedi" ? "Accedi" : "Crea un account"}
        </h1>
        <p className="muted" style={{ fontSize: ".9rem" }}>
          Serve per ritrovare coreano, design e allenamenti su tutti i tuoi
          dispositivi.
        </p>

        <input
          className="ex-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="ex-input"
          type="password"
          autoComplete={modo === "accedi" ? "current-password" : "new-password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && invia()}
        />

        {errore && <div className="accesso-errore">{errore}</div>}
        {avviso && <div className="note">{avviso}</div>}

        <button className="btn primary lg" disabled={attesa} onClick={invia}>
          {attesa ? "Un momento…" : modo === "accedi" ? "Accedi" : "Crea account"}
        </button>

        <button
          className="btn ghost"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => {
            setModo(modo === "accedi" ? "registra" : "accedi");
            setErrore(null);
            setAvviso(null);
          }}
        >
          {modo === "accedi"
            ? "Non hai un account? Creane uno"
            : "Hai già un account? Accedi"}
        </button>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------------------
   Riquadro account, da mettere nelle Impostazioni
   ------------------------------------------------------------------ */

export const Account = ({ email }: { email?: string }) => (
  <Card className="pad">
    <h3>Account</h3>
    <p className="muted" style={{ fontSize: ".88rem" }}>
      {email ?? "Non hai effettuato l'accesso"}
    </p>
    <button className="btn outline" onClick={() => esci()}>
      Esci
    </button>
  </Card>
);
