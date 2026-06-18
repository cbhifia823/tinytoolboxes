import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Building2, Search } from "lucide-react";

// UI labels for the loan calculator
const LANGUAGES = {
  en: {
    name: "English",
    title: "Loan Calculator",
    subtitle: "Calculate your monthly payments and total interest for any loan amount, rate, and term.",
    reserveAd: "Ad",
    principalLabel: "Principal",
    rateLabel: "Annual Rate",
    termLabel: "Term",
    years: "Years",
    months: "Months",
    monthly: "Monthly Payment",
    totalPayment: "Total Payment",
    totalInterest: "Total Interest",
    schedule: "Amortization Schedule",
    year: "Year",
    paid: "Paid",
    interest: "Interest",
    balance: "Balance",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    adLabel: "Advertisement",
    reserveAdSub: "Sponsored",
    adBadge: "Ad",
    useCasesTitle: "Use Cases",
    useCasesSubtitle: "Common scenarios for this loan calculator.",
    suggestionsTitle: "Suggestions",
    suggestionsSubtitle: "Related tools you might find useful",
    useCases: ["Mortgages", "Auto loans", "Personal loans", "Student loans"],
    suggestions: ["Currency Converter", "Percentage Calculator", "Invoice Due Date Calculator"],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "貸款計算器",
    subtitle: "計算任何貸款金額、利率和期限的每月還款額和總利息。",
    reserveAd: "廣告",
    principalLabel: "貸款本金",
    rateLabel: "年利率",
    termLabel: "期限",
    years: "年",
    months: "月",
    monthly: "每月還款",
    totalPayment: "總還款額",
    totalInterest: "總利息",
    schedule: "攤銷時間表",
    year: "年",
    paid: "已還",
    interest: "利息",
    balance: "餘額",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    adLabel: "廣告",
    reserveAdSub: "贊助",
    adBadge: "廣告",
    useCasesTitle: "使用場景",
    useCasesSubtitle: "此貸款計算器的常見場景。",
    suggestionsTitle: "建議",
    suggestionsSubtitle: "你可能覺得有用的相關工具",
    useCases: ["按揭貸款", "汽車貸款", "個人貸款", "學生貸款"],
    suggestions: ["Currency Converter", "Percentage Calculator", "Invoice Due Date Calculator"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "贷款计算器",
    subtitle: "计算任何贷款金额、利率和期限的每月还款额和总利息。",
    reserveAd: "广告",
    principalLabel: "贷款本金",
    rateLabel: "年利率",
    termLabel: "期限",
    years: "年",
    months: "月",
    monthly: "每月还款",
    totalPayment: "总还款额",
    totalInterest: "总利息",
    schedule: "摊销时间表",
    year: "年",
    paid: "已还",
    interest: "利息",
    balance: "余额",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    adLabel: "广告",
    reserveAdSub: "赞助",
    adBadge: "广告",
    useCasesTitle: "使用场景",
    useCasesSubtitle: "此贷款计算器的常见场景。",
    suggestionsTitle: "建议",
    suggestionsSubtitle: "您可能觉得有用的相关工具",
    useCases: ["按揭贷款", "汽车贷款", "个人贷款", "学生贷款"],
    suggestions: ["Currency Converter", "Percentage Calculator", "Invoice Due Date Calculator"],
  },
  es: {
    name: "Español",
    title: "Calculadora de préstamos",
    subtitle: "Calcula las cuotas mensuales y el interés total para cualquier importe de préstamo, tasa y plazo.",
    reserveAd: "Anuncio",
    principalLabel: "Capital",
    rateLabel: "Tasa anual",
    termLabel: "Plazo",
    years: "Años",
    months: "Meses",
    monthly: "Cuota mensual",
    totalPayment: "Pago total",
    totalInterest: "Interés total",
    schedule: "Tabla de amortización",
    year: "Año",
    paid: "Pagado",
    interest: "Interés",
    balance: "Saldo",
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar herramientas...",
    adLabel: "Anuncio",
    reserveAdSub: "Patrocinado",
    adBadge: "An.",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Escenarios comunes para esta calculadora de préstamos.",
    suggestionsTitle: "Sugerencias",
    suggestionsSubtitle: "Herramientas relacionadas que podrían serte útiles",
    useCases: ["Hipotecas", "Préstamos para automóviles", "Préstamos personales", "Préstamos estudiantiles"],
    suggestions: ["Currency Converter", "Percentage Calculator", "Invoice Due Date Calculator"],
  },
};
const EDUCATION = {
  en: {
    howTitle: "How Loan Calculations Work",
    howP1: "When you borrow money, a lender charges interest on the outstanding balance each month. Your fixed monthly payment covers the interest first, then reduces the principal — a process called amortization. This means your early payments are mostly interest, while later payments are mostly principal.",
    howP2: "The standard formula for a fixed monthly payment is:",
    formulaNote: "Where: M = monthly payment · P = principal · r = monthly interest rate (annual rate ÷ 12) · n = total number of payments (years × 12)",
    exampleTitle: "Worked Example: $300,000 Mortgage at 4.5% for 30 Years",
    exampleP1: "Let's walk through a realistic home loan calculation step by step:",
    examplePrincipalLabel: "Principal (P):",
    exampleAnnualLabel: "Annual rate:",
    exampleMonthlyLabel: "Monthly rate (r):",
    exampleTermLabel: "Term (n):",
    exampleCalc: "M = 300,000 × [0.00375 × (1.00375)³⁶⁰] / [(1.00375)³⁶⁰ − 1]",
    exampleResult: "M ≈ $1,520.06 per month",
    exampleP2: "Over 30 years, the total payments equal $1,520.06 × 360 = <strong class=\"text-white\">$547,220</strong>. The interest cost alone is <strong class=\"text-white\">$247,220</strong> — 82% of the original loan amount. This illustrates why paying even a small extra amount towards principal each month can save tens of thousands of dollars.",
    typesTitle: "Types of Loans",
    typesIntro: "The same monthly payment formula applies to many loan types, but the terms, rates, and conditions differ significantly:",
    loanTypes: [
      { name: "Mortgage", desc: "Secured by real estate. Typically 15–30 year terms at lower interest rates (3–7%). Fixed or adjustable rate options available." },
      { name: "Auto Loan", desc: "Secured by the vehicle. Usually 36–72 months. Rates range from 4% to 20%+ depending on credit score and whether the car is new or used." },
      { name: "Personal Loan", desc: "Unsecured general-purpose loan. Higher rates (6%–36%) but flexible use. Terms of 12–60 months. No collateral required." },
      { name: "Student Loan", desc: "Government or private. Federal loans offer fixed rates and income-driven repayment options. Private loans vary widely by lender." },
    ],
    amortTitle: "Understanding Amortization",
    amortP1: "Amortization is the systematic repayment of a loan through regular scheduled payments. With a standard amortizing loan, each payment is the same dollar amount, but the split between interest and principal changes over time.",
    amortP2: "For a 30-year $300,000 mortgage at 4.5%, the first payment of $1,520 breaks down approximately like this:",
    amortInterest: "$1,125 goes to interest (300,000 × 0.375%)",
    amortPrincipal: "$395 reduces the principal balance",
    amortP3: "By month 180 (year 15), the same $1,520 payment is roughly 60% principal and 40% interest. By month 360, nearly the entire payment is principal. This is why paying an extra $200/month in the first few years of a mortgage can eliminate 4–5 years from the loan and save $30,000+ in interest.",
    tipsTitle: "How to Lower Your Total Loan Cost",
    tips: [
      { title: "Make extra principal payments.", desc: "Designate extra payments specifically as \"principal reduction.\" Even $100–$200 extra per month on a 30-year mortgage can save tens of thousands in interest over the life of the loan." },
      { title: "Refinance when rates drop significantly.", desc: "If market interest rates fall 1% or more below your current loan rate, refinancing may be worthwhile — even accounting for closing costs of 2%–4%. Use this calculator to compare your current payment against the new payment." },
      { title: "Choose a shorter term.", desc: "A 15-year mortgage has a higher monthly payment but typically carries a rate 0.5%–0.75% lower than a 30-year loan, and the total interest cost is dramatically less. On $300,000 at current rates, a 15-year mortgage saves roughly $120,000 in interest." },
      { title: "Improve your credit score before applying.", desc: "A score improvement from 680 to 760 can reduce a mortgage rate by 0.5%–1%, saving over $15,000 in interest on a typical $300,000 loan over 30 years." },
      { title: "Shop multiple lenders.", desc: "Even a 0.25% rate difference on a $300,000 loan saves over $15,000 over 30 years. Always get at least three competing quotes." },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "What is the difference between APR and interest rate?", a: "The interest rate is the annual cost of borrowing the principal amount, expressed as a percentage. APR (Annual Percentage Rate) includes the interest rate plus additional fees such as origination fees, mortgage points, and closing costs. APR gives a more complete picture of the true cost of a loan. When comparing offers from multiple lenders, always compare APRs rather than just advertised interest rates." },
      { q: "What is the difference between a fixed-rate and variable-rate loan?", a: "With a fixed-rate loan, the interest rate stays the same for the entire term, so your monthly payment never changes. With a variable-rate (adjustable-rate) loan, the rate is tied to a benchmark index like SOFR or Prime Rate and can change periodically — usually annually after an initial fixed period. Variable-rate loans often start lower but carry the risk of rising payments if market rates increase." },
      { q: "Is it better to choose a 15-year or 30-year mortgage?", a: "A 15-year mortgage has a higher monthly payment but a lower interest rate (typically 0.5%–0.75% less than a 30-year) and you pay far less total interest. On a $300,000 loan at 4.5% for 30 years, total interest is $247,220. The same loan at 3.75% for 15 years costs only $93,000 in total interest — a saving of over $154,000. Choose 30 years if cash flow flexibility is a priority; choose 15 years if you can comfortably afford the higher payment." },
      { q: "What is PMI and how can I avoid it?", a: "Private Mortgage Insurance (PMI) is required by most lenders when a home buyer puts down less than 20% of the purchase price. PMI typically costs 0.5%–1.5% of the loan amount annually, added to the monthly payment. To avoid PMI: save a 20% down payment, use a piggyback loan structure (80/10/10), or choose a lender that offers no-PMI programs (often at a slightly higher interest rate). PMI can typically be cancelled once you have 20% equity." },
      { q: "Does this calculator include property taxes and insurance?", a: "No — this calculator shows principal and interest (P&I) only. Your actual monthly housing cost (often called PITI) also includes property taxes, homeowner's insurance, and possibly HOA fees and PMI. These additional costs are typically collected by the lender in an escrow account and vary significantly by location. As a rough estimate, add 20%–40% to the calculated P&I payment to account for these costs." },
      { q: "Can this calculator be used for business loans?", a: "Yes. The underlying amortization formula applies equally to business term loans, equipment financing, commercial mortgages, and SBA loans. Enter the loan amount, annual interest rate, and repayment term. Note that some business loans use daily compounding or interest-only periods, which may result in slight differences from this calculator's results — check your loan documents for exact terms." },
    ],
  },
  "zh-hk": {
    howTitle: "貸款計算原理",
    howP1: "當你借錢時，貸款機構每月會對未償還餘額收取利息。你嘅固定每月還款會先支付利息，然後減少本金——呢個過程稱為攤銷。意味住你早期嘅還款主要係利息，而後期嘅還款主要係本金。",
    howP2: "固定每月還款嘅標準公式係：",
    formulaNote: "其中：M = 每月還款 · P = 本金 · r = 月利率（年利率 ÷ 12） · n = 總還款次數（年數 × 12）",
    exampleTitle: "計算實例：$300,000 按揭，利率 4.5%，30 年期",
    exampleP1: "等我哋逐步計算一個現實嘅房屋貸款：",
    examplePrincipalLabel: "本金（P）：",
    exampleAnnualLabel: "年利率：",
    exampleMonthlyLabel: "月利率（r）：",
    exampleTermLabel: "期限（n）：",
    exampleCalc: "M = 300,000 × [0.00375 × (1.00375)³⁶⁰] / [(1.00375)³⁶⁰ − 1]",
    exampleResult: "M ≈ 每月 $1,520.06",
    exampleP2: "30 年內，總還款額等於 $1,520.06 × 360 = <strong class=\"text-white\">$547,220</strong>。單係利息成本已經係 <strong class=\"text-white\">$247,220</strong>——係原本貸款額嘅 82%。呢個說明咗點解每月即使只還多少少本金，都可以慳到幾萬蚊。",
    typesTitle: "貸款類型",
    typesIntro: "相同嘅每月還款公式適用於多種貸款類型，但條款、利率同條件有好大差異：",
    loanTypes: [
      { name: "按揭貸款", desc: "以房地產作抵押。通常為 15–30 年期，利率較低（3–7%）。可選擇固定或浮動利率。" },
      { name: "汽車貸款", desc: "以車輛作抵押。通常 36–72 個月。利率由 4% 到 20% 以上不等，取決於信用評分以及車輛係新車定二手車。" },
      { name: "個人貸款", desc: "無抵押通用貸款。利率較高（6%–36%），但用途靈活。期限為 12–60 個月。無需抵押品。" },
      { name: "學生貸款", desc: "政府或私人貸款。聯邦貸款提供固定利率同按收入還款嘅選項。私人貸款則因貸款機構而異。" },
    ],
    amortTitle: "了解攤銷",
    amortP1: "攤銷係通過定期定額還款嚟系統性償還貸款。對於標準攤銷貸款，每筆還款金額相同，但利息同本金之間嘅比例會隨時間變化。",
    amortP2: "對於一筆 30 年期、$300,000、利率 4.5% 嘅按揭，第一筆 $1,520 嘅還款大致分解如下：",
    amortInterest: "$1,125 用於支付利息（300,000 × 0.375%）",
    amortPrincipal: "$395 用於減少本金餘額",
    amortP3: "到第 180 個月（第 15 年），同樣嘅 $1,520 還款大約係 60% 本金同 40% 利息。到第 360 個月，幾乎全部還款都係本金。呢個就係點解喺按揭頭幾年每月還多 $200，可以縮短 4–5 年貸款期並節省 $30,000 以上嘅利息。",
    tipsTitle: "如何降低總貸款成本",
    tips: [
      { title: "額外償還本金。", desc: "將額外還款指定為「本金減少」。即使 30 年期按揭每月多還 $100–$200，喺整個貸款期內都可以慳到數以萬計嘅利息。" },
      { title: "當利率大幅下跌時再融資。", desc: "如果市場利率比你目前嘅貸款利率低 1% 或以上，即使計及 2%–4% 嘅成交成本，再融資都可能係值得嘅。用呢個計算器比較你目前嘅還款同新還款。" },
      { title: "選擇較短嘅期限。", desc: "15 年期按揭每月還款較高，但利率通常比 30 年期低 0.5%–0.75%，而且總利息成本大幅減少。以目前利率計算，$300,000 嘅 15 年期按揭大約可節省 $120,000 利息。" },
      { title: "申請前改善信用評分。", desc: "評分由 680 提高到 760，可以將按揭利率降低 0.5%–1%，喺典型嘅 $300,000 貸款 30 年期內節省超過 $15,000 利息。" },
      { title: "向多家貸款機構查詢。", desc: "即使 $300,000 貸款嘅利率只有 0.25% 差異，30 年內都可以節省超過 $15,000。一定要攞至少三份競爭報價。" },
    ],
    faqTitle: "常見問題",
    faqs: [
      { q: "APR 同利率有咩分別？", a: "利率係借貸本金嘅年度成本，以百分比表示。APR（年百分比率）包括利率加上額外費用，例如貸款發起費、按揭點數同成交成本。APR 可以更全面地反映貸款嘅真實成本。比較多家貸款機構嘅報價時，務必比較 APR 而不僅僅係宣傳嘅利率。" },
      { q: "固定利率同浮動利率貸款有咩分別？", a: "固定利率貸款嘅利率喺整個期限內保持不變，所以每月還款永遠唔會變。浮動（可調節）利率貸款嘅利率同 SOFR 或最優惠利率等基準指數掛鉤，可以定期變動——通常喺初始固定期後每年調整一次。浮動利率貸款通常開始時較低，但如果市場利率上升，會有還款增加嘅風險。" },
      { q: "揀 15 年定 30 年按揭比較好？", a: "15 年期按揭每月還款較高，但利率較低（通常比 30 年期低 0.5%–0.75%），而且總利息支出少好多。以 $300,000 貸款、利率 4.5%、30 年期計，總利息係 $247,220。同樣貸款以 3.75%、15 年期計，總利息只係 $93,000——節省超過 $154,000。如果現金流靈活性係優先考慮，揀 30 年；如果你可以輕鬆負擔較高嘅還款，揀 15 年。" },
      { q: "咩係 PMI？點樣可以避免？", a: "私人按揭保險（PMI）係大多數貸款機構要求嘅，當買家首付低於購買價格嘅 20% 時就需要。PMI 通常每年成本係貸款額嘅 0.5%–1.5%，加到每月還款中。避免 PMI 嘅方法：儲夠 20% 首付、使用 piggyback 貸款結構（80/10/10）、或選擇提供免 PMI 計劃嘅貸款機構（通常利率稍高）。當你有 20% 權益時，PMI 通常可以取消。" },
      { q: "呢個計算器係咪包括物業稅同保險？", a: "唔包括——呢個計算器只顯示本金同利息（P&I）。你實際嘅每月房屋成本（通常稱為 PITI）仲包括物業稅、業主保險，以及可能嘅 HOA 費用同 PMI。呢啲額外成本通常由貸款機構透過託管賬戶收取，並且因地區而異。粗略估計，喺計算出嘅 P&I 還款額上加 20%–40% 以涵蓋呢啲成本。" },
      { q: "呢個計算器可以用於商業貸款嗎？", a: "可以。底層嘅攤銷公式同樣適用於商業定期貸款、設備融資、商業按揭同 SBA 貸款。輸入貸款金額、年利率同還款期限。請注意，某啲商業貸款採用每日複利或只還利息期，可能與呢個計算器嘅結果有輕微差異——請查閱你嘅貸款文件以確認具體條款。" },
    ],
  },
  "zh-cn": {
    howTitle: "贷款计算原理",
    howP1: "当你借钱时，贷款机构每月会对未偿还余额收取利息。你的固定每月还款会先支付利息，然后减少本金——这个过程称为摊销。这意味着你早期的还款主要是利息，而后期的还款主要是本金。",
    howP2: "固定每月还款的标准公式是：",
    formulaNote: "其中：M = 每月还款 · P = 本金 · r = 月利率（年利率 ÷ 12） · n = 总还款次数（年数 × 12）",
    exampleTitle: "计算实例：$300,000 按揭，利率 4.5%，30 年期",
    exampleP1: "让我们逐步计算一个现实的房屋贷款：",
    examplePrincipalLabel: "本金（P）：",
    exampleAnnualLabel: "年利率：",
    exampleMonthlyLabel: "月利率（r）：",
    exampleTermLabel: "期限（n）：",
    exampleCalc: "M = 300,000 × [0.00375 × (1.00375)³⁶⁰] / [(1.00375)³⁶⁰ − 1]",
    exampleResult: "M ≈ 每月 $1,520.06",
    exampleP2: "30 年内，总还款额等于 $1,520.06 × 360 = <strong class=\"text-white\">$547,220</strong>。仅利息成本已经是 <strong class=\"text-white\">$247,220</strong>——是原本贷款额的 82%。这说明了为什么每月即使只多还一点本金，都可以节省数万美元。",
    typesTitle: "贷款类型",
    typesIntro: "相同的每月还款公式适用于多种贷款类型，但条款、利率和条件有很大差异：",
    loanTypes: [
      { name: "按揭贷款", desc: "以房地产作抵押。通常为 15–30 年期，利率较低（3–7%）。可选择固定或浮动利率。" },
      { name: "汽车贷款", desc: "以车辆作抵押。通常 36–72 个月。利率由 4% 到 20% 以上不等，取决于信用评分以及车辆是新车还是二手车。" },
      { name: "个人贷款", desc: "无抵押通用贷款。利率较高（6%–36%），但用途灵活。期限为 12–60 个月。无需抵押品。" },
      { name: "学生贷款", desc: "政府或私人贷款。联邦贷款提供固定利率和按收入还款的选项。私人贷款则因贷款机构而异。" },
    ],
    amortTitle: "了解摊销",
    amortP1: "摊销是通过定期定额还款来系统性偿还贷款。对于标准摊销贷款，每笔还款金额相同，但利息与本金之间的比例会随时间变化。",
    amortP2: "对于一笔 30 年期、$300,000、利率 4.5% 的按揭，第一笔 $1,520 的还款大致分解如下：",
    amortInterest: "$1,125 用于支付利息（300,000 × 0.375%）",
    amortPrincipal: "$395 用于减少本金余额",
    amortP3: "到第 180 个月（第 15 年），同样的 $1,520 还款大约是 60% 本金和 40% 利息。到第 360 个月，几乎全部还款都是本金。这就是为什么在按揭头几年每月多还 $200，可以缩短 4–5 年贷款期并节省 $30,000 以上的利息。",
    tipsTitle: "如何降低总贷款成本",
    tips: [
      { title: "额外偿还本金。", desc: "将额外还款指定为「本金减少」。即使 30 年期按揭每月多还 $100–$200，在整个贷款期内都可以节省数以万计的利息。" },
      { title: "当利率大幅下跌时再融资。", desc: "如果市场利率比你目前的贷款利率低 1% 或以上，即使计及 2%–4% 的成交成本，再融资都可能是值得的。用这个计算器比较你目前的还款和新还款。" },
      { title: "选择较短的期限。", desc: "15 年期按揭每月还款较高，但利率通常比 30 年期低 0.5%–0.75%，而且总利息成本大幅减少。以目前利率计算，$300,000 的 15 年期按揭大约可节省 $120,000 利息。" },
      { title: "申请前改善信用评分。", desc: "评分由 680 提高到 760，可以将按揭利率降低 0.5%–1%，在典型的 $300,000 贷款 30 年期內节省超过 $15,000 利息。" },
      { title: "向多家贷款机构查询。", desc: "即使 $300,000 贷款的利率只有 0.25% 差异，30 年内都可以节省超过 $15,000。一定要获取至少三份竞争报价。" },
    ],
    faqTitle: "常见问题",
    faqs: [
      { q: "APR 和利率有什么区别？", a: "利率是借贷本金的年度成本，以百分比表示。APR（年百分比率）包括利率加上额外费用，例如贷款发起费、按揭点数和成交成本。APR 可以更全面地反映贷款的真实成本。比较多家贷款机构的报价时，务必比较 APR 而不仅仅是宣传的利率。" },
      { q: "固定利率和浮动利率贷款有什么区别？", a: "固定利率贷款的利率在整个期限内保持不变，所以每月还款永远不会变。浮动（可调节）利率贷款的利率与 SOFR 或最优惠利率等基准指数挂钩，可以定期变动——通常在初始固定期后每年调整一次。浮动利率贷款通常开始时较低，但如果市场利率上升，会有还款增加的风险。" },
      { q: "选择 15 年还是 30 年按揭比较好？", a: "15 年期按揭每月还款较高，但利率较低（通常比 30 年期低 0.5%–0.75%），而且总利息支出少很多。以 $300,000 贷款、利率 4.5%、30 年期计，总利息是 $247,220。同样贷款以 3.75%、15 年期计，总利息仅是 $93,000——节省超过 $154,000。如果现金流灵活性是优先考虑，选 30 年；如果你可以轻松负担较高的还款，选 15 年。" },
      { q: "什么是 PMI？如何避免？", a: "私人按揭保险（PMI）是大多数贷款机构要求的，当买家首付低于购买价格的 20% 时就需要。PMI 通常每年成本是贷款额的 0.5%–1.5%，加到每月还款中。避免 PMI 的方法：存够 20% 首付、使用 piggyback 贷款结构（80/10/10）、或选择提供免 PMI 计划的贷款机构（通常利率稍高）。当你有 20% 权益时，PMI 通常可以取消。" },
      { q: "这个计算器是否包括物业税和保险？", a: "不包括——这个计算器只显示本金和利息（P&I）。你实际的每月房屋成本（通常称为 PITI）还包括物业税、业主保险，以及可能的 HOA 费用和 PMI。这些额外成本通常由贷款机构通过托管账户收取，并且因地区而异。粗略估计，在计算出的 P&I 还款额上加 20%–40% 以涵盖这些成本。" },
      { q: "这个计算器可以用于商业贷款吗？", a: "可以。底层的摊销公式同样适用于商业定期贷款、设备融资、商业按揭和 SBA 贷款。输入贷款金额、年利率和还款期限。请注意，某些商业贷款采用每日复利或只还利息期，可能与这个计算器的结果有轻微差异——请查阅你的贷款文件以确认具体条款。" },
    ],
  },
  es: {
    howTitle: "Cómo funcionan los cálculos de préstamos",
    howP1: "Cuando pides dinero prestado, el prestamista cobra intereses sobre el saldo pendiente cada mes. Tu cuota mensual fija cubre primero los intereses y luego reduce el capital, un proceso llamado amortización. Esto significa que tus primeros pagos son principalmente intereses, mientras que los últimos son principalmente capital.",
    howP2: "La fórmula estándar para una cuota mensual fija es:",
    formulaNote: "Donde: M = cuota mensual · P = capital · r = tasa de interés mensual (tasa anual ÷ 12) · n = número total de pagos (años × 12)",
    exampleTitle: "Ejemplo práctico: hipoteca de $300.000 al 4,5% a 30 años",
    exampleP1: "Calculemos paso a paso un préstamo hipotecario real:",
    examplePrincipalLabel: "Capital (P):",
    exampleAnnualLabel: "Tasa anual:",
    exampleMonthlyLabel: "Tasa mensual (r):",
    exampleTermLabel: "Plazo (n):",
    exampleCalc: "M = 300.000 × [0,00375 × (1,00375)³⁶⁰] / [(1,00375)³⁶⁰ − 1]",
    exampleResult: "M ≈ $1.520,06 al mes",
    exampleP2: "A lo largo de 30 años, los pagos totales son $1.520,06 × 360 = <strong class=\"text-white\">$547.220</strong>. El costo solo en intereses es <strong class=\"text-white\">$247.220</strong>, el 82% del importe original del préstamo. Esto ilustra por qué pagar incluso una pequeña cantidad extra al capital cada mes puede ahorrar decenas de miles de dólares.",
    typesTitle: "Tipos de préstamos",
    typesIntro: "La misma fórmula de cuota mensual se aplica a muchos tipos de préstamos, pero los plazos, tasas y condiciones difieren significativamente:",
    loanTypes: [
      { name: "Hipoteca", desc: "Garantizada por bienes inmuebles. Típicamente plazos de 15 a 30 años con tasas de interés más bajas (3–7%). Opciones de tasa fija o variable disponibles." },
      { name: "Préstamo para automóvil", desc: "Garantizado por el vehículo. Generalmente de 36 a 72 meses. Las tasas oscilan entre el 4% y el 20%+ según el puntaje crediticio y si el auto es nuevo o usado." },
      { name: "Préstamo personal", desc: "Préstamo de uso general sin garantía. Tasas más altas (6%–36%) pero uso flexible. Plazos de 12 a 60 meses. No requiere garantía." },
      { name: "Préstamo estudiantil", desc: "Gubernamental o privado. Los préstamos federales ofrecen tasas fijas y opciones de pago según ingresos. Los privados varían mucho según el prestamista." },
    ],
    amortTitle: "Entendiendo la amortización",
    amortP1: "La amortización es la devolución sistemática de un préstamo mediante pagos periódicos programados. Con un préstamo amortizable estándar, cada pago tiene el mismo importe en dólares, pero la proporción entre intereses y capital cambia con el tiempo.",
    amortP2: "Para una hipoteca de $300.000 a 30 años al 4,5%, el primer pago de $1.520 se divide aproximadamente así:",
    amortInterest: "$1.125 van a intereses (300.000 × 0,375%)",
    amortPrincipal: "$395 reducen el saldo del capital",
    amortP3: "En el mes 180 (año 15), el mismo pago de $1.520 es aproximadamente un 60% capital y un 40% intereses. En el mes 360, casi todo el pago es capital. Por eso pagar $200/mes extra en los primeros años de una hipoteca puede eliminar 4 o 5 años del préstamo y ahorrar más de $30.000 en intereses.",
    tipsTitle: "Cómo reducir el costo total del préstamo",
    tips: [
      { title: "Haz pagos extra al capital.", desc: "Designa los pagos extra específicamente como «reducción de capital». Incluso $100–$200 extra al mes en una hipoteca a 30 años pueden ahorrar decenas de miles en intereses a lo largo de la vida del préstamo." },
      { title: "Refinancia cuando las tasas bajen significativamente.", desc: "Si las tasas de mercado caen un 1% o más por debajo de tu tasa actual, refinanciar puede valer la pena, incluso contando con costos de cierre del 2%–4%. Usa esta calculadora para comparar tu cuota actual con la nueva." },
      { title: "Elige un plazo más corto.", desc: "Una hipoteca a 15 años tiene una cuota mensual más alta pero suele llevar una tasa 0,5%–0,75% menor que una a 30 años, y el costo total en intereses es dramáticamente menor. Con los tipos actuales, una hipoteca a 15 años de $300.000 ahorra aproximadamente $120.000 en intereses." },
      { title: "Mejora tu puntaje crediticio antes de solicitar.", desc: "Una mejora del puntaje de 680 a 760 puede reducir la tasa hipotecaria en 0,5%–1%, ahorrando más de $15.000 en intereses en un préstamo típico de $300.000 a 30 años." },
      { title: "Consulta con varios prestamistas.", desc: "Incluso una diferencia de tasa del 0,25% en un préstamo de $300.000 ahorra más de $15.000 a lo largo de 30 años. Obtén siempre al menos tres cotizaciones competitivas." },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cuál es la diferencia entre TAE y tasa de interés?", a: "La tasa de interés es el costo anual de pedir prestado el capital, expresada como porcentaje. La TAE (Tasa Anual Equivalente o APR en inglés) incluye la tasa de interés más comisiones adicionales como comisiones de apertura, puntos hipotecarios y costos de cierre. La TAE ofrece una imagen más completa del costo real del préstamo. Al comparar ofertas de varios prestamistas, compara siempre las TAE y no solo las tasas de interés anunciadas." },
      { q: "¿Cuál es la diferencia entre un préstamo a tasa fija y uno a tasa variable?", a: "Con un préstamo a tasa fija, la tasa de interés permanece igual durante todo el plazo, por lo que la cuota mensual nunca cambia. Con un préstamo a tasa variable (ajustable), la tasa está vinculada a un índice de referencia como SOFR o la tasa Prime y puede cambiar periódicamente, generalmente una vez al año tras un período inicial fijo. Los préstamos a tasa variable suelen comenzar más bajos pero conllevan el riesgo de que las cuotas aumenten si las tasas de mercado suben." },
      { q: "¿Es mejor elegir una hipoteca a 15 o a 30 años?", a: "Una hipoteca a 15 años tiene una cuota mensual más alta pero una tasa de interés más baja (típicamente 0,5%–0,75% menos que a 30 años) y pagas mucho menos interés total. En un préstamo de $300.000 al 4,5% a 30 años, el interés total es $247.220. El mismo préstamo al 3,75% a 15 años cuesta solo $93.000 en intereses totales, un ahorro de más de $154.000. Elige 30 años si la flexibilidad de flujo de caja es prioritaria; elige 15 años si puedes costear cómodamente la cuota más alta." },
      { q: "¿Qué es el PMI y cómo puedo evitarlo?", a: "El Seguro Hipotecario Privado (PMI) es requerido por la mayoría de los prestamistas cuando el comprador da menos del 20% de entrada. El PMI suele costar entre el 0,5% y el 1,5% del importe del préstamo anualmente, añadido a la cuota mensual. Para evitar el PMI: ahorra el 20% de entrada, usa una estructura de préstamo piggyback (80/10/10), o elige un prestamista que ofrezca programas sin PMI (generalmente a una tasa de interés ligeramente más alta). El PMI generalmente puede cancelarse una vez que tienes el 20% del valor en patrimonio." },
      { q: "¿Esta calculadora incluye impuestos sobre la propiedad y seguro?", a: "No: esta calculadora muestra solo capital e intereses (P&I). El costo mensual real de tu vivienda (a menudo llamado PITI) también incluye impuestos sobre la propiedad, seguro del propietario y posiblemente cuotas de HOA y PMI. Estos costos adicionales suelen ser recaudados por el prestamista en una cuenta de depósito en garantía y varían significativamente según la ubicación. Como estimación aproximada, añade un 20%–40% al pago de P&I calculado para cubrir estos costos." },
      { q: "¿Se puede usar esta calculadora para préstamos comerciales?", a: "Sí. La fórmula de amortización subyacente se aplica igualmente a préstamos a plazo comerciales, financiación de equipos, hipotecas comerciales y préstamos SBA. Ingresa el importe del préstamo, la tasa de interés anual y el plazo de amortización. Ten en cuenta que algunos préstamos comerciales usan capitalización diaria o períodos de solo intereses, lo que puede dar resultados ligeramente diferentes de los de esta calculadora; consulta los documentos de tu préstamo para conocer los términos exactos." },
    ],
  },
};


const SUGGESTION_HREFS: Record<string, string> = {
  "Currency Converter": "/currency-converter",
  "Percentage Calculator": "/percentage-calculator",
  "Invoice Due Date Calculator": "/invoice-due-date-calculator",
};

const TOOLS = [
  { title: { en: "Currency Converter", "zh-hk": "貨幣換算器", "zh-cn": "货币换算器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies with live rates.", "zh-hk": "轉換 30+ 貨幣，使用即時匯率。", "zh-cn": "转换 30+ 货币，使用实时汇率。", es: "Convierte entre 30+ divisas con tasas en tiempo real." }, href: "/currency-converter", keywords: ["currency", "exchange"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "數字的百分比。", "zh-cn": "数字的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "轉換長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", es: "Convierte longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", es: "Calcula la edad exacta desde una fecha de nacimiento." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算器", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期加上工作日。", "zh-cn": "为任何日期加上工作日。", es: "Añade días hábiles a cualquier fecha." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Invoice Due Date Calculator", "zh-hk": "發票到期日計算器", "zh-cn": "发票到期日计算器", es: "Calculadora de vencimiento de factura" }, description: { en: "Find invoice due dates.", "zh-hk": "查找發票到期日。", "zh-cn": "查找发票到期日。", es: "Encuentra las fechas de vencimiento de facturas." }, href: "/invoice-due-date-calculator", keywords: ["invoice", "payment"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "計算字數和字符。", "zh-cn": "计算字数和字符。", es: "Cuenta palabras y caracteres." }, href: "/word-counter", keywords: ["word", "text"] },
];

function calcLoan(principal: number, annualRate: number, termMonths: number) {
  if (annualRate === 0) {
    const monthly = principal / termMonths;
    return { monthly, totalPayment: principal, totalInterest: 0, schedule: [] };
  }
  const r = annualRate / 100 / 12;
  const monthly = principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
  const totalPayment = monthly * termMonths;
  const totalInterest = totalPayment - principal;

  const schedule: { year: number; balance: number; paid: number; interest: number }[] = [];
  let balance = principal;
  let cumPaid = 0, cumInterest = 0;
  for (let m = 1; m <= termMonths; m++) {
    const interestPayment = balance * r;
    const principalPayment = monthly - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    cumPaid += monthly;
    cumInterest += interestPayment;
    if (m % 12 === 0 || m === termMonths) {
      schedule.push({ year: Math.ceil(m / 12), balance: Math.round(balance * 100) / 100, paid: Math.round(cumPaid * 100) / 100, interest: Math.round(cumInterest * 100) / 100 });
    }
  }
  return { monthly, totalPayment, totalInterest, schedule };
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/loan-calculator";

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

export default function LoanCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [principal, setPrincipal] = useState("300000");
  const [rate, setRate] = useState("4.5");
  const [term, setTerm] = useState("30");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const result = useMemo(() => {
    const p = parseFloat(principal), r = parseFloat(rate), t = parseFloat(term);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) return null;
    const months = termUnit === "years" ? Math.round(t * 12) : Math.round(t);
    return calcLoan(p, r, months);
  }, [principal, rate, term, termUnit]);

  const content = LANGUAGES[locale];
  const educationContent = EDUCATION[locale];
  const edu = educationContent;
  const hints = locale === "zh-hk" ? ["百分比", "貨幣", "單位", "URL"] : locale === "zh-cn" ? ["百分比", "货币", "单位", "URL"] : locale === "es" ? ["porcentaje", "moneda", "unidad", "url"] : ["percent", "currency", "unit", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Building2 className="h-5 w-5 text-emerald-300" /></div>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.principalLabel}</span><input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.rateLabel}</span><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
              </div>
              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.termLabel}</span>
                <div className="flex gap-2">
                  <input type="number" value={term} onChange={(e) => setTerm(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" />
                  <button onClick={() => setTermUnit("years")} className={`rounded-2xl border px-4 py-3 text-sm transition ${termUnit === "years" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.years}</button>
                  <button onClick={() => setTermUnit("months")} className={`rounded-2xl border px-4 py-3 text-sm transition ${termUnit === "months" ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{content.months}</button>
                </div>
              </label>

              {result && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {([[content.monthly, result.monthly],[content.totalPayment, result.totalPayment],[content.totalInterest, result.totalInterest]] as [string,number][]).map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p><p className="mt-2 text-xl font-semibold text-white">{fmt(value)}</p></div>
                    ))}
                  </div>

                  <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <summary className="cursor-pointer text-sm font-medium text-white/80 hover:text-white">{content.schedule}</summary>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="text-xs uppercase tracking-[0.15em] text-neutral-400">{[content.year, content.paid, content.interest, content.balance].map((h) => <th key={h} className="pb-2 text-left pr-4">{h}</th>)}</tr></thead>
                        <tbody>{result.schedule.map((row) => <tr key={row.year} className="border-t border-white/5"><td className="py-2 pr-4 text-white/70">{row.year}</td><td className="py-2 pr-4 text-white">{fmt(row.paid)}</td><td className="py-2 pr-4 text-amber-300/80">{fmt(row.interest)}</td><td className="py-2 text-emerald-300/80">{fmt(row.balance)}</td></tr>)}</tbody>
                      </table>
                    </div>
                  </details>
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

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
              <div>
                <h2 className="text-2xl font-bold text-white">{edu.howTitle}</h2>
                <p className="mt-3 leading-7">{edu.howP1}</p>
                <p className="mt-3 leading-7">{edu.howP2}</p>
                <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4 font-mono text-emerald-100">
                  M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">{edu.formulaNote}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{edu.exampleTitle}</h2>
                <p className="mt-3 leading-7">{edu.exampleP1}</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li><strong className="text-white">{edu.examplePrincipalLabel}</strong> $300,000</li>
                  <li><strong className="text-white">{edu.exampleAnnualLabel}</strong> 4.5%</li>
                  <li><strong className="text-white">{edu.exampleMonthlyLabel}</strong> 4.5% ÷ 12 = 0.375% = 0.00375</li>
                  <li><strong className="text-white">{edu.exampleTermLabel}</strong> 30 years = 360 monthly payments</li>
                </ul>
                <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4 font-mono text-sm text-emerald-100">
                  {edu.exampleCalc}<br />
                  {edu.exampleResult}
                </div>
                <p className="mt-4 leading-7" dangerouslySetInnerHTML={{ __html: edu.exampleP2 }} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{edu.typesTitle}</h2>
                <p className="mt-3 leading-7">{edu.typesIntro}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {edu.loanTypes.map((t: {name: string, desc: string}) => (
                    <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{edu.amortTitle}</h2>
                <p className="mt-3 leading-7">{edu.amortP1}</p>
                <p className="mt-3 leading-7">{edu.amortP2}</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">{edu.amortInterest}</strong></li>
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">{edu.amortPrincipal}</strong></li>
                </ul>
                <p className="mt-3 leading-7">{edu.amortP3}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{edu.tipsTitle}</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  {edu.tips.map((t: {title: string, desc: string}) => (
                    <li key={t.title}><strong className="text-white">{t.title}</strong> {t.desc}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{edu.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {edu.faqs.map((f: {q: string, a: string}) => (
                    <div key={f.q}>
                      <h3 className="font-semibold text-white">{f.q}</h3>
                      <p className="mt-1 text-white/70">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div>
              <div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" />
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Building2 className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2><p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
            </div>
            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <p className="mt-1 text-xs text-white/55">{content.suggestionsSubtitle}</p>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => (
                  <button key={name} type="button" onClick={() => { window.location.href = SUGGESTION_HREFS[name] || "/"; }} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                    <span>{name}</span>
                    <ArrowRight className="h-4 w-4 text-white/35" />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
