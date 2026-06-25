import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Lock, LockKeyhole, Palette, Search, Unlock } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Color Palette Generator",
    subtitle: "Browse preset palettes, generate random color combinations, and copy hex codes instantly.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: json, qr, base64, timestamp",
    searchHint: "Search hints",
    presetsLabel: "Preset Palettes",
    presetsHint: "Click a palette to select it.",
    activeLabel: "Active Palette",
    copyAll: "Copy all colors",
    copyHex: "Copy",
    copied: "Copied!",
    regen: "Regen unlocked",
    randomize: "Random palette",
    resetLocks: "Unlock all",
    lock: "Lock",
    unlock: "Unlock",
    adText: "Advertisement",
    useCasesTitle: "Use cases",
    useCasesSubtitle: "Quick color palettes for design and dev work.",
    useCases: ["UI / web design color schemes.", "Brand identity and logo palettes.", "CSS custom property generation."],
    suggestionsTitle: "You may also like",
    suggestionsSubtitle: "Other tools that pair well with design work.",
    suggestions: ["URL Encoder / Decoder", "Age Calculator", "Unit Converter"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "調色板生成器",
    subtitle: "瀏覽預設調色板、生成隨機色彩組合，一鍵複製顏色代碼。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：json、qr、base64、timestamp",
    searchHint: "搜尋提示",
    presetsLabel: "預設調色板",
    presetsHint: "點擊調色板即可選取。",
    activeLabel: "當前調色板",
    copyAll: "複製全部顏色",
    copyHex: "複製",
    copied: "已複製！",
    regen: "重新生成未鎖定",
    randomize: "隨機調色板",
    resetLocks: "解鎖全部",
    lock: "鎖定",
    unlock: "解鎖",
    adText: "廣告",
    useCasesTitle: "使用情境",
    useCasesSubtitle: "設計同開發嘅快速配色方案。",
    useCases: ["UI／網頁設計配色方案。", "品牌識別同標誌調色板。", "CSS 自訂屬性生成。"],
    suggestionsTitle: "你可能會喜歡",
    suggestionsSubtitle: "同設計工作配搭嘅工具。",
    suggestions: ["URL 編碼／解碼", "年齡計算器", "單位轉換器"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "调色板生成器",
    subtitle: "浏览预设调色板、生成随机色彩组合，一键复制颜色代码。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：json、qr、base64、timestamp",
    searchHint: "搜索提示",
    presetsLabel: "预设调色板",
    presetsHint: "点击调色板即可选取。",
    activeLabel: "当前调色板",
    copyAll: "复制全部颜色",
    copyHex: "复制",
    copied: "已复制！",
    regen: "重新生成未锁定",
    randomize: "随机调色板",
    resetLocks: "解锁全部",
    lock: "锁定",
    unlock: "解锁",
    adText: "广告",
    useCasesTitle: "使用场景",
    useCasesSubtitle: "设计和开发的快速配色方案。",
    useCases: ["UI／网页设计配色方案。", "品牌识别和标志调色板。", "CSS 自定义属性生成。"],
    suggestionsTitle: "你可能会喜欢",
    suggestionsSubtitle: "和设计工作搭配的工具。",
    suggestions: ["URL 编码／解码", "年龄计算器", "单位转换器"],
  },
  es: {
    name: "Español",
    title: "Generador de paletas de colores",
    subtitle: "Explora paletas predefinidas, genera combinaciones aleatorias y copia códigos de color al instante.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: json, qr, base64, timestamp",
    searchHint: "Sugerencias",
    presetsLabel: "Paletas predefinidas",
    presetsHint: "Haz clic en una paleta para seleccionarla.",
    activeLabel: "Paleta activa",
    copyAll: "Copiar todos los colores",
    copyHex: "Copiar",
    copied: "¡Copiado!",
    regen: "Regenerar desbloq.",
    randomize: "Paleta aleatoria",
    resetLocks: "Desbloquear todo",
    lock: "Bloquear",
    unlock: "Desbloquear",
    adText: "Anuncio",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Paletas rápidas para diseño y desarrollo.",
    useCases: ["Esquemas de color para UI / web.", "Paletas de marca y logotipos.", "Generación de propiedades CSS."],
    suggestionsTitle: "También te puede interesar",
    suggestionsSubtitle: "Herramientas que combinan bien con diseño.",
    suggestions: ["URL Encoder / Decoder", "Calculadora de edad", "Conversor de unidades"],
  },
} satisfies Record<LocaleKey, Record<string, any>>;

const PALETTES: Record<string, { name: Record<LocaleKey, string>; colors: string[] }> = {
  ocean: { name: { en: "Ocean", "zh-hk": "海洋", "zh-cn": "海洋", es: "Océano" }, colors: ["#006994", "#003D5B", "#00B4D8", "#90E0EF", "#CAF0F8"] },
  sunset: { name: { en: "Sunset", "zh-hk": "日落", "zh-cn": "日落", es: "Atardecer" }, colors: ["#FF6B35", "#F7C59F", "#EFEFD0", "#004E89", "#1A659E"] },
  forest: { name: { en: "Forest", "zh-hk": "森林", "zh-cn": "森林", es: "Bosque" }, colors: ["#2D6A4F", "#40916C", "#52B788", "#95D5B2", "#D8F3DC"] },
  candy: { name: { en: "Candy", "zh-hk": "糖果", "zh-cn": "糖果", es: "Caramelo" }, colors: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#A78BFA", "#FB7185"] },
  midnight: { name: { en: "Midnight", "zh-hk": "午夜", "zh-cn": "午夜", es: "Medianoche" }, colors: ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"] },
  pastel: { name: { en: "Pastel", "zh-hk": "粉彩", "zh-cn": "粉彩", es: "Pastel" }, colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"] },
  neon: { name: { en: "Neon", "zh-hk": "霓虹", "zh-cn": "霓虹", es: "Neón" }, colors: ["#FF006E", "#FFBE0B", "#3A86FF", "#8338EC", "#00F5D4"] },
  earth: { name: { en: "Earth", "zh-hk": "大地", "zh-cn": "大地", es: "Tierra" }, colors: ["#582F0E", "#7F4F24", "#936639", "#A68A64", "#C2C5AA"] },
};

const TOOLS = [
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化器", "zh-cn": "JSON 格式化器", es: "Formateador JSON" }, description: { en: "Format and validate JSON.", "zh-hk": "格式化同驗證 JSON。", "zh-cn": "格式化和验证 JSON。", es: "Formatea y valida JSON." }, href: "/json-formatter", keywords: ["json", "format"] },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼生成器", "zh-cn": "二维码生成器", es: "Generador de QR" }, description: { en: "Create QR codes instantly.", "zh-hk": "即時生成 QR 碼。", "zh-cn": "即时生成二维码。", es: "Crea códigos QR al instante." }, href: "/qr-code-generator", keywords: ["qr", "code"] },
  { title: { en: "Base64 Encode/Decode", "zh-hk": "Base64 編碼／解碼", "zh-cn": "Base64 编码／解码", es: "Codificador Base64" }, description: { en: "Encode or decode Base64 strings.", "zh-hk": "編碼或解碼 Base64 字串。", "zh-cn": "编码或解码 Base64 字符串。", es: "Codifica o decodifica cadenas Base64." }, href: "/base64-encode-decode", keywords: ["base64", "encode", "decode"] },
  { title: { en: "Unix Timestamp Converter", "zh-hk": "Unix 時間戳轉換器", "zh-cn": "Unix 时间戳转换器", es: "Conversor de timestamp" }, description: { en: "Convert Unix timestamps to dates.", "zh-hk": "轉換 Unix 時間戳為日期。", "zh-cn": "转换 Unix 时间戳为日期。", es: "Convierte timestamps Unix a fechas." }, href: "/unix-timestamp-converter", keywords: ["unix", "timestamp"] },
  { title: { en: "Meta Tag Preview", "zh-hk": "Meta 標籤預覽器", "zh-cn": "Meta 标签预览器", es: "Preview de meta tags" }, description: { en: "Preview social media meta tags.", "zh-hk": "預覽社交媒體 meta 標籤。", "zh-cn": "预览社交媒体 meta 标签。", es: "Previsualiza meta tags para redes." }, href: "/meta-tag-preview", keywords: ["meta", "og", "twitter"] },
  { title: { en: "Password Generator", "zh-hk": "密碼生成器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, description: { en: "Generate strong passwords.", "zh-hk": "生成強密碼。", "zh-cn": "生成强密码。", es: "Genera contraseñas seguras." }, href: "/password-generator", keywords: ["password", "secure"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼／解碼", "zh-cn": "URL 编码／解码", es: "Codificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", es: "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url", "encode", "decode"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age.", "zh-hk": "計算準確年齡。", "zh-cn": "计算准确年龄。", es: "Calcula la edad exacta." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "計算兩日期間嘅日數。", "zh-cn": "计算两日期间的天数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "加工作日至任何日期。", "zh-cn": "加工作日到任何日期。", es: "Agrega días hábiles." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
];

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 60;
  const lightness = Math.floor(Math.random() * 25) + 35;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function hslToHex(hsl: string): string {
  const m = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!m) return hsl;
  const h = parseInt(m[1]) / 360;
  const s = parseInt(m[2]) / 100;
  const l = parseInt(m[3]) / 100;
  const toRgb = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(toRgb(p, q, h + 1/3) * 255);
  const g = Math.round(toRgb(p, q, h) * 255);
  const b = Math.round(toRgb(p, q, h - 1/3) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function generateRandomPalette(): string[] {
  return Array.from({ length: 5 }, () => hslToHex(generateRandomColor()));
}

function SearchBox({ locale, value, onChange }: { locale: LocaleKey; value: string; onChange: (v: string) => void }) {
  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["JSON", "QR", "Base64", "Timestamp"] : locale === "zh-cn" ? ["JSON", "QR", "Base64", "Timestamp"] : locale === "es" ? ["json", "qr", "base64", "timestamp"] : ["json", "qr", "base64", "timestamp"];
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(q)).slice(0, 4);
  }, [value, locale]);
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-emerald-300" />
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">{hints.map((hint) => <button key={hint} onClick={() => onChange(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10">{hint}</button>)}</div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">{content.searchHint}</p>
        {filtered.map((tool) => (
          <a key={tool.href} href={tool.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10">
            <span>{tool.title[locale]}</span>
            <ArrowRight className="h-4 w-4 text-white/35" />
          </a>
        ))}
      </div>
    </section>
  );
}

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

export default function ColorPaletteGenerator() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleKey | null;
    return saved && LANGUAGES[saved] ? saved : "en";
  });
  const [activeColors, setActiveColors] = useState<string[]>(["#006994", "#003D5B", "#00B4D8", "#90E0EF", "#CAF0F8"]);
  const [lockedMask, setLockedMask] = useState<boolean[]>([false, false, false, false, false]);
  const [selectedPaletteKey, setSelectedPaletteKey] = useState<string>("ocean");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [search, setSearch] = useState("");

  const content = LANGUAGES[locale];

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    document.documentElement.lang = locale;
    applySEO({
      title: `${content.title} | TinyToolboxes`,
      description: content.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: content.title, url: SITE_URL + PAGE_PATH, description: content.subtitle, applicationCategory: "DesignApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const selectPreset = useCallback((key: string) => {
    const palette = PALETTES[key];
    setSelectedPaletteKey(key);
    setActiveColors([...palette.colors]);
    setLockedMask([false, false, false, false, false]);
  }, []);

  const toggleLock = useCallback((index: number) => {
    setLockedMask((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const regenerateUnlocked = useCallback(() => {
    const fresh = generateRandomPalette();
    setActiveColors((prev) => prev.map((c, i) => (lockedMask[i] ? c : fresh[i])));
  }, [lockedMask]);

  const randomizeAll = useCallback(() => {
    setActiveColors(generateRandomPalette());
    setLockedMask([false, false, false, false, false]);
    setSelectedPaletteKey("");
  }, []);

  const unlockAll = useCallback(() => {
    setLockedMask([false, false, false, false, false]);
  }, []);

  const copyHex = useCallback(async (hex: string, index: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  const copyAllColors = useCallback(async () => {
    await navigator.clipboard.writeText(activeColors.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }, [activeColors]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPreset(key); }
  }, [selectPreset]);

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

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{content.presetsLabel}</p>
                  <p className="mt-1 text-sm text-neutral-300">{content.presetsHint}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(PALETTES).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => selectPreset(key)}
                    onKeyDown={(e) => handleKeyDown(e, key)}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${selectedPaletteKey === key ? "border-emerald-400/70 ring-1 ring-emerald-400/30" : "border-white/10 hover:border-white/20"}`}
                  >
                    <div className="flex h-12 w-full">
                      {palette.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="px-3 py-2 text-xs font-medium text-white/80">{palette.name[locale]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{content.activeLabel}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={randomizeAll} className="rounded-full border border-white/10 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/20">{content.randomize}</button>
                  <button onClick={regenerateUnlocked} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10">{content.regen}</button>
                  <button onClick={unlockAll} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10" title={content.resetLocks}><Unlock className="h-4 w-4" /></button>
                  <button onClick={copyAllColors} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10">{copiedAll ? content.copied : content.copyAll}</button>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-5">
                {activeColors.map((color, index) => (
                  <div key={index} className="group relative flex flex-col items-center gap-3">
                    <div
                      className={`relative w-full aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${lockedMask[index] ? "border-emerald-400/80 ring-1 ring-emerald-400/30" : "border-white/10 hover:border-white/25"}`}
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-mono text-white backdrop-blur-sm">{color}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-white/60">{color}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyHex(color, index)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white/90"
                      >
                        {copiedIndex === index ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => toggleLock(index)}
                        className={`rounded-full border px-2 py-1 text-xs transition ${lockedMask[index] ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10"}`}
                        title={lockedMask[index] ? content.unlock : content.lock}
                      >
                        {lockedMask[index] ? <Lock className="h-3 w-3" /> : <LockKeyhole className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SearchBox locale={locale} value={search} onChange={setSearch} />

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-center text-xs uppercase tracking-[0.25em] text-white/30">{content.adText}</p>
              <div className="mt-4 flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                <span className="text-sm text-white/25">{content.adText}</span>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3"><Palette className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-lg font-semibold">{content.useCasesTitle}</h2>
                  <p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                {content.useCases.map((item: string) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">{content.suggestionsTitle}</h2>
              <p className="mt-1 text-sm text-neutral-300">{content.suggestionsSubtitle}</p>
              <div className="mt-4 space-y-2">
                {(content.suggestions as string[]).map((name) => {
                  const match = TOOLS.find((tool) => tool.title.en === name || tool.title[locale] === name);
                  return (
                    <button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
