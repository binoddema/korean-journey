import type { LessonSeed } from "../types";

export const topic5: LessonSeed[] = [
  /* --------------------------------------------------------------- 14 */
  {
    title: "Collegare le frasi",
    emoji: "🔗",
    intro:
      "Finora hai costruito frasi corte. Da qui in poi impari a unirle: è il salto che fa sembrare il tuo coreano «vero» invece che scolastico.",
    vocab: [
      { ko: "그리고", ro: "geu-ri-go", it: "e, inoltre", emoji: "➕", hook: "Unisce due frasi intere. Dentro la frase, «e» tra due nomi è invece 하고.", exKo: "밥을 먹었어요. 그리고 커피를 마셨어요.", exIt: "Ho mangiato. E poi ho bevuto un caffè." },
      { ko: "그래서", ro: "geu-rae-seo", it: "quindi, perciò", emoji: "➡️", hook: "그래 (è così) + 서 (quindi): «essendo così…».", exKo: "피곤해요. 그래서 집에 가요.", exIt: "Sono stanco. Perciò vado a casa." },
      { ko: "하지만", ro: "ha-ji-man", it: "però, ma", emoji: "↔️", hook: "Contiene 만 («solo, ma»): il freno della frase.", exKo: "맛있어요. 하지만 너무 매워요.", exIt: "È buono. Però è troppo piccante." },
      { ko: "그런데", ro: "geu-reon-de", it: "però; a proposito", emoji: "💬", hook: "Nel parlato si accorcia in 근데 e serve anche a cambiare argomento.", exKo: "그런데 지금 몇 시예요?", exIt: "A proposito, che ore sono?", reg: "colloquiale" },
      { ko: "왜냐하면", ro: "wae-nya-ha-myeon", it: "perché (spiegazione)", emoji: "📖", hook: "Contiene 왜 (perché): apre la spiegazione, e la frase si chiude con 때문이에요.", exKo: "왜냐하면 시간이 없기 때문이에요.", exIt: "Perché non ho tempo." },
      { ko: "그러면", ro: "geu-reo-myeon", it: "allora, in tal caso", emoji: "🤝", hook: "Nel parlato diventa 그럼. Introduce la conseguenza di quanto detto.", exKo: "그러면 내일 만나요.", exIt: "Allora ci vediamo domani." },
      { ko: "또", ro: "tto", it: "di nuovo, ancora", emoji: "🔁", hook: "Corta e ripetibile: 또 봐요! = «ci rivediamo!».", exKo: "또 만나요.", exIt: "Ci rivediamo." },
      { ko: "먼저", ro: "meon-jeo", it: "prima, per primo", emoji: "1️⃣", hook: "«Meon-jeo» → «mano avanti»: chi va per primo.", exKo: "먼저 숙제를 해요.", exIt: "Prima faccio i compiti." },
      { ko: "다음", ro: "da-eum", it: "prossimo, successivo", emoji: "⏭️", hook: "다음 주 = settimana prossima, 다음에 = la prossima volta.", exKo: "다음에 또 와요.", exIt: "Torna un'altra volta." },
      { ko: "같이", ro: "ga-chi", it: "insieme", emoji: "👫", hook: "Si scrive 같이 ma si legge «ga-chi»: la ㅌ davanti a 이 diventa «ch».", exKo: "같이 갈까요?", exIt: "Andiamo insieme?" },
    ],
    grammar: [
      {
        title: "-고 e -지만 — «e» e «ma» dentro una frase sola",
        when: "Per unire due azioni o due qualità senza spezzare la frase.",
        how: "Radice + 고 (e, poi) / 지만 (ma). Solo l'ultimo verbo prende il tempo e il livello di cortesia.",
        examples: [
          { ko: "밥을 먹고 커피를 마셔요.", ro: "ba-beul meok-go keo-pi-reul ma-syeo-yo", it: "Mangio e poi bevo un caffè." },
          { ko: "이 옷은 예쁘고 싸요.", ro: "i o-seun ye-ppeu-go ssa-yo", it: "Questo vestito è carino ed economico." },
          { ko: "맛있지만 매워요.", ro: "ma-sit-ji-man mae-wo-yo", it: "È buono ma piccante." },
          { ko: "한국어는 어렵지만 재미있어요.", ro: "han-gu-geo-neun eo-ryeop-ji-man jae-mi-i-sseo-yo", it: "Il coreano è difficile ma divertente." },
        ],
        mistakes: [
          "Coniugare anche il primo verbo: si dice 먹고, non «먹어요고».",
          "Ripetere il passato due volte: basta metterlo sull'ultimo verbo.",
        ],
      },
      {
        title: "-아서 / -어서 — causa e sequenza",
        when: "Per dire «siccome…, allora…» oppure «faccio A e poi (di conseguenza) B».",
        how: "Stessa regola vocalica di -아요/어요, ma senza 요: 먹어서, 가서, 해서. Il tempo va solo sull'ultimo verbo.",
        examples: [
          { ko: "피곤해서 일찍 잤어요.", ro: "pi-gon-hae-seo il-jjik ja-sseo-yo", it: "Ero stanco, perciò sono andato a letto presto." },
          { ko: "비가 와서 집에 있어요.", ro: "bi-ga wa-seo ji-be i-sseo-yo", it: "Piove, quindi resto a casa." },
          { ko: "친구를 만나서 밥을 먹었어요.", ro: "chin-gu-reul man-na-seo ba-beul meo-geo-sseo-yo", it: "Ho incontrato un amico e (con lui) ho mangiato." },
        ],
        mistakes: [
          "Mettere il passato prima di 서: si dice 피곤해서, mai «피곤했어서».",
          "Usare -아서/어서 con un imperativo o una proposta: in quel caso serve -(으)니까.",
        ],
        exceptions:
          "Con 그래서 la spiegazione sta in una frase separata; con -아서/어서 tutto resta in una frase sola.",
      },
    ],
    phrases: [
      { ko: "한국어는 어렵지만 재미있어요.", ro: "han-gu-geo-neun eo-ryeop-ji-man jae-mi-i-sseo-yo", it: "Il coreano è difficile ma bello.", reg: "educato" },
      { ko: "그래서 매일 공부해요.", ro: "geu-rae-seo mae-il gong-bu-hae-yo", it: "Perciò studio tutti i giorni.", reg: "educato" },
      { ko: "우리 같이 갈까요?", ro: "u-ri ga-chi gal-kka-yo", it: "Andiamo insieme?", reg: "educato" },
      { ko: "그럼 다음에 봐요.", ro: "geu-reom da-eu-me bwa-yo", it: "Allora ci vediamo la prossima volta.", reg: "educato" },
      { ko: "시간이 없어서 못 갔어요.", ro: "si-ga-ni eop-seo-seo mot ga-sseo-yo", it: "Non avevo tempo, quindi non ci sono andato.", reg: "educato" },
    ],
    ex: [
      {
        k: "fill",
        q: "한국어는 어렵___ 재미있어요.",
        o: ["지만", "고", "서"],
        a: 0,
        why: "지만 = ma. Le due parti sono in contrasto.",
        say: "한국어는 어렵지만 재미있어요.",
      },
      {
        k: "fill",
        q: "피곤___ 일찍 잤어요. (Ero stanco, perciò sono andato a letto presto.)",
        o: ["해서", "했어서", "하고"],
        a: 0,
        why: "Con -아서/어서 il primo verbo non porta il passato: 피곤해서.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Mangio e poi bevo un caffè.»",
        w: ["마셔요", "밥을", "커피를", "먹고"],
        a: "밥을 먹고 커피를 마셔요",
        why: "Prima azione con -고, seconda azione coniugata alla fine.",
      },
      {
        k: "trans",
        q: "Andiamo insieme?",
        a: "같이 갈까요?",
        alt: ["같이 갈까요", "우리 같이 갈까요?"],
        why: "같이 (insieme) + 갈까요? (-(으)ㄹ까요 propone qualcosa).",
      },
    ],
  },

  /* --------------------------------------------------------------- 15 */
  {
    title: "Onorifici e registri",
    emoji: "🙇",
    intro:
      "In coreano non basta sapere cosa dire: conta a chi lo dici. Gli onorifici non sono ornamenti, sono grammatica — e usarli bene ti fa fare un'ottima impressione.",
    vocab: [
      { ko: "-님", ro: "-nim", it: "suffisso di rispetto", emoji: "🎖️", hook: "Si attacca a titoli e ruoli: 선생님 (insegnante), 교수님 (professore).", exKo: "선생님, 질문 있어요.", exIt: "Professore, ho una domanda.", reg: "formale" },
      { ko: "성함", ro: "seong-ham", it: "nome (onorifico)", emoji: "📇", hook: "È la versione rispettosa di 이름: la usi con clienti e persone anziane.", exKo: "성함이 어떻게 되세요?", exIt: "Come si chiama, scusi?", reg: "formale" },
      { ko: "드시다", ro: "deu-si-da", it: "mangiare/bere (onorifico)", emoji: "🍵", hook: "È 먹다 con rispetto: 맛있게 드세요! = «buon appetito».", exKo: "많이 드세요.", exIt: "Mangi pure abbondantemente.", reg: "formale" },
      { ko: "계시다", ro: "gye-si-da", it: "esserci, stare (onorifico)", emoji: "🏛️", hook: "È 있다 riferito a una persona rispettata: 사장님 계세요? = «c'è il direttore?».", exKo: "사장님 계세요?", exIt: "C'è il direttore?", reg: "formale" },
      { ko: "말씀", ro: "mal-sseum", it: "parola, discorso (onorifico)", emoji: "🗣️", hook: "Versione rispettosa di 말: 말씀하세요 = «prego, dica».", exKo: "말씀하세요.", exIt: "Dica pure.", reg: "formale" },
      { ko: "저희", ro: "jeo-hui", it: "noi (umile)", emoji: "👥", hook: "È 우리 in versione modesta, tipico di chi parla per un'azienda.", exKo: "저희 가게는 아홉 시에 열어요.", exIt: "Il nostro negozio apre alle nove.", reg: "formale" },
      { ko: "드리다", ro: "deu-ri-da", it: "dare (a un superiore)", emoji: "🎁", hook: "È 주다 rovesciato: qui sei tu che dai a qualcuno più in alto.", exKo: "제가 연락드릴게요.", exIt: "La contatterò io.", reg: "formale" },
      { ko: "여쭤보다", ro: "yeo-jjwo-bo-da", it: "chiedere (a un superiore)", emoji: "🙋", hook: "Versione umile di 물어보다: chiedi «guardando in su».", exKo: "뭐 좀 여쭤봐도 돼요?", exIt: "Posso farle una domanda?", reg: "formale" },
      { ko: "존댓말", ro: "jon-daen-mal", it: "linguaggio formale/cortese", emoji: "🎩", hook: "존대 = rispetto + 말 = lingua. È tutto ciò che finisce in -요 o -습니다.", exKo: "존댓말을 써야 해요.", exIt: "Bisogna usare il linguaggio cortese." },
      { ko: "반말", ro: "ban-mal", it: "linguaggio informale", emoji: "👟", hook: "반 = metà → «mezza lingua»: si toglie il -요. Solo tra amici o con chi è più giovane.", exKo: "우리 반말해도 돼요?", exIt: "Possiamo darci del tu?", reg: "colloquiale" },
    ],
    grammar: [
      {
        title: "-(으)시- — l'onorifico del soggetto",
        when: "Quando il soggetto della frase è una persona che merita rispetto: cliente, capo, professore, persona anziana. Mai riferito a te stesso.",
        how: "Radice + 으시 (dopo consonante) / 시 (dopo vocale) + terminazione: 가다 → 가세요, 읽다 → 읽으세요.",
        examples: [
          { ko: "어디에 가세요?", ro: "eo-di-e ga-se-yo", it: "Dove va? (rispettoso)" },
          { ko: "성함이 어떻게 되세요?", ro: "seong-ha-mi eo-tteo-ke doe-se-yo", it: "Come si chiama?" },
          { ko: "선생님이 오셨어요.", ro: "seon-saeng-ni-mi o-syeo-sseo-yo", it: "È arrivato il professore. (passato onorifico)" },
          { ko: "많이 드세요.", ro: "ma-ni deu-se-yo", it: "Mangi pure. (드시다 sostituisce 먹다)" },
        ],
        mistakes: [
          "Usare -(으)시- parlando di sé: «저는 가세요» è un errore grave.",
          "Coniugare 먹다/있다 con -시-: hanno forme proprie, 드시다 e 계시다.",
        ],
        exceptions:
          "Alcuni verbi hanno una forma onorifica dedicata: 먹다 → 드시다, 있다 → 계시다, 자다 → 주무시다, 말하다 → 말씀하시다.",
      },
      {
        title: "존댓말 e 반말: quale usare",
        when: "존댓말 con sconosciuti, colleghi, chiunque sia più grande. 반말 solo con amici stretti, familiari più giovani o dopo che l'altro te lo ha proposto.",
        how: "존댓말 = forma in -요 (educata) o -습니다 (formale). 반말 = stessa forma senza 요: 먹어요 → 먹어.",
        examples: [
          { ko: "어디 가요? → 어디 가?", ro: "eo-di ga-yo → eo-di ga", it: "Dove vai? (educato → informale)" },
          { ko: "감사합니다 → 고마워", ro: "gam-sa-ham-ni-da → go-ma-wo", it: "grazie (formale → informale)" },
          { ko: "우리 말 놓을까요?", ro: "u-ri mal no-eul-kka-yo", it: "Ci diamo del tu?" },
        ],
        mistakes: [
          "Passare al 반말 di propria iniziativa: in Corea lo propone la persona più grande.",
          "Pensare che -요 sia «troppo formale»: è il registro neutro e sicuro in quasi ogni situazione.",
        ],
      },
    ],
    phrases: [
      { ko: "성함이 어떻게 되세요?", ro: "seong-ha-mi eo-tteo-ke doe-se-yo", it: "Come si chiama, scusi?", reg: "formale" },
      { ko: "맛있게 드세요.", ro: "ma-sit-ge deu-se-yo", it: "Buon appetito.", reg: "formale" },
      { ko: "잠시만 기다려 주세요.", ro: "jam-si-man gi-da-ryeo ju-se-yo", it: "Attenda un momento, per favore.", reg: "formale" },
      { ko: "뭐 좀 여쭤봐도 될까요?", ro: "mwo jom yeo-jjwo-bwa-do doel-kka-yo", it: "Posso farle una domanda?", reg: "formale" },
      { ko: "우리 말 놓을까요?", ro: "u-ri mal no-eul-kka-yo", it: "Ci diamo del tu?", reg: "colloquiale" },
    ],
    ex: [
      {
        k: "mc",
        q: "Come chiedi con rispetto «dove va?» a una persona anziana?",
        o: ["어디에 가요?", "어디에 가세요?", "어디에 가?", "어디에 갈래?"],
        a: 1,
        why: "-(으)시- rende onorifico il soggetto: 가다 → 가세요.",
        say: "어디에 가세요?",
      },
      {
        k: "mc",
        q: "Qual è la forma onorifica di 먹다?",
        o: ["먹으시다", "드시다", "계시다", "주무시다"],
        a: 1,
        why: "먹다 ha una forma dedicata: 드시다. 계시다 è per 있다, 주무시다 per 자다.",
        say: "드시다",
      },
      {
        k: "fill",
        q: "사장님 ___? (C'è il direttore?)",
        o: ["계세요", "있으세요", "이세요"],
        a: 0,
        why: "Per una persona rispettata 있다 diventa 계시다 → 계세요.",
      },
      {
        k: "trans",
        q: "Buon appetito. (a un ospite, con rispetto)",
        a: "맛있게 드세요",
        alt: ["맛있게 드세요.", "많이 드세요"],
        why: "맛있게 (in modo gustoso) + 드세요 (forma onorifica di 먹다).",
      },
    ],
  },

  /* --------------------------------------------------------------- 16 */
  {
    title: "Espressioni vere e cultura",
    emoji: "🚀",
    intro:
      "Queste sono le parole che non trovi nei manuali ma che senti ogni cinque minuti nei drama, nei video e per strada. Capire quando usarle — e quando no — è già coreano avanzato.",
    vocab: [
      { ko: "대박", ro: "dae-bak", it: "wow, pazzesco", emoji: "🤯", hook: "Letteralmente «grande zucca», cioè un colpo di fortuna enorme. Solo tra amici.", exKo: "대박! 진짜예요?", exIt: "Pazzesco! Davvero?", reg: "colloquiale" },
      { ko: "진짜", ro: "jin-jja", it: "davvero, sul serio", emoji: "😲", hook: "Il cugino colloquiale di 정말: 진짜? = «ma davvero?».", exKo: "진짜 맛있어요!", exIt: "È davvero buonissimo!", reg: "colloquiale" },
      { ko: "파이팅", ro: "pa-i-ting", it: "forza!, dai!", emoji: "💪", hook: "Dall'inglese «fighting», ma significa «in bocca al lupo»: si dice con il pugno alzato.", exKo: "시험 잘 봐요, 파이팅!", exIt: "In bocca al lupo per l'esame, forza!", reg: "colloquiale" },
      { ko: "눈치", ro: "nun-chi", it: "intuito sociale, saper leggere l'ambiente", emoji: "👁️", hook: "눈 = occhio: è la capacità di capire l'atmosfera senza che nessuno parli. Concetto chiave in Corea.", exKo: "그 사람은 눈치가 빨라요.", exIt: "Quella persona capisce tutto al volo." },
      { ko: "회식", ro: "hoe-sik", it: "cena aziendale", emoji: "🍻", hook: "회사 + 식사 → la cena di squadra dopo il lavoro, quasi un'istituzione.", exKo: "오늘 회식이 있어요.", exIt: "Oggi c'è la cena aziendale." },
      { ko: "아직", ro: "a-jik", it: "ancora, non ancora", emoji: "⏳", hook: "Spesso in coppia con la negazione: 아직 안 했어요 = «non l'ho ancora fatto».", exKo: "아직 안 끝났어요.", exIt: "Non è ancora finito." },
      { ko: "벌써", ro: "beol-sseo", it: "già", emoji: "⚡", hook: "L'opposto di 아직: esprime sorpresa per qualcosa arrivato prima del previsto.", exKo: "벌써 도착했어요?", exIt: "Sei già arrivato?" },
      { ko: "혹시", ro: "hok-si", it: "per caso, magari", emoji: "🤨", hook: "Apre le domande delicate in modo gentile: 혹시 시간 있어요?", exKo: "혹시 한국어 할 수 있어요?", exIt: "Per caso parli coreano?" },
      { ko: "물론", ro: "mul-lon", it: "certo, naturalmente", emoji: "👌", hook: "Si usa spesso con 이죠: 물론이죠! = «ma certo!».", exKo: "물론이죠!", exIt: "Ma certo!" },
      { ko: "수고하세요", ro: "su-go-ha-se-yo", it: "buon lavoro (a chi resta)", emoji: "🫡", hook: "Si dice uscendo dall'ufficio o lasciando un negozio. Con i superiori si preferisce 수고 많으셨습니다.", exKo: "먼저 갈게요. 수고하세요!", exIt: "Vado io per primo. Buon lavoro!", reg: "educato" },
    ],
    grammar: [
      {
        title: "아직 e 벌써 con i tempi giusti",
        when: "Per dire che qualcosa non è ancora successo o è già successo.",
        how: "아직 + negazione (안 / 못 / 없다) al passato o al presente. 벌써 + passato.",
        examples: [
          { ko: "아직 안 먹었어요.", ro: "a-jik an meo-geo-sseo-yo", it: "Non ho ancora mangiato." },
          { ko: "아직 몰라요.", ro: "a-jik mol-la-yo", it: "Non lo so ancora." },
          { ko: "벌써 다 했어요.", ro: "beol-sseo da hae-sseo-yo", it: "Ho già fatto tutto." },
          { ko: "벌써 여덟 시예요.", ro: "beol-sseo yeo-deol si-ye-yo", it: "Sono già le otto." },
        ],
        mistakes: [
          "Usare 아직 senza negazione quando intendi «non ancora».",
          "Confondere 벌써 (sorpresa) con 이미 (constatazione neutra).",
        ],
      },
      {
        title: "-(으)ㄹ 수 있어요 / 없어요 — potere e non potere",
        when: "Per dire che sai o puoi fare qualcosa.",
        how: "Radice + ㄹ 수 있어요 (dopo vocale) / 을 수 있어요 (dopo consonante). La negazione è 없어요.",
        examples: [
          { ko: "한국어를 할 수 있어요.", ro: "han-gu-geo-reul hal su i-sseo-yo", it: "So parlare coreano." },
          { ko: "매운 음식을 먹을 수 없어요.", ro: "mae-un eum-si-geul meo-geul su eop-seo-yo", it: "Non riesco a mangiare cibo piccante." },
          { ko: "내일 만날 수 있어요?", ro: "nae-il man-nal su i-sseo-yo", it: "Riusciamo a vederci domani?" },
        ],
        mistakes: [
          "Usare 안 al posto di 없어요: «할 수 안 있어요» non esiste.",
          "Confondere questa forma con 못: 못 하다 sottolinea l'impossibilità concreta.",
        ],
      },
    ],
    phrases: [
      { ko: "혹시 시간 있어요?", ro: "hok-si si-gan i-sseo-yo", it: "Per caso hai tempo?", reg: "educato" },
      { ko: "아직 잘 못해요.", ro: "a-jik jal mo-tae-yo", it: "Non lo so ancora fare bene.", reg: "educato" },
      { ko: "한국어 공부 파이팅!", ro: "han-gu-geo gong-bu pa-i-ting", it: "Forza con lo studio del coreano!", reg: "colloquiale" },
      { ko: "천천히 하면 돼요.", ro: "cheon-cheon-hi ha-myeon dwae-yo", it: "Va bene farlo con calma.", reg: "educato" },
      { ko: "수고하셨습니다.", ro: "su-go-ha-syeot-seum-ni-da", it: "Grazie per il lavoro svolto.", reg: "formale" },
    ],
    ex: [
      {
        k: "fill",
        q: "___ 안 먹었어요. (Non ho ancora mangiato.)",
        o: ["아직", "벌써", "물론"],
        a: 0,
        why: "아직 + negazione = «non ancora».",
      },
      {
        k: "fill",
        q: "한국어를 할 수 ___. (So parlare coreano.)",
        o: ["있어요", "없어요", "해요"],
        a: 0,
        why: "-(으)ㄹ 수 있어요 = essere in grado di.",
        say: "한국어를 할 수 있어요.",
      },
      {
        k: "build",
        q: "Ricostruisci: «Per caso hai tempo?»",
        w: ["있어요", "혹시", "시간"],
        a: "혹시 시간 있어요",
        why: "혹시 apre la domanda in modo gentile e va all'inizio.",
      },
      {
        k: "trans",
        q: "Non riesco a mangiare cibo piccante.",
        a: "매운 음식을 먹을 수 없어요",
        alt: ["매운 음식을 못 먹어요", "매운 음식을 먹을 수 없어요."],
        why: "먹다 + 을 수 없어요. Anche 못 먹어요 è corretto e più colloquiale.",
      },
    ],
  },
];
