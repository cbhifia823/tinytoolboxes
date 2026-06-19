# TinyToolboxes — SEO / GEO & AdSense Audit

**Site:** www.tinytoolboxes.com
**Date:** 2026-06-19
**Status context:** AdSense was **rejected previously**; publisher ID `ca-pub-7326539635759576` (from `ads.txt`).
**Scope of this document:** Audit & recommendations only — no code was changed.

---

## TL;DR — why you were almost certainly rejected

Google's most common rejection reasons are *"low value content"* and *"site under construction / not compliant."* Your codebase trips **both**, and the cause is mechanical, not editorial:

1. **AdSense is not actually installed.** `ADSENSE_CLIENT_ID = ""` (empty) on every page that references it, there is **no AdSense verification snippet in `index.html`**, and the loader script exists on only one page (`ups-...`) gated behind a truthy ID it never has. Google literally cannot verify the site or see live ad code.
2. **The whole site looks "under construction."** ~30 pages render visible placeholder UI to real users — *"Google Ads space reserved"* badges, empty dashed boxes, and dev notes leaking into production, including Chinese text `之後可直接放 AdSense 程式碼。` ("you can put the AdSense code here later") and Spanish *"Puedes insertar AdSense aquí más adelante."* shown to English/Spanish visitors.

Fix those two categories and you remove the structural blockers. The rest of this document is the prioritized list.

---

## P0 — Blockers (fix before re-submitting to AdSense)

### 1. Install the real AdSense code site-wide
- **Verification snippet missing.** Add the AdSense loader to `<head>` of `index.html` (it's the global template the server injects into):
  ```html
  <script async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7326539635759576"
    crossorigin="anonymous"></script>
  ```
  Optionally also `<meta name="google-adsense-account" content="ca-pub-7326539635759576">`.
- **`ADSENSE_CLIENT_ID = ""`** in `dhl-`, `fedex-`, and `ups-dimensional-weight-calculator.tsx` — set to `ca-pub-7326539635759576`. While empty, the `<ins class="adsbygoogle">` slots are dead and `adsbygoogle.push({})` is never reached.
- **Loader is per-page and inconsistent.** Only `ups-...` injects the loader; `dhl`/`fedex` rely on a script that isn't there. Load it once globally (in `index.html`) instead of per route.
- Do **not** re-submit until you can load a page and see a real ad request fire (Network tab → `pagead/js/adsbygoogle.js` + `/ads?...`).

### 2. Remove all "reserved ad" placeholder UI and dev text
This is the single biggest "under construction" signal. Affected: ~30 page files (every tool plus `_home.tsx`). Specifically remove/replace:
- `reserveAd` / `reserveAdSub` / `adBadge: "Reserved"` strings and the badges that render them.
- Leaked dev notes shown to users:
  - `之後可直接放 AdSense 程式碼。` appears in the **English and Spanish** locale objects (e.g. `bmi-calculator.tsx`, `xylitol-toxicity*.tsx`).
  - Spanish `reserveAdSub: "Puedes insertar AdSense aquí más adelante."`
- Empty dashed placeholder boxes (`min-h-[120px] ... bg-black/20`). Either render a **real** `<ins class="adsbygoogle">` unit or render nothing. Never ship an empty labelled "Advertisement" box — that violates AdSense policy (ad label with no ad) and looks broken.

### 3. Fix the canonical / structured-data bug on the DHL page
`routes/pages/dhl-dimensional-weight-calculator.tsx` sets `PAGE_PATH = "/fedex-dimensional-weight-calculator"`. Result: the DHL page emits a **canonical and JSON-LD pointing at the FedEx URL**, telling Google the DHL page is a duplicate of FedEx. Set it to `/dhl-dimensional-weight-calculator`.

### 4. Delete orphan / junk files in routed directories
- `routes/pages/xylitol-toxicity.tsx` — a **duplicate** of `xylitol-toxicity-calculator.tsx` with `PAGE_PATH = "/xylitol-toxicity"`. It is **not** registered in `routes/pages/index.ts` and **not** in the sitemap, but it self-declares a canonical to a non-routed URL and has duplicate object keys (`adLabel`/`adBadge` defined twice). Remove it (or merge and 301).
- `routes/data/can-` (17 KB, malformed filename) and `routes/pages/ups-zhcn-and-es.txt` (27 KB raw text in the **pages** dir) — leftover scratch files. Delete them; stray files under `routes/` are a footgun and look unprofessional if ever served.

### 5. Fix broken multilingual data that crashes/garbles pages
`bmi-calculator.tsx` `TOOLS` array is malformed:
- First entry is titled `"Currency Converter"` but has a calorie description and `href: "/calorie-calculator"`.
- `title` is sometimes an object (`{en, "zh-hk", ...}`) and sometimes a plain string, yet the code does `t.title[locale]` and `t.description[locale]` — on string entries this yields `undefined`/garbage, and `TOOLS.find((t) => t.title === name)` never matches the object entries. The "You may also like" / search lists render broken text. Normalize every `TOOLS` entry to the same shape (objects keyed by locale), as `_home.tsx` already does correctly.

---

## P1 — High-impact SEO improvements

### 6. Give every page a unique, hand-written `<title>` and meta description server-side
Right now first-paint meta (what a non-JS crawler sees) comes from `server.ts → injectMeta`, which for most routes falls back to `pathToTitle(path)` (e.g. "Bmi Calculator — …") because **`pages-meta.json` only contains OG images for 10 pet pages** — no `page_title` / `page_description` for any tool. The good per-page titles/descriptions live only in client-side `applySEO`, so the crawler's initial HTML and the rendered content can disagree.
- Populate `pages-meta.json` with a keyword-optimized `page_title` and `page_description` for **all 39 routes** (and the breed pages). Match them to the client `applySEO` values so server HTML and rendered DOM agree.
- Titles should target real search demand, e.g. *"Dog Age Calculator (Human Years) — DNA-Based Formula"*, *"DHL Dimensional Weight Calculator (Volumetric Weight)"*.

### 7. Reduce reliance on client-only rendering for content
The body is 100% React-rendered; `server.ts` injects meta tags but ships an empty `<div id="root">`. Google *can* render JS, but for a content/SEO play this is fragile (slower indexing, risk of partial render, and Bing/GEO crawlers + many LLM crawlers don't execute JS well).
- **Best:** pre-render/SSG the static article + tool shell for each route so the HTML contains the headings and body copy. Given the Zo Space build constraints (no `package.json` edits, Vite SPA), a pragmatic option is a build-time prerender step that writes static HTML snapshots per route, or moving the article copy into the server-injected template.
- **Minimum:** ensure the meaningful copy (H1, intro, the article, FAQ) is in the initial HTML for at least the top pages.
- This matters for **GEO** too: ChatGPT/Perplexity/Google AI crawlers favor pages whose facts are in the raw HTML.

### 8. Add a consistent header/nav and breadcrumbs to every tool page
Only ~5 of 39 pages contain any `<nav>`/header, and **35 pages have no link back to the homepage** (`/`). AdSense explicitly wants "clear navigation," and internal linking is a core ranking factor.
- Add a shared site header (logo → `/`, link to the relevant category hub) and a breadcrumb (`Home › Calculators › BMI Calculator`) on every page.
- Add `BreadcrumbList` JSON-LD to match.
- Cross-link related tools (the "You may also like" pattern is good — just make it work everywhere and fix the data bug in #5).

### 9. Deepen thin content
AdSense and rankings both reward substance. Many tool pages have a single short article paragraph (e.g. BMI's `articleBody` is two sentences). For each tool add:
- A 300–600 word explainer (how it works, formula, worked example, caveats).
- An **FAQ section** with `FAQPage` JSON-LD (great for rich results *and* AI answer surfaces).
- Sources/citations where relevant (the pet pages cite UCSD/AAFP — extend that everywhere; it builds E-E-A-T).

### 10. Improve the sitemap and robots
`routes/api/sitemap.xml.ts`:
- The route list is **hardcoded** and must be manually synced with `routes/pages/index.ts` — they will drift. Generate it from the page registry / `pages-meta.json` instead.
- Add `<lastmod>` (helps recrawl), and consider `hreflang` alternates since you ship 4 locales (en / zh-HK / zh-CN / es) — currently locales are client-state only with **no separate URLs**, so Google sees one English page. To rank in zh/es you need either distinct URLs (`/es/...`) or `hreflang`. Decide whether multilingual is a real SEO goal; if not, consider dropping the half-translated UI to avoid mixed-language pages (see #2).
- `robots.txt` is fine, but consider explicitly allowing `/` and pointing to the sitemap (already done) and **not** blocking the AdSense bot.

---

## P2 — Polish / GEO / monetization tuning

11. **OG images:** only the 10 pet pages set `page_og_image_url`. Add per-category OG images (or a templated one) for the rest so social/AI previews aren't generic.
12. **`og:site_name` mismatch:** `index.html` and `App.tsx` hardcode `"Zo Space"` while per-page `applySEO` sets `"TinyToolboxes"`. Make the brand consistent ("TinyToolboxes") everywhere.
13. **Three SEO layers can fight each other:** `server.ts injectMeta`, `App.tsx SeoDefaults`, and per-page `applySEO` all touch title/canonical/meta. The `data-zo-default-seo` guard helps, but per-page `applySEO` doesn't set that flag and can double-manage tags. Consolidate to one source of truth per tag to avoid duplicate canonicals/OG tags.
14. **Performance / Core Web Vitals:** measure LCP/CLS. Empty ad placeholders cause layout shift (CLS); real ad units should reserve fixed height. Lazy-load below-the-fold.
15. **GEO specifics:** add `Organization` + `WebSite` JSON-LD with `SearchAction` on the homepage; keep answer-style content (definition first, then detail) so LLMs can quote you; ensure facts live in static HTML (#7).
16. **Ad placement once approved:** don't over-stuff. Start with one in-content + one footer unit per tool; the dimensional-weight pages already define `leaderboard / in-content / footer` slots — reuse that pattern, with real slot IDs, sitewide.
17. **IndexNow:** you have `scripts/indexnow-submit.sh` and `routes/api/indexnow-key.ts` — good. Wire it into your deploy so new/changed URLs get pinged automatically.

---

## Suggested execution order

1. **P0 #1–#5** (AdSense install + strip placeholders + canonical/data/orphan fixes) — required before any re-submission.
2. Verify a clean crawl: live ad request fires, no placeholder text, no broken canonicals (`/sitemap.xml`, view-source on 5 pages).
3. **P1 #6, #8, #9** (per-page meta, nav/breadcrumbs, deeper content) — biggest traffic upside and also strengthens the AdSense "value" case.
4. Re-submit to AdSense.
5. **P1 #7, #10 + P2** as ongoing improvements.

---

## Quick reference — file pointers

| Finding | Where |
|---|---|
| Empty AdSense client ID | `routes/pages/{dhl,fedex,ups}-dimensional-weight-calculator.tsx` (`ADSENSE_CLIENT_ID = ""`) |
| No global AdSense loader | `index.html` (`<head>`) |
| Placeholder/dev text leak | `_home.tsx` + ~29 tool pages (`reserveAd`, `之後可直接放…`, `Puedes insertar AdSense…`) |
| Wrong canonical | `dhl-dimensional-weight-calculator.tsx:434` (`PAGE_PATH`) |
| Orphan/duplicate page | `routes/pages/xylitol-toxicity.tsx` |
| Junk files | `routes/data/can-`, `routes/pages/ups-zhcn-and-es.txt` |
| Broken TOOLS data | `bmi-calculator.tsx` (`TOOLS` array) |
| Missing per-page meta | `pages-meta.json` (only 10 OG entries, 0 titles/descriptions) |
| Hardcoded sitemap | `routes/api/sitemap.xml.ts` |
| Brand mismatch | `index.html` / `App.tsx` ("Zo Space") vs `applySEO` ("TinyToolboxes") |
