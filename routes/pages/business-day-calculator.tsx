import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Calculator, Clock3, Globe2, MapPin, Search } from "lucide-react";
import Holidays from "https://esm.sh/date-holidays@3.28.0?bundle";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";
type Mode = "forward" | "count" | "reverse";

type LanguagePack = {
  name: string;
  title: string;
  subtitle: string;
  modeLabel: string;
  modeForward: string;
  modeCount: string;
  modeReverse: string;
  countryLabel: string;
  regionLabel: string;
  startLabel: string;
  daysLabel: string;
  endLabel: string;
  calculatedLabel: string;
  resultLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  holidaysLabel: string;
  supportLabel: string;
  helperText: string;
  countryHelper: string;
  inputHelp: string;
  bottomNote: string;
  dash: string;
  howItWorks: string;
  howItWorksDesc: string;
  skipWeekends: string;
  useCountryHolidays: string;
  supportRegionalHolidays: string;
  useCases: string;
  useCasesDesc: string;
  shippingDates: string;
  projectDeadlines: string;
  invoiceFollowups: string;
  countrySupport: string;
  countrySupportDesc: string;
  countrySupportNote: string;
  whatIsBizDay: string;
  whatIsBizDayP1: string;
  whatIsBizDayP2: string;
  whatIsBizDayP3: string;
  whyBizDaysMatter: string;
  whyBizDaysMatterP1: string;
  whyBizDaysMatterP2: string;
  courtDeadlines: string;
  locExpiry: string;
  payrollHR: string;
  holidayDiffsTitle: string;
  holidayDiffsP1: string;
  usHolidays: string;
  ukHolidays: string;
  hkHolidays: string;
  cnHolidays: string;
  holidayDiffsNote: string;
  howToAddTitle: string;
  howToAddP1: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  howToAddExample: string;
  commonErrorsTitle: string;
  errSameHolidays: string;
  errBankVsPublic: string;
  errObserved: string;
  errWeekendDef: string;
  errCountingMethod: string;
  faqTitle: string;
  faqSatQ: string;
  faqSatA: string;
  faqWithin3Q: string;
  faqWithin3A: string;
  faqNet30Q: string;
  faqNet30A: string;
  faqHolidaysCountQ: string;
  faqHolidaysCountA: string;
  faqBizVsWorkQ: string;
  faqBizVsWorkA: string;
};

const LANGUAGES: Record<LocaleKey, LanguagePack> = {
  en: {
    name: "English",
    title: "Business Day Calculator",
    subtitle: "Add or subtract working days while skipping weekends and country holidays.",
    modeLabel: "Calculation mode",
    modeForward: "Start date + business days → end date",
    modeCount: "Start date + end date → business days",
    modeReverse: "Business days + end date → start date",
    countryLabel: "Country",
    regionLabel: "State / province / region (optional)",
    startLabel: "Start date",
    daysLabel: "Business days",
    endLabel: "End date",
    calculatedLabel: "Calculated field",
    resultLabel: "Result",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: weight, invoice, word, url",
    searchHint: "Search hints",
    holidaysLabel: "Holiday support",
    supportLabel: "Current rule set",
    helperText: "Fill any two fields. The third one will be calculated automatically.",
    countryHelper: "Holiday rules change by country, and some countries also have regional holidays.",
    inputHelp: "The calculated field is read-only in each mode.",
    bottomNote: "Search is kept at the bottom so the calculator stays clean.",
    dash: "—",
    howItWorks: "How it works",
    howItWorksDesc: "Weekend + holiday aware date math.",
    skipWeekends: "Skip Saturdays and Sundays",
    useCountryHolidays: "Use country holiday rules",
    supportRegionalHolidays: "Support regional holidays when available",
    useCases: "Use cases",
    useCasesDesc: "Deadlines, SLAs, delivery promises.",
    shippingDates: "Shipping promise dates",
    projectDeadlines: "Project deadlines",
    invoiceFollowups: "Invoice follow-ups",
    countrySupport: "Country support",
    countrySupportDesc: "Switch holiday rules by country.",
    countrySupportNote: "This calculator uses country-specific holiday calendars, and the optional region field can refine the result where local rules exist.",
    whatIsBizDay: "What is a Business Day?",
    whatIsBizDayP1: "A business day is any day on which normal commercial or governmental operations take place. In most countries, this means Monday through Friday, excluding officially recognised public holidays. The concept sounds simple, but there is no single universal standard — what counts as a business day in New York may differ substantially from what counts in London, Hong Kong, or São Paulo.",
    whatIsBizDayP2: "Business days are the backbone of countless professional processes. Legal contracts typically specify deadlines in business days because both parties need to be reachable and operational to act. Financial settlements, government processing times, HR payroll cycles, and shipping delivery promises all rely on the concept of a business day to set realistic, enforceable timelines.",
    whatIsBizDayP3: "For multinational organisations, getting business days right is critical. An invoice with \"Net 30 business days\" payment terms means very different things if one party is in the United States and the other is in a country with a 17-day public holiday calendar. Misjudging the calculation can result in late payments, missed court filings, or penalty charges — all because someone forgot to account for a single public holiday.",
    whyBizDaysMatter: "Why Business Days Matter in Finance and Law",
    whyBizDaysMatterP1: "The financial industry built its entire settlement infrastructure around business days. Securities transactions follow T+1, T+2, or T+3 settlement conventions — meaning a trade executed today settles one, two, or three business days later. This gap exists because banks, clearinghouses, and custodians need working time to transfer funds and securities between accounts. If a trade is executed on a Friday, T+2 settlement typically falls on the following Tuesday, not Sunday.",
    whyBizDaysMatterP2: "In commercial law, payment terms like \"Net 30\" and \"Net 60\" are usually expressed in calendar days, but contracts that specify \"30 business days\" are dramatically different. Thirty calendar days is roughly one month, while 30 business days is approximately six weeks excluding weekends — and if public holidays fall within that period, the actual deadline extends further still.",
    courtDeadlines: "Court filing deadlines: Most jurisdictions count business days for procedural deadlines. Missing a deadline by even one day because of an unaccounted bank holiday can result in a case being dismissed or a right being forfeited.",
    locExpiry: "Letter of credit expiry: International trade finance instruments (letters of credit, documentary collections) specify expiry dates in business days. Banks will not honour a presentation made after the expiry, regardless of the reason.",
    payrollHR: "Payroll and HR: Salary payment schedules, notice periods, and probationary periods are often defined in business or working days — making accurate calculation essential for compliance.",
    holidayDiffsTitle: "Public Holiday Differences by Country",
    holidayDiffsP1: "Public holidays vary enormously across countries, which means the number of effective business days in a given month is not the same everywhere. This asymmetry creates real complexity for international businesses.",
    usHolidays: "United States: The federal government observes 11 public holidays per year. However, individual states may observe additional holidays, and private employers are not legally required to give time off for any of them — though most do in practice.",
    ukHolidays: "United Kingdom: England and Wales have 8 bank holidays per year. Scotland has 9 and Northern Ireland has 10, with each nation having slightly different dates. The term \"bank holiday\" is used because banks close on those days, effectively halting financial operations.",
    hkHolidays: "Hong Kong: Hong Kong observes 17 public holidays annually — one of the highest totals in the world. These include Chinese traditional holidays (Lunar New Year, Ching Ming, Dragon Boat, Mid-Autumn), as well as legacy colonial holidays and modern civic ones.",
    cnHolidays: "Mainland China: China has 11 official public holidays. However, the government also mandates \"make-up working days\" — Saturdays that are officially designated as working days to compensate for extended Golden Week holiday periods. This makes Chinese calendar calculations uniquely complex.",
    holidayDiffsNote: "For any organisation with counterparties in multiple countries, it is essential to track the holiday calendar of each jurisdiction separately. A contract deadline that falls on a holiday in one country may not be a holiday in another, potentially creating disputes about when performance was actually due.",
    howToAddTitle: "How to Add Business Days to a Date",
    howToAddP1: "The process of adding business days to a start date is more involved than simply adding calendar days. Here is the step-by-step approach:",
    step1: "Start from the given date. This date itself is typically not counted — you begin counting from the next day forward.",
    step2: "Advance one day at a time. For each day you advance, check whether that day falls on a Saturday or Sunday. If so, skip it and continue.",
    step3: "Check for public holidays. For each weekday you land on, verify whether it is a public holiday in the relevant country and region. If it is, skip that day too.",
    step4: "Count only the days that pass both checks as business days, and stop when you have counted the required number.",
    howToAddExample: "Example: You need to add 10 business days starting from Monday, December 20. Christmas Day falls on Saturday December 25 (observed as Friday December 24 in many countries) and New Year's Day falls on Saturday January 1 (observed as Monday January 3). Counting forward: Dec 21, 22, 23, then skip Dec 24 (Christmas observed), skip Dec 25 (weekend), skip Dec 26 (weekend or Boxing Day), Dec 27, 28, 29, 30, then skip Dec 31, skip Jan 1 (weekend), skip Jan 2 (weekend), skip Jan 3 (New Year observed), Jan 4, 5. Your 10th business day lands on January 5 — not January 3 as a naive calendar-day calculation would suggest.",
    commonErrorsTitle: "Common Business Day Calculation Errors",
    errSameHolidays: "Assuming all countries share the same holidays. Even countries that share a language — such as the United States, the United Kingdom, and Australia — have entirely different public holiday calendars. Never apply one country's holiday list to another.",
    errBankVsPublic: "Confusing bank holidays with public holidays. In the United Kingdom, \"bank holiday\" is the legal term for public holidays. However, in other countries, a bank holiday may refer only to days when financial institutions close — which may not be the same as official government holidays.",
    errObserved: "Forgetting observed holidays. When a public holiday falls on a Saturday, it is typically observed on the preceding Friday. When it falls on a Sunday, it is observed on the following Monday. A calculator that only checks the nominal holiday date will miss these.",
    errWeekendDef: "Wrong weekend definition. Most Western countries treat Saturday and Sunday as the weekend. However, in several Middle Eastern countries (including Saudi Arabia, Iran, and historically Israel), the weekend falls on Friday and Saturday, making Sunday a working day.",
    errCountingMethod: "Not specifying the counting method. Contracts should explicitly state whether the start date is included or excluded in the count. \"Within 3 business days\" is ambiguous: does it mean the third business day after the trigger event, or can the trigger day itself be day one?",
    faqTitle: "Frequently Asked Questions",
    faqSatQ: "Is Saturday a business day?",
    faqSatA: "In most countries and industries, Saturday is not a business day. Standard business days are Monday through Friday. However, some businesses — particularly in retail, hospitality, and certain financial services — operate on Saturdays and may treat them as working days for internal scheduling purposes. For legal and contractual deadlines, Saturday is almost universally excluded unless the contract explicitly states otherwise.",
    faqWithin3Q: "What does \"within 3 business days\" mean on a contract?",
    faqWithin3A: "It means the obligation must be fulfilled by the end of the third business day following the trigger event (such as receiving a notice or placing an order). The trigger day itself is typically not counted. So if you receive a notice on Monday, \"within 3 business days\" means you must respond by the close of business on Thursday — assuming no public holidays fall on Tuesday, Wednesday, or Thursday.",
    faqNet30Q: "How do I calculate Net 30 payment terms?",
    faqNet30A: "Net 30 (without the word \"business\") means the invoice is due 30 calendar days from the invoice date — not 30 business days. Count 30 days straight from the invoice date, regardless of weekends and holidays. If the invoice is dated March 1, payment is due March 31. Net 30 is far more common in commercial invoicing than \"30 business days\" because it is simpler to calculate and creates a fixed cash-flow schedule.",
    faqHolidaysCountQ: "Do public holidays count as business days?",
    faqHolidaysCountA: "No. Public holidays are excluded from business day counts in the same way that weekends are. When you are adding business days to a date, any day that is a public holiday in the relevant jurisdiction is skipped over and does not count toward your total. The key is using the correct holiday calendar for the country (and sometimes the region) where the obligation is to be performed.",
    faqBizVsWorkQ: "What is the difference between business days and working days?",
    faqBizVsWorkA: "In most contexts, business days and working days are used interchangeably — both refer to the days of the week when normal commerce takes place (Monday through Friday, excluding public holidays). However, \"working days\" can sometimes carry a narrower meaning tied to a specific employer's schedule, such as a company that operates Tuesday through Saturday. When used in a legal or contractual context, always clarify the specific definition to avoid ambiguity.",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "工作日計算機",
    subtitle: "計工作日時會自動略過週末同國家假期。",
    modeLabel: "計算模式",
    modeForward: "開始日期 + 工作日 → 結束日期",
    modeCount: "開始日期 + 結束日期 → 工作日",
    modeReverse: "工作日 + 結束日期 → 開始日期",
    countryLabel: "國家",
    regionLabel: "州 / 省 / 地區（可選）",
    startLabel: "開始日期",
    daysLabel: "工作日",
    endLabel: "結束日期",
    calculatedLabel: "自動計算欄位",
    resultLabel: "結果",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：體積重量、發票、字數、URL",
    searchHint: "搜尋提示",
    holidaysLabel: "假期支援",
    supportLabel: "現時規則",
    helperText: "輸入三欄之中的任兩欄，第三欄會自動計算。",
    countryHelper: "唔同國家假期唔同，有啲國家仲有地區假期。",
    inputHelp: "每個模式入面，自動計算嗰欄會變成只讀。",
    bottomNote: "搜尋欄放喺底部，版面會乾淨啲。",
    dash: "—",
    howItWorks: "點樣運作",
    howItWorksDesc: "自動略過週末同假期嘅日期計算。",
    skipWeekends: "略過星期六同星期日",
    useCountryHolidays: "使用國家假期規則",
    supportRegionalHolidays: "支援地區假期（如有）",
    useCases: "使用場景",
    useCasesDesc: "期限、SLA、交付承諾。",
    shippingDates: "送貨承諾日期",
    projectDeadlines: "項目期限",
    invoiceFollowups: "發票跟進",
    countrySupport: "國家支援",
    countrySupportDesc: "切換國家假期規則。",
    countrySupportNote: "呢個計算機使用國家特定嘅假期日曆，可選嘅地區欄位可以喺有地方規則時精確結果。",
    whatIsBizDay: "咩係工作日？",
    whatIsBizDayP1: "工作日係指正常商業或政府運作嘅日子。喺大部分國家，即係星期一至星期五，唔包括官方認可嘅公眾假期。呢個概念聽起嚟好簡單，但係冇一個單一嘅國際標準 — 紐約嘅工作日定義可以同倫敦、香港或者聖保羅好唔同。",
    whatIsBizDayP2: "工作日係無數專業流程嘅骨幹。法律合約通常用工作日嚟訂截止日期，因為雙方都要可以聯絡同運作先去行動。金融結算、政府處理時間、HR 薪酬週期同送貨承諾都依賴工作日嘅概念去訂立合理、可執行嘅時間表。",
    whatIsBizDayP3: "對於跨國機構，準確計算工作日好緊要。一張「30 個工作日淨額」嘅發票條款，如果一方喺美國而另一方喺一個有 17 天公眾假期嘅國家，意思可以好唔同。計錯數可以導致遲付款、錯過法庭期限或者罰款 — 全部都係因為有人忘記計一個公眾假期。",
    whyBizDaysMatter: "點解工作日喺金融同法律咁重要",
    whyBizDaysMatterP1: "金融業成個結算架構都係圍繞工作日建立嘅。證券交易跟 T+1、T+2 或者 T+3 結算慣例 — 即係今日做嘅交易會喺一、二或者三個工作日後結算。呢個差距係因為銀行、結算所同託管機構需要工作時間去轉移資金同證券。如果交易係星期五做，T+2 結算通常係下星期二，唔係星期日。",
    whyBizDaysMatterP2: "喺商業法入面，「Net 30」同「Net 60」通常係用曆日計算，但合約如果寫「30 個工作日」就差好遠。三十個曆日大約係一個月，而 30 個工作日係大約六個星期唔計週末 — 如果期間有公眾假期，實際截止日期會再向後延。",
    courtDeadlines: "法庭提交期限：大部分司法管轄區嘅程序期限都係計工作日。因為漏計銀行假期而遲咗一日，可以導致案件被駁回或者喪失權利。",
    locExpiry: "信用證到期：國際貿易金融工具（信用證、跟單託收）用工作日嚟指定到期日。銀行唔會接受過期嘅交單，唔論咩原因。",
    payrollHR: "薪酬同 HR：薪金支付通知期、通知期同試用期通常都用工作日或者工作天嚟定義 — 所以準確計算對合規好重要。",
    holidayDiffsTitle: "各國公眾假期差異",
    holidayDiffsP1: "公眾假期喺唔同國家差異好大，即係話每個月嘅有效工作日數目每個地方都唔一樣。呢種不對稱為國際企業帶嚟真正嘅複雜性。",
    usHolidays: "美國：聯邦政府每年有 11 個公眾假期。但係各州可能會有額外假期，私營僱主冇法律責任要放任何一個 — 雖然大部分都會放。",
    ukHolidays: "英國：英格蘭同威爾斯每年有 8 個銀行假期。蘇格蘭有 9 個，北愛爾蘭有 10 個，每個地區嘅日期都略有唔同。「銀行假期」呢個詞係因為銀行嗰日休息，變相停止咗金融運作。",
    hkHolidays: "香港：香港每年有 17 個公眾假期 — 係世界上最多嘅地區之一。包括中國傳統節日（農曆新年、清明、端午、中秋），以及殖民地時代留低嘅假期同現代公民節日。",
    cnHolidays: "中國大陸：中國有 11 個官方公眾假期。但係政府仲會規定「補班日」— 即係星期六要正式上班，去補償黃金周期間嘅長假期。呢個令中國嘅日曆計算特別複雜。",
    holidayDiffsNote: "對於喺多個國家有交易對手嘅機構，必須分開追蹤每個司法管轄區嘅假期日曆。一份合約嘅截止日期喺一個國家係假期，但喺另一個國家可能唔係，咁可能會引起關於履行期限嘅爭議。",
    howToAddTitle: "點樣將工作日加到日期",
    howToAddP1: "將工作日加到開始日期比簡單加曆日複雜。以下係逐步做法：",
    step1: "由指定日期開始。呢個日期本身通常唔計 — 你由下一日開始計。",
    step2: "逐日推進。每日推進嗰陣，檢查嗰日係唔係星期六或者星期日。係嘅話就跳過，繼續推進。",
    step3: "檢查公眾假期。每個工作日，驗證嗰日係唔係相關國家同地區嘅公眾假期。係嘅話都跳過。",
    step4: "只有通過兩個檢查嘅日子先計做工作日，數夠所需數目就停。",
    howToAddExample: "例子：你需要由 12 月 20 日（星期一）開始加 10 個工作日。聖誕節係 12 月 25 日（星期六）（好多國家會喺 12 月 24 日星期五補假），元旦係 1 月 1 日（星期六）（補假到 1 月 3 日星期一）。逐日數：12 月 21、22、23，跳過 24 號（聖誕補假），跳過 25 號（週末），跳過 26 號（週末或拆禮物日），12 月 27、28、29、30，跳過 31 號，跳過 1 月 1 號（週末），跳過 2 號（週末），跳過 3 號（元旦補假），1 月 4、5。第 10 個工作日係 1 月 5 號 — 唔係好似簡單曆日計算咁嘅 1 月 3 號。",
    commonErrorsTitle: "常見工作日計算錯誤",
    errSameHolidays: "假設所有國家有相同假期。就算係用同一種語言嘅國家 — 例如美國、英國同澳洲 — 公眾假期日曆都完全不同。唔好將一個國家嘅假期名單套用到另一個國家。",
    errBankVsPublic: "混淆銀行假期同公眾假期。喺英國，「bank holiday」係公眾假期嘅法律用語。但係喺其他國家，銀行假期可能只係指金融機構休息嘅日子 — 未必同官方政府假期一樣。",
    errObserved: "忘記補假。當公眾假期跌喺星期六，通常會喺前一個星期五補假。跌喺星期日就喺下個星期一補假。一個只係檢查名義假期日期嘅計算機呢啲補假。",
    errWeekendDef: "錯誤嘅週末定義。大部分西方國家將星期六同星期日當做週末。但係喺幾個中東國家（包括沙特阿拉伯、伊朗同歷史上嘅以色列），週末係星期五同星期六，令星期日變成工作日。",
    errCountingMethod: "冇指定計算方法。合約應該明確說明開始日期包唔包喺計算入面。「3 個工作日內」有歧義：係觸發事件之後嘅第三個工作日，定係觸發日本身可以做第一日？",
    faqTitle: "常見問題",
    faqSatQ: "星期六係唔係工作日？",
    faqSatA: "喺大部分國家同行業，星期六唔係工作日。標準工作日係星期一至星期五。但係有啲行業 — 特別係零售、餐飲同某啲金融服務 — 星期六都有營業，可能會當做內部排程嘅工作天。對於法律同合約期限，星期六幾乎一定唔包，除非合約另有規定。",
    faqWithin3Q: "合約入面「3 個工作日內」係咩意思？",
    faqWithin3A: "即係指責任必須喺觸發事件（例如收到通知或者落訂單）之後嘅第三個工作日結束前履行。觸發日本身通常唔計。所以如果你星期一收到通知，「3 個工作日內」即係你必須喺星期四收市前回覆 — 假設星期二、三、四都冇公眾假期。",
    faqNet30Q: "點樣計算 Net 30 付款條款？",
    faqNet30A: "Net 30（冇「business」呢個詞）係指發票日期起計 30 個曆日 — 唔係 30 個工作日。由發票日期開始直接數 30 日，唔理週末同假期。如果發票日期係 3 月 1 號，付款到期日就係 3 月 31 號。Net 30 喺商業入面比「30 個工作日」常見好多，因為佢更易計同有固定嘅現金流時間表。",
    faqHolidaysCountQ: "公眾假期算唔算工作日？",
    faqHolidaysCountA: "唔算。公眾假期同週末一樣，都係喺工作日計算入面排除嘅。當你將工作日加到一個日期嗰陣，任何喺相關司法管轄區係公眾假期嘅日子都會跳過，唔會計入總數。關鍵係用正確嘅國家（同有時地區）假期日曆。",
    faqBizVsWorkQ: "工作日同工作天有咩分別？",
    faqBizVsWorkA: "喺大部分情況，工作日同工作天可以互換使用 — 兩者都指正常商業運作嘅日子（星期一至星期五，唔包括公眾假期）。但係「工作天」有時可以有更窄嘅意思，係指特定僱主嘅作息安排，例如一間星期二至星期六營業嘅公司。當用喺法律或者合約情況，一定要澄清具體定義去避免歧義。",
  },
  "zh-cn": {
    name: "简体中文",
    title: "工作日计算器",
    subtitle: "计算工作日时会自动跳过周末和国家假期。",
    modeLabel: "计算模式",
    modeForward: "开始日期 + 工作日 → 结束日期",
    modeCount: "开始日期 + 结束日期 → 工作日",
    modeReverse: "工作日 + 结束日期 → 开始日期",
    countryLabel: "国家",
    regionLabel: "州 / 省 / 地区（可选）",
    startLabel: "开始日期",
    daysLabel: "工作日",
    endLabel: "结束日期",
    calculatedLabel: "自动计算字段",
    resultLabel: "结果",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：体积重量、发票、字数、URL",
    searchHint: "搜索提示",
    holidaysLabel: "假期支持",
    supportLabel: "当前规则",
    helperText: "填入三项中的任意两项，第三项会自动计算。",
    countryHelper: "不同国家的假期不同，有些国家还有地区假期。",
    inputHelp: "每种模式中，自动计算的字段会变成只读。",
    bottomNote: "把搜索框放到底部，页面会更干净。",
    dash: "—",
    howItWorks: "如何运作",
    howItWorksDesc: "自动跳过周末和假期的日期计算。",
    skipWeekends: "跳过星期六和星期日",
    useCountryHolidays: "使用国家假期规则",
    supportRegionalHolidays: "支持地区假期（如有）",
    useCases: "使用场景",
    useCasesDesc: "截止日期、SLA、交付承诺。",
    shippingDates: "送货承诺日期",
    projectDeadlines: "项目截止日期",
    invoiceFollowups: "发票跟进",
    countrySupport: "国家支持",
    countrySupportDesc: "切换国家假期规则。",
    countrySupportNote: "本计算器使用国家特定的假期日历，可选的地区字段可以在有地方规则时精确结果。",
    whatIsBizDay: "什么是工作日？",
    whatIsBizDayP1: "工作日是指正常商业或政府运作的日子。在大多数国家，即星期一至星期五，不包括官方认可的公众假期。这个概念听起来很简单，但并没有单一的国际标准 — 纽约的工作日定义可能与伦敦、香港或圣保罗大不相同。",
    whatIsBizDayP2: "工作日是无数专业流程的骨干。法律合同通常用工作日来指定截止日期，因为双方都需要可以联系和运作才能行动。金融结算、政府处理时间、HR 薪酬周期和送货承诺都依赖工作日的概念来制定合理、可执行的时间表。",
    whatIsBizDayP3: "对于跨国机构，准确计算工作日至关重要。一张「30 个工作日净额」的发票条款，如果一方在美国而另一方在一个有 17 天公众假期的国家，含义可能大不相同。算错数可能导致逾期付款、错过法庭期限或罚款 — 全都因为有人忘记计算一个公众假期。",
    whyBizDaysMatter: "为什么工作日在金融和法律中很重要",
    whyBizDaysMatterP1: "金融业整个结算架构都是围绕工作日建立的。证券交易遵循 T+1、T+2 或 T+3 结算惯例 — 即今天执行的交易会在一、二或三个工作日后结算。这个间隔是因为银行、结算所和托管机构需要工作时间来转移资金和证券。如果交易在星期五执行，T+2 结算通常是下星期二，而不是星期日。",
    whyBizDaysMatterP2: "在商业法中，「Net 30」和「Net 60」通常用日历日计算，但合同如果指定「30 个工作日」就大不相同。三十个日历日大约是一个月，而 30 个工作日大约是六个星期不包括周末 — 如果期间有公众假期，实际截止日期还会更晚。",
    courtDeadlines: "法庭提交期限：大多数司法管辖区的程序期限都算工作日。因为漏算银行假期而晚了一天，可能导致案件被驳回或丧失权利。",
    locExpiry: "信用证到期：国际贸易金融工具（信用证、跟单托收）用工作日指定到期日。银行不会接受过期的交单，不论什么原因。",
    payrollHR: "薪酬和 HR：工资支付时间表、通知期和试用期通常都用工作日或工作天来定义 — 所以准确计算对合规至关重要。",
    holidayDiffsTitle: "各国公众假期差异",
    holidayDiffsP1: "公众假期在不同国家差异很大，这意味着每个月的有效工作日数目每个地方都不一样。这种不对称为国际企业带来了真正的复杂性。",
    usHolidays: "美国：联邦政府每年有 11 个公众假期。但各州可能有额外假期，私营雇主并没有法律义务放任何一天 — 虽然大多数都会放。",
    ukHolidays: "英国：英格兰和威尔士每年有 8 个银行假期。苏格兰有 9 个，北爱尔兰有 10 个，每个地区的日期略有不同。「银行假期」这个词是因为银行那天休息，实际上停止了金融运作。",
    hkHolidays: "香港：香港每年有 17 个公众假期 — 是世界上最多的地区之一。包括中国传统节日（农历新年、清明、端午、中秋），以及殖民地时代遗留的假期和现代公民节日。",
    cnHolidays: "中国大陆：中国有 11 个官方公众假期。但政府还会规定「补班日」— 即星期六要正式上班，来补偿黄金周期间的长假。这使得中国的日历计算特别复杂。",
    holidayDiffsNote: "对于在多个国家有交易对手的机构，必须分别追踪每个司法管辖区的假期日历。一份合同在一个国家是假期，但在另一个国家可能不是，这可能引起关于履行期限的争议。",
    howToAddTitle: "如何将工作日加到日期",
    howToAddP1: "将工作日加到开始日期比简单加日历日复杂。以下是逐步做法：",
    step1: "从指定日期开始。这个日期本身通常不计算 — 你从下一天开始计。",
    step2: "逐日推进。每日推进时，检查那天是不是星期六或星期日。是的话就跳过，继续推进。",
    step3: "检查公众假期。每个工作日，验证那天是不是相关国家和地区的公众假期。是的话也跳过。",
    step4: "只有通过两个检查的日子才算工作日，数够所需数目就停。",
    howToAddExample: "例子：你需要从 12 月 20 日（星期一）开始加 10 个工作日。圣诞节是 12 月 25 日（星期六）（很多国家会在 12 月 24 日星期五补假），元旦是 1 月 1 日（星期六）（补假到 1 月 3 日星期一）。逐日数：12 月 21、22、23，跳过 24 号（圣诞补假），跳过 25 号（周末），跳过 26 号（周末或节礼日），12 月 27、28、29、30，跳过 31 号，跳过 1 月 1 号（周末），跳过 2 号（周末），跳过 3 号（元旦补假），1 月 4、5。第 10 个工作日是 1 月 5 号 — 不是像简单日历日计算的 1 月 3 号。",
    commonErrorsTitle: "常见工作日计算错误",
    errSameHolidays: "假设所有国家有相同假期。即使是用同一种语言的国家 — 例如美国、英国和澳大利亚 — 公众假期日历都完全不同。不要将一个国家的假期名单套用到另一个国家。",
    errBankVsPublic: "混淆银行假期和公众假期。在英国，「bank holiday」是公众假期的法律用语。但在其他国家，银行假期可能只是指金融机构休息的日子 — 未必同官方政府假期一样。",
    errObserved: "忘记补假。当公众假期落在星期六，通常会在前一个星期五补假。落在星期日就在下个星期一补假。一个只检查名义假期日期的计算器会漏掉这些补假。",
    errWeekendDef: "错误的周末定义。大多数西方国家将星期六和星期日当作周末。但在几个中东国家（包括沙特阿拉伯、伊朗和历史上的以色列），周末是星期五和星期六，使得星期日变成工作日。",
    errCountingMethod: "没有指定计算方法。合同应该明确说明开始日期包不包括在计算内。「3 个工作日内」有歧义：是触发事件之后的第三个工作日，还是触发日本身可以做第一天？",
    faqTitle: "常见问题",
    faqSatQ: "星期六是不是工作日？",
    faqSatA: "在大多数国家和行业，星期六不是工作日。标准工作日是星期一至星期五。但有些行业 — 特别是零售、餐饮和某些金融服务 — 星期六也营业，可能会当作内部排程的工作天。对于法律和合约期限，星期六几乎一定不包括，除非合同另有规定。",
    faqWithin3Q: "合同上「3 个工作日内」是什么意思？",
    faqWithin3A: "即指责任必须在触发事件（例如收到通知或下单）之后的第三个工作日结束前履行。触发日本身通常不计算。所以如果你星期一收到通知，「3 个工作日内」即是你必须在星期四收市前回复 — 假设星期二、三、四都没有公众假期。",
    faqNet30Q: "如何计算 Net 30 付款条款？",
    faqNet30A: "Net 30（没有「business」这个词）是指发票日期起计 30 个日历日 — 不是 30 个工作日。从发票日期开始直接数 30 日，不管周末和假期。如果发票日期是 3 月 1 号，付款到期日就是 3 月 31 号。Net 30 在商业发票中比「30 个工作日」常见得多，因为它更容易计算并有固定的现金流时间表。",
    faqHolidaysCountQ: "公众假期算不算工作日？",
    faqHolidaysCountA: "不算。公众假期和周末一样，在工作日计算中都是排除的。当你将工作日加到一个日期时，任何在相关司法管辖区的公众假期都会跳过，不会计入总数。关键是使用正确的国家（和有时地区）假期日历。",
    faqBizVsWorkQ: "工作日和工作天有什么区别？",
    faqBizVsWorkA: "在大多数情况下，工作日和工作天可以互换使用 — 两者都指正常商业运作的日子（星期一至星期五，不包括公众假期）。但「工作天」有时可以有更窄的意思，指特定雇主的作息安排，例如一间星期二至星期六营业的公司。当用在法律或合同情况，一定要澄清具体定义以避免歧义。",
  },
  es: {
    name: "Español",
    title: "Calculadora de días hábiles",
    subtitle: "Suma o resta días laborables, omitiendo fines de semana y festivos del país.",
    modeLabel: "Modo de cálculo",
    modeForward: "Fecha de inicio + días hábiles → fecha final",
    modeCount: "Fecha de inicio + fecha final → días hábiles",
    modeReverse: "Días hábiles + fecha final → fecha de inicio",
    countryLabel: "País",
    regionLabel: "Estado / provincia / región (opcional)",
    startLabel: "Fecha de inicio",
    daysLabel: "Días hábiles",
    endLabel: "Fecha final",
    calculatedLabel: "Campo calculado",
    resultLabel: "Resultado",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: weight, invoice, word, url",
    searchHint: "Sugerencias de búsqueda",
    holidaysLabel: "Soporte de festivos",
    supportLabel: "Regla actual",
    helperText: "Completa dos de los tres campos. El tercero se calcula automáticamente.",
    countryHelper: "Los festivos cambian según el país, y algunos países también tienen festivos regionales.",
    inputHelp: "En cada modo, el campo calculado queda solo lectura.",
    bottomNote: "La búsqueda está al final para mantener limpia la calculadora.",
    dash: "—",
    howItWorks: "Cómo funciona",
    howItWorksDesc: "Cálculo de fechas que omite fines de semana y festivos.",
    skipWeekends: "Omitir sábados y domingos",
    useCountryHolidays: "Usar reglas de festivos del país",
    supportRegionalHolidays: "Soporte de festivos regionales cuando estén disponibles",
    useCases: "Casos de uso",
    useCasesDesc: "Plazos, SLA, compromisos de entrega.",
    shippingDates: "Fechas de entrega prometidas",
    projectDeadlines: "Plazos de proyectos",
    invoiceFollowups: "Seguimiento de facturas",
    countrySupport: "Soporte por país",
    countrySupportDesc: "Cambiar las reglas de festivos por país.",
    countrySupportNote: "Esta calculadora usa calendarios de festivos específicos por país, y el campo opcional de región puede refinar el resultado donde existan reglas locales.",
    whatIsBizDay: "¿Qué es un día hábil?",
    whatIsBizDayP1: "Un día hábil es cualquier día en el que tienen lugar operaciones comerciales o gubernamentales normales. En la mayoría de los países, esto significa de lunes a viernes, excluyendo los días festivos oficialmente reconocidos. El concepto suena simple, pero no existe un estándar universal único — lo que cuenta como día hábil en Nueva York puede diferir sustancialmente de lo que cuenta en Londres, Hong Kong o São Paulo.",
    whatIsBizDayP2: "Los días hábiles son la columna vertebral de innumerables procesos profesionales. Los contratos legales suelen especificar plazos en días hábiles porque ambas partes deben estar disponibles y operativas para actuar. Las liquidaciones financieras, los tiempos de procesamiento gubernamental, los ciclos de nómina de RRHH y las promesas de entrega de envíos dependen del concepto de día hábil para establecer plazos realistas y exigibles.",
    whatIsBizDayP3: "Para las organizaciones multinacionales, acertar con los días hábiles es fundamental. Una factura con condiciones de pago de \"30 días hábiles netos\" significa cosas muy diferentes si una parte está en Estados Unidos y la otra en un país con un calendario de 17 días festivos. Calcular mal puede resultar en pagos atrasados, plazos judiciales incumplidos o cargos por penalización — todo porque alguien olvidó tener en cuenta un solo día festivo.",
    whyBizDaysMatter: "Por qué los días hábiles importan en finanzas y derecho",
    whyBizDaysMatterP1: "La industria financiera construyó toda su infraestructura de liquidación alrededor de los días hábiles. Las transacciones de valores siguen convenciones de liquidación T+1, T+2 o T+3 — lo que significa que una operación ejecutada hoy se liquida uno, dos o tres días hábiles después. Esta brecha existe porque los bancos, cámaras de compensación y custodios necesitan tiempo laboral para transferir fondos y valores entre cuentas. Si una operación se ejecuta un viernes, la liquidación T+2 generalmente cae el martes siguiente, no el domingo.",
    whyBizDaysMatterP2: "En derecho comercial, las condiciones de pago como \"Neto 30\" y \"Neto 60\" suelen expresarse en días naturales, pero los contratos que especifican \"30 días hábiles\" son drásticamente diferentes. Treinta días naturales son aproximadamente un mes, mientras que 30 días hábiles son aproximadamente seis semanas excluyendo fines de semana — y si los días festivos caen dentro de ese período, el plazo real se extiende aún más.",
    courtDeadlines: "Plazos de presentación judicial: La mayoría de las jurisdicciones cuentan días hábiles para los plazos procesales. Incumplir un plazo por un solo día debido a un festivo no contabilizado puede resultar en que un caso sea desestimado o se pierda un derecho.",
    locExpiry: "Vencimiento de cartas de crédito: Los instrumentos de financiación del comercio internacional (cartas de crédito, cobros documentarios) especifican fechas de vencimiento en días hábiles. Los bancos no honrarán una presentación realizada después del vencimiento, independientemente de la razón.",
    payrollHR: "Nómina y RRHH: Los calendarios de pago de salarios, los períodos de preaviso y los períodos de prueba a menudo se definen en días hábiles o laborables — haciendo que el cálculo preciso sea esencial para el cumplimiento.",
    holidayDiffsTitle: "Diferencias de días festivos por país",
    holidayDiffsP1: "Los días festivos varían enormemente entre países, lo que significa que el número de días hábiles efectivos en un mes dado no es el mismo en todas partes. Esta asimetría crea una complejidad real para las empresas internacionales.",
    usHolidays: "Estados Unidos: El gobierno federal observa 11 días festivos al año. Sin embargo, los estados individuales pueden observar días festivos adicionales, y los empleadores privados no están legalmente obligados a dar tiempo libre para ninguno de ellos — aunque la mayoría lo hace en la práctica.",
    ukHolidays: "Reino Unido: Inglaterra y Gales tienen 8 festivos bancarios al año. Escocia tiene 9 e Irlanda del Norte tiene 10, con cada nación teniendo fechas ligeramente diferentes. El término \"festivo bancario\" se usa porque los bancos cierran esos días, deteniendo efectivamente las operaciones financieras.",
    hkHolidays: "Hong Kong: Hong Kong observa 17 días festivos al año — uno de los totales más altos del mundo. Estos incluyen festivos tradicionales chinos (Año Nuevo Lunar, Ching Ming, Bote del Dragón, Medio Otoño), así como festivos heredados de la era colonial y cívicos modernos.",
    cnHolidays: "China continental: China tiene 11 días festivos oficiales. Sin embargo, el gobierno también ordena \"días laborables de compensación\" — sábados que se designan oficialmente como días laborables para compensar los períodos de vacaciones extendidas de la Semana Dorada. Esto hace que los cálculos del calendario chino sean particularmente complejos.",
    holidayDiffsNote: "Para cualquier organización con contrapartes en múltiples países, es esencial rastrear el calendario de festivos de cada jurisdicción por separado. Un plazo contractual que cae en festivo en un país puede no ser festivo en otro, lo que potencialmente puede crear disputas sobre cuándo venció realmente la obligación.",
    howToAddTitle: "Cómo sumar días hábiles a una fecha",
    howToAddP1: "El proceso de sumar días hábiles a una fecha de inicio es más complejo que simplemente sumar días naturales. Aquí está el enfoque paso a paso:",
    step1: "Partir de la fecha dada. Esta fecha típicamente no se cuenta — se comienza a contar a partir del día siguiente.",
    step2: "Avanzar un día a la vez. Por cada día que se avanza, verificar si ese día cae en sábado o domingo. Si es así, saltarlo y continuar.",
    step3: "Verificar festivos. Por cada día laborable que se alcanza, verificar si es un festivo en el país y región relevantes. Si lo es, saltar ese día también.",
    step4: "Contar solo los días que pasen ambas verificaciones como días hábiles, y parar cuando se haya contado el número requerido.",
    howToAddExample: "Ejemplo: Necesitas sumar 10 días hábiles a partir del lunes 20 de diciembre. El día de Navidad cae el sábado 25 de diciembre (observado como viernes 24 de diciembre en muchos países) y el día de Año Nuevo cae el sábado 1 de enero (observado como lunes 3 de enero). Contando hacia adelante: 21, 22, 23 de diciembre, luego saltar 24 (Navidad observada), saltar 25 (fin de semana), saltar 26 (fin de semana o Boxing Day), 27, 28, 29, 30 de diciembre, luego saltar 31, saltar 1 de enero (fin de semana), saltar 2 (fin de semana), saltar 3 (Año Nuevo observado), 4, 5 de enero. Tu décimo día hábil cae el 5 de enero — no el 3 de enero como sugeriría un cálculo ingenuo de días naturales.",
    commonErrorsTitle: "Errores comunes en el cálculo de días hábiles",
    errSameHolidays: "Asumir que todos los países comparten los mismos festivos. Incluso países que comparten un idioma — como Estados Unidos, Reino Unido y Australia — tienen calendarios de días festivos completamente diferentes. Nunca apliques la lista de festivos de un país a otro.",
    errBankVsPublic: "Confundir festivos bancarios con festivos públicos. En el Reino Unido, \"festivo bancario\" es el término legal para los días festivos. Sin embargo, en otros países, un festivo bancario puede referirse solo a días en que las instituciones financieras cierran — que pueden no ser lo mismo que los festivos gubernamentales oficiales.",
    errObserved: "Olvidar los festivos observados. Cuando un festivo cae en sábado, típicamente se observa el viernes anterior. Cuando cae en domingo, se observa el lunes siguiente. Una calculadora que solo verifica la fecha nominal del festivo se perderá estos.",
    errWeekendDef: "Definición incorrecta de fin de semana. La mayoría de los países occidentales tratan el sábado y domingo como fin de semana. Sin embargo, en varios países de Medio Oriente (incluyendo Arabia Saudita, Irán e históricamente Israel), el fin de semana cae en viernes y sábado, haciendo que el domingo sea un día laborable.",
    errCountingMethod: "No especificar el método de conteo. Los contratos deben establecer explícitamente si la fecha de inicio se incluye o excluye del conteo. \"Dentro de 3 días hábiles\" es ambiguo: ¿significa el tercer día hábil después del evento desencadenante, o puede el propio día desencadenante ser el día uno?",
    faqTitle: "Preguntas frecuentes",
    faqSatQ: "¿El sábado es un día hábil?",
    faqSatA: "En la mayoría de los países e industrias, el sábado no es un día hábil. Los días hábiles estándar son de lunes a viernes. Sin embargo, algunos negocios — particularmente en hostelería, comercio minorista y ciertos servicios financieros — operan los sábados y pueden tratarlos como días laborables para propósitos de programación interna. Para plazos legales y contractuales, el sábado está casi universalmente excluido a menos que el contrato lo indique explícitamente.",
    faqWithin3Q: "¿Qué significa \"dentro de 3 días hábiles\" en un contrato?",
    faqWithin3A: "Significa que la obligación debe cumplirse antes del final del tercer día hábil siguiente al evento desencadenante (como recibir un aviso o realizar un pedido). El día desencadenante típicamente no se cuenta. Así que si recibes un aviso el lunes, \"dentro de 3 días hábiles\" significa que debes responder antes del cierre del jueves — asumiendo que no hay festivos el martes, miércoles o jueves.",
    faqNet30Q: "¿Cómo calculo las condiciones de pago Neto 30?",
    faqNet30A: "Neto 30 (sin la palabra \"hábil\") significa que la factura vence 30 días naturales desde la fecha de la factura — no 30 días hábiles. Cuenta 30 días seguidos desde la fecha de la factura, independientemente de los fines de semana y festivos. Si la factura está fechada el 1 de marzo, el pago vence el 31 de marzo. Neto 30 es mucho más común en la facturación comercial que \"30 días hábiles\" porque es más sencillo de calcular y crea un calendario de flujo de caja fijo.",
    faqHolidaysCountQ: "¿Los festivos cuentan como días hábiles?",
    faqHolidaysCountA: "No. Los festivos están excluidos del conteo de días hábiles de la misma manera que los fines de semana. Cuando estás sumando días hábiles a una fecha, cualquier día que sea festivo en la jurisdicción relevante se salta y no cuenta hacia tu total. La clave es usar el calendario de festivos correcto para el país (y a veces la región) donde se debe cumplir la obligación.",
    faqBizVsWorkQ: "¿Cuál es la diferencia entre días hábiles y días laborables?",
    faqBizVsWorkA: "En la mayoría de los contextos, días hábiles y días laborables se usan indistintamente — ambos se refieren a los días de la semana en los que tiene lugar el comercio normal (de lunes a viernes, excluyendo festivos). Sin embargo, \"días laborables\" a veces puede tener un significado más estrecho vinculado al horario de un empleador específico, como una empresa que opera de martes a sábado. Cuando se usa en un contexto legal o contractual, siempre aclara la definición específica para evitar ambigüedad.",
  },
};

const MODE_OPTIONS: Array<{ mode: Mode; labelKey: keyof Pick<LanguagePack, "modeForward" | "modeCount" | "modeReverse"> }> = [
  { mode: "forward", labelKey: "modeForward" },
  { mode: "count", labelKey: "modeCount" },
  { mode: "reverse", labelKey: "modeReverse" },
];

const COUNTRY_CODES = ["US", "GB", "CA", "AU", "NZ", "HK", "CN", "TW", "SG", "MY", "JP", "KR", "IN", "DE", "FR", "ES", "IT", "NL", "BR", "MX"];

const PAGE_SEARCH_HINTS = [
  { label: "Volumetric Weight", href: "/volumetric-weight-calculator", keywords: ["weight", "shipping", "parcel"] },
  { label: "Business Day", href: "/business-day-calculator", keywords: ["day", "calendar", "deadline"] },
  { label: "Invoice Due Date", href: "/invoice-due-date-calculator", keywords: ["invoice", "payment", "bill"] },
  { label: "Word Counter", href: "/word-counter", keywords: ["words", "characters", "text"] },
  { label: "URL Encoder", href: "/url-encoder-decoder", keywords: ["url", "encode", "decode"] },
];

const holidayEngineCache = new Map<string, any>();

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/business-day-calculator";

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

function localeTag(locale: LocaleKey) {
  switch (locale) {
    case "zh-hk": return "zh-Hant-HK";
    case "zh-cn": return "zh-Hans-CN";
    case "es": return "es-ES";
    default: return "en-US";
  }
}

function formatInputDate(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function parseInputDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function safeDateLabel(value: string, locale: LocaleKey) {
  if (!value) return LANGUAGES[locale].dash;
  const date = parseInputDate(value);
  try {
    return new Intl.DateTimeFormat(localeTag(locale), { dateStyle: "full" }).format(date);
  } catch {
    return value;
  }
}

function getHolidayEngine(country: string, region: string) {
  const key = `${country}:${region}`;
  if (holidayEngineCache.has(key)) return holidayEngineCache.get(key);
  const engine = new Holidays();
  try {
    if (region.trim()) engine.init(country, region.trim());
    else engine.init(country);
  } catch {
    engine.init("US");
  }
  holidayEngineCache.set(key, engine);
  return engine;
}

function isBusinessDay(date: Date, country: string, region: string) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const engine = getHolidayEngine(country, region);
  try {
    return !engine.isHoliday(date);
  } catch {
    return true;
  }
}

function moveBusinessDays(start: Date, amount: number, country: string, region: string) {
  const current = new Date(start);
  if (!Number.isFinite(amount) || amount === 0) return current;
  const step = amount > 0 ? 1 : -1;
  let remaining = Math.abs(amount);
  while (remaining > 0) {
    current.setDate(current.getDate() + step);
    if (isBusinessDay(current, country, region)) remaining -= 1;
  }
  return current;
}

function businessDaysBetween(start: Date, end: Date, country: string, region: string) {
  const from = new Date(start);
  const to = new Date(end);
  if (from.getTime() === to.getTime()) return 0;
  let count = 0;
  if (from < to) {
    while (from < to) {
      from.setDate(from.getDate() + 1);
      if (isBusinessDay(from, country, region)) count += 1;
    }
  } else {
    while (from > to) {
      from.setDate(from.getDate() - 1);
      if (isBusinessDay(from, country, region)) count -= 1;
    }
  }
  return count;
}

function countryName(code: string, locale: LocaleKey) {
  try {
    const dn = new Intl.DisplayNames([localeTag(locale)], { type: "region" });
    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}

function SearchBar({ locale }: { locale: LocaleKey }) {
  const L = LANGUAGES[locale];
  const [query, setQuery] = useState("");
  const filtered = PAGE_SEARCH_HINTS.filter((item) => {
    const haystack = `${item.label} ${item.keywords.join(" ")}`.toLowerCase();
    return !query.trim() || haystack.includes(query.toLowerCase());
  });

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/80">{L.searchLabel}</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-emerald-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={L.searchPlaceholder}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
          />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {PAGE_SEARCH_HINTS.map((hint) => (
          <button
            key={hint.href}
            type="button"
            onClick={() => setQuery(hint.label)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10"
          >
            {hint.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">{L.searchHint}</p>
        {filtered.slice(0, 4).map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10"
          >
            <span>{item.label}</span>
            <ArrowRight className="h-4 w-4 text-white/35" />
          </a>
        ))}
      </div>
    </section>
  );
}

export default function BusinessDayCalculator() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale") as LocaleKey | null;
    return saved && LANGUAGES[saved] ? saved : "en";
  });
  const [mode, setMode] = useState<Mode>("forward");
  const [country, setCountry] = useState("US");
  const [region, setRegion] = useState("");
  const today = useMemo(() => formatInputDate(new Date()), []);
  const [startDate, setStartDate] = useState(today);
  const [businessDays, setBusinessDays] = useState("10");
  const [endDate, setEndDate] = useState(() => formatInputDate(moveBusinessDays(parseInputDate(today), 10, "US", "")));

  const L = LANGUAGES[locale];

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    document.documentElement.lang = localeTag(locale);
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: L.title,
        url: SITE_URL + PAGE_PATH,
        description: L.subtitle,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL },
      },
    });
  }, [locale]);

  const start = startDate ? parseInputDate(startDate) : null;
  const end = endDate ? parseInputDate(endDate) : null;
  const days = Number(businessDays);
  const modeLabel = L[MODE_OPTIONS.find((item) => item.mode === mode)?.labelKey ?? "modeForward"];

  const calculation = useMemo(() => {
    if (mode === "forward") {
      if (!start || !Number.isFinite(days)) return null;
      const computed = moveBusinessDays(start, days, country, region);
      return {
        label: L.endLabel,
        field: "endDate" as const,
        value: formatInputDate(computed),
        display: safeDateLabel(formatInputDate(computed), locale),
        formula: `${L.startLabel} + ${L.daysLabel}`,
      };
    }
    if (mode === "count") {
      if (!start || !end) return null;
      const computed = businessDaysBetween(start, end, country, region);
      return {
        label: L.daysLabel,
        field: "businessDays" as const,
        value: String(computed),
        display: String(computed),
        formula: `${L.startLabel} + ${L.endLabel}`,
      };
    }
    if (!end || !Number.isFinite(days)) return null;
    const computed = moveBusinessDays(end, -days, country, region);
    return {
      label: L.startLabel,
      field: "startDate" as const,
      value: formatInputDate(computed),
      display: safeDateLabel(formatInputDate(computed), locale),
      formula: `${L.daysLabel} + ${L.endLabel}`,
    };
  }, [mode, start, end, days, country, region, locale]);

  const displayStartDate = mode === "reverse" && calculation?.field === "startDate" ? calculation.value : startDate;
  const displayBusinessDays = mode === "count" && calculation?.field === "businessDays" ? calculation.value : businessDays;
  const displayEndDate = mode === "forward" && calculation?.field === "endDate" ? calculation.value : endDate;

  const countryDisplayName = countryName(country, locale);
  const modeOptions = MODE_OPTIONS.map((item) => ({ mode: item.mode, label: L[item.labelKey] }));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
                <Clock3 className="h-3.5 w-3.5" />
                {L.holidaysLabel}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{L.title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">{L.subtitle}</p>
              <p className="text-sm text-emerald-200/80">{L.helperText}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {(Object.keys(LANGUAGES) as LocaleKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setLocale(key)}
                  className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10"}`}
                >
                  {LANGUAGES[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{L.modeLabel}</h2>
                  <p className="text-sm text-neutral-300">{L.inputHelp}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {modeOptions.map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setMode(item.mode)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${mode === item.mode ? "border-emerald-400/70 bg-emerald-400/10 text-white" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/10"}`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Mode</p>
                    <p className="mt-2 text-sm font-medium leading-6">{item.label}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.countryLabel}</span>
                  <div className="relative">
                    <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-black/30 px-11 py-3 text-white outline-none focus:border-emerald-400/60"
                    >
                      {COUNTRY_CODES.map((code) => (
                        <option key={code} value={code}>
                          {code} — {countryName(code, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.regionLabel}</span>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
                    <input
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder={locale === "es" ? "Ej.: CA, NSW, HK" : locale === "zh-hk" ? "例如：CA、NSW、HK" : locale === "zh-cn" ? "例如：CA、NSW、HK" : "e.g. CA, NSW, HK"}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-11 py-3 text-white outline-none focus:border-emerald-400/60"
                    />
                  </div>
                </label>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300 lg:col-span-1">
                  <p className="font-medium text-white/90">{L.supportLabel}</p>
                  <p className="mt-2 leading-6">{L.countryHelper}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.startLabel}</span>
                  <input
                    type="date"
                    value={displayStartDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    readOnly={mode === "reverse"}
                    className={`w-full rounded-2xl border px-4 py-3 text-white outline-none ${mode === "reverse" ? "cursor-not-allowed border-emerald-400/30 bg-emerald-400/5" : "border-white/10 bg-black/30 focus:border-emerald-400/60"}`}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.daysLabel}</span>
                  <input
                    type="number"
                    min="0"
                    value={displayBusinessDays}
                    onChange={(e) => setBusinessDays(e.target.value)}
                    readOnly={mode === "count"}
                    className={`w-full rounded-2xl border px-4 py-3 text-white outline-none ${mode === "count" ? "cursor-not-allowed border-emerald-400/30 bg-emerald-400/5" : "border-white/10 bg-black/30 focus:border-emerald-400/60"}`}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-neutral-300">{L.endLabel}</span>
                  <input
                    type="date"
                    value={displayEndDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    readOnly={mode === "forward"}
                    className={`w-full rounded-2xl border px-4 py-3 text-white outline-none ${mode === "forward" ? "cursor-not-allowed border-emerald-400/30 bg-emerald-400/5" : "border-white/10 bg-black/30 focus:border-emerald-400/60"}`}
                  />
                </label>
              </div>

              <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-black/20 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">{L.calculatedLabel}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{L.resultLabel}</p>
                  </div>
                  <p className="text-sm text-emerald-200/80">{modeLabel}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.modeLabel}</p>
                    <p className="mt-2 text-sm text-neutral-200">{modeLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{L.holidaysLabel}</p>
                    <p className="mt-2 text-sm text-neutral-200">{countryDisplayName}{region ? ` · ${region}` : ""}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">{calculation?.label ?? L.resultLabel}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{calculation ? calculation.display : L.dash}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-neutral-300">{calculation ? calculation.formula : L.helperText}</p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{L.howItWorks}</h2>
                  <p className="text-sm text-neutral-300">{L.howItWorksDesc}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-neutral-300">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{L.skipWeekends}</div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{L.useCountryHolidays}</div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{L.supportRegionalHolidays}</div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{L.useCases}</h2>
                  <p className="text-sm text-neutral-300">{L.useCasesDesc}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{L.shippingDates}</p>
                <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{L.projectDeadlines}</p>
                <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{L.invoiceFollowups}</p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-white">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{L.countrySupport}</h2>
                  <p className="text-sm text-neutral-300">{L.countrySupportDesc}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-300">{L.countrySupportNote}</p>
            </section>
          </aside>
        </div>

        <article className="mt-6 space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-white">{L.whatIsBizDay}</h2>
            <p className="mt-3 leading-7">{L.whatIsBizDayP1}</p>
            <p className="mt-3 leading-7">{L.whatIsBizDayP2}</p>
            <p className="mt-3 leading-7">{L.whatIsBizDayP3}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.whyBizDaysMatter}</h2>
            <p className="mt-3 leading-7">{L.whyBizDaysMatterP1}</p>
            <p className="mt-3 leading-7">{L.whyBizDaysMatterP2}</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{L.courtDeadlines}</li>
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{L.locExpiry}</li>
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{L.payrollHR}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.holidayDiffsTitle}</h2>
            <p className="mt-3 leading-7">{L.holidayDiffsP1}</p>
            <ul className="mt-3 space-y-3 text-white/70">
              <li><strong className="text-white">{L.usHolidays}</strong></li>
              <li><strong className="text-white">{L.ukHolidays}</strong></li>
              <li><strong className="text-white">{L.hkHolidays}</strong></li>
              <li><strong className="text-white">{L.cnHolidays}</strong></li>
            </ul>
            <p className="mt-4 leading-7">{L.holidayDiffsNote}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.howToAddTitle}</h2>
            <p className="mt-3 leading-7">{L.howToAddP1}</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">1.</span>{L.step1}</li>
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">2.</span>{L.step2}</li>
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">3.</span>{L.step3}</li>
              <li className="flex gap-2"><span className="text-emerald-300 shrink-0">4.</span>{L.step4}</li>
            </ul>
            <p className="mt-4 leading-7">{L.howToAddExample}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.commonErrorsTitle}</h2>
            <ul className="mt-3 space-y-3 text-white/70">
              <li><strong className="text-white">{L.errSameHolidays}</strong></li>
              <li><strong className="text-white">{L.errBankVsPublic}</strong></li>
              <li><strong className="text-white">{L.errObserved}</strong></li>
              <li><strong className="text-white">{L.errWeekendDef}</strong></li>
              <li><strong className="text-white">{L.errCountingMethod}</strong></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{L.faqTitle}</h2>
            <div className="mt-4 space-y-5">
              <div>
                <h3 className="font-semibold text-white">{L.faqSatQ}</h3>
                <p className="mt-1 text-white/70">{L.faqSatA}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">{L.faqWithin3Q}</h3>
                <p className="mt-1 text-white/70">{L.faqWithin3A}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">{L.faqNet30Q}</h3>
                <p className="mt-1 text-white/70">{L.faqNet30A}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">{L.faqHolidaysCountQ}</h3>
                <p className="mt-1 text-white/70">{L.faqHolidaysCountA}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">{L.faqBizVsWorkQ}</h3>
                <p className="mt-1 text-white/70">{L.faqBizVsWorkA}</p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-6">
          <SearchBar locale={locale} />
          <p className="mt-3 text-center text-xs text-white/40">{L.bottomNote}</p>
        </div>
      </section>
    </main>
  );
}
