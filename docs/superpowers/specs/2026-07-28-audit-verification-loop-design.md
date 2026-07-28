# Audit Quality via a Verification Critic Loop — Design

**Date:** 2026-07-28
**Status:** Approved for planning
**Owner:** aiex audit

## Goal

Improve the quality of the free audit's output (the tool at `src/app/api/patterns/analyze/route.ts`) by adding a runtime **generate → verify → targeted revise** loop, and prove the improvement is real by measuring it against a grown golden-corpus eval.

The audit is the final ask across everything aiex offers, so raising its floor matters even though nobody is paying yet. We are optimizing **output quality**, explicitly not conversion.

## Success metric

Success is defined **only** as: the LLM-judge **axis means** in `npm run eval:audit` go up (or hold at ceiling) with the loop enabled versus disabled, on the grown corpus, with **no regression in hard-assert pass rate**. The five axes are `faithfulness, specificity, patternFit, actionability, noFabrication` (`tests/audit-evals/judge.ts`), pass threshold `4.0`.

Success is **not** "someone paid" and **not** a conversion lift. Funnel data (memory: `project_aiex_audit_clarity_baseline`) shows the leak is demo→start (~80% drop) with ~85% value rate on completed audits — quality is likely not the conversion bottleneck, and we will not judge this work by revenue.

## Non-goals

- **No prompt unhobbling in this change.** The "Hard rules" in `src/lib/audit/prompts.ts` encode real anti-fabrication fixes and the audit runs on `claude-sonnet-4-6` (not a Claude 5 model). Stripping rules per the context-engineering article now would confound the eval delta. Prompt simplification is a **separate, later** experiment against the same corpus.
- No change to the paid `/services` flow.
- No full reflexion loop (whole-audit regenerate). Rejected: with a same-model self-critic, a full regenerate can re-hallucinate and shares the generator's failure modes.
- No change to what the user sees. The loop is server-side; the output shape (Zod schema in `src/types/audit.ts`) is unchanged.

## Why a verification critic, not a scoring critic

The generator, the critic, and the eval judge are all `claude-sonnet-4-6`. A self-critic will **not** reliably catch a confident hallucination the generator already committed to — shared failure modes (correlated blindness). Self-critique's real, higher-accuracy value is on a **narrow verification-shaped subtask**: "re-examine the image; does each finding's `evidence` actually exist on screen?" That targets this audit's dominant, most-damaging failure mode — **false absence** (e.g. claiming "no thumbs-up/down" when feedback icons are visible). The critic is pointed there, not at "write a better audit."

## Track 1 (first): grow the eval corpus

The corpus is the instrument that tells us whether the loop worked. Today: **2 real fixtures** (`agent-claude-code`, `chat-claude`) of **9** product types. Two fixtures cannot support a trustworthy axis-mean delta.

**Deliverable:** ~15–20 fixtures under `tests/audit-evals/fixtures/<slug>/` (each: `screenshot.*` + `expected.json` per the existing `_template` and `ExpectedFixtureSchema`).

Coverage requirements:
- At least one fixture per `ProductType`: `chat-interface, ai-agent, recommendation-system, content-generation, dashboard-analytics, embedded-ai-feature, search-discovery, reports-documents, general` (9).
- At least 2 **empty / no-AI-surface** fixtures (billing, marketing, or legal page) with `expectEmptyTopGaps: true`.
- At least 3–4 **fabrication-trap** fixtures: surfaces where a control the model tends to claim missing is actually visible (e.g. a chat with visible feedback icons). These carry `mustNotFindPatterns` / curator notes so the judge and hard-asserts catch false-absence.

Each fixture's `expected.json` sets `mustFindPatterns`, `mustNotFindPatterns`, `expectEmptyTopGaps`, `maxApplicablePatterns`, `description`, `notes` as appropriate.

**Exit gate for Track 1:** the full grown corpus runs green today (all axis means ≥ 4.0, hard-asserts pass) *without* the loop. This establishes the baseline the loop must beat. If a fixture legitimately fails at baseline, either fix its `expected.json` or record it as a known-hard case — do not silently drop it.

## Track 2: the verification critic loop (Option C)

### Flow (in `src/app/api/patterns/analyze/route.ts`)

1. **Generate** — existing single call (unchanged): `claude-sonnet-4-6`, `temperature: 0`, cached system prompt, image blocks + user prompt → parse via `parseAnalysisResponse`. This is the **draft**.
2. **Verify** — new critic call. Input: the same screenshot(s) + the draft's `topGaps` (and `applicablePatterns`). Output: **per-finding verdicts** (schema below). The critic re-examines the image and, for each finding, judges whether its `evidence` is actually visible and whether the `finding`/`recommendation` is surface-grounded vs a generic pattern restatement.
3. **Decide** — if every finding is `keep`, skip the revise (the common, already-good case: no added revise latency). Otherwise proceed.
4. **Revise (targeted, ≤1 pass)** — a revise call that receives the draft + the critic's verdicts and is instructed to **only**: drop findings verdicted `drop`, sharpen findings verdicted `sharpen` (re-ground on visible evidence), and leave `keep` findings untouched. It re-emits the full audit JSON. Not a from-scratch regenerate.
5. **Validate & fall back** — parse the revised JSON with the production `parseAnalysisResponse` + Zod. On any failure (parse error, schema mismatch, dropped-everything, API error, or the revise call would exceed the time budget), **return the original draft**. The loop is never worse than today.

Re-apply existing post-processing (`clampScore`, `outcome` derivation, `recordAuditSample`) to the final chosen response, not the intermediate draft.

### Per-finding verdict schema (new)

Shared module `src/lib/audit/critic.ts` exports the critic call and a Zod schema, e.g.:

```
CriticVerdictSchema = {
  verdicts: [
    {
      index: number,              // 1-based index into draft.topGaps
      verdict: "keep" | "sharpen" | "drop",
      reason: string,             // why (cites the visible/absent element)
      evidenceVisible: boolean    // is the finding's evidence actually on screen?
    }
  ],
  overallNote: string
}
```

This is **deliberately different** from the eval judge's holistic 0–5 axis output. Axis scores ("specificity: 3.5") are a weak revise signal; per-finding verdicts give the revise step something concrete to act on.

### Shared rubric, two consumers

Extract the rubric *language* (what faithfulness / specificity / no-fabrication mean for this audit) into a single place both consumers import:
- `tests/audit-evals/judge.ts` (offline, holistic axis scoring — unchanged output shape).
- `src/lib/audit/critic.ts` (runtime, per-finding verdicts).

One source of truth for "what a good finding is," so the live critic and the eval judge stay aligned. Move `judgeAudit`'s rubric text into a shared constant rather than duplicating it.

### Model / effort for the critic

The verify step is the accuracy-critical one. Run it at higher reasoning effort than the generator, and/or a different model, since verification-shaped tasks benefit most and this is where correlated blindness bites. Exact choice decided during implementation and A/B'd on the corpus.

### Serverless time budget (hard constraint)

`src/app/api/patterns/analyze/route.ts` currently sets **no `maxDuration`** → inherits Vercel's ~15s default. Generate + verify + revise = up to 3 sequential vision calls, which will exceed 15s. Required changes:
- Add `export const maxDuration = <N>` to the route (Pro allows up to 300s; pick a value that comfortably covers 3 vision calls, e.g. 60).
- Enforce an internal wall-clock budget: if the draft alone already consumed most of the budget, skip verify/revise and return the draft. Never let the loop cause a hard function timeout — a slower-but-complete audit beats a 504.

### Feature flag

Gate the loop behind an env flag (e.g. `AUDIT_VERIFY_LOOP=1`) so it can be toggled without a deploy and so the eval can run both with- and without-loop to produce the A/B delta.

## Testing & eval plan

- **Unit:** `critic.ts` — Zod schema accept/reject, verdict parsing (brace-balanced extraction, mirror `parseAnalysis`), and the revise merge logic (drop/sharpen/keep applied correctly, fall-back-to-draft on bad revise output). Co-locate in `src/lib/audit/__tests__/`.
- **Eval (the success gate):** extend `tests/audit-evals/run.ts` to run each fixture **twice** — loop off vs loop on — and report per-axis mean deltas. Ship only if means improve or hold with no hard-assert regression.
- **E2E:** existing Playwright specs use `E2E_MODE` (`src/lib/audit/e2e-mock.ts`) and must stay green; the mock branch short-circuits before any Claude call, so the loop must sit *after* the `E2E_MODE` check. Add no new real-API E2E.

## Risks & mitigations

- **Correlated blindness** — mitigated by narrowing the critic to verification (evidence-exists) and running it at higher effort / different model; not sold as catching deep semantic errors.
- **Thin corpus → noisy delta** — mitigated by Track 1 as a hard prerequisite (~15–20 fixtures) before trusting any delta.
- **Latency / timeout on the free path** — mitigated by `maxDuration` bump, internal time budget, conditional (skip revise when all `keep`), and hard fall-back to draft.
- **Confounded measurement** — mitigated by isolating the loop from prompt-unhobbling (separate later experiment) and by the flag-driven A/B in the eval.

## Out of scope / follow-ups

- Prompt unhobbling experiment (separate spec, same corpus).
- Applying the loop to the paid `/services` deliverable.
- Persisting full audit results server-side (today they live in client `sessionStorage`).
