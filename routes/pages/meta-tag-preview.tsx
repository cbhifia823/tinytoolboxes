import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Search, Copy, Tags } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, any> = {
  en: { name: "English", title: "Meta Tag Preview & Generator", subtitle: "See how your page looks in Google search and on social media, then copy ready-made meta tags. Live preview as you type.", searchLabel: "Search tools", searchPlaceholder: "Try: json, qr, base64, color", titleLabel: "Page title", descLabel: "Meta description", urlLabel: "Page URL", googleLabel: "Google result preview", socialLabel: "Social share preview", tagsLabel: "Meta tags (copy & paste into <head>)", copyBtn: "Copy", copiedBtn: "Copied!", titleCount: "title chars", descCount: "description chars", titleWarn: "Aim for 50–60 characters", descWarn: "Aim for 120–160 characters", articleTitle: "Why Meta Tags Matter for SEO", articleBody: "Meta tags tell search engines and social networks how to display your page. The title tag is the clickable headline in Google results and the single most important on-page SEO signal; keep it under about 60 characters so it is not cut off. The meta description does not directly affect ranking, but a clear, compelling 120–160 character summary improves click-through rate. Open Graph and Twitter Card tags control the title, description, and image shown when your link is shared on social media. This tool previews all of them live and generates clean tags you can paste straight into your page's <head>.", reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later." },
  "zh-hk": { name: "繁體中文", title: "Meta 標籤預覽同產生器", subtitle: "睇下你個網頁喺 Google 搜尋同社交媒體點樣顯示，再複製現成嘅 meta 標籤。一邊打字一邊即時預覽。", searchLabel: "搜尋工具", searchPlaceholder: "試下：JSON、QR、base64、配色", titleLabel: "網頁標題", descLabel: "Meta 描述", urlLabel: "網頁網址", googleLabel: "Google 結果預覽", socialLabel: "社交分享預覽", tagsLabel: "Meta 標籤（複製貼入 <head>）", copyBtn: "複製", copiedBtn: "已複製！", titleCount: "標題字元", descCount: "描述字元", titleWarn: "建議 50–60 個字元", descWarn: "建議 120–160 個字元", articleTitle: "點解 Meta 標籤對 SEO 咁重要？", articleBody: "Meta 標籤話畀搜尋引擎同社交網絡知點顯示你個網頁。Title 標籤係 Google 結果入面可以撳嘅標題，亦係最重要嘅 on-page SEO 訊號；保持喺大約 60 個字元以內，咁就唔會被截斷。Meta 描述唔會直接影響排名，但一段清晰、吸引、120–160 字元嘅摘要可以提高點擊率。Open Graph 同 Twitter Card 標籤控制你條 link 喺社交媒體分享時顯示嘅標題、描述同圖片。呢個工具會即時預覽全部，仲會產生乾淨嘅標籤畀你直接貼入網頁嘅 <head>。", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。" },
  "zh-cn": { name: "简体中文", title: "Meta 标签预览和生成器", subtitle: "看看你的网页在 Google 搜索和社交媒体上如何显示，再复制现成的 meta 标签。边打字边实时预览。", searchLabel: "搜索工具", searchPlaceholder: "试试：JSON、QR、base64、配色", titleLabel: "网页标题", descLabel: "Meta 描述", urlLabel: "网页网址", googleLabel: "Google 结果预览", socialLabel: "社交分享预览", tagsLabel: "Meta 标签（复制粘贴进 <head>）", copyBtn: "复制", copiedBtn: "已复制！", titleCount: "标题字符", descCount: "描述字符", titleWarn: "建议 50–60 个字符", descWarn: "建议 120–160 个字符", articleTitle: "为什么 Meta 标签对 SEO 很重要？", articleBody: "Meta 标签告诉搜索引擎和社交网络如何显示你的网页。Title 标签是 Google 结果中可点击的标题，也是最重要的 on-page SEO 信号；保持在大约 60 个字符以内，这样就不会被截断。Meta 描述不会直接影响排名，但一段清晰、吸引人、120–160 字符的摘要可以提高点击率。Open Graph 和 Twitter Card 标签控制你的链接在社交媒体分享时显示的标题、描述和图片。此工具会实时预览全部，还会生成干净的标签供你直接粘贴进网页的 <head>。", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。" },
  es: { name: "Español", title: "Vista previa y generador de meta tags", subtitle: "Mira cómo se ve tu página en Google y en redes sociales, y copia meta tags listas para usar. Vista previa en vivo mientras escribes.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: json, qr, base64, color", titleLabel: "Título de la página", descLabel: "Meta descripción", urlLabel: "URL de la página", googleLabel: "Vista previa en Google", socialLabel: "Vista previa social", tagsLabel: "Meta tags (copia y pega en <head>)", copyBtn: "Copiar", copiedBtn: "¡Copiado!", titleCount: "caracteres del título", descCount: "caracteres de la descripción", titleWarn: "Apunta a 50–60 caracteres", descWarn: "Apunta a 120–160 caracteres", articleTitle: "Por qué importan las meta tags para el SEO", articleBody: "Las meta tags indican a los buscadores y redes sociales cómo mostrar tu página. La etiqueta title es el titular en el que se hace clic en Google y la señal de SEO on-page más importante; mantenla por debajo de unos 60 caracteres para que no se corte. La meta descripción no afecta directamente al posicionamiento, pero un resumen claro y atractivo de 120–160 caracteres mejora la tasa de clics. Las etiquetas Open Graph y Twitter Card controlan el título, la descripción y la imagen que se muestran al compartir tu enlace en redes sociales. Esta herramienta las previsualiza todas en vivo y genera etiquetas limpias que puedes pegar directamente en el <head> de tu página.", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante." },
};

const TOOLS = [
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化器", "zh-cn": "JSON 格式化器", es: "Formateador JSON" }, href: "/json-formatter", keywords: ["json"] },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼生成器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator", keywords: ["qr"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼", "zh-cn": "URL 编解码", es: "Codif/Decod URL" }, href: "/url-encoder-decoder", keywords: ["url"] },
  { title: { en: "Color Palette Generator", "zh-hk": "配色產生器", "zh-cn": "配色生成器", es: "Generador de paletas" }, href: "/color-palette-generator", keywords: ["color"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/meta-tag-preview";

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

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const prettyUrl = (u: string) => { try { const x = new URL(u); return x.hostname.replace(/^www\./, "") + (x.pathname === "/" ? "" : x.pathname); } catch { return u.replace(/^https?:\/\//, "").replace(/^www\./, ""); } };

export default function MetaTagPreview() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [pTitle, setPTitle] = useState("TinyToolboxes — Free Single-Purpose Web Tools");
  const [pDesc, setPDesc] = useState("A growing collection of fast, focused tools: calculators, converters, and developer utilities. Free, no sign-up, works on any device.");
  const [pUrl, setPUrl] = useState("https://www.tinytoolboxes.com/");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const tags = useMemo(() => [
    `<title>${esc(pTitle)}</title>`,
    `<meta name="description" content="${esc(pDesc)}" />`,
    `<link rel="canonical" href="${esc(pUrl)}" />`,
    `<meta property="og:title" content="${esc(pTitle)}" />`,
    `<meta property="og:description" content="${esc(pDesc)}" />`,
    `<meta property="og:url" content="${esc(pUrl)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(pTitle)}" />`,
    `<meta name="twitter:description" content="${esc(pDesc)}" />`,
  ].join("\n"), [pTitle, pDesc, pUrl]);

  const copyTags = async () => { await navigator.clipboard.writeText(tags); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["JSON", "QR", "base64", "配色"] : locale === "zh-cn" ? ["JSON", "QR", "base64", "配色"] : ["json", "qr", "base64", "color"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search, locale]);
  const titleOk = pTitle.length >= 50 && pTitle.length <= 60;
  const descOk = pDesc.length >= 120 && pDesc.length <= 160;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Tags className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <label className="block space-y-1">
                <div className="flex items-center justify-between"><span className="text-sm text-neutral-300">{content.titleLabel}</span><span className={"text-xs " + (titleOk ? "text-emerald-400" : "text-amber-400")}>{pTitle.length} {content.titleCount}</span></div>
                <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                {!titleOk && <p className="text-xs text-amber-400/80">{content.titleWarn}</p>}
              </label>
              <label className="block space-y-1">
                <div className="flex items-center justify-between"><span className="text-sm text-neutral-300">{content.descLabel}</span><span className={"text-xs " + (descOk ? "text-emerald-400" : "text-amber-400")}>{pDesc.length} {content.descCount}</span></div>
                <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} rows={3} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                {!descOk && <p className="text-xs text-amber-400/80">{content.descWarn}</p>}
              </label>
              <label className="block space-y-1"><span className="text-sm text-neutral-300">{content.urlLabel}</span>
                <input value={pUrl} onChange={(e) => setPUrl(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white p-5">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{content.googleLabel}</p>
                <div className="rounded-xl bg-white p-2">
                  <p className="text-xs text-[#202124]">{prettyUrl(pUrl)}</p>
                  <p className="text-[18px] leading-6 text-[#1a0dab]">{pTitle.length > 60 ? pTitle.slice(0, 60) + "…" : pTitle}</p>
                  <p className="text-[13px] leading-5 text-[#4d5156]">{pDesc.length > 160 ? pDesc.slice(0, 160) + "…" : pDesc}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{content.socialLabel}</p>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#15202b]">
                  <div className="flex aspect-[1.91/1] items-center justify-center bg-gradient-to-br from-emerald-500/30 to-blue-500/20 text-xs text-white/50">og:image</div>
                  <div className="space-y-1 p-3"><p className="text-xs text-white/45">{prettyUrl(pUrl)}</p><p className="text-sm font-semibold text-white line-clamp-1">{pTitle}</p><p className="text-xs text-white/55 line-clamp-2">{pDesc}</p></div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-emerald-200">{content.tagsLabel}</p>
                <button onClick={copyTags} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition"><Copy className="h-3 w-3" />{copied ? content.copiedBtn : content.copyBtn}</button>
              </div>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs font-mono leading-5 text-emerald-200 whitespace-pre-wrap break-all">{tags}</pre>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Tags className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Common uses</h2><p className="text-sm text-neutral-300">Preview before you publish.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Check title and description length.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Preview Google and social snippets.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Generate Open Graph & Twitter tags.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Copy clean tags into your &lt;head&gt;.</p>
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
