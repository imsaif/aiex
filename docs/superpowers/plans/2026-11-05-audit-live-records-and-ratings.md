# Audit Live Records and Ratings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep real audits (screenshots, answers, step details) for 30 days with a clear notice, let visitors rate each finding, and give Imran a monthly way to review them.

**Architecture:** One new database table in the existing Neon database, written after the response and never able to break an audit. Ratings reuse the existing event pipeline, so they need no new table. Deletion joins the existing daily cron. A local script exports records for review.

**Tech Stack:** Next.js 15 route handlers, Prisma on Neon, Jest.

**Spec:** Decisions made with Imran on 2026-11-05, recorded here. Evidence: `~/Desktop/evals-study/10-tracing-findings.md`.

**Gate:** Do not start until the 41-screenshot rerun has been compared with `outputs-final` and quality has held. Task 5 (automatic check) follows the same gate.

## Global Constraints

- Imran's decision: save for everyone, with a notice before upload. No opt-in box.
- Keep records for 30 days, then delete.
- Do not save sample runs, or runs with role `admin`, `test` or `monitor`.
- Saving must never slow or fail an audit: run inside `after()`, wrapped in try/catch.
- No new supplier and no new dependency.
- `AUDIT_VERIFY_LOOP` stays off.
- Copy uses no em dashes.
- UI uses design tokens; readable text is `text-sm text-text-secondary`, not `text-xs text-text-tertiary`.
- Test files must be added with `git add -f`, then confirmed with `git ls-files`.
- Applying the table to production needs Imran's yes, at ship time.

## Review Focus

1. Saving fails or the database is down: the visitor still gets their audit. Pinned in Task 1.
2. A run with no findings or an unreadable AI answer: still saved, as these are the most useful to review. Pinned in Task 1.
3. A sample screenshot or Imran's own test: never saved. Pinned in Task 1.
4. A double tap or changed mind on a rating: the last tap is what shows and one event per tap is logged. Pinned in Task 3.
5. Cleanup removes records younger than 30 days: must not happen. Pinned in Task 2.

---

### Task 1: Save each real audit

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `src/lib/audit/record.ts`
- Modify: `src/app/api/patterns/analyze/route.ts`
- Modify: `src/components/audit/AuditClient.tsx`
- Test: `src/lib/audit/__tests__/record.test.ts`

**Interfaces:**
- Produces: `shouldSaveAuditRecord({ role: string | null, isSample: boolean }): boolean`
- Produces: `saveAuditRecord(input: SaveAuditRecordInput): Promise<void>`, which never throws

`SaveAuditRecordInput`: `sessionId: string | null`, `outcome: string`, `productType: string | null`, `productTypeSource: string | null`, `deviceType: string | null`, `images: string[]` (base64), `rawAnswer: string | null`, `steps: Record<string, unknown>`, `ip: string | null`, `role: string | null`.

- [ ] **Step 1: Add the table**

`AuditRecord`: `id`, `createdAt` (indexed), `sessionId` (indexed, nullable), `outcome`, `productType`, `productTypeSource`, `deviceType`, `images Bytes[]`, `rawAnswer String?`, `steps Json?`, `ipHash String?` (from `hashIp`), `role String?`. Regenerate the client locally. Do not push to production.

- [ ] **Step 2: Write failing tests**

- `shouldSaveAuditRecord`: false for `isSample: true`, and for roles `admin`, `test`, `monitor`; true for a null role.
- `saveAuditRecord` with a rejecting mocked `prisma.auditRecord.create` resolves without throwing.
- `saveAuditRecord` stores base64 input as decoded bytes, and stores `ipHash`, never the raw IP.

- [ ] **Step 3: Run them to verify they fail**

Run: `npx jest src/lib/audit/__tests__/record.test.ts --coverage=false`
Expected: FAIL, module not found.

- [ ] **Step 4: Implement `src/lib/audit/record.ts`**

- [ ] **Step 5: Wire the route and client**

In the route, read `isSample` and `productTypeSource` from the body. Call `after(() => saveAuditRecord(...))` on the context-first success path and on the `parse_error` path, when `shouldSaveAuditRecord` is true. `steps` holds model, stop reason, usage, model duration, total time and system prompt fingerprint. Reuse values already computed for tracing.

In `AuditClient.tsx`, send `isSample: isSampleRun` and `productTypeSource`, held in new state set where `setProductType` is called from the upload step, using the `auto | manual | sample` source already passed by `onProductTypeChange`.

Add a test at the route's helper level that outcome `no_ai_surface` and `parse_error` inputs are both saved with `rawAnswer` kept.

- [ ] **Step 6: Run tests and type-check**

Run: `npx jest src/lib/audit/__tests__/record.test.ts --coverage=false; npx tsc --noEmit | grep -E "record|patterns/analyze|AuditClient"`
Expected: tests PASS, no type errors in these files.

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma src/lib/audit/record.ts src/app/api/patterns/analyze/route.ts src/components/audit/AuditClient.tsx
git add -f src/lib/audit/__tests__/record.test.ts
git commit -m "Audit: keep real audits for review"
```

### Task 2: Notice, privacy page and 30-day deletion

**Files:**
- Modify: `src/components/audit/ScreenshotUpload.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/api/cron/check-web-vitals/route.ts:94`
- Test: `src/lib/audit/__tests__/record.test.ts`

**Interfaces:**
- Consumes: `prisma.auditRecord` from Task 1
- Produces: `deleteExpiredAuditRecords(now?: Date): Promise<number>` in `record.ts`

- [ ] **Step 1: Write a failing test**

`deleteExpiredAuditRecords` calls `deleteMany` with `createdAt: { lt: now - 30 days }`, so a 29-day-old record is kept.

- [ ] **Step 2: Implement and call it from the daily cron**

Add it beside the existing Web Vitals cleanup at line 94, caught separately so one failure can't stop the other.

- [ ] **Step 3: Add the notice**

Show this beside the upload area and above the Analyze button, on desktop and in the mobile sticky bar, so it is seen before analysing:

> Your screenshots go to Anthropic's Claude for analysis. We keep screenshots and results for 30 days to improve the audit, so please don't upload anything confidential. [Privacy policy](/privacy)

- [ ] **Step 4: Update the privacy page**

- Add an "AI UX Audit" section: what is kept (screenshots, results, technical details, a hashed IP address), why, 30 days, and how to ask for deletion.
- Add Anthropic and Neon to Third-Party Services.
- Replace the out-of-date "SQLite" line with Postgres hosted on Neon.
- Update `lastUpdated`.
- Flag in the PR that a qualified person should check the wording.

- [ ] **Step 5: Run tests, design check and commit**

Run: `npx jest src/lib/audit/__tests__/record.test.ts --coverage=false; npx tsc --noEmit | grep -E "ScreenshotUpload|privacy|check-web-vitals"`
Expected: PASS, no type errors in these files. The pre-commit design check passes.

```bash
git add src/components/audit/ScreenshotUpload.tsx src/app/privacy/page.tsx src/app/api/cron/check-web-vitals/route.ts src/lib/audit/record.ts
git add -f src/lib/audit/__tests__/record.test.ts
git commit -m "Audit: notice before upload, privacy page, 30-day deletion"
```

### Task 3: Rate each finding

**Files:**
- Modify: `src/lib/audit/analytics.ts`
- Modify: `src/components/audit/GapCard.tsx`
- Modify: `src/components/audit/FullPageResults.tsx:1046`
- Test: `src/components/audit/__tests__/GapCard.test.tsx`

**Interfaces:**
- Consumes: `trackAuditEvent`, which already stamps the audit's session id
- Produces: event `audit_gap_rated` with `{ pattern: string, position: number, useful: boolean }`

- [ ] **Step 1: Write failing tests**

- With `ratable`, tapping "Yes" fires `audit_gap_rated` with `useful: true` and marks Yes as selected, via `aria-pressed`.
- Tapping "No" afterwards fires a second event and moves the selection, so the last tap counts.
- Without `ratable`, no rating controls render. Demo cards at `FullPageResults.tsx:152` stay unrated.

- [ ] **Step 2: Implement**

Add `audit_gap_rated` to the allowed names. Add an optional `ratable` prop to `GapCard`, and pass it only at line 1046. Copy: "Was this useful?" with "Yes" and "No" buttons. Use a colour transition, per the motion rule.

- [ ] **Step 3: Run tests and commit**

Run: `npx jest src/components/audit/__tests__/GapCard.test.tsx --coverage=false`
Expected: PASS.

```bash
git add src/lib/audit/analytics.ts src/components/audit/GapCard.tsx src/components/audit/FullPageResults.tsx
git add -f src/components/audit/__tests__/GapCard.test.tsx
git commit -m "Audit: let visitors rate each finding"
```

### Task 4: Monthly review export

**Files:**
- Create: `scripts/analysis/export-audit-records.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run audit:export`, writing to `~/Desktop/evals-study/live-YYYY-MM/`, one image file and one JSON per record, including that audit's `audit_gap_rated` events, plus a `summary.txt`.

- [ ] **Step 1: Implement**

Read-only against the database. `summary.txt` lists counts by outcome and product type, how often the type was guessed or chosen by hand, Yes and No totals per pattern, and failed or empty runs. Keep the JSON in the same `{ id, productType, status, response }` shape as the study's `outputs` folders so `tools/build-review.mjs` can be reused.

- [ ] **Step 2: Verify**

With the table applied to a local or test run, run `npm run audit:export`. Expected: folder created, and `summary.txt` totals match the number of JSON files.

- [ ] **Step 3: Commit**

```bash
git add scripts/analysis/export-audit-records.mjs package.json
git commit -m "Audit: export kept records for monthly review"
```

**Imran's habit, not code:** once a month, 30 minutes. Run the export, read the runs rated "No" plus the empty ones, mark pass or fail with one line on what went wrong, and pick the largest group to fix next.

### Task 5: Small automatic check

**Files:**
- Create: `tests/audit-evals/smoke.ts`
- Create: `tests/audit-evals/smoke-rules.ts`
- Create: `.github/workflows/audit-smoke.yml`
- Test: `src/lib/audit/__tests__/smoke-rules.test.ts`

**Interfaces:**
- Produces: `checkSmokeRules(id: string, answer: ClaudeAnalysisResponse): string[]` returning failed rule messages
- Produces: `npm run eval:audit:smoke`

- [ ] **Step 1: Write failing tests for the rules**

- A Claude Code answer with no agent pattern fails.
- A pricing or login answer with any applicable pattern fails.
- An ordinary chat answer listing Confidence Visualization fails.
- An unreadable answer fails.
- Final rules and screenshot list follow what the rerun shows: only rules that pass today are locked in.

- [ ] **Step 2: Implement the rules and runner**

About 10 screenshots, reusing `callAnalyze` from `tests/audit-evals/harness.ts`. Exit 1 on any failed rule. Before committing screenshots, confirm with Imran that they are fine to keep in this repo.

- [ ] **Step 3: Add the workflow**

Runs only on pull requests changing `src/lib/audit/prompts.ts`, `src/lib/audit/parseAnalysis.ts` or `src/app/api/patterns/analyze/route.ts`. Needs Imran to add `ANTHROPIC_API_KEY` to GitHub secrets. Dry-run the runner locally before the first push.

- [ ] **Step 4: Verify and commit**

Run: `npx jest src/lib/audit/__tests__/smoke-rules.test.ts --coverage=false; npm run eval:audit:smoke`
Expected: all PASS, and a report of about 10 screenshots.

```bash
git add tests/audit-evals/smoke.ts tests/audit-evals/smoke-rules.ts .github/workflows/audit-smoke.yml package.json
git add -f src/lib/audit/__tests__/smoke-rules.test.ts
git commit -m "Audit: small automatic check when the prompt changes"
```
