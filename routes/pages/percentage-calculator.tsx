import { useEffect, useState, useMemo } from "react";
import { ArrowRight, BadgeDollarSign, Percent, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Percentage Calculator",
    subtitle: "Calculate percentages, find rates, and track changes.",
    mode1: "X% of Y",
    mode2: "X is what % of Y",
    mode3: "% change from X to Y",
    reserveAd: "Ad",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    adLabel: "Ad",
    reserveAdSub: "Sponsored",
    adBadge: "Ad",
    result: "Result",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "百分比計算器",
    subtitle: "計算百分比、找出比率及追蹤變化。",
    mode1: "Y 嘅 X% 係幾多",
    mode2: "X 佔 Y 嘅百分之幾",
    mode3: "X 到 Y 嘅升跌幅百分比",
    reserveAd: "廣告",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    adLabel: "廣告",
    reserveAdSub: "贊助",
    adBadge: "廣告",
    result: "結果",
  },
  "zh-cn": {
    name: "简体中文",
    title: "百分比计算器",
    subtitle: "计算百分比、找出比率及追踪变化。",
    mode1: "X% of Y",
    mode2: "X is what % of Y",
    mode3: "% change from X to Y",
    reserveAd: "广告",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    adLabel: "广告",
    reserveAdSub: "赞助",
    adBadge: "广告",
    result: "结果",
  },
  ja: {
    name: "日本語",
    title: "パーセンテージ計算機",
    subtitle: "パーセンテージを計算し、比率を見つけ、変化を追跡します。",
    mode1: "X% of Y",
    mode2: "X is what % of Y",
    mode3: "% change from X to Y",
    reserveAd: "広告",
    searchLabel: "検索",
    searchPlaceholder: "ツールを検索...",
    adLabel: "広告",
    reserveAdSub: "スポンサー",
    adBadge: "広告",
    result: "結果",
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", "ja": "年齢計算機" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", "ja": "出生日から正確な年齢を計算します。" }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差異計算器", "zh-cn": "日期差异计算器", "ja": "日付の差分計算機" }, description: { en: "Days between two dates.", "zh-hk": "兩個日期之間的日期。", "zh-cn": "两个日期之间的天数。", "ja": "二つの日付の間の日数。" }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", "ja": "単位変換機" }, description: { en: "Convert length, weight, temperature, and more.", "zh-hk": "轉換長度、重量、溫度等。", "zh-cn": "转换长度、重量、温度等。", "ja": "長さ、重量、温度などを変換します。" }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算器", "zh-cn": "体积重量计算器", "ja": "体積重量計算機" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "計算包裹的體積重量。", "zh-cn": "计算包裹的体积重量。", "ja": "小包の体積重量を計算します。" }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算器", "zh-cn": "工作日计算器", "ja": "営業日計算機" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期加上工作日。", "zh-cn": "为任何日期加上工作日。", "ja": "任意の日に営業日を加算します。" }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", "ja": "文字数計算機" }, description: { en: "Count words and characters instantly.", "zh-hk": "即時計算字數和字符。", "zh-cn": "即时计算字数和字符。", "ja": "文字と文字数を瞬時にカウントします。" }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", "ja": "URL エンコーダー / デコーダー" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", "ja": "URL をエンコードまたはデコードします。" }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/percentage-calculator";

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

export default function PercentageCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [mode, setMode] = useState<"pof" | "what" | "change">("pof");
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  const [search, setSearch] = useState("");

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

  const result = useMemo(() => {
    const av = parseFloat(a), bv = parseFloat(b);
    if (isNaN(av) || isNaN(bv)) return null;
    if (mode === "pof") return (av / 100) * bv;
    if (mode === "what") return bv === 0 ? null : (av / bv) * 100;
    if (mode === "change") return bv === 0 ? null : ((bv - av) / Math.abs(av)) * 100;
    return null;
  }, [a, b, mode]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "工作日", "日期", "URL"] : locale === "zh-cn" ? ["年龄", "工作日", "日期", "URL"] : ["age", "date", "weight", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const modes: { key: "pof" | "what" | "change"; label: string }[] = [
    { key: "pof", label: content.mode1 },
    { key: "what", label: content.mode2 },
    { key: "change", label: content.mode3 },
  ];

  const aLabel = mode === "pof" ? "%" : mode === "what" ? (locale === "en" ? "X" : "X") : (locale === "en" ? "From" : "X");
  const bLabel = mode === "pof" ? (locale === "en" ? "Value" : "Y") : mode === "what" ? (locale === "en" ? "Total" : "Y") : (locale === "en" ? "To" : "Y");

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Percent className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="flex flex-wrap gap-2">{modes.map((m) => <button key={m.key} onClick={() => setMode(m.key)} className={`rounded-full border px-4 py-2 text-sm transition ${mode === m.key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{m.label}</button>)}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{aLabel}</span><input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{bLabel}</span><input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
              </div>
              {result !== null && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.result}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">
                    {mode === "pof" ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    {mode === "pof" && `${a}% of ${b} = ${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}`}
                    {mode === "what" && `${a} is ${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}% of ${b}`}
                    {mode === "change" && `${a} → ${b} = ${result >= 0 ? "+" : ""}${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
                  </p>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">What is a Percentage?</h2>
                <p className="mt-3 leading-7">A percentage is a number expressed as a fraction of 100. The word comes from the Latin "per centum," meaning "by the hundred." When you say 45%, you mean 45 out of every 100 — or equivalently, the ratio 45/100 = 0.45. The percent sign (%) evolved from the Italian abbreviation "per cento," which was shortened by scribes over centuries until the words disappeared and only the stylized slashes and circles remained.</p>
                <p className="mt-3 leading-7">Merchants in ancient Rome already used fractions of 100 for calculating interest on loans, long before the modern percent sign existed. The concept became widespread during the Renaissance as double-entry bookkeeping spread through European trade networks. By expressing values as parts of a hundred, merchants could compare ratios across transactions of vastly different sizes — whether negotiating the sale of a few bolts of cloth or financing an entire trading voyage.</p>
                <p className="mt-3 leading-7">Today, percentages are the universal language of comparison. They allow you to say "our defect rate fell from 4% to 1%" and immediately convey magnitude, or to state "inflation is running at 3.2% annually" in a way that requires no further context. A raw number like "we saved $1,200" means little without knowing whether the total was $1,500 or $1,200,000 — the percentage tells you everything you need to know.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">The Three Most Useful Percentage Calculations</h2>
                <p className="mt-3 leading-7">Almost every practical percentage problem falls into one of three categories. This calculator handles all three.</p>

                <div className="mt-5 space-y-6">
                  <div>
                    <h3 className="font-semibold text-white">Mode 1: X% of Y — finding a portion</h3>
                    <div className="mt-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-3 font-mono text-emerald-100 text-sm">Result = (X ÷ 100) × Y</div>
                    <p className="mt-3 leading-7 text-white/70">This is the most common calculation. You know the percentage rate and the whole, and you want the corresponding amount. Examples:</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>15% tip on an $80 restaurant bill: (15 ÷ 100) × 80 = <strong className="text-white">$12.00</strong></li>
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>20% discount on a $150 jacket: (20 ÷ 100) × 150 = $30 off, so you pay <strong className="text-white">$120</strong></li>
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>6% sales tax on a $240 appliance: (6 ÷ 100) × 240 = <strong className="text-white">$14.40</strong> in tax</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Mode 2: X is what % of Y — finding the rate</h3>
                    <div className="mt-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-3 font-mono text-emerald-100 text-sm">Result = (X ÷ Y) × 100</div>
                    <p className="mt-3 leading-7 text-white/70">You know the part and the whole, and you want to express the relationship as a percentage. Examples:</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>45 correct answers out of 60 on a test: (45 ÷ 60) × 100 = <strong className="text-white">75%</strong></li>
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>3 defective units out of 200 produced: (3 ÷ 200) × 100 = <strong className="text-white">1.5% defect rate</strong></li>
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>$18,000 saved toward a $75,000 goal: (18,000 ÷ 75,000) × 100 = <strong className="text-white">24% of the way there</strong></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">Mode 3: % change from X to Y — finding growth or decline</h3>
                    <div className="mt-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-3 font-mono text-emerald-100 text-sm">Result = ((Y − X) ÷ |X|) × 100</div>
                    <p className="mt-3 leading-7 text-white/70">You know the starting value and the ending value, and you want to express the change as a percentage. The absolute value of X in the denominator handles negative starting values correctly. Examples:</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Revenue grew from $450,000 to $540,000: ((540k − 450k) ÷ 450k) × 100 = <strong className="text-white">+20% growth</strong></li>
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Stock price fell from $85 to $51: ((51 − 85) ÷ 85) × 100 = <strong className="text-white">−40% decline</strong></li>
                      <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Website traffic dropped from 12,000 to 9,600 visits: ((9,600 − 12,000) ÷ 12,000) × 100 = <strong className="text-white">−20%</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Real-World Applications</h2>
                <p className="mt-3 leading-7">Percentages appear in nearly every area of daily financial life. Here are some concrete examples that illustrate just how often the calculation comes up:</p>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Sales tax.</strong> New York City has one of the highest combined sales tax rates in the US at 8.875%. On a $100 purchase, that adds $8.88 in tax for a total of $108.88. On a $1,200 laptop, the tax alone is $106.50.</li>
                  <li><strong className="text-white">Value Added Tax (VAT).</strong> The standard VAT rate in the United Kingdom is 20%. A business buying £200 worth of supplies pays £40 in VAT, for a total of £240. VAT-registered businesses can reclaim the input VAT, but consumers cannot.</li>
                  <li><strong className="text-white">Tipping.</strong> An 18% tip on a $65 restaurant bill is (18 ÷ 100) × 65 = $11.70. A 20% tip on the same bill is $13.00. Knowing the math lets you tip accurately without relying on tip calculators printed on receipts.</li>
                  <li><strong className="text-white">Interest rates.</strong> A credit card charging 2% monthly interest on a $5,000 balance costs (2 ÷ 100) × 5,000 = $100 per month in interest — which is $1,200 per year, or an annual rate of 24%.</li>
                  <li><strong className="text-white">Exam and performance scores.</strong> Achieving 78 marks out of 120 is (78 ÷ 120) × 100 = 65%. Whether that is a passing grade depends on the institution's threshold, but the percentage immediately contextualizes the raw score.</li>
                  <li><strong className="text-white">Body fat percentage.</strong> Body composition assessments report results as percentages because body fat as an absolute weight is meaningless without context. A body fat percentage of 18% means 18 kg of fat per 100 kg of body weight, regardless of the person's total weight.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Common Percentage Mistakes</h2>
                <p className="mt-3 leading-7">Even people who are comfortable with numbers make these errors regularly. Understanding them prevents costly miscalculations.</p>
                <ul className="mt-3 space-y-4 text-white/70">
                  <li>
                    <strong className="text-white">Confusing percentage points with percentages.</strong> If an interest rate rises from 2% to 3%, it has increased by 1 percentage point — but it has increased by 50% in relative terms ((3−2)÷2 × 100 = 50%). These two statements sound very different and mean very different things. Financial reporting often exploits this ambiguity intentionally.
                  </li>
                  <li>
                    <strong className="text-white">Mixing up "percent of" and "percent more."</strong> "50% more than 100" means 100 + 50% of 100 = 100 + 50 = 150. But "150% of 100" also equals 150. The confusion arises in phrases like "prices are 150% higher" — that would mean prices tripled (100 + 150 = 250), not increased by half. Always check whether the phrase means "X% of" or "X% more than."
                  </li>
                  <li>
                    <strong className="text-white">Assuming successive discounts add up.</strong> A 20% discount followed by a 10% discount does not equal a 30% discount. Starting with $100: after 20% off you have $80, then 10% off $80 is $8, leaving $72. The combined discount is 28%, not 30%. The two discounts compound: (1 − 0.20) × (1 − 0.10) = 0.80 × 0.90 = 0.72, a 28% total reduction.
                  </li>
                  <li>
                    <strong className="text-white">Reversing the percentage change direction.</strong> If a price drops 50% and then rises 50%, you do not return to the original price. A $100 item drops to $50 (−50%), then rises 50% to $75. You are still 25% below the starting point. Percentage changes are not symmetric around zero.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between percent and percentage points?</h3>
                    <p className="mt-1 text-white/70">A percent is a relative measure (X per 100), while a percentage point is an absolute arithmetic difference between two percentages. If unemployment falls from 6% to 4%, it fell by 2 percentage points, but it fell by 33.3% in relative terms. Financial news often reports percentage-point changes when covering interest rates or polling data, so it is important to read carefully.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How do I calculate a percentage increase or decrease?</h3>
                    <p className="mt-1 text-white/70">Use the percentage change formula: ((New Value − Old Value) ÷ Old Value) × 100. If the result is positive, it is an increase; if negative, it is a decrease. For example, a salary increase from $50,000 to $55,000 is ((55,000 − 50,000) ÷ 50,000) × 100 = 10% increase. Use the "% change from X to Y" mode in this calculator to compute this automatically.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How does compound growth differ from a simple percentage?</h3>
                    <p className="mt-1 text-white/70">A simple percentage increase applies to the original amount each period. A 5% simple return on $1,000 for 3 years adds $50 per year for a total of $1,150. Compound growth applies the percentage to the new total each period: after year 1 you have $1,050, after year 2 you have $1,102.50, after year 3 you have $1,157.63. The difference seems small over 3 years but becomes enormous over decades, which is why compounding is called the "eighth wonder of the world" in investing circles.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What does 200% mean?</h3>
                    <p className="mt-1 text-white/70">200% of a number means double that number. 200% of $50 = (200 ÷ 100) × 50 = $100. However, "200% more than $50" would mean $50 + $100 = $150, because "more than" adds the percentage to the original. So "200% of $50" = $100, while "$50 plus 200% more" = $150. The phrasing matters significantly.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How do I calculate the original price before a discount?</h3>
                    <p className="mt-1 text-white/70">If you know the discounted price and the discount rate, divide the discounted price by (1 − discount rate). For example, an item costs $68 after a 15% discount. The original price was $68 ÷ (1 − 0.15) = $68 ÷ 0.85 = $80. A common mistake is to add 15% back to $68, which gives $78.20 — that is wrong because 15% of $80 is $12, not 15% of $68.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is a basis point?</h3>
                    <p className="mt-1 text-white/70">A basis point (bps) is one hundredth of a percentage point — that is, 0.01%. Basis points are used in finance when discussing small changes in interest rates, bond yields, and fees, where saying "25 basis points" is more precise and less ambiguous than saying "0.25 percentage points" or "a quarter of a percent." When a central bank raises its benchmark rate by 50 basis points, it means the rate has increased by 0.50 percentage points.</p>
                  </div>
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Percent className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Use cases</h2><p className="text-sm text-neutral-300">Three ways to work with percentages.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Discounts and sale prices.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Tax, tip, and commission calculations.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Year-on-year growth and change tracking.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
