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
}> = {
  en: {
    name: "English",
    title: "Wheel Spinner",
    subtitle: "Spin a random wheel to pick a name, choose a winner, or make a fair decision. Free, fast, and works on any device.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: rhyme, calorie, BMI, mortgage",
    reserveAd: "Google Ads space reserved",
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
  },
  "zh-hk": {
    name: "繁體中文",
    title: "輪盤抽選器",
    subtitle: "輸入名單，按一下就隨機抽出一個贏家。免費、夠快、手機電腦都用得。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：押韻、卡路里、BMI、按揭",
    reserveAd: "預留 Google 廣告位",
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
  },
  "zh-cn": {
    name: "简体中文",
    title: "转盘抽选器",
    subtitle: "输入名单，点一下就随机抽出一个赢家。免费、快速、手机电脑都能用。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：押韵、卡路里、BMI、按揭",
    reserveAd: "预留 Google 广告位",
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
  },
  es: {
    name: "Español",
    title: "Ruleta aleatoria",
    subtitle: "Gira una ruleta para elegir un nombre, un ganador o tomar una decisión justa. Gratis, rápido y funciona en cualquier dispositivo.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: rhyme, calorie, BMI, mortgage",
    reserveAd: "Espacio reservado para Google Ads",
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
              <p>A wheel spinner is a digital version of a physical prize wheel. You enter a list of options, the tool draws them as colored slices on a circle, and a randomization algorithm picks one when you spin. Behind the scenes, a uniform pseudo-random number generator selects an index between 0 and N-1 (where N is your entry count), then the visible wheel animates to land on that exact slice. The animation is just visual flair — the result is decided the moment you press spin.</p>

              <h3>What makes the pick truly fair</h3>
              <p>Modern browsers use cryptographically-seeded RNGs that are statistically indistinguishable from true randomness for everyday use. Each entry has exactly a 1/N probability of winning. This matters when fairness is being questioned — by a classroom, a contest audience, or family members deciding who buys dinner. Compared to "pick a number 1 to 10 in your head," a wheel spinner removes bias from people who unconsciously avoid certain numbers (5 and 7 are the most picked when humans are asked for a "random" digit between 1 and 10).</p>

              <h3>Where wheel spinners are actually used</h3>
              <ul>
                <li><strong>Giveaways and contests.</strong> Brands run Instagram or TikTok contests and need to publicly show how the winner was chosen. A wheel spinner with the entrant list is the most credible visual.</li>
                <li><strong>Classrooms.</strong> Teachers use spinners to call on students randomly, avoiding the tendency to always call on the same hands.</li>
                <li><strong>Team rituals.</strong> Daily standup speaking order, retrospective topic picking, who does the next demo.</li>
                <li><strong>Game nights.</strong> Pick who starts, pick teams, pick the next game.</li>
                <li><strong>Decision fatigue.</strong> "I can't decide between three restaurants" — let the wheel pick.</li>
              </ul>

              <h3>Tips for getting more out of a wheel spinner</h3>
              <p>If you want weighted picks (some options more likely than others), duplicate the names you want to favor — Bob × 3 in the list gives Bob three slices and a 3/N chance. After a winner is picked, click <em>Remove winner</em> to draw a second prize without that person being eligible again. For very long lists (200+ entries), the visible labels get tiny, but the math still works perfectly — pick the winner first then read it from the result card.</p>

              <h3>FAQ</h3>
              <p><strong>Is the wheel really random?</strong> Yes. We use <code>Math.random()</code>, which is a high-quality pseudo-random generator. For contests where audit logs matter, take a screen recording of the spin.</p>
              <p><strong>Can I save my list?</strong> The entries persist in this tab as long as you don't close it. We don't store data on a server — everything runs in your browser.</p>
              <p><strong>Can two people get the same name?</strong> Yes. Each name is treated as a separate entry even if the text is identical. If you want unique names, deduplicate your list first.</p>
              <p><strong>Does this work offline?</strong> Once loaded, yes — the page runs entirely in your browser.</p>
              <p><strong>Why does the wheel sometimes look like it stops between two slices?</strong> The pointer is at the top; whichever slice is directly under it when the animation ends is the winner. We round to the nearest slice center so the math is unambiguous.</p>
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
