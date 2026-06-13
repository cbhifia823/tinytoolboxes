import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, CalendarDays, Search, ReceiptText } from "lucide-react";

const LANGUAGES = {
  en: {
    name: "English",
    title: "Invoice Due Date Calculator",
    subtitle: "Add calendar days or business days to an invoice date and get a clean due date instantly.",
    searchLabel: "Search tools",
    searchPlaceholder: "Try: weight, day, word, url",
    searchHint: "Search hints",
    invoiceDateLabel: "Invoice date",
    termsDaysLabel: "Payment terms (days)",
    businessLabel: "Count business days only",
    resultInvoice: "Invoice date",
    resultDue: "Due date",
    quickNote: "Quick note",
    quickNoteDesc: "Great for simple billing pages.",
    tip1: "Use calendar days for straightforward invoice terms.",
    tip2: "Use business days if your billing policy excludes weekends.",
    reserveAd: "Google Ads",
    reserveAdSub: "Drop AdSense here later without changing the layout.",
    adLabel: "Advertisement",
    adBadge: "Reserved",
    articleTitle1: "Understanding Invoice Payment Terms",
    article1: [
      "Invoice payment terms define how long a customer has to pay an invoice. Understanding each type is essential for setting clear expectations, managing cash flow, and avoiding disputes. The most common terms are expressed as \"Net X\" — meaning payment is due within X calendar days of the invoice date.",
    ],
    articleList1: [
      { label: "Net 10 / Net 15 / Net 30 / Net 45 / Net 60 / Net 90", detail: "Payment is due within the specified number of calendar days from the invoice date. Net 30 is the most common standard in B2B commerce. Net 60 and Net 90 are typical in large corporate and government procurement where payment approval cycles are long." },
      { label: "2/10 Net 30", detail: "A two-part term — the customer can take a 2% early payment discount if they pay within 10 days, otherwise the full invoice amount is due within 30 days. This is sometimes written as \"2/10 n/30\". The \"2/10\" part is the discount incentive; the \"Net 30\" part is the firm deadline." },
      { label: "EOM (End of Month)", detail: "Payment is due at the end of the month in which the invoice was issued, regardless of the invoice date. An invoice dated March 10 with EOM terms is due March 31. An invoice dated March 28 with EOM terms is also due March 31 — giving that customer just 3 days to pay." },
      { label: "MFI (Month Following Invoice) or Net 30 EOM", detail: "Payment is due at the end of the month following the invoice month. An invoice dated March 15 with Net 30 EOM terms is due April 30 — not April 14. This gives customers more predictable cash flow since they always know payment is due on the last day of the following month." },
      { label: "CIA (Cash in Advance) / PIA (Payment in Advance)", detail: "Full payment is required before goods or services are delivered. Common for custom orders, international trade, and high-risk accounts." },
    ],
    articleTitle2: "How to Calculate an Invoice Due Date",
    article2: [
      "The due date calculation starts from the invoice date — not the date the invoice was received, and not the date the work was completed or the goods were shipped (unless your contract specifically states otherwise). The invoice date is the date printed on the invoice itself, and it is the reference point from which all payment term calculations begin.",
      "For standard Net X terms, simply count X calendar days forward from the invoice date. Weekends and public holidays do not affect this count — Net 30 means 30 calendar days, period.",
    ],
    articleList2: [
      "Invoice dated March 5, Net 30 terms → due April 4 (30 days later, crossing the month boundary)",
      "Invoice dated March 31, Net 30 terms → due April 30 (end of April, not May 1)",
      "Invoice dated March 15, EOM Net 30 terms → the invoice month ends March 31, plus 30 days → due April 30",
      "Invoice dated March 15, MFI terms → due April 30 (last day of the month following March)",
    ],
    articleFooter2: "If the due date falls on a weekend or bank holiday, commercial practice varies. Some contracts specify that if the due date falls on a non-business day, payment is due the next business day. Others require payment on the last business day before the weekend or holiday. Your invoice or contract should specify which convention applies.",
    articleTitle3: "Early Payment Discounts (2/10 Net 30)",
    article3: [
      "Early payment discount terms like 2/10 Net 30 are widely used because they benefit both parties — but the financial mechanics are worth understanding clearly. When a vendor offers a 2% discount for payment within 10 days on a 30-day invoice, they are essentially offering to accept a smaller amount in exchange for receiving their money 20 days sooner.",
      "For a $10,000 invoice with 2/10 Net 30 terms: paying within 10 days costs $9,800 and saves $200. That $200 saving over 20 days represents an annualised return of approximately 36.7% — calculated as (2% ÷ 98%) × (365 ÷ 20). This is an extraordinarily high rate of return compared to any normal investment. For buyers with available cash, taking the early payment discount is almost always financially advantageous.",
      "For vendors, offering this discount accelerates cash collection and reduces the credit risk of non-payment. Many businesses use dynamic discounting programmes — where buyers can offer to pay even earlier at a proportionally larger discount — to optimise working capital for both sides of the transaction.",
    ],
    articleTitle4: "Late Payment Fees and Legal Implications",
    article4: [
      "Unpaid invoices are one of the leading causes of cash flow problems for small and medium-sized businesses. Most jurisdictions give creditors legal tools to recover late payments, but the specific rules vary by country and contract terms.",
    ],
    articleList4: [
      { label: "United Kingdom", detail: "The Late Payment of Commercial Debts (Interest) Act 1998 entitles businesses to claim statutory interest of 8% plus the Bank of England base rate on overdue B2B invoices, automatically and without needing it stated in the contract. Businesses can also claim fixed debt recovery costs (£40–£100 depending on the invoice amount)." },
      { label: "United States", detail: "There is no federal statute equivalent to the UK Act. Late payment interest rights depend on the contract and state law. Many states allow 1.5% per month (18% annualised) if specified in the contract. Without a contractual provision, the applicable rate is typically lower and varies by state." },
      { label: "European Union", detail: "The Late Payment Directive (2011/7/EU) sets a statutory interest rate of 8% above the European Central Bank reference rate for B2B transactions, with a maximum 60-day payment term for commercial transactions and 30 days for public authorities." },
    ],
    articleFooter4: "Regardless of jurisdiction, it is best practice to clearly state your late payment fee policy on every invoice before any payment is due. A clause such as \"Invoices unpaid after 30 days will accrue interest at 1.5% per month\" is far easier to enforce than trying to introduce fees after the fact.",
    articleTitle5: "Invoice Best Practices",
    article5: [
      "A well-structured invoice reduces disputes, speeds up payment, and creates a clear paper trail. Every invoice should include the following information as a minimum:",
    ],
    articleList5: [
      "A unique invoice number and the invoice date",
      "The explicit payment due date (do not rely on the customer to calculate it — state \"Due by April 4, 2025\")",
      "Clear payment terms spelled out in words (e.g. \"Net 30 from invoice date\")",
      "Accepted payment methods and full bank details or payment link",
      "Late payment fee policy, if applicable",
      "Itemised description of goods or services with quantities and unit prices",
    ],
    articleFooter5: "For follow-up, a proactive schedule works best: send a friendly reminder 7 days before the due date, a polite follow-up on the due date itself if not yet paid, and a firmer notice 7 days after the due date. Systematic follow-up dramatically reduces the number of invoices that become seriously overdue or require escalation to a collections agency.",
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "What is the difference between Net 30 and Net 30 EOM?", a: "Net 30 means payment is due 30 days after the invoice date. Net 30 EOM (End of Month) means payment is due 30 days after the end of the month in which the invoice was issued. An invoice dated March 5 on Net 30 terms is due April 4. The same invoice on Net 30 EOM terms is due April 30 (30 days after March 31). EOM terms effectively give customers more time to pay for invoices issued early in the month." },
      { q: "When does the payment clock start — invoice date or receipt date?", a: "In standard commercial practice, payment terms are calculated from the invoice date — the date printed on the invoice. However, some large buyers, particularly in public procurement, insist that terms run from the date they receive and accept the invoice into their accounts payable system. If this applies to your customers, your contract should specify \"receipt date\" explicitly. Absent any such specification, the invoice date is the default starting point." },
      { q: "What is a reasonable payment term for small businesses?", a: "Net 14 or Net 30 are the most common terms for small businesses. Net 30 is widely recognised as a standard and is expected by most corporate buyers. For clients with a good payment history, Net 14 can significantly improve your cash flow without causing friction. For new or unknown clients, requesting a 50% deposit upfront with the balance on delivery — or CIA terms — provides protection against non-payment." },
      { q: "Can I charge interest on overdue invoices without stating it on the invoice?", a: "In the UK, yes — the Late Payment of Commercial Debts Act gives you a statutory right to charge interest on overdue B2B invoices even without a contractual clause. In most other jurisdictions, including the United States, you generally cannot charge interest beyond any applicable statutory rate unless your contract or invoice explicitly states the late payment fee. Always consult a legal professional for advice specific to your jurisdiction and situation." },
      { q: "What is the difference between an invoice and a purchase order?", a: "A purchase order (PO) is a document created and sent by the buyer to the seller, authorising a purchase at agreed terms. It comes before the goods or services are delivered. An invoice is created and sent by the seller to the buyer after delivery, requesting payment for the goods or services provided. In many B2B transactions, the seller references the buyer's PO number on the invoice to enable matching — a process called \"three-way matching\" (PO, delivery receipt, invoice) that is standard in corporate accounts payable workflows." },
    ],
  },
  "zh-hk": {
    name: "繁體中文",
    title: "發票到期日計算器",
    subtitle: "幫你喺發票日期上加日數，快速計到到期日。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：體積重量、工作日、字數、URL",
    searchHint: "搜尋提示",
    invoiceDateLabel: "發票日期",
    termsDaysLabel: "付款期限（日數）",
    businessLabel: "只計工作日",
    resultInvoice: "發票日期",
    resultDue: "到期日",
    quickNote: "小提示",
    quickNoteDesc: "適合簡單帳單頁面。",
    tip1: "用日曆日處理直接嘅發票條款。",
    tip2: "如果你嘅帳單政策排除週末，就用工作日。",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
    adLabel: "廣告",
    adBadge: "已預留",
    articleTitle1: "了解發票付款條款",
    article1: [
      "發票付款條款定義咗客戶需要幾耐之內找數。明白每種條款對設定清晰期望、管理現金流同避免糾紛都好重要。最常見嘅條款會用「Net X」嚟表達——意思係由發票日期起計 X 個日曆日之內要付款。",
    ],
    articleList1: [
      { label: "Net 10 / Net 15 / Net 30 / Net 45 / Net 60 / Net 90", detail: "付款需喺發票日期起計指定日曆日數內完成。Net 30 係 B2B 商業中最常見嘅標準。Net 60 同 Net 90 通常出現喺大型企業同政府採購，因為佢哋嘅付款審批週期比較長。" },
      { label: "2/10 Net 30", detail: "一個兩部分嘅條款——如果客戶喺 10 日內付款，就可以享有 2% 嘅早付折扣，否則就要喺 30 日內支付全數。有時會寫做「2/10 n/30」。「2/10」係折扣優惠；「Net 30」就係最後期限。" },
      { label: "EOM（月底）", detail: "無論發票日期係幾時，付款都喺發票發出嗰個月嘅月底到期。一張 3 月 10 日嘅發票用 EOM 條款嘅話，到期日就係 3 月 31 日。一張 3 月 28 日嘅發票用 EOM 條款嘅話，到期日都係 3 月 31 日——即係個客得 3 日時間找數。" },
      { label: "MFI（發票月份下一個月）或 Net 30 EOM", detail: "付款喺發票月份之後嗰個月嘅月底到期。一張 3 月 15 日嘅發票用 Net 30 EOM 條款嘅話，到期日係 4 月 30 日——而唔係 4 月 14 日。咁樣客戶就可以有更可預測嘅現金流，因為佢哋永遠都知道付款係下一個月嘅最後一日到期。" },
      { label: "CIA（預先付款）/ PIA（預先付款）", detail: "喺貨品或服務交付之前就要俾晒全數。通常用喺定制訂單、國際貿易同高風險帳戶。" },
    ],
    articleTitle2: "點樣計算發票到期日",
    article2: [
      "到期日嘅計算係由發票日期開始——唔係收發票嘅日期，亦都唔係工作完成或者貨物付運嘅日期（除非你嘅合約特別寫明）。發票日期係印喺發票上面嘅日期，亦係所有付款條款計算嘅參考點。",
      "對於標準嘅 Net X 條款，只需要由發票日期起向前數 X 個日曆日。週末同公眾假期唔會影響呢個計算——Net 30 就係 30 個日曆日。",
    ],
    articleList2: [
      "發票日期 3 月 5 日，Net 30 條款 → 到期日 4 月 4 日（30 日後，跨越月份）",
      "發票日期 3 月 31 日，Net 30 條款 → 到期日 4 月 30 日（4 月底，唔係 5 月 1 日）",
      "發票日期 3 月 15 日，EOM Net 30 條款 → 發票月份 3 月 31 日結束，加 30 日 → 到期日 4 月 30 日",
      "發票日期 3 月 15 日，MFI 條款 → 到期日 4 月 30 日（3 月之後嗰個月嘅最後一日）",
    ],
    articleFooter2: "如果到期日撞正週末或銀行假期，商業慣例各有不同。有啲合約會寫明如果到期日係非工作日，付款就順延到下一個工作日。有啲就會要求喺週末或假期前嘅最後一個工作日付款。你嘅發票或合約應該寫明適用邊種慣例。",
    articleTitle3: "早付折扣（2/10 Net 30）",
    article3: [
      "早付折扣條款好似 2/10 Net 30 咁被廣泛使用，因為對雙方都有好處——但係財務計算值得清晰理解。當供應商對一張 30 日嘅發票提供 2% 折扣俾 10 日內付款，佢哋基本上係願意接受少啲金額，換取早 20 日收到錢。",
      "以一張 $10,000 嘅發票用 2/10 Net 30 條款為例：10 日內付款需要 $9,800，慳到 $200。呢個 $200 喺 20 日內慳到，年化回報率大約係 36.7%——計算方法係 (2% ÷ 98%) × (365 ÷ 20)。比起任何正常投資，呢個回報率都非常高。對於有現金嘅買家嚟講，接受早付折扣幾乎永遠都係財務上有利嘅。",
      "對於供應商嚟講，提供呢個折扣可以加快現金回收，同埋減少唔找數嘅信用風險。好多企業會用動態折扣計劃——買家可以提出更早付款以換取更大折扣——去優化交易雙方嘅營運資金。",
    ],
    articleTitle4: "逾期付款費用同法律影響",
    article4: [
      "未支付嘅發票係中小企現金流問題嘅主要原因之一。大部分司法管轄區都俾債權人法律工具去追討逾期付款，但具體規則會因國家同合約條款而異。",
    ],
    articleList4: [
      { label: "英國", detail: "《1998 年商業債務逾期付款（利息）法》賦予企業就逾期 B2B 發票收取法定利息嘅權利，利率係英倫銀行基準利率加 8%，自動適用，唔需要在合約中寫明。企業仲可以收取固定嘅債務追收費用（視乎發票金額介乎 £40–£100）。" },
      { label: "美國", detail: "冇聯邦法例等同英國嗰條法例。逾期付款利息權利取決於合約同州法律。好多州容許每月 1.5%（年化 18%）如果合約有寫明。冇合約條文嘅話，適用利率通常較低，而且每個州都唔同。" },
      { label: "歐盟", detail: "《逾期付款指令》（2011/7/EU）為 B2B 交易設定法定利率為歐洲央行參考利率加 8%，商業交易最多 60 日付款期，公共機構最多 30 日。" },
    ],
    articleFooter4: "無論邊個司法管轄區，最好嘅做法係喺每張發票上面清楚寫明你嘅逾期付款費用政策，喺任何付款到期之前就寫清楚。一句「逾期 30 日未付嘅發票將按每月 1.5% 計息」比起事後先引入費用容易執行好多。",
    articleTitle5: "發票最佳做法",
    article5: [
      "一張結構良好嘅發票可以減少糾紛、加快付款、同埋建立清晰嘅記錄。每張發票至少應該包含以下資訊：",
    ],
    articleList5: [
      "一個獨特嘅發票號碼同發票日期",
      "明確嘅付款到期日（唔好靠客戶自己計——寫明「請於 2025 年 4 月 4 日前付款」）",
      "用文字清楚寫明付款條款（例如「由發票日期起計 Net 30」）",
      "接受嘅付款方式同完整嘅銀行資料或付款連結",
      "逾期付款費用政策（如適用）",
      "貨品或服務嘅逐項描述，連同數量同單價",
    ],
    articleFooter5: "至於跟進，一個主動嘅時間表效果最好：到期日前 7 日發送友善提醒，如果到期日當日仲未收到付款就禮貌跟進，到期日後 7 日再發一封更堅定嘅通知。系統化嘅跟進可以大幅減少嚴重逾期或需要升級到追數公司嘅發票數量。",
    faqTitle: "常見問題",
    faq: [
      { q: "Net 30 同 Net 30 EOM 有咩分別？", a: "Net 30 意思係發票日期後 30 日付款。Net 30 EOM（月底）意思係發票發出嗰個月嘅月底之後 30 日付款。一張 3 月 5 日嘅發票用 Net 30 條款，到期日係 4 月 4 日。同一張發票用 Net 30 EOM 條款，到期日係 4 月 30 日（3 月 31 日之後 30 日）。EOM 條款實際上俾咗月初發出嘅發票更多付款時間。" },
      { q: "付款時鐘幾時開始——發票日期定係收發票日期？", a: "標準商業慣例中，付款條款由發票日期起計——即係印喺發票上面嘅日期。不過，有啲大型買家，特別係公共採購，會堅持條款由佢哋收到並接納發票入帳嘅日期起計。如果呢個情況適用於你嘅客戶，你嘅合約應該明確寫明「收貨日期」。冇任何呢類說明嘅話，發票日期就係預設嘅起點。" },
      { q: "對小企業嚟講，咩係合理嘅付款期限？", a: "Net 14 或 Net 30 係小企業最常見嘅條款。Net 30 被廣泛認可為標準，大部分企業買家都預期呢個條款。對於有良好付款記錄嘅客戶，Net 14 可以顯著改善你嘅現金流之餘又唔會造成摩擦。對於新客戶或唔認識嘅客戶，要求 50% 訂金，餘額交貨時支付——或者用 CIA 條款——可以防止唔找數嘅風險。" },
      { q: "我可以唔喺發票上寫明就收取逾期利息嗎？", a: "喺英國，可以——《商業債務逾期付款法》賦予你法定權利就逾期 B2B 發票收取利息，即使合約冇寫明。喺大部分其他司法管轄區，包括美國，除非你嘅合約或發票明確寫明逾期付款費用，否則你通常唔可以收取超過任何適用法定利率嘅利息。請務必諮詢法律專業人士，取得針對你所在司法管轄區同具體情況嘅建議。" },
      { q: "發票同採購訂單有咩分別？", a: "採購訂單（PO）係由買家創建並發送俾賣家嘅文件，授權按協定條款進行採購。佢出現喺貨品或服務交付之前。發票係由賣家創建並喺交付後發送俾買家，要求支付已提供嘅貨品或服務。喺好多 B2B 交易中，賣家會喺發票上引用買家嘅 PO 號碼以進行配對——呢個過程叫做「三向配對」（PO、送貨單、發票），係企業應付帳款工作流程中嘅標準做法。" },
    ],
  },
  "zh-cn": {
    name: "简体中文",
    title: "发票到期日计算器",
    subtitle: "在发票日期上加天数，快速算出到期日。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：体积重量、工作日、字数、URL",
    searchHint: "搜索提示",
    invoiceDateLabel: "发票日期",
    termsDaysLabel: "付款期限（天数）",
    businessLabel: "仅计工作日",
    resultInvoice: "发票日期",
    resultDue: "到期日",
    quickNote: "小提示",
    quickNoteDesc: "适合简单账单页面。",
    tip1: "用日历日处理直接的发票条款。",
    tip2: "如果您的账单政策排除周末，请用工作日。",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之后可直接放 AdSense 代码。",
    adLabel: "广告",
    adBadge: "已预留",
    articleTitle1: "了解发票付款条款",
    article1: [
      "发票付款条款定义了客户需要在多长时间内付款。理解每种条款对于设定清晰期望、管理现金流和避免纠纷都很重要。最常见的条款用「Net X」表示——意思是从发票日期起计 X 个日历日内付款。",
    ],
    articleList1: [
      { label: "Net 10 / Net 15 / Net 30 / Net 45 / Net 60 / Net 90", detail: "付款需在发票日期起计的指定日历天数内完成。Net 30 是 B2B 商业中最常见的标准。Net 60 和 Net 90 通常出现在大型企业和政府采购中，因为他们的付款审批周期较长。" },
      { label: "2/10 Net 30", detail: "一个两部分的条款——如果客户在 10 天内付款，可以享受 2% 的早付折扣，否则需在 30 天内支付全额。有时会写作「2/10 n/30」。「2/10」是折扣优惠；「Net 30」是最终期限。" },
      { label: "EOM（月底）", detail: "无论发票日期是什么时候，付款都在发票发出那个月的月底到期。一张 3 月 10 日的发票用 EOM 条款的话，到期日就是 3 月 31 日。一张 3 月 28 日的发票用 EOM 条款的话，到期日也是 3 月 31 日——即客户只有 3 天时间付款。" },
      { label: "MFI（发票月份下一个月）或 Net 30 EOM", detail: "付款在发票月份之后那个月的月底到期。一张 3 月 15 日的发票用 Net 30 EOM 条款的话，到期日是 4 月 30 日——而不是 4 月 14 日。这样客户就可以有更可预测的现金流，因为他们永远都知道付款是下个月的最后一天到期。" },
      { label: "CIA（预先付款）/ PIA（预先付款）", detail: "在货品或服务交付之前就要付清全款。通常用于定制订单、国际贸易和高风险账户。" },
    ],
    articleTitle2: "如何计算发票到期日",
    article2: [
      "到期日的计算从发票日期开始——不是收到发票的日期，也不是工作完成或货物付运的日期（除非您的合同特别注明）。发票日期是印在发票上的日期，也是所有付款条款计算的参考点。",
      "对于标准的 Net X 条款，只需要从发票日期起向前数 X 个日历日。周末和公众假期不会影响这个计算——Net 30 就是 30 个日历日。",
    ],
    articleList2: [
      "发票日期 3 月 5 日，Net 30 条款 → 到期日 4 月 4 日（30 天后，跨越月份）",
      "发票日期 3 月 31 日，Net 30 条款 → 到期日 4 月 30 日（4 月底，不是 5 月 1 日）",
      "发票日期 3 月 15 日，EOM Net 30 条款 → 发票月份 3 月 31 日结束，加 30 天 → 到期日 4 月 30 日",
      "发票日期 3 月 15 日，MFI 条款 → 到期日 4 月 30 日（3 月之后那个月的最后一天）",
    ],
    articleFooter2: "如果到期日碰上周末或银行假期，商业惯例各有不同。有些合同会写明如果到期日是非工作日，付款就顺延到下一个工作日。有些会要求在周末或假期前的最后一个工作日付款。您的发票或合同应该写明适用哪种惯例。",
    articleTitle3: "早付折扣（2/10 Net 30）",
    article3: [
      "早付折扣条款如 2/10 Net 30 被广泛使用，因为对双方都有好处——但财务计算值得清晰理解。当供应商对一张 30 天的发票提供 2% 折扣给 10 天内付款，他们基本上是愿意接受较少金额，换取早 20 天收到钱。",
      "以一张 $10,000 的发票用 2/10 Net 30 条款为例：10 天内付款需要 $9,800，省下 $200。这个 $200 在 20 天内省到，年化回报率大约是 36.7%——计算方法是 (2% ÷ 98%) × (365 ÷ 20)。比起任何正常投资，这个回报率都非常高。对于有现金的买家来说，接受早付折扣几乎永远都是财务上有利的。",
      "对于供应商来说，提供这个折扣可以加快现金回收，并减少不付款的信用风险。很多企业会用动态折扣计划——买家可以提出更早付款以换取更大折扣——去优化交易双方的营运资金。",
    ],
    articleTitle4: "逾期付款费用与法律影响",
    article4: [
      "未支付的发票是中小企业现金流问题的主要原因之一。大部分司法管辖区都赋予债权人法律工具去追讨逾期付款，但具体规则因国家和合同条款而异。",
    ],
    articleList4: [
      { label: "英国", detail: "《1998 年商业债务逾期付款（利息）法》赋予企业就逾期 B2B 发票收取法定利息的权利，利率为英格兰银行基准利率加 8%，自动适用，无需在合同中写明。企业还可以收取固定的债务追收费用（视乎发票金额介于 £40–£100）。" },
      { label: "美国", detail: "没有联邦法律等同英国那条法律。逾期付款利息权利取决于合同和州法律。很多州容许每月 1.5%（年化 18%）如果合同有写明。没有合同条文的话，适用利率通常较低，且每个州都不同。" },
      { label: "欧盟", detail: "《逾期付款指令》（2011/7/EU）为 B2B 交易设定法定利率为欧洲央行参考利率加 8%，商业交易最多 60 天付款期，公共机构最多 30 天。" },
    ],
    articleFooter4: "无论哪个司法管辖区，最好的做法是在每张发票上清楚写明您的逾期付款费用政策，在任何付款到期之前就写清楚。一句「逾期 30 天未付的发票将按每月 1.5% 计息」比事后才引入费用容易执行得多。",
    articleTitle5: "发票最佳做法",
    article5: [
      "一张结构良好的发票可以减少纠纷、加快付款、并建立清晰的记录。每张发票至少应该包含以下信息：",
    ],
    articleList5: [
      "一个独特的发票号码和发票日期",
      "明确的付款到期日（不要靠客户自己算——写明「请于 2025 年 4 月 4 日前付款」）",
      "用文字清楚写明付款条款（例如「从发票日期起计 Net 30」）",
      "接受的付款方式和完整的银行资料或付款链接",
      "逾期付款费用政策（如适用）",
      "货品或服务的逐项描述，连同数量和单价",
    ],
    articleFooter5: "至于跟进，一个主动的时间表效果最好：到期日前 7 天发送友善提醒，如果到期日当天仍未收到付款就礼貌跟进，到期日后 7 天再发一封更坚定的通知。系统化的跟进可以大幅减少严重逾期或需要升级到追数公司的发票数量。",
    faqTitle: "常见问题",
    faq: [
      { q: "Net 30 和 Net 30 EOM 有什么区别？", a: "Net 30 意思是发票日期后 30 天付款。Net 30 EOM（月底）意思是发票发出那个月的月底之后 30 天付款。一张 3 月 5 日的发票用 Net 30 条款，到期日是 4 月 4 日。同一张发票用 Net 30 EOM 条款，到期日是 4 月 30 日（3 月 31 日之后 30 天）。EOM 条款实际上给了月初发出的发票更多付款时间。" },
      { q: "付款时钟何时开始——发票日期还是收发票日期？", a: "标准商业惯例中，付款条款从发票日期起计——即印在发票上的日期。不过，有些大型买家，特别是公共采购，会坚持条款从他们收到并接纳发票入账的日期起计。如果这个情况适用于您的客户，您的合同应该明确写明「收货日期」。没有任何这类说明的话，发票日期就是默认的起点。" },
      { q: "对小企业来说，什么是合理的付款期限？", a: "Net 14 或 Net 30 是小企业最常见的条款。Net 30 被广泛认可为标准，大部分企业买家都预期这个条款。对于有良好付款记录的客户，Net 14 可以显著改善您的现金流而又不会造成摩擦。对于新客户或不认识的客户，要求 50% 订金，余额交货时支付——或用 CIA 条款——可以防止不付款的风险。" },
      { q: "我可以不在发票上写明就收取逾期利息吗？", a: "在英国，可以——《商业债务逾期付款法》赋予您法定权利就逾期 B2B 发票收取利息，即使合同没有写明。在大部分其他司法管辖区，包括美国，除非您的合同或发票明确写明逾期付款费用，否则您通常不可以收取超过任何适用法定利率的利息。请务必咨询法律专业人士，取得针对您所在司法管辖区和具体情况的建议。" },
      { q: "发票和采购订单有什么区别？", a: "采购订单（PO）是由买家创建并发送给卖家的文件，授权按协定条款进行采购。它出现在货品或服务交付之前。发票是由卖家创建并在交付后发送给买家，要求支付已提供的货品或服务。在很多 B2B 交易中，卖家会在发票上引用买家的 PO 号码以进行配对——这个过程叫做「三向配对」（PO、送货单、发票），是企业应付账款工作流程中的标准做法。" },
    ],
  },
  es: {
    name: "Español",
    title: "Calculadora de vencimiento de factura",
    subtitle: "Añade días calendario o hábiles a una fecha de factura y obtén el vencimiento al instante.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: weight, day, word, url",
    searchHint: "Sugerencias de búsqueda",
    invoiceDateLabel: "Fecha de factura",
    termsDaysLabel: "Plazo de pago (días)",
    businessLabel: "Solo días hábiles",
    resultInvoice: "Fecha de factura",
    resultDue: "Fecha de vencimiento",
    quickNote: "Nota rápida",
    quickNoteDesc: "Ideal para páginas de facturación simples.",
    tip1: "Usa días calendario para términos de factura directos.",
    tip2: "Usa días hábiles si tu política de facturación excluye fines de semana.",
    reserveAd: "Google Ads",
    reserveAdSub: "Coloca AdSense aquí más tarde sin cambiar el diseño.",
    adLabel: "Anuncio",
    adBadge: "Reservado",
    articleTitle1: "Comprendiendo los plazos de pago de facturas",
    article1: [
      "Los plazos de pago definen cuánto tiempo tiene un cliente para pagar una factura. Comprender cada tipo es esencial para establecer expectativas claras, gestionar el flujo de caja y evitar disputas. Los términos más comunes se expresan como «Net X» — lo que significa que el pago vence dentro de X días calendario desde la fecha de la factura.",
    ],
    articleList1: [
      { label: "Net 10 / Net 15 / Net 30 / Net 45 / Net 60 / Net 90", detail: "El pago vence dentro del número especificado de días calendario desde la fecha de la factura. Net 30 es el estándar más común en el comercio B2B. Net 60 y Net 90 son típicos en grandes empresas y adquisiciones gubernamentales donde los ciclos de aprobación de pago son largos." },
      { label: "2/10 Net 30", detail: "Un término de dos partes: el cliente puede tomar un 2% de descuento por pronto pago si paga dentro de 10 días; de lo contrario, el monto total vence en 30 días. A veces se escribe como «2/10 n/30». La parte «2/10» es el incentivo de descuento; la parte «Net 30» es la fecha límite firme." },
      { label: "EOM (Fin de mes)", detail: "El pago vence al final del mes en que se emitió la factura, independientemente de la fecha de la factura. Una factura del 10 de marzo con términos EOM vence el 31 de marzo. Una factura del 28 de marzo con términos EOM también vence el 31 de marzo — dando a ese cliente solo 3 días para pagar." },
      { label: "MFI (Mes siguiente a la factura) o Net 30 EOM", detail: "El pago vence al final del mes siguiente al mes de la factura. Una factura del 15 de marzo con términos Net 30 EOM vence el 30 de abril — no el 14 de abril. Esto da a los clientes un flujo de caja más predecible, ya que siempre saben que el pago vence el último día del mes siguiente." },
      { label: "CIA (Pago por adelantado) / PIA (Pago por adelantado)", detail: "Se requiere el pago completo antes de que se entreguen los bienes o servicios. Común para pedidos personalizados, comercio internacional y cuentas de alto riesgo." },
    ],
    articleTitle2: "Cómo calcular la fecha de vencimiento de una factura",
    article2: [
      "El cálculo de la fecha de vencimiento comienza desde la fecha de la factura — no desde la fecha en que se recibió la factura, ni desde la fecha en que se completó el trabajo o se enviaron los bienes (a menos que tu contrato establezca lo contrario). La fecha de la factura es la fecha impresa en la propia factura y es el punto de referencia a partir del cual comienzan todos los cálculos de plazos de pago.",
      "Para los términos Net X estándar, simplemente cuenta X días calendario hacia adelante desde la fecha de la factura. Los fines de semana y días festivos no afectan este cálculo — Net 30 significa 30 días calendario, punto.",
    ],
    articleList2: [
      "Factura del 5 de marzo, términos Net 30 → vence el 4 de abril (30 días después, cruzando el límite del mes)",
      "Factura del 31 de marzo, términos Net 30 → vence el 30 de abril (final de abril, no el 1 de mayo)",
      "Factura del 15 de marzo, términos EOM Net 30 → el mes de factura termina el 31 de marzo, más 30 días → vence el 30 de abril",
      "Factura del 15 de marzo, términos MFI → vence el 30 de abril (último día del mes siguiente a marzo)",
    ],
    articleFooter2: "Si la fecha de vencimiento cae en fin de semana o día festivo, la práctica comercial varía. Algunos contratos especifican que si la fecha de vencimiento cae en un día no laborable, el pago vence el siguiente día hábil. Otros requieren el pago el último día hábil antes del fin de semana o festivo. Tu factura o contrato debe especificar qué convención se aplica.",
    articleTitle3: "Descuentos por pronto pago (2/10 Net 30)",
    article3: [
      "Los términos de descuento por pronto pago como 2/10 Net 30 se usan ampliamente porque benefician a ambas partes, pero vale la pena entender claramente la mecánica financiera. Cuando un proveedor ofrece un 2% de descuento por pago dentro de 10 días en una factura a 30 días, esencialmente está ofreciendo aceptar una cantidad menor a cambio de recibir su dinero 20 días antes.",
      "Para una factura de $10,000 con términos 2/10 Net 30: pagar dentro de 10 días cuesta $9,800 y ahorra $200. Ese ahorro de $200 en 20 días representa un rendimiento anualizado de aproximadamente 36.7% — calculado como (2% ÷ 98%) × (365 ÷ 20). Esta es una tasa de rendimiento extraordinariamente alta en comparación con cualquier inversión normal. Para los compradores con efectivo disponible, tomar el descuento por pronto pago es casi siempre financieramente ventajoso.",
      "Para los proveedores, ofrecer este descuento acelera la recaudación de efectivo y reduce el riesgo crediticio de impago. Muchas empresas utilizan programas de descuento dinámico — donde los compradores pueden ofrecer pagar incluso antes con un descuento proporcionalmente mayor — para optimizar el capital de trabajo para ambos lados de la transacción.",
    ],
    articleTitle4: "Cargos por mora e implicaciones legales",
    article4: [
      "Las facturas impagadas son una de las principales causas de problemas de flujo de caja para las pequeñas y medianas empresas. La mayoría de las jurisdicciones otorgan a los acreedores herramientas legales para recuperar pagos atrasados, pero las reglas específicas varían según el país y los términos del contrato.",
    ],
    articleList4: [
      { label: "Reino Unido", detail: "La Ley de Mora en Deudas Comerciales (Intereses) de 1998 otorga a las empresas el derecho a reclamar intereses legales del 8% más la tasa base del Banco de Inglaterra sobre facturas B2B vencidas, automáticamente y sin necesidad de que conste en el contrato. Las empresas también pueden reclamar costes fijos de recuperación de deuda (£40–£100 según el importe de la factura)." },
      { label: "Estados Unidos", detail: "No existe un estatuto federal equivalente a la ley del Reino Unido. Los derechos de interés por mora dependen del contrato y de la ley estatal. Muchos estados permiten un 1.5% mensual (18% anualizado) si se especifica en el contrato. Sin una disposición contractual, la tasa aplicable suele ser más baja y varía según el estado." },
      { label: "Unión Europea", detail: "La Directiva sobre Morosidad (2011/7/UE) establece un tipo de interés legal del 8% por encima del tipo de referencia del Banco Central Europeo para transacciones B2B, con un plazo máximo de pago de 60 días para transacciones comerciales y 30 días para autoridades públicas." },
    ],
    articleFooter4: "Independientemente de la jurisdicción, es una buena práctica indicar claramente tu política de cargos por mora en cada factura antes de que venza cualquier pago. Una cláusula como «Las facturas impagadas después de 30 días devengarán intereses al 1.5% mensual» es mucho más fácil de hacer cumplir que intentar introducir cargos después del hecho.",
    articleTitle5: "Mejores prácticas de facturación",
    article5: [
      "Una factura bien estructurada reduce disputas, acelera el pago y crea un rastro documental claro. Cada factura debe incluir como mínimo la siguiente información:",
    ],
    articleList5: [
      "Un número de factura único y la fecha de la factura",
      "La fecha de vencimiento explícita (no confíes en que el cliente la calcule — indica «Vence el 4 de abril de 2025»)",
      "Términos de pago claros expresados por escrito (ej. «Net 30 desde la fecha de la factura»)",
      "Métodos de pago aceptados y datos bancarios completos o enlace de pago",
      "Política de cargos por mora, si corresponde",
      "Descripción detallada de bienes o servicios con cantidades y precios unitarios",
    ],
    articleFooter5: "Para el seguimiento, un calendario proactivo funciona mejor: envía un recordatorio amistoso 7 días antes de la fecha de vencimiento, un seguimiento cortés en la propia fecha de vencimiento si aún no se ha pagado, y un aviso más firme 7 días después de la fecha de vencimiento. El seguimiento sistemático reduce drásticamente el número de facturas que se vuelven gravemente vencidas o requieren escalación a una agencia de cobros.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Cuál es la diferencia entre Net 30 y Net 30 EOM?", a: "Net 30 significa que el pago vence 30 días después de la fecha de la factura. Net 30 EOM (Fin de mes) significa que el pago vence 30 días después del final del mes en que se emitió la factura. Una factura del 5 de marzo en términos Net 30 vence el 4 de abril. La misma factura en términos Net 30 EOM vence el 30 de abril (30 días después del 31 de marzo). Los términos EOM efectivamente dan a los clientes más tiempo para pagar las facturas emitidas a principios de mes." },
      { q: "¿Cuándo comienza el reloj de pago: fecha de factura o fecha de recepción?", a: "En la práctica comercial estándar, los plazos de pago se calculan desde la fecha de la factura — la fecha impresa en la factura. Sin embargo, algunos grandes compradores, particularmente en la contratación pública, insisten en que los plazos corran desde la fecha en que reciben y aceptan la factura en su sistema de cuentas por pagar. Si esto se aplica a tus clientes, tu contrato debe especificar «fecha de recepción» explícitamente. A falta de tal especificación, la fecha de la factura es el punto de partida predeterminado." },
      { q: "¿Cuál es un plazo de pago razonable para pequeñas empresas?", a: "Net 14 o Net 30 son los plazos más comunes para pequeñas empresas. Net 30 es ampliamente reconocido como estándar y es esperado por la mayoría de los compradores corporativos. Para clientes con buen historial de pago, Net 14 puede mejorar significativamente tu flujo de caja sin causar fricción. Para clientes nuevos o desconocidos, solicitar un depósito del 50% por adelantado con el saldo contra entrega — o términos CIA — proporciona protección contra el impago." },
      { q: "¿Puedo cobrar intereses sobre facturas vencidas sin indicarlo en la factura?", a: "En el Reino Unido, sí — la Ley de Mora en Deudas Comerciales te otorga el derecho legal de cobrar intereses sobre facturas B2B vencidas incluso sin una cláusula contractual. En la mayoría de las otras jurisdicciones, incluidos los Estados Unidos, generalmente no puedes cobrar intereses más allá de cualquier tasa legal aplicable a menos que tu contrato o factura indique explícitamente el cargo por mora. Siempre consulta a un profesional legal para obtener asesoramiento específico para tu jurisdicción y situación." },
      { q: "¿Cuál es la diferencia entre una factura y una orden de compra?", a: "Una orden de compra (PO) es un documento creado y enviado por el comprador al vendedor, autorizando una compra en los términos acordados. Aparece antes de que se entreguen los bienes o servicios. Una factura es creada y enviada por el vendedor al comprador después de la entrega, solicitando el pago por los bienes o servicios proporcionados. En muchas transacciones B2B, el vendedor hace referencia al número de PO del comprador en la factura para permitir la conciliación — un proceso llamado «conciliación triple» (PO, recibo de entrega, factura) que es estándar en los flujos de trabajo de cuentas por pagar corporativas." },
    ],
  },
};

const TOOLS = [
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計算機", "zh-cn": "工作日计算器", es: "Calculadora de días hábiles" }, description: { en: "Add working days to any date and skip weekends.", "zh-hk": "為任何日期增加工作日。", "zh-cn": "为任何日期增加工作日。", es: "Añade días hábiles a cualquier fecha." }, href: "/business-day-calculator", keywords: ["calendar", "deadline", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數計算機", "zh-cn": "字数计算器", es: "Contador de palabras" }, description: { en: "Count words, characters, and paragraphs instantly.", "zh-hk": "即時計算字數、字符和段落。", "zh-cn": "即时计算字数、字符和段落。", es: "Cuenta palabras, caracteres y párrafos al instante." }, href: "/word-counter", keywords: ["words", "characters", "text"] },
  { title: { en: "URL Encoder / Decoder", "zh-hk": "URL 編碼器 / 解碼器", "zh-cn": "URL 编码器 / 解码器", es: "Codificador / decodificador de URL" }, description: { en: "Encode or decode URLs and query strings in one step.", "zh-hk": "一步編碼或解碼 URL 同查詢字串。", "zh-cn": "一步编码或解码 URL 和查询字符串。", es: "Codifica o decodifica URLs y cadenas de consulta en un solo paso." }, href: "/url-encoder-decoder", keywords: ["url", "encode", "decode"] },
];

function SearchBox({ locale, value, onChange, onNavigate }: { locale: keyof typeof LANGUAGES; value: string; onChange: (value: string) => void; onNavigate: (href: string) => void; }) {
  const hints = locale === "zh-hk" ? ["體積重量", "工作日", "字數", "URL"] : locale === "zh-cn" ? ["体积重量", "工作日", "字数", "URL"] : locale === "es" ? ["weight", "day", "word", "url"] : ["weight", "day", "word", "url"];
  const filtered = TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 4);
  return (
    <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/80">{LANGUAGES[locale].searchLabel}</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-emerald-300" />
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={LANGUAGES[locale].searchPlaceholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">{hints.map((hint) => <button key={hint} type="button" onClick={() => onChange(hint)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10">{hint}</button>)}</div>
      <div className="mt-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">{LANGUAGES[locale].searchHint}</p>
        <div className="grid gap-2">{filtered.map((tool) => <button key={tool.href} type="button" onClick={() => onNavigate(tool.href)} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-300/30 hover:bg-white/10"><div><p className="text-sm font-medium text-white">{tool.title[locale]}</p><p className="mt-1 text-xs text-white/55">{tool.description[locale]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-white/35" /></button>)}</div>
      </div>
    </section>
  );
}

function localDateString(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addBusinessDays(start: Date, days: number) {
  const date = new Date(start);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
}

const SITE_URL = "https://www.tinytoolboxes.com";
const PAGE_PATH = "/invoice-due-date-calculator";

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

export default function InvoiceDueDateCalculator() {
  const [locale, setLocale] = useState<keyof typeof LANGUAGES>(() => (typeof window === "undefined" ? "en" : ((window.localStorage.getItem("ttb-locale") as keyof typeof LANGUAGES) || "en")));
  const today = useMemo(() => localDateString(new Date()), []);
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [termsDays, setTermsDays] = useState("30");
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttb-locale", locale);
    const L = LANGUAGES[locale];
    applySEO({
      title: `${L.title} | TinyToolboxes`,
      description: L.subtitle,
      path: PAGE_PATH,
      jsonLd: { "@context": "https://schema.org", "@type": "WebApplication", name: L.title, url: SITE_URL + PAGE_PATH, description: L.subtitle, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@type": "Organization", name: "TinyToolboxes", url: SITE_URL } },
    });
  }, [locale]);

  const start = parseDate(invoiceDate);
  const terms = Number(termsDays) || 0;
  const dueDate = businessDaysOnly ? addBusinessDays(start, terms) : addDays(start, terms);
  const content = LANGUAGES[locale];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/20"><ReceiptText className="h-5 w-5 text-emerald-300" /></div><div><p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">TinyToolboxes</p><h1 className="text-xl font-semibold">{content.title}</h1></div></div>
          <div className="flex flex-wrap gap-2">{(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((key) => <button key={key} onClick={() => setLocale(key)} className={`rounded-full border px-3 py-2 text-sm transition ${locale === key ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-200" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}>{LANGUAGES[key].name}</button>)}</div>
        </div>

        <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5"><div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"><BadgeDollarSign className="h-4 w-4" />{content.reserveAd}</div><div className="space-y-4"><h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{content.title}</h2><p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{content.subtitle}</p></div></div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2"><span className="text-sm text-neutral-300">{content.invoiceDateLabel}</span><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="space-y-2"><span className="text-sm text-neutral-300">{content.termsDaysLabel}</span><input type="number" min="0" value={termsDays} onChange={(e) => setTermsDays(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/60" /></label>
              </div>
              <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300"><input type="checkbox" checked={businessDaysOnly} onChange={(e) => setBusinessDaysOnly(e.target.checked)} />{content.businessLabel}</label>
              <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{content.resultInvoice}</p><p className="mt-2 text-lg font-semibold">{invoiceDate}</p></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">{content.resultDue}</p><p className="mt-2 text-lg font-semibold text-white">{localDateString(dueDate)}</p></div></div>
            </div>

            <SearchBox locale={locale} value={search} onChange={setSearch} onNavigate={(href) => (window.location.href = href)} />

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle1}</h2>
                {content.article1.map((p: string, i: number) => <p key={i} className="mt-3 leading-7">{p}</p>)}
                <ul className="mt-3 space-y-3 text-white/70">
                  {content.articleList1.map((item: { label: string; detail: string }, i: number) => (
                    <li key={i}><strong className="text-white">{item.label}:</strong> {item.detail}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle2}</h2>
                {content.article2.map((p: string, i: number) => <p key={i} className="mt-3 leading-7">{p}</p>)}
                <ul className="mt-3 space-y-2 text-white/70">
                  {content.articleList2.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 leading-7">{content.articleFooter2}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle3}</h2>
                {content.article3.map((p: string, i: number) => <p key={i} className="mt-3 leading-7">{p}</p>)}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle4}</h2>
                {content.article4.map((p: string, i: number) => <p key={i} className="mt-3 leading-7">{p}</p>)}
                <ul className="mt-3 space-y-3 text-white/70">
                  {content.articleList4.map((item: { label: string; detail: string }, i: number) => (
                    <li key={i}><strong className="text-white">{item.label}:</strong> {item.detail}</li>
                  ))}
                </ul>
                <p className="mt-4 leading-7">{content.articleFooter4}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{content.articleTitle5}</h2>
                {content.article5.map((p: string, i: number) => <p key={i} className="mt-3 leading-7">{p}</p>)}
                <ul className="mt-3 space-y-2 text-white/70">
                  {content.articleList5.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 leading-7">{content.articleFooter5}</p>
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

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">{content.reserveAdSub}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div><div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" /></section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3 text-white"><CalendarDays className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">{content.quickNote}</h2><p className="text-sm text-neutral-300">{content.quickNoteDesc}</p></div></div><div className="space-y-3 text-sm text-neutral-300"><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.tip1}</p><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{content.tip2}</p></div></aside>
        </div>
      </section>
    </main>
  );
}
