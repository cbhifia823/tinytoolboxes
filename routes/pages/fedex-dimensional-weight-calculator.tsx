import { useEffect, useMemo, useState } from "react";
import { Calculator, Scale, Truck } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

type L = {
  pageTitle: string;
  intro: string;
  subtitle: string;
  unitsLabel: string;
  resultsTitle: string;
  fedexCalc: string;
  fedexCalcSub: string;
  resultsSub: string;
  formulaLabel: string;
  resultFormulaLabel: string;
  billableLabel: string;
  actualLabel: string;
  volumetricLabel: string;
  loadExample: string;
  examplesTitle: string;
  examplesSub: string;
  faqTitle: string;
  faq: Array<[string, string]>;
  quickLinksTitle: string;
  examples: Array<{ label: string; dims: [number, number, number]; actual: number }>;
  metricFactor: number;
  imperialFactor: number;
  formulaMetric: string;
  formulaImperial: string;
  unitMetric: string;
  unitImperial: string;
  ui: { length: string; width: string; height: string; actualWeight: string; factor: string; };
  inputLength: string;
  inputWidth: string;
  inputHeight: string;
  inputActualWeight: string;
  inputFactor: string;
  sectionHow: { heading: string; p1: string; p2: string };
  sectionExample: { heading: string; intro: string; calc: string; after: string };
  sectionLimits: { heading: string; items: Array<{ label: string; text: string }> };
  sectionOneRate: { heading: string; p1: string; p2: string };
  sectionFaq: { heading: string; items: Array<{ q: string; a: string }> };
  relatedHeading: string;
  relatedText: string;
  relatedUps: string;
  relatedDhl: string;
  relatedGeneric: string;
};

const LANGUAGES: Record<LocaleKey, L> = {
  en: {
    pageTitle: "FedEx Dimensional Weight Calculator",
    intro: "A boring utility page with one job: help shippers calculate FedEx billable weight fast.",
    ui: { length: "Length", width: "Width", height: "Height", actualWeight: "Actual weight", factor: "Dimensional factor" },
    metricFactor: 5000,
    imperialFactor: 139,
    formulaMetric: "L × W × H ÷ 5000",
    formulaImperial: "L × W × H ÷ 139",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    subtitle: "Calculate FedEx billable weight from box dimensions in seconds. Built for shipping searches, chargeable weight queries, and dimensional weight formulas.",
    unitsLabel: "Dimensions & weight",
    resultsTitle: "Results",
    fedexCalc: "FedEx calculator",
    fedexCalcSub: "Enter dimensions, compare actual weight vs dimensional weight, and copy the formula.",
    resultsSub: "Side-by-side breakdown of billable weight",
    formulaLabel: "FedEx formula",
    resultFormulaLabel: "Live formula",
    billableLabel: "Billable weight",
    actualLabel: "Actual weight",
    volumetricLabel: "Volumetric weight",
    loadExample: "Load example",
    examplesTitle: "Examples",
    examplesSub: "Preset packages to test the calculator quickly",
    faqTitle: "FAQ",
    faq: [
      ["What is FedEx dimensional weight?", "It is the chargeable weight FedEx may use when a parcel takes up more space than its actual weight suggests."],
      ["Why is billable weight important?", "Because the carrier usually charges the greater of actual weight and dimensional weight."],
      ["Can I change units?", "Yes, switch between cm/kg and in/lb anytime."],
    ],
    quickLinksTitle: "FedEx Quick Links",
    examples: [
      { label: "Small parcel", dims: [30, 20, 15], actual: 4 },
      { label: "Retail box", dims: [40, 30, 20], actual: 6 },
      { label: "Large carton", dims: [60, 40, 40], actual: 12 },
    ],
    inputLength: "Length",
    inputWidth: "Width",
    inputHeight: "Height",
    inputActualWeight: "Actual weight",
    inputFactor: "Dimensional factor",
    sectionHow: {
      heading: "How FedEx Dimensional Weight Pricing Works",
      p1: "FedEx uses dimensional weight (also called DIM weight) pricing for all FedEx Express and FedEx Ground shipments. The concept is simple: carriers charge for the space a package occupies in their vehicles, not just its physical weight. A large, light box takes up the same cargo space as a small, heavy box — so FedEx bills whichever measurement results in higher revenue: actual weight or dimensional weight.",
      p2: "FedEx calculates dimensional weight using: (Length × Width × Height) ÷ 5,000 in centimetres (result in kg), or (L × W × H) ÷ 139 in inches (result in pounds). The billable weight is the greater of actual weight and dimensional weight. FedEx rounds all measurements up to the nearest whole number before calculating.",
    },
    sectionExample: {
      heading: "Worked Example: E-Commerce Small Business",
      intro: "An online retailer ships phone accessories in 30 cm × 25 cm × 20 cm boxes. Each box's actual weight is 500g (0.5 kg).",
      calc: "Dimensional weight = (30 × 25 × 20) ÷ 5,000 = 15,000 ÷ 5,000 = 3 kg",
      after: "FedEx bills 3 kg instead of 0.5 kg — a 6× multiple. By switching to a tighter 25 × 20 × 15 cm box: (25 × 20 × 15) ÷ 5,000 = 7,500 ÷ 5,000 = 1.5 kg. The cost per package is cut in half. For a business shipping 200 packages per day, this difference in box selection can save $40,000–$80,000 per year depending on rate agreements.",
    },
    sectionLimits: {
      heading: "FedEx Size Limits and Surcharges",
      items: [
        { label: "Maximum weight", text: "150 lbs (68 kg) for FedEx Express and Ground standard packages." },
        { label: "Maximum length", text: "119 inches (302 cm) for the single longest dimension." },
        { label: "Length plus girth", text: "Must not exceed 165 inches (419 cm). Girth = 2 × (width + height)." },
        { label: "Oversized/additional handling", text: "Packages exceeding 96 inches on the longest side, or length plus girth over 130 inches, incur additional handling surcharges on top of standard rates." },
        { label: "FedEx Freight", text: "Packages exceeding these standard limits must ship via FedEx Freight, which uses different pricing and handling procedures." },
      ],
    },
    sectionOneRate: {
      heading: "FedEx One Rate: When DIM Weight Doesn't Apply",
      p1: "FedEx One Rate is a flat-rate pricing program for packages shipped in official FedEx One Rate packaging. Unlike standard FedEx pricing, One Rate charges a fixed price regardless of actual weight (up to 50 lbs) or dimensional weight — as long as you use the provided FedEx envelopes, paks, tubes, boxes, or extra-large boxes.",
      p2: "This makes FedEx One Rate particularly cost-effective for dense, heavy items that would otherwise have high actual-weight billing. A 20 lb metal component shipped in a FedEx One Rate box pays the same flat price as a 2 lb component in the same box. However, for very light items in large packages where dimensional weight would be much higher than actual weight, standard FedEx pricing may actually be cheaper.",
    },
    sectionFaq: {
      heading: "Frequently Asked Questions",
      items: [
        { q: "Does FedEx dimensional weight apply to residential deliveries?", a: "Yes. FedEx dimensional weight applies to both commercial and residential deliveries. However, residential deliveries also incur a separate residential delivery surcharge (typically $5–$10 per package). Both the dimensional weight and any applicable surcharges are calculated independently and added to the total shipping cost." },
        { q: "What is FedEx Ground Economy (formerly SmartPost)?", a: "FedEx Ground Economy is a lower-cost service for lightweight packages that uses USPS for the final delivery mile. It is slower than standard FedEx Ground but typically cheaper for packages under 70 lbs. Dimensional weight still applies, but the overall rate structure is different. It is best suited for non-urgent e-commerce shipments to residential addresses." },
        { q: "How do I dispute a FedEx dimensional weight charge?", a: "If you believe FedEx measured your package incorrectly, contact FedEx billing with your tracking number and the actual measured dimensions of your package. Provide photographic evidence of the package with a measuring tape if possible. FedEx will review the scan data from their dimensioning systems. Billing disputes must typically be filed within 60 days of the invoice date." },
        { q: "What is the cubic pricing rule for FedEx?", a: "FedEx occasionally uses \"cubic pricing\" for some FedEx Ground shipments, which calculates cost based on the total cubic volume of the package rather than dimensional weight. This typically affects packages over a certain size threshold. For most standard commercial shippers, dimensional weight is the relevant calculation — but if you ship very large packages frequently, ask your FedEx account representative about applicable pricing rules." },
      ],
    },
    relatedHeading: "Related calculators",
    relatedText: "Also try our",
    relatedUps: "UPS dimensional weight calculator",
    relatedDhl: "DHL dimensional weight calculator",
    relatedGeneric: "multilingual volumetric weight calculator",
  },
  "zh-hk": {
    pageTitle: "FedEx 體積重量計算器",
    intro: "一個無聊嘅實用頁，只做一件事：幫你極速計算 FedEx 嘅計費重量。",
    ui: { length: "Length", width: "Width", height: "Height", actualWeight: "Actual weight", factor: "Dimensional factor" },
    metricFactor: 5000,
    imperialFactor: 139,
    formulaMetric: "L × W × H ÷ 5000",
    formulaImperial: "L × W × H ÷ 139",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    subtitle: "幾秒之內用箱嘅尺寸計到 FedEx 嘅計費重量。專為搜尋運費、收費重量、體積重量公式嘅人而設。",
    unitsLabel: "尺寸同重量",
    resultsTitle: "結果",
    fedexCalc: "FedEx 計算器",
    fedexCalcSub: "輸入尺寸、比較實際重量同體積重量，仲可以複製公式。",
    resultsSub: "左右並排列出計費重量明細",
    formulaLabel: "FedEx 公式",
    resultFormulaLabel: "即時公式",
    billableLabel: "計費重量",
    actualLabel: "實際重量",
    volumetricLabel: "體積重量",
    loadExample: "載入示例",
    examplesTitle: "示例",
    examplesSub: "預設包裹，幫你即刻試到個計算器",
    faqTitle: "常見問題",
    faq: [
      ["咩係 FedEx 體積重量？", "就係當包裹佔嘅空間比實際重量顯示嘅多，FedEx 可能用嚟計費嘅重量。"],
      ["點解計費重量咁重要？", "因為快遞一般會收實際重量同體積重量兩者之間較大嗰個。"],
      ["可以轉單位嗎？", "可以，隨時喺 cm/kg 同 in/lb 之間切換。"],
    ],
    quickLinksTitle: "FedEx 快捷連結",
    examples: [
      { label: "小包裹", dims: [30, 20, 15], actual: 4 },
      { label: "零售箱", dims: [40, 30, 20], actual: 6 },
      { label: "大紙箱", dims: [60, 40, 40], actual: 12 },
    ],
    inputLength: "長",
    inputWidth: "闊",
    inputHeight: "高",
    inputActualWeight: "實際重量",
    inputFactor: "體積重量除數",
    sectionHow: {
      heading: "FedEx 體積重量點樣計",
      p1: "FedEx 對所有 FedEx Express 同 FedEx Ground 寄件都會用體積重量（又叫 DIM 重量）計費。概念好簡單：快遞公司係按包裹佔咗幾多車位嚟收費，而唔止睇實重。一個大而輕嘅箱同細而重嘅箱佔嘅貨位一樣，所以 FedEx 會收實際重量同體積重量兩者之間較大嗰個。",
      p2: "FedEx 用以下方法計體積重量：(長 × 闊 × 高) ÷ 5,000 厘米（單位 kg），或者 (L × W × H) ÷ 139 英寸（單位磅）。計費重量係實際重量同體積重量之間較大嗰個。FedEx 會將所有尺寸先四捨五入到最接近嘅整數先再計。",
    },
    sectionExample: {
      heading: "實例：電商細公司",
      intro: "一個網店用 30 cm × 25 cm × 20 cm 嘅箱寄手機配件，每箱實際重量 500g（0.5 kg）。",
      calc: "體積重量 = (30 × 25 × 20) ÷ 5,000 = 15,000 ÷ 5,000 = 3 kg",
      after: "FedEx 收 3 kg 而唔係 0.5 kg —— 即 6 倍。如果改用 25 × 20 × 15 cm 嘅箱：(25 × 20 × 15) ÷ 5,000 = 7,500 ÷ 5,000 = 1.5 kg，每件成本即刻減半。一間日寄 200 件嘅公司，淨係揀箱嘅分別一年可以慳 $40,000–$80,000，視乎合約價。",
    },
    sectionLimits: {
      heading: "FedEx 尺寸上限同附加費",
      items: [
        { label: "最高重量", text: "FedEx Express 同 Ground 標準件每件最高 150 磅（68 kg）。" },
        { label: "最長邊長度", text: "最長單邊 119 英寸（302 cm）。" },
        { label: "長加圍長", text: "合計唔可以超過 165 英寸（419 cm）。圍長 = 2 × (闊 + 高)。" },
        { label: "超大件/額外處理費", text: "最長邊超過 96 英寸，或者長加圍長超過 130 英寸嘅件，會加收額外處理附加費。" },
        { label: "FedEx Freight", text: "超過以上限制嘅件要用 FedEx Freight 寄，計價同處理程序唔同。" },
      ],
    },
    sectionOneRate: {
      heading: "FedEx One Rate：幾時體積重量唔適用",
      p1: "FedEx One Rate 係一個用 FedEx 官方 One Rate 包裝嘅劃一收費計劃。唔同一般 FedEx 計價，One Rate 唔理實際重量（上限 50 磅）或者體積重量，只收固定費用 —— 但要你用 FedEx 嘅信封、Pak、圓筒箱、盒子或加大盒。",
      p2: "所以 One Rate 對又重又細嘅嘢特別划算。如果一件 20 磅嘅金屬件用 FedEx One Rate 嘅箱寄，費用同一件 2 磅嘅嘢一樣。但係如果件嘢好輕、箱又大，搞到體積重量遠超實際重量，一般 FedEx 計價可能仲平。",
    },
    sectionFaq: {
      heading: "常見問題",
      items: [
        { q: "住宅件都收 FedEx 體積重量嗎？", a: "係，無論商業定住宅件都收。不過住宅件會另外加住宅附加費（一般每件 $5–$10）。體積重量同附加費係分開計、然後加埋一齊嘅。" },
        { q: "咩係 FedEx Ground Economy（前身 SmartPost）？", a: "FedEx Ground Economy 係一個平價服務，係用 USPS 走最後一程嘅。慢過 FedEx Ground，但 70 磅以下嘅件一般平啲。體積重量一樣會收，但整體定價唔同。最適合非急件嘅電商寄住宅件。" },
        { q: "點樣去 dispute FedEx 嘅體積重量收費？", a: "如果你覺得 FedEx 量錯咗你件嘅尺寸，可以攞住 tracking number 同件嘅實際尺寸去搵 FedEx billing。最好附上用拉尺影嘅相做證據。FedEx 會覆核佢哋量度系統嘅 scan 數據。賬單爭議一般要喺發票日 60 日內提出。" },
        { q: "FedEx 嘅 cubic pricing 係咩？", a: "FedEx 偶爾會用「cubic pricing」—— 即係用件嘅總體積嚟計費而唔係用體積重量。通常影響超過某個尺寸嘅件。對大部分標準商用寄件嚟講，體積重量先係主要算法 —— 不過如果你成日寄好大嘅件，最好問下你嘅 FedEx 客戶經理。" },
      ],
    },
    relatedHeading: "相關計算器",
    relatedText: "仲可以試下",
    relatedUps: "UPS 體積重量計算器",
    relatedDhl: "DHL 體積重量計算器",
    relatedGeneric: "多語言體積重量計算器",
  },
  "zh-cn": {
    pageTitle: "FedEx 体积重量计算器",
    intro: "一个无聊的实用页，只做一件事：帮你极速计算 FedEx 的计费重量。",
    ui: { length: "Length", width: "Width", height: "Height", actualWeight: "Actual weight", factor: "Dimensional factor" },
    metricFactor: 5000,
    imperialFactor: 139,
    formulaMetric: "L × W × H ÷ 5000",
    formulaImperial: "L × W × H ÷ 139",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    subtitle: "几秒之内用箱的尺寸计到 FedEx 的计费重量。专为搜索运费、收费重量、体积重量公式的人而设。",
    unitsLabel: "尺寸和重量",
    resultsTitle: "结果",
    fedexCalc: "FedEx 计算器",
    fedexCalcSub: "输入尺寸、比较实际重量和体积重量，还可以复制公式。",
    resultsSub: "左右并排列出计费重量明细",
    formulaLabel: "FedEx 公式",
    resultFormulaLabel: "实时公式",
    billableLabel: "计费重量",
    actualLabel: "实际重量",
    volumetricLabel: "体积重量",
    loadExample: "载入示例",
    examplesTitle: "示例",
    examplesSub: "预设包裹，帮你立刻试到计算器",
    faqTitle: "常见问题",
    faq: [
      ["什么是 FedEx 体积重量？", "就是当包裹占的空间比实际重量显示的多，FedEx 可能用来计费的重量。"],
      ["为什么计费重量这么重要？", "因为快递一般会收实际重量和体积重量两者之间较大的那个。"],
      ["可以换单位吗？", "可以，随时在 cm/kg 和 in/lb 之间切换。"],
    ],
    quickLinksTitle: "FedEx 快捷链接",
    examples: [
      { label: "小包裹", dims: [30, 20, 15], actual: 4 },
      { label: "零售箱", dims: [40, 30, 20], actual: 6 },
      { label: "大纸箱", dims: [60, 40, 40], actual: 12 },
    ],
    inputLength: "长",
    inputWidth: "宽",
    inputHeight: "高",
    inputActualWeight: "实际重量",
    inputFactor: "体积重量除数",
    sectionHow: {
      heading: "FedEx 体积重量怎么算",
      p1: "FedEx 对所有 FedEx Express 和 FedEx Ground 件都会用体积重量（又叫 DIM 重量）计费。概念很简单：快递公司是按包裹占了多少车位来收费，不只看实重。一个大而轻的箱和细而重的箱占的货位一样，所以 FedEx 会收实际重量和体积重量两者之间较大的那个。",
      p2: "FedEx 用以下方法计体积重量：(长 × 宽 × 高) ÷ 5,000 厘米（单位 kg），或者 (L × W × H) ÷ 139 英寸（单位磅）。计费重量是实际重量和体积重量之间较大的那个。FedEx 会把所有尺寸先四舍五入到最接近的整数再算。",
    },
    sectionExample: {
      heading: "实例：电商小公司",
      intro: "一个网店用 30 cm × 25 cm × 20 cm 的箱寄手机配件，每箱实际重量 500g（0.5 kg）。",
      calc: "体积重量 = (30 × 25 × 20) ÷ 5,000 = 15,000 ÷ 5,000 = 3 kg",
      after: "FedEx 收 3 kg 而不是 0.5 kg —— 即 6 倍。如果改用 25 × 20 × 15 cm 的箱：(25 × 20 × 15) ÷ 5,000 = 7,500 ÷ 5,000 = 1.5 kg，每件成本立刻减半。一间日寄 200 件的公司，光是选箱的分别一年可以省 $40,000–$80,000，视合约价而定。",
    },
    sectionLimits: {
      heading: "FedEx 尺寸上限和附加费",
      items: [
        { label: "最高重量", text: "FedEx Express 和 Ground 标准件每件最高 150 磅（68 kg）。" },
        { label: "最长边长度", text: "最长单边 119 英寸（302 cm）。" },
        { label: "长加围长", text: "合计不能超过 165 英寸（419 cm）。围长 = 2 × (宽 + 高)。" },
        { label: "超大件/额外处理费", text: "最长边超过 96 英寸，或者长加围长超过 130 英寸的件，会加收额外处理附加费。" },
        { label: "FedEx Freight", text: "超过以上限制的件要用 FedEx Freight 寄，计价和处理程序不同。" },
      ],
    },
    sectionOneRate: {
      heading: "FedEx One Rate：什么时候体积重量不适用",
      p1: "FedEx One Rate 是一个用 FedEx 官方 One Rate 包装的统一定价计划。不同一般 FedEx 计价，One Rate 不管实际重量（上限 50 磅）或者体积重量，只收固定费用 —— 但要你用 FedEx 的信封、Pak、圆筒箱、盒子或加大盒。",
      p2: "所以 One Rate 对又重又细的东西特别划算。如果一件 20 磅的金属件用 FedEx One Rate 的箱寄，费用和一件 2 磅的东西一样。但如果件东西很轻、箱又大，搞到体积重量远超实际重量，一般 FedEx 计价可能更便宜。",
    },
    sectionFaq: {
      heading: "常见问题",
      items: [
        { q: "住宅件也收 FedEx 体积重量吗？", a: "是，无论商业还是住宅件都收。不过住宅件会另外加住宅附加费（一般每件 $5–$10）。体积重量和附加费是分开算、再加在一起的。" },
        { q: "什么是 FedEx Ground Economy（前身 SmartPost）？", a: "FedEx Ground Economy 是一个低价服务，是用 USPS 走最后一程的。比 FedEx Ground 慢，但 70 磅以下的件一般更便宜。体积重量一样会收，但整体定价不同。最适合非急件的电商寄住宅件。" },
        { q: "怎么 dispute FedEx 的体积重量收费？", a: "如果你觉得 FedEx 量错了你件的尺寸，可以拿住 tracking number 和件的实际尺寸去找 FedEx billing。最好附上用拉尺拍的照片作证据。FedEx 会复核他们量度系统的 scan 数据。账单争议一般要在发票日 60 日内提出。" },
        { q: "FedEx 的 cubic pricing 是什么？", a: "FedEx 偶尔会用「cubic pricing」—— 即是用件的总体积来计费而不是用体积重量。通常影响超过某个尺寸的件。对大部分标准商用寄件来说，体积重量才是主要算法 —— 不过如果你经常寄很大的件，最好问一下你的 FedEx 客户经理。" },
      ],
    },
    relatedHeading: "相关计算器",
    relatedText: "还可以试试",
    relatedUps: "UPS 体积重量计算器",
    relatedDhl: "DHL 体积重量计算器",
    relatedGeneric: "多语言体积重量计算器",
  },
  es: {
    pageTitle: "Calculadora de peso dimensional de FedEx",
    intro: "Una página útil y aburrida con un solo trabajo: ayudar a los envíos a calcular el peso facturable de FedEx rápidamente.",
    ui: { length: "Length", width: "Width", height: "Height", actualWeight: "Actual weight", factor: "Dimensional factor" },
    metricFactor: 5000,
    imperialFactor: 139,
    formulaMetric: "L × W × H ÷ 5000",
    formulaImperial: "L × W × H ÷ 139",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    subtitle: "Calcula el peso facturable de FedEx a partir de las dimensiones de la caja en segundos. Pensada para búsquedas de envíos, consultas de peso facturable y fórmulas de peso dimensional.",
    unitsLabel: "Dimensiones y peso",
    resultsTitle: "Resultados",
    fedexCalc: "Calculadora FedEx",
    fedexCalcSub: "Introduce las dimensiones, compara el peso real con el dimensional y copia la fórmula.",
    resultsSub: "Desglose lado a lado del peso facturable",
    formulaLabel: "Fórmula FedEx",
    resultFormulaLabel: "Fórmula en vivo",
    billableLabel: "Peso facturable",
    actualLabel: "Peso real",
    volumetricLabel: "Peso volumétrico",
    loadExample: "Cargar ejemplo",
    examplesTitle: "Ejemplos",
    examplesSub: "Paquetes predefinidos para probar la calculadora rápido",
    faqTitle: "Preguntas frecuentes",
    faq: [
      ["¿Qué es el peso dimensional de FedEx?", "Es el peso que FedEx puede usar para facturar cuando un paquete ocupa más espacio del que su peso real sugiere."],
      ["¿Por qué es importante el peso facturable?", "Porque el transportista suele cobrar el mayor entre el peso real y el peso dimensional."],
      ["¿Puedo cambiar las unidades?", "Sí, cambia entre cm/kg y in/lb cuando quieras."],
    ],
    quickLinksTitle: "Enlaces rápidos FedEx",
    examples: [
      { label: "Paquete pequeño", dims: [30, 20, 15], actual: 4 },
      { label: "Caja minorista", dims: [40, 30, 20], actual: 6 },
      { label: "Caja grande", dims: [60, 40, 40], actual: 12 },
    ],
    inputLength: "Largo",
    inputWidth: "Ancho",
    inputHeight: "Alto",
    inputActualWeight: "Peso real",
    inputFactor: "Factor dimensional",
    sectionHow: {
      heading: "Cómo funciona la facturación por peso dimensional de FedEx",
      p1: "FedEx usa la facturación por peso dimensional (también llamado peso DIM) para todos los envíos de FedEx Express y FedEx Ground. El concepto es sencillo: los transportistas cobran por el espacio que ocupa un paquete en sus vehículos, no solo por su peso físico. Una caja grande y ligera ocupa el mismo espacio de carga que una pequeña y pesada, así que FedEx factura la medición que genere más ingresos: el peso real o el dimensional.",
      p2: "FedEx calcula el peso dimensional con: (Largo × Ancho × Alto) ÷ 5.000 en centímetros (resultado en kg), o (L × A × H) ÷ 139 en pulgadas (resultado en libras). El peso facturable es el mayor entre el real y el dimensional. FedEx redondea todas las medidas hacia arriba al entero más cercano antes de calcular.",
    },
    sectionExample: {
      heading: "Ejemplo práctico: pequeño e-commerce",
      intro: "Una tienda online envía accesorios de móvil en cajas de 30 cm × 25 cm × 20 cm. Cada caja tiene un peso real de 500 g (0,5 kg).",
      calc: "Peso dimensional = (30 × 25 × 20) ÷ 5.000 = 15.000 ÷ 5.000 = 3 kg",
      after: "FedEx factura 3 kg en lugar de 0,5 kg, un múltiplo de 6×. Cambiando a una caja más ajustada de 25 × 20 × 15 cm: (25 × 20 × 15) ÷ 5.000 = 7.500 ÷ 5.000 = 1,5 kg. El coste por paquete se reduce a la mitad. Para un negocio que envía 200 paquetes al día, esta diferencia en la elección de caja puede ahorrar $40.000–$80.000 al año según las tarifas contratadas.",
    },
    sectionLimits: {
      heading: "Límites de tamaño y recargos de FedEx",
      items: [
        { label: "Peso máximo", text: "150 lb (68 kg) para paquetes estándar de FedEx Express y Ground." },
        { label: "Largo máximo", text: "119 pulgadas (302 cm) en la dimensión más larga." },
        { label: "Largo más contorno", text: "No puede superar 165 pulgadas (419 cm). Contorno = 2 × (ancho + alto)." },
        { label: "Recargo por tamaño/manipulación", text: "Paquetes con largo superior a 96 pulgadas, o largo más contorno superior a 130 pulgadas, tienen un recargo adicional por manipulación sobre las tarifas estándar." },
        { label: "FedEx Freight", text: "Paquetes que superen estos límites estándar deben enviarse con FedEx Freight, con precios y procedimientos diferentes." },
      ],
    },
    sectionOneRate: {
      heading: "FedEx One Rate: cuándo no se aplica el peso dimensional",
      p1: "FedEx One Rate es un programa de precios fijos para paquetes enviados en embalajes oficiales FedEx One Rate. A diferencia de la tarificación estándar de FedEx, One Rate cobra un precio fijo sin importar el peso real (hasta 50 lb) o el dimensional, siempre que uses los sobres, paks, tubos, cajas o cajas extra grandes de FedEx.",
      p2: "Esto hace que One Rate sea especialmente rentable para artículos densos y pesados que de otro modo tendrían una facturación alta por peso real. Un componente metálico de 20 lb enviado en una caja FedEx One Rate paga el mismo precio fijo que un componente de 2 lb en la misma caja. Sin embargo, para artículos muy ligeros en cajas grandes donde el peso dimensional sería mucho mayor que el real, la tarificación estándar de FedEx puede ser más barata.",
    },
    sectionFaq: {
      heading: "Preguntas frecuentes",
      items: [
        { q: "¿FedEx aplica el peso dimensional a entregas residenciales?", a: "Sí. FedEx aplica el peso dimensional tanto a entregas comerciales como residenciales. Sin embargo, las entregas residenciales también tienen un recargo por entrega residencial (normalmente $5–$10 por paquete). El peso dimensional y los recargos aplicables se calculan por separado y se suman al coste total del envío." },
        { q: "¿Qué es FedEx Ground Economy (antes SmartPost)?", a: "FedEx Ground Economy es un servicio de menor coste para paquetes ligeros que utiliza USPS para la última milla. Es más lento que FedEx Ground estándar pero suele ser más barato para paquetes de menos de 70 lb. El peso dimensional sigue aplicándose, pero la estructura de tarifas es diferente. Es ideal para envíos de e-commerce no urgentes a direcciones residenciales." },
        { q: "¿Cómo disputo un cargo de peso dimensional de FedEx?", a: "Si crees que FedEx midió tu paquete de forma incorrecta, contacta con la facturación de FedEx con tu número de seguimiento y las dimensiones reales medidas. Proporciona evidencia fotográfica del paquete con una cinta métrica si es posible. FedEx revisará los datos de escaneo de sus sistemas de dimensionado. Las disputas de facturación suelen presentarse en un plazo de 60 días desde la fecha de la factura." },
        { q: "¿Qué es la tarificación cúbica de FedEx?", a: "FedEx ocasionalmente usa la «tarificación cúbica» para algunos envíos FedEx Ground, que calcula el coste según el volumen cúbico total del paquete en lugar del peso dimensional. Esto suele afectar a paquetes por encima de cierto umbral de tamaño. Para la mayoría de los remitentes comerciales estándar, el peso dimensional es el cálculo relevante, pero si envías paquetes muy grandes con frecuencia, pregunta a tu representante de cuenta de FedEx sobre las reglas aplicables." },
      ],
    },
    relatedHeading: "Calculadoras relacionadas",
    relatedText: "También prueba nuestra",
    relatedUps: "Calculadora de peso dimensional de UPS",
    relatedDhl: "Calculadora de peso dimensional de DHL",
    relatedGeneric: "calculadora multilingüe de peso volumétrico",
  },
};

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/fedex-dimensional-weight-calculator";

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

export default function FedExDimensionalWeightCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const L0 = LANGUAGES[locale];
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [factor, setFactor] = useState(String(L0.metricFactor));
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("20");
  const [actualWeight, setActualWeight] = useState("8");

  useEffect(() => {
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.pageTitle} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebApplication", name: L.pageTitle, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: L.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      ],
    });
  }, []);

  useEffect(() => {
    setFactor(String(unitSystem === "metric" ? L.metricFactor : L.imperialFactor));
  }, [unitSystem]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    if (typeof window !== "undefined") window.localStorage.setItem("ttb-locale", locale);
  }, [locale]);

  const L = LANGUAGES[locale];

  const units = unitSystem === "metric" ? { dim: "cm", weight: "kg" } : { dim: "in", weight: "lb" };
  const dims = [length, width, height].map((value) => Number(value) || 0);
  const volume = dims.reduce((acc, value) => acc * value, 1);
  const factorNumber = Number(factor) || (unitSystem === "metric" ? L.metricFactor : L.imperialFactor);
  const volumetricWeight = factorNumber > 0 ? volume / factorNumber : 0;
  const actual = Number(actualWeight) || 0;
  const billableWeight = Math.max(actual, volumetricWeight);
  const formatter = useMemo(() => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }), []);
  const formula = unitSystem === "metric" ? L.formulaMetric : L.formulaImperial;
  const formulaText = `${L.formulaLabel}: ${formula} = ${formatter.format(roundToTwo(volumetricWeight))} ${units.weight}`;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
                <Scale className="h-3.5 w-3.5" />
                {L.intro}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{L.pageTitle}</h1>
              <p className="max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">{L.subtitle}</p>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {LOCALES.map((item) => (
                  <button key={item.id} onClick={() => setLocale(item.id)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5"}`}>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                onClick={() => setUnitSystem("metric")}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${unitSystem === "metric" ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5"}`}
              >
                {L.unitMetric}
              </button>
              <button
                onClick={() => setUnitSystem("imperial")}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${unitSystem === "imperial" ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5"}`}
              >
                {L.unitImperial}
              </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{L.fedexCalc}</h2>
                  <p className="text-sm text-neutral-300">{L.subtitle}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.ui.length} ({units.dim})</span>
                  <input value={length} onChange={(e) => setLength(e.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.ui.width} ({units.dim})</span>
                  <input value={width} onChange={(e) => setWidth(e.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.ui.height} ({units.dim})</span>
                  <input value={height} onChange={(e) => setHeight(e.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.ui.actualWeight} ({units.weight})</span>
                  <input value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60" />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm text-neutral-300">{L.ui.factor}</span>
                  <input value={factor} onChange={(e) => setFactor(e.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60" />
                </label>
              </div>

              <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
                <p className="font-medium text-white">{formulaText}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-lg shadow-black/20">
                <h2 className="text-xl font-semibold text-white">{L.resultsTitle}</h2>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.volumetricLabel}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{formatter.format(roundToTwo(volumetricWeight))} {units.weight}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.billableLabel}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{formatter.format(roundToTwo(billableWeight))} {units.weight}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-300">{L.quickLinksTitle}</h3>
                <div className="mt-4 grid gap-2 text-sm text-neutral-200">
                  <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-400/40 hover:bg-white/5" href="/volumetric-weight-calculator">{L.relatedGeneric}</a>
                  <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-400/40 hover:bg-white/5" href="/ups-dimensional-weight-calculator">{L.relatedUps}</a>
                  <a className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-400/40 hover:bg-white/5" href="/dhl-dimensional-weight-calculator">{L.relatedDhl}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-white">{L.examplesTitle}</h2>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                {L.examples.map((example) => (
                  <button
                    key={example.label}
                    onClick={() => {
                      setLength(String(example.dims[0]));
                      setWidth(String(example.dims[1]));
                      setHeight(String(example.dims[2]));
                      setActualWeight(String(example.actual));
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:border-emerald-400/40 hover:bg-white/5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-white">{example.label}</span>
                      <span>{example.dims.join(" × ")} {units.dim}</span>
                    </div>
                    <p className="mt-1 text-neutral-400">{L.actualLabel}: {example.actual} {units.weight}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-semibold text-white">{L.faqTitle}</h2>
              <div className="mt-4 space-y-3">
                {L.faq.map(([q, a]) => (
                  <details key={q} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <summary className="cursor-pointer list-none text-sm font-medium text-white">{q}</summary>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
            <div>
              <h2 className="text-2xl font-bold text-white">{L.sectionHow.heading}</h2>
              <p className="mt-3 leading-7">{L.sectionHow.p1}</p>
              <p className="mt-3 leading-7">{L.sectionHow.p2}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{L.sectionExample.heading}</h2>
              <p className="mt-3 leading-7">{L.sectionExample.intro}</p>
              <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4 font-mono text-sm text-emerald-100">
                {L.sectionExample.calc}
              </div>
              <p className="mt-3 leading-7">{L.sectionExample.after}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{L.sectionLimits.heading}</h2>
              <ul className="mt-3 space-y-2 text-white/70">
                {L.sectionLimits.items.map((item) => (
                  <li key={item.label} className="flex gap-2">
                    <span className="shrink-0 text-emerald-300">→</span>
                    <strong className="text-white">{item.label}:</strong> {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{L.sectionOneRate.heading}</h2>
              <p className="mt-3 leading-7">{L.sectionOneRate.p1}</p>
              <p className="mt-3 leading-7">{L.sectionOneRate.p2}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{L.sectionFaq.heading}</h2>
              <div className="mt-4 space-y-5">
                {L.sectionFaq.items.map((item) => (
                  <div key={item.q}>
                    <h3 className="font-semibold text-white">{item.q}</h3>
                    <p className="mt-1 text-white/70">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-neutral-300">
            <div className="flex items-center gap-3 text-white">
              <Truck className="h-5 w-5 text-emerald-300" />
              <span className="text-base font-semibold">{L.relatedHeading}</span>
            </div>
            <p className="mt-3 leading-6 text-neutral-300">{L.relatedText} <a href="/ups-dimensional-weight-calculator" className="text-emerald-300 hover:underline">{L.relatedUps}</a>, <a href="/dhl-dimensional-weight-calculator" className="text-emerald-300 hover:underline">{L.relatedDhl}</a>, <a href="/volumetric-weight-calculator" className="text-emerald-300 hover:underline">{L.relatedGeneric}</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
