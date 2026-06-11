import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, HeartPulse, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  reserveAd: string;
  reserveAdSub: string;
  adLabel: string;
  adBadge: string;
  heightLabel: string;
  weightLabel: string;
  unitsMetric: string;
  unitsImperial: string;
  category: string;
  underweight: string;
  normal: string;
  overweight: string;
  obese: string;
  result: string;
  healthyRange: string;
  classification: string;
  whoStandard: string;
  asianStandard: string;
  useCasesTitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
  articleTitle: string;
  articleBody: string;
}> = {
  en: {
    name: "English",
    title: "BMI Calculator",
    subtitle: "Calculate your Body Mass Index (BMI) and see whether you fall in the underweight, healthy, overweight, or obese range.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: calorie, mortgage, age, percent",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    heightLabel: "Height",
    weightLabel: "Weight",
    unitsMetric: "Metric (cm / kg)",
    unitsImperial: "Imperial (ft·in / lb)",
    category: "Category",
    underweight: "Underweight",
    normal: "Healthy weight",
    overweight: "Overweight",
    obese: "Obese",
    result: "Your BMI",
    healthyRange: "Healthy weight range for your height",
    classification: "Classification",
    whoStandard: "WHO standard",
    asianStandard: "Asian adult cut-offs",
    useCasesTitle: "Use cases",
    useCases: [
      "Quick body composition check.",
      "Tracking weight changes over time.",
      "Pre-doctor visit health summary.",
      "Insurance form preparation.",
      "Fitness goal planning.",
    ],
    suggestionsTitle: "You may also like",
    suggestions: ["Calorie Calculator", "Percentage Calculator", "Unit Converter"],
    articleTitle: "How BMI Works and Its Limitations",
    articleBody: "Body Mass Index (BMI) is a simple measure that uses your height and weight to estimate your body composition.",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "BMI 計算器",
    subtitle: "計算你嘅 BMI（身體質量指數），睇下屬於過輕、健康、超重定肥胖。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：卡路里、按揭、年齡、百分比",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告", adBadge: "已預留",
    heightLabel: "身高",
    weightLabel: "體重",
    unitsMetric: "公制（cm / kg）",
    unitsImperial: "英制（ft·in / lb）",
    category: "類別",
    underweight: "過輕",
    normal: "健康",
    overweight: "超重",
    obese: "肥胖",
    result: "你嘅 BMI",
    healthyRange: "依你嘅身高，健康體重範圍",
    classification: "分類標準",
    whoStandard: "WHO 標準",
    asianStandard: "亞洲成年人標準",
    useCasesTitle: "用途",
    useCases: [
      "快速檢查體形。",
      "追蹤體重變化。",
      "睇醫生前簡單記錄。",
      "保險表格填寫。",
      "健身目標規劃。",
    ],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["卡路里計算器", "百分比計算器", "單位換算器"],
    articleTitle: "了解 BMI：呢個數字真正代表咩",
    articleBody: "身體質量指數（BMI）係一個簡單嘅指標，用你嘅身高同體重去估算你嘅體形。但係，BMI 唔係完美嘅測量方法，佢唔考慮肌肉量、骨頭密度或者體脂分布，所以對於運動員、孕婦或者肌肉發達嘅人，BMI 可能會誤導。",
  },
  "zh-cn": {
    name: "简体中文",
    title: "BMI 计算器",
    subtitle: "计算你的 BMI（身体质量指数），看看属于偏瘦、健康、超重还是肥胖。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：卡路里、按揭、年龄、百分比",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "广告", adBadge: "已预留",
    heightLabel: "身高",
    weightLabel: "体重",
    unitsMetric: "公制（cm / kg）",
    unitsImperial: "英制（ft·in / lb）",
    category: "类别",
    underweight: "偏瘦",
    normal: "健康",
    overweight: "超重",
    obese: "肥胖",
    result: "你的 BMI",
    healthyRange: "根据你的身高，健康体重范围",
    classification: "分类标准",
    whoStandard: "WHO 标准",
    asianStandard: "亚洲成年人标准",
    useCasesTitle: "用途",
    useCases: [
      "快速检查体型。",
      "追踪体重变化。",
      "看医生前简单记录。",
      "保险表格填写。",
      "健身目标规划。",
    ],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["卡路里计算器", "百分比计算器", "单位换算器"],
    articleTitle: "了解 BMI：这个数字真正代表什么",
    articleBody: "身体质量指数（BMI）是一个简单的指标，用你的身高和体重来估算你的体形。但 BMI 并不是完美的测量方法，它不考虑肌肉量、骨密度或脂肪分布，所以对于运动员、孕妇或肌肉发达的人，BMI 可能会产生误导。",
  },
  es: {
    name: "Español",
    title: "Calculadora de IMC",
    subtitle: "Calcula tu Índice de Masa Corporal (IMC) y descubre si estás bajo de peso, en peso saludable, con sobrepeso u obesidad.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: calorie, mortgage, age, percent",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    heightLabel: "Altura",
    weightLabel: "Peso",
    unitsMetric: "Métrico (cm / kg)",
    unitsImperial: "Imperial (ft·in / lb)",
    category: "Categoría",
    underweight: "Bajo peso",
    normal: "Peso saludable",
    overweight: "Sobrepeso",
    obese: "Obesidad",
    result: "Tu IMC",
    healthyRange: "Rango de peso saludable para tu altura",
    classification: "Clasificación",
    whoStandard: "Estándar OMS",
    asianStandard: "Cortes para adultos asiáticos",
    useCasesTitle: "Casos de uso",
    useCases: [
      "Revisión rápida de composición corporal.",
      "Seguimiento de cambios de peso.",
      "Resumen previo a la consulta médica.",
      "Formularios de seguros.",
      "Planificación de objetivos fitness.",
    ],
    suggestionsTitle: "También te puede interesar",
    suggestions: ["Calculadora de calorías", "Calculadora de porcentajes", "Conversor de unidades"],
    articleTitle: "Entender el IMC: qué significa realmente el número",
    articleBody: "El Índice de Masa Corporal (IMC) es una medida simple que usa tu altura y peso para estimar tu composición corporal. Sin embargo, el IMC no es una medida perfecta, ya que no considera la masa muscular, la densidad ósea o la distribución de grasa, por lo que puede ser engañoso para atletas, embarazadas o personas con mucha masa muscular.",
  },
};

const TOOLS = [
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", "es": "Conversor de divisas" }, description: "Estimate daily calories with TDEE.", href: "/calorie-calculator", keywords: ["calorie", "tdee"] },
  { title: "Percentage Calculator", description: "Percentage of a number.", href: "/percentage-calculator", keywords: ["percent"] },
  { title: "Unit Converter", description: "Convert length, weight, temperature.", href: "/unit-converter", keywords: ["convert"] },
  { title: "Age Calculator", description: "Calculate exact age.", href: "/age-calculator", keywords: ["age"] },
  { title: "Wheel Spinner", description: "Pick random names.", href: "/wheel-spinner", keywords: ["random"] },
  { title: "Mortgage Calculator (Australia)", description: "AU mortgage repayments.", href: "/mortgage-calculator-australia", keywords: ["mortgage"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/bmi-calculator";

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

function bmiCategory(bmi: number, asian: boolean, t: LocaleKey): { label: string; color: string } {
  const L = LANGUAGES[t];
  if (asian) {
    if (bmi < 18.5) return { label: L.underweight, color: "text-cyan-300" };
    if (bmi < 23) return { label: L.normal, color: "text-emerald-300" };
    if (bmi < 27.5) return { label: L.overweight, color: "text-amber-300" };
    return { label: L.obese, color: "text-red-400" };
  }
  if (bmi < 18.5) return { label: L.underweight, color: "text-cyan-300" };
  if (bmi < 25) return { label: L.normal, color: "text-emerald-300" };
  if (bmi < 30) return { label: L.overweight, color: "text-amber-300" };
  return { label: L.obese, color: "text-red-400" };
}

export default function BmiCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("170");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weightKg, setWeightKg] = useState("65");
  const [weightLb, setWeightLb] = useState("143");
  const [useAsian, setUseAsian] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const { bmi, healthyMin, healthyMax } = useMemo(() => {
    let h = 0, w = 0;
    if (units === "metric") {
      h = parseFloat(heightCm) / 100;
      w = parseFloat(weightKg);
    } else {
      h = (parseFloat(heightFt) * 12 + parseFloat(heightIn)) * 0.0254;
      w = parseFloat(weightLb) * 0.453592;
    }
    if (!h || !w || h <= 0) return { bmi: 0, healthyMin: 0, healthyMax: 0 };
    const bmi = w / (h * h);
    const maxBmi = useAsian ? 23 : 25;
    const healthyMin = 18.5 * h * h;
    const healthyMax = maxBmi * h * h;
    return { bmi, healthyMin, healthyMax };
  }, [units, heightCm, heightFt, heightIn, weightKg, weightLb, useAsian]);

  const content = LANGUAGES[locale];
  const cat = bmi > 0 ? bmiCategory(bmi, useAsian, locale) : null;
  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [search]);

  const fmtWeight = (kg: number) => units === "metric" ? `${kg.toFixed(1)} kg` : `${(kg / 0.453592).toFixed(1)} lb`;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><HeartPulse className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setUnits("metric")} className={`rounded-full border px-4 py-2 text-sm transition ${units === "metric" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.unitsMetric}</button>
                <button onClick={() => setUnits("imperial")} className={`rounded-full border px-4 py-2 text-sm transition ${units === "imperial" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.unitsImperial}</button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {units === "metric" ? (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.heightLabel} (cm)</span>
                    <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  </label>
                ) : (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.heightLabel} (ft / in)</span>
                    <div className="flex gap-2">
                      <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" placeholder="ft" />
                      <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" placeholder="in" />
                    </div>
                  </label>
                )}
                {units === "metric" ? (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.weightLabel} (kg)</span>
                    <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  </label>
                ) : (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.weightLabel} (lb)</span>
                    <input type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  </label>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" checked={useAsian} onChange={(e) => setUseAsian(e.target.checked)} />
                <span>{content.asianStandard}</span>
              </label>

              {bmi > 0 && cat && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.result}</p>
                    <p className="mt-2 text-5xl font-bold text-white">{bmi.toFixed(1)}</p>
                    <p className={`mt-3 text-lg font-semibold ${cat.color}`}>{cat.label}</p>
                    <p className="mt-1 text-xs text-white/55">{useAsian ? content.asianStandard : content.whoStandard}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.healthyRange}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{fmtWeight(healthyMin)} – {fmtWeight(healthyMax)}</p>
                  </div>
                </div>
              )}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white">
              <h2 className="text-2xl">{content.articleTitle}</h2>
              <p>{content.articleBody}</p>
            </article>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.slice(0, 5).map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><HeartPulse className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                {content.useCases.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((t) => t.title === name);
                  if (!match) return null;
                  return (
                    <a key={name} href={match.href} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span><ArrowRight className="h-4 w-4 text-white/35" />
                    </a>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );}
