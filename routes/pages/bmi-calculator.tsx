import { useEffect, useMemo, useState } from "react";
import { ArrowRight, HeartPulse, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
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
  faqTitle: string;
  faqs: { q: string; a: string }[];
}> = {
  en: {
    name: "English",
    title: "BMI Calculator",
    subtitle: "Calculate your Body Mass Index (BMI) and see whether you fall in the underweight, healthy, overweight, or obese range.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: calorie, mortgage, age, percent",
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
    suggestions: ["/calorie-calculator", "/percentage-calculator", "/unit-converter"],
    articleTitle: "How BMI Works and Its Limitations",
    articleBody: "Body Mass Index (BMI) is a simple measure that uses your height and weight to estimate your body composition. It is calculated as your weight in kilograms divided by the square of your height in metres (kg/m²). Because it is quick and needs no special equipment, BMI is widely used as a first-pass screening tool by clinicians, insurers, and fitness professionals. However, BMI is not a perfect measure: it does not account for muscle mass, bone density, or how fat is distributed around the body, so it can be misleading for athletes, pregnant people, the elderly, and very muscular individuals. Treat your BMI as a starting point for a conversation about your health rather than a diagnosis.",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "How is BMI calculated?", a: "BMI equals your weight in kilograms divided by the square of your height in metres (kg/m²). In imperial units, multiply your weight in pounds by 703, then divide by the square of your height in inches. For example, a person who is 1.70 m tall and weighs 65 kg has a BMI of 65 ÷ (1.70 × 1.70) = 22.5." },
      { q: "What is a healthy BMI range?", a: "Using the standard World Health Organization scale, a BMI below 18.5 is classed as underweight, 18.5–24.9 as a healthy weight, 25–29.9 as overweight, and 30 or above as obese. These ranges apply to most adults aged 20 and over, regardless of sex." },
      { q: "Why are there separate Asian BMI cut-offs?", a: "People of South and East Asian descent tend to develop higher body-fat percentages and greater health risk at lower BMIs. Many health authorities therefore use lower thresholds — overweight from 23 and obese from 27.5 — so that risk is flagged earlier. Toggle the Asian standard in the calculator to see how your classification changes." },
      { q: "Is BMI accurate for athletes and very muscular people?", a: "Not reliably. Because muscle is denser than fat, a lean, muscular person can have a 'high' BMI while carrying very little fat. For these individuals, measures such as waist circumference, body-fat percentage, or a waist-to-height ratio give a more accurate picture of health than BMI alone." },
      { q: "Can I use this calculator for children?", a: "No. BMI for children and teenagers is interpreted differently, using age- and sex-specific percentile charts rather than the fixed adult ranges. This tool is designed for adults aged 20 and over. For anyone younger, consult a paediatric BMI-for-age chart or a healthcare professional." },
    ],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "BMI 計算器",
    subtitle: "計算你嘅 BMI（身體質量指數），睇下屬於過輕、健康、超重定肥胖。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：卡路里、按揭、年齡、百分比",
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
    suggestions: ["/calorie-calculator", "/percentage-calculator", "/unit-converter"],
    articleTitle: "了解 BMI：呢個數字真正代表咩",
    articleBody: "身體質量指數（BMI）係一個簡單嘅指標，用你嘅身高同體重去估算你嘅體形。計法係體重（公斤）除以身高（米）嘅平方（kg/m²）。因為夠快又唔使特別儀器，所以醫護人員、保險公司同健身教練都會用 BMI 嚟做初步篩查。不過 BMI 唔係完美嘅測量方法，佢唔考慮肌肉量、骨頭密度或者體脂分布，所以對於運動員、孕婦、長者或者肌肉發達嘅人，BMI 可能會誤導。請將 BMI 當成了解健康嘅起點，而唔係診斷結果。",
    faqTitle: "常見問題",
    faqs: [
      { q: "BMI 點計？", a: "BMI 等於體重（公斤）除以身高（米）嘅平方（kg/m²）。例如身高 1.70 米、體重 65 公斤，BMI 就係 65 ÷（1.70 × 1.70）＝ 22.5。" },
      { q: "健康嘅 BMI 範圍係幾多？", a: "根據世界衞生組織（WHO）標準，BMI 低於 18.5 屬過輕，18.5–24.9 屬健康，25–29.9 屬超重，30 或以上屬肥胖。呢啲範圍適用於大部分 20 歲以上嘅成年人。" },
      { q: "點解會有亞洲人專用嘅 BMI 標準？", a: "南亞同東亞人種喺較低嘅 BMI 已經有較高體脂同健康風險，所以好多衞生機構會用較低門檻——23 開始算超重、27.5 開始算肥胖——令風險可以更早被發現。喺計算器揀「亞洲標準」就會睇到分類點變。" },
      { q: "BMI 對運動員或肌肉發達嘅人準唔準？", a: "唔太準。因為肌肉比脂肪重，肌肉發達嘅人可能 BMI 偏高但體脂其實好低。對呢類人嚟講，腰圍、體脂率或腰高比會比單睇 BMI 更能反映健康狀況。" },
      { q: "可唔可以用嚟計小朋友？", a: "唔可以。兒童同青少年嘅 BMI 要用按年齡同性別嘅百分位圖去解讀，唔係用固定嘅成人範圍。呢個工具係為 20 歲以上成年人而設；如果係細路，請參考兒童 BMI-for-age 圖表或諮詢醫護人員。" },
    ],
  },
  "zh-cn": {
    name: "简体中文",
    title: "BMI 计算器",
    subtitle: "计算你的 BMI（身体质量指数），看看属于偏瘦、健康、超重还是肥胖。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：卡路里、按揭、年龄、百分比",
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
    suggestions: ["/calorie-calculator", "/percentage-calculator", "/unit-converter"],
    articleTitle: "了解 BMI：这个数字真正代表什么",
    articleBody: "身体质量指数（BMI）是一个简单的指标，用你的身高和体重来估算你的体形。计算方法是体重（千克）除以身高（米）的平方（kg/m²）。因为它快速又不需要特殊仪器，医护人员、保险公司和健身教练都会用 BMI 做初步筛查。不过 BMI 并不是完美的测量方法，它不考虑肌肉量、骨密度或脂肪分布，所以对于运动员、孕妇、老年人或肌肉发达的人，BMI 可能会产生误导。请把 BMI 当作了解健康的起点，而不是诊断结果。",
    faqTitle: "常见问题",
    faqs: [
      { q: "BMI 怎么计算？", a: "BMI 等于体重（千克）除以身高（米）的平方（kg/m²）。例如身高 1.70 米、体重 65 千克，BMI 就是 65 ÷（1.70 × 1.70）＝ 22.5。" },
      { q: "健康的 BMI 范围是多少？", a: "根据世界卫生组织（WHO）标准，BMI 低于 18.5 属偏瘦，18.5–24.9 属健康，25–29.9 属超重，30 或以上属肥胖。这些范围适用于大多数 20 岁以上的成年人。" },
      { q: "为什么会有亚洲人专用的 BMI 标准？", a: "南亚和东亚人种在较低的 BMI 时就有较高的体脂和健康风险，所以很多卫生机构采用更低的门槛——23 起算超重、27.5 起算肥胖——让风险能更早被发现。在计算器中选择“亚洲标准”就能看到分类如何变化。" },
      { q: "BMI 对运动员或肌肉发达的人准确吗？", a: "不太准确。因为肌肉比脂肪重，肌肉发达的人可能 BMI 偏高但体脂其实很低。对这类人来说，腰围、体脂率或腰高比比单看 BMI 更能反映健康状况。" },
      { q: "可以用来计算儿童吗？", a: "不可以。儿童和青少年的 BMI 需要用按年龄和性别的百分位图来解读，而不是用固定的成人范围。本工具是为 20 岁以上成年人设计的；如果是儿童，请参考儿童 BMI-for-age 图表或咨询医护人员。" },
    ],
  },
  es: {
    name: "Español",
    title: "Calculadora de IMC",
    subtitle: "Calcula tu Índice de Masa Corporal (IMC) y descubre si estás bajo de peso, en peso saludable, con sobrepeso u obesidad.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: calorie, mortgage, age, percent",
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
    suggestions: ["/calorie-calculator", "/percentage-calculator", "/unit-converter"],
    articleTitle: "Entender el IMC: qué significa realmente el número",
    articleBody: "El Índice de Masa Corporal (IMC) es una medida simple que usa tu altura y peso para estimar tu composición corporal. Se calcula dividiendo tu peso en kilogramos por el cuadrado de tu altura en metros (kg/m²). Como es rápido y no requiere equipo especial, el IMC se usa ampliamente como herramienta de cribado inicial por parte de médicos, aseguradoras y profesionales del fitness. Sin embargo, el IMC no es una medida perfecta: no considera la masa muscular, la densidad ósea ni la distribución de la grasa, por lo que puede ser engañoso para atletas, embarazadas, personas mayores o muy musculadas. Trata tu IMC como un punto de partida para hablar de tu salud, no como un diagnóstico.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cómo se calcula el IMC?", a: "El IMC es tu peso en kilogramos dividido por el cuadrado de tu altura en metros (kg/m²). En unidades imperiales, multiplica tu peso en libras por 703 y divídelo por el cuadrado de tu altura en pulgadas. Por ejemplo, una persona de 1,70 m y 65 kg tiene un IMC de 65 ÷ (1,70 × 1,70) = 22,5." },
      { q: "¿Cuál es un rango de IMC saludable?", a: "Según la escala estándar de la Organización Mundial de la Salud, un IMC por debajo de 18,5 es bajo peso, de 18,5 a 24,9 es peso saludable, de 25 a 29,9 es sobrepeso y 30 o más es obesidad. Estos rangos se aplican a la mayoría de los adultos de 20 años o más." },
      { q: "¿Por qué existen cortes de IMC distintos para población asiática?", a: "Las personas de ascendencia del sur y este de Asia tienden a presentar mayor porcentaje de grasa y más riesgo a un IMC más bajo. Por eso muchas autoridades sanitarias usan umbrales menores —sobrepeso a partir de 23 y obesidad a partir de 27,5— para detectar el riesgo antes. Activa el estándar asiático en la calculadora para ver cómo cambia tu clasificación." },
      { q: "¿Es preciso el IMC para atletas y personas muy musculadas?", a: "No de forma fiable. Como el músculo pesa más que la grasa, una persona magra y musculada puede tener un IMC 'alto' con muy poca grasa. Para estos casos, medidas como el perímetro de cintura, el porcentaje de grasa corporal o la relación cintura-altura reflejan la salud mejor que el IMC por sí solo." },
      { q: "¿Puedo usar esta calculadora para niños?", a: "No. El IMC en niños y adolescentes se interpreta de forma diferente, con tablas de percentiles según edad y sexo en lugar de los rangos fijos de adultos. Esta herramienta está pensada para adultos de 20 años o más. Para menores, consulta una tabla de IMC por edad o a un profesional de la salud." },
    ],
  },
};

const TOOLS = [
  { title: { en: "Calorie Calculator", "zh-hk": "卡路里計算器", "zh-cn": "卡路里计算器", es: "Calculadora de calorías" }, description: { en: "Estimate daily calories with TDEE.", "zh-hk": "用 TDEE 估算每日卡路里需要。", "zh-cn": "用 TDEE 估算每日卡路里需要。", es: "Estima las calorías diarias con TDEE." }, href: "/calorie-calculator", keywords: ["calorie", "tdee"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Work out percentages of a number.", "zh-hk": "計一個數嘅百分比。", "zh-cn": "计算一个数的百分比。", es: "Calcula porcentajes de un número." }, href: "/percentage-calculator", keywords: ["percent"] },
  { title: { en: "Unit Converter", "zh-hk": "單位換算器", "zh-cn": "单位换算器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, and temperature.", "zh-hk": "換算長度、重量同溫度。", "zh-cn": "换算长度、重量和温度。", es: "Convierte longitud, peso y temperatura." }, href: "/unit-converter", keywords: ["convert"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate your exact age.", "zh-hk": "計你嘅準確年齡。", "zh-cn": "计算你的确切年龄。", es: "Calcula tu edad exacta." }, href: "/age-calculator", keywords: ["age"] },
  { title: { en: "Wheel Spinner", "zh-hk": "幸運轉盤", "zh-cn": "幸运转盘", es: "Ruleta aleatoria" }, description: { en: "Pick random names or options.", "zh-hk": "隨機抽名或選項。", "zh-cn": "随机抽取名字或选项。", es: "Elige nombres u opciones al azar." }, href: "/wheel-spinner", keywords: ["random"] },
  { title: { en: "Mortgage Calculator (Australia)", "zh-hk": "按揭計算器（澳洲）", "zh-cn": "房贷计算器（澳大利亚）", es: "Calculadora de hipoteca (Australia)" }, description: { en: "AU home loan repayments.", "zh-hk": "澳洲按揭還款。", "zh-cn": "澳大利亚房贷还款。", es: "Repagos de hipoteca en Australia." }, href: "/mortgage-calculator-australia", keywords: ["mortgage"] },
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
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: L.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ],
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
              <h2 className="text-2xl">{content.faqTitle}</h2>
              <div className="space-y-5">
                {content.faqs.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-white">{f.q}</h3>
                    <p className="mt-1 text-white/70">{f.a}</p>
                  </div>
                ))}
              </div>
            </article>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.slice(0, 5).map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
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
                {content.suggestions.map((href) => {
                  const match = TOOLS.find((t) => t.href === href);
                  if (!match) return null;
                  return (
                    <a key={href} href={match.href} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{match.title[locale]}</span><ArrowRight className="h-4 w-4 text-white/35" />
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
