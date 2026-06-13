import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight, BadgeDollarSign, DollarSign, Search } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Currency Converter",
    subtitle: "Convert between 30+ currencies with live exchange rates.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: age, percent, unit, date",
    reserveAd: "Google Ads space reserved",
    amountLabel: "Amount",
    fromLabel: "From",
    toLabel: "To",
    loading: "Loading rates…",
    error: "Could not load rates. Try again.",
    lastUpdated: "Rates updated",
    result: "Result",
    popular: "Popular pairs",
    useCasesTitle: "Use cases",
    useCasesSubtitle: "Everyday conversion jobs.",
    useCases: ["Travel and shopping conversions.", "International invoicing and payroll.", "Cross-border payments and pricing."],
    suggestionsTitle: "You may also like",
    suggestionsSubtitle: "Other tiny tools that pair well with currency work.",
    suggestions: ["Loan Calculator", "Percentage Calculator", "Unit Converter"],
    searchHint: "Search for tools",
    adLabel: "Advertisement",
    adBadge: "Ad",
    faqTitle: "Frequently Asked Questions",
    faq: [
      {
        question: "How often do the exchange rates in this tool update?",
        answer: "Rates are provided by the Open Exchange Rates API and update approximately every hour. The timestamp displayed in the tool shows the time of the last rate update. For live trading or large financial transactions, always confirm rates directly with your bank or broker."
      },
      {
        question: "Why does the rate I get at the bank differ from what this tool shows?",
        answer: "This tool shows the mid-market rate (the midpoint between buy and sell prices), which is the fairest benchmark. Banks and currency exchange services add a markup — called a spread — on top of this rate to make their profit. That spread can range from 0.5% at competitive online services to 8%–15% at airport kiosks. The difference between what you see here and what a provider charges is essentially their fee."
      },
      {
        question: "What is the difference between EUR/USD and USD/EUR?",
        answer: "EUR/USD = 1.09 means 1 Euro buys 1.09 US Dollars (EUR is the base currency). USD/EUR would be the inverse: 1 USD buys approximately 0.917 Euros. In forex convention, the first currency listed is the base and the second is the quote currency. Major pairs always list USD, EUR, GBP, or JPY in a standardised order."
      },
      {
        question: "Can I use this tool to convert cryptocurrencies?",
        answer: "No — this tool covers traditional fiat currencies only. Cryptocurrency prices change much more rapidly than fiat exchange rates and require specialised data sources. For crypto conversions, use a dedicated crypto exchange or market data provider."
      },
      {
        question: "Is the Hong Kong Dollar really pegged to the US Dollar?",
        answer: "Yes. The Hong Kong Dollar has been pegged to the USD within a band of 7.75–7.85 since 1983 under the Linked Exchange Rate System, operated by the Hong Kong Monetary Authority. In practice, HKD/USD trades in a very narrow range around 7.78 and does not fluctuate like free-floating currencies. This peg provides exchange rate stability that is important for Hong Kong's role as an international financial centre."
      },
      {
        question: "What currencies does this tool support?",
        answer: "This converter supports 30 major currencies including USD, EUR, GBP, JPY, CNY, HKD, AUD, CAD, CHF, SGD, KRW, INR, TWD, MYR, THB, IDR, PHP, VND, NZD, SEK, NOK, DKK, MXN, BRL, AED, SAR, ZAR, TRY, RUB, and PLN. These cover most of Asia-Pacific, Europe, the Americas, and the Middle East/Africa region."
      }
    ],
    articleTitle1: "How Currency Exchange Rates Work",
    article1: "An exchange rate is the price of one currency expressed in terms of another. When you see USD/HKD = 7.78, it means 1 US Dollar buys 7.78 Hong Kong Dollars. Exchange rates fluctuate continuously during trading hours as currencies are bought and sold on the global foreign exchange (forex) market, which trades over $7.5 trillion per day — making it the largest financial market in the world.\n\nThere are three types of exchange rates you will encounter in practice:\n\n- Mid-market rate: The midpoint between buy and sell prices. Used by this calculator. Also called the interbank rate or spot rate.\n- Buy rate (bid): The rate at which a bank or currency exchange buys foreign currency from you. Lower than the mid-market rate.\n- Sell rate (ask): The rate at which a bank sells foreign currency to you. Higher than mid-market. The spread is the provider's profit.",
    articleTitle2: "Worked Examples",
    article2: "Understanding conversion is straightforward once you know the formula: <span class=\"font-mono text-emerald-200\">Result = Amount × (Target Rate / Base Rate)</span>. Here are some practical examples using approximate mid-market rates:\n\n- US trip budget in HKD: HKD 10,000 ≈ USD 1,285 (at 7.78)\n- EU invoice paid in USD: EUR 2,500 ≈ USD 2,725 (at 1.09)\n- Japan travel cash: USD 500 ≈ JPY 74,500 (at 149)\n- CNY to HKD remittance: CNY 50,000 ≈ HKD 54,200 (at 1.084)\n\nRates above are illustrative approximations. Use the converter for live rates.",
    articleTitle3: "What Moves Exchange Rates?",
    article3: "Exchange rates are driven by supply and demand for each currency on the global market. Several key factors influence this:\n\n- Interest rates: When a central bank raises interest rates, its currency typically strengthens because higher rates attract foreign investment. The US Federal Reserve's rate decisions move the USD significantly.\n- Inflation: Countries with lower inflation rates tend to see their currencies appreciate. High inflation erodes purchasing power and weakens a currency over time.\n- Economic data: GDP growth, employment figures, trade balance, and manufacturing output reports all signal economic health. Strong data tends to strengthen a currency.\n- Political stability: Currencies of politically stable countries attract investment. Elections, geopolitical conflicts, and policy uncertainty can cause significant currency volatility.\n- Market speculation: Large institutional traders, hedge funds, and algorithmic trading systems can move currencies short-term based on sentiment and positioning.",
    articleTitle4: "Pegged vs. Floating Currencies",
    article4: "Not all currencies float freely. Some governments maintain a fixed or pegged exchange rate against another currency or basket of currencies:\n\n- Hong Kong Dollar (HKD): Pegged to the USD at 7.75–7.85. The HKMA maintains this band through open market operations.\n- Saudi Riyal (SAR): Pegged to the USD at 3.75 since 1986.\n- Chinese Yuan (CNY): A managed float — the People's Bank of China sets a daily reference rate and allows trading within a ±2% band.\n- Euro (EUR): A floating currency shared by 20 EU member states, managed by the European Central Bank.",
    articleTitle5: "Tips for Getting Better Currency Exchange Rates",
    article5: "- Avoid airport and hotel currency exchange counters. These typically charge 5%–15% above the mid-market rate. Even a dedicated currency exchange bureau at the destination will offer better rates.\n- Use a multi-currency debit card for travel. Cards like Wise, Revolut, or Charles Schwab offer rates close to the interbank/mid-market rate with low or no fees.\n- Withdraw local currency from ATMs abroad. Using your home bank's debit card at local ATMs usually beats exchange bureau rates, though your bank may charge a foreign transaction fee (typically 1%–3%).\n- For large transfers, compare specialist providers. For transfers above $5,000 equivalent, specialist services like Wise, OFX, or CurrencyFair typically save 1%–3% compared to high-street banks.\n- Watch the mid-market rate trend. If your home currency has recently strengthened, it may be a good time to exchange. Use historical rate tools to see whether rates are near recent highs or lows.",
    articleTitle6: "Frequently Asked Questions",
    article6: "How often do the exchange rates in this tool update? Why does the rate I get at the bank differ from what this tool shows? What is the difference between EUR/USD and USD/EUR? Can I use this tool to convert cryptocurrencies? Is the Hong Kong Dollar really pegged to the US Dollar? What currencies does this tool support?",
    sidebarTitle: "Live rates",
    sidebarSubtitle: "30+ currencies via open.er-api.com",
    sidebarItems: ["Travel and shopping conversions.", "International invoicing and payroll.", "Cross-border payments and pricing."],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "貨幣換算器",
    subtitle: "即時換算 30+ 種貨幣，使用最新匯率。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：年齡、百分比、單位",
    reserveAd: "預留 Google 廣告位",
    amountLabel: "金額",
    fromLabel: "從",
    toLabel: "換算到",
    loading: "載入匯率中…",
    error: "無法載入匯率，請重試。",
    lastUpdated: "匯率更新時間",
    result: "結果",
    popular: "常用貨幣對",
    useCasesTitle: "使用情境",
    useCasesSubtitle: "日常換算工作。",
    useCases: ["旅行同網購換算。", "國際發票同薪酬。", "跨境付款同報價。"],
    suggestionsTitle: "你可能會喜歡",
    suggestionsSubtitle: "同貨幣工作配搭得好嘅工具。",
    suggestions: ["貸款計算器", "百分比計算器", "單位換算器"],
    searchHint: "搜尋工具",
    adLabel: "廣告",
    adBadge: "廣告",
    faqTitle: "常見問題",
    faq: [
      {
        question: "匯率更新頻率？",
        answer: "匯率由 Open Exchange Rates API 提供，大約每小時更新一次。工具顯示的時間戳記是上次匯率更新時間。進行即時交易或大型金融交易時，請直接向銀行或經紀確認匯率。"
      },
      {
        question: "銀行匯率同工具顯示嘅匯率點解唔同？",
        answer: "工具顯示中價匯率（買同賣價格嘅中間值），係最公平嘅基準。銀行同貨幣兌換服務喺呢個匯率上面加一個 markup — 叫做 spread — 賺利潤。Spread 可以由競爭性網上服務嘅 0.5% 到機場自助機嘅 8%–15%。你喺度見到嘅匯率同供應商收費嘅差異，基本上係佢哋嘅費用。"
      },
      {
        question: "EUR/USD 同 USD/EUR 點解唔同？",
        answer: "EUR/USD = 1.09 意思係 1 歐元可以換 1.09 美元（歐元係基準貨幣）。USD/EUR 係逆轉：1 美元可以換大約 0.917 歐元。喺外匯慣例，第一個貨幣係基準貨幣，第二個貨幣係報價貨幣。主要貨幣對通常列出 USD, EUR, GBP, 或 JPY 喺標準化順序。"
      },
      {
        question: "點樣用工具換算加密貨幣？",
        answer: "唔可以 — 工具只支援傳統法定貨幣。加密貨幣價格變化比法定貨幣匯率快好多，需要專門嘅數據來源。加密貨幣換算請用專門嘅加密貨幣交易所或市場數據供應商。"
      },
      {
        question: "港元真係同美元掛鉤？",
        answer: "係。港元自 1983 年起喺聯匯制度下，同美元喺 7.75–7.85 嘅範圍內掛鉤，由香港金融管理局營運。實際上，港元同美元喺 7.78 附近交易，唔會像自由浮動貨幣咁波動。呢個掛鉤提供匯率穩定性，對香港作為國際金融中心好重要。"
      },
      {
        question: "工具支援邊啲貨幣？",
        answer: "工具支援 30 種主要貨幣，包括 USD, EUR, GBP, JPY, CNY, HKD, AUD, CAD, CHF, SGD, KRW, INR, TWD, MYR, THB, IDR, PHP, VND, NZD, SEK, NOK, DKK, MXN, BRL, AED, SAR, ZAR, TRY, RUB, 同 PLN。呢啲貨幣覆蓋大部分亞太地區、歐洲、美洲同中東/非洲。"
      }
    ],
    articleTitle1: "匯率點樣運作",
    article1: "匯率係一種貨幣用另一種貨幣表達嘅價格。當你見到 USD/HKD = 7.78，意思係 1 美元可以換 7.78 港元。匯率喺交易時間內持續波動，因為貨幣喺全球外匯（forex）市場買同賣，每日交易量超過 $7.5 兆 — 係世界最大嘅金融市場。\n\n喺實際應用，你會遇到三種匯率：\n\n- 中價匯率：買同賣價格嘅中間值。工具用呢個匯率。亦叫做銀行間匯率或即期匯率。\n- 買匯率（bid）：銀行或貨幣兌換服務從你買貨幣嘅匯率。低於中價匯率。\n- 賣匯率（ask）：銀行或貨幣兌換服務賣貨幣畀你嘅匯率。高於中價匯率。Spread 係供應商嘅利潤。",
    articleTitle2: "實例",
    article2: "明白換算係簡單嘅，只要你識公式：<span class=\"font-mono text-emerald-200\">Result = Amount × (Target Rate / Base Rate)</span>. 以下係用近似中價匯率嘅實例：\n\n- 去美國嘅預算（港元）：HKD 10,000 ≈ USD 1,285（喺 7.78）\n- 歐洲發票（美元）：EUR 2,500 ≈ USD 2,725（喺 1.09）\n- 去日本嘅現金（美元）：USD 500 ≈ JPY 74,500（喺 149）\n- 人民幣轉港元：CNY 50,000 ≈ HKD 54,200（喺 1.084）\n\n以上係近似值。用工具換取即時匯率。",
    articleTitle3: "匯率點樣變動？",
    article3: "匯率由全球市場上每種貨幣嘅供應同需求驅動。幾個關鍵因素影響匯率：\n\n- 利率：中央銀行加息，貨幣通常升值，因為高利率吸引外資。美國聯儲局嘅利率決定對美元影響大。\n- 通脹：通脹率低嘅國家貨幣通常升值。高通脹侵蝕購買力，令貨幣長期走弱。\n- 經濟數據：GDP 增長、就業數字、貿易平衡同製造業產出報告都反映經濟健康。強勁數據通常令貨幣升值。\n- 政治穩定：政治穩定嘅國家貨幣吸引投資。選舉、地緣政治衝突同政策不確定性可以令貨幣大幅波動。\n- 市場投機：大型機構交易員、對沖基金同算法交易系統可以根據情緒同倉位短期推動貨幣。",
    articleTitle4: "掛鉤同浮動貨幣",
    article4: "唔係所有貨幣都自由浮動。有些政府維持固定或掛鉤匯率，對另一種貨幣或貨幣籃子：\n\n- 港元（HKD）：掛鉤美元喺 7.75–7.85。香港金融管理局透過公開市場操作維持呢個範圍。\n- 沙特里亞爾（SAR）：掛鉤美元喺 3.75，自 1986 年起。\n- 人民幣（CNY）：管理浮動 — 中國人民銀行設定每日參考匯率，允許在 ±2% 範圍內交易。\n- 歐元（EUR）：浮動貨幣，由 20 個歐盟成員國共享，由歐洲中央銀行管理。",
    articleTitle5: "點樣換取更好匯率？",
    article5: "- 避免機場同酒店嘅貨幣兌換櫃檯。通常收費比中價匯率高 5%–15%。目的地嘅專門貨幣兌換服務通常提供更好匯率。\n- 用多貨幣借记卡旅行。如 Wise, Revolut, 或 Charles Schwab 提供接近銀行間/中價匯率，費用低或無。\n- 喺國外用 ATM 提現。用你嘅銀行借记卡喺當地 ATM 通常比兌換服務匯率好，但銀行可能會收跨境交易費（通常 1%–3%）。\n- 大額轉帳時，比較專門服務。轉帳超過 $5,000 等值，專門服務如 Wise, OFX, 或 CurrencyFair 通常比街市銀行省 1%–3%。\n- 留意中價匯率趨勢。如果你嘅貨幣最近升值，可能係好時機換匯。用歷史匯率工具睇匯率係咪接近近期高點或低點。",
    articleTitle6: "常見問題",
    article6: "匯率更新頻率？銀行匯率同工具顯示嘅匯率點解唔同？EUR/USD 同 USD/EUR 點解唔同？點樣用工具換算加密貨幣？港元真係同美元掛鉤？工具支援邊啲貨幣？",
    sidebarTitle: "即時匯率",
    sidebarSubtitle: "30+ 種貨幣，由 open.er-api.com 提供",
    sidebarItems: ["旅行同網購換算。", "國際發票同薪酬。", "跨境付款同報價。"],
  },
  "zh-cn": {
    name: "简体中文",
    title: "货币换算器",
    subtitle: "实时换算 30+ 种货币，使用最新汇率。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：年龄、百分比、单位",
    reserveAd: "预留 Google 广告位",
    amountLabel: "金额",
    fromLabel: "从",
    toLabel: "换算到",
    loading: "加载汇率中…",
    error: "无法加载汇率，请重试。",
    lastUpdated: "汇率更新时间",
    result: "结果",
    popular: "常用货币对",
    useCasesTitle: "使用场景",
    useCasesSubtitle: "日常换算工作。",
    useCases: ["旅行和网购换算。", "国际发票和薪酬。", "跨境付款和报价。"],
    suggestionsTitle: "你可能会喜欢",
    suggestionsSubtitle: "和货币工作很搭的工具。",
    suggestions: ["贷款计算器", "百分比计算器", "单位换算器"],
    searchHint: "搜索工具",
    adLabel: "广告",
    adBadge: "广告",
    faqTitle: "常见问题",
    faq: [
      {
        question: "汇率更新频率？",
        answer: "汇率由 Open Exchange Rates API 提供，大约每小时更新一次。工具显示的时间戳记是上次汇率更新时间。进行即时交易或大型金融交易时，请直接向银行或经纪确认汇率。"
      },
      {
        question: "银行汇率同工具显示的汇率为什么不同？",
        answer: "工具显示中价汇率（买和卖价格的中点），是最公平的基准。银行和货币兑换服务在这个汇率上面加一个 markup — 叫做 spread — 赚利润。Spread 可以由竞争性网上服务的 0.5% 到机场自助机的 8%–15%。你在度看到的汇率同供应商收费的差异，基本上是他们费用。"
      },
      {
        question: "EUR/USD 和 USD/EUR 为什么不同？",
        answer: "EUR/USD = 1.09 意思是 1 欧元可以换 1.09 美元（欧元是基准货币）。USD/EUR 是逆转：1 美元可以换大约 0.917 欧元。在外汇惯例，第一个货币是基准货币，第二个货币是报价货币。主要货币对通常列出 USD, EUR, GBP, 或 JPY 在标准化顺序。"
      },
      {
        question: "怎么用工具换算加密货币？",
        answer: "不可以 — 工具只支持传统法定货币。加密货币价格变化比法定货币汇率快好多，需要专门的资料来源。加密货币换算请用专门的加密货币交易所或市场数据供应商。"
      },
      {
        question: "港元真的同美元挂钩？",
        answer: "是。港元自 1983 年起在联汇制度下，同美元在 7.75–7.85 的范围内挂钩，由香港金融管理局运营。实际上，港元同美元在 7.78 附近交易，不会像自由浮动货币那样波动。这个挂钩提供汇率稳定性，对香港作为国际金融中心很重要。"
      },
      {
        question: "工具支持哪些货币？",
        answer: "工具支持 30 种主要货币，包括 USD, EUR, GBP, JPY, CNY, HKD, AUD, CAD, CHF, SGD, KRW, INR, TWD, MYR, THB, IDR, PHP, VND, NZD, SEK, NOK, DKK, MXN, BRL, AED, SAR, ZAR, TRY, RUB, 和 PLN。这些覆盖大部分亚太地区、欧洲、美洲和中东/非洲。"
      }
    ],
    articleTitle1: "汇率如何运作",
    article1: "汇率是一种货币用另一种货币表达的价格。当你看到 USD/HKD = 7.78，意思是 1 美元可以换 7.78 港元。汇率在交易时间内持续波动，因为货币在全球外汇（forex）市场买卖，每日交易量超过 $7.5 兆 — 是世界最大的金融市场。\n\n在实际应用，你会遇到三种汇率：\n\n- 中价汇率：买和卖价格的中点。工具用这个汇率。也叫银行间汇率或即期汇率。\n- 买汇率（bid）：银行或货币兑换服务从你买货币的汇率。低于中价汇率。\n- 卖汇率（ask）：银行或货币兑换服务卖货币给你的汇率。高于中价汇率。Spread 是供应商的利润。",
    articleTitle2: "实例",
    article2: "明白换算很简单，只要你懂公式：<span class=\"font-mono text-emerald-200\">Result = Amount × (Target Rate / Base Rate)</span>. 以下是用近似中价汇率的实例：\n\n- 去美国的预算（港元）：HKD 10,000 ≈ USD 1,285（在 7.78）\n- 欧洲发票（美元）：EUR 2,500 ≈ USD 2,725（在 1.09）\n- 去日本的现金（美元）：USD 500 ≈ JPY 74,500（在 149）\n- 人民币转港元：CNY 50,000 ≈ HKD 54,200（在 1.084）\n\n以上是近似值。用工具换取实时汇率。",
    articleTitle3: "汇率如何变动？",
    article3: "汇率由全球市场上每种货币的供应和需求驱动。几个关键因素影响汇率：\n\n- 利率：中央银行加息，货币通常升值，因为高利率吸引外资。美国联邦储备局的利率决定对美元影响大。\n- 通胀：通胀率低的国家货币通常升值。高通胀侵蚀购买力，令货币长期走弱。\n- 经济数据：GDP 增长、就业数字、贸易平衡和制造业产出报告都反映经济健康。强劲数据通常令货币升值。\n- 政治稳定：政治稳定的国家货币吸引投资。选举、地缘政治冲突和政策不确定性可以令货币大幅波动。\n- 市场投机：大型机构交易员、对冲基金和算法交易系统可以根据情绪和仓位短期推动货币。",
    articleTitle4: "挂钩和浮动货币",
    article4: "不是所有货币都自由浮动。有些政府维持固定或挂钩汇率，对另一种货币或货币篮子：\n\n- 港元（HKD）：挂钩美元在 7.75–7.85。香港金融管理局通过公开市场操作维持这个范围。\n- 沙特里亚尔（SAR）：挂钩美元在 3.75，自 1986 年起。\n- 人民币（CNY）：管理浮动 — 中国人民银行设定每日参考汇率，允许在 ±2% 范围内交易。\n- 欧元（EUR）：浮动货币，由 20 个欧盟成员国共享，由欧洲中央银行管理。",
    articleTitle5: "如何换取更好汇率？",
    article5: "- 避免机场和酒店货币兑换柜台。通常收费比中价汇率高 5%–15%。目的地专门的货币兑换服务通常提供更好汇率。\n- 用多货币借记卡旅行。如 Wise, Revolut, 或 Charles Schwab 提供接近银行间/中价汇率，费用低或无。\n- 在国外用 ATM 提现。用你的银行借记卡在当地 ATM 通常比兑换服务汇率好，但银行可能会收跨境交易费（通常 1%–3%）。\n- 大额转账时，比较专门服务。转账超过 $5,000 等值，专门服务如 Wise, OFX, 或 CurrencyFair 通常比街市银行省 1%–3%。\n- 留意中价汇率趋势。如果你的货币最近升值，可能是好时机换汇。用历史汇率工具看汇率是否接近近期高点或低点。",
    articleTitle6: "常见问题",
    article6: "汇率更新频率？银行汇率同工具显示的汇率为什么不同？EUR/USD 和 USD/EUR 为什么不同？怎么用工具换算加密货币？港元真的同美元挂钩？工具支持哪些货币？",
    sidebarTitle: "实时汇率",
    sidebarSubtitle: "30+ 种货币，由 open.er-api.com 提供",
    sidebarItems: ["旅行和网购换算。", "国际发票和薪酬。", "跨境付款和报价。"],
  },
  es: {
    name: "Español",
    title: "Conversor de divisas",
    subtitle: "Convierte entre 30+ divisas con tasas de cambio en tiempo real.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: age, percent, unit",
    reserveAd: "Espacio reservado para Google Ads",
    amountLabel: "Cantidad",
    fromLabel: "De",
    toLabel: "A",
    loading: "Cargando tasas…",
    error: "No se pudieron cargar las tasas.",
    lastUpdated: "Tasas actualizadas",
    result: "Resultado",
    popular: "Pares populares",
    useCasesTitle: "Casos de uso",
    useCasesSubtitle: "Tareas de conversión diarias.",
    useCases: ["Viajes y compras.", "Facturación y nómina internacional.", "Pagos y precios transfronterizos."],
    suggestionsTitle: "Te puede interesar",
    suggestionsSubtitle: "Otras herramientas que encajan bien aquí.",
    suggestions: ["Calculadora de préstamos", "Calculadora de porcentajes", "Conversor de unidades"],
    searchHint: "Buscar herramientas",
    adLabel: "Anuncio",
    adBadge: "Ad",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        question: "¿Con qué frecuencia se actualizan las tasas de cambio en esta herramienta?",
        answer: "Las tasas se proporcionan por la API de Open Exchange Rates y se actualizan aproximadamente cada hora. El timestamp mostrado en la herramienta indica el momento de la última actualización de tasas. Para operaciones en tiempo real o transacciones financieras grandes, siempre confirma las tasas directamente con tu banco o corredor."
      },
      {
        question: "¿Por qué la tasa que obtengo en el banco difiere de lo que muestra esta herramienta?",
        answer: "Esta herramienta muestra la tasa de mercado (el punto medio entre precios de compra y venta), que es el benchmark más justo. Los bancos y servicios de cambio de divisas añaden un markup — llamado spread — sobre esta tasa para obtener su beneficio. Ese spread puede ir desde 0.5% en servicios online competitivos hasta 8%–15% en quioscos de aeropuertos. La diferencia entre lo que ves aquí y lo que cobra un proveedor es esencialmente su comisión."
      },
      {
        question: "¿Cuál es la diferencia entre EUR/USD y USD/EUR?",
        answer: "EUR/USD = 1.09 significa que 1 Euro compra 1.09 Dólares estadounidenses (EUR es la moneda base). USD/EUR sería la inversa: 1 USD compra aproximadamente 0.917 Euros. En la convención forex, la primera moneda listada es la base y la segunda es la cotizada. Los pares principales siempre listan USD, EUR, GBP o JPY en un orden estandarizado."
      },
      {
        question: "¿Puedo usar esta herramienta para convertir criptomonedas?",
        answer: "No — esta herramienta cubre solo divisas fiduciarias tradicionales. Los precios de las criptomonedas cambian mucho más rápidamente que las tasas de cambio fiduciarias y requieren fuentes de datos especializadas. Para conversiones de cripto, usa un exchange de cripto dedicado o un proveedor de datos de mercado."
      },
      {
        question: "¿Está el dólar de Hong Kong realmente anclado al dólar estadounidense?",
        answer: "Sí. El dólar de Hong Kong ha estado anclado al USD dentro de una banda de 7.75–7.85 desde 1983 bajo el Sistema de Tipo de Cambio Vinculado, operado por la Autoridad Monetaria de Hong Kong. En la práctica, HKD/USD opera en un rango muy estrecho alrededor de 7.78 y no fluctúa como las divisas flotantes. Este anclaje proporciona estabilidad en las tasas de cambio que es importante para el rol de Hong Kong como centro financiero internacional."
      },
      {
        question: "¿Qué divisas soporta esta herramienta?",
        answer: "Este conversor soporta 30 divisas principales incluyendo USD, EUR, GBP, JPY, CNY, HKD, AUD, CAD, CHF, SGD, KRW, INR, TWD, MYR, THB, IDR, PHP, VND, NZD, SEK, NOK, DKK, MXN, BRL, AED, SAR, ZAR, TRY, RUB y PLN. Estas cubren la mayoría de Asia-Pacífico, Europa, las Américas y la región Medio Oriente/Africa."
      }
    ],
    articleTitle1: "Cómo funcionan las tasas de cambio",
    article1: "Una tasa de cambio es el precio de una moneda expresado en términos de otra. Cuando ves USD/HKD = 7.78, significa que 1 Dólar estadounidense compra 7.78 Dólares de Hong Kong. Las tasas fluctúan continuamente durante las horas de trading mientras las divisas se compran y venden en el mercado global de divisas (forex), que opera más de $7.5 billones por día — haciéndolo el mercado financiero más grande del mundo.\n\nExisten tres tipos de tasas de cambio que encontrarás en la práctica:\n\n- Tasa de mercado: El punto medio entre precios de compra y venta. Usado por esta calculadora. También llamado tasa interbancaria o spot.\n- Tasa de compra (bid): La tasa a la que un banco o servicio de cambio compra divisas extranjeras de ti. Menor que la tasa de mercado.\n- Tasa de venta (ask): La tasa a la que un banco vende divisas extranjeras a ti. Mayor que la tasa de mercado. El spread es el beneficio del proveedor.",
    articleTitle2: "Ejemplos prácticos",
    article2: "Entender la conversión es sencillo una vez que conoces la fórmula: <span class=\"font-mono text-emerald-200\">Resultado = Cantidad × (Tasa Objetivo / Tasa Base)</span>. Aquí hay ejemplos prácticos usando tasas de mercado aproximadas:\n\n- Presupuesto de viaje a EE.UU. en HKD: HKD 10,000 ≈ USD 1,285 (a 7.78)\n- Factura europea pagada en USD: EUR 2,500 ≈ USD 2,725 (a 1.09)\n- Efectivo para viaje a Japón: USD 500 ≈ JPY 74,500 (a 149)\n- Remesa CNY a HKD: CNY 50,000 ≈ HKD 54,200 (a 1.084)\n\nLas tasas arriba son aproximaciones ilustrativas. Usa el conversor para tasas en tiempo real.",
    articleTitle3: "¿Qué mueve las tasas de cambio?",
    article3: "Las tasas de cambio son impulsadas por la oferta y demanda de cada moneda en el mercado global. Varios factores clave influyen en esto:\n\n- Tasas de interés: Cuando un banco central sube las tasas, su moneda generalmente se fortalece porque las tasas altas atraen inversión extranjera. Las decisiones de tasas de la Reserva Federal de EE.UU. mueven significativamente al USD.\n- Inflación: Los países con tasas de inflación bajas tienden a ver sus monedas apreciarse. La inflación alta erosiona el poder adquisitivo y debilita una moneda con el tiempo.\n- Datos económicos: El crecimiento del PIB, cifras de empleo, balanza comercial y reportes de producción manufacturera todos señalan salud económica. Datos fuertes tienden a fortalecer una moneda.\n- Estabilidad política: Las monedas de países políticamente estables atraen inversión. Elecciones, conflictos geopolíticos y incertidumbre de políticas pueden causar volatilidad significativa en las monedas.\n- Especulación de mercado: Grandes traders institucionales, fondos de cobertura y sistemas de trading algorítmico pueden mover monedas a corto plazo basados en sentimiento y posicionamiento.",
    articleTitle4: "Monedas ancladas vs. flotantes",
    article4: "No todas las monedas flotan libremente. Algunos gobiernos mantienen una tasa de cambio fija o anclada contra otra moneda o canasta de monedas:\n\n- Dólar de Hong Kong (HKD): Anclado al USD a 7.75–7.85. La HKMA mantiene esta banda mediante operaciones de mercado abierto.\n- Riyal saudí (SAR): Anclado al USD a 3.75 desde 1986.\n- Yuan chino (CNY): Una flotación gestionada — el Banco Popular de China establece una tasa de referencia diaria y permite trading dentro de una banda ±2%.\n- Euro (EUR): Una moneda flotante compartida por 20 estados miembros de la UE, gestionada por el Banco Central Europeo.",
    articleTitle5: "Consejos para obtener mejores tasas de cambio",
    article5: "- Evita los mostradores de cambio de divisas en aeropuertos y hoteles. Estos típicamente cobran 5%–15% sobre la tasa de mercado. Incluso un buró de cambio de divisas dedicado en el destino ofrecerá mejores tasas.\n- Usa una tarjeta de débito multimoneda para viajar. Tarjetas como Wise, Revolut o Charles Schwab ofrecen tasas cercanas a la tasa interbancaria/mercado con bajas o sin comisiones.\n- Retira moneda local en cajeros automáticos en el extranjero. Usar la tarjeta de débito de tu banco en cajeros locales suele superar las tasas del buró de cambio, aunque tu banco puede cobrar una comisión por transacción extranjera (típicamente 1%–3%).\n- Para transferencias grandes, compara proveedores especializados. Para transferencias superiores a $5,000 equivalente, servicios especializados como Wise, OFX o CurrencyFair típicamente ahorran 1%–3% comparado con bancos de calle.\n- Observa la tendencia de la tasa de mercado. Si tu moneda local ha fortalecido recientemente, puede ser buen momento para cambiar. Usa herramientas de tasas históricas para ver si las tasas están cerca de máximos o mínimos recientes.",
    articleTitle6: "Preguntas frecuentes",
    article6: "¿Con qué frecuencia se actualizan las tasas de cambio en esta herramienta? ¿Por qué la tasa que obtengo en el banco difiere de lo que muestra esta herramienta? ¿Cuál es la diferencia entre EUR/USD y USD/EUR? ¿Puedo usar esta herramienta para convertir criptomonedas? ¿Está el dólar de Hong Kong realmente anclado al dólar estadounidense? ¿Qué divisas soporta esta herramienta?",
    sidebarTitle: "Tasas en tiempo real",
    sidebarSubtitle: "30+ divisas vía open.er-api.com",
    sidebarItems: ["Viajes y compras.", "Facturación y nómina internacional.", "Pagos y precios transfronterizos."],
  },
};

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" }, { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" }, { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" }, { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" }, { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" }, { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" }, { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" }, { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "THB", name: "Thai Baht", symbol: "฿" }, { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" }, { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" }, { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" }, { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" }, { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" }, { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "ZAR", name: "South African Rand", symbol: "R" }, { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" }, { code: "PLN", name: "Polish Zloty", symbol: "zł" },
];

const POPULAR_PAIRS = [["USD","EUR"],["USD","GBP"],["USD","JPY"],["USD","HKD"],["EUR","GBP"],["GBP","JPY"]];

const TOOLS = [
  { title: { en: "Loan Calculator", "zh-hk": "貸款計算器", "zh-cn": "贷款计算器", es: "Calculadora de préstamos" }, description: { en: "Calculate monthly payments and total interest.", "zh-hk": "計算每月供款同總利息。", "zh-cn": "计算每月还款和总利息。", es: "Calcular pagos mensuales e interés total." }, href: "/loan-calculator", keywords: ["loan", "mortgage", "finance"] },
  { title: { en: "Percentage Calculator", "zh-hk": "百分比計算器", "zh-cn": "百分比计算器", es: "Calculadora de porcentajes" }, description: { en: "Percentage of a number.", "zh-hk": "數字嘅百分比。", "zh-cn": "数字的百分比。", es: "Porcentaje de un número." }, href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter", "zh-hk": "單位換算器", "zh-cn": "单位换算器", es: "Conversor de unidades" }, description: { en: "Convert length, weight, temperature.", "zh-hk": "換算長度、重量、溫度。", "zh-cn": "转换长度、重量、温度。", es: "Convertir longitud, peso, temperatura." }, href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Age Calculator", "zh-hk": "年齡計算器", "zh-cn": "年龄计算器", es: "Calculadora de edad" }, description: { en: "Calculate exact age from a birth date.", "zh-hk": "計算由出生日期嘅準確年齡。", "zh-cn": "根据出生日期计算准确年龄。", es: "Calcular edad exacta desde una fecha de nacimiento." }, href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Date Difference Calculator", "zh-hk": "日期差計算器", "zh-cn": "日期差计算器", es: "Calculadora de diferencia de fechas" }, description: { en: "Days between two dates.", "zh-hk": "兩日期之間嘅日子。", "zh-cn": "两个日期之间的天数。", es: "Días entre dos fechas." }, href: "/date-difference-calculator", keywords: ["date", "days"] },
  { title: { en: "Business Day Calculator", "zh-hk": "營業日計算器", "zh-cn": "工作日计算器", es: "Calculadora de días laborables" }, description: { en: "Add working days to any date.", "zh-hk": "加工作日畀任何日期。", "zh-cn": "向任何日期添加工作日。", es: "Añadir días laborables a cualquier fecha." }, href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算器", "zh-cn": "字数计算器", es: "Contador de palabras" }, description: { en: "Count words and characters.", "zh-hk": "計算字數同字符。", "zh-cn": "统计字数和字符。", es: "Contar palabras y caracteres." }, href: "/word-counter", keywords: ["word", "text"] },
];

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/currency-converter";

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

export default function CurrencyConverter() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en"));
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("HKD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesTime, setRatesTime] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
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

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => { setRates(data.rates); setRatesTime(data.time_last_update_utc || null); setLoadError(false); })
      .catch(() => setLoadError(true));
  }, []);

  const result = useMemo(() => {
    if (!rates) return null;
    const v = parseFloat(amount);
    if (isNaN(v)) return null;
    const fromRate = rates[from], toRate = rates[to];
    if (!fromRate || !toRate) return null;
    return (v / fromRate) * toRate;
  }, [amount, from, to, rates]);

  const content = LANGUAGES[locale];
  const hints = locale === "zh-hk" ? ["年齡", "百分比", "單位", "URL"] : locale === "zh-cn" ? ["年龄", "百分比", "单位", "URL"] : ["age", "percent", "unit", "loan"];
  const filteredTools = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return TOOLS; return TOOLS.filter((t) => `${t.title[locale]} ${t.description[locale]} ${t.keywords.join(" ")}`.toLowerCase().includes(q)); }, [search]);
  const toCurrency = CURRENCIES.find((c) => c.code === to);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><DollarSign className="h-5 w-5 text-emerald-300" /></div>
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
              {!rates && !loadError && <p className="text-sm text-white/55">{content.loading}</p>}
              {loadError && <p className="text-sm text-red-400">{content.error}</p>}
              {ratesTime && <p className="text-xs text-white/35">{content.lastUpdated}: {ratesTime}</p>}

              <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.amountLabel}</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60" /></label>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.fromLabel}</span>
                  <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
                  </select>
                </label>
                <button onClick={() => { setFrom(to); setTo(from); }} className="self-end mb-0.5 flex h-12 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"><ArrowLeftRight className="h-4 w-4 text-emerald-300" /></button>
                <label className="block space-y-2"><span className="text-sm text-neutral-300">{content.toLabel}</span>
                  <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/60">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
                  </select>
                </label>
              </div>

              {result !== null && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">{content.result}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">{toCurrency?.symbol}{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} <span className="text-xl text-white/60">{to}</span></p>
                </div>
              )}

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-400">{content.popular}</p>
                <div className="flex flex-wrap gap-2">{POPULAR_PAIRS.map(([f, t]) => <button key={`${f}-${t}`} onClick={() => { setFrom(f); setTo(t); }} className={`rounded-full border px-3 py-1.5 text-xs transition ${from === f && to === t ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"}`}>{f}/{t}</button>)}</div>
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
                <h2 className="text-2xl font-bold text-white">{content.articleTitle1}</h2>
                <p className="mt-3 leading-7">{content.article1}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle2}</h2>
                <p className="mt-3 leading-7">{content.article2}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle3}</h2>
                <p className="mt-3 leading-7">{content.article3}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle4}</h2>
                <p className="mt-3 leading-7">{content.article4}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle5}</h2>
                <p className="mt-3 leading-7">{content.article5}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle6}</h2>
                <div className="mt-4 space-y-5">
                  {content.faq.map((item) => (
                    <div key={item.question}>
                      <h3 className="font-semibold text-white">{item.question}</h3>
                      <p className="mt-1 text-white/70">{item.answer}</p>
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
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3"><DollarSign className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-semibold">{content.sidebarTitle}</h2><p className="text-sm text-neutral-300">{content.sidebarSubtitle}</p></div>
            </div>
            <div className="space-y-3 text-sm text-neutral-300">
              {content.sidebarItems.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</p>)}
            </div>
            <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white">{content.suggestionsTitle}</h3>
              <p className="mt-1 text-xs text-white/55">{content.suggestionsSubtitle}</p>
              <div className="mt-3 space-y-2">
                {content.suggestions.map((name) => {
                  const match = TOOLS.find((tool) => tool.title[locale] === name);
                  return (
                    <button key={name} type="button" onClick={() => match && (window.location.href = match.href)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10">
                      <span>{name}</span>
                      <ArrowRight className="h-4 w-4 text-white/35" />
                    </button>
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
