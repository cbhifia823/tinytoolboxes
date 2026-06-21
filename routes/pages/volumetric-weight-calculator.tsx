import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calculator, Globe2, Search, Scale, Sparkles, Truck } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "ja" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "ja", label: "日" },
  { id: "es", label: "ES" },
];

const COPY: Record<LocaleKey, {
  collection: string;
  title: string;
  subtitle: string;
  heroNote: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHints: string[];
  sectionTitle: string;
  sectionSubtitle: string;
  footer: string;
  searchFooter: string;
  intro: string;
  carrierLabel: string;
  unitLabel: string;
  lengthLabel: string;
  widthLabel: string;
  heightLabel: string;
  actualWeightLabel: string;
  dimensionalFactorLabel: string;
  formulaLabel: string;
  formulaMetric: string;
  formulaImperial: string;
  resultsTitle: string;
  volumetricWeightLabel: string;
  billableWeightLabel: string;
  examplesTitle: string;
  faqTitle: string;
  quickLinksTitle: string;
  multilingualCalc: string;
  upsCalc: string;
  fedexCalc: string;
  dhlCalc: string;
  seoFooterTitle: string;
  seoFooterText: string;
  faq: Array<[string, string]>;
  examples: Array<{ label: string; labelKey: string; actual: string }>;
}> = {
  en: {
    collection: "TinyToolboxes collection",
    title: "Volumetric Weight Calculator",
    subtitle: "Calculate dimensional weight for parcels, boxes, and shipments.",
    heroNote: "Fast, boring, and useful.",
    searchLabel: "Search the collection",
    searchPlaceholder: "Try: weight, date, word, url, rhyme",
    searchHints: ["weight", "date", "word", "url", "rhyme"],
    sectionTitle: "Calculator",
    sectionSubtitle: "Enter dimensions, choose units, and get dimensional weight instantly.",
    footer: "TinyToolboxes",
    searchFooter: "Search hints are at the bottom of every page.",
    intro: "A boring utility page with one job: help shippers calculate volumetric weight fast.",
    carrierLabel: "Carrier",
    unitLabel: "Units",
    lengthLabel: "Length",
    widthLabel: "Width",
    heightLabel: "Height",
    actualWeightLabel: "Actual weight",
    dimensionalFactorLabel: "Dimensional factor",
    formulaLabel: "Formula",
    formulaMetric: "L × W × H ÷ divisor",
    formulaImperial: "L × W × H ÷ divisor",
    resultsTitle: "Results",
    volumetricWeightLabel: "Volumetric weight",
    billableWeightLabel: "Billable weight",
    examplesTitle: "Examples",
    faqTitle: "FAQ",
    quickLinksTitle: "Quick links",
    multilingualCalc: "Multilingual calculator",
    upsCalc: "UPS calculator",
    fedexCalc: "FedEx calculator",
    dhlCalc: "DHL calculator",
    seoFooterTitle: "Ready for organic search traffic",
    seoFooterText: "This page is designed to capture searches like volumetric weight calculator, dimensional weight formula, and chargeable weight calculator.",
    faq: [
      ["What is volumetric weight?", "Volumetric (or dimensional) weight is a pricing technique used by carriers. It calculates a theoretical weight based on the parcel's dimensions, ensuring that lightweight but bulky packages are priced fairly for the space they occupy."],
      ["Why is billable weight important?", "Carriers charge whichever is greater: the actual weight or the volumetric weight. Understanding both helps you avoid unexpected shipping costs."],
      ["What divisor should I use?", "It depends on the carrier and unit system. Common divisors are 5000 for cm/kg (UPS, FedEx, DHL) and 139 for in/lb. Some carriers use 6000 for cm/kg or 166 for in/lb."],
      ["Can I switch between cm and inches?", "Yes — use the unit selector to toggle between centimetres/kilograms and inches/pounds. The divisor updates automatically."],
    ],
    examples: [
      { label: "Small parcel", labelKey: "Small parcel", actual: "Actual weight" },
      { label: "Retail box", labelKey: "Retail box", actual: "Actual weight" },
      { label: "Large carton", labelKey: "Large carton", actual: "Actual weight" },
    ],
  },
  "zh-hk": {
    collection: "TinyToolboxes 系列",
    title: "體積重量計算器",
    subtitle: "用嚟計包裹、紙箱同貨件嘅體積重量。",
    heroNote: "夠快、夠無聊、夠實用。",
    searchLabel: "搜尋系列",
    searchPlaceholder: "例如：體積重量、日期、字數、URL、押韻",
    searchHints: ["體積重量", "日期", "字數", "URL", "押韻"],
    sectionTitle: "計算器",
    sectionSubtitle: "輸入尺寸、選單位，即刻得出體積重量。",
    footer: "TinyToolboxes",
    searchFooter: "搜尋提示會放喺每頁底部。",
    intro: "呢個頁面只有一個用途：幫托運人快速計體積重量。",
    carrierLabel: "運輸公司",
    unitLabel: "單位",
    lengthLabel: "長度",
    widthLabel: "闊度",
    heightLabel: "高度",
    actualWeightLabel: "實際重量",
    dimensionalFactorLabel: "體積因數",
    formulaLabel: "公式",
    formulaMetric: "長 × 闊 × 高 ÷ 因數",
    formulaImperial: "長 × 闊 × 高 ÷ 因數",
    resultsTitle: "結果",
    volumetricWeightLabel: "體積重量",
    billableWeightLabel: "收費重量",
    examplesTitle: "範例",
    faqTitle: "常見問題",
    quickLinksTitle: "快速連結",
    multilingualCalc: "多語言計算器",
    upsCalc: "UPS 計算器",
    fedexCalc: "FedEx 計算器",
    dhlCalc: "DHL 計算器",
    seoFooterTitle: "為搜尋流量而設",
    seoFooterText: "呢頁專為搜尋體積重量計算器、體積重量公式同收費重量計算器而設。",
    faq: [
      ["咩係體積重量？", "體積重量（又叫做 dimensional weight）係運輸公司嘅計價方式。佢根據包裹尺寸計算出一個理論重量，確保輕但大件嘅包裹按佢哋佔用嘅空間收費。"],
      ["點解收費重量咁重要？", "運輸公司會收實際重量同體積重量之中較高嗰個。了解兩者可以幫你避免意料之外嘅運費。"],
      ["應該用咩因數？", "視乎運輸公司同單位系統。常見嘅因數係 5000（厘米/公斤，UPS、FedEx、DHL）同 139（英寸/磅）。某啲公司會用 6000（厘米/公斤）或 166（英寸/磅）。"],
      ["可唔可以轉單位？", "可以 — 用單位選擇器喺厘米/公斤同英寸/磅之間切換。因數會自動更新。"],
    ],
    examples: [
      { label: "細包裹", labelKey: "Small parcel", actual: "實際重量" },
      { label: "零售紙箱", labelKey: "Retail box", actual: "實際重量" },
      { label: "大紙箱", labelKey: "Large carton", actual: "實際重量" },
    ],
  },
  "zh-cn": {
    collection: "TinyToolboxes 系列",
    title: "体积重量计算器",
    subtitle: "用于计算包裹、纸箱和货件的体积重量。",
    heroNote: "够快、够无聊、够实用。",
    searchLabel: "搜索系列",
    searchPlaceholder: "例如：体积重量、日期、字数、URL、押韵",
    searchHints: ["体积重量", "日期", "字数", "URL", "押韵"],
    sectionTitle: "计算器",
    sectionSubtitle: "输入尺寸、选择单位，立即得到体积重量。",
    footer: "TinyToolboxes",
    searchFooter: "搜索提示会放在每个页面底部。",
    intro: "这个页面只有一个用途：帮托运人快速计算体积重量。",
    carrierLabel: "运输公司",
    unitLabel: "单位",
    lengthLabel: "长度",
    widthLabel: "宽度",
    heightLabel: "高度",
    actualWeightLabel: "实际重量",
    dimensionalFactorLabel: "体积因数",
    formulaLabel: "公式",
    formulaMetric: "长 × 宽 × 高 ÷ 因数",
    formulaImperial: "长 × 宽 × 高 ÷ 因数",
    resultsTitle: "结果",
    volumetricWeightLabel: "体积重量",
    billableWeightLabel: "收费重量",
    examplesTitle: "示例",
    faqTitle: "常见问题",
    quickLinksTitle: "快速链接",
    multilingualCalc: "多语言计算器",
    upsCalc: "UPS 计算器",
    fedexCalc: "FedEx 计算器",
    dhlCalc: "DHL 计算器",
    seoFooterTitle: "为搜索流量而设",
    seoFooterText: "本页专为搜索体积重量计算器、体积重量公式和收费重量计算器而设。",
    faq: [
      ["什么是体积重量？", "体积重量（也叫 dimensional weight）是运输公司的计价方式。它根据包裹尺寸计算出一个理论重量，确保轻但大件的包裹按它们占用的空间收费。"],
      ["为什么收费重量这么重要？", "运输公司会收实际重量和体积重量之中较高的那个。了解两者可以帮你避免意料之外的运费。"],
      ["应该用什么因数？", "取决于运输公司和单位系统。常见的因数是 5000（厘米/公斤，UPS、FedEx、DHL）和 139（英寸/磅）。某些公司会用 6000（厘米/公斤）或 166（英寸/磅）。"],
      ["可以切换单位吗？", "可以 — 用单位选择器在厘米/公斤和英寸/磅之间切换。因数会自动更新。"],
    ],
    examples: [
      { label: "小包裹", labelKey: "Small parcel", actual: "实际重量" },
      { label: "零售纸箱", labelKey: "Retail box", actual: "实际重量" },
      { label: "大纸箱", labelKey: "Large carton", actual: "实际重量" },
    ],
  },
  es: {
    collection: "Colección TinyToolboxes",
    title: "Calculadora de peso volumétrico",
    subtitle: "Calcula el peso dimensional de paquetes, cajas y envíos.",
    heroNote: "Rápido, aburrido y útil.",
    searchLabel: "Buscar la colección",
    searchPlaceholder: "Prueba: weight, date, word, url, rhyme",
    searchHints: ["peso", "fecha", "palabra", "url", "rima"],
    sectionTitle: "Calculadora",
    sectionSubtitle: "Introduce las medidas, elige las unidades y obtiene el peso dimensional al instante.",
    footer: "TinyToolboxes",
    searchFooter: "Las sugerencias de búsqueda están al final de cada página.",
    intro: "Una página aburrida con un solo trabajo: ayudar a los transportistas a calcular el peso volumétrico rápidamente.",
    carrierLabel: "Transportista",
    unitLabel: "Unidades",
    lengthLabel: "Largo",
    widthLabel: "Ancho",
    heightLabel: "Alto",
    actualWeightLabel: "Peso real",
    dimensionalFactorLabel: "Factor dimensional",
    formulaLabel: "Fórmula",
    formulaMetric: "L × A × Alto ÷ factor",
    formulaImperial: "L × A × Alto ÷ factor",
    resultsTitle: "Resultados",
    volumetricWeightLabel: "Peso volumétrico",
    billableWeightLabel: "Peso facturable",
    examplesTitle: "Ejemplos",
    faqTitle: "Preguntas frecuentes",
    quickLinksTitle: "Enlaces rápidos",
    multilingualCalc: "Calculadora multilingüe",
    upsCalc: "Calculadora UPS",
    fedexCalc: "Calculadora FedEx",
    dhlCalc: "Calculadora DHL",
    seoFooterTitle: "Listo para tráfico de búsqueda orgánica",
    seoFooterText: "Esta página está diseñada para capturar búsquedas como calculadora de peso volumétrico, fórmula de peso dimensional y calculadora de peso facturable.",
    faq: [
      ["¿Qué es el peso volumétrico?", "El peso volumétrico (o dimensional) es una técnica de precios usada por los transportistas. Calcula un peso teórico basado en las dimensiones del paquete, asegurando que los envíos ligeros pero voluminosos se cobren de forma justa por el espacio que ocupan."],
      ["¿Por qué es importante el peso facturable?", "Los transportistas cobran el mayor entre el peso real y el peso volumétrico. Entender ambos te ayuda a evitar costes de envío inesperados."],
      ["¿Qué divisor debo usar?", "Depende del transportista y del sistema de unidades. Los divisores comunes son 5000 para cm/kg (UPS, FedEx, DHL) y 139 para in/lb. Algunos transportistas usan 6000 para cm/kg o 166 para in/lb."],
      ["¿Puedo cambiar entre cm y pulgadas?", "Sí — usa el selector de unidades para alternar entre centímetros/kilogramos e inches/libras. El divisor se actualiza automáticamente."],
    ],
    examples: [
      { label: "Paquete pequeño", labelKey: "Small parcel", actual: "Peso real" },
      { label: "Caja minorista", labelKey: "Retail box", actual: "Peso real" },
      { label: "Cartón grande", labelKey: "Large carton", actual: "Peso real" },
    ],
  },
};

const CARRIERS = [
  { id: "generic", name: "Generic / Volumetric" },
  { id: "ups", name: "UPS" },
  { id: "fedex", name: "FedEx" },
  { id: "dhl", name: "DHL" },
] as const;

type CarrierId = (typeof CARRIERS)[number]["id"];

function Header({ locale, onLocaleChange }: { locale: LocaleKey; onLocaleChange: (locale: LocaleKey) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-wide text-white">TinyToolboxes</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span>
            </div>
            <p className="text-sm text-white/50">Boring, useful, searchable.</p>
          </div>
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {LOCALES.map((item) => (
            <button key={item.id} onClick={() => onLocaleChange(item.id)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SearchBar({ locale }: { locale: LocaleKey }) {
  const copy = COPY[locale];
  const [query, setQuery] = useState("");
  const filtered = [
    { title: "Volumetric Weight Calculator", href: "/volumetric-weight-calculator" },
    { title: "Business Day Calculator", href: "/business-day-calculator" },
    { title: "Invoice Due Date Calculator", href: "/invoice-due-date-calculator" },
    { title: "Word Counter", href: "/word-counter" },
    { title: "URL Encoder / Decoder", href: "/url-encoder-decoder" },
    { title: "Rhyme Zone", href: "/rhyme-zone" },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-medium text-emerald-300">{copy.searchLabel}</p><p className="mt-1 text-sm text-white/60">{copy.searchFooter}</p></div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.searchPlaceholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" /></div>
      <div className="mt-4 flex flex-wrap gap-2">{copy.searchHints.map((hint) => (<button key={hint} onClick={() => setQuery(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-emerald-300/40 hover:bg-emerald-300/10">{hint}</button>))}</div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((tool) => (<a key={tool.href} href={tool.href} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-emerald-300/40 hover:bg-white/5"><div className="rounded-xl bg-emerald-300/10 p-2 text-emerald-200"><Calculator className="h-4 w-4" /></div><div className="min-w-0"><p className="font-medium text-white group-hover:text-emerald-100">{tool.title}</p></div></a>))}</div>
    </section>
  );
}

function parseNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function calculateDimensionalWeight(length: number, width: number, height: number, divisor: number) {
  if (!length || !width || !height || !divisor) return 0;
  return (length * width * height) / divisor;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/volumetric-weight-calculator";

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

const EXAMPLE_PRESETS = [
  { dims: [30, 20, 15], actual: 4 },
  { dims: [40, 30, 20], actual: 6 },
  { dims: [60, 40, 40], actual: 12 },
] as const;

export default function VolumetricWeightCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [carrier, setCarrier] = useState<CarrierId>("generic");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("20");
  const [actualWeight, setActualWeight] = useState("8");
  const [factor, setFactor] = useState("6000");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
  }, [locale]);

  useEffect(() => {
    const L = COPY[locale] || COPY.en;
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: L.title,
          url: SITE_URL + PAGE_PATH,
          description: L.subtitle,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: L.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        },
      ],
    });
  }, [locale]);

  useEffect(() => {
    const newFactor = carrier === "ups" || carrier === "fedex" || carrier === "dhl"
      ? (unit === "cm" ? 5000 : 139)
      : (unit === "cm" ? 6000 : 166);
    setFactor(String(newFactor));
  }, [carrier, unit]);

  const divisor = parseNumber(factor);
  const volumetricWeight = useMemo(
    () => calculateDimensionalWeight(parseNumber(length), parseNumber(width), parseNumber(height), divisor),
    [length, width, height, divisor]
  );
  const actual = parseNumber(actualWeight);
  const billableWeight = Math.max(actual, volumetricWeight);
  const copy = COPY[locale];
  const units = unit === "cm" ? { dim: "cm", weight: "kg" } : { dim: "in", weight: "lb" };
  const formatter = useMemo(() => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }), []);
  const formula = unit === "cm" ? copy.formulaMetric : copy.formulaImperial;
  const formulaText = `${copy.formulaLabel}: ${formula} = ${formatter.format(Math.round(volumetricWeight * 100) / 100)} ${units.weight}`;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#163028_0%,#091016_28%,#05070b_100%)] text-white">
      <Header locale={locale} onLocaleChange={setLocale} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-emerald-200"><Sparkles className="h-4 w-4" /><span>{copy.collection}</span></div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">{copy.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">{copy.heroNote}</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">SEO-ready</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">AdSense-ready</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Multi-language</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Calculator */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{copy.sectionTitle}</h2>
                  <p className="mt-1 text-sm text-white/60">{copy.sectionSubtitle}</p>
                </div>
                <a href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-emerald-300/40 hover:bg-emerald-300/10">Back to collection <ArrowRight className="h-4 w-4" /></a>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70"><span>{copy.carrierLabel}</span><select value={carrier} onChange={(e) => setCarrier(e.target.value as CarrierId)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"><option value="generic">Generic / Volumetric</option><option value="ups">UPS</option><option value="fedex">FedEx</option><option value="dhl">DHL</option></select></label>
                <label className="space-y-2 text-sm text-white/70"><span>{copy.unitLabel}</span><select value={unit} onChange={(e) => setUnit(e.target.value as "cm" | "in")} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"><option value="cm">Centimetres</option><option value="in">Inches</option></select></label>
                <label className="space-y-2 text-sm text-white/70"><span>{copy.lengthLabel} ({units.dim})</span><input value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <label className="space-y-2 text-sm text-white/70"><span>{copy.widthLabel} ({units.dim})</span><input value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <label className="space-y-2 text-sm text-white/70"><span>{copy.heightLabel} ({units.dim})</span><input value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <label className="space-y-2 text-sm text-white/70"><span>{copy.actualWeightLabel} ({units.weight})</span><input value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <label className="space-y-2 text-sm text-white/70 md:col-span-2"><span>{copy.dimensionalFactorLabel}</span><input value={factor} onChange={(e) => setFactor(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
              </div>
              <div className="mt-5 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-50">
                <p className="font-medium text-white">{formulaText}</p>
              </div>
            </section>

            {/* Results */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-lg shadow-black/20">
              <h2 className="text-xl font-semibold text-white">{copy.resultsTitle}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{copy.volumetricWeightLabel}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{formatter.format(Math.round(volumetricWeight * 100) / 100)} {units.weight}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{copy.billableWeightLabel}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{formatter.format(Math.round(billableWeight * 100) / 100)} {units.weight}</p>
                </div>
              </div>
            </div>

            {/* Examples + FAQ side by side */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold text-white">{copy.examplesTitle}</h2>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  {EXAMPLE_PRESETS.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setLength(String(example.dims[0]));
                        setWidth(String(example.dims[1]));
                        setHeight(String(example.dims[2]));
                        setActualWeight(String(example.actual));
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-emerald-300/40 hover:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-white">{copy.examples[i].label}</span>
                        <span>{example.dims.join(" × ")} {units.dim}</span>
                      </div>
                      <p className="mt-1 text-white/40">{copy.examples[i].actual}: {example.actual} {units.weight}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold text-white">{copy.faqTitle}</h2>
                <div className="mt-4 space-y-3">
                  {copy.faq.map(([q, a]) => (
                    <details key={q} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-white">{q}</summary>
                      <p className="mt-2 text-sm leading-6 text-white/60">{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">{copy.quickLinksTitle}</h3>
              <div className="mt-4 grid gap-2 text-sm text-white/80">
                <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/5" href="/volumetric-weight-calculator">{copy.multilingualCalc}</a>
                <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/5" href="/ups-dimensional-weight-calculator">{copy.upsCalc}</a>
                <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/5" href="/fedex-dimensional-weight-calculator">{copy.fedexCalc}</a>
                <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white/5" href="/dhl-dimensional-weight-calculator">{copy.dhlCalc}</a>
              </div>
            </div>

            {/* SEO footer */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
              <div className="flex items-center gap-3 text-white">
                <Truck className="h-5 w-5 text-emerald-300" />
                <span className="text-base font-semibold">{copy.seoFooterTitle}</span>
              </div>
              <p className="mt-3 leading-6 text-white/50">{copy.seoFooterText}</p>
            </div>

            <SearchBar locale={locale} />
          </div>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45"><span>{copy.footer}</span><span>{copy.searchFooter}</span></footer>
      </section>
    </main>
  );
}
