import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, BadgeDollarSign, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Unit Converter",
    subtitle: "Convert between different units of measurement.",
    reserveAd: "Ad",
    fromLabel: "From",
    toLabel: "To",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    adLabel: "Advertisement",
    reserveAdSub: "Ad",
    adBadge: "AD",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "單位轉換器",
    subtitle: "在不同測量單位之間進行轉換。",
    reserveAd: "廣告",
    fromLabel: "從",
    toLabel: "到",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    adLabel: "廣告",
    reserveAdSub: "廣告",
    adBadge: "廣告",
  },
  "zh-cn": {
    name: "简体中文",
    title: "单位转换器",
    subtitle: "在不同测量单位之间进行转换。",
    reserveAd: "广告",
    fromLabel: "从",
    toLabel: "到",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    adLabel: "广告",
    reserveAdSub: "广告",
    adBadge: "广告",
  },
  ja: {
    name: "日本語",
    title: "単位変換器",
    subtitle: "異なる測定単位の間で変換を行います。",
    reserveAd: "広告",
    fromLabel: "元",
    toLabel: "先",
    searchLabel: "検索",
    searchPlaceholder: "ツールを検索...",
    adLabel: "広告",
    reserveAdSub: "広告",
    adBadge: "広告",
  },
};

type Category = { name: string; units: { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] };

const CATEGORIES: Record<string, Category> = {
  length: { name: "Length / 長度", units: [
    { key: "mm", label: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "cm", label: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: "m", label: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    { key: "km", label: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "in", label: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { key: "ft", label: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: "yd", label: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { key: "mi", label: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { key: "nmi", label: "Nautical Mile (nmi)", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ]},
  weight: { name: "Weight / 重量", units: [
    { key: "mg", label: "Milligram (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { key: "g", label: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "kg", label: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    { key: "t", label: "Metric Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "oz", label: "Ounce (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { key: "lb", label: "Pound (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: "st", label: "Stone (st)", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ]},
  temperature: { name: "Temperature / 溫度", units: [
    { key: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    { key: "f", label: "Fahrenheit (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { key: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ]},
  volume: { name: "Volume / 體積", units: [
    { key: "ml", label: "Milliliter (ml)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "l", label: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
    { key: "m3", label: "Cubic meter (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "fl_oz", label: "Fl. Ounce (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { key: "cup", label: "Cup (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { key: "pt", label: "Pint (US pt)", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { key: "qt", label: "Quart (US qt)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { key: "gal", label: "Gallon (US gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  ]},
  speed: { name: "Speed / 速度", units: [
    { key: "ms", label: "m/s", toBase: (v) => v, fromBase: (v) => v },
    { key: "kmh", label: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { key: "mph", label: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { key: "knots", label: "Knots", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ]},
  area: { name: "Area / 面積", units: [
    { key: "mm2", label: "mm²", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { key: "cm2", label: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { key: "m2", label: "m²", toBase: (v) => v, fromBase: (v) => v },
    { key: "km2", label: "km²", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { key: "ha", label: "Hectare (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { key: "ac", label: "Acre (ac)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { key: "ft2", label: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { key: "mi2", label: "mi²", toBase: (v) => v * 2.59e6, fromBase: (v) => v / 2.59e6 },
  ]},
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "年" }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差" }, description: { en: "Days between two dates.", "zh-hk": "日期差" }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比" }, description: { en: "Percentage of a number.", "zh-hk": "百分比" }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Time Zone Converter", "zh-hk": "時區轉換器" }, description: { en: "Convert time between any time zones.", "zh-hk": "時區轉換器" }, href: "/time-zone-converter", keywords: ["time", "zone"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算器" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "體積重量計算器" }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計器" }, description: { en: "Count words and characters.", "zh-hk": "字數統計器" }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器" }, description: { en: "Encode or decode URLs.", "zh-hk": "URL 編碼器" }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/unit-converter";

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

export default function UnitConverter() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("1");
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

  useEffect(() => {
    const cat = CATEGORIES[category];
    setFromUnit(cat.units[0].key);
    setToUnit(cat.units[1]?.key || cat.units[0].key);
  }, [category]);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const cat = CATEGORIES[category];
    const from = cat.units.find((u) => u.key === fromUnit);
    const to = cat.units.find((u) => u.key === toUnit);
    if (!from || !to) return null;
    return to.fromBase(from.toBase(v));
  }, [value, category, fromUnit, toUnit]);

  const content = LANGUAGES[locale];
  const cat = CATEGORIES[category];
  const hints = locale === "zh-hk" ? ["年齡", "百分比", "時區", "URL"] : locale === "zh-cn" ? ["年龄", "百分比", "时区", "URL"] : ["age", "percent", "time", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><ArrowLeftRight className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="flex flex-wrap gap-2">{Object.entries(CATEGORIES).map(([key, c]) => <button key={key} onClick={() => setCategory(key)} className={`rounded-full border px-4 py-2 text-sm transition ${category === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{c.name}</button>)}</div>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-2">
                  <span className="text-sm text-neutral-300">{content.fromLabel}</span>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60 mb-2" />
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {cat.units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
                  </select>
                </div>
                <button onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} className="self-center mt-8 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"><ArrowLeftRight className="h-4 w-4 text-emerald-300" /></button>
                <div className="space-y-2">
                  <span className="text-sm text-neutral-300">{content.toLabel}</span>
                  <div className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200 mb-2">{result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "—"}</div>
                  <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {cat.units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">A Brief History of Measurement Units</h2>
                <p className="mt-3 leading-7">For most of human history, measurement units were based on the human body — a practical but deeply inconsistent approach. The cubit (the distance from elbow to fingertip) was used in ancient Egypt and Mesopotamia, but varied from person to person. The foot (literally the length of a human foot), the inch (width of a thumb), and the yard (distance from nose to outstretched thumb) are all relics of this era. Because these units differed by region, trade was frequently complicated by confusion over how much of something was actually being sold.</p>
                <p className="mt-3 leading-7">The solution came in stages. France introduced the metric system in 1795 following the French Revolution — defining the metre as one ten-millionth of the distance from the equator to the North Pole. In 1875, the Treaty of the Metre established an international bureau (the BIPM) and began the process of global standardisation. The modern SI (International System of Units), established in 1960, is the direct descendant of that effort and is now used by virtually every country in the world for science, medicine, engineering, and trade — with the United States being the most prominent holdout in everyday life.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Metric vs Imperial: The Two Major Systems</h2>
                <p className="mt-3 leading-7">Today the world is largely divided between the metric system (used officially by 195+ countries) and the US Customary system (used in daily life in the US, with imperial variants in the UK for some measurements).</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { name: "Metric (SI)", desc: "Base-10 system. Units scale by powers of ten using prefixes: kilo (×1000), centi (×0.01), milli (×0.001). Consistent and easy to calculate mentally. Used for science worldwide regardless of country." },
                    { name: "US Customary / Imperial", desc: "Historically English. Conversions are arbitrary: 12 inches in a foot, 3 feet in a yard, 1,760 yards in a mile, 16 ounces in a pound, 8 pints in a gallon. Each conversion factor must be memorised." },
                  ].map((t) => (
                    <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Key Conversion Factors to Know</h2>
                <p className="mt-3 leading-7">The following conversions are exact definitions or high-precision values used in science and commerce:</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead><tr className="border-b border-white/10"><th className="py-2 pr-4 text-left font-semibold text-white">Category</th><th className="py-2 text-left font-semibold text-white">Conversion</th></tr></thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">Length</td><td className="py-2">1 inch = 2.54 cm (exact) · 1 mile = 1.609344 km · 1 foot = 30.48 cm</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">Weight</td><td className="py-2">1 pound = 453.592 g · 1 ounce = 28.3495 g · 1 stone = 6.35029 kg</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">Temperature</td><td className="py-2">°C = (°F − 32) × 5/9 · °F = °C × 9/5 + 32 · K = °C + 273.15</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">Volume</td><td className="py-2">1 US gallon = 3.78541 L · 1 UK gallon = 4.54609 L · 1 fl oz (US) = 29.5735 ml</td></tr>
                      <tr><td className="py-2 pr-4">Speed</td><td className="py-2">1 mph = 1.60934 km/h · 1 knot = 1.852 km/h · 1 m/s = 3.6 km/h</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Why Temperature is Different</h2>
                <p className="mt-3 leading-7">Length, weight, and volume conversions involve simple multiplication — you're just scaling along a ratio. Temperature is different because Celsius and Fahrenheit don't share the same zero point. Zero Celsius is 32°F (the freezing point of water), not zero degrees of "cold." This offset requires an addition/subtraction step before or after the multiplication.</p>
                <p className="mt-3 leading-7">The Kelvin scale avoids this problem entirely: it starts at absolute zero (−273.15°C / −459.67°F), the coldest possible temperature. Because Kelvin and Celsius share the same degree size, converting between them is pure addition: K = °C + 273.15. The Rankine scale does the same for Fahrenheit: Ra = °F + 459.67. Kelvin and Rankine conversions are therefore pure multiplications (no offset needed).</p>
                <p className="mt-3 leading-7">A few temperature reference points worth remembering: 0°C = 32°F = 273.15K (water freezes) · 20°C = 68°F (comfortable room temperature) · 37°C = 98.6°F (human body temperature) · 100°C = 212°F = 373.15K (water boils at sea level).</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Common Unit Conversion Mistakes</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Confusing US and UK gallons.</strong> The US gallon (3.785 L) and the UK (imperial) gallon (4.546 L) differ by about 20%. A British recipe calling for "1 gallon of milk" means about 20% more than an American's gallon. This also affects MPG comparisons — UK cars typically show higher MPG figures than US cars for the same fuel efficiency.</li>
                  <li><strong className="text-white">Conflating mass and weight.</strong> Mass (kg, grams) measures the amount of matter. Weight is a force (measured in Newtons) equal to mass × gravitational acceleration. On Earth, we use kg loosely for both, but an astronaut on the Moon has the same mass but weighs 1/6th as much. In engineering and physics, this distinction is critical.</li>
                  <li><strong className="text-white">The NASA Mars Orbiter disaster (1999).</strong> The Mars Climate Orbiter was lost because one engineering team used metric units (Newton-seconds) while another used US Customary units (pound-force-seconds). The resulting trajectory error caused the spacecraft to enter Mars' atmosphere at the wrong angle and disintegrate — a $327 million mistake caused entirely by a unit conversion failure.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between mass and weight?</h3>
                    <p className="mt-1 text-white/70">Mass is the amount of matter in an object, measured in kilograms (SI) or pounds-mass. It doesn't change based on location. Weight is the gravitational force acting on that mass, measured in Newtons. On Earth's surface, 1 kg of mass weighs approximately 9.81 Newtons. Informally, people use "weight" when they mean mass, which is acceptable in everyday contexts but not in physics or engineering.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Why does the United States still use imperial units?</h3>
                    <p className="mt-1 text-white/70">The US has attempted metric conversion multiple times — most notably the Metric Conversion Act of 1975 — but adoption remained voluntary and largely failed. The cost of converting existing infrastructure (road signs, tools, manufacturing equipment), combined with cultural resistance, has kept US Customary units dominant in daily life. US science, medicine, and the military do use metric. The US is one of only three countries (with Myanmar and Liberia) that have not officially adopted the metric system as the primary system.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How can I convert Celsius to Fahrenheit mentally?</h3>
                    <p className="mt-1 text-white/70">A useful approximation: double the Celsius value and add 30. So 20°C ≈ 40 + 30 = 70°F (actual: 68°F). Or 35°C ≈ 70 + 30 = 100°F (actual: 95°F). This is close enough for weather and cooking. For the exact formula: °F = °C × 9/5 + 32. Remember: 0°C = 32°F, 100°C = 212°F.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How do metric prefixes work?</h3>
                    <p className="mt-1 text-white/70">Metric prefixes are multipliers applied to any SI base unit. Common ones: kilo (k) = ×1,000 · centi (c) = ×0.01 · milli (m) = ×0.001 · micro (μ) = ×0.000001 · mega (M) = ×1,000,000 · giga (G) = ×1,000,000,000. So 1 kilometre = 1,000 metres, 1 centimetre = 0.01 metres, 1 milligram = 0.001 grams. The pattern is consistent across all units — length, weight, volume, electricity, etc.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Why are there two different gallons?</h3>
                    <p className="mt-1 text-white/70">The US gallon derives from the Queen Anne wine gallon (1706), which was defined as 231 cubic inches. The UK imperial gallon was defined later in 1824 as the volume of 10 pounds of water, which works out to approximately 277.4 cubic inches (4.546 litres). The US had already established its own standards before the British redefinition, so the two systems diverged. Today: 1 US gallon = 3.785 litres, 1 UK gallon = 4.546 litres.</p>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><ArrowLeftRight className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Categories</h2><p className="text-sm text-neutral-300">6 unit categories.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Length: mm, cm, m, km, in, ft, mi</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Weight: mg, g, kg, oz, lb, stone</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Temperature: °C, °F, K</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Volume, Speed, Area</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
