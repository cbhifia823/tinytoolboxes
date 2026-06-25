import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Copy, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string; title: string; subtitle: string;
  nowLabel: string; convertLabel: string; toDateLabel: string; toTimestampLabel: string;
  timestampInput: string; dateInput: string;
  utc: string; local: string; iso: string; relative: string;
  copy: string; copied: string;
  searchLabel: string; searchPlaceholder: string;
  useCasesTitle: string; useCasesSubtitle: string; useCases: string[];
  suggestionsTitle: string; suggestionsSubtitle: string; suggestions: string[];
}> = {
  en: {
    name: "English", title: "Unix Timestamp Converter", subtitle: "Convert between Unix timestamps and human-readable dates. Free, no sign-up.",
    nowLabel: "Current Unix timestamp", convertLabel: "Convert",
    toDateLabel: "Timestamp → Date", toTimestampLabel: "Date → Timestamp",
    timestampInput: "Unix timestamp (seconds)", dateInput: "Date & time",
    utc: "UTC", local: "Local", iso: "ISO 8601", relative: "Relative",
    copy: "Copy", copied: "Copied!",
    searchLabel: "Search tools", searchPlaceholder: "Try: base64, json, qr, password",
    useCasesTitle: "Use cases", useCasesSubtitle: "Why Unix timestamps matter.",
    useCases: ["Debug API responses with epoch times.", "Schedule cron jobs and background tasks.", "Compare timestamps across time zones."],
    suggestionsTitle: "You may also like", suggestionsSubtitle: "Other developer tools.",
    suggestions: ["Base64 Encode/Decode", "JSON Formatter", "QR Code Generator"],
  },
  "zh-hk": {
    name: "繁體中文", title: "Unix 時間戳轉換器", subtitle: "Unix 時間戳同日期互轉。免費、唔使註冊。",
    nowLabel: "目前 Unix 時間戳", convertLabel: "轉換",
    toDateLabel: "時間戳 → 日期", toTimestampLabel: "日期 → 時間戳",
    timestampInput: "Unix 時間戳（秒）", dateInput: "日期同時間",
    utc: "UTC", local: "本地", iso: "ISO 8601", relative: "相對時間",
    copy: "複製", copied: "已複製！",
    searchLabel: "搜尋工具", searchPlaceholder: "例如：base64、json、qr、password",
    useCasesTitle: "使用情境", useCasesSubtitle: "Unix 時間戳嘅用途。",
    useCases: ["Debug 用 epoch time 嘅 API 回應。", "排程 cron job 同背景任務。", "跨時區比較時間戳。"],
    suggestionsTitle: "你可能會喜歡", suggestionsSubtitle: "其他開發者工具。",
    suggestions: ["Base64 編碼／解碼", "JSON 格式化", "QR 碼產生器"],
  },
  "zh-cn": {
    name: "简体中文", title: "Unix 时间戳转换器", subtitle: "Unix 时间戳和日期互转。免费、不用注册。",
    nowLabel: "当前 Unix 时间戳", convertLabel: "转换",
    toDateLabel: "时间戳 → 日期", toTimestampLabel: "日期 → 时间戳",
    timestampInput: "Unix 时间戳（秒）", dateInput: "日期和时间",
    utc: "UTC", local: "本地", iso: "ISO 8601", relative: "相对时间",
    copy: "复制", copied: "已复制！",
    searchLabel: "搜索工具", searchPlaceholder: "例如：base64、json、qr、password",
    useCasesTitle: "使用场景", useCasesSubtitle: "Unix 时间戳的用途。",
    useCases: ["调试使用 epoch time 的 API 响应。", "排程 cron job 和后台任务。", "跨时区比较时间戳。"],
    suggestionsTitle: "你可能会喜欢", suggestionsSubtitle: "其他开发者工具。",
    suggestions: ["Base64 编码／解码", "JSON 格式化", "二维码生成器"],
  },
  es: {
    name: "Español", title: "Conversor de timestamp Unix", subtitle: "Convierte entre timestamps Unix y fechas legibles. Gratis, sin registro.",
    nowLabel: "Timestamp Unix actual", convertLabel: "Convertir",
    toDateLabel: "Timestamp → Fecha", toTimestampLabel: "Fecha → Timestamp",
    timestampInput: "Timestamp Unix (segundos)", dateInput: "Fecha y hora",
    utc: "UTC", local: "Local", iso: "ISO 8601", relative: "Relativo",
    copy: "Copiar", copied: "¡Copiado!",
    searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: base64, json, qr, password",
    useCasesTitle: "Casos de uso", useCasesSubtitle: "Por qué importan los timestamps Unix.",
    useCases: ["Depurar respuestas API con epoch times.", "Programar cron jobs.", "Comparar timestamps entre zonas horarias."],
    suggestionsTitle: "También te puede interesar", suggestionsSubtitle: "Otras herramientas para desarrolladores.",
    suggestions: ["Codificador Base64", "Formateador JSON", "Generador QR"],
  },
};

const TOOLS = [
  { title: { en: "Base64 Encode/Decode", "zh-hk": "Base64 編碼／解碼", "zh-cn": "Base64 编码／解码", es: "Codificador Base64" }, href: "/base64-encoder-decoder" },
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化", "zh-cn": "JSON 格式化", es: "Formateador JSON" }, href: "/json-formatter" },
  { title: { en: "Color Palette Generator", "zh-hk": "調色板產生器", "zh-cn": "调色板生成器", es: "Generador de paletas" }, href: "/color-palette-generator" },
  { title: { en: "Meta Tag Preview", "zh-hk": "Meta Tag 預覽", "zh-cn": "Meta 标签预览", es: "Vista previa meta tags" }, href: "/meta-tag-preview" },
  { title: { en: "Password Generator", "zh-hk": "密碼產生器", "zh-cn": "密码生成器", es: "Generador de contraseñas" }, href: "/password-generator" },
  { title: { en: "QR Code Generator", "zh-hk": "QR 碼產生器", "zh-cn": "二维码生成器", es: "Generador QR" }, href: "/qr-code-generator" },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/unix-timestamp-converter";

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

function formatUTC(d: Date) { return d.toUTCString(); }
function formatLocal(d: Date) { return d.toString(); }
function formatISO(d: Date) { return d.toISOString(); }
function formatRelative(d: Date) {
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);
  const units: [number, string][] = [[31536000, "year"], [2592000, "month"], [86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  for (const [sec, label] of units) {
    const n = Math.floor(abs / sec);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ${diffMs >= 0 ? "ago" : "from now"}`;
  }
  return "just now";
}

export default function UnixTimestampConverter() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleKey | null;
    return saved && LANGUAGES[saved] ? saved : "en";
  });
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState("");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    document.documentElement.lang = locale;
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH });
  }, [locale]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const content = LANGUAGES[locale];
  const ts = parseInt(timestamp);
  const dateFromTs = !isNaN(ts) && ts > 0 ? new Date(ts * 1000) : null;
  const tsFromDate = dateInput ? Math.floor(new Date(dateInput).getTime() / 1000) : null;

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => `${t.title[locale]} ${t.href}`.toLowerCase().includes(q));
  }, [search]);

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
            <div><div className="flex items-center gap-2"><span className="text-base font-semibold tracking-wide text-white">TinyToolboxes</span><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span></div><p className="text-sm text-white/50">Boring, useful, searchable.</p></div>
          </a>
          <div className="flex flex-wrap items-center gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === key ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>
      </header>

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Clock className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 flex items-center justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.nowLabel}</p><p className="mt-1 font-mono text-xl font-bold text-emerald-200">{now.toLocaleString()}</p></div>
              <button onClick={() => { navigator.clipboard.writeText(now.toString()); }} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200 transition hover:bg-emerald-400/20"><Copy className="inline h-3 w-3 mr-1" />{content.copy}</button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/80">{content.toDateLabel}</p>
                <div className="flex gap-3">
                  <input type="number" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder={content.timestampInput} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-400/60" />
                  <button onClick={() => setTimestamp(Date.now().toString().slice(0, 10))} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10">Now</button>
                </div>
                {dateFromTs && (
                  <div className="space-y-2 mt-4">
                    {[
                      [content.utc, formatUTC(dateFromTs)],
                      [content.local, formatLocal(dateFromTs)],
                      [content.iso, formatISO(dateFromTs)],
                      [content.relative, formatRelative(dateFromTs)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-2.5">
                        <span className="text-xs text-white/50">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-mono">{value}</span>
                          <button onClick={() => copyText(value)} className="text-white/40 hover:text-white/80"><Copy className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <hr className="border-white/10" />

              <div className="space-y-3">
                <p className="text-sm font-medium text-white/80">{content.toTimestampLabel}</p>
                <input type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                {tsFromDate && (
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 mt-3">
                    <span className="text-xs text-white/50">Unix timestamp</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-mono">{tsFromDate}</span>
                      <button onClick={() => copyText(tsFromDate.toString())} className="text-white/40 hover:text-white/80"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><p className="text-sm font-medium text-white">{t.title[locale]}</p><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Clock className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2><p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p></div></div>
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
