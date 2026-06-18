import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BadgeDollarSign, Bone, BookOpen, Cat, Dog, Flower2, Globe2, Heart, PawPrint, Scale, Search, Sparkles } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

const COPY: Record<LocaleKey, {
  brand: string;
  collection: string;
  title: string;
  subtitle: string;
  heroNote: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHints: string[];
  adLabel: string;
  adNote: string;
  emergencyTitle: string;
  emergencySubtitle: string;
  emergencyBanner: string;
  careTitle: string;
  careSubtitle: string;
  funTitle: string;
  funSubtitle: string;
  backToMain: string;
  footer: string;
  searchFooter: string;
  faqTitle: string;
  breedsTitle: string;
  breedsSubtitle: string;
  browseBreeds: string;
  faqs: Array<{ q: string; a: string }>;
}> = {
  en: {
    brand: "TinyToolboxes for Pets",
    collection: "Pet care toolbox",
    title: "Quick answers for dog and cat parents",
    subtitle: "Calculate the chocolate dose, look up a food, convert pet age — all in one focused place.",
    heroNote: "Vet-informed maths. Not a replacement for a vet visit.",
    searchLabel: "Search pet tools",
    searchPlaceholder: "Try: chocolate, age, calorie, lily",
    searchHints: ["chocolate", "xylitol", "age", "calorie", "lily"],
    adLabel: "Advertisement",
    adNote: "Pet pages are kept clean — ads stay in defined slots.",
    emergencyTitle: "Emergency & toxicity",
    emergencySubtitle: "If your pet ate something they shouldn't have, check the risk here — then call your vet.",
    emergencyBanner: "If your pet shows symptoms, call your vet or a poison hotline now. These tools estimate risk, not diagnose.",
    careTitle: "Daily care",
    careSubtitle: "Feeding amounts, food safety lookups, and routine planning.",
    funTitle: "Fun & age",
    funSubtitle: "Convert your pet's age to human years using science-backed formulas.",
    breedsTitle: "Breed guides",
    breedsSubtitle: "Traits, health issues, weight, and temperament for 45 popular dog and cat breeds.",
    browseBreeds: "Browse all breeds →",
    backToMain: "All TinyToolboxes",
    footer: "TinyToolboxes for Pets",
    searchFooter: "Need a non-pet tool? Visit the main site.",
    faqTitle: "Pet owner FAQ",
    faqs: [
      { q: "Are these tools a substitute for a vet?", a: "No. They give you a quick risk estimate or a useful number, but anything urgent — toxicity exposure, lethargy, vomiting, breathing changes — needs a real vet, not a website." },
      { q: "Where do the formulas come from?", a: "Dog age uses the UCSD DNA-methylation formula. Pet calorie needs use the RER × activity multiplier from veterinary nutrition guidelines. Toxicity thresholds follow widely cited mg/kg values from the ASPCA and Pet Poison Helpline." },
      { q: "Do you store anything I type in?", a: "No. Every calculation runs in your browser. We don't have an account system and we don't log your pet's name or weight." },
      { q: "What if I get a 'severe risk' result?", a: "Treat it as urgent. Call your vet or a 24/7 pet poison hotline. Have the product label and your pet's weight ready." },
    ],
  },
  "zh-hk": {
    brand: "TinyToolboxes 寵物版",
    collection: "寵物照顧工具箱",
    title: "畀狗主貓主嘅快速答案",
    subtitle: "計朱古力劑量、查食物安全、轉換寵物年齡 — 全部喺呢一個專注嘅地方。",
    heroNote: "獸醫資料為基礎嘅計算，但唔代替睇獸醫。",
    searchLabel: "搜尋寵物工具",
    searchPlaceholder: "例如：朱古力、年齡、卡路里、百合",
    searchHints: ["朱古力", "木糖醇", "年齡", "卡路里", "百合"],
    adLabel: "Advertisement",
    adNote: "寵物頁面保持乾淨，廣告只放固定位置。",
    emergencyTitle: "緊急 & 中毒",
    emergencySubtitle: "如果你嘅寵物食錯嘢，喺呢度查風險 — 然後即刻打去獸醫。",
    emergencyBanner: "如果寵物已經出現症狀，立即聯絡獸醫或中毒熱線。呢啲工具係估算風險，唔係診斷。",
    careTitle: "日常護理",
    careSubtitle: "餵食份量、食物安全查詢、日常計劃。",
    funTitle: "趣味 & 年齡",
    funSubtitle: "用科學公式將寵物年齡換成人類年齡。",
    breedsTitle: "品種指南",
    breedsSubtitle: "45 個熱門狗貓品種嘅特質、健康問題、體重同性格。",
    browseBreeds: "瀏覽所有品種 →",
    backToMain: "返回主站",
    footer: "TinyToolboxes 寵物版",
    searchFooter: "想搵非寵物工具？返主站睇。",
    faqTitle: "寵物主常見問題",
    faqs: [
      { q: "呢啲工具可唔可以代替獸醫？", a: "唔可以。佢哋可以畀你一個快速嘅風險估算或實用數字，但任何緊急情況 — 中毒、無力、嘔吐、呼吸異常 — 都要見真正獸醫。" },
      { q: "啲公式邊度嚟？", a: "狗年齡用 UCSD DNA 甲基化公式；寵物卡路里需求用獸醫營養學嘅 RER × 活動指數；中毒門檻參考 ASPCA 同 Pet Poison Helpline 嘅 mg/kg 數值。" },
      { q: "你哋會唔會儲存我打嘅嘢？", a: "唔會。所有計算都喺你個瀏覽器入面跑，冇 account system，唔會記錄寵物名同體重。" },
      { q: "如果結果係「嚴重風險」我點做？", a: "當緊急處理。即刻打獸醫或 24 小時中毒熱線。準備好產品標籤同寵物嘅體重。" },
    ],
  },
  "zh-cn": {
    brand: "TinyToolboxes 宠物版",
    collection: "宠物照护工具箱",
    title: "给狗主猫主的快速答案",
    subtitle: "计算巧克力剂量、查食物安全、换算宠物年龄 — 全部集中在这一处。",
    heroNote: "基于兽医资料的计算，但不代替看兽医。",
    searchLabel: "搜索宠物工具",
    searchPlaceholder: "例如：巧克力、年龄、卡路里、百合",
    searchHints: ["巧克力", "木糖醇", "年龄", "卡路里", "百合"],
    adLabel: "Advertisement",
    adNote: "宠物页面保持干净，广告只放固定位置。",
    emergencyTitle: "紧急 & 中毒",
    emergencySubtitle: "如果宠物吃错东西，先在这里查风险 — 再立刻联系兽医。",
    emergencyBanner: "如果宠物已经出现症状，立刻联系兽医或中毒热线。这些工具只能估算风险，不能诊断。",
    careTitle: "日常护理",
    careSubtitle: "喂食份量、食物安全查询、日常计划。",
    funTitle: "趣味 & 年龄",
    funSubtitle: "用科学公式将宠物年龄换算为人类年龄。",
    breedsTitle: "品种指南",
    breedsSubtitle: "45 个热门狗猫品种的特质、健康问题、体重和性格。",
    browseBreeds: "浏览所有品种 →",
    backToMain: "返回主站",
    footer: "TinyToolboxes 宠物版",
    searchFooter: "想找非宠物工具？回主站看看。",
    faqTitle: "宠物主常见问题",
    faqs: [
      { q: "这些工具能代替兽医吗？", a: "不能。它们能给出快速风险估算或实用数字，但任何紧急情况 — 中毒、无力、呕吐、呼吸异常 — 都要看真正的兽医。" },
      { q: "公式来自哪里？", a: "狗年龄使用 UCSD DNA 甲基化公式；宠物卡路里需求使用兽医营养学的 RER × 活动系数；中毒阈值参考 ASPCA 和 Pet Poison Helpline 的 mg/kg 数值。" },
      { q: "会储存我输入的内容吗？", a: "不会。所有计算都在浏览器内进行，没有账户系统，也不记录宠物的名字和体重。" },
      { q: "如果结果显示「严重风险」怎么办？", a: "当作紧急处理。立刻联系兽医或 24 小时中毒热线。准备好产品标签和宠物的体重。" },
    ],
  },
  es: {
    brand: "TinyToolboxes para Mascotas",
    collection: "Caja de herramientas para mascotas",
    title: "Respuestas rápidas para dueños de perros y gatos",
    subtitle: "Calcula la dosis de chocolate, consulta un alimento, convierte la edad de tu mascota — todo en un solo lugar.",
    heroNote: "Cálculos basados en datos veterinarios. No sustituyen al veterinario.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: chocolate, edad, caloría, lirio",
    searchHints: ["chocolate", "xilitol", "edad", "caloría", "lirio"],
    adLabel: "Advertisement",
    adNote: "Mantenemos las páginas limpias — los anuncios quedan en zonas fijas.",
    emergencyTitle: "Emergencia y toxicidad",
    emergencySubtitle: "Si tu mascota comió algo que no debía, comprueba el riesgo aquí — y llama al veterinario.",
    emergencyBanner: "Si tu mascota muestra síntomas, llama ya al veterinario o a una línea de envenenamiento. Estas herramientas estiman riesgo, no diagnostican.",
    careTitle: "Cuidado diario",
    careSubtitle: "Cantidades de comida, búsqueda de seguridad alimentaria y planificación.",
    funTitle: "Edad y curiosidades",
    funSubtitle: "Convierte la edad de tu mascota a años humanos con fórmulas con base científica.",
    breedsTitle: "Guías de razas",
    breedsSubtitle: "Rasgos, problemas de salud, peso y temperamento de 45 razas populares de perros y gatos.",
    browseBreeds: "Ver todas las razas →",
    backToMain: "Volver al sitio principal",
    footer: "TinyToolboxes para Mascotas",
    searchFooter: "¿Necesitas otra herramienta? Visita el sitio principal.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Sustituyen al veterinario?", a: "No. Dan estimaciones rápidas, pero cualquier urgencia — intoxicación, letargo, vómitos, problemas respiratorios — requiere un veterinario real." },
      { q: "¿De dónde vienen las fórmulas?", a: "La edad del perro usa la fórmula de metilación de ADN de UCSD. Las calorías usan RER × multiplicador de actividad. Los umbrales de toxicidad siguen los valores en mg/kg de la ASPCA y Pet Poison Helpline." },
      { q: "¿Guardan lo que escribo?", a: "No. Todo se calcula en tu navegador. Sin cuentas, sin registros." },
      { q: "¿Y si sale «riesgo grave»?", a: "Trátalo como urgencia. Llama al veterinario o a una línea de envenenamiento 24/7. Ten a mano la etiqueta del producto y el peso de la mascota." },
    ],
  },
};

type PetTool = {
  group: "emergency" | "care" | "fun";
  title: Record<LocaleKey, string>;
  description: Record<LocaleKey, string>;
  href: string;
  icon: any;
  emoji: string;
};

const PET_TOOLS: PetTool[] = [
  { group: "emergency", title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose and risk level for dogs by chocolate type and weight.", "zh-hk": "根據朱古力種類同狗狗體重計算可可鹼劑量同風險。", "zh-cn": "根据巧克力种类和狗狗体重计算可可碱剂量和风险。", es: "Dosis de teobromina y nivel de riesgo para perros según tipo de chocolate y peso." }, href: "/chocolate-toxicity-calculator", icon: AlertTriangle, emoji: "🍫" },
  { group: "emergency", title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk from gum, sugar-free PB, and baked goods.", "zh-hk": "香口膠、無糖花生醬同烘焙食品中木糖醇嘅風險。", "zh-cn": "口香糖、无糖花生酱和烘焙食品中木糖醇的风险。", es: "Riesgo de xilitol por chicles, crema de cacahuete sin azúcar y productos horneados." }, href: "/xylitol-toxicity-calculator", icon: AlertTriangle, emoji: "🧪" },
  { group: "emergency", title: { en: "Lily Toxicity Checker for Cats", "zh-hk": "貓貓百合毒性檢查", "zh-cn": "猫咪百合毒性检查", es: "Verificador de toxicidad de lirios para gatos" }, description: { en: "Identify which lily species are deadly versus mild for cats.", "zh-hk": "辨別邊啲百合品種對貓致命、邊啲輕微。", "zh-cn": "辨别哪些百合品种对猫致命、哪些轻微。", es: "Identifica qué especies de lirios son mortales y cuáles son leves para los gatos." }, href: "/lily-toxicity-checker", icon: Flower2, emoji: "🌸" },
  { group: "care", title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie target for dogs and cats by weight and activity.", "zh-hk": "根據體重同活動量計算狗狗貓貓每日所需卡路里。", "zh-cn": "根据体重和活动量计算狗狗猫咪每日所需卡路里。", es: "Objetivo calórico diario para perros y gatos según peso y actividad." }, href: "/pet-calorie-calculator", icon: Bone, emoji: "🍖" },
  { group: "care", title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Yes / no / limit lookup for 50+ common human foods.", "zh-hk": "查詢 50+ 種常見人類食物對狗狗係安全定危險。", "zh-cn": "查询 50+ 种常见人类食物对狗狗是安全还是危险。", es: "Búsqueda sí / no / límite para más de 50 alimentos humanos comunes." }, href: "/can-my-dog-eat", icon: Dog, emoji: "🥑" },
  { group: "care", title: { en: "Can My Cat Eat This?", "zh-hk": "貓貓可以食咩？", "zh-cn": "猫咪能吃什么？", es: "¿Puede mi gato comer esto?" }, description: { en: "Yes / no / limit lookup for 50+ common human foods — cat-specific safety notes.", "zh-hk": "查詢 50+ 種常見人類食物對貓嘅安全性，附貓專屬說明。", "zh-cn": "查询 50+ 种常见人类食物对猫的安全性，附猫专属说明。", es: "Búsqueda sí / no / límite para más de 50 alimentos — notas de seguridad específicas para gatos." }, href: "/can-my-cat-eat", icon: Cat, emoji: "🐟" },
  { group: "care", title: { en: "Puppy Adult Weight Predictor", "zh-hk": "幼犬成年體重預測器", "zh-cn": "幼犬成年体重预测器", es: "Predictor de peso adulto del cachorro" }, description: { en: "Estimate puppy adult weight from age, current weight, and breed size.", "zh-hk": "根據週齡、現時體重同品種估算幼犬成年體重。", "zh-cn": "根据周龄、当前体重和品种估算幼犬成年体重。", es: "Estima el peso adulto desde la edad, peso actual y tamaño de raza." }, href: "/puppy-adult-weight-calculator", icon: PawPrint, emoji: "🐾" },
  { group: "care", title: { en: "Body Condition Score (BCS) Quiz", "zh-hk": "寵物體況評分（BCS）測驗", "zh-cn": "宠物体况评分（BCS）测验", es: "Quiz de Condición Corporal (BCS)" }, description: { en: "Vet-style visual quiz to score your pet on the 1–9 BCS scale.", "zh-hk": "獸醫式視覺測驗，喺 1–9 BCS 量表上評估你寵物。", "zh-cn": "兽医式视觉测验，在 1–9 BCS 量表上评估你的宠物。", es: "Quiz visual al estilo veterinario en la escala BCS 1–9." }, href: "/pet-body-condition-score", icon: Scale, emoji: "⚖️" },
  { group: "fun", title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD DNA-methylation formula, more accurate than the old 'multiply by 7'.", "zh-hk": "用 UCSD DNA 甲基化公式，比舊式「乘 7」更準確。", "zh-cn": "用 UCSD DNA 甲基化公式，比旧式「乘 7」更准确。", es: "Fórmula de metilación del ADN de UCSD, más precisa que el viejo 'multiplicar por 7'." }, href: "/dog-age-calculator", icon: Dog, emoji: "🐶" },
  { group: "fun", title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Feline life-stage chart based on AAFP/IOM guidelines.", "zh-hk": "根據 AAFP／IOM 貓科生命階段指引換算。", "zh-cn": "根据 AAFP／IOM 猫科生命阶段指引换算。", es: "Tabla de etapas de vida felina basada en las guías AAFP/IOM." }, href: "/cat-age-calculator", icon: Cat, emoji: "🐱" },
];

const SITE_URL = "https://pets.tinytoolboxes.com";

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
  prop("og:title", o.title); prop("og:description", o.description); prop("og:url", url); prop("og:type", "website"); prop("og:site_name", "TinyToolboxes for Pets");
  meta("twitter:card", "summary"); meta("twitter:title", o.title); meta("twitter:description", o.description);
  const old = head.querySelectorAll('script[type="application/ld+json"][data-ttb]');
  old.forEach((n) => n.remove());
  if (o.jsonLd) {
    const arr = Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd];
    arr.forEach((data) => { const s = document.createElement("script"); s.setAttribute("type", "application/ld+json"); s.setAttribute("data-ttb", ""); s.textContent = JSON.stringify(data); head.appendChild(s); });
  }
}

function Header({ locale, onLocaleChange, copy }: { locale: LocaleKey; onLocaleChange: (l: LocaleKey) => void; copy: typeof COPY[LocaleKey] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/10 bg-[#1a0e05]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-base text-stone-950 shadow-lg shadow-amber-900/40">
            <PawPrint className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-wide text-amber-50">{copy.brand}</span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-amber-200">Pets</span>
            </div>
            <p className="text-sm text-amber-100/55">Quick answers for cats & dogs.</p>
          </div>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          <a href="https://www.tinytoolboxes.com" className="rounded-full border border-amber-200/15 bg-amber-200/5 px-3 py-1 text-xs font-medium text-amber-100/70 transition hover:border-amber-300/40 hover:text-amber-50">
            {copy.backToMain}
          </a>
          {LOCALES.map((item) => (
            <button
              key={item.id}
              onClick={() => onLocaleChange(item.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-amber-300/60 bg-amber-300/15 text-amber-100" : "border-amber-200/10 bg-amber-200/5 text-amber-100/65 hover:border-amber-300/30 hover:text-amber-50"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function AdBlock({ title, note }: { title: string; note: string }) {
  return (
    <section className="rounded-3xl border border-dashed border-amber-200/10 bg-amber-200/5 p-5 text-sm text-amber-100/75">
      <div className="flex items-center gap-2 text-amber-200">
        <BadgeDollarSign className="h-4 w-4" />
        <span className="font-medium">{title}</span>
      </div>
      <p className="mt-2 text-amber-100/55">{note}</p>
      <div className="mt-4 min-h-[120px] rounded-2xl border border-amber-200/10 bg-black/30" />
    </section>
  );
}

function ToolCard({ tool, locale }: { tool: PetTool; locale: LocaleKey }) {
  const Icon = tool.icon;
  const isEmergency = tool.group === "emergency";
  return (
    <a
      href={tool.href}
      className={`group flex items-start gap-3 rounded-2xl border p-4 transition ${
        isEmergency
          ? "border-red-400/25 bg-red-400/5 hover:border-red-300/50 hover:bg-red-400/10"
          : "border-amber-200/15 bg-amber-200/5 hover:border-amber-300/40 hover:bg-amber-200/10"
      }`}
    >
      <div className={`rounded-xl p-2 text-xl ${isEmergency ? "bg-red-400/10" : "bg-amber-300/10"}`}>
        {tool.emoji}
      </div>
      <div className="min-w-0">
        <p className={`font-medium ${isEmergency ? "text-red-100" : "text-amber-50"}`}>{tool.title[locale]}</p>
        <p className="mt-1 text-sm text-amber-100/60">{tool.description[locale]}</p>
      </div>
      <ArrowRight className={`mt-1 h-4 w-4 shrink-0 ${isEmergency ? "text-red-300/60" : "text-amber-200/40"}`} />
    </a>
  );
}

function SearchBar({ copy, locale }: { copy: typeof COPY[LocaleKey]; locale: LocaleKey }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const filtered = PET_TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]}`.toLowerCase().includes(q));

  return (
    <section className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-amber-300">{copy.searchLabel}</p>
          <p className="mt-1 text-sm text-amber-100/60">{copy.searchFooter}</p>
        </div>
        <div className="text-xs text-amber-100/45">{copy.adLabel}</div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200/10 bg-black/30 px-4 py-3">
        <Search className="h-4 w-4 text-amber-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="w-full bg-transparent text-sm text-amber-50 outline-none placeholder:text-amber-100/35"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {copy.searchHints.map((hint) => (
          <button
            key={hint}
            onClick={() => setQuery(hint)}
            className="rounded-full border border-amber-200/10 bg-amber-200/5 px-3 py-1 text-xs text-amber-100/75 hover:border-amber-300/40 hover:bg-amber-300/10"
          >
            {hint}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {filtered.map((tool) => (
          <ToolCard key={tool.href} tool={tool} locale={locale} />
        ))}
      </div>
    </section>
  );
}

export default function PetsHome() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale");
    return (saved === "en" || saved === "zh-hk" || saved === "zh-cn" || saved === "es") ? saved : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const copy = COPY[locale];
    applySEO({
      title: `${copy.title} | TinyToolboxes for Pets`,
      description: copy.subtitle,
      path: "/",
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebSite", name: "TinyToolboxes for Pets", url: SITE_URL, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/?q={search_term_string}`, "query-input": "required name=search_term_string" } },
        { "@context": "https://schema.org", "@type": "ItemList", itemListElement: PET_TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title[locale], url: SITE_URL + t.href })) },
      ],
    });
  }, [locale]);

  const copy = COPY[locale];
  const emergency = useMemo(() => PET_TOOLS.filter((t) => t.group === "emergency"), []);
  const care = useMemo(() => PET_TOOLS.filter((t) => t.group === "care"), []);
  const fun = useMemo(() => PET_TOOLS.filter((t) => t.group === "fun"), []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3d2410_0%,#1a0e05_28%,#08040a_100%)] text-amber-50">
      <Header locale={locale} onLocaleChange={setLocale} copy={copy} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-5 shadow-2xl shadow-amber-950/40 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-amber-200">
            <Sparkles className="h-4 w-4" />
            <span>{copy.collection}</span>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-amber-100/75">{copy.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-amber-100/60">
            <span className="rounded-full border border-amber-200/10 bg-black/20 px-3 py-1">🐾 {copy.heroNote}</span>
            <span className="rounded-full border border-amber-200/10 bg-black/20 px-3 py-1">Free to use</span>
            <span className="rounded-full border border-amber-200/10 bg-black/20 px-3 py-1">No sign-up</span>
            <span className="rounded-full border border-amber-200/10 bg-black/20 px-3 py-1">EN · 繁 · 简 · ES</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <AdBlock title={copy.adLabel} note={copy.adNote} />

            {/* Emergency section */}
            <section className="rounded-3xl border border-red-400/20 bg-red-400/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="uppercase tracking-[0.18em]">{copy.emergencyTitle}</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-100/75">{copy.emergencySubtitle}</p>
              <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100/90">
                ⚠️ {copy.emergencyBanner}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {emergency.map((tool) => <ToolCard key={tool.href} tool={tool} locale={locale} />)}
              </div>
            </section>

            {/* Care section */}
            <section className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <Bone className="h-4 w-4" />
                <span className="uppercase tracking-[0.18em]">{copy.careTitle}</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-100/75">{copy.careSubtitle}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {care.map((tool) => <ToolCard key={tool.href} tool={tool} locale={locale} />)}
              </div>
            </section>

            {/* Fun & age section */}
            <section className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <Heart className="h-4 w-4" />
                <span className="uppercase tracking-[0.18em]">{copy.funTitle}</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-100/75">{copy.funSubtitle}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {fun.map((tool) => <ToolCard key={tool.href} tool={tool} locale={locale} />)}
              </div>
            </section>

            {/* Breed guides section */}
            <section className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <BookOpen className="h-4 w-4" />
                <span className="uppercase tracking-[0.18em]">{copy.breedsTitle}</span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-100/75">{copy.breedsSubtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-amber-100/60">
                {["🐕 Golden Retriever", "🐕 Labrador", "🐈 British Shorthair", "🐕 French Bulldog", "🐈 Maine Coon"].map((b) => (
                  <span key={b} className="rounded-full border border-amber-200/10 bg-black/20 px-3 py-1">{b}</span>
                ))}
              </div>
              <div className="mt-4">
                <a href="/breeds" className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-300/50 hover:bg-amber-300/20">
                  {copy.browseBreeds}
                </a>
              </div>
            </section>

            <SearchBar copy={copy} locale={locale} />

            {/* FAQ */}
            <article className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-6 text-amber-100/85 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <h2 className="text-2xl font-bold text-amber-50">{copy.faqTitle}</h2>
              <div className="mt-4 space-y-5">
                {copy.faqs.map((item) => (
                  <div key={item.q}>
                    <h3 className="font-semibold text-amber-50">{item.q}</h3>
                    <p className="mt-1 text-amber-100/70">{item.a}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-3xl border border-amber-200/10 bg-amber-200/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-300/10 p-3 text-amber-200"><Globe2 className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-50">{copy.searchLabel}</h2>
                  <p className="text-sm text-amber-100/60">{copy.searchFooter}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-amber-100/65">
                {copy.searchHints.map((hint) => (
                  <div key={hint} className="rounded-2xl border border-amber-200/10 bg-black/25 px-4 py-3">{hint}</div>
                ))}
              </div>
            </section>
            <AdBlock title={copy.adLabel} note={copy.adNote} />
          </aside>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/10 pt-6 text-sm text-amber-100/45">
          <span>{copy.footer}</span>
          <a href="https://www.tinytoolboxes.com" className="hover:text-amber-100/75">{copy.backToMain}</a>
        </footer>
      </section>
    </main>
  );
}
