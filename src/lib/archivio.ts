/* ==========================================================================
   Archivi dell'app
   Ogni sezione tiene i suoi dati in un archivio con un nome proprio.
   Chi salva qui viene sincronizzato da solo: sincro.ts osserva gli stessi
   nomi e li manda al server, e quando arrivano dati da un altro
   dispositivo l'archivio si rilegge senza ricaricare la pagina.
   ========================================================================== */
import React from "react";
import { EVENTO_DATI } from "./sincro";

export const ARCHIVIO = {
  diario: "diario-v1",
  risparmio: "risparmio-v1",
  portfolio: "portfolio-v1",
  universita: "universita-v1",
  calendario: "calendario-v1",
  coach: "coach-v1",
} as const;

export function leggiArchivio<T>(nome: string, iniziale: T): T {
  try {
    const grezzo = localStorage.getItem(nome);
    if (!grezzo) return iniziale;
    const letto = JSON.parse(grezzo);
    if (!letto || typeof letto !== "object") return iniziale;
    return { ...(iniziale as object), ...(letto as object) } as T;
  } catch {
    return iniziale;
  }
}

export function scriviArchivio(nome: string, valore: unknown) {
  try {
    localStorage.setItem(nome, JSON.stringify(valore));
    return true;
  } catch {
    return false;
  }
}

/**
 * Come useState, ma il valore vive in un archivio sincronizzato.
 * Restituisce [valore, aggiorna].
 */
export function usaArchivio<T extends object>(nome: string, iniziale: T) {
  const [valore, imposta] = React.useState<T>(() => leggiArchivio(nome, iniziale));

  React.useEffect(() => {
    const rileggi = () => imposta(leggiArchivio(nome, iniziale));
    window.addEventListener(EVENTO_DATI, rileggi);
    return () => window.removeEventListener(EVENTO_DATI, rileggi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome]);

  const aggiorna = React.useCallback(
    (cambio: Partial<T> | ((v: T) => T)) => {
      imposta((corrente) => {
        const nuovo =
          typeof cambio === "function"
            ? (cambio as (v: T) => T)(corrente)
            : { ...corrente, ...cambio };
        scriviArchivio(nome, nuovo);
        return nuovo;
      });
    },
    [nome]
  );

  return [valore, aggiorna] as const;
}

/* ---------- utilità ---------- */

export const nuovoId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const oggiISO = () => {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const g = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${g}`;
};

const MESI = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

/** "2026-09-12" → "12 settembre 2026" */
export function dataLunga(iso: string) {
  const [a, m, g] = iso.split("-").map(Number);
  if (!a || !m || !g) return iso;
  return `${g} ${MESI[m - 1]} ${a}`;
}

/** "2026-09-12" → "12 set" */
export function dataBreve(iso: string) {
  const [, m, g] = iso.split("-").map(Number);
  if (!m || !g) return iso;
  return `${g} ${MESI[m - 1].slice(0, 3)}`;
}

export const euro = (n: number) =>
  "€ " + n.toLocaleString("it-IT", { maximumFractionDigits: 0 });

/**
 * Riduce una foto prima di salvarla: le immagini piene saturano lo spazio
 * del dispositivo e appesantiscono la sincronizzazione.
 */
export function comprimiFoto(file: File, latoMax = 900, qualita = 0.72) {
  return new Promise<string>((ok, err) => {
    const lettore = new FileReader();
    lettore.onerror = () => err(new Error("lettura"));
    lettore.onload = () => {
      const img = new Image();
      img.onerror = () => err(new Error("immagine"));
      img.onload = () => {
        const scala = Math.min(1, latoMax / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scala);
        c.height = Math.round(img.height * scala);
        const ctx = c.getContext("2d");
        if (!ctx) return err(new Error("canvas"));
        ctx.drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", qualita));
      };
      img.src = String(lettore.result);
    };
    lettore.readAsDataURL(file);
  });
}

export const SPAZIO_PIENO =
  "Spazio esaurito sul dispositivo. Elimina qualche foto vecchia dal Portfolio o dal Diario: le immagini occupano molto.";
