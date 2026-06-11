import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Clock, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Time Zone Converter",
    subtitle: "Convert times between time zones.",
    reserveAd: "Ad",
    timeLabel: "Time",
    fromLabel: "From",
    resultLabel: "Result",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    now: "Now",
    remove: "Remove",
    addZone: "Add zone",
    adLabel: "Ad",
    reserveAdSub: "Ad",
    adBadge: "Ad",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "時區轉換器",
    subtitle: "在不同時區之間轉換時間。",
    reserveAd: "廣告",
    timeLabel: "時間",
    fromLabel: "從",
    resultLabel: "結果",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    now: "現在",
    remove: "移除",
    addZone: "新增時區",
    adLabel: "廣告",
    reserveAdSub: "廣告",
    adBadge: "廣告",
  },
  "zh-cn": {
    name: "简体中文",
    title: "时区转换器",
    subtitle: "在不同时区之间转换时间。",
    reserveAd: "广告",
    timeLabel: "时间",
    fromLabel: "从",
    resultLabel: "结果",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    now: "现在",
    remove: "移除",
    addZone: "新增时区",
    adLabel: "广告",
    reserveAdSub: "广告",
    adBadge: "广告",
  },
  ja: {
    name: "日本語",
    title: "タイムゾーン変換器",
    subtitle: "タイムゾーン間で時間を変換します。",
    reserveAd: "広告",
    timeLabel: "時間",
    fromLabel: "から",
    resultLabel: "結果",
    searchLabel: "検索",
    searchPlaceholder: "ツールを検索...",
    now: "現在",
    remove: "削除",
    addZone: "ゾーンを追加",
    adLabel: "広告",
    reserveAdSub: "広告",
    adBadge: "広告",
  },
};

const POPULAR_ZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Hong_Kong", "Asia/Shanghai",
  "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney", "Pacific/Auckland", "Pacific/Honolulu",
];

const ZONE_LABELS: Record<string, string> = {
  "UTC": "UTC", "America/New_York": "New York (ET)", "America/Chicago": "Chicago (CT)",
  "America/Denver": "Denver (MT)", "America/Los_Angeles": "Los Angeles (PT)",
  "America/Sao_Paulo": "São Paulo (BRT)", "Europe/London": "London (GMT/BST)",
  "Europe/Paris": "Paris (CET)", "Europe/Berlin": "Berlin (CET)",
  "Europe/Moscow": "Moscow (MSK)", "Asia/Dubai": "Dubai (GST)",
  "Asia/Kolkata": "Mumbai/Delhi (IST)", "Asia/Bangkok": "Bangkok (ICT)",
  "Asia/Hong_Kong": "Hong Kong (HKT)", "Asia/Shanghai": "Shanghai (CST)",
  "Asia/Tokyo": "Tokyo (JST)", "Asia/Seoul": "Seoul (KST)",
  "Australia/Sydney": "Sydney (AEST)", "Pacific/Auckland": "Auckland (NZST)",
  "Pacific/Honolulu": "Honolulu (HST)",
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", "ja": "年齢計算器" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", "ja": "出生日から正確な年齢を計算します。" }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算器", "zh-cn": "日期差计算器", "ja": "日付の差計算器" }, description: { en: "Days between two dates.", "zh-hk": "兩個日期之間的日期。", "zh-cn": "两个日期之间的天数。", "ja": "二つの日付の間の日数。" }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", "ja": "パーセンテージ計算器" }, description: { en: "Percentage of a number.", "zh-hk": "數字的百分比。", "zh-cn": "数字的百分比。", "ja": "数字のパーセンテージ。" }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", "ja": "単位変換器" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", "ja": "長さ、重量、温度を変換します。" }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算器", "zh-cn": "工作日计算器", "ja": "営業日計算器" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期增加工作日。", "zh-cn": "为任何日期增加工作日。", "ja": "任意の日に営業日を追加します。" }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", "ja": "文字数計算器" }, description: { en: "Count words and characters.", "zh-hk": "計算字數和字符。", "zh-cn": "计算字数和字符。", "ja": "文字と文字数をカウントします。" }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", "ja": "URL エンコーダー / デコーダー" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", "ja": "URL をエンコードまたはデコードします。" }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

function formatInZone(dt: Date, zone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(dt);
  } catch { return "—"; }
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/time-zone-converter";

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

export default function TimeZoneConverter() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [inputTime, setInputTime] = useState(() => { const d = new Date(); d.setSeconds(0, 0); return d.toISOString().slice(0, 16); });
  const [fromZone, setFromZone] = useState("UTC");
  const [toZones, setToZones] = useState(["America/New_York", "Europe/London", "Asia/Hong_Kong", "Asia/Tokyo"]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const sourceDate = useMemo(() => {
    if (!inputTime) return null;
    try {
      const [datePart, timePart] = inputTime.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);
      const localStr = `${datePart}T${timePart}:00`;
      const inZone = new Date(localStr);
      const targetOffset = new Date(new Intl.DateTimeFormat("en", { timeZone: fromZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(inZone)).getTime();
      const diff = inZone.getTime() - targetOffset;
      return new Date(inZone.getTime() + diff);
    } catch { return null; }
  }, [inputTime, fromZone]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "百分比", "體積重量", "URL"] : locale === "zh-cn" ? ["年龄", "百分比", "体积重量", "URL"] : ["age", "percent", "weight", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const available = POPULAR_ZONES.filter((z) => z !== fromZone && !toZones.includes(z));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Clock className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.timeLabel}</span>
                  <div className="flex gap-2">
                    <input type="datetime-local" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                    <button onClick={() => { const d = new Date(); d.setSeconds(0, 0); setInputTime(d.toISOString().slice(0, 16)); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10 transition">{content.now}</button>
                  </div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.fromLabel}</span>
                  <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {POPULAR_ZONES.map((z) => <option key={z} value={z}>{ZONE_LABELS[z] || z}</option>)}
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.resultLabel}</p>
                {toZones.map((zone) => (
                  <div key={zone} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div>
                      <p className="text-xs text-emerald-300/70">{ZONE_LABELS[zone] || zone}</p>
                      <p className="mt-1 text-base font-medium text-white">{sourceDate ? formatInZone(sourceDate, zone) : "—"}</p>
                    </div>
                    <button onClick={() => setToZones(toZones.filter((z) => z !== zone))} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55 hover:bg-red-500/10 hover:text-red-300 transition">{content.remove}</button>
                  </div>
                ))}
                {available.length > 0 && (
                  <select onChange={(e) => { if (e.target.value) setToZones([...toZones, e.target.value]); e.target.value = ""; }} defaultValue="" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70 outline-none focus:border-emerald-400/60">
                    <option value="" disabled>+ {content.addZone}</option>
                    {available.map((z) => <option key={z} value={z}>{ZONE_LABELS[z] || z}</option>)}
                  </select>
                )}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">How Time Zones Work</h2>
                <p className="mt-3 leading-7">The Earth rotates 360 degrees every 24 hours, which means it moves 15 degrees per hour. This is the basis for the 24 primary time zones that divide the planet: each zone spans roughly 15 degrees of longitude. Move one zone east and you gain one hour; move one zone west and you lose one hour.</p>
                <p className="mt-3 leading-7">The global reference point is UTC — Coordinated Universal Time. UTC is the successor to Greenwich Mean Time (GMT) and is maintained by atomic clocks. All other time zones are expressed as offsets from UTC. New York in winter runs at UTC−5 (Eastern Standard Time), London in winter is UTC+0 (GMT), India is UTC+5:30, and Hong Kong is UTC+8 year-round.</p>
                <p className="mt-3 leading-7">Before 1884, there was no global time standard. Every city kept its own solar time, set by when the sun reached its highest point locally. When railways began connecting cities in the 19th century, the patchwork of local times made timetables nearly impossible to manage. The International Meridian Conference of 1884 designated the Prime Meridian at Greenwich, England, as the reference longitude for global time, giving rise to the modern time zone system. Today, the precise boundaries of time zones are determined by national and regional governments, which is why real-world zones are far from neat 15-degree wedges.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">UTC Offsets and Key Time Zones</h2>
                <p className="mt-3 leading-7">Here is a reference table of major time zones and their standard UTC offsets. Note that offsets change during Daylight Saving Time for the regions that observe it.</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4 text-left font-semibold text-white">Abbreviation</th>
                        <th className="py-2 pr-4 text-left font-semibold text-white">UTC Offset</th>
                        <th className="py-2 text-left font-semibold text-white">Region / City</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">PST</td><td className="py-2 pr-4">UTC−8</td><td className="py-2">Los Angeles, Seattle, Vancouver</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">MST</td><td className="py-2 pr-4">UTC−7</td><td className="py-2">Denver, Phoenix, Calgary</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">CST</td><td className="py-2 pr-4">UTC−6</td><td className="py-2">Chicago, Houston, Mexico City</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">EST</td><td className="py-2 pr-4">UTC−5</td><td className="py-2">New York, Toronto, Miami</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">GMT / UTC</td><td className="py-2 pr-4">UTC+0</td><td className="py-2">London, Reykjavik, Accra</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">CET</td><td className="py-2 pr-4">UTC+1</td><td className="py-2">Paris, Berlin, Rome, Amsterdam</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">EET</td><td className="py-2 pr-4">UTC+2</td><td className="py-2">Athens, Cairo, Helsinki</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">IST</td><td className="py-2 pr-4">UTC+5:30</td><td className="py-2">Mumbai, Delhi, Bengaluru</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">CST (China)</td><td className="py-2 pr-4">UTC+8</td><td className="py-2">Beijing, Shanghai, Chengdu</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">HKT</td><td className="py-2 pr-4">UTC+8</td><td className="py-2">Hong Kong</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono text-emerald-200">JST</td><td className="py-2 pr-4">UTC+9</td><td className="py-2">Tokyo, Osaka, Sapporo</td></tr>
                      <tr><td className="py-2 pr-4 font-mono text-emerald-200">AEST</td><td className="py-2 pr-4">UTC+10</td><td className="py-2">Sydney, Melbourne, Brisbane</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Daylight Saving Time (DST)</h2>
                <p className="mt-3 leading-7">Daylight Saving Time is the practice of advancing clocks by one hour in spring and setting them back one hour in autumn. The idea is to shift daylight hours into the evening during summer months, reducing the need for artificial lighting. The phrase "spring forward, fall back" captures the pattern: clocks move forward one hour in spring and back one hour in autumn.</p>
                <p className="mt-3 leading-7">Regions that observe DST include the United States, Canada, most of Europe, parts of Australia, and several other countries. In the US, clocks change on the second Sunday of March (spring forward) and the first Sunday of November (fall back). In the European Union, the change happens on the last Sunday of March and the last Sunday of October.</p>
                <p className="mt-3 leading-7">Many major regions do not observe DST at all. China, Japan, India, most of Africa, and the US state of Arizona (except the Navajo Nation) stay on a fixed UTC offset year-round. This creates a scheduling complication: a meeting set for "3:00 PM EST" in December is actually a different UTC time than a meeting set for "3:00 PM EDT" in July, even though the local clock reads the same. When scheduling international meetings months in advance, always confirm whether clocks will have changed by the meeting date.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Practical Tips for International Scheduling</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Always anchor to UTC when in doubt.</strong> Server logs, APIs, databases, and distributed systems should store and communicate timestamps in UTC. Converting to local time is a display concern; storing in UTC ensures there is never ambiguity about when something happened.</li>
                  <li><strong className="text-white">Confirm both the time zone and the date.</strong> When scheduling across the International Date Line, the calendar date changes. A 10:00 AM Thursday call in New York is a 11:00 PM Thursday call in London, but a 11:00 PM Thursday call becomes a 10:00 AM Friday call in Tokyo. Always share the date alongside the time.</li>
                  <li><strong className="text-white">Check DST status when scheduling ahead.</strong> If you are scheduling a recurring weekly call that spans months, verify whether a DST transition will shift the meeting time. A call that works at 9:00 AM EST in winter might become 8:00 AM EST after clocks spring forward — or 10:00 AM local time for participants in a non-DST country.</li>
                  <li><strong className="text-white">Understand the International Date Line (IDL).</strong> The IDL runs roughly along the 180th meridian in the Pacific Ocean. Crossing it westward (toward Asia) advances the calendar by one day; crossing it eastward (toward the Americas) sets the calendar back one day. This is why flights from Los Angeles to Sydney sometimes seem to "lose a day."</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Common Mistakes When Converting Time Zones</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Forgetting Daylight Saving Time.</strong> The most common mistake. EST (UTC−5) and EDT (UTC−4) are both "Eastern Time," but they differ by an hour. Always check whether DST is currently in effect for your target region.</li>
                  <li><strong className="text-white">Confusing abbreviations that are reused.</strong> CST can mean Central Standard Time (UTC−6 in the US) or China Standard Time (UTC+8). IST can mean India Standard Time (UTC+5:30), Irish Standard Time (UTC+1), or Israel Standard Time (UTC+2). When in doubt, use full IANA timezone names like America/Chicago or Asia/Kolkata instead of abbreviations.</li>
                  <li><strong className="text-white">Ignoring half-hour and 45-minute offsets.</strong> Not all time zones are whole-hour offsets from UTC. India Standard Time is UTC+5:30. Nepal Time is UTC+5:45. Iran Standard Time is UTC+3:30. Australian Central Standard Time is UTC+9:30. These fractional offsets trip up tools that assume whole-hour increments.</li>
                  <li><strong className="text-white">Using GMT when you mean UTC.</strong> GMT and UTC are nearly identical in everyday use, but GMT is technically an astronomical time standard that can vary slightly due to Earth's rotation. UTC is maintained by atomic clocks and is always precise. For technical systems, always use UTC.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between GMT and UTC?</h3>
                    <p className="mt-1 text-white/70">GMT (Greenwich Mean Time) is an astronomical time standard based on Earth's rotation relative to the sun. UTC (Coordinated Universal Time) is a precise atomic time standard that is occasionally adjusted with leap seconds to stay close to GMT. In everyday use they are essentially the same, but for technical and scientific purposes, UTC is the correct reference. All modern programming systems use UTC internally.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Which countries have the most time zones?</h3>
                    <p className="mt-1 text-white/70">France has the most time zones of any country — 12 — because it includes numerous overseas territories spread across the globe. Russia has 11 time zones across its vast land area. The United States has 6 standard time zones (including Alaska and Hawaii), or up to 9 when counting all territories and uninhabited islands.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Why does India use a half-hour offset (UTC+5:30)?</h3>
                    <p className="mt-1 text-white/70">India chose UTC+5:30 as a compromise so that the entire country could operate on a single time zone despite spanning about 30 degrees of longitude — a span that would normally warrant two or three zones. The half-hour offset was set to better align local solar time with the clock. Similarly, Nepal chose UTC+5:45 to differentiate itself from neighboring India while staying close to its solar noon.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is the International Date Line?</h3>
                    <p className="mt-1 text-white/70">The International Date Line (IDL) is an imaginary line running from the North Pole to the South Pole along roughly the 180th meridian in the Pacific Ocean. It is where one calendar day ends and the next begins. Crossing the IDL westward (Asia/Pacific direction) moves you one calendar day forward; crossing it eastward (Americas direction) moves you one calendar day back. The IDL is not perfectly straight — it deviates around island nations so they share the same calendar date with their closest neighbors.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">How do I convert time zones for a meeting across the US and Hong Kong?</h3>
                    <p className="mt-1 text-white/70">Hong Kong is UTC+8 year-round (no DST). New York is UTC−5 in winter (EST) and UTC−4 in summer (EDT). The difference is 13 hours in winter and 12 hours in summer. A 9:00 AM Monday meeting in New York EST corresponds to 10:00 PM Monday in Hong Kong. Use this converter to handle the exact dates and DST status automatically — simply enter the meeting time, select the source zone, and add Hong Kong as a target zone.</p>
                  </div>
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Clock className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Use cases</h2><p className="text-sm text-neutral-300">Time across the world.</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Schedule meetings across time zones.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Plan international calls and webinars.</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Track deadlines in different countries.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
