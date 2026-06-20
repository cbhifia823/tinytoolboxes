import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Search, Cake } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  dateLabel: string;
  resultLabel: string;
  reserveAd: string;
  reserveAdSub: string;
  introTitle: string;
  introBody: string;
  useCasesTitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
}> = {
  en: {
    name: "English",
    title: "Famous Birthdays",
    subtitle: "Discover famous people born on any date.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: age, weight, date, url",
    dateLabel: "Date",
    resultLabel: "People born on this day",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "Drop your AdSense code here later without changing the layout.",
    introTitle: "What this page does",
    introBody: "Enter any date and see a curated list of famous people born on that day. It is a simple, boredom-proof page that fits the TinyToolboxes model very well.",
    useCasesTitle: "Use cases",
    useCases: ["Trivia and party questions.", "Birthday fun facts.", "Classroom or content inspiration."],
    suggestionsTitle: "You may also like",
    suggestions: ["Age Calculator", "Date Difference Calculator", "Business Day Calculator"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "名人出生日",
    subtitle: "睇下某一日出世嘅名人有邊啲。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：年齡、體積重量、日期、URL",
    dateLabel: "日期",
    resultLabel: "當日出生嘅名人",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼，版面唔使改。",
    introTitle: "呢頁做乜",
    introBody: "輸入任何一日，就可以見到一個精選名單，列出歷史上喺嗰日出生嘅名人。簡單、無聊、又幾實用。",
    useCasesTitle: "用途",
    useCases: ["小測驗同 party 問題。", "生日冷知識。", "教學或者內容靈感。"],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["年齡計算器", "日期差計算器", "工作日計算機"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "名人出生日",
    subtitle: "看看某一天出生的名人有哪些。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：年龄、体积重量、日期、URL",
    dateLabel: "日期",
    resultLabel: "当日出生的名人",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码，不用改版面。",
    introTitle: "这个页面做什么",
    introBody: "输入任意日期，就能看到一份精选名单，列出历史上在这一天出生的名人。简单、无聊、但很实用。",
    useCasesTitle: "用途",
    useCases: ["小测验和派对问题。", "生日冷知识。", "教学或内容灵感。"],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["年龄计算器", "日期差计算器", "工作日计算器"],
  },
  es: {
    name: "Español",
    title: "Cumpleaños famosos",
    subtitle: "Descubre personas famosas nacidas en cualquier fecha.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: age, weight, date, url",
    dateLabel: "Fecha",
    resultLabel: "Personas nacidas en este día",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante sin cambiar el diseño.",
    introTitle: "Qué hace esta página",
    introBody: "Introduce cualquier fecha y verás una lista seleccionada de personas famosas nacidas ese día. Es una página simple y muy útil para búsquedas de curiosidad.",
    useCasesTitle: "Casos de uso",
    useCases: ["Preguntas de trivia y fiestas.", "Datos curiosos de cumpleaños.", "Inspiración para contenido o clase."],
    suggestionsTitle: "También te puede interesar",
    suggestions: ["Calculadora de edad", "Calculadora de diferencia de fechas", "Calculadora de días hábiles"],
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, href: "/age-calculator" },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算器", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, href: "/date-difference-calculator" },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, href: "/business-day-calculator" },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, href: "/percentage-calculator" },
  { title: { en: "Wheel Spinner", "zh-hk": "幸運轉盤", "zh-cn": "幸运转盘", es: "Ruleta aleatoria" }, href: "/wheel-spinner" },
  { title: { en: "Rhyme Zone", "zh-hk": "押韻區", "zh-cn": "押韵区", es: "Zona de rimas" }, href: "/rhyme-zone" },
];

const POPULAR_FAMOUS_BIRTHDAYS: Record<string, { name: string; description: string; image?: string }[]> = {
  "01-01": [
    { name: "J. D. Salinger", description: "Author of The Catcher in the Rye." },
    { name: "E. M. Forster", description: "English novelist and essayist." },
  ],
  "02-14": [
    { name: "Simon Pegg", description: "Actor, writer, and comedian." },
    { name: "Freddie Highmore", description: "Actor known for The Good Doctor." },
  ],
  "03-14": [
    { name: "Albert Einstein", description: "Theoretical physicist." },
    { name: "Michael Caine", description: "British actor." },
  ],
  "07-04": [
    { name: "Neil Simon", description: "Playwright and screenwriter." },
    { name: "Malia Obama", description: "Former First Daughter." },
  ],
  "12-25": [
    { name: "Isaac Newton", description: "Scientist, mathematician, and physicist." },
    { name: "Sissy Spacek", description: "American actress and singer." },
  ],
};

const DEFAULT_RESULTS = [
  { name: "Albert Einstein", description: "Theoretical physicist." },
  { name: "Michael Caine", description: "British actor." },
  { name: "J. D. Salinger", description: "Author of The Catcher in the Rye." },
  { name: "Freddie Highmore", description: "Actor known for The Good Doctor." },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/famous-birthdays";

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

function toKey(date: Date) {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${m}-${d}`;
}

function fakeFetchBirthdays(dateKey: string) {
  return POPULAR_FAMOUS_BIRTHDAYS[dateKey] ?? DEFAULT_RESULTS;
}

export default function FamousBirthdays() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "EntertainmentApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const content = LANGUAGES[locale];
  const dateKey = useMemo(() => toKey(new Date(date)), [date]);
  const allResults = useMemo(() => fakeFetchBirthdays(dateKey), [dateKey]);
  const filteredResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allResults;
    return allResults.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(q));
  }, [allResults, search]);
  const hints = locale === "zh-hk" ? ["年齡", "日期", "名人", "生日"] : locale === "zh-cn" ? ["年龄", "日期", "名人", "生日"] : locale === "es" ? ["edad", "fecha", "famosos", "cumpleaños"] : ["age", "date", "famous", "birthday"];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Cake className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-white/60">{content.introTitle}</p><p className="mt-2 text-base leading-7 text-white/80">{content.introBody}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.dateLabel}</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.resultLabel}</p><p className="mt-2 text-2xl font-semibold text-white">{allResults.length} people</p></div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {filteredResults.map((item) => (
                  <article key={item.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-white/65">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{TOOLS.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>

          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Cake className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title[locale] === name);
                  return <a key={name} href={match?.href ?? "/"} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10"><span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" /></a>;
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
