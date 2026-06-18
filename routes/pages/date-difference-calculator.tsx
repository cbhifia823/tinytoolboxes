import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, CalendarRange, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Date Difference Calculator",
    subtitle: "Calculate the number of days, weeks, months, and years between two dates.",
    reserveAd: "Ad",
    startLabel: "Start date",
    endLabel: "End date",
    today: "Today",
    excludeWeekends: "Exclude weekends",
    result: "Result",
    daysLabel: "Days",
    weeksLabel: "Weeks",
    monthsLabel: "Months",
    yearsLabel: "Years",
    workingDays: "Working days",
    searchLabel: "Search",
    searchPlaceholder: "Search tools...",
    adLabel: "Ad",
    reserveAdSub: "Sponsored",
    adBadge: "Ad",
    useCasesTitle: "Use cases",
    useCasesSubtitle: "Common scenarios for date difference calculation",
    useCases: ["Project planning", "Legal deadlines", "Event countdowns"],
    suggestionsTitle: "You may also like",
    suggestionsSubtitle: "Related tools",
    suggestions: ["Age Calculator", "Business Day Calculator", "Invoice Due Date Calculator"],
    faqTitle: "Frequently Asked Questions",
    faq: [
      {
        q: "Does this calculator include or exclude the start and end date?",
        a: "This calculator counts the total number of days elapsed between the two dates. The end date is excluded from the count — meaning the number shown represents complete days that have passed. For example, from January 1 to January 2 is 1 day, not 2. This is the most common convention and matches how most software systems and financial contracts calculate date differences.",
      },
      {
        q: "How many days are in a year?",
        a: "A standard year has 365 days. A leap year has 366 days, occurring every four years (with exceptions for century years not divisible by 400). For long-range astronomical calculations, the average Gregorian year is 365.2425 days — often approximated as 365.25 days for rough purposes.",
      },
      {
        q: "What is the difference between days elapsed and days remaining?",
        a: "Days elapsed is the count of days from a past date to today (or another reference date). Days remaining is the count of days from today until a future date. Both use the same underlying subtraction, but the direction and framing are different.",
      },
      {
        q: "How do I calculate exactly how many weeks are between two dates?",
        a: "Divide the total number of days by 7. The whole number part of the result is the number of complete weeks. The remainder tells you the extra days. For example, 45 days is 6 weeks and 3 days (45 ÷ 7 = 6 remainder 3).",
      },
    ],
    articleTitle1: "Why Date Difference Calculation is Tricky",
    articleTitle2: "How Date Differences are Calculated",
    articleTitle3: "Practical Uses for Date Difference",
    articleTitle4: "Working Days vs Calendar Days",
    articleTitle5: "Date Formats Around the World",
    article1: [
      "Calculating the number of days between two dates seems like simple arithmetic — but it hides surprising complexity. The most fundamental challenge is that months have different lengths: January has 31 days, February has 28 or 29, April has 30, and so on. A naive approach of multiplying months by 30 will produce errors that compound over longer date ranges.",
      "Leap years add another layer of complexity. A year is a leap year if it is divisible by 4 — except that century years (1900, 2100) are not leap years unless they are also divisible by 400 (making 2000 a leap year but 2100 not). This means that calculating \"how many days from February 28, 1900 to February 28, 1904\" requires knowing that 1900 was not a leap year despite being divisible by 4.",
      "Different calendar systems add a further dimension of difficulty. The Gregorian calendar used internationally today replaced the Julian calendar in most of Europe during the 16th–18th centuries. Dates before those transitions differ between the two systems. Lunar calendars (used for religious and cultural observances in Islamic, Hebrew, Chinese, and Hindu traditions) add months differently and cannot be converted to Gregorian dates with simple arithmetic.",
    ],
    article2: [
      "Modern date-difference calculators use a common approach: convert both dates to a numeric representation based on days elapsed since a fixed reference point, subtract the two numbers, then convert back to a human-readable format.",
      "The most widely used reference point in software is the Unix epoch: midnight on January 1, 1970 (UTC). Every moment in time can be expressed as the number of seconds (or milliseconds) since that point. To find the number of days between two dates, subtract their epoch values and divide by 86,400 (the number of seconds in a day).",
      "When you need a breakdown in years, months, and days — rather than just total days — the algorithm becomes more involved. The standard approach subtracts year-by-year first, then month-by-month, adjusting for the fact that months have different lengths. For example, one month after January 31 is February 28 (or 29 in a leap year), not March 3. This \"end-of-month\" adjustment is a frequent source of discrepancy between different date calculators.",
    ],
    article3: [
      "Knowing the exact number of days between two dates has a wide range of real-world applications across personal, professional, and medical contexts:",
    ],
    article3List: [
      { label: "Project management", text: "Calculate elapsed time from project kick-off to today, or total duration from start to deadline, to track progress against milestones." },
      { label: "Age calculation", text: "Determine exact age in years, months, and days from a birth date to today — or between any two dates." },
      { label: "Loan and lease terms", text: "Calculate the exact number of days in a loan period for interest accrual, or verify that a lease runs for the contracted number of months." },
      { label: "Event countdowns", text: "Count down the days until a wedding, product launch, exam, or holiday." },
      { label: "Anniversaries", text: "Find how many days have passed since a significant event — a business founding date, a sobriety milestone, or a relationship anniversary." },
      { label: "Medical and health", text: "Pregnancy due date calculation uses 280 days (40 weeks) from the last menstrual period. Medication courses, recovery timelines, and follow-up appointments are often scheduled a specific number of days from a reference date." },
    ],
    article4: [
      "One of the most important distinctions in date calculations is whether you are counting calendar days or working days (also called business days). The difference is significant: 30 calendar days span roughly 4 weeks and 2 days, while 30 working days span approximately 6 calendar weeks once weekends are excluded.",
      "Commercial contracts typically use calendar days for payment terms (Net 30, Net 60) because they create a predictable, fixed date that both parties can calculate independently without needing to agree on which days are holidays. Service-level agreements (SLAs), on the other hand, frequently use business days because it is unreasonable to require a vendor to deliver work on a weekend or a public holiday.",
      "For international date notation, ISO 8601 is the globally recognised standard: dates are written as YYYY-MM-DD. This format is unambiguous across all locales, sorts correctly as text, and is the format used in databases, APIs, and software systems worldwide. The ISO 8601 standard also defines durations (P1Y2M3D = 1 year, 2 months, 3 days) and time intervals, making it the most comprehensive framework for date and time communication.",
    ],
    article5: [
      "Date formatting conventions vary dramatically by country and region, and the ambiguity they create causes real-world errors in contracts, travel bookings, medical records, and software systems.",
    ],
    article5List: [
      { label: "MM/DD/YYYY (United States)", text: "The month-first format used in the US is unique among major economies. January 2 is written as 01/02/2024." },
      { label: "DD/MM/YYYY (UK, Australia, most of Europe, India, Latin America)", text: "The day-first format is far more widespread globally. The same date, February 1, would be written as 01/02/2024 — identical to the US notation for January 2." },
      { label: "YYYY/MM/DD (ISO 8601, China, Japan, Korea)", text: "The year-first format is used in East Asia and is also the basis for ISO 8601. January 2, 2024 is 2024/01/02 or 2024-01-02 in ISO notation." },
    ],
    article5Footer: "The ambiguity of formats like 01/02/2024 is dangerous — it means January 2 in the US and February 1 in the UK. Whenever writing a date for an international audience, use the YYYY-MM-DD format or spell out the month name (e.g. \"2 January 2024」) to eliminate any possibility of misreading.",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "日期差計算器",
    subtitle: "計算兩個日期之間的日數、週數、月數和年數。",
    reserveAd: "廣告",
    startLabel: "開始日期",
    endLabel: "結束日期",
    today: "今天",
    excludeWeekends: "排除週末",
    result: "結果",
    daysLabel: "日數",
    weeksLabel: "週數",
    monthsLabel: "月數",
    yearsLabel: "年數",
    workingDays: "工作日",
    searchLabel: "搜尋",
    searchPlaceholder: "搜尋工具...",
    adLabel: "廣告",
    reserveAdSub: "贊助",
    adBadge: "廣告",
    useCasesTitle: "用途",
    useCasesSubtitle: "日期差計算的常見場景",
    useCases: ["項目規劃", "法律限期", "活動倒數"],
    suggestionsTitle: "你可能會喜歡",
    suggestionsSubtitle: "相關工具",
    suggestions: ["年齡計算機", "工作日計算機", "發票到期日計算機"],
    faqTitle: "常見問題",
    faq: [
      {
        q: "呢個計算機會唔會計埋開始同結束嗰日？",
        a: "呢個計算機係計兩個日期之間經過咗幾多日。結束日期唔會計入去——即係顯示嘅數字代表已經過咗嘅完整日數。例如，1月1號到1月2號係1日，唔係2日。呢個係最常見嘅計算慣例，亦都同大部份軟件系統同財務合約嘅日期計算方式一致。",
      },
      {
        q: "一年有幾多日？",
        a: "平年有365日。閏年有366日，每四年出現一次（但係世紀年份如果唔能夠被400整除就唔係閏年）。如果要精確咁計兩個日期之間嘅年數，一定要用實際日曆嚟計埋閏年。",
      },
      {
        q: "「已經過咗幾多日」同「仲有幾多日」有咩分別？",
        a: "「已經過咗幾多日」係由過去某個日期到今日（或者另一個參考日期）嘅日數。「仲有幾多日」係由今日到未來某個日期嘅日數。兩者背後嘅計算方式一樣，但方向同含義唔同。",
      },
      {
        q: "點樣計算兩個日期之間有幾多個星期？",
        a: "將總日數除以7。整數部份就係完整週數，餘數就係額外嘅日數。例如，45日就係6個星期零3日（45 ÷ 7 = 6 餘 3）。",
      },
    ],
    articleTitle1: "點解日期差計算會咁複雜",
    articleTitle2: "點樣計算日期差",
    articleTitle3: "日期差嘅實際用途",
    articleTitle4: "工作日同日曆日嘅分別",
    articleTitle5: "世界各地嘅日期格式",
    article1: [
      "計兩個日期之間有幾多日睇落好似好簡單嘅算術——但查實背後隱藏住令人意外嘅複雜性。最基本嘅挑戰係每個月嘅日數都唔同：1月有31日，2月有28或者29日，4月有30日，如此類推。一個天真嘅做法係將月份乘30，但咁樣喺長嘅日期範圍入面會累積誤差。",
      "閏年帶嚟另一層複雜性。年份如果可以整除4就係閏年——但係世紀年份（1900、2100）除非仲可以整除400，否則唔係閏年（所以2000年係閏年，但2100年唔係）。呢個意思即係，計「1900年2月28號到1904年2月28號之間有幾多日」需要知道1900年雖然可以被4整除，但唔係閏年。",
      "唔同嘅曆法系統帶嚟更多嘅難度。今日國際通用嘅公曆喺16至18世紀期間取代咗歐洲大部份地區嘅儒略曆。喺轉換之前嘅日期，兩個系統會有差異。陰曆（喺伊斯蘭、希伯來、中國同印度傳統入面用嚟做宗教同文化紀念）添加月份嘅方式唔同，冇辦法用簡單嘅算術轉換成公曆日期。",
    ],
    article2: [
      "現代日期差計算器用一個通用嘅方法：將兩個日期都轉換成以固定參考點起計嘅日數數字表示，將兩個數字相減，然後轉換返做人類睇得明嘅格式。",
      "軟件入面最常用嘅參考點係Unix紀元：1970年1月1號午夜（UTC）。每一個時間點都可以表示為由嗰一刻開始經過嘅秒數（或者毫秒數）。要搵出兩個日期之間嘅日數，只需要將佢哋嘅紀元值相減，然後除以86,400（一日嘅秒數）。",
      "當你需要嘅係年、月、日嘅詳細拆解——而唔單止係總日數——演算法就會變得更加複雜。標準做法係先逐年減，然後逐月減，需要調整每個月日數唔同嘅事實。例如，1月31號之後一個月係2月28號（閏年就係29號），而唔係3月3號。呢種「月底調整」係唔同日期計算器之間成日出現差異嘅原因。",
    ],
    article3: [
      "知道兩個日期之間嘅準確日數喺個人、專業同醫療範疇有廣泛嘅實際應用：",
    ],
    article3List: [
      { label: "項目管理", text: "計算由項目啟動到今日經過咗幾多時間，或者由開始到截止日期嘅總持續時間，用嚟追蹤進度係咪符合里程碑。" },
      { label: "年齡計算", text: "由出生日期到今日——或者任何兩個日期之間——準確計出歲數、月數同日數。" },
      { label: "貸款同租約條款", text: "計算貸款期嘅準確日數用嚟計利息，或者驗證租約係咪按照合約嘅月數執行。" },
      { label: "活動倒數", text: "倒數距離婚禮、產品發布、考試或者假期仲有幾多日。" },
      { label: "紀念日", text: "搵出由某個重要事件到而家經過咗幾多日——例如公司創立日期、戒酒里程碑，或者感情紀念日。" },
      { label: "醫療同健康", text: "懷孕預產期計算使用由最後一次經期起計280日（40週）。藥物療程、康復時間表同覆診預約通常都係由參考日期起計特定日數嚟安排。" },
    ],
    article4: [
      "日期計算入面最重要嘅區分之一就係你數緊嘅係日曆日定係工作日（又叫營業日）。兩者嘅差別好大：30個日曆日大約等於4個星期零2日，而30個工作日撇除週末之後大約等於6個日曆星期。",
      "商業合約通常用日曆日嚟計付款期限（Net 30、Net 60），因為咁樣可以產生一個雙方都可以獨立計算嘅可預測固定日期，唔需要同意邊啲日子係假期。另一方面，服務水平協議（SLA）成日都用工作日，因為要求供應商喺週末或者公眾假期交付工作係唔合理嘅。",
      "對於國際日期標記，ISO 8601係全球公認嘅標準：日期寫成YYYY-MM-DD。呢個格式喺所有地區都冇歧義，按文字排序時會正確排列，亦都係全球數據庫、API同軟件系統入面使用嘅格式。ISO 8601標準仲定義咗持續時間（P1Y2M3D = 1年2個月3日）同時間間隔，係最全面嘅日期同時間溝通框架。",
    ],
    article5: [
      "日期格式慣例喺唔同國家同地區之間差異好大，而佢哋造成嘅歧義會喺合約、旅行預訂、醫療記錄同軟件系統入面引致真實世界嘅錯誤。",
    ],
    article5List: [
      { label: "MM/DD/YYYY（美國）", text: "美國使用嘅月份先行格式喺主要經濟體入面獨一無二。1月2號會寫成01/02/2024。" },
      { label: "DD/MM/YYYY（英國、澳洲、大部份歐洲、印度、拉丁美洲）", text: "日期先行格式喺全球廣泛得多。同樣嘅日期，2月1號會寫成01/02/2024——同美國標記1月2號嘅寫法一模一樣。" },
      { label: "YYYY/MM/DD（ISO 8601、中國、日本、韓國）", text: "年份先行格式喺東亞使用，亦都係ISO 8601嘅基礎。2024年1月2號係2024/01/02或者2024-01-02（ISO標記）。" },
    ],
    article5Footer: "好似01/02/2024咁樣嘅格式歧義係危險嘅——喺美國佢代表1月2號，喺英國就代表2月1號。任何時候寫日期俾國際受眾，都應該用YYYY-MM-DD格式，或者拼寫出月份名（例如「2 January 2024」）嚟消除任何誤讀嘅可能性。",
  },
  "zh-cn": {
    name: "简体中文",
    title: "日期差计算器",
    subtitle: "计算两个日期之间的天数、周数、月数和年数。",
    reserveAd: "广告",
    startLabel: "开始日期",
    endLabel: "结束日期",
    today: "今天",
    excludeWeekends: "排除周末",
    result: "结果",
    daysLabel: "天数",
    weeksLabel: "周数",
    monthsLabel: "月数",
    yearsLabel: "年数",
    workingDays: "工作日",
    searchLabel: "搜索",
    searchPlaceholder: "搜索工具...",
    adLabel: "广告",
    reserveAdSub: "赞助",
    adBadge: "广告",
    useCasesTitle: "用途",
    useCasesSubtitle: "日期差计算的常见场景",
    useCases: ["项目规划", "法律期限", "活动倒计时"],
    suggestionsTitle: "你可能会喜欢",
    suggestionsSubtitle: "相关工具",
    suggestions: ["年龄计算器", "工作日计算器", "发票到期日计算器"],
    faqTitle: "常见问题",
    faq: [
      {
        q: "这个计算器会包括开始和结束日期吗？",
        a: "这个计算器计算的是两个日期之间经过了多少天。结束日期不计入——即显示的数字代表已经过去的完整天数。例如，1月1日到1月2日是1天，不是2天。这是最常见的计算惯例，也与大多数软件系统和财务合同的日期计算方式一致。",
      },
      {
        q: "一年有多少天？",
        a: "平年有365天。闰年有366天，每四年出现一次（但世纪年份如果不能被400整除则不是闰年）。要精确计算两个日期之间的年数，必须使用实际日历来计入闰年。",
      },
      {
        q: "「已经过了多少天」和「还剩多少天」有什么区别？",
        a: "「已经过了多少天」是从过去某个日期到今天（或另一个参考日期）的天数。「还剩多少天」是从今天到未来某个日期的天数。两者的计算方式相同，但方向和含义不同。",
      },
      {
        q: "如何计算两个日期之间有多少个星期？",
        a: "将总天数除以7。整数部分就是完整周数，余数就是额外的天数。例如，45天就是6周零3天（45 ÷ 7 = 6 余 3）。",
      },
    ],
    articleTitle1: "为什么日期差计算这么复杂",
    articleTitle2: "日期差如何计算",
    articleTitle3: "日期差的实际用途",
    articleTitle4: "工作日与日历日的区别",
    articleTitle5: "世界各地的日期格式",
    article1: [
      "计算两个日期之间的天数看起来像是简单的算术——但实际上隐藏着令人意外的复杂性。最基本的挑战是每个月的天数都不同：1月有31天，2月有28或29天，4月有30天，以此类推。一个天真的做法是将月份乘以30，但这会在较长的日期范围内累积误差。",
      "闰年带来另一层复杂性。年份如果可以整除4就是闰年——但世纪年份（1900、2100）除非还可以整除400，否则不是闰年（所以2000年是闰年，但2100年不是）。这意味着，计算「1900年2月28日到1904年2月28日之间有多少天」需要知道1900年虽然可以被4整除，但不是闰年。",
      "不同的历法系统带来更多的难度。今日国际通用的公历在16至18世纪期间取代了欧洲大部分地区的儒略历。在转换之前的日期，两个系统会有差异。阴历（在伊斯兰、希伯来、中国和印度传统中用于宗教和文化纪念）添加月份的方式不同，无法用简单的算术转换成公历日期。",
    ],
    article2: [
      "现代日期差计算器使用一个通用的方法：将两个日期都转换成以固定参考点起计的天数数字表示，将两个数字相减，然后转换回人类可读的格式。",
      "软件中最常用的参考点是Unix纪元：1970年1月1日午夜（UTC）。每个时间点都可以表示为从那一刻开始经过的秒数（或毫秒数）。要找出两个日期之间的天数，只需将它们的纪元值相减，然后除以86,400（一天的秒数）。",
      "当你需要的是年、月、日的详细分解——而不仅仅是总天数——算法就会变得更加复杂。标准做法是先逐年减，然后逐月减，需要调整每个月的天数不同的事实。例如，1月31日之后一个月是2月28日（闰年则是29日），而不是3月3日。这种「月底调整」是不同日期计算器之间经常出现差异的原因。",
    ],
    article3: [
      "知道两个日期之间的准确天数在个人、专业和医疗领域有广泛的实际应用：",
    ],
    article3List: [
      { label: "项目管理", text: "计算从项目启动到今天经过了多少时间，或从开始到截止日期的总持续时间，用于追踪进度是否符合里程碑。" },
      { label: "年龄计算", text: "从出生日期到今天——或任何两个日期之间——准确计算出岁数、月数和天数。" },
      { label: "贷款和租约条款", text: "计算贷款期的准确天数用于计算利息，或验证租约是否按合同的月数执行。" },
      { label: "活动倒计时", text: "倒计时距离婚礼、产品发布、考试或假期还有多少天。" },
      { label: "纪念日", text: "找出从某个重要事件到现在经过了多少天——例如公司创立日期、戒酒里程碑，或感情纪念日。" },
      { label: "医疗和健康", text: "怀孕预产期计算使用从最后一次经期起计280天（40周）。药物疗程、康复时间表和复诊预约通常都是由参考日期起计特定天数来安排。" },
    ],
    article4: [
      "日期计算中最重要的区分之一就是你在数的是日历日还是工作日（也叫营业日）。两者的差别很大：30个日历日大约等于4周零2天，而30个工作日撇除周末后大约等于6个日历周。",
      "商业合同通常使用日历日来计算付款期限（Net 30、Net 60），因为这样可以产生一个双方都可以独立计算的可预测固定日期，不需要同意哪些日子是假期。另一方面，服务水平协议（SLA）经常使用工作日，因为要求供应商在周末或公共假期交付工作是不合理的。",
      "对于国际日期标记，ISO 8601是全球公认的标准：日期写成YYYY-MM-DD。这个格式在所有地区都没有歧义，按文字排序时会正确排列，也是全球数据库、API和软件系统中使用的格式。ISO 8601标准还定义了持续时间（P1Y2M3D = 1年2个月3天）和时间间隔，是最全面的日期和时间沟通框架。",
    ],
    article5: [
      "日期格式惯例在不同国家和地区之间差异很大，而它们造成的歧义会在合同、旅行预订、医疗记录和软件系统中引致真实世界的错误。",
    ],
    article5List: [
      { label: "MM/DD/YYYY（美国）", text: "美国使用的月份先行格式在主要经济体中独一无二。1月2日会写成01/02/2024。" },
      { label: "DD/MM/YYYY（英国、澳大利亚、大部分欧洲、印度、拉丁美洲）", text: "日期先行格式在全球广泛得多。同样的日期，2月1日会写成01/02/2024——与美国标记1月2日的写法一模一样。" },
      { label: "YYYY/MM/DD（ISO 8601、中国、日本、韩国）", text: "年份先行格式在东亚使用，也是ISO 8601的基础。2024年1月2日是2024/01/02或2024-01-02（ISO标记）。" },
    ],
    article5Footer: "像01/02/2024这样的格式歧义是危险的——在美国它代表1月2日，在英国则代表2月1日。任何时候写日期给国际受众，都应该使用YYYY-MM-DD格式，或拼写出月份名称（例如「2 January 2024」）来消除任何误读的可能性。",
  },
  es: {
    name: "Español",
    title: "Calculadora de Diferencia de Fechas",
    subtitle: "Calcula el número de días, semanas, meses y años entre dos fechas.",
    reserveAd: "Anuncio",
    startLabel: "Fecha de inicio",
    endLabel: "Fecha de fin",
    today: "Hoy",
    excludeWeekends: "Excluir fines de semana",
    result: "Resultado",
    daysLabel: "Días",
    weeksLabel: "Semanas",
    monthsLabel: "Meses",
    yearsLabel: "Años",
    workingDays: "Días hábiles",
    searchLabel: "Buscar",
    searchPlaceholder: "Buscar herramientas...",
    adLabel: "Anuncio",
    reserveAdSub: "Patrocinado",
    adBadge: "Anuncio",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Escenarios comunes para calcular diferencias de fechas",
    useCases: ["Planificación de proyectos", "Fechas límite", "Cuentas regresivas"],
    suggestionsTitle: "Te puede interesar",
    suggestionsSubtitle: "Herramientas relacionadas",
    suggestions: ["Calculadora de edad", "Calculadora de días hábiles", "Calculadora de vencimiento"],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Esta calculadora incluye o excluye la fecha de inicio y fin?",
        a: "Esta calculadora cuenta el número total de días transcurridos entre las dos fechas. La fecha de fin se excluye del conteo — es decir, el número mostrado representa los días completos que han pasado. Por ejemplo, del 1 de enero al 2 de enero es 1 día, no 2. Esta es la convención más común y coincide con cómo la mayoría de sistemas informáticos y contratos financieros calculan las diferencias de fechas.",
      },
      {
        q: "¿Cuántos días tiene un año?",
        a: "Un año estándar tiene 365 días. Un año bisiesto tiene 366 días y ocurre cada cuatro años (con excepciones para los años seculares no divisibles por 400). Para calcular con precisión el número de años entre dos fechas específicas, se debe usar el calendario real para tener en cuenta los años bisiestos.",
      },
      {
        q: "¿Cuál es la diferencia entre días transcurridos y días restantes?",
        a: "Los días transcurridos son el número de días desde una fecha pasada hasta hoy (u otra fecha de referencia). Los días restantes son el número de días desde hoy hasta una fecha futura. Ambos usan la misma resta subyacente, pero la dirección y el contexto son diferentes.",
      },
      {
        q: "¿Cómo calculo exactamente cuántas semanas hay entre dos fechas?",
        a: "Divide el número total de días por 7. La parte entera del resultado es el número de semanas completas. El resto indica los días adicionales. Por ejemplo, 45 días son 6 semanas y 3 días (45 ÷ 7 = 6 resto 3).",
      },
    ],
    articleTitle1: "Por qué calcular diferencias de fechas es complicado",
    articleTitle2: "Cómo se calculan las diferencias de fechas",
    articleTitle3: "Usos prácticos de las diferencias de fechas",
    articleTitle4: "Días laborables vs días naturales",
    articleTitle5: "Formatos de fecha en el mundo",
    article1: [
      "Calcular el número de días entre dos fechas parece aritmética sencilla, pero esconde una complejidad sorprendente. El desafío más fundamental es que los meses tienen diferentes longitudes: enero tiene 31 días, febrero tiene 28 o 29, abril tiene 30, y así sucesivamente. Un enfoque ingenuo de multiplicar los meses por 30 producirá errores que se acumulan en rangos de fechas más largos.",
      "Los años bisiestos añaden otra capa de complejidad. Un año es bisiesto si es divisible por 4, excepto que los años seculares (1900, 2100) no son bisiestos a menos que también sean divisibles por 400 (haciendo que 2000 sea bisiesto pero 2100 no). Esto significa que calcular \"cuántos días hay del 28 de febrero de 1900 al 28 de febrero de 1904\" requiere saber que 1900 no fue bisiesto a pesar de ser divisible por 4.",
      "Los diferentes sistemas de calendario añaden otra dimensión de dificultad. El calendario gregoriano utilizado internacionalmente hoy reemplazó al calendario juliano en la mayor parte de Europa durante los siglos XVI al XVIII. Las fechas anteriores a esas transiciones difieren entre los dos sistemas. Los calendarios lunares (utilizados para observancias religiosas y culturales en las tradiciones islámica, hebrea, china e hindú) añaden meses de manera diferente y no pueden convertirse a fechas gregorianas con aritmética simple.",
    ],
    article2: [
      "Las calculadoras modernas de diferencia de fechas utilizan un enfoque común: convierten ambas fechas a una representación numérica basada en los días transcurridos desde un punto de referencia fijo, restan los dos números y luego vuelven a convertirlos a un formato legible.",
      "El punto de referencia más utilizado en software es la época Unix: medianoche del 1 de enero de 1970 (UTC). Cada momento en el tiempo puede expresarse como el número de segundos (o milisegundos) desde ese punto. Para encontrar el número de días entre dos fechas, resta sus valores de época y divide por 86.400 (el número de segundos en un día).",
      "Cuando necesitas un desglose en años, meses y días — en lugar de solo el total de días — el algoritmo se vuelve más complejo. El enfoque estándar resta año por año primero, luego mes por mes, ajustando por el hecho de que los meses tienen diferentes longitudes. Por ejemplo, un mes después del 31 de enero es el 28 de febrero (o 29 en año bisiesto), no el 3 de marzo. Este ajuste de \"fin de mes\" es una fuente frecuente de discrepancias entre diferentes calculadoras de fechas.",
    ],
    article3: [
      "Conocer el número exacto de días entre dos fechas tiene una amplia gama de aplicaciones en contextos personales, profesionales y médicos:",
    ],
    article3List: [
      { label: "Gestión de proyectos", text: "Calcula el tiempo transcurrido desde el inicio del proyecto hasta hoy, o la duración total desde el inicio hasta la fecha límite, para hacer seguimiento del progreso respecto a los hitos." },
      { label: "Cálculo de edad", text: "Determina la edad exacta en años, meses y días desde una fecha de nacimiento hasta hoy, o entre dos fechas cualesquiera." },
      { label: "Condiciones de préstamos y arrendamientos", text: "Calcula el número exacto de días en un período de préstamo para la acumulación de intereses, o verifica que un arrendamiento dure el número de meses contratado." },
      { label: "Cuentas regresivas de eventos", text: "Cuenta los días que faltan para una boda, lanzamiento de producto, examen o festividad." },
      { label: "Aniversarios", text: "Averigua cuántos días han pasado desde un evento significativo: la fecha de fundación de un negocio, un hito de sobriedad o un aniversario de relación." },
      { label: "Medicina y salud", text: "El cálculo de la fecha prevista de parto utiliza 280 días (40 semanas) desde el último período menstrual. Los tratamientos médicos, los plazos de recuperación y las citas de seguimiento suelen programarse a un número específico de días desde una fecha de referencia." },
    ],
    article4: [
      "Una de las distinciones más importantes en los cálculos de fechas es si estás contando días naturales o días laborables (también llamados días hábiles). La diferencia es significativa: 30 días naturales abarcan aproximadamente 4 semanas y 2 días, mientras que 30 días laborables abarcan aproximadamente 6 semanas naturales una vez excluidos los fines de semana.",
      "Los contratos comerciales suelen utilizar días naturales para los plazos de pago (Net 30, Net 60) porque crean una fecha fija y predecible que ambas partes pueden calcular de forma independiente sin necesidad de acordar qué días son festivos. Los acuerdos de nivel de servicio (SLA), por otro lado, utilizan frecuentemente días hábiles porque no es razonable exigir a un proveedor que entregue trabajo en fin de semana o en un día festivo.",
      "Para la notación internacional de fechas, ISO 8601 es el estándar reconocido mundialmente: las fechas se escriben como AAAA-MM-DD. Este formato no es ambiguo en todas las configuraciones regionales, se ordena correctamente como texto y es el formato utilizado en bases de datos, API y sistemas de software en todo el mundo. El estándar ISO 8601 también define duraciones (P1A2M3D = 1 año, 2 meses, 3 días) e intervalos de tiempo, siendo el marco más completo para la comunicación de fechas y horas.",
    ],
    article5: [
      "Las convenciones de formato de fecha varían enormemente según el país y la región, y la ambigüedad que crean causa errores reales en contratos, reservas de viajes, registros médicos y sistemas de software.",
    ],
    article5List: [
      { label: "MM/DD/AAAA (Estados Unidos)", text: "El formato de mes primero utilizado en EE. UU. es único entre las principales economías. El 2 de enero se escribe como 01/02/2024." },
      { label: "DD/MM/AAAA (Reino Unido, Australia, la mayor parte de Europa, India, América Latina)", text: "El formato de día primero está mucho más extendido a nivel mundial. La misma fecha, el 1 de febrero, se escribiría como 01/02/2024, idéntica a la notación estadounidense para el 2 de enero." },
      { label: "AAAA/MM/DD (ISO 8601, China, Japón, Corea)", text: "El formato de año primero se utiliza en Asia Oriental y también es la base de ISO 8601. El 2 de enero de 2024 es 2024/01/02 o 2024-01-02 en notación ISO." },
    ],
    article5Footer: "La ambigüedad de formatos como 01/02/2024 es peligrosa: significa 2 de enero en EE. UU. y 1 de febrero en el Reino Unido. Siempre que escribas una fecha para una audiencia internacional, utiliza el formato AAAA-MM-DD o escribe el nombre del mes (por ejemplo, \"2 January 2024」) para eliminar cualquier posibilidad de mala interpretación.",
  },
};

const RIGHT_COPY = {
  en: {
    suggestionsTitle: "You may also like",
    suggestions: ["Age Calculator", "Business Day Calculator", "Invoice Due Date Calculator"],
  },
  "zh-hk": {
    suggestionsTitle: "你可能會喜歡",
    suggestions: ["年齡計算機", "工作日計算機", "發票到期日計算機"],
  },
  "zh-cn": {
    suggestionsTitle: "你可能会喜欢",
    suggestions: ["年龄计算器", "工作日计算器", "发票到期日计算器"],
  },
  es: {
    suggestionsTitle: "Te puede interesar",
    suggestions: ["Calculadora de edad", "Calculadora de días hábiles", "Calculadora de vencimiento"],
  },
};

const TOOLS = [
  { title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", "es": "Calculadora de edad" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "根據出生日期計算準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", "es": "Calcula la edad exacta a partir de una fecha de nacimiento." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", "es": "Calculadora de peso volumétrico" }, description: { en: "Calculate dimensional weight for parcels.", "zh-hk": "計算包裹的體積重量。", "zh-cn": "计算包裹的体积重量。", "es": "Calcula el peso volumétrico para paquetes." }, href: "/volumetric-weight-calculator", keywords: ["weight", "shipping"] },
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", "es": "Calculadora de días hábiles" }, description: { en: "Add working days to any date.", "zh-hk": "為任何日期增加工作日。", "zh-cn": "为任何日期增加工作日。", "es": "Añade días hábiles a cualquier fecha." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", "es": "Calculadora de porcentaje" }, description: { en: "Percentage of a number, or what percent X is of Y.", "zh-hk": "數字的百分比，或 X 佔 Y 的百分比。", "zh-cn": "数字的百分比，或 X 占 Y 的百分比。", "es": "Porcentaje de un número, o qué porcentaje X es de Y." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", "es": "Convertidor de unidades" }, description: { en: "Convert length, weight, temperature, and more.", "zh-hk": "轉換長度、重量、溫度等。", "zh-cn": "转换长度、重量、温度等。", "es": "Convierte longitud, peso, temperatura, y más." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算機", "zh-cn": "字数计算器", "es": "Contador de palabras" }, description: { en: "Count words and characters instantly.", "zh-hk": "即時計算字數和字符。", "zh-cn": "即时计算字数和字符。", "es": "Cuenta palabras y caracteres al instante." }, href: "/word-counter", keywords: ["word", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", "es": "Codificador / decodificador de URL" }, description: { en: "Encode or decode URLs.", "zh-hk": "編碼或解碼 URL。", "zh-cn": "编码或解码 URL。", "es": "Codifica o decodifica URLs." }, href: "/url-encoder-decoder", keywords: ["url", "encode"] },
];

function countWorkingDays(start: Date, end: Date) {
  let count = 0;
  const cur = new Date(start);
  while (cur < end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/date-difference-calculator";

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

export default function DateDifferenceCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [start, setStart] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().split("T")[0]; });
  const [end, setEnd] = useState(() => new Date().toISOString().split("T")[0]);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
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
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: content.faq.map((item: {q: string; a: string}) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      ],
    });
  }, [locale]);

  const diff = useMemo(() => {
    if (!start || !end) return null;
    const s = new Date(start), e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const [from, to] = s <= e ? [s, e] : [e, s];
    const totalDays = Math.floor((to.getTime() - from.getTime()) / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    const years = to.getFullYear() - from.getFullYear();
    const workingDays = countWorkingDays(from, to);
    return { totalDays, weeks, months, years, workingDays };
  }, [start, end]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "工作日", "百分比", "URL"] : locale === "zh-cn" ? ["年龄", "工作日", "百分比", "URL"] : ["age", "day", "percent", "url"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><CalendarRange className="h-5 w-5 text-emerald-300" /></div>
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
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.startLabel}</span>
                  <div className="flex gap-2"><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></div>
                </label>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.endLabel}</span>
                  <div className="flex gap-2"><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /><button onClick={() => setEnd(new Date().toISOString().split("T")[0])} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10 transition">{content.today}</button></div>
                </label>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setExcludeWeekends(!excludeWeekends)} className={`relative h-6 w-11 rounded-full transition ${excludeWeekends ? "bg-emerald-500" : "bg-white/10"}`}>
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${excludeWeekends ? "left-6" : "left-1"}`} />
                </div>
                <span className="text-sm text-neutral-300">{content.excludeWeekends}</span>
              </label>

              {diff && (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.result}</p>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {([[content.daysLabel, excludeWeekends ? diff.workingDays : diff.totalDays],[content.weeksLabel, diff.weeks],[content.monthsLabel, diff.months],[content.yearsLabel, diff.years]] as [string,number][]).map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label === content.daysLabel && excludeWeekends ? content.workingDays : label}</p><p className="mt-2 text-2xl font-semibold text-white">{value.toLocaleString()}</p></div>
                    ))}
                  </div>
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
                <h2 className="text-2xl font-bold text-white">{content.articleTitle1}</h2>
                {content.article1.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle2}</h2>
                {content.article2.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle3}</h2>
                {content.article3.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
                {content.article3List && (
                  <ul className="mt-3 space-y-2 text-white/70">
                    {content.article3List.map((item: { label: string; text: string }, i: number) => (
                      <li key={i} className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span><strong className="text-white">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle4}</h2>
                {content.article4.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle5}</h2>
                {content.article5.map((p: string, i: number) => (
                  <p key={i} className="mt-3 leading-7">{p}</p>
                ))}
                {content.article5List && (
                  <ul className="mt-3 space-y-3 text-white/70">
                    {content.article5List.map((item: { label: string; text: string }, i: number) => (
                      <li key={i}><strong className="text-white">{item.label}:</strong> {item.text}</li>
                    ))}
                  </ul>
                )}
                {content.article5Footer && (
                  <p className="mt-4 leading-7">{content.article5Footer}</p>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.faqTitle}</h2>
                <div className="mt-4 space-y-5">
                  {content.faq.map((item: { q: string; a: string }, i: number) => (
                    <div key={i}>
                      <h3 className="font-semibold text-white">{item.q}</h3>
                      <p className="mt-1 text-white/70">{item.a}</p>
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
            <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3"><CalendarRange className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.useCasesTitle}</h2><p className="text-sm text-neutral-300">{content.useCasesSubtitle}</p></div></div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.useCases.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{RIGHT_COPY[locale].suggestionsTitle}</h3>
              <p className="mt-1 text-xs text-white/55">{RIGHT_COPY[locale].suggestionsSubtitle}</p>
              <div className="mt-3 space-y-2">
                {RIGHT_COPY[locale].suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title[locale] === name);
                  return (
                    <button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
