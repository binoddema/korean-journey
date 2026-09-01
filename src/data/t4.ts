import type { LessonSeed } from "../types";

export const topic4: LessonSeed[] = [
  /* --------------------------------------------------------------- 11 */
  {
    title: "Al ristorante",
    emoji: "🍜",
    intro:
      "Con 주세요 e -고 싶어요 sopravvivi in qualsiasi locale coreano. Ordinare è più semplice che in Italia: si chiama il cameriere ad alta voce con 저기요!, senza imbarazzo.",
    vocab: [
      { ko: "식당", ro: "sik-dang", it: "ristorante, trattoria", emoji: "🍽️", hook: "식 = cibo, 당 = sala → «sala del cibo». È l'insegna che vedi sulle vetrine.", exKo: "식당에서 밥을 먹어요.", exIt: "Mangio al ristorante." },
      { ko: "메뉴", ro: "me-nyu", it: "menù", emoji: "📋", hook: "Prestito dall'inglese «menu»: si legge quasi uguale.", exKo: "메뉴 좀 주세요.", exIt: "Il menù, per favore." },
      { ko: "주세요", ro: "ju-se-yo", it: "mi dia, per favore", emoji: "🙏", hook: "Dal verbo 주다 (dare). È la formula magica: nome + 주세요.", exKo: "물 주세요.", exIt: "Dell'acqua, per favore.", reg: "educato" },
      { ko: "맛있다", ro: "ma-sit-da", it: "essere buono (di sapore)", emoji: "😋", hook: "맛 = sapore + 있다 = esserci → «c'è sapore».", exKo: "이 라면은 맛있어요.", exIt: "Questo ramyeon è buono." },
      { ko: "맵다", ro: "maep-da", it: "essere piccante", emoji: "🌶️", hook: "«Maep!» corto e bruciante come il peperoncino. Diventa 매워요.", exKo: "너무 매워요.", exIt: "È troppo piccante." },
      { ko: "계산", ro: "gye-san", it: "conto, pagamento", emoji: "🧾", hook: "계산서 = il conto scritto; 계산해 주세요 = «faccia il conto».", exKo: "계산할게요.", exIt: "Pago io / il conto, grazie." },
      { ko: "젓가락", ro: "jeot-ga-rak", it: "bacchette", emoji: "🥢", hook: "In Corea sono di metallo e piatte: pesanti da tenere le prime volte.", exKo: "젓가락 주세요.", exIt: "Delle bacchette, per favore." },
      { ko: "숟가락", ro: "sut-ga-rak", it: "cucchiaio", emoji: "🥄", hook: "Stessa parte finale di 젓가락: -가락 vale per gli utensili lunghi.", exKo: "숟가락으로 먹어요.", exIt: "Si mangia con il cucchiaio." },
      { ko: "자리", ro: "ja-ri", it: "posto, tavolo", emoji: "🪑", hook: "«Ja-ri» → il posto dove ti siedi (자다 = dormire… ma qui è solo il posto).", exKo: "자리 있어요?", exIt: "C'è posto?" },
      { ko: "포장", ro: "po-jang", it: "da asporto, da portare via", emoji: "🥡", hook: "Letteralmente «impacchettare»: 포장해 주세요 = da portare via.", exKo: "포장해 주세요.", exIt: "Da portare via, per favore." },
    ],
    grammar: [
      {
        title: "주세요 — chiedere qualcosa educatamente",
        when: "Al ristorante, al negozio, ovunque tu voglia chiedere una cosa o un favore.",
        how: "Nome + 주세요 per chiedere un oggetto. Verbo in forma -아/어 + 주세요 per chiedere un'azione.",
        examples: [
          { ko: "물 주세요.", ro: "mul ju-se-yo", it: "Dell'acqua, per favore." },
          { ko: "김치찌개 하나 주세요.", ro: "gim-chi-jji-gae ha-na ju-se-yo", it: "Uno stufato di kimchi, per favore." },
          { ko: "계산해 주세요.", ro: "gye-san-hae ju-se-yo", it: "Il conto, per favore." },
          { ko: "천천히 말해 주세요.", ro: "cheon-cheon-hi mal-hae ju-se-yo", it: "Parli più lentamente, per favore." },
        ],
        mistakes: [
          "Aggiungere 을/를 prima di 주세요 nel parlato veloce: 물 주세요 suona più naturale di 물을 주세요.",
          "Usare 주세요 con un superiore per cose importanti: lì si preferisce 주시겠어요?",
        ],
      },
      {
        title: "-고 싶어요 — «voglio…»",
        when: "Per esprimere un desiderio tuo (io / noi).",
        how: "Radice del verbo + 고 싶어요. Alla terza persona si usa 고 싶어해요.",
        examples: [
          { ko: "먹고 싶어요.", ro: "meok-go si-peo-yo", it: "Voglio mangiare." },
          { ko: "한국에 가고 싶어요.", ro: "han-gu-ge ga-go si-peo-yo", it: "Voglio andare in Corea." },
          { ko: "뭐 먹고 싶어요?", ro: "mwo meok-go si-peo-yo", it: "Cosa vuoi mangiare?" },
          { ko: "쉬고 싶어요.", ro: "swi-go si-peo-yo", it: "Voglio riposare." },
        ],
        mistakes: [
          "Coniugare il primo verbo: si attacca alla radice nuda (먹 + 고 싶어요), non a 먹어요.",
          "Usare 고 싶어요 per gli altri: per «lui vuole» serve 고 싶어해요.",
        ],
      },
    ],
    phrases: [
      { ko: "저기요!", ro: "jeo-gi-yo", it: "Scusi! (per chiamare il cameriere)", reg: "educato" },
      { ko: "자리 있어요?", ro: "ja-ri i-sseo-yo", it: "C'è posto?", reg: "educato" },
      { ko: "이거 하나 주세요.", ro: "i-geo ha-na ju-se-yo", it: "Uno di questi, per favore.", reg: "educato" },
      { ko: "안 매운 거 있어요?", ro: "an mae-un geo i-sseo-yo", it: "Avete qualcosa di non piccante?", reg: "educato" },
      { ko: "계산해 주세요.", ro: "gye-san-hae ju-se-yo", it: "Il conto, per favore.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "물 ___. (Dell'acqua, per favore.)",
        o: ["주세요", "있어요", "가요"],
        a: 0,
        why: "Nome + 주세요 è la formula per chiedere qualcosa.",
        say: "물 주세요.",
      },
      {
        k: "fill",
        q: "한국에 가___ 싶어요.",
        o: ["고", "서", "지"],
        a: 0,
        why: "Radice + 고 싶어요 = voglio fare qualcosa.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Cosa vuoi mangiare?»",
        w: ["싶어요", "뭐", "먹고"],
        a: "뭐 먹고 싶어요",
        why: "뭐 (cosa) + radice 먹 + 고 싶어요.",
      },
      {
        k: "trans",
        q: "È troppo piccante.",
        a: "너무 매워요",
        alt: ["너무 매워요.", "너무 매워요!"],
        why: "맵다 è irregolare in ㅂ: 맵 + 어요 → 매워요.",
      },
    ],
  },

  /* --------------------------------------------------------------- 12 */
  {
    title: "Trasporti e indicazioni",
    emoji: "🚇",
    intro:
      "La metropolitana di Seoul è enorme ma perfettamente segnalata. Bastano poche parole per chiedere la strada — e soprattutto per capire la risposta.",
    vocab: [
      { ko: "지하철", ro: "ji-ha-cheol", it: "metropolitana", emoji: "🚇", hook: "지하 = sottoterra, 철 = ferro → «il ferro sotto terra».", exKo: "지하철로 가요.", exIt: "Vado in metropolitana." },
      { ko: "버스", ro: "beo-seu", it: "autobus", emoji: "🚌", hook: "Prestito dall'inglese «bus», con la vocale in più che il coreano aggiunge sempre.", exKo: "버스를 타요.", exIt: "Prendo l'autobus." },
      { ko: "택시", ro: "taek-si", it: "taxi", emoji: "🚕", hook: "«Taek-si» = taxi: uno dei prestiti più facili da riconoscere.", exKo: "택시를 탈까요?", exIt: "Prendiamo un taxi?" },
      { ko: "역", ro: "yeok", it: "stazione", emoji: "🚉", hook: "Sta alla fine di ogni nome di fermata: 서울역, 강남역.", exKo: "강남역에서 만나요.", exIt: "Ci vediamo alla stazione di Gangnam." },
      { ko: "공항", ro: "gong-hang", it: "aeroporto", emoji: "✈️", hook: "공 = cielo/aria, 항 = porto → «porto dell'aria».", exKo: "공항에 어떻게 가요?", exIt: "Come si arriva all'aeroporto?" },
      { ko: "표", ro: "pyo", it: "biglietto", emoji: "🎫", hook: "Corta e secca: 표 sono anche i biglietti del cinema e del concerto.", exKo: "표 두 장 주세요.", exIt: "Due biglietti, per favore." },
      { ko: "오른쪽", ro: "o-reun-jjok", it: "destra", emoji: "➡️", hook: "쪽 significa «lato»: lo ritrovi in ogni indicazione.", exKo: "오른쪽으로 가세요.", exIt: "Vada a destra." },
      { ko: "왼쪽", ro: "oen-jjok", it: "sinistra", emoji: "⬅️", hook: "Stessa struttura: 왼 + 쪽 = lato sinistro.", exKo: "왼쪽에 있어요.", exIt: "È sulla sinistra." },
      { ko: "직진", ro: "jik-jin", it: "dritto, sempre diritto", emoji: "⬆️", hook: "직 = dritto, 진 = avanzare. Lo senti dire dai tassisti.", exKo: "직진하세요.", exIt: "Vada dritto." },
      { ko: "타다", ro: "ta-da", it: "salire su, prendere (un mezzo)", emoji: "🚏", hook: "Vale per bus, metro, taxi, aereo e persino biciclette.", exKo: "버스를 타요.", exIt: "Prendo l'autobus." },
    ],
    grammar: [
      {
        title: "-(으)로 — mezzo e direzione",
        when: "Per dire con quale mezzo ti muovi o verso quale direzione vai.",
        how: "로 dopo vocale o dopo ㄹ, 으로 dopo le altre consonanti.",
        examples: [
          { ko: "지하철로 가요.", ro: "ji-ha-cheol-lo ga-yo", it: "Vado in metropolitana. (finisce in ㄹ → 로)" },
          { ko: "버스로 와요.", ro: "beo-seu-ro wa-yo", it: "Vengo in autobus." },
          { ko: "오른쪽으로 가세요.", ro: "o-reun-jjo-geu-ro ga-se-yo", it: "Vada verso destra." },
          { ko: "젓가락으로 먹어요.", ro: "jeot-ga-ra-geu-ro meo-geo-yo", it: "Mangio con le bacchette. (strumento)" },
        ],
        mistakes: [
          "Usare 에 per il mezzo di trasporto: «버스에 가요» significherebbe «vado dentro l'autobus».",
          "Dimenticare che 타다 vuole 을/를: 버스를 타요, non «버스에 타요».",
        ],
      },
      {
        title: "-(으)세요 — richiesta cortese e istruzioni",
        when: "Per dire a qualcuno di fare qualcosa in modo gentile: indicazioni stradali, istruzioni, inviti.",
        how: "Radice + 세요 (dopo vocale) / 으세요 (dopo consonante).",
        examples: [
          { ko: "직진하세요.", ro: "jik-jin-ha-se-yo", it: "Vada dritto." },
          { ko: "여기 앉으세요.", ro: "yeo-gi an-jeu-se-yo", it: "Si sieda qui." },
          { ko: "조심하세요.", ro: "jo-sim-ha-se-yo", it: "Faccia attenzione." },
        ],
        mistakes: ["Usare -(으)세요 parlando di sé: è una forma rivolta all'altro, mai a te stesso."],
      },
    ],
    phrases: [
      { ko: "공항에 어떻게 가요?", ro: "gong-hang-e eo-tteo-ke ga-yo", it: "Come si arriva all'aeroporto?", reg: "educato" },
      { ko: "여기에서 멀어요?", ro: "yeo-gi-e-seo meo-reo-yo", it: "È lontano da qui?", reg: "educato" },
      { ko: "표 한 장 주세요.", ro: "pyo han jang ju-se-yo", it: "Un biglietto, per favore.", reg: "educato" },
      { ko: "몇 번 출구예요?", ro: "myeot beon chul-gu-ye-yo", it: "Quale uscita è?", reg: "educato" },
      { ko: "여기에서 세워 주세요.", ro: "yeo-gi-e-seo se-wo ju-se-yo", it: "Si fermi qui, per favore.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "지하철___ 가요. (Vado in metropolitana.)",
        o: ["로", "으로", "에"],
        a: 0,
        why: "지하철 finisce in ㄹ, quindi prende 로 e non 으로.",
      },
      {
        k: "fill",
        q: "버스___ 타요.",
        o: ["를", "에", "로"],
        a: 0,
        why: "타다 (salire su) vuole l'oggetto: 버스를 타요.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Come si arriva all'aeroporto?»",
        w: ["가요", "공항에", "어떻게"],
        a: "공항에 어떻게 가요",
        why: "Destinazione + 에, poi 어떻게, poi il verbo.",
      },
      {
        k: "trans",
        q: "Vada a destra.",
        a: "오른쪽으로 가세요",
        alt: ["오른쪽으로 가세요.", "오른쪽으로 가세요!"],
        why: "오른쪽 + 으로 (direzione) + 가세요 (richiesta cortese).",
      },
    ],
  },

  /* --------------------------------------------------------------- 13 */
  {
    title: "Negozi, hotel e prezzi",
    emoji: "🛍️",
    intro:
      "Comprare qualcosa significa saper chiedere il prezzo, capire la risposta e dire cosa cerchi. I numeri sino-coreani tornano utili: i won si contano a migliaia.",
    vocab: [
      { ko: "가게", ro: "ga-ge", it: "negozio", emoji: "🏪", hook: "«Ga-ge» → il posto dove «vai» (가다) a comprare.", exKo: "가게가 문을 닫았어요.", exIt: "Il negozio ha chiuso." },
      { ko: "시장", ro: "si-jang", it: "mercato", emoji: "🧺", hook: "Il 시장 tradizionale è pieno di cibo di strada: pensa a Gwangjang.", exKo: "시장에서 과일을 샀어요.", exIt: "Ho comprato frutta al mercato." },
      { ko: "돈", ro: "don", it: "soldi", emoji: "💵", hook: "Corta come una moneta che cade: «don!».", exKo: "돈이 없어요.", exIt: "Non ho soldi." },
      { ko: "비싸다", ro: "bi-ssa-da", it: "essere caro", emoji: "💸", hook: "«Bi-ssa» ha un suono aspro, come il prezzo che ti fa storcere la bocca.", exKo: "이건 너무 비싸요.", exIt: "Questo è troppo caro." },
      { ko: "싸다", ro: "ssa-da", it: "essere economico", emoji: "🏷️", hook: "È 비싸다 senza il 비: togli una sillaba, togli il prezzo.", exKo: "여기가 더 싸요.", exIt: "Qui costa meno." },
      { ko: "크다", ro: "keu-da", it: "essere grande", emoji: "🔷", hook: "«Keu» con la bocca larga: grande.", exKo: "사이즈가 커요.", exIt: "La taglia è grande." },
      { ko: "작다", ro: "jak-da", it: "essere piccolo", emoji: "🔹", hook: "«Jak» corta e chiusa, come qualcosa di piccolo.", exKo: "이 옷은 좀 작아요.", exIt: "Questo vestito è un po' piccolo." },
      { ko: "호텔", ro: "ho-tel", it: "hotel", emoji: "🏨", hook: "Prestito dall'inglese: 호텔.", exKo: "호텔을 예약했어요.", exIt: "Ho prenotato l'hotel." },
      { ko: "예약", ro: "ye-yak", it: "prenotazione", emoji: "📝", hook: "예 = prima, 약 = accordo → «accordo preso prima».", exKo: "예약했어요.", exIt: "Ho una prenotazione." },
      { ko: "카드", ro: "ka-deu", it: "carta (di pagamento)", emoji: "💳", hook: "In Corea si paga quasi tutto con la 카드: 카드 돼요? = si può pagare con carta?", exKo: "카드로 계산할게요.", exIt: "Pago con la carta." },
    ],
    grammar: [
      {
        title: "얼마예요? e i numeri sino-coreani grandi",
        when: "Per chiedere e capire i prezzi.",
        how: "백 = 100, 천 = 1.000, 만 = 10.000. Attenzione: i coreani contano a decine di migliaia, quindi 30.000 won = 삼만 원.",
        examples: [
          { ko: "이거 얼마예요?", ro: "i-geo eol-ma-ye-yo", it: "Quanto costa questo?" },
          { ko: "오천 원이에요.", ro: "o-cheon wo-ni-e-yo", it: "Sono 5.000 won." },
          { ko: "만 이천 원이에요.", ro: "man i-cheon wo-ni-e-yo", it: "Sono 12.000 won." },
          { ko: "너무 비싸요.", ro: "neo-mu bi-ssa-yo", it: "È troppo caro." },
        ],
        mistakes: [
          "Dire «일만» per 10.000: si dice solo 만.",
          "Ragionare in migliaia all'italiana: 100.000 won è 십만 원 («dieci diecimila»).",
        ],
      },
      {
        title: "안 e -지 않다 — la negazione",
        when: "Per dire che qualcosa non è o non si fa.",
        how: "안 va prima del verbo (안 비싸요). Con i verbi in 하다 si divide: 공부 안 해요. La forma -지 않다 è equivalente e un po' più formale.",
        examples: [
          { ko: "안 비싸요.", ro: "an bi-ssa-yo", it: "Non è caro." },
          { ko: "저는 커피를 안 마셔요.", ro: "jeo-neun keo-pi-reul an ma-syeo-yo", it: "Io non bevo caffè." },
          { ko: "오늘은 일 안 해요.", ro: "o-neu-reun il an hae-yo", it: "Oggi non lavoro." },
          { ko: "비싸지 않아요.", ro: "bi-ssa-ji a-na-yo", it: "Non è caro. (forma equivalente)" },
        ],
        mistakes: [
          "Dire «안 공부해요»: con i verbi composti la negazione entra in mezzo → 공부 안 해요.",
          "Usare 안 con 있다: la negazione è 없다.",
        ],
      },
    ],
    phrases: [
      { ko: "이거 얼마예요?", ro: "i-geo eol-ma-ye-yo", it: "Quanto costa questo?", reg: "educato" },
      { ko: "좀 깎아 주세요.", ro: "jom kka-kka ju-se-yo", it: "Mi faccia un po' di sconto.", reg: "educato" },
      { ko: "더 큰 거 있어요?", ro: "deo keun geo i-sseo-yo", it: "Ne avete uno più grande?", reg: "educato" },
      { ko: "카드 돼요?", ro: "ka-deu dwae-yo", it: "Si può pagare con la carta?", reg: "educato" },
      { ko: "예약했어요.", ro: "ye-ya-kae-sseo-yo", it: "Ho una prenotazione.", reg: "educato" },
    ],
    ex: [
      {
        k: "mc",
        q: "Come si dicono 30.000 won?",
        o: ["삼천 원", "삼만 원", "삼십 원", "만삼 원"],
        a: 1,
        why: "만 = 10.000, quindi 3 × 10.000 = 삼만 원.",
        say: "삼만 원",
      },
      {
        k: "fill",
        q: "오늘은 일 ___ 해요. (Oggi non lavoro.)",
        o: ["안", "못", "없"],
        a: 0,
        why: "Con 일하다 la negazione va in mezzo: 일 안 해요.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Questo è troppo caro.»",
        w: ["비싸요", "이거", "너무"],
        a: "이거 너무 비싸요",
        why: "Soggetto → avverbio → aggettivo.",
      },
      {
        k: "trans",
        q: "Quanto costa questo?",
        a: "이거 얼마예요?",
        alt: ["이거 얼마예요", "이거 얼마에요?"],
        why: "이거 (questo) + 얼마예요? (quanto è?).",
      },
    ],
  },
];
