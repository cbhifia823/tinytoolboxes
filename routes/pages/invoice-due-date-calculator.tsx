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
    reserveAd: "Google Ads space reserved",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "Advertisement",
adBadge: "Reserved",
  },
  "zh-hk": {
    name: "繁體中文",
    title: "發票到期日計算器",
    subtitle: "幫你喺發票日期上加日數，快速計到到期日。",
    searchLabel: "搜尋工具",
    searchPlaceholder: "例如：體積重量、工作日、字數、URL",
    searchHint: "搜尋提示",
    reserveAd: "預留 Google 廣告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "廣告", adBadge: "已預留",
  },
  "zh-cn": {
    name: "简体中文",
    title: "发票到期日计算器",
    subtitle: "在发票日期上加天数，快速算出到期日。",
    searchLabel: "搜索工具",
    searchPlaceholder: "例如：体积重量、工作日、字数、URL",
    searchHint: "搜索提示",
    reserveAd: "预留 Google 广告位",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "广告", adBadge: "已预留",
  },
  es: {
    name: "Español",
    title: "Calculadora de vencimiento de factura",
    subtitle: "Añade días calendario o hábiles a una fecha de factura y obtén el vencimiento al instante.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Prueba: weight, day, word, url",
    searchHint: "Sugerencias de búsqueda",
    reserveAd: "Espacio reservado para Google Ads",
    reserveAdSub: "之後可直接放 AdSense 程式碼。",
adLabel: "Advertisement",
adBadge: "Reserved",
  },
};

const TOOLS = [
  { title: { en: "Business Day Calculator", "zh-hk": "工作日計", "zh-cn": "工作日计算", "es": "Calculadora de días hábiles" }, description: "Add working days to any date and skip weekends.", href: "/business-day-calculator", keywords: ["calendar", "deadline", "workday"] },
  { title: { en: "Word Counter", "zh-hk": "字數統計", "zh-cn": "字数统计", es: "Contador de palabras" }, description: { en: "Count words, characters, and paragraphs instantly.", "zh-hk": "即時計算字數、字符和段落。", "zh-cn": "即时计算字数、字符和段落。", es: "Cuenta palabras, caracteres y párrafos al instante." }, href: "/word-counter", keywords: ["words", "characters", "text"] },
  { title: "URL Encoder / Decoder", description: "Encode or decode URLs and query strings in one step.", href: "/url-encoder-decoder", keywords: ["url", "encode", "decode"] },
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
  const shownTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return TOOLS;
    return TOOLS.filter((tool) => `${tool.title[locale]} ${tool.description[locale]} ${tool.keywords.join(" ")}`.toLowerCase().includes(query));
  }, [search]);

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
                <label className="space-y-2"><span className="text-sm text-neutral-300">Invoice date</span><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/60" /></label>
                <label className="space-y-2"><span className="text-sm text-neutral-300">Payment terms (days)</span><input type="number" min="0" value={termsDays} onChange={(e) => setTermsDays(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-emerald-400/60" /></label>
              </div>
              <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300"><input type="checkbox" checked={businessDaysOnly} onChange={(e) => setBusinessDaysOnly(e.target.checked)} />Count business days only</label>
              <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Invoice date</p><p className="mt-2 text-lg font-semibold">{invoiceDate}</p></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">Due date</p><p className="mt-2 text-lg font-semibold text-white">{localDateString(dueDate)}</p></div></div>
            </div>

            <SearchBox locale={locale} value={search} onChange={setSearch} onNavigate={(href) => (window.location.href = href)} />

            <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-white">Understanding Invoice Payment Terms</h2>
                <p className="mt-3 leading-7">Invoice payment terms define how long a customer has to pay an invoice. Understanding each type is essential for setting clear expectations, managing cash flow, and avoiding disputes. The most common terms are expressed as "Net X" — meaning payment is due within X calendar days of the invoice date.</p>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Net 10 / Net 15 / Net 30 / Net 45 / Net 60 / Net 90:</strong> Payment is due within the specified number of calendar days from the invoice date. Net 30 is the most common standard in B2B commerce. Net 60 and Net 90 are typical in large corporate and government procurement where payment approval cycles are long.</li>
                  <li><strong className="text-white">2/10 Net 30:</strong> A two-part term — the customer can take a 2% early payment discount if they pay within 10 days, otherwise the full invoice amount is due within 30 days. This is sometimes written as "2/10 n/30". The "2/10" part is the discount incentive; the "Net 30" part is the firm deadline.</li>
                  <li><strong className="text-white">EOM (End of Month):</strong> Payment is due at the end of the month in which the invoice was issued, regardless of the invoice date. An invoice dated March 10 with EOM terms is due March 31. An invoice dated March 28 with EOM terms is also due March 31 — giving that customer just 3 days to pay.</li>
                  <li><strong className="text-white">MFI (Month Following Invoice) or Net 30 EOM:</strong> Payment is due at the end of the month following the invoice month. An invoice dated March 15 with Net 30 EOM terms is due April 30 — not April 14. This gives customers more predictable cash flow since they always know payment is due on the last day of the following month.</li>
                  <li><strong className="text-white">CIA (Cash in Advance) / PIA (Payment in Advance):</strong> Full payment is required before goods or services are delivered. Common for custom orders, international trade, and high-risk accounts.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">How to Calculate an Invoice Due Date</h2>
                <p className="mt-3 leading-7">The due date calculation starts from the invoice date — not the date the invoice was received, and not the date the work was completed or the goods were shipped (unless your contract specifically states otherwise). The invoice date is the date printed on the invoice itself, and it is the reference point from which all payment term calculations begin.</p>
                <p className="mt-3 leading-7">For standard Net X terms, simply count X calendar days forward from the invoice date. Weekends and public holidays do not affect this count — Net 30 means 30 calendar days, period. Here are some concrete examples:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Invoice dated March 5, Net 30 terms → due April 4 (30 days later, crossing the month boundary)</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Invoice dated March 31, Net 30 terms → due April 30 (end of April, not May 1)</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Invoice dated March 15, EOM Net 30 terms → the invoice month ends March 31, plus 30 days → due April 30</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Invoice dated March 15, MFI terms → due April 30 (last day of the month following March)</li>
                </ul>
                <p className="mt-4 leading-7">If the due date falls on a weekend or bank holiday, commercial practice varies. Some contracts specify that if the due date falls on a non-business day, payment is due the next business day. Others require payment on the last business day before the weekend or holiday. Your invoice or contract should specify which convention applies.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Early Payment Discounts (2/10 Net 30)</h2>
                <p className="mt-3 leading-7">Early payment discount terms like 2/10 Net 30 are widely used because they benefit both parties — but the financial mechanics are worth understanding clearly. When a vendor offers a 2% discount for payment within 10 days on a 30-day invoice, they are essentially offering to accept a smaller amount in exchange for receiving their money 20 days sooner.</p>
                <p className="mt-3 leading-7">For a $10,000 invoice with 2/10 Net 30 terms: paying within 10 days costs $9,800 and saves $200. That $200 saving over 20 days represents an annualised return of approximately 36.7% — calculated as (2% ÷ 98%) × (365 ÷ 20). This is an extraordinarily high rate of return compared to any normal investment. For buyers with available cash, taking the early payment discount is almost always financially advantageous.</p>
                <p className="mt-3 leading-7">For vendors, offering this discount accelerates cash collection and reduces the credit risk of non-payment. Many businesses use dynamic discounting programmes — where buyers can offer to pay even earlier at a proportionally larger discount — to optimise working capital for both sides of the transaction.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Late Payment Fees and Legal Implications</h2>
                <p className="mt-3 leading-7">Unpaid invoices are one of the leading causes of cash flow problems for small and medium-sized businesses. Most jurisdictions give creditors legal tools to recover late payments, but the specific rules vary by country and contract terms.</p>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">United Kingdom:</strong> The Late Payment of Commercial Debts (Interest) Act 1998 entitles businesses to claim statutory interest of 8% plus the Bank of England base rate on overdue B2B invoices, automatically and without needing it stated in the contract. Businesses can also claim fixed debt recovery costs (£40–£100 depending on the invoice amount).</li>
                  <li><strong className="text-white">United States:</strong> There is no federal statute equivalent to the UK Act. Late payment interest rights depend on the contract and state law. Many states allow 1.5% per month (18% annualised) if specified in the contract. Without a contractual provision, the applicable rate is typically lower and varies by state.</li>
                  <li><strong className="text-white">European Union:</strong> The Late Payment Directive (2011/7/EU) sets a statutory interest rate of 8% above the European Central Bank reference rate for B2B transactions, with a maximum 60-day payment term for commercial transactions and 30 days for public authorities.</li>
                </ul>
                <p className="mt-4 leading-7">Regardless of jurisdiction, it is best practice to clearly state your late payment fee policy on every invoice before any payment is due. A clause such as "Invoices unpaid after 30 days will accrue interest at 1.5% per month" is far easier to enforce than trying to introduce fees after the fact.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Invoice Best Practices</h2>
                <p className="mt-3 leading-7">A well-structured invoice reduces disputes, speeds up payment, and creates a clear paper trail. Every invoice should include the following information as a minimum:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>A unique invoice number and the invoice date</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>The explicit payment due date (do not rely on the customer to calculate it — state "Due by April 4, 2025")</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Clear payment terms spelled out in words (e.g. "Net 30 from invoice date")</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Accepted payment methods and full bank details or payment link</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Late payment fee policy, if applicable</li>
                  <li className="flex gap-2"><span className="text-emerald-300 shrink-0">→</span>Itemised description of goods or services with quantities and unit prices</li>
                </ul>
                <p className="mt-4 leading-7">For follow-up, a proactive schedule works best: send a friendly reminder 7 days before the due date, a polite follow-up on the due date itself if not yet paid, and a firmer notice 7 days after the due date. Systematic follow-up dramatically reduces the number of invoices that become seriously overdue or require escalation to a collections agency.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between Net 30 and Net 30 EOM?</h3>
                    <p className="mt-1 text-white/70">Net 30 means payment is due 30 days after the invoice date. Net 30 EOM (End of Month) means payment is due 30 days after the end of the month in which the invoice was issued. An invoice dated March 5 on Net 30 terms is due April 4. The same invoice on Net 30 EOM terms is due April 30 (30 days after March 31). EOM terms effectively give customers more time to pay for invoices issued early in the month.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">When does the payment clock start — invoice date or receipt date?</h3>
                    <p className="mt-1 text-white/70">In standard commercial practice, payment terms are calculated from the invoice date — the date printed on the invoice. However, some large buyers, particularly in public procurement, insist that terms run from the date they receive and accept the invoice into their accounts payable system. If this applies to your customers, your contract should specify "receipt date" explicitly. Absent any such specification, the invoice date is the default starting point.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is a reasonable payment term for small businesses?</h3>
                    <p className="mt-1 text-white/70">Net 14 or Net 30 are the most common terms for small businesses. Net 30 is widely recognised as a standard and is expected by most corporate buyers. For clients with a good payment history, Net 14 can significantly improve your cash flow without causing friction. For new or unknown clients, requesting a 50% deposit upfront with the balance on delivery — or CIA terms — provides protection against non-payment.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Can I charge interest on overdue invoices without stating it on the invoice?</h3>
                    <p className="mt-1 text-white/70">In the UK, yes — the Late Payment of Commercial Debts Act gives you a statutory right to charge interest on overdue B2B invoices even without a contractual clause. In most other jurisdictions, including the United States, you generally cannot charge interest beyond any applicable statutory rate unless your contract or invoice explicitly states the late payment fee. Always consult a legal professional for advice specific to your jurisdiction and situation.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between an invoice and a purchase order?</h3>
                    <p className="mt-1 text-white/70">A purchase order (PO) is a document created and sent by the buyer to the seller, authorising a purchase at agreed terms. It comes before the goods or services are delivered. An invoice is created and sent by the seller to the buyer after delivery, requesting payment for the goods or services provided. In many B2B transactions, the seller references the buyer's PO number on the invoice to enable matching — a process called "three-way matching" (PO, delivery receipt, invoice) that is standard in corporate accounts payable workflows.</p>
                  </div>
                </div>
              </div>
            </article>

            <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">{content.adLabel}</p><p className="mt-1 text-sm text-white/55">AdSense space reserved</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{content.adBadge}</span></div><div className="mt-4 min-h-[120px] rounded-2xl border border-white/10 bg-black/20" /></section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-3 text-white"><CalendarDays className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold">Quick note</h2><p className="text-sm text-neutral-300">Great for simple billing pages.</p></div></div><div className="space-y-3 text-sm text-neutral-300"><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Use calendar days for straightforward invoice terms.</p><p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Use business days if your billing policy excludes weekends.</p></div></aside>
        </div>
      </section>
    </main>
  );
}
