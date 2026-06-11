import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeDollarSign, Building2, Search } from "lucide-react";

const LANGUAGES = {
  en: {
  },
};

const SUGGESTION_HREFS: Record<string, string> = {
  "Currency Converter": "/currency-converter",
  "Percentage Calculator": "/percentage-calculator",
  "Invoice Due Date Calculator": "/invoice-due-date-calculator",
};

const TOOLS = [
  { title: { en: "Currency Converter" }, description: "Convert between 30+ currencies with live rates.", href: "/currency-converter", keywords: ["currency", "exchange"] },
  { title: { en: "Percentage Calculator" }, description: "Percentage of a number.", href: "/percentage-calculator", keywords: ["percent", "ratio"] },
  { title: { en: "Unit Converter" }, description: "Convert length, weight, temperature.", href: "/unit-converter", keywords: ["convert", "unit"] },
  { title: { en: "Age Calculator" }, description: "Calculate exact age from a birth date.", href: "/age-calculator", keywords: ["age", "birthday"] },
  { title: { en: "Business Day Calculator" }, description: "Add working days to any date.", href: "/business-day-calculator", keywords: ["calendar", "workday"] },
  { title: { en: "Invoice Due Date Calculator" }, description: "Find invoice due dates.", href: "/invoice-due-date-calculator", keywords: ["invoice", "payment"] },
  { title: { en: "Word Counter" }, description: "Count words and characters.", href: "/word-counter", keywords: ["word", "text"] },
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
  const hints = locale === "zh-hk" ? ["百分比", "貨幣", "單位", "URL"] : locale === "zh-cn" ? ["百分比", "货币", "单位", "URL"] : ["percent", "currency", "unit", "url"];
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
                <h2 className="text-2xl font-bold text-white">How Loan Calculations Work</h2>
                <p className="mt-3 leading-7">When you borrow money, a lender charges interest on the outstanding balance each month. Your fixed monthly payment covers the interest first, then reduces the principal — a process called amortization. This means your early payments are mostly interest, while later payments are mostly principal.</p>
                <p className="mt-3 leading-7">The standard formula for a fixed monthly payment is:</p>
                <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4 font-mono text-emerald-100">
                  M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">Where: M = monthly payment · P = principal · r = monthly interest rate (annual rate ÷ 12) · n = total number of payments (years × 12)</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Worked Example: $300,000 Mortgage at 4.5% for 30 Years</h2>
                <p className="mt-3 leading-7">Let's walk through a realistic home loan calculation step by step:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li><strong className="text-white">Principal (P):</strong> $300,000</li>
                  <li><strong className="text-white">Annual rate:</strong> 4.5%</li>
                  <li><strong className="text-white">Monthly rate (r):</strong> 4.5% ÷ 12 = 0.375% = 0.00375</li>
                  <li><strong className="text-white">Term (n):</strong> 30 years = 360 monthly payments</li>
                </ul>
                <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/5 px-5 py-4 font-mono text-sm text-emerald-100">
                  M = 300,000 × [0.00375 × (1.00375)³⁶⁰] / [(1.00375)³⁶⁰ − 1]<br />
                  M ≈ $1,520.06 per month
                </div>
                <p className="mt-4 leading-7">Over 30 years, the total payments equal $1,520.06 × 360 = <strong className="text-white">$547,220</strong>. The interest cost alone is <strong className="text-white">$247,220</strong> — 82% of the original loan amount. This illustrates why paying even a small extra amount towards principal each month can save tens of thousands of dollars.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Types of Loans</h2>
                <p className="mt-3 leading-7">The same monthly payment formula applies to many loan types, but the terms, rates, and conditions differ significantly:</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { name: "Mortgage", desc: "Secured by real estate. Typically 15–30 year terms at lower interest rates (3–7%). Fixed or adjustable rate options available." },
                    { name: "Auto Loan", desc: "Secured by the vehicle. Usually 36–72 months. Rates range from 4% to 20%+ depending on credit score and whether the car is new or used." },
                    { name: "Personal Loan", desc: "Unsecured general-purpose loan. Higher rates (6%–36%) but flexible use. Terms of 12–60 months. No collateral required." },
                    { name: "Student Loan", desc: "Government or private. Federal loans offer fixed rates and income-driven repayment options. Private loans vary widely by lender." },
                  ].map((t) => (
                    <div key={t.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="mt-1 text-sm text-white/60">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Understanding Amortization</h2>
                <p className="mt-3 leading-7">Amortization is the systematic repayment of a loan through regular scheduled payments. With a standard amortizing loan, each payment is the same dollar amount, but the split between interest and principal changes over time.</p>
                <p className="mt-3 leading-7">For a 30-year $300,000 mortgage at 4.5%, the first payment of $1,520 breaks down approximately like this:</p>
                <ul className="mt-3 space-y-2 text-white/70">
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">$1,125</strong> goes to interest (300,000 × 0.375%)</li>
                  <li className="flex gap-2"><span className="shrink-0 text-emerald-300">→</span><strong className="text-white">$395</strong> reduces the principal balance</li>
                </ul>
                <p className="mt-3 leading-7">By month 180 (year 15), the same $1,520 payment is roughly 60% principal and 40% interest. By month 360, nearly the entire payment is principal. This is why paying an extra $200/month in the first few years of a mortgage can eliminate 4–5 years from the loan and save $30,000+ in interest.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">How to Lower Your Total Loan Cost</h2>
                <ul className="mt-3 space-y-3 text-white/70">
                  <li><strong className="text-white">Make extra principal payments.</strong> Designate extra payments specifically as "principal reduction." Even $100–$200 extra per month on a 30-year mortgage can save tens of thousands in interest over the life of the loan.</li>
                  <li><strong className="text-white">Refinance when rates drop significantly.</strong> If market interest rates fall 1% or more below your current loan rate, refinancing may be worthwhile — even accounting for closing costs of 2%–4%. Use this calculator to compare your current payment against the new payment.</li>
                  <li><strong className="text-white">Choose a shorter term.</strong> A 15-year mortgage has a higher monthly payment but typically carries a rate 0.5%–0.75% lower than a 30-year loan, and the total interest cost is dramatically less. On $300,000 at current rates, a 15-year mortgage saves roughly $120,000 in interest.</li>
                  <li><strong className="text-white">Improve your credit score before applying.</strong> A score improvement from 680 to 760 can reduce a mortgage rate by 0.5%–1%, saving over $15,000 in interest on a typical $300,000 loan over 30 years.</li>
                  <li><strong className="text-white">Shop multiple lenders.</strong> Even a 0.25% rate difference on a $300,000 loan saves over $15,000 over 30 years. Always get at least three competing quotes.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between APR and interest rate?</h3>
                    <p className="mt-1 text-white/70">The interest rate is the annual cost of borrowing the principal amount, expressed as a percentage. APR (Annual Percentage Rate) includes the interest rate plus additional fees such as origination fees, mortgage points, and closing costs. APR gives a more complete picture of the true cost of a loan. When comparing offers from multiple lenders, always compare APRs rather than just advertised interest rates.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is the difference between a fixed-rate and variable-rate loan?</h3>
                    <p className="mt-1 text-white/70">With a fixed-rate loan, the interest rate stays the same for the entire term, so your monthly payment never changes. With a variable-rate (adjustable-rate) loan, the rate is tied to a benchmark index like SOFR or Prime Rate and can change periodically — usually annually after an initial fixed period. Variable-rate loans often start lower but carry the risk of rising payments if market rates increase.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Is it better to choose a 15-year or 30-year mortgage?</h3>
                    <p className="mt-1 text-white/70">A 15-year mortgage has a higher monthly payment but a lower interest rate (typically 0.5%–0.75% less than a 30-year) and you pay far less total interest. On a $300,000 loan at 4.5% for 30 years, total interest is $247,220. The same loan at 3.75% for 15 years costs only $93,000 in total interest — a saving of over $154,000. Choose 30 years if cash flow flexibility is a priority; choose 15 years if you can comfortably afford the higher payment.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">What is PMI and how can I avoid it?</h3>
                    <p className="mt-1 text-white/70">Private Mortgage Insurance (PMI) is required by most lenders when a home buyer puts down less than 20% of the purchase price. PMI typically costs 0.5%–1.5% of the loan amount annually, added to the monthly payment. To avoid PMI: save a 20% down payment, use a piggyback loan structure (80/10/10), or choose a lender that offers no-PMI programs (often at a slightly higher interest rate). PMI can typically be cancelled once you have 20% equity.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Does this calculator include property taxes and insurance?</h3>
                    <p className="mt-1 text-white/70">No — this calculator shows principal and interest (P&I) only. Your actual monthly housing cost (often called PITI) also includes property taxes, homeowner's insurance, and possibly HOA fees and PMI. These additional costs are typically collected by the lender in an escrow account and vary significantly by location. As a rough estimate, add 20%–40% to the calculated P&I payment to account for these costs.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Can this calculator be used for business loans?</h3>
                    <p className="mt-1 text-white/70">Yes. The underlying amortization formula applies equally to business term loans, equipment financing, commercial mortgages, and SBA loans. Enter the loan amount, annual interest rate, and repayment term. Note that some business loans use daily compounding or interest-only periods, which may result in slight differences from this calculator's results — check your loan documents for exact terms.</p>
                  </div>
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
