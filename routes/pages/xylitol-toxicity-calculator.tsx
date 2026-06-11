import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, BadgeDollarSign, Dog, Search } from "lucide-react";
import articleData from "../data/xylitol-content.json";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Xylitol Toxicity Calculator for Dogs",
    subtitle: "Enter your dog's weight and the xylitol-containing product eaten to get a dose and risk assessment.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    emergency: "Emergency Warning",
    emergencyNote: "Xylitol is extremely toxic to dogs — far more than chocolate. Even a single piece of sugar-free gum can be fatal to a small dog. If your dog consumed xylitol, call your vet immediately. Do not wait for symptoms. Xylitol causes rapid insulin release leading to severe hypoglycemia (low blood sugar) within 10-60 minutes and can cause acute liver failure within 24-72 hours.",
    weightLabel: "Your dog's weight",
    productLabel: "Product eaten",
    amountLabel: "Quantity consumed",
    result: "Xylitol dose",
    risk: "Risk level",
    safe: "Safe — Negligible risk",
    hypo: "Hypoglycemia risk — Monitor closely",
    liver: "Liver damage risk — Seek veterinary care",
    severe: "Severe — Emergency vet NOW",
    timeMattersTitle: "Time Matters",
    timeMattersSubtitle: "Xylitol acts fast. Here's the timeline.",
    timeMatters: "Hypoglycemia can begin within 10-60 minutes. Liver damage can develop within 24-72 hours. Every minute counts.",
    articleWhyTitle: "Why Xylitol is So Dangerous",
    articleWhyText1: "Xylitol is a sugar alcohol used as a sweetener in sugar-free gum, candy, peanut butter, baked goods, and dental products. In humans, xylitol has little effect on insulin or blood sugar. In dogs, however, xylitol triggers a massive insulin release — up to 6 times the insulin surge from an equal amount of sugar — causing severe hypoglycemia within 10-60 minutes of ingestion.",
    articleWhyText2: "At higher doses, xylitol also causes acute liver failure through a mechanism not yet fully understood. The liver damage can be rapid and catastrophic, occurring 24-72 hours after ingestion, and is often fatal even with intensive veterinary care. Unlike chocolate, there is no 'safe' dose — even small amounts can be dangerous.",
    articleSignsTitle: "Signs of Xylitol Poisoning",
    articleSignsText: "Early signs include vomiting, weakness, lethargy, staggering, and collapse. As blood sugar crashes, dogs may develop seizures or coma. Signs of liver failure include jaundice (yellowing of gums and eyes), prolonged bleeding, and dark urine. If your dog ate xylitol, do not wait for symptoms before calling a veterinarian.",
    articleProductsTitle: "Common Products Containing Xylitol",
    articleProducts: "Sugar-free gum and mints (some brands contain 0.3-1.0g xylitol per piece), sugar-free peanut butter, sugar-free baked goods, some brands of toothpaste and mouthwash, chewable vitamins and supplements, nasal sprays, and pure xylitol powder sold for baking.",
    articleProductsNote: "Xylitol is also labeled as 'birch sugar', 'wood sugar', or E967 on ingredient lists.",
    disclaimerText: "This tool is for informational purposes only and is not a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of a licensed veterinarian with any questions about your pet's health.",
    faqSectionTitle: "Frequently Asked Questions",
    faq: [
      { q: "How much xylitol is dangerous?", a: "As little as 0.1 grams per kg of body weight can cause hypoglycemia. Liver failure can occur at 0.5 g/kg and above. For a 10 kg dog, this means 1 gram — roughly the amount in a single piece of sugar-free gum — can cause dangerously low blood sugar." },
      { q: "What should I do if my dog ate xylitol?", a: "Call your veterinarian or a pet poison helpline immediately. Do not induce vomiting unless a vet tells you to — xylitol can cause rapid onset of symptoms that make vomiting dangerous. Bring the product packaging to the vet if possible." },
      { q: "Can cats be affected by xylitol?", a: "Cats appear to be less sensitive to xylitol's insulin effects than dogs, but the data is limited. The safest approach is to treat any xylitol ingestion in cats as a medical emergency and contact a veterinarian." },
      { q: "How long does it take for symptoms to appear?", a: "Hypoglycemia: 10-60 minutes after ingestion. Liver failure: 24-72 hours. Early veterinary intervention within the first 1-2 hours can significantly improve outcomes." },
    ],
    searchLabel: "Search tools",
    searchPlaceholder: "Try: chocolate, lily, calorie, food",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "狗狗木糖醇毒性計算機",
    subtitle: "輸入狗狗體重同食咗嘅木糖醇產品，計算劑量同風險評估。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    emergency: "緊急警告",
    emergencyNote: "木糖醇對狗狗極度有毒 — 比朱古力更危險。一粒無糖口香糖就足以令細狗致命。如果狗狗食咗木糖醇，立即打去獸醫。唔好等症狀出現。木糖醇會快速釋放胰島素，10-60 分鐘內引發嚴重低血糖，24-72 小時內可能導致急性肝衰竭。",
    weightLabel: "狗狗體重",
    productLabel: "食咗嘅產品",
    amountLabel: "食咗幾多",
    result: "木糖醇劑量",
    risk: "風險等級",
    safe: "安全 — 風險可忽略",
    hypo: "低血糖風險 — 密切觀察",
    liver: "肝損傷風險 — 立即求醫",
    severe: "嚴重 — 立即去急診",
    timeMattersTitle: "時間關鍵",
    timeMattersSubtitle: "木糖醇作用好快。以下係時間線。",
    timeMatters: "低血糖可於 10-60 分鐘內出現。肝損傷可於 24-72 小時內發展。每分鐘都好重要。",
    articleWhyTitle: "點解木糖醇咁危險",
    articleWhyText1: "木糖醇係一種糖醇，用於無糖口香糖、糖果、花生醬、烘焙食品同牙科產品嘅甜味劑。對人類幾乎無影響，但對狗狗會引發大量胰島素釋放 — 高達同等糖分嘅 6 倍 — 10-60 分鐘內導致嚴重低血糖。",
    articleWhyText2: "高劑量下，木糖醇仲會透過尚未完全理解嘅機制引起急性肝衰竭。肝損傷可能喺 24-72 小時內迅速發生，即使有深切治療亦經常致命。同朱古力唔同，木糖醇冇「安全」劑量 — 即使少量都可能有危險。",
    articleSignsTitle: "木糖醇中毒症狀",
    articleSignsText: "早期症狀包括嘔吐、虛弱、嗜睡、步履不穩同暈倒。血糖急降時可能出現癲癇或昏迷。肝衰竭跡象包括黃疸（牙齦同眼白變黃）、出血時間延長同深色尿液。如果狗狗食咗木糖醇，唔好等症狀出現先打去獸醫。",
    articleProductsTitle: "含有木糖醇嘅常見產品",
    articleProducts: "無糖口香糖同薄荷糖（部分品牌每粒含 0.3-1.0g 木糖醇）、無糖花生醬、無糖烘焙食品、部分品牌嘅牙膏同漱口水、咀嚼維他命同補充劑、鼻噴劑、以及烘焙用純木糖醇粉。",
    articleProductsNote: "木糖醇亦會標示為「樺木糖」、「木糖」或 E967。",
    disclaimerText: "此工具僅供參考，不能取代專業獸醫建議、診斷或治療。如有寵物健康問題，請諮詢持牌獸醫。",
    faqSectionTitle: "常見問題",
    faq: [
      { q: "幾多木糖醇先有危險？", a: "每公斤體重 0.1 克就足以引起低血糖。每公斤 0.5 克以上可能導致肝衰竭。對一隻 10 kg 嘅狗，即係 1 克 — 大約一粒無糖口香糖嘅含量 — 就足以致命。" },
      { q: "狗狗食咗木糖醇我應該點做？", a: "立即打去獸醫或寵物中毒熱線。除非獸醫指示，唔好自行催吐 — 木糖醇可快速引發症狀，催吐可能好危險。如果可能，帶埋產品包裝去獸醫診所。" },
      { q: "貓會唔會受木糖醇影響？", a: "貓似乎對木糖醇嘅胰島素效應冇狗咁敏感，但數據有限。最安全嘅做法係將貓嘅任何木糖醇攝入當作醫療緊急情況處理。" },
      { q: "症狀幾耐之後出現？", a: "低血糖：攝入後 10-60 分鐘。肝衰竭：24-72 小時。喺頭 1-2 小時內盡早接受獸醫治療可以顯著改善結果。" },
    ],
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：朱古力、百合、卡路里、食物",
  },
  "zh-cn": {
    name: "简体中文",
    title: "狗狗木糖醇毒性计算器",
    subtitle: "输入狗狗体重和吃下的木糖醇产品，计算剂量和风险评估。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    emergency: "紧急警告",
    emergencyNote: "木糖醇对狗狗极度有毒 — 比巧克力更危险。一颗无糖口香糖就足以让小犬致命。如果狗狗吃了木糖醇，立即致电兽医。不要等出现症状。木糖醇会快速释放胰岛素，10-60 分钟内引发严重低血糖，24-72 小时内可能导致急性肝衰竭。",
    weightLabel: "狗狗体重",
    productLabel: "吃下的产品",
    amountLabel: "吃了多少",
    result: "木糖醇剂量",
    risk: "风险等级",
    safe: "安全 — 风险可忽略",
    hypo: "低血糖风险 — 密切观察",
    liver: "肝损伤风险 — 立即求医",
    severe: "严重 — 立即去急诊",
    timeMattersTitle: "时间关键",
    timeMattersSubtitle: "木糖醇作用很快。以下是时间线。",
    timeMatters: "低血糖可在 10-60 分钟内出现。肝损伤可在 24-72 小时内发展。每一分钟都很重要。",
    articleWhyTitle: "为什么木糖醇如此危险",
    articleWhyText1: "木糖醇是一种糖醇，用于无糖口香糖、糖果、花生酱、烘焙食品和牙科产品的甜味剂。对人类几乎无影响，但对狗狗会引发大量胰岛素释放 — 高达同等糖分的 6 倍 — 10-60 分钟内导致严重低血糖。",
    articleWhyText2: "高剂量下，木糖醇还会通过尚未完全理解的机制引起急性肝衰竭。肝损伤可能在 24-72 小时内迅速发生，即使有深切治疗也经常致命。与巧克力不同，木糖醇没有「安全」剂量 — 即使少量都可能有危险。",
    articleSignsTitle: "木糖醇中毒症状",
    articleSignsText: "早期症状包括呕吐、虚弱、嗜睡、步履不稳和晕倒。血糖急降时可能出现癫痫或昏迷。肝衰竭迹象包括黄疸（牙龈和眼白变黄）、出血时间延长和深色尿液。如果狗狗吃了木糖醇，不要等出现症状才致电兽医。",
    articleProductsTitle: "含有木糖醇的常见产品",
    articleProducts: "无糖口香糖和薄荷糖（部分品牌每粒含 0.3-1.0g 木糖醇）、无糖花生酱、无糖烘焙食品、部分品牌的牙膏和漱口水、咀嚼维生素和补充剂、鼻喷剂、以及烘焙用纯木糖醇粉。",
    articleProductsNote: "木糖醇也会标示为「桦木糖」、「木糖」或 E967。",
    disclaimerText: "此工具仅供参考，不能取代专业兽医建议、诊断或治疗。如有宠物健康问题，请咨询持牌兽医。",
    faqSectionTitle: "常见问题",
    faq: [
      { q: "多少木糖醇才有危险？", a: "每公斤体重 0.1 克就足以引起低血糖。每公斤 0.5 克以上可能导致肝衰竭。对一只 10 kg 的狗，即 1 克 — 大约一颗无糖口香糖的含量 — 就足以致命。" },
      { q: "狗狗吃了木糖醇我应该怎么做？", a: "立即致电兽医或宠物中毒热线。除非兽医指示，不要自行催吐 — 木糖醇可快速引发症状，催吐可能很危险。如果可能，带上产品包装去兽医诊所。" },
      { q: "猫会不会受木糖醇影响？", a: "猫似乎对木糖醇的胰岛素效应没有狗那么敏感，但数据有限。最安全的做法是将猫的任何木糖醇摄入当作医疗紧急情况处理。" },
      { q: "症状多久后出现？", a: "低血糖：摄入后 10-60 分钟。肝衰竭：24-72 小时。在头 1-2 小时内尽早接受兽医治疗可以显著改善结果。" },
    ],
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：巧克力、百合、卡路里、食物",
  },
  es: {
    name: "Español",
    title: "Calculadora de toxicidad del xilitol para perros",
    subtitle: "Introduce el peso de tu perro y el producto con xilitol ingerido para obtener la dosis y el nivel de riesgo.",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
    emergency: "Advertencia de emergencia",
    emergencyNote: "El xilitol es extremadamente tóxico para los perros — mucho más que el chocolate. Un solo chicle sin azúcar puede ser fatal para un perro pequeño. Si tu perro consumió xilitol, llama al veterinario inmediatamente. No esperes a los síntomas. El xilitol provoca liberación rápida de insulina con hipoglucemia grave en 10-60 minutos y puede causar insuficiencia hepática aguda en 24-72 horas.",
    weightLabel: "Peso de tu perro",
    productLabel: "Producto ingerido",
    amountLabel: "Cantidad consumida",
    result: "Dosis de xilitol",
    risk: "Nivel de riesgo",
    safe: "Seguro — Riesgo insignificante",
    hypo: "Riesgo de hipoglucemia — Vigilar de cerca",
    liver: "Riesgo de daño hepático — Busca atención veterinaria",
    severe: "Grave — Veterinario de urgencia YA",
    timeMattersTitle: "El tiempo importa",
    timeMattersSubtitle: "El xilitol actúa rápido. Aquí está la cronología.",
    timeMatters: "La hipoglucemia puede comenzar en 10-60 minutos. El daño hepático puede desarrollarse en 24-72 horas. Cada minuto cuenta.",
    articleWhyTitle: "Por qué el xilitol es tan peligroso",
    articleWhyText1: "El xilitol es un alcohol de azúcar usado como edulcorante en chicles sin azúcar, caramelos, mantequilla de maní, repostería y productos dentales. En humanos, el xilitol apenas afecta la insulina o el azúcar en sangre. En perros, sin embargo, desencadena una liberación masiva de insulina — hasta 6 veces la de una cantidad equivalente de azúcar — causando hipoglucemia grave en 10-60 minutos.",
    articleWhyText2: "En dosis más altas, el xilitol también causa insuficiencia hepática aguda por un mecanismo aún no completamente entendido. El daño hepático puede ser rápido y catastrófico, ocurriendo 24-72 horas después de la ingestión, y a menudo es fatal incluso con cuidados veterinarios intensivos. A diferencia del chocolate, no hay dosis 'segura' — incluso pequeñas cantidades pueden ser peligrosas.",
    articleSignsTitle: "Signos de intoxicación por xilitol",
    articleSignsText: "Los signos tempranos incluyen vómitos, debilidad, letargo, tambaleo y colapso. Al bajar el azúcar en sangre, los perros pueden desarrollar convulsiones o coma. Los signos de insuficiencia hepática incluyen ictericia (color amarillento de encías y ojos), sangrado prolongado y orina oscura. Si tu perro comió xilitol, no esperes a los síntomas para llamar al veterinario.",
    articleProductsTitle: "Productos comunes que contienen xilitol",
    articleProducts: "Chicles y mentas sin azúcar (algunas marcas contienen 0.3-1.0g de xilitol por unidad), mantequilla de maní sin azúcar, repostería sin azúcar, algunas marcas de pasta de dientes y enjuague bucal, vitaminas y suplementos masticables, aerosoles nasales, y xilitol puro en polvo para repostería.",
    articleProductsNote: "El xilitol también se etiqueta como 'azúcar de abedul', 'azúcar de madera' o E967.",
    disclaimerText: "Esta herramienta es solo para fines informativos y no sustituye el consejo, diagnóstico o tratamiento veterinario profesional. Consulta siempre a un veterinario colegiado ante cualquier duda sobre la salud de tu mascota.",
    faqSectionTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Qué cantidad de xilitol es peligrosa?", a: "Tan solo 0.1 gramos por kg de peso corporal puede causar hipoglucemia. La insuficiencia hepática puede ocurrir a partir de 0.5 g/kg. Para un perro de 10 kg, 1 gramo — aproximadamente un chicle sin azúcar — puede causar una bajada peligrosa de azúcar." },
      { q: "¿Qué hago si mi perro comió xilitol?", a: "Llama a tu veterinario o a una línea de envenenamiento animal inmediatamente. No provoques el vómito sin indicación veterinaria — el xilitol puede causar síntomas rápidos que hacen el vómito peligroso. Lleva el envase del producto al veterinario si es posible." },
      { q: "¿Afecta el xilitol a los gatos?", a: "Los gatos parecen ser menos sensibles a los efectos insulínicos del xilitol que los perros, pero los datos son limitados. Lo más seguro es tratar cualquier ingestión de xilitol en gatos como una emergencia médica." },
      { q: "¿Cuánto tardan en aparecer los síntomas?", a: "Hipoglucemia: 10-60 minutos tras la ingestión. Insuficiencia hepática: 24-72 horas. La intervención veterinaria temprana en las primeras 1-2 horas mejora significativamente el pronóstico." },
    ],
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: chocolate, lirio, calorías, comida",
  },
};

const TOOLS = [
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs by chocolate type.", "zh-hk": "計狗狗食咗唔同種類朱古力嘅可可鹼劑量。", "zh-cn": "计算狗狗吃不同种类巧克力的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate", "dog"] },
  { title: { en: "Lily Toxicity Checker", "zh-hk": "貓貓百合毒性檢查器", "zh-cn": "猫咪百合毒性检查器", es: "Comprobador de toxicidad del lirio" }, description: { en: "Look up which lilies are dangerous to cats.", "zh-hk": "查邊種百合對貓致命、邊種輕微。", "zh-cn": "查哪种百合对猫致命、哪种轻微。", es: "Qué lirios son mortales vs leves." }, href: "/lily-toxicity-checker", keywords: ["lily", "cat"] },
  { title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías (RER)" }, description: { en: "Daily calorie needs for dogs and cats.", "zh-hk": "計貓狗每日所需卡路里。", "zh-cn": "计算猫狗每日所需卡路里。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie", "rer", "feeding"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Lookup safe and unsafe foods for dogs.", "zh-hk": "查人類食物對狗安唔安全。", "zh-cn": "查人类食物对狗是否安全。", es: "Búsqueda de alimentos seguros." }, href: "/can-my-dog-eat", keywords: ["food", "dog", "safe"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "Convert your dog's age using the UCSD formula.", "zh-hk": "用 UCSD DNA 甲基化公式計狗年齡。", "zh-cn": "用 UCSD DNA 甲基化公式计算狗年龄。", es: "Convierte edad canina con fórmula UCSD." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Convert your cat's age into human years.", "zh-hk": "用貓科生命階段表計貓年齡。", "zh-cn": "用猫科生命阶段表计算猫年龄。", es: "Convierte edad felina a años humanos." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

const PRODUCTS = {
  gum_piece: { en: "Sugar-free gum (per piece)", "zh-hk": "無糖口香糖（每粒）", "zh-cn": "无糖口香糖（每粒）", es: "Chicle sin azúcar (por unidad)", mgPerUnit: 1000, unitLabel: "pieces" },
  mint: { en: "Sugar-free mint (per piece)", "zh-hk": "無糖薄荷糖（每粒）", "zh-cn": "无糖薄荷糖（每粒）", es: "Menta sin azúcar (por unidad)", mgPerUnit: 250, unitLabel: "pieces" },
  pb_tbsp: { en: "Xylitol peanut butter (per tbsp)", "zh-hk": "木糖醇花生醬（每湯匙）", "zh-cn": "木糖醇花生酱（每汤匙）", es: "Mantequilla de maní con xilitol (por cda)", mgPerUnit: 270, unitLabel: "tbsp" },
  candy: { en: "Sugar-free candy (per piece)", "zh-hk": "無糖糖果（每粒）", "zh-cn": "无糖糖果（每粒）", es: "Caramelo sin azúcar (por unidad)", mgPerUnit: 500, unitLabel: "pieces" },
  baked_g: { en: "Sugar-free baked goods (g)", "zh-hk": "無糖烘焙食品（克）", "zh-cn": "无糖烘焙食品（克）", es: "Repostería sin azúcar (g)", mgPerUnit: 80, unitLabel: "g" },
  powder_g: { en: "Pure xylitol powder (g)", "zh-hk": "純木糖醇粉（克）", "zh-cn": "纯木糖醇粉（克）", es: "Xilitol puro en polvo (g)", mgPerUnit: 1000, unitLabel: "g" },
} as const;

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/xylitol-toxicity-calculator";

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

export default function XylitolToxicityCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [weight, setWeight] = useState("10");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [product, setProduct] = useState<keyof typeof PRODUCTS>("gum_piece");
  const [amount, setAmount] = useState("2");
  const [search, setSearch] = useState("");

  const content = LANGUAGES[locale];
  const article = (articleData as any)[locale] || (articleData as any)["en"];

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const computation = useMemo(() => {
    const w = parseFloat(weight);
    const a2 = parseFloat(amount);
    if (isNaN(w) || isNaN(a2) || w <= 0 || a2 <= 0) return null;
    const weightKg = weightUnit === "lb" ? w * 0.453592 : w;
    const totalMg = a2 * PRODUCTS[product].mgPerUnit;
    const doseMgPerKg = totalMg / weightKg;
    const doseGPerKg = doseMgPerKg / 1000;
    let level: "safe" | "hypo" | "liver" | "severe" = "safe";
    if (doseGPerKg >= 1.0) level = "severe";
    else if (doseGPerKg >= 0.5) level = "liver";
    else if (doseGPerKg >= 0.1) level = "hypo";
    return { totalMg, doseMgPerKg, doseGPerKg, level, weightKg };
  }, [weight, weightUnit, product, amount]);

  const hints = locale === "zh-hk" ? ["朱古力", "百合", "卡路里", "食物"] : locale === "zh-cn" ? ["巧克力", "百合", "卡路里", "食物"] : ["chocolate", "lily", "calorie", "food"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const riskColor = computation?.level === "severe" ? "from-red-500 to-rose-600 text-white" : computation?.level === "liver" ? "from-orange-500 to-red-500 text-white" : computation?.level === "hypo" ? "from-amber-400 to-orange-500 text-neutral-900" : "from-emerald-400 to-teal-500 text-neutral-900";

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
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.productLabel}</span>
                  <select value={product} onChange={(e) => setProduct(e.target.value as keyof typeof PRODUCTS)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60">
                    {(Object.keys(PRODUCTS) as Array<keyof typeof PRODUCTS>).map((k) => <option key={k} value={k}>{PRODUCTS[k][locale]}</option>)}
                  </select>
                </label>
                <label className="block space-y-2 sm:col-span-2"><span className="text-sm text-neutral-300">{content.amountLabel} ({PRODUCTS[product].unitLabel})</span>
                  <input type="number" min="0" step="0.1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                </label>
              </div>
              {computation && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Total xylitol</p><p className="mt-2 text-2xl font-semibold text-white">{computation.totalMg.toFixed(0)} mg</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p><p className="mt-2 text-2xl font-semibold text-white">{computation.doseGPerKg.toFixed(2)} <span className="text-sm text-white/60">g/kg</span></p></div>
                    <div className={`rounded-2xl bg-gradient-to-br p-4 ${riskColor}`}><p className="text-xs uppercase tracking-[0.2em] opacity-80">{content.risk}</p><p className="mt-2 text-lg font-semibold">{content[computation.level]}</p></div>
                  </div>
                  <p className="text-xs text-white/45">Thresholds: 0.1 g/kg → hypoglycemia · 0.5 g/kg → liver failure · ≥1 g/kg → potentially fatal.</p>
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
                <h2 className="text-2xl font-bold text-white">{content.articleWhyTitle}</h2>
                <p className="mt-3 leading-7">{content.articleWhyText1}</p>
                <p className="mt-3 leading-7">{content.articleWhyText2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleProductsTitle}</h2>
                <p className="mt-3 leading-7 text-white/70">
                  {content.articleProducts}
                </p>
                <p className="mt-3 leading-7">{content.articleProductsNote}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleSignsTitle}</h2>
                <p className="mt-3 leading-7">{content.articleSignsText}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.faqSectionTitle}</h2>
                <div className="mt-4 space-y-5">
                  {content.faq.map((item) => <div key={item.q}><h3 className="font-semibold text-white">{item.q}</h3><p className="mt-1 text-white/70">{item.a}</p></div>)}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">Disclaimer:</strong> {content.disclaimerText}</div>
            </article>
            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>
          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Dog className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">{content.timeMattersTitle}</h2><p className="text-sm text-amber-100/80">{content.timeMattersSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{content.timeMatters}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
