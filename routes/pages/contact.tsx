import { useEffect, useState } from "react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

const COPY: Record<LocaleKey, { kicker: string; title: string; p1Prefix: string; p1Suffix: string; p2Prefix: string; privacyLink: string; p2Suffix: string }> = {
  en: {
    kicker: "TinyToolboxes",
    title: "Contact",
    p1Prefix: "For feedback, bug reports, or to suggest a new single-purpose tool, please email",
    p1Suffix: ".",
    p2Prefix: "We read every message but cannot guarantee individual replies. For privacy-related questions, see the",
    privacyLink: "Privacy Policy",
    p2Suffix: ".",
  },
  "zh-hk": {
    kicker: "TinyToolboxes",
    title: "聯絡我哋",
    p1Prefix: "意見、回報問題，或者想建議新嘅單一功能工具，請電郵去",
    p1Suffix: "。",
    p2Prefix: "我哋會睇每一封訊息，但未必逐封回覆。如有關於私隱嘅問題，請睇",
    privacyLink: "私隱政策",
    p2Suffix: "。",
  },
  "zh-cn": {
    kicker: "TinyToolboxes",
    title: "联系我们",
    p1Prefix: "如需反馈、报告问题，或想建议新的单一功能工具，请电邮至",
    p1Suffix: "。",
    p2Prefix: "我们会阅读每一封信息，但不一定逐一回复。如有关于隐私的问题，请参阅",
    privacyLink: "隐私政策",
    p2Suffix: "。",
  },
  es: {
    kicker: "TinyToolboxes",
    title: "Contacto",
    p1Prefix: "Para enviar comentarios, reportar un error o sugerir una nueva herramienta de un solo propósito, escribe a",
    p1Suffix: ".",
    p2Prefix: "Leemos cada mensaje, pero no podemos garantizar respuestas individuales. Para preguntas sobre privacidad, consulta la",
    privacyLink: "Política de Privacidad",
    p2Suffix: ".",
  },
};

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/contact";

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

export default function ContactPage() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const c = COPY[locale];

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("ttb-locale", locale);
    applySEO({
      title: `${c.title} | TinyToolboxes`,
      description: c.p1Prefix,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "ContactPage", url: SITE_URL + PAGE_PATH, name: "Contact TinyToolboxes", publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
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
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          {c.p1Prefix}
          <span className="ml-1 font-mono text-white/85">hello@tinytoolboxes.com</span>
          {c.p1Suffix}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
          {c.p2Prefix}
          <a className="ml-1 text-emerald-300 underline-offset-4 hover:underline" href="/privacy-policy">{c.privacyLink}</a>
          {c.p2Suffix}
        </p>
      </section>
    </main>
  );
}
