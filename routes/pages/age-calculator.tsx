import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  dobLabel: string;
  tobLabel: string;
  asOfLabel: string;
  today: string;
  yearsLabel: string;
  monthsLabel: string;
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  tzLabel: string;
  liveNote: string;
  totalDays: string;
  nextBirthday: string;
  daysUntil: string;
  result: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
}> = {
  en: {
    name: "English",
    title: "Age Calculator",
    subtitle: "Calculate your exact age in years, months, and days.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: weight, day, invoice, url",
    dobLabel: "Date of Birth",
    tobLabel: "Time of birth (optional)",
    asOfLabel: "Age as of",
    today: "Now",
    yearsLabel: "Years",
    monthsLabel: "Months",
    daysLabel: "Days",
    hoursLabel: "Hours",
    minutesLabel: "Minutes",
    tzLabel: "Your time zone",
    liveNote: "Updating live",
    totalDays: "Total Days",
    nextBirthday: "Next Birthday",
    daysUntil: "days away",
    result: "Your age",
    sidebarTitle: "Use cases",
    sidebarSubtitle: "Find exact age for any birth date.",
    useCases: ["Birthday check", "Exact age for forms", "Age milestones"],
    suggestionsTitle: "You may also like",
    suggestions: ["Date Difference Calculator", "Business Day Calculator", "Percentage Calculator"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "年齡計算器",
    subtitle: "即時計算你的確實年齡，以年、月、日顯示。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：體積重量、工作日、發票",
    dobLabel: "出生日期",
    tobLabel: "出生時間（可選）",
    asOfLabel: "計算至",
    today: "現在",
    yearsLabel: "歲",
    monthsLabel: "月",
    daysLabel: "日",
    hoursLabel: "小時",
    minutesLabel: "分鐘",
    tzLabel: "你的時區",
    liveNote: "即時更新",
    totalDays: "總天數",
    nextBirthday: "下次生日",
    daysUntil: "天後",
    result: "你的年齡",
    sidebarTitle: "用途",
    sidebarSubtitle: "計算任何出生日期嘅準確年齡。",
    useCases: ["生日確認", "表格填寫年齡", "年齡里程碑"],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["日期差計算器", "工作日計算機", "百分比計算機"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "年龄计算器",
    subtitle: "即时计算你的确实年龄，以年、月、日显示。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：体积重量、工作日、发票",
    dobLabel: "出生日期",
    tobLabel: "出生时间（可选）",
    asOfLabel: "计算至",
    today: "现在",
    yearsLabel: "岁",
    monthsLabel: "月",
    daysLabel: "天",
    hoursLabel: "小时",
    minutesLabel: "分钟",
    tzLabel: "你的时区",
    liveNote: "实时更新",
    totalDays: "总天数",
    nextBirthday: "下次生日",
    daysUntil: "天后",
    result: "你的年龄",
    sidebarTitle: "用途",
    sidebarSubtitle: "计算任何出生日期的准确年龄。",
    useCases: ["生日确认", "表格填写年龄", "年龄里程碑"],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["日期差计算器", "工作日计算器", "百分比计算器"],
  },
  es: {
    name: "Español",
    title: "Calculadora de edad",
    subtitle: "Calcula tu edad exacta en años, meses y días.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: weight, day, invoice",
    dobLabel: "Fecha de nacimiento",
    tobLabel: "Hora de nacimiento (opcional)",
    asOfLabel: "Edad al",
    today: "Ahora",
    yearsLabel: "Años",
    monthsLabel: "Meses",
    daysLabel: "Días",
    hoursLabel: "Horas",
    minutesLabel: "Minutos",
    tzLabel: "Tu zona horaria",
    liveNote: "Actualización en vivo",
    totalDays: "Días totales",
    nextBirthday: "Próximo cumpleaños",
    daysUntil: "días",
    result: "Tu edad",
    sidebarTitle: "Casos de uso",
    sidebarSubtitle: "Encuentra la edad exacta para cualquier fecha de nacimiento.",
    useCases: ["Comprobar cumpleaños", "Edad exacta para formularios", "Hitos de edad"],
    suggestionsTitle: "Te puede interesar",
    suggestions: ["Calculadora de diferencia de fechas", "Calculadora de días hábiles", "Calculadora de porcentajes"],
  },
};

const TOOLS = [
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", es: "Calculadora de peso volumétrico" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "計運費時用嘅體積重量計數。", "zh-cn": "计算运费用的体积重量。", es: "Calcula el peso volumétrico de paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "計工作日，支援國家公眾假期同週末規則。", "zh-cn": "计算工作日，支持国家公众假期和周末规则。", es: "Cuenta días laborables con festivos." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "計兩個日期之間準確嘅日數、星期、月份同年份。", "zh-cn": "计算两个日期之间的天数、星期、月数和年数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number, or what percent X is of Y.", "zh-hk": "X% of Y 係幾多、X 係 Y 嘅幾多 percent、升跌幅。", "zh-cn": "Y 的 X%、X 是 Y 的多少%、百分比变化。", es: "Porcentaje de un número, o qué porcentaje es X de Y." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature, and more.", "zh-hk": "六大類量度轉換：長度、重量、溫度、容量、速度、面積。", "zh-cn": "六类度量转换：长度、重量、温度、容量、速度、面积。", es: "Convierte longitud, peso, temperatura y más." }, href: "/unit-converter", keywords: ["convert", "unit", "length"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words and characters instantly.", "zh-hk": "分析字數、字元數、句數、段數同預計閱讀時間。", "zh-cn": "分析字数、字符数、句数、段数和预计阅读时间。", es: "Cuenta palabras y caracteres al instante." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼", "zh-cn": "URL 编解码", es: "Codificador/decodificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "將網址入面嘅特殊字元轉做 % 編碼，反之亦然。", "zh-cn": "将网址里的特殊字符转为 % 编码，反之亦然。", es: "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
  { title: { en: "Rhyme Zone", "zh-hk": "押韻區", "zh-cn": "押韵区", es: "Zona de rimas" }, description: { en: "Find rhymes and synonyms.", "zh-hk": "搵押韻、近押韻、同義詞同相關詞。", "zh-cn": "找押韵、近押韵、同义词和相关词。", es: "Encuentra rimas y sinónimos." }, href: "/rhyme-zone", keywords: ["rhyme", "words"] },
];

function calcAge(dob: Date, asOf: Date) {
  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();
  let hours = asOf.getHours() - dob.getHours();
  let minutes = asOf.getMinutes() - dob.getMinutes();
  if (minutes < 0) { hours--; minutes += 60; }
  if (hours < 0) { days--; hours += 24; }
  if (days < 0) { months--; days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / 86400000);
  const today0 = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate());
  const nb = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  if (nb <= today0) nb.setFullYear(asOf.getFullYear() + 1);
  const daysUntilBirthday = Math.round((nb.getTime() - today0.getTime()) / 86400000);
  return { years, months, days, hours, minutes, totalDays, daysUntilBirthday };
}

// Local YYYY-MM-DD (the date inputs are local, so avoid UTC toISOString drift)
function localDateStr(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/age-calculator";

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

export default function AgeCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [dob, setDob] = useState("1990-01-01");
  const [tob, setTob] = useState("");
  const [asOf, setAsOf] = useState(() => localDateStr(new Date()));
  const [now, setNow] = useState(() => new Date());
  const [search, setSearch] = useState("");

  // Tick every second so hours/minutes stay live when "as of" is today.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: L.title,
        url: SITE_URL + PAGE_PATH,
        description: L.subtitle,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL },
      },
    });
  }, [locale]);

  const todayStr = localDateStr(now);
  const isLive = asOf === todayStr;

  const timeZone = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
  const tzOffset = useMemo(() => {
    const off = -now.getTimezoneOffset();
    const sign = off >= 0 ? "+" : "-";
    const h = Math.floor(Math.abs(off) / 60);
    const m = Math.abs(off) % 60;
    return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
  }, [now]);

  const age = useMemo(() => {
    if (!dob || !asOf) return null;
    const [by, bm, bd] = dob.split("-").map(Number);
    const [bh, bmin] = (tob || "00:00").split(":").map(Number);
    const birth = new Date(by, (bm || 1) - 1, bd || 1, bh || 0, bmin || 0);
    let asOfMoment: Date;
    if (isLive) {
      asOfMoment = now;
    } else {
      const [ay, am, ad] = asOf.split("-").map(Number);
      asOfMoment = new Date(ay, (am || 1) - 1, ad || 1, 0, 0, 0);
    }
    if (isNaN(birth.getTime()) || isNaN(asOfMoment.getTime()) || birth >= asOfMoment) return null;
    return calcAge(birth, asOfMoment);
  }, [dob, tob, asOf, now, isLive]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["體積重量", "工作日", "百分比", "URL"] : locale === "zh-cn" ? ["体积重量", "工作日", "百分比", "URL"] : locale === "es" ? ["peso", "día", "porcentaje", "url"] : ["weight", "day", "percent", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><CalendarDays className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">

              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.dobLabel}</span>
                  <div className="flex gap-2">
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                    <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} aria-label={content.tobLabel} title={content.tobLabel} className="w-32 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  </div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.asOfLabel}</span>
                  <div className="flex gap-2">
                    <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                    <button onClick={() => setAsOf(localDateStr(new Date()))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10 transition">{content.today}</button>
                  </div>
                </label>
              </div>
              {age && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p>
                    {isLive && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300/80"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{content.liveNote}</span>}
                  </div>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                    {([[content.yearsLabel, age.years],[content.monthsLabel, age.months],[content.daysLabel, age.days],[content.hoursLabel, age.hours],[content.minutesLabel, age.minutes],[content.totalDays, age.totalDays.toLocaleString()]] as [string,string|number][]).map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{String(value)}</p></div>
                    ))}
                  </div>
                  {timeZone && <p className="text-xs text-neutral-400">{content.tzLabel}: <span className="text-white/70">{timeZone} ({tzOffset})</span></p>}
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.nextBirthday}</p>
                    <p className="mt-1 text-lg font-medium text-emerald-200">{age.daysUntilBirthday} {content.daysUntil}</p>
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

          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><CalendarDays className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-neutral-300">{content.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
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
