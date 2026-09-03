export type Gruppo = "petto" | "spalle" | "tricipiti" | "schiena" | "bicipiti" | "gambe" | "core" | "cardio";

export type Esercizio = {
  id: string;
  nome: string;
  gruppo: Gruppo;
  serie: number;
  /** ripetizioni: "8-10" oppure durata in secondi se `secondi` è true */
  ripetizioni: string;
  secondi?: boolean;
  /** peso di partenza in kg; assente per corpo libero e cardio */
  peso?: number;
  /** peso di arrivo, quando l'esercizio è in progressione */
  pesoFine?: number;
  recupero: number;
  /** pausa prima dell'esercizio successivo */
  stacco?: number;
  /** file in public/esercizi/, senza estensione */
  img?: string;
  come: string;
  errore: string;
  disegno: string;
  /** immagine in /esercizi/<id>.jpg; se manca resta il disegno */
  foto?: boolean;
};

export type Scheda = {
  id: string;
  nome: string;
  esercizi: string[];
};

/* ------------------------------------------------------------------
   Disegni schematici — figure stilizzate, non illustrazioni anatomiche
   ------------------------------------------------------------------ */

const T = 'stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';

const svg = (corpo: string) =>
  `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${corpo}</svg>`;

const D = {
  panca: svg(`<line x1="20" y1="55" x2="95" y2="55" ${T}/><circle cx="55" cy="45" r="7" ${T}/><line x1="48" y1="48" x2="48" y2="28" ${T}/><line x1="62" y1="48" x2="62" y2="28" ${T}/><line x1="38" y1="28" x2="72" y2="28" ${T}/><circle cx="34" cy="28" r="6" ${T}/><circle cx="76" cy="28" r="6" ${T}/>`),
  pancaInc: svg(`<line x1="22" y1="62" x2="88" y2="34" ${T}/><circle cx="72" cy="34" r="7" ${T}/><line x1="66" y1="34" x2="60" y2="18" ${T}/><line x1="80" y1="34" x2="86" y2="18" ${T}/><circle cx="57" cy="15" r="5" ${T}/><circle cx="89" cy="15" r="5" ${T}/>`),
  chestPress: svg(`<rect x="24" y="22" width="14" height="40" rx="3" ${T}/><circle cx="58" cy="34" r="7" ${T}/><line x1="58" y1="41" x2="58" y2="60" ${T}/><line x1="58" y1="46" x2="84" y2="40" ${T}/><line x1="84" y1="30" x2="84" y2="52" ${T}/>`),
  shoulder: svg(`<circle cx="60" cy="52" r="8" ${T}/><line x1="60" y1="60" x2="60" y2="72" ${T}/><line x1="52" y1="48" x2="42" y2="26" ${T}/><line x1="68" y1="48" x2="78" y2="26" ${T}/><line x1="32" y1="22" x2="88" y2="22" ${T}/><circle cx="30" cy="22" r="5" ${T}/><circle cx="90" cy="22" r="5" ${T}/>`),
  alzate: svg(`<circle cx="60" cy="26" r="8" ${T}/><line x1="60" y1="34" x2="60" y2="60" ${T}/><line x1="60" y1="40" x2="30" y2="40" ${T}/><line x1="60" y1="40" x2="90" y2="40" ${T}/><rect x="20" y="34" width="10" height="12" rx="2" ${T}/><rect x="90" y="34" width="10" height="12" rx="2" ${T}/>`),
  pushdown: svg(`<line x1="60" y1="8" x2="60" y2="26" ${T}/><line x1="44" y1="26" x2="76" y2="26" ${T}/><circle cx="60" cy="44" r="8" ${T}/><line x1="54" y1="40" x2="48" y2="26" ${T}/><line x1="66" y1="40" x2="72" y2="26" ${T}/><line x1="60" y1="52" x2="60" y2="70" ${T}/>`),
  plank: svg(`<line x1="18" y1="62" x2="100" y2="62" ${T}/><line x1="30" y1="42" x2="88" y2="34" ${T}/><circle cx="94" cy="32" r="7" ${T}/><line x1="34" y1="44" x2="30" y2="60" ${T}/><line x1="34" y1="44" x2="46" y2="60" ${T}/>`),
  cardio: svg(`<line x1="18" y1="64" x2="96" y2="40" ${T}/><circle cx="70" cy="24" r="7" ${T}/><line x1="70" y1="31" x2="66" y2="48" ${T}/><line x1="66" y1="48" x2="56" y2="58" ${T}/><line x1="66" y1="48" x2="76" y2="58" ${T}/>`),
  lat: svg(`<line x1="30" y1="10" x2="90" y2="10" ${T}/><line x1="60" y1="10" x2="60" y2="24" ${T}/><circle cx="60" cy="36" r="8" ${T}/><line x1="53" y1="32" x2="36" y2="14" ${T}/><line x1="67" y1="32" x2="84" y2="14" ${T}/><line x1="60" y1="44" x2="60" y2="66" ${T}/>`),
  rematore: svg(`<circle cx="46" cy="28" r="7" ${T}/><line x1="46" y1="35" x2="76" y2="46" ${T}/><line x1="76" y1="46" x2="76" y2="66" ${T}/><line x1="56" y1="40" x2="52" y2="58" ${T}/><line x1="34" y1="58" x2="70" y2="58" ${T}/><circle cx="30" cy="58" r="5" ${T}/><circle cx="74" cy="58" r="5" ${T}/>`),
  pulley: svg(`<circle cx="72" cy="34" r="8" ${T}/><line x1="72" y1="42" x2="72" y2="58" ${T}/><line x1="72" y1="58" x2="34" y2="62" ${T}/><line x1="66" y1="40" x2="40" y2="44" ${T}/><rect x="22" y="38" width="12" height="12" rx="2" ${T}/>`),
  facePull: svg(`<circle cx="66" cy="34" r="8" ${T}/><line x1="59" y1="30" x2="40" y2="24" ${T}/><line x1="73" y1="30" x2="92" y2="24" ${T}/><line x1="66" y1="42" x2="66" y2="66" ${T}/><line x1="24" y1="24" x2="40" y2="24" ${T}/>`),
  curl: svg(`<circle cx="60" cy="24" r="8" ${T}/><line x1="60" y1="32" x2="60" y2="62" ${T}/><line x1="60" y1="40" x2="46" y2="52" ${T}/><line x1="46" y1="52" x2="52" y2="34" ${T}/><line x1="38" y1="34" x2="66" y2="34" ${T}/>`),
  crunch: svg(`<line x1="18" y1="62" x2="102" y2="62" ${T}/><circle cx="44" cy="42" r="7" ${T}/><line x1="50" y1="46" x2="66" y2="54" ${T}/><line x1="66" y1="54" x2="80" y2="42" ${T}/><line x1="80" y1="42" x2="88" y2="62" ${T}/>`),
  squat: svg(`<circle cx="60" cy="22" r="8" ${T}/><line x1="36" y1="18" x2="84" y2="18" ${T}/><line x1="60" y1="30" x2="60" y2="46" ${T}/><line x1="60" y1="46" x2="44" y2="56" ${T}/><line x1="44" y1="56" x2="46" y2="70" ${T}/><line x1="60" y1="46" x2="76" y2="56" ${T}/><line x1="76" y1="56" x2="74" y2="70" ${T}/>`),
  stacco: svg(`<circle cx="52" cy="24" r="7" ${T}/><line x1="52" y1="31" x2="62" y2="50" ${T}/><line x1="62" y1="50" x2="62" y2="68" ${T}/><line x1="58" y1="38" x2="58" y2="58" ${T}/><line x1="38" y1="58" x2="78" y2="58" ${T}/><circle cx="34" cy="58" r="6" ${T}/><circle cx="82" cy="58" r="6" ${T}/>`),
  legCurl: svg(`<line x1="20" y1="46" x2="76" y2="46" ${T}/><circle cx="26" cy="38" r="7" ${T}/><line x1="76" y1="46" x2="92" y2="34" ${T}/><rect x="88" y="28" width="12" height="10" rx="2" ${T}/>`),
  legExt: svg(`<line x1="24" y1="30" x2="24" y2="60" ${T}/><circle cx="32" cy="24" r="7" ${T}/><line x1="24" y1="52" x2="70" y2="52" ${T}/><line x1="70" y1="52" x2="94" y2="40" ${T}/><rect x="90" y="34" width="12" height="10" rx="2" ${T}/>`),
  calf: svg(`<circle cx="60" cy="20" r="8" ${T}/><line x1="60" y1="28" x2="60" y2="52" ${T}/><line x1="60" y1="52" x2="54" y2="66" ${T}/><line x1="60" y1="52" x2="66" y2="66" ${T}/><line x1="46" y1="70" x2="74" y2="70" ${T}/>`),
  hangLeg: svg(`<line x1="30" y1="10" x2="90" y2="10" ${T}/><line x1="60" y1="10" x2="60" y2="22" ${T}/><circle cx="60" cy="30" r="7" ${T}/><line x1="60" y1="37" x2="60" y2="54" ${T}/><line x1="60" y1="54" x2="86" y2="54" ${T}/>`),
};

/* ------------------------------------------------------------------
   Esercizi — valori di partenza presi dalla scheda attuale
   ------------------------------------------------------------------ */

export const ESERCIZI: Esercizio[] = [
  // ---------- GIORNO A ----------
  {
    id: "panca-piana",
    foto: true,
    nome: "Panca piana",
    gruppo: "petto",
    serie: 4,
    ripetizioni: "8-10",
    peso: 15,
    pesoFine: 20,
    recupero: 120,
    img: "panca-piana",
    come: "Scapole strette e ferme sulla panca, piedi a terra. Il bilanciere scende all'altezza del capezzolo sfiorando il petto, i gomiti a circa 45 gradi dal busto. Spingi senza staccare la schiena.",
    errore: "Gomiti aperti a 90 gradi: carica la spalla invece del petto.",
    disegno: D.panca,
  },
  {
    id: "panca-inclinata",
    foto: true,
    nome: "Panca inclinata manubri",
    gruppo: "petto",
    serie: 3,
    ripetizioni: "10-12",
    peso: 14,
    pesoFine: 16,
    recupero: 90,
    img: "panca-inclinata",
    come: "Schienale a 30-40 gradi. I manubri scendono ai lati del petto, i polsi restano sopra i gomiti. In alto non farli sbattere: ferma il movimento poco prima.",
    errore: "Inclinazione troppo alta: diventa un esercizio di spalle.",
    disegno: D.pancaInc,
  },
  {
    id: "chest-press",
    foto: true,
    nome: "Chest Press",
    gruppo: "petto",
    serie: 3,
    ripetizioni: "10-12",
    peso: 39,
    recupero: 75,
    img: "chest-press",
    come: "Regola il sedile in modo che le impugnature siano all'altezza del petto. Spingi controllando il ritorno, senza far toccare i pesi tra una ripetizione e l'altra.",
    errore: "Sedile troppo basso: le mani finiscono all'altezza del collo.",
    disegno: D.chestPress,
  },
  {
    id: "shoulder-press",
    foto: true,
    nome: "Shoulder Press",
    gruppo: "spalle",
    serie: 3,
    ripetizioni: "10",
    peso: 20.5,
    recupero: 90,
    img: "shoulder-press",
    come: "Schiena appoggiata, addome contratto. Spingi verso l'alto senza bloccare completamente i gomiti, e scendi fino a portare i gomiti all'altezza delle spalle.",
    errore: "Inarcare la schiena per aiutarsi: se succede, il peso è troppo.",
    disegno: D.shoulder,
  },
  {
    id: "alzate-laterali",
    foto: true,
    nome: "Alzate laterali",
    gruppo: "spalle",
    serie: 3,
    ripetizioni: "15",
    peso: 7,
    recupero: 45,
    img: "alzate-laterali",
    come: "Gomiti leggermente piegati e fissi. Sali fino all'altezza delle spalle guidando il movimento con il gomito, non con la mano. Scendi lentamente.",
    errore: "Slanciare con la schiena: qui il peso basso è la scelta giusta.",
    disegno: D.alzate,
  },
  {
    id: "pushdown",
    foto: true,
    nome: "Pushdown ai cavi",
    gruppo: "tricipiti",
    serie: 3,
    ripetizioni: "12",
    peso: 20,
    recupero: 45,
    img: "pushdown",
    come: "Gomiti attaccati ai fianchi e immobili. Si muove solo l'avambraccio. In basso allunga completamente senza spingere con le spalle.",
    errore: "Gomiti che scappano indietro: entra la schiena.",
    disegno: D.pushdown,
  },
  {
    id: "plank",
    foto: true,
    nome: "Plank",
    gruppo: "core",
    serie: 3,
    ripetizioni: "60",
    secondi: true,
    recupero: 45,
    img: "plank",
    come: "Gomiti sotto le spalle, corpo in linea dalla testa ai talloni. Glutei contratti e bacino leggermente retroverso: è quello che rende utile l'esercizio.",
    errore: "Bacino alto o schiena inarcata: meglio 30 secondi fatti bene che 60 storti.",
    disegno: D.plank,
  },
  {
    id: "cardio-inclinato",
    foto: true,
    nome: "Cardio inclinato",
    gruppo: "cardio",
    serie: 1,
    ripetizioni: "900",
    secondi: true,
    recupero: 0,
    img: "cardio-inclinato",
    come: "Tapis roulant con inclinazione 8-12%, passo che ti permette ancora di parlare a fatica. Non correre: cammina in salita.",
    errore: "Reggersi ai corrimano: annulla metà del lavoro.",
    disegno: D.cardio,
  },

  // ---------- GIORNO B ----------
  {
    id: "lat-machine",
    foto: true,
    nome: "Lat Machine",
    gruppo: "schiena",
    serie: 4,
    ripetizioni: "8-10",
    peso: 52,
    recupero: 90,
    img: "lat-machine",
    come: "Presa poco più larga delle spalle. Tira portando i gomiti verso il basso e indietro, la sbarra arriva sopra il petto. Petto in fuori per tutto il movimento.",
    errore: "Tirare dietro la nuca: inutile e scomodo per la spalla.",
    disegno: D.lat,
  },
  {
    id: "rematore",
    foto: true,
    nome: "Rematore",
    gruppo: "schiena",
    serie: 3,
    ripetizioni: "10",
    peso: 24,
    recupero: 90,
    img: "rematore",
    come: "Busto inclinato a circa 45 gradi, schiena piatta. Tira verso l'ombelico stringendo le scapole in fondo al movimento.",
    errore: "Schiena curva: fermati e riduci il peso, non è negoziabile.",
    disegno: D.rematore,
  },
  {
    id: "pulley",
    foto: true,
    nome: "Pulley",
    gruppo: "schiena",
    serie: 3,
    ripetizioni: "12",
    peso: 55,
    recupero: 75,
    img: "pulley",
    come: "Ginocchia morbide, busto quasi verticale. Tira all'addome, il busto resta fermo. In allungamento lascia scorrere le scapole in avanti senza curvare la schiena.",
    errore: "Dondolare avanti e indietro per muovere più peso.",
    disegno: D.pulley,
  },
  {
    id: "face-pull",
    foto: true,
    nome: "Face Pull",
    gruppo: "spalle",
    serie: 3,
    ripetizioni: "15",
    peso: 14,
    recupero: 45,
    img: "face-pull",
    come: "Cavo all'altezza del viso. Tira la corda verso la fronte aprendo le mani verso l'esterno, gomiti alti. Serve alla parte posteriore della spalla.",
    errore: "Tirare basso, verso il petto: diventa un rematore.",
    disegno: D.facePull,
  },
  {
    id: "curl-ez",
    foto: true,
    nome: "Curl EZ",
    gruppo: "bicipiti",
    serie: 3,
    ripetizioni: "10",
    peso: 5,
    pesoFine: 10,
    recupero: 60,
    img: "curl-ez",
    come: "Gomiti fermi ai fianchi, polsi neutri sulla barra sagomata. Sali senza portare i gomiti in avanti, scendi controllando.",
    errore: "Usare la schiena per lanciare il peso.",
    disegno: D.curl,
  },
  {
    id: "curl-manubri",
    foto: true,
    nome: "Curl manubri",
    gruppo: "bicipiti",
    serie: 3,
    ripetizioni: "12",
    peso: 7,
    recupero: 45,
    img: "curl-manubri",
    come: "Alterna le braccia o falle insieme. Ruota leggermente il polso verso l'esterno salendo. La fase di discesa dura più della salita.",
    errore: "Fermarsi a metà discesa: il muscolo lavora soprattutto lì.",
    disegno: D.curl,
  },
  {
    id: "crunch",
    foto: true,
    nome: "Crunch",
    gruppo: "core",
    serie: 3,
    ripetizioni: "15",
    recupero: 45,
    img: "crunch",
    come: "Solleva le scapole da terra arrotolando la colonna, non tirando il collo. Il movimento è corto: la schiena bassa resta a terra.",
    errore: "Mani dietro la testa che spingono il collo in avanti.",
    disegno: D.crunch,
  },
  {
    id: "cardio",
    foto: true,
    nome: "Cardio",
    gruppo: "cardio",
    serie: 1,
    ripetizioni: "900",
    secondi: true,
    recupero: 0,
    img: "cardio",
    come: "Quindici minuti a intensità moderata e costante, come defaticamento.",
    errore: "Partire troppo forte e fermarsi a metà.",
    disegno: D.cardio,
  },

  // ---------- GIORNO C ----------
  {
    id: "squat",
    foto: true,
    nome: "Squat / Leg Press",
    gruppo: "gambe",
    serie: 4,
    ripetizioni: "8-10",
    recupero: 150,
    img: "squat",
    come: "Squat: piedi larghi quanto le spalle, scendi mandando indietro il bacino fino almeno al parallelo, schiena neutra. Leg Press: non far staccare il bacino dallo schienale in basso.",
    errore: "Fermarsi troppo in alto: mezzo squat carica le ginocchia e non le gambe.",
    disegno: D.squat,
  },
  {
    id: "stacco-rumeno",
    foto: true,
    nome: "Stacco rumeno",
    gruppo: "gambe",
    serie: 3,
    ripetizioni: "10",
    recupero: 120,
    img: "stacco-rumeno",
    come: "Ginocchia quasi ferme, manda indietro il bacino facendo scorrere il bilanciere lungo le gambe. Scendi finché senti tirare dietro la coscia, non oltre.",
    errore: "Piegare le ginocchia come in uno squat: cambia esercizio.",
    disegno: D.stacco,
  },
  {
    id: "leg-curl",
    foto: true,
    nome: "Leg Curl",
    gruppo: "gambe",
    serie: 3,
    ripetizioni: "12",
    recupero: 60,
    img: "leg-curl",
    come: "Bacino appoggiato, piega le ginocchia portando i talloni verso i glutei. Ritorno lento e controllato.",
    errore: "Staccare il bacino per aiutarsi nell'ultima parte.",
    disegno: D.legCurl,
  },
  {
    id: "leg-extension",
    foto: true,
    nome: "Leg Extension",
    gruppo: "gambe",
    serie: 3,
    ripetizioni: "12",
    recupero: 60,
    img: "leg-extension",
    come: "Asse di rotazione della macchina allineato con il ginocchio. Estendi senza bloccare di scatto, fermati un istante in alto.",
    errore: "Carichi alti con strappo finale: le ginocchia lo pagano.",
    disegno: D.legExt,
  },
  {
    id: "calf-raise",
    foto: true,
    nome: "Calf Raise",
    gruppo: "gambe",
    serie: 3,
    ripetizioni: "15",
    recupero: 45,
    img: "calf-raise",
    come: "Sali sulle punte fino in cima e fermati un secondo. Scendi lentamente fino ad allungare il polpaccio sotto il livello del gradino.",
    errore: "Rimbalzare: il polpaccio risponde alla tensione, non al rimbalzo.",
    disegno: D.calf,
  },
  {
    id: "hanging-leg-raise",
    foto: true,
    nome: "Hanging Leg Raise",
    gruppo: "core",
    serie: 3,
    ripetizioni: "12",
    recupero: 60,
    img: "hanging-leg-raise",
    come: "Appeso alla sbarra, solleva le gambe arrotolando il bacino verso l'alto. Se non riesci con le gambe tese, piega le ginocchia.",
    errore: "Dondolare: se prendi slancio, l'addome smette di lavorare.",
    disegno: D.hangLeg,
  },
  {
    id: "cardio-c",
    foto: true,
    nome: "Cardio",
    gruppo: "cardio",
    serie: 1,
    ripetizioni: "900",
    secondi: true,
    recupero: 0,
    img: "cardio-c",
    come: "Quindici minuti finali, intensità moderata.",
    errore: "Saltarlo perché le gambe sono stanche: cammina piano, va bene lo stesso.",
    disegno: D.cardio,
  },

  // ---------- extra core ----------
  {
    id: "ab-wheel",
    foto: true,
    nome: "Ab Wheel",
    gruppo: "core",
    serie: 3,
    ripetizioni: "8",
    recupero: 60,
    img: "ab-wheel",
    come: "In ginocchio, rotella davanti. Rolla in avanti tenendo il bacino retroverso e la schiena piatta, torna senza inarcare. Parti con escursioni corte.",
    errore: "Andare troppo lontano subito: la schiena si inarca e fa male.",
    disegno: D.plank,
  },
  {
    id: "pallof",
    foto: true,
    nome: "Pallof Press",
    gruppo: "core",
    serie: 3,
    ripetizioni: "12",
    peso: 15,
    recupero: 45,
    img: "pallof",
    come: "Di lato al cavo, mani al petto. Spingi in avanti resistendo alla rotazione: il busto non deve girare. È un esercizio di anti-rotazione.",
    errore: "Peso troppo alto: il busto ruota e l'esercizio perde senso.",
    disegno: D.pushdown,
  },
];

export const SCHEDE: Scheda[] = [
  {
    id: "a",
    nome: "Giorno A — Petto, spalle, tricipiti",
    esercizi: [
      "panca-piana",
      "panca-inclinata",
      "chest-press",
      "shoulder-press",
      "alzate-laterali",
      "pushdown",
      "plank",
      "cardio-inclinato",
    ],
  },
  {
    id: "b",
    nome: "Giorno B — Schiena, bicipiti",
    esercizi: [
      "lat-machine",
      "rematore",
      "pulley",
      "face-pull",
      "curl-ez",
      "curl-manubri",
      "crunch",
      "cardio",
    ],
  },
  {
    id: "c",
    nome: "Giorno C — Gambe",
    esercizi: [
      "squat",
      "stacco-rumeno",
      "leg-curl",
      "leg-extension",
      "calf-raise",
      "hanging-leg-raise",
      "cardio-c",
    ],
  },
];

export const trova = (id: string) => ESERCIZI.find((e) => e.id === id);

export const cerca = (q: string) => {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return ESERCIZI.filter(
    (e) => e.nome.toLowerCase().includes(t) || e.gruppo.includes(t)
  ).slice(0, 8);
};
