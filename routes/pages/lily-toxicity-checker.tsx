import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AlertTriangle, BadgeDollarSign, Cat, Search, Flower2 } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Lily Toxicity Checker for Cats",
    subtitle: "Search for lily species by common or scientific name to see if they're dangerous for cats. True lilies (Lilium and Hemerocallis) cause acute kidney failure — others are safer.",
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "You can drop AdSense code here later.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    emergency: "True Lilies Kill Cats",
    emergencyNote: "All parts of true lilies (Lilium and Hemerocallis species) — petals, leaves, pollen, stamens, and even the water in the vase — can cause acute kidney failure in cats within 24-72 hours. Even a tiny amount can be fatal. If your cat licked pollen off its fur or drank from a vase with cut lilies, go to an emergency vet immediately. Do not wait for symptoms.",
    deadly: "Deadly — Emergency vet NOW",
    mild: "Mild — May irritate, not lethal",
    safe: "Safe — Non-toxic",
    searchLabel: "Search lily species",
    searchPlaceholder: "Try: Easter, Tiger, Peace, Calla, Stargazer",
    noMatch: "No match. Try \"easter\", \"calla\", or \"peace\".",
    toolSearchLabel: "Search tools",
    toolSearchPlaceholder: "Search tools",
    sidebarTitle: "Cat-safe living",
    sidebarSubtitle: "Prevention matters most.",
    sidebarTip1: "Avoid bouquets that contain any Lilium or Hemerocallis varieties.",
    sidebarTip2: "Tell florists you have a cat before they arrange a delivery.",
    sidebarTip3: "Treatment within 6 hours gives the best prognosis.",
    article1Title: "True Lilies vs Lookalikes",
    article1P1: "\"Lily\" is a loose word in everyday language. To a cat owner, it should mean one specific thing: any plant in the genus <em>Lilium</em> (true lilies) or <em>Hemerocallis</em> (daylilies). Every part of these plants — petals, leaves, stems, pollen, even the water in a vase — contains an unidentified nephrotoxic compound that causes acute kidney failure in cats. As little as two petals, or grooming pollen from fur, can be fatal without treatment.",
    article1P2: "Many flowers called \"lily\" are not actually toxic in this way. Peace lily (Spathiphyllum), calla lily (Zantedeschia), and Peruvian lily (Alstroemeria) are different plant families. They contain calcium oxalates or mild irritants that cause drooling and stomach upset but do not damage the kidneys. Lily of the valley (Convallaria) is its own danger \u2014 it contains cardiac glycosides that affect the heart, not the kidneys.",
    article2Title: "Why Are Cats Uniquely Vulnerable?",
    article2P1: "The exact mechanism is still being researched, but cats — and only cats among common pets — develop nephrotoxic damage from Lilium and Hemerocallis exposure. Dogs, rabbits, and rodents do not show the same kidney injury. Within 12–24 hours of ingestion, the cat's renal tubular cells begin to die; if untreated by 18 hours, the kidney damage is often permanent. Survival rates are excellent (above 90%) when treatment begins within 6 hours of exposure, but drop dramatically after 24 hours.",
    articleTreatTitle: "What Treatment Looks Like",
    articleTreatP1: "Veterinarians will induce vomiting if exposure is recent, administer activated charcoal, and start aggressive intravenous fluid therapy for at least 48–72 hours to flush the kidneys and maintain urine output. Blood work is monitored to track kidney values (BUN, creatinine, SDMA). In severe cases, hemodialysis can be used. Cats that survive may have permanent renal compromise requiring lifelong management.",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "My cat brushed against a lily but didn't eat it — is that dangerous?",
    faq1A: "It can be. Cats groom themselves constantly, and pollen that lands on the fur is licked off and ingested. Even small amounts of pollen are enough to cause kidney injury. Bathe the cat to remove any pollen and call a veterinarian for advice regardless of whether you saw the cat ingest anything.",
    faq2Q: "What signs of lily poisoning should I watch for?",
    faq2A: "Early signs (within 0–12 hours): drooling, vomiting, loss of appetite, lethargy. Later signs (12–72 hours): increased then decreased urination, dehydration, seizures, and collapse as kidney failure progresses. Do not wait for these signs — by the time later signs appear, the kidneys may already be irreparably damaged.",
    faq3Q: "Are lilies dangerous to dogs?",
    faq3A: "Most true lilies cause only mild gastrointestinal upset in dogs — vomiting and diarrhea — without the kidney injury seen in cats. Lily of the valley, however, is dangerous to dogs because of its cardiac toxins. Always keep these plants out of any pet's reach.",
    faq4Q: "Can I keep lilies in a home with cats if they're out of reach?",
    faq4A: "It is risky. Cats jump higher and more deliberately than most owners expect, and pollen can drift onto countertops or fall to the floor. Veterinarians and the ASPCA strongly recommend that homes with cats avoid Lilium and Hemerocallis entirely — choose cat-safe alternatives like orchids, roses, sunflowers, or African violets.",
    disclaimer: "This tool is for informational purposes only. Always seek the advice of a licensed veterinarian for any suspected pet poisoning.",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "貓貓百合毒性檢查器",
    subtitle: "用常見名或學名搜尋百合品種，確認對貓有冇危險。真正百合（Lilium 同 Hemerocallis）會引致急性腎衰竭 — 其他品種較安全。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    emergency: "真百合會殺貓",
    emergencyNote: "真正百合（Lilium 同 Hemerocallis 品種）嘅所有部分 — 花瓣、葉、花粉、雄蕊，甚至花瓶入面嘅水 — 都可以喺 24-72 小時內引致貓貓急性腎衰竭。即使極微量都可能致命。如果貓貓舔咗身上嘅花粉或者飲咗插花嘅水，立即去急診。唔好等症狀出現。",
    deadly: "致命 — 立即去急診",
    mild: "輕微 — 可能刺激，不致致命",
    safe: "安全 — 無毒",
    searchLabel: "搜尋百合品種",
    searchPlaceholder: "例如：復活節、虎、和平、馬蹄蓮、星佳沙",
    noMatch: "無匹配。試「復活節」、「馬蹄蓮」或「和平」.",
    toolSearchLabel: "搜尋工具",
    toolSearchPlaceholder: "搜尋工具",
    sidebarTitle: "貓貓安全生活",
    sidebarSubtitle: "預防最重要。",
    sidebarTip1: "避免使用包含任何 Lilium 或 Hemerocallis 品種嘅花束。",
    sidebarTip2: "同花店講你有貓，佢哋先安排送貨。",
    sidebarTip3: "喺 6 小時內治療，預後最好。",
    article1Title: "真百合同似百合嘅分別",
    article1P1: "\"百合\"係日常語言嘅模糊詞。對貓貓主人嚟講，應該指特定嘅植物：屬 <em>Lilium</em>（真百合）或 <em>Hemerocallis</em>（萱草）嘅任何植物。這些植物嘅所有部分——花瓣、葉、莖、花粉，甚至花瓶入面嘅水——都含有未確認嘅腎毒性化合物，會令貓貓急性腎衰竭。少少花瓣，或者喺毛上嘅花粉，都可能致命。",
    article1P2: "好多叫「百合」嘅花其實唔係咁樣有毒。和平百合（Spathiphyllum）、馬蹄蓮（Zantedeschia）同秘魯百合（Alstroemeria）係唔同嘅植物科。佢哋含有草酸鈣或輕微刺激物，會引起流口水同腸胃不適，但唔會傷腎。鈴蘭（Convallaria）係另一種危險——佢含有強心苷，會影響心臟，唔係腎臟。",
    article2Title: "點解貓貓特別易受影響？",
    article2P1: "準確機制仲喺研究，但貓貓——同其他常見寵物相比，只有貓貓——會因為接觸 Lilium 同 Hemerocallis 而受腎毒性傷害。狗、兔同嚙齒類動物唔會受同樣腎臟傷害。喺攝入後 12–24 小時內，貓貓嘅腎小管細胞開始死亡；如果喺 18 小時內唔治療，腎臟傷害通常係永久。喺接觸後 6 小時內開始治療，存活率好高（超過 90%），但喺 24 小時後會急劇下降。",
    articleTreatTitle: "治療點樣進行",
    articleTreatP1: "獸醫會喺接觸後嘅近期內催吐，給予活性炭，同埋開始積極嘅靜脈輸液治療至少 48–72 小時，以沖洗腎臟同維持尿量。血液檢查會追蹤腎臟指標（BUN、肌酐、SDMA）。喺嚴重情況，可以用血液透析。存活嘅貓貓可能會有永久嘅腎臟問題，需要終身管理。",
    faqTitle: "常見問題",
    faq1Q: "貓貓接觸咗百合但唔係食咗——係咪危險？",
    faq1A: "係。貓貓會不斷理毛，喺毛上嘅花粉會被舔食。少少花粉都足以令貓貓腎臟受傷。要洗貓貓，同埋無論有冇見到貓貓食咗咩，都要聯絡獸醫。",
    faq2Q: "點樣識貓貓中毒？",
    faq2A: "早期症狀（喺 0–12 小時內）：流口水、嘔吐、唔食、無精打采。後期症狀（喺 12–72 小時內）：先係尿多，後係尿少、脫水、抽搐、同埋因為腎衰竭而暈倒。唔好等症狀出現——喺後期症狀出現嗰陣，腎臟可能已經係永久受損。",
    faq3Q: "百合對狗係咪危險？",
    faq3A: "大多數真百合只會令狗嘅腸胃輕微不適——嘔吐同腹瀉——唔會令狗嘅腎臟受傷。鈴蘭對狗係危險嘅，因為佢有強心苷。要將這些植物放遠啲。",
    faq4Q: "如果百合喺貓貓夠唔到嘅地方，我可以放喺屋企嗎？",
    faq4A: "係咪危險。貓貓跳得高，同埋比主人預期嘅更刻意，花粉可能會飄到台面或者掉到地板。獸醫同 ASPCA 強烈建議有貓貓嘅屋企完全避免 Lilium 同 Hemerocallis——選擇貓貓安全嘅替代植物，例如蘭花、玫瑰、向日葵，或者非洲紫羅蘭。",
    disclaimer: "本工具只係供參考。任何懷疑寵物中毒，都要諮詢持牌獸醫。",
  },
  "zh-cn": {
    name: "简体中文",
    title: "猫咪百合毒性检查器",
    subtitle: "用常见名或学名搜索百合品种，确认对猫有无危险。真正百合（Lilium 和 Hemerocallis）会引起急性肾衰竭 — 其他品种较安全。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    emergency: "真百合会杀猫",
    emergencyNote: "真正百合（Lilium 和 Hemerocallis 品种）的所有部分 — 花瓣、叶、花粉、雄蕊，甚至花瓶里的水 — 都可以在 24-72 小时内引起猫咪急性肾衰竭。即使极微量都可能致命。如果猫咪舔了身上的花粉或者喝了插花的水，立即去急诊。不要等出现症状。",
    deadly: "致命 — 立即去急诊",
    mild: "轻微 — 可能刺激，不致致命",
    safe: "安全 — 无毒",
    searchLabel: "搜索百合品种",
    searchPlaceholder: "例如：复活节、虎、和平、马蹄莲、星佳沙",
    noMatch: "无匹配。试 \"easter\", \"calla\", 或 \"peace\".",
    toolSearchLabel: "搜索工具",
    toolSearchPlaceholder: "搜索工具",
    sidebarTitle: "猫咪安全生活",
    sidebarSubtitle: "预防最重要。",
    sidebarTip1: "避免使用包含任何 Lilium 或 Hemerocallis 品种的花束。",
    sidebarTip2: "在花店订购前告知你有猫。",
    sidebarTip3: "6 小时内治疗预后最好。",
    article1Title: "真百合与相似植物的区别",
    article1P1: "\"百合\"是日常语言中的模糊词。对猫主人来说，应该指特定植物：属 <em>Lilium</em>（真百合）或 <em>Hemerocallis</em>（萱草）的任何植物。这些植物的所有部分——花瓣、叶、茎、花粉，甚至花瓶里的水——都含有未确认的肾毒性化合物，会导致猫咪急性肾衰竭。少量花瓣或毛上的花粉都可能致命。",
    article1P2: "许多叫「百合」的花其实不是这样有毒。和平百合（Spathiphyllum）、马蹄莲（Zantedeschia）和秘鲁百合（Alstroemeria）是不同的植物科。它们含有草酸钙或轻微刺激物，会引起流口水和肠胃不适，但不会伤肾。铃兰（Convallaria）是另一种危险——它含有强心苷，会影响心脏，不是肾脏。",
    article2Title: "为什么猫咪特别易受伤害？",
    article2P1: "准确机制仍在研究中，但猫咪——和其他常见宠物相比，只有猫咪——会因为接触 Lilium 和 Hemerocallis 而受到肾毒性伤害。狗、兔子和啮齿类动物不会受到同样的肾脏损伤。在摄入后 12–24 小时内，猫咪的肾小管细胞开始死亡；如果在 18 小时内未治疗，肾脏损伤通常是永久性的。在接触后 6 小时内开始治疗，存活率很高（超过 90%），但在 24 小时后急剧下降。",
    articleTreatTitle: "治疗过程",
    articleTreatP1: "兽医会在接触后近期催吐，给予活性炭，并开始积极的静脉输液治疗至少 48–72 小时，以冲洗肾脏并维持尿量。血液检查会追踪肾脏指标（BUN、肌酐、SDMA）。在严重情况下，可以使用血液透析。存活的猫咪可能会有永久性的肾脏问题，需要终身管理。",
    faqTitle: "常见问题",
    faq1Q: "猫咪接触了百合但没有吃——是否危险？",
    faq1A: "是的。猫咪会不断理毛，落在毛上的花粉会被舔食。少量花粉足以导致肾脏损伤。要洗澡去除花粉，并联系兽医，无论是否看到猫咪摄入任何东西。",
    faq2Q: "应该观察哪些百合中毒症状？",
    faq2A: "早期症状（0–12 小时内）：流口水、呕吐、食欲减退、精神萎靡。后期症状（12–72 小时内）：先尿多后尿少、脱水、抽搐、以及因肾衰竭而晕倒。不要等待这些症状——当后期症状出现时，肾脏可能已经永久受损。",
    faq3Q: "百合对狗是否危险？",
    faq3A: "大多数真百合只会引起狗轻微胃肠道不适——呕吐和腹泻——不会像猫咪那样造成肾脏损伤。铃兰对狗是危险的，因为它含有强心苷。要将这些植物放在宠物够不到的地方。",
    faq4Q: "如果百合在猫咪够不到的地方，我可以放在家里吗？",
    faq4A: "有风险。猫咪跳得更高，比大多数主人预期的更刻意，花粉可能会飘到台面或掉到地板。兽医和 ASPCA 强烈建议有猫咪的家庭完全避免 Lilium 和 Hemerocallis——选择猫咪安全的替代植物，如兰花、玫瑰、向日葵或非洲紫罗兰。",
    disclaimer: "本工具仅供信息参考。任何怀疑宠物中毒，都要咨询持牌兽医。",
  },
  es: {
    name: "Español",
    title: "Comprobador de toxicidad de lirios para gatos",
    subtitle: "Busca especies de lirio por nombre común o científico para ver si son peligrosas para gatos. Los lirios verdaderos (Lilium y Hemerocallis) causan insuficiencia renal aguda — otros son más seguros.",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "Puedes insertar AdSense aquí más adelante.",
    adLabel: "Publicidad",
    adBadge: "Reservado",
    emergency: "Los lirios verdaderos matan gatos",
    emergencyNote: "Todas las partes de los lirios verdaderos (especies Lilium y Hemerocallis) — pétalos, hojas, polen, estambres e incluso el agua del jarrón — pueden causar insuficiencia renal aguda en gatos en 24-72 horas. Incluso una cantidad minúscula puede ser fatal. Si tu gato se lamió polen del pelaje o bebió del jarrón con lirios, ve a un veterinario de urgencia inmediatamente. No esperes a los síntomas.",
    deadly: "Mortal — Veterinario urgente YA",
    mild: "Leve — Puede irritar, no letal",
    safe: "Seguro — No tóxico",
    searchLabel: "Buscar especie de lirio",
    searchPlaceholder: "Prueba: Pascua, Tigre, Paz, Cala, Stargazer",
    noMatch: "No hay coincidencia. Prueba \"easter\", \"calla\", o \"peace\".",
    toolSearchLabel: "Buscar herramientas",
    toolSearchPlaceholder: "Buscar herramientas",
    sidebarTitle: "Vida segura para gatos",
    sidebarSubtitle: "La prevención es lo más importante.",
    sidebarTip1: "Evita ramos que contengan cualquier variedad de Lilium o Hemerocallis.",
    sidebarTip2: "Avísales que tienes un gato antes de que organicen la entrega.",
    sidebarTip3: "El tratamiento dentro de las 6 horas da el mejor pronóstico.",
    article1Title: "Lirios verdaderos vs. similares",
    article1P1: "\"Lirio\" es una palabra vaga en el lenguaje cotidiano. Para un dueño de gato, debería significar algo específico: cualquier planta del género <em>Lilium</em> (lirios verdaderos) o <em>Hemerocallis</em> (lirios de día). Todas las partes de estas plantas — pétalos, hojas, tallos, polen, incluso el agua en un jarrón — contienen un compuesto nefrotóxico no identificado que causa insuficiencia renal aguda en gatos. Tan solo dos pétalos, o el polen en el pelaje, pueden ser fatales sin tratamiento.",
    article1P2: "Muchas flores llamadas \"lirio\" no son realmente tóxicas de esta manera. El lirio de la paz (Spathiphyllum), la cala (Zantedeschia) y el lirio peruano (Alstroemeria) son familias de plantas diferentes. Contienen oxalatos de calcio o irritantes leves que causan babeo y malestar estomacal pero no dañan los riñones. El lirio del valle (Convallaria) es su propio peligro — contiene glucósidos cardíacos que afectan el corazón, no los riñones.",
    article2Title: "¿Por qué los gatos son vulnerables?",
    article2P1: "El mecanismo exacto aún se está investigando, pero los gatos — y solo los gatos entre mascotas comunes — desarrollan daño nefrotóxico por exposición a Lilium y Hemerocallis. Los perros, conejos y roedores no muestran el mismo daño renal. Dentro de las 12–24 horas de ingestión, las células tubulares renales del gato comienzan a morir; si no se trata en 18 horas, el daño renal suele ser permanente. Las tasas de supervivencia son excelentes (por encima del 90%) cuando el tratamiento comienza dentro de las 6 horas de exposición, pero caen drásticamente después de las 24 horas.",
    articleTreatTitle: "¿Cómo se ve el tratamiento?",
    articleTreatP1: "Los veterinarios inducirán el vómito si la exposición es reciente, administrarán carbón activado y comenzarán terapia intravenosa agresiva por al menos 48–72 horas para limpiar los riñones y mantener la producción de orina. Se monitorea el trabajo de sangre para rastrear valores renales (BUN, creatinina, SDMA). En casos graves, se puede usar hemodiálisis. Los gatos que sobreviven pueden tener compromiso renal permanente que requiere manejo de por vida.",
    faqTitle: "Preguntas frecuentes",
    faq1Q: "Mi gato se tocó un lirio pero no lo comió — ¿es peligroso?",
    faq1A: "Sí. Los gatos se limpian constantemente, y el polen que cae en el pelaje se lamió e ingerido. Incluso pequeñas cantidades de polen son suficientes para causar daño renal. Baña al gato para remover cualquier polen y llama a un veterinario para consejos, sin importar si viste al gato ingerir algo.",
    faq2Q: "¿Qué signos de envenenamiento por lirio debo vigilar?",
    faq2A: "Signos tempranos (dentro de 0–12 horas): babeo, vómitos, pérdida de apetito, letargo. Signos tardíos (12–72 horas): aumento luego disminución de la micción, deshidratación, convulsiones y colapso a medida que progresa la insuficiencia renal. No esperes estos signos — cuando aparecen, los riñones pueden ya estar irreparablemente dañados.",
    faq3Q: "¿Son peligrosos los lirios para perros?",
    faq3A: "La mayoría de los lirios verdaderos causan solo malestar gastrointestinal leve en perros — vómitos y diarrea — sin el daño renal visto en gatos. El lirio del valle, sin embargo, es peligroso para perros por sus toxinas cardíacas. Mantén estas plantas fuera del alcance de cualquier mascota.",
    faq4Q: "¿Puedo mantener lirios en un hogar con gatos si están fuera del alcance?",
    faq4A: "Es riesgoso. Los gatos saltan más alto y con más deliberación que los dueños esperan, y el polen puede flotar sobre encimeras o caer al suelo. Los veterinarios y la ASPCA recomiendan fuertemente que los hogares con gatos eviten completamente Lilium y Hemerocallis — elige alternativas seguras para gatos como orquídeas, rosas, girasoles o violetas africanas.",
    disclaimer: "Esta herramienta es solo para fines informativos. Siempre busca el consejo de un veterinario licenciado para cualquier sospecha de envenenamiento en mascotas.",
  },
};

const TOOLS = [
  { title: { en: "Chocolate Toxicity Calculator", "zh-hk": "朱古力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose for dogs.", "zh-hk": "朱古力對狗嘅可可鹼劑量。", "zh-cn": "巧克力对狗的可可碱剂量。", es: "Dosis de teobromina para perros." }, href: "/chocolate-toxicity-calculator", keywords: ["chocolate", "dog"] },
  { title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk for dogs.", "zh-hk": "木糖醇對狗嘅風險。", "zh-cn": "木糖醇对狗的风险。", es: "Riesgo de xilitol para perros." }, href: "/xylitol-toxicity-calculator", keywords: ["xylitol", "dog"] },
  { title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機 (RER)", "zh-cn": "宠物卡路里计算器 (RER)", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie needs.", "zh-hk": "貓狗每日卡路里需求。", "zh-cn": "猫狗每日卡路里需求。", es: "Necesidades calóricas diarias." }, href: "/pet-calorie-calculator", keywords: ["calorie", "rer"] },
  { title: { en: "Can My Dog Eat This?", "zh-hk": "狗狗可以食呢樣嗎？", "zh-cn": "狗狗可以吃这个吗？", es: "¿Mi perro puede comer esto?" }, description: { en: "Food safety lookup.", "zh-hk": "查食物安唔安全畀狗。", "zh-cn": "查食物是否安全给狗。", es: "Búsqueda de seguridad alimentaria." }, href: "/can-my-dog-eat", keywords: ["food", "dog"] },
  { title: { en: "Dog Age in Human Years", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Edad de perro en años humanos" }, description: { en: "UCSD age formula.", "zh-hk": "用 UCSD 公式計狗年齡。", "zh-cn": "用 UCSD 公式计算狗年龄。", es: "Fórmula UCSD de edad canina." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
  { title: { en: "Cat Age in Human Years", "zh-hk": "貓貓年齡換算（人類年齡）", "zh-cn": "猫咪年龄换算（人类年龄）", es: "Edad de gato en años humanos" }, description: { en: "Cat age conversion.", "zh-hk": "貓年齡換算人類年齡。", "zh-cn": "猫年龄换算人类年龄。", es: "Conversión de edad felina." }, href: "/cat-age-calculator", keywords: ["cat", "age"] },
];

type Level = "deadly" | "mild" | "safe";

const LILIES: Array<{ id: string; level: Level; names: { en: string; "zh-hk": string; "zh-cn": string; es: string }; scientific: string; note: { en: string; "zh-hk": string; "zh-cn": string; es: string }; keywords: string[] }> = [
  { id: "easter", level: "deadly", names: { en: "Easter Lily", "zh-hk": "復活節百合", "zh-cn": "复活节百合", es: "Lirio de Pascua" }, scientific: "Lilium longiflorum", note: { en: "All parts of the plant including pollen and vase water cause acute kidney failure in cats.", "zh-hk": "植物所有部分包括花粉同花瓶水都會令貓貓急性腎衰竭。", "zh-cn": "植物所有部分包括花粉和花瓶水都会导致猫咪急性肾衰竭。", es: "Todas las partes de la planta, incluido el polen y el agua del jarrón, causan insuficiencia renal aguda en gatos." }, keywords: ["easter", "lilium", "longiflorum"] },
  { id: "tiger", level: "deadly", names: { en: "Tiger Lily", "zh-hk": "虎百合", "zh-cn": "虎百合", es: "Lirio tigre" }, scientific: "Lilium lancifolium / tigrinum", note: { en: "Highly toxic. Even tiny ingestions can cause renal failure within 24-72 hours.", "zh-hk": "劇毒。即使極少量攝入都可喺 24-72 小時內引起腎衰竭。", "zh-cn": "剧毒。即使极少量摄入都可在 24-72 小时内引起肾衰竭。", es: "Altamente tóxico. Incluso ingestiones mínimas pueden causar insuficiencia renal en 24-72 horas." }, keywords: ["tiger", "lancifolium", "tigrinum"] },
  { id: "asiatic", level: "deadly", names: { en: "Asiatic Lily", "zh-hk": "亞洲百合", "zh-cn": "亚洲百合", es: "Lirio asiático" }, scientific: "Lilium hybrid (Asiatic group)", note: { en: "Common cut-flower lily. All parts highly toxic to cats.", "zh-hk": "常見切花百合。所有部分對貓都係高度有毒。", "zh-cn": "常见切花百合。所有部分对猫都高度有毒。", es: "Lirio de flor cortada común. Todas las partes son altamente tóxicas para los gatos." }, keywords: ["asiatic", "lilium"] },
  { id: "oriental", level: "deadly", names: { en: "Oriental Lily / Stargazer", "zh-hk": "東方百合／星佳沙", "zh-cn": "东方百合", es: "Lirio oriental / Stargazer" }, scientific: "Lilium hybrid (Oriental group)", note: { en: "Stargazer is a popular florist variety. Acutely nephrotoxic.", "zh-hk": "星佳沙係花店熱門品種。急性腎毒性。", "zh-cn": "星佳沙是花店热门品种。急性肾毒性。", es: "Stargazer es una variedad popular de floristería. Agudamente nefrotóxico." }, keywords: ["oriental", "stargazer", "lilium"] },
  { id: "daylily", level: "deadly", names: { en: "Daylily", "zh-hk": "萱草", "zh-cn": "萱草", es: "Hemerocalis" }, scientific: "Hemerocallis species", note: { en: "Not a true Lilium, but equally toxic to cats — also causes acute kidney failure.", "zh-hk": "雖然唔係真正嘅 Lilium，但對貓一樣有毒——同樣引起急性腎衰竭。", "zh-cn": "虽然不是真正的 Lilium，但对猫一样有毒——同样引起急性肾衰竭。", es: "No es un verdadero Lilium, pero es igualmente tóxico para los gatos — también causa insuficiencia renal aguda." }, keywords: ["daylily", "hemerocallis"] },
  { id: "rubrum", level: "deadly", names: { en: "Rubrum / Japanese Show Lily", "zh-hk": "鹿子百合", "zh-cn": "鹿子百合", es: "Lirio Rubrum" }, scientific: "Lilium speciosum", note: { en: "Same toxicity profile as other Lilium species.", "zh-hk": "同其他 Lilium 品種毒性相同。", "zh-cn": "与其他 Lilium 品种毒性相同。", es: "Mismo perfil de toxicidad que otras especies de Lilium." }, keywords: ["rubrum", "speciosum"] },
  { id: "wood", level: "deadly", names: { en: "Wood Lily", "zh-hk": "森林百合", "zh-cn": "森林百合", es: "Lirio de bosque" }, scientific: "Lilium philadelphicum", note: { en: "Wild North American Lilium. Toxic to cats.", "zh-hk": "北美野生 Lilium。對貓有毒。", "zh-cn": "北美野生 Lilium。对猫有毒。", es: "Lilium silvestre de Norteamérica. Tóxico para los gatos." }, keywords: ["wood", "philadelphicum"] },
  { id: "redstar", level: "deadly", names: { en: "Red Star Lily / Stargazer Lily", "zh-hk": "紅色星佳沙", "zh-cn": "红星百合", es: "Lirio estrella roja" }, scientific: "Lilium hybrid", note: { en: "Oriental hybrid. Same renal toxicity.", "zh-hk": "東方雜交品種。同樣有腎毒性。", "zh-cn": "东方杂交品种。同样有肾毒性。", es: "Híbrido oriental. Misma toxicidad renal." }, keywords: ["star", "red", "lilium"] },
  { id: "calla", level: "mild", names: { en: "Calla Lily", "zh-hk": "馬蹄蓮", "zh-cn": "马蹄莲", es: "Cala" }, scientific: "Zantedeschia aethiopica", note: { en: "NOT a true lily. Contains insoluble calcium oxalates causing oral irritation, drooling, vomiting. Not nephrotoxic.", "zh-hk": "唔係真正嘅百合。含不溶性草酸鈣，會引起口腔刺激、流口水、嘔吐。唔會傷腎。", "zh-cn": "不是真正的百合。含不溶性草酸钙，会引起口腔刺激、流口水、呕吐。不会伤肾。", es: "NO es un lirio verdadero. Contiene oxalatos de calcio insolubles que causan irritación oral, babeo, vómitos. No es nefrotóxico." }, keywords: ["calla", "zantedeschia"] },
  { id: "peace", level: "mild", names: { en: "Peace Lily", "zh-hk": "和平百合／白鶴芋", "zh-cn": "和平百合", es: "Lirio de la paz" }, scientific: "Spathiphyllum species", note: { en: "NOT a true lily. Calcium oxalate crystals cause mouth and throat irritation. Not fatal but uncomfortable.", "zh-hk": "唔係真正嘅百合。草酸鈣晶體引起口腔同喉嚨刺激。唔致命但會唔舒服。", "zh-cn": "不是真正的百合。草酸钙晶体引起口腔和喉咙刺激。不致命但会不舒服。", es: "NO es un lirio verdadero. Los cristales de oxalato de calcio causan irritación de boca y garganta. No es fatal pero es incómodo." }, keywords: ["peace", "spathiphyllum"] },
  { id: "peruvian", level: "mild", names: { en: "Peruvian Lily / Alstroemeria", "zh-hk": "秘魯百合", "zh-cn": "秘鲁百合", es: "Alstroemeria" }, scientific: "Alstroemeria species", note: { en: "NOT a true lily. May cause mild GI upset. Safer than true lilies but not 100% benign.", "zh-hk": "唔係真正嘅百合。可能引起輕微腸胃不適。比真百合安全但唔係 100% 無害。", "zh-cn": "不是真正的百合。可能引起轻微肠胃不适。比真百合安全但不是 100% 无害。", es: "NO es un lirio verdadero. Puede causar malestar gastrointestinal leve. Más seguro que los lirios verdaderos pero no 100% benigno." }, keywords: ["peruvian", "alstroemeria"] },
  { id: "lily_valley", level: "mild", names: { en: "Lily of the Valley", "zh-hk": "鈴蘭", "zh-cn": "铃兰", es: "Lirio del valle" }, scientific: "Convallaria majalis", note: { en: "NOT a true lily but contains cardiac glycosides. Can cause vomiting, arrhythmia, seizures. Different mechanism from Lilium.", "zh-hk": "唔係真正嘅百合但含強心苷。可能引起嘔吐、心律不正、抽搐。同 Lilium 嘅機制唔同。", "zh-cn": "不是真正的百合但含强心苷。可能引起呕吐、心律不齐、抽搐。与 Lilium 的机制不同。", es: "NO es un lirio verdadero pero contiene glucósidos cardíacos. Puede causar vómitos, arritmia, convulsiones. Mecanismo diferente al Lilium." }, keywords: ["valley", "convallaria"] },
  { id: "canna", level: "safe", names: { en: "Canna Lily", "zh-hk": "美人蕉", "zh-cn": "美人蕉", es: "Cana" }, scientific: "Canna species", note: { en: "NOT a true lily. Generally considered non-toxic to cats.", "zh-hk": "唔係真正嘅百合。一般認為對貓無毒。", "zh-cn": "不是真正的百合。一般认为对猫无毒。", es: "NO es un lirio verdadero. Generalmente se considera no tóxico para los gatos." }, keywords: ["canna"] },
  { id: "plantain", level: "safe", names: { en: "Plantain Lily / Hosta", "zh-hk": "玉簪", "zh-cn": "玉簪", es: "Hosta" }, scientific: "Hosta species", note: { en: "NOT a true lily — but Hostas can cause GI upset in dogs and cats. Not nephrotoxic.", "zh-hk": "唔係真正嘅百合——但玉簪可能會令貓狗腸胃不適。唔會傷腎。", "zh-cn": "不是真正的百合——但玉簪可能会让猫狗肠胃不适。不会伤肾。", es: "NO es un lirio verdadero — pero las Hostas pueden causar malestar gastrointestinal en perros y gatos. No es nefrotóxico." }, keywords: ["plantain", "hosta"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/lily-toxicity-checker";

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

export default function LilyToxicityChecker() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({ title: `${L.title} | TinyToolboxes`, description: L.subtitle, path: PAGE_PATH, jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "HealthApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } } });
  }, [locale]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LILIES;
    return LILIES.filter((l) => l.names[locale].toLowerCase().includes(q) || l.names.en.toLowerCase().includes(q) || l.scientific.toLowerCase().includes(q) || l.keywords.some((k) => k.includes(q)));
  }, [query, locale]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["朱古力", "木糖醇", "卡路里"] : locale === "zh-cn" ? ["巧克力", "木糖醇", "卡路里"] : ["chocolate", "xylitol", "calorie"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const colorFor = (level: Level) => level === "deadly" ? "from-red-500 to-rose-600 text-white border-red-400/30" : level === "mild" ? "from-amber-400 to-orange-500 text-neutral-900 border-amber-400/40" : "from-emerald-400 to-teal-500 text-neutral-900 border-emerald-400/40";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-amber-400/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-300/20"><Cat className="h-5 w-5 text-amber-300" /></div>
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
                <p className="mt-2 text-xs text-rose-200/70">ASPCA Animal Poison Control: <span className="font-semibold">(888) 426-4435</span></p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Flower2 className="h-4 w-4 text-amber-300" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="grid gap-3">
                {results.map((l) => (
                  <div key={l.id} className={`rounded-2xl border bg-gradient-to-br p-4 ${colorFor(l.level)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{l.names[locale]}</p>
                        <p className="text-xs opacity-75 italic">{l.scientific}</p>
                      </div>
                      <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{content[l.level]}</span>
                    </div>
                    <p className="mt-2 text-sm opacity-90">{l.note[locale]}</p>
                  </div>
                ))}
                {!results.length && <p className="text-sm text-white/50">{content.noMatch}</p>}
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.toolSearchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-amber-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.toolSearchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-amber-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.article1Title}</h2>
                <p className="mt-3 leading-7">{content.article1P1}</p>
                <p className="mt-3 leading-7">{content.article1P2}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.article2Title}</h2>
                <p className="mt-3 leading-7">{content.article2P1}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTreatTitle}</h2>
                <p className="mt-3 leading-7">{content.articleTreatP1}</p>
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
              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/85">{content.disclaimer}</div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-amber-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-amber-400/15 p-3"><Cat className="h-5 w-5 text-amber-300" /></div><div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-amber-100/80">{content.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-amber-100/80">
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{content.sidebarTip1}</p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{content.sidebarTip2}</p>
              <p className="rounded-2xl border border-amber-400/20 bg-black/30 px-4 py-3">{content.sidebarTip3}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
