import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, BadgeDollarSign, DollarSign, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Currency Converter",
    subtitle: "Convert between 30+ currencies with live exchange rates.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: age, percent, unit, date",
    reserveAd: "Google Ads space reserved",
    amountLabel: "Amount",
    fromLabel: "From",
    toLabel: "To",
    loading: "Loading rates…",
    error: "Could not load rates. Try again.",
    lastUpdated: "Rates updated",
    result: "Result",
    popular: "Popular pairs",
    useCasesTitle: "Use cases",
    useCasesSubtitle: "Everyday conversion jobs.",
    useCases: ["Travel and shopping conversions.", "International invoicing and payroll.", "Cross-border payments and pricing."],
    suggestionsTitle: "You may also like",
    suggestionsSubtitle: "Other tiny tools that pair well with currency work.",
    suggestions: ["Loan Calculator", "Percentage Calculator", "Unit Converter"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "貨幣換算器",
    subtitle: "即時換算 30+ 種貨幣，使用最新匯率。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：年齡、百分比、單位",
    reserveAd: "預留 Google 廣告位",
    amountLabel: "金額",
    fromLabel: "從",
    toLabel: "換算到",
    loading: "載入匯率中…",
    error: "無法載入匯率，請重試。",
    lastUpdated: "匯率更新時間",
    result: "結果",
    popular: "常用貨幣對",
    useCasesTitle: "使用情境",
    useCasesSubtitle: "日常換算工作。",
    useCases: ["旅行同網購換算。", "國際發票同薪酬。", "跨境付款同報價。"],
    suggestionsTitle: "你可能會喜歡",
    suggestionsSubtitle: "同貨幣工作配搭得好嘅工具。",
    suggestions: ["貸款計算器", "百分比計算器", "單位換算器"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "货币换算器",
    subtitle: "实时换算 30+ 种货币，使用最新汇率。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：年龄、百分比、单位",
    reserveAd: "预留 Google 广告位",
    amountLabel: "金额",
    fromLabel: "从",
    toLabel: "换算到",
    loading: "加载汇率中…",
    error: "无法加载汇率，请重试。",
    lastUpdated: "汇率更新时间",
    result: "结果",
    popular: "常用货币对",
    useCasesTitle: "使用场景",
    useCasesSubtitle: "日常换算工作。",
    useCases: ["旅行和网购换算。", "国际发票和薪酬。", "跨境付款和报价。"],
    suggestionsTitle: "你可能会喜欢",
    suggestionsSubtitle: "和货币工作很搭的工具。",
    suggestions: ["贷款计算器", "百分比计算器", "单位换算器"],
  },
  es: {
    name: "Español",
    title: "Conversor de divisas",
    subtitle: "Convierte entre 30+ divisas con tasas de cambio en tiempo real.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: age, percent, unit",
    reserveAd: "Espacio reservado para Google Ads",
    amountLabel: "Cantidad",
    fromLabel: "De",
    toLabel: "A",
    loading: "Cargando tasas…",
    error: "No se pudieron cargar las tasas.",
    lastUpdated: "Tasas actualizadas",
    result: "Resultado",
    popular: "Pares populares",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Tareas de conversión diarias.",
    useCases: ["Viajes y compras.", "Facturación y nómina internacional.", "Pagos y precios transfronterizos."],
    suggestionsTitle: "Te puede interesar",
    suggestionsSubtitle: "Otras herramientas que encajan bien aquí.",
    suggestions: ["Calculadora de préstamos", "Calculadora de porcentajes", "Conversor de unidades"],
  },
};

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" }, { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" }, { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" }, { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" }, { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" }, { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" }, { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" }, { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "THB", name: "Thai Baht", symbol: "฿" }, { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" }, { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" }, { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" }, { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" }, { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" }, { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "ZAR", name: "South African Rand", symbol: "R" }, { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" }, { code: "PLN", name: "Polish Zloty", symbol: "zł" },
];

const POPULAR_PAIRS = [["USD","EUR"],["USD","GBP"],["USD","JPY"],["USD","HKD"],["EUR","GBP"],["GBP","JPY"]];

const TOOLS = [
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算器", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: "Calculate monthly payments and total interest.", href: "/loan-calculator", keywords: ["loan", "mortgage", "finance"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: "Percentage of a number.", href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位換算器", "zh-cn": "单位换算器", es: "Conversor de unidades" }, description: "Convert length, weight, temperature.", href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: "Calculate exact age from a birth date.", href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算器", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: "Days between two dates.", href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Business Day Calculator", "zh-hk": "營業日計算器", "zh-cn": "工作日计算器", es: "Calculadora de días laborables" }, description: "Add working days to any date.", href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", es: "Contador de palabras" }, description: "Count words and characters.", href: "/word-counter", keywords: ["word", "text"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/currency-converter";

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

export default function CurrencyConverter() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("HKD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesTime, setRatesTime] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => { setRates(data.rates); setRatesTime(data.time_last_update_utc || null); setLoadError(false); })
      .catch(() => setLoadError(true));
  }, []);

  const result = useMemo(() => {
    if (!rates) return null;
    const v = parseFloat(amount);
    if (isNaN(v)) return null;
    const fromRate = rates[from], toRate = rates[to];
    if (!fromRate || !toRate) return null;
    return (v / fromRate) * toRate;
  }, [amount, from, to, rates]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "百分比", "單位", "URL"] : locale === "zh-cn" ? ["年龄", "百分比", "单位", "URL"] : ["age", "percent", "unit", "loan"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const toCurrency = CURRENCIES.find((c) => c.code === to);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><DollarSign className="h-5 w-5 text-emerald-300" /></div>
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
              {!rates && !loadError && <p className="text-sm text-white/55">{content.loading}</p>}
              {loadError && <p className="text-sm text-red-400">{content.error}</p>}
              {ratesTime && <p className="text-xs text-white/35">{content.lastUpdated}: {ratesTime}</p>}

              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.amountLabel}</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.fromLabel}</span>
                  <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
                  </select>
                </label>
                <button onClick={() => { setFrom(to); setTo(from); }} className="self-end mb-0.5 flex h-12 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"><ArrowLeftRight className="h-4 w-4 text-emerald-300" /></button>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.toLabel}</span>
                  <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
                  </select>
                </label>
              </div>

              {result !== null && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.result}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">{toCurrency?.symbol}{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} <span className="text-xl text-white/60">{to}</span></p>
                </div>
              )}

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-400">{content.popular}</p>
                <div className="flex flex-wrap gap-2">{POPULAR_PAIRS.map(([f, t]) => <button key={`${f}-${t}`} onClick={() => { setFrom(f); setTo(t); }} className={`rounded-full border px-3 py-1.5 text-xs transition ${from === f && to === t ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"}`}>{f}/{t}</button>)}</div>
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">How Currency Exchange Rates Work</h2>
                <p className="mt-3 leading-7">An exchange rate is the price of one currency expressed in terms of another. When you see USD/HKD = 7.78, it means 1 US Dollar buys 7.78 Hong Kong Dollars. Exchange rates fluctuate continuously during trading hours as currencies are bought and sold on the global foreign exchange (forex) market, which trades over $7.5 trillion per day — making it the largest financial market in the world.</p>
                <p className="mt-3 leading-7">There are three types of exchange rates you will encounter in practice:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    { name: "Mid-market rate", desc: "The midpoint between buy and sell prices. Used by this calculator. Also called the interbank rate or spot rate." },
                    { name: "Buy rate (bid)", desc: "The rate at which a bank or currency exchange buys foreign currency from you. Lower than the mid-market rate." },
                    { name: "Sell rate (ask)", desc: "The rate at which a bank sells foreign currency to you. Higher than mid-market. The spread is the provider's profit." },
                  ].map((t) => (
                    <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Worked Examples</h2>
                <p className="mt-3 leading-7">Understanding conversion is straightforward once you know the formula: <span className="font-mono text-emerald-200">Result = Amount × (Target Rate / Base Rate)</span>. Here are some practical examples using approximate mid-market rates:</p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 text-left font-semibold text-white">Scenario</th>
                        <th className="py-2 pr-4 text-left font-semibold text-white">Amount</th>
                        <th className="py-2 text-left font-semibold text-white">Result</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">US trip budget in HKD</td><td className="py-2 pr-4">HKD 10,000</td><td className="py-2">≈ USD 1,285 (at 7.78)</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">EU invoice paid in USD</td><td className="py-2 pr-4">EUR 2,500</td><td className="py-2">≈ USD 2,725 (at 1.09)</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">Japan travel cash</td><td className="py-2 pr-4">USD 500</td><td className="py-2">≈ JPY 74,500 (at 149)</td></tr>
                      <tr><td className="py-2 pr-4">CNY to HKD remittance</td><td className="py-2 pr-4">CNY 50,000</td><td className="py-2">≈ HKD 54,200 (at 1.084)</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-white/50">Rates above are illustrative approximations. Use the converter for live rates.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">What Moves Exchange Rates?</h2>
                <p className="mt-3 leading-7">Exchange rates are driven by supply and demand for each currency on the global market. Several key factors influence this:</p>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Interest rates.</strong> When a central bank raises interest rates, its currency typically strengthens because higher rates attract foreign investment. The US Federal Reserve's rate decisions move the USD significantly.</li>
                  <li><strong className="text-white">Inflation.</strong> Countries with lower inflation rates tend to see their currencies appreciate. High inflation erodes purchasing power and weakens a currency over time.</li>
                  <li><strong className="text-white">Economic data.</strong> GDP growth, employment figures, trade balance, and manufacturing output reports all signal economic health. Strong data tends to strengthen a currency.</li>
                  <li><strong className="text-white">Political stability.</strong> Currencies of politically stable countries attract investment. Elections, geopolitical conflicts, and policy uncertainty can cause significant currency volatility.</li>
                  <li><strong className="text-white">Market speculation.</strong> Large institutional traders, hedge funds, and algorithmic trading systems can move currencies short-term based on sentiment and positioning.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Pegged vs. Floating Currencies</h2>
                <p className="mt-3 leading-7">Not all currencies float freely. Some governments maintain a fixed or pegged exchange rate against another currency or basket of currencies:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">Hong Kong Dollar (HKD)</strong> is pegged to the USD at 7.75–7.85. The HKMA maintains this band through open market operations.</li>
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">Saudi Riyal (SAR)</strong> has been pegged to the USD at 3.75 since 1986.</li>
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">Chinese Yuan (CNY)</strong> is a managed float — the People's Bank of China sets a daily reference rate and allows trading within a ±2% band.</li>
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">Euro (EUR)</strong> is a floating currency shared by 20 EU member states, managed by the European Central Bank.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Tips for Getting Better Currency Exchange Rates</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Avoid airport and hotel currency exchange counters.</strong> These typically charge 5%–15% above the mid-market rate. Even a dedicated currency exchange bureau at the destination will offer better rates.</li>
                  <li><strong className="text-white">Use a multi-currency debit card for travel.</strong> Cards like Wise, Revolut, or Charles Schwab offer rates close to the interbank/mid-market rate with low or no fees.</li>
                  <li><strong className="text-white">Withdraw local currency from ATMs abroad.</strong> Using your home bank's debit card at local ATMs usually beats exchange bureau rates, though your bank may charge a foreign transaction fee (typically 1%–3%).</li>
                  <li><strong className="text-white">For large transfers, compare specialist providers.</strong> For transfers above $5,000 equivalent, specialist services like Wise, OFX, or CurrencyFair typically save 1%–3% compared to high-street banks.</li>
                  <li><strong className="text-white">Watch the mid-market rate trend.</strong> If your home currency has recently strengthened, it may be a good time to exchange. Use historical rate tools to see whether rates are near recent highs or lows.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">How often do the exchange rates in this tool update?</h3>
                    <p className="mt-1 text-white/70">Rates are provided by the Open Exchange Rates API and update approximately every hour. The timestamp displayed in the tool shows the time of the last rate update. For live trading or large financial transactions, always confirm rates directly with your bank or broker.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Why does the rate I get at the bank differ from what this tool shows?</h3>
                    <p className="mt-1 text-white/70">This tool shows the mid-market rate (the midpoint between buy and sell prices), which is the fairest benchmark. Banks and currency exchange services add a markup — called a spread — on top of this rate to make their profit. That spread can range from 0.5% at competitive online services to 8%–15% at airport kiosks. The difference between what you see here and what a provider charges is essentially their fee.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between EUR/USD and USD/EUR?</h3>
                    <p className="mt-1 text-white/70">EUR/USD = 1.09 means 1 Euro buys 1.09 US Dollars (EUR is the base currency). USD/EUR would be the inverse: 1 USD buys approximately 0.917 Euros. In forex convention, the first currency listed is the base and the second is the quote currency. Major pairs always list USD, EUR, GBP, or JPY in a standardised order.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Can I use this tool to convert cryptocurrencies?</h3>
                    <p className="mt-1 text-white/70">No — this tool covers traditional fiat currencies only. Cryptocurrency prices change much more rapidly than fiat exchange rates and require specialised data sources. For crypto conversions, use a dedicated crypto exchange or market data provider.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Is the Hong Kong Dollar really pegged to the US Dollar?</h3>
                    <p className="mt-1 text-white/70">Yes. The Hong Kong Dollar has been pegged to the USD within a band of 7.75–7.85 since 1983 under the Linked Exchange Rate System, operated by the Hong Kong Monetary Authority. In practice, HKD/USD trades in a very narrow range around 7.78 and does not fluctuate like free-floating currencies. This peg provides exchange rate stability that is important for Hong Kong's role as an international financial centre.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What currencies does this tool support?</h3>
                    <p className="mt-1 text-white/70">This converter supports 30 major currencies including USD, EUR, GBP, JPY, CNY, HKD, AUD, CAD, CHF, SGD, KRW, INR, TWD, MYR, THB, IDR, PHP, VND, NZD, SEK, NOK, DKK, MXN, BRL, AED, SAR, ZAR, TRY, RUB, and PLN. These cover most of Asia-Pacific, Europe, the Americas, and the Middle East/Africa region.</p>
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
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3"><DollarSign className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-semibold">Live rates</h2><p className="text-sm text-neutral-300">30+ currencies via open.er-api.com</p></div>
            </div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Travel and shopping conversions.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">International invoicing and payroll.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Cross-border payments and pricing.</p>
            </div>
            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <p className="mt-1 text-xs text-white/55">{content.suggestionsSubtitle}</p>
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
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
