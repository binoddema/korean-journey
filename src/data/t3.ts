import type { LessonSeed } from "../types";

export const topic3: LessonSeed[] = [
  /* ---------------------------------------------------------------- 8 */
  {
    title: "Fare domande",
    emoji: "❓",
    intro:
      "In coreano non serve invertire nulla per fare una domanda: basta alzare la voce alla fine. Quello che serve davvero sono le parole interrogative e i tre dimostrativi 이/그/저.",
    vocab: [
      { ko: "뭐", ro: "mwo", it: "che cosa", emoji: "🤔", hook: "«Mwo?» è anche l'espressione stupita che senti nei drama: «cosa?!».", exKo: "이거 뭐예요?", exIt: "Che cos'è questo?" },
      { ko: "어디", ro: "eo-di", it: "dove", emoji: "📍", hook: "«Eo-di» → «e dove?»: quasi la stessa musica dell'italiano.", exKo: "화장실이 어디예요?", exIt: "Dov'è il bagno?" },
      { ko: "누구", ro: "nu-gu", it: "chi", emoji: "🕵️", hook: "«Nu-gu» → «nu-gu-no?»: chi è quello?", exKo: "저 사람은 누구예요?", exIt: "Chi è quella persona?" },
      { ko: "언제", ro: "eon-je", it: "quando", emoji: "📅", hook: "«Eon-je» → «un giorno... quando?».", exKo: "언제 한국에 가요?", exIt: "Quando vai in Corea?" },
      { ko: "왜", ro: "wae", it: "perché", emoji: "🧐", hook: "Si pronuncia come l'inglese «why»: identico anche nel significato.", exKo: "왜 늦었어요?", exIt: "Perché sei in ritardo?" },
      { ko: "어떻게", ro: "eo-tteo-ke", it: "come", emoji: "🛠️", hook: "Lunga ma frequentissima: 어떻게 가요? = «come ci si arriva?».", exKo: "어떻게 가요?", exIt: "Come ci si va?" },
      { ko: "얼마", ro: "eol-ma", it: "quanto (prezzo)", emoji: "💰", hook: "«Eol-ma» → la prima parola che userai in un negozio: 얼마예요?", exKo: "이거 얼마예요?", exIt: "Quanto costa questo?" },
      { ko: "이거", ro: "i-geo", it: "questo (vicino a me)", emoji: "👉", hook: "이 = vicino a chi parla. Tienilo in mano mentre lo dici.", exKo: "이거 주세요.", exIt: "Prendo questo." },
      { ko: "그거", ro: "geu-geo", it: "quello (vicino a te)", emoji: "🫵", hook: "그 = vicino a chi ascolta, o una cosa già nominata.", exKo: "그거 맛있어요?", exIt: "Quello è buono?" },
      { ko: "저거", ro: "jeo-geo", it: "quello là (lontano da entrambi)", emoji: "🔭", hook: "저 = lontano da tutti e due. Lo indichi col dito da lontano.", exKo: "저거 뭐예요?", exIt: "Cos'è quello là?" },
    ],
    grammar: [
      {
        title: "Fare domande: intonazione e parola interrogativa",
        when: "Sempre. La forma del verbo non cambia rispetto all'affermativa.",
        how: "Stessa frase, punto interrogativo e voce che sale: 가요. → 가요? La parola interrogativa sta dove starebbe la risposta, non per forza all'inizio.",
        examples: [
          { ko: "어디에 가요?", ro: "eo-di-e ga-yo", it: "Dove vai?" },
          { ko: "이거 뭐예요?", ro: "i-geo mwo-ye-yo", it: "Che cos'è questo?" },
          { ko: "언제 만나요?", ro: "eon-je man-na-yo", it: "Quando ci vediamo?" },
          { ko: "누구예요?", ro: "nu-gu-ye-yo", it: "Chi è?" },
        ],
        mistakes: [
          "Invertire soggetto e verbo come in inglese: in coreano l'ordine resta identico.",
          "Mettere sempre la parola interrogativa all'inizio: 밥 뭐 먹어요? è perfettamente naturale.",
        ],
      },
      {
        title: "이/가 e 은/는: qual è la differenza",
        when: "이/가 introduce un'informazione nuova o risponde a «chi/che cosa?». 은/는 riprende un tema già noto o mette a confronto.",
        how: "이 dopo consonante, 가 dopo vocale. Nelle risposte alle domande con 누가/뭐가 si usa quasi sempre 이/가.",
        examples: [
          { ko: "누가 왔어요? — 친구가 왔어요.", ro: "nu-ga wa-sseo-yo — chin-gu-ga wa-sseo-yo", it: "Chi è arrivato? — È arrivato un amico. (informazione nuova)" },
          { ko: "친구는 학생이에요.", ro: "chin-gu-neun hak-saeng-i-e-yo", it: "L'amico (di cui parliamo) è studente. (tema noto)" },
          { ko: "저는 커피가 좋아요.", ro: "jeo-neun keo-pi-ga jo-a-yo", it: "Quanto a me, mi piace il caffè." },
        ],
        mistakes: [
          "Tradurre 은/는 con «il/la»: non è un articolo, segna il tema.",
          "Rispondere a 누가…? con 은/는: suona come un confronto, non come una risposta.",
        ],
      },
    ],
    phrases: [
      { ko: "이거 얼마예요?", ro: "i-geo eol-ma-ye-yo", it: "Quanto costa questo?", reg: "educato" },
      { ko: "화장실이 어디예요?", ro: "hwa-jang-si-ri eo-di-ye-yo", it: "Dov'è il bagno?", reg: "educato" },
      { ko: "이게 무슨 뜻이에요?", ro: "i-ge mu-seun tteu-si-e-yo", it: "Che cosa significa questo?", reg: "educato" },
      { ko: "다시 말해 주세요.", ro: "da-si mal-hae ju-se-yo", it: "Me lo ripeta, per favore.", reg: "educato" },
      { ko: "천천히 말해 주세요.", ro: "cheon-cheon-hi mal-hae ju-se-yo", it: "Parli più lentamente, per favore.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "___ 한국에 가요? (Quando vai in Corea?)",
        o: ["언제", "어디", "왜"],
        a: 0,
        why: "언제 = quando. 어디 = dove, 왜 = perché.",
      },
      {
        k: "mc",
        q: "Vuoi sapere il prezzo di un oggetto. Cosa dici?",
        o: ["이거 뭐예요?", "이거 얼마예요?", "이거 어디예요?", "이거 누구예요?"],
        a: 1,
        why: "얼마예요? = quanto costa? 뭐예요? chiede che cos'è.",
        say: "이거 얼마예요?",
      },
      {
        k: "build",
        q: "Ricostruisci: «Chi è quella persona (là)?»",
        w: ["누구예요", "사람은", "저"],
        a: "저 사람은 누구예요",
        why: "저 (quello là) + 사람 + 은 + 누구예요?",
      },
      {
        k: "trans",
        q: "Dov'è il bagno?",
        a: "화장실이 어디예요?",
        alt: ["화장실이 어디예요", "화장실이 어디에 있어요?"],
        why: "화장실 (bagno) + 이 + 어디예요? Anche 어디에 있어요? va benissimo.",
      },
    ],
  },

  /* ---------------------------------------------------------------- 9 */
  {
    title: "Parlare del passato",
    emoji: "⏪",
    intro:
      "Il passato coreano è sorprendentemente semplice: una sillaba in più, 았/었, e hai finito. Nessun ausiliare, nessun participio irregolare da imparare a memoria.",
    vocab: [
      { ko: "어제", ro: "eo-je", it: "ieri", emoji: "📆", hook: "«Eo-je» → «e-ri»: ieri. Non prende mai la particella 에.", exKo: "어제 친구를 만났어요.", exIt: "Ieri ho incontrato un amico." },
      { ko: "오늘", ro: "o-neul", it: "oggi", emoji: "☀️", hook: "«O-neul» → «o-ggi neul-la»: la giornata di adesso.", exKo: "오늘 뭐 했어요?", exIt: "Cosa hai fatto oggi?" },
      { ko: "내일", ro: "nae-il", it: "domani", emoji: "🔜", hook: "내 = venturo, 일 = giorno → «il giorno che viene».", exKo: "내일 만나요.", exIt: "Ci vediamo domani." },
      { ko: "주말", ro: "ju-mal", it: "weekend", emoji: "🎉", hook: "주 = settimana, 말 = fine → letteralmente «fine settimana».", exKo: "주말에 뭐 했어요?", exIt: "Cosa hai fatto nel weekend?" },
      { ko: "보다", ro: "bo-da", it: "vedere, guardare", emoji: "👀", hook: "«Bo-da» → immagina di sbirciare da dietro una porta: bo!", exKo: "영화를 봤어요.", exIt: "Ho visto un film." },
      { ko: "만나다", ro: "man-na-da", it: "incontrare", emoji: "🤝", hook: "«Man-na» → due «man» (persone) che si incontrano.", exKo: "친구를 만났어요.", exIt: "Ho incontrato un amico." },
      { ko: "사다", ro: "sa-da", it: "comprare", emoji: "🛍️", hook: "«Sa-da» → «sal-do»: quando c'è il saldo si compra.", exKo: "옷을 샀어요.", exIt: "Ho comprato dei vestiti." },
      { ko: "하다", ro: "ha-da", it: "fare", emoji: "🔧", hook: "Il verbo più usato del coreano: attaccato a un nome lo trasforma in verbo (공부하다, 일하다).", exKo: "숙제를 했어요.", exIt: "Ho fatto i compiti." },
      { ko: "좋다", ro: "jo-ta", it: "essere buono, bello, piacevole", emoji: "👍", hook: "«Jo-ta» → «jolly good». È un aggettivo, quindi si coniuga come un verbo: 좋아요.", exKo: "날씨가 좋아요.", exIt: "Il tempo è bello." },
      { ko: "재미있다", ro: "jae-mi-it-da", it: "essere divertente, interessante", emoji: "😄", hook: "재미 = divertimento + 있다 = esserci → «c'è divertimento».", exKo: "그 영화는 재미있었어요.", exIt: "Quel film era divertente." },
    ],
    grammar: [
      {
        title: "-았어요 / -었어요 — il passato",
        when: "Per qualsiasi azione o stato concluso.",
        how: "Prendi la forma in -아요/어요, togli 요 e aggiungi -ㅆ어요: 가요 → 갔어요, 먹어요 → 먹었어요, 해요 → 했어요.",
        examples: [
          { ko: "먹어요 → 먹었어요", ro: "meo-geo-yo → meo-geo-sseo-yo", it: "mangio → ho mangiato" },
          { ko: "가요 → 갔어요", ro: "ga-yo → ga-sseo-yo", it: "vado → sono andato/a" },
          { ko: "봐요 → 봤어요", ro: "bwa-yo → bwa-sseo-yo", it: "guardo → ho guardato" },
          { ko: "공부해요 → 공부했어요", ro: "gong-bu-hae-yo → gong-bu-hae-sseo-yo", it: "studio → ho studiato" },
          { ko: "어제 친구를 만났어요.", ro: "eo-je chin-gu-reul man-na-sseo-yo", it: "Ieri ho incontrato un amico." },
        ],
        mistakes: [
          "Cercare la differenza tra passato prossimo e imperfetto: in coreano c'è una forma sola.",
          "Aggiungere 했어요 a un verbo già completo: si dice 갔어요, non «가 했어요».",
        ],
      },
    ],
    phrases: [
      { ko: "주말에 뭐 했어요?", ro: "ju-ma-re mwo hae-sseo-yo", it: "Cosa hai fatto nel weekend?", reg: "educato" },
      { ko: "어제 영화를 봤어요.", ro: "eo-je yeong-hwa-reul bwa-sseo-yo", it: "Ieri ho visto un film.", reg: "educato" },
      { ko: "정말 재미있었어요.", ro: "jeong-mal jae-mi-i-sseo-sseo-yo", it: "È stato davvero divertente.", reg: "educato" },
      { ko: "친구를 만났어요.", ro: "chin-gu-reul man-na-sseo-yo", it: "Ho incontrato un amico.", reg: "educato" },
      { ko: "잘 잤어요?", ro: "jal ja-sseo-yo", it: "Hai dormito bene?", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "어제 영화를 ___.",
        o: ["봤어요", "봐요", "볼래요"],
        a: 0,
        why: "어제 (ieri) chiede il passato: 봐요 → 봤어요.",
        say: "어제 영화를 봤어요.",
      },
      {
        k: "mc",
        q: "Qual è il passato di 공부해요?",
        o: ["공부했어요", "공부해었어요", "공부하았어요", "공부해요었"],
        a: 0,
        why: "I verbi in 하다 fanno 해요 → 했어요.",
        say: "공부했어요",
      },
      {
        k: "build",
        q: "Ricostruisci: «Ieri ho incontrato un amico.»",
        w: ["만났어요", "어제", "친구를"],
        a: "어제 친구를 만났어요",
        why: "Tempo → oggetto → verbo al passato.",
      },
      {
        k: "trans",
        q: "Cosa hai fatto oggi?",
        a: "오늘 뭐 했어요?",
        alt: ["오늘 뭐 했어요", "오늘 무엇을 했어요?"],
        why: "오늘 non prende 에. 뭐 + 했어요? = «che cosa hai fatto?».",
      },
    ],
  },

  /* --------------------------------------------------------------- 10 */
  {
    title: "Gusti ed emozioni",
    emoji: "💚",
    intro:
      "Dire cosa ti piace e come ti senti è ciò che rende una conversazione vera. Occhio a una trappola classica: 좋다 e 좋아하다 sembrano gemelli ma si costruiscono in modo diverso.",
    vocab: [
      { ko: "좋아하다", ro: "jo-a-ha-da", it: "amare, piacere (a qualcuno)", emoji: "❤️", hook: "좋다 (essere bello) + 하다 (fare) → «trovare bello» qualcosa.", exKo: "저는 김치를 좋아해요.", exIt: "Mi piace il kimchi." },
      { ko: "싫어하다", ro: "si-reo-ha-da", it: "detestare, non sopportare", emoji: "🙅", hook: "«Si-reo» ha il suono di chi storce il naso: 싫어!", exKo: "저는 매운 음식을 싫어해요.", exIt: "Non mi piace il cibo piccante." },
      { ko: "기분", ro: "gi-bun", it: "umore, stato d'animo", emoji: "🎭", hook: "기 = energia, 분 = parte → «la parte di energia» che senti oggi.", exKo: "오늘 기분이 좋아요.", exIt: "Oggi sono di buon umore." },
      { ko: "행복하다", ro: "haeng-bo-ka-da", it: "essere felice", emoji: "😊", hook: "Più forte del semplice «contento»: è la felicità piena.", exKo: "정말 행복해요.", exIt: "Sono davvero felice." },
      { ko: "슬프다", ro: "seul-peu-da", it: "essere triste", emoji: "😢", hook: "«Seul-peu» ha un suono che scivola giù, come una lacrima.", exKo: "그 이야기는 슬퍼요.", exIt: "Quella storia è triste." },
      { ko: "화나다", ro: "hwa-na-da", it: "arrabbiarsi", emoji: "😠", hook: "화 significa «fuoco»: la rabbia che sale.", exKo: "왜 화났어요?", exIt: "Perché ti sei arrabbiato?" },
      { ko: "피곤하다", ro: "pi-gon-ha-da", it: "essere stanco", emoji: "😪", hook: "Il coreano l'ha preso dal cinese, ma somiglia all'italiano «fiacco».", exKo: "오늘 너무 피곤해요.", exIt: "Oggi sono stanchissimo." },
      { ko: "정말", ro: "jeong-mal", it: "davvero, veramente", emoji: "‼️", hook: "«Jeong-mal?» da solo significa «davvero?!».", exKo: "정말 맛있어요.", exIt: "È davvero buono." },
      { ko: "너무", ro: "neo-mu", it: "troppo; davvero (colloquiale)", emoji: "🔺", hook: "In teoria è negativo («troppo»), nel parlato quotidiano vale «tantissimo».", exKo: "너무 좋아요.", exIt: "Mi piace tantissimo.", reg: "colloquiale" },
      { ko: "조금", ro: "jo-geum", it: "un po'", emoji: "🤏", hook: "Nel parlato si accorcia in 좀, che serve anche ad addolcire le richieste: 물 좀 주세요.", exKo: "조금 피곤해요.", exIt: "Sono un po' stanco." },
    ],
    grammar: [
      {
        title: "좋다 e 좋아하다: due costruzioni diverse",
        when: "좋다 descrive la cosa («è bella, è buona»); 좋아하다 descrive la persona che prova il gusto.",
        how: "Cosa + 이/가 + 좋아요. Persona + 은/는 + cosa + 을/를 + 좋아해요.",
        examples: [
          { ko: "커피가 좋아요.", ro: "keo-pi-ga jo-a-yo", it: "Il caffè è buono / mi va bene il caffè." },
          { ko: "저는 커피를 좋아해요.", ro: "jeo-neun keo-pi-reul jo-a-hae-yo", it: "Io amo il caffè." },
          { ko: "날씨가 좋아요.", ro: "nal-ssi-ga jo-a-yo", it: "Il tempo è bello." },
          { ko: "동생은 라면을 좋아해요.", ro: "dong-saeng-eun ra-myeo-neul jo-a-hae-yo", it: "Mio fratello ama il ramyeon." },
        ],
        mistakes: [
          "Dire «저는 커피가 좋아해요»: con 좋아하다 serve 을/를.",
          "Tradurre alla lettera «mi piace» con un dativo: in coreano chi prova il gusto è il soggetto.",
        ],
      },
      {
        title: "Avverbi di intensità: 정말, 너무, 조금, 아주",
        when: "Per graduare aggettivi e verbi.",
        how: "Vanno subito prima della parola che modificano.",
        examples: [
          { ko: "정말 재미있어요.", ro: "jeong-mal jae-mi-i-sseo-yo", it: "È davvero divertente." },
          { ko: "너무 매워요.", ro: "neo-mu mae-wo-yo", it: "È troppo piccante." },
          { ko: "조금 슬퍼요.", ro: "jo-geum seul-peo-yo", it: "Sono un po' triste." },
          { ko: "아주 좋아요.", ro: "a-ju jo-a-yo", it: "È ottimo." },
        ],
        mistakes: ["Mettere l'avverbio dopo l'aggettivo, come in «buono molto»: in coreano viene sempre prima."],
      },
    ],
    phrases: [
      { ko: "저는 한국 음식을 좋아해요.", ro: "jeo-neun han-guk eum-si-geul jo-a-hae-yo", it: "Mi piace il cibo coreano.", reg: "educato" },
      { ko: "오늘 기분이 어때요?", ro: "o-neul gi-bu-ni eo-ttae-yo", it: "Come ti senti oggi?", reg: "educato" },
      { ko: "너무 피곤해요.", ro: "neo-mu pi-gon-hae-yo", it: "Sono stanchissimo/a.", reg: "educato" },
      { ko: "저도 좋아해요.", ro: "jeo-do jo-a-hae-yo", it: "Piace anche a me.", reg: "educato" },
      { ko: "별로 안 좋아해요.", ro: "byeol-lo an jo-a-hae-yo", it: "Non mi piace granché.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "저는 커피___ 좋아해요.",
        o: ["를", "가", "에"],
        a: 0,
        why: "좋아하다 vuole l'oggetto: 커피를 좋아해요.",
      },
      {
        k: "mc",
        q: "Come dici «il tempo è bello»?",
        o: ["날씨가 좋아요", "날씨를 좋아해요", "날씨가 좋아해요", "날씨를 좋아요"],
        a: 0,
        why: "좋다 descrive la cosa stessa e vuole 이/가.",
        say: "날씨가 좋아요",
      },
      {
        k: "build",
        q: "Ricostruisci: «Oggi sono un po' stanco.»",
        w: ["피곤해요", "조금", "오늘"],
        a: "오늘 조금 피곤해요",
        why: "Tempo → avverbio → aggettivo-verbo.",
      },
      {
        k: "trans",
        q: "Mi piace il cibo coreano.",
        a: "저는 한국 음식을 좋아해요",
        alt: ["한국 음식을 좋아해요", "저는 한국 음식을 좋아해요."],
        why: "Persona + 은/는, oggetto + 을/를, 좋아해요 in fondo.",
      },
    ],
  },
];
