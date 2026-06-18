import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Dog, Search } from "lucide-react";

const LANGUAGES = {
  en: { name: "English", title: "Dog Age Calculator (Human Years)", subtitle: "Convert your dog's age to human years using the UCSD DNA methylation formula and traditional methods.", searchLabel: "Search tools", searchPlaceholder: "Try: cat age, puppy weight, calories", reserveAd: "Google Ads space reserved", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "Advertisement", adBadge: "Reserved", dogAge: "Dog age (years)", size: "Dog size", small: "Small (<10 kg)", medium: "Medium (10-25 kg)", large: "Large (25-45 kg)", giant: "Giant (>45 kg)", ucsdLabel: "UCSD Epigenetic Formula", ucsdNote: "Based on DNA methylation patterns. Most accurate for modern dogs.", oldLabel: "Traditional × 7", oldNote: "The common myth — overestimates for adults.", akcLabel: "AKC Size-Adjusted", akcNote: "Accounts for breed size differences.", article1Title: "The \"× 7\" Myth and Why It's Wrong", article1Body: "For decades, the simple rule was: multiply your dog's age by 7 to get human years. But this was always an approximation — derived from comparing average human lifespan (~70 years) to average dog lifespan (~10 years). The math is simple but biologically inaccurate, especially for puppies and senior dogs.", article2Title: "The UCSD DNA Methylation Formula (2019)", article2Body1: "In 2019, researchers at the University of California San Diego published a landmark <em>Cell Systems</em> study showing that DNA methylation — a chemical marker that accumulates on genes with age — follows a predictable pattern in both dogs and humans. By comparing the methylation profiles of 104 Labrador Retrievers (from 4 weeks to 16 years) with human profiles, they derived this formula:", article2Formula: "human_age = 16 × ln(dog_age) + 31", article2Body2: "This formula better matches what we observe biologically: a 1-year-old dog corresponds to ~31 human years (matching reproductive maturity and full growth), a 4-year-old dog corresponds to ~53 human years (matching mid-life gradual decline), and a 14-year-old dog corresponds to ~73 human years (matching typical lifespan limits). The formula went viral when it was published in 2020 because it finally gave families a scientific answer.", article3Title: "Why Dog Size Matters: The AKC Approach", article3Body: "Large dogs age faster than small dogs. A Chihuahua can live 17 years; a Great Dane often only 7. To capture this, the American Kennel Club (AKC) publishes size-adjusted age tables. A 10-year-old Chihuahua equals ~56 human years; a 10-year-old Great Dane equals ~79 human years. The exact reason for the accelerated aging in large breeds is still debated, but theories involve elevated IGF-1 (Insulin-like Growth Factor-1) and increased cellular turnover rate.", faqTitle: "Frequently Asked Questions", faq1Q: "Which formula is most accurate?", faq1A: "For medium-sized dogs similar to Labs, the UCSD formula is the most biologically validated. For very small or very large dogs, the AKC size-adjusted table may be more practical because it captures known lifespan differences. The traditional × 7 method is the least accurate, and is mainly used because it's easy to calculate mentally.", faq2Q: "When is a dog considered \"senior\"?", faq2A: "Small dogs are generally considered senior at 10–11 years; medium dogs at 8–10; large dogs at 6–8; and giant breeds at 5–6. Senior status affects recommended diet, exercise level, and veterinary check-up frequency.", faq3Q: "What is the oldest dog on record?", faq3A: "The verified record is Bluey, an Australian Cattle Dog who lived 29 years and 5 months (1910-1939). More recently, Bobi, a Rafeiro do Alentejo from Portugal, was claimed to have lived to 31 — but his record was officially removed by Guinness in 2024 due to insufficient evidence. Most dogs that reach 16+ are small breeds or mixed breeds.", faq4Q: "Why was the UCSD study done only on Labradors?", faq4A: "Researchers needed a large, consistent sample to study methylation patterns, and Labrador Retrievers are the most popular breed in the US. Follow-up studies have since begun extending the model to other breeds, with adjustments for size and breed-specific aging rates. The UCSD authors note that their formula may need fine-tuning for breeds very different from Labradors.", sourceLabel: "Source:", sourceText: "Wang et al., \"Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome,\" <em>Cell Systems</em>, 2020. AKC age conversion tables, akc.org.", categoryBadge: "TinyToolboxes × Pets", humanYears: "human years", sidebarTitle: "Aging at a Glance", sidebarSubtitle: "Key life stages.", lifeStage1: "0-1 years — Rapid puppy growth, compressed teenage years.", lifeStage2: "1-2 years — Young adult, full social maturity.", lifeStage3: "3-6 years — Stable adulthood.", lifeStage4: "7+ years — Senior — increase wellness check-ups." },
"zh-hk": { name: "繁體中文", title: "狗狗年齡換算（人類年齡）", subtitle: "用 UCSD DNA 甲基化公式同傳統方法，計算狗狗對應嘅人類年齡。", searchLabel: "搜尋工具", searchPlaceholder: "例如：貓貓年齡、幼犬體重、卡路里", reserveAd: "預留 Google 廣告位", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "廣告", adBadge: "已預留", dogAge: "狗狗年齡（年）", size: "狗狗體型", small: "小型 (<10 kg)", medium: "中型 (10-25 kg)", large: "大型 (25-45 kg)", giant: "巨型 (>45 kg)", ucsdLabel: "UCSD 表觀遺傳公式", ucsdNote: "根據 DNA 甲基化模式。對現代狗最準確。", oldLabel: "傳統 × 7", oldNote: "傳統迷思 — 對成犬高估。", akcLabel: "AKC 體型調整", akcNote: "計入唔同體型嘅壽命差異。", article1Title: "\"× 7\" 迷思同點解佢錯", article1Body: "幾十年嚟，簡單嘅規則是：將狗狗年齡乘以 7 得到人類年齡。但呢個只係近似值 — 係比較平均人類壽命（約 70 年）同狗狗壽命（約 10 年）得出嚟。數學上簡單，但生物學上唔準確，尤其係幼犬同老年犬。", article2Title: "UCSD DNA 甲基化公式（2019）", article2Body1: "2019 年，加州大學聖地牙哥分校嘅研究人員發表了一篇研究，指出 DNA 甲基化 — 一種隨著年齡累積嘅化學標記 — 喺狗狗同人類都有可預測嘅模式。透過比較 104 隻拉布拉多犬（4 週至 16 歲）同人類嘅甲基化譜，佢哋得出呢個公式：", article2Formula: "human_age = 16 × ln(dog_age) + 31", article2Body2: "呢個公式更貼近生物學觀察：1 歲狗狗對應約 31 歲人類（對應生殖成熟同完全成長），4 歲狗狗對應約 53 歲人類（對應中年漸衰），14 歲狗狗對應約 73 歲人類（對應典型壽命上限）。公式喺 2020 年發表後爆紅，因為終於畀家庭一個科學答案。", article3Title: "狗狗體型點解重要：AKC 嘅方法", article3Body: "大型犬比小型犬衰老得快。吉娃娃可能活 17 年，大丹犬通常只活 7 年。為咗反映呢個現象，美國犬業俱樂部（AKC）出版體型調整嘅年齡表。10 歲吉娃娃約等於 56 歲人類；10 歲大丹犬約等於 79 歲人類。大型犬衰老加速嘅原因仲有爭議，但理論涉及 IGF-1（類似胰島素嘅生長因子）升高同細胞更新加快。", faqTitle: "常見問題", faq1Q: "邊個公式最準確？", faq1A: "對於類似拉布拉多嘅中型犬，UCSD 公式係最生物學驗證嘅。對於非常細或者非常大嘅狗狗，AKC 嘅體型調整表可能更實用，因為佢反映已知嘅壽命差異。傳統 × 7 方法係最唔準確嘅，但因為容易計算，所以常用。", faq2Q: "點算係「老年犬」？", faq2A: "小型犬通常喺 10–11 歲算係老年；中型犬喺 8–10 歲；大型犬喺 6–8 歲；巨型犬喺 5–6 歲。老年狀態會影響飲食建議、運動量同獸醫檢查頻率。", faq3Q: "有記錄嘅最老狗狗係邊隻？", faq3A: "經證實嘅記錄係 Bluey，一隻澳洲牧牛犬，活咗 29 年 5 個月（1910-1939）。最近，葡萄牙嘅 Rafeiro do Alentejo 犬 Bobi 被指活咗 31 歲，但 Guinness 喺 2024 年因證據不足將佢嘅記錄移除。大多數活到 16 歲以上嘅狗狗係小型犬或者混種。", faq4Q: "點解 UCSD 研究只係用拉布拉多？", faq4A: "研究人員需要一個大規模、一致嘅樣本來研究甲基化模式，而拉布拉多係美國最流行嘅犬種。後續研究開始將模型擴展到其他犬種，並根據體型同犬種特定衰老率調整。UCSD 作者指出，佢哋嘅公式可能需要針對與拉布拉多差異很大嘅犬種進行微調。", sourceLabel: "來源:", sourceText: "Wang et al., \"Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome,\" <em>Cell Systems</em>, 2020. AKC age conversion tables, akc.org.", categoryBadge: "TinyToolboxes · 寵物", humanYears: "人類年齡", sidebarTitle: "衰老概覽", sidebarSubtitle: "主要生命階段。", lifeStage1: "0-1 歲 — 幼犬快速成長，壓縮嘅青少年階段。", lifeStage2: "1-2 歲 — 年輕成年犬，社交成熟。", lifeStage3: "3-6 歲 — 穩定成年期。", lifeStage4: "7+ 歲 — 老年犬 — 增加健康檢查。", searchHintLabel: "搜尋工具" },
  "zh-cn": { name: "简体中文", title: "狗狗年龄换算（人类年龄）", subtitle: "用 UCSD DNA 甲基化公式和传统方法，计算狗狗对应的人类年龄。", searchLabel: "搜索工具", searchPlaceholder: "例如：猫咪年龄、幼犬体重、卡路里", reserveAd: "预留 Google 广告位", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "广告", adBadge: "已预留", dogAge: "狗狗年龄（年）", size: "狗狗体型", small: "小型 (<10 kg)", medium: "中型 (10-25 kg)", large: "大型 (25-45 kg)", giant: "巨型 (>45 kg)", ucsdLabel: "UCSD 表观遗传公式", ucsdNote: "基于 DNA 甲基化模式，对现代狗最准确。", oldLabel: "传统 × 7", oldNote: "传统迷思 — 对成犬高估。", akcLabel: "AKC 体型调整", akcNote: "考虑不同体型的寿命差异。", article1Title: "\"× 7\" 迷思及其错误原因", article1Body: "几十年来，经验法则很简单：将狗狗年龄乘以 7 得到人类年龄。但这只是一个近似值 — 它来自比较平均人类寿命（约 70 年）与狗狗寿命（约 10 年）。数学上简单，但生物学上不准确，尤其是对幼犬和老年犬。", article2Title: "UCSD DNA 甲基化公式（2019）", article2Body1: "2019 年，加州大学圣地亚哥分校的研究人员在 <em>Cell Systems</em> 发表了一项里程碑研究，指出 DNA 甲基化 — 一种随着年龄累积的化学物质 — 在狗狗和人类中都有可预测的模式。通过比较 104 只拉布拉多犬（4 周至 16 岁）与人类甲基化谱，他们推导出这个公式：", article2Formula: "human_age = 16 × ln(dog_age) + 31", article2Body2: "这个公式更符合生物学观察：1 岁狗狗对应约 31 岁人类（对应生殖成熟和完全成长），4 岁狗狗对应约 53 岁人类（对应中年逐渐衰退），14 岁狗狗对应约 73 岁人类（对应典型寿命上限）。该公式在 2020 年发表后爆红，因为它终于给家庭一个科学答案。", article3Title: "狗狗体型为何重要：AKC 的方法", article3Body: "大型犬比小型犬衰老得快。吉娃娃可能活 17 年，大丹犬通常只活 7 年。为了反映这一现象，美国犬业俱乐部（AKC）出版体型调整年龄表。10 岁吉娃娃约等于 56 岁人类；10 岁大丹犬约等于 79 岁人类。大型犬衰老加速的原因仍有争议，但理论涉及 IGF-1（类似胰岛素的生长因子）升高和细胞更新加快。", faqTitle: "常见问题", faq1Q: "哪个公式最准确？", faq1A: "对于类似拉布拉多的中型犬，UCSD 公式是最生物学验证的。对于非常小或非常大的狗狗，AKC 体型调整表可能更实用，因为它反映了已知的寿命差异。传统 × 7 方法是最不准确的，但因为容易计算，所以常用。", faq2Q: "什么时候算“老年犬”？", faq2A: "小型犬通常在 10–11 岁算老年；中型犬在 8–10 岁；大型犬在 6–8 岁；巨型犬在 5–6 岁。老年状态会影响饮食建议、运动量和兽医检查频率。", faq3Q: "有记录的最老狗狗是哪只？", faq3A: "经证实的记录是 Bluey，一只澳洲牧牛犬，活了 29 年 5 个月（1910-1939）。最近，葡萄牙的 Rafeiro do Alentejo 犬 Bobi 被指活了 31 岁，但 Guinness 在 2024 年因证据不足将其记录移除。大多数活到 16 岁以上的狗狗是小型犬或混种。", faq4Q: "为什么 UCSD 研究只针对拉布拉多？", faq4A: "研究人员需要一个大规模、一致的样本来研究甲基化模式，而拉布拉多是美国最流行的犬种。后续研究开始将模型扩展到其他犬种，并根据体型和犬种特定衰老率调整。UCSD 作者指出，他们的公式可能需要针对与拉布拉多差异很大的犬种进行微调。", sourceLabel: "来源:", sourceText: "Wang et al., \"Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome,\" <em>Cell Systems</em>, 2020. AKC age conversion tables, akc.org.", categoryBadge: "TinyToolboxes · 宠物", humanYears: "人类年龄", sidebarTitle: "衰老概览", sidebarSubtitle: "主要生命阶段。", lifeStage1: "0-1 岁 — 幼犬快速成长，压缩的青少年阶段。", lifeStage2: "1-2 岁 — 年轻成年犬，社交成熟。", lifeStage3: "3-6 岁 — 稳定成年期。", lifeStage4: "7+ 岁 — 老年犬 — 增加健康检查。", searchHintLabel: "搜索工具" },
  es: { name: "Español", title: "Calculadora de edad de perro en años humanos", subtitle: "Convierte la edad de tu perro a años humanos usando la fórmula epigenética UCSD y métodos tradicionales.", searchLabel: "Buscar herramientas", searchPlaceholder: "Prueba: edad gato, peso cachorro, calorías", reserveAd: "Espacio reservado para Google Ads", reserveAdSub: "之後可直接放 AdSense 程式碼。", adLabel: "Advertisement", adBadge: "Reserved", dogAge: "Edad del perro (años)", size: "Tamaño", small: "Pequeño (<10 kg)", medium: "Mediano (10-25 kg)", large: "Grande (25-45 kg)", giant: "Gigante (>45 kg)", ucsdLabel: "Fórmula epigenética UCSD", ucsdNote: "Basada en patrones de metilación del ADN.", oldLabel: "Tradicional × 7", oldNote: "El mito común — sobreestima en adultos.", akcLabel: "AKC ajustado por tamaño", akcNote: "Toma en cuenta el tamaño de raza.", article1Title: "El mito \"× 7\" y por qué es incorrecto", article1Body: "Durante décadas, la regla de oro fue simple: multiplicar la edad del perro por 7 para obtener el equivalente humano. Esto siempre fue una aproximación — se derivó de comparar la esperanza de vida humana promedio de unos 70 años con la del perro, de unos 10. La matemática es simple pero biológicamente inexacta, especialmente para cachorros y perros mayores.", article2Title: "La fórmula de metilación del ADN UCSD (2019)", article2Body1: "En 2019, investigadores de la Universidad de California San Diego publicaron un estudio en <em>Cell Systems</em> mostrando que la metilación del ADN — un marcador químico que se acumula en los genes con la edad — sigue un patrón predecible tanto en perros como en humanos. Comparando los perfiles de metilación de 104 Retrievers Labrador (de 4 semanas a 16 años) con humanos, derivaron esta fórmula:", article2Formula: "human_age = 16 × ln(edad_perro) + 31", article2Body2: "Esta fórmula coincide mejor con lo que vemos biológicamente: un perro de 1 año equivale a ~31 años humanos (coincide con madurez reproductiva y crecimiento completo), un perro de 4 años equivale a ~53 años humanos (coincide con el declive gradual de la vida media), y un perro de 14 años equivale a ~73 años humanos (coincide con límites típicos de esperanza de vida). La fórmula se volvió viral al publicarse en 2020 porque finalmente dio a las familias una respuesta científica.", article3Title: "Por qué importa el tamaño del perro: el enfoque AKC", article3Body: "Los perros grandes envejecen más rápido que los pequeños. Un Chihuahua puede vivir 17 años; un Gran Danés a menudo solo 7. Para capturar esto, el American Kennel Club publica tablas ajustadas por tamaño. Un Chihuahua de 10 años equivale a ~56 años humanos; un Gran Danés de 10 años equivale a ~79 años humanos. La razón exacta del envejecimiento acelerado en razas grandes sigue debatida, pero las teorías involucran IGF-1 (factor de crecimiento similar a la insulina 1) y mayor tasa de renovación celular.", faqTitle: "Preguntas frecuentes", faq1Q: "¿Cuál fórmula es más precisa?", faq1A: "Para razas medianas similares al Labrador, la fórmula UCSD es la más validada biológicamente. Para perros muy pequeños o muy grandes, la tabla AKC ajustada por tamaño puede ser más práctica porque captura diferencias conocidas de esperanza de vida. El método tradicional × 7 es el menos preciso y se usa principalmente porque es fácil de calcular mentalmente.", faq2Q: "¿Cuándo se considera \"senior\" a un perro?", faq2A: "Los perros pequeños suelen considerarse senior a los 10–11 años; los medianos a los 8–10; los grandes a los 6–8; y las razas gigantes a los 5–6. El estatus senior cambia la dieta recomendada, el nivel de ejercicio y la frecuencia de visitas veterinarias.", faq3Q: "¿Cuál es el perro más viejo registrado?", faq3A: "El registro verificado es Bluey, un Australian Cattle Dog que vivió 29 años y 5 meses (1910-1939). Más recientemente, Bobi, un Rafeiro do Alentejo de Portugal, se afirmó que vivió hasta 31 — pero su registro fue oficialmente eliminado por Guinness en 2024 debido a evidencia insuficiente. La mayoría de perros que alcanzan 16+ son pequeños o mestizos.", faq4Q: "¿Por qué el estudio UCSD solo fue en Labradors?", faq4A: "Los investigadores necesitaban una muestra grande y consistente para estudiar patrones de metilación, y los Retrievers Labrador son la raza más popular en EE.UU. Estudios posteriores han comenzado a extender el modelo a otras razas, con ajustes por tamaño y tasas de envejecimiento específicas de raza. Los autores de UCSD notan que su fórmula puede necesitar ajustes finos para razas muy diferentes de los Labradors.", sourceLabel: "Fuente:", sourceText: "Wang et al., \"Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome,\" <em>Cell Systems</em>, 2020. Tablas de conversión de edad AKC, akc.org.", categoryBadge: "TinyToolboxes · Mascotas", humanYears: "años humanos", sidebarTitle: "Envejecimiento a un vistazo", sidebarSubtitle: "Estadios principales de la vida.", lifeStage1: "0-1 años — Crecimiento rápido del cachorro, ~ años adolescentes comprimidos.", lifeStage2: "1-2 años — Adulto joven, madurez social completa.", lifeStage3: "3-6 años — Adultez estable.", lifeStage4: "7+ años — Senior — aumentar visitas de bienestar.", searchHintLabel: "Buscar herramientas" }
};

const TOOLS = [
  { title: { en: "Puppy Adult Weight Predictor", "zh-hk": "幼犬體重預測器", "zh-cn": "幼犬体重预测器", es: "Predictor de peso adulto de cachorro" }, description: { en: "Estimate puppy adult weight.", "zh-hk": "預測幼犬成年體重。", "zh-cn": "预测幼犬成年体重。", es: "Estima el peso adulto del cachorro." }, href: "/puppy-weight-predictor", keywords: ["puppy", "weight"] },
  { title: { en: "Pet Calorie Calculator", "zh-hk": "寵物卡路里計算機", "zh-cn": "宠物卡路里计算器", es: "Calculadora de calorias para mascotas" }, description: { en: "Daily calorie needs.", "zh-hk": "貓狗每日卡路里需求。", "zh-cn": "猫狗每日卡路里需求。", es: "Necesidades caloricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "Puede mi perro comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安唔安全畀狗。", "zh-cn": "查食物是否安全给狗。", es: "Busqueda de seguridad alimentaria." }, href: "/can-my-dog-eat", keywords: ["food"] },
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs.", "zh-hk": "朱古力對狗的可可鹼劑量。", "zh-cn": "巧克力对狗的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate"] },
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk for dogs.", "zh-hk": "木糖醇對狗的風險。", "zh-cn": "木糖醇对狗的风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol"] },
  { title: { en: "Lily Toxicity Checker", "zh-hk": "貓貓百合毒性檢查器", "zh-cn": "猫咪百合毒性检查器", es: "Comprobador de toxicidad del lirio" }, description: { en: "Which lilies harm cats.", "zh-hk": "邊種百合對貓有害。", "zh-cn": "哪种百合对猫有害。", es: "Que lirios danan a los gatos." }, href: "/lily-toxicity-checker", keywords: ["lily"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Convert cat age into human years.", "zh-hk": "貓", "zh-cn": "猫咪", es: "Gato" }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

// AKC chart for size-adjusted equivalents (years 1-16)
const AKC_TABLE: Record<string, number[]> = {
  small:  [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
  medium: [15, 24, 28, 33, 37, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87],
  large:  [15, 24, 28, 34, 38, 45, 49, 55, 61, 66, 72, 77, 82, 88, 93, 99],
  giant:  [12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 101, 108, 116, 123],
};

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/dog-age-calculator";

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

export default function DogAgeCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [dogAge, setDogAge] = useState("5");
  const [size, setSize] = useState<"small" | "medium" | "large" | "giant">("medium");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const result = useMemo(() => {
    const a = parseFloat(dogAge);
    if (isNaN(a) || a <= 0) return null;
    const ucsd = 16 * Math.log(a) + 31;
    const traditional = a * 7;
    const idx = Math.min(Math.max(Math.floor(a) - 1, 0), 15);
    const akc = AKC_TABLE[size][idx];
    return { ucsd, traditional, akc };
  }, [dogAge, size]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["貓貓年齡", "幼犬", "卡路里", "朱古力"] : locale === "zh-cn" ? ["猫咪年龄", "幼犬", "卡路里", "巧克力"] : ["cat age", "puppy", "calorie", "chocolate"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Dog className="h-5 w-5 text-amber-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">{content.categoryBadge}</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-amber-400/70 bg-amber-400/15 text-amber-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.dogAge}</span>
                  <input type="number" min="0" step="0.1" value={dogAge} onChange={(e) => setDogAge(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60" />
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.size}</span>
                  <select value={size} onChange={(e) => setSize(e.target.value as typeof size)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-400/60">
                    <option value="small">{content.small}</option>
                    <option value="medium">{content.medium}</option>
                    <option value="large">{content.large}</option>
                    <option value="giant">{content.giant}</option>
                  </select>
                </label>
              </div>

              {result && (
                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-neutral-900">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-75">{content.ucsdLabel} ⭐</p>
                    <p className="mt-2 text-4xl font-bold">{result.ucsd.toFixed(1)}</p>
                    <p className="text-sm opacity-75">{content.humanYears}</p>
                    <p className="mt-3 text-xs leading-5 opacity-85">{content.ucsdNote}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{content.akcLabel}</p>
                    <p className="mt-2 text-4xl font-bold text-white">{result.akc}</p>
                    <p className="text-sm text-white/55">{content.humanYears}</p>
                    <p className="mt-3 text-xs leading-5 text-white/55">{content.akcNote}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">{content.oldLabel}</p>
                    <p className="mt-2 text-4xl font-bold text-white/65">{result.traditional.toFixed(0)}</p>
                    <p className="text-sm text-white/55">{content.humanYears}</p>
                    <p className="mt-3 text-xs leading-5 text-white/55">{content.oldNote}</p>
                  </div>
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
                <h2 className="text-2xl font-bold text-white">{content.article1Title}</h2>
                <p className="mt-3 leading-7">{content.article1Body}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.article2Title}</h2>
                <p className="mt-3 leading-7">{content.article2Body1}</p>
                <p className="mt-3 rounded-2xl border border-amber-400/30 bg-black/30 p-4 text-center font-mono text-lg text-amber-200">{content.article2Formula}</p>
                <p className="mt-3 leading-7">{content.article2Body2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.article3Title}</h2>
                <p className="mt-3 leading-7">{content.article3Body}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  <div><h3 className="font-semibold text-white">{content.faq1Q}</h3><p className="mt-1 text-white/70">{content.faq1A}</p></div>
                  <div><h3 className="font-semibold text-white">{content.faq2Q}</h3><p className="mt-1 text-white/70">{content.faq2A}</p></div>
                  <div><h3 className="font-semibold text-white">{content.faq3Q}</h3><p className="mt-1 text-white/70">{content.faq3A}</p></div>
                  <div><h3 className="font-semibold text-white">{content.faq4Q}</h3><p className="mt-1 text-white/70">{content.faq4A}</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85"><strong className="text-amber-200">{content.sourceLabel}</strong> {content.sourceText}</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Dog className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-amber-100/80">{content.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3"><strong>{content.lifeStage1}</strong></p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3"><strong>{content.lifeStage2}</strong></p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3"><strong>{content.lifeStage3}</strong></p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3"><strong>{content.lifeStage4}</strong></p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
