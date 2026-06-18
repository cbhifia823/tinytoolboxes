import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, BadgeDollarSign, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Unit Converter",
    subtitle: "Convert between different units of measurement.",
    reserveAd: "Ad",
    fromLabel: "From",
    toLabel: "To",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    adLabel: "Advertisement",
    reserveAdSub: "Ad",
    adBadge: "AD",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "單位轉換器",
    subtitle: "喺唔同測量單位之間進行轉換。",
    reserveAd: "廣告",
    fromLabel: "從",
    toLabel: "到",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    adLabel: "廣告",
    reserveAdSub: "廣告",
    adBadge: "廣告",
  },
  "zh-cn": {
    name: "简体中文",
    title: "单位转换器",
    subtitle: "在不同测量单位之间进行转换。",
    reserveAd: "广告",
    fromLabel: "从",
    toLabel: "到",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    adLabel: "广告",
    reserveAdSub: "广告",
    adBadge: "广告",
  },
  es: {
    name: "Español",
    title: "Conversor de unidades",
    subtitle: "Convierte entre diferentes unidades de medida.",
    reserveAd: "Anuncio",
    fromLabel: "De",
    toLabel: "A",
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar herramientas...",
    adLabel: "Anuncio",
    reserveAdSub: "Anuncio",
    adBadge: "An.",
  },
};

type Category = { name: string; units: { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] };

const CATEGORIES: Record<string, Category> = {
  length: { name: "Length / 長度", units: [
    { key: "mm", label: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "cm", label: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: "m", label: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    { key: "km", label: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "in", label: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { key: "ft", label: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: "yd", label: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { key: "mi", label: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { key: "nmi", label: "Nautical Mile (nmi)", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ]},
  weight: { name: "Weight / 重量", units: [
    { key: "mg", label: "Milligram (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { key: "g", label: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "kg", label: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    { key: "t", label: "Metric Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "oz", label: "Ounce (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { key: "lb", label: "Pound (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: "st", label: "Stone (st)", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ]},
  temperature: { name: "Temperature / 溫度", units: [
    { key: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    { key: "f", label: "Fahrenheit (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { key: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ]},
  volume: { name: "Volume / 體積", units: [
    { key: "ml", label: "Milliliter (ml)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "l", label: "Liter (L)", toBase: (v) => v, fromBase: (v) => v },
    { key: "m3", label: "Cubic meter (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "fl_oz", label: "Fl. Ounce (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { key: "cup", label: "Cup (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { key: "pt", label: "Pint (US pt)", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { key: "qt", label: "Quart (US qt)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { key: "gal", label: "Gallon (US gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  ]},
  speed: { name: "Speed / 速度", units: [
    { key: "ms", label: "m/s", toBase: (v) => v, fromBase: (v) => v },
    { key: "kmh", label: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { key: "mph", label: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { key: "knots", label: "Knots", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ]},
  area: { name: "Area / 面積", units: [
    { key: "mm2", label: "mm²", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { key: "cm2", label: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { key: "m2", label: "m²", toBase: (v) => v, fromBase: (v) => v },
    { key: "km2", label: "km²", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { key: "ha", label: "Hectare (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { key: "ac", label: "Acre (ac)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { key: "ft2", label: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { key: "mi2", label: "mi²", toBase: (v) => v * 2.59e6, fromBase: (v) => v / 2.59e6 },
  ]},
};

const EDUCATION = {
  en: {
    sidebarTitle: "Categories",
    sidebarSubtitle: "6 unit categories.",
    categoryHeader: "Category",
    conversionHeader: "Conversion",
    sidebarItems: ["Length: mm, cm, m, km, in, ft, mi", "Weight: mg, g, kg, oz, lb, stone", "Temperature: °C, °F, K", "Volume, Speed, Area"],
    historyTitle: "A Brief History of Measurement Units",
    historyP1: "For most of human history, measurement units were based on the human body — a practical but deeply inconsistent approach. The cubit (the distance from elbow to fingertip) was used in ancient Egypt and Mesopotamia, but varied from person to person. The foot (literally the length of a human foot), the inch (width of a thumb), and the yard (distance from nose to outstretched thumb) are all relics of this era. Because these units differed by region, trade was frequently complicated by confusion over how much of something was actually being sold.",
    historyP2: "The solution came in stages. France introduced the metric system in 1795 following the French Revolution — defining the metre as one ten-millionth of the distance from the equator to the North Pole. In 1875, the Treaty of the Metre established an international bureau (the BIPM) and began the process of global standardisation. The modern SI (International System of Units), established in 1960, is the direct descendant of that effort and is now used by virtually every country in the world for science, medicine, engineering, and trade — with the United States being the most prominent holdout in everyday life.",
    metricTitle: "Metric vs Imperial: The Two Major Systems",
    metricIntro: "Today the world is largely divided between the metric system (used officially by 195+ countries) and the US Customary system (used in daily life in the US, with imperial variants in the UK for some measurements).",
    metricCardTitle: "Metric (SI)",
    metricCardDesc: "Base-10 system. Units scale by powers of ten using prefixes: kilo (×1000), centi (×0.01), milli (×0.001). Consistent and easy to calculate mentally. Used for science worldwide regardless of country.",
    imperialCardTitle: "US Customary / Imperial",
    imperialCardDesc: "Historically English. Conversions are arbitrary: 12 inches in a foot, 3 feet in a yard, 1,760 yards in a mile, 16 ounces in a pound, 8 pints in a gallon. Each conversion factor must be memorised.",
    conversionsTitle: "Key Conversion Factors to Know",
    conversionsIntro: "The following conversions are exact definitions or high-precision values used in science and commerce:",
    conversionRows: [
      { category: "Length", conversion: "1 inch = 2.54 cm (exact) · 1 mile = 1.609344 km · 1 foot = 30.48 cm" },
      { category: "Weight", conversion: "1 pound = 453.592 g · 1 ounce = 28.3495 g · 1 stone = 6.35029 kg" },
      { category: "Temperature", conversion: "°C = (°F − 32) × 5/9 · °F = °C × 9/5 + 32 · K = °C + 273.15" },
      { category: "Volume", conversion: "1 US gallon = 3.78541 L · 1 UK gallon = 4.54609 L · 1 fl oz (US) = 29.5735 ml" },
      { category: "Speed", conversion: "1 mph = 1.60934 km/h · 1 knot = 1.852 km/h · 1 m/s = 3.6 km/h" },
    ],
    tempTitle: "Why Temperature is Different",
    tempP1: "Length, weight, and volume conversions involve simple multiplication — you're just scaling along a ratio. Temperature is different because Celsius and Fahrenheit don't share the same zero point. Zero Celsius is 32°F (the freezing point of water), not zero degrees of \"cold.\" This offset requires an addition/subtraction step before or after the multiplication.",
    tempP2: "The Kelvin scale avoids this problem entirely: it starts at absolute zero (−273.15°C / −459.67°F), the coldest possible temperature. Because Kelvin and Celsius share the same degree size, converting between them is pure addition: K = °C + 273.15. The Rankine scale does the same for Fahrenheit: Ra = °F + 459.67. Kelvin and Rankine conversions are therefore pure multiplications (no offset needed).",
    tempP3: "A few temperature reference points worth remembering: 0°C = 32°F = 273.15K (water freezes) · 20°C = 68°F (comfortable room temperature) · 37°C = 98.6°F (human body temperature) · 100°C = 212°F = 373.15K (water boils at sea level).",
    mistakesTitle: "Common Unit Conversion Mistakes",
    mistakesItems: [
      { title: "Confusing US and UK gallons.", desc: "The US gallon (3.785 L) and the UK (imperial) gallon (4.546 L) differ by about 20%. A British recipe calling for \"1 gallon of milk\" means about 20% more than an American's gallon. This also affects MPG comparisons — UK cars typically show higher MPG figures than US cars for the same fuel efficiency." },
      { title: "Conflating mass and weight.", desc: "Mass (kg, grams) measures the amount of matter. Weight is a force (measured in Newtons) equal to mass × gravitational acceleration. On Earth, we use kg loosely for both, but an astronaut on the Moon has the same mass but weighs 1/6th as much. In engineering and physics, this distinction is critical." },
      { title: "The NASA Mars Orbiter disaster (1999).", desc: "The Mars Climate Orbiter was lost because one engineering team used metric units (Newton-seconds) while another used US Customary units (pound-force-seconds). The resulting trajectory error caused the spacecraft to enter Mars' atmosphere at the wrong angle and disintegrate — a $327 million mistake caused entirely by a unit conversion failure." },
    ],
    faqTitle: "Frequently Asked Questions",
    faqItems: [
      { q: "What is the difference between mass and weight?", a: "Mass is the amount of matter in an object, measured in kilograms (SI) or pounds-mass. It doesn't change based on location. Weight is the gravitational force acting on that mass, measured in Newtons. On Earth's surface, 1 kg of mass weighs approximately 9.81 Newtons. Informally, people use \"weight\" when they mean mass, which is acceptable in everyday contexts but not in physics or engineering." },
      { q: "Why does the United States still use imperial units?", a: "The US has attempted metric conversion multiple times — most notably the Metric Conversion Act of 1975 — but adoption remained voluntary and largely failed. The cost of converting existing infrastructure (road signs, tools, manufacturing equipment), combined with cultural resistance, has kept US Customary units dominant in daily life. US science, medicine, and the military do use metric. The US is one of only three countries (with Myanmar and Liberia) that have not officially adopted the metric system as the primary system." },
      { q: "How can I convert Celsius to Fahrenheit mentally?", a: "A useful approximation: double the Celsius value and add 30. So 20°C ≈ 40 + 30 = 70°F (actual: 68°F). Or 35°C ≈ 70 + 30 = 100°F (actual: 95°F). This is close enough for weather and cooking. For the exact formula: °F = °C × 9/5 + 32. Remember: 0°C = 32°F, 100°C = 212°F." },
      { q: "How do metric prefixes work?", a: "Metric prefixes are multipliers applied to any SI base unit. Common ones: kilo (k) = ×1,000 · centi (c) = ×0.01 · milli (m) = ×0.001 · micro (μ) = ×0.000001 · mega (M) = ×1,000,000 · giga (G) = ×1,000,000,000. So 1 kilometre = 1,000 metres, 1 centimetre = 0.01 metres, 1 milligram = 0.001 grams. The pattern is consistent across all units — length, weight, volume, electricity, etc." },
      { q: "Why are there two different gallons?", a: "The US gallon derives from the Queen Anne wine gallon (1706), which was defined as 231 cubic inches. The UK imperial gallon was defined later in 1824 as the volume of 10 pounds of water, which works out to approximately 277.4 cubic inches (4.546 litres). The US had already established its own standards before the British redefinition, so the two systems diverged. Today: 1 US gallon = 3.785 litres, 1 UK gallon = 4.546 litres." },
    ],
  },
  "zh-hk": {
    sidebarTitle: "分類",
    sidebarSubtitle: "6 個單位類別。",
    categoryHeader: "類別",
    conversionHeader: "換算",
    sidebarItems: ["長度：mm、cm、m、km、in、ft、mi", "重量：mg、g、kg、oz、lb、stone", "溫度：°C、°F、K", "體積、速度、面積"],
    historyTitle: "測量單位簡史",
    historyP1: "喺人類歷史嘅大部分時間，測量單位都係基於人體——一個實用但極之唔一致嘅方法。肘尺（由手肘到指尖嘅距離）喺古埃及同美索不達米亞被使用，但每個人嘅長度都唔同。英尺（字面意思即係人腳嘅長度）、英寸（拇指嘅寬度）、碼（由鼻尖到伸直拇指嘅距離）全部都係呢個時代嘅遺物。因為呢啲單位因地而異，貿易經常因為混淆實際上賣咗幾多而變得複雜。",
    historyP2: "解決方案逐步出現。法國喺 1795 年法國大革命後引入咗公制——將米定義為由赤道到北極距離嘅一千萬分之一。1875 年，《米制公約》成立咗國際計量局（BIPM），開始咗全球標準化嘅進程。現代國際單位制（SI）喺 1960 年建立，係呢個努力嘅直接後代，而家幾乎全世界每個國家都用佢嚟做科學、醫學、工程同貿易——而美國係日常生活中最顯著嘅例外。",
    metricTitle: "公制 vs 英制：兩大主要系統",
    metricIntro: "今日世界大致分為公制（195+ 個國家官方使用）同美制（美國日常生活中使用，英國某啲度量衡用英制變體）。",
    metricCardTitle: "公制（SI）",
    metricCardDesc: "十進制系統。單位按十嘅次方縮放，使用前綴：千（×1000）、厘（×0.01）、毫（×0.001）。一致且易於心算。全球科學界通用，不論國家。",
    imperialCardTitle: "美制／英制",
    imperialCardDesc: "源自英國。換算冇規律：12 英寸等於 1 英尺、3 英尺等於 1 碼、1,760 碼等於 1 英里、16 安士等於 1 磅、8 品脫等於 1 加侖。每個換算因子都必須死記。",
    conversionsTitle: "重要換算因子",
    conversionsIntro: "以下換算係科學同商業中使用嘅精確定義或高精度數值：",
    conversionRows: [
      { category: "長度", conversion: "1 英寸 = 2.54 厘米（精確） · 1 英里 = 1.609344 公里 · 1 英尺 = 30.48 厘米" },
      { category: "重量", conversion: "1 磅 = 453.592 克 · 1 安士 = 28.3495 克 · 1 英石 = 6.35029 公斤" },
      { category: "溫度", conversion: "°C = (°F − 32) × 5/9 · °F = °C × 9/5 + 32 · K = °C + 273.15" },
      { category: "體積", conversion: "1 美制加侖 = 3.78541 公升 · 1 英制加侖 = 4.54609 公升 · 1 液量安士（美）= 29.5735 毫升" },
      { category: "速度", conversion: "1 mph = 1.60934 km/h · 1 節 = 1.852 km/h · 1 m/s = 3.6 km/h" },
    ],
    tempTitle: "點解溫度唔同？",
    tempP1: "長度、重量同體積嘅換算只涉及簡單乘法——你只係按比例縮放。溫度就唔同，因為攝氏同華氏冇相同嘅零點。零攝氏度係 32°F（水嘅冰點），而唔係「寒冷」嘅零度。呢個偏移需要喺乘法之前或之後加一個加減步驟。",
    tempP2: "開爾文溫標完全避免咗呢個問題：佢由絕對零度（−273.15°C / −459.67°F）開始，係可能嘅最低溫度。因為開爾文同攝氏有相同嘅度數大小，兩者之間嘅轉換只係簡單加法：K = °C + 273.15。蘭金溫標對華氏做同樣嘅事：Ra = °F + 459.67。開爾文同蘭金之間嘅轉換因此只係純乘法（唔需要偏移）。",
    tempP3: "幾個值得記住嘅溫度參考點：0°C = 32°F = 273.15K（水結冰） · 20°C = 68°F（舒適室溫） · 37°C = 98.6°F（人體體溫） · 100°C = 212°F = 373.15K（海平面水沸騰）。",
    mistakesTitle: "常見單位換算錯誤",
    mistakesItems: [
      { title: "混淆美制同英制加侖。", desc: "美制加侖（3.785 公升）同英制加侖（4.546 公升）相差約 20%。一個英國食譜要求「1 加侖牛奶」意味住比美國加侖多約 20%。呢個亦影響 MPG 比較——相同燃油效率下，英國車通常顯示比美國車更高嘅 MPG 數字。" },
      { title: "混淆質量同重量。", desc: "質量（公斤、克）量度物質嘅數量。重量係一種力（以牛頓量度），等於質量 × 重力加速度。喺地球上，我哋 loosely 用公斤表示兩者，但月球上嘅太空人有相同嘅質量，重量卻只有六分之一。喺工程同物理學中，呢個區分至關重要。" },
      { title: "NASA 火星軌道器災難（1999 年）。", desc: "火星氣候軌道器因為一個工程團隊使用公制單位（牛頓秒），而另一個使用美制單位（磅力秒）而損失。由此產生嘅軌道誤差導致太空船以錯誤角度進入火星大氣層並解體——一個完全由單位換算錯誤造成嘅 3.27 億美元錯誤。" },
    ],
    faqTitle: "常見問題",
    faqItems: [
      { q: "質量同重量有咩分別？", a: "質量係物體中物質嘅數量，以公斤（SI）或磅質量量度。佢唔會因地點而改變。重量係作用喺該質量上嘅重力，以牛頓量度。喺地球表面，1 公斤質量約重 9.81 牛頓。非正式情況下，人們用「重量」嚟表示質量，呢個喺日常語境中可以接受，但喺物理或工程中唔得。" },
      { q: "點解美國仲用緊英制單位？", a: "美國多次嘗試轉換公制——最著名嘅係 1975 年《公制轉換法案》——但採用仍然係自願性質，大部分失敗。轉換現有基礎設施（路牌、工具、製造設備）嘅成本，加上文化阻力，令美制單位喺日常生活中保持主導地位。美國嘅科學、醫學同軍方確實使用公制。美國係僅有三個未正式採用公制作為主要系統嘅國家之一（另外兩個係緬甸同利比利亞）。" },
      { q: "點樣心算將攝氏轉換為華氏？", a: "一個有用嘅近似法：將攝氏值翻倍再加 30。所以 20°C ≈ 40 + 30 = 70°F（實際：68°F）。或者 35°C ≈ 70 + 30 = 100°F（實際：95°F）。呢個對天氣同烹飪嚟講夠準確。精確公式：°F = °C × 9/5 + 32。記住：0°C = 32°F，100°C = 212°F。" },
      { q: "公制前綴係點運作？", a: "公制前綴係應用於任何 SI 基本單位嘅乘數。常見嘅有：千（k）= ×1,000 · 厘（c）= ×0.01 · 毫（m）= ×0.001 · 微（μ）= ×0.000001 · 兆（M）= ×1,000,000 · 吉（G）= ×1,000,000,000。所以 1 公里 = 1,000 米，1 厘米 = 0.01 米，1 毫克 = 0.001 克。呢個模式喺所有單位中保持一致——長度、重量、體積、電力等。" },
      { q: "點解有兩種唔同嘅加侖？", a: "美制加侖源自安妮女王葡萄酒加侖（1706 年），定義為 231 立方英寸。英制加侖喺 1824 年較後時間定義，為 10 磅水嘅體積，約等於 277.4 立方英寸（4.546 公升）。美國喺英國重新定義之前已經建立咗自己嘅標準，所以兩個系統出現咗分歧。今日：1 美制加侖 = 3.785 公升，1 英制加侖 = 4.546 公升。" },
    ],
  },
  "zh-cn": {
    sidebarTitle: "分类",
    sidebarSubtitle: "6 个单位类别。",
    categoryHeader: "类别",
    conversionHeader: "换算",
    sidebarItems: ["长度：mm、cm、m、km、in、ft、mi", "重量：mg、g、kg、oz、lb、stone", "温度：°C、°F、K", "体积、速度、面积"],
    historyTitle: "测量单位简史",
    historyP1: "在人类历史的大部分时间里，测量单位都基于人体——一个实用但极不一致的方法。肘尺（从肘部到指尖的距离）在古埃及和美索不达米亚被使用，但每个人的长度都不同。英尺（字面意思即人脚的长度）、英寸（拇指的宽度）、码（从鼻尖到伸直拇指的距离）全都是这个时代的遗物。因为这些单位因地而异，贸易经常因为混淆实际卖了多少而变得复杂。",
    historyP2: "解决方案逐步出现。法国在 1795 年法国大革命后引入了公制——将米定义为从赤道到北极距离的一千万分之一。1875 年，《米制公约》成立了国际计量局（BIPM），开始了全球标准化的进程。现代国际单位制（SI）于 1960 年建立，是这一努力的直接后代，现在几乎全世界每个国家都使用它进行科学、医学、工程和贸易——而美国是日常生活中最显著的例外。",
    metricTitle: "公制 vs 英制：两大主要系统",
    metricIntro: "今日世界大致分为公制（195+ 个国家官方使用）和美制（美国日常生活中使用，英国某些度量衡用英制变体）。",
    metricCardTitle: "公制（SI）",
    metricCardDesc: "十进制系统。单位按十的次方缩放，使用前缀：千（×1000）、厘（×0.01）、毫（×0.001）。一致且易于心算。全球科学界通用，不论国家。",
    imperialCardTitle: "美制／英制",
    imperialCardDesc: "源自英国。换算无规律：12 英寸等于 1 英尺、3 英尺等于 1 码、1,760 码等于 1 英里、16 盎司等于 1 磅、8 品脱等于 1 加仑。每个换算因子都必须死记。",
    conversionsTitle: "重要换算因子",
    conversionsIntro: "以下换算是科学和商业中使用的精确定义或高精度数值：",
    conversionRows: [
      { category: "长度", conversion: "1 英寸 = 2.54 厘米（精确） · 1 英里 = 1.609344 公里 · 1 英尺 = 30.48 厘米" },
      { category: "重量", conversion: "1 磅 = 453.592 克 · 1 盎司 = 28.3495 克 · 1 英石 = 6.35029 公斤" },
      { category: "温度", conversion: "°C = (°F − 32) × 5/9 · °F = °C × 9/5 + 32 · K = °C + 273.15" },
      { category: "体积", conversion: "1 美制加仑 = 3.78541 升 · 1 英制加仑 = 4.54609 升 · 1 液量盎司（美）= 29.5735 毫升" },
      { category: "速度", conversion: "1 mph = 1.60934 km/h · 1 节 = 1.852 km/h · 1 m/s = 3.6 km/h" },
    ],
    tempTitle: "为什么温度不同？",
    tempP1: "长度、重量和体积的换算只涉及简单乘法——你只是按比例缩放。温度就不同，因为摄氏和华氏没有相同的零点。零摄氏度是 32°F（水的冰点），而不是「寒冷」的零度。这个偏移需要在乘法之前或之后加一个加减步骤。",
    tempP2: "开尔文温标完全避免了这个问题：它从绝对零度（−273.15°C / −459.67°F）开始，是可能的最低温度。因为开尔文和摄氏有相同的度数大小，两者之间的转换只是简单加法：K = °C + 273.15。兰金温标对华氏做同样的事：Ra = °F + 459.67。开尔文和兰金之间的转换因此只是纯乘法（不需要偏移）。",
    tempP3: "几个值得记住的温度参考点：0°C = 32°F = 273.15K（水结冰） · 20°C = 68°F（舒适室温） · 37°C = 98.6°F（人体体温） · 100°C = 212°F = 373.15K（海平面水沸腾）。",
    mistakesTitle: "常见单位换算错误",
    mistakesItems: [
      { title: "混淆美制和英制加仑。", desc: "美制加仑（3.785 升）和英制加仑（4.546 升）相差约 20%。一个英国食谱要求「1 加仑牛奶」意味着比美国加仑多约 20%。这也影响 MPG 比较——相同燃油效率下，英国车通常显示比美国车更高的 MPG 数字。" },
      { title: "混淆质量和重量。", desc: "质量（公斤、克）度量物质的数量。重量是一种力（以牛顿度量），等于质量 × 重力加速度。在地球上，我们 loosely 用公斤表示两者，但月球上的宇航员有相同的质量，重量却只有六分之一。在工程和物理学中，这个区分至关重要。" },
      { title: "NASA 火星轨道器灾难（1999 年）。", desc: "火星气候轨道器因为一个工程团队使用公制单位（牛顿秒），而另一个使用美制单位（磅力秒）而损失。由此产生的轨道误差导致航天器以错误角度进入火星大气层并解体——一个完全由单位换算错误造成的 3.27 亿美元错误。" },
    ],
    faqTitle: "常见问题",
    faqItems: [
      { q: "质量和重量有什么区别？", a: "质量是物体中物质的数量，以公斤（SI）或磅质量度量。它不会因地点而改变。重量是作用在该质量上的重力，以牛顿度量。在地球表面，1 公斤质量约重 9.81 牛顿。非正式情况下，人们用「重量」来表示质量，这在日常语境中可以接受，但在物理或工程中不行。" },
      { q: "为什么美国还在使用英制单位？", a: "美国多次尝试转换公制——最著名的是 1975 年《公制转换法案》——但采用仍然是自愿性质，大部分失败。转换现有基础设施（路牌、工具、制造设备）的成本，加上文化阻力，令美制单位在日常生活中保持主导地位。美国的科学、医学和军方确实使用公制。美国是仅有的三个未正式采用公制作为主要系统的国家之一（另外两个是缅甸和利比里亚）。" },
      { q: "如何心算将摄氏转换为华氏？", a: "一个有用的近似法：将摄氏值翻倍再加 30。所以 20°C ≈ 40 + 30 = 70°F（实际：68°F）。或者 35°C ≈ 70 + 30 = 100°F（实际：95°F）。这对天气和烹饪来说足够准确。精确公式：°F = °C × 9/5 + 32。记住：0°C = 32°F，100°C = 212°F。" },
      { q: "公制前缀如何运作？", a: "公制前缀是应用于任何 SI 基本单位的乘数。常见的有：千（k）= ×1,000 · 厘（c）= ×0.01 · 毫（m）= ×0.001 · 微（μ）= ×0.000001 · 兆（M）= ×1,000,000 · 吉（G）= ×1,000,000,000。所以 1 公里 = 1,000 米，1 厘米 = 0.01 米，1 毫克 = 0.001 克。这个模式在所有单位中保持一致——长度、重量、体积、电力等。" },
      { q: "为什么有两种不同的加仑？", a: "美制加仑源自安妮女王葡萄酒加仑（1706 年），定义为 231 立方英寸。英制加仑在 1824 年较晚时间定义，为 10 磅水的体积，约等于 277.4 立方英寸（4.546 升）。美国在英国重新定义之前已经建立了自己的标准，所以两个系统出现了分歧。今日：1 美制加仑 = 3.785 升，1 英制加仑 = 4.546 升。" },
    ],
  },
  es: {
    sidebarTitle: "Categorías",
    sidebarSubtitle: "6 categorías de unidades.",
    categoryHeader: "Categoría",
    conversionHeader: "Conversión",
    sidebarItems: ["Longitud: mm, cm, m, km, in, ft, mi", "Peso: mg, g, kg, oz, lb, stone", "Temperatura: °C, °F, K", "Volumen, Velocidad, Área"],
    historyTitle: "Breve historia de las unidades de medida",
    historyP1: "Durante la mayor parte de la historia humana, las unidades de medida se basaban en el cuerpo humano, un enfoque práctico pero profundamente inconsistente. El codo (la distancia del codo a la punta del dedo) se usaba en el antiguo Egipto y Mesopotamia, pero variaba de persona a persona. El pie (literalmente la longitud de un pie humano), la pulgada (el ancho de un pulgar) y la yarda (la distancia de la nariz al pulgar extendido) son todos reliquias de esa época. Como estas unidades diferían según la región, el comercio se complicaba frecuentemente por la confusión sobre cuánto se estaba vendiendo realmente.",
    historyP2: "La solución llegó por etapas. Francia introdujo el sistema métrico en 1795 tras la Revolución Francesa, definiendo el metro como una diezmillonésima parte de la distancia del ecuador al Polo Norte. En 1875, el Tratado del Metro estableció una oficina internacional (la BIPM) e inició el proceso de estandarización global. El moderno SI (Sistema Internacional de Unidades), establecido en 1960, es el descendiente directo de ese esfuerzo y ahora es utilizado por prácticamente todos los países del mundo para la ciencia, la medicina, la ingeniería y el comercio, siendo Estados Unidos la excepción más destacada en la vida cotidiana.",
    metricTitle: "Métrico vs Imperial: los dos grandes sistemas",
    metricIntro: "Hoy el mundo está dividido en gran medida entre el sistema métrico (usado oficialmente en más de 195 países) y el sistema consuetudinario estadounidense (usado en la vida diaria en EE. UU., con variantes imperiales en el Reino Unido para algunas medidas).",
    metricCardTitle: "Métrico (SI)",
    metricCardDesc: "Sistema en base 10. Las unidades escalan por potencias de diez usando prefijos: kilo (×1000), centi (×0,01), mili (×0,001). Consistente y fácil de calcular mentalmente. Usado en la ciencia a nivel mundial independientemente del país.",
    imperialCardTitle: "Consuetudinario EE. UU. / Imperial",
    imperialCardDesc: "Históricamente inglés. Las conversiones son arbitrarias: 12 pulgadas en un pie, 3 pies en una yarda, 1.760 yardas en una milla, 16 onzas en una libra, 8 pintas en un galón. Cada factor de conversión debe memorizarse.",
    conversionsTitle: "Factores de conversión clave",
    conversionsIntro: "Las siguientes conversiones son definiciones exactas o valores de alta precisión utilizados en ciencia y comercio:",
    conversionRows: [
      { category: "Longitud", conversion: "1 pulgada = 2,54 cm (exacto) · 1 milla = 1,609344 km · 1 pie = 30,48 cm" },
      { category: "Peso", conversion: "1 libra = 453,592 g · 1 onza = 28,3495 g · 1 stone = 6,35029 kg" },
      { category: "Temperatura", conversion: "°C = (°F − 32) × 5/9 · °F = °C × 9/5 + 32 · K = °C + 273,15" },
      { category: "Volumen", conversion: "1 galón EE. UU. = 3,78541 L · 1 galón UK = 4,54609 L · 1 fl oz (EE. UU.) = 29,5735 ml" },
      { category: "Velocidad", conversion: "1 mph = 1,60934 km/h · 1 nudo = 1,852 km/h · 1 m/s = 3,6 km/h" },
    ],
    tempTitle: "Por qué la temperatura es diferente",
    tempP1: "Las conversiones de longitud, peso y volumen implican una simple multiplicación: solo estás escalando a lo largo de una razón. La temperatura es diferente porque Celsius y Fahrenheit no comparten el mismo punto cero. Cero Celsius es 32°F (el punto de congelación del agua), no cero grados de «frío». Este desplazamiento requiere un paso de suma/resta antes o después de la multiplicación.",
    tempP2: "La escala Kelvin evita este problema por completo: comienza en el cero absoluto (−273,15°C / −459,67°F), la temperatura más baja posible. Como Kelvin y Celsius comparten el mismo tamaño de grado, la conversión entre ellos es una pura suma: K = °C + 273,15. La escala Rankine hace lo mismo para Fahrenheit: Ra = °F + 459,67. Las conversiones entre Kelvin y Rankine son por tanto multiplicaciones puras (sin desplazamiento necesario).",
    tempP3: "Algunos puntos de referencia de temperatura que vale la pena recordar: 0°C = 32°F = 273,15K (el agua se congela) · 20°C = 68°F (temperatura ambiente confortable) · 37°C = 98,6°F (temperatura corporal humana) · 100°C = 212°F = 373,15K (el agua hierve al nivel del mar).",
    mistakesTitle: "Errores comunes en la conversión de unidades",
    mistakesItems: [
      { title: "Confundir galones EE. UU. y del Reino Unido.", desc: "El galón estadounidense (3,785 L) y el galón imperial británico (4,546 L) difieren en aproximadamente un 20%. Una receta británica que pide «1 galón de leche» significa aproximadamente un 20% más que el galón americano. Esto también afecta las comparaciones de MPG: los coches del Reino Unido suelen mostrar cifras de MPG más altas que los americanos para la misma eficiencia de combustible." },
      { title: "Confundir masa y peso.", desc: "La masa (kg, gramos) mide la cantidad de materia. El peso es una fuerza (medida en Newtons) igual a masa × aceleración gravitacional. En la Tierra, usamos kg informalmente para ambos, pero un astronauta en la Luna tiene la misma masa pero pesa 1/6 de lo que pesaría aquí. En ingeniería y física, esta distinción es crítica." },
      { title: "El desastre del Mars Orbiter de la NASA (1999).", desc: "El Mars Climate Orbiter se perdió porque un equipo de ingeniería usó unidades métricas (Newton-segundos) mientras que otro usó unidades consuetudinarias de EE. UU. (libra-fuerza-segundos). El error de trayectoria resultante hizo que la nave espacial entrara en la atmósfera de Marte en el ángulo equivocado y se desintegrase: un error de $327 millones causado enteramente por un fallo en la conversión de unidades." },
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      { q: "¿Cuál es la diferencia entre masa y peso?", a: "La masa es la cantidad de materia en un objeto, medida en kilogramos (SI) o libras-masa. No cambia según la ubicación. El peso es la fuerza gravitacional que actúa sobre esa masa, medida en Newtons. En la superficie de la Tierra, 1 kg de masa pesa aproximadamente 9,81 Newtons. Informalmente, las personas usan «peso» cuando quieren decir masa, lo cual es aceptable en contextos cotidianos pero no en física o ingeniería." },
      { q: "¿Por qué Estados Unidos sigue usando unidades imperiales?", a: "EE. UU. ha intentado la conversión al sistema métrico varias veces, la más notable siendo la Ley de Conversión Métrica de 1975, pero la adopción siguió siendo voluntaria y fracasó en gran medida. El costo de convertir la infraestructura existente (señales de tráfico, herramientas, equipos de fabricación), combinado con la resistencia cultural, ha mantenido el sistema consuetudinario dominante en la vida cotidiana. La ciencia, la medicina y el ejército de EE. UU. sí usan el métrico. EE. UU. es uno de solo tres países (junto con Myanmar y Liberia) que no han adoptado oficialmente el sistema métrico como sistema primario." },
      { q: "¿Cómo puedo convertir Celsius a Fahrenheit mentalmente?", a: "Una aproximación útil: duplica el valor Celsius y añade 30. Así 20°C ≈ 40 + 30 = 70°F (real: 68°F). O 35°C ≈ 70 + 30 = 100°F (real: 95°F). Es suficientemente preciso para el tiempo y la cocina. Para la fórmula exacta: °F = °C × 9/5 + 32. Recuerda: 0°C = 32°F, 100°C = 212°F." },
      { q: "¿Cómo funcionan los prefijos métricos?", a: "Los prefijos métricos son multiplicadores aplicados a cualquier unidad base del SI. Los más comunes: kilo (k) = ×1.000 · centi (c) = ×0,01 · mili (m) = ×0,001 · micro (μ) = ×0,000001 · mega (M) = ×1.000.000 · giga (G) = ×1.000.000.000. Así, 1 kilómetro = 1.000 metros, 1 centímetro = 0,01 metros, 1 miligramo = 0,001 gramos. El patrón es consistente en todas las unidades: longitud, peso, volumen, electricidad, etc." },
      { q: "¿Por qué existen dos galones diferentes?", a: "El galón estadounidense deriva del galón de vino de la Reina Ana (1706), definido como 231 pulgadas cúbicas. El galón imperial del Reino Unido se definió posteriormente en 1824 como el volumen de 10 libras de agua, lo que equivale a aproximadamente 277,4 pulgadas cúbicas (4,546 litros). EE. UU. ya había establecido sus propios estándares antes de la redefinición británica, por lo que los dos sistemas divergieron. Hoy: 1 galón EE. UU. = 3,785 litros, 1 galón UK = 4,546 litros." },
    ],
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "由出生日期計算精確年齡。", "zh-cn": "从出生日期计算精确年龄。", es: "Calcula la edad exacta desde una fecha de nacimiento." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差距計算器", "zh-cn": "日期差距计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "計算兩個日期之間嘅日數。", "zh-cn": "计算两个日期之间的天数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "計算數字嘅百分比。", "zh-cn": "计算数字的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Time Zone Converter", "zh-hk": "時區轉換器", "zh-cn": "时区转换器", es: "Conversor de zona horaria" }, description: { en: "Convert time between any time zones.", "zh-hk": "喺任何時區之間轉換時間。", "zh-cn": "在任何时区之间转换时间。", es: "Convierte hora entre cualquier zona horaria." }, href: "/time-zone-converter", keywords: ["time", "zone"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算器", "zh-cn": "体积重量计算器", es: "Calculadora de peso volumétrico" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "計算包裹嘅體積重量。", "zh-cn": "计算包裹的体积重量。", es: "Calcula el peso dimensional de paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計器", "zh-cn": "字数统计器", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "統計文字同字數。", "zh-cn": "统计文字和字数。", es: "Cuenta palabras y caracteres." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼／解碼器", "zh-cn": "URL 编码／解码器", es: "Codificador / Decodificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", es: "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/unit-converter";

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

export default function UnitConverter() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("1");
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
        { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: EDUCATION[locale].faqItems.map((item: {q: string; a: string}) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      ],
    });
  }, [locale]);

  useEffect(() => {
    const cat = CATEGORIES[category];
    setFromUnit(cat.units[0].key);
    setToUnit(cat.units[1]?.key || cat.units[0].key);
  }, [category]);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const cat = CATEGORIES[category];
    const from = cat.units.find((u) => u.key === fromUnit);
    const to = cat.units.find((u) => u.key === toUnit);
    if (!from || !to) return null;
    return to.fromBase(from.toBase(v));
  }, [value, category, fromUnit, toUnit]);

  const content = LANGUAGES[locale];
  const cat = CATEGORIES[category];
  const educationContent = EDUCATION[locale];
  const hints = locale === "zh-hk" ? ["年齡", "百分比", "時區", "URL"] : locale === "zh-cn" ? ["年龄", "百分比", "时区", "URL"] : locale === "es" ? ["edad", "porcentaje", "zona horaria", "url"] : ["age", "percent", "time", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><ArrowLeftRight className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div>
              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="flex flex-wrap gap-2">{Object.entries(CATEGORIES).map(([key, c]) => <button key={key} onClick={() => setCategory(key)} className={`rounded-full border px-4 py-2 text-sm transition ${category === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{c.name}</button>)}</div>
              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-2">
                  <span className="text-sm text-neutral-300">{content.fromLabel}</span>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60 mb-2" />
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {cat.units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
                  </select>
                </div>
                <button onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} className="self-center mt-8 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"><ArrowLeftRight className="h-4 w-4 text-emerald-300" /></button>
                <div className="space-y-2">
                  <span className="text-sm text-neutral-300">{content.toLabel}</span>
                  <div className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-200 mb-2">{result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "—"}</div>
                  <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {cat.units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.historyTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.historyP1}</p>
                <p className="mt-3 leading-7">{educationContent.historyP2}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.metricTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.metricIntro}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { name: educationContent.metricCardTitle, desc: educationContent.metricCardDesc },
                    { name: educationContent.imperialCardTitle, desc: educationContent.imperialCardDesc },
                  ].map((t) => (
                    <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.conversionsTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.conversionsIntro}</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead><tr className="border-b border-white/10"><th className="py-2 pr-4 text-left font-semibold text-white">{educationContent.categoryHeader}</th><th className="py-2 text-left font-semibold text-white">{educationContent.conversionHeader}</th></tr></thead>
                    <tbody className="text-white/70">
                      {educationContent.conversionRows.map((row: {category: string, conversion: string}) => (
                        <tr key={row.category} className="border-b border-white/5"><td className="py-2 pr-4">{row.category}</td><td className="py-2">{row.conversion}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.tempTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.tempP1}</p>
                <p className="mt-3 leading-7">{educationContent.tempP2}</p>
                <p className="mt-3 leading-7">{educationContent.tempP3}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.mistakesTitle}</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">{educationContent.mistakesItems[0].title}</strong> {educationContent.mistakesItems[0].desc}</li>
                  <li><strong className="text-white">{educationContent.mistakesItems[1].title}</strong> {educationContent.mistakesItems[1].desc}</li>
                  <li><strong className="text-white">{educationContent.mistakesItems[2].title}</strong> {educationContent.mistakesItems[2].desc}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">{educationContent.faqItems[0].q}</h3>
                    <p className="mt-1 text-white/70">{educationContent.faqItems[0].a}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{educationContent.faqItems[1].q}</h3>
                    <p className="mt-1 text-white/70">{educationContent.faqItems[1].a}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{educationContent.faqItems[2].q}</h3>
                    <p className="mt-1 text-white/70">{educationContent.faqItems[2].a}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{educationContent.faqItems[3].q}</h3>
                    <p className="mt-1 text-white/70">{educationContent.faqItems[3].a}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{educationContent.faqItems[4].q}</h3>
                    <p className="mt-1 text-white/70">{educationContent.faqItems[4].a}</p>
                  </div>
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><ArrowLeftRight className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{educationContent.sidebarTitle}</h2><p className="text-sm text-neutral-300">{educationContent.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{educationContent.sidebarItems[0]}</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{educationContent.sidebarItems[1]}</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{educationContent.sidebarItems[2]}</p>
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{educationContent.sidebarItems[3]}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
