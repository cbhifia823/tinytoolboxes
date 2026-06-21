import { useEffect, useState, useMemo } from "react";
import { ArrowRight, Percent, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Percentage Calculator",
    subtitle: "Calculate percentages, find rates, and track changes.",
    mode1: "X% of Y",
    mode2: "X is what % of Y",
    mode3: "% change from X to Y",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    result: "Result",
    aLabelPof: "%",
    aLabelWhat: "X",
    aLabelChange: "From",
    bLabelPof: "Value",
    bLabelWhat: "Total",
    bLabelChange: "To",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "百分比計算器",
    subtitle: "計算百分比、搵出比率同追蹤變化。",
    mode1: "Y 嘅 X%",
    mode2: "X 係 Y 嘅幾多 %",
    mode3: "由 X 到 Y 嘅 % 變化",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    result: "結果",
    aLabelPof: "%",
    aLabelWhat: "X",
    aLabelChange: "由",
    bLabelPof: "數值",
    bLabelWhat: "總數",
    bLabelChange: "到",
  },
  "zh-cn": {
    name: "简体中文",
    title: "百分比计算器",
    subtitle: "计算百分比、找出比率和追踪变化。",
    mode1: "Y 的 X%",
    mode2: "X 是 Y 的百分之几",
    mode3: "从 X 到 Y 的 % 变化",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    result: "结果",
    aLabelPof: "%",
    aLabelWhat: "X",
    aLabelChange: "从",
    bLabelPof: "数值",
    bLabelWhat: "总数",
    bLabelChange: "到",
  },
  es: {
    name: "Español",
    title: "Calculadora de porcentajes",
    subtitle: "Calcula porcentajes, encuentra tasas y registra cambios.",
    mode1: "X% de Y",
    mode2: "X es qué % de Y",
    mode3: "% cambio de X a Y",
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar herramientas...",
    result: "Resultado",
    aLabelPof: "%",
    aLabelWhat: "X",
    aLabelChange: "Desde",
    bLabelPof: "Valor",
    bLabelWhat: "Total",
    bLabelChange: "Hasta",
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", "ja": "年齢計算機", es: "Calculadora de edad" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", "ja": "出生日から正確な年齢を計算します。", es: "Calcula la edad exacta desde una fecha de nacimiento." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差異計算器", "zh-cn": "日期差异计算器", "ja": "日付の差分計算機", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "兩個日期之間的日期。", "zh-cn": "两个日期之间的天数。", "ja": "二つの日付の間の日数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", "ja": "単位変換機", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature, and more.", "zh-hk": "轉換長度、重量、溫度等。", "zh-cn": "转换长度、重量、温度等。", "ja": "長さ、重量、温度などを変換します。", es: "Convierte longitud, peso, temperatura y más." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算器", "zh-cn": "体积重量计算器", "ja": "体積重量計算機", es: "Calculadora de peso volumétrico" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "計算包裹的體積重量。", "zh-cn": "计算包裹的体积重量。", "ja": "小包の体積重量を計算します。", es: "Calcula el peso dimensional de paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算器", "zh-cn": "工作日计算器", "ja": "営業日計算機", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期加上工作日。", "zh-cn": "为任何日期加上工作日。", "ja": "任意の日に営業日を加算します。", es: "Añade días hábiles a cualquier fecha." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", "ja": "文字数計算機", es: "Contador de palabras" }, description: { en: "Count words and characters instantly.", "zh-hk": "即時計算字數和字符。", "zh-cn": "即时计算字数和字符。", "ja": "文字と文字数を瞬時にカウントします。", es: "Cuenta palabras y caracteres al instante." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", "ja": "URL エンコーダー / デコーダー", es: "Codificador / Decodificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", "ja": "URL をエンコードまたはデコードします。", es: "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/percentage-calculator";

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

const EDUCATION = {
  en: {
    sidebarTitle: "Use cases",
    sidebarSubtitle: "Three ways to work with percentages.",
    sidebarItems: ["Discounts and sale prices.", "Tax, tip, and commission calculations.", "Year-on-year growth and change tracking."],
    whatIsTitle: "What is a Percentage?",
    whatIsP1: "A percentage is a number expressed as a fraction of 100. The word comes from the Latin \"per centum,\" meaning \"by the hundred.\" When you say 45%, you mean 45 out of every 100 — or equivalently, the ratio 45/100 = 0.45. The percent sign (%) evolved from the Italian abbreviation \"per cento,\" which was shortened by scribes over centuries until the words disappeared and only the stylized slashes and circles remained.",
    whatIsP2: "Merchants in ancient Rome already used fractions of 100 for calculating interest on loans, long before the modern percent sign existed. The concept became widespread during the Renaissance as double-entry bookkeeping spread through European trade networks. By expressing values as parts of a hundred, merchants could compare ratios across transactions of vastly different sizes — whether negotiating the sale of a few bolts of cloth or financing an entire trading voyage.",
    whatIsP3: "Today, percentages are the universal language of comparison. They allow you to say \"our defect rate fell from 4% to 1%\" and immediately convey magnitude, or to state \"inflation is running at 3.2% annually\" in a way that requires no further context. A raw number like \"we saved $1,200\" means little without knowing whether the total was $1,500 or $1,200,000 — the percentage tells you everything you need to know.",
    threeModesTitle: "The Three Most Useful Percentage Calculations",
    threeModesIntro: "Almost every practical percentage problem falls into one of three categories. This calculator handles all three.",
    mode1Title: "Mode 1: X% of Y — finding a portion",
    mode1Formula: "Result = (X ÷ 100) × Y",
    mode1Desc: "This is the most common calculation. You know the percentage rate and the whole, and you want the corresponding amount. Examples:",
    mode1Examples: ["15% tip on an $80 restaurant bill: (15 ÷ 100) × 80 = $12.00", "20% discount on a $150 jacket: (20 ÷ 100) × 150 = $30 off, so you pay $120", "6% sales tax on a $240 appliance: (6 ÷ 100) × 240 = $14.40 in tax"],
    mode2Title: "Mode 2: X is what % of Y — finding the rate",
    mode2Formula: "Result = (X ÷ Y) × 100",
    mode2Desc: "You know the part and the whole, and you want to express the relationship as a percentage. Examples:",
    mode2Examples: ["45 correct answers out of 60 on a test: (45 ÷ 60) × 100 = 75%", "3 defective units out of 200 produced: (3 ÷ 200) × 100 = 1.5% defect rate", "$18,000 saved toward a $75,000 goal: (18,000 ÷ 75,000) × 100 = 24% of the way there"],
    mode3Title: "Mode 3: % change from X to Y — finding growth or decline",
    mode3Formula: "Result = ((Y − X) ÷ |X|) × 100",
    mode3Desc: "You know the starting value and the ending value, and you want to express the change as a percentage. The absolute value of X in the denominator handles negative starting values correctly. Examples:",
    mode3Examples: ["Revenue grew from $450,000 to $540,000: ((540k − 450k) ÷ 450k) × 100 = +20% growth", "Stock price fell from $85 to $51: ((51 − 85) ÷ 85) × 100 = −40% decline", "Website traffic dropped from 12,000 to 9,600 visits: ((9,600 − 12,000) ÷ 12,000) × 100 = −20%"],
    applicationsTitle: "Real-World Applications",
    applicationsIntro: "Percentages appear in nearly every area of daily financial life. Here are some concrete examples that illustrate just how often the calculation comes up:",
    applicationsItems: [
      { title: "Sales tax.", desc: "New York City has one of the highest combined sales tax rates in the US at 8.875%. On a $100 purchase, that adds $8.88 in tax for a total of $108.88. On a $1,200 laptop, the tax alone is $106.50." },
      { title: "Value Added Tax (VAT).", desc: "The standard VAT rate in the United Kingdom is 20%. A business buying £200 worth of supplies pays £40 in VAT, for a total of £240. VAT-registered businesses can reclaim the input VAT, but consumers cannot." },
      { title: "Tipping.", desc: "An 18% tip on a $65 restaurant bill is (18 ÷ 100) × 65 = $11.70. A 20% tip on the same bill is $13.00. Knowing the math lets you tip accurately without relying on tip calculators printed on receipts." },
      { title: "Interest rates.", desc: "A credit card charging 2% monthly interest on a $5,000 balance costs (2 ÷ 100) × 5,000 = $100 per month in interest — which is $1,200 per year, or an annual rate of 24%." },
      { title: "Exam and performance scores.", desc: "Achieving 78 marks out of 120 is (78 ÷ 120) × 100 = 65%. Whether that is a passing grade depends on the institution's threshold, but the percentage immediately contextualizes the raw score." },
      { title: "Body fat percentage.", desc: "Body composition assessments report results as percentages because body fat as an absolute weight is meaningless without context. A body fat percentage of 18% means 18 kg of fat per 100 kg of body weight, regardless of the person's total weight." },
    ],
    mistakesTitle: "Common Percentage Mistakes",
    mistakesIntro: "Even people who are comfortable with numbers make these errors regularly. Understanding them prevents costly miscalculations.",
    mistakesItems: [
      { title: "Confusing percentage points with percentages.", desc: "If an interest rate rises from 2% to 3%, it has increased by 1 percentage point — but it has increased by 50% in relative terms ((3−2)÷2 × 100 = 50%). These two statements sound very different and mean very different things. Financial reporting often exploits this ambiguity intentionally." },
      { title: "Mixing up \"percent of\" and \"percent more.\"", desc: "\"50% more than 100\" means 100 + 50% of 100 = 100 + 50 = 150. But \"150% of 100\" also equals 150. The confusion arises in phrases like \"prices are 150% higher\" — that would mean prices tripled (100 + 150 = 250), not increased by half. Always check whether the phrase means \"X% of\" or \"X% more than.\"" },
      { title: "Assuming successive discounts add up.", desc: "A 20% discount followed by a 10% discount does not equal a 30% discount. Starting with $100: after 20% off you have $80, then 10% off $80 is $8, leaving $72. The combined discount is 28%, not 30%. The two discounts compound: (1 − 0.20) × (1 − 0.10) = 0.80 × 0.90 = 0.72, a 28% total reduction." },
      { title: "Reversing the percentage change direction.", desc: "If a price drops 50% and then rises 50%, you do not return to the original price. A $100 item drops to $50 (−50%), then rises 50% to $75. You are still 25% below the starting point. Percentage changes are not symmetric around zero." },
    ],
    faqTitle: "Frequently Asked Questions",
    faqItems: [
      { q: "What is the difference between percent and percentage points?", a: "A percent is a relative measure (X per 100), while a percentage point is an absolute arithmetic difference between two percentages. If unemployment falls from 6% to 4%, it fell by 2 percentage points, but it fell by 33.3% in relative terms. Financial news often reports percentage-point changes when covering interest rates or polling data, so it is important to read carefully." },
      { q: "How do I calculate a percentage increase or decrease?", a: "Use the percentage change formula: ((New Value − Old Value) ÷ Old Value) × 100. If the result is positive, it is an increase; if negative, it is a decrease. For example, a salary increase from $50,000 to $55,000 is ((55,000 − 50,000) ÷ 50,000) × 100 = 10% increase. Use the \"% change from X to Y\" mode in this calculator to compute this automatically." },
      { q: "How does compound growth differ from a simple percentage?", a: "A simple percentage increase applies to the original amount each period. A 5% simple return on $1,000 for 3 years adds $50 per year for a total of $1,150. Compound growth applies the percentage to the new total each period: after year 1 you have $1,050, after year 2 you have $1,102.50, after year 3 you have $1,157.63. The difference seems small over 3 years but becomes enormous over decades, which is why compounding is called the \"eighth wonder of the world\" in investing circles." },
      { q: "What does 200% mean?", a: "200% of a number means double that number. 200% of $50 = (200 ÷ 100) × 50 = $100. However, \"200% more than $50\" would mean $50 + $100 = $150, because \"more than\" adds the percentage to the original. So \"200% of $50\" = $100, while \"$50 plus 200% more\" = $150. The phrasing matters significantly." },
      { q: "How do I calculate the original price before a discount?", a: "If you know the discounted price and the discount rate, divide the discounted price by (1 − discount rate). For example, an item costs $68 after a 15% discount. The original price was $68 ÷ (1 − 0.15) = $68 ÷ 0.85 = $80. A common mistake is to add 15% back to $68, which gives $78.20 — that is wrong because 15% of $80 is $12, not 15% of $68." },
      { q: "What is a basis point?", a: "A basis point (bps) is one hundredth of a percentage point — that is, 0.01%. Basis points are used in finance when discussing small changes in interest rates, bond yields, and fees, where saying \"25 basis points\" is more precise and less ambiguous than saying \"0.25 percentage points\" or \"a quarter of a percent.\" When a central bank raises its benchmark rate by 50 basis points, it means the rate has increased by 0.50 percentage points." },
    ],
  },
  "zh-hk": {
    sidebarTitle: "使用場景",
    sidebarSubtitle: "三種處理百分比嘅方式。",
    sidebarItems: ["折扣同減價。", "稅項、小費同佣金計算。", "按年增長同變化追蹤。"],
    whatIsTitle: "咩係百分比？",
    whatIsP1: "百分比係一個以 100 為分母嘅分數。呢個詞源自拉丁文「per centum」，意思係「每一百」。當你講 45%，你意思係每 100 個入面有 45 個——或者等同於比例 45/100 = 0.45。百分號 (%) 係由意大利縮寫「per cento」演變而嚟，經過幾個世紀由抄寫員不斷簡化，直到文字消失，只係淨返 stylized 嘅斜線同圓圈。",
    whatIsP2: "古羅馬嘅商人早喺現代百分號出現之前，就已經用 100 為分母嘅分數嚟計算貸款利息。呢個概念喺文藝復興時期隨住複式記帳法喺歐洲貿易網絡中傳播而普及。通過將數值表達為一百嘅部分，商人可以比較規模迥異嘅交易比率——無論係傾緊幾匹布嘅買賣，定係資助整趟貿易航程。",
    whatIsP3: "今日，百分比係比較嘅通用語言。佢哋令你可以講「我哋嘅缺陷率由 4% 跌到 1%」並即刻傳達幅度，或者陳述「通脹率每年 3.2%」而唔需要額外背景。一個原始數字好似「我哋慳咗 $1,200」冇咩意義，如果唔知總數係 $1,500 定 $1,200,000——百分比話到你知一切你需要知道嘅嘢。",
    threeModesTitle: "三種最有用嘅百分比計算",
    threeModesIntro: "幾乎每個實用嘅百分比問題都屬於以下三類之一。呢個計算器處理晒三種。",
    mode1Title: "模式 1：Y 嘅 X% — 搵出部分",
    mode1Formula: "結果 = (X ÷ 100) × Y",
    mode1Desc: "呢個係最常見嘅計算。你知道百分比比率同整體，想搵出對應嘅數量。例子：",
    mode1Examples: ["$80 餐廳帳單嘅 15% 小費：(15 ÷ 100) × 80 = $12.00", "$150 外套嘅 20% 折扣：(20 ÷ 100) × 150 = 減 $30，所以你俾 $120", "$240 電器嘅 6% 銷售稅：(6 ÷ 100) × 240 = $14.40 稅款"],
    mode2Title: "模式 2：X 係 Y 嘅幾多 % — 搵出比率",
    mode2Formula: "結果 = (X ÷ Y) × 100",
    mode2Desc: "你知道部分同整體，想將個關係表達為百分比。例子：",
    mode2Examples: ["60 題測驗中答啱 45 題：(45 ÷ 60) × 100 = 75%", "生產 200 件中有 3 件次品：(3 ÷ 200) × 100 = 1.5% 次品率", "$75,000 目標已儲蓄 $18,000：(18,000 ÷ 75,000) × 100 = 完成咗 24%"],
    mode3Title: "模式 3：由 X 到 Y 嘅 % 變化 — 搵出增長或下跌",
    mode3Formula: "結果 = ((Y − X) ÷ |X|) × 100",
    mode3Desc: "你知道起始值同結束值，想將變化表達為百分比。分母中 X 嘅絕對值可以正確處理負數起始值。例子：",
    mode3Examples: ["收入由 $450,000 增加到 $540,000：((540k − 450k) ÷ 450k) × 100 = +20% 增長", "股價由 $85 跌到 $51：((51 − 85) ÷ 85) × 100 = −40% 下跌", "網站流量由 12,000 跌到 9,600 次瀏覽：((9,600 − 12,000) ÷ 12,000) × 100 = −20%"],
    applicationsTitle: "現實世界應用",
    applicationsIntro: "百分比出現喺日常財務生活嘅幾乎每個領域。以下係一啲具體例子，說明呢個計算出現得幾頻密：",
    applicationsItems: [
      { title: "銷售稅。", desc: "紐約市擁有美國最高嘅綜合銷售稅率之一，達到 8.875%。$100 嘅消費，加 $8.88 稅，總共 $108.88。一部 $1,200 嘅手提電腦，淨稅就要 $106.50。" },
      { title: "增值稅（VAT）。", desc: "英國嘅標準增值稅率係 20%。一間公司買 £200 嘅物資，要俾 £40 增值稅，總共 £240。已登記增值稅嘅公司可以退返進項增值稅，但消費者唔得。" },
      { title: "小費。", desc: "$65 餐廳帳單嘅 18% 小費係 (18 ÷ 100) × 65 = $11.70。同一帳單嘅 20% 小費係 $13.00。識計數令你可以準確俾小費，唔使靠收據上印嘅小費計算器。" },
      { title: "利率。", desc: "一張信用卡對 $5,000 結欠收取 2% 月息，每月利息成本係 (2 ÷ 100) × 5,000 = $100——即係每年 $1,200，或年利率 24%。" },
      { title: "考試同表現分數。", desc: "120 分滿分中攞到 78 分係 (78 ÷ 120) × 100 = 65%。呢個係咪合格視乎機構嘅門檻，但百分比即刻將原始分數放喺背景中。" },
      { title: "體脂百分比。", desc: "身體成分評估以百分比報告結果，因為體脂作為絕對重量冇背景就冇意義。體脂百分比 18% 意味住每 100 公斤體重有 18 公斤脂肪，不論個人總體重幾多。" },
    ],
    mistakesTitle: "常見百分比錯誤",
    mistakesIntro: "即使係對數字好熟悉嘅人都會定期犯呢啲錯誤。理解佢哋可以防止代價高昂嘅誤算。",
    mistakesItems: [
      { title: "混淆百分點同百分比。", desc: "如果利率由 2% 升到 3%，佢增加咗 1 個百分點——但以相對值計算，佢增加咗 50% ((3−2)÷2 × 100 = 50%)。呢兩種陳述聽起嚟好唔同，意思亦好唔同。財經報道經常故意利用呢種模糊性。" },
      { title: "搞亂「百分之幾」同「多幾多百分比」。", desc: "「比 100 多 50%」意思係 100 + 100 嘅 50% = 100 + 50 = 150。但「100 嘅 150%」亦等於 150。混淆出現喺類似「價格高咗 150%」嘅說法——意思係價格變咗三倍（100 + 150 = 250），而唔係增加咗一半。永遠要搞清楚句子係指「X% of」定係「X% more than」。" },
      { title: "假設連續折扣可以相加。", desc: "20% 折扣之後再 10% 折扣，唔等於 30% 折扣。由 $100 開始：20% 折扣後你有 $80，然後 $80 嘅 10% 折扣係 $8，剩低 $72。綜合折扣係 28%，唔係 30%。兩個折扣係複合嘅：(1 − 0.20) × (1 − 0.10) = 0.80 × 0.90 = 0.72，總共減咗 28%。" },
      { title: "逆轉百分比變化方向。", desc: "如果一個價格跌咗 50% 然後升返 50%，你唔會返到原價。一件 $100 嘅物品跌到 $50（−50%），然後升 50% 去到 $75。你仍然比起點低 25%。百分比變化圍繞零點並唔對稱。" },
    ],
    faqTitle: "常見問題",
    faqItems: [
      { q: "百分比同百分點有咩分別？", a: "百分比係一個相對量度（每 100 有 X），而百分點係兩個百分比之間嘅絕對算術差。如果失業率由 6% 跌到 4%，佢跌咗 2 個百分點，但以相對值計算跌咗 33.3%。財經新聞報道利率或民調數據時經常使用百分點變化，所以仔細閱讀好重要。" },
      { q: "點樣計算百分比增加或減少？", a: "使用百分比變化公式：((新值 − 舊值) ÷ 舊值) × 100。如果結果係正數，就係增加；如果係負數，就係減少。例如，人工由 $50,000 加到 $55,000 係 ((55,000 − 50,000) ÷ 50,000) × 100 = 10% 增加。使用呢個計算器嘅「由 X 到 Y 嘅 % 變化」模式自動計算。" },
      { q: "複合增長同簡單百分比有咩唔同？", a: "簡單百分比增加每期都應用喺原始金額上。$1,000 嘅 5% 簡單回報 3 年，每年加 $50，總共 $1,150。複合增長每期將百分比應用喺新總額上：第 1 年後你有 $1,050，第 2 年後你有 $1,102.50，第 3 年後你有 $1,157.63。3 年內差異看似好細，但幾十年後會變得非常巨大，呢個就係點解複合被稱為投資界嘅「世界第八大奇蹟」。" },
      { q: "200% 係咩意思？", a: "一個數嘅 200% 意味住該數嘅兩倍。$50 嘅 200% = (200 ÷ 100) × 50 = $100。不過，「比 $50 多 200%」意味住 $50 + $100 = $150，因為「more than」將百分比加喺原始值之上。所以「$50 嘅 200%」= $100，而「$50 再加 200%」= $150。措辭影響好大。" },
      { q: "點樣計算折扣前嘅原價？", a: "如果你知道折扣後價格同折扣率，將折扣後價格除以 (1 − 折扣率)。例如，一件物品 85 折後賣 $68。原價係 $68 ÷ (1 − 0.15) = $68 ÷ 0.85 = $80。一個常見錯誤係將 15% 加返上 $68，得出 $78.20——呢個係錯嘅，因為 $80 嘅 15% 係 $12，而唔係 $68 嘅 15%。" },
      { q: "咩係基點？", a: "基點（bps）係百分點嘅百分之一——即係 0.01%。基點喺金融中用嚟討論利率、債券收益率同費用嘅細小變化，講「25 個基點」比講「0.25 個百分點」或「四分之一個百分比」更精確同更少歧義。當中央銀行將基準利率提高 50 個基點，意思係利率增加咗 0.50 個百分點。" },
    ],
  },
  "zh-cn": {
    sidebarTitle: "使用场景",
    sidebarSubtitle: "三种处理百分比的方式。",
    sidebarItems: ["折扣和减价。", "税务、小费和佣金计算。", "年度增长和变化追踪。"],
    whatIsTitle: "什么是百分比？",
    whatIsP1: "百分比是一个以 100 为分母的分数。这个词源自拉丁文「per centum」，意思是「每一百」。当你说 45%，你的意思是每 100 个里面有 45 个——或者等同于比例 45/100 = 0.45。百分号 (%) 是由意大利缩写「per cento」演变而来，经过几个世纪由抄写员不断简化，直到文字消失，只剩下 stylized 的斜线和圆圈。",
    whatIsP2: "古罗马的商人早在现代百分号出现之前，就已经用 100 为分母的分数来计算贷款利息。这个概念在文艺复兴时期随着复式记账法在欧洲贸易网络中传播而普及。通过将数值表达为一百的部分，商人可以比较规模迥异的交易比率——无论是在谈几匹布的买卖，还是在资助整趟贸易航程。",
    whatIsP3: "今天，百分比是比较的通用语言。它们让你可以说「我们的缺陷率从 4% 降到 1%」并立即传达幅度，或者陈述「通胀率每年 3.2%」而不需要额外背景。一个原始数字像「我们省了 $1,200」没什么意义，如果不知道总数是 $1,500 还是 $1,200,000——百分比告诉你一切你需要知道的东西。",
    threeModesTitle: "三种最有用的百分比计算",
    threeModesIntro: "几乎每个实用的百分比问题都属于以下三类之一。这个计算器处理全部三种。",
    mode1Title: "模式 1：Y 的 X% — 找出部分",
    mode1Formula: "结果 = (X ÷ 100) × Y",
    mode1Desc: "这是最常见的计算。你知道百分比比率和整体，想找出对应的数量。例子：",
    mode1Examples: ["$80 餐厅账单的 15% 小费：(15 ÷ 100) × 80 = $12.00", "$150 外套的 20% 折扣：(20 ÷ 100) × 150 = 减 $30，所以你付 $120", "$240 电器的 6% 销售税：(6 ÷ 100) × 240 = $14.40 税款"],
    mode2Title: "模式 2：X 是 Y 的百分之几 — 找出比率",
    mode2Formula: "结果 = (X ÷ Y) × 100",
    mode2Desc: "你知道部分和整体，想把关系表达为百分比。例子：",
    mode2Examples: ["60 题测验中答对 45 题：(45 ÷ 60) × 100 = 75%", "生产 200 件中有 3 件次品：(3 ÷ 200) × 100 = 1.5% 次品率", "$75,000 目标已储蓄 $18,000：(18,000 ÷ 75,000) × 100 = 完成了 24%"],
    mode3Title: "模式 3：从 X 到 Y 的 % 变化 — 找出增长或下跌",
    mode3Formula: "结果 = ((Y − X) ÷ |X|) × 100",
    mode3Desc: "你知道起始值和结束值，想把变化表达为百分比。分母中 X 的绝对值可以正确处理负数起始值。例子：",
    mode3Examples: ["收入从 $450,000 增加到 $540,000：((540k − 450k) ÷ 450k) × 100 = +20% 增长", "股价从 $85 跌到 $51：((51 − 85) ÷ 85) × 100 = −40% 下跌", "网站流量从 12,000 跌到 9,600 次浏览：((9,600 − 12,000) ÷ 12,000) × 100 = −20%"],
    applicationsTitle: "现实世界应用",
    applicationsIntro: "百分比出现在日常财务生活的几乎每个领域。以下是一些具体例子，说明这个计算出现得多频繁：",
    applicationsItems: [
      { title: "销售税。", desc: "纽约市拥有美国最高的综合销售税率之一，达到 8.875%。$100 的消费，加 $8.88 税，总共 $108.88。一部 $1,200 的笔记本电脑，净税就要 $106.50。" },
      { title: "增值税（VAT）。", desc: "英国的标准增值税率是 20%。一家公司买 £200 的物资，要付 £40 增值税，总共 £240。已登记增值税的公司可以退回进项增值税，但消费者不行。" },
      { title: "小费。", desc: "$65 餐厅账单的 18% 小费是 (18 ÷ 100) × 65 = $11.70。同一账单的 20% 小费是 $13.00。会算数让你可以准确给小费，不用靠收据上印的小费计算器。" },
      { title: "利率。", desc: "一张信用卡对 $5,000 结欠收取 2% 月息，每月利息成本是 (2 ÷ 100) × 5,000 = $100——也就是每年 $1,200，或年利率 24%。" },
      { title: "考试和表现分数。", desc: "120 分满分中拿到 78 分是 (78 ÷ 120) × 100 = 65%。这是否及格视乎机构的门槛，但百分比立即将原始分数放在背景中。" },
      { title: "体脂百分比。", desc: "身体成分评估以百分比报告结果，因为体脂作为绝对重量没有背景就没有意义。体脂百分比 18% 意味着每 100 公斤体重有 18 公斤脂肪，不论个人总体重多少。" },
    ],
    mistakesTitle: "常见百分比错误",
    mistakesIntro: "即使是对数字很熟悉的人也会定期犯这些错误。理解它们可以防止代价高昂的误算。",
    mistakesItems: [
      { title: "混淆百分点和百分比。", desc: "如果利率从 2% 升到 3%，它增加了 1 个百分点——但以相对值计算，它增加了 50% ((3−2)÷2 × 100 = 50%)。这两种陈述听起来很不同，意思也很不同。财经报道经常故意利用这种模糊性。" },
      { title: "搞混「百分之几」和「多多少百分比」。", desc: "「比 100 多 50%」意思是 100 + 100 的 50% = 100 + 50 = 150。但「100 的 150%」也等于 150。混淆出现在类似「价格高了 150%」的说法——意思是价格变了三倍（100 + 150 = 250），而不是增加了一半。永远要搞清楚句子是指「X% of」还是「X% more than」。" },
      { title: "假设连续折扣可以相加。", desc: "20% 折扣之后再 10% 折扣，不等于 30% 折扣。从 $100 开始：20% 折扣后你有 $80，然后 $80 的 10% 折扣是 $8，剩下 $72。综合折扣是 28%，不是 30%。两个折扣是复合的：(1 − 0.20) × (1 − 0.10) = 0.80 × 0.90 = 0.72，总共减了 28%。" },
      { title: "逆转百分比变化方向。", desc: "如果一个价格跌了 50% 然后升回 50%，你不会回到原价。一件 $100 的物品跌到 $50（−50%），然后升 50% 到 $75。你仍然比起始点低 25%。百分比变化围绕零点并不对称。" },
    ],
    faqTitle: "常见问题",
    faqItems: [
      { q: "百分比和百分点有什么区别？", a: "百分比是一个相对度量（每 100 有 X），而百分点是两个百分比之间的绝对算术差。如果失业率从 6% 降到 4%，它跌了 2 个百分点，但以相对值计算跌了 33.3%。财经新闻报道利率或民调数据时经常使用百分点变化，所以仔细阅读很重要。" },
      { q: "如何计算百分比增加或减少？", a: "使用百分比变化公式：((新值 − 旧值) ÷ 旧值) × 100。如果结果是正数，就是增加；如果是负数，就是减少。例如，工资从 $50,000 加到 $55,000 是 ((55,000 − 50,000) ÷ 50,000) × 100 = 10% 增加。使用这个计算器的「从 X 到 Y 的 % 变化」模式自动计算。" },
      { q: "复合增长和简单百分比有什么不同？", a: "简单百分比增加每期都应用在原始金额上。$1,000 的 5% 简单回报 3 年，每年加 $50，总共 $1,150。复合增长每期将百分比应用在新总额上：第 1 年后你有 $1,050，第 2 年后你有 $1,102.50，第 3 年后你有 $1,157.63。3 年内差异看似很小，但几十年后会变得非常巨大，这就是为什么复合被称为投资界的「世界第八大奇迹」。" },
      { q: "200% 是什么意思？", a: "一个数的 200% 意味着该数的两倍。$50 的 200% = (200 ÷ 100) × 50 = $100。不过，「比 $50 多 200%」意味着 $50 + $100 = $150，因为「more than」将百分比加在原始值之上。所以「$50 的 200%」= $100，而「$50 再加 200%」= $150。措辞影响很大。" },
      { q: "如何计算折扣前的原价？", a: "如果你知道折扣后价格和折扣率，将折扣后价格除以 (1 − 折扣率)。例如，一件物品 85 折后卖 $68。原价是 $68 ÷ (1 − 0.15) = $68 ÷ 0.85 = $80。一个常见错误是将 15% 加回 $68，得出 $78.20——这是错的，因为 $80 的 15% 是 $12，而不是 $68 的 15%。" },
      { q: "什么是基点？", a: "基点（bps）是百分点的百分之一——也就是 0.01%。基点在金融中用来讨论利率、债券收益率和费用的细小变化，说「25 个基点」比说「0.25 个百分点」或「四分之一个百分比」更精确和更少歧义。当中央银行将基准利率提高 50 个基点，意思是利率增加了 0.50 个百分点。" },
    ],
  },
  es: {
    sidebarTitle: "Casos de uso",
    sidebarSubtitle: "Tres formas de trabajar con porcentajes.",
    sidebarItems: ["Descuentos y precios de oferta.", "Impuesto, propina y cálculos de comisión.", "Crecimiento anual y seguimiento de cambios."],
    whatIsTitle: "¿Qué es un porcentaje?",
    whatIsP1: "Un porcentaje es un número expresado como fracción de 100. La palabra viene del latín «per centum», que significa «por ciento». Cuando dices 45%, quieres decir 45 de cada 100, o equivalentemente la razón 45/100 = 0,45. El signo de porcentaje (%) evolucionó de la abreviatura italiana «per cento», que los escribas fueron simplificando durante siglos hasta que las palabras desaparecieron y solo quedaron las barras y círculos estilizados.",
    whatIsP2: "Los comerciantes de la antigua Roma ya usaban fracciones de 100 para calcular intereses sobre préstamos, mucho antes de que existiera el signo de porcentaje moderno. El concepto se generalizó durante el Renacimiento a medida que la contabilidad por partida doble se extendió por las redes comerciales europeas. Al expresar valores como partes de cien, los comerciantes podían comparar razones entre transacciones de tamaños muy diferentes.",
    whatIsP3: "Hoy en día, los porcentajes son el lenguaje universal de la comparación. Permiten decir «nuestra tasa de defectos bajó del 4% al 1%» y transmitir la magnitud de inmediato, o indicar «la inflación anual es del 3,2%» de una forma que no requiere contexto adicional. Un número bruto como «ahorramos $1.200» dice poco sin saber si el total era $1.500 o $1.200.000; el porcentaje te dice todo lo que necesitas saber.",
    threeModesTitle: "Los tres cálculos de porcentaje más útiles",
    threeModesIntro: "Casi todos los problemas prácticos de porcentaje entran en una de tres categorías. Esta calculadora cubre las tres.",
    mode1Title: "Modo 1: X% de Y — encontrar una porción",
    mode1Formula: "Resultado = (X ÷ 100) × Y",
    mode1Desc: "Este es el cálculo más común. Conoces el porcentaje y el total, y quieres el importe correspondiente. Ejemplos:",
    mode1Examples: ["Propina del 15% en una cuenta de $80: (15 ÷ 100) × 80 = $12,00", "Descuento del 20% en una chaqueta de $150: (20 ÷ 100) × 150 = $30 de descuento, pagas $120", "IVA del 6% en un electrodoméstico de $240: (6 ÷ 100) × 240 = $14,40 de impuesto"],
    mode2Title: "Modo 2: X es qué % de Y — encontrar la tasa",
    mode2Formula: "Resultado = (X ÷ Y) × 100",
    mode2Desc: "Conoces la parte y el total, y quieres expresar la relación como porcentaje. Ejemplos:",
    mode2Examples: ["45 respuestas correctas de 60 en un examen: (45 ÷ 60) × 100 = 75%", "3 unidades defectuosas de 200 producidas: (3 ÷ 200) × 100 = 1,5% de tasa de defectos", "$18.000 ahorrados hacia una meta de $75.000: (18.000 ÷ 75.000) × 100 = 24% del camino"],
    mode3Title: "Modo 3: % cambio de X a Y — encontrar crecimiento o declive",
    mode3Formula: "Resultado = ((Y − X) ÷ |X|) × 100",
    mode3Desc: "Conoces el valor inicial y el valor final, y quieres expresar el cambio como porcentaje. El valor absoluto de X en el denominador maneja correctamente los valores iniciales negativos. Ejemplos:",
    mode3Examples: ["Los ingresos crecieron de $450.000 a $540.000: ((540k − 450k) ÷ 450k) × 100 = +20% de crecimiento", "El precio de una acción cayó de $85 a $51: ((51 − 85) ÷ 85) × 100 = −40% de caída", "El tráfico web bajó de 12.000 a 9.600 visitas: ((9.600 − 12.000) ÷ 12.000) × 100 = −20%"],
    applicationsTitle: "Aplicaciones del mundo real",
    applicationsIntro: "Los porcentajes aparecen en casi todas las áreas de la vida financiera cotidiana. Aquí hay ejemplos concretos que ilustran con qué frecuencia surge el cálculo:",
    applicationsItems: [
      { title: "Impuesto sobre las ventas.", desc: "La ciudad de Nueva York tiene una de las tasas de impuesto sobre las ventas combinadas más altas de EE. UU., del 8,875%. En una compra de $100, eso añade $8,88 de impuesto para un total de $108,88. En un portátil de $1.200, solo el impuesto es $106,50." },
      { title: "IVA (Impuesto al Valor Añadido).", desc: "La tasa estándar de IVA en el Reino Unido es del 20%. Una empresa que compra suministros por £200 paga £40 de IVA, por un total de £240. Las empresas registradas en el IVA pueden recuperar el IVA soportado, pero los consumidores no." },
      { title: "Propinas.", desc: "Una propina del 18% en una cuenta de $65 es (18 ÷ 100) × 65 = $11,70. Una propina del 20% en la misma cuenta es $13,00. Conocer el cálculo te permite dar propina con precisión sin depender de las calculadoras impresas en los recibos." },
      { title: "Tasas de interés.", desc: "Una tarjeta de crédito que cobra un 2% de interés mensual sobre un saldo de $5.000 cuesta (2 ÷ 100) × 5.000 = $100 al mes en intereses, lo que equivale a $1.200 al año, o una tasa anual del 24%." },
      { title: "Calificaciones y puntuaciones.", desc: "Obtener 78 puntos de 120 es (78 ÷ 120) × 100 = 65%. Si eso es una calificación aprobatoria depende del umbral de la institución, pero el porcentaje contextualiza inmediatamente la puntuación bruta." },
      { title: "Porcentaje de grasa corporal.", desc: "Las evaluaciones de composición corporal reportan resultados en porcentajes porque la grasa corporal en peso absoluto no tiene significado sin contexto. Un porcentaje de grasa corporal del 18% significa 18 kg de grasa por cada 100 kg de peso corporal, independientemente del peso total de la persona." },
    ],
    mistakesTitle: "Errores comunes con los porcentajes",
    mistakesIntro: "Incluso las personas cómodas con los números cometen estos errores regularmente. Entenderlos evita cálculos costosos.",
    mistakesItems: [
      { title: "Confundir puntos porcentuales con porcentajes.", desc: "Si una tasa de interés sube del 2% al 3%, ha aumentado 1 punto porcentual, pero en términos relativos ha aumentado un 50% ((3−2)÷2 × 100 = 50%). Estas dos afirmaciones suenan muy diferentes y significan cosas muy distintas. Los informes financieros a menudo explotan esta ambigüedad intencionalmente." },
      { title: "Confundir «porcentaje de» y «porcentaje más».", desc: "«50% más que 100» significa 100 + 50% de 100 = 100 + 50 = 150. Pero «150% de 100» también es 150. La confusión surge en frases como «los precios son un 150% más altos», lo que significaría que los precios se triplicaron (100 + 150 = 250), no que aumentaron a la mitad. Siempre verifica si la frase significa «X% de» o «X% más que»." },
      { title: "Asumir que los descuentos sucesivos se suman.", desc: "Un descuento del 20% seguido de uno del 10% no equivale a un descuento del 30%. Empezando con $100: después del 20% de descuento tienes $80, luego el 10% de $80 es $8, quedando $72. El descuento combinado es del 28%, no del 30%. Los dos descuentos se componen: (1 − 0,20) × (1 − 0,10) = 0,80 × 0,90 = 0,72, una reducción total del 28%." },
      { title: "Invertir la dirección del cambio porcentual.", desc: "Si un precio baja un 50% y luego sube un 50%, no vuelves al precio original. Un artículo de $100 baja a $50 (−50%), luego sube un 50% hasta $75. Sigues estando un 25% por debajo del punto de partida. Los cambios porcentuales no son simétricos alrededor de cero." },
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      { q: "¿Cuál es la diferencia entre porcentaje y puntos porcentuales?", a: "Un porcentaje es una medida relativa (X por cada 100), mientras que un punto porcentual es la diferencia aritmética absoluta entre dos porcentajes. Si el desempleo baja del 6% al 4%, bajó 2 puntos porcentuales, pero bajó un 33,3% en términos relativos. Las noticias financieras a menudo informan sobre cambios en puntos porcentuales al cubrir tasas de interés o datos de encuestas, por lo que es importante leer con atención." },
      { q: "¿Cómo calculo un aumento o disminución porcentual?", a: "Usa la fórmula de cambio porcentual: ((Valor nuevo − Valor antiguo) ÷ Valor antiguo) × 100. Si el resultado es positivo, es un aumento; si es negativo, es una disminución. Por ejemplo, un aumento salarial de $50.000 a $55.000 es ((55.000 − 50.000) ÷ 50.000) × 100 = 10% de aumento. Usa el modo «% cambio de X a Y» de esta calculadora para calcularlo automáticamente." },
      { q: "¿En qué se diferencia el crecimiento compuesto de un porcentaje simple?", a: "Un aumento porcentual simple se aplica al importe original cada período. Un rendimiento simple del 5% sobre $1.000 durante 3 años añade $50 por año para un total de $1.150. El crecimiento compuesto aplica el porcentaje al nuevo total cada período: tras el año 1 tienes $1.050, tras el año 2 tienes $1.102,50, tras el año 3 tienes $1.157,63. La diferencia parece pequeña en 3 años pero se vuelve enorme en décadas, por lo que el interés compuesto se llama la «octava maravilla del mundo» en los círculos de inversión." },
      { q: "¿Qué significa 200%?", a: "El 200% de un número significa el doble de ese número. El 200% de $50 = (200 ÷ 100) × 50 = $100. Sin embargo, «200% más que $50» significaría $50 + $100 = $150, porque «más que» añade el porcentaje al original. Así, «200% de $50» = $100, mientras que «$50 más un 200%» = $150. La formulación importa mucho." },
      { q: "¿Cómo calculo el precio original antes de un descuento?", a: "Si conoces el precio con descuento y la tasa de descuento, divide el precio con descuento entre (1 − tasa de descuento). Por ejemplo, un artículo cuesta $68 después de un descuento del 15%. El precio original era $68 ÷ (1 − 0,15) = $68 ÷ 0,85 = $80. Un error común es añadir el 15% de vuelta a $68, lo que da $78,20, lo cual es incorrecto porque el 15% de $80 es $12, no el 15% de $68." },
      { q: "¿Qué es un punto básico?", a: "Un punto básico (pb) es una centésima parte de un punto porcentual, es decir, el 0,01%. Los puntos básicos se usan en finanzas para hablar de pequeños cambios en tasas de interés, rendimientos de bonos y comisiones, ya que decir «25 puntos básicos» es más preciso y menos ambiguo que decir «0,25 puntos porcentuales» o «un cuarto de por ciento». Cuando un banco central sube su tasa de referencia en 50 puntos básicos, significa que la tasa ha aumentado 0,50 puntos porcentuales." },
    ],
  },
};

export default function PercentageCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [mode, setMode] = useState<"pof" | "what" | "change">("pof");
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
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

  const result = useMemo(() => {
    const av = parseFloat(a), bv = parseFloat(b);
    if (isNaN(av) || isNaN(bv)) return null;
    if (mode === "pof") return (av / 100) * bv;
    if (mode === "what") return bv === 0 ? null : (av / bv) * 100;
    if (mode === "change") return bv === 0 ? null : ((bv - av) / Math.abs(av)) * 100;
    return null;
  }, [a, b, mode]);

  const content = LANGUAGES[locale];
  const educationContent = EDUCATION[locale];
  const hints = locale === "zh-hk" ? ["年齡", "工作日", "日期", "URL"] : locale === "zh-cn" ? ["年龄", "工作日", "日期", "URL"] : locale === "es" ? ["edad", "fecha", "porcentaje", "url"] : ["age", "date", "weight", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const modes: { key: "pof" | "what" | "change"; label: string }[] = [
    { key: "pof", label: content.mode1 },
    { key: "what", label: content.mode2 },
    { key: "change", label: content.mode3 },
  ];

  const aLabel = mode === "pof" ? content.aLabelPof : mode === "what" ? content.aLabelWhat : content.aLabelChange;
  const bLabel = mode === "pof" ? content.bLabelPof : mode === "what" ? content.bLabelWhat : content.bLabelChange;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Percent className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">

              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="flex flex-wrap gap-2">{modes.map((m) => <button key={m.key} onClick={() => setMode(m.key)} className={`rounded-full border px-4 py-2 text-sm transition ${mode === m.key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{m.label}</button>)}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{aLabel}</span><input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{bLabel}</span><input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
              </div>
              {result !== null && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.result}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">
                    {mode === "pof" ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    {mode === "pof" && `${a}% of ${b} = ${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}`}
                    {mode === "what" && `${a} is ${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}% of ${b}`}
                    {mode === "change" && `${a} → ${b} = ${result >= 0 ? "+" : ""}${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}
                  </p>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">{hints.map((h) => <button key={h} type="button" onClick={() => setSearch(h)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition">{h}</button>)}</div>
              <div className="mt-4 grid gap-2">{filteredTools.map((t) => <button key={t.href} type="button" onClick={() => (window.location.href = t.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
            </section>

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.whatIsTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.whatIsP1}</p>
                <p className="mt-3 leading-7">{educationContent.whatIsP2}</p>
                <p className="mt-3 leading-7">{educationContent.whatIsP3}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.threeModesTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.threeModesIntro}</p>

                <div className="mt-5 space-y-6">
                  <div>
                    <h3 className="font-semibold text-white">{educationContent.mode1Title}</h3>
                    <div className="mt-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-3 font-mono text-emerald-100 text-sm">{educationContent.mode1Formula}</div>
                    <p className="mt-3 leading-7 text-white/70">{educationContent.mode1Desc}</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      {educationContent.mode1Examples.map((ex) => <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{ex}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{educationContent.mode2Title}</h3>
                    <div className="mt-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-3 font-mono text-emerald-100 text-sm">{educationContent.mode2Formula}</div>
                    <p className="mt-3 leading-7 text-white/70">{educationContent.mode2Desc}</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      {educationContent.mode2Examples.map((ex) => <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{ex}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{educationContent.mode3Title}</h3>
                    <div className="mt-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-3 font-mono text-emerald-100 text-sm">{educationContent.mode3Formula}</div>
                    <p className="mt-3 leading-7 text-white/70">{educationContent.mode3Desc}</p>
                    <ul className="mt-2 space-y-2 text-white/70">
                      {educationContent.mode3Examples.map((ex) => <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{ex}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.applicationsTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.applicationsIntro}</p>
                <ul className="mt-3 space-y-3 text-white/70">
                  {educationContent.applicationsItems.map((item) => <li><strong className="text-white">{item.title}</strong> {item.desc}</li>)}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.mistakesTitle}</h2>
                <p className="mt-3 leading-7">{educationContent.mistakesIntro}</p>
                <ul className="mt-3 space-y-4 text-white/70">
                  {educationContent.mistakesItems.map((item) => <li>
                    <strong className="text-white">{item.title}</strong> {item.desc}
                  </li>)}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{educationContent.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {educationContent.faqItems.map((item) => <div>
                    <h3 className="font-semibold text-white">{item.q}</h3>
                    <p className="mt-1 text-white/70">{item.a}</p>
                  </div>)}
                </div>
              </div>
            </article>

          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Percent className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{educationContent.sidebarTitle}</h2><p className="text-sm text-neutral-300">{educationContent.sidebarSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {educationContent.sidebarItems.map((item) => <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
