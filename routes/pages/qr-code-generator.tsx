import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Download, QrCode, Search } from "lucide-react";
import QRCode from "https://esm.sh/qrcode@1.5.3";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string; title: string; subtitle: string;
  inputLabel: string; inputPlaceholder: string;
  downloadPng: string; downloadSvg: string;
  searchLabel: string; searchPlaceholder: string;
  sizeLabel: string; foregroundLabel: string; backgroundLabel: string;
  reserved: string; generated: string;
}> = {
  en: {
    name: "English", title: "QR Code Generator", subtitle: "Create a QR code from any text or URL. Free, no sign-up, works offline.",
    inputLabel: "Text or URL", inputPlaceholder: "https://example.com or Hello World",
    downloadPng: "Download PNG", downloadSvg: "Download SVG",
    searchLabel: "Search tools", searchPlaceholder: "Try: json, base64, timestamp, password",
    sizeLabel: "Size", foregroundLabel: "Foreground", backgroundLabel: "Background",
    reserved: "Google Ads space reserved", generated: "Your QR code will appear here",
  },
  "zh-hk": {
    name: "繁體中文", title: "QR 碼產生器", subtitle: "將任何文字或網址變成 QR 碼。免費、唔使註冊、可離線用。",
    inputLabel: "文字或網址", inputPlaceholder: "https://example.com 或者 Hello",
    downloadPng: "下載 PNG", downloadSvg: "下載 SVG",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：json、base64、timestamp、password",
    sizeLabel: "尺寸", foregroundLabel: "前景色", backgroundLabel: "背景色",
    reserved: "預留 Google 廣告位", generated: "你嘅 QR 碼會喺度顯示",
  },
  "zh-cn": {
    name: "简体中文", title: "二维码生成器", subtitle: "将任何文字或网址变成二维码。免费、不用注册、可离线使用。",
    inputLabel: "文字或网址", inputPlaceholder: "https://example.com 或者 Hello",
    downloadPng: "下载 PNG", downloadSvg: "下载 SVG",
    searchLabel: "搜索工具", searchPlaceholder: "例如：json、base64、timestamp、password",
    sizeLabel: "尺寸", foregroundLabel: "前景色", backgroundLabel: "背景色",
    reserved: "预留 Google 广告位", generated: "你的二维码会在这里显示",
  },
  es: {
    name: "Español", title: "Generador de códigos QR", subtitle: "Crea un código QR desde cualquier texto o URL. Gratis, sin registro, funciona sin conexión.",
    inputLabel: "Texto o URL", inputPlaceholder: "https://ejemplo.com o Hola mundo",
    downloadPng: "Descargar PNG", downloadSvg: "Descargar SVG",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: json, base64, timestamp, password",
    sizeLabel: "Tamaño", foregroundLabel: "Color frontal", backgroundLabel: "Color de fondo",
    reserved: "Espacio reservado para Google Ads", generated: "Tu código QR aparecerá aquí",
  },
};

const TOOLS = [
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化", "zh-cn": "JSON 格式化", es: "Formateador JSON" }, description: { en: "Beautify and validate JSON.", "zh-hk": "整理同驗證 JSON。", "zh-cn": "整理和验证 JSON。", es: "Embellece y valida JSON." }, href: "/json-formatter", keywords: ["json", "format"] },
  { title: { en: "Base64 Encode/Decode", "zh-hk": "Base64 編碼／解碼", "zh-cn": "Base64 编码／解码", es: "Codificar/decodificar Base64" }, description: { en: "Encode or decode Base64 strings.", "zh-hk": "將文字轉做 Base64 或還原。", "zh-cn": "将文字转为 Base64 或还原。", es: "Codifica o decodifica cadenas Base64." }, href: "/base64-encoder-decoder", keywords: ["base64", "encode"] },
  { title: { en: "Unix Timestamp Converter", "zh-hk": "Unix 時間戳轉換器", "zh-cn": "Unix 时间戳转换器", es: "Conversor de timestamp Unix" }, description: { en: "Convert between Unix timestamps and human dates.", "zh-hk": "Unix 時間戳同日期互轉。", "zh-cn": "Unix 时间戳和日期互转。", es: "Convierte entre timestamps Unix y fechas legibles." }, href: "/unix-timestamp-converter", keywords: ["timestamp", "unix"] },
  { title: { en: "Password Generator", "zh-hk": "密碼產生器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, description: { en: "Generate strong random passwords.", "zh-hk": "產生強隨機密碼。", "zh-cn": "生成强随机密码。", es: "Genera contraseñas seguras aleatorias." }, href: "/password-generator", keywords: ["password", "random"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Exact age from birth date.", "zh-hk": "出生日期計準確年齡。", "zh-cn": "出生日期计算准确年龄。", es: "Edad exacta desde la fecha de nacimiento." }, href: "/age-calculator", keywords: ["age"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "數字數同字元數。", "zh-cn": "数字数和字符数。", es: "Cuenta palabras y caracteres." }, href: "/word-counter", keywords: ["word"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/qr-code-generator";

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

export default function QrCodeGenerator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [input, setInput] = useState("https://www.tinytoolboxes.com");
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [search, setSearch] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  useEffect(() => {
    if (!canvasRef.current || !input.trim()) return;
    QRCode.toCanvas(canvasRef.current, input.trim(), { width: size, color: { dark: fg, light: bg }, errorCorrectionLevel: "M" }).catch(() => {});
  }, [input, size, fg, bg]);

  const content = LANGUAGES[locale];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const downloadCanvas = (format: "png" | "svg") => {
    const c = canvasRef.current; if (!c) return;
    if (format === "png") {
      const a = document.createElement("a"); a.download = "qr-code.png"; a.href = c.toDataURL("image/png"); a.click();
    } else {
      QRCode.toString(input.trim(), { type: "svg", color: { dark: fg, light: bg }, errorCorrectionLevel: "M" }).then((svg: string) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const a = document.createElement("a"); a.download = "qr-code.svg"; a.href = URL.createObjectURL(blob); a.click();
      }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
            <div><div className="flex items-center gap-2"><span className="text-base font-semibold tracking-wide text-white">TinyToolboxes</span><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span></div>
            <p className="text-sm text-white/50">Boring, useful, searchable.</p></div>
          </a>
          <div className="flex flex-wrap items-center gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === key ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>
      </header>

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><QrCode className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.inputLabel}</span>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={content.inputPlaceholder} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block space-y-2"><span className="text-xs text-neutral-400">{content.sizeLabel}</span>
                  <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/60">
                    {[128, 180, 256, 300, 400, 512].map((s) => <option key={s} value={s}>{s}px</option>)}
                  </select>
                </label>
                <label className="block space-y-2"><span className="text-xs text-neutral-400">{content.foregroundLabel}</span>
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-full rounded-2xl border border-white/10 bg-black/30 p-1 cursor-pointer" />
                </label>
                <label className="block space-y-2"><span className="text-xs text-neutral-400">{content.backgroundLabel}</span>
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded-2xl border border-white/10 bg-black/30 p-1 cursor-pointer" />
                </label>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white p-4 flex items-center justify-center min-h-[320px]">
                {input.trim() ? <canvas ref={canvasRef} className="max-w-full" /> : <span className="text-neutral-400 text-sm">{content.generated}</span>}
              </div>
              {input.trim() && (
                <div className="flex gap-3">
                  <button onClick={() => downloadCanvas("png")} className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 transition hover:bg-emerald-400/20"><Download className="h-4 w-4" />{content.downloadPng}</button>
                  <button onClick={() => downloadCanvas("svg")} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:bg-white/10"><Download className="h-4 w-4" />{content.downloadSvg}</button>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><QrCode className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Use cases</h2><p className="text-sm text-neutral-300">QR codes in everyday life.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Share URLs, Wi-Fi passwords, and contact cards.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Print on flyers, menus, and business cards.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Generate offline — no server, no tracking.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
