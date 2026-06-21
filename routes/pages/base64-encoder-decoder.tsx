import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Binary, Copy, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, any> = {
  en: { name: "English", title: "Base64 Encoder / Decoder", subtitle: "Encode text to Base64 or decode Base64 back to text instantly. UTF-8 safe, runs entirely in your browser.", searchLabel: "Search tools", searchPlaceholder: "Try: url, json, password, qr", inputLabel: "Text or Base64", encodedLabel: "Base64 encoded", decodedLabel: "Decoded text", copyBtn: "Copy", copiedBtn: "Copied!", invalid: "Not valid Base64", articleTitle: "What Is Base64 Encoding?", articleBody: "Base64 is a way of representing binary data using 64 printable ASCII characters. It is widely used to embed images in CSS or HTML, send attachments by email, store data in JSON or URLs, and transmit credentials in HTTP headers. Encoding is reversible and lossless — it is not encryption, so never use it to hide secrets. This tool encodes and decodes simultaneously and handles full UTF-8 text including emoji and accented characters.", reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later." },
  "zh-hk": { name: "繁體中文", title: "Base64 編碼／解碼器", subtitle: "即時將文字編碼成 Base64，或者將 Base64 解碼返做文字。支援 UTF-8，全程喺你瀏覽器運行。", searchLabel: "搜尋工具", searchPlaceholder: "試下：URL、JSON、密碼、QR", inputLabel: "文字或 Base64", encodedLabel: "Base64 編碼", decodedLabel: "解碼文字", copyBtn: "複製", copiedBtn: "已複製！", invalid: "唔係有效嘅 Base64", articleTitle: "咩係 Base64 編碼？", articleBody: "Base64 係用 64 個可列印 ASCII 字元嚟表示二進位資料嘅方法。常用嚟喺 CSS 或 HTML 嵌入圖片、用電郵傳送附件、喺 JSON 或網址儲存資料、或者喺 HTTP header 傳送認證資料。編碼係可逆同無損嘅——佢唔係加密，所以唔好用嚟收埋秘密。呢個工具會同時編碼同解碼，並支援完整 UTF-8 文字，包括 emoji 同有腔調嘅字母。", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。" },
  "zh-cn": { name: "简体中文", title: "Base64 编码/解码器", subtitle: "即时将文字编码为 Base64，或将 Base64 解码回文字。支持 UTF-8，全程在你的浏览器运行。", searchLabel: "搜索工具", searchPlaceholder: "试试：URL、JSON、密码、QR", inputLabel: "文字或 Base64", encodedLabel: "Base64 编码", decodedLabel: "解码文字", copyBtn: "复制", copiedBtn: "已复制！", invalid: "不是有效的 Base64", articleTitle: "什么是 Base64 编码？", articleBody: "Base64 是用 64 个可打印 ASCII 字符来表示二进制数据的方法。常用于在 CSS 或 HTML 嵌入图片、通过电子邮件发送附件、在 JSON 或网址中存储数据、或在 HTTP header 中传送认证信息。编码是可逆且无损的——它不是加密，所以不要用来隐藏机密。此工具会同时编码和解码，并支持完整 UTF-8 文字，包括 emoji 和带变音符的字母。", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。" },
  es: { name: "Español", title: "Codificador / decodificador Base64", subtitle: "Codifica texto a Base64 o decodifica Base64 a texto al instante. Compatible con UTF-8, se ejecuta por completo en tu navegador.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: url, json, password, qr", inputLabel: "Texto o Base64", encodedLabel: "Codificado en Base64", decodedLabel: "Texto decodificado", copyBtn: "Copiar", copiedBtn: "¡Copiado!", invalid: "Base64 no válido", articleTitle: "¿Qué es la codificación Base64?", articleBody: "Base64 es una forma de representar datos binarios usando 64 caracteres ASCII imprimibles. Se usa mucho para incrustar imágenes en CSS o HTML, enviar adjuntos por correo, almacenar datos en JSON o URLs y transmitir credenciales en cabeceras HTTP. La codificación es reversible y sin pérdidas — no es cifrado, así que nunca la uses para ocultar secretos. Esta herramienta codifica y decodifica a la vez y admite texto UTF-8 completo, incluidos emojis y letras acentuadas.", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante." },
};

const TOOLS = [
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼", "zh-cn": "URL 编解码", es: "Codif/Decod URL" }, href: "/url-encoder-decoder", keywords: ["url","encode"] },
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化器", "zh-cn": "JSON 格式化器", es: "Formateador JSON" }, href: "/json-formatter", keywords: ["json"] },
  { title: { en: "Password Generator", "zh-hk": "密碼生成器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, href: "/password-generator", keywords: ["password"] },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼生成器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator", keywords: ["qr"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/base64-encoder-decoder";

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

const encodeB64 = (s: string) => { try { return btoa(unescape(encodeURIComponent(s))); } catch { return ""; } };
const decodeB64 = (s: string) => { try { return decodeURIComponent(escape(atob(s.trim()))); } catch { return null; } };

export default function Base64EncoderDecoder() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [input, setInput] = useState("Hello, TinyToolboxes! 👋");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500);
  };

  const encoded = useMemo(() => encodeB64(input), [input]);
  const decoded = useMemo(() => decodeB64(input), [input]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["URL", "JSON", "密碼", "QR"] : locale === "zh-cn" ? ["URL", "JSON", "密码", "二维码"] : ["url", "json", "password", "qr"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search, locale]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Binary className="h-5 w-5 text-emerald-300" /></div>
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
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <div className="flex items-center justify-between gap-2 mb-2"><span className="text-xs uppercase tracking-[0.15em] text-white/55">{content.encodedLabel}</span>
                    <button onClick={() => copyText(encoded, "enc")} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65 hover:bg-white/10 transition"><Copy className="h-3 w-3" />{copied.enc ? content.copiedBtn : content.copyBtn}</button>
                  </div>
                  <p className="text-sm text-white/85 break-all font-mono">{encoded}</p>
                </div>
                <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-4">
                  <div className="flex items-center justify-between gap-2 mb-2"><span className="text-xs uppercase tracking-[0.15em] text-white/55">{content.decodedLabel}</span>
                    {decoded !== null && <button onClick={() => copyText(decoded, "dec")} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65 hover:bg-white/10 transition"><Copy className="h-3 w-3" />{copied.dec ? content.copiedBtn : content.copyBtn}</button>}
                  </div>
                  <p className={"text-sm break-all " + (decoded === null ? "text-red-400" : "text-white/85 font-mono")}>{decoded === null ? content.invalid : decoded}</p>
                </div>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Binary className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Common uses</h2><p className="text-sm text-neutral-300">Encode and decode at once.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Embed images and fonts as data URIs.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Decode JWT and HTTP Basic Auth strings.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Store binary data safely inside JSON.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Inspect Base64 payloads from APIs.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200"><BadgeDollarSign className="h-3.5 w-3.5" />{content.reserveAd}</div>
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">Advertisement</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">Reserved</span></div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
