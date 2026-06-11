import { useEffect, useState } from "react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

const COPY: Record<LocaleKey, { kicker: string; title: string; p1: string; p2: string; p3Prefix: string; contactLink: string; p3Suffix: string }> = {
  en: {
    kicker: "TinyToolboxes",
    title: "Privacy Policy",
    p1: "TinyToolboxes does not intentionally collect personal information from visitors beyond what is needed to operate the website and display ads through third-party providers such as Google AdSense.",
    p2: "Third-party services may use cookies or similar technologies according to their own policies. Please review their documentation for details on how they handle data.",
    p3Prefix: "If you have questions about this site, please use the",
    contactLink: "contact page",
    p3Suffix: ".",
  },
  "zh-hk": {
    kicker: "TinyToolboxes",
    title: "私隱政策",
    p1: "除咗營運網站同透過 Google AdSense 等第三方供應商展示廣告所需要嘅資料之外，TinyToolboxes 唔會主動收集訪客嘅個人資料。",
    p2: "第三方服務可能會根據佢哋自己嘅政策使用 cookie 或類似技術。詳情請參閱佢哋嘅文件，了解點處理資料。",
    p3Prefix: "如果你對本站有任何問題，請透過",
    contactLink: "聯絡頁面",
    p3Suffix: "與我哋聯絡。",
  },
  "zh-cn": {
    kicker: "TinyToolboxes",
    title: "隐私政策",
    p1: "除了运营网站和通过 Google AdSense 等第三方供应商展示广告所需的资料外，TinyToolboxes 不会主动收集访客的个人信息。",
    p2: "第三方服务可能根据其自身政策使用 cookie 或类似技术。详情请参阅其官方文件，以了解其数据处理方式。",
    p3Prefix: "如对本站有任何疑问，请通过",
    contactLink: "联系页面",
    p3Suffix: "与我们联系。",
  },
  es: {
    kicker: "TinyToolboxes",
    title: "Política de Privacidad",
    p1: "TinyToolboxes no recopila intencionalmente información personal de los visitantes más allá de lo necesario para operar el sitio web y mostrar anuncios a través de proveedores externos como Google AdSense.",
    p2: "Los servicios de terceros pueden usar cookies o tecnologías similares según sus propias políticas. Consulta su documentación para conocer los detalles sobre cómo manejan los datos.",
    p3Prefix: "Si tienes preguntas sobre este sitio, usa la",
    contactLink: "página de contacto",
    p3Suffix: ".",
  },
};

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/privacy-policy";

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

export default function PrivacyPolicyPage() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const c = COPY[locale];

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("ttb-locale", locale);
    applySEO({
      title: `${c.title} | TinyToolboxes`,
      description: c.p1,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebPage", url: SITE_URL + PAGE_PATH, name: "TinyToolboxes Privacy Policy", publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  return (
    <main className="min-h-screen bg-[#0b0f0d] text-[#f3f1ea]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">{c.kicker}</div>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((item) => (
              <button key={item.id} onClick={() => setLocale(item.id)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{c.title}</h1>
        <div className="prose prose-invert mt-8 max-w-3xl prose-p:text-white/70 prose-li:text-white/70">
          <p>{c.p1}</p>
          <p>{c.p2}</p>
          <p>
            {c.p3Prefix}
            <a className="ml-1 text-emerald-300 underline-offset-4 hover:underline" href="/contact">{c.contactLink}</a>
            {c.p3Suffix}
          </p>
        </div>
      </section>
    </main>
  );
}
