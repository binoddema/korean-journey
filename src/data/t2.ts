import type { LessonSeed } from "../types";

export const topic2: LessonSeed[] = [
  /* ---------------------------------------------------------------- 5 */
  {
    title: "La famiglia e la casa",
    emoji: "🏠",
    intro:
      "Le prime cose di cui parli in una lingua nuova sono la tua famiglia e dove vivi. Oggi impari anche a dire che qualcosa «c'è» o «non c'è»: 있어요 / 없어요, due verbi che userai ogni giorno.",
    vocab: [
      { ko: "가족", ro: "ga-jok", it: "famiglia", emoji: "👨‍👩‍👧", hook: "«Ga-jok» → la famiglia è il «gruppo» che sta insieme sotto lo stesso tetto.", exKo: "우리 가족은 네 명이에요.", exIt: "La mia famiglia è di quattro persone." },
      { ko: "엄마", ro: "eom-ma", it: "mamma", emoji: "👩", hook: "Quasi identica all'italiano «mamma»: le mamme si chiamano così in mezzo mondo.", exKo: "엄마가 요리해요.", exIt: "La mamma cucina." },
      { ko: "아빠", ro: "ap-pa", it: "papà", emoji: "👨", hook: "Come «papà» al contrario: a-ppa.", exKo: "아빠는 회사에 가요.", exIt: "Papà va in ufficio." },
      { ko: "동생", ro: "dong-saeng", it: "fratello/sorella minore", emoji: "🧒", hook: "In coreano conta l'età, non il genere: 동생 è chiunque sia nato dopo di te.", exKo: "동생이 두 명 있어요.", exIt: "Ho due fratelli minori." },
      { ko: "집", ro: "jip", it: "casa", emoji: "🏡", hook: "«Jip» corto e chiuso come una porta che si chiude quando torni a casa.", exKo: "집에 있어요.", exIt: "Sono a casa." },
      { ko: "방", ro: "bang", it: "stanza, camera", emoji: "🛏️", hook: "«Bang»: chiudi la porta della camera di colpo, bang!", exKo: "제 방은 작아요.", exIt: "La mia stanza è piccola." },
      { ko: "문", ro: "mun", it: "porta", emoji: "🚪", hook: "«Mun» → «moon»: apri la porta e vedi la luna.", exKo: "문을 열어 주세요.", exIt: "Apra la porta, per favore." },
      { ko: "창문", ro: "chang-mun", it: "finestra", emoji: "🪟", hook: "È la «porta» (문) trasparente: 창 + 문.", exKo: "창문이 커요.", exIt: "La finestra è grande." },
      { ko: "의자", ro: "ui-ja", it: "sedia", emoji: "🪑", hook: "«Ui-ja» → immagina di sederti e fare «ui!» perché la sedia è dura.", exKo: "의자에 앉으세요.", exIt: "Si sieda sulla sedia." },
      { ko: "책상", ro: "chaek-sang", it: "scrivania", emoji: "🧑‍💻", hook: "책 = libro, 상 = tavolo → il tavolo dei libri.", exKo: "책상 위에 책이 있어요.", exIt: "Sulla scrivania c'è un libro." },
    ],
    grammar: [
      {
        title: "있어요 / 없어요 — c'è, non c'è (e «avere»)",
        when: "Per dire che qualcosa esiste, si trova in un posto, oppure che tu ce l'hai.",
        how: "Nome + 이/가 + 있어요 (c'è / ho) oppure 없어요 (non c'è / non ho). 이 dopo consonante, 가 dopo vocale.",
        examples: [
          { ko: "동생이 있어요.", ro: "dong-saeng-i i-sseo-yo", it: "Ho un fratello minore." },
          { ko: "시간이 없어요.", ro: "si-ga-ni eop-seo-yo", it: "Non ho tempo." },
          { ko: "방에 의자가 있어요.", ro: "bang-e ui-ja-ga i-sseo-yo", it: "In camera c'è una sedia." },
          { ko: "집에 아무도 없어요.", ro: "ji-be a-mu-do eop-seo-yo", it: "A casa non c'è nessuno." },
        ],
        mistakes: [
          "Cercare un verbo «avere» separato: in coreano si usa 있어요.",
          "Dire «안 있어요» per la negazione: la forma negativa è 없어요.",
        ],
      },
      {
        title: "에 — la particella di luogo (stato e destinazione)",
        when: "Con 있어요/없어요 per dire dove si trova qualcosa, e con i verbi di movimento per dire dove vai.",
        how: "Luogo + 에. Con 있어요 indica la posizione; con 가다/오다 indica la destinazione.",
        examples: [
          { ko: "집에 있어요.", ro: "ji-be i-sseo-yo", it: "Sono a casa." },
          { ko: "학교에 가요.", ro: "hak-gyo-e ga-yo", it: "Vado a scuola." },
          { ko: "책상 위에 있어요.", ro: "chaek-sang wi-e i-sseo-yo", it: "È sulla scrivania." },
        ],
        mistakes: [
          "Usare 에 anche per il luogo dove fai un'azione: lì serve 에서 (lo vedi nella lezione sulla routine).",
        ],
      },
    ],
    phrases: [
      { ko: "우리 가족은 네 명이에요.", ro: "u-ri ga-jo-geun ne myeong-i-e-yo", it: "La mia famiglia è di quattro persone.", reg: "educato" },
      { ko: "형제가 있어요?", ro: "hyeong-je-ga i-sseo-yo", it: "Hai fratelli?", reg: "educato" },
      { ko: "저는 지금 집에 있어요.", ro: "jeo-neun ji-geum ji-be i-sseo-yo", it: "Adesso sono a casa.", reg: "educato" },
      { ko: "방이 몇 개예요?", ro: "bang-i myeot gae-ye-yo", it: "Quante stanze ci sono?", reg: "educato" },
      { ko: "문을 닫아 주세요.", ro: "mu-neul da-da ju-se-yo", it: "Chiuda la porta, per favore.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "방에 의자가 ___. (In camera c'è una sedia.)",
        o: ["있어요", "없어요", "가요"],
        a: 0,
        why: "있어요 = c'è / esiste. 없어요 sarebbe «non c'è».",
      },
      {
        k: "fill",
        q: "저는 집___ 있어요.",
        o: ["에", "를", "도"],
        a: 0,
        why: "에 indica il luogo dove ci si trova: 집에 있어요 = sono a casa.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Ho due fratelli minori.»",
        w: ["있어요", "두 명", "동생이"],
        a: "동생이 두 명 있어요",
        why: "Nome + 이/가, poi la quantità, poi 있어요 alla fine.",
      },
      {
        k: "trans",
        q: "Non ho tempo.",
        a: "시간이 없어요",
        alt: ["시간이 없어요."],
        why: "시간 (tempo) + 이 + 없어요 (non c'è / non ho).",
      },
    ],
  },

  /* ---------------------------------------------------------------- 6 */
  {
    title: "Cibo e bevande",
    emoji: "🍚",
    intro:
      "Il cibo è il cuore della cultura coreana — e anche il modo più veloce per imparare i verbi. Oggi arriva la forma educata del presente, quella in -아요/어요 che sentirai in ogni conversazione.",
    vocab: [
      { ko: "밥", ro: "bap", it: "riso cotto, pasto", emoji: "🍚", hook: "밥 non è solo riso: 밥 먹었어요? («hai mangiato?») è il modo coreano di dire «come stai?».", exKo: "저는 밥을 먹어요.", exIt: "Io mangio il riso." },
      { ko: "물", ro: "mul", it: "acqua", emoji: "💧", hook: "«Mul» → immagina l'acqua che scorre e fa «mmmul».", exKo: "물 좀 주세요.", exIt: "Un po' d'acqua, per favore." },
      { ko: "김치", ro: "gim-chi", it: "kimchi (cavolo fermentato)", emoji: "🥬", hook: "Lo conosci già: è il contorno che c'è in ogni tavola coreana.", exKo: "김치는 조금 매워요.", exIt: "Il kimchi è un po' piccante." },
      { ko: "라면", ro: "ra-myeon", it: "ramyeon, noodles istantanei", emoji: "🍜", hook: "«Ra-myeon» = il ramen coreano, più piccante e sempre in pentola d'alluminio.", exKo: "라면을 끓여요.", exIt: "Preparo il ramyeon." },
      { ko: "커피", ro: "keo-pi", it: "caffè", emoji: "☕", hook: "È l'inglese «coffee» scritto in Hangul: 커 + 피.", exKo: "커피를 마셔요.", exIt: "Bevo un caffè." },
      { ko: "빵", ro: "ppang", it: "pane", emoji: "🍞", hook: "Viene dal portoghese «pão»: quasi identico all'italiano «pane»… e fa «ppang!».", exKo: "빵을 좋아해요.", exIt: "Mi piace il pane." },
      { ko: "고기", ro: "go-gi", it: "carne", emoji: "🥩", hook: "«Go-gi» → il 불고기 (bulgogi) che già conosci: 불 = fuoco, 고기 = carne.", exKo: "고기를 구워요.", exIt: "Griglio la carne." },
      { ko: "과일", ro: "gwa-il", it: "frutta", emoji: "🍎", hook: "«Gwa-il» → pensa a «qua-le frutto scegli?».", exKo: "과일이 신선해요.", exIt: "La frutta è fresca." },
      { ko: "먹다", ro: "meok-da", it: "mangiare", emoji: "😋", hook: "Immagina qualcuno che affonda il cucchiaio in una ciotola di riso: «meok!».", exKo: "저는 밥을 먹어요.", exIt: "Io mangio il riso." },
      { ko: "마시다", ro: "ma-si-da", it: "bere", emoji: "🥤", hook: "«Ma-si-da» → «ma-sti-care liquido»: si beve.", exKo: "물을 마셔요.", exIt: "Bevo acqua." },
    ],
    grammar: [
      {
        title: "을/를 — la particella dell'oggetto",
        when: "Dopo la cosa su cui ricade l'azione: quello che mangi, bevi, guardi, compri.",
        how: "Oggetto + 을 (dopo consonante) / 를 (dopo vocale) + verbo alla fine della frase.",
        examples: [
          { ko: "밥을 먹어요.", ro: "ba-beul meo-geo-yo", it: "Mangio il riso. (밥 → consonante → 을)" },
          { ko: "커피를 마셔요.", ro: "keo-pi-reul ma-syeo-yo", it: "Bevo un caffè. (커피 → vocale → 를)" },
          { ko: "김치를 좋아해요.", ro: "gim-chi-reul jo-a-hae-yo", it: "Mi piace il kimchi." },
          { ko: "빵을 사요.", ro: "ppang-eul sa-yo", it: "Compro il pane." },
        ],
        mistakes: [
          "Mettere il verbo in mezzo alla frase come in italiano: in coreano va sempre in fondo.",
          "Nel parlato veloce 을/를 spesso cadono, ma all'inizio è meglio usarle sempre.",
        ],
      },
      {
        title: "-아요 / -어요 — il presente educato",
        when: "È la forma di base per parlare con quasi tutti: colleghi, negozianti, persone che conosci poco.",
        how: "Togli -다 dal verbo. Se l'ultima vocale della radice è ㅏ o ㅗ aggiungi -아요, altrimenti -어요. I verbi in 하다 diventano 해요.",
        examples: [
          { ko: "먹다 → 먹어요", ro: "meok-da → meo-geo-yo", it: "mangiare → mangio (radice 먹, vocale ㅓ)" },
          { ko: "가다 → 가요", ro: "ga-da → ga-yo", it: "andare → vado (가 + 아요 si fondono)" },
          { ko: "마시다 → 마셔요", ro: "ma-si-da → ma-syeo-yo", it: "bere → bevo (시 + 어요 → 셔요)" },
          { ko: "공부하다 → 공부해요", ro: "gong-bu-ha-da → gong-bu-hae-yo", it: "studiare → studio" },
        ],
        mistakes: [
          "Coniugare la forma del dizionario così com'è: 먹다 non si usa mai nel parlato.",
          "Cercare le persone del verbo: in coreano 먹어요 vale per io, tu, lui, noi — cambia solo il contesto.",
        ],
        exceptions:
          "La stessa forma serve anche per il futuro immediato e per le domande: 먹어요? = «mangi?».",
      },
    ],
    phrases: [
      { ko: "밥 먹었어요?", ro: "bap meo-geo-sseo-yo", it: "Hai mangiato? (= come va?)", reg: "educato" },
      { ko: "물 좀 주세요.", ro: "mul jom ju-se-yo", it: "Un po' d'acqua, per favore.", reg: "educato" },
      { ko: "저는 커피를 마셔요.", ro: "jeo-neun keo-pi-reul ma-syeo-yo", it: "Io bevo il caffè.", reg: "educato" },
      { ko: "김치를 좋아해요?", ro: "gim-chi-reul jo-a-hae-yo", it: "Ti piace il kimchi?", reg: "educato" },
      { ko: "정말 맛있어요!", ro: "jeong-mal ma-si-sseo-yo", it: "È davvero buono!", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "저는 밥을 ___.",
        o: ["먹어요", "가요", "자요"],
        a: 0,
        why: "먹다 → 먹어요 (mangio). 가요 = vado, 자요 = dormo.",
        say: "저는 밥을 먹어요.",
      },
      {
        k: "fill",
        q: "커피___ 마셔요.",
        o: ["를", "을", "이"],
        a: 0,
        why: "커피 finisce per vocale → 를.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Bevo acqua.»",
        w: ["마셔요", "물을"],
        a: "물을 마셔요",
        why: "Oggetto + 을/를, verbo in fondo.",
      },
      {
        k: "trans",
        q: "Mi piace il kimchi.",
        a: "김치를 좋아해요",
        alt: ["저는 김치를 좋아해요", "김치를 좋아해요."],
        why: "좋아하다 (piacere/amare) è un verbo transitivo: vuole 을/를.",
      },
    ],
  },

  /* ---------------------------------------------------------------- 7 */
  {
    title: "La routine quotidiana",
    emoji: "🌤️",
    intro:
      "Raccontare la propria giornata è l'esercizio più utile che esista: usi sempre le stesse dieci parole finché diventano automatiche. Attenzione alla differenza tra 에 e 에서: è l'errore numero uno di chi comincia.",
    vocab: [
      { ko: "아침", ro: "a-chim", it: "mattina; colazione", emoji: "🌅", hook: "Una parola sola per «mattina» e «colazione»: la prima cosa del giorno.", exKo: "아침에 커피를 마셔요.", exIt: "La mattina bevo il caffè." },
      { ko: "점심", ro: "jeom-sim", it: "pranzo, mezzogiorno", emoji: "🍱", hook: "«Jeom-sim» → il «punto» centrale della giornata.", exKo: "점심을 먹어요.", exIt: "Pranzo." },
      { ko: "저녁", ro: "jeo-nyeok", it: "sera; cena", emoji: "🌙", hook: "Come 아침, indica sia il momento sia il pasto.", exKo: "저녁에 집에 가요.", exIt: "La sera torno a casa." },
      { ko: "학교", ro: "hak-gyo", it: "scuola", emoji: "🏫", hook: "Immagina il campanello che suona e tutti gridano «hak-gyo!» correndo dentro.", exKo: "학교에 가요.", exIt: "Vado a scuola." },
      { ko: "회사", ro: "hoe-sa", it: "azienda, ufficio", emoji: "🏢", hook: "«Hoe-sa» → 회사원 è l'impiegato: la parola più comune nei drama.", exKo: "회사에서 일해요.", exIt: "Lavoro in ufficio." },
      { ko: "가다", ro: "ga-da", it: "andare", emoji: "🚶", hook: "«Ga!» → «va!»: quasi identico all'imperativo italiano.", exKo: "학교에 가요.", exIt: "Vado a scuola." },
      { ko: "오다", ro: "o-da", it: "venire", emoji: "🔙", hook: "«O-da» è il contrario di 가다: la o è la bocca aperta di chi ti accoglie.", exKo: "친구가 집에 와요.", exIt: "Un amico viene a casa." },
      { ko: "자다", ro: "ja-da", it: "dormire", emoji: "😴", hook: "«Ja-da» → «già a letto». Diventa 자요.", exKo: "저는 열한 시에 자요.", exIt: "Vado a dormire alle undici." },
      { ko: "일하다", ro: "il-ha-da", it: "lavorare", emoji: "💼", hook: "일 = lavoro (ma anche «uno» e «giorno») + 하다 = fare.", exKo: "저는 매일 일해요.", exIt: "Lavoro tutti i giorni." },
      { ko: "공부하다", ro: "gong-bu-ha-da", it: "studiare", emoji: "📚", hook: "공부 = studio + 하다 = fare. Studiare in coreano è letteralmente «fare studio».", exKo: "한국어를 공부해요.", exIt: "Studio il coreano." },
    ],
    grammar: [
      {
        title: "에 e 에서 — due particelle di luogo",
        when: "에 = dove qualcuno o qualcosa si trova, o dove va. 에서 = dove si svolge un'azione, oppure il punto di partenza.",
        how: "Luogo + 에 con 있다/없다/가다/오다. Luogo + 에서 con tutti gli altri verbi (lavorare, studiare, mangiare…).",
        examples: [
          { ko: "학교에 가요.", ro: "hak-gyo-e ga-yo", it: "Vado a scuola. (destinazione)" },
          { ko: "학교에서 공부해요.", ro: "hak-gyo-e-seo gong-bu-hae-yo", it: "Studio a scuola. (azione)" },
          { ko: "집에 있어요.", ro: "ji-be i-sseo-yo", it: "Sono a casa." },
          { ko: "회사에서 일해요.", ro: "hoe-sa-e-seo il-hae-yo", it: "Lavoro in ufficio." },
          { ko: "이탈리아에서 왔어요.", ro: "i-tal-li-a-e-seo wa-sseo-yo", it: "Vengo dall'Italia. (origine)" },
        ],
        mistakes: [
          "Dire «학교에 공부해요»: se studi, l'azione avviene lì → 학교에서.",
          "Usare 에서 con 가다: la destinazione vuole sempre 에.",
        ],
      },
      {
        title: "에 con il tempo",
        when: "Per dire quando succede qualcosa: ore, giorni, momenti della giornata.",
        how: "Espressione di tempo + 에. Eccezioni: 오늘, 내일, 어제, 지금 non prendono 에.",
        examples: [
          { ko: "일곱 시에 일어나요.", ro: "il-gop si-e i-reo-na-yo", it: "Mi alzo alle sette." },
          { ko: "아침에 커피를 마셔요.", ro: "a-chi-me keo-pi-reul ma-syeo-yo", it: "La mattina bevo il caffè." },
          { ko: "주말에 쉬어요.", ro: "ju-ma-re swi-eo-yo", it: "Nel weekend riposo." },
        ],
        mistakes: ["Dire «오늘에»: con 오늘/내일/어제 la particella non si mette."],
      },
    ],
    phrases: [
      { ko: "아침에 커피를 마셔요.", ro: "a-chi-me keo-pi-reul ma-syeo-yo", it: "La mattina bevo il caffè.", reg: "educato" },
      { ko: "회사에서 일해요.", ro: "hoe-sa-e-seo il-hae-yo", it: "Lavoro in ufficio.", reg: "educato" },
      { ko: "저녁에 한국어를 공부해요.", ro: "jeo-nyeo-ge han-gu-geo-reul gong-bu-hae-yo", it: "La sera studio coreano.", reg: "educato" },
      { ko: "보통 몇 시에 자요?", ro: "bo-tong myeot si-e ja-yo", it: "Di solito a che ora vai a dormire?", reg: "educato" },
      { ko: "오늘은 집에 있어요.", ro: "o-neu-reun ji-be i-sseo-yo", it: "Oggi resto a casa.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "회사___ 일해요. (Lavoro in ufficio.)",
        o: ["에서", "에", "를"],
        a: 0,
        why: "L'azione (lavorare) avviene lì → 에서.",
      },
      {
        k: "fill",
        q: "학교___ 가요.",
        o: ["에", "에서", "은"],
        a: 0,
        why: "Con 가다 la destinazione vuole 에.",
      },
      {
        k: "build",
        q: "Ricostruisci: «La sera studio coreano.»",
        w: ["공부해요", "한국어를", "저녁에"],
        a: "저녁에 한국어를 공부해요",
        why: "Tempo → oggetto → verbo. L'ordine coreano è quasi sempre questo.",
      },
      {
        k: "trans",
        q: "Vado a scuola.",
        a: "학교에 가요",
        alt: ["학교에 가요.", "저는 학교에 가요"],
        why: "학교 + 에 (destinazione) + 가요.",
      },
    ],
  },
];
