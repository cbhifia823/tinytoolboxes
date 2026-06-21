import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Clock3, Copy, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, any> = {
  en: { name: "English", title: "Unix Timestamp Converter", subtitle: "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, UTC and local time.", searchLabel: "Search tools", searchPlaceholder: "Try: base64, json, time, date", nowLabel: "Current Unix time", tsLabel: "Unix timestamp", dateLabel: "Date & time", utc: "UTC", local: "Local time", copyBtn: "Copy", copiedBtn: "Copied!", invalid: "Enter a valid number", invalidDate: "Enter a valid date", toDate: "Timestamp → Date", toTs: "Date → Timestamp", articleTitle: "Understanding Unix Timestamps", articleBody: "A Unix timestamp is the number of seconds that have elapsed since 00:00:00 UTC on 1 January 1970 (the Unix epoch), not counting leap seconds. It is the standard way computers store time because it is timezone-independent and easy to compare. Many APIs and databases use seconds, while JavaScript uses milliseconds. This converter detects both, and shows the result in UTC and your local time zone so you can debug logs, tokens, and scheduled events with confidence.", reserveAd: "Google Ads space reserved", reserveAdSub: "Drop your AdSense code here later." },
  "zh-hk": { name: "繁體中文", title: "Unix 時間戳轉換器", subtitle: "將 Unix 時間戳轉換成人類可讀嘅日期，反方向都得。支援秒同毫秒、UTC 同本地時間。", searchLabel: "搜尋工具", searchPlaceholder: "試下：base64、JSON、時間、日期", nowLabel: "目前 Unix 時間", tsLabel: "Unix 時間戳", dateLabel: "日期同時間", utc: "UTC", local: "本地時間", copyBtn: "複製", copiedBtn: "已複製！", invalid: "請輸入有效數字", invalidDate: "請輸入有效日期", toDate: "時間戳 → 日期", toTs: "日期 → 時間戳", articleTitle: "了解 Unix 時間戳", articleBody: "Unix 時間戳係由 1970 年 1 月 1 日 00:00:00 UTC（Unix 紀元）開始計算嘅秒數，唔計閏秒。電腦用佢嚟儲存時間，因為佢同時區無關、又易比較。好多 API 同資料庫用秒，而 JavaScript 用毫秒。呢個轉換器兩樣都偵測到，仲會顯示 UTC 同你本地時區嘅結果，方便你 debug log、token 同排程事件。", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。" },
  "zh-cn": { name: "简体中文", title: "Unix 时间戳转换器", subtitle: "将 Unix 时间戳转换为人类可读的日期，反向也可以。支持秒和毫秒、UTC 和本地时间。", searchLabel: "搜索工具", searchPlaceholder: "试试：base64、JSON、时间、日期", nowLabel: "当前 Unix 时间", tsLabel: "Unix 时间戳", dateLabel: "日期和时间", utc: "UTC", local: "本地时间", copyBtn: "复制", copiedBtn: "已复制！", invalid: "请输入有效数字", invalidDate: "请输入有效日期", toDate: "时间戳 → 日期", toTs: "日期 → 时间戳", articleTitle: "了解 Unix 时间戳", articleBody: "Unix 时间戳是从 1970 年 1 月 1 日 00:00:00 UTC（Unix 纪元）开始计算的秒数，不计闰秒。计算机用它来存储时间，因为它与时区无关、又易于比较。很多 API 和数据库使用秒，而 JavaScript 使用毫秒。此转换器两者都能检测，还会显示 UTC 和你本地时区的结果，方便你调试日志、令牌和计划事件。", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。" },
  es: { name: "Español", title: "Conversor de marca de tiempo Unix", subtitle: "Convierte marcas de tiempo Unix a fechas legibles y viceversa. Admite segundos y milisegundos, UTC y hora local.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: base64, json, hora, fecha", nowLabel: "Hora Unix actual", tsLabel: "Marca de tiempo Unix", dateLabel: "Fecha y hora", utc: "UTC", local: "Hora local", copyBtn: "Copiar", copiedBtn: "¡Copiado!", invalid: "Introduce un número válido", invalidDate: "Introduce una fecha válida", toDate: "Marca → Fecha", toTs: "Fecha → Marca", articleTitle: "Entender las marcas de tiempo Unix", articleBody: "Una marca de tiempo Unix es el número de segundos transcurridos desde las 00:00:00 UTC del 1 de enero de 1970 (la época Unix), sin contar los segundos intercalares. Es la forma estándar en que los ordenadores almacenan el tiempo porque es independiente de la zona horaria y fácil de comparar. Muchas API y bases de datos usan segundos, mientras que JavaScript usa milisegundos. Este conversor detecta ambos y muestra el resultado en UTC y en tu zona horaria local para depurar registros, tokens y eventos programados con confianza.", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante." },
};

const TOOLS = [
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Diferencia de fechas" }, href: "/date-difference-calculator", keywords: ["date","time"] },
  { title: { en: "Time Zone Converter", "zh-hk": "時區轉換器", "zh-cn": "时区转换器", es: "Conversor de zonas horarias" }, href: "/time-zone-converter", keywords: ["time","zone"] },
  { title: { en: "Base64 Encoder / Decoder", "zh-hk": "Base64 編解碼", "zh-cn": "Base64 编解码", es: "Codif/Decod Base64" }, href: "/base64-encoder-decoder", keywords: ["base64"] },
  { title: { en: "JSON Formatter", "zh-hk": "JSON 格式化器", "zh-cn": "JSON 格式化器", es: "Formateador JSON" }, href: "/json-formatter", keywords: ["json"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/unix-timestamp-converter";

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

const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export default function UnixTimestampConverter() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState(() => toLocalInput(new Date()));
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: L.title + " | TinyToolboxes", description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  useEffect(() => { const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000); return () => clearInterval(id); }, []);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500);
  };

  const tsDate = useMemo(() => {
    const raw = ts.trim();
    if (!/^\d{1,16}$/.test(raw)) return null;
    let n = Number(raw);
    if (raw.length > 11) n = Math.floor(n); else n = n * 1000; // >11 digits => already ms
    const d = new Date(n);
    return isNaN(d.getTime()) ? null : d;
  }, [ts]);

  const dateTs = useMemo(() => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
  }, [dateStr]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["base64", "JSON", "時間", "日期"] : locale === "zh-cn" ? ["base64", "JSON", "时间", "日期"] : ["base64", "json", "time", "date"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => (t.title[locale] + " " + t.keywords.join(" ")).toLowerCase().includes(q)); }, [search, locale]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Clock3 className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
              <div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{content.nowLabel}</p><p className="mt-1 text-2xl font-mono font-semibold text-white">{now}</p></div>
              <button onClick={() => copyText(String(now), "now")} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"><Copy className="h-3 w-3" />{copied.now ? content.copiedBtn : content.copyBtn}</button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
              <h3 className="text-sm font-semibold text-emerald-200">{content.toDate}</h3>
              <input value={ts} onChange={(e) => setTs(e.target.value)} inputMode="numeric" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-mono text-white outline-none focus:border-emerald-400/60" placeholder={content.tsLabel} />
              {tsDate ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><p className="text-xs text-white/45">{content.utc}</p><p className="text-sm text-white/90 font-mono">{tsDate.toISOString().replace("T", " ").replace(".000Z", " UTC")}</p></div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><p className="text-xs text-white/45">{content.local}</p><p className="text-sm text-white/90 font-mono">{tsDate.toLocaleString()}</p></div>
                </div>
              ) : <p className="text-sm text-red-400">{content.invalid}</p>}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
              <h3 className="text-sm font-semibold text-emerald-200">{content.toTs}</h3>
              <input type="datetime-local" step={1} value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60 [color-scheme:dark]" />
              {dateTs !== null ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div><p className="text-xs text-white/45">{content.tsLabel}</p><p className="text-sm text-white/90 font-mono">{dateTs} <span className="text-white/40">s</span> · {dateTs * 1000} <span className="text-white/40">ms</span></p></div>
                  <button onClick={() => copyText(String(dateTs), "dts")} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65 hover:bg-white/10 transition"><Copy className="h-3 w-3" />{copied.dts ? content.copiedBtn : content.copyBtn}</button>
                </div>
              ) : <p className="text-sm text-red-400">{content.invalidDate}</p>}
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Clock3 className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Common uses</h2><p className="text-sm text-neutral-300">Seconds and milliseconds.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Debug log entries and API responses.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Read token expiry (exp / iat) fields.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Schedule cron jobs and cache expiry.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Convert database datetime columns.</p>
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
