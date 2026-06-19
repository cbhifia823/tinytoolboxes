import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, BadgeDollarSign, Bone, BookOpen, Building2, CalendarDays, CalendarRange, Calculator, Cat, Clock, Dog, DollarSign, FileType, Flame, Flower2, Globe2, HeartPulse, Home, Link2, Percent, RotateCw, Scale, Search, Sparkles, Grid3X3 } from "lucide-react";
import PetsHome from "./_pets-home";

type LocaleKey = "en" | "zh-hk" | "zh-cn" | "es";

const LOCALES: Array<{ id: LocaleKey; label: string }> = [
  { id: "en", label: "EN" },
  { id: "zh-hk", label: "繁" },
  { id: "zh-cn", label: "简" },
  { id: "es", label: "ES" },
];

const COPY: Record<LocaleKey, {
  collection: string;
  title: string;
  subtitle: string;
  heroNote: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHints: string[];
  sectionTitle: string;
  sectionSubtitle: string;
  footer: string;
  searchFooter: string;
  article: {
    intro: { heading: string; paragraphs: string[] };
    sections: Array<{ heading: string; intro?: string; items?: Array<{ name: string; text: string }> }>;
    faqHeading: string;
    faqs: Array<{ q: string; a: string }>;
  };
}> = {
  en: {
    collection: "TinyToolboxes collection",
    title: "Boring single-purpose websites",
    subtitle: "Useful tools for quick answers. Pick one and get on with your day.",
    heroNote: "A small set of practical tools.",
    searchLabel: "Search the collection",
    searchPlaceholder: "Try: age, date, weight, words",
    searchHints: ["age", "date", "weight", "words"],
    sectionTitle: "Tools",
    sectionSubtitle: "Direct tools, grouped by what people actually need.",
    footer: "TinyToolboxes",
    searchFooter: "Search to jump to a tool.",
    article: {
      intro: {
        heading: "What is TinyToolboxes?",
        paragraphs: [
          "TinyToolboxes is a free collection of single-purpose web tools built for quick, accurate answers. Every tool on this site does exactly one job — no clutter, no account required, no subscription. Whether you need to calculate a shipping quote, convert currencies with live rates, or count words in an essay, you can get your answer in seconds and move on with your day.",
          "The tools are organized into four categories: calculators, converters, logistics tools, and text and language utilities. Each tool is built to be fast, mobile-friendly, and understandable without any instructions.",
        ],
      },
      sections: [
        {
          heading: "Calculators",
          intro: "The calculator collection handles everyday arithmetic and date math that would otherwise require a spreadsheet or significant mental effort.",
          items: [
            { name: "Age Calculator", text: "Enter a birthdate and get the exact age in years, months, and days. Also shows how many days until the next birthday. Useful for birthday planning, age verification, legal documents, and medical intake forms." },
            { name: "Date Difference Calculator", text: "Find the precise number of calendar days, business days, weeks, months, and years between any two dates. Supports optional exclusion of weekends. Used for project timelines, contract deadlines, and anniversary counting." },
            { name: "Business Day Calculator", text: "Counts working days between two dates with full support for public holidays in over 50 countries. Three modes: count days between dates, add business days to a start date, or subtract back from a target date." },
            { name: "Percentage Calculator", text: "Solves three classic percentage problems: what is X% of Y, what percent is X of Y, and what is the percentage change from X to Y. Handles tip calculations, discounts, tax rates, and growth comparisons." },
            { name: "Loan Calculator", text: "Computes monthly payment, total payment, and total interest for any fixed-rate loan. Also generates a full amortization schedule showing the principal and interest breakdown for every payment over the loan term." },
          ],
        },
        {
          heading: "Converters",
          intro: "The converter tools translate values between different units, currencies, and formats without any manual formula lookup.",
          items: [
            { name: "Currency Converter", text: "Converts between 30+ world currencies using live exchange rates. Rates are fetched in real time, making this tool accurate for travel budgeting, international invoicing, and cross-border shopping. Covers USD, EUR, GBP, JPY, HKD, CNY, CAD, AUD, CHF, SGD, and many more." },
            { name: "Unit Converter", text: "Handles six measurement categories in a single interface: length (metres, feet, inches, miles, kilometres), weight (kilograms, pounds, ounces, grams), temperature (Celsius, Fahrenheit, Kelvin), volume (litres, gallons, cups, fluid ounces), speed (km/h, mph, m/s, knots), and area (square metres, square feet, acres, hectares)." },
            { name: "Time Zone Converter", text: "Shows the same moment in time across multiple cities simultaneously. Supports 20 popular time zones and lets you add or remove zones as needed. Useful for scheduling international calls, planning travel departures, and coordinating remote teams." },
            { name: "URL Encoder / Decoder", text: "Converts special characters in web addresses (spaces, ampersands, quotes, accented letters) to their percent-encoded form and vice versa. Encodes and decodes simultaneously so you can see both formats at once." },
          ],
        },
        {
          heading: "Logistics Tools",
          intro: "The logistics section focuses on dimensional weight — the pricing method used by major shipping carriers to charge for bulky, lightweight packages.",
          items: [
            { name: "Volumetric Weight Calculator", text: "Computes dimensional (DIM) weight for any parcel using the correct divisor for UPS, FedEx, DHL, or a generic divisor for air freight. Supports both centimetres and inches. When you ship a large but light box, carriers charge by volume rather than actual weight — this tool shows you which weight you'll be billed for." },
            { name: "UPS Dimensional Weight Calculator", text: "Dedicated calculator using UPS's official divisor of 5,000 (cm) or 139 (inches). Includes guidance on how UPS applies dimensional weight and when it applies." },
            { name: "FedEx Dimensional Weight Calculator", text: "Uses FedEx's divisor of 5,000 (cm) or 139 (inches). Explains FedEx's dimensional weight policy and how to calculate it for both domestic and international shipments." },
            { name: "DHL Dimensional Weight Calculator", text: "Applies DHL's divisor of 5,000 (cm) or 139 (inches). Covers DHL Express, DHL Parcel, and international freight calculations." },
            { name: "Invoice Due Date Calculator", text: "Calculates the exact due date for an invoice based on payment terms like Net 15, Net 30, Net 45, or Net 60. Can calculate using calendar days or business days only, with holiday support." },
          ],
        },
        {
          heading: "Text and Language Tools",
          items: [
            { name: "Word Counter", text: "Analyzes any pasted text and returns word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time. Popular with writers, students, bloggers, and content marketers who need to hit or stay within specific length targets." },
            { name: "Rhyme Zone", text: "Finds rhymes, near rhymes (words that sound similar), synonyms, antonyms, and semantically related words for any input. Powered by a large linguistic database. Useful for songwriters, poets, crossword enthusiasts, and anyone searching for the right word." },
          ],
        },
      ],
      faqHeading: "Frequently Asked Questions",
      faqs: [
        { q: "Are these tools free to use?", a: "Yes, completely free. No account, no sign-up, and no hidden fees. The site is supported by ads." },
        { q: "Do you store the data I enter?", a: "No. All calculations happen in your browser. Nothing you type into any tool is sent to or stored on any server (except for the Rhyme Zone, which queries a public word database)." },
        { q: "How accurate are the currency exchange rates?", a: "The Currency Converter fetches live rates from the Open Exchange Rates API. Rates are updated continuously. For large financial transactions, always verify with your bank or broker before executing." },
        { q: "Which countries are supported by the Business Day Calculator?", a: "The Business Day Calculator supports public holidays in over 50 countries including the United States, United Kingdom, Canada, Australia, Hong Kong, Singapore, Germany, France, Japan, China, and many more." },
        { q: "Can I use TinyToolboxes on my phone?", a: "Yes. All tools are fully responsive and work on any screen size — phones, tablets, and desktops." },
      ],
    },
  },
  "zh-hk": {
    collection: "TinyToolboxes 系列",
    title: "無聊但實用嘅單一功能網站",
    subtitle: "專門做搜尋流量、快速答案同清晰結果嘅小工具集合。",
    heroNote: "夠快、夠無聊、夠實用。",
    searchLabel: "搜尋系列",
    searchPlaceholder: "例如：體積重量、日期、字數、URL、押韻",
    searchHints: ["體積重量", "日期", "字數", "URL", "押韻"],
    sectionTitle: "工具",
    sectionSubtitle: "點任何一頁都可以打開一個單一功能工具。",
    footer: "TinyToolboxes",
    searchFooter: "搜尋提示會放喺每頁底部。",
    article: {
      intro: {
        heading: "咩係 TinyToolboxes?",
        paragraphs: [
          "TinyToolboxes 係一組免費嘅單一功能網頁工具，專門畀人快速搵到準確答案。每個工具都只做一件事——冇多餘嘢、唔使註冊、冇月費。無論你想計運費報價、用即時匯率換錢，定係數一篇文嘅字數，幾秒之內搞掂，就可以繼續做你嘅嘢。",
          "工具主要分成四大類：計算器、轉換器、物流工具，同埋文字及語言工具。每個工具都做齊要快、要手機 friendly、唔使睇說明都識用呢三樣嘢。",
        ],
      },
      sections: [
        {
          heading: "計算器",
          intro: "計算器系列處理日常生活同日期上嘅算術，呢啲嘢平時要開試算表或者諗好耐先做到。",
          items: [
            { name: "年齡計算器", text: "輸入生日，即刻攞到你嘅準確年齡（年、月、日），同埋距離下次生日仲有幾多日。適合用嚟確認生日、表格填寫、法律文件、入院資料。"},
            { name: "日期差計算器", text: "計兩個日期之間準確嘅日數、工作日、星期、月份同年份，可以揀排走週末。常用喺項目時間線、合約期限、紀念日計算。"},
            { name: "工作日計算器", text: "計兩個日期之間嘅工作日，支援 50 個國家以上嘅公眾假期。三種模式：兩日期間計日數、開始日加工作日推算結束日、或者由結束日反推開始日。"},
            { name: "百分比計算器", text: "解決三個經典百分比問題：X% of Y 係幾多、X 係 Y 嘅幾多 percent、X 到 Y 嘅升跌幅幾多 %。適用喺貼士、折扣、稅率、增長比較。"},
            { name: "貸款計算器", text: "計任何定息貸款嘅每月還款額、總還款額同總利息。會出埋完整還款時間表，列晒每期本金利錢分開幾多。"},
          ],
        },
        {
          heading: "轉換器",
          intro: "轉換器幫你喺唔同單位、貨幣、格式之間翻譯數值，唔使自己查公式。",
          items: [
            { name: "貨幣轉換器", text: "支援 30 種以上世界貨幣，用即時匯率換算。匯率實時更新，啱用喺旅行預算、跨國報價、跨境網購。覆蓋 USD、EUR、GBP、JPY、HKD、CNY、CAD、AUD、CHF、SGD 等等。"},
            { name: "單位轉換器", text: "同一個介面處理六大類量度：長度（米、英尺、吋、里、公里）、重量（公斤、磅、安士、克）、溫度（攝氏、華氏、開氏）、容量（升、加侖、杯、液量安士）、速度（km/h、mph、m/s、knot）、面積（平方米、平方呎、英畝、公頃）。"},
            { name: "時區轉換器", text: "同一時間喺多個城市並排顯示。支援 20 個常用時區，可以自由加減。啱用嚟排跨國電話、計出發時間、遙距團隊協調。"},
            { name: "URL 編解碼", text: "將網址入面嘅特別字元（空格、&、引號、有腔調嘅字母）轉做 % 編碼，反方向都一樣。編碼同解碼並排顯示，兩個格式一次過睇。"},
          ],
        },
        {
          heading: "物流工具",
          intro: "物流部分集中講體積重（dimensional weight），即係主要快遞公司點樣收大件輕貨嘅嗰種計法。",
          items: [
            { name: "體積重量計算器", text: "用 UPS、FedEx、DHL 或者通用空運嘅正確除數，計任何包裹嘅體積重。cm 同吋都支援。當你寄大件但輕嘅箱，快遞會按體積而非實際重量收費——呢個工具幫你睇到實收邊個重。"},
            { name: "UPS 體積重量計算器", text: "專用計算器，用 UPS 官方除數 5,000（cm）或 139（吋）。附 UPS 體積重嘅使用規則同應用情境。"},
            { name: "FedEx 體積重量計算器", text: "用 FedEx 除數 5,000（cm）或 139（吋）。解釋 FedEx 體積重政策，適用於本地同國際件。"},
            { name: "DHL 體積重量計算器", text: "用 DHL 除數 5,000（cm）或 139（吋）。覆蓋 DHL Express、DHL Parcel 同國際貨運。"},
            { name: "發票到期日計算器", text: "用付款條件（Net 15、Net 30、Net 45、Net 60）計出準確到期日。可以用日曆日或者只計工作日，假期規則都支援。"},
          ],
        },
        {
          heading: "文字及語言工具",
          items: [
            { name: "字數統計", text: "貼入任何文字，分析字數、字元數（連／唔連空格）、句數、段數，同埋預計閱讀時間。啱晒寫手、學生、博客、內容行銷需要控制字數嘅人。"},
            { name: "押韻工具", text: "搵押韻、近韻、近義詞、反義詞、同相關詞。背後係一個大型語言庫。啱用嚟寫歌、寫詩、玩填字、搵精準用字。"},
          ],
        },
      ],
      faqHeading: "常見問題",
      faqs: [
        { q: "呢啲工具係咪免費?", a: "係，完全免費。冇註冊、冇登記、冇隱藏收費。靠廣告支持。"},
        { q: "你哋會儲存我輸入嘅嘢嗎?", a: "唔會。所有計算都喺你個瀏覽器入面跑。除咗押韻工具會查公共詞庫之外，你打嘅嘢唔會傳去或者儲喺任何 server。"},
        { q: "匯率有幾準?", a: "貨幣轉換器用 Open Exchange Rates API 攞即時匯率，持續更新。不過大額交易之前，最好同你間銀行或經紀再核實一次。"},
        { q: "工作日計算器支援邊啲國家?", a: "支援 50 個國家以上嘅公眾假期，包括美國、英國、加拿大、澳洲、香港、新加坡、德國、法國、日本、中國等等。"},
        { q: "電話用得唔用得?", a: "用得。所有工具都 responsive，電話、平板、電腦都 work。"},
      ],
    },
  },
  "zh-cn": {
    collection: "TinyToolboxes 系列",
    title: "无聊但实用的单一功能网站",
    subtitle: "专门面向搜索流量、快速答案和清晰结果的小工具集合。",
    heroNote: "够快、够无聊、够实用。",
    searchLabel: "搜索系列",
    searchPlaceholder: "例如：体积重量、日期、字数、URL、押韵",
    searchHints: ["体积重量", "日期", "字数", "URL", "押韵"],
    sectionTitle: "工具",
    sectionSubtitle: "点击任意页面打开一个单一功能工具。",
    footer: "TinyToolboxes",
    searchFooter: "搜索提示会放在每个页面底部。",
    article: {
      intro: {
        heading: "TinyToolboxes 是什么？",
        paragraphs: [
          "TinyToolboxes 是一个免费的单一功能网页工具集合，专门给你拿到快速、准确的答案。每个工具只做一件事 — 没有多余内容、不用注册、没有月费。无论你想算运费报价、即时兑换外币、或者数文章字数，几秒就有答案，不耽误你做正事。",
          "工具分为四大类：计算器、转换器、物流工具、文字和语言工具。每一个都做得快、手机能用、不用看说明就懂。",
        ],
      },
      sections: [
        {
          heading: "计算器",
          intro: "计算器系列处理日常算术和日期数学，省去你打开电子表格或心算的时间。",
          items: [
            { name: "年龄计算器", text: "输入出生日期，拿到你确实的年龄（年、月、日），还会显示距离下次生日还有多少天。适用于生日确认、表格填写、法律文件和医疗申报。" },
            { name: "日期差计算器", text: "计算两个日期之间的天数、工作日、星期、月数和年数，可以选择不计入周末。适用于项目时间表、合同期限和纪念日计算。" },
            { name: "工作日计算器", text: "计算两个日期之间的工作日，支持 50 个以上国家的公众假期。三种模式：两日期间计算工作日、开始日期加工作日、或者从目标日倒推开始日期。" },
            { name: "百分比计算器", text: "解决三个常见百分比问题：Y 的 X% 是多少、X 是 Y 的多少%、以及 X 到 Y 的百分比变化。适用于小费、折扣、税率和增长比较。" },
            { name: "贷款计算器", text: "计算任何定息贷款的每月还款、总还款额和总利息。还会生成完整还款时间表，列出每期还款的本金和利息分布。" },
          ],
        },
        {
          heading: "转换器",
          intro: "转换器工具帮你在不同单位、货币、格式之间换算，不用自己查公式。",
          items: [
            { name: "货币转换器", text: "用即时汇率转换 30 种以上的世界货币。汇率实时更新，适合旅行预算、跨境开票、跨国网购。覆盖美元、欧元、英镑、日元、港币、人民币、加币、澳元、瑞士法郎、新加坡元等。" },
            { name: "单位转换器", text: "一个界面处理六类度量：长度（米、英尺、英寸、英里、公里）、重量（公斤、磅、盎司、克）、温度（摄氏、华氏、绝对温标）、容量（升、加仑、杯、液量盎司）、速度（km/h、mph、m/s、节）、面积（平方米、平方英尺、英亩、公顷）。" },
            { name: "时区转换器", text: "同一时间显示在不同的城市，方便比较。支持 20 个常用时区，可以随意增减。适用于安排跨国电话、规划行程、协调远程团队。" },
            { name: "URL 编解码器", text: "将网址里的特殊字符（空格、&、引号、带变音符的字母）转为百分号编码，反过来也行。实时显示两种格式，方便对照。" },
          ],
        },
        {
          heading: "物流工具",
          intro: "物流工具集中在体积重量 — 各大快递公司用来对「大件轻货」计费的方法。",
          items: [
            { name: "体积重量计算器", text: "用 UPS、FedEx、DHL 的正确除数，或者通用航空货运除数，计算任何包裹的体积（DIM）重量。支持厘米和英寸。当你寄大箱轻货时，快递公司会按体积而不是实际重量收费 — 这个工具会显示给你看会怎么计费。" },
            { name: "UPS 体积重量计算器", text: "专用计算器，用 UPS 官方除数 5,000（cm）或 139（英寸）。附 UPS 体积重量应用指引。" },
            { name: "FedEx 体积重量计算器", text: "用 FedEx 除数 5,000（cm）或 139（英寸）。解释 FedEx 的体积重量政策，以及本地、国际件的算法。" },
            { name: "DHL 体积重量计算器", text: "用 DHL 除数 5,000（cm）或 139（英寸）。覆盖 DHL Express、DHL Parcel 和国际货运计算。" },
            { name: "发票到期日计算器", text: "根据 Net 15、Net 30、Net 45 或 Net 60 等付款条款，算出发票的确实到期日。可选日历日或仅工作日（已计入公众假期）。" },
          ],
        },
        {
          heading: "文字和语言工具",
          items: [
            { name: "字数统计", text: "分析你粘贴的文字，给你字数、字符数（带和不带空格）、句数、段数和预计阅读时间。适合写作者、学生、博主和内容营销要控制字数的人。" },
            { name: "押韵工具", text: "找押韵、近音韵、同义词、反义词和相关词。背后是大型语言数据库。适合作词人、诗人、填字游戏爱好者、和想找最贴切字眼的人。" },
          ],
        },
      ],
      faqHeading: "常见问题",
      faqs: [
        { q: "这些工具真的免费吗？", a: "是的，完全免费。没有账号、不用注册、没有隐藏费用。网站靠广告支持。" },
        { q: "会储存我输入的内容吗？", a: "不会。所有计算都在你的浏览器里运行，你输入的内容不会上传到或储存在任何服务器（押韵工具除外，它会查询公共词库）。" },
        { q: "货币汇率有多准？", a: "货币转换器使用 Open Exchange Rates API 获取实时汇率，持续更新。大额交易请向银行或经纪核实。" },
        { q: "工作日计算器支持哪些国家？", a: "支持 50 个以上国家的公众假期，包括美国、英国、加拿大、澳大利亚、香港、新加坡、德国、法国、日本、中国等等。" },
        { q: "手机上能用吗？", a: "可以。所有工具都做了完整响应式，手机、平板、电脑都能用。" },
      ],
    },
  },
  es: {
    collection: "Colección TinyToolboxes",
    title: "Sitios web aburridos de un solo propósito",
    subtitle: "Una pequeña colección de herramientas útiles pensadas para búsquedas, respuestas rápidas y cero relleno.",
    heroNote: "Rápido, aburrido y útil.",
    searchLabel: "Buscar la colección",
    searchPlaceholder: "Prueba: weight, date, word, url, rhyme",
    searchHints: ["weight", "date", "word", "url", "rhyme"],
    sectionTitle: "Herramientas",
    sectionSubtitle: "Abre cualquier página para usar una herramienta de un solo propósito.",
    footer: "TinyToolboxes",
    searchFooter: "Las sugerencias de búsqueda están al final de cada página.",
    article: {
      intro: {
        heading: "¿Qué es TinyToolboxes?",
        paragraphs: [
          "TinyToolboxes es una colección gratuita de herramientas web de un solo propósito, creadas para darte respuestas rápidas y precisas. Cada herramienta hace exactamente una cosa: sin ruido, sin cuenta, sin suscripción. Ya sea calcular una tarifa de envío, convertir divisas al instante o contar palabras de un texto, recibes la respuesta en segundos y sigues con tu día.",
          "Las herramientas están organizadas en cuatro categorías: calculadoras, conversores, herramientas de logística y herramientas de texto e idioma. Cada una es rápida, apta para móvil y entendible sin instrucciones.",
        ],
      },
      sections: [
        {
          heading: "Calculadoras",
          intro: "La colección de calculadoras cubre aritmética diaria y matemáticas de fechas que, de otro modo, requerirían una hoja de cálculo o un buen rato de cuentas.",
          items: [
            { name: "Calculadora de edad", text: "Introduce una fecha de nacimiento y obtén la edad exacta en años, meses y días. También muestra cuántos días faltan para el próximo cumpleaños. Útil para planificar cumpleaños, verificación de edad, documentos legales y formularios médicos." },
            { name: "Calculadora de diferencia de fechas", text: "Encuentra el número exacto de días naturales, días hábiles, semanas, meses y años entre dos fechas. Permite excluir fines de semana. Útil para cronogramas de proyectos, plazos contractuales y aniversarios." },
            { name: "Calculadora de días hábiles", text: "Cuenta días laborables entre dos fechas con compatibilidad con festivos públicos de más de 50 países. Tres modos: contar días entre fechas, sumar días hábiles a una fecha de inicio, o restar desde una fecha objetivo." },
            { name: "Calculadora de porcentajes", text: "Resuelve tres problemas clásicos: ¿cuánto es el X% de Y?, ¿qué porcentaje es X de Y? y ¿cuál es la variación porcentual de X a Y?. Cubre propinas, descuentos, impuestos y comparaciones de crecimiento." },
            { name: "Calculadora de préstamos", text: "Calcula la cuota mensual, el pago total y los intereses totales de cualquier préstamo a tipo fijo. También genera un cuadro de amortización completo con el desglose de capital e intereses de cada cuota." },
          ],
        },
        {
          heading: "Conversores",
          intro: "Los conversores trasladan valores entre distintas unidades, divisas y formatos, sin que tengas que buscar fórmulas.",
          items: [
            { name: "Conversor de divisas", text: "Convierte entre más de 30 monedas mundiales con tipos de cambio en vivo. Las tasas se actualizan en tiempo real, por lo que es preciso para presupuestos de viaje, facturación internacional y compras transfronterizas. Cubre USD, EUR, GBP, JPY, HKD, CNY, CAD, AUD, CHF, SGD y muchas más." },
            { name: "Conversor de unidades", text: "Reúne seis categorías de medida en una sola interfaz: longitud (metros, pies, pulgadas, millas, kilómetros), peso (kilogramos, libras, onzas, gramos), temperatura (Celsius, Fahrenheit, Kelvin), volumen (litros, galones, tazas, onzas líquidas), velocidad (km/h, mph, m/s, nudos) y área (metros cuadrados, pies cuadrados, acres, hectáreas)." },
            { name: "Conversor de zonas horarias", text: "Muestra el mismo momento en distintas ciudades a la vez. Soporta 20 zonas populares y permite añadir o quitar zonas. Útil para coordinar llamadas internacionales, planificar viajes y coordinar equipos remotos." },
            { name: "Codificador / decodificador de URL", text: "Convierte caracteres especiales en direcciones web (espacios, &, comillas, letras acentuadas) a su forma codificada en porcentaje, y viceversa. Codifica y decodifica a la vez, para ver ambos formatos." },
          ],
        },
        {
          heading: "Herramientas de logística",
          intro: "La sección de logística se centra en el peso volumétrico, el método de tarificación que usan las grandes paqueterías para cobrar paquetes voluminosos pero ligeros.",
          items: [
            { name: "Calculadora de peso volumétrico", text: "Calcula el peso dimensional (DIM) de cualquier paquete con el divisor correcto para UPS, FedEx, DHL o un divisor genérico para carga aérea. Soporta centímetros y pulgadas. Cuando envías una caja grande y ligera, las paqueterías cobran por volumen y no por peso real; esta herramienta te muestra por qué peso te cobrarán." },
            { name: "Calculadora de peso volumétrico UPS", text: "Calculadora dedicada con el divisor oficial de UPS: 5.000 (cm) o 139 (pulgadas). Incluye orientación sobre cómo y cuándo UPS aplica el peso dimensional." },
            { name: "Calculadora de peso volumétrico FedEx", text: "Usa el divisor de FedEx: 5.000 (cm) o 139 (pulgadas). Explica la política de FedEx y cómo calcularlo tanto para envíos nacionales como internacionales." },
            { name: "Calculadora de peso volumétrico DHL", text: "Aplica el divisor de DHL: 5.000 (cm) o 139 (pulgadas). Cubre DHL Express, DHL Parcel y cálculos de carga internacional." },
            { name: "Calculadora de fecha de vencimiento de facturas", text: "Calcula la fecha exacta de vencimiento de una factura según condiciones como Net 15, Net 30, Net 45 o Net 60. Puede calcularse en días naturales o solo días hábiles, con soporte de festivos." },
          ],
        },
        {
          heading: "Herramientas de texto e idioma",
          items: [
            { name: "Contador de palabras", text: "Analiza cualquier texto pegado y devuelve el número de palabras, caracteres (con y sin espacios), oraciones, párrafos y tiempo de lectura estimado. Muy usado por escritores, estudiantes, bloggers y profesionales de marketing de contenidos que necesitan cumplir objetivos de longitud." },
            { name: "Rimador (Rhyme Zone)", text: "Encuentra rimas, casi rimas (palabras con sonido parecido), sinónimos, antónimos y palabras relacionadas. Respaldado por una gran base de datos lingüística. Útil para letristas, poetas, aficionados a los crucigramas y quien busque la palabra exacta." },
          ],
        },
      ],
      faqHeading: "Preguntas frecuentes",
      faqs: [
        { q: "¿Estas herramientas son gratuitas?", a: "Sí, totalmente. Sin cuenta, sin registro y sin costes ocultos. El sitio se mantiene con anuncios." },
        { q: "¿Guardan lo que escribo?", a: "No. Todos los cálculos ocurren en tu navegador. Nada de lo que escribas se envía ni se guarda en ningún servidor (excepto el Rimador, que consulta una base de datos pública de palabras)." },
        { q: "¿Qué tan precisas son las tasas de cambio?", a: "El Conversor de divisas obtiene tasas en vivo de la API de Open Exchange Rates, actualizadas continuamente. Para transacciones grandes, confirma siempre con tu banco o bróker." },
        { q: "¿Qué países soporta la Calculadora de días hábiles?", a: "Soporta festivos públicos de más de 50 países: Estados Unidos, Reino Unido, Canadá, Australia, Hong Kong, Singapur, Alemania, Francia, Japón, China y muchos más." },
        { q: "¿Funciona en el móvil?", a: "Sí. Todas las herramientas son totalmente responsivas y funcionan en cualquier tamaño de pantalla: móviles, tablets y ordenadores." },
      ],
    },
  },
};

const TOOLS: Array<{
  category: string;
  href: string;
  icon: any;
  title: Record<LocaleKey, string>;
  description: Record<LocaleKey, string>;
}> = [
  { category: "logistics", href: "/volumetric-weight-calculator", icon: Scale, title: { en: "Volumetric Weight Calculator", "zh-hk": "體積重量計算機", "zh-cn": "体积重量计算器", es: "Calculadora de peso volumétrico" }, description: { en: "Calculate dimensional weight for parcels and shipping quotes.", "zh-hk": "計運費時用嘅體積重量計數。", "zh-cn": "计算运费用的体积重量。", es: "Calcula el peso volumétrico de paquetes y cotizaciones de envío." } },
  { category: "calculators", href: "/business-day-calculator", icon: CalendarDays, title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Count business days with country holidays and weekend rules.", "zh-hk": "計工作日，支援國家公眾假期同週末規則。", "zh-cn": "计算工作日，支持国家公众假期和周末规则。", es: "Cuenta días laborables con festivos públicos y reglas de fines de semana." } },
  { category: "calculators", href: "/age-calculator", icon: CalendarDays, title: { en: "Age Calculator", "zh-hk": "年齡計算機", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate your exact age in years, months, and days.", "zh-hk": "計你嘅準確年齡（年、月、日）。", "zh-cn": "计算你的确切年龄（年、月、日）。", es: "Calcula tu edad exacta en años, meses y días." } },
  { category: "calculators", href: "/date-difference-calculator", icon: CalendarRange, title: { en: "Date Difference Calculator", "zh-hk": "日期差計算機", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Find the exact number of days, weeks, and months between two dates.", "zh-hk": "計兩個日期之間準確嘅日數、星期、月份同年份。", "zh-cn": "计算两个日期之间的天数、星期、月数和年数。", es: "Encuentra el número exacto de días, semanas y meses entre dos fechas." } },
  { category: "calculators", href: "/percentage-calculator", icon: Percent, title: { en: "Percentage Calculator", "zh-hk": "百分比計算機", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "X% of Y, what percent is X of Y, and percent change.", "zh-hk": "X% of Y 係幾多、X 係 Y 嘅幾多 percent、X 到 Y 嘅升跌幅幾多 %。", "zh-cn": "Y 的 X% 是多少、X 是 Y 的多少%、以及 X 到 Y 的百分比变化。", es: "X% de Y, qué porcentaje es X de Y, y variación porcentual." } },
  { category: "calculators", href: "/loan-calculator", icon: Building2, title: { en: "Loan Calculator", "zh-hk": "貸款計算機", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Monthly payments, total interest, and amortization schedule.", "zh-hk": "計每月還款額、總還款額同總利息。", "zh-cn": "计算每月还款、总还款额和总利息。", es: "Cuota mensual, intereses totales y cuadro de amortización." } },
  { category: "calculators", href: "/invoice-due-date-calculator", icon: Calculator, title: { en: "Invoice Due Date Calculator", "zh-hk": "發票到期日計算機", "zh-cn": "发票到期日计算器", es: "Calculadora de fecha de vencimiento de facturas" }, description: { en: "Work out invoice due dates from terms or end dates.", "zh-hk": "用付款條件（Net 15、Net 30、Net 45、Net 60）計出準確到期日。", "zh-cn": "根据付款条款或结束日期计算发票到期日。", es: "Calcula la fecha de vencimiento de una factura según condiciones o fechas finales." } },
  { category: "converters", href: "/time-zone-converter", icon: Clock, title: { en: "Time Zone Converter", "zh-hk": "時區轉換器", "zh-cn": "时区转换器", es: "Conversor de zonas horarias" }, description: { en: "Convert time between any time zones. Great for remote teams.", "zh-hk": "喺唔同時區之間轉換時間。啱用嚟排跨國電話、計出發時間、遙距團隊協調。", "zh-cn": "在不同时区之间转换时间。适用于远程团队。", es: "Convierte tiempo entre zonas horarias. Ideal para equipos remotos." } },
  { category: "converters", href: "/unit-converter", icon: ArrowLeftRight, title: { en: "Unit Converter", "zh-hk": "單位轉換器", "zh-cn": "单位转换器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature, volume, speed, and area.", "zh-hk": "同一個介面處理六大類量度：長度（米、英尺、吋、里、公里）、重量（公斤、磅、安士、克）、溫度（攝氏、華氏、開氏）、容量（升、加侖、杯、液量安士）、速度（km/h、mph、m/s、knot）、面積（平方米、平方呎、英畝、公頃）。", "zh-cn": "一个界面处理六类度量：长度（米、英尺、英寸、英里、公里）、重量（公斤、磅、盎司、克）、温度（摄氏、华氏、绝对温标）、容量（升、加仑、杯、液量盎司）、速度（km/h、mph、m/s、节）、面积（平方米、平方英尺、英亩、公顷）。", es: "Convierte longitud, peso, temperatura, volumen, velocidad y área." } },
  { category: "converters", href: "/currency-converter", icon: DollarSign, title: { en: "Currency Converter", "zh-hk": "貨幣轉換器", "zh-cn": "货币转换器", es: "Conversor de divisas" }, description: { en: "Convert between 30+ currencies with live exchange rates.", "zh-hk": "支援 30 種以上世界貨幣，用即時匯率換算。", "zh-cn": "用即时汇率转换 30 种以上的世界货币。", es: "Convierte entre más de 30 monedas mundiales con tipos de cambio en vivo." } },
  { category: "text", href: "/word-counter", icon: FileType, title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words, characters, sentences, and reading time.", "zh-hk": "貼入任何文字，分析字數、字元數（連／唔連空格）、句數、段數，同埋預計閱讀時間。", "zh-cn": "分析你粘贴的文字，给你字数、字符数（带和不带空格）、句数、段数和预计阅读时间。", es: "Analiza cualquier texto pegado y devuelve el número de palabras, caracteres, oraciones, párrafos y tiempo de lectura estimado." } },
  { category: "text", href: "/url-encoder-decoder", icon: Link2, title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編解碼", "zh-cn": "URL 编解码器", es: "Codificador / decodificador de URL" }, description: { en: "Encode and decode links instantly.", "zh-hk": "將網址入面嘅特別字元（空格、&、引號、有腔調嘅字母）轉做 % 編碼，反方向都一樣。編碼同解碼並排顯示，兩個格式一次過睇。", "zh-cn": "将网址里的特殊字符（空格、&、引号、带变音符的字母）转为百分号编码，反过来也行。实时显示两种格式，方便对照。", es: "Convierte caracteres especiales en direcciones web (espacios, &, comillas, letras acentuadas) a su forma codificada en porcentaje, y viceversa." } },
  { category: "language", href: "/rhyme-zone", icon: BookOpen, title: { en: "Rhyme Zone", "zh-hk": "押韻工具", "zh-cn": "押韵工具", es: "Rimador (Rhyme Zone)" }, description: { en: "Find rhymes, near rhymes, synonyms, antonyms, and related words.", "zh-hk": "搵押韻、近韻、近義詞、反義詞、同相關詞。背後係一個大型語言庫。啱用嚟寫歌、寫詩、玩填字、搵精準用字。", "zh-cn": "找押韵、近音韵、同义词、反义词和相关词。背后是大型语言数据库。适合作词人、诗人、填字游戏爱好者、和想找最贴切字眼的人。", es: "Encuentra rimas, casi rimas, sinónimos, antónimos y palabras relacionadas." } },
  { category: "logistics", href: "/ups-dimensional-weight-calculator", icon: BadgeDollarSign, title: { en: "UPS Dimensional Weight Calculator", "zh-hk": "UPS 體積重量計算機", "zh-cn": "UPS 体积重量计算器", es: "Calculadora de peso volumétrico UPS" }, description: { en: "A focused UPS landing page for dimensional weight.", "zh-hk": "專用計算器，用 UPS 官方除數 5,000（cm）或 139（吋）。附 UPS 體積重嘅使用規則同應用情境。", "zh-cn": "专用计算器，用 UPS 官方除数 5,000（cm）或 139（英寸）。附 UPS 体积重量应用指引。", es: "Calculadora dedicada con el divisor oficial de UPS: 5.000 (cm) o 139 (pulgadas)." } },
  { category: "logistics", href: "/fedex-dimensional-weight-calculator", icon: BadgeDollarSign, title: { en: "FedEx Dimensional Weight Calculator", "zh-hk": "FedEx 體積重量計算機", "zh-cn": "FedEx 体积重量计算器", es: "Calculadora de peso volumétrico FedEx" }, description: { en: "A focused FedEx landing page for dimensional weight.", "zh-hk": "用 FedEx 除數 5,000（cm）或 139（吋）。解釋 FedEx 體積重政策，適用於本地同國際件。", "zh-cn": "用 FedEx 除数 5,000（cm）或 139（英寸）。解释 FedEx 的体积重量政策，以及本地、国际件的算法。", es: "Usa el divisor de FedEx: 5.000 (cm) o 139 (pulgadas)." } },
  { category: "logistics", href: "/dhl-dimensional-weight-calculator", icon: BadgeDollarSign, title: { en: "DHL Dimensional Weight Calculator", "zh-hk": "DHL 體積重量計算機", "zh-cn": "DHL 体积重量计算器", es: "Calculadora de peso volumétrico DHL" }, description: { en: "A focused DHL landing page for dimensional weight.", "zh-hk": "用 DHL 除數 5,000（cm）或 139（吋）。覆蓋 DHL Express、DHL Parcel 同國際貨運。", "zh-cn": "用 DHL 除数 5,000（cm）或 139（英寸）。覆盖 DHL Express、DHL Parcel 和国际货运计算。", es: "Aplica el divisor de DHL: 5.000 (cm) o 139 (pulgadas)." } },
  { category: "health", href: "/bmi-calculator", icon: HeartPulse, title: { en: "BMI Calculator", "zh-hk": "BMI 計算機", "zh-cn": "BMI 计算器", es: "Calculadora de IMC" }, description: { en: "Calculate BMI and healthy weight range for adults.", "zh-hk": "計 BMI 同健康體重範圍。", "zh-cn": "计算 BMI 和健康体重范围。", es: "Calcula el IMC y el rango de peso saludable para adultos." } },
  { category: "health", href: "/calorie-calculator", icon: Flame, title: { en: "Calorie Calculator (TDEE)", "zh-hk": "卡路里計算機（TDEE）", "zh-cn": "卡路里计算器（TDEE）", es: "Calculadora de calorías (TDEE)" }, description: { en: "Daily calorie needs using BMR and TDEE for weight goals.", "zh-hk": "計每日卡路里需要，用 BMR 同 TDEE 嚟定體重目標。", "zh-cn": "每日热量需求，使用 BMR 和 TDEE 设定体重目标。", es: "Necesidades diarias de calorías usando BMR y TDEE para metas de peso." } },
  { category: "finance", href: "/mortgage-calculator-australia", icon: Home, title: { en: "Mortgage Calculator (Australia)", "zh-hk": "按揭計算機（澳洲）", "zh-cn": "房贷计算器（澳大利亚）", es: "Calculadora de hipoteca (Australia)" }, description: { en: "Australian home loan repayments, stamp duty, and LMI.", "zh-hk": "計澳洲按揭還款、印花稅同 LMI。", "zh-cn": "澳大利亚房贷还款、印花税和 LMI。", es: "Repagos de hipoteca, impuesto de sellos y LMI en Australia." } },
  { category: "pets", href: "/dog-age-calculator", icon: Dog, title: { en: "Dog Age in Human Years", "zh-hk": "狗嘅年齡（以人類年齡計）", "zh-cn": "狗年龄（以人类年龄计）", es: "Edad del perro en años humanos" }, description: { en: "Convert dog age using the UCSD DNA-methylation formula.", "zh-hk": "用 UCSD DNA 甲基化公式計狗嘅年齡。", "zh-cn": "使用 UCSD DNA 甲基化公式转换狗年龄。", es: "Convierte la edad del perro usando la fórmula de metilación del ADN de UCSD." } },
  { category: "pets", href: "/cat-age-calculator", icon: Cat, title: { en: "Cat Age in Human Years", "zh-hk": "貓嘅年齡（以人類年齡計）", "zh-cn": "猫年龄（以人类年龄计）", es: "Edad del gato en años humanos" }, description: { en: "Convert cat age using the AAFP/IOM feline life-stage chart.", "zh-hk": "用 AAFP/IOM 貓科生命階段圖計貓嘅年齡。", "zh-cn": "使用 AAFP/IOM 猫科生命阶段图转换猫年龄。", es: "Convierte la edad del gato usando la tabla de etapas de vida felina de AAFP/IOM." } },
  { category: "pets", href: "/pet-calorie-calculator", icon: Bone, title: { en: "Pet Calorie Calculator (RER)", "zh-hk": "寵物卡路里計算機（RER）", "zh-cn": "宠物卡路里计算器（RER）", es: "Calculadora de calorías para mascotas (RER)" }, description: { en: "Daily calorie needs for dogs and cats.", "zh-hk": "計狗同貓嘅每日卡路里需要。", "zh-cn": "每日热量需求，用于狗和猫。", es: "Necesidades diarias de calorías para perros y gatos." } },
  { category: "pets", href: "/can-my-dog-eat", icon: Dog, title: { en: "Can My Dog Eat This?", "zh-hk": "我嘅狗可以食呢啲嗎？", "zh-cn": "我的狗能吃这个吗？", es: "¿Puede mi perro comer esto?" }, description: { en: "Food safety lookup for 50+ common foods.", "zh-hk": "查 50 種以上常見食物嘅食品安全。", "zh-cn": "查找 50 种以上常见食物的食品安全。", es: "Búsqueda de seguridad alimentaria para más de 50 alimentos comunes." } },
  { category: "pets", href: "/chocolate-toxicity-calculator", icon: Dog, title: { en: "Chocolate Toxicity Calculator", "zh-hk": "巧克力毒性計算機", "zh-cn": "巧克力毒性计算器", es: "Calculadora de toxicidad del chocolate" }, description: { en: "Theobromine dose and risk level for dogs.", "zh-hk": "計狗食巧克力嘅可可鹼劑量同風險。", "zh-cn": "计算狗食用巧克力的可可碱剂量和风险等级。", es: "Dosis de teobromina y nivel de riesgo para perros." } },
  { category: "pets", href: "/xylitol-toxicity-calculator", icon: Dog, title: { en: "Xylitol Toxicity Calculator", "zh-hk": "木糖醇毒性計算機", "zh-cn": "木糖醇毒性计算器", es: "Calculadora de toxicidad del xilitol" }, description: { en: "Xylitol risk from gum and sugar-free products for dogs.", "zh-hk": "計狗食木糖醇嘅風險，來自口香糖同無糖產品。", "zh-cn": "计算狗食用木糖醇的风险，来自口香糖和无糖产品。", es: "Riesgo de xilitol en gomas y productos sin azúcar para perros." } },
  { category: "pets", href: "/lily-toxicity-checker", icon: Flower2, title: { en: "Lily Toxicity Checker for Cats", "zh-hk": "貓嘅百合毒性檢查器", "zh-cn": "猫百合毒性检查器", es: "Verificador de toxicidad de lirios para gatos" }, description: { en: "Look up which lilies are deadly for cats.", "zh-hk": "查邊啲百合係致命嘅。", "zh-cn": "查找哪些百合对猫是致命的。", es: "Busca qué lirios son mortales para gatos." } },
  { category: "tools", href: "/wheel-spinner", icon: RotateCw, title: { en: "Wheel Spinner", "zh-hk": "輪盤", "zh-cn": "轮盘", es: "Rueda giratoria" }, description: { en: "Spin a random wheel to pick a name or make a fair decision.", "zh-hk": "轉一個隨機輪盤，揀一個名字或者做一個公平決定。", "zh-cn": "旋转随机轮盘选择名字或做出公平决定。", es: "Gira una rueda aleatoria para elegir un nombre o tomar una decisión justa." } },
  { category: "games", href: "/minesweeper", icon: Grid3X3, title: { en: "Minesweeper", "zh-hk": "掃雷", "zh-cn": "扫雷", es: "Minesweeper" }, description: { en: "Play a classic game of Minesweeper.", "zh-hk": "玩經典掃雷遊戲。", "zh-cn": "玩经典扫雷游戏。", es: "Juega al clásico juego de Minesweeper." } },
];

const SITE_URL = "https://www.tinytoolboxes.com";

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

const GROUPS: Array<{ id: string; title: Record<LocaleKey, string>; items: string[] }> = [
  { id: "calculators", title: { en: "Calculators", "zh-hk": "計算器", "zh-cn": "计算器", es: "Calculadoras" }, items: ["/age-calculator", "/date-difference-calculator", "/business-day-calculator", "/volumetric-weight-calculator", "/loan-calculator", "/percentage-calculator", "/invoice-due-date-calculator"] },
  { id: "converters", title: { en: "Converters", "zh-hk": "轉換器", "zh-cn": "转换器", es: "Conversores" }, items: ["/currency-converter", "/unit-converter", "/time-zone-converter", "/url-encoder-decoder"] },
  { id: "health", title: { en: "Health", "zh-hk": "健康", "zh-cn": "健康", es: "Salud" }, items: ["/bmi-calculator", "/calorie-calculator"] },
  { id: "finance", title: { en: "Finance", "zh-hk": "財務", "zh-cn": "财务", es: "Finanzas" }, items: ["/mortgage-calculator-australia"] },
  { id: "pets", title: { en: "Pets", "zh-hk": "寵物", "zh-cn": "宠物", es: "Mascotas" }, items: ["/dog-age-calculator", "/cat-age-calculator", "/pet-calorie-calculator", "/can-my-dog-eat", "/chocolate-toxicity-calculator", "/xylitol-toxicity-calculator", "/lily-toxicity-checker"] },
  { id: "text", title: { en: "Text & Language", "zh-hk": "文字及語言", "zh-cn": "文字和语言", es: "Texto e idioma" }, items: ["/word-counter", "/rhyme-zone"] },
  { id: "tools", title: { en: "Tools", "zh-hk": "工具", "zh-cn": "工具", es: "Herramientas" }, items: ["/wheel-spinner"] },
  { id: "games", title: { en: "Games", "zh-hk": "遊戲", "zh-cn": "游戏", es: "Juegos" }, items: ["/minesweeper"] },
];

const CATEGORIES = [
  { id: "calculators", label: { en: "Calculators", "zh-hk": "計算器", "zh-cn": "计算器", es: "Calculadoras" } },
  { id: "converters", label: { en: "Converters", "zh-hk": "轉換器", "zh-cn": "转换器", es: "Conversores" } },
  { id: "health", label: { en: "Health", "zh-hk": "健康", "zh-cn": "健康", es: "Salud" } },
  { id: "finance", label: { en: "Finance", "zh-hk": "財務", "zh-cn": "财务", es: "Finanzas" } },
  { id: "pets", label: { en: "Pets", "zh-hk": "寵物", "zh-cn": "宠物", es: "Mascotas" } },
  { id: "text", label: { en: "Text tools", "zh-hk": "文字工具", "zh-cn": "文字工具", es: "Herramientas de texto" } },
  { id: "logistics", label: { en: "Logistics", "zh-hk": "物流工具", "zh-cn": "物流工具", es: "Logística" } },
  { id: "language", label: { en: "Language", "zh-hk": "語言工具", "zh-cn": "语言工具", es: "Idioma" } },
  { id: "tools", label: { en: "Tools", "zh-hk": "工具", "zh-cn": "工具", es: "Herramientas" } },
  { id: "games", label: { en: "Games", "zh-hk": "遊戲", "zh-cn": "游戏", es: "Juegos" } },
] as const;

function Header({ locale, onLocaleChange }: { locale: LocaleKey; onLocaleChange: (locale: LocaleKey) => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071018]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-black text-slate-950 shadow-lg shadow-emerald-900/30">TT</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-wide text-white">TinyToolboxes</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-200">Collection</span>
            </div>
            <p className="text-sm text-white/50">Boring, useful, searchable.</p>
          </div>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          {LOCALES.map((item) => (
            <button
              key={item.id}
              onClick={() => onLocaleChange(item.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${locale === item.id ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-100" : "border-white/10 bg-white/5 text-white/65 hover:border-emerald-300/30 hover:text-white"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SearchBar({ locale }: { locale: LocaleKey }) {
  const copy = COPY[locale];
  const [query, setQuery] = useState("");
  const filtered = TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-300">{copy.searchLabel}</p>
          <p className="mt-1 text-sm text-white/60">{copy.searchFooter}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <Search className="h-4 w-4 text-emerald-300" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.searchPlaceholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {copy.searchHints.map((hint) => (
          <button key={hint} onClick={() => setQuery(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-emerald-300/40 hover:bg-emerald-300/10">
            {hint}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <a key={tool.href} href={tool.href} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-emerald-300/40 hover:bg-white/5">
              <div className="rounded-xl bg-emerald-300/10 p-2 text-emerald-200"><Icon className="h-4 w-4" /></div>
              <div className="min-w-0">
                <p className="font-medium text-white group-hover:text-emerald-100">{tool.title[locale]}</p>
                <p className="mt-1 text-sm text-white/55">{tool.description[locale]}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function MainHomePage() {
  const [locale, setLocale] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("ttb-locale");
    return (saved as string) || "en";
  });

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const copy = COPY[locale];
    applySEO({
      title: `${copy.title} | TinyToolboxes`,
      description: copy.subtitle,
      path: "/",
      jsonLd: [
        { "@context": "https://schema.org", "@type": "WebSite", name: "TinyToolboxes", url: SITE_URL, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/?q={search_term_string}`, "query-input": "required name=search_term_string" } },
        { "@context": "https://schema.org", "@type": "ItemList", itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title[locale], url: SITE_URL + t.href })) },
      ],
    });
  }, [locale]);

  const copy = COPY[locale];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#163028_0%,#091016_28%,#05070b_100%)] text-white">
      <Header locale={locale} onLocaleChange={setLocale} />
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-emerald-200">
            <Sparkles className="h-4 w-4" />
            <span>{copy.collection}</span>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">{copy.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Free to use</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">No sign-up required</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Works on any device</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">EN · 繁 · 简 · ES</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{copy.sectionTitle}</h2>
                  <p className="mt-1 text-sm text-white/60">{copy.sectionSubtitle}</p>
                </div>
                <a href="/volumetric-weight-calculator" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-emerald-300/40 hover:bg-emerald-300/10">
                  Start with the calculator <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {GROUPS.map((group) => (
                  <section key={group.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <h2 className="text-lg font-semibold text-white">{group.title[locale]}</h2>
                    <div className="mt-4 space-y-2">
                      {group.items.map((href) => {
                        const tool = TOOLS.find((t) => t.href === href);
                        if (!tool) return null;
                        return (
                          <a key={href} href={tool.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 transition hover:border-emerald-300/30 hover:bg-emerald-300/10 hover:text-white">
                            <span>{tool.title[locale]}</span>
                            <ArrowRight className="h-4 w-4 text-white/35" />
                          </a>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </section>
            <SearchBar locale={locale} />

            {/* Informational content for SEO */}
            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">{copy.article.intro.heading}</h2>
                {copy.article.intro.paragraphs.map((p) => (
                  <p key={p} className="mt-3 leading-7">{p}</p>
                ))}
              </div>
              {copy.article.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-2xl font-bold text-white">{section.heading}</h2>
                  {section.intro && <p className="mt-3 leading-7">{section.intro}</p>}
                  {section.items && (
                    <ul className="mt-4 space-y-3 text-white/70">
                      {section.items.map((item) => (
                        <li key={item.name}>
                          <strong className="text-white">{item.name}</strong> — {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div>
                <h2 className="text-2xl font-bold text-white">{copy.article.faqHeading}</h2>
                <div className="mt-4 space-y-5">
                  {copy.article.faqs.map((faq) => (
                    <div key={faq.q}>
                      <h3 className="font-semibold text-white">{faq.q}</h3>
                      <p className="mt-1 text-white/70">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-300/10 p-3 text-emerald-200"><Globe2 className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{copy.searchLabel}</h2>
                  <p className="text-sm text-white/60">{copy.searchFooter}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/65">
                {copy.searchHints.map((hint) => (
                  <div key={hint} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{hint}</div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45">
          <span>{copy.footer}</span>
          <span>{copy.searchFooter}</span>
        </footer>
      </section>
    </main>
  );
}

export default function HomePage() {
  const isPets = typeof window !== "undefined" && window.location.hostname.startsWith("pets.");
  return isPets ? <PetsHome /> : <MainHomePage />;
}
