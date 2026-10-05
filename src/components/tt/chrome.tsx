import { useEffect, type ReactNode } from "react";
import "./themes.css";
import { ALL_LOCALES, HTML_LANG, LOCALE_LABELS, LOCALE_NAMES, type Locale } from "@/lib/use-locale";

export type Theme = "everyday" | "pets";

// Google Fonts families per theme, plus the Noto family that matches the
// current language's script. Loaded on demand so other pages don't pay for it.
const THEME_FONTS: Record<Theme, string[]> = {
  everyday: ["Source+Serif+4:opsz,wght@8..60,400;8..60,600", "Mulish:wght@400;600;700;800"],
  pets: ["Manrope:wght@600;700;800", "Inter:wght@400;500;600;700"],
};
const CJK_FONTS: Partial<Record<Locale, Record<Theme, string[]>>> = {
  "zh-hk": { everyday: ["Noto+Sans+TC:wght@400;700", "Noto+Serif+TC:wght@500;700"], pets: ["Noto+Sans+TC:wght@400;700;800"] },
  "zh-cn": { everyday: ["Noto+Sans+SC:wght@400;700", "Noto+Serif+SC:wght@500;700"], pets: ["Noto+Sans+SC:wght@400;700;800"] },
  ja: { everyday: ["Noto+Sans+JP:wght@400;700", "Noto+Serif+JP:wght@500;700"], pets: ["Noto+Sans+JP:wght@400;700;800"] },
};

function useThemeFonts(theme: Theme, locale: Locale) {
  useEffect(() => {
    const families = [...THEME_FONTS[theme], ...(CJK_FONTS[locale]?.[theme] ?? [])];
    const id = `tt-fonts-${theme}-${locale}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
    document.head.appendChild(link);
  }, [theme, locale]);
}

export function ToolPage(props: {
  theme: Theme;
  locale: Locale;
  onLocale: (next: Locale) => void;
  section: string;
  children: ReactNode;
}) {
  useThemeFonts(props.theme, props.locale);
  return (
    <div className={`tt-page tt-${props.theme}`} lang={HTML_LANG[props.locale]}>
      <header className="tt-header">
        <a className="tt-brand" href="/">
          <span className="tt-brand-mark" aria-hidden="true">TT</span>
          TinyToolboxes
        </a>
        <span className="tt-section">{props.section}</span>
        <span className="tt-spacer" />
        <LanguageSwitcher value={props.locale} onChange={props.onLocale} />
      </header>
      <main className="tt-main">{props.children}</main>
    </div>
  );
}

export function LanguageSwitcher(props: { value: Locale; onChange: (next: Locale) => void }) {
  return (
    <div className="tt-lang" role="group" aria-label="Language">
      {ALL_LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          lang={HTML_LANG[loc]}
          title={LOCALE_NAMES[loc]}
          aria-label={LOCALE_NAMES[loc]}
          aria-pressed={props.value === loc}
          onClick={() => props.onChange(loc)}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}

export function Faq(props: { items: ReadonlyArray<{ q: string; a: string }> }) {
  return (
    <div className="tt-faq">
      {props.items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function RelatedList(props: { title: string; items: ReadonlyArray<{ href: string; title: string; hint: string }> }) {
  return (
    <section className="tt-card tt-related">
      <h2 className="tt-label">{props.title}</h2>
      {props.items.map((item) => (
        <a key={item.href} href={item.href}>
          <b>{item.title}</b>
          <small>{item.hint}</small>
        </a>
      ))}
    </section>
  );
}

// Page <head> metadata. Same behaviour the pages had inline before.
const SITE_URL = "https://www.tinytoolboxes.com";
export function applySEO(o: { title: string; description: string; path: string; jsonLd?: object[] }) {
  if (typeof document === "undefined") return;
  const url = SITE_URL + o.path;
  document.title = o.title;
  const head = document.head;
  const upsert = (sel: string, make: () => HTMLElement, attr: string, val: string) => {
    let el = head.querySelector(sel) as HTMLElement | null;
    if (!el) { el = make(); head.appendChild(el); }
    el.setAttribute(attr, val);
  };
  const meta = (name: string, content: string) =>
    upsert(`meta[name="${name}"]`, () => { const m = document.createElement("meta"); m.setAttribute("name", name); return m; }, "content", content);
  const prop = (p: string, content: string) =>
    upsert(`meta[property="${p}"]`, () => { const m = document.createElement("meta"); m.setAttribute("property", p); return m; }, "content", content);
  meta("description", o.description);
  upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l; }, "href", url);
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  head.querySelectorAll('script[type="application/ld+json"][data-ttb]').forEach((n) => n.remove());
  for (const data of o.jsonLd ?? []) {
    const s = document.createElement("script");
    s.setAttribute("type", "application/ld+json");
    s.setAttribute("data-ttb", "");
    s.textContent = JSON.stringify(data);
    head.appendChild(s);
  }
}

export { SITE_URL };
