import { useEffect, useMemo, useState, useCallback } from "react";
import { ArrowRight, BadgeDollarSign, Palette, Copy, Search, RotateCw } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, any> = {
  en: { name: "English", title: "Color Palette Generator", subtitle: "Generate harmonious color palettes for your designs. Pick a base color or hit generate for a fresh random scheme.", searchLabel: "Search tools", searchPlaceholder: "Try: qr, base64, json, password", baseLabel: "Base color", generate: "Generate random", schemeLabel: "Harmony", copyHint: "Click any swatch to copy its hex code", copied: "Copied", articleTitle: "How Color Palettes Work", articleBody: "A good palette uses color theory to keep tones balanced and pleasant. Complementary schemes pair opposite hues for high contrast; analogous schemes use neighbours on the color wheel for a calm, cohesive look; triadic schemes spread three evenly spaced hues for vibrant variety; and monochromatic schemes vary one hue's lightness and saturation. This tool builds each scheme from your base color in the HSL color space, so every swatch stays in harmony. Click a swatch to copy its hex code straight into your CSS, Figma, or Tailwind config.", reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later.", schemes: { complementary: "Complementary", analogous: "Analogous", triadic: "Triadic", monochrome: "Monochrome" } },
  "zh-hk": { name: "繁體中文", title: "配色產生器", subtitle: "為你嘅設計產生和諧嘅配色。揀一個基本色，或者撳「隨機」攞一組全新配色。", searchLabel: "搜尋工具", searchPlaceholder: "試下：QR、base64、JSON、密碼", baseLabel: "基本色", generate: "隨機產生", schemeLabel: "色彩搭配", copyHint: "撳任何色塊就複製佢嘅 hex 色碼", copied: "已複製", articleTitle: "配色係點運作？", articleBody: "好嘅配色用色彩學嚟令色調平衡又舒服。互補色配相對嘅色相，對比強；類似色用色環上相鄰嘅色相，感覺和諧統一；三等分色取三個平均分佈嘅色相，鮮明又多變；單色系就變化同一色相嘅明度同飽和度。呢個工具喺 HSL 色彩空間用你嘅基本色建立每組配色，所以每個色塊都協調。撳色塊就可以複製 hex 色碼，直接貼入你嘅 CSS、Figma 或 Tailwind 設定。", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。", schemes: { complementary: "互補色", analogous: "類似色", triadic: "三等分色", monochrome: "單色系" } },
  "zh-cn": { name: "简体中文", title: "配色生成器", subtitle: "为你的设计生成和谐的配色。选一个基础色，或点击「随机」获取一组全新配色。", searchLabel: "搜索工具", searchPlaceholder: "试试：QR、base64、JSON、密码", baseLabel: "基础色", generate: "随机生成", schemeLabel: "色彩搭配", copyHint: "点击任意色块即可复制它的 hex 色值", copied: "已复制", articleTitle: "配色是如何工作的？", articleBody: "好的配色用色彩学让色调平衡又舒适。互补色搭配相对的色相，对比强烈；类似色使用色环上相邻的色相，感觉和谐统一；三等分色取三个均匀分布的色相，鲜明又多变；单色系则变化同一色相的明度和饱和度。此工具在 HSL 色彩空间用你的基础色构建每组配色，所以每个色块都协调。点击色块即可复制 hex 色值，直接粘贴到你的 CSS、Figma 或 Tailwind 配置。", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。", schemes: { complementary: "互补色", analogous: "类似色", triadic: "三等分色", monochrome: "单色系" } },
  es: { name: "Español", title: "Generador de paletas de colores", subtitle: "Genera paletas de colores armoniosas para tus diseños. Elige un color base o pulsa generar para un esquema aleatorio.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: qr, base64, json, password", baseLabel: "Color base", generate: "Generar aleatorio", schemeLabel: "Armonía", copyHint: "Haz clic en cualquier muestra para copiar su código hex", copied: "Copiado", articleTitle: "Cómo funcionan las paletas de colores", articleBody: "Una buena paleta usa la teoría del color para mantener los tonos equilibrados y agradables. Los esquemas complementarios combinan tonos opuestos para un alto contraste; los análogos usan vecinos en la rueda de color para un aspecto cohesivo; los triádicos reparten tres tonos equidistantes para una variedad vibrante; y los monocromáticos varían la luminosidad y saturación de un mismo tono. Esta herramienta construye cada esquema a partir de tu color base en el espacio HSL, así cada muestra permanece en armonía. Haz clic en una muestra para copiar su código hex directamente a tu CSS, Figma o configuración de Tailwind.", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante.", schemes: { complementary: "Complementario", analogous: "Análogo", triadic: "Triádico", monochrome: "Monocromático" } },
};

const TOOLS = [
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼生成器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator", keywords: ["qr"] },
  { title: { en: "Case Converter", "zh-hk": "大小寫轉換器", "zh-cn": "大小写转换器", es: "Conversor de mayúsculas" }, href: "/case-converter", keywords: ["case","text"] },
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化器", "zh-cn": "JSON 格式化器", es: "Formateador JSON" }, href: "/json-formatter", keywords: ["json"] },
  { title: { en: "Base64 Encoder / Decoder", "zh-hk": "Base64 編解碼", "zh-cn": "Base64 编解码", es: "Codif/Decod Base64" }, href: "/base64-encoder-decoder", keywords: ["base64"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/color-palette-generator";

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

type Scheme = "complementary" | "analogous" | "triadic" | "monochrome";

const hexToHsl = (hex: string) => {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number) => {
  h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
};

const buildPalette = (base: string, scheme: Scheme): string[] => {
  const { h, s, l } = hexToHsl(base);
  switch (scheme) {
    case "complementary": return [hslToHex(h, s, Math.max(20, l - 20)), base, hslToHex(h, s, Math.min(85, l + 18)), hslToHex(h + 180, s, l), hslToHex(h + 180, s, Math.min(85, l + 18))];
    case "analogous": return [hslToHex(h - 40, s, l), hslToHex(h - 20, s, l), base, hslToHex(h + 20, s, l), hslToHex(h + 40, s, l)];
    case "triadic": return [base, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l), hslToHex(h + 120, s, Math.min(85, l + 15)), hslToHex(h + 240, s, Math.min(85, l + 15))];
    case "monochrome": default: return [hslToHex(h, s, Math.max(15, l - 30)), hslToHex(h, s, Math.max(25, l - 15)), base, hslToHex(h, s, Math.min(80, l + 15)), hslToHex(h, s, Math.min(92, l + 30))];
  }
};

const randomHex = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
const readable = (hex: string) => hexToHsl(hex).l > 60 ? "#111111" : "#ffffff";

export default function ColorPaletteGenerator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [base, setBase] = useState("#2dd4a7");
  const [scheme, setScheme] = useState<Scheme>("analogous");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DesignApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const palette = useMemo(() => buildPalette(base, scheme), [base, scheme]);

  const copyHex = useCallback(async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  }, []);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["QR", "base64", "JSON", "密碼"] : locale === "zh-cn" ? ["QR", "base64", "JSON", "密码"] : ["qr", "base64", "json", "password"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search, locale]);
  const schemeKeys: Scheme[] = ["complementary", "analogous", "triadic", "monochrome"];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Palette className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="flex flex-wrap items-end gap-4">
                <label className="space-y-2"><span className="text-sm text-neutral-300">{content.baseLabel}</span>
                  <div className="flex items-center gap-2">
                    <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
                    <input value={base} onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{6}$/.test(v)) setBase(v); else if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBase(v); }} className="w-28 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-mono text-white outline-none focus:border-emerald-400/60" />
                  </div>
                </label>
                <button onClick={() => setBase(randomHex())} className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-200 transition hover:bg-emerald-400/20"><RotateCw className="h-4 w-4" />{content.generate}</button>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{content.schemeLabel}</p>
                <div className="flex flex-wrap gap-2">{schemeKeys.map((s) => <button key={s} onClick={() => setScheme(s)} className={"rounded-full border px-3 py-1.5 text-sm transition " + (scheme === s ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>{content.schemes[s]}</button>)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {palette.map((hex, i) => (
                  <button key={i} onClick={() => copyHex(hex)} className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-3 transition hover:scale-[1.02]" style={{ backgroundColor: hex }}>
                    <span className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-mono font-medium" style={{ color: readable(hex), backgroundColor: readable(hex) === "#ffffff" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)" }}>
                      {copied === hex ? content.copied : hex.toUpperCase()}<Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-white/40">{content.copyHint}</p>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Palette className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Common uses</h2><p className="text-sm text-neutral-300">Design-ready hex codes.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Pick brand and website color schemes.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Build Tailwind or CSS variable sets.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Match palettes in Figma and Canva.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Explore harmonies from one base color.</p>
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
