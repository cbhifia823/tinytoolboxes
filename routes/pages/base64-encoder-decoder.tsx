import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Binary, Copy, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string; title: string; subtitle: string;
  inputLabel: string; outputLabel: string;
  encode: string; decode: string; copy: string; copied: string;
  searchLabel: string; searchPlaceholder: string;
  useCasesTitle: string; useCasesSubtitle: string; useCases: string[];
  suggestionsTitle: string; suggestionsSubtitle: string; suggestions: string[];
}> = {
  en: {
    name: "English", title: "Base64 Encoder / Decoder", subtitle: "Encode text to Base64 or decode Base64 back to plain text. Free, no sign-up.",
    inputLabel: "Input", outputLabel: "Output",
    encode: "Encode", decode: "Decode", copy: "Copy", copied: "Copied!",
    searchLabel: "Search tools", searchPlaceholder: "Try: json, timestamp, password, qr",
    useCasesTitle: "Use cases", useCasesSubtitle: "Where Base64 encoding is used.",
    useCases: ["Embed images inline in HTML/CSS with data URIs.", "Encode API credentials for Basic Auth headers.", "Transfer binary data in JSON payloads."],
    suggestionsTitle: "You may also like", suggestionsSubtitle: "Other developer tools.",
    suggestions: ["JSON Formatter", "URL Encoder / Decoder", "QR Code Generator"],
  },
  "zh-hk": {
    name: "繁體中文", title: "Base64 編碼／解碼器", subtitle: "將文字轉做 Base64 或將 Base64 還原。免費、唔使註冊。",
    inputLabel: "輸入", outputLabel: "輸出",
    encode: "編碼", decode: "解碼", copy: "複製", copied: "已複製！",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：json、timestamp、password、qr",
    useCasesTitle: "使用情境", useCasesSubtitle: "Base64 編碼嘅常見用途。",
    useCases: ["喺 HTML/CSS 用 data URI 嵌入圖片。", "編碼 API 憑證做 Basic Auth。", "喺 JSON 入面傳送 binary 數據。"],
    suggestionsTitle: "你可能會喜歡", suggestionsSubtitle: "其他開發者工具。",
    suggestions: ["JSON 格式化", "URL 編碼／解碼", "QR 碼產生器"],
  },
  "zh-cn": {
    name: "简体中文", title: "Base64 编码／解码器", subtitle: "将文字转为 Base64 或将 Base64 还原。免费、不用注册。",
    inputLabel: "输入", outputLabel: "输出",
    encode: "编码", decode: "解码", copy: "复制", copied: "已复制！",
    searchLabel: "搜索工具", searchPlaceholder: "例如：json、timestamp、password、qr",
    useCasesTitle: "使用场景", useCasesSubtitle: "Base64 编码的常见用途。",
    useCases: ["在 HTML/CSS 用 data URI 嵌入图片。", "编码 API 凭证做 Basic Auth。", "在 JSON 中传送 binary 数据。"],
    suggestionsTitle: "你可能会喜欢", suggestionsSubtitle: "其他开发者工具。",
    suggestions: ["JSON 格式化", "URL 编码／解码", "二维码生成器"],
  },
  es: {
    name: "Español", title: "Codificador Base64", subtitle: "Codifica texto a Base64 o decodifica de vuelta. Gratis, sin registro.",
    inputLabel: "Entrada", outputLabel: "Salida",
    encode: "Codificar", decode: "Decodificar", copy: "Copiar", copied: "¡Copiado!",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: json, timestamp, password, qr",
    useCasesTitle: "Casos de uso", useCasesSubtitle: "Dónde se usa la codificación Base64.",
    useCases: ["Insertar imágenes en HTML/CSS con data URIs.", "Codificar credenciales para Basic Auth.", "Transferir datos binarios en JSON."],
    suggestionsTitle: "También te puede interesar", suggestionsSubtitle: "Otras herramientas para desarrolladores.",
    suggestions: ["Formateador JSON", "Codificador URL", "Generador QR"],
  },
};

const TOOLS = [
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化", "zh-cn": "JSON 格式化", es: "Formateador JSON" }, href: "/json-formatter", keywords: ["json"] },
  { title: { en: "Unix Timestamp Converter", "zh-hk": "Unix 時間戳轉換器", "zh-cn": "Unix 时间戳转换器", es: "Conversor timestamp Unix" }, href: "/unix-timestamp-converter", keywords: ["timestamp", "unix"] },
  { title: { en: "Color Palette Generator", "zh-hk": "調色板產生器", "zh-cn": "调色板生成器", es: "Generador de paletas" }, href: "/color-palette-generator", keywords: ["color", "palette"] },
  { title: { en: "Meta Tag Preview", "zh-hk": "Meta Tag 預覽", "zh-cn": "Meta 标签预览", es: "Vista previa meta tags" }, href: "/meta-tag-preview", keywords: ["meta", "seo"] },
  { title: { en: "Password Generator", "zh-hk": "密碼產生器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, href: "/password-generator", keywords: ["password"] },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼產生器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator", keywords: ["qr"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/base64-encoder-decoder";

function applySEO(o: { title: string; description: string; path: string }) {
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
  const data = { "@context": "https://schema.org", "@type": "WebApplication", name: o.title, url, description: o.description, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } };
  const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s);
}

export default function Base64EncoderDecoder() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleKey | null;
    return saved && LANGUAGES[saved] ? saved : "en";
  });
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    document.documentElement.lang = locale;
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH });
  }, [locale]);

  const content = LANGUAGES[locale];
  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => `${t.title[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [search]);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setOutput("Error: invalid input for Base64 encoding");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setOutput("Error: invalid Base64 string");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
            <div>
              <div className="flex items-center gap-2"><span className="text-base font-semibold tracking-wide text-white">TinyToolboxes</span><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span></div>
              <p className="text-sm text-white/50">Boring, useful, searchable.</p>
            </div>
          </a>
          <div className="flex flex-wrap items-center gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === key ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>
      </header>

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Binary className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
              <div className="space-y-3">
                <label className="block space-y-2">
                  <span className="text-sm text-neutral-300">{content.inputLabel}</span>
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none focus:border-emerald-400/60 resize-y" placeholder="Type or paste text here..." />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button onClick={encode} className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-5 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/30">{content.encode}</button>
                  <button onClick={decode} className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10">{content.decode}</button>
                </div>
              </div>

              {output && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">{content.outputLabel}</span>
                    <button onClick={copyOutput} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10">
                      <Copy className="h-3.5 w-3.5" />{copied ? content.copied : content.copy}
                    </button>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 max-h-64 overflow-auto">
                    <pre className="text-sm text-white whitespace-pre-wrap break-all font-mono">{output}</pre>
                  </div>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">Advertisement</p><p className="mt-1 text-sm text-white/55">Google Ads space reserved</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">Reserved</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Binary className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2><p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
            </div>
            <hr className="border-white/10" />
            <h2 className="text-lg font-semibold">{content.suggestionsTitle}</h2>
            <p className="text-sm text-neutral-300">{content.suggestionsSubtitle}</p>
            <div className="space-y-2">
              {content.suggestions.map((name) => {
                const match = TOOLS.find((t) => t.title[locale] === name);
                return match ? <a key={name} href={match.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"><span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" /></a> : null;
              })}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
