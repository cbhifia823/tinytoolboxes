import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Bone, Search } from "lucide-react";
import petCalorieContent from "../data/pet-calorie-content.json";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Pet Calorie Calculator (RER)",
    subtitle: "Calculate your dog or cat's daily calorie needs using the veterinary-standard RER (Resting Energy Requirement) × activity multiplier method.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    species: "Species",
    dog: "Dog",
    cat: "Cat",
    weightLabel: "Weight",
    activityLabel: "Activity / Life stage",
    rer: "RER (Resting Energy Requirement)",
    mer: "MER (Daily calories)",
    note: "These are estimates based on veterinary nutrition guidelines. Individual pets may need adjustments for breed, health conditions, activity level, and climate. Consult your veterinarian before making major dietary changes.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: chocolate, xylitol, lily, food",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "寵物卡路里計算機（RER）",
    subtitle: "用獸醫標準 RER（靜止能量需求）× 活動指數方法，計算狗狗或貓貓嘅每日卡路里需求。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    species: "物種",
    dog: "狗狗",
    cat: "貓貓",
    weightLabel: "體重",
    activityLabel: "活動量／生命階段",
    rer: "RER（靜止能量需求）",
    mer: "MER（每日卡路里）",
    note: "呢啲係根據獸醫營養指南嘅估算。個別寵物可能因品種、健康狀況、活動量同氣候需要調整。作出重大飲食改變前請諮詢獸醫。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：朱古力、木糖醇、百合、食物",
  },
  "zh-cn": {
    name: "简体中文",
    title: "宠物卡路里计算器（RER）",
    subtitle: "用兽医标准 RER（静止能量需求）× 活动指数方法，计算狗狗或猫咪的每日卡路里需求。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    species: "物种",
    dog: "狗狗",
    cat: "猫咪",
    weightLabel: "体重",
    activityLabel: "活动量／生命阶段",
    rer: "RER（静止能量需求）",
    mer: "MER（每日卡路里）",
    note: "这些是根据兽医营养指南的估算。个别宠物可能因品种、健康状况、活动量和气候需要调整。作出重大饮食改变前请咨询兽医。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：巧克力、木糖醇、百合、食物",
  },
  es: {
    name: "Español",
    title: "Calculadora de calorías para mascotas (RER)",
    subtitle: "Calcula las necesidades calóricas diarias de tu perro o gato usando el método veterinario RER (Requerimiento Energético en Reposo) × multiplicador de actividad.",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
    species: "Especie",
    dog: "Perro",
    cat: "Gato",
    weightLabel: "Peso",
    activityLabel: "Actividad / Etapa de vida",
    rer: "RER (Requerimiento energético en reposo)",
    mer: "MER (Calorías diarias)",
    note: "Estas son estimaciones basadas en pautas de nutrición veterinaria. Cada mascota puede necesitar ajustes según raza, condiciones de salud, nivel de actividad y clima. Consulta a tu veterinario antes de hacer cambios dietéticos importantes.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: chocolate, xilitol, lirio, comida",
  },
};

const TOOLS = [
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs.", "zh-hk": "朱古力對狗嘅可可鹼劑量。", "zh-cn": "巧克力对狗的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate", "dog"] },
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk for dogs.", "zh-hk": "木糖醇對狗嘅風險。", "zh-cn": "木糖醇对狗的风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol", "dog"] },
  { title: { en: "Lily Toxicity Checker", "zh-hk": "貓貓百合毒性檢查器", "zh-cn": "猫咪百合毒性检查器", es: "Comprobador de toxicidad del lirio" }, description: { en: "Which lilies harm cats.", "zh-hk": "邊種百合對貓有害。", "zh-cn": "哪种百合对猫有害。", es: "Qué lirios dañan a los gatos." }, href: "/lily-toxicity-checker", keywords: ["lily", "cat"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安唔安全畀狗。", "zh-cn": "查食物是否安全给狗。", es: "Búsqueda de seguridad alimentaria." }, href: "/can-my-dog-eat", keywords: ["food", "dog"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD age formula.", "zh-hk": "用 UCSD 公式計狗年齡。", "zh-cn": "用 UCSD 公式计算狗年龄。", es: "Fórmula UCSD de edad canina." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Cat age conversion.", "zh-hk": "貓年齡換算人類年齡。", "zh-cn": "猫年龄换算人类年龄。", es: "Conversión de edad felina." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

const ACTIVITY = {
  dog: [
    { id: "puppy", label_en: "Puppy 0-4 months", label_zhhk: "幼犬 0-4 個月", label_zhcn: "幼犬 0-4 个月", label_es: "Cachorro 0-4 meses", factor: 3.0 },
    { id: "puppy2", label_en: "Puppy 4 months - adult", label_zhhk: "幼犬 4 個月至成年", label_zhcn: "幼犬 4 个月至成年", label_es: "Cachorro 4 meses - adulto", factor: 2.0 },
    { id: "intact", label_en: "Intact adult", label_zhhk: "未絕育成犬", label_zhcn: "未绝育成犬", label_es: "Adulto entero", factor: 1.8 },
    { id: "neutered", label_en: "Neutered adult", label_zhhk: "絕育成犬", label_zhcn: "绝育成犬", label_es: "Adulto castrado", factor: 1.6 },
    { id: "senior", label_en: "Senior (low activity)", label_zhhk: "老年（低活動量）", label_zhcn: "老年（低活动量）", label_es: "Sénior (poca actividad)", factor: 1.4 },
    { id: "weightloss", label_en: "Weight loss program", label_zhhk: "減重計劃", label_zhcn: "减重计划", label_es: "Plan de pérdida de peso", factor: 1.0 },
    { id: "obese", label_en: "Obese (prone)", label_zhhk: "肥胖傾向", label_zhcn: "肥胖倾向", label_es: "Obeso", factor: 0.8 },
    { id: "working", label_en: "Working / very active", label_zhhk: "工作犬／高活動量", label_zhcn: "工作犬／高活动量", label_es: "Trabajo / muy activo", factor: 4.0 },
    { id: "pregnant", label_en: "Pregnant (last 3 wks)", label_zhhk: "懷孕後期", label_zhcn: "怀孕后期", label_es: "Gestación (últimas 3 sem)", factor: 3.0 },
    { id: "lactating", label_en: "Lactating", label_zhhk: "哺乳期", label_zhcn: "哺乳期", label_es: "Lactando", factor: 5.0 },
  ],
  cat: [
    { id: "kitten", label_en: "Kitten", label_zhhk: "幼貓", label_zhcn: "幼猫", label_es: "Gatito", factor: 2.5 },
    { id: "intact", label_en: "Intact adult", label_zhhk: "未絕育成貓", label_zhcn: "未绝育成猫", label_es: "Adulto entero", factor: 1.4 },
    { id: "neutered", label_en: "Neutered adult", label_zhhk: "絕育成貓", label_zhcn: "绝育成猫", label_es: "Adulto castrado", factor: 1.2 },
    { id: "weightloss", label_en: "Weight loss program", label_zhhk: "減重計劃", label_zhcn: "减重计划", label_es: "Plan de pérdida de peso", factor: 0.8 },
    { id: "obese", label_en: "Obese (prone)", label_zhhk: "肥胖傾向", label_zhcn: "肥胖倾向", label_es: "Obeso", factor: 1.0 },
    { id: "senior", label_en: "Senior", label_zhhk: "老年", label_zhcn: "老年", label_es: "Sénior", factor: 1.1 },
    { id: "pregnant", label_en: "Pregnant", label_zhhk: "懷孕", label_zhcn: "怀孕", label_es: "Gestación", factor: 2.0 },
    { id: "lactating", label_en: "Lactating", label_zhhk: "哺乳期", label_zhcn: "哺乳期", label_es: "Lactando", factor: 3.0 },
  ],
} as const;

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/pet-calorie-calculator";

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

export default function PetCalorieCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [weight, setWeight] = useState("10");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [activityId, setActivityId] = useState<string>("neutered");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  useEffect(() => {
    // reset activity if switching species
    setActivityId(species === "dog" ? "neutered" : "neutered");
  }, [species]);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;
    const weightKg = weightUnit === "lb" ? w * 0.453592 : w;
    const rer = 70 * Math.pow(weightKg, 0.75);
    const activity = ACTIVITY[species].find((a) => a.id === activityId) ?? ACTIVITY[species][0];
    const mer = rer * activity.factor;
    return { weightKg, rer, mer, factor: activity.factor };
  }, [weight, weightUnit, species, activityId]);

  const content = LANGUAGES[locale];
  const article = petCalorieContent[locale];
  const hints = locale === "zh-hk" ? ["朱古力", "木糖醇", "百合", "狗狗年齡"] : locale === "zh-cn" ? ["巧克力", "木糖醇", "百合", "狗狗年龄"] : ["chocolate", "xylitol", "lily", "dog age"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const activityLabel = (a: typeof ACTIVITY.dog[number]) => locale === "zh-hk" ? a.label_zhhk : locale === "zh-cn" ? a.label_zhcn : locale === "es" ? a.label_es : a.label_en;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Bone className="h-5 w-5 text-amber-300" /></div>
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
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block space-y-2 sm:col-span-1"><span className="text-sm text-neutral-300">{content.species}</span>
                  <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                    <button onClick={() => setSpecies("dog")} className={`flex-1 rounded-xl px-3 py-2 text-sm transition ${species === "dog" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>{content.dog}</button>
                    <button onClick={() => setSpecies("cat")} className={`flex-1 rounded-xl px-3 py-2 text-sm transition ${species === "cat" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>{content.cat}</button>
                  </div>
                </label>
                <label className="block space-y-2 sm:col-span-1"><span className="text-sm text-neutral-300">{content.weightLabel}</span>
                  <div className="flex gap-2">
                    <input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                    <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                      <button onClick={() => setWeightUnit("kg")} className={`rounded-xl px-3 py-1.5 text-sm transition ${weightUnit === "kg" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>kg</button>
                      <button onClick={() => setWeightUnit("lb")} className={`rounded-xl px-3 py-1.5 text-sm transition ${weightUnit === "lb" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>lb</button>
                    </div>
                  </div>
                </label>
                <label className="block space-y-2 sm:col-span-1"><span className="text-sm text-neutral-300">{content.activityLabel}</span>
                  <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60">
                    {ACTIVITY[species].map((a) => <option key={a.id} value={a.id}>{activityLabel(a)} (×{a.factor})</option>)}
                  </select>
                </label>
              </div>

              {result && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.rer}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{Math.round(result.rer)}</p>
                    <p className="text-xs text-white/55">{content.note}</p>
                    <p className="mt-2 text-xs text-white/40">70 × ({result.weightKg.toFixed(2)} kg)^0.75</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-neutral-900">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-75">{content.mer}</p>
                    <p className="mt-2 text-3xl font-bold">{Math.round(result.mer)}</p>
                    <p className="text-xs opacity-75">{content.note}</p>
                    <p className="mt-2 text-xs opacity-65">RER × {result.factor} (activity factor)</p>
                  </div>
                </div>
              )}
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
                <h2 className="text-2xl font-bold text-white">{article.calcTitle}</h2>
                <p className="mt-3 leading-7">{article.calcText1}</p>
                <p className="mt-3 rounded-2xl border border-amber-400/30 bg-black/30 p-4 text-center font-mono text-lg text-amber-200" dangerouslySetInnerHTML={{ __html: article.calcFormula }} />
                <p className="mt-3 leading-7">{article.calcText2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{article.factorsTitle}</h2>
                <ul className="mt-3 space-y-2 text-white/70">
                  {(article.factors as string[]).map((item: string, i: number) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{article.startingTitle}</h2>
                <p className="mt-3 leading-7">{article.startingText1}</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  {(article.startingItems as string[]).map((item: string, i: number) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
                <p className="mt-3 leading-7">{article.startingText2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{article.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {(article.faqs as [string, string][]).map(([q, a], i: number) => (
                    <div key={i}>
                      <h3 className="font-semibold text-white">{q}</h3>
                      <p className="mt-1 text-white/70">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85">
                <strong className="text-amber-200">{article.disclaimerLabel}</strong> {article.disclaimer}
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-400/15 p-3"><Bone className="h-5 w-5 text-amber-300" /></div>
              <div>
                <h2 className="text-lg font-semibold">{article.sidebarTitle}</h2>
                <p className="text-sm text-amber-100/80">{article.sidebarSubtitle}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-amber-100/80">
              {(article.tips as string[]).map((tip: string, i: number) => (
                <p key={i} className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{tip}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
