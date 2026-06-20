# Expansion Plan for Zo — Adding High-Value Tool Pages (Compliance-Safe)

**Audience:** Zo (build agent)
**Source:** Perplexity report *"100 One-Page Website Ideas Ranked by Ad Income Potential"* (June 2026)
**Author:** Claude (planning)
**Date:** 2026-06-20

---

## 1. Objective

Grow TinyToolboxes by adding new single-purpose tool pages drawn from the 100-ideas
report, **while never offering financial, investment, tax, legal, medical, or
insurance advice** — or any other regulated advice.

This matters twice over:

1. **Legal/regulatory risk.** Telling someone they "qualify" for a loan, what their
   lawsuit is "worth," which insurance to buy, or whether they have a medical
   condition can constitute regulated advice (financial advice, legal advice,
   practising medicine, insurance broking). We must not do that.
2. **AdSense / YMYL risk.** Google treats finance, health, and legal as
   "Your Money or Your Life" topics. Pages that read as unqualified advice get
   demoted or rejected for ads. Neutral *calculators* and *utilities* with clear
   disclaimers are fine — that is exactly the niche we already occupy
   (BMI, calorie/TDEE, loan, Australian mortgage calculators all ship today).

> **The one rule that governs everything below:**
> **We build deterministic calculators and utilities. We never build
> eligibility checkers, valuations, recommendations, diagnoses, or anything
> that tells a user what they *should* do.**

A calculator that computes a number from the user's own inputs using a published,
citable formula is a tool. A page that says *"you qualify," "you should buy,"
"your claim is worth," "you may have condition X"* is advice. The first is in
scope; the second is out.

---

## 2. Triage of all 100 ideas

Every idea is sorted into one of three buckets. Build strictly from GREEN and
the approved AMBER list. Do **not** build RED.

### 🟢 GREEN — Build freely (non-regulated utilities & calculators)

These carry no regulated-advice risk. They are the priority.

**Developer / Web / SaaS utilities** (highest RPM among the safe set, lowest competition):
- #26 Meta Tag / Google SERP Preview Tool
- #27 Website Uptime Checker
- #31 Email Subject Line Tester
- #32 Domain Age Checker
- #33 SSL Certificate Checker
- #40 Robots.txt Generator
- #41 XML Sitemap Generator
- #45 Unix Timestamp Converter
- #55 WHOIS Lookup Tool
- #56 Password Strength Checker
- #61 QR Code Generator (URL / WiFi / contact / text)
- #62 IP Address Lookup
- #63 JSON Formatter / Validator
- #78 Base64 Encoder / Decoder
- #88 Random Password Generator
- #93 Color Palette Generator
- #70 Text-to-Speech Converter

**Everyday / time / lifestyle utilities** (huge traffic, trivial build):
- #87 Online Timer / Stopwatch / World Clock
- #100 Online Alarm Clock
- #99 Countdown Timer to a Date
- #95 Tip & Bill-Split Calculator
- #21 Sleep Cycle Calculator
- #64 Today's Moon Phase
- #24 Astrology / Birth Chart (entertainment)
- #75 MBTI Personality Type Explainer
- #76 Jet Lag Calculator
- #96 Name Meaning Lookup
- #91 Random Wikipedia Article
- #97 Sound Buttons Board
- #98 Meme Generator

**Career / education / productivity:**
- #49 LinkedIn Headline Generator
- #52 Freelance Hourly Rate Calculator
- #66 Study Time Calculator
- #67 "How Long to Read" Book Estimator
- #68 Resume ATS Checker
- #83 SAT / ACT Score Percentile Calculator
- #86 GPA Calculator
- #85 Best Time to Visit (country guides — content pages)
- #77 Flight Carbon Footprint Calculator

**Health/fitness math (non-diagnostic; same class as our existing BMI/TDEE):**
- #43 Calorie Deficit Calculator
- #59 Macro Calculator (Keto / IIFYM)
- #82 Ideal Body Weight Calculator
- #81 Intermittent Fasting Timer
- #46 Alcohol Units Calculator *(add a "know your limits" health note)*
- #42 Ovulation Calculator *(add medical disclaimer)*
- #71 Pregnancy Due Date Calculator *(add medical disclaimer)*

### 🟡 AMBER — Build ONLY as a neutral calculator/utility, with a mandatory disclaimer and reframing

Allowed, but the framing must be locked down. **No recommendations, no eligibility
verdicts, no personalised advice — only arithmetic on the user's inputs, plus a
disclaimer (see §4).** Rename anything that sounds like advice.

**Pure-math finance calculators** (we already ship loan + AU mortgage in this exact style):
- #72 Compound Interest Calculator
- #15 Debt Payoff Calculator
- #16 Retirement Savings Calculator *(label "projection," not "plan")*
- #19 Dollar-Cost Averaging Calculator
- #23 Net Worth Calculator
- #35 Stock Dividend Calculator
- #51 Crypto Profit / Loss Calculator
- #5 Mortgage Calculator (generic) / #60 Mortgage Affordability Calculator *(say "estimate how much a lender might consider," never "how much you can afford")*
- #38 Rent vs. Buy Calculator *(present both numbers; do not conclude which is "better")*
- #13 Stamp Duty Calculator *(cite the official rate table per jurisdiction)*
- #25 Rental Yield Calculator
- #28 Home Renovation ROI Calculator
- #79 Moving Cost Estimator

**Tax calculators** — allowed as *estimates* only, headline disclaimer "estimate, not tax advice," link to the official tax authority:
- #3 Tax Refund Estimator
- #2 Crypto Tax Calculator
- #18 Inheritance Tax Calculator
- #17 Wage Garnishment Calculator *("based on statutory formulas; not legal advice")*

**Informational reference pages** (state facts/figures, never "what you should do"):
- #8 Small Claims Court Limits by State *(a reference table of published limits — not legal guidance)*
- #84 Visa Requirement Checker *(restate official entry rules; "verify with the embassy")*
- #34 Fear & Greed Index display *(show the public index; no buy/sell language)*

**Comparison / data pages** — factual spec tables only, disclose affiliate links, no "best for you" verdicts. Higher maintenance (data goes stale):
- #50 Web Hosting Speed Comparison
- #57 VPN Comparison
- #53 Coding Bootcamp Comparison
- #37 Scholarship Finder (International Students)
- #80 Property Value Estimator *(rough estimate + heavy disclaimer; risky — lowest AMBER priority)*

**Needs an external capability** (heavier build — schedule later):
- #39 Website Screenshot Tool (headless browser)
- #69 AI Cover Letter Generator (LLM call)
- #54 Privacy Policy Generator *(generates a legal document — keep as a fill-in-the-blanks template with "not legal advice," or skip)*

### 🔴 RED — Do NOT build (regulated advice / unacceptable liability)

These are inherently advice or diagnosis. The report ranks several at the very top
precisely *because* they sit in regulated niches — that is the trap.

- #1 Personal Injury Lawsuit Settlement Estimator — *valuing a legal claim = legal advice*
- #4 Student Loan Forgiveness Eligibility Checker — *eligibility determination*
- #6 Divorce Cost Estimator — *legal-process advice, sensitive*
- #7 DUI / Traffic Fine Calculator — *legal penalty/advice*
- #44 Business Loan Eligibility Checker — *lending eligibility determination*
- #20 Credit Score Impact Simulator — *personalised financial advice*
- #9 Life Insurance Needs Calculator — *insurance recommendation*
- #10 Car Insurance Quote Comparison — *regulated insurance broking / quotes*
- #11 Credit Card Comparison Tool — *regulated financial-product recommendation*
- #36 Health Insurance Plan Comparison — *insurance recommendation*
- #29 Travel Insurance Comparison — *insurance recommendation*
- #12 Binary Options / Forex Risk Calculator — *binary options are restricted/banned in many markets and prohibited by ad networks; investment advice*
- #14 Mental Health Screening Quiz (PHQ-9) — *clinical screening / diagnosis*
- #65 Symptom Checker — *medical diagnosis*
- #30 Drug Interaction Checker — *medical advice, safety liability*
- #47 Vaccine Schedule Checker — *medical advice*
- #48 Blood Pressure Tracker — *logging is fine, but interpreting readings is medical advice — skip to stay clear*

> If we ever want a topic from the RED list, the only compliant path is a plain
> **informational/educational article** (no input→verdict tool), written
> generically, with prominent disclaimers and "consult a professional" — and even
> then, several (binary options, symptom/diagnosis tools) should stay off the site
> entirely. Treat RED as off-limits unless the user explicitly approves a specific
> reframed article.

### Already shipped / duplicates — skip or extend, don't rebuild
- #90 Currency Converter → have `/currency-converter`
- #92 Cooking Unit Converter → extend `/unit-converter`
- #89 / #94 Word & Character Counter / Reading Time → extend `/word-counter`
- #58 TDEE Calculator → have `/calorie-calculator`
- #73 BMI Calculator → have `/bmi-calculator`
- #22 Meeting Time Zone Finder → extend `/time-zone-converter`

---

## 3. Recommended build roadmap

Sequenced by: low regulatory risk → strong ad value → quick build → fits our stack.
Each batch is a normal feature branch + PR.

**Sprint 1 — Developer/SEO utilities (best safe RPM, near-zero competition, pure client-side):**
QR Code Generator, JSON Formatter/Validator, Base64 Encoder/Decoder, Unix Timestamp
Converter, Password Strength Checker, Random Password Generator, Color Palette
Generator, Meta Tag/SERP Preview.

**Sprint 2 — Network/lookup utilities (need a small server route, like our existing `/api`):**
SSL Certificate Checker, Domain Age Checker, WHOIS Lookup, IP Address Lookup,
Website Uptime Checker.

**Sprint 3 — Everyday high-traffic utilities:**
Online Timer/Stopwatch/Clock, Online Alarm Clock, Countdown Timer to a Date,
Tip & Bill-Split Calculator, Sleep Cycle Calculator, Today's Moon Phase.

**Sprint 4 — Safe finance *calculators* (AMBER, disclaimer-locked; mirror the existing loan/mortgage pages):**
Compound Interest, Debt Payoff, Retirement Savings projection, Net Worth,
Dollar-Cost Averaging, generic Mortgage + Affordability, Rent vs. Buy.

**Sprint 5 — Health-math & lifestyle (GREEN, with disclaimers):**
Calorie Deficit, Macro (Keto/IIFYM), Ideal Body Weight, Intermittent Fasting Timer,
Ovulation, Due Date, Alcohol Units.

**Sprint 6 — Career/education + entertainment:**
GPA, SAT/ACT Percentile, Resume ATS Checker, Freelance Rate, Study Time,
Book Reading-Time, LinkedIn Headline, MBTI Explainer, Astrology/Birth Chart,
Name Meaning, Jet Lag, Meme Generator, Sound Buttons, Random Wikipedia.

Tackle AMBER comparison/tax/reference pages last (higher maintenance + tighter
compliance review), and only after a human sign-off on the disclaimer wording.

---

## 4. Compliance requirements (apply to every AMBER page — and any finance/health/legal-adjacent GREEN page)

1. **Disclaimer block, above the fold and in the footer.** Use wording such as:
   - Finance: *"This calculator is for general information and educational
     purposes only and is not financial, investment, or tax advice. Results are
     estimates based on the figures you enter. Consult a licensed professional
     before making any decision."*
   - Tax: *"Estimate only — not tax advice. Verify with [official tax authority]."*
   - Health: *"For general information only and not a substitute for professional
     medical advice. Consult a qualified healthcare provider."*
2. **No verdict language.** Ban phrases like "you qualify," "you should,"
   "you can afford," "best for you," "we recommend," "your claim is worth,"
   "you may have." Present numbers and let the user decide.
3. **Show the formula and cite the source** (e.g. WHO, the official stamp-duty
   table, the lender-agnostic amortization formula). This is what makes it a
   *tool*, not *advice* — and it's good SEO.
4. **No data collection / no accounts.** Everything computes in the browser (or a
   stateless API route); store nothing personal.
5. **Affiliate/comparison transparency.** Any comparison page must label affiliate
   links and present neutral spec tables, not rankings of "the best."
6. **Reuse a shared `<Disclaimer />` component** so wording is consistent and
   editable in one place (create it in Sprint 4, retrofit Sprints 1–3 if needed).

---

## 5. Per-page build checklist (match the existing repo conventions)

For each new tool, follow the pattern already used by `routes/pages/bmi-calculator.tsx`:

1. **Create** `routes/pages/<slug>.tsx` — a self-contained React/TSX page.
2. **Localize** in all four locales already used site-wide: `en`, `zh-hk`,
   `zh-cn`, `es` (same `LANGUAGES` object pattern as existing pages).
3. **Register** the route in `routes/pages/index.ts` (`"/<slug>": { component: lazy(...), public: true }`).
4. **List it on the homepage** in `routes/pages/_home.tsx` — add a card with the
   right `category` (existing categories: `calculators`, `converters`, `text`,
   `language`, `logistics`, `health`, `finance`, `pets`; add `developer`,
   `time`, `lifestyle`, `career` as new categories as needed) and translated
   title/description.
5. **SEO content**: unique title, meta description, an explanatory article section,
   "use cases," and internal links ("You may also like") to 2–3 related tools.
6. **Ad slots**: reuse the existing reserved AdSense slot markup so the page is
   ready for ads on launch.
7. **Compliance**: add the `<Disclaimer />` block where §4 requires it.
8. **Add `og_image`** to `pages-meta.json` if it needs a custom social image.
9. **Verify** locally (`bun server.ts`) and confirm no runtime errors before PR.

Do **not** run `bun add` / edit `package.json` — use the pre-installed deps or
pinned `esm.sh` URLs, per the repo README.

---

## 6. What I need from the user / Zo before mass-building

- **Confirm the GREEN list and Sprint 1** as the starting point (these are
  zero-risk and high value).
- **Sign off on the disclaimer wording in §4** before any AMBER (finance/tax/
  health) page ships.
- **Confirm RED stays off the site** (or name any single RED topic to be reworked
  into a disclaimer-heavy *article*, not a tool).
