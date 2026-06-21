import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Cat, Search, Check, X, AlertTriangle } from "lucide-react";
import ARTICLE_CONTENT from "../data/can-my-cat-eat-content.json";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Can My Cat Eat This?",
    subtitle: "Quick lookup for 50+ common human foods — see which are safe, which are dangerous, and which need caution.",
    yes: "Yes — Safe",
    no: "No — Dangerous",
    limit: "Limit — Caution",
    filterAll: "All",
    filterYes: "Safe ✓",
    filterNo: "Dangerous ✗",
    filterLimit: "Caution ⚠",
    searchLabel: "Search foods",
    searchPlaceholder: "Try: chocolate, onion, garlic, grapes, milk",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "貓貓可以食咩？",
    subtitle: "快速查閱 50+ 種常見人類食物 — 睇下邊啲安全、邊啲有危險、邊啲要小心。",
    yes: "可以 — 安全",
    no: "唔可以 — 危險",
    limit: "有限度 — 小心",
    filterAll: "全部",
    filterYes: "安全 ✓",
    filterNo: "危險 ✗",
    filterLimit: "小心 ⚠",
    searchLabel: "搜尋食物",
    searchPlaceholder: "例如：朱古力、洋蔥、蒜頭、提子、牛奶",
  },
  "zh-cn": {
    name: "简体中文",
    title: "猫咪能吃什么？",
    subtitle: "快速查阅 50+ 种常见人类食物 — 看看哪些安全、哪些危险、哪些要小心。",
    yes: "可以 — 安全",
    no: "不可以 — 危险",
    limit: "有限 — 小心",
    filterAll: "全部",
    filterYes: "安全 ✓",
    filterNo: "危险 ✗",
    filterLimit: "小心 ⚠",
    searchLabel: "搜索食物",
    searchPlaceholder: "例如：巧克力、洋葱、大蒜、葡萄、牛奶",
  },
  es: {
    name: "Español",
    title: "¿Puede mi gato comer esto?",
    subtitle: "Consulta rápida de más de 50 alimentos comunes — descubre cuáles son seguros, peligrosos o requieren precaución.",
    yes: "Sí — Seguro",
    no: "No — Peligroso",
    limit: "Límite — Precaución",
    filterAll: "Todos",
    filterYes: "Seguro ✓",
    filterNo: "Peligroso ✗",
    filterLimit: "Precaución ⚠",
    searchLabel: "Buscar alimentos",
    searchPlaceholder: "Prueba: chocolate, cebolla, ajo, uvas, leche",
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

const FOODS: Array<{ id: string; verdict: Verdict; names: { en: string; "zh-hk": string; "zh-cn": string; es: string }; note: { en: string; "zh-hk": string; "zh-cn": string; es: string }; keywords: string[] }> = [
  { id: "chocolate", verdict: "no", names: { en: "Chocolate", "zh-hk": "朱古力", "zh-cn": "巧克力", es: "Chocolate" }, note: { en: "Contains theobromine — cats are less likely to eat chocolate than dogs, but more sensitive per body weight. Dark and baker's chocolate are most dangerous. Even one lick of cocoa powder can be serious for a small cat.", "zh-hk": "【朱古力】含有可可鹼（theobromine）—— 貓比起狗冇咁易走去食朱古力，但係按體重計，貓對可可鹼嘅敏感度更高。黑朱古力同烘焙用朱古力最危險。對細隻貓嚟講，舔一舔可可粉都可能好大件事。", "zh-cn": "巧克力含有可可碱——猫比狗更不倾向吃巧克力，但按体重计算更敏感。黑巧克力和烘焙巧克力最危险。对小型猫来说，即使舔一下可可粉也可能造成严重后果。", es: "Chocolate: Contiene teobromina — los gatos tienen menos probabilidad de comer chocolate que los perros, pero son más sensibles por peso corporal. El chocolate negro y el de repostería son los más peligrosos. Incluso una lamida de cacao en polvo puede ser grave para un gato pequeño." }, keywords: ["choc"] },
  { id: "grapes", verdict: "no", names: { en: "Grapes & Raisins", "zh-hk": "葡萄／提子", "zh-cn": "葡萄／葡萄干", es: "Uvas y pasas" }, note: { en: "Grape toxicity in cats is less documented than in dogs, but cases of acute kidney injury in cats have been reported. Do not take the risk — keep all grapes and raisins away from cats.", "zh-hk": "【提子】提子對貓嘅毒性研究比起狗少好多，但係已經有貓食咗提子之後急性腎衰竭嘅案例報告。唔好博——所有提子同提子乾都要遠離貓。", "zh-cn": "葡萄对猫的毒性文献记录少于狗，但已有猫急性肾损伤的病例报告。不要冒险——所有葡萄和葡萄干都应远离猫。", es: "Uvas: La toxicidad de la uva en gatos está menos documentada que en perros, pero se han reportado casos de lesión renal aguda en gatos. No corra riesgos — mantenga todas las uvas y pasas alejadas de los gatos." }, keywords: ["raisin"] },
  { id: "onion", verdict: "no", names: { en: "Onions, Garlic, Leeks, Chives", "zh-hk": "洋蔥／蒜頭／韭蔥", "zh-cn": "洋葱／大蒜／韭葱", es: "Cebolla, ajo, puerro" }, note: { en: "Cats are 2–3× more sensitive to allium toxicity than dogs. Onion and garlic (cooked, raw, or powdered) destroy cat red blood cells. Even a teaspoon of onion powder can trigger hemolytic anemia in a cat.", "zh-hk": "【洋蔥】貓對蔥屬植物嘅毒性敏感度係狗嘅兩至三倍。洋蔥同大蒜（無論生食、煮熟定係粉狀）都會破壞貓嘅紅血球。一茶匙洋蔥粉已經足以引發貓嘅溶血性貧血。", "zh-cn": "猫对葱属植物毒性的敏感度是狗的2–3倍。洋葱和大蒜（无论煮熟、生食或粉末状）都会破坏猫的红细胞。即使一茶匙洋葱粉也可能引发猫的溶血性贫血。", es: "Cebolla: Los gatos son 2–3× más sensibles a la toxicidad por alium que los perros. La cebolla y el ajo (cocidos, crudos o en polvo) destruyen los glóbulos rojos felinos. Incluso una cucharadita de cebolla en polvo puede desencadenar anemia hemolítica en un gato." }, keywords: ["garlic", "leek", "chive"] },
  { id: "xylitol", verdict: "no", names: { en: "Xylitol (sugar substitute)", "zh-hk": "木糖醇", "zh-cn": "木糖醇", es: "Xilitol" }, note: { en: "Xylitol's effects on cats are less studied than dogs, but hypoglycemia and liver effects are possible. Given cats' small body size, even small exposures could be dangerous. Avoid all sugar-free products.", "zh-hk": "【木糖醇】木糖醇對貓嘅影響研究比狗少，但有機會引起低血糖同肝臟問題。考慮到貓嘅體型咁細，就算好少量都可能危險。所有無糖產品都要避開。", "zh-cn": "木糖醇对猫的影响研究少于狗，但可能导致低血糖和肝脏损伤。考虑到猫体型小，即使少量接触也可能危险。应避免所有无糖产品。", es: "Xilitol: Los efectos del xilitol en gatos están menos estudiados que en perros, pero son posibles la hipoglucemia y los efectos hepáticos. Dado el pequeño tamaño corporal de los gatos, incluso exposiciones mínimas podrían ser peligrosas. Evite todos los productos sin azúcar." }, keywords: ["sugar-free"] },
  { id: "macadamia", verdict: "no", names: { en: "Macadamia Nuts", "zh-hk": "夏威夷果仁", "zh-cn": "夏威夷果", es: "Nueces de macadamia" }, note: { en: "Macadamia nut toxicity is primarily documented in dogs; limited data in cats. However, the high fat content alone poses a pancreatitis risk. Best avoided entirely.", "zh-hk": "【夏威夷果仁】夏威夷果仁嘅毒性主要係喺狗身上有紀錄；貓嘅數據好有限。不過，就咁佢嘅高脂肪含量已經有引起胰臟炎嘅風險。最好完全唔好餵。", "zh-cn": "澳洲坚果毒性主要记录在狗身上；猫的数据有限。但仅高脂肪含量就构成胰腺炎风险。最好完全避免。", es: "Macadamia: La toxicidad de la nuez de macadamia está documentada principalmente en perros; datos limitados en gatos. Sin embargo, el alto contenido de grasa por sí solo representa un riesgo de pancreatitis. Es mejor evitarlas por completo." }, keywords: ["nut"] },
  { id: "avocado", verdict: "limit", names: { en: "Avocado", "zh-hk": "牛油果", "zh-cn": "牛油果", es: "Aguacate" }, note: { en: "Persin is primarily a risk for birds and large animals. The flesh is generally safe in tiny amounts, but the high fat content and pit make avocado an unnecessary risk for cats.", "zh-hk": "【牛油果】Persin 毒素主要對鳥類同大型動物有風險。果肉極少量一般安全，但高脂肪含量同果核令牛油果對貓嚟講係不必要嘅風險。", "zh-cn": "鳄梨中的Persin毒素主要对鸟类和大型动物构成风险。果肉极少量通常安全，但高脂肪含量和果核使鳄梨对猫来说是不必要的风险。", es: "Aguacate: La persina es un riesgo principalmente para aves y animales grandes. La pulpa generalmente es segura en cantidades ínfimas, pero el alto contenido de grasa y el hueso hacen del aguacate un riesgo innecesario para los gatos." }, keywords: [] },
  { id: "alcohol", verdict: "no", names: { en: "Alcohol", "zh-hk": "酒精", "zh-cn": "酒精", es: "Alcohol" }, note: { en: "Cats are even more susceptible to ethanol poisoning than dogs — their livers lack key detoxification enzymes. Raw bread dough, wine, beer, and even alcohol-based mouthwash can be fatal.", "zh-hk": "【酒精】貓比狗更加容易乙醇中毒——佢哋嘅肝臟缺乏關鍵嘅解毒酵素。生麵糰、紅酒、啤酒，甚至含酒精嘅漱口水都可以致命。", "zh-cn": "猫对乙醇中毒比狗更敏感——它们的肝脏缺乏关键的解毒酶。生面包面团、葡萄酒、啤酒，甚至含酒精的漱口水都可能致命。", es: "Alcohol: Los gatos son aún más susceptibles a la intoxicación por etanol que los perros — sus hígados carecen de enzimas clave de desintoxicación. La masa de pan cruda, el vino, la cerveza e incluso el enjuague bucal con alcohol pueden ser fatales." }, keywords: ["beer", "wine"] },
  { id: "coffee", verdict: "no", names: { en: "Coffee, Tea, Caffeine", "zh-hk": "咖啡／茶／咖啡因", "zh-cn": "咖啡／茶／咖啡因", es: "Café, té, cafeína" }, note: { en: "Methylxanthines (caffeine, theobromine) affect cats more severely per body weight. Even a few sips of coffee or tea can cause tremors, seizures, and cardiac arrhythmia in a cat.", "zh-hk": "【咖啡】甲基黃嘌呤（咖啡因、可可鹼）按體重計對貓嘅影響更嚴重。就算係幾啖咖啡或茶，都可以引起貓震顫、癲癇同心律不整。", "zh-cn": "甲基黄嘌呤（咖啡因、可可碱）按体重计算对猫的影响更严重。即使几口咖啡或茶也可能导致猫出现震颤、癫痫发作和心律失常。", es: "Café: Las metilxantinas (cafeína, teobromina) afectan a los gatos con mayor gravedad por peso corporal. Incluso unos pocos sorbos de café o té pueden causar temblores, convulsiones y arritmia cardíaca en un gato." }, keywords: ["tea", "caffeine"] },
  { id: "rawmeat", verdict: "limit", names: { en: "Raw Meat / Raw Eggs", "zh-hk": "生肉／生雞蛋", "zh-cn": "生肉／生鸡蛋", es: "Carne cruda / huevos crudos" }, note: { en: "Raw diets are controversial for cats, who are obligate carnivores. While some argue raw is 'natural,' commercial pet food is nutritionally balanced. Raw meat carries salmonella and E. coli risk — for both cat and owner.", "zh-hk": "【生肉】生食對貓呢啲專性食肉動物嚟講好有爭議。有人話生食「天然」，但商業寵物糧係營養均衡嘅。生肉帶有沙門氏菌同大腸桿菌風險——貓同主人都有機會中招。", "zh-cn": "生肉饮食对作为专性食肉动物的猫来说存在争议。虽然有人主张生食更「天然」，但商业宠物食品营养均衡。生肉带有沙门氏菌和大肠杆菌风险——对猫和主人都如此。", es: "Carne cruda: Las dietas crudas son controvertidas para los gatos, que son carnívoros obligados. Si bien algunos argumentan que lo crudo es 'natural,' el alimento comercial para mascotas es nutricionalmente equilibrado. La carne cruda conlleva riesgo de salmonela y E. coli — tanto para el gato como para el dueño." }, keywords: ["egg"] },
  { id: "bones", verdict: "limit", names: { en: "Cooked Bones", "zh-hk": "煮熟嘅骨頭", "zh-cn": "煮熟的骨头", es: "Huesos cocidos" }, note: { en: "Never give any cooked bones to cats — they splinter and can pierce the esophagus or intestines. Cats have smaller, narrower digestive tracts than dogs, making obstruction more dangerous.", "zh-hk": "【骨頭】千祈唔好畀任何煮熟嘅骨頭貓食——會碎裂同刺穿食道或腸道。貓嘅消化道比狗更窄更細，腸梗阻更加危險。", "zh-cn": "切勿给猫任何煮熟的骨头——它们会碎裂并可能刺穿食道或肠道。猫的消化道比狗更小更窄，梗阻更危险。", es: "Huesos: Nunca dé ningún hueso cocido a los gatos — se astillan y pueden perforar el esófago o los intestinos. Los gatos tienen tractos digestivos más pequeños y estrechos que los perros, lo que hace la obstrucción más peligrosa." }, keywords: [] },
  { id: "saltyfood", verdict: "no", names: { en: "Excessive Salt", "zh-hk": "高鹽食物", "zh-cn": "高盐食物", es: "Sal en exceso" }, note: { en: "Cats have a low thirst drive and are prone to dehydration. Excess salt worsens this and can cause sodium ion poisoning. Avoid chips, pretzels, and salted snacks entirely.", "zh-hk": "【鹹味食物】貓天生唔係好識飲水，好容易脫水。過多鹽分會令情況更差，仲可能引起鈉離子中毒。薯片、椒鹽脆餅同所有鹹味零食都要完全避開。", "zh-cn": "猫口渴驱动力低，容易脱水。过量盐分会加剧此问题，并可能导致钠离子中毒。应完全避免薯片、椒盐卷饼和咸味零食。", es: "Comida salada: Los gatos tienen poca sed y son propensos a la deshidratación. El exceso de sal agrava esto y puede causar intoxicación por iones de sodio. Evite por completo las papas fritas, pretzels y bocadillos salados." }, keywords: ["chips"] },
  { id: "applecore", verdict: "limit", names: { en: "Apple (no seeds/core)", "zh-hk": "蘋果（去核）", "zh-cn": "苹果（去核）", es: "Manzana (sin semillas/cáscara)" }, note: { en: "Apple flesh without seeds is safe in tiny amounts. Seeds contain cyanide compounds; the core is a choking risk for cats' small mouths. Most cats show little interest in fruit anyway.", "zh-hk": "【蘋果核】去核嘅蘋果肉極少量係安全嘅。蘋果核含有氰化物化合物；蘋果芯對貓嘅細嘴嚟講有哽噎風險。況且大多數貓對生果根本冇乜興趣。", "zh-cn": "无籽的苹果果肉极少量安全。种子含有氰化物；果核对猫的小嘴有窒息风险。大多数猫对水果本来就没什么兴趣。", es: "Corazón de manzana: La pulpa de manzana sin semillas es segura en cantidades ínfimas. Las semillas contienen compuestos de cianuro; el corazón representa un riesgo de asfixia para las bocas pequeñas de los gatos. La mayoría de los gatos muestran poco interés en la fruta de todos modos." }, keywords: ["apple"] },
  { id: "banana", verdict: "yes", names: { en: "Banana", "zh-hk": "香蕉", "zh-cn": "香蕉", es: "Plátano" }, note: { en: "Safe in tiny amounts but most cats ignore it. Cats lack sweet taste receptors and generally do not seek fruit. High sugar — limit to a pea-sized piece if offered at all.", "zh-hk": "【香蕉】極少量安全，但大多數貓睬都唔睬。貓缺乏甜味味蕾，一般唔會主動搵生果食。糖分高——就算要餵，都限一粒青豆咁大嘅份量。", "zh-cn": "极少量安全，但大多数猫会忽略。猫缺乏甜味受体，通常不追求水果。含糖量高——若要提供，限制在豌豆大小的一块。", es: "Plátano: Seguro en cantidades ínfimas pero la mayoría de los gatos lo ignoran. Los gatos carecen de receptores del sabor dulce y generalmente no buscan fruta. Alto en azúcar — limite a un trozo del tamaño de un guisante si lo ofrece." }, keywords: [] },
  { id: "blueberry", verdict: "yes", names: { en: "Blueberries", "zh-hk": "藍莓", "zh-cn": "蓝莓", es: "Arándanos" }, note: { en: "Safe as an occasional treat. Rich in antioxidants, but cats derive little nutritional benefit from plant foods. A single blueberry is a generous portion for a cat.", "zh-hk": "【藍莓】間中當零食係安全嘅。富含抗氧化物，但貓從植物性食物度吸收到嘅營養好有限。一粒藍莓對貓嚟講已經係好慷慨嘅份量。", "zh-cn": "作为偶尔的零食安全。富含抗氧化剂，但猫从植物性食物中获取的营养益处很少。一颗蓝莓对猫来说已是慷慨的份量。", es: "Arándano: Seguro como premio ocasional. Rico en antioxidantes, pero los gatos obtienen poco beneficio nutricional de los alimentos vegetales. Un solo arándano es una porción generosa para un gato." }, keywords: ["berry"] },
  { id: "strawberry", verdict: "yes", names: { en: "Strawberries", "zh-hk": "士多啤梨", "zh-cn": "草莓", es: "Fresas" }, note: { en: "Safe in tiny pieces. Cats lack sweet taste receptors and usually show no interest. High fiber and vitamin C but minimal feline nutritional value.", "zh-hk": "【士多啤梨】切成細細粒係安全嘅。貓缺乏甜味味蕾，通常完全冇興趣。高纖維同維他命C，但對貓嘅營養價值極低。", "zh-cn": "切成小块安全。猫缺乏甜味受体，通常不感兴趣。纤维和维生素C含量高，但对猫的营养价值极低。", es: "Fresa: Segura en trozos pequeños. Los gatos carecen de receptores del sabor dulce y generalmente no muestran interés. Alta en fibra y vitamina C pero con mínimo valor nutricional felino." }, keywords: [] },
  { id: "watermelon", verdict: "yes", names: { en: "Watermelon (no seeds/rind)", "zh-hk": "西瓜（去籽去皮）", "zh-cn": "西瓜（去籽去皮）", es: "Sandía (sin semillas/cáscara)" }, note: { en: "Safe in tiny seedless cubes. Hydrating but cats rarely drink water from food. Most cats ignore fruit. Remove all seeds and rind.", "zh-hk": "【西瓜】去籽切成細粒係安全嘅。有水分但貓好少會靠食物補水。大多數貓無視生果。一定要清走晒所有核同瓜皮。", "zh-cn": "无籽的小方块安全。可补水，但猫很少从食物中摄取水分。大多数猫会忽略水果。去除所有籽和瓜皮。", es: "Sandía: Segura en cubitos pequeños sin semillas. Hidratante pero los gatos rara vez beben agua de los alimentos. La mayoría de los gatos ignoran la fruta. Retire todas las semillas y la cáscara." }, keywords: [] },
  { id: "carrot", verdict: "yes", names: { en: "Carrots", "zh-hk": "紅蘿蔔", "zh-cn": "胡萝卜", es: "Zanahorias" }, note: { en: "Safe as a tiny cooked piece. Cats cannot convert beta-carotene to vitamin A efficiently. A small cooked carrot coin is fine as an occasional crunchy novelty — not a nutritional supplement.", "zh-hk": "【紅蘿蔔】煮熟切成細粒係安全嘅。貓唔能夠有效地將β-胡蘿蔔素轉化做維他命A。一粒細細嘅煮熟紅蘿蔔片，間中當脆脆新口味零食係OK嘅——但唔係營養補充品。", "zh-cn": "煮熟的小块安全。猫无法高效将β-胡萝卜素转化为维生素A。一小片煮熟的胡萝卜可作为偶尔的爽脆新奇零食——而非营养补充。", es: "Zanahoria: Segura como un pequeño trozo cocido. Los gatos no pueden convertir el betacaroteno en vitamina A de manera eficiente. Una pequeña moneda de zanahoria cocida está bien como novedad crujiente ocasional — no como suplemento nutricional." }, keywords: [] },
  { id: "broccoli", verdict: "limit", names: { en: "Broccoli", "zh-hk": "西蘭花", "zh-cn": "西兰花", es: "Brócoli" }, note: { en: "Small cooked florets are safe but most cats ignore vegetables. The isothiocyanates that irritate dogs in large amounts can also upset a cat's stomach. Keep portions tiny.", "zh-hk": "【西蘭花】細細粒煮熟嘅西蘭花係安全嘅，但大多數貓無視蔬菜。大份量會刺激狗嘅異硫氰酸鹽，同樣可以令貓腸胃唔舒服。份量一定要好少。", "zh-cn": "煮熟的小花蕾安全，但大多数猫会忽略蔬菜。大量食用时刺激狗的异硫氰酸酯也可能让猫胃部不适。份量要极少。", es: "Brócoli: Los floretes pequeños cocidos son seguros pero la mayoría de los gatos ignoran las verduras. Los isotiocianatos que irritan a los perros en grandes cantidades también pueden alterar el estómago de un gato. Mantenga las porciones mínimas." }, keywords: [] },
  { id: "spinach", verdict: "limit", names: { en: "Spinach", "zh-hk": "菠菜", "zh-cn": "菠菜", es: "Espinaca" }, note: { en: "Tiny amounts of cooked spinach are generally safe. However, cats with a history of urinary crystals or kidney issues should avoid spinach due to oxalate content.", "zh-hk": "【菠菜】極少量煮熟嘅菠菜一般都安全。不過，有尿結晶或腎病病史嘅貓應該避開菠菜，因為佢含有草酸鹽。", "zh-cn": "极少量的煮熟菠菜通常安全。但有尿结晶或肾脏病史的猫应避免菠菜，因其草酸盐含量。", es: "Espinaca: Cantidades ínfimas de espinaca cocida son generalmente seguras. Sin embargo, los gatos con antecedentes de cristales urinarios o problemas renales deben evitar la espinaca debido al contenido de oxalato." }, keywords: [] },
  { id: "cucumber", verdict: "yes", names: { en: "Cucumber", "zh-hk": "青瓜", "zh-cn": "黄瓜", es: "Pepino" }, note: { en: "Safe crunchy snack. Very low calorie. Some cats find cucumbers startling (viral videos aside) — the shape can trigger a startle response in cats fearful of snakes.", "zh-hk": "【青瓜】安全嘅爽脆零食。極低卡路里。有啲貓見到青瓜會嚇一跳（唔好盡信網上瘋傳嗰啲片）——青瓜嘅形狀可以觸發怕蛇嘅貓嘅驚嚇反應。", "zh-cn": "安全的爽脆零食。热量极低。有些猫会被黄瓜吓到（撇开爆红视频不谈）——其形状可能引发怕蛇猫的惊吓反应。", es: "Pepino: Bocadillo crujiente seguro. Muy bajo en calorías. Algunos gatos se asustan con los pepinos (más allá de los videos virales) — la forma puede desencadenar una respuesta de sobresalto en gatos que temen a las serpientes." }, keywords: [] },
  { id: "sweetpotato", verdict: "yes", names: { en: "Sweet Potato (cooked)", "zh-hk": "番薯（煮熟）", "zh-cn": "红薯（煮熟）", es: "Camote / batata (cocido)" }, note: { en: "Cooked plain sweet potato is safe in tiny amounts. Cats do not need carbohydrates; this is a treat, not a meal component. Never add butter or seasonings.", "zh-hk": "【番薯】煮熟嘅原味番薯，極少量係安全嘅。貓唔需要碳水化合物；呢個係零食，唔係正餐成分。千祈唔好加牛油或調味料。", "zh-cn": "煮熟的纯红薯极少量安全。猫不需要碳水化合物；这是零食，不是正餐组成部分。切勿添加黄油或调味料。", es: "Camote: El camote cocido simple es seguro en cantidades ínfimas. Los gatos no necesitan carbohidratos; esto es un premio, no un componente de comida. Nunca agregue mantequilla ni condimentos." }, keywords: [] },
  { id: "potato", verdict: "limit", names: { en: "Potato (cooked, plain)", "zh-hk": "薯仔（煮熟）", "zh-cn": "土豆（煮熟）", es: "Papa (cocida)" }, note: { en: "Plain cooked potato in tiny amounts is safe. Raw potato and green skins contain solanine which is toxic. Cats derive minimal nutrition from potato.", "zh-hk": "【薯仔】煮熟嘅原味薯仔，極少量係安全嘅。生薯仔同綠色薯皮含有龍葵鹼，係有毒嘅。貓從薯仔度吸收到嘅營養極少。", "zh-cn": "纯煮土豆极少量安全。生土豆和绿色表皮含有有毒的茄碱。猫从土豆中获取的营养极少。", es: "Papa: La papa cocida simple en cantidades ínfimas es segura. La papa cruda y las cáscaras verdes contienen solanina que es tóxica. Los gatos obtienen una nutrición mínima de la papa." }, keywords: [] },
  { id: "pumpkin", verdict: "yes", names: { en: "Pumpkin (plain, canned or cooked)", "zh-hk": "南瓜", "zh-cn": "南瓜", es: "Calabaza" }, note: { en: "Excellent for feline digestion — helps both diarrhea and constipation. Use 100% plain canned pumpkin (not pie filling). ½–1 teaspoon mixed into food is sufficient for most cats.", "zh-hk": "【南瓜】對貓嘅消化系統好有益——肚瀉同便秘都幫到手。用100%純罐頭南瓜（唔好買南瓜批餡料）。½至1茶匙撈入食物度，對大多數貓嚟講已經足夠。", "zh-cn": "对猫的消化极有益——可同时帮助腹泻和便秘。使用100%纯南瓜泥罐头（非派馅料）。½–1茶匙混入食物对大多数猫足够。", es: "Calabaza: Excelente para la digestión felina — ayuda tanto con la diarrea como con el estreñimiento. Use calabaza enlatada 100% natural (no relleno para pastel). ½–1 cucharadita mezclada con la comida es suficiente para la mayoría de los gatos." }, keywords: [] },
  { id: "rice", verdict: "yes", names: { en: "White Rice (cooked)", "zh-hk": "白飯", "zh-cn": "白米饭", es: "Arroz blanco cocido" }, note: { en: "Cooked plain white rice in tiny amounts is bland and gentle. Occasionally recommended for cats with digestive upset alongside boiled chicken. Not a nutritional staple for obligate carnivores.", "zh-hk": "【白飯】煮熟嘅原味白飯，極少量係清淡溫和嘅。有時會建議腸胃唔舒服嘅貓，配埋白烚雞肉一齊食。對專性食肉動物嚟講，白飯唔係營養主食。", "zh-cn": "煮熟的纯白米饭极少量温和柔顺。偶尔建议与煮鸡肉一起给消化不适的猫食用。对专性食肉动物来说并非营养主食。", es: "Arroz: El arroz blanco cocido simple en cantidades ínfimas es suave y ligero. Ocasionalmente recomendado para gatos con malestar digestivo junto con pollo hervido. No es un alimento básico nutricional para carnívoros obligados." }, keywords: [] },
  { id: "chicken", verdict: "yes", names: { en: "Cooked Chicken (boneless, skinless)", "zh-hk": "煮熟雞胸（去骨去皮）", "zh-cn": "煮熟鸡胸（去骨去皮）", es: "Pollo cocido (sin hueso/piel)" }, note: { en: "Excellent lean protein for cats — they are obligate carnivores. Always cook fully and remove all bones. Plain cooked chicken is one of the best training treats for cats.", "zh-hk": "【雞肉】對貓嚟講係極好嘅瘦蛋白來源——貓係專性食肉動物。一定要徹底煮熟同清走所有骨頭。原味白烚雞肉係訓練貓最好嘅獎勵零食之一。", "zh-cn": "猫的绝佳瘦蛋白来源——它们是专性食肉动物。务必完全煮熟并去除所有骨头。纯煮鸡肉是猫最好的训练奖励零食之一。", es: "Pollo: Excelente proteína magra para gatos — son carnívoros obligados. Cocine siempre completamente y retire todos los huesos. El pollo cocido simple es uno de los mejores premios de entrenamiento para gatos." }, keywords: [] },
  { id: "salmon", verdict: "yes", names: { en: "Salmon (cooked)", "zh-hk": "煮熟三文魚", "zh-cn": "煮熟三文鱼", es: "Salmón cocido" }, note: { en: "Cooked salmon is a feline favorite and rich in omega-3s. Never feed raw Pacific salmon — the bacteria Neorickettsia helminthoeca can be fatal. Limit to occasional treats due to high fat.", "zh-hk": "煮熟嘅三文魚係貓咪最愛，富含Omega-3脂肪酸。千祈唔好餵生嘅太平洋三文魚——Neorickettsia helminthoeca 呢種細菌可以致命。因為脂肪含量高，只可以間中當零食俾少少。", "zh-cn": "【三文鱼】煮熟的三文鱼是猫咪的最爱，富含Omega-3脂肪酸。切勿喂食生的大西洋鲑鱼——体内的蠕虫新立克次体（Neorickettsia helminthoeca）可致命。因脂肪含量高，仅限偶尔作为零食。", es: "El salmón cocido es un favorito felino y rico en omega-3. Nunca alimentes con salmón crudo del Pacífico — la bacteria Neorickettsia helminthoeca puede ser fatal. Limítalo a premios ocasionales por su alto contenido en grasa." }, keywords: ["fish"] },
  { id: "peanutbutter", verdict: "limit", names: { en: "Peanut Butter (xylitol-free)", "zh-hk": "花生醬（不含木糖醇）", "zh-cn": "花生酱（不含木糖醇）", es: "Mantequilla de maní (sin xilitol)" }, note: { en: "Most cats show zero interest in peanut butter. If offered, check for xylitol first. The sticky texture can be a choking hazard for cats and it provides no feline nutritional benefit.", "zh-hk": "大部分貓對花生醬完全冇興趣。如果要俾，一定要先檢查有冇木糖醇（xylitol）。花生醬黏性高，對貓嚟講有哽噎風險，而且對貓科動物完全冇營養價值。", "zh-cn": "【花生酱】大多数猫对花生酱毫无兴趣。若要喂食，须先检查是否含木糖醇。其黏稠质地可能造成猫咪窒息风险，且对猫无任何营养益处。", es: "A la mayoría de los gatos no les interesa en absoluto la mantequilla de cacahuete. Si se la ofreces, revisa primero que no contenga xilitol. Su textura pegajosa puede ser un peligro de asfixia para los gatos y no aporta ningún beneficio nutricional felino." }, keywords: ["pb"] },
  { id: "cheese", verdict: "limit", names: { en: "Cheese", "zh-hk": "芝士", "zh-cn": "奶酪", es: "Queso" }, note: { en: "Most adult cats are lactose intolerant. Tiny amounts of hard cheese may be tolerated. Soft cheeses and large portions can cause diarrhea. Not a recommended treat.", "zh-hk": "大部分成年貓都有乳糖不耐症。極少量嘅硬芝士可能冇問題，但軟芝士同大量食用會引致肚屙。唔建議當零食餵。", "zh-cn": "【芝士】大多数成年猫乳糖不耐受。极少量的硬质芝士或许可以耐受。软芝士及大量喂食可能导致腹泻。不建议作为零食。", es: "La mayoría de los gatos adultos son intolerantes a la lactosa. Cantidades minúsculas de queso curado pueden tolerarse. Los quesos blandos y las porciones grandes pueden causar diarrea. No es un premio recomendado." }, keywords: [] },
  { id: "yogurt", verdict: "limit", names: { en: "Plain Yogurt (no sweeteners)", "zh-hk": "原味乳酪", "zh-cn": "原味酸奶", es: "Yogur natural" }, note: { en: "Plain unsweetened yogurt in tiny amounts. Most adult cats are lactose intolerant. Avoid anything with artificial sweeteners. Probiotic benefit for cats is unproven.", "zh-hk": "原味無糖乳酪可以俾極少量。大部分成年貓都有乳糖不耐症。避免任何含人工甜味劑嘅產品。對貓嘅益生菌功效未有科學證實。", "zh-cn": "【酸奶】极少量原味无糖酸奶。大多数成年猫乳糖不耐受。避免任何含人造甜味剂的产品。酸奶对猫的益生菌功效尚未证验。", es: "Yogur natural sin azúcar en cantidades minúsculas. La mayoría de los gatos adultos son intolerantes a la lactosa. Evita cualquier producto con edulcorantes artificiales. El beneficio probiótico para gatos no está comprobado." }, keywords: [] },
  { id: "milk", verdict: "limit", names: { en: "Cow's Milk", "zh-hk": "牛奶", "zh-cn": "牛奶", es: "Leche de vaca" }, note: { en: "Contrary to popular culture, most adult cats are lactose intolerant. Cow's milk causes diarrhea and digestive upset. Special 'cat milk' products are lactose-free — use those instead.", "zh-hk": "同流行文化相反，大部分成年貓都有乳糖不耐症。牛奶會引致肚屙同消化不良。市面上有專俾貓飲嘅「貓奶」產品係無乳糖嘅——改用嗰啲。", "zh-cn": "【牛奶】与流行文化中的印象相反，大多数成年猫乳糖不耐受。牛奶会导致腹泻及消化不良。市面上有专门的「猫用奶」产品——无乳糖，可替代使用。", es: "Contrario a la cultura popular, la mayoría de los gatos adultos son intolerantes a la lactosa. La leche de vaca causa diarrea y malestar digestivo. Existen productos especiales de 'leche para gatos' sin lactosa — usa esos en su lugar." }, keywords: [] },
  { id: "egg", verdict: "yes", names: { en: "Cooked Egg", "zh-hk": "煮熟雞蛋", "zh-cn": "熟鸡蛋", es: "Huevo cocido" }, note: { en: "Fully cooked egg is an excellent protein treat for cats. Raw egg whites contain avidin which blocks biotin absorption. Cook thoroughly and serve plain, no oil or seasoning.", "zh-hk": "完全煮熟嘅蛋係貓嘅優質蛋白質零食。生蛋白含有抗生物素蛋白（avidin），會阻礙生物素（biotin）吸收。一定要徹底煮熟，原味上，唔好加油或調味料。", "zh-cn": "【鸡蛋】全熟的鸡蛋是猫咪极佳的蛋白质零食。生蛋白含抗生物素蛋白（avidin），会阻碍生物素吸收。须彻底煮熟，原味食用，不放油和调味料。", es: "El huevo completamente cocido es un premio proteico excelente para gatos. La clara de huevo cruda contiene avidina, que bloquea la absorción de biotina. Cocínalo bien y sírvelo solo, sin aceite ni condimentos." }, keywords: [] },
  { id: "popcorn", verdict: "limit", names: { en: "Popcorn (plain, air-popped)", "zh-hk": "爆谷（原味）", "zh-cn": "爆米花（原味）", es: "Palomitas (naturales)" }, note: { en: "Plain air-popped popcorn is safe as an occasional small treat. Avoid butter, salt, and kernels — hard kernels can damage cat teeth. Most cats show little interest.", "zh-hk": "原味空氣爆谷可以間中當小零食，但要避免牛油、鹽同爆谷核——硬核會損害貓嘅牙齒。大部分貓對爆谷冇乜興趣。", "zh-cn": "【爆谷】原味空气爆谷可偶尔少量喂食。避免牛油、盐及玉米粒——硬粒可能损伤猫牙。大多数猫对此兴趣不大。", es: "Las palomitas de maíz naturales hechas con aire caliente son seguras como premio ocasional pequeño. Evita la mantequilla, la sal y los granos duros — los granos pueden dañar los dientes del gato. A la mayoría de los gatos no les interesan." }, keywords: [] },
  { id: "bread", verdict: "limit", names: { en: "Bread (plain, baked)", "zh-hk": "麵包（原味）", "zh-cn": "面包（原味）", es: "Pan (simple)" }, note: { en: "Plain baked bread is safe in tiny pieces but offers no nutritional value to an obligate carnivore. Never feed raw dough — yeast produces alcohol and gas in the stomach. Cats' smaller stomachs make this especially dangerous.", "zh-hk": "普通焗麵包切成細粒食係安全嘅，但對專性肉食動物嚟講完全冇營養價值。千祈唔好餵生麵團——酵母會喺胃入面發酵產生酒精同氣體。貓嘅胃比狗更細，所以特別危險。", "zh-cn": "【面包】烤熟的普通面包可掰成小碎片喂食，但对专性肉食动物无营养价值。切勿喂生面团——酵母在胃中产生酒精和气体。猫的胃容量更小，这一点尤为危险。", es: "El pan horneado simple es seguro en trozos diminutos pero no ofrece valor nutricional a un carnívoro obligado. Nunca alimentes con masa cruda — la levadura produce alcohol y gas en el estómago. El estómago más pequeño de los gatos hace esto especialmente peligroso." }, keywords: [] },
  { id: "doughraw", verdict: "no", names: { en: "Raw Bread / Pizza Dough", "zh-hk": "生麵團", "zh-cn": "生面团", es: "Masa cruda" }, note: { en: "Raw dough is extremely dangerous for cats. Yeast ferments producing alcohol and gas. A cat's small body size means even a tiny amount of dough can cause life-threatening bloat and ethanol poisoning.", "zh-hk": "生麵團對貓極度危險。酵母發酵會產生酒精同氣體。貓體型細小，即使係極少量麵團都可以引致致命嘅胃脹氣同乙醇中毒。", "zh-cn": "【生面团】生面团对猫极为危险。酵母发酵产生酒精和气体。猫体型小，即便是极少量面团也可能导致危及生命的胃扩张扭转（bloat）及乙醇中毒。", es: "La masa cruda es extremadamente peligrosa para los gatos. La levadura fermenta produciendo alcohol y gas. El pequeño tamaño corporal de un gato significa que incluso una cantidad minúscula de masa puede causar hinchazón potencialmente mortal e intoxicación por etanol." }, keywords: ["yeast"] },
  { id: "almond", verdict: "limit", names: { en: "Almonds", "zh-hk": "杏仁", "zh-cn": "杏仁", es: "Almendras" }, note: { en: "Almonds are not directly toxic but are a choking hazard for small cat mouths and high in fat. Not worth the risk — skip entirely.", "zh-hk": "杏仁本身唔係直接有毒，但對貓嘅細小口腔嚟講有哽噎風險，而且脂肪含量高。唔值得冒險——完全唔好餵。", "zh-cn": "【杏仁】杏仁虽无直接毒性，但对猫的小嘴而言有窒息风险，且脂肪含量高。不值得冒险——完全不要喂。", es: "Las almendras no son directamente tóxicas pero son un peligro de asfixia para las bocas pequeñas de los gatos y tienen alto contenido en grasa. No vale la pena el riesgo — evítalas por completo." }, keywords: ["nut"] },
  { id: "walnut", verdict: "no", names: { en: "Walnuts", "zh-hk": "合桃", "zh-cn": "核桃", es: "Nueces" }, note: { en: "Walnuts — especially moldy ones — contain tremorgenic mycotoxins. Avoid entirely. Cats are too small for the 'small piece might be okay' approach.", "zh-hk": "合桃——特別係發霉嗰啲——含有震顫性黴菌毒素（tremorgenic mycotoxins）。完全要避免。貓體型太細，唔可以用「食少少可能冇事」嘅心態對待。", "zh-cn": "【核桃】核桃——尤其是发霉的——含有震颤源性霉菌毒素（tremorgenic mycotoxins）。完全避免喂食。猫体型太小，不可抱着「吃一小块可能没事」的心态。", es: "Las nueces — especialmente las mohosas — contienen micotoxinas tremorgénicas. Evítalas por completo. Los gatos son demasiado pequeños para el enfoque de 'un trocito podría estar bien'." }, keywords: ["nut"] },
  { id: "cherries", verdict: "no", names: { en: "Cherries (pits/stems)", "zh-hk": "車厘子（核）", "zh-cn": "樱桃（核）", es: "Cerezas (huesos)" }, note: { en: "Cherry flesh without the pit is safe but most cats ignore it. The pit, stem, and leaves contain cyanogenic glycosides. A swallowed pit can also obstruct a cat's narrow digestive tract.", "zh-hk": "車厘子果肉（去核後）係安全嘅，但大部分貓唔會理。車厘子核、莖同葉含有氰苷（cyanogenic glycosides）。吞咗核仲會阻塞貓狹窄嘅消化道。", "zh-cn": "【车厘子】去核后的车厘子果肉安全，但大多数猫无兴趣。果核、茎及叶含氰苷（cyanogenic glycosides）。吞下的果核亦可能阻塞猫狭窄的消化道。", es: "La pulpa de cereza sin el hueso es segura pero la mayoría de los gatos la ignoran. El hueso, el tallo y las hojas contienen glucósidos cianogénicos. Un hueso tragado también puede obstruir el estrecho tracto digestivo de un gato." }, keywords: [] },
  { id: "tomato", verdict: "limit", names: { en: "Tomato (ripe only)", "zh-hk": "蕃茄（熟透）", "zh-cn": "番茄（熟透）", es: "Tomate (maduro)" }, note: { en: "Ripe red tomato flesh is safe in small amounts. Green tomatoes, stems, and leaves contain solanine — cats are sensitive. Most cats show no interest in tomatoes.", "zh-hk": "成熟紅色番茄嘅果肉少量食係安全嘅。青色番茄、莖同葉含有茄鹼（solanine）——貓對呢種物質好敏感。大部分貓對番茄完全冇興趣。", "zh-cn": "【番茄】成熟的红色番茄果肉少量食用安全。未成熟的青色番茄、茎和叶含茄碱（solanine）——猫对此敏感。大多数猫对番茄无兴趣。", es: "La pulpa de tomate rojo maduro es segura en pequeñas cantidades. Los tomates verdes, los tallos y las hojas contienen solanina — los gatos son sensibles. A la mayoría de los gatos no les interesa el tomate." }, keywords: [] },
  { id: "mushroom", verdict: "limit", names: { en: "Mushroom (store-bought)", "zh-hk": "蘑菇（市售）", "zh-cn": "蘑菇（市售）", es: "Champiñón (de tienda)" }, note: { en: "Store-bought mushrooms are generally safe cooked. Wild mushrooms can be lethal — never let cats forage outdoors. A single toxic wild mushroom can kill a cat.", "zh-hk": "蘑菇：超市買嘅蘑菇煮熟咗通常安全。野生蘑菇可以致命——千祈唔好俾貓出街亂食。一粒有毒嘅野生蘑菇就足以殺死一隻貓。", "zh-cn": "【蘑菇】市售蘑菇煮熟后一般安全。野生蘑菇可致命——切勿让猫在户外自行觅食。一颗有毒的野生蘑菇足以夺走猫咪性命。", es: "Los champiñones comprados en tienda son generalmente seguros cocidos. Las setas silvestres pueden ser letales — nunca dejes que los gatos merodeen al aire libre. Una sola seta silvestre tóxica puede matar a un gato." }, keywords: [] },
  { id: "celery", verdict: "yes", names: { en: "Celery", "zh-hk": "西芹", "zh-cn": "芹菜", es: "Apio" }, note: { en: "Safe crunchy treat cut into tiny pieces. Low calorie but minimal nutrition for cats. The stringy texture can be a choking concern — slice crosswise into small bits.", "zh-hk": "芹菜：切到好細粒可以做安全嘅脆口零食。低卡路里但對貓冇乜營養。纖維粗糙容易噎親——要橫切到好細粒先得。", "zh-cn": "【西芹】安全爽脆的零食，切成小碎块喂食。低热量但对猫营养甚微。纤维质地的丝状结构可能有窒息风险——横向切成小碎粒。", es: "El apio es un premio crujiente seguro cortado en trocitos diminutos. Bajo en calorías pero con nutrición mínima para gatos. La textura fibrosa puede ser un peligro de asfixia — córtalo transversalmente en trozos pequeños." }, keywords: [] },
  { id: "pineapple", verdict: "limit", names: { en: "Pineapple", "zh-hk": "菠蘿", "zh-cn": "菠萝", es: "Piña" }, note: { en: "Tiny pieces of fresh pineapple are safe. High sugar and acidity — limit to a pinky-nail-sized piece. Most cats ignore it due to the citrusy smell.", "zh-hk": "菠蘿：新鮮菠蘿切到好細粒係安全嘅。高糖高酸——限制到手指甲咁大粒就夠。大部分貓因為柑橘味會無視佢。", "zh-cn": "【菠萝】极少量新鲜菠萝安全。高糖高酸——限制在小指甲盖大小的分量。大多数因果皮气味而对其不理不睬。", es: "Trocitos diminutos de piña fresca son seguros. Alto contenido de azúcar y acidez — limítalo a un trozo del tamaño de la uña del meñique. La mayoría de los gatos la ignoran por su olor cítrico." }, keywords: [] },
  { id: "mango", verdict: "limit", names: { en: "Mango (no pit)", "zh-hk": "芒果（去核）", "zh-cn": "芒果（去核）", es: "Mango (sin hueso)" }, note: { en: "Tiny pieces of fresh mango flesh are sweet and safe. The pit is a choking hazard and contains cyanide-related compounds. Most cats ignore mango entirely.", "zh-hk": "芒果：新鮮芒果肉切到好細粒係甜嘅又安全。芒果核會噎親，仲含有氰化物相關化合物。大部分貓完全無視芒果。", "zh-cn": "【芒果】极少量新鲜芒果肉甜美且安全。果核有窒息风险，并含氰化物相关化合物。大多数猫对芒果漠不关心。", es: "Trocitos diminutos de pulpa fresca de mango son dulces y seguros. El hueso es un peligro de asfixia y contiene compuestos relacionados con el cianuro. La mayoría de los gatos ignoran el mango por completo." }, keywords: [] },
  { id: "peach", verdict: "limit", names: { en: "Peach (no pit)", "zh-hk": "桃（去核）", "zh-cn": "桃（去核）", es: "Durazno (sin hueso)" }, note: { en: "Flesh is safe in tiny pieces. The pit contains cyanogenic glycosides and is a choking hazard. Cats rarely seek out stone fruit — not worth offering.", "zh-hk": "桃：桃肉切到好細粒係安全嘅。桃核含有氰苷，仲會造成窒息風險。貓好少會對核果有興趣——唔值得俾。", "zh-cn": "【桃】果肉极少量安全。果核含氰苷，且为窒息危险物。猫很少主动接近核果类水果——不值得特意喂食。", es: "La pulpa es segura en trocitos diminutos. El hueso contiene glucósidos cianogénicos y es un peligro de asfixia. Los gatos rara vez buscan frutas de hueso — no vale la pena ofrecerlas." }, keywords: [] },
  { id: "orange", verdict: "limit", names: { en: "Orange (no peel/seeds)", "zh-hk": "橙（去皮去籽）", "zh-cn": "橙子（去皮去籽）", es: "Naranja (sin cáscara/semillas)" }, note: { en: "Orange flesh is non-toxic but the strong citrus smell repels most cats. Citric acid can upset a cat's stomach. Peel and essential oils are more problematic — keep oranges away from cats.", "zh-hk": "橙：橙肉冇毒，但強烈嘅柑橘味會令大部分貓避開。檸檬酸會令貓腸胃不適。橙皮同精油更麻煩——要將橙遠離貓咪。", "zh-cn": "【橙】橙肉无毒，但强烈的柑橘气味令大多数猫退避三舍。柠檬酸可能引起猫胃部不适。橙皮及精油问题更大——让猫远离橙子。", es: "La pulpa de naranja no es tóxica pero el fuerte olor cítrico repele a la mayoría de los gatos. El ácido cítrico puede irritar el estómago de un gato. La cáscara y los aceites esenciales son más problemáticos — mantén las naranjas alejadas de los gatos." }, keywords: [] },
  { id: "lemon", verdict: "no", names: { en: "Lemon / Lime", "zh-hk": "檸檬／青檸", "zh-cn": "柠檬／青柠", es: "Limón / lima" }, note: { en: "All citrus is problematic for cats. The essential oils (limonene, linalool) and citric acid can cause central nervous system depression, vomiting, and diarrhea. Most cats avoid the smell anyway.", "zh-hk": "檸檬：所有柑橘類對貓都有問題。精油（檸檬烯、芳樟醇）同檸檬酸會導致中樞神經系統抑制、嘔吐同腹瀉。大部分貓本身就會避開呢種味道。", "zh-cn": "【柠檬】所有柑橘类水果对猫均有问题。其精油成分（柠檬烯 limonene、芳樟醇 linalool）及柠檬酸可能导致中枢神经系统抑制、呕吐及腹泻。所幸大多数猫本身厌恶此气味。", es: "Todos los cítricos son problemáticos para los gatos. Los aceites esenciales (limoneno, linalol) y el ácido cítrico pueden causar depresión del sistema nervioso central, vómitos y diarrea. De todos modos, la mayoría de los gatos evitan el olor." }, keywords: ["lime"] },
  { id: "corn", verdict: "yes", names: { en: "Corn Kernels (no cob)", "zh-hk": "粟米粒（無芯）", "zh-cn": "玉米粒（无芯）", es: "Maíz desgranado (sin mazorca)" }, note: { en: "Plain cooked corn kernels are safe but pass through undigested. Cats lack the enzymes to break down corn. Never give the cob — it causes intestinal blockage.", "zh-hk": "粟米：原味煮熟嘅粟米粒係安全嘅，但會原粒排出唔消化。貓缺乏分解粟米嘅酶。千祈唔好俾粟米芯——會導致腸道阻塞。", "zh-cn": "【粟米】原味熟粟米粒安全，但会未经消化直接排出。猫缺乏分解粟米的酶。切勿喂粟米芯——可导致肠道阻塞。", es: "Los granos de maíz cocidos simples son seguros pero pasan sin digerirse. Los gatos carecen de las enzimas para descomponer el maíz. Nunca des la mazorca — causa obstrucción intestinal." }, keywords: [] },
  { id: "edamame", verdict: "yes", names: { en: "Edamame", "zh-hk": "枝豆", "zh-cn": "毛豆", es: "Edamame" }, note: { en: "Plain unsalted edamame in tiny amounts is safe. Soy is a common cat food ingredient. Limit to 1–2 beans as an occasional treat.", "zh-hk": "枝豆：原味無鹽嘅枝豆，少量係安全嘅。大豆係常見嘅貓糧成分。限制到1-2粒，當間中嘅零食。", "zh-cn": "【毛豆】极少量原味无盐毛豆安全。大豆是常见的猫粮成分。限制在1-2粒，作为偶尔的零食。", es: "El edamame simple sin sal en cantidades diminutas es seguro. La soja es un ingrediente común en la comida para gatos. Limítalo a 1–2 vainas como premio ocasional." }, keywords: ["soy"] },
  { id: "honey", verdict: "limit", names: { en: "Honey", "zh-hk": "蜂蜜", "zh-cn": "蜂蜜", es: "Miel" }, note: { en: "Tiny amounts of honey are safe for adult cats but provide no benefit. Cats cannot taste sweetness. Not for kittens (botulism risk) or diabetic cats. Avoid entirely — no feline upside.", "zh-hk": "蜜糖：極少量蜜糖對成貓安全，但冇任何好處。貓係嘗唔到甜味嘅。唔適合幼貓（有肉毒桿菌風險）或糖尿病貓。完全避免——對貓零益處。", "zh-cn": "【蜜糖】极少量蜜糖对成年猫安全但无益。猫无法感知甜味。不可喂幼猫（肉毒杆菌中毒风险）或糖尿病猫。应完全避免——对猫毫无益处。", es: "Cantidades minúsculas de miel son seguras para gatos adultos pero no aportan ningún beneficio. Los gatos no pueden saborear el dulzor. No para gatitos (riesgo de botulismo) ni gatos diabéticos. Evítala por completo — ningún beneficio felino." }, keywords: [] },
  { id: "ice", verdict: "yes", names: { en: "Plain Ice Cubes", "zh-hk": "冰塊", "zh-cn": "冰块", es: "Cubos de hielo" }, note: { en: "Safe and refreshing. Some cats enjoy batting ice cubes across the floor more than consuming them. The myth that ice causes bloat is unfounded.", "zh-hk": "冰：安全又消暑。有啲貓鍾意拍打冰塊多過食佢。冰會導致胃脹氣嘅講法係冇根據嘅。", "zh-cn": "【冰】安全且清凉解暑。有些猫更喜欢拨弄冰块玩耍而非食用。所谓冰块导致胃扩张的说法并无根据。", es: "El hielo es seguro y refrescante. Algunos gatos disfrutan más empujando cubitos de hielo por el suelo que consumiéndolos. El mito de que el hielo causa hinchazón es infundado." }, keywords: [] },
  { id: "icecream", verdict: "limit", names: { en: "Ice Cream", "zh-hk": "雪糕", "zh-cn": "冰淇淋", es: "Helado" }, note: { en: "Dairy, sugar, and possibly xylitol or chocolate — triple risk for cats. Most cats are lactose intolerant. Look for cat-specific frozen treats (lactose-free cat 'ice cream') instead.", "zh-hk": "雪糕：乳製品、糖，仲可能有木糖醇或朱古力——對貓係三重風險。大部分貓都有乳糖不耐症。應該搵貓專用嘅冷凍零食（無乳糖貓『雪糕』）代替。", "zh-cn": "【雪糕】乳制品、糖，且可能含木糖醇或朱古力——对猫三重风险。大多数猫乳糖不耐受。建议寻找猫专用冷冻零食（无乳糖猫用「雪糕」）代替。", es: "Lácteos, azúcar y posiblemente xilitol o chocolate — triple riesgo para los gatos. La mayoría de los gatos son intolerantes a la lactosa. Busca alternativas de premios congelados específicos para gatos (helado para gatos sin lactosa)." }, keywords: [] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/can-my-cat-eat";

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

export default function CanMyCatEat() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Verdict>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
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
      return f.names[locale].toLowerCase().includes(q) || f.names.en.toLowerCase().includes(q) || f.note[locale].toLowerCase().includes(q) || f.keywords.some((k) => k.includes(q)) || f.id.includes(q);
    });
  }, [query, filter, locale]);

  const content = LANGUAGES[locale];
  const articleContent = (ARTICLE_CONTENT as Record<string, any>)[locale] as typeof ARTICLE_CONTENT["en"];

  const hints = locale === "zh-hk" ? ["朱古力", "葡萄", "洋蔥", "香蕉"] : locale === "zh-cn" ? ["巧克力", "葡萄", "洋葱", "香蕉"] : ["chocolate", "grapes", "onion", "banana"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const verdictStyle = (v: Verdict) => v === "yes" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : v === "no" ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200";
  const verdictIcon = (v: Verdict) => v === "yes" ? <Check className="h-4 w-4" /> : v === "no" ? <X className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  const verdictLabel = (v: Verdict) => v === "yes" ? content.yes : v === "no" ? content.no : content.limit;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-rose-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-400/15 ring-1 ring-amber-300/20"><Cat className="h-5 w-5 text-rose-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-rose-300/80">TinyToolboxes · Pet</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-rose-400/70 bg-rose-400/15 text-rose-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">

              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-rose-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="flex flex-wrap gap-2">
                {(["all", "yes", "limit", "no"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${filter === f ? "border-rose-400/70 bg-rose-400/15 text-rose-200" : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"}`}>{f === "all" ? content.filterAll : f === "yes" ? content.filterYes : f === "limit" ? content.filterLimit : content.filterNo}</button>)}
              </div>
              <div className="grid gap-2">
                {results.map((f) => (
                  <div key={f.id} className={`rounded-2xl border p-4 ${verdictStyle(f.verdict)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{f.names[locale]}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">{verdictIcon(f.verdict)}{verdictLabel(f.verdict)}</span>
                    </div>
                    <p className="mt-1 text-sm opacity-85">{f.note[locale]}</p>
                  </div>
                ))}
                {!results.length && <p className="text-sm text-white/50">No matches. Try a different food name.</p>}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">Search tools</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-rose-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="chocolate, lily, calorie" className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-amber-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{articleContent.articleToxicTitle}</h2>
                <p className="mt-3 leading-7">{articleContent.articleToxicP1}</p>
                <p className="mt-3 leading-7">{articleContent.articleToxicP2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{articleContent.articleSafeTitle}</h2>
                <p className="mt-3 leading-7" dangerouslySetInnerHTML={{ __html: articleContent.articleSafeP1 }} />
                <p className="mt-3 leading-7">{articleContent.articleSafeP2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{articleContent.articleEmergencyTitle}</h2>
                <p className="mt-3 leading-7">{articleContent.articleEmergencyP1}</p>
                <p className="mt-3 leading-7" dangerouslySetInnerHTML={{ __html: articleContent.articleEmergencyP2 }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{articleContent.articleFaqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {articleContent.articleFaqs.map((faq: any, i: number) => (
                    <div key={i}><h3 className="font-semibold text-white">{faq.q}</h3><p className="mt-1 text-white/70">{faq.a}</p></div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-4 text-sm text-rose-100/85"><strong className="text-rose-200">{locale === "en" ? "Disclaimer:" : locale === "zh-hk" ? "\u514d\u8cac\u8072\u660e\uff1a" : locale === "zh-cn" ? "\u514d\u8d23\u58f0\u660e\uff1a" : "Aviso:"}</strong> {articleContent.articleDisclaimer}</div>
            </article>

          </div>

          <aside className="space-y-6 rounded-3xl border border-rose-400/15 bg-rose-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-rose-400/15 p-3"><Cat className="h-5 w-5 text-rose-300" /></div><div><h2 className="text-lg font-semibold">{articleContent.sidebarTitle}</h2><p className="text-sm text-rose-100/80">{articleContent.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-rose-100/80">
              {articleContent.sidebarItems.map((item: string, i: number) => (
                <p key={i} className="rounded-2xl border border-red-400/30 bg-black/30 px-4 py-3">{item}</p>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
