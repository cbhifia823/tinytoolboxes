import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, BookOpen, Globe2, LoaderCircle, Search, Sparkles, Wand2 } from "lucide-react";

const LOCALES = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
] as const;

const COPY = {
  en: {
    collection: "TinyToolboxes collection",
    pageTitle: "Rhyme Zone",
    hero: "Rhymes, near rhymes, synonyms, antonyms, related words.",
    searchLabel: "Search the collection",
    searchPlaceholder: "Try: weight, date, word, url",
    searchHint: "Search hints",
    reserveAd: "Google Ads space reserved",
    adLabel: "Sponsored ad",
    adBadge: "Ad",
    lookingUp: "Looking up words...",
    emptyHint: "Search a word to see ranked results.",
    scoreLabel: "Score",
    syllablesLabel: "syllables",
    typeWord: "Type a word first.",
    articleTitle1: "What are Rhymes and Why Do They Matter?",
    article1p1: "A rhyme occurs when two or more words share a similar sound pattern, typically from the last stressed vowel through the end of the word. Cat and bat rhyme because they share the -at sound. Love and dove share the short uv sound. Rhyme is one of the most ancient and universal features of human language.",
    article1p2: "Rhymes serve both aesthetic and functional purposes. In poetry and song, they create a musical quality, establish rhythm, and make lines more memorable. In advertising, rhyming slogans are more easily recalled. In education, rhymes help children learn vocabulary and phonics.",
    articleTitle2: "Types of Rhyme",
    article2intro: "Not all rhymes are equal. English poetry and songwriting recognise several categories:",
    rhymeTypes: [
      { name: "Perfect rhyme", desc: "Identical vowel and final consonant sounds: cat/bat, moon/June, time/rhyme. The gold standard." },
      { name: "Near rhyme (slant rhyme)", desc: "Similar but not identical sounds: love/move, home/come. Used in modern pop and hip-hop." },
      { name: "Eye rhyme", desc: "Words that look like they rhyme based on spelling but don't: love/move, pint/mint." },
      { name: "Identical rhyme", desc: "The same word used at the end of two lines. Effective in rap for emphasis." },
      { name: "Feminine rhyme", desc: "Rhymes on an unstressed final syllable: running/cunning. Creates a lighter cadence." },
      { name: "Rich rhyme (homophone)", desc: "Words that sound identical but differ in spelling and meaning: right/write/rite." },
    ],
    articleTitle3: "Rhyme Schemes in Poetry",
    article3p1: "A rhyme scheme is the pattern of rhymes at the end of each line in a poem, denoted by assigning letters to each new sound. The most common schemes include:",
    article3Items: [
      "AABB (couplet): Lines 1 and 2 rhyme, lines 3 and 4 rhyme. Nursery rhymes and heroic couplets use this.",
      "ABAB (alternating): Lines alternate rhymes. The most common pattern in English lyric poetry and ballads.",
      "ABBA (enclosed): The outer lines rhyme with each other, enclosing a different inner rhyme.",
      "ABABCC (Shakespearean sonnet): Three quatrains with alternating rhyme followed by a closing couplet.",
      "Free verse (no scheme): Modern poetry often abandons end rhyme, relying on rhythm and assonance instead.",
    ],
    articleTitle4: "Rhyme in Songwriting and Hip-Hop",
    article4p1: "Modern songwriting has pushed rhyme far beyond simple end-rhyme patterns. Contemporary pop and hip-hop use sophisticated techniques:",
    article4Items: [
      "Internal rhyme: Rhyming within a single line, not just at line ends. Eminem is known for dense chains of internal rhymes.",
      "Multi-syllable rhyme: Matching entire phrases rather than single words, creating a more sophisticated effect.",
      "Assonance: Matching vowel sounds within words while consonants differ: brave/late/raze. Creates a looser sonic connection.",
      "Consonance: Matching final consonant sounds with different vowels: black/brick/book. Common in blues and soul.",
    ],
    articleTitle5: "Frequently Asked Questions",
    faq: [
      { q: "What is the difference between a rhyme and alliteration?", a: "Rhyme involves similar sounds at the end of words (cat/bat). Alliteration repeats the same initial consonant sound (Peter Piper picked). Both are forms of sound repetition used in poetry and rhetoric." },
      { q: "Why is it so hard to find a rhyme for orange?", a: "Orange is famously difficult to rhyme because of its unusual sound combination. The only near-perfect rhyme is Blorenge, a hill in Wales. Near-rhymes like door-hinge work in casual speech." },
      { q: "What does the score mean in the rhyme results?", a: "The score measures phonetic similarity from the Datamuse API. Higher scores indicate stronger, more exact rhymes. Scores above 10000 are typically perfect rhymes." },
      { q: "What are synonyms and antonyms good for in a rhyme tool?", a: "Finding a synonym first can unlock different rhyming options. If difficult has no good rhymes, synonyms like hard or tough open new possibilities." },
      { q: "Are there words in English with no rhymes at all?", a: "Yes - several common English words have no perfect rhymes: orange, silver, purple, month, ninth, pint, wolf, angst. Poets use near-rhymes or restructure lines." },
    ],
    modes: [
      { id: "rhymes", label: "Rhymes", helper: "Perfect rhymes ranked by relevance." },
      { id: "near", label: "Near rhymes", helper: "Close-sounding alternatives." },
      { id: "synonyms", label: "Synonyms", helper: "Different words with similar meaning." },
      { id: "antonyms", label: "Antonyms", helper: "Opposites and contrast words." },
      { id: "related", label: "Related", helper: "Words commonly associated with your query." },
    ],
  },
  "zh-hk": {
    collection: "TinyToolboxes 系列",
    pageTitle: "押韻工具",
    hero: "押韻、近音、同義詞、反義詞、相關字。",
    searchLabel: "搜尋系列",
    searchPlaceholder: "例如：體積重量、日期、字數、URL",
    searchHint: "搜尋提示",
    reserveAd: "預留 Google 廣告位",
    adLabel: "贊助廣告",
    adBadge: "廣告",
    lookingUp: "搜尋緊詞彙...",
    emptyHint: "搜尋一個詞語以查看結果排名。",
    scoreLabel: "分數",
    syllablesLabel: "音節",
    typeWord: "請先輸入一個詞。",
    articleTitle1: "咩係押韻？點解咁重要？",
    article1p1: "押韻係指兩個或以上詞語擁有相似嘅聲音模式，通常由最後一個重音元音開始直到詞尾。Cat 同 bat 押韻因為共享 -at 嘅發音。Love 同 dove 共享短 uv 音。押韻係人類語言最古老、最普遍嘅特徵之一。",
    article1p2: "押韻同時有美學同實用功能。喺詩歌同歌曲入面，押韻創造音樂感、建立節奏、令句子更易記。喺廣告，押韻口號更易俾人記住。喺教育，押韻幫細路學詞彙同發音。",
    articleTitle2: "押韻嘅種類",
    article2intro: "唔係所有押韻都一樣。英語詩歌同作詞區分幾種押韻類別：",
    rhymeTypes: [
      { name: "完全押韻", desc: "完全一樣嘅元音同尾輔音：cat/bat、moon/June、time/rhyme。傳統詩歌嘅黃金標準。" },
      { name: "近音押韻", desc: "相似但唔完全一樣嘅發音：love/move、home/come。喺現代流行曲同 hip-hop 歌詞用得較多。" },
      { name: "視覺押韻", desc: "睇落好似應該押韻但實際上唔同音：love/move、pint/mint。喺發音已經改變咗嘅古老詩歌常見。" },
      { name: "相同押韻", desc: "同一詞語用喺兩行結尾。傳統詩歌認為比較弱，但 rap 用嚟加強語氣。" },
      { name: "女性韻", desc: "喺非重音尾音節押韻：running/cunning、summer/drummer。創造較輕嘅節奏。" },
      { name: "豐富韻（同音詞）", desc: "發音一樣但串法同意思唔同：right/write/rite、there/their/they're。" },
    ],
    articleTitle3: "詩歌嘅押韻模式",
    article3p1: "押韻模式係詩歌每行結尾押韻嘅規律，通常用字母表示每種新音。最常見嘅模式包括：",
    article3Items: [
      "AABB（對聯）：第 1 同 2 行押韻，第 3 同 4 行押韻。童謠同英雄對聯使用呢種。",
      "ABAB（交替）：行同行之間交替押韻。英語抒情詩同民謠最常見嘅模式。",
      "ABBA（封閉式）：外面兩行互相押韻，包住中間唔同嘅押韻。",
      "ABABCC（莎士比亞十四行詩）：三段四行用交替韻，最後用一對押韻結尾。",
      "自由詩（冇模式）：現代詩歌經常放棄結尾押韻，改為靠節奏同母音重複。",
    ],
    articleTitle4: "歌曲創作同 Hip-Hop 嘅押韻",
    article4p1: "現代歌曲創作將押韻推得遠遠超越簡單嘅結尾押韻模式。當代流行曲同 hip-hop 使用先進技術：",
    article4Items: [
      "內部押韻：喺同一行入面押韻，唔淨只係句尾。Eminem 以密集嘅內部押韻鏈聞名。",
      "多音節押韻：匹配整個詞組而唔係單一詞語，創造更複雜嘅效果。",
      "母音重複（半諧音）：詞語入面母音相似但輔音唔同：brave/late/raze。創造較鬆散嘅聲音連繫。",
      "輔音重複：尾輔音相同但母音唔同：black/brick/book。藍調同靈魂音樂常見。",
    ],
    articleTitle5: "常見問題",
    faq: [
      { q: "押韻同頭韻有咩分別？", a: "押韻涉及詞尾相似嘅聲音（cat/bat）。頭韻係重複鄰近詞語開頭相同嘅輔音（Peter Piper picked）。兩者都係詩歌同修辭入面使用嘅聲音重複形式。" },
      { q: "點解好難搵到 orange 嘅押韻詞？", a: "Orange 因為唔尋常嘅發音組合而好難押韻。唯一近乎完美嘅押韻係 Blorenge（威爾斯一座山）。近音押韻例如 door-hinge 喺口語入面勉強得。" },
      { q: "搜尋結果入面嘅分數代表咩？", a: "分數係 Datamuse API 計算嘅語音相似度。分數愈高代表押韻愈精確。超過 10000 分通常係完全押韻；較低分數係近音押韻。" },
      { q: "喺押韻工具入面同義詞同反義詞有咩用？", a: "搵唔到你想要嘅詞嘅押韻嗰陣，先搵同義詞可以開啟全新嘅押韻選項。如果 difficult 冇好嘅押韻，同義詞例如 hard 或 tough 可以提供更多選擇。" },
      { q: "英文入面有冇完全冇押韻嘅詞語？", a: "有——幾個常見英文詞語冇完全押韻：orange、silver、purple、month、ninth、pint、wolf、angst。詩人要用近音押韻或者重組句子結構嚟應對。" },
    ],
    modes: [
      { id: "rhymes", label: "押韻", helper: "按相關性排列嘅完全押韻。" },
      { id: "near", label: "近音", helper: "近似發音嘅替代詞。" },
      { id: "synonyms", label: "同義詞", helper: "意思相似嘅唔同詞語。" },
      { id: "antonyms", label: "反義詞", helper: "相反意思嘅詞語。" },
      { id: "related", label: "相關詞", helper: "同你搜尋嘅詞語相關嘅詞。" },
    ],
  },
  "zh-cn": {
    collection: "TinyToolboxes 系列",
    pageTitle: "押韵工具",
    hero: "押韵、近音、同义词、反义词、相关词。",
    searchLabel: "搜索系列",
    searchPlaceholder: "例如：体积重量、日期、字数、URL",
    searchHint: "搜索提示",
    reserveAd: "预留 Google 广告位",
    adLabel: "赞助广告",
    adBadge: "广告",
    lookingUp: "正在查找词汇...",
    emptyHint: "搜索一个词语以查看结果排名。",
    scoreLabel: "分数",
    syllablesLabel: "音节",
    typeWord: "请先输入一个词。",
    articleTitle1: "什么是押韵？为什么重要？",
    article1p1: "押韵是指两个或以上词语拥有相似的声音模式，通常从最后一个重音元音开始直到词尾。Cat 和 bat 押韵因为共享 -at 的发音。Love 和 dove 共享短 uv 音。押韵是人类语言最古老、最普遍的特征之一。",
    article1p2: "押韵同时具有美学和实用功能。在诗歌和歌曲中，押韵创造音乐感、建立节奏、使句子更易记忆。在广告中，押韵口号更容易被记住。在教育中，押韵帮助孩子学词汇和发音。",
    articleTitle2: "押韵的种类",
    article2intro: "并非所有押韵都一样。英语诗歌和作词区分几种押韵类别：",
    rhymeTypes: [
      { name: "完全押韵", desc: "完全一样的元音和尾辅音：cat/bat、moon/June、time/rhyme。传统诗歌的黄金标准。" },
      { name: "近音押韵", desc: "相似但不完全一样的发音：love/move、home/come。用于现代流行曲和嘻哈歌词。" },
      { name: "视觉押韵", desc: "看起来像押韵但实际发音不同：love/move、pint/mint。在发音已改变的古老诗歌中常见。" },
      { name: "相同押韵", desc: "同一词语用在两行结尾。传统诗歌认为较弱，但说唱用于强调。" },
      { name: "女性韵", desc: "在非重音尾音节押韵：running/cunning、summer/drummer。创造较轻的节奏。" },
      { name: "丰富韵（同音词）", desc: "发音相同但拼写和意义不同：right/write/rite、there/their/they're。" },
    ],
    articleTitle3: "诗歌的押韵模式",
    article3p1: "押韵模式是诗歌每行结尾押韵的规律，通常用字母表示每种新音。最常见的模式包括：",
    article3Items: [
      "AABB（对联）：第 1 和 2 行押韵，第 3 和 4 行押韵。童谣和英雄对联使用这种。",
      "ABAB（交替）：行与行之间交替押韵。英语抒情诗和民谣最常见的模式。",
      "ABBA（封闭式）：外面两行互相押韵，包住中间不同的押韵。",
      "ABABCC（莎士比亚十四行诗）：三段四行用交替韵，最后用一对押韵结尾。",
      "自由诗（无模式）：现代诗歌经常放弃结尾押韵，改为依靠节奏和元音重复。",
    ],
    articleTitle4: "歌曲创作和 Hip-Hop 的押韵",
    article4p1: "现代歌曲创作将押韵远远超越简单的结尾押韵模式。当代流行曲和嘻哈使用先进技术：",
    article4Items: [
      "内部押韵：在同一行内押韵，不仅限于句尾。Eminem 以密集的内部押韵链闻名。",
      "多音节押韵：匹配整个词组而非单个词语，创造更复杂的效果。",
      "元音重复（半谐音）：词语内元音相似但辅音不同：brave/late/raze。创造较松散的声韵联系。",
      "辅音重复：尾辅音相同但元音不同：black/brick/book。蓝调和灵魂音乐常见。",
    ],
    articleTitle5: "常见问题",
    faq: [
      { q: "押韵和头韵有什么区别？", a: "押韵涉及词尾相似的声音（cat/bat）。头韵是重复邻近词语开头相同的辅音（Peter Piper picked）。两者都是诗歌和修辞中使用的声音重复形式。" },
      { q: "为什么很难找到 orange 的押韵词？", a: "Orange 因为不寻常的发音组合而很难押韵。唯一近乎完美的押韵是 Blorenge（威尔士一座山）。近音押韵如 door-hinge 在口语中勉强可用。" },
      { q: "搜索结果中的分数代表什么？", a: "分数是 Datamuse API 计算的语音相似度。分数越高代表押韵越精确。超过 10000 分通常是完全押韵；较低分数是近音押韵。" },
      { q: "在押韵工具中同义词和反义词有什么用？", a: "找不到想要的词的押韵时，先找同义词可以开启全新的押韵选项。如果 difficult 没有好的押韵，同义词如 hard 或 tough 可以提供更多选择。" },
      { q: "英语中有没有完全没有押韵的词？", a: "有——几个常见英文词没有完全押韵：orange、silver、purple、month、ninth、pint、wolf、angst。诗人需使用近音押韵或重组句子结构来应对。" },
    ],
    modes: [
      { id: "rhymes", label: "押韵", helper: "按相关性排列的完全押韵。" },
      { id: "near", label: "近音", helper: "近似发音的替代词。" },
      { id: "synonyms", label: "同义词", helper: "意思相似的不同词语。" },
      { id: "antonyms", label: "反义词", helper: "相反意思的词语。" },
      { id: "related", label: "相关词", helper: "与搜索词语相关的词。" },
    ],
  },
  es: {
    collection: "Colección TinyToolboxes",
    pageTitle: "Rhyme Zone",
    hero: "Rimas, rimas cercanas, sinónimos, antónimos y palabras relacionadas.",
    searchLabel: "Buscar la colección",
    searchPlaceholder: "Prueba: weight, date, word, url",
    searchHint: "Sugerencias",
    reserveAd: "Espacio reservado para Google Ads",
    adLabel: "Anuncio patrocinado",
    adBadge: "Anuncio",
    lookingUp: "Buscando palabras...",
    emptyHint: "Busca una palabra para ver resultados ordenados.",
    scoreLabel: "Puntuacion",
    syllablesLabel: "silabas",
    typeWord: "Escribe una palabra primero.",
    articleTitle1: "Que son las rimas y por que importan?",
    article1p1: "Una rima ocurre cuando dos o mas palabras comparten un patron de sonido similar, tipicamente desde la ultima vocal acentuada hasta el final de la palabra. Cat y bat riman porque comparten el sonido -at. Love y dove comparten el sonido uv corto. La rima es una de las caracteristicas mas antiguas y universales del lenguaje humano.",
    article1p2: "Las rimas sirven tanto para fines esteticos como funcionales. En poesia y musica, crean cualidad musical, establecen ritmo y hacen las lineas mas memorables. En publicidad, los esloganes rimados se recuerdan mas facilmente. En educacion, las rimas ayudan a los ninos a aprender vocabulario y fonetica.",
    articleTitle2: "Tipos de rima",
    article2intro: "No todas las rimas son iguales. La poesia y composicion inglesa reconocen varias categorias:",
    rhymeTypes: [
      { name: "Rima perfecta", desc: "Sonidos identicos de vocal y consonante final: cat/bat, moon/June. El estandar en poesia tradicional." },
      { name: "Rima cercana", desc: "Sonidos similares pero no identicos: love/move, home/come. Usada en pop moderno y hip-hop." },
      { name: "Rima visual", desc: "Palabras que parecen rimar por su ortografia pero no: love/move, pint/mint. Comun en poesia antigua." },
      { name: "Rima identica", desc: "La misma palabra al final de dos lineas. Debil en poesia tradicional pero efectiva en rap." },
      { name: "Rima femenina", desc: "Rima en una silaba final no acentuada: running/cunning. Crea una cadencia mas ligera." },
      { name: "Rima rica (homofona)", desc: "Palabras con sonido identico pero diferente ortografia: right/write/rite." },
    ],
    articleTitle3: "Esquemas de rima en poesia",
    article3p1: "Un esquema de rima es el patron de rimas al final de cada linea, denotado asignando letras a cada nuevo sonido. Los esquemas mas comunes:",
    article3Items: [
      "AABB (pareado): Las lineas 1 y 2 riman, las lineas 3 y 4 riman. Usado en rimas infantiles.",
      "ABAB (alternante): Las lineas alternan rimas. El patron mas comun en poesia lirica inglesa.",
      "ABBA (encerrado): Las lineas exteriores riman entre si, encerrando una rima interior diferente.",
      "ABABCC (soneto shakespeariano): Tres cuartetos con rima alternante seguidos por un pareado final.",
      "Verso libre (sin esquema): La poesia moderna a menudo abandona la rima final, confiando en el ritmo.",
    ],
    articleTitle4: "Rima en composicion musical y Hip-Hop",
    article4p1: "La composicion moderna ha llevado la rima mucho mas alla de los patrones simples de rima final. El pop y hip-hop contemporaneo usan tecnicas sofisticadas:",
    article4Items: [
      "Rima interna: Rimar dentro de una misma linea. Eminem es conocido por densas cadenas de rimas internas.",
      "Rima multisilabica: Emparejar frases enteras en lugar de palabras individuales, creando un efecto mas sofisticado.",
      "Asonancia: Emparejar sonidos vocalicos mientras las consonantes difieren: brave/late/raze. Crea una conexion sonora mas suelta.",
      "Consonancia: Emparejar sonidos consonanticos finales con vocales diferentes: black/brick/book. Comun en blues y soul.",
    ],
    articleTitle5: "Preguntas frecuentes",
    faq: [
      { q: "Cual es la diferencia entre rima y aliteracion?", a: "La rima involucra sonidos similares al final de palabras (cat/bat). La aliteracion repite el mismo sonido consonante inicial (Peter Piper picked). Ambas son formas de repeticion sonora en poesia y retorica." },
      { q: "Por que es tan dificil encontrar una rima para orange?", a: "Orange es famosamente dificil de rimar por su combinacion inusual de sonidos. La unica rima casi perfecta es Blorenge, una colina en Gales. Las rimas cercanas como door-hinge funcionan en habla informal." },
      { q: "Que significa la puntuacion en los resultados?", a: "La puntuacion mide la similitud fonetica de la API Datamuse. Puntuaciones mas altas indican rimas mas exactas. Por encima de 10000 suelen ser rimas perfectas." },
      { q: "Para que sirven los sinonimos y antonimos en una herramienta de rimas?", a: "Encontrar un sinonimo primero puede desbloquear opciones de rima diferentes. Si difficult no tiene buenas rimas, sinonimos como hard o tough abren nuevas posibilidades." },
      { q: "Hay palabras en ingles sin ninguna rima?", a: "Si - varias palabras comunes no tienen rimas perfectas: orange, silver, purple, month, ninth, pint, wolf, angst. Los poetas usan rimas cercanas o reestructuran lineas." },
    ],
    modes: [
      { id: "rhymes", label: "Rimas", helper: "Rimas perfectas ordenadas por relevancia." },
      { id: "near", label: "Rimas cercanas", helper: "Alternativas con sonido similar." },
      { id: "synonyms", label: "Sinonimos", helper: "Palabras diferentes con significado similar." },
      { id: "antonyms", label: "Antonimos", helper: "Palabras de significado opuesto." },
      { id: "related", label: "Relacionadas", helper: "Palabras comunmente asociadas con tu busqueda." },
    ],
  },
} as const;

type Mode = "rhymes" | "near" | "synonyms" | "antonyms" | "related";

type ResultItem = {
  word: string;
  score: number;
  tags: string[];
  syllables: number | null;
  partOfSpeech: string | null;
};

type ApiResponse = {
  query?: string;
  mode?: Mode;
  count?: number;
  results?: ResultItem[];
  error?: string;
};


const QUICK_PICKS = ["light", "orange", "silver", "sparkle", "moon", "time"];

function Header({ locale, setLocale }: { locale: string; setLocale: (v: any) => void }) {
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-wide">TinyToolboxes</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span>
            </div>
            <p className="text-sm text-white/50">Boring, useful, searchable.</p>
          </div>
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {LOCALES.map((item) => (
            <button key={item.id} onClick={() => setLocale(item.id)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SearchPanel({ locale }: { locale: string }) {
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;
  const [query, setQuery] = useState("");
  const filtered = ["weight", "date", "word", "url", "rhyme"].filter((hint) => hint.includes(query.toLowerCase()) || !query);
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-300">{c.searchLabel}</p>
          <p className="mt-1 text-sm text-white/60">{c.searchHint}</p>
        </div>
        <div className="text-xs text-white/45">{c.reserveAd}</div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <Search className="h-4 w-4 text-emerald-300" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.searchPlaceholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {filtered.map((hint) => (
          <button key={hint} onClick={() => setQuery(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-emerald-300/40 hover:bg-emerald-300/10">{hint}</button>
        ))}
      </div>
    </section>
  );
}

function labelFromTag(tag: string | null) {
  switch (tag) {
    case "n":
      return "noun";
    case "v":
      return "verb";
    case "adj":
      return "adjective";
    case "adv":
      return "adverb";
    case "pron":
      return "pronoun";
    case "prep":
      return "preposition";
    case "conj":
      return "conjunction";
    case "det":
      return "determiner";
    default:
      return tag ?? "word";
  }
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/rhyme-zone";

function applySEO(o: { title: string; description: string; path: string; jsonLd?: object | object[] }) {
  if (typeof document === "undefined") return;
  const url = SITE_URL + o.path;
  document.title = o.title;
  const head = document.head;
  const upsert = (sel: string, mk: () => HTMLElement, attr: string, val: string) => {
    let el = head.querySelector(sel) as HTMLElement | null;
    if (!el) { el = mk(); head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  const meta = (name: string, content: string) => upsert(`meta[name="${name}"]`, () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) => upsert(`meta[property="${p}"]`, () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) {
    const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd];
    arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); });
  }
}

export default function RhymeZone() {
  type LocaleId = typeof LOCALES[number]["id"];
  const [locale, setLocale] = useState<LocaleId>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleId | null;
    return saved && LOCALES.some((l) => l.id === saved) ? saved : "en";
  });
  const [query, setQuery] = useState("light");
  const [mode, setMode] = useState<Mode>("rhymes");
  const [searchedQuery, setSearchedQuery] = useState("light");
  const [searchedMode, setSearchedMode] = useState<Mode>("rhymes");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const content = COPY[locale as keyof typeof COPY] ?? COPY.en;

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    applySEO({
      title: `${content.pageTitle} | TinyToolboxes`,
      description: content.hero,
      path: PAGE_PATH,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebApplication", name: content.pageTitle, url: SITE_URL + PAGE_PATH, description: content.hero, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.faq.map((item: {q: string; a: string}) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      ],
    });
  }, [content.hero, content.pageTitle, locale]);

  useEffect(() => {
    void runSearch("light", "rhymes");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(nextQuery = query, nextMode = mode) {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      setError(content.typeWord);
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rhyme-zone?word=${encodeURIComponent(trimmed)}&mode=${encodeURIComponent(nextMode)}`, {
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as ApiResponse;
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
      setResults(data.results ?? []);
      setSearchedQuery(data.query ?? trimmed);
      setSearchedMode((data.mode ?? nextMode) as Mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#163028_0%,#091016_28%,#05070b_100%)] text-white">
      <Header locale={locale} setLocale={setLocale} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-emerald-200"><Sparkles className="h-4 w-4" /><span>{content.collection}</span></div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{content.pageTitle}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">{content.hero}</p>
        </div>
        <SearchPanel locale={locale} />
        <div className="mt-6 rounded-3xl border border-dashed border-emerald-300/25 bg-emerald-300/5 p-4 text-sm text-emerald-100/80">{content.reserveAd}</div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">{content.lookingUp}</div>
          ) : results.length ? (
            results.slice(0, 8).map((item, index) => (
              <article key={`${item.word}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-400/30 hover:bg-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {item.word}
                      </h3>
                      {item.partOfSpeech ? (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                          {labelFromTag(item.partOfSpeech)}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-sm text-white/45">
                      {content.scoreLabel} {item.score.toLocaleString()}
                      {item.syllables !== null ? ` • ${item.syllables} ${content.syllablesLabel}` : ""}
                    </div>
                  </div>
                </div>
                {item.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-xs text-white/70">
                        {labelFromTag(tag)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-white/55">{content.emptyHint}</div>
          )}
        </div>

        <article className="mt-8 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <div>
            <h2 className="text-2xl font-bold text-white">{content.articleTitle1}</h2>
            <p className="mt-3 leading-7">{content.article1p1}</p>
            <p className="mt-3 leading-7">{content.article1p2}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{content.articleTitle2}</h2>
            <p className="mt-3 leading-7">{content.article2intro}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {content.rhymeTypes.map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{content.articleTitle3}</h2>
            <p className="mt-3 leading-7">{content.article3p1}</p>
            <ul className="mt-3 space-y-2 text-white/70">
              {content.article3Items.map((item, i) => (
                <li key={i} className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><span>{item}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{content.articleTitle4}</h2>
            <p className="mt-3 leading-7">{content.article4p1}</p>
            <ul className="mt-3 space-y-3 text-white/70">
              {content.article4Items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{content.articleTitle5}</h2>
            <div className="mt-4 space-y-5">
              {content.faq.map((item, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-white">{item.q}</h3>
                  <p className="mt-1 text-white/70">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </article></section>
    </main>
  );
}
