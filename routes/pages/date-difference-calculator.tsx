import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, CalendarRange, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Date Difference Calculator",
    subtitle: "Calculate the number of days, weeks, months, and years between two dates.",
    reserveAd: "Ad",
    startLabel: "Start date",
    endLabel: "End date",
    today: "Today",
    excludeWeekends: "Exclude weekends",
    result: "Result",
    daysLabel: "Days",
    weeksLabel: "Weeks",
    monthsLabel: "Months",
    yearsLabel: "Years",
    workingDays: "Working days",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    adLabel: "Ad",
    reserveAdSub: "Sponsored",
    adBadge: "Ad",
    useCasesTitle: "Use cases",
    useCasesSubtitle: "Common scenarios for date difference calculation",
    useCases: ["Project planning", "Legal deadlines", "Event countdowns"],
    suggestionsTitle: "You may also like",
    suggestionsSubtitle: "Related tools",
    suggestions: ["Age Calculator", "Business Day Calculator", "Invoice Due Date Calculator"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "日期差計算器",
    subtitle: "計算兩個日期之間的日數、週數、月數和年數。",
    reserveAd: "廣告",
    startLabel: "開始日期",
    endLabel: "結束日期",
    today: "今天",
    excludeWeekends: "排除週末",
    result: "結果",
    daysLabel: "日數",
    weeksLabel: "週數",
    monthsLabel: "月數",
    yearsLabel: "年數",
    workingDays: "工作日",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    adLabel: "廣告",
    reserveAdSub: "贊助",
    adBadge: "廣告",
    useCasesTitle: "用途",
    useCasesSubtitle: "日期差計算的常見場景",
    useCases: ["項目規劃", "法律限期", "活動倒數"],
    suggestionsTitle: "你可能會喜歡",
    suggestionsSubtitle: "相關工具",
    suggestions: ["年齡計算機", "工作日計算機", "發票到期日計算機"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "日期差计算器",
    subtitle: "计算两个日期之间的天数、周数、月数和年数。",
    reserveAd: "广告",
    startLabel: "开始日期",
    endLabel: "结束日期",
    today: "今天",
    excludeWeekends: "排除周末",
    result: "结果",
    daysLabel: "天数",
    weeksLabel: "周数",
    monthsLabel: "月数",
    yearsLabel: "年数",
    workingDays: "工作日",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    adLabel: "广告",
    reserveAdSub: "赞助",
    adBadge: "广告",
    useCasesTitle: "用途",
    useCasesSubtitle: "日期差计算的常见场景",
    useCases: ["项目规划", "法律期限", "活动倒计时"],
    suggestionsTitle: "你可能会喜欢",
    suggestionsSubtitle: "相关工具",
    suggestions: ["年龄计算器", "工作日计算器", "发票到期日计算器"],
  },
  es: {
    name: "Español",
    title: "Calculadora de Diferencia de Fechas",
    subtitle: "Calcula el número de días, semanas, meses y años entre dos fechas.",
    reserveAd: "Anuncio",
    startLabel: "Fecha de inicio",
    endLabel: "Fecha de fin",
    today: "Hoy",
    excludeWeekends: "Excluir fines de semana",
    result: "Resultado",
    daysLabel: "Días",
    weeksLabel: "Semanas",
    monthsLabel: "Meses",
    yearsLabel: "Años",
    workingDays: "Días hábiles",
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar herramientas...",
    adLabel: "Anuncio",
    reserveAdSub: "Patrocinado",
    adBadge: "Anuncio",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Escenarios comunes para calcular diferencias de fechas",
    useCases: ["Planificación de proyectos", "Fechas límite", "Cuentas regresivas"],
    suggestionsTitle: "Te puede interesar",
    suggestionsSubtitle: "Herramientas relacionadas",
    suggestions: ["Calculadora de edad", "Calculadora de días hábiles", "Calculadora de vencimiento"],
  },
};

const RIGHT_COPY = {
  en: {
    suggestionsTitle: "You may also like",
    suggestions: ["Age Calculator", "Business Day Calculator", "Invoice Due Date Calculator"],
  },
  "zh-hk": {
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["年齡計算機", "工作日計算機", "發票到期日計算機"],
  },
  "zh-cn": {
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["年龄计算器", "工作日计算器", "发票到期日计算器"],
  },
  es: {
    suggestionsTitle: "Te puede interesar",
    suggestions: ["Calculadora de edad", "Calculadora de días hábiles", "Calculadora de vencimiento"],
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", "es": "Calculadora de edad" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", "es": "Calcula la edad exacta a partir de una fecha de nacimiento." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", "es": "Calculadora de peso volumétrico" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "計算包裹的體積重量。", "zh-cn": "计算包裹的体积重量。", "es": "Calcula el peso volumétrico para paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", "es": "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期增加工作日。", "zh-cn": "为任何日期增加工作日。", "es": "Añade días hábiles a cualquier fecha." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", "es": "Calculadora de porcentaje" }, description: { en: "Percentage of a number, or what percent X is of Y.", "zh-hk": "數字的百分比，或 X 佔 Y 的百分比。", "zh-cn": "数字的百分比，或 X 占 Y 的百分比。", "es": "Porcentaje de un número, o qué porcentaje X es de Y." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", "es": "Convertidor de unidades" }, description: { en: "Convert length, weight, temperature, and more.", "zh-hk": "轉換長度、重量、溫度等。", "zh-cn": "转换长度、重量、温度等。", "es": "Convierte longitud, peso, temperatura, y más." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算機", "zh-cn": "字数计算器", "es": "Contador de palabras" }, description: { en: "Count words and characters instantly.", "zh-hk": "即時計算字數和字符。", "zh-cn": "即时计算字数和字符。", "es": "Cuenta palabras y caracteres al instante." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", "es": "Codificador / decodificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", "es": "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

function countWorkingDays(start: Date, end: Date) {
  let count = 0;
  const cur = new Date(start);
  while (cur < end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/date-difference-calculator";

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

export default function DateDifferenceCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [start, setStart] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().split("T")[0]; });
  const [end, setEnd] = useState(() => new Date().toISOString().split("T")[0]);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
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

  const diff = useMemo(() => {
    if (!start || !end) return null;
    const s = new Date(start), e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const [from, to] = s <= e ? [s, e] : [e, s];
    const totalDays = Math.floor((to.getTime() - from.getTime()) / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    const years = to.getFullYear() - from.getFullYear();
    const workingDays = countWorkingDays(from, to);
    return { totalDays, weeks, months, years, workingDays };
  }, [start, end]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "工作日", "百分比", "URL"] : locale === "zh-cn" ? ["年龄", "工作日", "百分比", "URL"] : ["age", "day", "percent", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><CalendarRange className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.startLabel}</span>
                  <div className="flex gap-2"><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.endLabel}</span>
                  <div className="flex gap-2"><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /><button onClick={() => setEnd(new Date().toISOString().split("T")[0])} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10 transition">{content.today}</button></div>
                </label>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setExcludeWeekends(!excludeWeekends)} className={`relative h-6 w-11 rounded-full transition ${excludeWeekends ? "bg-emerald-500" : "bg-white/10"}`}>
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${excludeWeekends ? "left-6" : "left-1"}`} />
                </div>
                <span className="text-sm text-neutral-300">{content.excludeWeekends}</span>
              </label>

              {diff && (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {([[content.daysLabel, excludeWeekends ? diff.workingDays : diff.totalDays],[content.weeksLabel, diff.weeks],[content.monthsLabel, diff.months],[content.yearsLabel, diff.years]] as [string,number][]).map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label === content.daysLabel && excludeWeekends ? content.workingDays : label}</p><p className="mt-2 text-2xl font-semibold text-white">{value.toLocaleString()}</p></div>
                    ))}
                  </div>
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
                <h2 className="text-2xl font-bold text-white">Why Date Difference Calculation is Tricky</h2>
                <p className="mt-3 leading-7">Calculating the number of days between two dates seems like simple arithmetic — but it hides surprising complexity. The most fundamental challenge is that months have different lengths: January has 31 days, February has 28 or 29, April has 30, and so on. A naive approach of multiplying months by 30 will produce errors that compound over longer date ranges.</p>
                <p className="mt-3 leading-7">Leap years add another layer of complexity. A year is a leap year if it is divisible by 4 — except that century years (1900, 2100) are not leap years unless they are also divisible by 400 (making 2000 a leap year but 2100 not). This means that calculating "how many days from February 28, 1900 to February 28, 1904" requires knowing that 1900 was not a leap year despite being divisible by 4.</p>
                <p className="mt-3 leading-7">Different calendar systems add a further dimension of difficulty. The Gregorian calendar used internationally today replaced the Julian calendar in most of Europe during the 16th–18th centuries. Dates before those transitions differ between the two systems. Lunar calendars (used for religious and cultural observances in Islamic, Hebrew, Chinese, and Hindu traditions) add months differently and cannot be converted to Gregorian dates with simple arithmetic.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">How Date Differences are Calculated</h2>
                <p className="mt-3 leading-7">Modern date-difference calculators use a common approach: convert both dates to a numeric representation based on days elapsed since a fixed reference point, subtract the two numbers, then convert back to a human-readable format.</p>
                <p className="mt-3 leading-7">The most widely used reference point in software is the Unix epoch: midnight on January 1, 1970 (UTC). Every moment in time can be expressed as the number of seconds (or milliseconds) since that point. To find the number of days between two dates, subtract their epoch values and divide by 86,400 (the number of seconds in a day).</p>
                <p className="mt-3 leading-7">When you need a breakdown in years, months, and days — rather than just total days — the algorithm becomes more involved. The standard approach subtracts year-by-year first, then month-by-month, adjusting for the fact that months have different lengths. For example, one month after January 31 is February 28 (or 29 in a leap year), not March 3. This "end-of-month" adjustment is a frequent source of discrepancy between different date calculators.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Practical Uses for Date Difference</h2>
                <p className="mt-3 leading-7">Knowing the exact number of days between two dates has a wide range of real-world applications across personal, professional, and medical contexts:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">Project management:</strong> Calculate elapsed time from project kick-off to today, or total duration from start to deadline, to track progress against milestones.</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">Age calculation:</strong> Determine exact age in years, months, and days from a birth date to today — or between any two dates.</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">Loan and lease terms:</strong> Calculate the exact number of days in a loan period for interest accrual, or verify that a lease runs for the contracted number of months.</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">Event countdowns:</strong> Count down the days until a wedding, product launch, exam, or holiday.</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">Anniversaries:</strong> Find how many days have passed since a significant event — a business founding date, a sobriety milestone, or a relationship anniversary.</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">Medical and health:</strong> Pregnancy due date calculation uses 280 days (40 weeks) from the last menstrual period. Medication courses, recovery timelines, and follow-up appointments are often scheduled a specific number of days from a reference date.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Working Days vs Calendar Days</h2>
                <p className="mt-3 leading-7">One of the most important distinctions in date calculations is whether you are counting calendar days or working days (also called business days). The difference is significant: 30 calendar days span roughly 4 weeks and 2 days, while 30 working days span approximately 6 calendar weeks once weekends are excluded.</p>
                <p className="mt-3 leading-7">Commercial contracts typically use calendar days for payment terms (Net 30, Net 60) because they create a predictable, fixed date that both parties can calculate independently without needing to agree on which days are holidays. Service-level agreements (SLAs), on the other hand, frequently use business days because it is unreasonable to require a vendor to deliver work on a weekend or a public holiday.</p>
                <p className="mt-3 leading-7">For international date notation, ISO 8601 is the globally recognised standard: dates are written as YYYY-MM-DD. This format is unambiguous across all locales, sorts correctly as text, and is the format used in databases, APIs, and software systems worldwide. The ISO 8601 standard also defines durations (P1Y2M3D = 1 year, 2 months, 3 days) and time intervals, making it the most comprehensive framework for date and time communication.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Date Formats Around the World</h2>
                <p className="mt-3 leading-7">Date formatting conventions vary dramatically by country and region, and the ambiguity they create causes real-world errors in contracts, travel bookings, medical records, and software systems.</p>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">MM/DD/YYYY (United States):</strong> The month-first format used in the US is unique among major economies. January 2 is written as 01/02/2024.</li>
                  <li><strong className="text-white">DD/MM/YYYY (UK, Australia, most of Europe, India, Latin America):</strong> The day-first format is far more widespread globally. The same date, February 1, would be written as 01/02/2024 — identical to the US notation for January 2.</li>
                  <li><strong className="text-white">YYYY/MM/DD (ISO 8601, China, Japan, Korea):</strong> The year-first format is used in East Asia and is also the basis for ISO 8601. January 2, 2024 is 2024/01/02 or 2024-01-02 in ISO notation.</li>
                </ul>
                <p className="mt-4 leading-7">The ambiguity of formats like 01/02/2024 is dangerous — it means January 2 in the US and February 1 in the UK. Whenever writing a date for an international audience, use the YYYY-MM-DD format or spell out the month name (e.g. "2 January 2024") to eliminate any possibility of misreading.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">Does this calculator include or exclude the start and end date?</h3>
                    <p className="mt-1 text-white/70">This calculator counts the total number of days elapsed between the two dates. The end date is excluded from the count — meaning the number shown represents complete days that have passed. For example, from January 1 to January 2 is 1 day, not 2. This is the most common convention and matches how most software systems and financial contracts calculate date differences.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How many days are in a year?</h3>
                    <p className="mt-1 text-white/70">A standard year has 365 days. A leap year has 366 days, occurring every four years (with exceptions for century years not divisible by 400). For long-range astronomical calculations, the average Gregorian year is 365.2425 days — often approximated as 365.25 days for rough purposes. When calculating an exact number of years between two specific dates, the actual calendar must be used to account for leap years precisely.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between days elapsed and days remaining?</h3>
                    <p className="mt-1 text-white/70">Days elapsed is the count of days from a past date to today (or another reference date). Days remaining is the count of days from today until a future date. Both use the same underlying subtraction, but the direction and framing are different. A project that started 45 days ago and is due in 15 days has 45 elapsed days and 15 remaining days in a total project duration of 60 days.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How do I calculate exactly how many weeks are between two dates?</h3>
                    <p className="mt-1 text-white/70">Divide the total number of days by 7. The whole number part of the result is the number of complete weeks. The remainder tells you the extra days. For example, 45 days is 6 weeks and 3 days (45 ÷ 7 = 6 remainder 3). If you want to know whether two dates are exactly a whole number of weeks apart, check that the day of the week is the same for both dates.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is the Unix epoch / Unix timestamp?</h3>
                    <p className="mt-1 text-white/70">The Unix epoch is the reference point used in most software systems for representing time: midnight on January 1, 1970, Coordinated Universal Time (UTC). A Unix timestamp is the number of seconds that have elapsed since that moment. For example, January 1, 2024 00:00:00 UTC is Unix timestamp 1704067200. This integer representation makes date arithmetic extremely fast for computers, since calculating the difference between two timestamps is just a single subtraction operation.</p>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><CalendarRange className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2><p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{RIGHT_COPY[locale].suggestionsTitle}</h3>
              <p className="mt-1 text-xs text-white/55">{RIGHT_COPY[locale].suggestionsSubtitle}</p>
              <div className="mt-3 space-y-2">
                {RIGHT_COPY[locale].suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title[locale] === name);
                  return (
                    <button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
