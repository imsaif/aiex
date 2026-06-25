---
paths:
  - "src/app/api/**"
  - "src/app/news/**"
  - "scripts/newsletter/**"
  - "prisma/**"
  - "src/data/newsletters.ts"
  - "vercel.json"
---

# Newsletter, Cron & Infrastructure

## Newsletter & Email Management
- `npm run send-newsletter` — generate a pattern-update HTML blob that admin pastes into a new Beehiiv post
- Newsletter broadcasts via **Beehiiv (manual compose)**: admin clicks Publish in our admin UI → post goes live on /news → admin clicks "Copy HTML" → pastes into a new Beehiiv post → Beehiiv sends to subscribers. Beehiiv free/Launch tier has no Posts API, so delivery is intentionally manual.
- Welcome emails via **Beehiiv Automations** (keyed on `signup_source` custom field, triggered by subscriber sync).
- Transactional emails (audit reports, admin watchdog alerts, cron failure alerts) via **Resend free tier** — ~150 emails/month, well under the 3,000/month cap.
- See [Newsletter Documentation](../../docs/NEWSLETTER.md) for complete setup and usage guide

## Newsletter Subscription System (architecture)
- **Prisma ORM** (Postgres on Neon) for subscriber management (local source of truth, mirrored to Beehiiv)
- **Beehiiv free tier** for subscriber sync + welcome emails (via Automations keyed on `signup_source` custom field) + newsletter delivery (admin composes in Beehiiv dashboard by pasting HTML from our admin UI — Beehiiv Posts API is Enterprise-only)
- **Resend free tier** for transactional emails — audit reports (per-user HTML), admin watchdog alerts, cron failure alerts, "newsletter draft ready" admin pings. ~150 emails/month, well under the 3,000/month cap.
- **No direct transactional sends to subscribers**: every subscriber-facing email is a Beehiiv Automation welcome or a Beehiiv-delivered broadcast. Tokenized PDF downloads happen on-page (no email link).
- **API Routes**: `/api/newsletter/subscribe` (Prisma + Beehiiv sync + `signup_source` custom field), `/api/newsletter/publish` (marks as published + revalidates — admin then copies HTML into Beehiiv), `/api/newsletter/send-update` (returns pattern-update HTML for manual Beehiiv paste), `/api/newsletter/unsubscribe`
- **Soft Delete** active/inactive subscriber management
- **Unsubscribe Tokens** for one-click unsubscribe functionality on our own `/unsubscribe` page; Beehiiv posts use Beehiiv's native unsubscribe footer

## Cron Jobs & Scheduled Tasks

| Issue | Date | Solution |
|-------|------|----------|
| **Vercel Hobby cron doesn't execute** | Jan 2026 | Vercel free/hobby tier cron jobs don't reliably trigger. Use **cron-job.org** (free) as external trigger instead. `vercel.json` must NOT have `crons` — removed Mar 29 2026. |
| **cron-job.org timeout kills newsletter generation** | Mar 2026 | Newsletter route fetches RSS + calls Claude API. **Fix (Mar 29):** switched Claude model from Sonnet to Haiku (5-10x faster), reduced RSS timeouts from 5s to 3s. Generation now fits well within 60s. Uses `after()` to respond instantly to cron-job.org while running generation in background. |
| **Duplicate cron runs from dual triggers** | Mar 2026 | **Root cause of "every other day" failures.** Vercel Hobby crons in `vercel.json` fired ~50% of days, racing with cron-job.org and causing silent failures via the `after()` race window. **Fix (Mar 29):** removed `crons` from `vercel.json` entirely — cron-job.org is the SOLE trigger. Also added duplicate re-check before DB insert as safety net. **DO NOT re-add crons to vercel.json.** |
| **Vercel 60s function timeout** | Mar 2026 | Vercel Hobby max function duration is 60s (set in `vercel.json`). Newsletter generation must complete within this. If timeouts recur: (1) check the selection-call per-call timeouts (`claudeTimeoutMs`: 40s daily / 50s weekly; retry 40s) leave margin under 60s, (2) check RSS timeout is 3s not 5s, (3) consider reducing RSS_SOURCES count. |
| **Selection model switched Haiku → Sonnet 4.6** | Jun 2026 | Haiku was a Mar-2026 latency pick, but it routinely ignored the multi-constraint selection rules (max-2-per-company → the 3-Figma incident above, max-1-opinion, product-news floor) — those rules live only in the prompt. **Fix (Jun 25):** switched the selection call (both the main pass and the retry) to `claude-sonnet-4-6`, which follows the rules far better. Measured median ~18s on a representative daily prompt (Haiku was ~4.5s), so per-call timeouts were bumped 25s→40s daily and 45s→50s weekly to keep headroom under the 60s cap. Two sequential calls (main + retry) at 40s each = 80s worst case, but each has its own abort and real latency is ~18s, so total stays well under 60s. **The model is intentionally Sonnet now — do NOT revert to Haiku to "fix" a timeout; bump the timeout or trim the pool instead.** Cost delta is negligible (one call/day). |
| **Newsletter skewed dev-focused; Vercel kept appearing 2-3x per issue** | Apr 2026 | Pool was 19/20 dev/AI sources with only Figma as design publication; flat `+30` AI_PRODUCT_SOURCES baseline gave Vercel and Figma equal priority; Claude's `max 2 per company` rule was bypassed because it operates on its generated `product` field (Vercel customer cases get attributed to "Zo Computer", "GitBook" etc.). **Fix (Apr 20):** added 7 design publications (NN/g, Smashing, UX Collective, A List Apart, UX Planet, TLDR Design, Lenny's Newsletter) + 1 curator (Latent Space); replaced flat baseline with `SOURCE_TIER_BASELINE` map (design-pub +50 → tech-news +0); added conditional infra-keyword penalty (-15 if no design keyword); pre-Claude `MAX_ITEMS_PER_SOURCE = 2` cap on the pool before Claude sees it; `isDesignNativeItem()` runs at publish time and flags `qa.designLightWarning` on `structuredData` for the admin reviewer. Tightened all 3 prompts (daily, weekly, weekly-compilation) to explicitly target designers and drop strained takeaways. **Sources tried but dropped:** Framer (no public RSS at any standard path — `/blog/rss.xml`, `/blog/feed/`, `/blog/atom.xml` all 404), all 4 candidate Reddit subreddits (r/UXDesign, r/userexperience, r/web_design, r/Figma all return 403 from rss-parser even with descriptive UA — Reddit gates on IP reputation, not just UA). Revisit Reddit via an aggregator (Feedly bridge, RSS.app, or static-feed GitHub Action) if community voice is still missing after a few issues. |
| **Same company dominated an issue (3 Figma stories) despite the source cap** | Jun 2026 | The 2026-06-25 daily had 3 of 4 items labeled `product: "Figma"`. The source-level pool cap (`MAX_ITEMS_PER_SOURCE`) worked — it keys on the RSS **feed**, so only 2 came from Figma's feed (the 3rd, "Weave…", was sourced from TechCrunch but Claude labeled it Figma). The prompt's "max 2 per company" rule lives **only in the prompt** and Haiku ignored it — same bypass class as the Apr 2026 Vercel-attribution incident, on the product field instead of the source field. The `qa.selectionRuleViolation` enforcement only checked `no_product_news` and `opinion_present`, so nothing flagged it and it sailed into `pending_review`. **Fix (Jun 25):** added a `company_cap` check in `buildQABlock` that counts by normalized `sel.product` (the subscriber-perceived company, the dimension `sourceCounts` misses) and sets `selectionRuleViolation = company_cap (...)` when any product label appears >2×; branched `buildSelectionRetryAddendum` to instruct a diversified re-pick; exposed `qa.productCounts` for the admin reviewer. `MAX_ITEMS_PER_COMPANY = 2`. Exact-normalized match is intentional (no false-positive quiets); harden with brand-token extraction only if Claude starts splitting labels ("Figma" / "Figma Make") to dodge. |
| **Regenerating today's weekly with new logic when daily items are stale** | Apr 2026 | Weekly normally compiles from the past 7 daily newsletters (`getDailyNewsletterItems(7)`). After source/scoring changes, those daily items still reflect the old pipeline. Use `?forceRSS=true` on a weekly run to bypass the compilation path and pull a fresh RSS pool through the new tiered scoring. Combine with `?force=true` to delete an existing draft for today: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly&force=true&forceRSS=true"`. |

**cron-job.org Setup:**
- Daily newsletter: `0 3 * * *` (3 AM UTC / 8:30 AM IST) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter`
- Weekly newsletter: `0 2 * * 1` (2 AM UTC / 7:30 AM IST Mon) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly`
- Audit health monitor: `0 * * * *` (hourly) → `https://www.aiuxdesign.guide/api/health/audit` — synthetic monitor for the audit funnel; reuses CRON_SECRET; emails admin via Resend on failure. Healthy checks are silent. See `src/app/api/health/audit/route.ts` for the four checks (env, homepage, analyze route, database). **Cadence: dialed from `*/5` → hourly on 2026-06-16 — real audit volume is ~2/day (see `/admin/audit-samples`), so 5-min checks were 144× the usage rate and kept Neon free-tier compute from auto-suspending (quota risk). Hourly still catches breakage well within the daytime usage window (UTC ~05:00–12:00) and lets Neon sleep ~55 min/hour.**
- Field Web Vitals monitor: `0 5 * * *` (daily, 5 AM UTC) → `https://www.aiuxdesign.guide/api/cron/check-web-vitals` — computes rolling p75 of real-user CWV from the `WebVitalMetric` table (fed by `WebVitalsReporter` → `/api/vitals`); reuses CRON_SECRET; emails admin via Resend ONLY on a "good"-threshold breach (LCP>2.5s/INP>200ms/CLS>0.1), silent otherwise. The field-data layer LHCI (lab) is blind to. Added 2026-06-16.
- Requires `Authorization: Bearer <CRON_SECRET>` header

**Newsletter Troubleshooting Checklist:**

When newsletter doesn't run or emails don't send:

1. **Check cron-job.org has correct CRON_SECRET**
   - Must use the PRODUCTION value from Vercel environment variables
   - NOT the local `.env.local` value (they're different!)

2. **Check cron schedule is correct**
   - Daily: `0 3 * * *` (3 AM UTC = 8:30 AM IST)
   - Weekly: `0 2 * * 1` (2 AM UTC Monday = 7:30 AM IST)

3. **Check database for recent newsletters**
   ```bash
   # Query last 5 newsletters
   DATABASE_URL="..." node -e '
   const { PrismaClient } = require("./src/generated/prisma");
   const prisma = new PrismaClient();
   prisma.newsletterDraft.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
     .then(n => n.forEach(x => console.log(x.createdAt, x.type, x.status, x.title.slice(0,40))))
     .finally(() => prisma.$disconnect());
   '
   ```

4. **Manual trigger (use production CRON_SECRET)**
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" \
     "https://www.aiuxdesign.guide/api/cron/generate-newsletter"
   ```

5. **Check Resend dashboard** for transactional email logs (audit reports, admin alerts): https://resend.com/emails

6. **Check Beehiiv dashboard** for subscriber sync + newsletter delivery: https://app.beehiiv.com

7. **Common issues:**
   - 401 Unauthorized → Wrong CRON_SECRET in cron-job.org
   - No newsletter created → Check if "quiet day" (no news) or duplicate prevention blocked it
   - Vercel Runtime Timeout → selection model is intentionally `claude-sonnet-4-6` (Jun 2026; do NOT revert to Haiku). Check the per-call timeouts (`claudeTimeoutMs`: 40s daily / 50s weekly; retry 40s) and that RSS timeout is 3s. Bump the timeout or trim `RSS_SOURCES`, don't downgrade the model.
   - "Every other day" failures → Someone re-added `crons` to `vercel.json`. Remove them — cron-job.org is the sole trigger
   - Transactional emails not sent → Check `RESEND_API_KEY` is set + valid. Resend free tier caps at 100/day + 3,000/month — at normal volumes we use ~5%.
   - Subscriber not synced to Beehiiv → Check BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID
   - Admin clicks Publish but newsletter doesn't email subscribers → That's expected. Admin must click "Copy HTML" then paste into a new Beehiiv post and send from Beehiiv. Beehiiv free tier has no Posts API for automation.
   - Welcome email not arriving after signup → Beehiiv publication-level welcome emails must be enabled + Automations keyed on `signup_source` custom field must be configured (values: `direct`, `handbook`, `audit`, `audit-kit`, `news`, `guides`, `agentic-checklist`).

## Deployment & Infrastructure

| Issue | Date | Solution |
|-------|------|----------|
| **`/news` silently falls back to 2 static newsletters** | May 2026 (recurring; observed previously) | `src/app/news/page.tsx` reads from `prisma.newsletterDraft` and merges with static fallback (`src/data/newsletters.ts`, only 2 items left: Dec 17/21 2025). On Prisma/Neon failure the catch returned `[]` and the empty-DB result got cached for the full `revalidate = 60` window — every regeneration overwrote the last-good page with the degraded one, so the page stayed stuck on the 2 static items even though the DB had 50+ rows. **Fix (May 19 2026):** removed the silent `return []` in `getPublishedDrafts()`; the catch now re-throws so Next's ISR retains the last-known-good prerender on transient failures and the error surfaces in Vercel logs. **Detection signals** — if `curl https://www.aiuxdesign.guide/news \| grep -oE 'href="/news/[^"]+"' \| sort -u \| wc -l` returns ≤ 2, this is the failure mode. Confirm by querying `newsletterDraft` directly (use the troubleshooting snippet above) — if DB has rows but page renders ≤ 2, the catch fired. **Don't add silent `return []` catches around DB reads on cached pages** — they turn transient errors into permanently-cached degraded pages. Either throw (so the good cache is preserved) or call `noStore()` from `next/cache` before returning the fallback (so the bad result isn't cached). |

## API & External Services

| Issue | Date | Solution |
|-------|------|----------|
| **Anthropic has no RSS feed** | Dec 2025 | Scrape `anthropic.com/news` page directly instead of using RSS parser |
