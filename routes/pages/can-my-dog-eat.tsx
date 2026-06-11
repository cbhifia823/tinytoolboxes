import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Dog, Search, Check, X, AlertTriangle } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Can My Dog Eat This?",
    subtitle: "Quick lookup for 50+ common human foods — see which are safe, which are dangerous, and which need caution.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    yes: "Yes — Safe",
    no: "No — Dangerous",
    limit: "Limit — Caution",
    filterAll: "All",
    filterYes: "Safe ✓",
    filterNo: "Dangerous ✗",
    filterLimit: "Caution ⚠",
    searchLabel: "Search foods",
    searchPlaceholder: "Try: chocolate, grapes, onion, avocado, cheese",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "狗狗可以食咩？",
    subtitle: "快速查閱 50+ 種常見人類食物 — 睇下邊啲安全、邊啲有危險、邊啲要小心。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    yes: "可以 — 安全",
    no: "唔可以 — 危險",
    limit: "有限度 — 小心",
    filterAll: "全部",
    filterYes: "安全 ✓",
    filterNo: "危險 ✗",
    filterLimit: "小心 ⚠",
    searchLabel: "搜尋食物",
    searchPlaceholder: "例如：朱古力、提子、洋蔥、牛油果、芝士",
  },
  "zh-cn": {
    name: "简体中文",
    title: "狗狗能吃什么？",
    subtitle: "快速查阅 50+ 种常见人类食物 — 看看哪些安全、哪些危险、哪些要小心。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    yes: "可以 — 安全",
    no: "不可以 — 危险",
    limit: "有限 — 小心",
    filterAll: "全部",
    filterYes: "安全 ✓",
    filterNo: "危险 ✗",
    filterLimit: "小心 ⚠",
    searchLabel: "搜索食物",
    searchPlaceholder: "例如：巧克力、葡萄、洋葱、牛油果、奶酪",
  },
  es: {
    name: "Español",
    title: "¿Puede mi perro comer esto?",
    subtitle: "Consulta rápida de más de 50 alimentos comunes — descubre cuáles son seguros, peligrosos o requieren precaución.",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
    yes: "Sí — Seguro",
    no: "No — Peligroso",
    limit: "Límite — Precaución",
    filterAll: "Todos",
    filterYes: "Seguro ✓",
    filterNo: "Peligroso ✗",
    filterLimit: "Precaución ⚠",
    searchLabel: "Buscar alimentos",
    searchPlaceholder: "Prueba: chocolate, uvas, cebolla, aguacate, queso",
  },
};

const TOOLS = [
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs.", "zh-hk": "朱古力對狗嘅可可鹼劑量。", "zh-cn": "巧克力对狗的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate", "dog"] },
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk for dogs.", "zh-hk": "木糖醇對狗嘅風險。", "zh-cn": "木糖醇对狗的风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol", "dog"] },
  { title: { en: "Lily Toxicity Checker", "zh-hk": "貓貓百合毒性檢查器", "zh-cn": "猫咪百合毒性检查器", es: "Comprobador de toxicidad del lirio" }, description: { en: "Which lilies harm cats.", "zh-hk": "邊種百合對貓有害。", "zh-cn": "哪种百合对猫有害。", es: "Qué lirios dañan a los gatos." }, href: "/lily-toxicity-checker", keywords: ["lily", "cat"] },
  { title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie needs.", "zh-hk": "貓狗每日卡路里需求。", "zh-cn": "猫狗每日卡路里需求。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD age formula.", "zh-hk": "用 UCSD 公式計狗年齡。", "zh-cn": "用 UCSD 公式计算狗年龄。", es: "Fórmula UCSD de edad canina." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Cat age conversion.", "zh-hk": "貓年齡換算人類年齡。", "zh-cn": "猫年龄换算人类年龄。", es: "Conversión de edad felina." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

type Verdict = "yes" | "no" | "limit";

const FOODS: Array<{ id: string; verdict: Verdict; names: { en: string; "zh-hk": string; "zh-cn": string; es: string }; note: string; keywords: string[] }> = [
  { id: "chocolate", verdict: "no", names: { en: "Chocolate", "zh-hk": "朱古力", "zh-cn": "巧克力", es: "Chocolate" }, note: "Contains theobromine. Dark and baker's chocolate are most dangerous.", keywords: ["choc"] },
  { id: "grapes", verdict: "no", names: { en: "Grapes & Raisins", "zh-hk": "葡萄／提子", "zh-cn": "葡萄／葡萄干", es: "Uvas y pasas" }, note: "Can cause acute kidney failure even in tiny amounts. Mechanism is tartaric acid sensitivity.", keywords: ["raisin"] },
  { id: "onion", verdict: "no", names: { en: "Onions, Garlic, Leeks, Chives", "zh-hk": "洋蔥／蒜頭／韭蔥", "zh-cn": "洋葱／大蒜／韭葱", es: "Cebolla, ajo, puerro" }, note: "Allium family destroys red blood cells causing anemia. Cooked, raw, or powdered — all toxic.", keywords: ["garlic", "leek", "chive"] },
  { id: "xylitol", verdict: "no", names: { en: "Xylitol (sugar substitute)", "zh-hk": "木糖醇", "zh-cn": "木糖醇", es: "Xilitol" }, note: "Found in sugar-free gum, candy, peanut butter. Causes severe hypoglycemia and liver failure.", keywords: ["sugar-free"] },
  { id: "macadamia", verdict: "no", names: { en: "Macadamia Nuts", "zh-hk": "夏威夷果仁", "zh-cn": "夏威夷果", es: "Nueces de macadamia" }, note: "Causes weakness, vomiting, tremors, hyperthermia within 12 hours.", keywords: ["nut"] },
  { id: "avocado", verdict: "limit", names: { en: "Avocado", "zh-hk": "牛油果", "zh-cn": "牛油果", es: "Aguacate" }, note: "Flesh is generally safe in small amounts, but pit, skin, and leaves contain persin which is harmful.", keywords: [] },
  { id: "alcohol", verdict: "no", names: { en: "Alcohol", "zh-hk": "酒精", "zh-cn": "酒精", es: "Alcohol" }, note: "Even small amounts can cause vomiting, ataxia, coma, and death. Includes bread dough and fermented foods.", keywords: ["beer", "wine"] },
  { id: "coffee", verdict: "no", names: { en: "Coffee, Tea, Caffeine", "zh-hk": "咖啡／茶／咖啡因", "zh-cn": "咖啡／茶／咖啡因", es: "Café, té, cafeína" }, note: "Methylxanthines like in chocolate. Can cause tremors, seizures, cardiac issues.", keywords: ["tea", "caffeine"] },
  { id: "rawmeat", verdict: "limit", names: { en: "Raw Meat / Raw Eggs", "zh-hk": "生肉／生雞蛋", "zh-cn": "生肉／生鸡蛋", es: "Carne cruda / huevos crudos" }, note: "Risk of salmonella and E. coli. Discussion is ongoing among vets about raw diets — consult yours.", keywords: ["egg"] },
  { id: "bones", verdict: "limit", names: { en: "Cooked Bones", "zh-hk": "煮熟嘅骨頭", "zh-cn": "煮熟的骨头", es: "Huesos cocidos" }, note: "Cooked bones splinter and can puncture intestines. Raw recreational bones may be safer but choose carefully.", keywords: [] },
  { id: "saltyfood", verdict: "no", names: { en: "Excessive Salt", "zh-hk": "高鹽食物", "zh-cn": "高盐食物", es: "Sal en exceso" }, note: "Can cause sodium ion poisoning. Avoid chips, pretzels, salted popcorn.", keywords: ["chips"] },
  { id: "applecore", verdict: "limit", names: { en: "Apple (no seeds/core)", "zh-hk": "蘋果（去核）", "zh-cn": "苹果（去核）", es: "Manzana (sin semillas/cáscara)" }, note: "Flesh is safe. Seeds contain cyanide compounds and the core can choke.", keywords: ["apple"] },
  { id: "banana", verdict: "yes", names: { en: "Banana", "zh-hk": "香蕉", "zh-cn": "香蕉", es: "Plátano" }, note: "Safe in moderation. High in potassium and fiber but also sugar.", keywords: [] },
  { id: "blueberry", verdict: "yes", names: { en: "Blueberries", "zh-hk": "藍莓", "zh-cn": "蓝莓", es: "Arándanos" }, note: "Excellent antioxidant treat. Frozen blueberries make a great training treat.", keywords: ["berry"] },
  { id: "strawberry", verdict: "yes", names: { en: "Strawberries", "zh-hk": "士多啤梨", "zh-cn": "草莓", es: "Fresas" }, note: "Safe in moderation. High in fiber and vitamin C.", keywords: [] },
  { id: "watermelon", verdict: "yes", names: { en: "Watermelon (no seeds/rind)", "zh-hk": "西瓜（去籽去皮）", "zh-cn": "西瓜（去籽去皮）", es: "Sandía (sin semillas/cáscara)" }, note: "Hydrating summer treat. Remove seeds and rind to prevent intestinal blockage.", keywords: [] },
  { id: "carrot", verdict: "yes", names: { en: "Carrots", "zh-hk": "紅蘿蔔", "zh-cn": "胡萝卜", es: "Zanahorias" }, note: "Excellent low-calorie crunchy treat. Good for dental health.", keywords: [] },
  { id: "broccoli", verdict: "limit", names: { en: "Broccoli", "zh-hk": "西蘭花", "zh-cn": "西兰花", es: "Brócoli" }, note: "Small amounts are fine. Large amounts contain isothiocyanates that can cause gastric irritation.", keywords: [] },
  { id: "spinach", verdict: "limit", names: { en: "Spinach", "zh-hk": "菠菜", "zh-cn": "菠菜", es: "Espinaca" }, note: "Small amounts are fine. High oxalates may worsen kidney issues in some dogs.", keywords: [] },
  { id: "cucumber", verdict: "yes", names: { en: "Cucumber", "zh-hk": "青瓜", "zh-cn": "黄瓜", es: "Pepino" }, note: "Crunchy hydrating snack. Very low calorie.", keywords: [] },
  { id: "sweetpotato", verdict: "yes", names: { en: "Sweet Potato (cooked)", "zh-hk": "番薯（煮熟）", "zh-cn": "红薯（煮熟）", es: "Camote / batata (cocido)" }, note: "Cooked plain sweet potato is safe and nutritious. Never serve with butter or seasonings.", keywords: [] },
  { id: "potato", verdict: "limit", names: { en: "Potato (cooked, plain)", "zh-hk": "薯仔（煮熟）", "zh-cn": "土豆（煮熟）", es: "Papa (cocida)" }, note: "Plain cooked potato is fine. Raw potatoes and green skins contain solanine which is toxic.", keywords: [] },
  { id: "pumpkin", verdict: "yes", names: { en: "Pumpkin (plain, canned or cooked)", "zh-hk": "南瓜", "zh-cn": "南瓜", es: "Calabaza" }, note: "Excellent for digestion. Helps both diarrhea and constipation. Use plain — not pumpkin pie filling.", keywords: [] },
  { id: "rice", verdict: "yes", names: { en: "White Rice (cooked)", "zh-hk": "白飯", "zh-cn": "白米饭", es: "Arroz blanco cocido" }, note: "Bland and gentle. Often recommended for an upset stomach with boiled chicken.", keywords: [] },
  { id: "chicken", verdict: "yes", names: { en: "Cooked Chicken (boneless, skinless)", "zh-hk": "煮熟雞胸（去骨去皮）", "zh-cn": "煮熟鸡胸（去骨去皮）", es: "Pollo cocido (sin hueso/piel)" }, note: "Excellent lean protein. Always remove bones and cook fully.", keywords: [] },
  { id: "salmon", verdict: "yes", names: { en: "Salmon (cooked)", "zh-hk": "煮熟三文魚", "zh-cn": "煮熟三文鱼", es: "Salmón cocido" }, note: "Rich in omega-3. Never serve raw due to salmon poisoning disease risk in raw Pacific salmon.", keywords: ["fish"] },
  { id: "peanutbutter", verdict: "limit", names: { en: "Peanut Butter (xylitol-free)", "zh-hk": "花生醬（不含木糖醇）", "zh-cn": "花生酱（不含木糖醇）", es: "Mantequilla de maní (sin xilitol)" }, note: "Check the label every time. Many sugar-free / reduced-sugar brands now contain xylitol.", keywords: ["pb"] },
  { id: "cheese", verdict: "limit", names: { en: "Cheese", "zh-hk": "芝士", "zh-cn": "奶酪", es: "Queso" }, note: "Many dogs love it but high in fat. Lactose-intolerant dogs may have digestive upset.", keywords: [] },
  { id: "yogurt", verdict: "limit", names: { en: "Plain Yogurt (no sweeteners)", "zh-hk": "原味乳酪", "zh-cn": "原味酸奶", es: "Yogur natural" }, note: "Plain, unsweetened yogurt is safe in moderation. Avoid sugar-free varieties with xylitol.", keywords: [] },
  { id: "milk", verdict: "limit", names: { en: "Cow's Milk", "zh-hk": "牛奶", "zh-cn": "牛奶", es: "Leche de vaca" }, note: "Most adult dogs are lactose intolerant. Small amounts may be tolerated but can cause diarrhea.", keywords: [] },
  { id: "egg", verdict: "yes", names: { en: "Cooked Egg", "zh-hk": "煮熟雞蛋", "zh-cn": "熟鸡蛋", es: "Huevo cocido" }, note: "Excellent protein. Cook thoroughly to avoid biotin deficiency and salmonella from raw whites.", keywords: [] },
  { id: "popcorn", verdict: "limit", names: { en: "Popcorn (plain, air-popped)", "zh-hk": "爆谷（原味）", "zh-cn": "爆米花（原味）", es: "Palomitas (naturales)" }, note: "Plain air-popped popcorn is okay as an occasional treat. Avoid buttered or salted.", keywords: [] },
  { id: "bread", verdict: "limit", names: { en: "Bread (plain, baked)", "zh-hk": "麵包（原味）", "zh-cn": "面包（原味）", es: "Pan (simple)" }, note: "Plain baked bread is fine in small amounts. Never feed raw bread dough — yeast can be deadly.", keywords: [] },
  { id: "doughraw", verdict: "no", names: { en: "Raw Bread / Pizza Dough", "zh-hk": "生麵團", "zh-cn": "生面团", es: "Masa cruda" }, note: "Yeast ferments in the stomach producing alcohol and gas. Can cause bloat and ethanol poisoning.", keywords: ["yeast"] },
  { id: "almond", verdict: "limit", names: { en: "Almonds", "zh-hk": "杏仁", "zh-cn": "杏仁", es: "Almendras" }, note: "Not toxic but high fat and a choking hazard. Best avoided.", keywords: ["nut"] },
  { id: "walnut", verdict: "no", names: { en: "Walnuts", "zh-hk": "合桃", "zh-cn": "核桃", es: "Nueces" }, note: "Black walnuts and moldy English walnuts can cause neurological issues. Avoid all walnuts.", keywords: ["nut"] },
  { id: "cherries", verdict: "no", names: { en: "Cherries (pits/stems)", "zh-hk": "車厘子（核）", "zh-cn": "樱桃（核）", es: "Cerezas (huesos)" }, note: "Flesh okay but the pit, stem, and leaves contain cyanide compounds.", keywords: [] },
  { id: "tomato", verdict: "limit", names: { en: "Tomato (ripe only)", "zh-hk": "蕃茄（熟透）", "zh-cn": "番茄（熟透）", es: "Tomate (maduro)" }, note: "Ripe red tomato flesh is fine. Green tomatoes and the leaves contain solanine.", keywords: [] },
  { id: "mushroom", verdict: "limit", names: { en: "Mushroom (store-bought)", "zh-hk": "蘑菇（市售）", "zh-cn": "蘑菇（市售）", es: "Champiñón (de tienda)" }, note: "Store-bought white/portobello mushrooms are generally safe. Wild mushrooms can be lethal — never let your dog forage.", keywords: [] },
  { id: "celery", verdict: "yes", names: { en: "Celery", "zh-hk": "西芹", "zh-cn": "芹菜", es: "Apio" }, note: "Crunchy low-calorie treat. Cut into bite-sized pieces.", keywords: [] },
  { id: "pineapple", verdict: "limit", names: { en: "Pineapple", "zh-hk": "菠蘿", "zh-cn": "菠萝", es: "Piña" }, note: "Small amounts of fresh pineapple are safe. High sugar — limit servings.", keywords: [] },
  { id: "mango", verdict: "limit", names: { en: "Mango (no pit)", "zh-hk": "芒果（去核）", "zh-cn": "芒果（去核）", es: "Mango (sin hueso)" }, note: "Flesh is sweet and safe. The pit can choke and contains cyanide compounds.", keywords: [] },
  { id: "peach", verdict: "limit", names: { en: "Peach (no pit)", "zh-hk": "桃（去核）", "zh-cn": "桃（去核）", es: "Durazno (sin hueso)" }, note: "Flesh okay. The pit contains cyanide and is a choking hazard.", keywords: [] },
  { id: "orange", verdict: "limit", names: { en: "Orange (no peel/seeds)", "zh-hk": "橙（去皮去籽）", "zh-cn": "橙子（去皮去籽）", es: "Naranja (sin cáscara/semillas)" }, note: "Flesh is non-toxic but acidic — limit small amounts. Peel can cause GI upset.", keywords: [] },
  { id: "lemon", verdict: "no", names: { en: "Lemon / Lime", "zh-hk": "檸檬／青檸", "zh-cn": "柠檬／青柠", es: "Limón / lima" }, note: "Citric acid and essential oils can cause stomach upset and central nervous system depression.", keywords: ["lime"] },
  { id: "corn", verdict: "yes", names: { en: "Corn Kernels (no cob)", "zh-hk": "粟米粒（無芯）", "zh-cn": "玉米粒（无芯）", es: "Maíz desgranado (sin mazorca)" }, note: "Plain corn kernels are safe. Never give the cob — it causes intestinal blockage.", keywords: [] },
  { id: "edamame", verdict: "yes", names: { en: "Edamame", "zh-hk": "枝豆", "zh-cn": "毛豆", es: "Edamame" }, note: "Plain unsalted edamame in moderation is fine.", keywords: ["soy"] },
  { id: "honey", verdict: "limit", names: { en: "Honey", "zh-hk": "蜂蜜", "zh-cn": "蜂蜜", es: "Miel" }, note: "Small amounts okay for adult dogs. Not for puppies or diabetic dogs due to botulism / sugar.", keywords: [] },
  { id: "ice", verdict: "yes", names: { en: "Plain Ice Cubes", "zh-hk": "冰塊", "zh-cn": "冰块", es: "Cubos de hielo" }, note: "Safe and refreshing. The old myth that ice causes bloat is unfounded.", keywords: [] },
  { id: "icecream", verdict: "limit", names: { en: "Ice Cream", "zh-hk": "雪糕", "zh-cn": "冰淇淋", es: "Helado" }, note: "Dairy plus sugar plus possibly xylitol or chocolate. Look for dog-specific frozen treats instead.", keywords: [] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/can-my-dog-eat";

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

export default function CanMyDogEat() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Verdict>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOODS.filter((f) => {
      const matchesFilter = filter === "all" || f.verdict === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return f.names[locale].toLowerCase().includes(q) || f.names.en.toLowerCase().includes(q) || f.note.toLowerCase().includes(q) || f.keywords.some((k) => k.includes(q)) || f.id.includes(q);
    });
  }, [query, filter, locale]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["朱古力", "葡萄", "洋蔥", "香蕉"] : locale === "zh-cn" ? ["巧克力", "葡萄", "洋葱", "香蕉"] : ["chocolate", "grapes", "onion", "banana"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const verdictStyle = (v: Verdict) => v === "yes" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : v === "no" ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-amber-400/30 bg-amber-400/10 text-amber-200";
  const verdictIcon = (v: Verdict) => v === "yes" ? <Check className="h-4 w-4" /> : v === "no" ? <X className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  const verdictLabel = (v: Verdict) => v === "yes" ? content.yes : v === "no" ? content.no : content.limit;

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
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-amber-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="flex flex-wrap gap-2">
                {(["all", "yes", "limit", "no"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${filter === f ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"}`}>{f === "all" ? content.filterAll : f === "yes" ? content.filterYes : f === "limit" ? content.filterLimit : content.filterNo}</button>)}
              </div>
              <div className="grid gap-2">
                {results.map((f) => (
                  <div key={f.id} className={`rounded-2xl border p-4 ${verdictStyle(f.verdict)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{f.names[locale]}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">{verdictIcon(f.verdict)}{verdictLabel(f.verdict)}</span>
                    </div>
                    <p className="mt-1 text-sm opacity-85">{f.note}</p>
                  </div>
                ))}
                {!results.length && <p className="text-sm text-white/50">No matches. Try a different food name.</p>}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">Search tools</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-amber-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="chocolate, lily, calorie" className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-amber-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">Common Foods That Are Toxic to Dogs</h2>
                <p className="mt-3 leading-7">A surprising number of everyday human foods can harm dogs. The most well-known offenders are chocolate, grapes, raisins, onions, garlic, macadamia nuts, and xylitol — but the list keeps growing as research improves. Some toxins are dose-dependent and only matter in quantity, while others (like xylitol and grapes) can cause severe harm from a single small exposure.</p>
                <p className="mt-3 leading-7">The five foods that veterinary toxicology services rank as the most common causes of severe poisoning are: chocolate, xylitol-sweetened products, grapes/raisins, onions and the allium family, and rodenticides. Knowing what these look like at home — and where you keep them — is the simplest way to prevent emergencies.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Foods That Are Safe in Moderation</h2>
                <p className="mt-3 leading-7">Most fruits and vegetables that we eat without seasoning, salt, sugar, or fat are safe for dogs as occasional treats. Carrots, blueberries, plain pumpkin, plain cooked sweet potato, plain cooked chicken, and cooked plain egg are all popular training treats. The keyword is <em>plain</em> — once butter, oil, salt, garlic, or onion enter the picture, a safe food can become an unsafe one.</p>
                <p className="mt-3 leading-7">As a rule, treats should make up no more than 10% of your dog's daily caloric intake. The rest should come from a complete and balanced dog food. Treats given outside that 10% are the most common cause of slow, creeping weight gain in pet dogs.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">What to Do If Your Dog Eats Something Suspicious</h2>
                <p className="mt-3 leading-7">Stay calm and act quickly. Note exactly what was eaten, how much, and when. Take a photo of the packaging. Call your veterinarian or one of these 24/7 helplines first — do not induce vomiting unless told to by a professional, since some toxins (like batteries or sharp objects) make vomiting more dangerous than the original ingestion.</p>
                <p className="mt-3 leading-7"><strong className="text-white">ASPCA Animal Poison Control Center</strong>: (888) 426-4435 (US, $95 fee). <strong className="text-white">Pet Poison Helpline</strong>: (855) 764-7661 ($85 fee). Both keep a record number you can give your vet to share treatment recommendations.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div><h3 className="font-semibold text-white">My dog ate one grape — is that an emergency?</h3><p className="mt-1 text-white/70">Yes, call a vet. Grape toxicity is famously unpredictable — some dogs eat handfuls without issue, others develop kidney failure from a single grape. There is no known "safe dose" so all grape and raisin ingestion should be treated as potentially serious.</p></div>
                  <div><h3 className="font-semibold text-white">Why are onions and garlic toxic if they are in so many human foods?</h3><p className="mt-1 text-white/70">Onion, garlic, leeks, and chives contain N-propyl disulfide, which damages dog red blood cells and causes hemolytic anemia. The dose matters — a tiny amount in seasoning is usually not enough to cause symptoms — but cumulative exposure over time also adds up. It is safest to avoid sharing any seasoned human food.</p></div>
                  <div><h3 className="font-semibold text-white">Can puppies eat the same things as adult dogs?</h3><p className="mt-1 text-white/70">Generally yes, with smaller portion sizes and extra caution for choking hazards. Puppies are more sensitive to fat (pancreatitis risk) and sugar. They also bite into things harder and need pieces cut smaller. Some treats marketed as "puppy chews" can be too hard for milk teeth.</p></div>
                  <div><h3 className="font-semibold text-white">Is this list complete?</h3><p className="mt-1 text-white/70">No — this covers about 50 of the most commonly asked foods. There are many more. When in doubt, look it up in a reputable veterinary source (VeterinaryPartner, ASPCA, AKC) or call a poison helpline before letting your dog try something new.</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">Disclaimer:</strong> This list is a quick reference, not a substitute for veterinary advice. Individual dogs can have allergies, medical conditions, or sensitivities not covered here.</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Dog className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">Top toxic foods</h2><p className="text-sm text-amber-100/80">Memorize these.</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-red-400/30 bg-black/30 px-4 py-3">Chocolate · Grapes · Raisins</p>
              <p className="rounded-2xl border border-red-400/30 bg-black/30 px-4 py-3">Xylitol · Macadamia · Onion · Garlic</p>
              <p className="rounded-2xl border border-red-400/30 bg-black/30 px-4 py-3">Alcohol · Raw dough · Walnuts</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
