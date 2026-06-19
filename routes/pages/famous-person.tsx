import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Cake, CalendarDays, Star, ExternalLink, Film, Music, Trophy, Globe, Sparkles, Video, Briefcase, Users } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

type Person = {
  slug: string;
  name: string;
  dob: string;
  category: string;
  nationality: string;
  wiki: string;
  summary: string;
};

const SITE_URL = "https://www.tinytoolboxes.com";

const CATEGORIES: Record<string, { icon: typeof Film; label: Record<LocaleKey, string> }> = {
  actor: { icon: Film, label: { en: "Actor", "zh-hk": "演員", "zh-cn": "演员", es: "Actor" } },
  musician: { icon: Music, label: { en: "Musician", "zh-hk": "音樂人", "zh-cn": "音乐人", es: "Músico" } },
  athlete: { icon: Trophy, label: { en: "Sportsperson", "zh-hk": "運動員", "zh-cn": "运动员", es: "Deportista" } },
  internet: { icon: Globe, label: { en: "Internet Celebrity", "zh-hk": "網絡名人", "zh-cn": "网络名人", es: "Celebridad de internet" } },
  dancer: { icon: Sparkles, label: { en: "Dancer", "zh-hk": "舞蹈家", "zh-cn": "舞蹈家", es: "Bailarín/a" } },
  director: { icon: Video, label: { en: "Director", "zh-hk": "導演", "zh-cn": "导演", es: "Director/a" } },
  entrepreneur: { icon: Briefcase, label: { en: "Entrepreneur", "zh-hk": "企業家", "zh-cn": "企业家", es: "Empresario/a" } },
};

const ZODIAC: { key: string; start: [number, number]; symbol: string; label: Record<LocaleKey, string> }[] = [
  { key: "capricorn", start: [12, 22], symbol: "♑", label: { en: "Capricorn", "zh-hk": "摩羯座", "zh-cn": "摩羯座", es: "Capricornio" } },
  { key: "aquarius", start: [1, 20], symbol: "♒", label: { en: "Aquarius", "zh-hk": "水瓶座", "zh-cn": "水瓶座", es: "Acuario" } },
  { key: "pisces", start: [2, 19], symbol: "♓", label: { en: "Pisces", "zh-hk": "雙魚座", "zh-cn": "双鱼座", es: "Piscis" } },
  { key: "aries", start: [3, 21], symbol: "♈", label: { en: "Aries", "zh-hk": "白羊座", "zh-cn": "白羊座", es: "Aries" } },
  { key: "taurus", start: [4, 20], symbol: "♉", label: { en: "Taurus", "zh-hk": "金牛座", "zh-cn": "金牛座", es: "Tauro" } },
  { key: "gemini", start: [5, 21], symbol: "♊", label: { en: "Gemini", "zh-hk": "雙子座", "zh-cn": "双子座", es: "Géminis" } },
  { key: "cancer", start: [6, 21], symbol: "♋", label: { en: "Cancer", "zh-hk": "巨蟹座", "zh-cn": "巨蟹座", es: "Cáncer" } },
  { key: "leo", start: [7, 23], symbol: "♌", label: { en: "Leo", "zh-hk": "獅子座", "zh-cn": "狮子座", es: "Leo" } },
  { key: "virgo", start: [8, 23], symbol: "♍", label: { en: "Virgo", "zh-hk": "處女座", "zh-cn": "处女座", es: "Virgo" } },
  { key: "libra", start: [9, 23], symbol: "♎", label: { en: "Libra", "zh-hk": "天秤座", "zh-cn": "天秤座", es: "Libra" } },
  { key: "scorpio", start: [10, 23], symbol: "♏", label: { en: "Scorpio", "zh-hk": "天蠍座", "zh-cn": "天蝎座", es: "Escorpio" } },
  { key: "sagittarius", start: [11, 22], symbol: "♐", label: { en: "Sagittarius", "zh-hk": "射手座", "zh-cn": "射手座", es: "Sagitario" } },
];

function zodiacFor(month: number, day: number) {
  // Find the last sign whose start date is on/before (month, day); Capricorn wraps the year.
  let pick = ZODIAC[0];
  for (const z of ZODIAC) {
    const [m, d] = z.start;
    if (month > m || (month === m && day >= d)) pick = z;
  }
  return pick;
}

const UI: Record<LocaleKey, {
  name: string;
  back: string;
  age: string;
  yearsOld: string;
  ymd: (y: number, m: number, d: number) => string;
  nextBirthday: string;
  daysAway: string;
  bornOn: string;
  zodiac: string;
  category: string;
  nationality: string;
  alsoIn: string;
  wikiCredit: string;
  loading: string;
  notFound: string;
  photoCredit: string;
}> = {
  en: {
    name: "English", back: "All birthdays", age: "Current age", yearsOld: "years old",
    ymd: (y, m, d) => `${y} years, ${m} months, ${d} days`,
    nextBirthday: "Next birthday", daysAway: "days away", bornOn: "Born on", zodiac: "Star sign",
    category: "Known as", nationality: "Nationality", alsoIn: "More in this category",
    wikiCredit: "Biography from Wikipedia, licensed under CC BY-SA.", loading: "Loading biography…",
    notFound: "We couldn't find that person.", photoCredit: "Photo via Wikimedia Commons",
  },
  "zh-hk": {
    name: "繁體中文", back: "所有生日", age: "目前年齡", yearsOld: "歲",
    ymd: (y, m, d) => `${y} 年 ${m} 個月 ${d} 日`,
    nextBirthday: "下次生日", daysAway: "天後", bornOn: "出生於", zodiac: "星座",
    category: "身份", nationality: "國籍", alsoIn: "同類更多名人",
    wikiCredit: "傳記來自維基百科，採用 CC BY-SA 授權。", loading: "載入傳記中…",
    notFound: "搵唔到呢位人物。", photoCredit: "圖片來自維基共享資源",
  },
  "zh-cn": {
    name: "简体中文", back: "所有生日", age: "目前年龄", yearsOld: "岁",
    ymd: (y, m, d) => `${y} 年 ${m} 个月 ${d} 天`,
    nextBirthday: "下次生日", daysAway: "天后", bornOn: "出生于", zodiac: "星座",
    category: "身份", nationality: "国籍", alsoIn: "同类更多名人",
    wikiCredit: "传记来自维基百科，采用 CC BY-SA 授权。", loading: "加载传记中…",
    notFound: "找不到这位人物。", photoCredit: "图片来自维基共享资源",
  },
  es: {
    name: "Español", back: "Todos los cumpleaños", age: "Edad actual", yearsOld: "años",
    ymd: (y, m, d) => `${y} años, ${m} meses, ${d} días`,
    nextBirthday: "Próximo cumpleaños", daysAway: "días", bornOn: "Nació el", zodiac: "Signo",
    category: "Conocido como", nationality: "Nacionalidad", alsoIn: "Más en esta categoría",
    wikiCredit: "Biografía de Wikipedia, con licencia CC BY-SA.", loading: "Cargando biografía…",
    notFound: "No encontramos a esa persona.", photoCredit: "Foto vía Wikimedia Commons",
  },
};

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
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "profile"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) {
    const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd];
    arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); });
  }
}

function calcAge(dob: Date, now: Date) {
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nb = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nb <= today0) nb.setFullYear(now.getFullYear() + 1);
  const daysUntilBirthday = Math.round((nb.getTime() - today0.getTime()) / 86400000);
  return { years, months, days, daysUntilBirthday };
}

function initials(name: string) {
  const parts = name.replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || name.slice(0, 2).toUpperCase();
}

// Best-effort: fetch a localized intro + lead image from the visitor's-language
// Wikipedia. Runs in the browser; Wikipedia allows CORS (origin=*). Degrades to
// null on any failure so the page still renders the curated facts.
async function loadWiki(enTitle: string, locale: LocaleKey): Promise<{ extract: string; image: string | null; pageUrl: string } | null> {
  const lang = locale === "es" ? "es" : locale.startsWith("zh") ? "zh" : "en";
  const variant = locale === "zh-hk" ? "zh-hk" : locale === "zh-cn" ? "zh-cn" : "";
  let title = enTitle;
  try {
    if (lang !== "en") {
      const llUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=langlinks&lllang=${lang}&lllimit=1&redirects=1&titles=${encodeURIComponent(enTitle)}`;
      const ll = await fetch(llUrl).then((r) => r.json());
      const p0: any = Object.values(ll?.query?.pages || {})[0];
      const link = p0?.langlinks?.[0]?.["*"];
      if (link) title = link;
    }
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cpageimages%7Cinfo&inprop=url&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=480&redirects=1&titles=${encodeURIComponent(title)}${variant ? `&variant=${variant}` : ""}`;
    const data = await fetch(url).then((r) => r.json());
    const page: any = Object.values(data?.query?.pages || {})[0];
    if (!page || page.missing !== undefined) return null;
    return {
      extract: page.extract || "",
      image: page.thumbnail?.source || null,
      pageUrl: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
  } catch {
    return null;
  }
}

const AVATAR_GRADIENTS = [
  "from-emerald-400/30 to-teal-500/20 text-emerald-100",
  "from-rose-400/30 to-pink-500/20 text-rose-100",
  "from-sky-400/30 to-indigo-500/20 text-sky-100",
  "from-amber-400/30 to-orange-500/20 text-amber-100",
  "from-violet-400/30 to-fuchsia-500/20 text-violet-100",
];
function gradientFor(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

export default function FamousPerson() {
  const { slug } = useParams<{ slug: string }>();
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [people, setPeople] = useState<Person[] | null>(null);
  const [wiki, setWiki] = useState<{ extract: string; image: string | null; pageUrl: string } | null>(null);
  const [wikiLoading, setWikiLoading] = useState(true);
  const now = useMemo(() => new Date(), []);
  const t = UI[locale];

  useEffect(() => {
    fetch("/famous-people.json").then((r) => r.json()).then((d: { people: Person[] }) => setPeople(d.people || [])).catch(() => setPeople([]));
  }, []);

  const person = useMemo(() => people?.find((p) => p.slug === slug) || null, [people, slug]);

  useEffect(() => {
    if (!person) return;
    let cancelled = false;
    setWikiLoading(true);
    setWiki(null);
    loadWiki(person.wiki, locale).then((w) => { if (!cancelled) { setWiki(w); setWikiLoading(false); } });
    return () => { cancelled = true; };
  }, [person, locale]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    if (!person) return;
    const path = `/famous/${person.slug}`;
    applySEO({
      title: `${person.name} — ${t.age} | TinyToolboxes`,
      description: person.summary,
      path,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: person.name,
        birthDate: person.dob,
        nationality: person.nationality,
        jobTitle: CATEGORIES[person.category]?.label.en || person.category,
        ...(wiki?.image ? { image: wiki.image } : {}),
        ...(wiki?.pageUrl ? { sameAs: wiki.pageUrl } : {}),
        url: SITE_URL + path,
      },
    });
  }, [person, locale, wiki, t]);

  if (people && !person) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-50">
        <div className="text-center">
          <p className="text-lg text-white/70">{t.notFound}</p>
          <Link to="/famous-birthdays" className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><ArrowLeft className="h-4 w-4" />{t.back}</Link>
        </div>
      </main>
    );
  }

  if (!person) {
    return <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-50"><p className="text-white/50">…</p></main>;
  }

  const [by, bm, bd] = person.dob.split("-").map(Number);
  const birth = new Date(by, bm - 1, bd);
  const age = calcAge(birth, now);
  const zodiac = zodiacFor(bm, bd);
  const cat = CATEGORIES[person.category];
  const CatIcon = cat?.icon || Users;
  const bornStr = birth.toLocaleDateString(locale === "es" ? "es" : locale.startsWith("zh") ? "zh" : "en", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const related = (people || []).filter((p) => p.category === person.category && p.slug !== person.slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/famous-birthdays" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" />{t.back}</Link>
          <div className="flex flex-wrap gap-2">{(Object.keys(UI) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-1.5 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{UI[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              {wiki?.image ? (
                <figure className="m-0">
                  <img src={wiki.image} alt={person.name} loading="lazy" className="h-80 w-full object-cover" />
                  <figcaption className="px-4 py-2 text-[11px] text-white/40">{t.photoCredit}</figcaption>
                </figure>
              ) : (
                <div className={`flex h-80 w-full items-center justify-center bg-gradient-to-br text-6xl font-bold ${gradientFor(person.slug)}`}>{initials(person.name)}</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{t.age}</p>
                <p className="mt-1 text-3xl font-bold text-emerald-200">{age.years}</p>
                <p className="text-xs text-white/55">{t.yearsOld}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/50"><Star className="h-3.5 w-3.5" />{t.zodiac}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{zodiac.symbol} {zodiac.label[locale]}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{person.name}</h1>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70"><CatIcon className="h-3.5 w-3.5" />{cat?.label[locale] || person.category}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">{person.nationality}</span>
              </div>
              <p className="text-base leading-7 text-white/70">{person.summary}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/50"><CalendarDays className="h-3.5 w-3.5" />{t.bornOn}</p>
                <p className="mt-1 text-base font-medium text-white">{bornStr}</p>
                <p className="mt-1 text-sm text-white/55">{t.ymd(age.years, age.months, age.days)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/50"><Cake className="h-3.5 w-3.5" />{t.nextBirthday}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{age.daysUntilBirthday}</p>
                <p className="text-sm text-white/55">{t.daysAway}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              {wikiLoading ? (
                <p className="text-sm text-white/45">{t.loading}</p>
              ) : wiki?.extract ? (
                <>
                  <p className="whitespace-pre-line leading-7 text-white/80">{wiki.extract}</p>
                  <a href={wiki.pageUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200">Wikipedia <ExternalLink className="h-3.5 w-3.5" /></a>
                  <p className="mt-2 text-[11px] text-white/35">{t.wikiCredit}</p>
                </>
              ) : (
                <p className="text-sm text-white/55">{person.summary}</p>
              )}
            </div>

            {related.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">{t.alsoIn}</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {related.map((p) => (
                    <Link key={p.slug} to={`/famous/${p.slug}`} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-300/30 hover:bg-white/10">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold ${gradientFor(p.slug)}`}>{initials(p.name)}</div>
                      <span className="flex-1 truncate text-sm text-white/80">{p.name}</span>
                      <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:text-emerald-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
