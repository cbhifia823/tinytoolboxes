import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Globe, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string; title: string; subtitle: string;
  urlLabel: string; urlPlaceholder: string; fetchBtn: string; fetching: string;
  previews: string; google: string; twitter: string; opengraph: string;
  noUrl: string; failed: string;
  searchLabel: string; searchPlaceholder: string;
  useCasesTitle: string; useCasesSubtitle: string; useCases: string[];
  suggestionsTitle: string; suggestionsSubtitle: string; suggestions: string[];
}> = {
  en: {
    name: "English", title: "Meta Tag Preview", subtitle: "Preview how a URL appears in Google, Twitter cards, and Open Graph. Free, no sign-up.",
    urlLabel: "Page URL", urlPlaceholder: "https://example.com", fetchBtn: "Preview", fetching: "Loading...",
    previews: "Previews", google: "Google Search", twitter: "Twitter / X Card", opengraph: "Open Graph / Facebook",
    noUrl: "Enter a URL and click Preview.", failed: "Could not fetch meta tags. Check the URL and try again.",
    searchLabel: "Search tools", searchPlaceholder: "Try: base64, timestamp, json, color",
    useCasesTitle: "Use cases", useCasesSubtitle: "Why preview meta tags.",
    useCases: ["Check how your page looks in search results before publishing.", "Debug Open Graph tags for Facebook / LinkedIn sharing.", "Verify Twitter Card markup for correct appearance."],
    suggestionsTitle: "You may also like", suggestionsSubtitle: "Other SEO & dev tools.",
    suggestions: ["Base64 Encode/Decode", "JSON Formatter", "QR Code Generator"],
  },
  "zh-hk": {
    name: "繁體中文", title: "Meta Tag 預覽", subtitle: "預覽 URL 喺 Google、Twitter cards 同 Open Graph 嘅顯示效果。免費、唔使註冊。",
    urlLabel: "頁面網址", urlPlaceholder: "https://example.com", fetchBtn: "預覽", fetching: "載入中...",
    previews: "預覽", google: "Google 搜尋", twitter: "Twitter / X Card", opengraph: "Open Graph / Facebook",
    noUrl: "請輸入網址然後撳預覽。", failed: "無法讀取 meta tags。請檢查網址後再試。",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：base64、timestamp、json、color",
    useCasesTitle: "使用情境", useCasesSubtitle: "點解要預覽 meta tags。",
    useCases: ["發布前檢查頁面喺搜尋結果嘅顯示效果。", "Debug Facebook / LinkedIn 分享嘅 Open Graph tags。", "驗證 Twitter Card 標記係咪正確。"],
    suggestionsTitle: "你可能會喜歡", suggestionsSubtitle: "其他 SEO 同開發工具。",
    suggestions: ["Base64 編碼／解碼", "JSON 格式化", "QR 碼產生器"],
  },
  "zh-cn": {
    name: "简体中文", title: "Meta 标签预览", subtitle: "预览 URL 在 Google、Twitter cards 和 Open Graph 的显示效果。免费、不用注册。",
    urlLabel: "页面网址", urlPlaceholder: "https://example.com", fetchBtn: "预览", fetching: "加载中...",
    previews: "预览", google: "Google 搜索", twitter: "Twitter / X Card", opengraph: "Open Graph / Facebook",
    noUrl: "请输入网址然后点击预览。", failed: "无法读取 meta tags。请检查网址后重试。",
    searchLabel: "搜索工具", searchPlaceholder: "例如：base64、timestamp、json、color",
    useCasesTitle: "使用场景", useCasesSubtitle: "为什么需要预览 meta 标签。",
    useCases: ["发布前检查页面在搜索结果中的显示效果。", "Debug Facebook / LinkedIn 分享的 Open Graph 标签。", "验证 Twitter Card 标记是否正确。"],
    suggestionsTitle: "你可能会喜欢", suggestionsSubtitle: "其他 SEO 和开发工具。",
    suggestions: ["Base64 编码／解码", "JSON 格式化", "二维码生成器"],
  },
  es: {
    name: "Español", title: "Vista previa de meta tags", subtitle: "Previsualiza cómo se ve una URL en Google, Twitter y Open Graph. Gratis, sin registro.",
    urlLabel: "URL de página", urlPlaceholder: "https://ejemplo.com", fetchBtn: "Vista previa", fetching: "Cargando...",
    previews: "Previsualizaciones", google: "Búsqueda de Google", twitter: "Twitter / X Card", opengraph: "Open Graph / Facebook",
    noUrl: "Ingresa una URL y haz clic en Vista previa.", failed: "No se pudieron leer los meta tags. Verifica la URL.",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: base64, timestamp, json, color",
    useCasesTitle: "Casos de uso", useCasesSubtitle: "Por qué previsualizar meta tags.",
    useCases: ["Revisa cómo se ve tu página en resultados de búsqueda.", "Depura etiquetas Open Graph para Facebook/LinkedIn.", "Verifica el marcado de Twitter Cards."],
    suggestionsTitle: "También te puede interesar", suggestionsSubtitle: "Otras herramientas SEO/dev.",
    suggestions: ["Codificador Base64", "Formateador JSON", "Generador QR"],
  },
};

const TOOLS = [
  { title: { en: "Base64 Encode/Decode", "zh-hk": "Base64 編碼／解碼", "zh-cn": "Base64 编码／解码", es: "Codificador Base64" }, href: "/base64-encoder-decoder" },
  { title: { en: "Unix Timestamp Converter", "zh-hk": "Unix 時間戳轉換器", "zh-cn": "Unix 时间戳转换器", es: "Conversor timestamp Unix" }, href: "/unix-timestamp-converter" },
  { title: { en: "Color Palette Generator", "zh-hk": "調色板產生器", "zh-cn": "调色板生成器", es: "Generador de paletas" }, href: "/color-palette-generator" },
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化", "zh-cn": "JSON 格式化", es: "Formateador JSON" }, href: "/json-formatter" },
  { title: { en: "Password Generator", "zh-hk": "密碼產生器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, href: "/password-generator" },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼產生器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator" },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/meta-tag-preview";

interface MetaData {
  title: string; description: string; ogTitle: string; ogDescription: string; ogImage: string;
  twitterCard: string; twitterTitle: string; twitterDescription: string; twitterImage: string;
  url: string; favicon: string;
}

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

async function fetchMeta(url: string): Promise<MetaData> {
  const resp = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
  if (!resp.ok) throw new Error("Fetch failed");
  const html = await resp.text();
  const getMeta = (name: string, prop: string): string => {
    const reName = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
    const reProp = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["']`, "i");
    return html.match(reName)?.[1] || html.match(reProp)?.[1] || "";
  };
  const getTitle = (): string => { const m = html.match(/<title[^>]*>([^<]*)<\/title>/i); return m?.[1]?.trim() || ""; };
  const getFavicon = (): string => {
    const m = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']*)["']/i) || html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["'](?:shortcut )?icon["']/i);
    const href = m?.[1] || "/favicon.ico";
    try { return new URL(href, url).href; } catch { return href; }
  };
  return {
    title: getTitle(),
    description: getMeta("description", "description"),
    ogTitle: getMeta("", "og:title"),
    ogDescription: getMeta("", "og:description"),
    ogImage: getMeta("", "og:image"),
    twitterCard: getMeta("twitter:card", ""),
    twitterTitle: getMeta("twitter:title", ""),
    twitterDescription: getMeta("twitter:description", ""),
    twitterImage: getMeta("twitter:image", ""),
    url,
    favicon: getFavicon(),
  };
}

export default function MetaTagPreview() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleKey | null;
    return saved && LANGUAGES[saved] ? saved : "en";
  });
  const [inputUrl, setInputUrl] = useState("");
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    return TOOLS.filter((t) => `${t.title[locale]}`.toLowerCase().includes(q));
  }, [search]);

  const doFetch = async () => {
    if (!inputUrl.trim()) return;
    setLoading(true); setError(""); setMeta(null);
    try {
      const data = await fetchMeta(inputUrl.trim());
      setMeta(data);
    } catch { setError(content.failed); }
    setLoading(false);
  };

  const displayUrl = meta?.url || inputUrl || "";
  const hostname = (() => { try { return new URL(displayUrl).hostname; } catch { return displayUrl; } })();
  const googleTitle = meta?.ogTitle || meta?.title || "";
  const googleDesc = meta?.ogDescription || meta?.description || "";
  const twTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || "";
  const twDesc = meta?.twitterDescription || meta?.ogDescription || meta?.description || "";
  const twImage = meta?.twitterImage || meta?.ogImage || "";

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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Globe className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
              <div className="flex flex-wrap gap-4">
                <input type="url" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doFetch()} placeholder={content.urlPlaceholder}
                  className="flex-1 min-w-[200px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                <button onClick={doFetch} disabled={loading} className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-6 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/30 disabled:opacity-50">
                  {loading ? content.fetching : content.fetchBtn}
                </button>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              {meta && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.2em] mb-4">{content.google}</h3>
                    <div className="rounded-2xl border border-white/10 bg-white p-5 space-y-1.5 font-sans text-left">
                      <div className="flex items-center gap-2 text-sm text-[#1a0dab]"><span className="rounded-full bg-[#f1f3f4] w-7 h-7 flex items-center justify-center text-xs font-bold">{hostname.charAt(0).toUpperCase()}</span><span className="text-xs text-[#202124]">{hostname}</span></div>
                      <p className="text-xl text-[#1a0dab] leading-tight cursor-pointer hover:underline">{googleTitle || content.noUrl}</p>
                      <p className="text-sm text-[#4d5156] leading-snug line-clamp-2">{googleDesc}</p>
                    </div>
                  </div>

                  {twImage && (
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.2em] mb-4">{content.twitter}</h3>
                      <div className="rounded-2xl border border-white/10 overflow-hidden max-w-[500px]">
                        <img src={twImage} alt="" className="w-full h-48 object-cover bg-black/20" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <div className="bg-[#15202b] p-4 space-y-1">
                          <p className="text-sm text-[#8899a6]">{hostname}</p>
                          <p className="text-white font-medium">{twTitle || content.noUrl}</p>
                          <p className="text-sm text-[#8899a6] line-clamp-2">{twDesc}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.2em] mb-4">{content.opengraph}</h3>
                    <div className="rounded-2xl border border-white/10 overflow-hidden max-w-[500px] bg-[#f0f2f5] text-left">
                      {meta.ogImage && <img src={meta.ogImage} alt="" className="w-full h-48 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      <div className="p-3 space-y-0.5">
                        <p className="text-xs text-[#65676b] uppercase">{hostname}</p>
                        <p className="text-sm font-semibold text-[#1c1e21]">{meta.ogTitle || meta.title || content.noUrl}</p>
                        <p className="text-xs text-[#606770] line-clamp-1">{meta.ogDescription || meta.description || ""}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><p className="text-sm font-medium text-white">{t.title[locale]}</p><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Globe className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2><p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">{content.useCases.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}</div>
            <hr className="border-white/10" />
            <h2 className="text-lg font-semibold">{content.suggestionsTitle}</h2><p className="text-sm text-neutral-300">{content.suggestionsSubtitle}</p>
            <div className="space-y-2">{content.suggestions.map((name) => { const match = TOOLS.find((t) => t.title[locale] === name); return match ? <a key={name} href={match.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"><span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" /></a> : null; })}</div>
          </aside>
        </div>
      </section>
    </main>
  );
}
