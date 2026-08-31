# 🇰🇷 Korean Journey

App web per imparare il coreano da zero, in italiano: percorso quotidiano, spaced repetition, esercizi e progressi.
React + TypeScript + Vite, nessun backend, tutto salvato in `localStorage`.

## Avvio

```bash
npm install
npm run dev
```

### Su CodeSandbox

1. Apri [codesandbox.io](https://codesandbox.io) → **Create** → **Import project** → trascina il file `korean-journey.zip`
   (oppure carica la cartella su GitHub e importa il repository).
2. CodeSandbox riconosce Vite dal `package.json` e avvia da solo `npm run dev`.
3. `sandbox.config.json` è già incluso per far partire l'anteprima nel browser.

## Cosa c'è dentro

| Area | Dettaglio |
|---|---|
| Contenuti | 5 topic, 16 lezioni, 160 vocaboli, 20 punti di grammatica, 80 frasi utili |
| Esercizi | 6 tipi: scelta multipla, completa la frase, costruisci la frase, traduzione, ascolto, abbinamento |
| Ripasso | Spaced repetition con stati Nuovo → In apprendimento → Da ripassare → Imparato |
| Progressi | XP, livelli, streak, 8 achievement, grafici, obiettivi giornalieri e a lungo termine |
| Audio | Web Speech API (voce `ko-KR`) con fallback silenzioso e avviso se manca la voce |
| Dati | `localStorage`, con export/import del backup in JSON |

## Struttura

```
src/
  data/           t1.ts … t5.ts    → contenuti dei 5 topic
    index.ts                       → costruisce topic, lezioni, id dei vocaboli
  lib/
    srs.ts                         → algoritmo di ripetizione dilazionata
    exercises.ts                   → generatore di esercizi dai vocaboli
    progress.ts                    → livelli, achievement, obiettivi
    speech.ts                      → sintesi vocale coreana
  components/     Layout, ui, Exercise, Charts
  pages/          Home, Courses, Lesson, Review, Exercises, Progress, Goals, Settings
  store.tsx       stato globale + persistenza
  styles.css      tema chiaro/scuro, layout desktop e mobile
```

## Aggiungere una lezione

Apri il file del topic (per esempio `src/data/t2.ts`) e aggiungi un oggetto all'array:

```ts
{
  title: "Al telefono",
  emoji: "📞",
  intro: "Due righe che spiegano l'obiettivo della lezione.",
  vocab: [
    {
      ko: "전화", ro: "jeon-hwa", it: "telefono, telefonata", emoji: "📞",
      hook: "Come ricordarla.",
      exKo: "전화했어요.", exIt: "Ho telefonato.",
    },
    // …altri 9
  ],
  grammar: [{ title: "…", when: "…", how: "…", examples: [], mistakes: [] }],
  phrases: [{ ko: "…", ro: "…", it: "…" }],
  ex: [{ k: "fill", q: "…", o: ["…"], a: 0, why: "…" }],
}
```

Numerazione dei giorni, id dei vocaboli, esercizi generati automaticamente e ripasso si aggiornano da soli.

## Note

- La pronuncia dipende dalle voci installate sul dispositivo. Se manca una voce coreana l'app lo segnala e resta utilizzabile.
- I dati restano sul dispositivo: **Impostazioni → Esporta** prima di cambiare browser.
