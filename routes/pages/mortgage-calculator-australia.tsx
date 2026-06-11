import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Home, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  reserveAd: string;
  reserveAdSub: string;
  homePrice: string;
  deposit: string;
  rate: string;
  term: string;
  state: string;
  frequency: string;
  weekly: string;
  fortnightly: string;
  monthly: string;
  repayment: string;
  totalInterest: string;
  totalPaid: string;
  stampDuty: string;
  lmi: string;
  upfront: string;
  loanAmount: string;
  lvr: string;
  fhBuyer: string;
  useCasesTitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
  articleTitle: string;
}> = {
  en: {
    name: "English",
    title: "Mortgage Calculator (Australia)",
    subtitle: "Calculate Australian home loan repayments, stamp duty, and LMI for every state. Built for AU first-home buyers and refinancers.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: BMI, calorie, percent, age",
    reserveAd: "Google Ads space reserved",
    homePrice: "Property price (AUD)",
    deposit: "Deposit (AUD)",
    rate: "Interest rate (% p.a.)",
    term: "Loan term (years)",
    state: "State / territory",
    frequency: "Repayment frequency",
    weekly: "Weekly",
    fortnightly: "Fortnightly",
    monthly: "Monthly",
    repayment: "Repayment",
    totalInterest: "Total interest",
    totalPaid: "Total paid",
    stampDuty: "Stamp duty (estimate)",
    lmi: "LMI (estimate)",
    upfront: "Upfront costs",
    loanAmount: "Loan amount",
    lvr: "LVR (loan-to-value)",
    fhBuyer: "First home buyer",
    useCasesTitle: "Use cases",
    useCases: [
      "Compare borrowing options before applying.",
      "Estimate stamp duty before auction day.",
      "Check whether LMI applies to your deposit.",
      "Choose between weekly, fortnightly, monthly.",
      "Plan refinancing scenarios.",
    ],
    suggestionsTitle: "You may also like",
    suggestions: ["Loan Calculator", "Currency Converter", "Percentage Calculator"],
    articleTitle: "Australian home loans: deposit, LMI, stamp duty, and what they really cost",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "澳洲按揭計算器",
    subtitle: "計算澳洲按揭嘅每週／半月／每月供款、印花稅同 LMI，覆蓋全部州。專為澳洲首置或轉按用戶設計。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：BMI、卡路里、百分比、年齡",
    reserveAd: "預留 Google 廣告位",
    homePrice: "物業價格（澳元）",
    deposit: "首期（澳元）",
    rate: "年利率（%）",
    term: "貸款年期（年）",
    state: "州 / 領地",
    frequency: "還款頻率",
    weekly: "每週",
    fortnightly: "半月",
    monthly: "每月",
    repayment: "供款",
    totalInterest: "總利息",
    totalPaid: "總還款",
    stampDuty: "印花稅（估算）",
    lmi: "LMI 按揭保險（估算）",
    upfront: "首付前期費用",
    loanAmount: "貸款金額",
    lvr: "LVR（貸款／估值）",
    fhBuyer: "首置買家",
    useCasesTitle: "用途",
    useCases: [
      "申請按揭前比較借貸方案。",
      "拍賣前估算印花稅。",
      "睇下首期需唔需要 LMI。",
      "比較每週／半月／每月供款。",
      "規劃轉按方案。",
    ],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["貸款計算器", "貨幣換算器", "百分比計算器"],
    articleTitle: "澳洲按揭詳解：首期、LMI、印花稅同實際成本",
  },
  "zh-cn": {
    name: "简体中文",
    title: "澳洲按揭计算器",
    subtitle: "计算澳洲按揭的每周／半月／每月还款、印花税和 LMI，覆盖全部州。专为澳洲首次置业或转按用户设计。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：BMI、卡路里、百分比、年龄",
    reserveAd: "预留 Google 广告位",
    homePrice: "房价（澳元）",
    deposit: "首付（澳元）",
    rate: "年利率（%）",
    term: "贷款年期（年）",
    state: "州 / 领地",
    frequency: "还款频率",
    weekly: "每周",
    fortnightly: "半月",
    monthly: "每月",
    repayment: "还款",
    totalInterest: "总利息",
    totalPaid: "总还款",
    stampDuty: "印花税（估算）",
    lmi: "LMI 按揭保险（估算）",
    upfront: "首付前期费用",
    loanAmount: "贷款金额",
    lvr: "LVR（贷款／估值）",
    fhBuyer: "首次置业",
    useCasesTitle: "用途",
    useCases: [
      "申请按揭前比较借贷方案。",
      "拍卖前估算印花税。",
      "看看首付是否需要 LMI。",
      "比较每周／半月／每月还款。",
      "规划转按方案。",
    ],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["贷款计算器", "货币换算器", "百分比计算器"],
    articleTitle: "澳洲按揭详解：首付、LMI、印花税与实际成本",
  },
  es: {
    name: "Español",
    title: "Calculadora de hipoteca (Australia)",
    subtitle: "Calcula cuotas de hipoteca, impuesto de timbre y LMI en Australia, por estado. Para compradores y refinanciamiento en AU.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: BMI, calorie, percent, age",
    reserveAd: "Espacio reservado para Google Ads",
    homePrice: "Precio de la propiedad (AUD)",
    deposit: "Depósito (AUD)",
    rate: "Tasa de interés (% anual)",
    term: "Plazo del préstamo (años)",
    state: "Estado / territorio",
    frequency: "Frecuencia de pago",
    weekly: "Semanal",
    fortnightly: "Quincenal",
    monthly: "Mensual",
    repayment: "Cuota",
    totalInterest: "Interés total",
    totalPaid: "Total pagado",
    stampDuty: "Impuesto de timbre (estimado)",
    lmi: "LMI (estimado)",
    upfront: "Costos iniciales",
    loanAmount: "Monto del préstamo",
    lvr: "LVR (préstamo/valor)",
    fhBuyer: "Comprador primera vivienda",
    useCasesTitle: "Casos de uso",
    useCases: [
      "Comparar opciones antes de solicitar.",
      "Estimar impuesto de timbre antes de subasta.",
      "Comprobar si aplica LMI.",
      "Elegir entre semanal/quincenal/mensual.",
      "Planificar refinanciamiento.",
    ],
    suggestionsTitle: "También te puede interesar",
    suggestions: ["Calculadora de préstamos", "Conversor de divisas", "Calculadora de porcentajes"],
    articleTitle: "Hipotecas en Australia: depósito, LMI, impuesto de timbre y costo real",
  },
};

const STATES = [
  { code: "NSW", name: "NSW" },
  { code: "VIC", name: "VIC" },
  { code: "QLD", name: "QLD" },
  { code: "WA", name: "WA" },
  { code: "SA", name: "SA" },
  { code: "TAS", name: "TAS" },
  { code: "ACT", name: "ACT" },
  { code: "NT", name: "NT" },
];

function calcStampDuty(state: string, price: number, firstHome: boolean): number {
  if (firstHome) {
    if (state === "NSW" && price <= 800000) return 0;
    if (state === "VIC" && price <= 600000) return 0;
    if (state === "QLD" && price <= 700000) return 0;
    if (state === "WA" && price <= 450000) return 0;
    if (state === "SA" && price <= 650000) return 0;
    if (state === "TAS" && price <= 600000) return 0;
    if (state === "ACT") return Math.max(0, price * 0.025);
    if (state === "NT" && price <= 650000) return 0;
  }
  const rates: Record<string, number> = {
    NSW: 0.045, VIC: 0.055, QLD: 0.0475, WA: 0.05, SA: 0.05, TAS: 0.045, ACT: 0.05, NT: 0.05,
  };
  const rate = rates[state] || 0.05;
  let duty = price * rate;
  if (price > 1000000) duty += price * 0.005;
  return Math.round(duty);
}

function calcLMI(loan: number, lvr: number): number {
  if (lvr <= 0.8) return 0;
  if (lvr <= 0.85) return loan * 0.012;
  if (lvr <= 0.9) return loan * 0.02;
  if (lvr <= 0.95) return loan * 0.035;
  return loan * 0.045;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/mortgage-calculator-australia";

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

const TOOLS = [
  { title: { en: "Invoice Due Date Calculator", "zh-hk": "發票到期日計算機", "zh-cn": "发票到期日计算器", es: "Calculadora de fecha de vencimiento" }, description: { en: "Find invoice due dates.", "zh-hk": "計算發票到期日。", "zh-cn": "计算发票到期日。", es: "Busca fechas de vencimiento." }, href: "/invoice-due-date-calculator", keywords: ["invoice", "payment"] },
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算機", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Monthly payments and amortization.", "zh-hk": "每月還款同攤銷表。", "zh-cn": "每月还款和摊销表。", es: "Cuota mensual y amortización." }, href: "/loan-calculator", keywords: ["loan", "amortize"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "計算一個數嘅百分比。", "zh-cn": "计算一个数的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies.", "zh-hk": "轉換 30 種以上貨幣。", "zh-cn": "转换 30 种以上货币。", es: "Convierte 30+ monedas." }, href: "/currency-converter", keywords: ["currency"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "統計字數同字元。", "zh-cn": "统计字数和字符。", es: "Cuenta palabras y caracteres." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age.", "zh-hk": "計算準確年齡。", "zh-cn": "计算准确年龄。", es: "Calcula la edad exacta." }, href: "/age-calculator", keywords: ["age"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "加工作日至任何日期。", "zh-cn": "加工作日到任何日期。", es: "Agrega días hábiles." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
];

export default function MortgageCalculatorAustralia() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [price, setPrice] = useState("800000");
  const [deposit, setDeposit] = useState("160000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [state, setState] = useState("NSW");
  const [freq, setFreq] = useState<"weekly" | "fortnightly" | "monthly">("monthly");
  const [firstHome, setFirstHome] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const result = useMemo(() => {
    const p = parseFloat(price), d = parseFloat(deposit), r = parseFloat(rate), t = parseFloat(term);
    if (!p || isNaN(d) || isNaN(r) || !t) return null;
    const loan = Math.max(0, p - d);
    const lvr = p > 0 ? loan / p : 0;
    const periodsPerYear = freq === "weekly" ? 52 : freq === "fortnightly" ? 26 : 12;
    const totalPeriods = t * periodsPerYear;
    const periodRate = r / 100 / periodsPerYear;
    let payment = 0;
    if (periodRate === 0) {
      payment = loan / totalPeriods;
    } else {
      payment = loan * (periodRate * Math.pow(1 + periodRate, totalPeriods)) / (Math.pow(1 + periodRate, totalPeriods) - 1);
    }
    const totalPaid = payment * totalPeriods;
    const totalInterest = totalPaid - loan;
    const stampDuty = calcStampDuty(state, p, firstHome);
    const lmi = calcLMI(loan, lvr);
    const upfront = stampDuty + lmi + d + 2500;
    return { loan, lvr, payment, totalPaid, totalInterest, stampDuty, lmi, upfront };
  }, [price, deposit, rate, term, state, freq, firstHome]);

  const content = LANGUAGES[locale];
  const fmt = (n: number) => "A$" + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Home className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.homePrice}</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.deposit}</span><input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.rate}</span><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.term}</span><input type="number" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.state}</span>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.frequency}</span>
                  <select value={freq} onChange={(e) => setFreq(e.target.value as any)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    <option value="weekly">{content.weekly}</option>
                    <option value="fortnightly">{content.fortnightly}</option>
                    <option value="monthly">{content.monthly}</option>
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" checked={firstHome} onChange={(e) => setFirstHome(e.target.checked)} />
                <span>{content.fhBuyer}</span>
              </label>

              {result && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{content.repayment}</p>
                    <p className="mt-2 text-4xl font-bold text-white">{fmt(result.payment)}<span className="text-base text-white/55"> / {content[freq]}</span></p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.loanAmount}</p><p className="mt-2 text-lg font-semibold text-white">{fmt(result.loan)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.lvr}</p><p className="mt-2 text-lg font-semibold text-white">{(result.lvr * 100).toFixed(1)}%</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.totalInterest}</p><p className="mt-2 text-lg font-semibold text-amber-300">{fmt(result.totalInterest)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.totalPaid}</p><p className="mt-2 text-lg font-semibold text-white">{fmt(result.totalPaid)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.stampDuty}</p><p className="mt-2 text-lg font-semibold text-red-300">{fmt(result.stampDuty)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.lmi}</p><p className="mt-2 text-lg font-semibold text-red-300">{fmt(result.lmi)}</p></div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">{content.upfront}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{fmt(result.upfront)}</p>
                    <p className="mt-1 text-xs text-white/55">Deposit + stamp duty + LMI + ~$2,500 legal/conveyancing</p>
                  </div>
                </div>
              )}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white">
              <h2 className="text-2xl">{content.articleTitle}</h2>
              <p>Buying a home in Australia isn't just the loan repayment. The real budget includes stamp duty (state tax on the purchase), Lenders Mortgage Insurance (LMI) if your deposit is under 20%, conveyancing fees, building and pest inspections, and government registration fees. This calculator estimates all of the big-ticket items so you know what you actually need in the bank before settlement day.</p>

              <h3>The 20% deposit rule</h3>
              <p>Lenders in Australia consider 20% the "safe" deposit threshold. Above 80% LVR (Loan-to-Value Ratio), banks require you to pay LMI — insurance that protects the bank if you default. LMI can easily run $10,000–$30,000 on a typical home loan, and it's usually added to the loan balance (you pay interest on it for 30 years). The most expensive money you'll ever borrow.</p>

              <h3>Stamp duty varies enormously by state</h3>
              <ul>
                <li><strong>NSW & VIC</strong> have the highest base rates, typically 4–6% of property value.</li>
                <li><strong>First-home buyer concessions</strong> can reduce stamp duty to zero for properties under state-specific thresholds (e.g. $800,000 in NSW, $600,000 in VIC, $700,000 in QLD as of recent years).</li>
                <li><strong>ACT</strong> charges land tax on top of stamp duty.</li>
                <li><strong>Foreign buyer surcharges</strong> add 7–8% in most states.</li>
              </ul>
              <p>This calculator uses simplified rates that capture the broad shape; for a binding number, use your state's revenue office calculator or talk to a conveyancer.</p>

              <h3>Weekly vs fortnightly vs monthly</h3>
              <p>If your bank lets you pay weekly or fortnightly without changing the total annual amount, take it. There are 26 fortnights and 12 months in a year — if the bank treats a fortnightly payment as "half the monthly payment," you end up paying the equivalent of 13 monthly payments per year instead of 12. That's a free extra payment, and on a $640,000 loan at 6.5% it can shave 5+ years off a 30-year mortgage.</p>

              <h3>The real cost of a 0.5% rate difference</h3>
              <p>On a $640,000 loan over 30 years, 6.0% vs 6.5% interest is:</p>
              <ul>
                <li>At 6.0%: ~$3,836/month, ~$741,000 total interest</li>
                <li>At 6.5%: ~$4,045/month, ~$816,000 total interest</li>
              </ul>
              <p>Half a percent costs $75,000 over the life of the loan. This is why mortgage brokers and refinancing exist.</p>

              <h3>What this calculator doesn't include</h3>
              <ul>
                <li>Council rates (~$1,500–$3,000/year)</li>
                <li>Strata fees if you're buying an apartment ($2,000–$10,000+/year)</li>
                <li>Building insurance ($800–$2,500/year)</li>
                <li>Home and contents insurance</li>
                <li>Body corporate special levies</li>
              </ul>

              <h3>FAQ</h3>
              <p><strong>Is LMI ever worth it?</strong> Sometimes. If property prices rise faster than your ability to save 20%, paying LMI to buy now can be cheaper than waiting. Run the numbers on rental vs LMI-loan over 5 years.</p>
              <p><strong>Can I avoid LMI without 20% down?</strong> Yes, if you're in certain professions (doctors, lawyers, accountants) some lenders waive LMI. The First Home Guarantee scheme also lets eligible buyers purchase with 5% deposit and no LMI.</p>
              <p><strong>What's the difference between principal & interest vs interest-only?</strong> P&I means each payment reduces the loan. Interest-only means you only pay the interest charge — the loan never shrinks. Most owner-occupied loans should be P&I; interest-only is a tax/cashflow tool used by investors.</p>
              <p><strong>How accurate is the stamp duty estimate?</strong> Within 5–10% for standard purchases. For exact numbers, use the calculator on your state revenue office's website (revenue.nsw.gov.au, sro.vic.gov.au, etc).</p>
              <p><strong>Should I get pre-approval before I bid at auction?</strong> Yes, always. Auction contracts in Australia are unconditional — if you can't get the loan, you lose your deposit.</p>
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
              <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Home className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
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
