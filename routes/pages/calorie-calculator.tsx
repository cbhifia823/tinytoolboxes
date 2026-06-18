import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Flame, Search } from "lucide-react";

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
  age: string;
  sex: string;
  male: string;
  female: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
  bmr: string;
  tdee: string;
  daily: string;
  protein: string;
  carbs: string;
  fat: string;
  macros: string;
  metric: string;
  imperial: string;
  useCasesTitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
  articleTitle: string;
  articleBody: string;
  sedentary: string;
  light: string;
  moderate: string;
  active: string;
  veryActive: string;
  goalLose: string;
  goalMaintain: string;
  goalMildGain: string;
  goalGain: string;
}> = {
  en: {
    name: "English",
    title: "Calorie Calculator (TDEE)",
    subtitle: "Calculate your daily calorie needs using BMR and TDEE. Get a clear target for weight loss, maintenance, or muscle gain.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: BMI, mortgage, percent, age",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    age: "Age",
    sex: "Sex",
    male: "Male",
    female: "Female",
    height: "Height",
    weight: "Weight",
    activity: "Activity level",
    goal: "Goal",
    bmr: "BMR (rest)",
    tdee: "TDEE",
    daily: "Daily calorie target",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    macros: "Suggested macros",
    metric: "Metric (cm/kg)",
    imperial: "Imperial (ft·in/lb)",
    useCasesTitle: "Use cases",
    useCases: [
      "Weight loss planning.",
      "Muscle gain (bulk) target.",
      "Maintenance after a diet.",
      "Meal planning and prep.",
      "Macro tracking for athletes.",
    ],
    suggestionsTitle: "You may also like",
    suggestions: ["BMI Calculator", "Unit Converter", "Percentage Calculator"],
    articleTitle: "BMR, TDEE, and how to actually use these numbers",
    articleBody: "Your body uses calories for three things: keeping you alive at rest (BMR), digesting and processing what you eat (TEF, about 10% of intake), and physical activity. Add them up and you get TDEE — Total Daily Energy Expenditure — the number of calories you burn in a 24-hour cycle. Eat at TDEE and your weight stays the same. Eat less and you lose. Eat more and you gain.",
    sedentary: "Sedentary (little or no exercise)",
    light: "Light (1–3 days/week)",
    moderate: "Moderate (3–5 days/week)",
    active: "Active (6–7 days/week)",
    veryActive: "Very active (physical job or 2× day)",
    goalLose: "Lose weight (−500 kcal)",
    goalMaintain: "Maintain",
    goalMildGain: "Mild gain (+250 kcal)",
    goalGain: "Gain weight (+500 kcal)",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "卡路里計算器（TDEE）",
    subtitle: "用 BMR 同 TDEE 計每日所需卡路里，俾你減肥、維持或增肌一個清晰目標。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：BMI、按揭、百分比、年齡",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告", adBadge: "已預留",
    age: "年齡",
    sex: "性別",
    male: "男",
    female: "女",
    height: "身高",
    weight: "體重",
    activity: "活動程度",
    goal: "目標",
    bmr: "BMR（基礎代謝）",
    tdee: "TDEE（每日消耗）",
    daily: "每日卡路里目標",
    protein: "蛋白質",
    carbs: "碳水化合物",
    fat: "脂肪",
    macros: "建議三大營養素",
    metric: "公制（cm/kg）",
    imperial: "英制（ft·in/lb）",
    useCasesTitle: "用途",
    useCases: [
      "減肥規劃。",
      "增肌目標。",
      "減完維持。",
      "餐單同備餐。",
      "運動員追蹤 macro。",
    ],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["BMI 計算器", "單位換算器", "百分比計算器"],
    articleTitle: "BMR、TDEE 解釋：呢啲數字點樣真正用",
    articleBody: "身體用卡路里做三件事：維持生命（BMR）、消化食物（TEF，約佔攝取量 10%）、活動消耗。加埋就係每日總消耗（TDEE）。按 TDEE 食，體重不變；食少少，體重減；食多啲，體重增。",
    sedentary: "幾乎冇運動",
    light: "輕度（1–3 日/週）",
    moderate: "中等（3–5 日/週）",
    active: "活躍（6–7 日/週）",
    veryActive: "非常活躍（體力工作）",
    goalLose: "減肥（−500 kcal）",
    goalMaintain: "維持",
    goalMildGain: "輕度增（+250 kcal）",
    goalGain: "增重（+500 kcal）",
  },
  "zh-cn": {
    name: "简体中文",
    title: "卡路里计算器（TDEE）",
    subtitle: "用 BMR 和 TDEE 计算每日所需卡路里，给你减肥、维持或增肌一个清晰目标。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：BMI、按揭、百分比、年龄",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告", adBadge: "已预留",
    age: "年龄",
    sex: "性别",
    male: "男",
    female: "女",
    height: "身高",
    weight: "体重",
    activity: "活动程度",
    goal: "目标",
    bmr: "BMR（基础代谢）",
    tdee: "TDEE（每日消耗）",
    daily: "每日卡路里目标",
    protein: "蛋白质",
    carbs: "碳水化合物",
    fat: "脂肪",
    macros: "建议三大营养素",
    metric: "公制（cm/kg）",
    imperial: "英制（ft·in/lb）",
    useCasesTitle: "用途",
    useCases: [
      "减肥规划。",
      "增肌目标。",
      "减完维持。",
      "餐单和备餐。",
      "运动员追踪 macro。",
    ],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["BMI 计算器", "单位换算器", "百分比计算器"],
    articleTitle: "BMR、TDEE 解释：这些数字怎么用",
    articleBody: "身体用卡路里做三件事：维持生命（BMR）、消化食物（TEF，约占摄入量 10%）、活动消耗。加埋就是每日总消耗（TDEE）。按 TDEE 吃，体重不变；吃少少，体重减；吃多啲，体重增。",
    sedentary: "几乎没运动",
    light: "轻度（1–3 天/周）",
    moderate: "中等（3–5 天/周）",
    active: "活跃（6–7 天/周）",
    veryActive: "非常活跃（体力工作）",
    goalLose: "减肥（−500 kcal）",
    goalMaintain: "维持",
    goalMildGain: "轻度增（+250 kcal）",
    goalGain: "增重（+500 kcal）",
  },
  es: {
    name: "Español",
    title: "Calculadora de calorías (TDEE)",
    subtitle: "Calcula tus calorías diarias usando BMR y TDEE. Obtén un objetivo claro para perder peso, mantenerte o ganar músculo.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: BMI, mortgage, percent, age",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Anuncio",
    adBadge: "Reservado",
    age: "Edad",
    sex: "Sexo",
    male: "Hombre",
    female: "Mujer",
    height: "Altura",
    weight: "Peso",
    activity: "Nivel de actividad",
    goal: "Objetivo",
    bmr: "BMR (reposo)",
    tdee: "TDEE",
    daily: "Calorías diarias objetivo",
    protein: "Proteína",
    carbs: "Carbohidratos",
    fat: "Grasa",
    macros: "Macros sugeridos",
    metric: "Métrico (cm/kg)",
    imperial: "Imperial (ft·in/lb)",
    useCasesTitle: "Casos de uso",
    useCases: [
      "Planificar pérdida de peso.",
      "Objetivo de ganancia muscular.",
      "Mantenimiento tras una dieta.",
      "Planificación de comidas.",
      "Tracking de macros para atletas.",
    ],
    suggestionsTitle: "También te puede interesar",
    suggestions: ["Calculadora de IMC", "Conversor de unidades", "Calculadora de porcentajes"],
    articleTitle: "BMR, TDEE: cómo usar estos números en la práctica",
    articleBody: "Tu cuerpo usa calorías para tres cosas: mantenerte vivo en reposo (BMR), digerir y procesar lo que comes (TEF, alrededor del 10% de la ingesta), y actividad física. Suma todo y obtienes TDEE — Gasto Energético Diario Total — el número de calorías que quemas en un ciclo de 24 horas. Come a TDEE y tu peso se mantiene. Come menos y pierdes. Come más y ganas.",
    sedentary: "Sedentario (poco o nada de ejercicio)",
    light: "Ligero (1–3 días/semana)",
    moderate: "Moderado (3–5 días/semana)",
    active: "Activo (6–7 días/semana)",
    veryActive: "Muy activo (trabajo físico)",
    goalLose: "Perder peso (−500 kcal)",
    goalMaintain: "Mantener",
    goalMildGain: "Ganancia ligera (+250 kcal)",
    goalGain: "Ganar peso (+500 kcal)",
  },
};

const TOOLS = [
  { title: { en: "BMI Calculator", "zh-hk": "BMI 計算機", "zh-cn": "BMI 计算器" }, description: "Body Mass Index.", href: "/bmi-calculator", keywords: ["bmi"] },
  { title: "Unit Converter", description: "Convert length, weight, temperature.", href: "/unit-converter", keywords: ["convert"] },
  { title: "Percentage Calculator", description: "Percentage of a number.", href: "/percentage-calculator", keywords: ["percent"] },
  { title: "Age Calculator", description: "Calculate exact age.", href: "/age-calculator", keywords: ["age"] },
  { title: "Wheel Spinner", description: "Pick random names.", href: "/wheel-spinner", keywords: ["random"] },
  { title: "Mortgage Calculator (Australia)", description: "AU mortgage repayments.", href: "/mortgage-calculator-australia", keywords: ["mortgage"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/calorie-calculator";

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

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9,
};

const GOAL_ADJUST: Record<string, number> = {
  lose: -500, maintain: 0, mildGain: 250, gain: 500,
};

export default function CalorieCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [heightCm, setHeightCm] = useState("170");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weightKg, setWeightKg] = useState("70");
  const [weightLb, setWeightLb] = useState("154");
  const [activity, setActivity] = useState<keyof typeof ACTIVITY_FACTORS>("moderate");
  const [goal, setGoal] = useState<keyof typeof GOAL_ADJUST>("maintain");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const { bmr, tdee, daily, macros } = useMemo(() => {
    const a = parseFloat(age);
    let h = 0, w = 0;
    if (units === "metric") {
      h = parseFloat(heightCm);
      w = parseFloat(weightKg);
    } else {
      h = (parseFloat(heightFt) * 12 + parseFloat(heightIn)) * 2.54;
      w = parseFloat(weightLb) * 0.453592;
    }
    if (!a || !h || !w) return { bmr: 0, tdee: 0, daily: 0, macros: { p: 0, c: 0, f: 0 } };
    const bmr = sex === "male" ? (10 * w + 6.25 * h - 5 * a + 5) : (10 * w + 6.25 * h - 5 * a - 161);
    const tdee = bmr * ACTIVITY_FACTORS[activity];
    const daily = Math.max(1200, Math.round(tdee + GOAL_ADJUST[goal]));
    const proteinG = Math.round(w * 1.8);
    const fatG = Math.round((daily * 0.25) / 9);
    const carbsG = Math.round((daily - proteinG * 4 - fatG * 9) / 4);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), daily, macros: { p: proteinG, c: carbsG, f: fatG } };
  }, [units, sex, age, heightCm, heightFt, heightIn, weightKg, weightLb, activity, goal]);

  const content = LANGUAGES[locale];
  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Flame className="h-5 w-5 text-emerald-300" /></div>
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
                <button onClick={() => setUnits("metric")} className={`rounded-full border px-4 py-2 text-sm transition ${units === "metric" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.metric}</button>
                <button onClick={() => setUnits("imperial")} className={`rounded-full border px-4 py-2 text-sm transition ${units === "imperial" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.imperial}</button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.age}</span><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.sex}</span>
                  <select value={sex} onChange={(e) => setSex(e.target.value as "male" | "female")} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    <option value="male">{content.male}</option>
                    <option value="female">{content.female}</option>
                  </select>
                </label>
                {units === "metric" ? (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.height} (cm)</span><input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                ) : (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.height} (ft·in)</span>
                    <div className="flex gap-2">
                      <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                      <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                    </div>
                  </label>
                )}
                {units === "metric" ? (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.weight} (kg)</span><input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                ) : (
                  <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.weight} (lb)</span><input type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                )}
              </div>

              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.activity}</span>
                <select value={activity} onChange={(e) => setActivity(e.target.value as keyof typeof ACTIVITY_FACTORS)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                  <option value="sedentary">{content.sedentary}</option>
                  <option value="light">{content.light}</option>
                  <option value="moderate">{content.moderate}</option>
                  <option value="active">{content.active}</option>
                  <option value="veryActive">{content.veryActive}</option>
                </select>
              </label>

              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.goal}</span>
                <select value={goal} onChange={(e) => setGoal(e.target.value as keyof typeof GOAL_ADJUST)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                  <option value="lose">{content.goalLose}</option>
                  <option value="maintain">{content.goalMaintain}</option>
                  <option value="mildGain">{content.goalMildGain}</option>
                  <option value="gain">{content.goalGain}</option>
                </select>
              </label>

              {tdee > 0 && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.bmr}</p><p className="mt-2 text-2xl font-semibold text-white">{bmr.toLocaleString()} kcal</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.tdee}</p><p className="mt-2 text-2xl font-semibold text-white">{tdee.toLocaleString()} kcal</p></div>
                    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.daily}</p><p className="mt-2 text-2xl font-bold text-white">{daily.toLocaleString()} kcal</p></div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.macros}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3"><p className="text-xs text-neutral-400">{content.protein}</p><p className="mt-1 text-lg font-semibold text-emerald-300">{macros.p} g</p></div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3"><p className="text-xs text-neutral-400">{content.carbs}</p><p className="mt-1 text-lg font-semibold text-amber-300">{macros.c} g</p></div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3"><p className="text-xs text-neutral-400">{content.fat}</p><p className="mt-1 text-lg font-semibold text-cyan-300">{macros.f} g</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white">
              <h2 className="text-2xl">{content.articleTitle}</h2>
              <div dangerouslySetInnerHTML={{ __html: content.articleBody }} />
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
              <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Flame className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
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
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </a>
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
