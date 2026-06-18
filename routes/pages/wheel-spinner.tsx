import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeDollarSign, RotateCw, Search, Shuffle, Trash2 } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  reserveAd: string;
  reserveAdSub: string;
  entriesLabel: string;
  entriesHelp: string;
  spin: string;
  spinning: string;
  reset: string;
  shuffle: string;
  winner: string;
  removeWinner: string;
  noEntries: string;
  useCasesTitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
  articleTitle: string;
  adLabel: string;
  adBadge: string;
  articleIntro: string;
  fairnessTitle: string;
  fairnessBody: string;
  whereUsedTitle: string;
  whereUsedItems: { title: string; desc: string }[];
  tipsTitle: string;
  tipsBody: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
}> = {
  en: {
    name: "English",
    title: "Wheel Spinner",
    subtitle: "Spin a random wheel to pick a name, choose a winner, or make a fair decision. Free, fast, and works on any device.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: rhyme, calorie, BMI, mortgage",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "Google Ads space reserved. To advertise here, visit the contact page.",
    entriesLabel: "Entries",
    entriesHelp: "One entry per line. Add the names, options, or choices you want the wheel to pick from.",
    spin: "Spin the wheel",
    spinning: "Spinning…",
    reset: "Reset",
    shuffle: "Shuffle",
    winner: "Winner",
    removeWinner: "Remove winner",
    noEntries: "Add at least 2 entries to spin.",
    useCasesTitle: "Use cases",
    useCases: [
      "Pick a random name for a giveaway or contest.",
      "Decide who goes first in a game or presentation.",
      "Choose lunch, movies, or weekend plans fairly.",
      "Classroom: pick a student to answer next.",
      "Team standups: pick who shares first.",
    ],
    suggestionsTitle: "You may also like",
    suggestions: ["Percentage Calculator", "Date Difference Calculator", "Word Counter"],
    articleTitle: "How a wheel spinner works",
    adLabel: "Advertisement",
    adBadge: "AD",
    articleIntro: "A wheel spinner is a digital version of a physical prize wheel. You enter a list of options, the tool draws them as colored slices on a circle, and a randomization algorithm picks one when you spin. Behind the scenes, a uniform pseudo-random number generator selects an index between 0 and N-1 (where N is your entry count), then the visible wheel animates to land on that exact slice. The animation is just visual flair — the result is decided the moment you press spin.",
    fairnessTitle: "What makes the pick truly fair",
    fairnessBody: "Modern browsers use cryptographically-seeded RNGs that are statistically indistinguishable from true randomness for everyday use. Each entry has exactly a 1/N probability of winning. This matters when fairness is being questioned — by a classroom, a contest audience, or family members deciding who buys dinner. Compared to \"pick a number 1 to 10 in your head,\" a wheel spinner removes bias from people who unconsciously avoid certain numbers (5 and 7 are the most picked when humans are asked for a \"random\" digit between 1 and 10).",
    whereUsedTitle: "Where wheel spinners are actually used",
    whereUsedItems: [
      { title: "Giveaways and contests.", desc: "Brands run Instagram or TikTok contests and need to publicly show how the winner was chosen. A wheel spinner with the entrant list is the most credible visual." },
      { title: "Classrooms.", desc: "Teachers use spinners to call on students randomly, avoiding the tendency to always call on the same hands." },
      { title: "Team rituals.", desc: "Daily standup speaking order, retrospective topic picking, who does the next demo." },
      { title: "Game nights.", desc: "Pick who starts, pick teams, pick the next game." },
      { title: "Decision fatigue.", desc: "\"I can't decide between three restaurants\" — let the wheel pick." },
    ],
    tipsTitle: "Tips for getting more out of a wheel spinner",
    tipsBody: "If you want weighted picks (some options more likely than others), duplicate the names you want to favor — Bob × 3 in the list gives Bob three slices and a 3/N chance. After a winner is picked, click Remove winner to draw a second prize without that person being eligible again. For very long lists (200+ entries), the visible labels get tiny, but the math still works perfectly — pick the winner first then read it from the result card.",
    faqTitle: "FAQ",
    faq: [
      { q: "Is the wheel really random?", a: "Yes. We use Math.random(), which is a high-quality pseudo-random generator. For contests where audit logs matter, take a screen recording of the spin." },
      { q: "Can I save my list?", a: "The entries persist in this tab as long as you don't close it. We don't store data on a server — everything runs in your browser." },
      { q: "Can two people get the same name?", a: "Yes. Each name is treated as a separate entry even if the text is identical. If you want unique names, deduplicate your list first." },
      { q: "Does this work offline?", a: "Once loaded, yes — the page runs entirely in your browser." },
      { q: "Why does the wheel sometimes look like it stops between two slices?", a: "The pointer is at the top; whichever slice is directly under it when the animation ends is the winner. We round to the nearest slice center so the math is unambiguous." },
    ],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "輪盤抽選器",
    subtitle: "輸入名單，按一下就隨機抽出一個贏家。免費、夠快、手機電腦都用得。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：押韻、卡路里、BMI、按揭",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "預留 Google 廣告位。有意在此刊登廣告，請瀏覽聯絡頁面。",
    entriesLabel: "選項",
    entriesHelp: "每行一個。可以輸入名、選擇或者任何要抽嘅嘢。",
    spin: "轉動輪盤",
    spinning: "轉緊…",
    reset: "重設",
    shuffle: "打亂",
    winner: "贏家",
    removeWinner: "移除贏家",
    noEntries: "至少輸入 2 個選項先可以轉。",
    useCasesTitle: "用途",
    useCases: [
      "抽獎、賽事抽出得獎者。",
      "決定遊戲或會議邊個先發言。",
      "公平咁揀餐廳、電影或週末計劃。",
      "上堂：隨機點學生答問題。",
      "Standup：隨機決定報告次序。",
    ],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["百分比計算器", "日期差計算器", "字數統計器"],
    articleTitle: "輪盤抽選器點樣運作？",
    adLabel: "廣告",
    adBadge: "廣告",
    articleIntro: "輪盤抽選器係實體抽獎輪嘅數碼版。你入一個選項列表，工具會將佢哋畫成圓圈上嘅彩色扇形，當你轉動時，隨機演算法會揀出一個結果。背後原理係用一個均勻嘅偽隨機數生成器揀出 0 到 N-1 之間嘅索引（N 係你嘅選項數），然後可視化嘅輪盤會動畫化轉到嗰一格。動畫只係視覺效果——結果喺你撳掣嗰一刻已經決定咗。",
    fairnessTitle: "點解抽選結果真係公平",
    fairnessBody: "現代瀏覽器用加密種子嘅 RNG，喺日常使用上同真正嘅隨機性喺統計上冇分別。每個選項都有 1/N 嘅機率中選。當公平性受到質疑——例如課堂上、比賽觀眾、或者家人決定邊個請食飯——呢點就好重要。比起「喺心入面揀 1 至 10 嘅數字」，輪盤抽選器消除咗人嘅偏見——人喺被要求講一個 1 至 10 之間嘅「隨機」數字時，最常揀嘅係 5 同 7。",
    whereUsedTitle: "輪盤抽選器嘅實際應用場景",
    whereUsedItems: [
      { title: "抽獎同比賽。", desc: "品牌搞 Instagram 或 TikTok 比賽時需要公開展示點樣揀出贏家。用參賽者名單嘅輪盤係最有說服力嘅視覺工具。" },
      { title: "課堂。", desc: "老師用抽選器隨機點學生答問題，避免成日叫同一班舉手嘅學生。" },
      { title: "團隊慣例。", desc: "每日站會嘅發言次序、回顧會議揀主題、決定下一個做 Demo 嘅人。" },
      { title: "遊戲之夜。", desc: "決定邊個開始、揀隊伍、揀下一隻遊戲。" },
      { title: "決策疲勞。", desc: "「三間餐廳我揀唔到」——畀輪盤幫你揀。" },
    ],
    tipsTitle: "用盡輪盤抽選器嘅貼士",
    tipsBody: "如果你想要加權抽選（某啲選項機率更高），重複你想提高機率嘅名——例如 Bob × 3 喺列表度會畀 Bob 三格同 3/N 嘅中獎機會。抽出贏家之後，撳「移除贏家」就可以抽第二個獎而唔會畀同一個人再中。對於好長嘅列表（200+ 個選項），可見嘅標籤會好細，但數學上完全冇問題——先抽出贏家，然後喺結果卡度睇結果。",
    faqTitle: "常見問題",
    faq: [
      { q: "輪盤真係隨機㗎？", a: "係。我哋用 Math.random()，係一個高質素嘅偽隨機生成器。對於需要審計記錄嘅比賽，建議錄低轉動嘅螢幕畫面。" },
      { q: "可唔可以儲存我嘅列表？", a: "只要你唔閂呢個分頁，選項就會保留。我哋唔會喺伺服器儲存數據——所有嘢都喺你嘅瀏覽器度運行。" },
      { q: "兩個人會唔會抽到同一個名？", a: "會。每個名都係獨立嘅選項，就算文字完全一樣。如果你想要唔重複嘅名，請先自行去重。" },
      { q: "離線用唔用到？", a: "只要載入咗一次就可以——成個頁面完全喺你嘅瀏覽器度運行。" },
      { q: "點解輪盤有時好似停喺兩格之間？", a: "指針喺頂部；動畫結束時指針正下方嗰格就係贏家。我哋會四捨五入到最近嗰格嘅中央，確保數學上冇歧義。" },
    ],
  },
  "zh-cn": {
    name: "简体中文",
    title: "转盘抽选器",
    subtitle: "输入名单，点一下就随机抽出一个赢家。免费、快速、手机电脑都能用。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：押韵、卡路里、BMI、按揭",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "预留 Google 广告位。有意在此刊登广告，请浏览联系页面。",
    entriesLabel: "选项",
    entriesHelp: "每行一个。可以输入名字、选择或任何要抽的内容。",
    spin: "转动转盘",
    spinning: "转动中…",
    reset: "重置",
    shuffle: "打乱",
    winner: "赢家",
    removeWinner: "移除赢家",
    noEntries: "至少输入 2 个选项才能转动。",
    useCasesTitle: "用途",
    useCases: [
      "抽奖、赛事抽取获奖者。",
      "决定游戏或会议谁先发言。",
      "公平地选餐厅、电影或周末计划。",
      "课堂：随机点学生回答问题。",
      "Standup：随机决定汇报顺序。",
    ],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["百分比计算器", "日期差计算器", "字数统计器"],
    articleTitle: "转盘抽选器如何工作？",
    adLabel: "广告",
    adBadge: "广告",
    articleIntro: "转盘抽选器是实体抽奖轮的数码版本。你输入一个选项列表，工具会将它们画成圆圈上的彩色扇形，当你转动时，随机算法会选出一个结果。背后原理是用一个均匀的伪随机数生成器选出 0 到 N-1 之间的索引（N 是你的选项数量），然后可视化的转盘会动画化转到那一格。动画只是视觉效果——结果在你按下按钮的那一刻已经决定了。",
    fairnessTitle: "为什么抽选结果真的公平",
    fairnessBody: "现代浏览器使用加密种子的 RNG，在日常使用上与真正的随机性在统计上没有区别。每个选项都有 1/N 的概率中选。当公平性受到质疑——例如课堂上、比赛观众、或者家人决定谁请吃饭——这点就很重要。比起「在心里选 1 到 10 的数字」，转盘抽选器消除了人的偏见——人在被要求说一个 1 到 10 之间的「随机」数字时，最常选的是 5 和 7。",
    whereUsedTitle: "转盘抽选器的实际应用场景",
    whereUsedItems: [
      { title: "抽奖和比赛。", desc: "品牌举办 Instagram 或 TikTok 比赛时需要公开展示如何选出赢家。用参赛者名单的转盘是最有说服力的视觉工具。" },
      { title: "课堂。", desc: "老师用抽选器随机点学生回答问题，避免总是叫同一批举手的学生。" },
      { title: "团队惯例。", desc: "每日站会的发言顺序、回顾会议选主题、决定下一个做 Demo 的人。" },
      { title: "游戏之夜。", desc: "决定谁开始、选队伍、选下一个游戏。" },
      { title: "决策疲劳。", desc: "「三家餐厅我选不了」——让转盘帮你选。" },
    ],
    tipsTitle: "用好转盘抽选器的技巧",
    tipsBody: "如果你想要加权抽选（某些选项概率更高），重复你想提高概率的名字——例如 Bob × 3 在列表中会给 Bob 三格和 3/N 的中奖机会。抽出赢家后，点击「移除赢家」就可以抽第二个奖而不会让同一个人再中。对于很长的列表（200+ 个选项），可见的标签会很小，但数学上完全没问题——先抽出赢家，然后在结果卡中查看结果。",
    faqTitle: "常见问题",
    faq: [
      { q: "转盘真的是随机的吗？", a: "是的。我们使用 Math.random()，这是一个高质量的伪随机生成器。对于需要审计记录的比赛，建议录下转动的屏幕画面。" },
      { q: "可以保存我的列表吗？", a: "只要你不关闭这个标签页，选项就会保留。我们不会在服务器上存储数据——所有内容都在你的浏览器中运行。" },
      { q: "两个人会抽到同一个名字吗？", a: "会。每个名字都是独立的选项，即使文本完全相同。如果你想要不重复的名字，请先自行去重。" },
      { q: "离线可以用吗？", a: "只要加载过一次就可以——整个页面完全在你的浏览器中运行。" },
      { q: "为什么转盘有时看起来停在两格之间？", a: "指针在顶部；动画结束时指针正下方的那一格就是赢家。我们会四舍五入到最近那一格的中央，确保数学上没有歧义。" },
    ],
  },
  es: {
    name: "Español",
    title: "Ruleta aleatoria",
    subtitle: "Gira una ruleta para elegir un nombre, un ganador o tomar una decisión justa. Gratis, rápido y funciona en cualquier dispositivo.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: rhyme, calorie, BMI, mortgage",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Espacio reservado para Google Ads. Para anunciarte aquí, visita la página de contacto.",
    entriesLabel: "Entradas",
    entriesHelp: "Una entrada por línea. Añade los nombres u opciones de los que quieras elegir.",
    spin: "Girar la ruleta",
    spinning: "Girando…",
    reset: "Reiniciar",
    shuffle: "Mezclar",
    winner: "Ganador",
    removeWinner: "Eliminar ganador",
    noEntries: "Añade al menos 2 entradas para girar.",
    useCasesTitle: "Casos de uso",
    useCases: [
      "Elegir un ganador en sorteos o concursos.",
      "Decidir quién empieza en un juego o reunión.",
      "Elegir restaurante, película o plan de fin de semana.",
      "Aula: elegir un estudiante para responder.",
      "Standup: elegir quién comparte primero.",
    ],
    suggestionsTitle: "También te puede interesar",
    suggestions: ["Calculadora de porcentajes", "Calculadora de diferencia de fechas", "Contador de palabras"],
    articleTitle: "Cómo funciona una ruleta aleatoria",
    adLabel: "Publicidad",
    adBadge: "ANUNCIO",
    articleIntro: "Una ruleta aleatoria es una versión digital de una ruleta física de premios. Ingresas una lista de opciones, la herramienta las dibuja como sectores de colores en un círculo y un algoritmo de aleatorización elige una cuando giras. Detrás de escena, un generador uniforme de números pseudoaleatorios selecciona un índice entre 0 y N-1 (donde N es el número de entradas), luego la ruleta visible se anima para aterrizar en ese sector exacto. La animación es solo un efecto visual: el resultado se decide en el momento en que presionas girar.",
    fairnessTitle: "Qué hace que la selección sea realmente justa",
    fairnessBody: "Los navegadores modernos utilizan RNG con semilla criptográfica que son estadísticamente indistinguibles de la verdadera aleatoriedad para el uso diario. Cada entrada tiene exactamente una probabilidad de 1/N de ganar. Esto importa cuando se cuestiona la imparcialidad: en un aula, una audiencia de concurso o entre familiares que deciden quién paga la cena. En comparación con \"elige un número del 1 al 10 mentalmente\", una ruleta elimina el sesgo de las personas que inconscientemente evitan ciertos números (el 5 y el 7 son los más elegidos cuando se pide a los humanos un dígito \"aleatorio\" entre 1 y 10).",
    whereUsedTitle: "Dónde se usan realmente las ruletas",
    whereUsedItems: [
      { title: "Sorteos y concursos.", desc: "Las marcas organizan concursos en Instagram o TikTok y necesitan mostrar públicamente cómo se eligió al ganador. Una ruleta con la lista de participantes es la herramienta visual más creíble." },
      { title: "Aulas.", desc: "Los profesores usan ruletas para elegir estudiantes al azar, evitando la tendencia a llamar siempre a los mismos." },
      { title: "Rituales de equipo.", desc: "Orden de intervención en reuniones diarias, elección de temas en retrospectivas, quién hace la próxima demo." },
      { title: "Noches de juegos.", desc: "Elegir quién empieza, formar equipos, elegir el próximo juego." },
      { title: "Fatiga de decisiones.", desc: "\"No puedo decidir entre tres restaurantes\": deja que la ruleta elija." },
    ],
    tipsTitle: "Consejos para sacar más provecho de una ruleta",
    tipsBody: "Si quieres selecciones ponderadas (algunas opciones más probables que otras), duplica los nombres que quieras favorecer: Bob × 3 en la lista le da a Bob tres sectores y una probabilidad de 3/N. Después de elegir un ganador, haz clic en Eliminar ganador para sacar un segundo premio sin que esa persona vuelva a ser elegible. Para listas muy largas (más de 200 entradas), las etiquetas visibles se vuelven pequeñas, pero el cálculo sigue funcionando perfectamente: elige al ganador primero y luego léelo en la tarjeta de resultados.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Es realmente aleatoria la ruleta?", a: "Sí. Usamos Math.random(), que es un generador pseudoaleatorio de alta calidad. Para concursos donde importa el registro de auditoría, graba la pantalla durante el giro." },
      { q: "¿Puedo guardar mi lista?", a: "Las entradas permanecen en esta pestaña mientras no la cierres. No almacenamos datos en un servidor: todo se ejecuta en tu navegador." },
      { q: "¿Pueden dos personas obtener el mismo nombre?", a: "Sí. Cada nombre se trata como una entrada independiente incluso si el texto es idéntico. Si quieres nombres únicos, deduplica tu lista primero." },
      { q: "¿Funciona sin conexión?", a: "Una vez cargada, sí: la página se ejecuta completamente en tu navegador." },
      { q: "¿Por qué a veces la ruleta parece detenerse entre dos sectores?", a: "El puntero está en la parte superior; el sector que queda directamente debajo cuando termina la animación es el ganador. Redondeamos al centro del sector más cercano para que el cálculo sea inequívoco." },
    ],
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age.", "zh-hk": "計算準確年齡。", "zh-cn": "计算准确年龄。", es: "Calcula la edad exacta." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "計算一個數嘅百分比。", "zh-cn": "计算一个数的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "統計字數同字元。", "zh-cn": "统计字数和字符。", es: "Cuenta palabras y caracteres." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "計算兩日期間嘅日數。", "zh-cn": "计算两日期间的天数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies.", "zh-hk": "轉換 30 種以上貨幣。", "zh-cn": "转换 30 种以上货币。", es: "Convierte 30+ monedas." }, href: "/currency-converter", keywords: ["currency"] },
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算機", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Monthly payments and amortization.", "zh-hk": "每月還款同攤銷表。", "zh-cn": "每月还款和摊销表。", es: "Cuota mensual y amortización." }, href: "/loan-calculator", keywords: ["loan"] },
];

const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#84cc16", "#f97316", "#14b8a6", "#a855f7", "#22d3ee"];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/wheel-spinner";

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

export default function WheelSpinner() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [rawEntries, setRawEntries] = useState("Alice\nBob\nCharlie\nDana\nElla\nFrank");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const wheelRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const entries = useMemo(() => rawEntries.split("\n").map((s) => s.trim()).filter(Boolean), [rawEntries]);
  const content = LANGUAGES[locale];

  function spin() {
    if (entries.length < 2 || spinning) return;
    setWinner(null);
    const targetIndex = Math.floor(Math.random() * entries.length);
    const sliceAngle = 360 / entries.length;
    const targetMid = targetIndex * sliceAngle + sliceAngle / 2;
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = fullSpins * 360 + (360 - targetMid);
    setRotation((prev) => prev + finalRotation);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setWinner(entries[targetIndex]);
    }, 4500);
  }

  function removeWinner() {
    if (!winner) return;
    const lines = rawEntries.split("\n");
    const idx = lines.findIndex((l) => l.trim() === winner);
    if (idx >= 0) {
      lines.splice(idx, 1);
      setRawEntries(lines.join("\n"));
    }
    setWinner(null);
  }

  function shuffleEntries() {
    const arr = [...entries];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setRawEntries(arr.join("\n"));
  }

  const slices = useMemo(() => {
    if (entries.length === 0) return [];
    const cx = 150, cy = 150, r = 140;
    const sliceAngle = (2 * Math.PI) / entries.length;
    return entries.map((label, i) => {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = (i + 1) * sliceAngle - Math.PI / 2;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const path = entries.length === 1
        ? `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const textAngle = startAngle + sliceAngle / 2;
      const tx = cx + r * 0.65 * Math.cos(textAngle);
      const ty = cy + r * 0.65 * Math.sin(textAngle);
      const rotateDeg = (textAngle * 180) / Math.PI;
      return { label, path, fill: COLORS[i % COLORS.length], tx, ty, rotateDeg };
    });
  }, [entries]);

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><RotateCw className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
                <div className="relative mx-auto" style={{ width: 300, height: 300 }}>
                  <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: "28px solid #f59e0b" }} />
                  <svg
                    ref={wheelRef}
                    viewBox="0 0 300 300"
                    style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4.5s cubic-bezier(0.17, 0.67, 0.16, 1)" : "none" }}
                    className="drop-shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
                  >
                    <circle cx="150" cy="150" r="145" fill="#0a0a0a" />
                    {slices.map((s, i) => (
                      <g key={i}>
                        <path d={s.path} fill={s.fill} stroke="#0a0a0a" strokeWidth="2" />
                        <text x={s.tx} y={s.ty} fill="white" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${s.rotateDeg}, ${s.tx}, ${s.ty})`}>{s.label.slice(0, 12)}</text>
                      </g>
                    ))}
                    <circle cx="150" cy="150" r="20" fill="#0a0a0a" stroke="#10b981" strokeWidth="3" />
                  </svg>
                </div>

                <div className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm text-neutral-300">{content.entriesLabel}</span>
                    <textarea value={rawEntries} onChange={(e) => setRawEntries(e.target.value)} rows={9} className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none focus:border-emerald-400/60" />
                    <span className="text-xs text-white/45">{content.entriesHelp}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={spin} disabled={spinning || entries.length < 2} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-40">
                      {spinning ? content.spinning : content.spin}
                    </button>
                    <button onClick={shuffleEntries} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"><Shuffle className="mr-1 inline h-4 w-4" />{content.shuffle}</button>
                    <button onClick={() => { setRawEntries(""); setWinner(null); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"><Trash2 className="mr-1 inline h-4 w-4" />{content.reset}</button>
                  </div>
                  {entries.length < 2 && <p className="text-xs text-amber-300/80">{content.noEntries}</p>}
                </div>
              </div>

              {winner && (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{content.winner}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{winner}</p>
                  <button onClick={removeWinner} className="mt-3 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs text-white/80 transition hover:bg-white/20">{content.removeWinner}</button>
                </div>
              )}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white">
              <h2 className="text-2xl">{content.articleTitle}</h2>
              <p>{content.articleIntro}</p>

              <h3>{content.fairnessTitle}</h3>
              <p>{content.fairnessBody}</p>

              <h3>{content.whereUsedTitle}</h3>
              <ul>
                {content.whereUsedItems.map((item) => (
                  <li key={item.title}><strong>{item.title}</strong> {item.desc}</li>
                ))}
              </ul>

              <h3>{content.tipsTitle}</h3>
              <p>{content.tipsBody}</p>

              <h3>{content.faqTitle}</h3>
              {content.faq.map((item) => (
                <p key={item.q}><strong>{item.q}</strong> {item.a}</p>
              ))}
            </article>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.slice(0, 5).map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><RotateCw className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                {content.useCases.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((t) => t.title === name);
                  if (!match) return null;
                  return (
                    <a key={name} href={match.href} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </a>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
