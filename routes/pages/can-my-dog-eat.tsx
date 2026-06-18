import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Dog, Search, Check, X, AlertTriangle } from "lucide-react";
import ARTICLE_CONTENT from "../data/can-eat-content.json";

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

const FOODS: Array<{ id: string; verdict: Verdict; names: { en: string; "zh-hk": string; "zh-cn": string; es: string }; note: { en: string; "zh-hk": string; "zh-cn": string; es: string }; keywords: string[] }> = [
  { id: "chocolate", verdict: "no", names: { en: "Chocolate", "zh-hk": "朱古力", "zh-cn": "巧克力", es: "Chocolate" }, note: { en: "Contains theobromine. Dark and baker's chocolate are most dangerous.", "zh-hk": "含有可可鹼（theobromine）。黑朱古力同烘焙用朱古力最危險。", "zh-cn": "含有可可碱（theobromine）。黑巧克力和烘焙巧克力最危险。", es: "Contiene teobromina. El chocolate negro y el de repostería son los más peligrosos." }, keywords: ["choc"] },
  { id: "grapes", verdict: "no", names: { en: "Grapes & Raisins", "zh-hk": "葡萄／提子", "zh-cn": "葡萄／葡萄干", es: "Uvas y pasas" }, note: { en: "Can cause acute kidney failure even in tiny amounts. Mechanism is tartaric acid sensitivity.", "zh-hk": "即使極少量都可引致急性腎衰竭。機制係對酒石酸敏感。", "zh-cn": "即使极少量也可导致急性肾衰竭。机制是对酒石酸过敏。", es: "Puede causar insuficiencia renal aguda incluso en pequeñas cantidades. El mecanismo es la sensibilidad al ácido tartárico." }, keywords: ["raisin"] },
  { id: "onion", verdict: "no", names: { en: "Onions, Garlic, Leeks, Chives", "zh-hk": "洋蔥／蒜頭／韭蔥", "zh-cn": "洋葱／大蒜／韭葱", es: "Cebolla, ajo, puerro" }, note: { en: "Allium family destroys red blood cells causing anemia. Cooked, raw, or powdered — all toxic.", "zh-hk": "蔥屬植物破壞紅血球引致貧血。煮熟、生食或粉末狀——全部有毒。", "zh-cn": "葱属植物破坏红细胞导致贫血。煮熟、生食或粉末状——均有毒。", es: "La familia allium destruye los glóbulos rojos causando anemia. Cocido, crudo o en polvo — todo es tóxico." }, keywords: ["garlic", "leek", "chive"] },
  { id: "xylitol", verdict: "no", names: { en: "Xylitol (sugar substitute)", "zh-hk": "木糖醇", "zh-cn": "木糖醇", es: "Xilitol" }, note: { en: "Found in sugar-free gum, candy, peanut butter. Causes severe hypoglycemia and liver failure.", "zh-hk": "常見於無糖香口膠、糖果、花生醬。可引致嚴重低血糖及肝衰竭。", "zh-cn": "常见于无糖口香糖、糖果、花生酱。可导致严重低血糖和肝衰竭。", es: "Se encuentra en chicles sin azúcar, caramelos y mantequilla de maní. Causa hipoglucemia grave e insuficiencia hepática." }, keywords: ["sugar-free"] },
  { id: "macadamia", verdict: "no", names: { en: "Macadamia Nuts", "zh-hk": "夏威夷果仁", "zh-cn": "夏威夷果", es: "Nueces de macadamia" }, note: { en: "Causes weakness, vomiting, tremors, hyperthermia within 12 hours.", "zh-hk": "12小時內可引起虛弱、嘔吐、震顫及體溫過高。", "zh-cn": "12小时内可引起虚弱、呕吐、震颤及体温过高。", es: "Causa debilidad, vómitos, temblores e hipertermia en 12 horas." }, keywords: ["nut"] },
  { id: "avocado", verdict: "limit", names: { en: "Avocado", "zh-hk": "牛油果", "zh-cn": "牛油果", es: "Aguacate" }, note: { en: "Flesh is generally safe in small amounts, but pit, skin, and leaves contain persin which is harmful.", "zh-hk": "果肉少量一般安全，但果核、果皮及葉片含有對狗有害嘅珀辛（persin）。", "zh-cn": "果肉少量通常安全，但果核、果皮和叶片含有对狗有害的珀辛（persin）。", es: "La pulpa es generalmente segura en pequeñas cantidades, pero el hueso, la piel y las hojas contienen persina que es dañina." }, keywords: [] },
  { id: "alcohol", verdict: "no", names: { en: "Alcohol", "zh-hk": "酒精", "zh-cn": "酒精", es: "Alcohol" }, note: { en: "Even small amounts can cause vomiting, ataxia, coma, and death. Includes bread dough and fermented foods.", "zh-hk": "即使少量都可引起嘔吐、失調、昏迷甚至死亡。包括生麵團及發酵食品。", "zh-cn": "即使少量也可导致呕吐、共济失调、昏迷甚至死亡。包括生面团和发酵食品。", es: "Incluso pequeñas cantidades pueden causar vómitos, ataxia, coma y muerte. Incluye masa de pan y alimentos fermentados." }, keywords: ["beer", "wine"] },
  { id: "coffee", verdict: "no", names: { en: "Coffee, Tea, Caffeine", "zh-hk": "咖啡／茶／咖啡因", "zh-cn": "咖啡／茶／咖啡因", es: "Café, té, cafeína" }, note: { en: "Methylxanthines like in chocolate. Can cause tremors, seizures, cardiac issues.", "zh-hk": "含有與朱古力相似嘅甲基黃嘌呤。可引起震顫、癲癇及心臟問題。", "zh-cn": "含有与巧克力类似的甲基黄嘌呤。可导致震颤、癫痫发作及心脏问题。", es: "Metilxantinas como en el chocolate. Puede causar temblores, convulsiones y problemas cardíacos." }, keywords: ["tea", "caffeine"] },
  { id: "rawmeat", verdict: "limit", names: { en: "Raw Meat / Raw Eggs", "zh-hk": "生肉／生雞蛋", "zh-cn": "生肉／生鸡蛋", es: "Carne cruda / huevos crudos" }, note: { en: "Risk of salmonella and E. coli. Discussion is ongoing among vets about raw diets — consult yours.", "zh-hk": "有沙門氏菌及大腸桿菌風險。獸醫對生食飲食仍有爭議——請諮詢你嘅獸醫。", "zh-cn": "有沙门氏菌和大肠杆菌风险。兽医对生食饮食仍存争议——请咨询您的兽医。", es: "Riesgo de salmonela y E. coli. El debate sobre las dietas crudas continúa entre veterinarios — consulta al tuyo." }, keywords: ["egg"] },
  { id: "bones", verdict: "limit", names: { en: "Cooked Bones", "zh-hk": "煮熟嘅骨頭", "zh-cn": "煮熟的骨头", es: "Huesos cocidos" }, note: { en: "Cooked bones splinter and can puncture intestines. Raw recreational bones may be safer but choose carefully.", "zh-hk": "煮熟嘅骨頭容易碎裂，可能刺穿腸道。生骨頭用於玩耍可能較安全，但要謹慎選擇。", "zh-cn": "煮熟的骨头容易碎裂，可能刺穿肠道。用于玩耍的生骨头可能相对安全，但要谨慎选择。", es: "Los huesos cocidos se astillan y pueden perforar los intestinos. Los huesos crudos para masticar pueden ser más seguros, pero elíjalos con cuidado." }, keywords: [] },
  { id: "saltyfood", verdict: "no", names: { en: "Excessive Salt", "zh-hk": "高鹽食物", "zh-cn": "高盐食物", es: "Sal en exceso" }, note: { en: "Can cause sodium ion poisoning. Avoid chips, pretzels, salted popcorn.", "zh-hk": "可引致鈉離子中毒。避免薯片、椒鹽脆餅及加鹽爆谷。", "zh-cn": "可导致钠离子中毒。避免薯片、椒盐卷饼和加盐爆米花。", es: "Puede causar intoxicación por iones de sodio. Evita las papas fritas, pretzels y palomitas saladas." }, keywords: ["chips"] },
  { id: "applecore", verdict: "limit", names: { en: "Apple (no seeds/core)", "zh-hk": "蘋果（去核）", "zh-cn": "苹果（去核）", es: "Manzana (sin semillas/cáscara)" }, note: { en: "Flesh is safe. Seeds contain cyanide compounds and the core can choke.", "zh-hk": "果肉安全。蘋果核含有氰化物化合物，果芯可能造成哽噎。", "zh-cn": "果肉安全。种子含有氰化物化合物，果核可能导致窒息。", es: "La pulpa es segura. Las semillas contienen compuestos de cianuro y el corazón puede causar asfixia." }, keywords: ["apple"] },
  { id: "banana", verdict: "yes", names: { en: "Banana", "zh-hk": "香蕉", "zh-cn": "香蕉", es: "Plátano" }, note: { en: "Safe in moderation. High in potassium and fiber but also sugar.", "zh-hk": "適量食用安全。鉀質同纖維豐富，但含糖量亦高。", "zh-cn": "适量食用安全。富含钾和纤维，但含糖量也高。", es: "Seguro con moderación. Alto en potasio y fibra, pero también en azúcar." }, keywords: [] },
  { id: "blueberry", verdict: "yes", names: { en: "Blueberries", "zh-hk": "藍莓", "zh-cn": "蓝莓", es: "Arándanos" }, note: { en: "Excellent antioxidant treat. Frozen blueberries make a great training treat.", "zh-hk": "出色嘅抗氧化零食。冰凍藍莓係極好嘅訓練獎勵零食。", "zh-cn": "出色的抗氧化零食。冷冻蓝莓是极好的训练奖励零食。", es: "Excelente golosina antioxidante. Los arándanos congelados son un gran premio de entrenamiento." }, keywords: ["berry"] },
  { id: "strawberry", verdict: "yes", names: { en: "Strawberries", "zh-hk": "士多啤梨", "zh-cn": "草莓", es: "Fresas" }, note: { en: "Safe in moderation. High in fiber and vitamin C.", "zh-hk": "適量食用安全。纖維及維他命C含量高。", "zh-cn": "适量食用安全。富含纤维和维生素C。", es: "Seguras con moderación. Altas en fibra y vitamina C." }, keywords: [] },
  { id: "watermelon", verdict: "yes", names: { en: "Watermelon (no seeds/rind)", "zh-hk": "西瓜（去籽去皮）", "zh-cn": "西瓜（去籽去皮）", es: "Sandía (sin semillas/cáscara)" }, note: { en: "Hydrating summer treat. Remove seeds and rind to prevent intestinal blockage.", "zh-hk": "消暑補水嘅夏日零食。要去籽去皮以防腸道阻塞。", "zh-cn": "消暑补水的夏日零食。需去籽去皮以防肠道阻塞。", es: "Refrescante golosina de verano. Retire las semillas y la cáscara para prevenir obstrucción intestinal." }, keywords: [] },
  { id: "carrot", verdict: "yes", names: { en: "Carrots", "zh-hk": "紅蘿蔔", "zh-cn": "胡萝卜", es: "Zanahorias" }, note: { en: "Excellent low-calorie crunchy treat. Good for dental health.", "zh-hk": "出色嘅低卡路里脆口零食。有助牙齒健康。", "zh-cn": "出色的低卡路里爽脆零食。有助牙齿健康。", es: "Excelente golosina crujiente baja en calorías. Buena para la salud dental." }, keywords: [] },
  { id: "broccoli", verdict: "limit", names: { en: "Broccoli", "zh-hk": "西蘭花", "zh-cn": "西兰花", es: "Brócoli" }, note: { en: "Small amounts are fine. Large amounts contain isothiocyanates that can cause gastric irritation.", "zh-hk": "少量沒問題。大量含有異硫氰酸鹽，可能引起腸胃不適。", "zh-cn": "少量没问题。大量含有异硫氰酸酯，可能引起胃部刺激。", es: "Pequeñas cantidades están bien. Grandes cantidades contienen isotiocianatos que pueden irritar el estómago." }, keywords: [] },
  { id: "spinach", verdict: "limit", names: { en: "Spinach", "zh-hk": "菠菜", "zh-cn": "菠菜", es: "Espinaca" }, note: { en: "Small amounts are fine. High oxalates may worsen kidney issues in some dogs.", "zh-hk": "少量沒問題。高草酸鹽含量可能令部分狗狗嘅腎臟問題惡化。", "zh-cn": "少量没问题。高草酸盐含量可能加重部分狗狗的肾脏问题。", es: "Pequeñas cantidades están bien. Los altos oxalatos pueden empeorar problemas renales en algunos perros." }, keywords: [] },
  { id: "cucumber", verdict: "yes", names: { en: "Cucumber", "zh-hk": "青瓜", "zh-cn": "黄瓜", es: "Pepino" }, note: { en: "Crunchy hydrating snack. Very low calorie.", "zh-hk": "爽脆補水嘅零食。卡路里極低。", "zh-cn": "爽脆补水的零食。热量极低。", es: "Bocadillo crujiente e hidratante. Muy bajo en calorías." }, keywords: [] },
  { id: "sweetpotato", verdict: "yes", names: { en: "Sweet Potato (cooked)", "zh-hk": "番薯（煮熟）", "zh-cn": "红薯（煮熟）", es: "Camote / batata (cocido)" }, note: { en: "Cooked plain sweet potato is safe and nutritious. Never serve with butter or seasonings.", "zh-hk": "煮熟嘅原味番薯安全且有營養。切勿加牛油或調味料。", "zh-cn": "煮熟的原味红薯安全且有营养。切勿添加黄油或调味料。", es: "El camote cocido simple es seguro y nutritivo. Nunca sirvas con mantequilla ni condimentos." }, keywords: [] },
  { id: "potato", verdict: "limit", names: { en: "Potato (cooked, plain)", "zh-hk": "薯仔（煮熟）", "zh-cn": "土豆（煮熟）", es: "Papa (cocida)" }, note: { en: "Plain cooked potato is fine. Raw potatoes and green skins contain solanine which is toxic.", "zh-hk": "煮熟嘅原味薯仔沒問題。生薯仔同綠色薯皮含有有毒嘅龍葵鹼（solanine）。", "zh-cn": "煮熟的原味土豆没问题。生土豆和绿色土豆皮含有有毒的茄碱（solanine）。", es: "La papa cocida simple está bien. Las papas crudas y las cáscaras verdes contienen solanina que es tóxica." }, keywords: [] },
  { id: "pumpkin", verdict: "yes", names: { en: "Pumpkin (plain, canned or cooked)", "zh-hk": "南瓜", "zh-cn": "南瓜", es: "Calabaza" }, note: { en: "Excellent for digestion. Helps both diarrhea and constipation. Use plain — not pumpkin pie filling.", "zh-hk": "對消化極有幫助。腹瀉同便秘都有效。用原味南瓜——唔係南瓜批餡料。", "zh-cn": "对消化极有帮助。腹泻和便秘均有效。使用纯南瓜——不是南瓜派馅料。", es: "Excelente para la digestión. Ayuda tanto con la diarrea como con el estreñimiento. Usa calabaza natural — no el relleno de pastel." }, keywords: [] },
  { id: "rice", verdict: "yes", names: { en: "White Rice (cooked)", "zh-hk": "白飯", "zh-cn": "白米饭", es: "Arroz blanco cocido" }, note: { en: "Bland and gentle. Often recommended for an upset stomach with boiled chicken.", "zh-hk": "清淡溫和。腸胃不適時常與白烚雞肉一齊推薦。", "zh-cn": "清淡温和。肠胃不适时常与白煮鸡肉一起推荐。", es: "Suave y fácil de digerir. Frecuentemente recomendado para el malestar estomacal junto con pollo hervido." }, keywords: [] },
  { id: "chicken", verdict: "yes", names: { en: "Cooked Chicken (boneless, skinless)", "zh-hk": "煮熟雞胸（去骨去皮）", "zh-cn": "煮熟鸡胸（去骨去皮）", es: "Pollo cocido (sin hueso/piel)" }, note: { en: "Excellent lean protein. Always remove bones and cook fully.", "zh-hk": "出色嘅瘦蛋白質來源。一定要去骨並徹底煮熟。", "zh-cn": "出色的瘦蛋白质来源。务必去骨并彻底煮熟。", es: "Excelente proteína magra. Retira siempre los huesos y cocina completamente." }, keywords: [] },
  { id: "salmon", verdict: "yes", names: { en: "Salmon (cooked)", "zh-hk": "煮熟三文魚", "zh-cn": "煮熟三文鱼", es: "Salmón cocido" }, note: { en: "Rich in omega-3. Never serve raw due to salmon poisoning disease risk in raw Pacific salmon.", "zh-hk": "富含Omega-3。切勿餵生三文魚——生太平洋三文魚有鮭魚中毒症風險。", "zh-cn": "富含Omega-3。切勿喂食生三文鱼——生太平洋三文鱼有鲑鱼中毒症风险。", es: "Rico en omega-3. Nunca lo sirvas crudo por el riesgo de envenenamiento por salmón en salmón del Pacífico crudo." }, keywords: ["fish"] },
  { id: "peanutbutter", verdict: "limit", names: { en: "Peanut Butter (xylitol-free)", "zh-hk": "花生醬（不含木糖醇）", "zh-cn": "花生酱（不含木糖醇）", es: "Mantequilla de maní (sin xilitol)" }, note: { en: "Check the label every time. Many sugar-free / reduced-sugar brands now contain xylitol.", "zh-hk": "每次都要檢查標籤。許多無糖或低糖品牌現在含有木糖醇。", "zh-cn": "每次都要检查标签。许多无糖或低糖品牌现在含有木糖醇。", es: "Revisa la etiqueta cada vez. Muchas marcas sin azúcar o con azúcar reducida ahora contienen xilitol." }, keywords: ["pb"] },
  { id: "cheese", verdict: "limit", names: { en: "Cheese", "zh-hk": "芝士", "zh-cn": "奶酪", es: "Queso" }, note: { en: "Many dogs love it but high in fat. Lactose-intolerant dogs may have digestive upset.", "zh-hk": "很多狗狗都喜愛，但脂肪含量高。乳糖不耐症嘅狗可能出現消化問題。", "zh-cn": "很多狗狗都喜爱，但脂肪含量高。乳糖不耐受的狗可能出现消化问题。", es: "A muchos perros les encanta, pero es alto en grasa. Los perros intolerantes a la lactosa pueden tener malestar digestivo." }, keywords: [] },
  { id: "yogurt", verdict: "limit", names: { en: "Plain Yogurt (no sweeteners)", "zh-hk": "原味乳酪", "zh-cn": "原味酸奶", es: "Yogur natural" }, note: { en: "Plain, unsweetened yogurt is safe in moderation. Avoid sugar-free varieties with xylitol.", "zh-hk": "原味無糖乳酪適量食用安全。避免含木糖醇嘅無糖品種。", "zh-cn": "原味无糖酸奶适量食用安全。避免含木糖醇的无糖品种。", es: "El yogur natural sin azúcar es seguro con moderación. Evita las variedades sin azúcar con xilitol." }, keywords: [] },
  { id: "milk", verdict: "limit", names: { en: "Cow's Milk", "zh-hk": "牛奶", "zh-cn": "牛奶", es: "Leche de vaca" }, note: { en: "Most adult dogs are lactose intolerant. Small amounts may be tolerated but can cause diarrhea.", "zh-hk": "大多數成年狗狗有乳糖不耐症。少量或可耐受，但可能引起腹瀉。", "zh-cn": "大多数成年狗狗乳糖不耐受。少量或可耐受，但可能引起腹泻。", es: "La mayoría de los perros adultos son intolerantes a la lactosa. Pequeñas cantidades pueden tolerarse pero pueden causar diarrea." }, keywords: [] },
  { id: "egg", verdict: "yes", names: { en: "Cooked Egg", "zh-hk": "煮熟雞蛋", "zh-cn": "熟鸡蛋", es: "Huevo cocido" }, note: { en: "Excellent protein. Cook thoroughly to avoid biotin deficiency and salmonella from raw whites.", "zh-hk": "優質蛋白質。要徹底煮熟，以避免生蛋白引致嘅生物素缺乏症及沙門氏菌感染。", "zh-cn": "优质蛋白质。需彻底煮熟，以避免生蛋白导致的生物素缺乏症和沙门氏菌感染。", es: "Excelente proteína. Cocina bien para evitar la deficiencia de biotina y la salmonela de las claras crudas." }, keywords: [] },
  { id: "popcorn", verdict: "limit", names: { en: "Popcorn (plain, air-popped)", "zh-hk": "爆谷（原味）", "zh-cn": "爆米花（原味）", es: "Palomitas (naturales)" }, note: { en: "Plain air-popped popcorn is okay as an occasional treat. Avoid buttered or salted.", "zh-hk": "原味空氣爆谷可以間中當零食。避免加牛油或加鹽嘅。", "zh-cn": "原味空气爆米花可偶尔作为零食。避免加黄油或加盐的。", es: "Las palomitas naturales hechas con aire son aceptables como golosina ocasional. Evita las con mantequilla o sal." }, keywords: [] },
  { id: "bread", verdict: "limit", names: { en: "Bread (plain, baked)", "zh-hk": "麵包（原味）", "zh-cn": "面包（原味）", es: "Pan (simple)" }, note: { en: "Plain baked bread is fine in small amounts. Never feed raw bread dough — yeast can be deadly.", "zh-hk": "原味烘焙麵包少量沒問題。切勿餵生麵團——酵母可能致命。", "zh-cn": "原味烤面包少量没问题。切勿喂生面团——酵母可能致命。", es: "El pan horneado simple está bien en pequeñas cantidades. Nunca alimentes con masa cruda — la levadura puede ser mortal." }, keywords: [] },
  { id: "doughraw", verdict: "no", names: { en: "Raw Bread / Pizza Dough", "zh-hk": "生麵團", "zh-cn": "生面团", es: "Masa cruda" }, note: { en: "Yeast ferments in the stomach producing alcohol and gas. Can cause bloat and ethanol poisoning.", "zh-hk": "酵母在胃部發酵產生酒精同氣體。可引致胃脹氣及乙醇中毒。", "zh-cn": "酵母在胃部发酵产生酒精和气体。可导致胃扩张和乙醇中毒。", es: "La levadura fermenta en el estómago produciendo alcohol y gas. Puede causar hinchazón e intoxicación por etanol." }, keywords: ["yeast"] },
  { id: "almond", verdict: "limit", names: { en: "Almonds", "zh-hk": "杏仁", "zh-cn": "杏仁", es: "Almendras" }, note: { en: "Not toxic but high fat and a choking hazard. Best avoided.", "zh-hk": "並非有毒，但脂肪含量高且有哽噎風險。最好避開。", "zh-cn": "并非有毒，但脂肪含量高且有窒息风险。最好避免。", es: "No es tóxico pero es alto en grasa y representa un peligro de asfixia. Es mejor evitarlas." }, keywords: ["nut"] },
  { id: "walnut", verdict: "no", names: { en: "Walnuts", "zh-hk": "合桃", "zh-cn": "核桃", es: "Nueces" }, note: { en: "Black walnuts and moldy English walnuts can cause neurological issues. Avoid all walnuts.", "zh-hk": "黑核桃及發霉英國核桃可引致神經問題。所有核桃都要避開。", "zh-cn": "黑核桃和发霉的英国核桃可导致神经系统问题。所有核桃均应避免。", es: "Las nueces negras y las nueces inglesas mohosas pueden causar problemas neurológicos. Evita todas las nueces." }, keywords: ["nut"] },
  { id: "cherries", verdict: "no", names: { en: "Cherries (pits/stems)", "zh-hk": "車厘子（核）", "zh-cn": "樱桃（核）", es: "Cerezas (huesos)" }, note: { en: "Flesh okay but the pit, stem, and leaves contain cyanide compounds.", "zh-hk": "果肉沒問題，但果核、果莖及葉片含有氰化物化合物。", "zh-cn": "果肉没问题，但果核、果梗和叶片含有氰化物化合物。", es: "La pulpa está bien, pero el hueso, el tallo y las hojas contienen compuestos de cianuro." }, keywords: [] },
  { id: "tomato", verdict: "limit", names: { en: "Tomato (ripe only)", "zh-hk": "蕃茄（熟透）", "zh-cn": "番茄（熟透）", es: "Tomate (maduro)" }, note: { en: "Ripe red tomato flesh is fine. Green tomatoes and the leaves contain solanine.", "zh-hk": "成熟紅色蕃茄果肉沒問題。青色蕃茄及葉片含有龍葵鹼（solanine）。", "zh-cn": "成熟的红色番茄果肉没问题。青色番茄和叶片含有茄碱（solanine）。", es: "La pulpa de tomate rojo maduro está bien. Los tomates verdes y las hojas contienen solanina." }, keywords: [] },
  { id: "mushroom", verdict: "limit", names: { en: "Mushroom (store-bought)", "zh-hk": "蘑菇（市售）", "zh-cn": "蘑菇（市售）", es: "Champiñón (de tienda)" }, note: { en: "Store-bought white/portobello mushrooms are generally safe. Wild mushrooms can be lethal — never let your dog forage.", "zh-hk": "超市買嘅白蘑菇或波托貝洛菇一般安全。野生蘑菇可致命——切勿讓狗狗自行採食。", "zh-cn": "超市购买的白蘑菇或波托贝洛菇一般安全。野生蘑菇可致命——切勿让狗狗自行采食。", es: "Los champiñones blancos o portobello comprados en tienda son generalmente seguros. Las setas silvestres pueden ser letales — nunca dejes que tu perro las busque." }, keywords: [] },
  { id: "celery", verdict: "yes", names: { en: "Celery", "zh-hk": "西芹", "zh-cn": "芹菜", es: "Apio" }, note: { en: "Crunchy low-calorie treat. Cut into bite-sized pieces.", "zh-hk": "脆口低卡路里零食。切成一口大小嘅小塊。", "zh-cn": "爽脆低热量零食。切成一口大小的小块。", es: "Golosina crujiente y baja en calorías. Córtala en trozos del tamaño de un bocado." }, keywords: [] },
  { id: "pineapple", verdict: "limit", names: { en: "Pineapple", "zh-hk": "菠蘿", "zh-cn": "菠萝", es: "Piña" }, note: { en: "Small amounts of fresh pineapple are safe. High sugar — limit servings.", "zh-hk": "少量新鮮菠蘿係安全嘅。含糖量高——要限制份量。", "zh-cn": "少量新鲜菠萝是安全的。含糖量高——需限制份量。", es: "Pequeñas cantidades de piña fresca son seguras. Alto contenido de azúcar — limita las porciones." }, keywords: [] },
  { id: "mango", verdict: "limit", names: { en: "Mango (no pit)", "zh-hk": "芒果（去核）", "zh-cn": "芒果（去核）", es: "Mango (sin hueso)" }, note: { en: "Flesh is sweet and safe. The pit can choke and contains cyanide compounds.", "zh-hk": "果肉甜美且安全。果核可能造成哽噎，並含有氰化物化合物。", "zh-cn": "果肉甜美且安全。果核可能导致窒息，并含有氰化物化合物。", es: "La pulpa es dulce y segura. El hueso puede causar asfixia y contiene compuestos de cianuro." }, keywords: [] },
  { id: "peach", verdict: "limit", names: { en: "Peach (no pit)", "zh-hk": "桃（去核）", "zh-cn": "桃（去核）", es: "Durazno (sin hueso)" }, note: { en: "Flesh okay. The pit contains cyanide and is a choking hazard.", "zh-hk": "果肉沒問題。桃核含有氰化物，且有哽噎風險。", "zh-cn": "果肉没问题。桃核含有氰化物，且有窒息风险。", es: "La pulpa está bien. El hueso contiene cianuro y es un peligro de asfixia." }, keywords: [] },
  { id: "orange", verdict: "limit", names: { en: "Orange (no peel/seeds)", "zh-hk": "橙（去皮去籽）", "zh-cn": "橙子（去皮去籽）", es: "Naranja (sin cáscara/semillas)" }, note: { en: "Flesh is non-toxic but acidic — limit small amounts. Peel can cause GI upset.", "zh-hk": "果肉無毒但酸性較強——只可少量食用。果皮可引致腸胃不適。", "zh-cn": "果肉无毒但酸性较强——仅限少量食用。果皮可引起肠胃不适。", es: "La pulpa no es tóxica pero es ácida — limítala a pequeñas cantidades. La cáscara puede causar malestar gastrointestinal." }, keywords: [] },
  { id: "lemon", verdict: "no", names: { en: "Lemon / Lime", "zh-hk": "檸檬／青檸", "zh-cn": "柠檬／青柠", es: "Limón / lima" }, note: { en: "Citric acid and essential oils can cause stomach upset and central nervous system depression.", "zh-hk": "檸檬酸及精油可引起腸胃不適及中樞神經系統抑制。", "zh-cn": "柠檬酸和精油可引起肠胃不适和中枢神经系统抑制。", es: "El ácido cítrico y los aceites esenciales pueden causar malestar estomacal y depresión del sistema nervioso central." }, keywords: ["lime"] },
  { id: "corn", verdict: "yes", names: { en: "Corn Kernels (no cob)", "zh-hk": "粟米粒（無芯）", "zh-cn": "玉米粒（无芯）", es: "Maíz desgranado (sin mazorca)" }, note: { en: "Plain corn kernels are safe. Never give the cob — it causes intestinal blockage.", "zh-hk": "原味粟米粒係安全嘅。切勿俾粟米芯——會引致腸道阻塞。", "zh-cn": "原味玉米粒是安全的。切勿喂玉米芯——会导致肠道阻塞。", es: "Los granos de maíz simples son seguros. Nunca des la mazorca — causa obstrucción intestinal." }, keywords: [] },
  { id: "edamame", verdict: "yes", names: { en: "Edamame", "zh-hk": "枝豆", "zh-cn": "毛豆", es: "Edamame" }, note: { en: "Plain unsalted edamame in moderation is fine.", "zh-hk": "原味無鹽枝豆適量食用沒問題。", "zh-cn": "原味无盐毛豆适量食用没问题。", es: "El edamame simple sin sal en moderación está bien." }, keywords: ["soy"] },
  { id: "honey", verdict: "limit", names: { en: "Honey", "zh-hk": "蜂蜜", "zh-cn": "蜂蜜", es: "Miel" }, note: { en: "Small amounts okay for adult dogs. Not for puppies or diabetic dogs due to botulism / sugar.", "zh-hk": "少量適合成年狗狗。幼犬或糖尿病狗狗不宜——因肉毒桿菌及含糖量問題。", "zh-cn": "少量适合成年狗狗。幼犬或糖尿病狗狗不宜——因肉毒杆菌及含糖量问题。", es: "Pequeñas cantidades están bien para perros adultos. No para cachorros ni perros diabéticos por el botulismo y el azúcar." }, keywords: [] },
  { id: "ice", verdict: "yes", names: { en: "Plain Ice Cubes", "zh-hk": "冰塊", "zh-cn": "冰块", es: "Cubos de hielo" }, note: { en: "Safe and refreshing. The old myth that ice causes bloat is unfounded.", "zh-hk": "安全且清涼。冰會引致胃脹氣嘅舊傳言是沒有根據嘅。", "zh-cn": "安全且清凉。冰块导致胃扩张的旧说法是没有根据的。", es: "Seguro y refrescante. El viejo mito de que el hielo causa hinchazón no tiene fundamento." }, keywords: [] },
  { id: "icecream", verdict: "limit", names: { en: "Ice Cream", "zh-hk": "雪糕", "zh-cn": "冰淇淋", es: "Helado" }, note: { en: "Dairy plus sugar plus possibly xylitol or chocolate. Look for dog-specific frozen treats instead.", "zh-hk": "乳製品加糖，還可能含木糖醇或朱古力。應選擇專為狗狗設計嘅冷凍零食代替。", "zh-cn": "乳制品加糖，还可能含木糖醇或巧克力。应选择专为狗狗设计的冷冻零食代替。", es: "Lácteos más azúcar más posiblemente xilitol o chocolate. Busca en cambio golosinas congeladas específicas para perros." }, keywords: [] },
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
      return f.names[locale].toLowerCase().includes(q) || f.names.en.toLowerCase().includes(q) || f.note[locale].toLowerCase().includes(q) || f.keywords.some((k) => k.includes(q)) || f.id.includes(q);
    });
  }, [query, filter, locale]);

  const content = LANGUAGES[locale];
  const articleContent = (ARTICLE_CONTENT as Record<string, any>)[locale] as typeof ARTICLE_CONTENT["en"];

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
                    <p className="mt-1 text-sm opacity-85">{f.note[locale]}</p>
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
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">{locale === "en" ? "Disclaimer:" : locale === "zh-hk" ? "\u514d\u8cac\u8072\u660e\uff1a" : locale === "zh-cn" ? "\u514d\u8d23\u58f0\u660e\uff1a" : "Aviso:"}</strong> {articleContent.articleDisclaimer}</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Dog className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">{articleContent.sidebarTitle}</h2><p className="text-sm text-amber-100/80">{articleContent.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
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
