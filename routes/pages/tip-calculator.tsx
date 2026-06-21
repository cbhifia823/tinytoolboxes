import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, DollarSign, Search, Users } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string; title: string; subtitle: string;
  searchLabel: string; searchPlaceholder: string;
  reserveAd: string; reserveAdSub: string;
  billLabel: string; tipLabel: string; peopleLabel: string;
  customTip: string; tipPerPerson: string; totalPerPerson: string;
  totalBill: string; totalTip: string;
  sidebarTitle: string; sidebarSubtitle: string;
  useCases: string[]; suggestionsTitle: string; suggestions: string[];
}> = {
  en: {
    name: "English", title: "Tip Calculator", subtitle: "Split a restaurant bill fairly with tip and any number of people.",
    searchLabel: "Search tools", searchPlaceholder: "Try: percent, loan, currency, unit",
    reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later.",
    billLabel: "Bill amount", tipLabel: "Tip %", peopleLabel: "Number of people",
    customTip: "Custom", tipPerPerson: "Tip per person", totalPerPerson: "Total per person",
    totalBill: "Total bill", totalTip: "Total tip",
    sidebarTitle: "Quick split", sidebarSubtitle: "No calculator needed.",
    useCases: ["Restaurant bills with friends.", "Group gifts and shared costs.", "Service tips for any occasion."],
    suggestionsTitle: "You may also like", suggestions: ["Percentage Calculator", "Loan Calculator", "Currency Converter"],
  },
  "zh-hk": {
    name: "繁體中文", title: "貼士計算機", subtitle: "公平攤分帳單，支援小費同任何人數。",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：百分比、貸款、貨幣、單位",
    reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。",
    billLabel: "帳單金額", tipLabel: "貼士 %", peopleLabel: "人數",
    customTip: "自訂", tipPerPerson: "每人貼士", totalPerPerson: "每人總數",
    totalBill: "總帳單", totalTip: "總貼士",
    sidebarTitle: "快速攤分", sidebarSubtitle: "唔使計數機。",
    useCases: ["同朋友食飯夾錢。", "夾份買禮物同分擔費用。", "任何場合嘅服務貼士。"],
    suggestionsTitle: "你可能會喜歡", suggestions: ["百分比計算機", "貸款計算器", "貨幣換算器"],
  },
  "zh-cn": {
    name: "简体中文", title: "小费计算器", subtitle: "公平分摊账单，支持小费和任意人数。",
    searchLabel: "搜索工具", searchPlaceholder: "例如：百分比、贷款、货币、单位",
    reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。",
    billLabel: "账单金额", tipLabel: "小费 %", peopleLabel: "人数",
    customTip: "自定义", tipPerPerson: "每人小费", totalPerPerson: "每人总数",
    totalBill: "总账单", totalTip: "总小费",
    sidebarTitle: "快速分摊", sidebarSubtitle: "不用计算器。",
    useCases: ["和朋友吃饭分摊。", "合伙买礼物和分担费用。", "任何场合的服务小费。"],
    suggestionsTitle: "你可能会喜欢", suggestions: ["百分比计算器", "贷款计算器", "货币换算器"],
  },
  es: {
    name: "Español", title: "Calculadora de propinas", subtitle: "Divide una cuenta de forma justa con propina y cualquier número de personas.",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: percent, loan, currency",
    reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    billLabel: "Total de la cuenta", tipLabel: "Propina %", peopleLabel: "Número de personas",
    customTip: "Personalizado", tipPerPerson: "Propina por persona", totalPerPerson: "Total por persona",
    totalBill: "Total factura", totalTip: "Propina total",
    sidebarTitle: "División rápida", sidebarSubtitle: "Sin necesidad de calculadora.",
    useCases: ["Cuentas de restaurante con amigos.", "Regalos en grupo y gastos compartidos.", "Propinas de servicio para cualquier ocasión."],
    suggestionsTitle: "También te puede interesar", suggestions: ["Calculadora de porcentajes", "Calculadora de préstamos", "Conversor de divisas"],
  },
};

const PRESET_TIPS = [10, 12, 15, 18, 20, 25];

const TOOLS = [
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentages made simple.", "zh-hk": "簡單百分比計算。", "zh-cn": "简单百分比计算。", es: "Porcentajes simplificados." }, href: "/percentage-calculator", keywords: ["percent"] },
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算器", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Monthly payments and amortization.", "zh-hk": "每月還款同攤銷表。", "zh-cn": "每月还款和摊销表。", es: "Pagos mensuales y amortización." }, href: "/loan-calculator", keywords: ["loan"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣換算器", "zh-cn": "货币换算器", es: "Conversor de divisas" }, description: { en: "Live exchange rates for 30+ currencies.", "zh-hk": "30+ 貨幣即時匯率。", "zh-cn": "30+ 货币即时汇率。", es: "Tipos de cambio en vivo para 30+ divisas." }, href: "/currency-converter", keywords: ["currency"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, and more.", "zh-hk": "換算長度、重量等。", "zh-cn": "换算长度、重量等。", es: "Convierte longitud, peso y más." }, href: "/unit-converter", keywords: ["unit"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/tip-calculator";

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

export default function TipCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [bill, setBill] = useState("120");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("4");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const result = useMemo(() => {
    const b = parseFloat(bill), t = parseFloat(tipPercent), p = parseInt(people);
    if (isNaN(b) || isNaN(t) || isNaN(p) || b <= 0 || p <= 0) return null;
    const totalTip = b * t / 100;
    const totalBill = b + totalTip;
    return { totalTip, totalBill, tipPerPerson: totalTip / p, totalPerPerson: totalBill / p };
  }, [bill, tipPercent, people]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["百分比", "貸款", "貨幣", "單位"] : locale === "zh-cn" ? ["百分比", "贷款", "货币", "单位"] : ["percent", "loan", "currency", "unit"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><DollarSign className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.billLabel}</span><input type="number" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.tipLabel}</span><input type="number" step="0.1" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.peopleLabel}</span><input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_TIPS.map((t) => <button key={t} onClick={() => setTipPercent(String(t))} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${tipPercent === String(t) ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"}`}>{t}%</button>)}
                <button onClick={() => setTipPercent("")} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65 hover:bg-white/10 transition">{content.customTip}</button>
              </div>

              {result && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.totalBill}</p><p className="mt-2 text-2xl font-semibold text-white">{fmt(result.totalBill)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.totalTip}</p><p className="mt-2 text-2xl font-semibold text-amber-300">{fmt(result.totalTip)}</p></div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.tipPerPerson}</p><p className="mt-2 text-2xl font-semibold text-emerald-200">{fmt(result.tipPerPerson)}</p></div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.totalPerPerson}</p><p className="mt-2 text-2xl font-semibold text-emerald-200">{fmt(result.totalPerPerson)}</p></div>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Users className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-neutral-300">{content.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">{content.useCases.map((uc: string) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}</div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">{content.suggestions.map((name: string) => { const match = TOOLS.find((t) => t.title[locale] === name); return (<button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10"><span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" /></button>); })}</div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
