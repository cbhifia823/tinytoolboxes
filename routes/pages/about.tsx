import { useEffect, useState } from "react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

const LANGUAGES: Record<LocaleKey, { kicker: string; title: string; p1: string; p2: string }> = {
  en: {
    kicker: "TinyToolboxes",
    title: "About",
    p1: "TinyToolboxes is a collection of simple, single-purpose web tools designed to solve everyday tasks quickly. No clutter, no sign-in, just useful pages that do one job well.",
    p2: "Each tool focuses on doing one job — a calculator, a converter, a counter — without forcing you through a sign-up or hiding the answer behind ads. The site is built and maintained as a personal project and is open to anyone who finds the tools useful.",
  },
  "zh-hk": {
    kicker: "TinyToolboxes",
    title: "關於",
    p1: "TinyToolboxes 係一組簡單、單一用途嘅網頁工具，幫你快快搞掂日常任務。冇多餘嘢，唔使登入，每頁專注做好一件事。",
    p2: "每個工具都專注做一件嘢——計算器、轉換器、計數器——唔使您註冊，亦唔會將答案收埋喺廣告後面。呢個網站係個人項目，由我一手一腳建構同維護，歡迎任何覺得呢啲工具有用嘅人使用。",
  },
  "zh-cn": {
    kicker: "TinyToolboxes",
    title: "关于",
    p1: "TinyToolboxes 是一组简单、单一用途的网页工具，旨在快速解决日常任务。没有杂乱，没有登录，只有有用的页面，专注于做好一件事。",
    p2: "每个工具都专注于完成一项任务——计算器、转换器、计数器——而不强迫您通过注册或隐藏答案在广告后面。该网站是作为个人项目构建和维护的，对任何发现这些工具有用的人开放。",
  },
  es: {
    kicker: "TinyToolboxes",
    title: "Sobre",
    p1: "TinyToolboxes es una colección de herramientas web simples y de propósito único diseñadas para resolver tareas cotidianas rápidamente. Sin desorden, sin inicio de sesión, solo páginas útiles que hacen bien un trabajo.",
    p2: "Cada herramienta se centra en hacer un trabajo — una calculadora, un convertidor, un contador — sin obligarte a registrarte ni ocultar la respuesta detrás de anuncios. El sitio está construido y mantenido como un proyecto personal y está abierto a cualquiera que encuentre las herramientas útiles.",
  },
};

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/about";

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

export default function AboutPage() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const L = LANGUAGES[locale];

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("ttb-locale", locale);
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.p1,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "AboutPage", url: SITE_URL + PAGE_PATH, name: "About TinyToolboxes", publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  return (
    <main className="min-h-screen bg-[#0b0f0d] text-[#f3f1ea]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">{L.kicker}</div>
          <div className="flex flex-wrap gap-2">{LOCALES.map((item) => <button key={item.id} onClick={() => setLocale(item.id)} className="border border-emerald-300/30 rounded-md px-2 py-1 text-sm text-emerald-300/80 hover:bg-emerald-300/10">{item.label}</button>)}</div>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{L.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          {L.p1}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
          {L.p2}
        </p>
      </section>
    </main>
  );
}
