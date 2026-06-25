import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Percent, Search, Tag } from "lucide-react";

const LANGUAGES = {
  en: { name: "English", title: "Discount Calculator", subtitle: "Calculate sale price after discount, or find the discount percent from original and sale price.", searchLabel: "Search tools", searchPlaceholder: "Try: percent, tip, loan, currency", mode1: "Find sale price", mode2: "Find discount %", originalLabel: "Original price", discountLabel: "Discount (%)", saleLabel: "Sale price", result: "You pay", saved: "You save", calculate: "Calculate" },
  "zh-hk": { name: "繁體中文", title: "折扣計算器", subtitle: "計折扣後售價，或者從原價同售價搵出折扣百分比。", searchLabel: "搜尋工具", searchPlaceholder: "例如：百分比、小費、貸款、貨幣", mode1: "計折後價", mode2: "計折扣%", originalLabel: "原價", discountLabel: "折扣 (%)", saleLabel: "折後價", result: "你要畀", saved: "你慳咗", calculate: "計算" },
  "zh-cn": { name: "简体中文", title: "折扣计算器", subtitle: "计算折扣后价格，或从原价和售价找出折扣百分比。", searchLabel: "搜索工具", searchPlaceholder: "例如：百分比、小费、贷款、货币", mode1: "计算折后价", mode2: "计算折扣%", originalLabel: "原价", discountLabel: "折扣 (%)", saleLabel: "折后价", result: "你需要付", saved: "你省了", calculate: "计算" },
  es: { name: "Español", title: "Calculadora de descuentos", subtitle: "Calcula el precio de venta después del descuento, o encuentra el porcentaje de descuento a partir del precio original y el de venta.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: percent, tip, loan", mode1: "Encontrar precio final", mode2: "Encontrar % descuento", originalLabel: "Precio original", discountLabel: "Descuento (%)", saleLabel: "Precio final", result: "Pagas", saved: "Ahorras", calculate: "Calcular" },
};

const TOOLS = [
  { title: { en: "Tip Calculator", "zh-hk": "小費計算器", "zh-cn": "小费计算器", es: "Calculadora de propinas" }, description: { en: "Split bills and calculate tips.", "zh-hk": "拆帳同計小費。", "zh-cn": "分账和算小费。", es: "Divide cuentas y calcula propinas." }, href: "/tip-calculator", keywords: ["tip"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Three ways to work with percents.", "zh-hk": "三種方式計百分比。", "zh-cn": "三种方式算百分比。", es: "Tres formas de trabajar con porcentajes." }, href: "/percentage-calculator", keywords: ["percent"] },
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算器", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Monthly payments and amortization.", "zh-hk": "每月還款同攤分表。", "zh-cn": "每月还款和摊销表。", es: "Pagos mensuales y amortización." }, href: "/loan-calculator", keywords: ["loan"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Live exchange rates for 30+ currencies.", "zh-hk": "30+ 貨幣即時匯率。", "zh-cn": "30+ 货币实时汇率。", es: "Tasas de cambio en vivo." }, href: "/currency-converter", keywords: ["currency"] },
  { title: { en: "Unit Converter", "zh-hk": "單位換算器", "zh-cn": "单位换算器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "換算長度、重量、溫度。", "zh-cn": "换算长度、重量、温度。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/discount-calculator";

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
  if (o.jsonLd) { const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]; arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); }); }
}

export default function DiscountCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [mode, setMode] = useState<"sale" | "percent">("sale");
  const [original, setOriginal] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [salePrice, setSalePrice] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const result = useMemo(() => {
    const o = parseFloat(original);
    if (isNaN(o) || o <= 0) return null;
    if (mode === "sale") {
      const d = parseFloat(discount);
      if (isNaN(d) || d < 0) return null;
      const final = o * (1 - d / 100);
      return { final, saved: o - final, discountPct: d };
    } else {
      const s = parseFloat(salePrice);
      if (isNaN(s) || s < 0 || s > o) return null;
      const pct = ((o - s) / o) * 100;
      return { final: s, saved: o - s, discountPct: pct };
    }
  }, [original, discount, salePrice, mode]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["小費", "百分比", "貸款", "貨幣"] : locale === "zh-cn" ? ["小费", "百分比", "贷款", "货币"] : ["tip", "percent", "loan", "currency"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Tag className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setMode("sale")} className={`rounded-full border px-4 py-2 text-sm transition ${mode === "sale" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.mode1}</button>
                <button onClick={() => setMode("percent")} className={`rounded-full border px-4 py-2 text-sm transition ${mode === "percent" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.mode2}</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.originalLabel}</span>
                  <input type="number" min="0" step="0.01" value={original} onChange={(e) => setOriginal(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                </label>
                {mode === "sale" ? (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.discountLabel}</span>
                    <input type="number" min="0" max="100" step="0.1" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  </label>
                ) : (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.saleLabel}</span>
                    <input type="number" min="0" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  </label>
                )}
              </div>
              {result && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-5 text-neutral-900">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">{content.result}</p>
                    <p className="mt-2 text-4xl font-bold">${result.final.toFixed(2)}</p>
                    {mode === "percent" && <p className="text-sm opacity-75">{result.discountPct.toFixed(1)}% off</p>}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{content.saved}</p>
                    <p className="mt-2 text-3xl font-bold text-amber-300">${result.saved.toFixed(2)}</p>
                    {mode === "sale" && <p className="text-sm text-white/55">{result.discountPct}% discount</p>}
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

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">Advertisement</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">Reserved</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Percent className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">How it works</h2><p className="text-sm text-neutral-300">Shopping maths made easy.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">"30% off" means you pay 70% of the original price.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">"Buy 1 get 1 free" = 50% off if prices are equal.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Always compare unit price, not just discount percentage.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
