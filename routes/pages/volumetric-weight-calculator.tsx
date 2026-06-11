import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Calculator, Globe2, Search, Scale, Sparkles, Truck } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
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
  adNote: string;
  sectionTitle: string;
  sectionSubtitle: string;
  footer: string;
  searchFooter: string;
}> = {
  en: {
    collection: "TinyToolboxes collection",
    title: "Volumetric Weight Calculator",
    subtitle: "Calculate dimensional weight for parcels, boxes, and shipments.",
    heroNote: "Fast, boring, and useful.",
    searchLabel: "Search the collection",
    searchPlaceholder: "Try: weight, date, word, url, rhyme",
    searchHints: ["weight", "date", "word", "url", "rhyme"],
    adNote: "Drop AdSense here later without changing the layout.",
    sectionTitle: "Calculator",
    sectionSubtitle: "Enter dimensions, choose units, and get dimensional weight instantly.",
    footer: "TinyToolboxes",
    searchFooter: "Search hints are at the bottom of every page.",
  },
  "zh-hk": {
    collection: "TinyToolboxes 系列",
    title: "體積重量計算器",
    subtitle: "用嚟計包裹、紙箱同貨件嘅體積重量。",
    heroNote: "夠快、夠無聊、夠實用。",
    searchLabel: "搜尋系列",
    searchPlaceholder: "例如：體積重量、日期、字數、URL、押韻",
    searchHints: ["體積重量", "日期", "字數", "URL", "押韻"],
    adNote: "之後直接放 AdSense，唔使改版面。",
    sectionTitle: "計算器",
    sectionSubtitle: "輸入尺寸、選單位，即刻得出體積重量。",
    footer: "TinyToolboxes",
    searchFooter: "搜尋提示會放喺每頁底部。",
  },
  "zh-cn": {
    collection: "TinyToolboxes 系列",
    title: "体积重量计算器",
    subtitle: "用于计算包裹、纸箱和货件的体积重量。",
    heroNote: "够快、够无聊、够实用。",
    searchLabel: "搜索系列",
    searchPlaceholder: "例如：体积重量、日期、字数、URL、押韵",
    searchHints: ["体积重量", "日期", "字数", "URL", "押韵"],
    adNote: "以后直接放 AdSense，不用改布局。",
    sectionTitle: "计算器",
    sectionSubtitle: "输入尺寸、选择单位，立即得到体积重量。",
    footer: "TinyToolboxes",
    searchFooter: "搜索提示会放在每个页面底部。",
  },
  es: {
    collection: "Colección TinyToolboxes",
    title: "Calculadora de peso volumétrico",
    subtitle: "Calcula el peso dimensional de paquetes, cajas y envíos.",
    heroNote: "Rápido, aburrido y útil.",
    searchLabel: "Buscar la colección",
    searchPlaceholder: "Prueba: weight, date, word, url, rhyme",
    searchHints: ["weight", "date", "word", "url", "rhyme"],
    adNote: "Luego puedes poner AdSense sin cambiar el diseño.",
    sectionTitle: "Calculadora",
    sectionSubtitle: "Introduce las medidas, elige las unidades y obtiene el peso dimensional al instante.",
    footer: "TinyToolboxes",
    searchFooter: "Las sugerencias de búsqueda están al final de cada página.",
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

function AdBlock({ title, note }: { title: string; note: string }) {
  return (
    <section className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/75">
      <div className="flex items-center gap-2 text-emerald-200"><BadgeDollarSign className="h-4 w-4" /><span className="font-medium">{title}</span></div>
      <p className="mt-2 text-white/55">{note}</p>
      <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
    </section>
  );
}

function SearchBar({ locale }: { locale: LocaleKey }) {
  const copy = COPY[locale];
  const [query, setQuery] = useState("");
  const rawLinks = [
    { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", es: "Calculadora de peso volumétrico" }, href: "/volumetric-weight-calculator" },
    { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, href: "/business-day-calculator" },
    { title: { en: "Invoice Due Date Calculator", "zh-hk": "發票到期日計算機", "zh-cn": "发票到期日计算器", es: "Calculadora de fecha de vencimiento" }, href: "/invoice-due-date-calculator" },
    { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, href: "/word-counter" },
    { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼器", "zh-cn": "URL 编解码器", es: "Codificador/Decodificador URL" }, href: "/url-encoder-decoder" },
    { title: { en: "Rhyme Zone", "zh-hk": "押韻區", "zh-cn": "押韵区", es: "Zona de rimas" }, href: "/rhyme-zone" },
  ]; const filtered = rawLinks.map(l => ({ title: l.title[locale] || l.title.en, href: l.href })).filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-medium text-emerald-300">{copy.searchLabel}</p><p className="mt-1 text-sm text-white/60">{copy.searchFooter}</p></div>
        <div className="text-xs text-white/45">{copy.adLabel}</div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.searchPlaceholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" /></div>
      <div className="mt-4 flex flex-wrap gap-2">{copy.searchHints.map((hint) => (<button key={hint} onClick={() => setQuery(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-emerald-300/40 hover:bg-emerald-300/10">{hint}</button>))}</div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((tool) => (<a key={tool.href} href={tool.href} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-emerald-300/40 hover:bg-white/5"><div className="rounded-xl bg-emerald-300/10 p-2 text-emerald-200"><Calculator className="h-4 w-4" /></div><div className="min-w-0"><p className="font-medium text-white group-hover:text-emerald-100">{tool.title[locale]}</p></div></a>))}</div>
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

export default function VolumetricWeightCalculator() {
  const [locale, setLocale] = useState<LocaleKey>("en");
  const [carrier, setCarrier] = useState<CarrierId>("generic");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("20");

  useEffect(() => {
    const L = COPY[locale];
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
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL },
      },
    });
  }, [locale]);

  const divisor = carrier === "ups" || carrier === "fedex" || carrier === "dhl" ? (unit === "cm" ? 5000 : 139) : (unit === "cm" ? 6000 : 166);
  const weight = useMemo(() => calculateDimensionalWeight(parseNumber(length), parseNumber(width), parseNumber(height), divisor), [length, width, height, divisor]);
  const copy = COPY[locale];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#163028_0%,#091016_28%,#05070b_100%)] text-white">
      <Header locale={locale} onLocaleChange={setLocale} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-emerald-200"><Sparkles className="h-4 w-4" /><span>{copy.collection}</span></div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">{copy.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60"><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">UPS · FedEx · DHL · Generic</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">cm &amp; inches</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Free to use</span></div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <AdBlock title={copy.adLabel} note={copy.adNote} />
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">{copy.sectionTitle}</h2><p className="mt-1 text-sm text-white/60">{copy.sectionSubtitle}</p></div><a href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-emerald-300/40 hover:bg-emerald-300/10">Back to collection <ArrowRight className="h-4 w-4" /></a></div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-white/70"><span>Carrier</span><select value={carrier} onChange={(e) => setCarrier(e.target.value as CarrierId)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"><option value="generic">Generic / Volumetric</option><option value="ups">UPS</option><option value="fedex">FedEx</option><option value="dhl">DHL</option></select></label>
                <label className="space-y-2 text-sm text-white/70"><span>Units</span><select value={unit} onChange={(e) => setUnit(e.target.value as "cm" | "in")} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"><option value="cm">Centimetres</option><option value="in">Inches</option></select></label>
                <label className="space-y-2 text-sm text-white/70"><span>Length</span><input value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <label className="space-y-2 text-sm text-white/70"><span>Width</span><input value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <label className="space-y-2 text-sm text-white/70"><span>Height</span><input value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none" /></label>
                <div className="space-y-2 text-sm text-white/70"><span>Dimensional weight</span><div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-xl font-bold text-emerald-100">{weight.toFixed(2)} {unit === "cm" ? "kg" : "lb"}</div></div>
              </div>
            </section>
            <SearchBar locale={locale} />

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">What is Dimensional (Volumetric) Weight?</h2>
                <p className="mt-3 leading-7">Dimensional weight, also called volumetric weight or DIM weight, is a pricing technique used by major shipping carriers including UPS, FedEx, DHL, and most air freight services. Instead of charging purely by actual weight, carriers calculate a theoretical weight based on the package's volume. They then charge whichever is higher: the actual weight or the dimensional weight.</p>
                <p className="mt-3 leading-7">The reason carriers use dimensional weight is simple economics. A large, lightweight package — such as a box of pillows or foam packaging material — takes up as much space in a truck or aircraft as a heavy package, but contributes far less revenue if billed by actual weight alone. Dimensional weight pricing ensures that carriers are compensated fairly for the space a package occupies.</p>
                <p className="mt-3 leading-7">For shippers, understanding dimensional weight is essential for accurate freight budgeting. Many businesses are surprised when their shipping bill is higher than expected because a lightweight package was billed at its dimensional weight instead of its actual weight.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">How to Calculate Dimensional Weight</h2>
                <p className="mt-3 leading-7">The formula for dimensional weight is straightforward:</p>
                <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4 font-mono text-emerald-100">
                  Dimensional Weight = (Length × Width × Height) ÷ Divisor
                </div>
                <p className="mt-4 leading-7">The divisor varies by carrier and the units you use:</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 text-left font-semibold text-white">Carrier</th>
                        <th className="py-2 pr-4 text-left font-semibold text-white">Divisor (cm)</th>
                        <th className="py-2 text-left font-semibold text-white">Divisor (inches)</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">UPS</td><td className="py-2 pr-4">5,000</td><td className="py-2">139</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">FedEx</td><td className="py-2 pr-4">5,000</td><td className="py-2">139</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">DHL</td><td className="py-2 pr-4">5,000</td><td className="py-2">139</td></tr>
                      <tr><td className="py-2 pr-4">Generic / Air Freight</td><td className="py-2 pr-4">6,000</td><td className="py-2">166</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 leading-7">Example: A box measuring 60 cm × 40 cm × 30 cm shipped via UPS has a dimensional weight of (60 × 40 × 30) ÷ 5,000 = 14.4 kg. If the actual weight of the box is 5 kg, UPS will charge based on the dimensional weight of 14.4 kg.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">When Does Dimensional Weight Apply?</h2>
                <p className="mt-3 leading-7">For UPS and FedEx domestic shipments, dimensional weight applies to all packages. For DHL, dimensional weight applies to all Express shipments. The carrier compares the actual weight and the dimensional weight and bills the higher value — this is known as the "billable weight."</p>
                <p className="mt-3 leading-7">Common scenarios where dimensional weight exceeds actual weight include:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Clothing, pillows, stuffed animals, and other soft goods in large boxes</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Electronics with large amounts of foam or air-filled packaging</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Flat-pack furniture and oversized printed materials</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Subscription boxes with branded packaging that is larger than necessary</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Any package where the density is less than about 167 kg/m³ (for UPS/FedEx/DHL)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Tips to Reduce Dimensional Weight Charges</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Use right-sized boxes.</strong> Avoid shipping small items in oversized boxes. The closer the box size is to the product dimensions, the lower the dimensional weight will be.</li>
                  <li><strong className="text-white">Reduce packaging material.</strong> Use only the amount of padding needed to protect the item. Air pillows and foam take up space without adding weight.</li>
                  <li><strong className="text-white">Consider flat-rate options.</strong> For packages under certain weight thresholds, flat-rate boxes from USPS or similar programs may be cheaper than dimensional weight pricing.</li>
                  <li><strong className="text-white">Negotiate carrier rates.</strong> High-volume shippers can negotiate custom divisors and rates with carriers. A custom divisor of 6,000 instead of 5,000 would reduce all dimensional weight calculations by 17%.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between dimensional weight and actual weight?</h3>
                    <p className="mt-1 text-white/70">Actual weight is what the package physically weighs on a scale. Dimensional weight is a calculated value based on the package's volume divided by a carrier-specific divisor. Carriers charge based on whichever is higher.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Why does UPS use a divisor of 5,000 instead of 6,000?</h3>
                    <p className="mt-1 text-white/70">The divisor of 5,000 (for centimetres) is a commercial standard adopted by most major international express carriers. A lower divisor means the dimensional weight calculation produces a higher result, which favours the carrier. Some freight services use 6,000 as a more lenient calculation for regular parcel services.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Does dimensional weight apply to USPS shipments?</h3>
                    <p className="mt-1 text-white/70">USPS applies dimensional weight pricing to Priority Mail and Priority Mail Express packages in boxes larger than a cubic foot (1,728 cubic inches). It does not apply to First-Class Mail or Media Mail.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How do I convert between kilograms and pounds for dimensional weight?</h3>
                    <p className="mt-1 text-white/70">If you calculate dimensional weight in centimetres, the result is in kilograms. If you use inches, the result is in pounds (using divisors of 139 for UPS/FedEx/DHL or 166 for generic). Use our Unit Converter to switch between kg and lb if needed.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Can I use this calculator for international shipments?</h3>
                    <p className="mt-1 text-white/70">Yes. The dimensional weight formula and divisors are the same for international express shipments with UPS, FedEx, and DHL. However, for international freight (sea or air cargo), different rules and divisors may apply — always confirm with your freight forwarder.</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start"><AdBlock title={copy.adLabel} note={copy.adNote} /></aside>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45"><span>{copy.footer}</span><span>{copy.searchFooter}</span></footer>
      </section>
    </main>
  );
}
