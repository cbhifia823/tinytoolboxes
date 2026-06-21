import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, Dog, Search } from "lucide-react";
import CHOCOLATE_CONTENT from "../data/chocolate-content.json";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Chocolate Toxicity Calculator for Dogs",
    subtitle: "Enter your dog's weight and the chocolate eaten to get a theobromine dose and risk assessment.",
    emergency: "Emergency Warning",
    emergencyNote: "This tool estimates theobromine dose based on average values. Individual dogs may react differently. Chocolate type and theobromine content can vary by brand. If your dog shows any symptoms (vomiting, restlessness, rapid heart rate, tremors), seek veterinary care immediately regardless of the calculated risk level.",
    weightLabel: "Your dog's weight",
    typeLabel: "Chocolate type eaten",
    amountLabel: "Amount eaten (estimate)",
    result: "Theobromine dose",
    risk: "Risk level",
    safe: "Safe — No significant risk",
    mild: "Mild — Monitor for symptoms",
    moderate: "Moderate — Call your vet",
    severe: "Severe — Seek emergency care",
    lifethreatening: "Life-threatening — Emergency vet NOW",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: xylitol, lily, calorie, food",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "狗狗朱古力毒性計算機",
    subtitle: "輸入狗狗體重同食咗嘅朱古力，計算可可鹼劑量同風險評估。",
    emergency: "緊急警告",
    emergencyNote: "呢個工具根據平均值估算可可鹼劑量。每隻狗反應唔同，朱古力種類同可可鹼含量因牌子而異。如果狗狗出現任何症狀（嘔吐、煩躁、心跳加速、顫抖），不論計算結果如何，都要立即帶去睇獸醫。",
    weightLabel: "狗狗體重",
    typeLabel: "食咗邊種朱古力",
    amountLabel: "食咗幾多（估算）",
    result: "可可鹼劑量",
    risk: "風險等級",
    safe: "安全 — 無明顯風險",
    mild: "輕微 — 留意症狀",
    moderate: "中等 — 打電話畀獸醫",
    severe: "嚴重 — 立即求醫",
    lifethreatening: "致命 — 立即去急診",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：木糖醇、百合、卡路里、食物",
  },
  "zh-cn": {
    name: "简体中文",
    title: "狗狗巧克力毒性计算器",
    subtitle: "输入狗狗体重和吃下的巧克力，计算可可碱剂量和风险评估。",
    emergency: "紧急警告",
    emergencyNote: "此工具根据平均值估算可可碱剂量。每只狗反应不同，巧克力种类和可可碱含量因品牌而异。如果狗狗出现任何症状（呕吐、烦躁、心跳加速、颤抖），不论计算结果如何，都应立即带去看兽医。",
    weightLabel: "狗狗体重",
    typeLabel: "吃下哪种巧克力",
    amountLabel: "吃了多少（估算）",
    result: "可可碱剂量",
    risk: "风险等级",
    safe: "安全 — 无明显风险",
    mild: "轻微 — 注意症状",
    moderate: "中等 — 致电兽医",
    severe: "严重 — 立即求医",
    lifethreatening: "致命 — 立即去急诊",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：木糖醇、百合、卡路里、食物",
  },
  es: {
    name: "Español",
    title: "Calculadora de toxicidad del chocolate para perros",
    subtitle: "Introduce el peso de tu perro y el chocolate ingerido para obtener la dosis de teobromina y el nivel de riesgo.",
    emergency: "Advertencia de emergencia",
    emergencyNote: "Esta herramienta estima la dosis de teobromina basándose en valores promedio. Cada perro puede reaccionar de manera diferente. El tipo de chocolate y el contenido de teobromina varían según la marca. Si tu perro muestra algún síntoma (vómitos, inquietud, ritmo cardíaco acelerado, temblores), busca atención veterinaria inmediata independientemente del nivel de riesgo calculado.",
    weightLabel: "Peso de tu perro",
    typeLabel: "Tipo de chocolate ingerido",
    amountLabel: "Cantidad ingerida (estimada)",
    result: "Dosis de teobromina",
    risk: "Nivel de riesgo",
    safe: "Seguro — Sin riesgo significativo",
    mild: "Leve — Vigilar síntomas",
    moderate: "Moderado — Llama al veterinario",
    severe: "Grave — Busca atención de emergencia",
    lifethreatening: "Peligro vital — Veterinario de urgencia YA",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: xilitol, lirio, calorías, comida",
  },
};

const TOOLS = [
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Check xylitol poisoning risk in dogs.", "zh-hk": "計狗狗食咗香口膠、糖果、花生醬嘅木糖醇風險。", "zh-cn": "计算狗狗吃口香糖、糖果、花生酱的木糖醇风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol", "dog", "toxic"] },
  { title: { en: "Lily Toxicity Checker", "zh-hk": "貓貓百合毒性檢查器", "zh-cn": "猫咪百合毒性检查器", es: "Comprobador de toxicidad del lirio" }, description: { en: "Look up which lilies are dangerous to cats.", "zh-hk": "查邊種百合對貓貓有毒。", "zh-cn": "查找对猫咪有毒的百合。", es: "Verificar qué lirios son peligrosos para gatos." }, href: "/lily-toxicity-checker", keywords: ["lily", "cat", "toxic"] },
  { title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie needs for dogs and cats.", "zh-hk": "計算狗狗同貓貓嘅每日熱量需求。", "zh-cn": "计算狗狗和猫咪的每日热量需求。", es: "Necesidades calóricas diarias para perros y gatos." }, href: "/pet-calorie-calculator", keywords: ["calorie", "rer", "feeding"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢個嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Puede mi perro comer esto?" }, description: { en: "Lookup safe and unsafe foods for dogs.", "zh-hk": "查閱狗狗可以食同唔可以食嘅食物。", "zh-cn": "查阅狗狗可以吃和不可以吃的食物。", es: "Consulta alimentos seguros e inseguros para perros." }, href: "/can-my-dog-eat", keywords: ["food", "dog", "safe"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算人類歲數", "zh-cn": "狗狗年龄换算人类岁数", es: "Edad del perro en años humanos" }, description: { en: "Convert your dog's age using the UCSD formula.", "zh-hk": "用 UCSD 公式換算狗狗年齡。", "zh-cn": "使用 UCSD 公式换算狗狗年龄。", es: "Convierte la edad de tu perro usando la fórmula UCSD." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算人類歲數", "zh-cn": "猫咪年龄换算人类岁数", es: "Edad del gato en años humanos" }, description: { en: "Convert your cat's age into human years.", "zh-hk": "將貓貓年齡換算為人類歲數。", "zh-cn": "将猫咪年龄换算为人类岁数。", es: "Convierte la edad de tu gato en años humanos." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
  { title: { en: "Puppy Adult Weight Predictor", "zh-hk": "狗BB成年體重預測器", "zh-cn": "狗宝宝成年体重预测器", es: "Predictor de peso adulto para cachorros" }, description: { en: "Estimate your puppy's adult weight.", "zh-hk": "估算你狗BB嘅成年體重。", "zh-cn": "估算你狗宝宝的成年体重。", es: "Estima el peso adulto de tu cachorro." }, href: "/puppy-weight-predictor", keywords: ["puppy", "weight"] },
];

const CHOCOLATE_TYPES = {
  white: { en: "White chocolate", "zh-hk": "白朱古力", "zh-cn": "白巧克力", es: "Chocolate blanco", mgPerGram: 0.009 },
  milk: { en: "Milk chocolate", "zh-hk": "牛奶朱古力", "zh-cn": "牛奶巧克力", es: "Chocolate con leche", mgPerGram: 2.0 },
  semisweet: { en: "Semi-sweet / dark", "zh-hk": "半甜／黑朱古力", "zh-cn": "半甜／黑巧克力", es: "Semidulce / negro", mgPerGram: 5.0 },
  baking: { en: "Baker's / unsweetened", "zh-hk": "烘焙朱古力", "zh-cn": "烘焙巧克力", es: "Chocolate de repostería", mgPerGram: 14.0 },
  cocoa: { en: "Cocoa powder", "zh-hk": "可可粉", "zh-cn": "可可粉", es: "Cacao en polvo", mgPerGram: 20.0 },
} as const;

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/chocolate-toxicity-calculator";

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

export default function ChocolateToxicityCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [weight, setWeight] = useState("10");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [chocType, setChocType] = useState<keyof typeof CHOCOLATE_TYPES>("milk");
  const [amount, setAmount] = useState("50");
  const [amountUnit, setAmountUnit] = useState<"g" | "oz">("g");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: L.title,
        url: SITE_URL + PAGE_PATH,
        description: L.subtitle,
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL },
      },
    });
  }, [locale]);

  const computation = useMemo(() => {
    const w = parseFloat(weight);
    const a = parseFloat(amount);
    if (isNaN(w) || isNaN(a) || w <= 0 || a <= 0) return null;
    const weightKg = weightUnit === "lb" ? w * 0.453592 : w;
    const amountG = amountUnit === "oz" ? a * 28.3495 : a;
    const totalTheobromine = amountG * CHOCOLATE_TYPES[chocType].mgPerGram;
    const dose = totalTheobromine / weightKg;
    let level: "safe" | "mild" | "moderate" | "severe" | "lifethreatening" = "safe";
    if (dose >= 100) level = "lifethreatening";
    else if (dose >= 60) level = "severe";
    else if (dose >= 40) level = "moderate";
    else if (dose >= 20) level = "mild";
    return { totalTheobromine, dose, level, weightKg, amountG };
  }, [weight, weightUnit, chocType, amount, amountUnit]);

  const content = LANGUAGES[locale];
  const artContent = CHOCOLATE_CONTENT[locale];
  const hints = locale === "zh-hk" ? ["木糖醇", "百合", "卡路里", "食物"] : locale === "zh-cn" ? ["木糖醇", "百合", "卡路里", "食物"] : ["xylitol", "lily", "calorie", "food"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const riskColor = computation?.level === "lifethreatening" ? "from-red-500 to-rose-600 text-white" : computation?.level === "severe" ? "from-orange-500 to-red-500 text-white" : computation?.level === "moderate" ? "from-amber-400 to-orange-500 text-neutral-900" : computation?.level === "mild" ? "from-yellow-300 to-amber-400 text-neutral-900" : "from-emerald-400 to-teal-500 text-neutral-900";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Dog className="h-5 w-5 text-amber-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">TinyToolboxes · Pet</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">

              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                <div className="flex items-center gap-2 font-semibold text-rose-200"><AlertTriangle className="h-4 w-4" />{content.emergency}</div>
                <p className="mt-2 leading-6 text-rose-100/85">{content.emergencyNote}</p>
                <p className="mt-2 text-xs text-rose-200/70">{artContent.emergencyPhoneText}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.weightLabel}</span>
                  <div className="flex gap-2">
                    <input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                    <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                      <button onClick={() => setWeightUnit("kg")} className={`rounded-xl px-3 py-1.5 text-sm transition ${weightUnit === "kg" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>kg</button>
                      <button onClick={() => setWeightUnit("lb")} className={`rounded-xl px-3 py-1.5 text-sm transition ${weightUnit === "lb" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>lb</button>
                    </div>
                  </div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.typeLabel}</span>
                  <select value={chocType} onChange={(e) => setChocType(e.target.value as keyof typeof CHOCOLATE_TYPES)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60">
                    {(Object.keys(CHOCOLATE_TYPES) as Array<keyof typeof CHOCOLATE_TYPES>).map((k) => <option key={k} value={k}>{CHOCOLATE_TYPES[k][locale]}</option>)}
                  </select>
                </label>
                <label className="block space-y-2 sm:col-span-2"><span className="text-sm text-neutral-300">{content.amountLabel}</span>
                  <div className="flex gap-2">
                    <input type="number" min="0" step="0.1" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                    <div className="flex rounded-2xl border border-white/10 bg-black/30 p-1">
                      <button onClick={() => setAmountUnit("g")} className={`rounded-xl px-3 py-1.5 text-sm transition ${amountUnit === "g" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>g</button>
                      <button onClick={() => setAmountUnit("oz")} className={`rounded-xl px-3 py-1.5 text-sm transition ${amountUnit === "oz" ? "bg-amber-400/15 text-amber-200" : "text-white/60"}`}>oz</button>
                    </div>
                  </div>
                </label>
              </div>
              {computation && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{artContent.theobromineLabel}</p><p className="mt-2 text-2xl font-semibold text-white">{computation.totalTheobromine.toFixed(0)} mg</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p><p className="mt-2 text-2xl font-semibold text-white">{computation.dose.toFixed(1)} <span className="text-sm text-white/60">mg/kg</span></p></div>
                    <div className={`rounded-2xl bg-gradient-to-br p-4 ${riskColor}`}><p className="text-xs uppercase tracking-[0.2em] opacity-80">{content.risk}</p><p className="mt-2 text-lg font-semibold">{content[computation.level]}</p></div>
                  </div>
                  <p className="text-xs text-white/45">{artContent.thresholdsText}</p>
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
                <h2 className="text-2xl font-bold text-white">{artContent.articleWhyTitle}</h2>
                <p className="mt-3 leading-7">{artContent.articleWhyText1}</p>
                <p className="mt-3 leading-7">{artContent.articleWhyText2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{artContent.articleTypesTitle}</h2>
                <ul className="mt-3 space-y-2 text-white/70">
                  {artContent.articleTypes.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{artContent.articleSignsTitle}</h2>
                <p className="mt-3 leading-7">{artContent.articleSignsText}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{artContent.faqSectionTitle}</h2>
                <div className="mt-4 space-y-5">
                  {artContent.faq.map(([q, a]: [string, string], i: number) => (
                    <div key={i}>
                      <h3 className="font-semibold text-white">{q}</h3>
                      <p className="mt-1 text-white/70">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85">
                <strong className="text-amber-200">Disclaimer:</strong> {artContent.disclaimerText}
              </div>
            </article>

          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Dog className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">{artContent.sidebarTitle}</h2><p className="text-sm text-amber-100/80">{artContent.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              {artContent.sidebarTips.map((tip: string, i: number) => (
                <p key={i} className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{tip}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
