import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Cat, Search } from "lucide-react";

const LANGUAGES = {
  en: { name: "English", title: "Cat Age in Human Years Calculator", subtitle: "Convert your cat's age to human years using the standard AAFP / IOM feline life-stage chart.", searchLabel: "Search tools", searchPlaceholder: "Try: dog age, lily, calorie", reserveAd: "Google Ads space reserved", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "Advertisement", adBadge: "Reserved", adLabel: "Advertisement", adBadge: "Reserved", catAge: "Cat age (years)", humanAge: "Human age equivalent", stage: "Life stage", article1Title: "How Cat Years Convert to Human Years", article1Body1: "Cats develop rapidly in their first two years. The AAFP/IOM standard: year 1 = roughly 15 human years, year 2 adds about 9 more (bringing them to ~24), and each year after adds approximately 4 human years.", article1Body2: "A 7-year-old cat is roughly a 44-year-old human. A 14-year-old cat is roughly 72 human years. A 20-year-old cat is around 96 human years.", article2Title: "Feline Life Stages", article2List: [{ label: "Kitten (0-1 year)", detail: "Rapid growth, vaccinations, socialization." }, { label: "Junior (1-2 years)", detail: "Reaching social maturity." }, { label: "Prime adult (3-6 years)", detail: "Healthiest years. Annual wellness exams." }, { label: "Mature (7-10 years)", detail: "Monitor weight, dental health, kidney values." }, { label: "Senior (11-14 years)", detail: "Twice-yearly vet checks." }, { label: "Geriatric (15+ years)", detail: "Frequent checks, comfortable elder care." }], sourceText: "AAFP-AAHA Feline Life Stage Guidelines, Journal of Feline Medicine and Surgery, 2021.", sidebarTitle: "Senior cat tips", sidebarSubtitle: "Keep them happy and healthy.", sidebarTips: ["Bi-annual vet visits after age 10.", "Step stools to favorite spots — joints stiffen.", "Watch water intake — kidney disease is the #1 senior cat illness."] },
  "zh-hk": { name: "繁體中文", title: "貓貓年齡換算（人類年齡）", subtitle: "用標準 AAFP／IOM 貓貓生命階段表，計算貓貓對應嘅人類年齡。", searchLabel: "搜尋工具", searchPlaceholder: "例如：狗狗年齡、百合、卡路里", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "廣告", adBadge: "已預留", adLabel: "廣告", adBadge: "已預留", catAge: "貓貓年齡（年）", humanAge: "對應人類年齡", stage: "生命階段", article1Title: "貓咪年齡如何換算人類年齡", article1Body1: "貓咪喺頭兩年生長極快。AAFP／IOM 標準：第 1 年約等於 15 歲人類，第 2 年再加約 9 歲（約 24 歲），之後每年加約 4 歲人類。", article1Body2: "7 歲貓咪約等於 44 歲人類。14 歲貓咪約等於 72 歲人類。20 歲貓咪約等於 96 歲人類。", article2Title: "貓咪生命階段", article2List: [{ label: "幼貓 (0-1 歲)", detail: "快速生長、疫苗接種、社交化。" }, { label: "青年 (1-2 歲)", detail: "達到社交成熟。" }, { label: "成年 (3-6 歲)", detail: "最健康嘅時期，每年一次健康檢查。" }, { label: "成熟 (7-10 歲)", detail: "留意體重、牙齒健康、腎臟指數。" }, { label: "老年 (11-14 歲)", detail: "每年兩次獸醫檢查。" }, { label: "高齡 (15+ 歲)", detail: "頻密檢查，舒適照護。" }], sourceText: "AAFP-AAHA 貓科生命階段指南，《貓科醫學與外科期刊》，2021 年。", sidebarTitle: "老年貓照護貼士", sidebarSubtitle: "令佢哋健康快樂。", sidebarTips: ["10 歲後每半年一次獸醫檢查。", "放踏板凳到佢哋鍾意嘅位置 — 關節會僵硬。", "留意飲水量 — 腎病係老年貓最常見疾病。"] },
  "zh-cn": { name: "简体中文", title: "猫咪年龄换算（人类年龄）", subtitle: "用标准 AAFP／IOM 猫咪生命阶段表，计算猫咪对应的人类年龄。", searchLabel: "搜索工具", searchPlaceholder: "例如：狗狗年龄、百合、卡路里", reserveAd: "预留 Google 广告位", reserveAdSub: "之后可直接放 AdSense 代码。", adLabel: "广告", adBadge: "已预留", adLabel: "广告", adBadge: "已预留", catAge: "猫咪年龄（年）", humanAge: "对应人类年龄", stage: "生命阶段", article1Title: "猫咪年龄如何换算人类年龄", article1Body1: "猫咪在头两年生长极快。AAFP／IOM 标准：第 1 年约等于 15 岁人类，第 2 年再加约 9 岁（约 24 岁），之后每年加约 4 岁人类。", article1Body2: "7 岁猫咪约等于 44 岁人类。14 岁猫咪约等于 72 岁人类。20 岁猫咪约等于 96 岁人类。", article2Title: "猫咪生命阶段", article2List: [{ label: "幼猫 (0-1 岁)", detail: "快速生长、疫苗接种、社交化。" }, { label: "青年 (1-2 岁)", detail: "达到社交成熟。" }, { label: "成年 (3-6 岁)", detail: "最健康时期，每年一次健康检查。" }, { label: "成熟 (7-10 岁)", detail: "注意体重、牙齿健康、肾脏指标。" }, { label: "老年 (11-14 岁)", detail: "每年两次兽医检查。" }, { label: "高龄 (15+ 岁)", detail: "频繁检查，舒适照护。" }], sourceText: "AAFP-AAHA 猫科生命阶段指南，《猫科医学与外科期刊》，2021 年。", sidebarTitle: "老年猫照护贴士", sidebarSubtitle: "让它们健康快乐。", sidebarTips: ["10 岁后每半年一次兽医检查。", "放踏板凳到它们喜欢的位置 — 关节会僵硬。", "留意饮水量 — 肾病是老年猫最常见疾病。"] },
  es: { name: "Español", title: "Calculadora de edad de gato en años humanos", subtitle: "Convierte la edad de tu gato a años humanos usando la tabla AAFP/IOM de etapas felinas.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: edad perro, lirio, calorías", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "Puedes insertar AdSense aquí más adelante.", adLabel: "Advertisement", adBadge: "Reserved", adLabel: "Publicidad", adBadge: "Reservado", catAge: "Edad del gato (años)", humanAge: "Edad humana equivalente", stage: "Etapa de vida", article1Title: "Cómo se convierten los años de gato en años humanos", article1Body1: "Los gatos se desarrollan rápido en sus primeros dos años. El estándar AAFP/IOM: año 1 ≈ 15 años humanos, año 2 añade ~9 más (~24), cada año después añade ~4 años humanos.", article1Body2: "Un gato de 7 años equivale a ~44 años humanos. Uno de 14 años ≈ 72. Uno de 20 años ≈ 96.", article2Title: "Etapas de vida felina", article2List: [{ label: "Gatito (0-1 año)", detail: "Crecimiento rápido, vacunas, socialización." }, { label: "Juvenil (1-2 años)", detail: "Madurez social." }, { label: "Adulto pleno (3-6 años)", detail: "Años más saludables. Exámenes anuales." }, { label: "Maduro (7-10 años)", detail: "Controlar peso, salud dental, valores renales." }, { label: "Sénior (11-14 años)", detail: "Dos visitas al veterinario al año." }, { label: "Geriátrico (15+ años)", detail: "Revisiones frecuentes, cuidados cómodos." }], sourceText: "AAFP-AAHA Guías de Etapas de Vida Felina, Journal of Feline Medicine and Surgery, 2021.", sidebarTitle: "Consejos para gatos sénior", sidebarSubtitle: "Mantenlos felices y saludables.", sidebarTips: ["Visitas veterinarias semestrales después de los 10.", "Taburetes hacia sus lugares favoritos — las articulaciones se endurecen.", "Observa la ingesta de agua — la enfermedad renal es la #1 en gatos sénior."] },
};

const TOOLS = [
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD age formula.", "zh-hk": "用 UCSD 公式計狗年齡。", "zh-cn": "用 UCSD 公式计算狗年龄。", es: "Fórmula UCSD de edad canina." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie needs.", "zh-hk": "貓狗每日卡路里需求。", "zh-cn": "猫狗每日卡路里需求。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie"] },
  { title: { en: "Lily Toxicity Checker", "zh-hk": "貓貓百合毒性檢查器", "zh-cn": "猫咪百合毒性检查器", es: "Comprobador de toxicidad del lirio" }, description: { en: "Which lilies harm cats.", "zh-hk": "邊種百合對貓有害。", "zh-cn": "哪种百合对猫有害。", es: "Qué lirios dañan a los gatos." }, href: "/lily-toxicity-checker", keywords: ["lily"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安唔安全畀狗。", "zh-cn": "查食物是否安全给狗。", es: "Búsqueda de seguridad alimentaria." }, href: "/can-my-dog-eat", keywords: ["food"] },
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs.", "zh-hk": "朱古力對狗嘅可可鹼劑量。", "zh-cn": "巧克力对狗的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate"] },
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk for dogs.", "zh-hk": "木糖醇對狗嘅風險。", "zh-cn": "木糖醇对狗的风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol"] },
];

function catToHuman(years: number) {
  if (years <= 0) return 0;
  if (years <= 1) return Math.round(years * 15);
  if (years <= 2) return Math.round(15 + (years - 1) * 9);
  return Math.round(24 + (years - 2) * 4);
}

function stageOf(years: number, locale: keyof typeof LANGUAGES): string {
  const map = {
    en: { kitten: "Kitten", junior: "Junior", prime: "Prime adult", mature: "Mature", senior: "Senior", geriatric: "Geriatric" },
    "zh-hk": { kitten: "幼貓", junior: "青年", prime: "成年", mature: "成熟", senior: "老年", geriatric: "高齡" },
    "zh-cn": { kitten: "幼猫", junior: "青年", prime: "成年", mature: "成熟", senior: "老年", geriatric: "高龄" },
    es: { kitten: "Gatito", junior: "Juvenil", prime: "Adulto en plenitud", mature: "Maduro", senior: "Sénior", geriatric: "Geriátrico" },
  } as const;
  const m = map[locale];
  if (years < 1) return m.kitten;
  if (years < 3) return m.junior;
  if (years < 7) return m.prime;
  if (years < 11) return m.mature;
  if (years < 15) return m.senior;
  return m.geriatric;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/cat-age-calculator";

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
  if (o.jsonLd) { const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]; arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); }); }
}

export default function CatAgeCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [catAge, setCatAge] = useState("5");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const result = useMemo(() => {
    const a = parseFloat(catAge);
    if (isNaN(a) || a <= 0) return null;
    return { human: catToHuman(a), stage: stageOf(a, locale) };
  }, [catAge, locale]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["狗狗年齡", "百合", "卡路里", "食物"] : locale === "zh-cn" ? ["狗狗年龄", "百合", "卡路里", "食物"] : ["dog age", "lily", "calorie", "food"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const chartRows = Array.from({ length: 20 }, (_, i) => {
    const y = i + 1;
    return { y, human: catToHuman(y), stage: stageOf(y, locale) };
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Cat className="h-5 w-5 text-amber-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">TinyToolboxes · Pet</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.catAge}</span>
                <input type="number" min="0" step="0.1" value={catAge} onChange={(e) => setCatAge(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
              </label>

              {result && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-neutral-900">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">{content.humanAge}</p>
                    <p className="mt-2 text-5xl font-bold">{result.human}</p>
                    <p className="text-sm opacity-75">years</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{content.stage}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{result.stage}</p>
                  </div>
                </div>
              )}

              <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <summary className="cursor-pointer text-sm font-medium text-white">Reference chart (1-20 years)</summary>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-sm">
                  {chartRows.map((r) => (
                    <div key={r.y} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"><p className="text-xs text-white/45">Cat {r.y}y</p><p className="font-semibold text-amber-200">{r.human} human</p><p className="text-xs text-white/55">{r.stage}</p></div>
                  ))}
                </div>
              </details>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-amber-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-amber-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.article1Title}</h2>
                <p className="mt-3 leading-7">{content.article1Body1}</p>
                <p className="mt-3 leading-7">{content.article1Body2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.article2Title}</h2>
                <ul className="mt-3 space-y-2 text-white/70">
                  {content.article2List.map((item: { label: string; detail: string }, i: number) => (
                    <li key={i}>• <strong className="text-white">{item.label}</strong> — {item.detail}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">Source:</strong> {content.sourceText}</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Cat className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-amber-100/80">{content.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              {content.sidebarTips.map((tip: string, i: number) => (
                <p key={i} className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{tip}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
