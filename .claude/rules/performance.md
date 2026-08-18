---
paths:
  - "src/**/*.tsx"
  - "src/app/**"
  - "src/components/**"
  - "public/**"
  - "next.config.ts"
  - "next.config.mjs"
  - "budget.json"
  - ".github/workflows/perf.yml"
---

# Build, Performance & Web Vitals

## Image & Asset commands
- `npm run optimize-images` - Optimize all images (WebP, AVIF, compression)
- `npm run convert-gifs` - Convert GIFs to WebM/MP4 for better performance
- `npm run perf-audit` (production) / `npm run perf-audit:local` (localhost) / `:compare` / `:history`

## Build & Performance

### Image Optimization
- Automatic WebP/AVIF generation
- GIF to WebM/MP4 conversion for animations
- Responsive image sizing with Next.js Image
- Aggressive caching (1 year TTL)

### Bundle Optimization
- Custom webpack configuration for chunk splitting
- Separate bundles for: framework, motion, syntax-highlighter, search
- Tree shaking and dead code elimination
- Turbo mode in development

### Performance Monitoring
- Vercel Speed Insights integration
- Build metrics tracked in `build-metrics.json`
- Core Web Vitals optimization

### Performance Considerations
- Optimize images before adding to `public/images/`
- Use Next.js Image component for all images
- Implement lazy loading for heavy components
- Monitor bundle size impact of new dependencies

## Performance & Web Vitals (incident table)

The recurring class of issue. Every entry below is a real incident we hit and fixed — consult this table FIRST during any perf investigation, before forming new hypotheses.

| Issue | Date | Solution |
|-------|------|----------|
| **Lab vs field gap is real** | Feb 2026, Apr 2026 | Lighthouse lab scores routinely diverge from real-user experience on this codebase. Case study: `/agent-readability-audit-kit` showed **100/100 Performance, 0.5s LCP on LHCI desktop preset**; the same page on **LHCI mobile preset** showed **83/100, 4.57s LCP** (9x delta); Microsoft Clarity real-user data for the same URL and day showed **63/100, 106s LCP** (a further 23x delta vs lab mobile). Three lessons: (1) **Always run Lighthouse with mobile preset** — desktop hides CSR/hydration issues. (2) Lab tests use ideal hardware/network; real users don't. (3) **Always cross-check field data (Vercel Speed Insights tab + Microsoft Clarity URL export) before declaring a perf fix successful.** A green lab score is necessary but not sufficient. |
| **`adjustFontFallback: false` causes site-wide CLS** | Apr 2026 | With `display: swap`, the fallback font's metrics didn't match Satoshi → text reflowed when Satoshi loaded. Set `adjustFontFallback: 'Arial'` in the `next/font/local` config so Next generates a size-adjusted `@font-face` that matches Satoshi metrics — eliminates layout shift on swap site-wide. **Never set this to `false`.** |
| **Manual `<link rel="preload">` conflicts with `next/font` `preload: true`** | Apr 2026 | `next/font/local` with `preload: true` already emits scoped preloads on the pages that use each weight. Manual `<link rel="preload">` tags in `layout.tsx` preload globally even when unused, triggering "preloaded but not used within a few seconds" console warnings and wasting header bytes. **Don't double-preload fonts.** |
| **Carousel `priority={current === 0}` mis-promotes below-fold media to LCP** | Apr 2026 | `Carousel.tsx` had `priority={current === 0}` which made the first slide (often a 4-16MB MP4) eager-load even though the carousel sits well below the Problem/Solution sections on pattern pages. Browser then mis-promoted the carousel video to LCP candidate. **Drop `priority` on below-fold carousels.** Rely on the existing `IntersectionObserver` in `OptimizedMedia.tsx` to gate rendering until scrolled into view. |
| **`<video autoPlay>` without `preload="metadata"` downloads full file eagerly** | Apr 2026 | Even when not yet visible, autoplay videos default to `preload="auto"` which fetches the entire file. Set `preload="metadata"` on every `<video>` so only container/codec info loads until autoplay actually starts. Saved ~10MB on initial paint per pattern page. |
| **Oversized carousel media in `public/images/examples/`** | Apr 2026 | 10 MP4s were 4-16MB each (raw exports at 2772×1454). Re-encode with `ffmpeg -vf "scale='min(1200,iw)':-2" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -an` for ~90% reduction. Animated `.webp` files: re-compress with `sharp({ animated: true }).webp({ quality: 75, effort: 6 })`. **Always run media through this pipeline before committing.** Keep the original `.gif` files in place as `<video onError>` fallbacks — `OptimizedMedia.tsx` checks for them. |
| **Microsoft Clarity dev/preview pollution masks real issues** | Apr 2026 | Clarity tag was firing on `localhost:3000`, polluting production metrics with dev sessions. Gate with `{process.env.NODE_ENV === 'production' && <ClarityScript />}` AND a runtime hostname check excluding `localhost`, `127.0.0.1`, `*.local`, `*.vercel.app`. To clean up existing dev sessions in the dashboard: Clarity → Filters → URL `does not contain "localhost"`, save as default segment. |
| **framer-motion creeps into the homepage critical-path bundle** | Mar 2026 | A single `motion.div` import in any component reachable from the homepage (e.g., `InlineNewsletterSignup`, `UnifiedSearchBar`, `FilterPills`) pulls the full ~85KB framer-motion library into the initial JS bundle. CSS transitions are sufficient for hero/social-proof areas. **Audit the homepage component tree before adding framer-motion to anything reachable from `src/app/page.tsx`.** Use `npm run build:analyze` to verify bundle impact. |
| **`ssr: false` on above-fold dynamic imports empties the hero on first paint** | Apr 2026 | `dynamic(() => import('./CompanyLogoCarousel'), { ssr: false })` left a hole where the LCP element should be, killing the homepage LCP. Re-enable SSR for above-fold dynamic imports — only use `ssr: false` for genuinely interactive-only widgets below the fold. |
| **Hydration mismatch from date-based conditionals (React error #418)** | Apr 2026 | `isToday(date)` evaluates differently on server vs client (server is UTC, client is user's TZ), causing React hydration error #418 on the news page. The whole subtree re-renders, blocking interactivity. Defer date-based UI behind a `hydrated` state flag set in `useEffect(() => setHydrated(true), [])`. |
| **Missing ISR on dynamic routes hits cold serverless every request** | Mar 2026 | `/patterns/[slug]/page.tsx` had no `revalidate` export, so every request cold-started a serverless function. Add `export const revalidate = 3600` to all content pages. Results land in the edge cache and field TTFB drops dramatically. |
| **Fully client-rendered "page = `<Client />`" pattern has catastrophic LCP** | Apr 2026 | `/agent-readability-audit-kit/page.tsx` returned only `<AuditKitClient />` — no SSR'd content. Real users saw 106s LCP because nothing renders until JS parses, hydrates, and framer-motion completes its initial-state transitions. **Always SSR the hero/title/H1 in the server `page.tsx`. Only the interactive widget needs `'use client'`.** Same fix applies to news article pages (`/news/[slug]`). |
| **Animated `.webp` can be 15MB** | Apr 2026 | `ada-health.webp` (animated, 1074×602) was 15MB raw. Sharp recompress: `sharp(src, { animated: true }).webp({ quality: 75, effort: 6 })` → 649KB. **Treat animated webp like video — needs aggressive compression, never raw export.** |
| **Opacity entrance animation on the LCP element defers LCP** | Jun 2026 | `.animate-fade-in` (`@keyframes fadeIn { from { opacity: 0 } }`) wrapped the H1/hero on pattern pages (`patterns/[slug]/client-page.tsx` `<main>`) and the article H1 on news pages (`news/[slug]/newsletter-detail-client.tsx`). The browser **does not credit largest-contentful-paint until the element is visible**, so an opacity:0→1 entrance records LCP at *fade completion*, not at paint. Symptom: element is in the SSR HTML and FCP is fast (~1.3s) but LCP lands ~1.4s later with **TBT near zero and SI < LCP** (rules out JS/assets — the gap is the animation). Pattern page went 94→100, LCP 2761→1765ms; deterministic fixed-throttle probe showed the **FCP→LCP gap collapse from ~1400ms to 0ms**. **Never put opacity/transform entrance animations on an LCP element (H1, hero, first paragraph). Scope `animate-fade-in` to below-fold content only.** Verify with a fixed-CDP-throttle Playwright LCP probe, not single local Lighthouse runs (±1000ms network variance — the unchanged homepage swung 2045→4035ms between two back-to-back runs). |
| **Nightly LHCI went red on a 1% script-budget overage, not a regression** | Aug 2026 | The Performance workflow failed every night from 2026-08-11 (last green 08-10, `0cd72129`) with `resource-summary.script.size failure for maxNumericValue` on **exactly the four pattern pages** — `/patterns/conversational-ui`, `graceful-handoff`, `explainable-ai`, `progressive-disclosure`. The other four audited URLs (`/`, `/audit`, `/news`, `/agent-readability-audit-kit`) passed. **Measured from the LHCI reports, not inferred: 608 / 604 / 605 / 605 KB against a 600 KB budget — a max overage of 8 KB (1.3%) — while those same pages scored 94-96 mobile Performance.** So the pages were healthy and the budget had simply been set flush against the then-current payload, leaving zero room for ordinary drift. What tipped it: the 08-10→08-11 window is entirely the `/skills` directory work, of which `e18a1a5` (merge Skills into the Patterns nav, cross-link the directory from the patterns hero) and `d7f4bd8` (co-brand the /patterns heading) both touch pattern pages. **Fix: script budget 600 → 650 KB**, i.e. current max + ~7% headroom — still tight enough that a real regression trips it (the Mar-2026 framer-motion incident in this table was ~85 KB, which would blow 650 comfortably). **Do NOT "fix" this class of failure by trimming 8 KB to fit; confirm the Performance score first — if it's 90+, the budget is the wrong instrument, not the page.** **Diagnostic technique worth reusing:** a static scan of `<script src>` in the served HTML UNDERCOUNTS (it gave 576 KB for a page LHCI measured at 608) because LHCI also counts chunks pulled in at runtime by dynamic imports — pattern pages load carousels and the syntax highlighter that way. Get the real number by extracting `window.__LIGHTHOUSE_JSON__` from the report HTML that LHCI uploads to `temporary-public-storage` (the links are in the run log) and reading `audits['resource-summary'].details.items`. **Open and unfixed:** the workflow's own failure alarm is broken — the "Email alert on regression" step 401s against Resend (`curl: (22)`, run exits 22), so `secrets.RESEND_API_KEY` in GitHub Actions is stale or missing and **a genuine future regression will not reach you by email**. It only runs `if: failure()`, so it cannot redden a passing run, which is exactly why it went unnoticed. Rotate that secret. **Unrelated but adjacent: the `polyfills` chunk is ~110 KB**, large for a modern browserslist target and present on every page — uninvestigated, and the most promising real saving if pattern-page JS ever needs to come down for its own sake. |
| **Field-vitals "LCP regression" alert was lab data, not users** | Aug 2026 | The 2026-08-18 `check-web-vitals` email reported LCP p75 **2804ms** over 72h, "worst: `/` at **14628ms**". **No real-user regression existed.** The tell was in the email itself: mobile p75 was *faster* than overall on every metric (LCP 340 vs 2804, FCP 280 vs 2520, TTFB **71ms** vs 1453) — physically impossible for real traffic, since mobile is always the slow bucket. Two independent defects, both measurement: **(1) LHCI beacons into the field table.** `lighthouserc.json` audits 8 production URLs, `numberOfRuns: 3`, nightly 04:00 UTC + every PR touching `src/**`. Lighthouse drives plain headless Chrome, so `navigator.webdriver` is **false** and `isExcludedSession()` in `WebVitalsReporter.tsx` let it through; its 412px `screenEmulation` trips `innerWidth < 1024`, so every lab sample was stored as `device: 'mobile'`. Proof: the mobile bucket's top 8 paths (866-925 samples each over 14 days) are **exactly** the 8 `lighthouserc.json` URLs, and their timestamps arrive in triplets seconds apart (`23:02:06 / 23:02:30 / 23:02:55`) in bursts at 04:00 UTC. ~86% of all mobile rows were LHCI. The headline "worst path `/` at 14628ms" was a **Lighthouse throttled measurement**, quoted to you as a user experience. Note `throttlingMethod: "simulate"` means the browser loads *unthrottled* — which is why most lab rows read 166-340ms, absurdly fast for mobile field data. **(2) One 2-hour crawl fabricated the desktop breach.** Desktop LCP on 2026-08-17 was n=305 / p75 4180ms, against 32-140 samples and 732-2620ms p75 on all 13 surrounding days. **222 of those 305 samples landed in the 02:00-03:00 UTC hours alone** (p75 5458 and 5288, max 49408, TTFB p50 1914ms vs 192ms the previous day), spread thinly across dozens of `/guides/...` pages at n=2-3 each — a sitemap walk by a JS-rendering crawler, not organic traffic. Strip the burst and the two hours it occupied and desktop field p75 is **flat at ~1200-2600ms for 14 days**. **Fixes applied:** `isExcludedSession()` now also excludes synthetic agents by UA (`Chrome-Lighthouse`, `HeadlessChrome`, `PhantomJS`, `Puppeteer`) **and** non-production hosts (`localhost`, `127.0.0.1`, `::1`, `*.local`, `*.vercel.app` — all of which point at the same Neon `DATABASE_URL` as prod). **Lessons:** (a) **`navigator.webdriver` is not a synthetic-traffic gate** — it catches Playwright and nothing else; always pair it with a UA check and a hostname check, exactly as the Clarity row above already required. (b) **When mobile looks faster than desktop, stop investigating the page and start investigating the pipeline.** (c) `RETENTION_DAYS = 30` means pre-fix lab rows keep poisoning the rolling p75 for up to a month after the fix ships — expect repeat alerts until they age out, or purge them. (d) **Still open:** `MIN_SAMPLES = 20` is evaluated over the whole 72h window, so a single 2-hour burst can carry an alert on its own; the cron also blends `mobile` and `desktop` into one p75, and `WebVitalMetric` has no host/env/source column, so lab vs field is unrecoverable retroactively except by these heuristics. Alerting per device with a per-bucket sample floor, plus a `source` column, would close it. |

## Performance Troubleshooting Checklist

When perf scores drop or a Speed Insights / Clarity metric regresses:

1. **Check the daily LHCI workflow first** — GitHub → Actions → "Performance" → latest run.
   If there's an open issue tagged `performance`, start there. The issue body links to the LHCI report and tells you which URL+metric breached.

2. **Cross-check lab vs field**:
   - Lab: GH Actions LHCI artifact + `npm run perf-audit -- --compare`
   - Field: Vercel dashboard → Speed Insights tab + Microsoft Clarity URL performance export
   - **Lab green + field red** → real-user issue (slow networks, mobile devices, font rendering variance)
   - **Both red** → structural issue, easier to reproduce

3. **Consult the Performance & Web Vitals table above** — chances are it's a recurring failure mode with a documented fix. The Apr 10 incident took an hour to investigate from scratch; with this table, it should take 10 minutes next time.

4. **Look for the usual suspects** in this order:
   - New media asset under `public/images/examples/`? Check size with `ls -lh`. Anything >2MB needs the ffmpeg/sharp pipeline (see the oversized-media entry above).
   - framer-motion imported into a homepage-reachable component?
   - `'use client'` added to a page that renders the LCP element?
   - `adjustFontFallback` changed?
   - `priority` added to `<Image>` / `OptimizedMedia` below the fold?
   - New `<video>` tag without `preload="metadata"`?
   - `dynamic()` import with `ssr: false` on above-fold content?

5. **If genuinely new** (not in the table above), fix it, then **add the new lesson to the Performance & Web Vitals table before closing the investigation**. This is the contract — every new failure mode gets documented so the next investigation starts smarter.

## Performance Monitoring Setup

Three layers run automatically:

- **Vercel Speed Insights** — wired in `src/app/layout.tsx` via `<SpeedInsights />` from `@vercel/speed-insights/next`. Automatic p75 mobile/desktop Core Web Vitals per route. No env var, no config. Dashboard: Vercel project → Speed Insights tab.

- **Lighthouse CI** — `.github/workflows/perf.yml` runs nightly at 04:00 UTC (after the newsletter cron at 03:00) and on every PR that touches `src/`, `public/`, `next.config.*`, or the LHCI configs. Audits 8 representative URLs against `budget.json`. On schedule failure, opens a GitHub issue tagged `performance` with a link to the LHCI report and a pointer back to this section. Manual trigger: Actions → "Performance" → "Run workflow".

- **Microsoft Clarity** — already wired (production-only, gated against dev/preview hosts). Use for session recordings and ad-hoc URL performance exports when investigating specific incidents.

- **Field Web Vitals** — `WebVitalsReporter` → `/api/vitals` → Neon `WebVitalMetric`; a daily cron computes rolling p75 and emails on a "good"-threshold breach. (See `.claude/rules/newsletter-and-infra.md` for the cron entry.)

**Adjusting budgets**: edit `budget.json` at the repo root and commit. LHCI picks it up on the next run. Tighten budgets gradually as the site improves; loosen them only with a written justification (in the commit message, ideally).

**Claude Code skills for perf work**: this repo has a project-specific `.claude/skills/perf-check/` skill that auto-triggers on perf-related phrases and points Claude at this file. Generic perf expertise comes from [Addy Osmani's web-quality-skills](https://github.com/addyosmani/web-quality-skills) installed in `~/.claude/skills/` (6 skills: `web-quality-audit`, `performance`, `core-web-vitals`, `accessibility`, `seo`, `best-practices`). Install with `git clone https://github.com/addyosmani/web-quality-skills ~/.claude/skills/addyosmani-web-quality`.
