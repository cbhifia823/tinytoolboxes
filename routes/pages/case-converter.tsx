import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Copy, Search, Type, Bold } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, any> = {
  en: { name: "English", title: "Case Converter", subtitle: "Convert your text to lowercase, UPPERCASE, Title Case, Sentence case, or aLtErNaTiNg case instantly.", searchLabel: "Search tools", searchPlaceholder: "Try: word, url, password, qr", inputLabel: "Your text", resultLabel: "Result", copyBtn: "Copy", copiedBtn: "Copied!", lowercase: "lowercase", uppercase: "UPPERCASE", titleCase: "Title Case", sentenceCase: "Sentence case", alternating: "aLtErNaTiNg", inverse: "iNVERSE", articleTitle: "Case Conversion Explained", articleBody: "Case conversion is one of the most common everyday text tasks. Whether you're formatting a title, cleaning up data pasted from a spreadsheet, or fixing accidental caps-lock, a case converter saves you the time of manually retyping everything. This tool applies each transformation instantly — just type or paste your text and every variation appears at once.", reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later." },
  "zh-hk": { name: "繁體中文", title: "大小寫轉換器", subtitle: "即時將文字轉換成細階、大階、標題大細階、句首大寫，或者交替字母形式。", searchLabel: "搜尋工具", searchPlaceholder: "試下：字數、URL、密碼、QR", inputLabel: "你嘅文字", resultLabel: "結果", copyBtn: "複製", copiedBtn: "已複製!", lowercase: "細階", uppercase: "大階", titleCase: "標題大細階", sentenceCase: "句首大寫", alternating: "交替字母", inverse: "反轉大細階", articleTitle: "大細階轉換詳解", articleBody: "大小寫轉換係日常最常見嘅文字工作之一。無論你係想格式化標題、清理試算表貼出嚟嘅資料，定係修正意外嘅Caps Lock，大細階轉換器都可以幫你慳返人手重新輸入嘅時間。呢個工具會即時套用每種轉換——只需要輸入或貼上文字，所有變化就會一次過顯示。", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。" },
  "zh-cn": { name: "简体中文", title: "大小写转换器", subtitle: "即时将文字转换为小写、大写、标题大小写、句首大写或交替字母形式。", searchLabel: "搜索工具", searchPlaceholder: "试试：字数、URL、密码、QR", inputLabel: "你的文字", resultLabel: "结果", copyBtn: "复制", copiedBtn: "已复制!", lowercase: "小写", uppercase: "大写", titleCase: "标题大小写", sentenceCase: "句首大写", alternating: "交替字母", inverse: "反转大小写", articleTitle: "大小写转换详解", articleBody: "大小写转换是日常最常见的文字工作之一。无论你是想格式化标题、清理电子表格粘贴出来的数据，还是修正意外按下的Caps Lock，大小写转换器都可以帮你省去手动重新输入的时间。此工具会即时应用每种转换——只需输入或粘贴文字，所有变化就会一次显示。", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。" },
  es: { name: "Español", title: "Conversor de mayúsculas/minúsculas", subtitle: "Convierte tu texto a minúsculas, MAYÚSCULAS, Título, Frase o AlTeRnAdO al instante.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: word, url, password, qr", inputLabel: "Tu texto", resultLabel: "Resultado", copyBtn: "Copiar", copiedBtn: "¡Copiado!", lowercase: "minúsculas", uppercase: "MAYÚSCULAS", titleCase: "Título", sentenceCase: "Frase", alternating: "AlTeRnAdO", inverse: "iNVERTIDO", articleTitle: "Conversión de mayúsculas/minúsculas explicada", articleBody: "La conversión de mayúsculas y minúsculas es una de las tareas de texto más comunes. Ya sea para formatear un título, limpiar datos pegados desde una hoja de cálculo o arreglar un bloqueo accidental de mayúsculas, un conversor te ahorra tiempo de volver a escribir todo manualmente. Esta herramienta aplica cada transformación al instante — solo escribe o pega tu texto y todas las variantes aparecen de inmediato.", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante." },
};

const TOOLS = [
  { title: { en: "Word Counter", "zh-hk": "字數統計器", "zh-cn": "字数统计器", es: "Contador de palabras" }, href: "/word-counter", keywords: ["word","text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼", "zh-cn": "URL 编解码", es: "Codif/Decod URL" }, href: "/url-encoder-decoder", keywords: ["url","encode"] },
  { title: { en: "Password Generator", "zh-hk": "密碼生成器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, href: "/password-generator", keywords: ["password"] },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼生成器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator", keywords: ["qr"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/case-converter";

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

export default function CaseConverter() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [input, setInput] = useState("Hello world! this is a test.");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<Record<string,boolean>>({});

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500);
  };

  const variants = useMemo(() => ({
    lowercase: input.toLowerCase(),
    uppercase: input.toUpperCase(),
    title: input.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    sentence: input.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()).replace(/[a-z]/gi, (c, i) => i === 0 || input[i-1]===undefined ? c.toUpperCase() : c.toLowerCase()),
    alternating: input.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
    inverse: input.split("").map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(""),
  }), [input]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["字數", "URL", "密碼", "QR"] : locale === "zh-cn" ? ["字数", "URL", "密码", "二维码"] : ["word", "url", "password", "qr"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search]);

  const styles: Record<string,string> = {
    lowercase: "border-emerald-400/20 bg-emerald-400/5", uppercase: "border-blue-400/20 bg-blue-400/5",
    title: "border-purple-400/20 bg-purple-400/5", sentence: "border-amber-400/20 bg-amber-400/5",
    alternating: "border-pink-400/20 bg-pink-400/5", inverse: "border-orange-400/20 bg-orange-400/5",
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Type className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.inputLabel}</span>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(variants).map(([key, value]) => (
                  <div key={key} className={`rounded-2xl border p-4 ${styles[key] || "border-white/10 bg-black/20"}`}>
                    <div className="flex items-center justify-between gap-2 mb-2"><span className="text-xs uppercase tracking-[0.15em] text-white/55">{(content as any)[key]}</span>
                      <button onClick={() => copyText(value, key)} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65 hover:bg-white/10 transition">
                        <Copy className="h-3 w-3" />{copied[key] ? content.copiedBtn : content.copyBtn}
                      </button>
                    </div>
                    <p className="text-sm text-white/85 break-all">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <article className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <h2 className="text-2xl font-bold text-white">{content.articleTitle}</h2>
              <p className="leading-7">{content.articleBody}</p>
            </article>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Type className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Common uses</h2><p className="text-sm text-neutral-300">6 transformations at once.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Format titles and headings with Title Case.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Fix ALL-CAPS data from spreadsheets and databases.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Create alternating case for styles and social media.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Invert case to quickly fix caps lock mistakes.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
