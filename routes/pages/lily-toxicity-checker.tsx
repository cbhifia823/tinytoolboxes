import { useEffect, useMemo, useState } from "react";
import { Faq, SITE_URL, ToolPage, applySEO } from "@/components/tt/chrome";
import { ALL_LOCALES, useLocale, type Locale } from "@/lib/use-locale";

const PAGE_PATH = "/lily-toxicity-checker";

type Level = "deadly" | "danger" | "mild" | "safe";
const LEVELS: Level[] = ["deadly", "danger", "mild", "safe"];
type L10n = Record<Locale, string>;

type Copy = {
  section: string;
  crumbHome: string;
  crumbPets: string;
  crumbHere: string;
  title: string;
  lede: string;
  seoTitle: string;
  seoDesc: string;
  alertTitle: string;
  alertBody: string;
  hotline: string;
  hotlineNote: string;
  levels: Record<Level, string>;
  filterAll: string;
  searchLabel: string;
  searchPlaceholder: string;
  resultCount: (n: number) => string;
  noMatch: string;
  tipsTitle: string;
  tipsLede: string;
  tips: string[];
  safeTitle: string;
  safeText: string;
  articles: { title: string; paras: string[] }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  relatedTitle: string;
  disclaimer: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    section: "Pets",
    crumbHome: "Home",
    crumbPets: "Pets",
    crumbHere: "Lilies",
    title: "Lily Toxicity Checker for Cats",
    lede: "Search any flower called a “lily” to see whether it's dangerous for your cat. True lilies (Lilium) and daylilies (Hemerocallis) cause kidney failure — many lookalikes don't.",
    seoTitle: "Lily Toxicity Checker for Cats — Which Lilies Are Poisonous? | TinyToolboxes",
    seoDesc: "Check if a lily is toxic to cats. Easter, tiger, Asiatic and Stargazer lilies and daylilies cause kidney failure; peace and calla lilies are mild. Free, in 5 languages.",
    alertTitle: "If your cat touched a true lily, go to a vet now",
    alertBody: "All parts of true lilies (Lilium and Hemerocallis) — petals, leaves, pollen, stamens, even the water in the vase — can cause acute kidney failure in cats within 24–72 hours. Even a tiny amount can be fatal. If your cat licked pollen off its fur or drank from a vase with lilies, go to an emergency vet immediately. Do not wait for symptoms.",
    hotline: "ASPCA Animal Poison Control (US): (888) 426-4435",
    hotlineNote: "Outside the US, call your nearest 24-hour emergency vet. A consultation fee may apply.",
    levels: {
      deadly: "Deadly to cats — emergency vet now",
      danger: "Dangerous — heart toxin, call a vet",
      mild: "Mild — irritation, no kidney damage",
      safe: "Non-toxic",
    },
    filterAll: "All",
    searchLabel: "Search by common or scientific name",
    searchPlaceholder: "Try: Easter, Stargazer, peace, calla",
    resultCount: (n) => `${n} ${n === 1 ? "plant" : "plants"}`,
    noMatch: "No match. Not being on this list doesn't mean a plant is safe — if in doubt, treat it as a true lily and call your vet.",
    tipsTitle: "Cat-safe home",
    tipsLede: "Prevention matters most.",
    tips: [
      "Avoid bouquets that contain any Lilium or Hemerocallis varieties.",
      "Tell the florist you have a cat before they arrange a delivery.",
      "Treatment within 6 hours gives the best outcome.",
    ],
    safeTitle: "Cat-safe flowers instead",
    safeText: "Roses, sunflowers, moth orchids (Phalaenopsis), gerberas and African violets are generally listed as non-toxic to cats.",
    articles: [
      {
        title: "True lilies vs lookalikes",
        paras: [
          "“Lily” is a loose word in everyday language. To a cat owner, it should mean one specific thing: any plant in the genus Lilium (true lilies) or Hemerocallis (daylilies). Every part of these plants — petals, leaves, stems, pollen, even the water in a vase — contains an unidentified compound that damages a cat's kidneys. As little as two petals, or pollen groomed off the fur, can be fatal without treatment.",
          "Many flowers called “lily” are not toxic in this way. Peace lily (Spathiphyllum), calla lily (Zantedeschia) and Peruvian lily (Alstroemeria) belong to different plant families. They contain calcium oxalates or mild irritants that cause drooling and stomach upset, but they do not damage the kidneys. Lily of the valley (Convallaria) is a danger of its own: it contains cardiac glycosides that affect the heart.",
        ],
      },
      {
        title: "Why are cats uniquely vulnerable?",
        paras: [
          "The exact mechanism is still being researched, but among common pets only cats develop kidney damage from Lilium and Hemerocallis. Dogs, rabbits and rodents do not show the same injury. Within 12–24 hours of ingestion, cells in the cat's kidney tubules begin to die. The earlier treatment starts, the better: ideally within 6 hours, and certainly within 18. When treatment is delayed beyond 18 hours, kidney failure is often irreversible.",
        ],
      },
      {
        title: "What treatment looks like",
        paras: [
          "If exposure was recent, the vet will induce vomiting, give activated charcoal, and start intravenous fluids for at least 48–72 hours to protect the kidneys and keep urine flowing. Blood tests track kidney values (BUN, creatinine, SDMA). In severe cases, dialysis may be used. Cats that survive may have lasting kidney damage that needs lifelong care.",
        ],
      },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "My cat brushed against a lily but didn't eat it — is that dangerous?", a: "It can be. Cats groom constantly, and pollen on the fur gets licked off and swallowed. Even a small amount of pollen is enough to injure the kidneys. Wash the pollen off and call a vet, even if you didn't see your cat eat anything." },
      { q: "What signs of lily poisoning should I watch for?", a: "Early signs (0–12 hours): drooling, vomiting, loss of appetite, lethargy. Later signs (12–72 hours): more and then less urination, dehydration, seizures and collapse as kidney failure progresses. Don't wait for these signs — by the time the later ones appear, the kidneys may already be badly damaged." },
      { q: "Are lilies dangerous to dogs?", a: "Most true lilies cause only mild stomach upset in dogs — vomiting and diarrhea — without the kidney injury seen in cats. Lily of the valley, however, is dangerous to dogs because of its heart toxins. Keep these plants away from all pets." },
      { q: "Can I keep lilies in a home with cats if they're out of reach?", a: "It's risky. Cats jump higher and more deliberately than most owners expect, and pollen drifts onto counters and floors. Vets and the ASPCA strongly recommend that homes with cats avoid Lilium and Hemerocallis entirely. Choose cat-safe flowers such as roses, sunflowers, moth orchids, gerberas or African violets." },
    ],
    relatedTitle: "More pet safety tools",
    disclaimer: "This tool is for information only. Always ask a licensed veterinarian about any suspected pet poisoning.",
  },
  "zh-hk": {
    section: "寵物",
    crumbHome: "主頁",
    crumbPets: "寵物",
    crumbHere: "百合",
    title: "貓貓百合毒性檢查器",
    lede: "搜尋任何叫「百合」嘅花，睇吓對貓貓有冇危險。真百合（Lilium）同萱草（Hemerocallis）會引致腎衰竭——好多樣似嘅花就唔會。",
    seoTitle: "貓貓百合毒性檢查器 — 邊種百合有毒？| TinyToolboxes",
    seoDesc: "查吓百合對貓有冇毒。復活節百合、虎百合、亞洲百合、星佳沙同萱草會引致腎衰竭；白鶴芋同馬蹄蓮只係輕微。免費，支援 5 種語言。",
    alertTitle: "貓貓掂過真百合，即刻去睇獸醫",
    alertBody: "真百合（Lilium 同 Hemerocallis）嘅所有部分——花瓣、葉、花粉、雄蕊，甚至花樽入面嘅水——都可以喺 24–72 小時內引致貓貓急性腎衰竭。即使極少量都可能致命。如果貓貓舔咗身上嘅花粉，或者飲咗插住百合嘅花樽水，即刻去急症。唔好等症狀出現。",
    hotline: "ASPCA 動物中毒控制中心（美國）：(888) 426-4435",
    hotlineNote: "美國以外，請致電最近嘅 24 小時動物急症醫院。可能需要收費。",
    levels: {
      deadly: "對貓致命 — 即刻去急症",
      danger: "危險 — 影響心臟，即刻搵獸醫",
      mild: "輕微 — 會刺激，唔傷腎",
      safe: "無毒",
    },
    filterAll: "全部",
    searchLabel: "用常見名或學名搜尋",
    searchPlaceholder: "例如：復活節、星佳沙、白鶴芋、馬蹄蓮",
    resultCount: (n) => `${n} 種植物`,
    noMatch: "搵唔到。唔喺清單上面唔代表安全——如有疑問，當佢係真百合處理，即刻聯絡獸醫。",
    tipsTitle: "貓貓安全屋企",
    tipsLede: "預防最重要。",
    tips: [
      "避免任何有 Lilium 或 Hemerocallis 品種嘅花束。",
      "叫花店送花之前，先話畀佢哋知你有養貓。",
      "6 小時內開始治療，效果最好。",
    ],
    safeTitle: "可以改擺呢啲花",
    safeText: "玫瑰、向日葵、蝴蝶蘭、非洲菊同非洲紫羅蘭，一般被列為對貓無毒。",
    articles: [
      {
        title: "真百合同樣似百合嘅花",
        paras: [
          "「百合」喺日常講法入面好籠統。對貓主人嚟講，應該指特定植物：百合屬（Lilium，真百合）或者萱草屬（Hemerocallis）嘅任何植物。呢啲植物嘅所有部分——花瓣、葉、莖、花粉，甚至花樽入面嘅水——都含有一種未確認嘅物質，會損害貓貓嘅腎臟。只係兩塊花瓣，或者舔走毛上面嘅花粉，唔醫都可以致命。",
          "好多叫「百合」嘅花其實唔係咁樣有毒。白鶴芋（和平百合，Spathiphyllum）、馬蹄蓮（Zantedeschia）同秘魯百合（Alstroemeria）屬於唔同嘅植物科。佢哋含草酸鈣或者輕微刺激物，會引致流口水同腸胃不適，但唔會傷腎。鈴蘭（Convallaria）就係另一種危險：佢含強心苷，會影響心臟。",
        ],
      },
      {
        title: "點解貓貓特別容易中毒？",
        paras: [
          "準確機制仲喺研究緊，但喺常見寵物之中，只有貓貓會因為 Lilium 同 Hemerocallis 而傷腎。狗、兔同嚙齒類動物唔會有同樣嘅損傷。食咗之後 12–24 小時內，貓貓腎小管嘅細胞就開始壞死。越早治療越好：最好喺 6 小時內，最遲都要喺 18 小時內。拖過 18 小時，腎衰竭好多時都冇得逆轉。",
        ],
      },
      {
        title: "治療點樣進行",
        paras: [
          "如果係啱啱接觸，獸醫會催吐、餵活性炭，再開始至少 48–72 小時嘅靜脈輸液，保護腎臟同維持尿量。血液檢查會追蹤腎功能指標（BUN、肌酸酐、SDMA）。嚴重情況可能要洗腎。捱得過嘅貓貓都可能有長期腎損傷，需要終身護理。",
        ],
      },
    ],
    faqTitle: "常見問題",
    faq: [
      { q: "貓貓掂到百合但冇食到，係咪都危險？", a: "有可能。貓貓成日舔毛，毛上面嘅花粉會被舔落肚。少少花粉已經足以傷腎。幫貓貓洗走花粉，就算冇見到佢食咗嘢，都要聯絡獸醫。" },
      { q: "要留意邊啲百合中毒徵狀？", a: "早期（0–12 小時）：流口水、嘔吐、唔肯食嘢、無精打采。後期（12–72 小時）：小便先多後少、脫水、抽搐，腎衰竭惡化時會虛脫。唔好等呢啲徵狀出現——去到後期，腎臟可能已經嚴重受損。" },
      { q: "百合對狗有冇危險？", a: "大部分真百合只會令狗輕微腸胃不適——嘔吐同肚瀉——唔會好似貓咁傷腎。不過鈴蘭含強心苷，對狗都好危險。所有寵物都要遠離呢啲植物。" },
      { q: "如果將百合放喺貓貓掂唔到嘅地方，可以擺喺屋企嗎？", a: "有風險。貓貓跳得比主人想像中高，又會刻意跳上去，花粉亦會飄到枱面或者跌落地。獸醫同 ASPCA 強烈建議有貓嘅家庭完全唔好擺 Lilium 同 Hemerocallis。可以改擺玫瑰、向日葵、蝴蝶蘭、非洲菊或者非洲紫羅蘭等對貓安全嘅花。" },
    ],
    relatedTitle: "更多寵物安全工具",
    disclaimer: "本工具只供參考。懷疑寵物中毒，請一定要諮詢註冊獸醫。",
  },
  "zh-cn": {
    section: "宠物",
    crumbHome: "首页",
    crumbPets: "宠物",
    crumbHere: "百合",
    title: "猫咪百合毒性检查器",
    lede: "搜索任何叫“百合”的花，看看对猫咪是否危险。真百合（Lilium）和萱草（Hemerocallis）会导致肾衰竭——许多外形相似的花则不会。",
    seoTitle: "猫咪百合毒性检查器 — 哪些百合有毒？| TinyToolboxes",
    seoDesc: "查询百合对猫是否有毒。复活节百合、卷丹、亚洲百合、东方百合和萱草会导致肾衰竭；白鹤芋和马蹄莲仅为轻微。免费，支持 5 种语言。",
    alertTitle: "猫咪接触了真百合，请立即就医",
    alertBody: "真百合（Lilium 和 Hemerocallis）的所有部分——花瓣、叶子、花粉、雄蕊，甚至花瓶里的水——都可能在 24–72 小时内导致猫咪急性肾衰竭。即使极少量也可能致命。如果猫咪舔了毛上的花粉，或喝了插有百合的花瓶水，请立即去急诊。不要等出现症状。",
    hotline: "ASPCA 动物中毒控制中心（美国）：(888) 426-4435",
    hotlineNote: "在美国以外，请联系最近的 24 小时宠物急诊医院。可能需要付费。",
    levels: {
      deadly: "对猫致命 — 立即急诊",
      danger: "危险 — 影响心脏，立即联系兽医",
      mild: "轻微 — 有刺激，不伤肾",
      safe: "无毒",
    },
    filterAll: "全部",
    searchLabel: "按常用名或学名搜索",
    searchPlaceholder: "例如：复活节、卷丹、白鹤芋、马蹄莲",
    resultCount: (n) => `${n} 种植物`,
    noMatch: "没有找到。不在清单上不代表安全——如有疑问，请按真百合处理并立即联系兽医。",
    tipsTitle: "猫咪安全之家",
    tipsLede: "预防最重要。",
    tips: [
      "避免购买含有任何 Lilium 或 Hemerocallis 品种的花束。",
      "请花店送花前，先告诉他们你养了猫。",
      "6 小时内开始治疗，效果最好。",
    ],
    safeTitle: "可以改摆这些花",
    safeText: "玫瑰、向日葵、蝴蝶兰、非洲菊和非洲紫罗兰，一般被列为对猫无毒。",
    articles: [
      {
        title: "真百合与相似的花",
        paras: [
          "“百合”在日常用语中含义很宽泛。对猫主人来说，它应该指特定的植物：百合属（Lilium，真百合）或萱草属（Hemerocallis）的任何植物。这些植物的所有部分——花瓣、叶子、茎、花粉，甚至花瓶里的水——都含有一种尚未确定的物质，会损害猫咪的肾脏。仅仅两片花瓣，或舔掉毛上的花粉，如不治疗都可能致命。",
          "许多叫“百合”的花其实并没有这种毒性。白鹤芋（和平百合，Spathiphyllum）、马蹄莲（Zantedeschia）和六出花（秘鲁百合，Alstroemeria）属于不同的植物科。它们含有草酸钙或轻微刺激物，会引起流口水和肠胃不适，但不会伤肾。铃兰（Convallaria）则是另一种危险：它含有强心苷，会影响心脏。",
        ],
      },
      {
        title: "为什么猫咪特别容易中毒？",
        paras: [
          "确切机制仍在研究中，但在常见宠物中，只有猫咪会因 Lilium 和 Hemerocallis 而肾脏受损。狗、兔子和啮齿动物不会出现同样的损伤。摄入后 12–24 小时内，猫咪肾小管的细胞开始坏死。越早治疗越好：最好在 6 小时内，最迟也要在 18 小时内。超过 18 小时才治疗，肾衰竭往往无法逆转。",
        ],
      },
      {
        title: "治疗过程",
        paras: [
          "如果刚接触不久，兽医会催吐、给予活性炭，并开始至少 48–72 小时的静脉输液，以保护肾脏并维持尿量。血液检查会追踪肾功能指标（BUN、肌酐、SDMA）。严重时可能需要透析。存活的猫咪也可能留下长期肾损伤，需要终身护理。",
        ],
      },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "猫咪碰到百合但没有吃，也危险吗？", a: "有可能。猫咪经常舔毛，毛上的花粉会被舔进肚子。少量花粉就足以伤肾。请帮猫咪洗掉花粉，即使没看到它吃东西，也要联系兽医。" },
      { q: "应该留意哪些百合中毒症状？", a: "早期（0–12 小时）：流口水、呕吐、食欲下降、精神萎靡。后期（12–72 小时）：尿量先多后少、脱水、抽搐，肾衰竭加重时会虚脱。不要等这些症状出现——到了后期，肾脏可能已严重受损。" },
      { q: "百合对狗危险吗？", a: "大多数真百合只会让狗轻微肠胃不适——呕吐和腹泻——不会像猫那样伤肾。不过铃兰含强心苷，对狗也很危险。所有宠物都应远离这些植物。" },
      { q: "把百合放在猫咪够不到的地方，可以摆在家里吗？", a: "有风险。猫咪跳得比主人想象的更高，也会刻意跳上去，花粉还会飘到台面或掉到地上。兽医和 ASPCA 强烈建议养猫家庭完全不要摆放 Lilium 和 Hemerocallis。可以改摆玫瑰、向日葵、蝴蝶兰、非洲菊或非洲紫罗兰等对猫安全的花。" },
    ],
    relatedTitle: "更多宠物安全工具",
    disclaimer: "本工具仅供参考。怀疑宠物中毒时，请务必咨询执业兽医。",
  },
  ja: {
    section: "ペット",
    crumbHome: "ホーム",
    crumbPets: "ペット",
    crumbHere: "ユリ",
    title: "猫のユリ中毒チェッカー",
    lede: "「ユリ」と呼ばれる花を検索して、猫にとって危険かどうかを確認できます。ユリ属（Lilium）とワスレグサ属（Hemerocallis）は腎不全を起こしますが、似た名前の花の多くはそうではありません。",
    seoTitle: "猫のユリ中毒チェッカー — 危険なユリと安全な花 | TinyToolboxes",
    seoDesc: "そのユリは猫に危険？テッポウユリ、オニユリ、スターゲイザー、デイリリーは腎不全の原因に。スパティフィラムやカラーは軽度。無料・5言語対応。",
    alertTitle: "猫が本物のユリに触れたら、すぐに動物病院へ",
    alertBody: "本物のユリ（ユリ属・ワスレグサ属）は、花びら、葉、花粉、おしべ、花瓶の水まで、すべての部分が24〜72時間以内に猫の急性腎不全を引き起こすおそれがあります。ごく少量でも命に関わります。猫が毛に付いた花粉をなめた、またはユリを生けた花瓶の水を飲んだ場合は、症状を待たずにすぐ救急の動物病院へ連れて行ってください。",
    hotline: "ASPCA 動物中毒管理センター（米国）：(888) 426-4435",
    hotlineNote: "米国外では、最寄りの24時間対応の動物病院に連絡してください。相談料がかかる場合があります。",
    levels: {
      deadly: "猫に致命的 — すぐ救急へ",
      danger: "危険 — 心臓に作用、獣医師に連絡",
      mild: "軽度 — 刺激はあるが腎障害なし",
      safe: "無毒",
    },
    filterAll: "すべて",
    searchLabel: "一般名または学名で検索",
    searchPlaceholder: "例：テッポウユリ、スターゲイザー、カラー",
    resultCount: (n) => `${n}件`,
    noMatch: "見つかりませんでした。リストにないからといって安全とは限りません。迷ったら本物のユリとして扱い、獣医師に相談してください。",
    tipsTitle: "猫に安全な暮らし",
    tipsLede: "何より予防が大切です。",
    tips: [
      "ユリ属やワスレグサ属を含む花束は避けましょう。",
      "花の配達を頼む前に、猫を飼っていることを花屋に伝えましょう。",
      "6時間以内に治療を始めると、最も良い結果につながります。",
    ],
    safeTitle: "代わりに飾れる花",
    safeText: "バラ、ヒマワリ、コチョウラン、ガーベラ、セントポーリアは、一般に猫に無毒とされています。",
    articles: [
      {
        title: "本物のユリと、ユリに似た花",
        paras: [
          "日常会話の「ユリ」は意味の広い言葉です。猫の飼い主にとって重要なのは、ユリ属（Lilium）とワスレグサ属（Hemerocallis、デイリリー）の植物です。花びら、葉、茎、花粉、さらに花瓶の水まで、すべての部分に猫の腎臓を傷つける未特定の物質が含まれています。花びら2枚ほど、あるいは毛に付いた花粉をなめるだけでも、治療しなければ命に関わることがあります。",
          "「リリー」と呼ばれていても、このような毒性を持たない花も多くあります。スパティフィラム（ピースリリー）、カラー（Zantedeschia）、アルストロメリアは別の科の植物です。シュウ酸カルシウムや軽い刺激物質を含み、よだれや胃腸の不調を起こしますが、腎臓は傷つけません。スズラン（Convallaria）は別の意味で危険で、心臓に作用する強心配糖体を含んでいます。",
        ],
      },
      {
        title: "なぜ猫だけが危ないのか",
        paras: [
          "詳しい仕組みはまだ研究中ですが、一般的なペットの中で、ユリ属とワスレグサ属で腎臓が障害されるのは猫だけです。犬、ウサギ、げっ歯類では同じ障害は見られません。摂取後12〜24時間で、腎臓の尿細管の細胞が壊れ始めます。治療は早いほど良く、理想は6時間以内、遅くとも18時間以内です。18時間を過ぎると、腎不全が元に戻らないことが多くなります。",
        ],
      },
      {
        title: "治療の流れ",
        paras: [
          "摂取から時間が経っていなければ、獣医師は吐かせる処置を行い、活性炭を与え、少なくとも48〜72時間の点滴で腎臓を守り尿量を保ちます。血液検査で腎臓の数値（BUN、クレアチニン、SDMA）を確認し、重症の場合は透析を行うこともあります。回復しても腎臓に障害が残り、生涯のケアが必要になる場合があります。",
        ],
      },
    ],
    faqTitle: "よくある質問",
    faq: [
      { q: "猫がユリに触れただけで、食べてはいません。危険ですか？", a: "危険な場合があります。猫は頻繁に毛づくろいをするため、毛に付いた花粉をなめて飲み込んでしまいます。ごく少量の花粉でも腎臓を傷つけるのに十分です。花粉を洗い流し、食べたところを見ていなくても獣医師に相談してください。" },
      { q: "ユリ中毒では、どんな症状に注意すればよいですか？", a: "初期（0〜12時間）：よだれ、嘔吐、食欲不振、元気がない。後期（12〜72時間）：尿が増えた後に減る、脱水、けいれん、腎不全の進行による虚脱。症状が出るのを待たないでください。後期の症状が出たときには、腎臓がすでに大きく傷ついていることがあります。" },
      { q: "ユリは犬にも危険ですか？", a: "ほとんどの本物のユリは、犬では嘔吐や下痢などの軽い胃腸症状にとどまり、猫のような腎障害は起きません。ただしスズランは心臓に作用する毒を含むため、犬にも危険です。どのペットも近づけないようにしてください。" },
      { q: "猫の届かない場所なら、ユリを家に飾ってもいいですか？", a: "おすすめしません。猫は飼い主の想像以上に高く、狙って跳びますし、花粉は台の上や床に落ちます。獣医師やASPCAは、猫のいる家ではユリ属とワスレグサ属を一切置かないよう強く勧めています。代わりにバラ、ヒマワリ、コチョウラン、ガーベラ、セントポーリアなど、猫に安全とされる花を選びましょう。" },
    ],
    relatedTitle: "ペットの安全に役立つツール",
    disclaimer: "このツールは情報提供のみを目的としています。ペットの中毒が疑われる場合は、必ず獣医師に相談してください。",
  },
  es: {
    section: "Mascotas",
    crumbHome: "Inicio",
    crumbPets: "Mascotas",
    crumbHere: "Lirios",
    title: "Comprobador de toxicidad de lirios para gatos",
    lede: "Busca cualquier flor llamada “lirio” o “azucena” para saber si es peligrosa para tu gato. Los lirios verdaderos (Lilium) y los hemerocallis causan insuficiencia renal; muchas flores parecidas, no.",
    seoTitle: "Lirios tóxicos para gatos — comprobador gratuito | TinyToolboxes",
    seoDesc: "Comprueba si un lirio es tóxico para gatos. La azucena, el lirio tigre, el asiático, el Stargazer y el hemerocallis causan insuficiencia renal; el espatifilo y la cala son leves. Gratis, en 5 idiomas.",
    alertTitle: "Si tu gato tocó un lirio verdadero, ve al veterinario ya",
    alertBody: "Todas las partes de los lirios verdaderos (Lilium y Hemerocallis) — pétalos, hojas, polen, estambres e incluso el agua del jarrón — pueden causar insuficiencia renal aguda en gatos en 24–72 horas. Incluso una cantidad mínima puede ser mortal. Si tu gato se lamió polen del pelaje o bebió del jarrón con lirios, ve de inmediato a un veterinario de urgencias. No esperes a que aparezcan síntomas.",
    hotline: "ASPCA Animal Poison Control (EE. UU.): (888) 426-4435",
    hotlineNote: "Fuera de EE. UU., llama a la clínica veterinaria de urgencias 24 horas más cercana. La consulta puede tener coste.",
    levels: {
      deadly: "Mortal para gatos — urgencias ya",
      danger: "Peligroso — afecta al corazón, llama al veterinario",
      mild: "Leve — irrita, sin daño renal",
      safe: "No tóxico",
    },
    filterAll: "Todos",
    searchLabel: "Busca por nombre común o científico",
    searchPlaceholder: "Prueba: Pascua, Stargazer, paz, cala",
    resultCount: (n) => `${n} ${n === 1 ? "planta" : "plantas"}`,
    noMatch: "Sin resultados. Que una planta no esté en la lista no significa que sea segura: si dudas, trátala como un lirio verdadero y llama al veterinario.",
    tipsTitle: "Un hogar seguro para gatos",
    tipsLede: "La prevención es lo más importante.",
    tips: [
      "Evita los ramos que contengan cualquier variedad de Lilium o Hemerocallis.",
      "Avisa a la floristería de que tienes gato antes de que preparen un envío.",
      "Empezar el tratamiento en menos de 6 horas da el mejor resultado.",
    ],
    safeTitle: "Flores seguras para gatos",
    safeText: "Las rosas, los girasoles, las orquídeas mariposa (Phalaenopsis), las gerberas y las violetas africanas suelen figurar como no tóxicas para gatos.",
    articles: [
      {
        title: "Lirios verdaderos y flores parecidas",
        paras: [
          "“Lirio” es una palabra imprecisa en el lenguaje cotidiano. Para quien tiene gato, debería significar algo concreto: cualquier planta del género Lilium (lirios verdaderos y azucenas) o Hemerocallis. Todas sus partes — pétalos, hojas, tallos, polen e incluso el agua del jarrón — contienen un compuesto aún no identificado que daña los riñones del gato. Bastan dos pétalos, o el polen lamido del pelaje, para causar la muerte sin tratamiento.",
          "Muchas flores llamadas “lirio” no son tóxicas de esta forma. El espatifilo o lirio de la paz (Spathiphyllum), la cala (Zantedeschia) y la alstroemeria o lirio peruano pertenecen a otras familias. Contienen oxalatos de calcio o irritantes leves que causan babeo y malestar estomacal, pero no dañan los riñones. El lirio de los valles o muguete (Convallaria) es un peligro distinto: contiene glucósidos cardíacos que afectan al corazón.",
        ],
      },
      {
        title: "¿Por qué los gatos son tan vulnerables?",
        paras: [
          "El mecanismo exacto aún se investiga, pero entre las mascotas comunes solo los gatos sufren daño renal por Lilium y Hemerocallis. Perros, conejos y roedores no muestran la misma lesión. Entre 12 y 24 horas después de la ingestión, las células de los túbulos renales del gato empiezan a morir. Cuanto antes empiece el tratamiento, mejor: idealmente en menos de 6 horas y, como máximo, en 18. Si se retrasa más de 18 horas, la insuficiencia renal suele ser irreversible.",
        ],
      },
      {
        title: "En qué consiste el tratamiento",
        paras: [
          "Si la exposición es reciente, el veterinario provocará el vómito, administrará carbón activado y empezará fluidoterapia intravenosa durante al menos 48–72 horas para proteger los riñones y mantener la producción de orina. Los análisis de sangre controlan los valores renales (BUN, creatinina, SDMA). En casos graves puede usarse diálisis. Los gatos que sobreviven pueden quedar con daño renal que requiere cuidados de por vida.",
        ],
      },
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "Mi gato rozó un lirio pero no se lo comió, ¿es peligroso?", a: "Puede serlo. Los gatos se acicalan constantemente y el polen del pelaje acaba lamido y tragado. Incluso un poco de polen basta para dañar los riñones. Lava el polen y llama al veterinario, aunque no hayas visto a tu gato comer nada." },
      { q: "¿Qué síntomas de intoxicación por lirio debo vigilar?", a: "Síntomas tempranos (0–12 horas): babeo, vómitos, falta de apetito, decaimiento. Síntomas tardíos (12–72 horas): orina más y luego menos, deshidratación, convulsiones y colapso a medida que avanza la insuficiencia renal. No esperes a estos síntomas: cuando aparecen los tardíos, los riñones pueden estar ya gravemente dañados." },
      { q: "¿Los lirios son peligrosos para los perros?", a: "La mayoría de los lirios verdaderos solo causan un malestar estomacal leve en perros — vómitos y diarrea — sin el daño renal que sufren los gatos. Sin embargo, el lirio de los valles es peligroso para los perros por sus toxinas cardíacas. Mantén estas plantas lejos de cualquier mascota." },
      { q: "¿Puedo tener lirios en casa si los pongo fuera del alcance del gato?", a: "Es arriesgado. Los gatos saltan más alto y con más intención de lo que esperamos, y el polen cae sobre encimeras y suelos. Los veterinarios y la ASPCA recomiendan que los hogares con gatos eviten por completo Lilium y Hemerocallis. Elige flores seguras como rosas, girasoles, orquídeas mariposa, gerberas o violetas africanas." },
    ],
    relatedTitle: "Más herramientas de seguridad para mascotas",
    disclaimer: "Esta herramienta es solo informativa. Consulta siempre a un veterinario colegiado ante cualquier sospecha de intoxicación.",
  },
};

type Lily = { id: string; level: Level; scientific: string; names: L10n; note: L10n; keywords: string[] };

const LILIES: Lily[] = [
  { id: "easter", level: "deadly", scientific: "Lilium longiflorum",
    names: { en: "Easter lily", "zh-hk": "復活節百合（麝香百合）", "zh-cn": "复活节百合（麝香百合）", ja: "イースターリリー（テッポウユリ）", es: "Azucena de Pascua" },
    note: { en: "All parts of the plant, including pollen and vase water, cause acute kidney failure in cats.", "zh-hk": "所有部分，包括花粉同花樽水，都會令貓貓急性腎衰竭。", "zh-cn": "所有部分，包括花粉和花瓶水，都会导致猫咪急性肾衰竭。", ja: "花粉や花瓶の水を含め、すべての部分が猫の急性腎不全を引き起こします。", es: "Todas las partes, incluidos el polen y el agua del jarrón, causan insuficiencia renal aguda en gatos." },
    keywords: ["easter", "longiflorum", "pascua"] },
  { id: "tiger", level: "deadly", scientific: "Lilium lancifolium / tigrinum",
    names: { en: "Tiger lily", "zh-hk": "虎百合（卷丹）", "zh-cn": "卷丹（虎皮百合）", ja: "オニユリ", es: "Lirio tigre" },
    note: { en: "Highly toxic. Even a tiny amount can cause kidney failure within 24–72 hours.", "zh-hk": "劇毒。極少量都可以喺 24–72 小時內引致腎衰竭。", "zh-cn": "剧毒。极少量也可能在 24–72 小时内导致肾衰竭。", ja: "猛毒です。ごく少量でも24〜72時間以内に腎不全を起こすことがあります。", es: "Muy tóxico. Una cantidad mínima puede causar insuficiencia renal en 24–72 horas." },
    keywords: ["tiger", "lancifolium", "tigrinum", "tigre"] },
  { id: "asiatic", level: "deadly", scientific: "Lilium hybrids (Asiatic group)",
    names: { en: "Asiatic lily", "zh-hk": "亞洲百合", "zh-cn": "亚洲百合", ja: "アジアティックリリー（スカシユリ系）", es: "Lirio asiático" },
    note: { en: "A common cut-flower lily. All parts are highly toxic to cats.", "zh-hk": "常見切花百合。所有部分對貓都劇毒。", "zh-cn": "常见切花百合。所有部分对猫都剧毒。", ja: "切り花でよく見かけるユリ。すべての部分が猫に強い毒性を持ちます。", es: "Lirio de flor cortada muy común. Todas sus partes son muy tóxicas para gatos." },
    keywords: ["asiatic", "asiático", "asiatico"] },
  { id: "oriental", level: "deadly", scientific: "Lilium hybrids (Oriental group)",
    names: { en: "Oriental lily / Stargazer", "zh-hk": "東方百合／星佳沙", "zh-cn": "东方百合（Stargazer）", ja: "オリエンタルリリー／スターゲイザー", es: "Lirio oriental / Stargazer" },
    note: { en: "Stargazer is a popular florist variety. Acutely toxic to the kidneys.", "zh-hk": "星佳沙係花店熱門品種，對腎臟有急性毒性。", "zh-cn": "Stargazer 是花店热门品种，对肾脏有急性毒性。", ja: "スターゲイザーは花屋で人気の品種。腎臓に急性の毒性があります。", es: "Stargazer es una variedad muy popular en floristerías. Muy tóxica para los riñones." },
    keywords: ["oriental", "stargazer"] },
  { id: "daylily", level: "deadly", scientific: "Hemerocallis spp.",
    names: { en: "Daylily", "zh-hk": "萱草（金針花）", "zh-cn": "萱草（黄花菜）", ja: "デイリリー（ワスレグサ・カンゾウ）", es: "Hemerocallis (lirio de día)" },
    note: { en: "Not a true Lilium, but just as toxic to cats — also causes acute kidney failure.", "zh-hk": "唔係真正嘅 Lilium，但對貓一樣有毒，同樣會引致急性腎衰竭。", "zh-cn": "不是真正的 Lilium，但对猫同样有毒，也会导致急性肾衰竭。", ja: "ユリ属ではありませんが、猫には同じく有毒で、急性腎不全を起こします。", es: "No es un Lilium, pero es igual de tóxico para gatos: también causa insuficiencia renal aguda." },
    keywords: ["daylily", "day lily", "hemerocallis"] },
  { id: "rubrum", level: "deadly", scientific: "Lilium speciosum",
    names: { en: "Rubrum lily / Japanese show lily", "zh-hk": "鹿子百合", "zh-cn": "鹿子百合", ja: "カノコユリ", es: "Lirio rubrum" },
    note: { en: "Same toxicity as other Lilium species.", "zh-hk": "毒性同其他 Lilium 品種一樣。", "zh-cn": "毒性与其他 Lilium 品种相同。", ja: "ほかのユリ属と同じ毒性があります。", es: "Misma toxicidad que las demás especies de Lilium." },
    keywords: ["rubrum", "speciosum", "japanese"] },
  { id: "wood", level: "deadly", scientific: "Lilium philadelphicum",
    names: { en: "Wood lily", "zh-hk": "森林百合", "zh-cn": "林地百合", ja: "ウッドリリー", es: "Lirio de bosque" },
    note: { en: "A wild North American Lilium. Toxic to cats.", "zh-hk": "北美野生 Lilium，對貓有毒。", "zh-cn": "北美野生 Lilium，对猫有毒。", ja: "北米に自生するユリ属。猫に有毒です。", es: "Lilium silvestre de Norteamérica. Tóxico para gatos." },
    keywords: ["wood", "philadelphicum", "bosque"] },
  { id: "redstar", level: "deadly", scientific: "Lilium hybrid",
    names: { en: "Red star lily", "zh-hk": "紅星百合", "zh-cn": "红星百合", ja: "レッドスターリリー", es: "Lirio estrella roja" },
    note: { en: "An Oriental hybrid. Same kidney toxicity.", "zh-hk": "東方雜交品種，同樣傷腎。", "zh-cn": "东方杂交品种，同样伤肾。", ja: "オリエンタル系の交配種。同じく腎毒性があります。", es: "Híbrido oriental. La misma toxicidad renal." },
    keywords: ["red star", "star", "estrella"] },
  { id: "lily_valley", level: "danger", scientific: "Convallaria majalis",
    names: { en: "Lily of the valley", "zh-hk": "鈴蘭", "zh-cn": "铃兰", ja: "スズラン", es: "Lirio de los valles (muguete)" },
    note: { en: "Not a true lily, but contains cardiac glycosides that affect the heart. Can cause vomiting, abnormal heart rhythm and seizures — call a vet straight away. Dangerous to dogs too.", "zh-hk": "唔係真百合，但含強心苷，會影響心臟。可能引致嘔吐、心律不正同抽搐——要即刻搵獸醫。對狗都危險。", "zh-cn": "不是真百合，但含强心苷，会影响心脏。可能引起呕吐、心律失常和抽搐——请立即联系兽医。对狗同样危险。", ja: "本物のユリではありませんが、心臓に作用する強心配糖体を含みます。嘔吐、不整脈、けいれんを起こすことがあるため、すぐに獣医師に連絡してください。犬にも危険です。", es: "No es un lirio verdadero, pero contiene glucósidos cardíacos que afectan al corazón. Puede causar vómitos, arritmias y convulsiones: llama al veterinario de inmediato. También es peligroso para perros." },
    keywords: ["valley", "convallaria", "muguete", "valles"] },
  { id: "calla", level: "mild", scientific: "Zantedeschia aethiopica",
    names: { en: "Calla lily", "zh-hk": "馬蹄蓮", "zh-cn": "马蹄莲", ja: "カラー（オランダカイウ）", es: "Cala" },
    note: { en: "Not a true lily. Insoluble calcium oxalates cause mouth irritation, drooling and vomiting. Does not harm the kidneys.", "zh-hk": "唔係真百合。不溶性草酸鈣會引致口腔刺激、流口水同嘔吐。唔會傷腎。", "zh-cn": "不是真百合。不溶性草酸钙会引起口腔刺激、流口水和呕吐。不会伤肾。", ja: "本物のユリではありません。不溶性シュウ酸カルシウムが口の刺激、よだれ、嘔吐を起こします。腎臓には影響しません。", es: "No es un lirio verdadero. Sus oxalatos de calcio insolubles causan irritación en la boca, babeo y vómitos. No daña los riñones." },
    keywords: ["calla", "zantedeschia", "cala"] },
  { id: "peace", level: "mild", scientific: "Spathiphyllum spp.",
    names: { en: "Peace lily", "zh-hk": "白鶴芋（和平百合）", "zh-cn": "白鹤芋（和平百合）", ja: "スパティフィラム（ピースリリー）", es: "Espatifilo (lirio de la paz)" },
    note: { en: "Not a true lily. Calcium oxalate crystals irritate the mouth and throat. Uncomfortable but not fatal.", "zh-hk": "唔係真百合。草酸鈣晶體會刺激口腔同喉嚨。會唔舒服，但唔致命。", "zh-cn": "不是真百合。草酸钙晶体会刺激口腔和喉咙。会不舒服，但不致命。", ja: "本物のユリではありません。シュウ酸カルシウムの結晶が口やのどを刺激します。つらい症状は出ますが、命に関わることはありません。", es: "No es un lirio verdadero. Los cristales de oxalato de calcio irritan la boca y la garganta. Molesto, pero no mortal." },
    keywords: ["peace", "spathiphyllum", "paz", "espatifilo"] },
  { id: "peruvian", level: "mild", scientific: "Alstroemeria spp.",
    names: { en: "Peruvian lily / Alstroemeria", "zh-hk": "秘魯百合（六出花）", "zh-cn": "六出花（秘鲁百合）", ja: "アルストロメリア", es: "Alstroemeria (lirio peruano)" },
    note: { en: "Not a true lily. May cause mild stomach upset. Safer than true lilies, but not completely harmless.", "zh-hk": "唔係真百合。可能引致輕微腸胃不適。比真百合安全，但唔係完全無害。", "zh-cn": "不是真百合。可能引起轻微肠胃不适。比真百合安全，但并非完全无害。", ja: "本物のユリではありません。軽い胃腸症状を起こすことがあります。本物のユリより安全ですが、完全に無害ではありません。", es: "No es un lirio verdadero. Puede causar un malestar estomacal leve. Más seguro que los lirios verdaderos, pero no del todo inofensivo." },
    keywords: ["peruvian", "alstroemeria", "peruano"] },
  { id: "hosta", level: "mild", scientific: "Hosta spp.",
    names: { en: "Plantain lily / Hosta", "zh-hk": "玉簪", "zh-cn": "玉簪", ja: "ギボウシ（ホスタ）", es: "Hosta" },
    note: { en: "Not a true lily. Contains saponins that can cause vomiting and diarrhea in cats and dogs. Does not harm the kidneys.", "zh-hk": "唔係真百合。含皂苷，可能令貓狗嘔吐同肚瀉。唔會傷腎。", "zh-cn": "不是真百合。含皂苷，可能导致猫狗呕吐和腹泻。不会伤肾。", ja: "本物のユリではありません。サポニンを含み、猫や犬に嘔吐や下痢を起こすことがあります。腎臓には影響しません。", es: "No es un lirio verdadero. Contiene saponinas que pueden causar vómitos y diarrea en gatos y perros. No daña los riñones." },
    keywords: ["plantain", "hosta"] },
  { id: "canna", level: "safe", scientific: "Canna spp.",
    names: { en: "Canna lily", "zh-hk": "美人蕉", "zh-cn": "美人蕉", ja: "カンナ", es: "Canna (achira)" },
    note: { en: "Not a true lily. Generally considered non-toxic to cats.", "zh-hk": "唔係真百合。一般認為對貓無毒。", "zh-cn": "不是真百合。一般认为对猫无毒。", ja: "本物のユリではありません。一般に猫に無毒とされています。", es: "No es un lirio verdadero. Se considera no tóxica para gatos." },
    keywords: ["canna", "achira"] },
];

type ToolKey = "chocolate" | "xylitol" | "catEat" | "calorie" | "catAge" | "dogAge";
const TOOLS: { key: ToolKey; href: string; text: Record<Locale, [string, string]> }[] = [
  { key: "chocolate", href: "/chocolate-toxicity-calculator", text: {
    en: ["Chocolate toxicity", "Theobromine dose for dogs"],
    "zh-hk": ["朱古力毒性計算機", "計狗狗食咗幾多可可鹼"],
    "zh-cn": ["巧克力毒性计算器", "计算狗狗摄入的可可碱剂量"],
    ja: ["チョコレート中毒計算", "犬のテオブロミン摂取量"],
    es: ["Toxicidad del chocolate", "Dosis de teobromina en perros"] } },
  { key: "xylitol", href: "/xylitol-toxicity-calculator", text: {
    en: ["Xylitol toxicity", "Sugar-free gum and dogs"],
    "zh-hk": ["木糖醇毒性計算機", "無糖香口膠對狗嘅風險"],
    "zh-cn": ["木糖醇毒性计算器", "无糖口香糖对狗的风险"],
    ja: ["キシリトール中毒計算", "シュガーレスガムと犬"],
    es: ["Toxicidad del xilitol", "Chicle sin azúcar y perros"] } },
  { key: "catEat", href: "/can-my-cat-eat", text: {
    en: ["Can my cat eat this?", "Food safety lookup for cats"],
    "zh-hk": ["貓貓可以食呢樣嗎？", "查吓食物對貓安唔安全"],
    "zh-cn": ["猫咪可以吃这个吗？", "查询食物对猫是否安全"],
    ja: ["猫がこれを食べても大丈夫？", "猫の食べ物安全チェック"],
    es: ["¿Mi gato puede comer esto?", "Alimentos seguros para gatos"] } },
  { key: "calorie", href: "/pet-calorie-calculator", text: {
    en: ["Pet calorie calculator", "Daily calories (RER) for cats and dogs"],
    "zh-hk": ["寵物卡路里計算機", "貓狗每日所需卡路里（RER）"],
    "zh-cn": ["宠物卡路里计算器", "猫狗每日所需卡路里（RER）"],
    ja: ["ペットのカロリー計算", "犬猫の1日に必要なカロリー（RER）"],
    es: ["Calorías para mascotas", "Calorías diarias (RER) de perros y gatos"] } },
  { key: "catAge", href: "/cat-age-calculator", text: {
    en: ["Cat age in human years", "Convert your cat's age"],
    "zh-hk": ["貓貓年齡換算", "貓貓幾歲等於人類幾歲"],
    "zh-cn": ["猫咪年龄换算", "把猫咪年龄换算成人类年龄"],
    ja: ["猫の年齢換算", "猫の年齢を人間に換算"],
    es: ["Edad del gato en años humanos", "Convierte la edad de tu gato"] } },
  { key: "dogAge", href: "/dog-age-calculator", text: {
    en: ["Dog age in human years", "Based on the UCSD formula"],
    "zh-hk": ["狗狗年齡換算", "用 UCSD 公式計"],
    "zh-cn": ["狗狗年龄换算", "基于 UCSD 公式"],
    ja: ["犬の年齢換算", "UCSDの計算式を使用"],
    es: ["Edad del perro en años humanos", "Basado en la fórmula de UCSD"] } },
];

// Search matches every language's name, so a Japanese reader can still type "Easter".
function matches(lily: Lily, q: string): boolean {
  if (!q) return true;
  const haystack = [...ALL_LOCALES.map((l) => lily.names[l]), lily.scientific, ...lily.keywords].join(" ").toLowerCase();
  return haystack.includes(q);
}

export default function LilyToxicityChecker() {
  const [locale, setLocale] = useLocale();
  const t = COPY[locale];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Level | "all">("all");

  useEffect(() => {
    applySEO({
      title: t.seoTitle,
      description: t.seoDesc,
      path: PAGE_PATH,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebApplication", name: t.title, url: SITE_URL + PAGE_PATH, description: t.seoDesc, applicationCategory: "HealthApplication", operatingSystem: "Web", inLanguage: locale, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ],
    });
  }, [locale, t]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LILIES.filter((l) => (filter === "all" || l.level === filter) && matches(l, q));
  }, [query, filter]);

  return (
    <ToolPage theme="pets" locale={locale} onLocale={setLocale} section={t.section}>
      <nav className="tt-crumb" aria-label="Breadcrumb">
        <a href="/">{t.crumbHome}</a><span aria-hidden="true">/</span>
        <span>{t.crumbPets}</span><span aria-hidden="true">/</span>
        <span>{t.crumbHere}</span>
      </nav>
      <h1 className="tt-h1">{t.title}</h1>
      <p className="tt-lede">{t.lede}</p>

      <div className="tt-callout" role="alert" style={{ marginBottom: 20 }}>
        <strong>{t.alertTitle}</strong>
        <p>{t.alertBody}</p>
        <p><b>{t.hotline}</b><br />{t.hotlineNote}</p>
      </div>

      <div className="tt-grid">
        <div className="tt-stack">
          <section className="tt-card" aria-labelledby="lily-search-label">
            <div className="tt-field">
              <label id="lily-search-label" htmlFor="lily-search">{t.searchLabel}</label>
              <div className="tt-input">
                <input id="lily-search" type="search" value={query} placeholder={t.searchPlaceholder} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="tt-chips" role="group" aria-label={t.searchLabel} style={{ marginTop: 12 }}>
              <button type="button" className="tt-chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{t.filterAll}</button>
              {LEVELS.map((level) => (
                <button key={level} type="button" className="tt-chip" aria-pressed={filter === level} onClick={() => setFilter(level)}>
                  {t.levels[level].split(" — ")[0]}
                </button>
              ))}
            </div>

            <p className="tt-note" aria-live="polite">{t.resultCount(results.length)}</p>
            <div className="tt-items">
              {results.map((lily) => (
                <div className="tt-item" key={lily.id}>
                  <div className="tt-item-head">
                    <div>
                      <b>{lily.names[locale]}</b>
                      <i lang="la">{lily.scientific}</i>
                    </div>
                    <span className="tt-status" data-level={lily.level}>{t.levels[lily.level]}</span>
                  </div>
                  <p>{lily.note[locale]}</p>
                </div>
              ))}
              {results.length === 0 && <p style={{ margin: 0, color: "var(--muted)" }}>{t.noMatch}</p>}
            </div>
          </section>

          <article className="tt-card tt-prose">
            {t.articles.map((a) => (
              <section key={a.title}>
                <h2 className="tt-h2">{a.title}</h2>
                {a.paras.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </section>
            ))}
            <section>
              <h2 className="tt-h2">{t.faqTitle}</h2>
              <Faq items={t.faq} />
            </section>
          </article>

          <section className="tt-card">
            <h2 className="tt-h2">{t.relatedTitle}</h2>
            <div className="tt-tiles">
              {TOOLS.map((tool) => (
                <a className="tt-tile" key={tool.key} href={tool.href}>
                  <b>{tool.text[locale][0]}</b>
                  <span>{tool.text[locale][1]}</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <aside className="tt-stack">
          <section className="tt-card">
            <h2 className="tt-h3">{t.tipsTitle}</h2>
            <p className="tt-note" style={{ marginTop: 0 }}>{t.tipsLede}</p>
            <ul style={{ margin: "12px 0 0", paddingLeft: "1.1em", color: "var(--ink-2)" }}>
              {t.tips.map((tip) => <li key={tip} style={{ marginBottom: 8 }}>{tip}</li>)}
            </ul>
          </section>
          <section className="tt-card">
            <h2 className="tt-h3">{t.safeTitle}</h2>
            <p style={{ margin: 0, color: "var(--ink-2)" }}>{t.safeText}</p>
          </section>
        </aside>
      </div>

      <p className="tt-disclaimer">{t.disclaimer}</p>
    </ToolPage>
  );
}
