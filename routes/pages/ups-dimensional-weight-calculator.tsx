import { useEffect, useMemo, useState } from "react";
import { BadgeDollarSign, Scale, Truck } from "lucide-react";

const ADSENSE_CLIENT_ID = "";
const ADSENSE_SLOTS = {
  leaderboard: "",
  inline: "",
  footer: "",
};

type AdSenseSlotProps = {
  label: string;
  size: string;
  slotId: string;
  clientId: string;
  minHeight?: number;
};

function AdSenseSlot({ label, size, slotId, clientId, minHeight = 90 }: AdSenseSlotProps) {
  useEffect(() => {
    if (!clientId || !slotId) return;
    const scriptId = `adsense-${clientId}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      document.head.appendChild(script);
    }
    const adsenseWindow = window as Window & { adsbygoogle?: unknown[] };
    adsenseWindow.adsbygoogle = adsenseWindow.adsbygoogle || [];
    try {
      adsenseWindow.adsbygoogle.push({});
    } catch {
    }
  }, [clientId, slotId]);

  if (!clientId || !slotId) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-neutral-300">
        <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-300">
          <BadgeDollarSign className="h-3.5 w-3.5" /> Google Ads
        </div>
        <p className="text-base font-medium text-white">{size}</p>
        <p className="mt-1 text-neutral-400">Paste your AdSense client and slot IDs here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-neutral-300">
      <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-300">
        <BadgeDollarSign className="h-3.5 w-3.5" /> {label}
      </div>
      <ins className="adsbygoogle block" style={{ display: "block", minHeight }} data-ad-client={clientId} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true" />
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-400">{size}</p>
    </div>
  );
}

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
  unitMetric: string;
  unitImperial: string;
  unitsLabel: string;
  resultsTitle: string;
  formulaLabel: string;
  resultFormulaLabel: string;
  billableLabel: string;
  actualLabel: string;
  volumetricLabel: string;
  loadExample: string;
  examplesTitle: string;
  faqTitle: string;
  faq: Array<[string, string]>;
  examples: Array<{ label: string; dims: [number, number, number]; actual: number }>;
  sectionHow: { heading: string; p1: string; p2: string; p3: string };
  sectionExample: { heading: string; intro: string; calc: string; after: string };
  sectionLimits: { heading: string; intro: string; items: Array<{ label: string; text: string }>; footer: string };
  sectionTips: { heading: string; items: Array<{ name: string; text: string }> };
  sectionFaq: { heading: string; items: Array<{ q: string; a: string }> };
  relatedHeading: string;
  relatedText: string;
  relatedFedex: string;
  relatedDhl: string;
  relatedGeneric: string;
  ui: { length: string; width: string; height: string; actualWeight: string; factor: string };
};

const LANGUAGES: Record<LocaleKey, L> = {
  en: {
    pageTitle: "UPS Dimensional Weight Calculator",
    intro: "A boring utility page with one job: help shippers calculate UPS billable weight fast.",
    subtitle: "Calculate UPS billable weight from box dimensions in seconds. Built for people searching for shipping quotes, chargeable weight, and dimensional weight formulas.",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    unitsLabel: "Units",
    resultsTitle: "Result",
    formulaLabel: "UPS formula",
    resultFormulaLabel: "Formula",
    billableLabel: "Billable weight",
    actualLabel: "Actual weight",
    volumetricLabel: "Volumetric (DIM) weight",
    loadExample: "Load example",
    examplesTitle: "Try a preset example",
    faqTitle: "FAQ",
    faq: [
      ["What is UPS dimensional weight?", "It is the chargeable weight UPS may use when a parcel takes up more space than its actual weight suggests."],
      ["Why is billable weight important?", "Because the carrier usually charges the greater of actual weight and dimensional weight."],
      ["Can I change units?", "Yes, switch between cm/kg and in/lb anytime."],
    ],
    examples: [
      { label: "Small parcel", dims: [30, 20, 15], actual: 4 },
      { label: "Retail box", dims: [40, 30, 20], actual: 6 },
      { label: "Large carton", dims: [60, 40, 40], actual: 12 },
    ],
    sectionHow: {
      heading: "How UPS Dimensional Weight Pricing Works",
      p1: "UPS uses a pricing technique called dimensional weight (also called DIM weight or volumetric weight) to ensure that large but light packages pay a fair price for the space they occupy. A package that is physically large but weighs very little — like a box of pillows or inflated foam packaging — takes up as much room in a UPS truck or aircraft as a dense, heavy package, but would generate far less revenue if billed purely by actual weight.",
      p2: "UPS calculates dimensional weight using the formula: (Length × Width × Height) ÷ 5,000 for centimetre measurements (result in kg), or (L × W × H) ÷ 139 for inch measurements (result in pounds). UPS then compares the dimensional weight against the actual weight on a scale and charges whichever is higher — this is called the \"billable weight.\"",
      p3: "Unlike some older carrier policies, UPS currently applies dimensional weight pricing to all packages for UPS Ground, UPS Air, and UPS International services. There is no minimum package size threshold that exempts packages from dimensional weight calculations.",
    },
    sectionExample: {
      heading: "Worked Example: Clothing Retailer",
      intro: "A clothing retailer ships sweaters in boxes measuring 50 cm × 40 cm × 20 cm. Each sweater weighs 600 grams (0.6 kg) and they ship 5 per box, for an actual weight of 3 kg.",
      calc: "Dimensional weight = (50 × 40 × 20) ÷ 5,000 = 40,000 ÷ 5,000 = 8 kg",
      after: "UPS bills 8 kg instead of 3 kg — 2.7× the actual weight. At a UPS rate of $6/kg, the shipping cost is $48 per box instead of $18. By switching to a 40 × 35 × 18 cm box: (40 × 35 × 18) ÷ 5,000 = 25,200 ÷ 5,000 = 5.04 kg — a saving of nearly $18 per shipment, adding up to hundreds or thousands of dollars per month for higher-volume shippers.",
    },
    sectionLimits: {
      heading: "UPS Size and Weight Limits",
      intro: "Before calculating dimensional weight, it's worth knowing the absolute size and weight limits for standard UPS shipping:",
      items: [
        { label: "Maximum weight", text: "150 lbs (68 kg) per package for most UPS services." },
        { label: "Maximum length", text: "108 inches (274 cm) for the single longest side." },
        { label: "Length plus girth", text: "Combined cannot exceed 165 inches (419 cm). Girth = 2 × (width + height)." },
        { label: "Oversize surcharge", text: "Packages with length over 96 inches, or length plus girth over 130 inches, incur additional \"large package\" surcharges." },
      ],
      footer: "Packages that exceed these limits must be shipped as UPS Freight rather than standard parcel service, which involves different pricing and handling.",
    },
    sectionTips: {
      heading: "Tips to Reduce UPS Dimensional Weight Charges",
      items: [
        { name: "Right-size your boxes.", text: "Using boxes that are close to your product dimensions is the single most effective way to reduce dimensional weight charges. A well-fitting box with minimal void fill saves on dimensional weight and also reduces fill material costs." },
        { name: "Use void fill efficiently.", text: "Only use the minimum padding needed to protect the product. Air pillows, paper fill, and foam are all added space that increases dimensional weight without adding useful volume." },
        { name: "Negotiate a custom divisor.", text: "Businesses shipping high volumes with UPS can negotiate account-based rates, which may include a higher divisor (e.g., 6,000 instead of 5,000) — reducing your dimensional weight calculations by 16.7%." },
        { name: "Compare UPS service levels.", text: "UPS Ground is generally cheaper for heavier ground-based shipments; UPS Air services cost more per kg but may be justified for time-sensitive deliveries. Compare billable weights across service tiers." },
        { name: "Explore flat-rate alternatives.", text: "For packages under certain thresholds, USPS flat-rate boxes or UPS Simple Rate may cost less than dimensional weight pricing, particularly for dense, heavy items in small boxes." },
      ],
    },
    sectionFaq: {
      heading: "Frequently Asked Questions",
      items: [
        { q: "Does UPS apply dimensional weight to all packages or just oversized ones?", a: "UPS applies dimensional weight to all packages shipped via UPS Ground, UPS Air, and International services. Unlike USPS (which has a minimum cubic foot threshold), UPS has no package size threshold — even small packages are subject to dimensional weight pricing if the calculated DIM weight exceeds actual weight." },
        { q: "What is UPS Hundredweight Service?", a: "UPS Hundredweight Service is a volume pricing program for multi-package shipments of 100 lbs or more travelling to the same destination on the same day. Rather than rating each package individually, all packages are rated together by total weight. This can significantly reduce per-package costs for businesses shipping multiple boxes to a single address." },
        { q: "How does UPS verify package dimensions?", a: "UPS uses automated measurement systems at sorting facilities, including 3D imaging cameras and laser dimensioners, that scan packages as they travel along conveyor belts. If the measured dimensions differ from what the shipper declared, UPS will apply a billing adjustment based on the measured dimensions. Repeated discrepancies may result in account review." },
        { q: "What is the difference between actual weight and billable weight?", a: "Actual weight is what the package physically weighs when placed on a scale, rounded up to the nearest whole pound or 0.5 kg. Dimensional weight is the calculated weight based on the package's volume using the DIM factor. Billable weight is simply the higher of these two values — the weight that UPS will actually charge you for. When dimensional weight exceeds actual weight, you are being charged for \"space occupied\" rather than \"matter moved.\"" },
      ],
    },
    relatedHeading: "Related calculators",
    relatedText: "Also try our",
    relatedFedex: "FedEx Dimensional Weight Calculator",
    relatedDhl: "DHL Dimensional Weight Calculator",
    relatedGeneric: "multilingual Volumetric Weight Calculator that supports all major carriers",
    ui: { length: "Length", width: "Width", height: "Height", actualWeight: "Actual weight", factor: "DIM factor" },
  },
  "zh-hk": {
    pageTitle: "UPS 體積重量計算器",
    intro: "一個無聊嘅實用頁，只做一件事：幫你極速計算 UPS 嘅計費重量。",
    subtitle: "幾秒之內用箱嘅尺寸計到 UPS 嘅計費重量。專為搜尋運費報價、收費重量、體積重量公式嘅人而設。",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    unitsLabel: "單位",
    resultsTitle: "結果",
    formulaLabel: "UPS 公式",
    resultFormulaLabel: "公式",
    billableLabel: "計費重量",
    actualLabel: "實際重量",
    volumetricLabel: "體積（DIM）重量",
    loadExample: "載入示例",
    examplesTitle: "試下預設示例",
    faqTitle: "常見問題",
    faq: [
      ["咩係 UPS 體積重量？", "即係當包裹佔嘅空間大過實際重量嗰陣，UPS 可能會用嚟計費嘅重量。"],
      ["點解計費重量咁重要？", "因為快遞公司通常會用實際重量同體積重量入面較高嗰個嚟收費。"],
      ["可以轉單位嗎？", "可以，cm/kg 同 in/lb 隨時切換。"],
    ],
    examples: [
      { label: "細包裹", dims: [30, 20, 15], actual: 4 },
      { label: "零售箱", dims: [40, 30, 20], actual: 6 },
      { label: "大紙箱", dims: [60, 40, 40], actual: 12 },
    ],
    sectionHow: {
      heading: "UPS 體積重量點樣計",
      p1: "UPS 用一種叫體積重量（又叫 DIM weight 或 volumetric weight）嘅方法，確保大件輕貨會按佢佔嘅空間公平收費。一個大但好輕嘅包裹，例如裝滿枕頭或者充氣泡沫嘅箱，喺 UPS 貨車或飛機入面同實心重包裹佔一樣嘅空間，但如果只按實際重量收費就會少收好多。",
      p2: "UPS 用呢個公式計體積重量：（長 × 闊 × 高）÷ 5,000（用厘米、結果係 kg），或者（L × W × H）÷ 139（用吋、結果係磅）。UPS 會將體積重量同實際重量比較，邊個高就收邊個 — 嗰個就叫「計費重量」。",
      p3: "同其他快遞唔同，UPS 對所有 UPS Ground、UPS Air 同 UPS International 服務都會用體積重量收費，冇最低尺寸豁免。",
    },
    sectionExample: {
      heading: "實例：服裝零售商",
      intro: "一個服裝零售商寄冷衫，箱嘅尺寸係 50 cm × 40 cm × 20 cm。每件冷衫 600 克（0.6 kg），每箱裝 5 件，實際重量 3 kg。",
      calc: "體積重量 = (50 × 40 × 20) ÷ 5,000 = 40,000 ÷ 5,000 = 8 kg",
      after: "UPS 收 8 kg 而唔係 3 kg —— 即實際重量嘅 2.7 倍。如果 UPS 收 $6/kg，每箱運費 $48 而唔係 $18。如果轉用 40 × 35 × 18 cm 嘅箱：(40 × 35 × 18) ÷ 5,000 = 25,200 ÷ 5,000 = 5.04 kg —— 每箱慳返差唔多 $18，寄得多嘅話一個月慳幾百至幾千蚊。",
    },
    sectionLimits: {
      heading: "UPS 尺寸同重量上限",
      intro: "計體積重量之前，先了解標準 UPS 寄件嘅尺寸同重量上限：",
      items: [
        { label: "最高重量", text: "大部分 UPS 服務每件最高 150 磅（68 kg）。" },
        { label: "最長邊長度", text: "最長單邊 108 吋（274 cm）。" },
        { label: "長度加腰圍", text: "總和唔可以超過 165 吋（419 cm）。腰圍 = 2 ×（闊 + 高）。" },
        { label: "超大件附加費", text: "長度超過 96 吋，或者長加腰圍超過 130 吋，會額外加「大件」附加費。" },
      ],
      footer: "超過呢啲限制嘅件要改用 UPS Freight 寄，計費同處理都唔同。",
    },
    sectionTips: {
      heading: "點樣減 UPS 體積重量收費",
      items: [
        { name: "用啱 size 嘅箱。", text: "用貼近產品尺寸嘅箱係減體積重量最有效嘅方法。箱啱 size、冇乜空隙，體積重量細啲，填充物料費都慳埋。" },
        { name: "慳用填充物。", text: "只用保護產品所需要嘅最少填充。氣泡袋、紙填充、泡沫都係額外空間，會增加體積重量但無實際用處。" },
        { name: "傾自訂除數。", text: "寄得多嘅商家可以同 UPS 傾帳戶價，除數可能高過 5,000（例如 6,000）—— 體積重量即時減 16.7%。" },
        { name: "比較 UPS 服務級別。", text: "UPS Ground 一般對重件、平件較平；UPS Air 每 kg 貴啲，但急件值得用。記得跨服務級別比較計費重量。" },
        { name: "考慮均一價。", text: "細箱重件嘅情況下，USPS 均一價箱或者 UPS Simple Rate 隨時比體積重量計法平。" },
      ],
    },
    sectionFaq: {
      heading: "常見問題",
      items: [
        { q: "UPS 對所有件都收體積重量，定只收超大件？", a: "UPS Ground、UPS Air 同 International 服務全部都會用體積重量。同 USPS 唔同（USPS 有最低立方呎門檻），UPS 冇任何尺寸豁免 —— 即使細件，只要算出嘅 DIM 重量高過實際重量都會被收體積重量。" },
        { q: "咩係 UPS Hundredweight Service？", a: "UPS Hundredweight Service 係一個專為同日同目的地寄 100 磅以上多件嘅商家設嘅批量定價方案。唔係逐件計，而係合計總重量計，對於一次寄多箱去同一地址嘅商家可以慳唔少。" },
        { q: "UPS 點樣核實件嘅尺寸？", a: "UPS 喺分揀中心用自動量度系統，包括 3D 攝影機同激光尺寸機，喺輸送帶上掃描每件包裹。如果量到嘅尺寸同寄件人申報嘅唔同，UPS 會按量度到嘅尺寸調整收費，重複出錯可能會被審查帳戶。" },
        { q: "實際重量同計費重量有咩分別？", a: "實際重量係放上磅度到嘅重量，會進位到最接近嘅整磅或 0.5 kg。體積重量係根據件嘅體積同 DIM 除數算出嚟。計費重量就係兩者入面高嗰個 —— UPS 真正收你嗰個。當體積重量高過實際重量，你其實係畀錢買「空間」而唔係「重量」。" },
      ],
    },
    relatedHeading: "相關計算器",
    relatedText: "也可以試下我哋嘅",
    relatedFedex: "FedEx 體積重量計算器",
    relatedDhl: "DHL 體積重量計算器",
    relatedGeneric: "多語言體積重量計算器，支援各大快遞",
    ui: { length: "長度", width: "闊度", height: "高度", actualWeight: "實際重量", factor: "DIM 除數" },
  },
  "zh-cn": {
    pageTitle: "UPS 体积重量计算器",
    intro: "一个无聊的实用页，只做一件事：帮你极速计算 UPS 的计费重量。",
    subtitle: "几秒之内用箱子的尺寸算到 UPS 的计费重量。专为搜索运费报价、收费重量、体积重量公式的人而设。",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    unitsLabel: "单位",
    resultsTitle: "结果",
    formulaLabel: "UPS 公式",
    resultFormulaLabel: "公式",
    billableLabel: "计费重量",
    actualLabel: "实际重量",
    volumetricLabel: "体积（DIM）重量",
    loadExample: "载入示例",
    examplesTitle: "试一下预设示例",
    faqTitle: "常见问题",
    faq: [
      ["什么是 UPS 体积重量？", "即当包裹占的空间大于实际重量时，UPS 可能会用来计费的重量。"],
      ["为什么计费重量这么重要？", "因为快递公司通常会用实际重量和体积重量中较高的那个来收费。"],
      ["可以换单位吗？", "可以，cm/kg 和 in/lb 随时切换。"],
    ],
    examples: [
      { label: "小包裹", dims: [30, 20, 15], actual: 4 },
      { label: "零售箱", dims: [40, 30, 20], actual: 6 },
      { label: "大纸箱", dims: [60, 40, 40], actual: 12 },
    ],
    sectionHow: {
      heading: "UPS 体积重量怎么算",
      p1: "UPS 用一种叫体积重量（又叫 DIM weight 或 volumetric weight）的方法，确保大件轻货会按它占的空间公平收费。一个大但很轻的包裹，比如装满枕头或充气泡沫的箱，在 UPS 货车或飞机里和实心重包裹占一样的空间，但如果只按实际重量收费就会少收很多。",
      p2: "UPS 用这个公式算体积重量：（长 × 宽 × 高）÷ 5,000（用厘米、结果是 kg），或者（L × W × H）÷ 139（用英寸、结果是磅）。UPS 会将体积重量和实际重量比较，哪个高就收哪个 —— 那个就叫「计费重量」。",
      p3: "和其他快递不同，UPS 对所有 UPS Ground、UPS Air 和 UPS International 服务都会用体积重量收费，没有最低尺寸豁免。",
    },
    sectionExample: {
      heading: "实例：服装零售商",
      intro: "一个服装零售商寄毛衣，箱子的尺寸是 50 cm × 40 cm × 20 cm。每件毛衣 600 克（0.6 kg），每箱装 5 件，实际重量 3 kg。",
      calc: "体积重量 = (50 × 40 × 20) ÷ 5,000 = 40,000 ÷ 5,000 = 8 kg",
      after: "UPS 收 8 kg 而不是 3 kg —— 即实际重量的 2.7 倍。如果 UPS 收 $6/kg，每箱运费 $48 而不是 $18。如果改用 40 × 35 × 18 cm 的箱：(40 × 35 × 18) ÷ 5,000 = 25,200 ÷ 5,000 = 5.04 kg —— 每箱省差不多 $18，寄得多的话一个月省几百到几千美元。",
    },
    sectionLimits: {
      heading: "UPS 尺寸和重量上限",
      intro: "算体积重量之前，先了解标准 UPS 寄件的尺寸和重量上限：",
      items: [
        { label: "最高重量", text: "大部分 UPS 服务每件最高 150 磅（68 kg）。" },
        { label: "最长边长度", text: "最长单边 108 英寸（274 cm）。" },
        { label: "长度加腰围", text: "总和不能超过 165 英寸（419 cm）。腰围 = 2 ×（宽 + 高）。" },
        { label: "超大件附加费", text: "长度超过 96 英寸，或者长加腰围超过 130 英寸，会额外加「大件」附加费。" },
      ],
      footer: "超过这些限制的件要改用 UPS Freight 寄，计费和处理都不同。",
    },
    sectionTips: {
      heading: "怎样减 UPS 体积重量收费",
      items: [
        { name: "用合适 size 的箱。", text: "用贴近产品尺寸的箱是减体积重量最有效的方法。箱合适、没什么空隙，体积重量小，填充物料费也省了。" },
        { name: "省用填充物。", text: "只用保护产品所需的最少填充。气泡袋、纸填充、泡沫都是额外空间，会增加体积重量但没实际用处。" },
        { name: "谈自定除数。", text: "寄得多的商家可以和 UPS 谈账户价，除数可能高于 5,000（比如 6,000）—— 体积重量立即降 16.7%。" },
        { name: "比较 UPS 服务级别。", text: "UPS Ground 一般对重件、平件较便宜；UPS Air 每 kg 贵些，但急件值得用。一定要跨服务级别比较计费重量。" },
        { name: "考虑均一价。", text: "小箱重件的情况下，USPS 均一价箱或者 UPS Simple Rate 可能比体积重量算法便宜。" },
      ],
    },
    sectionFaq: {
      heading: "常见问题",
      items: [
        { q: "UPS 对所有件都收体积重量，还是只收超大件？", a: "UPS Ground、UPS Air 和 International 服务全部都会用体积重量。和 USPS 不同（USPS 有最低立方英尺门槛），UPS 没有任何尺寸豁免 —— 即使小件，只要算出的 DIM 重量高于实际重量都会被收体积重量。" },
        { q: "什么是 UPS Hundredweight Service？", a: "UPS Hundredweight Service 是一个专为同日同目的地寄 100 磅以上多件的商家设的批量定价方案。不是逐件算，而是合计总重量算，对于一次寄多箱去同一地址的商家可以省不少。" },
        { q: "UPS 怎样核实件子的尺寸？", a: "UPS 在分拣中心用自动测量系统，包括 3D 摄影机和激光尺寸机，在传送带上扫描每件包裹。如果量到的尺寸和寄件人申报的不同，UPS 会按量到的尺寸调整收费，重复出错可能会被审查账户。" },
        { q: "实际重量和计费重量有什么区别？", a: "实际重量是放上秤到的重量，会进位到最近的整磅或 0.5 kg。体积重量是根据件子的体积和 DIM 除数算出来。计费重量就是两者中高的那个 —— UPS 真正收你那个。当体积重量高于实际重量，你其实是在付钱买「空间」而不是「重量」。" },
      ],
    },
    relatedHeading: "相关计算器",
    relatedText: "也可以试一下我们的",
    relatedFedex: "FedEx 体积重量计算器",
    relatedDhl: "DHL 体积重量计算器",
    relatedGeneric: "多语言体积重量计算器，支持各大快递",
    ui: { length: "长度", width: "宽度", height: "高度", actualWeight: "实际重量", factor: "DIM 除数" },
  },
  es: {
    pageTitle: "Calculadora de peso dimensional de UPS",
    intro: "Una página útil y aburrida con un solo trabajo: ayudar a los envíos a calcular el peso facturable de UPS rápidamente.",
    subtitle: "Calcula el peso facturable de UPS a partir de las dimensiones de la caja en segundos. Pensada para personas que buscan cotizaciones de envío, peso facturable y fórmulas de peso dimensional.",
    unitMetric: "cm / kg",
    unitImperial: "in / lb",
    unitsLabel: "Unidades",
    resultsTitle: "Resultado",
    formulaLabel: "Fórmula UPS",
    resultFormulaLabel: "Fórmula",
    billableLabel: "Peso facturable",
    actualLabel: "Peso real",
    volumetricLabel: "Peso volumétrico (DIM)",
    loadExample: "Cargar ejemplo",
    examplesTitle: "Prueba un ejemplo predefinido",
    faqTitle: "Preguntas frecuentes",
    faq: [
      ["¿Qué es el peso dimensional de UPS?", "Es el peso que UPS puede usar para facturar cuando un paquete ocupa más espacio del que su peso real sugiere."],
      ["¿Por qué es importante el peso facturable?", "Porque el transportista suele cobrar el mayor entre el peso real y el peso dimensional."],
      ["¿Puedo cambiar las unidades?", "Sí, cambia entre cm/kg y in/lb cuando quieras."],
    ],
    examples: [
      { label: "Paquete pequeño", dims: [30, 20, 15], actual: 4 },
      { label: "Caja minorista", dims: [40, 30, 20], actual: 6 },
      { label: "Caja grande", dims: [60, 40, 40], actual: 12 },
    ],
    sectionHow: {
      heading: "Cómo funciona la facturación por peso dimensional de UPS",
      p1: "UPS utiliza una técnica de fijación de precios llamada peso dimensional (también peso DIM o peso volumétrico) para garantizar que los paquetes grandes y ligeros paguen un precio justo por el espacio que ocupan. Un paquete físicamente grande pero muy ligero, como una caja de almohadas o espuma inflable, ocupa tanto espacio en un camión o avión de UPS como un paquete denso y pesado, pero generaría muchos menos ingresos si se facturara solo por peso real.",
      p2: "UPS calcula el peso dimensional con la fórmula: (Largo × Ancho × Alto) ÷ 5.000 para centímetros (resultado en kg), o (L × A × H) ÷ 139 para pulgadas (resultado en libras). UPS compara el peso dimensional con el peso real en una balanza y cobra el mayor: este es el \"peso facturable\".",
      p3: "A diferencia de algunas políticas más antiguas, UPS aplica actualmente el precio por peso dimensional a todos los paquetes de UPS Ground, UPS Air y UPS International. No hay un tamaño mínimo de paquete que los exima del cálculo de peso dimensional.",
    },
    sectionExample: {
      heading: "Ejemplo práctico: minorista de ropa",
      intro: "Una tienda de ropa envía suéteres en cajas de 50 cm × 40 cm × 20 cm. Cada suéter pesa 600 gramos (0,6 kg) y envían 5 por caja, para un peso real de 3 kg.",
      calc: "Peso dimensional = (50 × 40 × 20) ÷ 5.000 = 40.000 ÷ 5.000 = 8 kg",
      after: "UPS factura 8 kg en lugar de 3 kg — 2,7× el peso real. Con una tarifa UPS de $6/kg, el costo de envío es $48 por caja en lugar de $18. Cambiando a una caja de 40 × 35 × 18 cm: (40 × 35 × 18) ÷ 5.000 = 25.200 ÷ 5.000 = 5,04 kg — un ahorro de casi $18 por envío, sumando cientos o miles de dólares al mes para envíos de alto volumen.",
    },
    sectionLimits: {
      heading: "Límites de tamaño y peso de UPS",
      intro: "Antes de calcular el peso dimensional, conviene conocer los límites absolutos de tamaño y peso del envío estándar de UPS:",
      items: [
        { label: "Peso máximo", text: "150 lb (68 kg) por paquete en la mayoría de servicios UPS." },
        { label: "Largo máximo", text: "108 pulgadas (274 cm) en el lado más largo." },
        { label: "Largo más contorno", text: "No puede superar 165 pulgadas (419 cm) en total. Contorno = 2 × (ancho + alto)." },
        { label: "Recargo por tamaño", text: "Paquetes con largo superior a 96 pulgadas, o largo más contorno superior a 130 pulgadas, tienen un recargo adicional por \"paquete grande\"." },
      ],
      footer: "Los paquetes que superen estos límites deben enviarse como UPS Freight en lugar del servicio de paquetería estándar, con precios y manejo diferentes.",
    },
    sectionTips: {
      heading: "Consejos para reducir los cargos por peso dimensional de UPS",
      items: [
        { name: "Usa cajas del tamaño adecuado.", text: "Usar cajas cercanas a las dimensiones de tu producto es la forma más eficaz de reducir los cargos por peso dimensional. Una caja ajustada con poco material de relleno ahorra en peso dimensional y en coste de relleno." },
        { name: "Usa relleno con eficiencia.", text: "Usa solo el acolchado mínimo necesario para proteger el producto. Cojines de aire, papel y espuma ocupan espacio que aumenta el peso dimensional sin aportar volumen útil." },
        { name: "Negocia un divisor personalizado.", text: "Las empresas con alto volumen pueden negociar tarifas por cuenta con UPS, que pueden incluir un divisor mayor (p. ej., 6.000 en lugar de 5.000), reduciendo el peso dimensional en un 16,7%." },
        { name: "Compara niveles de servicio UPS.", text: "UPS Ground suele ser más económico para envíos pesados por tierra; UPS Air cuesta más por kg pero puede justificarse para entregas urgentes. Compara el peso facturable entre niveles de servicio." },
        { name: "Explora alternativas de tarifa plana.", text: "Para paquetes por debajo de ciertos umbrales, las cajas de tarifa plana de USPS o UPS Simple Rate pueden ser más baratas que el precio por peso dimensional, sobre todo para artículos densos y pesados en cajas pequeñas." },
      ],
    },
    sectionFaq: {
      heading: "Preguntas frecuentes",
      items: [
        { q: "¿UPS aplica peso dimensional a todos los paquetes o solo a los grandes?", a: "UPS aplica peso dimensional a todos los paquetes enviados por UPS Ground, UPS Air e International. A diferencia de USPS (que tiene un umbral mínimo de pie cúbico), UPS no tiene umbral de tamaño: incluso los paquetes pequeños están sujetos al precio por peso dimensional si el peso DIM calculado supera al peso real." },
        { q: "¿Qué es UPS Hundredweight Service?", a: "UPS Hundredweight Service es un programa de precios por volumen para envíos de varios paquetes de 100 lb o más al mismo destino el mismo día. En lugar de valorar cada paquete por separado, todos se valoran juntos por el peso total, lo que puede reducir mucho el coste por paquete para empresas que envían varias cajas a una misma dirección." },
        { q: "¿Cómo verifica UPS las dimensiones de los paquetes?", a: "UPS utiliza sistemas automatizados de medición en sus centros de clasificación, incluidas cámaras 3D y medidores láser, que escanean los paquetes a medida que avanzan por las cintas transportadoras. Si las dimensiones medidas difieren de las declaradas por el remitente, UPS aplica un ajuste de facturación según las dimensiones medidas. Las discrepancias reiteradas pueden provocar una revisión de la cuenta." },
        { q: "¿Cuál es la diferencia entre peso real y peso facturable?", a: "El peso real es lo que pesa el paquete en una balanza, redondeado hacia arriba a la libra entera o 0,5 kg más cercanos. El peso dimensional es el peso calculado a partir del volumen del paquete usando el factor DIM. El peso facturable es simplemente el mayor de estos dos valores: lo que UPS te cobrará. Cuando el peso dimensional supera al real, estás pagando por \"espacio ocupado\" en lugar de \"materia transportada\"." },
      ],
    },
    relatedHeading: "Calculadoras relacionadas",
    relatedText: "También prueba nuestra",
    relatedFedex: "Calculadora de peso dimensional de FedEx",
    relatedDhl: "Calculadora de peso dimensional de DHL",
    relatedGeneric: "calculadora multilingüe de peso volumétrico compatible con los principales transportistas",
    ui: { length: "Largo", width: "Ancho", height: "Alto", actualWeight: "Peso real", factor: "Factor DIM" },
  },
};

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/ups-dimensional-weight-calculator";
const METRIC_FACTOR = 5000;
const IMPERIAL_FACTOR = 139;

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

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

export default function UpsDimensionalWeightCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [factor, setFactor] = useState(String(METRIC_FACTOR));
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("20");
  const [actualWeight, setActualWeight] = useState("8");

  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : locale === "zh-cn" ? "zh-Hans-CN" : locale;
    if (typeof window !== "undefined") window.localStorage.setItem("ttb-locale", locale);
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
  }, [locale]);

  useEffect(() => {
    setFactor(String(unitSystem === "metric" ? METRIC_FACTOR : IMPERIAL_FACTOR));
  }, [unitSystem]);

  const L = LANGUAGES[locale];

  const units = unitSystem === "metric" ? { dim: "cm", weight: "kg" } : { dim: "in", weight: "lb" };
  const dims = [length, width, height].map((value) => Number(value) || 0);
  const volume = dims.reduce((acc, value) => acc * value, 1);
  const factorNumber = Number(factor) || (unitSystem === "metric" ? METRIC_FACTOR : IMPERIAL_FACTOR);
  const volumetricWeight = factorNumber > 0 ? volume / factorNumber : 0;
  const actual = Number(actualWeight) || 0;
  const billableWeight = Math.max(actual, volumetricWeight);
  const formatter = useMemo(() => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }), []);
  const formulaText = `${L.formulaLabel}: L × W × H ÷ ${unitSystem === "metric" ? METRIC_FACTOR : IMPERIAL_FACTOR}`;

  const loadExample = (dims: [number, number, number], actual: number) => {
    setLength(String(dims[0]));
    setWidth(String(dims[1]));
    setHeight(String(dims[2]));
    setActualWeight(String(actual));
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
                <Scale className="h-3.5 w-3.5" /> {L.intro}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{L.pageTitle}</h1>
              <p className="max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">{L.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {LOCALES.map((item) => (
                <button key={item.id} onClick={() => setLocale(item.id)} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:w-[18rem]">
            <button onClick={() => setUnitSystem("metric")} className={`rounded-2xl border px-4 py-3 text-sm transition ${unitSystem === "metric" ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5"}`}>
              {L.unitMetric}
            </button>
            <button onClick={() => setUnitSystem("imperial")} className={`rounded-2xl border px-4 py-3 text-sm transition ${unitSystem === "imperial" ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5"}`}>
              {L.unitImperial}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-white">{L.unitsLabel}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{L.ui.length}</span>
                <input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{L.ui.width}</span>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{L.ui.height}</span>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{L.ui.actualWeight}</span>
                <input type="number" value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-neutral-300">{L.ui.factor}</span>
                <input type="number" value={factor} onChange={(e) => setFactor(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
            <h2 className="text-xl font-semibold text-white">{L.resultsTitle}</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.billableLabel}</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-200">{formatter.format(roundToTwo(billableWeight))} {units.weight}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.actualLabel}</p>
                  <p className="mt-2 text-lg text-white">{formatter.format(roundToTwo(actual))} {units.weight}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.volumetricLabel}</p>
                  <p className="mt-2 text-lg text-white">{formatter.format(roundToTwo(volumetricWeight))} {units.weight}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.resultFormulaLabel}</p>
                <p className="mt-2 font-mono text-sm text-emerald-100">{formulaText}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-white">{L.examplesTitle}</h2>
            <div className="mt-4 space-y-2">
              {L.examples.map((example) => (
                <button key={example.label} onClick={() => loadExample(example.dims, example.actual)} className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-emerald-300/40 hover:bg-white/5">
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

        <AdSenseSlot clientId={ADSENSE_CLIENT_ID} slotId={ADSENSE_SLOTS.footer} label="Google Ad slot" size="728 × 90 footer slot" minHeight={90} />

        <article className="mt-6 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          <div>
            <h2 className="text-2xl font-bold text-white">{L.sectionHow.heading}</h2>
            <p className="mt-3 leading-7">{L.sectionHow.p1}</p>
            <p className="mt-3 leading-7">{L.sectionHow.p2}</p>
            <p className="mt-3 leading-7">{L.sectionHow.p3}</p>
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
            <p className="mt-3 leading-7">{L.sectionLimits.intro}</p>
            <ul className="mt-3 space-y-2 text-white/70">
              {L.sectionLimits.items.map((item) => (
                <li key={item.label} className="flex gap-2">
                  <span className="shrink-0 text-emerald-300">→</span>
                  <span><strong className="text-white">{item.label}:</strong> {item.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 leading-7">{L.sectionLimits.footer}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.sectionTips.heading}</h2>
            <ul className="mt-3 space-y-3 text-white/70">
              {L.sectionTips.items.map((item) => (
                <li key={item.name}>
                  <strong className="text-white">{item.name}</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.sectionFaq.heading}</h2>
            <div className="mt-4 space-y-5">
              {L.sectionFaq.items.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold text-white">{faq.q}</h3>
                  <p className="mt-1 text-white/70">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-neutral-300">
          <div className="flex items-center gap-3 text-white">
            <Truck className="h-5 w-5 text-emerald-300" />
            <span className="text-base font-semibold">{L.relatedHeading}</span>
          </div>
          <p className="mt-3 leading-6 text-neutral-300">
            {L.relatedText} <a href="/fedex-dimensional-weight-calculator" className="text-emerald-300 hover:underline">{L.relatedFedex}</a>, <a href="/dhl-dimensional-weight-calculator" className="text-emerald-300 hover:underline">{L.relatedDhl}</a>, and the <a href="/volumetric-weight-calculator" className="text-emerald-300 hover:underline">{L.relatedGeneric}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}