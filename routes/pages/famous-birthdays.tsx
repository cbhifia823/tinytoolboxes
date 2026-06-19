import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Cake, PartyPopper, Film, Music, Trophy, Globe, Sparkles, Video, Briefcase, Users } from "lucide-react";

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
const PAGE_PATH = "/famous-birthdays";

const CATEGORIES: Record<string, { icon: typeof Film; label: Record<LocaleKey, string> }> = {
  actor: { icon: Film, label: { en: "Actor", "zh-hk": "演員", "zh-cn": "演员", es: "Actor" } },
  musician: { icon: Music, label: { en: "Musician", "zh-hk": "音樂人", "zh-cn": "音乐人", es: "Músico" } },
  athlete: { icon: Trophy, label: { en: "Sportsperson", "zh-hk": "運動員", "zh-cn": "运动员", es: "Deportista" } },
  internet: { icon: Globe, label: { en: "Internet Celebrity", "zh-hk": "網絡名人", "zh-cn": "网络名人", es: "Celebridad de internet" } },
  dancer: { icon: Sparkles, label: { en: "Dancer", "zh-hk": "舞蹈家", "zh-cn": "舞蹈家", es: "Bailarín/a" } },
  director: { icon: Video, label: { en: "Director", "zh-hk": "導演", "zh-cn": "导演", es: "Director/a" } },
  entrepreneur: { icon: Briefcase, label: { en: "Entrepreneur", "zh-hk": "企業家", "zh-cn": "企业家", es: "Empresario/a" } },
};

const UI: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  bornToday: string;
  noBornToday: string;
  all: string;
  yearsOld: string;
  turns: string;
  browseBy: string;
  count: (n: number) => string;
}> = {
  en: {
    name: "English",
    title: "Famous Birthdays",
    subtitle: "Birthdays of notable actors, musicians, athletes, internet creators, and more — with their exact current age and star sign.",
    searchPlaceholder: "Search a name…",
    bornToday: "Born today",
    noBornToday: "No one in our list is celebrating today — browse everyone below.",
    all: "All",
    yearsOld: "yrs",
    turns: "turns",
    browseBy: "Browse by category",
    count: (n) => `${n} people`,
  },
  "zh-hk": {
    name: "繁體中文",
    title: "名人生日",
    subtitle: "演員、音樂人、運動員、網絡創作者等名人的生日——附上準確年齡同星座。",
    searchPlaceholder: "搜尋名字…",
    bornToday: "今日生日",
    noBornToday: "今日名單上冇人生日——可瀏覽下面全部。",
    all: "全部",
    yearsOld: "歲",
    turns: "將滿",
    browseBy: "按分類瀏覽",
    count: (n) => `${n} 位名人`,
  },
  "zh-cn": {
    name: "简体中文",
    title: "名人生日",
    subtitle: "演员、音乐人、运动员、网络创作者等名人的生日——附上准确年龄和星座。",
    searchPlaceholder: "搜索名字…",
    bornToday: "今日生日",
    noBornToday: "今天名单上没有人过生日——可浏览下面全部。",
    all: "全部",
    yearsOld: "岁",
    turns: "将满",
    browseBy: "按分类浏览",
    count: (n) => `${n} 位名人`,
  },
  es: {
    name: "Español",
    title: "Cumpleaños de famosos",
    subtitle: "Cumpleaños de actores, músicos, deportistas, creadores de internet y más, con su edad exacta y signo zodiacal.",
    searchPlaceholder: "Buscar un nombre…",
    bornToday: "Cumplen hoy",
    noBornToday: "Nadie de la lista cumple hoy; explora a todos abajo.",
    all: "Todos",
    yearsOld: "años",
    turns: "cumple",
    browseBy: "Explorar por categoría",
    count: (n) => `${n} personas`,
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
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) {
    const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd];
    arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); });
  }
}

function ageYears(dob: string, now: Date) {
  const [y, m, d] = dob.split("-").map(Number);
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  return age;
}

function initials(name: string) {
  const parts = name.replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || name.slice(0, 2).toUpperCase();
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

export default function FamousBirthdays() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const now = useMemo(() => new Date(), []);
  const t = UI[locale];

  useEffect(() => {
    fetch("/famous-people.json").then((r) => r.json()).then((d: { people: Person[] }) => setPeople(d.people || [])).catch(() => setPeople([]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    applySEO({
      title: `${t.title} | TinyToolboxes`,
      description: t.subtitle,
      path: PAGE_PATH,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: t.title,
        url: SITE_URL + PAGE_PATH,
        description: t.subtitle,
        isPartOf: { "@type": "WebSite", name: "TinyToolboxes", url: SITE_URL },
      },
    });
  }, [locale, t]);

  const bornToday = useMemo(() => people.filter((p) => {
    const [, m, d] = p.dob.split("-").map(Number);
    return m === now.getMonth() + 1 && d === now.getDate();
  }), [people, now]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return people
      .filter((p) => activeCat === "all" || p.category === activeCat)
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [people, search, activeCat]);

  const monthDay = (dob: string) => {
    const [y, m, d] = dob.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale === "es" ? "es" : locale.startsWith("zh") ? "zh" : "en", { month: "short", day: "numeric" });
  };

  const Card = ({ p }: { p: Person }) => {
    const cat = CATEGORIES[p.category];
    const Icon = cat?.icon || Users;
    return (
      <Link to={`/famous/${p.slug}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-300/30 hover:bg-white/10">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-semibold ${gradientFor(p.slug)}`}>{initials(p.name)}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{p.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/55"><Icon className="h-3.5 w-3.5" />{cat?.label[locale] || p.category}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45"><Cake className="h-3.5 w-3.5" />{monthDay(p.dob)} · {ageYears(p.dob, now)} {t.yearsOld}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-emerald-300" />
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><PartyPopper className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{t.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(UI) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{UI[key].name}</button>)}</div>
        </div>

        <div className="space-y-8 py-10">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t.title}</h2>
            <p className="text-base leading-7 text-white/70 sm:text-lg">{t.subtitle}</p>
          </div>

          <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/80"><Cake className="h-4 w-4" />{t.bornToday}</h3>
            {bornToday.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{bornToday.map((p) => <Card key={p.slug} p={p} />)}</div>
            ) : (
              <p className="mt-3 text-sm text-white/55">{t.noBornToday}</p>
            )}
          </section>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveCat("all")} className={`rounded-full border px-3 py-1.5 text-sm transition ${activeCat === "all" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{t.all}</button>
              {Object.entries(CATEGORIES).map(([key, c]) => {
                const Icon = c.icon;
                return <button key={key} onClick={() => setActiveCat(key)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${activeCat === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}><Icon className="h-3.5 w-3.5" />{c.label[locale]}</button>;
              })}
            </div>
            <p className="text-xs text-white/45">{t.count(filtered.length)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((p) => <Card key={p.slug} p={p} />)}</div>
        </div>
      </section>
    </main>
  );
}
