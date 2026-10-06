import { useEffect, useMemo, useState } from "react";
import { Faq, RelatedList, SITE_URL, ToolPage, applySEO } from "@/components/tt/chrome";
import { useLocale, type Locale } from "@/lib/use-locale";

// DHL Express rules used here (checked against DHL's own guidance):
//  - volumetric weight = L × W × H ÷ 5,000 (cm → kg) or ÷ 139 (in → lb)
//  - billed weight is the greater of actual and volumetric weight
//  - sides are rounded up to whole units; DHL Express rounds the billed
//    weight up to the next 0.5 kg. Imperial rounding steps vary by rate
//    card, so we show the exact figure there instead of guessing.

const PAGE_PATH = "/dhl-dimensional-weight-calculator";
const DIVISOR = { metric: 5000, imperial: 139 } as const;
type Units = keyof typeof DIVISOR;

const NUMBER_LOCALE: Record<Locale, string> = { en: "en-US", "zh-hk": "zh-HK", "zh-cn": "zh-CN", ja: "ja-JP", es: "es-ES" };

const EXAMPLES: Record<Units, Array<{ dims: [number, number, number]; actual: number }>> = {
  metric: [
    { dims: [30, 20, 15], actual: 4 },
    { dims: [33, 22, 12], actual: 1 },
    { dims: [60, 40, 40], actual: 12 },
  ],
  imperial: [
    { dims: [12, 8, 6], actual: 3 },
    { dims: [13, 9, 5], actual: 2 },
    { dims: [24, 16, 16], actual: 25 },
  ],
};

type Copy = {
  section: string; crumbHome: string; crumbShipping: string;
  title: string; lede: string; seoTitle: string; seoDesc: string;
  calcTitle: string; unitMetric: string; unitImperial: string;
  length: string; width: string; height: string; actual: string;
  billLabel: string;
  dimWins: (dim: string, act: string, u: string) => [string, string];
  weightWins: () => [string, string];
  emptyHint: string;
  rowVol: string; rowActual: string;
  roundMetric: (exact: string, u: string) => string;
  roundImperial: string;
  formulaLabel: string;
  examplesLabel: string; examples: [string, string, string];
  divisorSummary: string; divisorHelp: string; divisorLabel: string;
  howTitle: string; howP1: string; howP2: string;
  exTitle: string; exIntro: string; exCalc: string; exAfter: string;
  limitsTitle: string; limitsIntro: string; limits: Array<{ label: string; text: string }>;
  faqTitle: string; faq: Array<{ q: string; a: string }>;
  compareTitle: string; nextTitle: string;
  related: Record<"fedex" | "ups" | "vol" | "invoice" | "unit" | "currency", [string, string]>;
};

const COPY: Record<Locale, Copy> = {
  en: {
    section: "Everyday tools", crumbHome: "Home", crumbShipping: "Shipping",
    title: "DHL Dimensional Weight Calculator",
    lede: "Find out in seconds whether DHL will bill your parcel by its real weight or by its size.",
    seoTitle: "DHL Dimensional Weight Calculator — Volumetric & Billable Weight | TinyToolboxes",
    seoDesc: "Free DHL dimensional weight calculator. Enter your box size and weight to see DHL's volumetric weight (L×W×H÷5000 or ÷139) and what you'll be billed. No sign-up.",
    calcTitle: "Your parcel", unitMetric: "cm · kg", unitImperial: "in · lb",
    length: "Length", width: "Width", height: "Height", actual: "Actual weight",
    billLabel: "DHL bills for",
    dimWins: (dim, act, u) => [`DHL bills the size: ${dim} ${u}`, `, not the ${act} ${u} it weighs. You're paying for space, not weight.`],
    weightWins: () => ["DHL bills the real weight", ". The box's size doesn't push the price up."],
    emptyHint: "Enter all three sides of the box to see the result.",
    rowVol: "Volumetric weight", rowActual: "Actual weight",
    roundMetric: (exact, u) => `Exact figure ${exact} ${u}, rounded up to the next 0.5 kg as DHL Express does.`,
    roundImperial: "DHL rounds the billed weight up. Check your rate card for the exact step.",
    formulaLabel: "Formula",
    examplesLabel: "Try an example", examples: ["Small parcel", "Shoebox size", "Large carton"],
    divisorSummary: "Using a different divisor?",
    divisorHelp: "DHL's standard divisor is 5,000 for cm and kg, or 139 for inches and pounds. Some negotiated rate cards use another number — change it here.",
    divisorLabel: "Divisor",
    howTitle: "How DHL works out what you pay",
    howP1: "DHL charges for the space a parcel takes up in its aircraft and vans, not only for what it weighs. A large, light box takes as much room as a small, heavy one, so DHL compares two numbers and bills the higher: the actual weight on the scale, and the volumetric weight worked out from the box's size.",
    howP2: "Volumetric weight is length × width × height divided by 5,000 when you measure in centimetres (giving kilograms), or by 139 when you measure in inches (giving pounds). Measure each side at its longest point, including any bulges, and round it up to the next whole centimetre or inch. DHL Express then rounds the billed weight up to the next 0.5 kg.",
    exTitle: "Worked example: choosing a smaller box",
    exIntro: "An online shop sends phone accessories in 30 × 25 × 20 cm boxes. Each one weighs 0.5 kg.",
    exCalc: "30 × 25 × 20 ÷ 5,000 = 3 kg volumetric weight",
    exAfter: "DHL bills 3 kg — six times the real weight. Moving to a 25 × 20 × 15 cm box gives 25 × 20 × 15 ÷ 5,000 = 1.5 kg, halving the weight billed on every parcel. For light products, box size is usually the biggest cost you control.",
    limitsTitle: "DHL Express size and weight limits",
    limitsIntro: "Limits depend on the country and service, so treat these as typical figures and confirm the rules for your route with DHL.",
    limits: [
      { label: "Standard piece", text: "Up to 70 kg and 120 × 80 × 80 cm." },
      { label: "Heavier or bulkier pieces", text: "Accepted on many routes, but they carry extra handling surcharges. Pieces over 70 kg always attract DHL's Overweight Piece surcharge." },
      { label: "Upper limits", text: "DHL Express doesn't accept single pieces over 1,000 kg or 300 cm long, or shipments over 3,000 kg." },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "What is volumetric (dimensional) weight?", a: "A weight worked out from a parcel's size. Carriers use it so that large, light parcels pay for the space they take up." },
      { q: "Does DHL charge the actual weight or the volumetric weight?", a: "Whichever is higher. That's the billable (chargeable) weight your price is based on." },
      { q: "Does DHL round the numbers?", a: "Yes. Each side is rounded up to a whole centimetre or inch before calculating, and DHL Express rounds the billed weight up to the next 0.5 kg." },
      { q: "Do FedEx and UPS use the same divisor?", a: "The idea is the same, but each carrier sets its own divisors and rules. Use the FedEx and UPS calculators to compare the same box." },
      { q: "What if DHL charges a different weight than I expected?", a: "Compare the weight on your invoice with your own measurements. If DHL's figure is wrong, contact DHL customer service with your waybill number, the dimensions and photos of the parcel next to a tape measure." },
    ],
    compareTitle: "Compare carriers", nextTitle: "Often used next",
    related: {
      fedex: ["FedEx Dimensional Weight", "Same box, FedEx's rules"],
      ups: ["UPS Dimensional Weight", "Same box, UPS's rules"],
      vol: ["Volumetric Weight", "Any carrier, any divisor"],
      invoice: ["Invoice Due Date", "Net 15, 30 or 60 from an invoice date"],
      unit: ["Unit Converter", "cm ↔ in, kg ↔ lb"],
      currency: ["Currency Converter", "For overseas shipping quotes"],
    },
  },
  "zh-hk": {
    section: "日常工具", crumbHome: "首頁", crumbShipping: "運輸",
    title: "DHL 體積重量計算機",
    lede: "幾秒內知道 DHL 會按包裹嘅實際重量，定係按佢嘅大細收費。",
    seoTitle: "DHL 體積重量計算機 — 體積重量同計費重量 | TinyToolboxes",
    seoDesc: "免費 DHL 體積重量計算機。輸入箱嘅尺寸同重量，即刻睇到 DHL 嘅體積重量（長×闊×高÷5000 或 ÷139）同計費重量。唔使註冊。",
    calcTitle: "你嘅包裹", unitMetric: "cm · kg", unitImperial: "英寸 · 磅",
    length: "長", width: "闊", height: "高", actual: "實際重量",
    billLabel: "DHL 會按以下重量收費",
    dimWins: (dim, act, u) => [`DHL 按體積收費：${dim} ${u}`, `，唔係實際嘅 ${act} ${u}。你係為佔用嘅空間畀錢，唔係為重量。`],
    weightWins: () => ["DHL 按實際重量收費", "。個箱嘅大細冇令價錢上升。"],
    emptyHint: "輸入箱嘅三邊尺寸就會見到結果。",
    rowVol: "體積重量", rowActual: "實際重量",
    roundMetric: (exact, u) => `準確數字係 ${exact} ${u}，按 DHL Express 嘅做法向上取整到下一個 0.5 kg。`,
    roundImperial: "DHL 會將計費重量向上取整，確實嘅取整單位請參考你嘅運費表。",
    formulaLabel: "公式",
    examplesLabel: "試下例子", examples: ["細包裹", "鞋盒大小", "大紙箱"],
    divisorSummary: "用緊另一個除數？",
    divisorHelp: "DHL 標準除數係 5,000（cm / kg）或 139（英寸 / 磅）。部分協議運費表會用其他數字，可以喺度更改。",
    divisorLabel: "除數",
    howTitle: "DHL 點樣計你要付幾多",
    howP1: "DHL 收費唔止睇包裹有幾重，仲會睇佢喺飛機同貨車入面佔幾多位。一個大而輕嘅箱同一個細而重嘅箱佔嘅空間一樣，所以 DHL 會比較兩個數字，再按較大嗰個收費：磅上嘅實際重量，同埋用箱嘅尺寸計出嚟嘅體積重量。",
    howP2: "體積重量 = 長 × 闊 × 高，用厘米量就除以 5,000（得出公斤），用英寸量就除以 139（得出磅）。每邊都要量最長嘅位置，包括凸出嘅部分，再向上取整到下一個整數厘米或英寸。之後 DHL Express 會將計費重量向上取整到下一個 0.5 kg。",
    exTitle: "實例：揀個細啲嘅箱",
    exIntro: "一間網店用 30 × 25 × 20 cm 嘅箱寄手機配件，每箱重 0.5 kg。",
    exCalc: "30 × 25 × 20 ÷ 5,000 = 3 kg 體積重量",
    exAfter: "DHL 按 3 kg 收費，係實際重量嘅 6 倍。改用 25 × 20 × 15 cm 嘅箱：25 × 20 × 15 ÷ 5,000 = 1.5 kg，每件包裹嘅計費重量即刻減半。寄輕身貨品時，箱嘅大細通常係你最控制得到嘅成本。",
    limitsTitle: "DHL Express 尺寸同重量上限",
    limitsIntro: "上限會因國家同服務而唔同，以下係一般數字，寄件前請向 DHL 確認你條路線嘅規定。",
    limits: [
      { label: "標準件", text: "每件最重 70 kg，最大 120 × 80 × 80 cm。" },
      { label: "較重或較大嘅件", text: "好多路線都收，但會加收額外處理附加費。超過 70 kg 嘅件一定會收 DHL 嘅超重件附加費。" },
      { label: "最高上限", text: "DHL Express 唔接受單件超過 1,000 kg 或長度超過 300 cm，亦唔接受總重超過 3,000 kg 嘅貨件。" },
    ],
    faqTitle: "常見問題",
    faq: [
      { q: "咩係體積重量？", a: "即係按包裹尺寸計出嚟嘅重量。速遞公司用佢嚟確保大而輕嘅包裹都要為佔用嘅空間付費。" },
      { q: "DHL 係按實際重量定體積重量收費？", a: "兩者之中較大嗰個。呢個就係你運費所根據嘅計費重量。" },
      { q: "DHL 會唔會取整？", a: "會。每邊尺寸會先向上取整到整數厘米或英寸先計，DHL Express 亦會將計費重量向上取整到下一個 0.5 kg。" },
      { q: "FedEx 同 UPS 用同一個除數嗎？", a: "原理一樣，但每間速遞公司都有自己嘅除數同規則。可以用 FedEx 同 UPS 計算機比較同一個箱。" },
      { q: "如果 DHL 收費嘅重量同我預期唔同點算？", a: "將帳單上嘅重量同你自己量嘅尺寸對比。如果 DHL 嘅數字有錯，可以帶住運單號碼、尺寸，同埋包裹連拉尺嘅相片聯絡 DHL 客戶服務。" },
    ],
    compareTitle: "比較速遞公司", nextTitle: "之後常用",
    related: {
      fedex: ["FedEx 體積重量", "同一個箱，FedEx 嘅規則"],
      ups: ["UPS 體積重量", "同一個箱，UPS 嘅規則"],
      vol: ["體積重量計算機", "任何速遞公司、任何除數"],
      invoice: ["發票到期日", "由發票日期計 Net 15、30 或 60"],
      unit: ["單位換算", "cm ↔ 英寸，kg ↔ 磅"],
      currency: ["貨幣換算", "用嚟比較海外運費報價"],
    },
  },
  "zh-cn": {
    section: "日常工具", crumbHome: "首页", crumbShipping: "运输",
    title: "DHL 体积重量计算器",
    lede: "几秒钟就知道 DHL 会按包裹的实际重量，还是按它的大小收费。",
    seoTitle: "DHL 体积重量计算器 — 体积重量与计费重量 | TinyToolboxes",
    seoDesc: "免费 DHL 体积重量计算器。输入箱子尺寸和重量，立即查看 DHL 的体积重量（长×宽×高÷5000 或 ÷139）和计费重量。无需注册。",
    calcTitle: "你的包裹", unitMetric: "cm · kg", unitImperial: "英寸 · 磅",
    length: "长", width: "宽", height: "高", actual: "实际重量",
    billLabel: "DHL 将按以下重量收费",
    dimWins: (dim, act, u) => [`DHL 按体积收费：${dim} ${u}`, `，而不是实际的 ${act} ${u}。你是在为占用的空间付费，而不是为重量。`],
    weightWins: () => ["DHL 按实际重量收费", "。箱子的大小没有让价格上升。"],
    emptyHint: "输入箱子三边的尺寸即可看到结果。",
    rowVol: "体积重量", rowActual: "实际重量",
    roundMetric: (exact, u) => `精确数值为 ${exact} ${u}，按 DHL Express 的做法向上取整到下一个 0.5 kg。`,
    roundImperial: "DHL 会将计费重量向上取整，具体取整单位请参考你的运费表。",
    formulaLabel: "公式",
    examplesLabel: "试试示例", examples: ["小包裹", "鞋盒大小", "大纸箱"],
    divisorSummary: "使用其他除数？",
    divisorHelp: "DHL 标准除数为 5,000（cm / kg）或 139（英寸 / 磅）。部分协议运费表使用其他数字，可在此修改。",
    divisorLabel: "除数",
    howTitle: "DHL 如何计算你的运费",
    howP1: "DHL 收费不只看包裹有多重，还要看它在飞机和货车里占多少空间。一个大而轻的箱子和一个小而重的箱子占用的空间一样，所以 DHL 会比较两个数字，并按较大的那个收费：秤上的实际重量，以及根据箱子尺寸算出的体积重量。",
    howP2: "体积重量 = 长 × 宽 × 高，以厘米测量时除以 5,000（得出千克），以英寸测量时除以 139（得出磅）。每边都要量最长处，包括凸出部分，并向上取整到下一个整数厘米或英寸。随后 DHL Express 会把计费重量向上取整到下一个 0.5 kg。",
    exTitle: "实例：选一个更小的箱子",
    exIntro: "一家网店用 30 × 25 × 20 cm 的箱子寄手机配件，每箱重 0.5 kg。",
    exCalc: "30 × 25 × 20 ÷ 5,000 = 3 kg 体积重量",
    exAfter: "DHL 按 3 kg 收费，是实际重量的 6 倍。改用 25 × 20 × 15 cm 的箱子：25 × 20 × 15 ÷ 5,000 = 1.5 kg，每个包裹的计费重量立刻减半。寄送轻型商品时，箱子大小通常是你最能控制的成本。",
    limitsTitle: "DHL Express 尺寸和重量限制",
    limitsIntro: "限制因国家和服务而异，以下为一般数值，寄件前请向 DHL 确认你所在线路的规定。",
    limits: [
      { label: "标准件", text: "每件最重 70 kg，最大 120 × 80 × 80 cm。" },
      { label: "较重或较大的件", text: "许多线路都接受，但会加收额外处理附加费。超过 70 kg 的件一定会收取 DHL 的超重件附加费。" },
      { label: "最高限制", text: "DHL Express 不接受单件超过 1,000 kg 或长度超过 300 cm 的货件，也不接受总重超过 3,000 kg 的货件。" },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "什么是体积重量？", a: "根据包裹尺寸计算出的重量。快递公司用它来确保大而轻的包裹也要为占用的空间付费。" },
      { q: "DHL 按实际重量还是体积重量收费？", a: "两者中较大的那个。这就是你的运费所依据的计费重量。" },
      { q: "DHL 会取整吗？", a: "会。每边尺寸会先向上取整到整数厘米或英寸再计算，DHL Express 还会把计费重量向上取整到下一个 0.5 kg。" },
      { q: "FedEx 和 UPS 用同样的除数吗？", a: "原理相同，但每家快递公司都有自己的除数和规则。可以用 FedEx 和 UPS 计算器比较同一个箱子。" },
      { q: "如果 DHL 收费的重量和我预期的不同怎么办？", a: "把账单上的重量和你自己测量的尺寸进行对比。如果 DHL 的数字有误，请准备运单号、尺寸以及包裹与卷尺的照片，联系 DHL 客服。" },
    ],
    compareTitle: "比较快递公司", nextTitle: "接下来常用",
    related: {
      fedex: ["FedEx 体积重量", "同一个箱子，FedEx 的规则"],
      ups: ["UPS 体积重量", "同一个箱子，UPS 的规则"],
      vol: ["体积重量计算器", "任何快递公司、任何除数"],
      invoice: ["发票到期日", "从发票日期计算 Net 15、30 或 60"],
      unit: ["单位换算", "cm ↔ 英寸，kg ↔ 磅"],
      currency: ["货币换算", "用于比较海外运费报价"],
    },
  },
  ja: {
    section: "日常ツール", crumbHome: "ホーム", crumbShipping: "配送",
    title: "DHL 容積重量計算ツール",
    lede: "DHL が荷物を実重量で請求するのか、サイズで請求するのか、数秒でわかります。",
    seoTitle: "DHL 容積重量計算ツール — 容積重量と請求重量 | TinyToolboxes",
    seoDesc: "無料の DHL 容積重量計算ツール。箱のサイズと重さを入力すると、DHL の容積重量（縦×横×高さ÷5000 または ÷139）と請求重量がすぐにわかります。登録不要。",
    calcTitle: "荷物", unitMetric: "cm · kg", unitImperial: "インチ · ポンド",
    length: "長さ", width: "幅", height: "高さ", actual: "実重量",
    billLabel: "DHL の請求重量",
    dimWins: (dim, act, u) => [`DHL はサイズで請求します：${dim} ${u}`, `（実重量は ${act} ${u}）。重さではなく、占めるスペースに料金を払っていることになります。`],
    weightWins: () => ["DHL は実重量で請求します", "。箱の大きさは料金に影響していません。"],
    emptyHint: "箱の3辺をすべて入力すると結果が表示されます。",
    rowVol: "容積重量", rowActual: "実重量",
    roundMetric: (exact, u) => `正確な値は ${exact} ${u}。DHL Express と同じく、次の 0.5 kg 単位に切り上げています。`,
    roundImperial: "DHL は請求重量を切り上げます。切り上げの単位は料金表でご確認ください。",
    formulaLabel: "計算式",
    examplesLabel: "例を試す", examples: ["小さな荷物", "靴箱サイズ", "大きな段ボール"],
    divisorSummary: "別の係数を使っていますか？",
    divisorHelp: "DHL の標準係数は 5,000（cm・kg）または 139（インチ・ポンド）です。契約料金によっては別の数値を使うため、ここで変更できます。",
    divisorLabel: "係数",
    howTitle: "DHL の料金計算の仕組み",
    howP1: "DHL の料金は荷物の重さだけでなく、飛行機やトラックの中で占めるスペースにも基づきます。大きくて軽い箱は、小さくて重い箱と同じだけ場所を取ります。そのため DHL は2つの数値を比べ、大きい方で請求します。はかりで量った実重量と、箱のサイズから計算する容積重量です。",
    howP2: "容積重量は、長さ × 幅 × 高さを、センチで測った場合は 5,000 で割り（キログラム）、インチで測った場合は 139 で割ります（ポンド）。各辺は膨らみも含めて最も長い部分を測り、次の整数のセンチまたはインチに切り上げます。そのうえで DHL Express は請求重量を次の 0.5 kg 単位に切り上げます。",
    exTitle: "計算例：小さい箱を選ぶ",
    exIntro: "あるネットショップは、スマホアクセサリーを 30 × 25 × 20 cm の箱で発送しています。重さは1箱 0.5 kg です。",
    exCalc: "30 × 25 × 20 ÷ 5,000 = 容積重量 3 kg",
    exAfter: "DHL は 3 kg で請求します。実重量の6倍です。25 × 20 × 15 cm の箱に変えると 25 × 20 × 15 ÷ 5,000 = 1.5 kg となり、1個あたりの請求重量が半分になります。軽い商品では、箱のサイズが最もコントロールしやすいコストです。",
    limitsTitle: "DHL Express のサイズと重量の上限",
    limitsIntro: "上限は国やサービスによって異なります。以下は一般的な目安なので、ご利用のルートの条件は DHL にご確認ください。",
    limits: [
      { label: "標準の荷物", text: "1個あたり 70 kg まで、120 × 80 × 80 cm まで。" },
      { label: "重い・大きい荷物", text: "多くのルートで受け付けていますが、追加の取扱料金がかかります。70 kg を超える荷物には必ず超重量貨物料金がかかります。" },
      { label: "最大の上限", text: "DHL Express は、1個 1,000 kg 超または長さ 300 cm 超の荷物、総重量 3,000 kg 超の貨物は受け付けていません。" },
    ],
    faqTitle: "よくある質問",
    faq: [
      { q: "容積重量とは何ですか？", a: "荷物のサイズから計算する重量です。大きくて軽い荷物にも、占めるスペース分の料金を払ってもらうために使われます。" },
      { q: "DHL は実重量と容積重量のどちらで請求しますか？", a: "大きい方です。これが料金の基準になる請求重量（課金重量）です。" },
      { q: "DHL は端数を切り上げますか？", a: "はい。各辺は整数のセンチまたはインチに切り上げてから計算し、DHL Express は請求重量を次の 0.5 kg 単位に切り上げます。" },
      { q: "FedEx や UPS も同じ係数ですか？", a: "考え方は同じですが、係数やルールは運送会社ごとに異なります。FedEx と UPS の計算ツールで同じ箱を比べてみてください。" },
      { q: "請求された重量が予想と違う場合は？", a: "請求書の重量と自分で測った寸法を照らし合わせてください。DHL の数値が誤っている場合は、運送状番号、寸法、メジャーを当てた荷物の写真を用意して DHL のカスタマーサービスに連絡しましょう。" },
    ],
    compareTitle: "運送会社を比較", nextTitle: "よく一緒に使われるツール",
    related: {
      fedex: ["FedEx 容積重量", "同じ箱を FedEx のルールで"],
      ups: ["UPS 容積重量", "同じ箱を UPS のルールで"],
      vol: ["容積重量計算ツール", "どの運送会社・係数でも"],
      invoice: ["請求書の支払期日", "請求日から Net 15・30・60 を計算"],
      unit: ["単位換算", "cm ↔ インチ、kg ↔ ポンド"],
      currency: ["通貨換算", "海外発送の見積もり比較に"],
    },
  },
  es: {
    section: "Herramientas del día a día", crumbHome: "Inicio", crumbShipping: "Envíos",
    title: "Calculadora de peso dimensional de DHL",
    lede: "Descubre en segundos si DHL te cobrará por el peso real de tu paquete o por su tamaño.",
    seoTitle: "Calculadora de peso dimensional DHL — peso volumétrico y facturable | TinyToolboxes",
    seoDesc: "Calculadora gratuita de peso dimensional de DHL. Introduce el tamaño y el peso de la caja y verás el peso volumétrico de DHL (L×A×H÷5000 o ÷139) y lo que te cobrarán. Sin registro.",
    calcTitle: "Tu paquete", unitMetric: "cm · kg", unitImperial: "pulg · lb",
    length: "Largo", width: "Ancho", height: "Alto", actual: "Peso real",
    billLabel: "DHL te cobra por",
    dimWins: (dim, act, u) => [`DHL cobra por el tamaño: ${dim} ${u}`, `, no por los ${act} ${u} que pesa. Pagas por el espacio, no por el peso.`],
    weightWins: () => ["DHL cobra por el peso real", ". El tamaño de la caja no sube el precio."],
    emptyHint: "Introduce las tres medidas de la caja para ver el resultado.",
    rowVol: "Peso volumétrico", rowActual: "Peso real",
    roundMetric: (exact, u) => `Valor exacto ${exact} ${u}, redondeado hacia arriba al siguiente 0,5 kg, como hace DHL Express.`,
    roundImperial: "DHL redondea hacia arriba el peso facturado. Consulta tu tarifa para saber el incremento exacto.",
    formulaLabel: "Fórmula",
    examplesLabel: "Prueba un ejemplo", examples: ["Paquete pequeño", "Caja de zapatos", "Caja grande"],
    divisorSummary: "¿Usas otro divisor?",
    divisorHelp: "El divisor estándar de DHL es 5.000 para cm y kg, o 139 para pulgadas y libras. Algunas tarifas negociadas usan otro número; cámbialo aquí.",
    divisorLabel: "Divisor",
    howTitle: "Cómo calcula DHL lo que pagas",
    howP1: "DHL no cobra solo por lo que pesa un paquete, sino también por el espacio que ocupa en sus aviones y furgonetas. Una caja grande y ligera ocupa tanto sitio como una pequeña y pesada, así que DHL compara dos cifras y cobra la mayor: el peso real en la báscula y el peso volumétrico calculado a partir del tamaño de la caja.",
    howP2: "El peso volumétrico es largo × ancho × alto dividido entre 5.000 si mides en centímetros (resultado en kilos), o entre 139 si mides en pulgadas (resultado en libras). Mide cada lado por su punto más largo, incluidos los bultos, y redondéalo al siguiente centímetro o pulgada entero. Después, DHL Express redondea el peso facturado al siguiente 0,5 kg.",
    exTitle: "Ejemplo práctico: elegir una caja más pequeña",
    exIntro: "Una tienda online envía accesorios de móvil en cajas de 30 × 25 × 20 cm. Cada una pesa 0,5 kg.",
    exCalc: "30 × 25 × 20 ÷ 5.000 = 3 kg de peso volumétrico",
    exAfter: "DHL cobra 3 kg, seis veces el peso real. Con una caja de 25 × 20 × 15 cm: 25 × 20 × 15 ÷ 5.000 = 1,5 kg, la mitad del peso facturado en cada paquete. Con productos ligeros, el tamaño de la caja suele ser el coste que más controlas.",
    limitsTitle: "Límites de tamaño y peso de DHL Express",
    limitsIntro: "Los límites dependen del país y del servicio, así que tómalos como cifras orientativas y confirma con DHL las condiciones de tu ruta.",
    limits: [
      { label: "Pieza estándar", text: "Hasta 70 kg y 120 × 80 × 80 cm." },
      { label: "Piezas más pesadas o voluminosas", text: "Se aceptan en muchas rutas, pero con recargos de manipulación. Las piezas de más de 70 kg siempre llevan el recargo por pieza con sobrepeso." },
      { label: "Límites máximos", text: "DHL Express no acepta piezas de más de 1.000 kg o 300 cm de largo, ni envíos de más de 3.000 kg." },
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Qué es el peso volumétrico (dimensional)?", a: "Un peso calculado a partir del tamaño del paquete. Los transportistas lo usan para que los paquetes grandes y ligeros paguen por el espacio que ocupan." },
      { q: "¿DHL cobra por el peso real o por el volumétrico?", a: "Por el mayor de los dos. Ese es el peso facturable en el que se basa tu precio." },
      { q: "¿DHL redondea las cifras?", a: "Sí. Cada lado se redondea al siguiente centímetro o pulgada entero antes de calcular, y DHL Express redondea el peso facturado al siguiente 0,5 kg." },
      { q: "¿FedEx y UPS usan el mismo divisor?", a: "La idea es la misma, pero cada transportista fija sus propios divisores y reglas. Usa las calculadoras de FedEx y UPS para comparar la misma caja." },
      { q: "¿Y si DHL me cobra un peso distinto del que esperaba?", a: "Compara el peso de la factura con tus propias medidas. Si la cifra de DHL es incorrecta, contacta con su atención al cliente con el número de guía, las medidas y fotos del paquete junto a una cinta métrica." },
    ],
    compareTitle: "Compara transportistas", nextTitle: "Suele usarse después",
    related: {
      fedex: ["Peso dimensional FedEx", "La misma caja con las reglas de FedEx"],
      ups: ["Peso dimensional UPS", "La misma caja con las reglas de UPS"],
      vol: ["Peso volumétrico", "Cualquier transportista y divisor"],
      invoice: ["Vencimiento de factura", "Net 15, 30 o 60 desde la fecha de factura"],
      unit: ["Conversor de unidades", "cm ↔ pulgadas, kg ↔ libras"],
      currency: ["Conversor de divisas", "Para comparar presupuestos de envío"],
    },
  },
};

const RELATED_HREF = {
  fedex: "/fedex-dimensional-weight-calculator",
  ups: "/ups-dimensional-weight-calculator",
  vol: "/volumetric-weight-calculator",
  invoice: "/invoice-due-date-calculator",
  unit: "/unit-converter",
  currency: "/currency-converter",
} as const;

function parse(value: string): number {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function DHLDimensionalWeightCalculator() {
  const [locale, setLocale] = useLocale();
  const t = COPY[locale];
  const [units, setUnits] = useState<Units>("metric");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("25");
  const [height, setHeight] = useState("20");
  const [actualWeight, setActualWeight] = useState("0.5");
  const [divisor, setDivisor] = useState(String(DIVISOR.metric));

  useEffect(() => {
    applySEO({
      title: t.seoTitle,
      description: t.seoDesc,
      path: PAGE_PATH,
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebApplication", name: t.title, url: SITE_URL + PAGE_PATH, description: t.seoDesc, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: locale, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ],
    });
  }, [locale, t]);

  const fmt = useMemo(() => new Intl.NumberFormat(NUMBER_LOCALE[locale], { maximumFractionDigits: 2 }), [locale]);
  const fmtInt = useMemo(() => new Intl.NumberFormat(NUMBER_LOCALE[locale]), [locale]);

  const switchUnits = (next: Units) => {
    setUnits(next);
    setDivisor(String(DIVISOR[next]));
    const ex = next === "metric" ? { d: [30, 25, 20], a: 0.5 } : { d: [12, 10, 8], a: 1 };
    setLength(String(ex.d[0])); setWidth(String(ex.d[1])); setHeight(String(ex.d[2])); setActualWeight(String(ex.a));
  };

  const loadExample = (i: number) => {
    const ex = EXAMPLES[units][i];
    setLength(String(ex.dims[0])); setWidth(String(ex.dims[1])); setHeight(String(ex.dims[2])); setActualWeight(String(ex.actual));
  };

  const u = units === "metric" ? { dim: "cm", weight: "kg" } : { dim: "in", weight: "lb" };
  // DHL rounds each side up to a whole unit before calculating.
  const sides = [length, width, height].map((v) => Math.ceil(parse(v)));
  const complete = sides.every((s) => s > 0);
  const div = parse(divisor) || DIVISOR[units];
  const volumetric = complete ? (sides[0] * sides[1] * sides[2]) / div : 0;
  const actual = parse(actualWeight);
  const exact = Math.max(volumetric, actual);
  const billed = units === "metric" ? Math.ceil(exact * 2) / 2 : exact;
  const sizeWins = volumetric > actual;
  const [highlight, rest] = sizeWins ? t.dimWins(fmt.format(volumetric), fmt.format(actual), u.weight) : t.weightWins();

  return (
    <ToolPage theme="everyday" locale={locale} onLocale={setLocale} section={t.section}>
      <nav className="tt-crumb" aria-label="Breadcrumb">
        <a href="/">{t.crumbHome}</a><span aria-hidden="true">/</span>
        <span>{t.crumbShipping}</span><span aria-hidden="true">/</span>
        <span>DHL</span>
      </nav>
      <h1 className="tt-h1">{t.title}</h1>
      <p className="tt-lede">{t.lede}</p>

      <div className="tt-grid">
        <div className="tt-stack">
          <section className="tt-card" aria-labelledby="calc-title">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
              <h2 id="calc-title" className="tt-h3" style={{ margin: 0, fontSize: 18 }}>{t.calcTitle}</h2>
              <div className="tt-seg" role="group" aria-label={`${t.unitMetric} / ${t.unitImperial}`}>
                <button type="button" aria-pressed={units === "metric"} onClick={() => switchUnits("metric")}>{t.unitMetric}</button>
                <button type="button" aria-pressed={units === "imperial"} onClick={() => switchUnits("imperial")}>{t.unitImperial}</button>
              </div>
            </div>

            <div className="tt-fields">
              {([[t.length, length, setLength, "dhl-l"], [t.width, width, setWidth, "dhl-w"], [t.height, height, setHeight, "dhl-h"]] as const).map(([label, value, set, id]) => (
                <div className="tt-field" key={id}>
                  <label htmlFor={id}>{label}</label>
                  <div className="tt-input">
                    <input id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} />
                    <span className="tt-unit">{u.dim}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="tt-field" style={{ marginTop: 12, maxWidth: 260 }}>
              <label htmlFor="dhl-a">{t.actual}</label>
              <div className="tt-input">
                <input id="dhl-a" inputMode="decimal" value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} />
                <span className="tt-unit">{u.weight}</span>
              </div>
            </div>

            <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid var(--line)" }} aria-live="polite">
              {complete ? (
                <>
                  <p className="tt-label" style={{ margin: 0 }}>{t.billLabel}</p>
                  <p className="tt-big">{fmt.format(billed)} {u.weight}</p>
                  <p style={{ margin: "0 0 14px", fontSize: 17, color: "var(--ink-2)" }}>
                    <mark className="tt-mark">{highlight}</mark>{rest}
                  </p>
                  <div className="tt-rows">
                    <div data-win={sizeWins}><span>{t.rowVol}</span><span>{fmt.format(volumetric)} {u.weight}</span></div>
                    <div data-win={!sizeWins}><span>{t.rowActual}</span><span>{fmt.format(actual)} {u.weight}</span></div>
                  </div>
                  <p className="tt-note">
                    {t.formulaLabel}: {sides.map((s) => fmtInt.format(s)).join(" × ")} ÷ {fmtInt.format(div)} = {fmt.format(volumetric)} {u.weight}
                  </p>
                  <p className="tt-note">{units === "metric" ? t.roundMetric(fmt.format(exact), u.weight) : t.roundImperial}</p>
                </>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)" }}>{t.emptyHint}</p>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <p className="tt-label">{t.examplesLabel}</p>
              <div className="tt-chips">
                {EXAMPLES[units].map((ex, i) => (
                  <button key={i} type="button" className="tt-chip" onClick={() => loadExample(i)}>
                    {t.examples[i]} · {ex.dims.join("×")} {u.dim}
                  </button>
                ))}
              </div>
            </div>

            <details style={{ marginTop: 18 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--accent)" }}>{t.divisorSummary}</summary>
              <p style={{ color: "var(--ink-2)", margin: "10px 0" }}>{t.divisorHelp}</p>
              <div className="tt-field" style={{ maxWidth: 200 }}>
                <label htmlFor="dhl-div">{t.divisorLabel}</label>
                <div className="tt-input"><input id="dhl-div" inputMode="numeric" value={divisor} onChange={(e) => setDivisor(e.target.value)} /></div>
              </div>
            </details>
          </section>

          <article className="tt-card tt-prose">
            <section>
              <h2 className="tt-h2">{t.howTitle}</h2>
              <p>{t.howP1}</p>
              <p>{t.howP2}</p>
            </section>
            <section>
              <h2 className="tt-h2">{t.exTitle}</h2>
              <p>{t.exIntro}</p>
              <p className="tt-formula">{t.exCalc}</p>
              <p>{t.exAfter}</p>
            </section>
            <section>
              <h2 className="tt-h2">{t.limitsTitle}</h2>
              <p>{t.limitsIntro}</p>
              <ul>
                {t.limits.map((item) => (
                  <li key={item.label}><strong>{item.label}:</strong> {item.text}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="tt-h2">{t.faqTitle}</h2>
              <Faq items={t.faq} />
            </section>
          </article>
        </div>

        <aside className="tt-stack">
          <RelatedList
            title={t.compareTitle}
            items={(["fedex", "ups", "vol"] as const).map((k) => ({ href: RELATED_HREF[k], title: t.related[k][0], hint: t.related[k][1] }))}
          />
          <RelatedList
            title={t.nextTitle}
            items={(["invoice", "unit", "currency"] as const).map((k) => ({ href: RELATED_HREF[k], title: t.related[k][0], hint: t.related[k][1] }))}
          />
        </aside>
      </div>
    </ToolPage>
  );
}
