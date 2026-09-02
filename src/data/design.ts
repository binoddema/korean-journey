export type Area = "matita" | "digitale" | "tredi" | "libro";

export type Esercizio = {
  id: string;
  area: Area;
  titolo: string;
  consegna: string;
  minuti: number;
  scopo: string;
};

export const AREE: { id: Area; nome: string; icona: string; sotto: string }[] = [
  { id: "matita", nome: "Disegno a mano", icona: "✏️", sotto: "Matita, prospettiva, resa" },
  { id: "digitale", nome: "Digitale", icona: "🖥", sotto: "Illustrator e Photoshop" },
  { id: "tredi", nome: "3D / CAD", icona: "🧊", sotto: "Modellazione e sviluppo" },
  { id: "libro", nome: "Libro", icona: "📖", sotto: "Lettura e verifica" },
];

export const ESERCIZI: Esercizio[] = [
  // ---------------- matita ----------------
  {
    id: "m1",
    area: "matita",
    titolo: "Anello di profilo, tre quarti",
    consegna: "Sei schizzi rapidi dello stesso anello, ruotando l'asse ogni volta.",
    minuti: 15,
    scopo: "La rotazione è il punto in cui la prospettiva cede per primo.",
  },
  {
    id: "m2",
    area: "matita",
    titolo: "Ellissi a mano libera",
    consegna: "Riempi il foglio di ellissi su assi diversi, senza righello. Poi cerchia le tre peggiori.",
    minuti: 15,
    scopo: "Ogni anello è un'ellisse: se sbagli quella, sbagli tutto il resto.",
  },
  {
    id: "m3",
    area: "matita",
    titolo: "Un castone, tre altezze",
    consegna: "Disegna lo stesso castone visto da sopra, a metà altezza e di lato.",
    minuti: 20,
    scopo: "Lo conosci dal banco: verifica se sai anche rappresentarlo.",
  },
  {
    id: "m4",
    area: "matita",
    titolo: "Brillante — riflessi",
    consegna: "Un taglio brillante grande, solo matita: costruisci le faccette e poi i valori.",
    minuti: 20,
    scopo: "La resa della pietra è ciò che distingue uno schizzo da una tavola.",
  },
  {
    id: "m5",
    area: "matita",
    titolo: "Lucido contro opaco",
    consegna: "Due volumi identici, uno in oro lucido e uno satinato.",
    minuti: 20,
    scopo: "Il metallo si legge dai contrasti, non dal colore.",
  },
  {
    id: "m6",
    area: "matita",
    titolo: "Dal reale al foglio",
    consegna: "Prendi un pezzo che hai in mano al lavoro e disegnalo di memoria a fine giornata.",
    minuti: 20,
    scopo: "Allena l'occhio a registrare, non solo a guardare.",
  },
  {
    id: "m7",
    area: "matita",
    titolo: "Solitario — vista tecnica",
    consegna: "Fronte, lato e sezione dello stesso anello, quote approssimative incluse.",
    minuti: 25,
    scopo: "È il disegno che serve a chi deve costruirlo davvero.",
  },
  {
    id: "m8",
    area: "matita",
    titolo: "Variazioni su un tema",
    consegna: "Una montatura di partenza, otto varianti in venti minuti. Niente rifiniture.",
    minuti: 20,
    scopo: "Quantità prima di qualità: è così che nascono le idee.",
  },

  // ---------------- digitale ----------------
  {
    id: "d1",
    area: "digitale",
    titolo: "Ricalco vettoriale",
    consegna: "Prendi uno schizzo a matita già fatto e ridisegnalo in Illustrator con la penna.",
    minuti: 20,
    scopo: "Collega le due tecniche invece di tenerle separate.",
  },
  {
    id: "d2",
    area: "digitale",
    titolo: "Gradienti su metallo",
    consegna: "Una fascia d'oro in vettoriale: costruisci il riflesso solo con sfumature.",
    minuti: 20,
    scopo: "Il metallo digitale vive di gradienti, non di ombre.",
  },
  {
    id: "d3",
    area: "digitale",
    titolo: "Tavola di presentazione",
    consegna: "Un progetto, un foglio: vista principale, dettaglio, dicitura essenziale.",
    minuti: 25,
    scopo: "Nel portfolio conta l'impaginazione quanto il disegno.",
  },
  {
    id: "d4",
    area: "digitale",
    titolo: "Pietre colorate",
    consegna: "Tre pietre dello stesso taglio in colori diversi, stesso schema di luce.",
    minuti: 20,
    scopo: "La coerenza della luce è ciò che rende credibile una tavola.",
  },
  {
    id: "d5",
    area: "digitale",
    titolo: "Ritocco fotografico",
    consegna: "Fotografa un tuo disegno a matita e pulisci sfondo, contrasto, bordi.",
    minuti: 15,
    scopo: "I disegni del portfolio si fotografano, e vanno trattati.",
  },
  {
    id: "d6",
    area: "digitale",
    titolo: "Collezione in miniatura",
    consegna: "Cinque pezzi della stessa famiglia disposti su un unico foglio.",
    minuti: 25,
    scopo: "Le scuole valutano la coerenza di una serie, non il singolo pezzo.",
  },

  // ---------------- 3D ----------------
  {
    id: "t1",
    area: "tredi",
    titolo: "Fede piatta",
    consegna: "Il pezzo più semplice che esista: falla giusta, con misura e spessore reali.",
    minuti: 20,
    scopo: "Si comincia da un oggetto di cui conosci già ogni quota.",
  },
  {
    id: "t2",
    area: "tredi",
    titolo: "Gambo che si assottiglia",
    consegna: "Un anello che passa da 2,2 mm sotto a 1,6 mm in cima.",
    minuti: 25,
    scopo: "La variazione di sezione è il primo passo verso una montatura vera.",
  },
  {
    id: "t3",
    area: "tredi",
    titolo: "Castone a griffe",
    consegna: "Quattro griffe su una pietra da 5 mm, con la sede corretta.",
    minuti: 30,
    scopo: "Qui il tuo mestiere ti dà un vantaggio: sai come deve stare la pietra.",
  },
  {
    id: "t4",
    area: "tredi",
    titolo: "Ripresa di un tuo disegno",
    consegna: "Prendi uno schizzo a matita della settimana e portalo in tre dimensioni.",
    minuti: 30,
    scopo: "È il passaggio che un portfolio deve dimostrare.",
  },
  {
    id: "t5",
    area: "tredi",
    titolo: "Controllo degli spessori",
    consegna: "Riapri un modello vecchio e verifica che sia fondibile davvero.",
    minuti: 20,
    scopo: "Un modello impossibile da produrre è un disegno, non un progetto.",
  },
  {
    id: "t6",
    area: "tredi",
    titolo: "Pavé regolare",
    consegna: "Una fila di pietre a passo costante lungo una superficie curva.",
    minuti: 30,
    scopo: "La distribuzione sulle curve è il problema classico del CAD in gioielleria.",
  },
];

export const perArea = (a: Area) => ESERCIZI.filter((e) => e.area === a);

/** Rotazione: lun/gio matita, mar/ven digitale, mer 3D, weekend progetto libero. */
export function areaDelGiorno(d: Date): Area {
  const g = d.getDay();
  if (g === 1 || g === 4) return "matita";
  if (g === 2 || g === 5) return "digitale";
  if (g === 3) return "tredi";
  return "matita";
}

/** Sceglie l'esercizio: il primo non ancora fatto, altrimenti a rotazione. */
export function esercizioDelGiorno(d: Date, fatti: string[]): Esercizio {
  const lista = perArea(areaDelGiorno(d));
  const nuovo = lista.find((e) => !fatti.includes(e.id));
  if (nuovo) return nuovo;
  const giorni = Math.floor(d.getTime() / 86400000);
  return lista[giorni % lista.length];
}
