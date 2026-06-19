import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Home, Search } from "lucide-react";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LANGUAGES: Record<LocaleKey, {
  name: string;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  homePrice: string;
  deposit: string;
  rate: string;
  term: string;
  state: string;
  frequency: string;
  weekly: string;
  fortnightly: string;
  monthly: string;
  repayment: string;
  totalInterest: string;
  totalPaid: string;
  stampDuty: string;
  lmi: string;
  upfront: string;
  upfrontDetail: string;
  loanAmount: string;
  lvr: string;
  fhBuyer: string;
  useCasesTitle: string;
  useCases: string[];
  suggestionsTitle: string;
  suggestions: string[];
  articleTitle: string;
  articleIntro: string;
  sectionDepositTitle: string;
  sectionDepositBody: string;
  sectionStampTitle: string;
  sectionStampBody: string;
  sectionStampItems: string[];
  sectionStampNote: string;
  sectionFreqTitle: string;
  sectionFreqBody: string;
  sectionRateTitle: string;
  sectionRateBody: string;
  sectionRateItems: string[];
  sectionRateCoda: string;
  sectionNotInclTitle: string;
  sectionNotInclItems: string[];
  faqTitle: string;
  faqItems: { q: string; a: string }[];
}> = {
  en: {
    name: "English",
    title: "Mortgage Calculator (Australia)",
    subtitle: "Calculate Australian home loan repayments, stamp duty, and LMI for every state. Built for AU first-home buyers and refinancers.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: BMI, calorie, percent, age",
    homePrice: "Property price (AUD)",
    deposit: "Deposit (AUD)",
    rate: "Interest rate (% p.a.)",
    term: "Loan term (years)",
    state: "State / territory",
    frequency: "Repayment frequency",
    weekly: "Weekly",
    fortnightly: "Fortnightly",
    monthly: "Monthly",
    repayment: "Repayment",
    totalInterest: "Total interest",
    totalPaid: "Total paid",
    stampDuty: "Stamp duty (estimate)",
    lmi: "LMI (estimate)",
    upfront: "Upfront costs",
    upfrontDetail: "Deposit + stamp duty + LMI + ~$2,500 legal/conveyancing",
    loanAmount: "Loan amount",
    lvr: "LVR (loan-to-value)",
    fhBuyer: "First home buyer",
    useCasesTitle: "Use cases",
    useCases: [
      "Compare borrowing options before applying.",
      "Estimate stamp duty before auction day.",
      "Check whether LMI applies to your deposit.",
      "Choose between weekly, fortnightly, monthly.",
      "Plan refinancing scenarios.",
    ],
    suggestionsTitle: "You may also like",
    suggestions: ["Loan Calculator", "Currency Converter", "Dog Age Calculator", "Percentage Calculator"],
    articleTitle: "Australian home loans: deposit, LMI, stamp duty, and what they really cost",
    articleIntro: "Buying a home in Australia isn't just the loan repayment. The real budget includes stamp duty (state tax on the purchase), Lenders Mortgage Insurance (LMI) if your deposit is under 20%, conveyancing fees, building and pest inspections, and government registration fees. This calculator estimates all of the big-ticket items so you know what you actually need in the bank before settlement day.",
    sectionDepositTitle: "The 20% deposit rule",
    sectionDepositBody: "Lenders in Australia consider 20% the \"safe\" deposit threshold. Above 80% LVR (Loan-to-Value Ratio), banks require you to pay LMI — insurance that protects the bank if you default. LMI can easily run $10,000–$30,000 on a typical home loan, and it's usually added to the loan balance (you pay interest on it for 30 years). The most expensive money you'll ever borrow.",
    sectionStampTitle: "Stamp duty varies enormously by state",
    sectionStampBody: "",
    sectionStampItems: [
      "NSW & VIC have the highest base rates, typically 4–6% of property value.",
      "First-home buyer concessions can reduce stamp duty to zero for properties under state-specific thresholds (e.g. $800,000 in NSW, $600,000 in VIC, $700,000 in QLD as of recent years).",
      "ACT charges land tax on top of stamp duty.",
      "Foreign buyer surcharges add 7–8% in most states.",
    ],
    sectionStampNote: "This calculator uses simplified rates that capture the broad shape; for a binding number, use your state's revenue office calculator or talk to a conveyancer.",
    sectionFreqTitle: "Weekly vs fortnightly vs monthly",
    sectionFreqBody: "If your bank lets you pay weekly or fortnightly without changing the total annual amount, take it. There are 26 fortnights and 12 months in a year — if the bank treats a fortnightly payment as \"half the monthly payment,\" you end up paying the equivalent of 13 monthly payments per year instead of 12. That's a free extra payment, and on a $640,000 loan at 6.5% it can shave 5+ years off a 30-year mortgage.",
    sectionRateTitle: "The real cost of a 0.5% rate difference",
    sectionRateBody: "On a $640,000 loan over 30 years, 6.0% vs 6.5% interest is:",
    sectionRateItems: [
      "At 6.0%: ~$3,836/month, ~$741,000 total interest",
      "At 6.5%: ~$4,045/month, ~$816,000 total interest",
    ],
    sectionRateCoda: "Half a percent costs $75,000 over the life of the loan. This is why mortgage brokers and refinancing exist.",
    sectionNotInclTitle: "What this calculator doesn't include",
    sectionNotInclItems: [
      "Council rates (~$1,500–$3,000/year)",
      "Strata fees if you're buying an apartment ($2,000–$10,000+/year)",
      "Building insurance ($800–$2,500/year)",
      "Home and contents insurance",
      "Body corporate special levies",
    ],
    faqTitle: "FAQ",
    faqItems: [
      { q: "Is LMI ever worth it?", a: "Sometimes. If property prices rise faster than your ability to save 20%, paying LMI to buy now can be cheaper than waiting. Run the numbers on rental vs LMI-loan over 5 years." },
      { q: "Can I avoid LMI without 20% down?", a: "Yes, if you're in certain professions (doctors, lawyers, accountants) some lenders waive LMI. The First Home Guarantee scheme also lets eligible buyers purchase with 5% deposit and no LMI." },
      { q: "What's the difference between principal & interest vs interest-only?", a: "P&I means each payment reduces the loan. Interest-only means you only pay the interest charge — the loan never shrinks. Most owner-occupied loans should be P&I; interest-only is a tax/cashflow tool used by investors." },
      { q: "How accurate is the stamp duty estimate?", a: "Within 5–10% for standard purchases. For exact numbers, use the calculator on your state revenue office's website (revenue.nsw.gov.au, sro.vic.gov.au, etc)." },
      { q: "Should I get pre-approval before I bid at auction?", a: "Yes, always. Auction contracts in Australia are unconditional — if you can't get the loan, you lose your deposit." },
    ],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "澳洲按揭計算器",
    subtitle: "計算澳洲按揭嘅每週／半月／每月供款、印花稅同 LMI，覆蓋全部州。專為澳洲首置或轉按用戶設計。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "試下：BMI、卡路里、百分比、年齡",
    homePrice: "物業價格（澳元）",
    deposit: "首期（澳元）",
    rate: "年利率（%）",
    term: "貸款年期（年）",
    state: "州 / 領地",
    frequency: "還款頻率",
    weekly: "每週",
    fortnightly: "半月",
    monthly: "每月",
    repayment: "供款",
    totalInterest: "總利息",
    totalPaid: "總還款",
    stampDuty: "印花稅（估算）",
    lmi: "LMI 按揭保險（估算）",
    upfront: "首付前期費用",
    upfrontDetail: "首期 + 印花稅 + LMI + ~$2,500 律師費／過戶費",
    loanAmount: "貸款金額",
    lvr: "LVR（貸款／估值）",
    fhBuyer: "首置買家",
    useCasesTitle: "用途",
    useCases: [
      "申請按揭前比較借貸方案。",
      "拍賣前估算印花稅。",
      "睇下首期需唔需要 LMI。",
      "比較每週／半月／每月供款。",
      "規劃轉按方案。",
    ],
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["貸款計算機", "貨幣轉換器", "百分比計算機"],
    articleTitle: "澳洲按揭詳解：首期、LMI、印花稅同實際成本",
    articleIntro: "喺澳洲買樓，唔止係每月供款咁簡單。真正嘅預算要包括印花稅（州政府對物業買賣徵收嘅稅）、LMI 按揭保險（如果首期低過 20%）、律師費、建築同蟲害檢查、仲有政府註冊費。呢個計算機會幫你估算晒所有大額開支，等你知道成交前究竟要準備幾多錢。",
    sectionDepositTitle: "20% 首期法則",
    sectionDepositBody: "澳洲銀行將 20% 首期視為「安全」門檻。如果 LVR（貸款估值比率）超過 80%，銀行就會要求你買 LMI——呢個係保護銀行嘅保險，唔係保護你。一個普通按揭嘅 LMI 好容易就要 $10,000–$30,000，而且通常會加落貸款額度一齊供（你要供 30 年利息）。可以話係你一生人借過最貴嘅錢。",
    sectionStampTitle: "印花稅每個州差好遠",
    sectionStampBody: "",
    sectionStampItems: [
      "NSW 同 VIC 嘅基本稅率最高，通常係物業價值嘅 4–6%。",
      "首置買家豁免可以令印花稅減到零，但要符合各州嘅價格上限（例如 NSW $800,000、VIC $600,000、QLD $700,000，以近年政策為準）。",
      "ACT 喺印花稅之上仲要加徵土地稅。",
      "大部分州對海外買家額外徵收 7–8% 附加費。",
    ],
    sectionStampNote: "呢個計算機用簡化稅率，只反映大概數字；要準確數字，請用你嗰州稅務局嘅官方計算機，或者問律師。",
    sectionFreqTitle: "每週 vs 半月 vs 每月供款",
    sectionFreqBody: "如果銀行俾你每週或半月供款而唔改總年供款額，一定揀佢。一年有 26 個半月、12 個月——如果銀行將半月供款當成「半份月供」，你實際上等於一年供咗 13 次月供而唔係 12 次。呢個係免費嘅額外供款，以一筆 $640,000、利率 6.5% 嘅貸款計，可以令 30 年按揭縮短超過 5 年。",
    sectionRateTitle: "0.5% 利率差異嘅真實成本",
    sectionRateBody: "以 $640,000 貸款、30 年計，6.0% vs 6.5%：",
    sectionRateItems: [
      "6.0%：~每月 $3,836，~總利息 $741,000",
      "6.5%：~每月 $4,045，~總利息 $816,000",
    ],
    sectionRateCoda: "半個百分點，30 年就要多俾 $75,000。呢個就係點解要搵按揭經紀同轉按。",
    sectionNotInclTitle: "呢個計算機冇包嘅開支",
    sectionNotInclItems: [
      "市政費（~每年 $1,500–$3,000）",
      "大廈管理費（如果買公寓，~每年 $2,000–$10,000+）",
      "建築保險（~每年 $800–$2,500）",
      "家居財物保險",
      "大廈法團特別徵費",
    ],
    faqTitle: "常見問題",
    faqItems: [
      { q: "LMI 值唔值得買？", a: "有時值得。如果樓價升得快過你儲 20% 首期嘅速度，俾 LMI 即刻上車可能仲平過等。建議你計下租樓 vs LMI-按揭五年嘅總開支。" },
      { q: "冇 20% 首期可唔可以唔俾 LMI？", a: "可以。如果你係某啲專業人士（醫生、律師、會計師），部分銀行會豁免 LMI。另外政府嘅「首置擔保計劃」都俾合資格買家用 5% 首期買樓而唔需要 LMI。" },
      { q: "本息同還（P&I）同淨還息（Interest-only）有咩分別？", a: "P&I 即係每期供款都會減少本金。淨還息即係你只係還利息——貸款本金永遠唔會減少。大部分自住按揭應該揀 P&I；淨還息主要係投資者用嚟做稅務同現金流工具。" },
      { q: "印花稅估算有幾準？", a: "一般標準買賣誤差喺 5–10% 之內。要準確數字，請用你嗰州稅務局網站嘅官方計算機（revenue.nsw.gov.au、sro.vic.gov.au 等）。" },
      { q: "拍賣前應唔應該先做預批？", a: "一定要。澳洲嘅拍賣合約係無條件嘅——如果你攞唔到貸款，就會冇咗筆訂金。" },
    ],
  },
  "zh-cn": {
    name: "简体中文",
    title: "澳洲按揭计算器",
    subtitle: "计算澳洲按揭的每周／半月／每月还款、印花税和 LMI，覆盖全部州。专为澳洲首次置业或转按用户设计。",
    searchLabel: "搜索工具",
    searchPlaceholder: "试试：BMI、卡路里、百分比、年龄",
    homePrice: "房价（澳元）",
    deposit: "首付（澳元）",
    rate: "年利率（%）",
    term: "贷款年期（年）",
    state: "州 / 领地",
    frequency: "还款频率",
    weekly: "每周",
    fortnightly: "半月",
    monthly: "每月",
    repayment: "还款",
    totalInterest: "总利息",
    totalPaid: "总还款",
    stampDuty: "印花税（估算）",
    lmi: "LMI 按揭保险（估算）",
    upfront: "首付前期费用",
    upfrontDetail: "首付 + 印花税 + LMI + ~$2,500 律师费／过户费",
    loanAmount: "贷款金额",
    lvr: "LVR（贷款／估值）",
    fhBuyer: "首次置业",
    useCasesTitle: "用途",
    useCases: [
      "申请按揭前比较借贷方案。",
      "拍卖前估算印花税。",
      "看看首付是否需要 LMI。",
      "比较每周／半月／每月还款。",
      "规划转按方案。",
    ],
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["贷款计算器", "货币转换器", "百分比计算器"],
    articleTitle: "澳洲按揭详解：首付、LMI、印花税与实际成本",
    articleIntro: "在澳洲买房，不只是每月还款那么简单。真正的预算还包括印花税（州政府对房产交易征收的税）、LMI 按揭保险（如果首付低于 20%）、律师费、建筑与虫害检查、以及政府登记费。这个计算器帮你估算所有大额支出，让你在交割前清楚知道需要准备多少钱。",
    sectionDepositTitle: "20% 首付法则",
    sectionDepositBody: "澳洲银行将 20% 首付视为\"安全\"门槛。如果 LVR（贷款估值比）超过 80%，银行会要求你购买 LMI——这是保护银行的保险，不是保护你的。一笔普通按揭的 LMI 很容易就要 $10,000–$30,000，而且通常会加到贷款额度里一起还（你要为它付 30 年利息）。可以说是你这辈子借过最贵的钱。",
    sectionStampTitle: "印花税各州差异巨大",
    sectionStampBody: "",
    sectionStampItems: [
      "NSW 和 VIC 的基础税率最高，通常是房产价值的 4–6%。",
      "首次置业豁免可将印花税降为零，但需符合各州的价格上限（如 NSW $800,000、VIC $600,000、QLD $700,000，以近年政策为准）。",
      "ACT 在印花税之上还加征土地税。",
      "大部分州对海外买家额外征收 7–8% 附加费。",
    ],
    sectionStampNote: "此计算器使用简化税率，仅反映大致数字；如需准确数字，请用所在州税务局官网的计算器，或咨询律师。",
    sectionFreqTitle: "每周 vs 半月 vs 每月还款",
    sectionFreqBody: "如果银行允许你每周或半月还款而不改变年供款总额，一定要选它。一年有 26 个半月、12 个月——如果银行将半月还款视为\"半月供\"，你实际上等于一年还了 13 次月供而不是 12 次。这是个免费的额外还款，以 $640,000、利率 6.5% 的贷款为例，可将 30 年按揭缩短超过 5 年。",
    sectionRateTitle: "0.5% 利率差异的真实成本",
    sectionRateBody: "以 $640,000 贷款、30 年为例，6.0% vs 6.5%：",
    sectionRateItems: [
      "6.0%：~每月 $3,836，~总利息 $741,000",
      "6.5%：~每月 $4,045，~总利息 $816,000",
    ],
    sectionRateCoda: "半个百分点，30 年就要多付 $75,000。这就是为什么要找按揭经纪人及转按。",
    sectionNotInclTitle: "此计算器未包含的开支",
    sectionNotInclItems: [
      "市政费（~每年 $1,500–$3,000）",
      "物业管理费（如买公寓，~每年 $2,000–$10,000+）",
      "建筑保险（~每年 $800–$2,500）",
      "家居财物保险",
      "业主法团特别征费",
    ],
    faqTitle: "常见问题",
    faqItems: [
      { q: "LMI 值不值得买？", a: "有时值得。如果房价涨得比你存 20% 首付的速度快，付 LMI 立即上车可能比等待更划算。建议你算一下租房 vs LMI-按揭五年的总支出。" },
      { q: "没有 20% 首付能不能不付 LMI？", a: "可以。如果你是某些专业人士（医生、律师、会计师），部分银行会豁免 LMI。此外政府的\"首置担保计划\"也允许合资格买家以 5% 首付购房而无需 LMI。" },
      { q: "本息同还（P&I）和只还利息（Interest-only）有什么区别？", a: "P&I 意味着每期还款都在减少本金。只还利息意味着你只支付利息——贷款本金永远不会减少。大部分自住按揭应选 P&I；只还利息主要是投资者用作税务和现金流工具。" },
      { q: "印花税估算有多准？", a: "一般标准交易误差在 5–10% 以内。要准确数字，请用所在州税务局官网的计算器（revenue.nsw.gov.au、sro.vic.gov.au 等）。" },
      { q: "拍卖前应不应该先做预批？", a: "一定要。澳洲的拍卖合同是无条件的——如果你拿不到贷款，就会失去定金。" },
    ],
  },
  es: {
    name: "Español",
    title: "Calculadora de hipoteca (Australia)",
    subtitle: "Calcula cuotas de hipoteca, impuesto de timbre y LMI en Australia, por estado. Para compradores y refinanciamiento en AU.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: BMI, calorie, percent, age",
    homePrice: "Precio de la propiedad (AUD)",
    deposit: "Depósito (AUD)",
    rate: "Tasa de interés (% anual)",
    term: "Plazo del préstamo (años)",
    state: "Estado / territorio",
    frequency: "Frecuencia de pago",
    weekly: "Semanal",
    fortnightly: "Quincenal",
    monthly: "Mensual",
    repayment: "Cuota",
    totalInterest: "Interés total",
    totalPaid: "Total pagado",
    stampDuty: "Impuesto de timbre (estimado)",
    lmi: "LMI (estimado)",
    upfront: "Costos iniciales",
    upfrontDetail: "Depósito + impuesto de timbre + LMI + ~$2,500 honorarios legales",
    loanAmount: "Monto del préstamo",
    lvr: "LVR (préstamo/valor)",
    fhBuyer: "Comprador primera vivienda",
    useCasesTitle: "Casos de uso",
    useCases: [
      "Comparar opciones antes de solicitar.",
      "Estimar impuesto de timbre antes de subasta.",
      "Comprobar si aplica LMI.",
      "Elegir entre semanal/quincenal/mensual.",
      "Planificar refinanciamiento.",
    ],
    suggestionsTitle: "También te puede interesar",
    suggestions: ["Calculadora de préstamos", "Conversor de divisas", "Calculadora de porcentajes"],
    articleTitle: "Hipotecas en Australia: depósito, LMI, impuesto de timbre y costo real",
    articleIntro: "Comprar una casa en Australia no es solo la cuota del préstamo. El presupuesto real incluye impuesto de timbre (impuesto estatal sobre la compra), seguro hipotecario LMI si tu depósito es menor al 20%, honorarios legales, inspecciones de construcción y plagas, y tasas de registro. Esta calculadora estima todos los gastos importantes para que sepas cuánto necesitas realmente en el banco antes del día de liquidación.",
    sectionDepositTitle: "La regla del 20% de depósito",
    sectionDepositBody: "Los bancos australianos consideran el 20% como el umbral \"seguro\". Por encima del 80% de LVR (relación préstamo-valor), los bancos te exigen pagar LMI — un seguro que protege al banco si no pagas. El LMI puede costar fácilmente $10,000–$30,000 en una hipoteca típica, y normalmente se añade al saldo del préstamo (pagas intereses sobre él durante 30 años). El dinero más caro que jamás pedirás prestado.",
    sectionStampTitle: "El impuesto de timbre varía enormemente por estado",
    sectionStampBody: "",
    sectionStampItems: [
      "NSW y VIC tienen las tasas base más altas, típicamente 4–6% del valor de la propiedad.",
      "Las exenciones para compradores de primera vivienda pueden reducir el impuesto a cero para propiedades bajo ciertos umbrales (p.ej. $800,000 en NSW, $600,000 en VIC, $700,000 en QLD).",
      "ACT cobra impuesto territorial además del impuesto de timbre.",
      "Los recargos para compradores extranjeros añaden un 7–8% en la mayoría de los estados.",
    ],
    sectionStampNote: "Esta calculadora usa tasas simplificadas; para una cifra vinculante, usa la calculadora de la oficina de impuestos de tu estado o consulta a un abogado.",
    sectionFreqTitle: "Semanal vs quincenal vs mensual",
    sectionFreqBody: "Si tu banco te permite pagar semanal o quincenalmente sin cambiar el monto total anual, acéptalo. Hay 26 quincenas y 12 meses en un año — si el banco trata un pago quincenal como \"la mitad del pago mensual,\" terminas pagando el equivalente a 13 pagos mensuales al año en lugar de 12. Es un pago extra gratuito, y en un préstamo de $640,000 al 6.5% puede reducir más de 5 años de una hipoteca de 30 años.",
    sectionRateTitle: "El costo real de una diferencia de 0.5% en la tasa",
    sectionRateBody: "En un préstamo de $640,000 a 30 años, 6.0% vs 6.5%:",
    sectionRateItems: [
      "Al 6.0%: ~$3,836/mes, ~$741,000 interés total",
      "Al 6.5%: ~$4,045/mes, ~$816,000 interés total",
    ],
    sectionRateCoda: "Medio punto porcentual cuesta $75,000 durante la vida del préstamo. Por eso existen los brókers hipotecarios y el refinanciamiento.",
    sectionNotInclTitle: "Lo que esta calculadora no incluye",
    sectionNotInclItems: [
      "Impuestos municipales (~$1,500–$3,000/año)",
      "Cuotas de comunidad si compras un apartamento ($2,000–$10,000+/año)",
      "Seguro de edificio ($800–$2,500/año)",
      "Seguro de hogar y contenido",
      "Derramas extraordinarias de la comunidad",
    ],
    faqTitle: "Preguntas frecuentes",
    faqItems: [
      { q: "¿Vale la pena el LMI?", a: "A veces. Si los precios de la vivienda suben más rápido que tu capacidad de ahorrar el 20%, pagar LMI para comprar ahora puede ser más barato que esperar. Haz números comparando alquiler vs préstamo con LMI a 5 años." },
      { q: "¿Puedo evitar el LMI sin tener el 20%?", a: "Sí, si eres de ciertas profesiones (médicos, abogados, contables) algunos bancos renuncian al LMI. El plan First Home Guarantee también permite a compradores elegibles comprar con 5% de depósito sin LMI." },
      { q: "¿Diferencia entre principal+intereses vs solo intereses?", a: "P&I significa que cada pago reduce el préstamo. Solo intereses significa que solo pagas el cargo por intereses — el préstamo nunca se reduce. La mayoría de préstamos para vivienda habitual deberían ser P&I; solo intereses lo usan inversores como herramienta fiscal." },
      { q: "¿Qué tan precisa es la estimación del impuesto de timbre?", a: "Dentro del 5–10% para compras estándar. Para cifras exactas, usa la calculadora en la web de la oficina de impuestos de tu estado (revenue.nsw.gov.au, sro.vic.gov.au, etc)." },
      { q: "¿Debo obtener preaprobación antes de pujar en subasta?", a: "Sí, siempre. Los contratos de subasta en Australia son incondicionales — si no consigues el préstamo, pierdes tu depósito." },
    ],
  },
};

const STATES = [
  { code: "NSW", name: "NSW" },
  { code: "VIC", name: "VIC" },
  { code: "QLD", name: "QLD" },
  { code: "WA", name: "WA" },
  { code: "SA", name: "SA" },
  { code: "TAS", name: "TAS" },
  { code: "ACT", name: "ACT" },
  { code: "NT", name: "NT" },
];

function calcStampDuty(state: string, price: number, firstHome: boolean): number {
  if (firstHome) {
    if (state === "NSW" && price <= 800000) return 0;
    if (state === "VIC" && price <= 600000) return 0;
    if (state === "QLD" && price <= 700000) return 0;
    if (state === "WA" && price <= 450000) return 0;
    if (state === "SA" && price <= 650000) return 0;
    if (state === "TAS" && price <= 600000) return 0;
    if (state === "ACT") return Math.max(0, price * 0.025);
    if (state === "NT" && price <= 650000) return 0;
  }
  const rates: Record<string, number> = {
    NSW: 0.045, VIC: 0.055, QLD: 0.0475, WA: 0.05, SA: 0.05, TAS: 0.045, ACT: 0.05, NT: 0.05,
  };
  const rate = rates[state] || 0.05;
  let duty = price * rate;
  if (price > 1000000) duty += price * 0.005;
  return Math.round(duty);
}

function calcLMI(loan: number, lvr: number): number {
  if (lvr <= 0.8) return 0;
  if (lvr <= 0.85) return loan * 0.012;
  if (lvr <= 0.9) return loan * 0.02;
  if (lvr <= 0.95) return loan * 0.035;
  return loan * 0.045;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/mortgage-calculator-australia";

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

const TOOLS = [
  { title: { en: "Invoice Due Date Calculator", "zh-hk": "發票到期日計算機", "zh-cn": "发票到期日计算器", es: "Calculadora de fecha de vencimiento" }, description: { en: "Find invoice due dates.", "zh-hk": "計算發票到期日。", "zh-cn": "计算发票到期日。", es: "Busca fechas de vencimiento." }, href: "/invoice-due-date-calculator", keywords: ["invoice", "payment"] },
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算機", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Monthly payments and amortization.", "zh-hk": "每月還款同攤銷表。", "zh-cn": "每月还款和摊销表。", es: "Cuota mensual y amortización." }, href: "/loan-calculator", keywords: ["loan", "amortize"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "計算一個數嘅百分比。", "zh-cn": "计算一个数的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent"] },
  { title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies.", "zh-hk": "轉換 30 種以上貨幣。", "zh-cn": "转换 30 种以上货币。", es: "Convierte 30+ monedas." }, href: "/currency-converter", keywords: ["currency"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "統計字數同字元。", "zh-cn": "统计字数和字符。", es: "Cuenta palabras y caracteres." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age.", "zh-hk": "計算準確年齡。", "zh-cn": "计算准确年龄。", es: "Calcula la edad exacta." }, href: "/age-calculator", keywords: ["age"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "加工作日至任何日期。", "zh-cn": "加工作日到任何日期。", es: "Agrega días hábiles." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Dog Age Calculator", "zh-hk": "狗狗年齡換算（人類年齡）", "zh-cn": "狗狗年龄换算（人类年龄）", es: "Calculadora de edad de perro en años humanos" }, description: { en: "Convert dog age to human years.", "zh-hk": "將狗狗年齡換算為人類年齡。", "zh-cn": "将狗狗年龄换算为人类年龄。", es: "Convierte edad de perro a años humanos." }, href: "/dog-age-calculator", keywords: ["dog", "age"] },
];

export default function MortgageCalculatorAustralia() {
  const [locale, setLocale] = useState<LocaleKey>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as LocaleKey) || "en"));
  const [price, setPrice] = useState("800000");
  const [deposit, setDeposit] = useState("160000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [state, setState] = useState("NSW");
  const [freq, setFreq] = useState<"weekly" | "fortnightly" | "monthly">("monthly");
  const [firstHome, setFirstHome] = useState(false);
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
        { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: L.faqItems.map((item: {q: string; a: string}) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      ],
    });
  }, [locale]);

  const result = useMemo(() => {
    const p = parseFloat(price), d = parseFloat(deposit), r = parseFloat(rate), t = parseFloat(term);
    if (!p || isNaN(d) || isNaN(r) || !t) return null;
    const loan = Math.max(0, p - d);
    const lvr = p > 0 ? loan / p : 0;
    const periodsPerYear = freq === "weekly" ? 52 : freq === "fortnightly" ? 26 : 12;
    const totalPeriods = t * periodsPerYear;
    const periodRate = r / 100 / periodsPerYear;
    let payment = 0;
    if (periodRate === 0) {
      payment = loan / totalPeriods;
    } else {
      payment = loan * (periodRate * Math.pow(1 + periodRate, totalPeriods)) / (Math.pow(1 + periodRate, totalPeriods) - 1);
    }
    const totalPaid = payment * totalPeriods;
    const totalInterest = totalPaid - loan;
    const stampDuty = calcStampDuty(state, p, firstHome);
    const lmi = calcLMI(loan, lvr);
    const upfront = stampDuty + lmi + d + 2500;
    return { loan, lvr, payment, totalPaid, totalInterest, stampDuty, lmi, upfront };
  }, [price, deposit, rate, term, state, freq, firstHome]);

  const content = LANGUAGES[locale];
  const fmt = (n: number) => "A$" + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><Home className="h-5 w-5 text-emerald-300" /></div>
            <div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div>
          </div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">

              <div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.homePrice}</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.deposit}</span><input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.rate}</span><input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.term}</span><input type="number" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.state}</span>
                  <select value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.frequency}</span>
                  <select value={freq} onChange={(e) => setFreq(e.target.value as any)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    <option value="weekly">{content.weekly}</option>
                    <option value="fortnightly">{content.fortnightly}</option>
                    <option value="monthly">{content.monthly}</option>
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm text-neutral-300">
                <input type="checkbox" checked={firstHome} onChange={(e) => setFirstHome(e.target.checked)} />
                <span>{content.fhBuyer}</span>
              </label>

              {result && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{content.repayment}</p>
                    <p className="mt-2 text-4xl font-bold text-white">{fmt(result.payment)}<span className="text-base text-white/55"> / {content[freq]}</span></p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.loanAmount}</p><p className="mt-2 text-lg font-semibold text-white">{fmt(result.loan)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.lvr}</p><p className="mt-2 text-lg font-semibold text-white">{(result.lvr * 100).toFixed(1)}%</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.totalInterest}</p><p className="mt-2 text-lg font-semibold text-amber-300">{fmt(result.totalInterest)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.totalPaid}</p><p className="mt-2 text-lg font-semibold text-white">{fmt(result.totalPaid)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.stampDuty}</p><p className="mt-2 text-lg font-semibold text-red-300">{fmt(result.stampDuty)}</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.lmi}</p><p className="mt-2 text-lg font-semibold text-red-300">{fmt(result.lmi)}</p></div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">{content.upfront}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{fmt(result.upfront)}</p>
                    <p className="mt-1 text-xs text-white/55">{content.upfrontDetail}</p>
                  </div>
                </div>
              )}
            </div>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none prose-headings:text-white prose-headings:font-semibold prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white">
              <h2 className="text-2xl">{content.articleTitle}</h2>
              <p>{content.articleIntro}</p>

              <h3>{content.sectionDepositTitle}</h3>
              <p>{content.sectionDepositBody}</p>

              <h3>{content.sectionStampTitle}</h3>
              {content.sectionStampBody && <p>{content.sectionStampBody}</p>}
              <ul>
                {content.sectionStampItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p>{content.sectionStampNote}</p>

              <h3>{content.sectionFreqTitle}</h3>
              <p>{content.sectionFreqBody}</p>

              <h3>{content.sectionRateTitle}</h3>
              <p>{content.sectionRateBody}</p>
              <ul>
                {content.sectionRateItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p>{content.sectionRateCoda}</p>

              <h3>{content.sectionNotInclTitle}</h3>
              <ul>
                {content.sectionNotInclItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>

              <h3>{content.faqTitle}</h3>
              {content.faqItems.map((item, i) => (
                <p key={i}><strong>{item.q}</strong> {item.a}</p>
              ))}
            </article>

            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <label className="block space-y-2"><span className="text-sm font-medium text-white/80">{content.searchLabel}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"><Search className="h-4 w-4 text-emerald-300" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={content.searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" /></div>
              </label>
              <div className="mt-4 grid gap-2">{filteredTools.slice(0, 5).map((t) => <a key={t.href} href={t.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-emerald-300/30 hover:bg-white/10 transition"><div><p className="text-sm font-medium text-white">{t.title[locale]}</p><p className="mt-1 text-xs text-white/55">{t.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></a>)}</div>
            </section>

          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><Home className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2></div></div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                {content.useCases.map((uc) => <p key={uc} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{uc}</p>)}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((t) => t.title[locale] === name);
                  if (!match) return null;
                  return (
                    <a key={name} href={match.href} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </a>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
