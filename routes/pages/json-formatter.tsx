import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Braces, Copy, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  inputLabel: string;
  formattedLabel: string;
  validate: string;
  validateLabel: string;
  copyBtn: string;
  copied: string;
  formatBtn: string;
  compactBtn: string;
  error: string;
  valid: string;
  invalid: string;
  suggestionsTitle: string;
  suggestions: string[];
  useCasesTitle: string;
  useCases: string[];
}> = {
  en: {
    name: "English", title: "JSON Formatter", subtitle: "Format, validate, and beautify JSON strings instantly. Paste messy JSON, get clean output.",
    searchLabel: "Search tools", searchPlaceholder: "Try: password, case, tip, discount",
    inputLabel: "Paste JSON", formattedLabel: "Formatted JSON", validate: "Validate", validateLabel: "Validation",
    copyBtn: "Copy", copied: "Copied!", formatBtn: "Format", compactBtn: "Compact", error: "Error", valid: "Valid JSON", invalid: "Invalid JSON",
    suggestionsTitle: "You may also like", suggestions: ["Password Generator", "Case Converter", "QR Code Generator"],
    useCasesTitle: "Use cases", useCases: ["API debugging and testing.", "Reading minified JSON responses.", "Preparing JSON for documentation."],
  },
  "zh-hk": {
    name: "繁體中文", title: "JSON 格式化器", subtitle: "即時格式化、驗證同美化 JSON。貼入混亂 JSON，輸出整齊格式。",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：密碼、大小寫、貼士、折扣",
    inputLabel: "貼入 JSON", formattedLabel: "格式化 JSON", validate: "驗證", validateLabel: "驗證結果",
    copyBtn: "複製", copied: "已複製！", formatBtn: "格式化", compactBtn: "壓縮", error: "錯誤", valid: "有效 JSON", invalid: "無效 JSON",
    suggestionsTitle: "你可能會喜歡", suggestions: ["密碼生成器", "大小寫轉換器", "QR 碼生成器"],
    useCasesTitle: "用途", useCases: ["API 除錯同測試。", "閱讀壓縮嘅 JSON 回應。", "準備 JSON 用於文檔。"],
  },
  "zh-cn": {
    name: "简体中文", title: "JSON 格式化器", subtitle: "即时格式化、验证和美化 JSON。粘贴混乱 JSON，输出整齐格式。",
    searchLabel: "搜索工具", searchPlaceholder: "例如：密码、大小写、小费、折扣",
    inputLabel: "粘贴 JSON", formattedLabel: "格式化 JSON", validate: "验证", validateLabel: "验证结果",
    copyBtn: "复制", copied: "已复制！", formatBtn: "格式化", compactBtn: "压缩", error: "错误", valid: "有效 JSON", invalid: "无效 JSON",
    suggestionsTitle: "你可能会喜欢", suggestions: ["密码生成器", "大小写转换器", "QR 码生成器"],
    useCasesTitle: "用途", useCases: ["API 调试和测试。", "阅读压缩的 JSON 响应。", "准备 JSON 用于文档。"],
  },
  es: {
    name: "Español", title: "Formateador JSON", subtitle: "Formatea, valida y embellece cadenas JSON al instante. Pega JSON desordenado, obtén salida limpia.",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: password, case, tip, discount",
    inputLabel: "Pega JSON", formattedLabel: "JSON formateado", validate: "Validar", validateLabel: "Validación",
    copyBtn: "Copiar", copied: "¡Copiado!", formatBtn: "Formatear", compactBtn: "Compactar", error: "Error", valid: "JSON válido", invalid: "JSON inválido",
    suggestionsTitle: "También te puede interesar", suggestions: ["Generador de contraseñas", "Conversor de mayúsculas", "Generador de QR"],
    useCasesTitle: "Casos de uso", useCases: ["Depuración y pruebas de API.", "Lectura de respuestas JSON comprimidas.", "Preparación de JSON para documentación."],
  },
};

const TOOLS = [
  { title: { en: "Password Generator", "zh-hk": "密碼生成器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, description: { en: "Generate strong passwords.", "zh-hk": "生成安全密碼。", "zh-cn": "生成安全密码。", es: "Genera contraseñas seguras." }, href: "/password-generator", keywords: ["password"] },
  { title: { en: "Case Converter", "zh-hk": "大小寫轉換器", "zh-cn": "大小写转换器", es: "Conversor de mayúsculas" }, description: { en: "Convert text case.", "zh-hk": "轉換文字大小寫。", "zh-cn": "转换文字大小写。", es: "Convierte mayúsculas/minúsculas." }, href: "/case-converter", keywords: ["case"] },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼生成器", "zh-cn": "QR 码生成器", es: "Generador de QR" }, description: { en: "Generate QR codes from text or links.", "zh-hk": "用文字或連結生成 QR 碼。", "zh-cn": "用文字或链接生成 QR 码。", es: "Genera códigos QR desde texto o enlaces." }, href: "/qr-code-generator", keywords: ["qr"] },
  { title: { en: "Tip Calculator", "zh-hk": "貼士計算機", "zh-cn": "小费计算器", es: "Calculadora de propinas" }, description: { en: "Calculate tips fast.", "zh-hk": "快速計算貼士。", "zh-cn": "快速计算小费。", es: "Calcula propinas rápido." }, href: "/tip-calculator", keywords: ["tip"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/json-formatter";

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
  const meta = (name: string, content: string) => upsert('meta[name="'+name+'"]', () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) => upsert('meta[property="'+p+'"]', () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) { const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]; arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); }); }
}

export default function JsonFormatter() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [input, setInput] = useState('{"name":"TinyToolboxes","tools":["calculator","converter"]}');
  const [indent, setIndent] = useState(2);
  const [compact, setCompact] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const { output, error, isValid } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null, isValid: false };
    try {
      const parsed = JSON.parse(input);
      const out = compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      return { output: out, error: null, isValid: true };
    } catch (e: any) {
      return { output: "", error: e.message, isValid: false };
    }
  }, [input, indent, compact]);

  const content = LANGUAGES[locale];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.description[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search]);

  async function doCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Braces className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={"rounded-full border px-3 py-2 text-sm transition " + (locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCompact(false)} className={"rounded-full border px-4 py-2 text-sm transition " + (!compact ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>{content.formatBtn}</button>
                <button onClick={() => setCompact(true)} className={"rounded-full border px-4 py-2 text-sm transition " + (compact ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>{content.compactBtn}</button>
                <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 outline-none">
                  <option value={2}>Indent 2</option><option value={4}>Indent 4</option><option value={0}>Tab</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{content.inputLabel}</p>
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-mono text-white outline-none focus:border-emerald-400/60" />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.formattedLabel}</p>
                    <div className="flex items-center gap-2">
                      {output && (
                        <button onClick={doCopy} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 flex items-center gap-1.5 transition hover:bg-white/10">
                          <Copy className="h-3 w-3" />{copied ? content.copied : content.copyBtn}
                        </button>
                      )}
                      {error ? <span className="text-xs text-red-400">{content.error}</span> : output ? <span className="text-xs text-emerald-400">{content.valid}</span> : null}
                    </div>
                  </div>
                  <div className={(error ? "border-red-400/30" : "border-emerald-400/20") + " w-full rounded-2xl border bg-black/30 p-4 min-h-[12rem]"}>
                    {error ? <p className="font-mono text-sm text-red-400">{error}</p> : <pre className="font-mono text-sm text-emerald-200 whitespace-pre-wrap break-words">{output}</pre>}
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Braces className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title[locale] === name);
                  return (
                    <button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
