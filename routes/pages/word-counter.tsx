import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FileType2, Languages, Search, Type } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Word Counter",
    subtitle: "Count words, characters, sentences, and paragraphs in any text.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: age, date, percent, url",
    searchHint: "Search hints",
    textLabel: "Your text",
    clear: "Clear",
    copy: "Copy stats",
    result: "Results",
    words: "Words",
    characters: "Characters",
    charactersNoSpaces: "Characters (no spaces)",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    lines: "Lines",
    useCasesTitle: "Use cases",
    useCasesSubtitle: "Quick text stats for everyday work.",
    useCases: ["Blog drafts and SEO copy.", "School essays and reports.", "Social posts and captions."],
    suggestionsTitle: "You may also like",
    suggestionsSubtitle: "Other tools that pair well with text work.",
    suggestions: ["URL Encoder / Decoder", "Age Calculator", "Date Difference Calculator"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "字數統計器",
    subtitle: "即時計算字數、字元、句子同段落。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：年齡、日期、百分比、URL",
    searchHint: "搜尋提示",
    textLabel: "你的文字",
    clear: "清空",
    copy: "複製統計",
    result: "結果",
    words: "字數",
    characters: "字元",
    charactersNoSpaces: "字元（無空格）",
    sentences: "句子",
    paragraphs: "段落",
    lines: "行數",
    useCasesTitle: "使用情境",
    useCasesSubtitle: "日常文字工作快速統計。",
    useCases: ["Blog 草稿同 SEO 文案。", "功課、報告同文件。", "社交貼文同標題。"],
    suggestionsTitle: "你可能會喜歡",
    suggestionsSubtitle: "同文字工作配搭得很好嘅工具。",
    suggestions: ["URL 編碼／解碼", "年齡計算器", "日期差計算器"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "字数统计器",
    subtitle: "即时计算字数、字符、句子和段落。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：年龄、日期、百分比、URL",
    searchHint: "搜索提示",
    textLabel: "你的文字",
    clear: "清空",
    copy: "复制统计",
    result: "结果",
    words: "字数",
    characters: "字符",
    charactersNoSpaces: "字符（无空格）",
    sentences: "句子",
    paragraphs: "段落",
    lines: "行数",
    useCasesTitle: "使用场景",
    useCasesSubtitle: "日常文字工作快速统计。",
    useCases: ["博客草稿和 SEO 文案。", "作业、报告和文档。", "社交帖子和标题。"],
    suggestionsTitle: "你可能会喜欢",
    suggestionsSubtitle: "和文字工作很搭的工具。",
    suggestions: ["URL 编码／解码", "年龄计算器", "日期差计算器"],
  },
  es: {
    name: "Español",
    title: "Contador de palabras",
    subtitle: "Cuenta palabras, caracteres, oraciones y párrafos en cualquier texto.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: age, date, percent, url",
    searchHint: "Sugerencias",
    textLabel: "Tu texto",
    clear: "Borrar",
    copy: "Copiar estadísticas",
    result: "Resultados",
    words: "Palabras",
    characters: "Caracteres",
    charactersNoSpaces: "Caracteres (sin espacios)",
    sentences: "Oraciones",
    paragraphs: "Párrafos",
    lines: "Líneas",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Estadísticas rápidas para texto diario.",
    useCases: ["Borradores de blog y SEO.", "Ensayos y reportes.", "Publicaciones y captions."],
    suggestionsTitle: "También te puede interesar",
    suggestionsSubtitle: "Herramientas que van bien con texto.",
    suggestions: ["URL Encoder / Decoder", "Calculadora de edad", "Calculadora de diferencia de fechas"],
  },
} satisfies Record<LocaleKey, Record<string, any>>;

const TOOLS = [
  { title: "URL Encoder / Decoder", href: "/url-encoder-decoder", description: "Encode or decode URLs.", keywords: ["url", "encode", "decode"] },
  { title: "Age Calculator", href: "/age-calculator", description: "Calculate exact age.", keywords: ["age", "birthday"] },
  { title: "Date Difference Calculator", href: "/date-difference-calculator", description: "Days between two dates.", keywords: ["date", "days"] },
  { title: "Business Day Calculator", href: "/business-day-calculator", description: "Working days and holidays.", keywords: ["calendar", "workday"] },
  { title: "Percentage Calculator", href: "/percentage-calculator", description: "Percentages made simple.", keywords: ["percent", "ratio"] },
  { title: "Unit Converter", href: "/unit-converter", description: "Convert units fast.", keywords: ["convert", "unit"] },
];

function SearchBox({ locale }: { locale: LocaleKey }) {
  const content = LANGUAGES[locale];
  const [query, setQuery] = useState("");
  const hints = locale === "zh-hk" ? ["年齡", "工作日", "日期", "URL"] : locale === "zh-cn" ? ["年龄", "工作日", "日期", "URL"] : locale === "es" ? ["edad", "fecha", "url", "porcentaje"] : ["age", "date", "url", "percent"];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((tool) => `tool.title tool.description[locale] ${tool.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [query]);
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-emerald-300" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">{hints.map((hint) => <button key={hint} onClick={() => setQuery(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10">{hint}</button>)}</div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">{content.searchHint}</p>
        {filtered.slice(0, 4).map((tool) => (
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
const PAGE_PATH = "/word-counter";

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

export default function WordCounter() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleKey | null;
    return saved && LANGUAGES[saved] ? saved : "en";
  });
  const [text, setText] = useState("TinyToolboxes is a boring website series.\n\nIt is useful.");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    document.documentElement.lang = locale;
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = text.trim() ? (text.match(/[.!?]+(?:\s|$)/g)?.length ?? 0) : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split("\n").length : 0;
    return { words, characters, charactersNoSpaces, sentences, paragraphs, lines };
  }, [text]);

  const content = LANGUAGES[locale];
  const metricCards = [
    [content.words, stats.words],
    [content.characters, stats.characters],
    [content.charactersNoSpaces, stats.charactersNoSpaces],
    [content.sentences, stats.sentences],
    [content.paragraphs, stats.paragraphs],
    [content.lines, stats.lines],
  ] as const;

  const copyStats = async () => {
    const summary = metricCards.map(([label, value]) => `${label}: ${value}`).join("\n");
    await navigator.clipboard.writeText(summary);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Type className="h-5 w-5 text-emerald-300" /></div>
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
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{content.textLabel}</p>
                  <p className="mt-1 text-sm text-neutral-300">{content.copy}</p>
                </div>
                <button onClick={copyStats} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10">{content.copy}</button>
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-5 h-56 w-full rounded-3xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none focus:border-emerald-400/60" />
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setText("")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10">{content.clear}</button>
                <button onClick={() => setText("TinyToolboxes is a boring website series.\n\nIt is useful.")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10">Sample</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {metricCards.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <SearchBox locale={locale} />
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3"><FileType2 className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-lg font-semibold">{content.useCasesTitle}</h2>
                  <p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                {content.useCases.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">{content.suggestionsTitle}</h2>
              <p className="mt-1 text-sm text-neutral-300">{content.suggestionsSubtitle}</p>
              <div className="mt-4 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title === name);
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
