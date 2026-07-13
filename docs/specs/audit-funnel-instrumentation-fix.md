# Spec: Audit funnel instrumentation fix (make the next 30 days measurable)

**Goal:** produce trustworthy audit-funnel data so we can locate real drop-off, instead of the
current picture where server truth (37 successful audits / 30d) and the client beacon
(8 `audit_session_completed` / 30d) disagree by ~4-5×.

**Root causes found (2026-07-13, from prod):**
1. **Table pollution** — 634 of 643 `AuditSample` rows over 90d (98.6%) are the hourly health
   monitor writing `bad_request` (tagged `role: monitor`, filtered from the admin view but still
   bloating the table and making raw queries misleading).
2. **Lossy client transport** — funnel events go over `navigator.sendBeacon('/api/events')`
   (production-only, fire-and-forget). Ad-blockers pattern-match `/api/events`, and unload races
   drop events. ~75%+ loss vs server truth.
3. **No join key** — `AuditSample` has no `sessionId`, so client CTA events (which *do* carry
   `sessionId = results.id`) can't be correlated to their server audit row. We can't ask
   "of the audits that completed, how many copied the handoff?"

**Design principle:** the funnel *spine* (audit ran → completed with value → score/gaps/product)
is already server-truth in `AuditSample` — don't re-measure it via the beacon. Use client events
only for the *branches* that have no server call (demo viewed, start-real intent, post-result CTA
clicks), and join them to the spine by `sessionId` so post-result rates stay trustworthy even
when half the client events are lost (the denominator is server-side).

---

## Part 1 — De-pollute the samples table  ·  ~30 min  ·  ship first, zero risk

The monitor only asserts `res.status === 400` (`api/health/audit/route.ts:81`). It does not need
a DB row.

- **`src/app/api/patterns/analyze/route.ts`** (~line 122, the `bad_request` path): guard the
  `recordAuditSample` call so it is skipped when `role === 'monitor'`:
  ```ts
  if (role !== 'monitor') {
    after(() => recordAuditSample({ outcome: 'bad_request', /* … */ role }));
  }
  ```
  The 400 response is unchanged, so the health check still passes.
- **One-time cleanup** of the existing 634 rows: guarded script
  `scripts/analysis/purge-monitor-samples.ts` → `deleteMany({ where: { role: 'monitor' } })`,
  print count first, require an explicit `--apply` flag. (Admin already hides them, but they
  distort raw queries and add Neon rows.)

**Verify:** hit `/api/health/audit`, confirm it still returns healthy; confirm no new
`role:'monitor'` sample row is written.

---

## Part 2 — Make the funnel trustworthy

### 2a. Add a join key to the spine  ·  ~1-2 h  ·  Prisma migration

- **`prisma/schema.prisma`** — add to `AuditSample`:
  ```prisma
  sessionId String?  // results.id — join key to client UiEvent.sessionId
  @@index([sessionId])
  ```
- **`src/lib/audit/sample.ts`** — thread `sessionId` through `RecordAuditSampleInput` and the
  `create`.
- **`src/app/api/patterns/analyze/route.ts`** — the `success`/`empty_gaps`/`no_ai_surface`
  record path already has `results.id` in scope (it's returned as `data.id`). Pass it as
  `sessionId`.
- Migration: `npx prisma migrate dev --name audit_sample_session_id` locally, then
  `prisma migrate deploy` on prod Neon. (Only heavier step; additive nullable column, safe.)

**Payoff:** `SELECT` success samples LEFT JOIN UiEvent ON sessionId → real post-result action
rate, robust to client event loss because completions come from the server side.

### 2b. Reliable transport for client-only branch events  ·  ~1-2 h

In **`src/lib/audit/analytics.ts`** (the `sendBeacon` block, ~line 98):
- **Mid-session events** (CTA clicks — `handoff_copied`, `resource_clicked`, `service_cta_clicked`,
  `new_audit_clicked`, `email_report_sent`, `unlock_*`, `demo_start_real_clicked`): these fire
  while the tab is alive, so use an awaited `fetch('/…', { method:'POST', keepalive:true })`
  instead of fire-and-forget `sendBeacon`. Keep `sendBeacon` only for true unload-time events.
- **Dodge ad-block lists**: `/api/events` is a common blocklist pattern. Add a first-party alias
  route (e.g. `/api/a/e` or reuse an innocuous path) and post there. (Endpoint rename is the
  single highest-leverage loss fix; keep `/api/events` as a back-compat alias for one release.)
- Keep the `NODE_ENV === 'production'` gate.

**Verify:** run a real audit end-to-end in prod-like build with an ad-blocker on; confirm
`audit_session_completed` lands. Success bar: client completion count converges to server
success count (±10%) over the next window.

---

## Part 3 — Admin funnel panel  ·  ~2-3 h

Add a "Funnel" panel to **`/admin/audit-samples`** (new section in `samples-client.tsx`, backed
by a new aggregation in `api/admin/audit-samples/route.ts` or a sibling route). Computed from
**server spine + sessionId-joined client branches**:

| Step | Source | Trust |
|---|---|---|
| Demo viewed | `UiEvent audit_demo_viewed` | client, lower-bound |
| Start-real clicked | `UiEvent audit_demo_start_real_clicked` | client, lower-bound |
| Audit started | `AuditSample` rows | **server truth** |
| Completed w/ value | `AuditSample outcome=success` | **server truth** |
| Post-result action rate | success samples with any joined `{handoff_copied, resource_clicked, service_cta_clicked, email_report_sent}` UiEvent (by sessionId) | **robust** (server denominator) |

This is the surface that answers "where do audit users drop off" without hand-running a script.

---

## Sequencing & effort  (revised — leaner, per 2026-07-13 review)

Two simplifications from the review:
- **Stop measuring `audit_demo_viewed` as a funnel step.** It fires on page mount when the
  canned visual demo shows (AuditClient.tsx:243) — it's a page impression, not intent. Ignore it
  (or stop firing it). The real intent signal is `audit_demo_start_real_clicked`.
- **Stop double-measuring the funnel spine via client events.** `audit_session_completed` /
  `audit_gap_found` / `audit_product_type_selected` duplicate what `AuditSample` already records
  server-side (and lose ~75% to the beacon → the confusing 58-vs-8 gap). Read the spine from
  `AuditSample`; don't count it via clicks.

1. **P1** (monitor guard + purge) — 30 min. ✅ **guard shipped 2026-07-13** (`analyze/route.ts`);
   purge script ready (`scripts/analysis/purge-monitor-samples.ts --apply`, 635 rows).
2. **P2a** (sessionId on `AuditSample` + migration) — 1-2 h. **The one fix that matters** — lets
   post-result actions join to the audit they belong to. Note: `UiEvent.sessionId` is already
   populated (commit #53); the missing half is on `AuditSample`.
3. **P2b** (transport) — 1-2 h. **De-prioritised.** The only events that need reliable transport
   are the post-result CTAs, and those are near-zero regardless (handoff 1, service_cta 1 / 90d) —
   the "nobody acts on results" finding already survives the loss. Do this only if CTA volume rises.
4. **P3** (admin funnel panel) — 2-3 h. Spine from `AuditSample` + branches joined by sessionId.

**Total ≈ half a day** for the parts that matter (P1 done + P2a + P3).

---

## What to do AFTER the instrumentation is trustworthy (roadmap)

The data already points here; the measurement fix is what lets us *verify* a change worked.

1. **Fix the results → action moment** (highest leverage, start in parallel — no more traffic
   needed). 58 successful audits / 90d produced 1 handoff copy + 1 service CTA click. Make the
   single next step unmissable; strengthen the handoff artifact; reframe the paid-service CTA.
2. **Drive qualified volume** (the growth ceiling — ~1 audit/day). Levers: newsletter CTA,
   pattern-page entry points, a demo that sells the real audit harder.
3. **Read the now-trustworthy funnel and fix the next drop** — the ongoing loop, only possible
   after P2a lands.

Side-insight: **"other" is the largest product-type bucket** (~25-40%). Inspect what's in it —
either the product-type list is missing categories or people skip classifying; either way it
touches a big share of users.

## Success criteria (re-check after ~1-2 weeks — volume is ~1.3 audits/day)

- Re-run `scripts/analysis/audit-upgrade-review.ts`: client `audit_session_completed`
  ≈ server `success` count (±10%) → event loss fixed.
- Admin funnel panel shows a real post-result action rate (currently unmeasurable).
- Zero new `role:'monitor'` rows in `AuditSample`.

## Explicitly out of scope

- The audit **engine** (95% success, ~6/9 score, `empty_gaps` already collapsed 20%→3%). Do not
  touch it — quality is not the problem.
- Growth/traffic work (the actual lever for more audits) — separate effort; this spec only makes
  that work measurable.
