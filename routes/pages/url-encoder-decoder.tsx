import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Code2, Search, Link2 } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "URL Encoder / Decoder",
    subtitle: "Encode and decode URLs instantly with a simple URL encoder and decoder.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: weight, day, invoice, word",
    searchHint: "Search hints",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "Advertisement",
adBadge: "Reserved",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "URL 編碼／解碼",
    subtitle: "即時將 URL 轉做編碼或還原。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：體積重量、工作日、發票、字數",
    searchHint: "搜尋提示",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "廣告", adBadge: "已預留",
  },
  "zh-cn": {
    name: "简体中文",
    title: "URL 编码／解码",
    subtitle: "立即将 URL 进行编码或还原。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：体积重量、工作日、发票、字数",
    searchHint: "搜索提示",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "广告", adBadge: "已预留",
  },
  es: {
    name: "Español",
    title: "Codificador / decodificador de URL",
    subtitle: "Codifica o decodifica URLs al instante con una herramienta simple.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: weight, day, invoice, word",
    searchHint: "Sugerencias de búsqueda",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "Advertisement",
adBadge: "Reserved",
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age.", "zh-hk": "計算準確年齡。", "zh-cn": "计算准确年龄。", es: "Calcula la edad exacta." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "計算一個數嘅百分比。", "zh-cn": "计算一个数的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "計算兩日期間嘅日數。", "zh-cn": "计算两日期间的天数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", es: "Calculadora de peso volumétrico" }, description: { en: "Dimensional weight for parcels.", "zh-hk": "計算包裹體積重量。", "zh-cn": "计算包裹体积重量。", es: "Peso dimensional para paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "加工作日至任何日期。", "zh-cn": "加工作日到任何日期。", es: "Agrega días hábiles." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies.", "zh-hk": "轉換 30 種以上貨幣。", "zh-cn": "转换 30 种以上货币。", es: "Convierte 30+ monedas." }, href: "/currency-converter", keywords: ["currency", "exchange"] },
];

function SearchBox({ locale, value, onChange, onNavigate }: { locale: keyof typeof LANGUAGES; value: string; onChange: (value: string) => void; onNavigate: (href: string) => void; }) {
  const hints = locale === "zh-hk" ? ["體積重量", "工作日", "發票", "字數"] : locale === "zh-cn" ? ["体积重量", "工作日", "发票", "字数"] : locale === "es" ? ["weight", "day", "invoice", "word"] : ["weight", "day", "invoice", "word"];
  const filtered = TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 4);
  return (
    <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/80">{LANGUAGES[locale].searchLabel}</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-emerald-300" />
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={LANGUAGES[locale].searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">{hints.map((hint) => <button key={hint} type="button" onClick={() => onChange(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10">{hint}</button>)}</div>
      <div className="mt-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">{LANGUAGES[locale].searchHint}</p>
        <div className="grid gap-2">{filtered.map((tool) => <button key={tool.href} type="button" onClick={() => onNavigate(tool.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-300/30 hover:bg-white/10"><div><p className="text-sm font-medium text-white">{tool.title[locale]}</p><p className="mt-1 text-xs text-white/55">{tool.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
      </div>
    </section>
  );
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/url-encoder-decoder";

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

export default function UrlEncoderDecoder() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => (typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en")));
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const encoded = useMemo(() => { try { return encodeURIComponent(input); } catch { return ""; } }, [input]);
  const decoded = useMemo(() => { try { return decodeURIComponent(input); } catch { return "Invalid encoded text"; } }, [input]);
  const content = LANGUAGES[locale];
  const shownTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return TOOLS;
    return TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(query));
  }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Code2 className="h-5 w-5 text-emerald-300" /></div><div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div></div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5"><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div><div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div></div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">Input</span>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className="w-full rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-white outline-none focus:border-emerald-400/60" />
              </label>
              <div className="mt-5 grid gap-4"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Encoded</p><p className="mt-2 break-words text-sm text-white">{encoded}</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Decoded</p><p className="mt-2 break-words text-sm text-white">{decoded}</p></div></div>
            </div>

            <SearchBox locale={locale} value={search} onChange={setSearch} onNavigate={(href) => (window.location.href = href)} />

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">What is URL Encoding?</h2>
                <p className="mt-3 leading-7">URLs can only safely contain a limited subset of ASCII characters. Letters (A–Z, a–z), digits (0–9), and a handful of unreserved symbols like hyphens, underscores, periods, and tildes are safe to use as-is. Everything else — spaces, ampersands, equals signs, hash symbols, non-ASCII characters like Chinese or Arabic script, and many punctuation marks — must be transformed before they can appear in a URL.</p>
                <p className="mt-3 leading-7">This transformation is called percent-encoding (commonly called URL encoding). It is defined in RFC 3986, the specification that governs the syntax of Uniform Resource Identifiers. The standard divides URL characters into "reserved" (which have special meaning in URL structure, like / and ?) and "unreserved" (safe anywhere). Reserved characters must be encoded when used outside their intended structural role — for example, an ampersand in a query parameter value must become %26 so it is not mistaken for a parameter separator.</p>
                <p className="mt-3 leading-7">Without URL encoding, a URL like <span className="font-mono text-emerald-200">https://example.com/search?q=hello world&amp;lang=en</span> would be ambiguous to a web server, because the space and ampersand are structurally meaningful characters. Encoding it produces <span className="font-mono text-emerald-200">https://example.com/search?q=hello%20world&amp;lang=en</span>, which is unambiguous.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">How Percent-Encoding Works</h2>
                <p className="mt-3 leading-7">The mechanics of percent-encoding are straightforward. Each character that needs to be encoded is first converted to its byte representation in UTF-8. Then each byte is written as a percent sign followed by two hexadecimal digits representing that byte's value.</p>
                <p className="mt-3 leading-7">For ASCII characters, this is simple: the character's ASCII code is its UTF-8 value. A space (ASCII 32, hex 20) becomes <span className="font-mono text-emerald-200">%20</span>. The at-sign @ (ASCII 64, hex 40) becomes <span className="font-mono text-emerald-200">%40</span>. A forward slash / (ASCII 47, hex 2F) becomes <span className="font-mono text-emerald-200">%2F</span>.</p>
                <p className="mt-3 leading-7">For non-ASCII characters, the process involves UTF-8 encoding first. The Chinese character 你 (U+4F60) is encoded in UTF-8 as three bytes: E4 BD A0. Percent-encoded, it becomes <span className="font-mono text-emerald-200">%E4%BD%A0</span>. This is why URLs containing Chinese, Arabic, or accented characters appear as long strings of percent-encoded sequences in browser address bars when copied as plain text.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Common Encoded Characters Reference</h2>
                <p className="mt-3 leading-7">Here are the most frequently encountered percent-encoded characters:</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 text-left font-semibold text-white">Character</th>
                        <th className="py-2 pr-4 text-left font-semibold text-white">Encoded</th>
                        <th className="py-2 text-left font-semibold text-white">Character</th>
                        <th className="py-2 text-left font-semibold text-white">Encoded</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">space</td><td className="py-2 pr-4 text-emerald-200">%20</td><td className="py-2 pr-4">*</td><td className="py-2 text-emerald-200">%2A</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">!</td><td className="py-2 pr-4 text-emerald-200">%21</td><td className="py-2 pr-4">+</td><td className="py-2 text-emerald-200">%2B</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">#</td><td className="py-2 pr-4 text-emerald-200">%23</td><td className="py-2 pr-4">,</td><td className="py-2 text-emerald-200">%2C</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">$</td><td className="py-2 pr-4 text-emerald-200">%24</td><td className="py-2 pr-4">/</td><td className="py-2 text-emerald-200">%2F</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">&amp;</td><td className="py-2 pr-4 text-emerald-200">%26</td><td className="py-2 pr-4">:</td><td className="py-2 text-emerald-200">%3A</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">'</td><td className="py-2 pr-4 text-emerald-200">%27</td><td className="py-2 pr-4">;</td><td className="py-2 text-emerald-200">%3B</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">(</td><td className="py-2 pr-4 text-emerald-200">%28</td><td className="py-2 pr-4">=</td><td className="py-2 text-emerald-200">%3D</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">)</td><td className="py-2 pr-4 text-emerald-200">%29</td><td className="py-2 pr-4">?</td><td className="py-2 text-emerald-200">%3F</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4">@</td><td className="py-2 pr-4 text-emerald-200">%40</td><td className="py-2 pr-4">[</td><td className="py-2 text-emerald-200">%5B</td></tr>
                      <tr><td className="py-2 pr-4">]</td><td className="py-2 pr-4 text-emerald-200">%5D</td><td className="py-2 pr-4"></td><td className="py-2"></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">When Do You Need URL Encoding?</h2>
                <p className="mt-3 leading-7">URL encoding is needed whenever special characters appear in a context where they would otherwise be misinterpreted. Common situations include:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><span><strong className="text-white">Search query parameters.</strong> Google encodes your search terms: searching "hello world" becomes <span className="font-mono text-emerald-200">?q=hello+world</span> or <span className="font-mono text-emerald-200">?q=hello%20world</span>. Without encoding, the space would break the URL structure.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><span><strong className="text-white">HTML form submissions.</strong> When a user submits a form, the browser encodes the input data before sending it as a query string or request body.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><span><strong className="text-white">API requests with special characters.</strong> If an API parameter value contains an ampersand, equals sign, or slash, those must be encoded so the server parses the parameters correctly.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><span><strong className="text-white">Non-ASCII content in URLs.</strong> Sharing a link to a page with a Chinese or Arabic title requires encoding the non-ASCII characters so the URL is valid on all systems.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><span><strong className="text-white">Email links with pre-filled subjects or bodies.</strong> A mailto link like <span className="font-mono text-emerald-200">mailto:?subject=Hello%20World&amp;body=See%20this%3A</span> requires encoding so email clients parse it correctly.</span></li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">URL Encoding vs Base64 Encoding</h2>
                <p className="mt-3 leading-7">URL encoding and Base64 encoding are both ways of representing data as text, but they serve entirely different purposes and should not be confused.</p>
                <p className="mt-3 leading-7">URL encoding is designed to make arbitrary text safe for use inside a URL. It is human-readable for ASCII characters — a percent-encoded URL is still mostly legible. It only transforms characters that would be problematic in a URL context. The output is always longer than the input, but only slightly so for ASCII text.</p>
                <p className="mt-3 leading-7">Base64 encoding converts arbitrary binary data (including images, files, and binary protocols) into a string of 64 safe ASCII characters. It is used for embedding images directly into HTML or CSS, encoding email attachments in MIME format, and transmitting JSON Web Tokens (JWTs). Base64 increases data size by approximately 33% and produces output that is completely unreadable without decoding. It is the wrong tool for encoding URLs and the right tool for encoding binary payloads.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between %20 and + for spaces in URLs?</h3>
                    <p className="mt-1 text-white/70">Both represent a space, but in different contexts. <span className="font-mono text-emerald-200">%20</span> is the strict percent-encoding of a space and is valid anywhere in a URL. A plus sign <span className="font-mono text-emerald-200">+</span> represents a space only in the query string portion of a URL, as defined by the application/x-www-form-urlencoded format used by HTML forms. In a URL path, a literal <span className="font-mono text-emerald-200">+</span> is not a space — it is a plus sign. This distinction matters when constructing URLs manually.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Why does a URL sometimes have %E4%B8%AD instead of actual Chinese characters?</h3>
                    <p className="mt-1 text-white/70">The Chinese character 中 (U+4E2D) is encoded in UTF-8 as the bytes E4 B8 AD. Percent-encoding each byte gives <span className="font-mono text-emerald-200">%E4%B8%AD</span>. Modern browsers display the decoded characters in the address bar for readability, but the underlying URL that gets sent to servers and stored in links is the percent-encoded form.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Is URL encoding the same as HTML entity encoding?</h3>
                    <p className="mt-1 text-white/70">No. HTML entity encoding replaces characters with HTML entities like <span className="font-mono text-emerald-200">&amp;amp;</span> for &amp; or <span className="font-mono text-emerald-200">&amp;lt;</span> for &lt;. It is used inside HTML documents to prevent characters from being interpreted as HTML markup. URL encoding is entirely separate and used to make characters safe within a URL. The two systems have different character sets, different escaping syntax, and different use cases.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Can I use this tool to decode a URL I found in a browser's address bar?</h3>
                    <p className="mt-1 text-white/70">Yes. Paste the encoded URL or query string into the input box and the decoded version will appear immediately. This is useful for reading search queries, understanding redirect URLs, or inspecting API endpoints that contain encoded parameters.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What characters are "safe" and don't need encoding in a URL?</h3>
                    <p className="mt-1 text-white/70">RFC 3986 defines unreserved characters as: uppercase and lowercase letters A–Z and a–z, digits 0–9, hyphen (-), underscore (_), period (.), and tilde (~). These characters never need to be percent-encoded. All other characters, including those with special structural meaning in URLs (/, ?, #, &amp;, =) and all non-ASCII characters, should be encoded when used as literal data values.</p>
                  </div>
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">AdSense space reserved</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div><div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" /></section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3 text-white"><Link2 className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Quick use</h2><p className="text-sm text-neutral-300">For links, query strings, and parameters.</p></div></div><div className="space-y-3 text-sm text-neutral-300"><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Paste a raw URL to encode it.</p><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Paste encoded text to decode it.</p></div></aside>
        </div>
      </section>
    </main>
  );
}
