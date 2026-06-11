import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, BadgeDollarSign, Dog, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Chocolate Toxicity Calculator for Dogs",
    subtitle: "Enter your dog's weight and the chocolate eaten to get a theobromine dose and risk assessment.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
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
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
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
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
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
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
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
  { title: "Pet Calorie Calculator (RER)", description: "Daily calorie needs for dogs and cats.", href: "/pet-calorie-calculator", keywords: ["calorie", "rer", "feeding"] },
  { title: "Can My Dog Eat This?", description: "Lookup safe and unsafe foods for dogs.", href: "/can-my-dog-eat", keywords: ["food", "dog", "safe"] },
  { title: "Dog Age in Human Years", description: "Convert your dog's age using the UCSD formula.", href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: "Cat Age in Human Years", description: "Convert your cat's age into human years.", href: "/cat-age-calculator", keywords: ["cat", "age"] },
  { title: "Puppy Adult Weight Predictor", description: "Estimate your puppy's adult weight.", href: "/puppy-weight-predictor", keywords: ["puppy", "weight"] },
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
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                <div className="flex items-center gap-2 font-semibold text-rose-200"><AlertTriangle className="h-4 w-4" />{content.emergency}</div>
                <p className="mt-2 leading-6 text-rose-100/85">{content.emergencyNote}</p>
                <p className="mt-2 text-xs text-rose-200/70">ASPCA Animal Poison Control: <span className="font-semibold">(888) 426-4435</span> · Pet Poison Helpline: <span className="font-semibold">(855) 764-7661</span></p>
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
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Theobromine</p><p className="mt-2 text-2xl font-semibold text-white">{computation.totalTheobromine.toFixed(0)} mg</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p><p className="mt-2 text-2xl font-semibold text-white">{computation.dose.toFixed(1)} <span className="text-sm text-white/60">mg/kg</span></p></div>
                    <div className={`rounded-2xl bg-gradient-to-br p-4 ${riskColor}`}><p className="text-xs uppercase tracking-[0.2em] opacity-80">{content.risk}</p><p className="mt-2 text-lg font-semibold">{content[computation.level]}</p></div>
                  </div>
                  <p className="text-xs text-white/45">Thresholds: &lt;20 mg/kg safe · 20-40 mild · 40-60 moderate · 60-100 severe · ≥100 mg/kg potentially fatal.</p>
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
                <h2 className="text-2xl font-bold text-white">Why Chocolate is Dangerous for Dogs</h2>
                <p className="mt-3 leading-7">Chocolate contains two methylxanthine compounds — theobromine and caffeine — that dogs metabolize far more slowly than humans do. While people clear theobromine from their bloodstream in 2–3 hours, dogs take roughly 17.5 hours to do the same, which allows the chemical to accumulate to toxic levels. Theobromine overstimulates the central nervous system, raises heart rate and blood pressure, and in severe cases can cause seizures, internal bleeding, and cardiac failure.</p>
                <p className="mt-3 leading-7">The toxic dose depends on three variables: the dog's body weight, the type of chocolate, and the amount eaten. Darker, more cocoa-rich products contain dramatically more theobromine per gram than milk or white chocolate. A single 100-gram bar of baking chocolate can be life-threatening for a 10 kg dog, while the same dog would need to eat several full-size milk chocolate bars to reach the same risk level.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Theobromine Content by Chocolate Type</h2>
                <p className="mt-3 leading-7">Approximate theobromine content used in this calculator (mg per gram of chocolate):</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li><strong className="text-white">White chocolate</strong> — about 0.009 mg/g. Effectively non-toxic for theobromine but the fat and sugar can still cause pancreatitis.</li>
                  <li><strong className="text-white">Milk chocolate</strong> — about 2 mg/g. A standard 43 g bar contains ~85 mg theobromine.</li>
                  <li><strong className="text-white">Semi-sweet / dark chocolate</strong> — about 5 mg/g. Includes most chocolate chips and dark bars.</li>
                  <li><strong className="text-white">Baker's / unsweetened chocolate</strong> — about 14 mg/g. The most dangerous common form.</li>
                  <li><strong className="text-white">Cocoa powder</strong> — about 20 mg/g. Even a small amount can be toxic to a small dog.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Signs of Chocolate Poisoning</h2>
                <p className="mt-3 leading-7">Symptoms can appear within 6–12 hours of ingestion and may last up to 72 hours. Common early signs include vomiting, diarrhea, restlessness, excessive panting, and increased thirst and urination. As toxicity progresses, dogs may show muscle tremors, an unusually fast heart rate, elevated body temperature, and seizures. Severe cases can lead to coma or sudden death from cardiac arrhythmia.</p>
                <p className="mt-3 leading-7">If your dog ate chocolate, do not wait for symptoms before calling a veterinarian. Early intervention — usually inducing vomiting and administering activated charcoal — is far more effective than treating symptoms once they appear.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div><h3 className="font-semibold text-white">My dog ate chocolate but the calculator says "safe" — should I still call the vet?</h3><p className="mt-1 text-white/70">Yes. This calculator is an estimate based on average theobromine concentrations, not a substitute for veterinary judgment. Individual chocolate products vary, dogs can have unusual sensitivities, and the fat and sugar in chocolate can cause pancreatitis even when theobromine is below the toxic threshold. A quick phone call to a vet or poison helpline costs nothing and gives you peace of mind.</p></div>
                  <div><h3 className="font-semibold text-white">What should I do right now if my dog just ate chocolate?</h3><p className="mt-1 text-white/70">First, identify what type of chocolate, when it was eaten, and roughly how much. Then call your veterinarian or a pet poison helpline immediately. If it has been less than 2 hours since ingestion, the vet may instruct you to induce vomiting at home with hydrogen peroxide — but only do this under direct veterinary guidance, as it can be dangerous if done incorrectly. Bring the wrapper or packaging to the vet if possible.</p></div>
                  <div><h3 className="font-semibold text-white">Are cats also at risk from chocolate?</h3><p className="mt-1 text-white/70">Yes, cats are actually more sensitive to theobromine than dogs on a per-kilogram basis. However, cats rarely eat chocolate because, unlike dogs, they cannot taste sweetness — they lack the sweet receptor gene. Cases of feline chocolate poisoning do occur and should be treated as a veterinary emergency.</p></div>
                  <div><h3 className="font-semibold text-white">Is there an antidote for theobromine?</h3><p className="mt-1 text-white/70">There is no specific antidote. Treatment is supportive: inducing vomiting if recently ingested, activated charcoal to bind remaining theobromine in the gut, IV fluids, anti-seizure medication if needed, and cardiac monitoring. The faster treatment begins, the better the outcome.</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of a licensed veterinarian with any questions about your pet's health.</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Dog className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">Pet emergencies</h2><p className="text-sm text-amber-100/80">Toxic exposure tools for pet owners.</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">When in doubt, call your veterinarian. Time matters.</p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">Save these phone numbers in your phone before an emergency happens.</p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">Keep chocolate, sugar-free candy, lilies, and other toxins out of reach.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
