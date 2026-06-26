import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Copy, Key, RefreshCw, Search, Check } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English", title: "Password Generator", subtitle: "Generate strong, random passwords with customizable length and character sets.",
    searchLabel: "Search tools", searchPlaceholder: "Try: QR, age, unit, url",
    lengthLabel: "Length", uppLabel: "Uppercase", lowLabel: "Lowercase", numLabel: "Numbers", symLabel: "Symbols",
    generate: "Generate", regenerate: "New", copy: "Copy", copied: "Copied!", strength: "Strength",
    weak: "Weak", good: "Good", strong: "Strong", excellent: "Excellent",
    reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later."
  },
  "zh-hk": {
    name: "繁體中文", title: "密碼產生器", subtitle: "生成高強度嘅隨機密碼，可以自訂長度同字符組合。",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：QR、年齡、單位、URL",
    lengthLabel: "長度", uppLabel: "大階", lowLabel: "細階", numLabel: "數字", symLabel: "符號",
    generate: "產生", regenerate: "換一個", copy: "複製", copied: "已複製！", strength: "強度",
    weak: "弱", good: "可以", strong: "強", excellent: "好強",
    reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。"
  },
  "zh-cn": {
    name: "简体中文", title: "密码生成器", subtitle: "生成高强度的随机密码，可自定义长度和字符组合。",
    searchLabel: "搜索工具", searchPlaceholder: "例如：QR、年龄、单位、URL",
    lengthLabel: "长度", uppLabel: "大写", lowLabel: "小写", numLabel: "数字", symLabel: "符号",
    generate: "生成", regenerate: "换一个", copy: "复制", copied: "已复制！", strength: "强度",
    weak: "弱", good: "可以", strong: "强", excellent: "很强",
    reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。"
  },
  es: {
    name: "Español", title: "Generador de contraseñas", subtitle: "Crea contraseñas seguras y aleatorias con longitud y caracteres personalizables.",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: QR, edad, unidad, url",
    lengthLabel: "Longitud", uppLabel: "Mayúsculas", lowLabel: "Minúsculas", numLabel: "Números", symLabel: "Símbolos",
    generate: "Generar", regenerate: "Nueva", copy: "Copiar", copied: "¡Copiado!", strength: "Fuerza",
    weak: "Débil", good: "Bien", strong: "Fuerte", excellent: "Excelente",
    reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Inserta AdSense aquí más tarde."
  },
};

const TOOLS = [
  { title: { en: "QR Code Generator", "zh-hk": "QR Code 產生器", "zh-cn": "二维码生成器", es: "Generador de QR" }, description: { en: "Make QR codes from text or URLs.", "zh-hk": "用文字或網址整 QR Code。", "zh-cn": "用文字或网址生成二维码。", es: "Crea códigos QR desde texto o URL." }, href: "/qr-code-generator", keywords: ["qr"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "六大類量度轉換。", "zh-cn": "六类度量转换。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate your exact age.", "zh-hk": "計你嘅準確年齡。", "zh-cn": "计算你的确切年龄。", es: "Calcula tu edad exacta." }, href: "/age-calculator", keywords: ["age"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼", "zh-cn": "URL 编解码", es: "Codificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "將網址入面嘅特殊字元轉做 % 編碼。", "zh-cn": "将网址里的特殊字符转为 % 编码。", es: "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url"] },
];

const CHARS = { upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", lower: "abcdefghijklmnopqrstuvwxyz", digits: "0123456789", symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?" };

function generatePW(length: number, useUpper: boolean, useLower: boolean, useDigits: boolean, useSymbols: boolean) {
  let pool = "";
  if (useUpper) pool += CHARS.upper;
  if (useLower) pool += CHARS.lower;
  if (useDigits) pool += CHARS.digits;
  if (useSymbols) pool += CHARS.symbols;
  if (!pool) pool = CHARS.lower + CHARS.digits;
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let result = "";
  for (let i = 0; i < length; i++) result += pool[arr[i] % pool.length];
  return result;
}

function entropy(pw: string, poolSize: number) { return pw.length * Math.log2(poolSize); }

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/password-generator";

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
  const meta = (name: string, content: string) => upsert('meta[name="'+name+'"]', () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) => upsert('meta[property="'+p+'"]', () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
}

export default function PasswordGenerator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [length, setLen] = useState(24);
  const [useUpper, setUpper] = useState(true);
  const [useLower, setLower] = useState(true);
  const [useDigits, setDigits] = useState(true);
  const [useSymbols, setSymbols] = useState(true);
  const [pw, setPw] = useState("");
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH });
  }, [locale]);

  useEffect(() => { setPw(generatePW(length, useUpper, useLower, useDigits, useSymbols)); }, [length, useUpper, useLower, useDigits, useSymbols]);

  const poolSize = (useUpper ? 26 : 0) + (useLower ? 26 : 0) + (useDigits ? 10 : 0) + (useSymbols ? CHARS.symbols.length : 0);
  const bits = entropy(pw, poolSize || 62);
  const level: "weak" | "good" | "strong" | "excellent" = bits >= 128 ? "excellent" : bits >= 80 ? "strong" : bits >= 50 ? "good" : "weak";
  const levelColor = level === "excellent" ? "from-emerald-400 to-teal-500" : level === "strong" ? "from-blue-400 to-cyan-500" : level === "good" ? "from-amber-400 to-yellow-500" : "from-red-400 to-rose-500";

  const content = LANGUAGES[locale];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.description[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Key className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={"rounded-full border px-3 py-2 text-sm transition " + (locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{content.lengthLabel}: {length}</span>
                <input type="range" min="8" max="64" value={length} onChange={(e) => setLen(Number(e.target.value))} className="w-full accent-emerald-400" />
              </label>
              <div className="flex flex-wrap gap-3">
                {[{k:"upper",v:useUpper,s:setUpper,l:content.uppLabel},{k:"lower",v:useLower,s:setLower,l:content.lowLabel},{k:"digits",v:useDigits,s:setDigits,l:content.numLabel},{k:"symbols",v:useSymbols,s:setSymbols,l:content.symLabel}].map(({k,v,s,l}) => (
                  <label key={k} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm cursor-pointer hover:bg-white/10 transition">
                    <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} className="rounded accent-emerald-400" />
                    <span className="text-white/80">{l}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex-1 text-sm font-mono text-white break-all select-all">{pw}</div>
                <button onClick={async () => { await navigator.clipboard.writeText(pw); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex items-center gap-1.5 rounded-xl bg-emerald-400/15 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-400/25 transition">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? content.copied : content.copy}
                </button>
                <button onClick={() => setPw(generatePW(length, useUpper, useLower, useDigits, useSymbols))} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition">
                  <RefreshCw className="h-4 w-4" />{content.regenerate}
                </button>
              </div>
              <div className={"rounded-2xl bg-gradient-to-r px-4 py-2 text-sm font-semibold text-neutral-900 " + levelColor}>
                {content.strength}: {content[level]} ({bits.toFixed(0)} bits)
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Key className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Use cases</h2><p className="text-sm text-neutral-300">Secure passwords in one click.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Login and account registration.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">API keys and service credentials.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Temporary access or guest passwords.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
