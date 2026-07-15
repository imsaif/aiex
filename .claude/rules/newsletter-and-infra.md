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
| **Newsletter silently drops heavy runs at the 60s cap (weekly + retry-dailies)** | Jul 2026 | Root cause of the 2026-06-29 (weekly) and 2026-07-01 (daily) misses. The route runs generation in `after()` background; on Vercel Hobby the function is capped at 60s **including** the deferred work, and once the response is sent the deferred work can be frozen/killed. **Measured locally: the weekly ≈ 53s** (up to 94s with fresh RSS) — it routinely crosses 60s and is hard-killed before the DB insert, so there's no draft and no `sendFailureAlert` (the catch never runs); the only signal is the watchdog "accepted but nothing appeared" email + a healthchecks.io DOWN. Dailies mostly fit (~30s) but a day that triggers the **selection retry** (a 2nd sequential Sonnet call) can also cross 60s (the 07-01 miss). **cron-job.org cannot rescue this — its request timeout is HARD-CAPPED at 30s** (console-confirmed; a value of 60 is rejected with "maximum timeout is 30 seconds"). That means going **synchronous is NOT viable** while cron-job.org is the trigger: it would disconnect at 30s and show red every run + risk double-fires. **Fix (Jul 2): time-budget the daily selection retry** (`route.ts` ~1908, `genStart`/`retryBudgetMs`) — only retry if ≥15s of the 60s budget remains, and cap its abort to the remainder (reserving ~8s for HTML+insert); otherwise skip and fall through to the existing auto-quiet backstop, which still writes a **visible** draft instead of dying on the cap. The weekly's ~53s is inherent (4096 tokens + 7-day compile) and is left on **watchdog-plus-manual-regen**; a job runner with no time cap (GitHub Actions) is the real fix if weekly misses start costing something. **Architecture note:** there is NO separate weekly cron — the single daily cron (03:10 UTC / 8:40 AM IST) auto-generates the weekly on Mondays via `isMonday` (`route.ts:2108`). Don't "re-enable the weekly cron"; it never existed. **A green "Successful (4.28s)" on cron-job.org means only that `after()` returned a fast 200 — it is NOT evidence generation completed.** |
| **Vercel Hobby cron doesn't execute** | Jan 2026 | Vercel free/hobby tier cron jobs don't reliably trigger. Use **cron-job.org** (free) as external trigger instead. `vercel.json` must NOT have `crons` — removed Mar 29 2026. |
| **cron-job.org timeout kills newsletter generation** | Mar 2026 | Newsletter route fetches RSS + calls Claude API. **Fix (Mar 29):** switched Claude model from Sonnet to Haiku (5-10x faster), reduced RSS timeouts from 5s to 3s. Generation now fits well within 60s. Uses `after()` to respond instantly to cron-job.org while running generation in background. |
| **Duplicate cron runs from dual triggers** | Mar 2026 | **Root cause of "every other day" failures.** Vercel Hobby crons in `vercel.json` fired ~50% of days, racing with cron-job.org and causing silent failures via the `after()` race window. **Fix (Mar 29):** removed `crons` from `vercel.json` entirely — cron-job.org is the SOLE trigger. Also added duplicate re-check before DB insert as safety net. **DO NOT re-add crons to vercel.json.** |
| **Vercel 60s function timeout** | Mar 2026 | Vercel Hobby max function duration is 60s (set in `vercel.json`). Newsletter generation must complete within this. If timeouts recur: (1) check the selection-call per-call timeouts (`claudeTimeoutMs`: 40s daily / 50s weekly; retry 40s) leave margin under 60s, (2) check RSS timeout is 3s not 5s, (3) consider reducing RSS_SOURCES count. |
| **Selection model switched Haiku → Sonnet 4.6** | Jun 2026 | Haiku was a Mar-2026 latency pick, but it routinely ignored the multi-constraint selection rules (max-2-per-company → the 3-Figma incident above, max-1-opinion, product-news floor) — those rules live only in the prompt. **Fix (Jun 25):** switched the selection call (both the main pass and the retry) to `claude-sonnet-4-6`, which follows the rules far better. Measured median ~18s on a representative daily prompt (Haiku was ~4.5s), so per-call timeouts were bumped 25s→40s daily and 45s→50s weekly to keep headroom under the 60s cap. Two sequential calls (main + retry) at 40s each = 80s worst case, but each has its own abort and real latency is ~18s, so total stays well under 60s. **The model is intentionally Sonnet now — do NOT revert to Haiku to "fix" a timeout; bump the timeout or trim the pool instead.** Cost delta is negligible (one call/day). |
| **Newsletter skewed dev-focused; Vercel kept appearing 2-3x per issue** | Apr 2026 | Pool was 19/20 dev/AI sources with only Figma as design publication; flat `+30` AI_PRODUCT_SOURCES baseline gave Vercel and Figma equal priority; Claude's `max 2 per company` rule was bypassed because it operates on its generated `product` field (Vercel customer cases get attributed to "Zo Computer", "GitBook" etc.). **Fix (Apr 20):** added 7 design publications (NN/g, Smashing, UX Collective, A List Apart, UX Planet, TLDR Design, Lenny's Newsletter) + 1 curator (Latent Space); replaced flat baseline with `SOURCE_TIER_BASELINE` map (design-pub +50 → tech-news +0); added conditional infra-keyword penalty (-15 if no design keyword); pre-Claude `MAX_ITEMS_PER_SOURCE = 2` cap on the pool before Claude sees it; `isDesignNativeItem()` runs at publish time and flags `qa.designLightWarning` on `structuredData` for the admin reviewer. Tightened all 3 prompts (daily, weekly, weekly-compilation) to explicitly target designers and drop strained takeaways. **Sources tried but dropped:** Framer (no public RSS at any standard path — `/blog/rss.xml`, `/blog/feed/`, `/blog/atom.xml` all 404), all 4 candidate Reddit subreddits (r/UXDesign, r/userexperience, r/web_design, r/Figma all return 403 from rss-parser even with descriptive UA — Reddit gates on IP reputation, not just UA). Revisit Reddit via an aggregator (Feedly bridge, RSS.app, or static-feed GitHub Action) if community voice is still missing after a few issues. |
| **Same company dominated an issue (3 Figma stories) despite the source cap** | Jun 2026 | The 2026-06-25 daily had 3 of 4 items labeled `product: "Figma"`. The source-level pool cap (`MAX_ITEMS_PER_SOURCE`) worked — it keys on the RSS **feed**, so only 2 came from Figma's feed (the 3rd, "Weave…", was sourced from TechCrunch but Claude labeled it Figma). The prompt's "max 2 per company" rule lives **only in the prompt** and Haiku ignored it — same bypass class as the Apr 2026 Vercel-attribution incident, on the product field instead of the source field. The `qa.selectionRuleViolation` enforcement only checked `no_product_news` and `opinion_present`, so nothing flagged it and it sailed into `pending_review`. **Fix (Jun 25):** added a `company_cap` check in `buildQABlock` that counts by normalized `sel.product` (the subscriber-perceived company, the dimension `sourceCounts` misses) and sets `selectionRuleViolation = company_cap (...)` when any product label appears >2×; branched `buildSelectionRetryAddendum` to instruct a diversified re-pick; exposed `qa.productCounts` for the admin reviewer. `MAX_ITEMS_PER_COMPANY = 2`. Exact-normalized match is intentional (no false-positive quiets); harden with brand-token extraction only if Claude starts splitting labels ("Figma" / "Figma Make") to dodge. |
| **Figma still landed exactly 2 stories every issue (at the company cap, not over it)** | Jun 2026 | Follow-up to the 3-Figma incident above. The Jun 25 `MAX_ITEMS_PER_COMPANY = 2` cap stopped 3+, but Figma kept filling **2 of 4** slots day after day, reading as over-represented. Root cause is structural, not a bug: Figma's `figma.com/blog` is the only clean first-party `design-tool` feed (the other 4 — Mobbin, Loom, Raycast, Arc — are Google-News *search* feeds, noisier), `design-tool` has the top-tier `+35` baseline (parity with `ai-lab`), and `design-tool` had no per-source override so it inherited `MAX_ITEMS_PER_SOURCE = 2`. Two Figma blog posts entered the pool, both scored top, Sonnet picked both — all within the rules. **Fix (Jun 26):** added `'design-tool': 1` to `MAX_ITEMS_PER_SOURCE_BY_TIER` so each design tool contributes at most one item/day (intentionally ignores the weekend +1). The `company_cap` (max 2) stays as the backstop. Keeps Figma's strongest item without the daily double. If design-tool coverage now feels too thin, raise this to 2 again rather than touching the company cap. |
| **`curator` tier was structurally dead — Latent Space silently stripped from every pool** | Jul 2026 | Latent Space was added Apr 2026 as the sole `curator`-tier source (+25 baseline). But it's a Substack — every article is `latent.space/p/<slug>` — and the later-added opinion pre-filter (`route.ts:909`, `sorted.filter(item => !isOpinionUrl(item.link))`) treats any non-allowlisted host with a `/^\/p\/[a-z0-9-]+/` path as a Substack ghosthost and drops it **before scoring**. Since `latent.space` wasn't in `KNOWN_PRODUCT_HOSTS`, 100% of its items were filtered out every run — the curator tier could never contribute, and it was invisible in QA telemetry because the drop happens before `poolSize` is computed (reads as "Latent Space had nothing fresh"). Same class as the Apr/Jun bypass incidents: a later guard silently negated an earlier source-mix decision. Surfaced 2026-07-04 while auditing an opinion-heavy pool. **Fix (Jul 4):** added `'latent.space'` to `KNOWN_PRODUCT_HOSTS` in `isOpinionUrl` — exempts it from the `/p/` ghosthost rule while `*.substack.com` and other custom-domain `/p/` hosts stay filtered. Verified: latent.space kept, `someguy.substack.com/p/…` still dropped. **If you ever want a `/p/` Substack treated as a live first-party source (not opinion), allowlist its host here — don't loosen the `/p/` regex.** |
| **Regenerating today's weekly with new logic when daily items are stale** | Apr 2026 | Weekly normally compiles from the past 7 daily newsletters (`getDailyNewsletterItems(7)`). After source/scoring changes, those daily items still reflect the old pipeline. Use `?forceRSS=true` on a weekly run to bypass the compilation path and pull a fresh RSS pool through the new tiered scoring. Combine with `?force=true` to delete an existing draft for today: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly&force=true&forceRSS=true"`. |

### Manual weekly regeneration (standing runbook)

**When to use:** the weekly is missing (no `type: 'weekly'` row for this Monday — check with the DB snippet below). Production can't reliably generate it — the weekly's Claude compile call routinely exceeds Vercel Hobby's 60s function cap (see the 60s-cap row above), so the Monday auto-weekly silently dies before the DB insert with no alert. We accept manual regen as the standing fallback until the weekly moves to a job runner with no time cap. Confirmed recurring: 2026-06-29 and 2026-07-06 both missed.

**Why local works when production doesn't:** run off-Vercel and there is no 60s function cap. The only remaining limit is the route's own `claudeTimeoutMs` (50s weekly), which the `NEWSLETTER_CLAUDE_TIMEOUT_MS` env var lifts (`route.ts` ~1854). That var is **unset in production**, so prod behavior is unchanged — it exists solely for this runbook. `.env.local` already points at the **prod** Neon DB, so the draft lands in production as `pending_review`, same as a normal cron run.

**Steps** (from repo root; a dev server on :3000 works — no `npm run build`, it clobbers `.next/`):

```bash
# 1. Start dev with the abort lifted (inline, not persisted). Kill any existing :3000 first.
lsof -ti:3000 | xargs kill -9 2>/dev/null
NEWSLETTER_CLAUDE_TIMEOUT_MS=180000 npm run dev   # wait for "Ready"

# 2. Trigger the weekly (uses the LOCAL .env.local CRON_SECRET, not the prod value).
SECRET=$(grep -h '^CRON_SECRET=' .env.local | head -1 | cut -d= -f2- | tr -d '"')
curl -s -H "Authorization: Bearer $SECRET" "http://localhost:3000/api/cron/generate-newsletter?type=weekly"
# → returns immediately; generation runs in after(), takes ~60-90s. Watch the dev log
#   for "compiling from N daily items" then the "INSERT INTO ... NewsletterDraft".
```

Then verify the draft (reuse the DB snippet below with `where: { type: "weekly" }`), and follow the normal publish flow: review at **`/admin/newsletter`** → Publish → Copy HTML → paste into a new Beehiiv post → send.

**Notes:** it takes the **compilation path** (summarizes the week's ~7-13 daily items into one weekly) as long as recent dailies exist — no `forceRSS` needed. If both the full and lite passes abort with "Request was aborted," the env var didn't reach the server (restart dev with it set). No `?force=true` needed unless a partial draft already exists for today.

**cron-job.org Setup:**
- Daily newsletter: `0 3 * * *` (3 AM UTC / 8:30 AM IST) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter`
- Weekly newsletter: `0 2 * * 1` (2 AM UTC / 7:30 AM IST Mon) → `https://www.aiuxdesign.guide/api/cron/generate-newsletter?type=weekly`
- Audit health monitor: `0 * * * *` (hourly) → `https://www.aiuxdesign.guide/api/health/audit` — synthetic monitor for the audit funnel; reuses CRON_SECRET; emails admin via Resend on failure. Healthy checks are silent. See `src/app/api/health/audit/route.ts` for the four checks (env, homepage, analyze route, database). **Cadence: dialed from `*/5` → hourly on 2026-06-16 — real audit volume is ~2/day (see `/admin/audit-samples`), so 5-min checks were 144× the usage rate and kept Neon free-tier compute from auto-suspending (quota risk). Hourly still catches breakage well within the daytime usage window (UTC ~05:00–12:00) and lets Neon sleep ~55 min/hour.**
- Field Web Vitals monitor: `0 5 * * *` (daily, 5 AM UTC) → `https://www.aiuxdesign.guide/api/cron/check-web-vitals` — computes rolling p75 of real-user CWV from the `WebVitalMetric` table (fed by `WebVitalsReporter` → `/api/vitals`); reuses CRON_SECRET; emails admin via Resend ONLY on a "good"-threshold breach (LCP>2.5s/INP>200ms/CLS>0.1), silent otherwise. The field-data layer LHCI (lab) is blind to. Added 2026-06-16.
- Requires `Authorization: Bearer <CRON_SECRET>` header

**"Not much lately" is usually a PUBLISH gap, not a generation failure (Jul 15 2026).** Before assuming missed cron runs, read the prod drafts directly — `curl -H "Authorization: Bearer $ADMIN_APPROVE_SECRET" "https://www.aiuxdesign.guide/api/newsletter/drafts?status=all&limit=6"` (the drafts route accepts `ADMIN_APPROVE_SECRET` as a bearer token for read-only programmatic access — no admin cookie, no generation triggered). Days often generate fine (incl. "Quiet Day" auto-backstop drafts) but sit unpublished in `pending_review`; `/news` only shows *published* issues, so a gap there ≠ no draft. Do NOT probe the cron endpoint without `force` to "check" — a non-force GET with no draft will *start a generation*.

**Source-feed rot check + paywall guard (Jul 15 2026).** Thin pools also come from dead feeds: health-check all `RSS_SOURCES` with rss-parser periodically (fetch each, count items in last 24–48h). Feeds rot silently (Microsoft AI 410, Supabase 404, The Verge path change all found dead Jul 15). The old rss.app/X `designer-voice` bridges are gone (paid + flaky) — practitioner voice now comes from durable first-party RSS + Substack. `isPaywalled()` (route.ts) drops truncated/gated items so readers are never linked to a paywall: **Substack gates by TRUNCATING the RSS body, it does NOT print a reliable marker string** — so the guard keys on `content:encoded` length (< 400 chars = gated/stub), not text. Note `item.content` on Substack is only the *subtitle*; the real body is `content:encoded`.

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
