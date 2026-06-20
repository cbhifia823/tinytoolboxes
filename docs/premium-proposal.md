# TinyToolboxes — Premium / Subscription Proposal

_Prepared: 2026-06-20. Status: proposal for discussion — no billing code has been written._

## TL;DR

- Ads alone leave money on the table. A **freemium top‑up** is sensible, but **per‑tool subscriptions will not convert** — nobody subscribes to a percentage calculator.
- Sell **one site‑wide "TinyToolboxes Pro"** that unlocks premium across every tool, plus a **one‑time lifetime unlock** (lifetime converts best for utilities).
- Add a separate **Business / API tier** for the handful of tools companies actually pay for (shipping, currency, business‑day).
- The premium *value* is four cross‑cutting features, not per‑tool gimmicks: **ad‑free**, **export (PDF/CSV)**, **save & history (accounts)**, **batch + API**.
- Keep the free tier strong — it is the SEO and ad engine. Premium = power‑user add‑ons, never the basic answer.
- **Stripe SDK is already a dependency** (`stripe@17.7.0`), so billing was clearly anticipated. The real work is **accounts/auth + a Pro entitlement check**, not the per‑tool features.

---

## 1. Strategy & tiers

| Tier | Price (sketch) | Who | Unlocks |
|---|---|---|---|
| **Free** | $0 (ads) | Everyone | Every tool's core answer, fully usable. SEO/ad engine. |
| **Pro** | **$2.99/mo · $19/yr · $29 lifetime** | Power users | Ad‑free, export (PDF/CSV), save & history, higher limits, advanced options across all tools. |
| **Business / API** | **$19–49/mo** | SMBs, e‑commerce, ops | Batch/bulk processing, API keys, custom holiday calendars, branded quote PDFs, higher rate limits. |

Notes:
- **Push the $29 lifetime.** Utility audiences resent recurring charges for tools; a one‑time unlock converts far better and still funds development.
- The **Business/API tier is where real revenue is** — it is concentrated in shipping/finance/business‑day.

---

## 2. Per‑page assessment

### 🟢 Strong willingness‑to‑pay — build premium here first
| Page | Premium feature(s) | Tier |
|---|---|---|
| **UPS / FedEx / DHL / Volumetric weight** | CSV **batch** (price hundreds of parcels), saved carrier/divisor profiles, branded quote PDF, **API** for e‑commerce backends | Business/API |
| **Currency Converter** | Historical rates + charts, **rate alerts**, batch convert, CSV export, **API**, no rate‑limit | Pro + API |
| **Loan Calculator** | Amortization **export** (PDF/CSV), extra‑payment & multi‑loan **comparison scenarios**, saved scenarios | Pro |
| **Mortgage (Australia)** | Offset‑account modelling, extra repayments, stamp duty, side‑by‑side comparison, lender‑ready PDF | Pro |
| **Business Day Calculator** | **Custom company holiday calendars**, batch, more countries, API | Business/API |
| **Invoice Due Date** | Batch invoices, recurring schedules, calendar/CSV export | Pro + Business |

### 🟡 Medium — solid freemium upsell (mostly export / save)
| Page | Premium feature(s) |
|---|---|
| **BMI / Calorie** | Save profile, **track over time + charts**, personalized targets, PDF health summary |
| **Word Counter** | Keyword density / SEO, readability scores, no length cap, export, (optional) grammar |
| **Rhyme Zone** | Advanced filters (syllables/meter), bigger DB, saved word lists, ad‑free for songwriters |
| **Unit Converter** | Batch, custom units, engineering precision, API |
| **Time Zone Converter** | Saved "teams" / meeting planner + calendar export, more zones |
| **Pet Calorie / Puppy Weight / Body‑Condition** | Save **multiple pet profiles**, growth tracking charts, vet‑ready PDF |
| **Wheel Spinner** | Save wheels, large lists, custom branding/themes — **teacher/classroom** angle |
| **Famous Birthdays** | "Follow" + birthday **reminders/email**, ad‑free |

### 🔴 Keep free — SEO/ad magnets, weak premium
Age, Date Difference, Percentage, URL Encoder/Decoder, Dog/Cat Age, Minesweeper, Breeds directory & profiles. Monetize via ads; use as funnels into Pro.

### ⚠️ Ethical carve‑out — do **not** paywall the answer
**Can my dog/cat eat…**, **Chocolate / Xylitol / Lily toxicity checkers**: the safety verdict must stay **100% free**. Paywalling "is this poisoning my pet?" is harmful and a reputational risk. Premium here is **convenience only** — save your pet's allergies, full searchable food database, nearby‑vet helper.

---

## 3. The four cross‑cutting premium features (the actual product)

1. **Ad‑free** — a single toggle once entitlement exists; trivial after foundation.
2. **Export** — PDF/CSV of any result. Highest perceived value on Loan, Mortgage, weight calculators, Currency.
3. **Save & history** — requires accounts: saved scenarios, pet/health profiles, tracking over time.
4. **Batch + API** — the B2B money. CSV in / CSV out, plus API keys with rate limits.

---

## 4. Implementation plan — the foundation (build this before any per‑tool feature)

The per‑tool features are small; the foundation is the project. Suggested approach that fits the current stack (Vite React SPA + `bun server.ts` + server routes under `routes/api/*` + Stripe SDK already installed):

### 4.1 Data store
- The site currently has **no database**. Add a lightweight one — **SQLite via `bun:sqlite`** (zero external infra, file lives next to the server) is the simplest fit; swap for hosted Postgres later if needed.
- Tables: `users(id, email, created_at)`, `entitlements(user_id, plan, status, current_period_end, stripe_customer_id, stripe_subscription_id)`, `api_keys(key, user_id, rate_limit)`.

### 4.2 Auth (accounts)
- Keep it light: **email magic‑link** (passwordless) or **Google OAuth**. No passwords to store.
- Issue a signed **HTTP‑only session cookie**; expose `GET /api/me` → `{ email, isPro, plan }`.

### 4.3 Billing (Stripe — SDK present)
- **Stripe Checkout** for both the subscription prices and the one‑time lifetime price.
- **Stripe Customer Portal** for self‑service cancel/update (no custom billing UI needed).
- **Webhook** `POST /api/stripe-webhook` handling `checkout.session.completed`, `customer.subscription.updated/deleted`, `invoice.paid` → write `entitlements`. **This is the source of truth — never trust the client.**
- Store `STRIPE_SECRET_KEY` / webhook secret in environment config (the repo already uses env via `zosite.json`).

### 4.4 Entitlement gating
- **Client (UX only):** a `useEntitlement()` hook reads `/api/me`; premium controls show a lock + "Upgrade" when not Pro. Convenient, but **not security**.
- **Server (enforcement):** every premium *server* endpoint (PDF/CSV generation, batch, API) re‑checks entitlement from the session/API key before doing work. Client‑only features (e.g. an ad‑free toggle, advanced front‑end options) can be gated client‑side.

### 4.5 Build order (phased)
1. **Phase 0 — Foundation:** SQLite + auth + Stripe Checkout/portal + webhook + `/api/me` + `useEntitlement()`. Ship with **one** visible benefit: **ad‑free**.
2. **Phase 1 — Export anchor:** PDF/CSV export wired into Loan, Mortgage, the weight calculators, and Currency. This is the clearest "worth paying" moment.
3. **Phase 2 — Business/API anchor:** CSV **batch** for the dimensional‑weight tools + simple API keys + rate limiting. Most likely real revenue.
4. **Phase 3 — Save & history:** accounts‑backed profiles/tracking for BMI/Calorie and the pet tools; saved scenarios for finance tools.
5. **Phase 4 — Long tail:** Rhyme Zone, Word Counter, Time Zone, Wheel Spinner extras.

---

## 5. Pricing sketch
- **Pro:** $2.99/mo · $19/yr · **$29 lifetime** (lead with lifetime).
- **Business / API:** $19–49/mo by limits/seats.
- Consider a **7‑day Pro trial** or a metered free allowance (e.g. 3 exports/month free) to seed conversion.

## 6. Honest assessment / risks
- Conversion on free utility tools is typically **low single digits**; the win is concentrated in the 🟢 **Business/API** group. Treat Pro as a modest ad‑revenue top‑up, not the main line.
- **Accounts + billing add real surface area** (auth security, PCI handled by Stripe, GDPR/email, support). Don't start until the model is decided.
- Adding accounts means a **privacy‑policy update** (we just generalized it away from naming AdSense — it would need a "Pro accounts & payments via Stripe" section).
- Keep safety‑critical info free (see §2 carve‑out).

## 7. Recommended next step
Decide on **(a)** Pro pricing/model and **(b)** whether to pursue the Business/API tier. Once decided, the first concrete deliverable is **Phase 0 (foundation) + ad‑free**, after which each per‑tool premium feature is a small, incremental PR.
