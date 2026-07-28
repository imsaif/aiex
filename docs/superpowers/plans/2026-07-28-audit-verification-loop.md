# Audit Verification-Critic Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a server-side generate → verify → targeted-revise loop to the free audit so findings with fabricated/unverifiable evidence are dropped or sharpened before the user sees them, and prove the quality lift on a grown golden-corpus eval.

**Architecture:** After the existing single Sonnet vision call produces a draft audit, a narrow "verification critic" call re-examines the same screenshot(s) and returns per-finding verdicts (keep/sharpen/drop + evidence-visible). If any finding is not `keep`, one bounded revise call re-emits the audit JSON honoring those verdicts; the result is validated with the existing parser and falls back to the original draft on any failure or time-budget exhaustion. The loop is env-flag gated, time-budgeted under the serverless cap, and shares one rubric module with the offline eval judge. In parallel, the eval corpus grows from 2 → ~15–20 fixtures so the with/without-loop axis-mean delta is trustworthy.

**Tech Stack:** Next.js 15 App Router (route handler), `@anthropic-ai/sdk`, Zod, Jest (unit), ts-node (eval runner), Playwright (E2E, mock-only).

## Global Constraints

- **Model:** audit + critic + eval judge all use `claude-sonnet-4-6` unless overridden by an env var. Do NOT introduce a different default model without an A/B on the corpus.
- **No prompt unhobbling in this work.** Do not edit the "Hard rules" / process steps in `src/lib/audit/prompts.ts`. Prompt simplification is a separate later experiment.
- **Loop must never make the audit worse than today:** on any critic/revise error, parse failure, empty-out, or time-budget exhaustion, return the original draft unchanged.
- **Loop sits AFTER the `isE2EMode()` short-circuit** in the route so Playwright specs never trigger a Claude call.
- **Loop applies only to the context-first flow** (`isContextFirst === true`), which is the only flow with `topGaps`.
- **Serverless time budget:** the analyze route must set `maxDuration` and enforce an internal wall-clock deadline; the loop must self-skip when the deadline is near.
- **Success metric:** LLM-judge axis means (`faithfulness, specificity, patternFit, actionability, noFabrication`) go up or hold vs baseline on the grown corpus, with no hard-assert regression. Not revenue.
- **Copy rule:** avoid em-dashes in any user-facing copy (none expected in this server-only work, but applies to any error strings that could surface).
- **Type-check with `npx tsc --noEmit`, never `npm run build`, while a dev server may be running.**

---

## File Structure

**Track 2 (loop) — new files:**
- `src/lib/audit/criticRubric.ts` — the shared rubric text (what a good finding is). Imported by both the runtime critic and the offline judge.
- `src/lib/audit/critic.ts` — `CriticVerdictSchema`, `parseCriticResponse()`, `needsRevision()`, `verifyFindings()` (the critic Claude call).
- `src/lib/audit/revise.ts` — `reviseAudit()` (the bounded revise Claude call + fallback-to-draft).
- `src/lib/audit/verifyLoop.ts` — `runVerificationLoop()` orchestrator (verify → decide → revise → validate → fallback, time-budgeted).
- Tests: `src/lib/audit/__tests__/critic.test.ts`, `revise.test.ts`, `verifyLoop.test.ts`.

**Track 2 — modified files:**
- `src/app/api/patterns/analyze/route.ts` — add `maxDuration`, compute deadline, call `runVerificationLoop()` behind the `AUDIT_VERIFY_LOOP` flag inside the context-first branch.
- `tests/audit-evals/judge.ts` — import the shared rubric instead of the inline duplicate.
- `tests/audit-evals/run.ts` — optional `EVAL_WITH_LOOP` A/B pass + separate report file.

**Track 1 (corpus) — new files (independent, can run in parallel):**
- `tests/audit-evals/validate-corpus.ts` — coverage validator (asserts ≥1 fixture per product type, ≥2 empty-surface, ≥3 fabrication-trap).
- `tests/audit-evals/fixtures/<slug>/{screenshot.*,expected.json}` — the new fixtures.
- `package.json` — add `eval:corpus-check` script.

---

## Track 2 — the loop

### Task 1: Shared rubric module

**Files:**
- Create: `src/lib/audit/criticRubric.ts`

**Interfaces:**
- Produces: `export const AUDIT_QUALITY_RUBRIC: string` — the shared definition of finding quality (faithfulness, specificity, pattern-fit, actionability, no-fabrication), phrased neutrally so both the holistic judge and the per-finding critic can embed it.

- [ ] **Step 1: Create the rubric module**

```ts
// src/lib/audit/criticRubric.ts

/**
 * The single definition of "what a good audit finding is". Embedded by BOTH:
 *  - the offline eval judge (tests/audit-evals/judge.ts) — holistic 0-5 axis scores
 *  - the runtime verification critic (src/lib/audit/critic.ts) — per-finding verdicts
 * Keep this the one source of truth so the live loop and the eval stay aligned.
 */
export const AUDIT_QUALITY_RUBRIC = `A high-quality AI UX audit finding satisfies all of:

1. FAITHFULNESS — the finding's \`evidence\` quotes or describes a UI element that is ACTUALLY present in the screenshot. Made-up elements are the worst failure.
2. SPECIFICITY — the \`finding\` references concrete visible UI ("the input box at the bottom has no token counter"), not a generic pattern restatement ("the chat lacks confidence visualization").
3. PATTERN FIT — the pattern genuinely applies to the surface shown (no agentic patterns on a chat surface, no error-recovery on a settings page).
4. ACTIONABILITY — the \`recommendation\` is a concrete fix a designer can ship this week, not a definition of the pattern.
5. NO FABRICATION — no finding claims a control is missing when it is visible (small icons under a message, hover states, sidebar items all count as present). False-absence is the single most damaging failure for this audit.`;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/audit/criticRubric.ts
git commit -m "feat(audit): shared quality rubric for critic + judge"
```

---

### Task 2: Critic schema, parser, and revision decision

**Files:**
- Create: `src/lib/audit/critic.ts`
- Test: `src/lib/audit/__tests__/critic.test.ts`

**Interfaces:**
- Consumes: `extractJsonObject` from `src/lib/audit/parseAnalysis.ts`; `AUDIT_QUALITY_RUBRIC` from `./criticRubric`; `ClaudeAnalysisResponse` from `@/types/audit`.
- Produces:
  - `CriticVerdictSchema` (zod) and `type CriticVerdict = { verdicts: Array<{ index: number; verdict: 'keep'|'sharpen'|'drop'; reason: string; evidenceVisible: boolean }>; overallNote: string }`
  - `type CriticResult = { ok: true; data: CriticVerdict } | { ok: false; reason: 'no-json'|'invalid-json'|'schema-mismatch'; detail: string }`
  - `parseCriticResponse(text: string): CriticResult`
  - `needsRevision(v: CriticVerdict): boolean`
  - `buildCriticPrompt(draft: ClaudeAnalysisResponse): string`
  - `verifyFindings(opts): Promise<CriticResult>` (defined in Task 3; declared here so callers know the name)

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/audit/__tests__/critic.test.ts
import {
  CriticVerdictSchema,
  parseCriticResponse,
  needsRevision,
  buildCriticPrompt,
} from '../critic';

describe('parseCriticResponse', () => {
  it('parses a fenced JSON verdict block', () => {
    const text = '```json\n{"verdicts":[{"index":1,"verdict":"drop","reason":"no such icon","evidenceVisible":false}],"overallNote":"one fabricated finding"}\n```';
    const r = parseCriticResponse(text);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.verdicts).toHaveLength(1);
      expect(r.data.verdicts[0].verdict).toBe('drop');
      expect(r.data.verdicts[0].evidenceVisible).toBe(false);
    }
  });

  it('returns no-json when there is no object', () => {
    expect(parseCriticResponse('I could not evaluate this.').ok).toBe(false);
  });

  it('returns schema-mismatch when verdict enum is wrong', () => {
    const r = parseCriticResponse('{"verdicts":[{"index":1,"verdict":"maybe","evidenceVisible":true}],"overallNote":""}');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('schema-mismatch');
  });
});

describe('needsRevision', () => {
  it('is false when every verdict is keep', () => {
    const v = CriticVerdictSchema.parse({ verdicts: [{ index: 1, verdict: 'keep', evidenceVisible: true }], overallNote: '' });
    expect(needsRevision(v)).toBe(false);
  });
  it('is true when any verdict is drop or sharpen', () => {
    const v = CriticVerdictSchema.parse({ verdicts: [
      { index: 1, verdict: 'keep', evidenceVisible: true },
      { index: 2, verdict: 'sharpen', evidenceVisible: true },
    ], overallNote: '' });
    expect(needsRevision(v)).toBe(true);
  });
  it('is false on an empty verdict list', () => {
    const v = CriticVerdictSchema.parse({ verdicts: [], overallNote: '' });
    expect(needsRevision(v)).toBe(false);
  });
});

describe('buildCriticPrompt', () => {
  it('includes the finding index and evidence so the critic can check them', () => {
    const prompt = buildCriticPrompt({
      topGaps: [{ pattern: 'Feedback Loops', status: 'missing', finding: 'no thumbs up/down', evidence: 'message area', recommendation: 'add icons', resource: null }],
      applicablePatterns: ['Feedback Loops'],
    } as never);
    expect(prompt).toContain('Feedback Loops');
    expect(prompt).toContain('index');
    expect(prompt).toMatch(/keep.*sharpen.*drop/s);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/audit/__tests__/critic.test.ts`
Expected: FAIL with "Cannot find module '../critic'".

- [ ] **Step 3: Implement `critic.ts` (schema, parser, decision, prompt)**

```ts
// src/lib/audit/critic.ts
import { z } from 'zod';
import { extractJsonObject } from './parseAnalysis';
import type { ClaudeAnalysisResponse } from '@/types/audit';
import { AUDIT_QUALITY_RUBRIC } from './criticRubric';

export const CriticVerdictSchema = z.object({
  verdicts: z
    .array(
      z.object({
        index: z.number().int().positive(),
        verdict: z.enum(['keep', 'sharpen', 'drop']),
        reason: z.string().optional().default(''),
        evidenceVisible: z.boolean(),
      }),
    )
    .optional()
    .default([]),
  overallNote: z.string().optional().default(''),
});
export type CriticVerdict = z.infer<typeof CriticVerdictSchema>;

export type CriticResult =
  | { ok: true; data: CriticVerdict }
  | { ok: false; reason: 'no-json' | 'invalid-json' | 'schema-mismatch'; detail: string };

/** Parse the critic's JSON verdicts. Never throws — mirrors parseAnalysisResponse. */
export function parseCriticResponse(text: string): CriticResult {
  const candidate = extractJsonObject(text ?? '');
  if (!candidate) return { ok: false, reason: 'no-json', detail: 'No JSON object found in critic response' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (err) {
    return { ok: false, reason: 'invalid-json', detail: err instanceof Error ? err.message : 'JSON.parse threw' };
  }
  const result = CriticVerdictSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      reason: 'schema-mismatch',
      detail: result.error.issues.slice(0, 5).map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }
  return { ok: true, data: result.data };
}

/** Revise only when the critic flagged at least one finding as sharpen or drop. */
export function needsRevision(v: CriticVerdict): boolean {
  return v.verdicts.some((x) => x.verdict !== 'keep');
}

/** Build the critic user prompt: rubric + the draft's findings, indexed 1-based. */
export function buildCriticPrompt(draft: ClaudeAnalysisResponse): string {
  const gaps = (draft.topGaps ?? []).map((g, i) => ({
    index: i + 1,
    pattern: g.pattern,
    finding: g.finding,
    evidence: g.evidence ?? '(none provided)',
    recommendation: g.recommendation ?? '',
  }));
  return `You are verifying an AI UX audit against the screenshot(s) it was generated from. You see the SAME image(s) plus the audit's findings below. Your ONLY job is per-finding verification, not rewriting.

${AUDIT_QUALITY_RUBRIC}

## Findings to verify (1-based index)
\`\`\`json
${JSON.stringify(gaps, null, 2)}
\`\`\`

For EACH finding, re-examine the image and decide:
- "keep" — evidence is clearly visible in the image and the finding is specific and correct.
- "sharpen" — the pattern fits and the issue is real, but the finding is generic or the evidence is vague. It should be re-grounded on a specific visible element.
- "drop" — the evidence is NOT visible in the image (the claimed element is absent or the finding claims something is missing that is actually present). Set evidenceVisible=false.

Set \`evidenceVisible\` to whether the finding's evidence can actually be located in the image.

Return STRICT JSON only, no fences, no preamble:
{
  "verdicts": [
    { "index": <1-based>, "verdict": "keep" | "sharpen" | "drop", "reason": "<one line citing the visible/absent element>", "evidenceVisible": <boolean> }
  ],
  "overallNote": "<one line on the biggest problem, or empty>"
}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/audit/__tests__/critic.test.ts`
Expected: PASS (all 7 cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/audit/critic.ts src/lib/audit/__tests__/critic.test.ts
git commit -m "feat(audit): critic verdict schema, parser, and prompt"
```

---

### Task 3: The critic Claude call (`verifyFindings`)

**Files:**
- Modify: `src/lib/audit/critic.ts`
- Test: `src/lib/audit/__tests__/critic.test.ts`

**Interfaces:**
- Consumes: `Anthropic` type + `Anthropic.ImageBlockParam[]`; `parseCriticResponse`, `buildCriticPrompt`.
- Produces: `verifyFindings(opts: { client: Anthropic; imageBlocks: Anthropic.ImageBlockParam[]; draft: ClaudeAnalysisResponse; model?: string }): Promise<CriticResult>`

- [ ] **Step 1: Write the failing tests (append to critic.test.ts)**

```ts
import type Anthropic from '@anthropic-ai/sdk';
import { verifyFindings } from '../critic';

function fakeClient(text: string): Anthropic {
  return { messages: { create: async () => ({ content: [{ type: 'text', text }] }) } } as unknown as Anthropic;
}
const DRAFT = { topGaps: [{ pattern: 'Feedback Loops', status: 'missing', finding: 'x', evidence: 'y', recommendation: 'z', resource: null }], applicablePatterns: ['Feedback Loops'] } as never;

describe('verifyFindings', () => {
  it('returns parsed verdicts on a well-formed critic reply', async () => {
    const client = fakeClient('{"verdicts":[{"index":1,"verdict":"keep","evidenceVisible":true}],"overallNote":""}');
    const r = await verifyFindings({ client, imageBlocks: [], draft: DRAFT });
    expect(r.ok).toBe(true);
  });

  it('returns ok:false when the critic call throws', async () => {
    const client = { messages: { create: async () => { throw new Error('boom'); } } } as unknown as Anthropic;
    const r = await verifyFindings({ client, imageBlocks: [], draft: DRAFT });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('invalid-json');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/audit/__tests__/critic.test.ts -t verifyFindings`
Expected: FAIL with "verifyFindings is not a function".

- [ ] **Step 3: Implement `verifyFindings` (append to critic.ts)**

```ts
import type Anthropic from '@anthropic-ai/sdk';

const CRITIC_MODEL = process.env.AUDIT_CRITIC_MODEL || 'claude-sonnet-4-6';

/**
 * The verification critic. Re-examines the screenshot(s) and returns per-finding
 * verdicts. Narrow by design (verification, not rewriting) because a same-model
 * self-critic is only reliable on the "does this evidence exist" subtask.
 * Never throws — returns a CriticResult; the caller falls back to the draft on ok:false.
 */
export async function verifyFindings(opts: {
  client: Anthropic;
  imageBlocks: Anthropic.ImageBlockParam[];
  draft: ClaudeAnalysisResponse;
  model?: string;
}): Promise<CriticResult> {
  if ((opts.draft.topGaps ?? []).length === 0) {
    return { ok: true, data: { verdicts: [], overallNote: '' } };
  }
  let response;
  try {
    response = await opts.client.messages.create({
      model: opts.model || CRITIC_MODEL,
      max_tokens: 1024,
      temperature: 0,
      messages: [
        { role: 'user', content: [...opts.imageBlocks, { type: 'text', text: buildCriticPrompt(opts.draft) }] },
      ],
    });
  } catch (err) {
    return { ok: false, reason: 'invalid-json', detail: err instanceof Error ? err.message : 'critic call threw' };
  }
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && block.type === 'text' ? block.text : '';
  return parseCriticResponse(raw);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/audit/__tests__/critic.test.ts`
Expected: PASS (all cases including verifyFindings).

- [ ] **Step 5: Commit**

```bash
git add src/lib/audit/critic.ts src/lib/audit/__tests__/critic.test.ts
git commit -m "feat(audit): verification critic Claude call"
```

---

### Task 4: The bounded revise call (`reviseAudit`)

**Files:**
- Create: `src/lib/audit/revise.ts`
- Test: `src/lib/audit/__tests__/revise.test.ts`

**Interfaces:**
- Consumes: `Anthropic`; `parseAnalysisResponse` from `./parseAnalysis`; `CriticVerdict` from `./critic`; `ClaudeAnalysisResponse` from `@/types/audit`.
- Produces: `reviseAudit(opts: { client: Anthropic; imageBlocks: Anthropic.ImageBlockParam[]; systemPrompt?: string; draft: ClaudeAnalysisResponse; verdicts: CriticVerdict; model?: string }): Promise<ClaudeAnalysisResponse>` — returns the revised audit, or the ORIGINAL draft on any failure or empty-out.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/audit/__tests__/revise.test.ts
import type Anthropic from '@anthropic-ai/sdk';
import { reviseAudit } from '../revise';
import { CriticVerdictSchema } from '../critic';

const DRAFT = {
  score: 3, maxScore: 4, productTypeSummary: 's', surfaceDescription: 'd',
  applicablePatterns: ['A', 'B'],
  topGaps: [
    { pattern: 'A', status: 'missing', finding: 'real', evidence: 'visible', recommendation: 'fix', resource: null },
    { pattern: 'B', status: 'missing', finding: 'fabricated', evidence: 'not there', recommendation: 'fix', resource: null },
  ],
  quickWins: [], generalObservations: [], chatContext: '',
} as never;
const VERDICTS = CriticVerdictSchema.parse({
  verdicts: [
    { index: 1, verdict: 'keep', evidenceVisible: true },
    { index: 2, verdict: 'drop', evidenceVisible: false },
  ],
  overallNote: 'one fabricated finding',
});
function client(text: string): Anthropic {
  return { messages: { create: async () => ({ content: [{ type: 'text', text }] }) } } as unknown as Anthropic;
}

describe('reviseAudit', () => {
  it('returns the revised audit when the revise reply parses and keeps findings', async () => {
    const revised = JSON.stringify({ ...JSON.parse(JSON.stringify(DRAFT)), topGaps: [DRAFT.topGaps[0]] });
    const out = await reviseAudit({ client: client(revised), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(1);
    expect(out.topGaps![0].pattern).toBe('A');
  });

  it('falls back to the draft when the revise reply is unparseable', async () => {
    const out = await reviseAudit({ client: client('sorry, no JSON'), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(2);
  });

  it('falls back to the draft when revise empties a non-empty audit', async () => {
    const emptied = JSON.stringify({ ...JSON.parse(JSON.stringify(DRAFT)), topGaps: [] });
    const out = await reviseAudit({ client: client(emptied), imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(2); // fell back, did not accept the empty-out
  });

  it('falls back to the draft when the revise call throws', async () => {
    const throwing = { messages: { create: async () => { throw new Error('boom'); } } } as unknown as Anthropic;
    const out = await reviseAudit({ client: throwing, imageBlocks: [], draft: DRAFT, verdicts: VERDICTS });
    expect(out.topGaps).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/audit/__tests__/revise.test.ts`
Expected: FAIL with "Cannot find module '../revise'".

- [ ] **Step 3: Implement `revise.ts`**

```ts
// src/lib/audit/revise.ts
import type Anthropic from '@anthropic-ai/sdk';
import { parseAnalysisResponse } from './parseAnalysis';
import type { CriticVerdict } from './critic';
import type { ClaudeAnalysisResponse } from '@/types/audit';

const REVISE_MODEL = process.env.AUDIT_REVISE_MODEL || 'claude-sonnet-4-6';

function buildRevisePrompt(draft: ClaudeAnalysisResponse, verdicts: CriticVerdict): string {
  return `You previously produced this AI UX audit as strict JSON. A verifier re-checked each finding against the screenshot(s) and returned verdicts. Apply the verdicts and re-emit the COMPLETE audit JSON.

Rules for applying verdicts (by 1-based topGaps index):
- "drop": REMOVE that finding entirely. Do not replace it. A shorter, honest audit is the goal.
- "sharpen": keep the finding but re-ground it on a specific visible UI element, fixing vague or generic wording. Do not invent new evidence.
- "keep": leave that finding unchanged.
Do NOT add any new findings. Do NOT change findings that were kept. Keep the exact same JSON shape and all other fields (score, maxScore, applicablePatterns, quickWins, generalObservations, chatContext, surfaceDescription, productTypeSummary). If you drop findings, recompute nothing else except leaving score/maxScore as-is.

## Current audit JSON
\`\`\`json
${JSON.stringify(draft, null, 2)}
\`\`\`

## Verifier verdicts
\`\`\`json
${JSON.stringify(verdicts, null, 2)}
\`\`\`

Return ONLY the revised audit as valid JSON. No preamble, no markdown fences.`;
}

/**
 * One bounded revise pass. Returns the revised audit, or the ORIGINAL draft on
 * any failure. Guards against the revise call emptying a previously non-empty
 * audit (a common failure mode when the model over-drops).
 */
export async function reviseAudit(opts: {
  client: Anthropic;
  imageBlocks: Anthropic.ImageBlockParam[];
  systemPrompt?: string;
  draft: ClaudeAnalysisResponse;
  verdicts: CriticVerdict;
  model?: string;
}): Promise<ClaudeAnalysisResponse> {
  const draftGapCount = (opts.draft.topGaps ?? []).length;
  let response;
  try {
    response = await opts.client.messages.create({
      model: opts.model || REVISE_MODEL,
      max_tokens: 4096,
      temperature: 0,
      ...(opts.systemPrompt
        ? { system: [{ type: 'text', text: opts.systemPrompt, cache_control: { type: 'ephemeral' } }] }
        : {}),
      messages: [
        { role: 'user', content: [...opts.imageBlocks, { type: 'text', text: buildRevisePrompt(opts.draft, opts.verdicts) }] },
      ],
    });
  } catch {
    return opts.draft;
  }
  const block = response.content.find((b) => b.type === 'text');
  const raw = block && block.type === 'text' ? block.text : '';
  const parsed = parseAnalysisResponse(raw);
  if (!parsed.ok) return opts.draft;
  // Reject an empty-out: if the draft had findings but the revise returned none,
  // that is almost always over-dropping, not a legitimately clean surface.
  if (draftGapCount > 0 && (parsed.data.topGaps ?? []).length === 0) return opts.draft;
  return parsed.data;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/audit/__tests__/revise.test.ts`
Expected: PASS (all 4 cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/audit/revise.ts src/lib/audit/__tests__/revise.test.ts
git commit -m "feat(audit): bounded revise pass with fall-back-to-draft"
```

---

### Task 5: Loop orchestrator (`runVerificationLoop`)

**Files:**
- Create: `src/lib/audit/verifyLoop.ts`
- Test: `src/lib/audit/__tests__/verifyLoop.test.ts`

**Interfaces:**
- Consumes: `verifyFindings`, `needsRevision` from `./critic`; `reviseAudit` from `./revise`; `ClaudeAnalysisResponse` from `@/types/audit`; `Anthropic`.
- Produces: `runVerificationLoop(opts: { client: Anthropic; imageBlocks: Anthropic.ImageBlockParam[]; systemPrompt?: string; draft: ClaudeAnalysisResponse; deadlineMs: number; now?: () => number; criticModel?: string; reviseModel?: string }): Promise<{ result: ClaudeAnalysisResponse; revised: boolean; verdict: import('./critic').CriticVerdict | null }>`
  - `now` is injectable for testing (defaults to `Date.now`). `deadlineMs` is an absolute epoch-ms budget.
  - Exports `REVISE_MIN_MS = 12000` (min headroom required before starting a revise call).

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/audit/__tests__/verifyLoop.test.ts
import type Anthropic from '@anthropic-ai/sdk';
import { runVerificationLoop, REVISE_MIN_MS } from '../verifyLoop';

const DRAFT = {
  applicablePatterns: ['A', 'B'],
  topGaps: [
    { pattern: 'A', status: 'missing', finding: 'real', evidence: 'visible', recommendation: 'fix', resource: null },
    { pattern: 'B', status: 'missing', finding: 'fabricated', evidence: 'not there', recommendation: 'fix', resource: null },
  ],
} as never;

// A client whose two sequential calls (critic then revise) return scripted text.
function scriptedClient(texts: string[]): Anthropic {
  let i = 0;
  return { messages: { create: async () => ({ content: [{ type: 'text', text: texts[i++] ?? '' }] }) } } as unknown as Anthropic;
}

const ALL_KEEP = '{"verdicts":[{"index":1,"verdict":"keep","evidenceVisible":true},{"index":2,"verdict":"keep","evidenceVisible":true}],"overallNote":""}';
const DROP_2 = '{"verdicts":[{"index":1,"verdict":"keep","evidenceVisible":true},{"index":2,"verdict":"drop","evidenceVisible":false}],"overallNote":"one fabricated"}';
const REVISED_ONE = JSON.stringify({ applicablePatterns: ['A', 'B'], topGaps: [DRAFT.topGaps[0]], quickWins: [], generalObservations: [], chatContext: '' });

describe('runVerificationLoop', () => {
  it('skips revise when every finding is keep', async () => {
    const out = await runVerificationLoop({
      client: scriptedClient([ALL_KEEP]), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });

  it('revises when a finding is dropped', async () => {
    const out = await runVerificationLoop({
      client: scriptedClient([DROP_2, REVISED_ONE]), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(true);
    expect(out.result.topGaps).toHaveLength(1);
  });

  it('returns the draft unchanged when the critic call fails', async () => {
    const out = await runVerificationLoop({
      client: scriptedClient(['not json']), imageBlocks: [], draft: DRAFT,
      deadlineMs: 1_000_000, now: () => 0,
    });
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });

  it('skips the whole loop when the deadline is already too close', async () => {
    let calls = 0;
    const client = { messages: { create: async () => { calls++; return { content: [{ type: 'text', text: ALL_KEEP }] }; } } } as unknown as Anthropic;
    const out = await runVerificationLoop({
      client, imageBlocks: [], draft: DRAFT,
      deadlineMs: 5000, now: () => 5000 - (REVISE_MIN_MS - 1), // less than REVISE_MIN_MS left
    });
    expect(calls).toBe(0);
    expect(out.revised).toBe(false);
    expect(out.result.topGaps).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/audit/__tests__/verifyLoop.test.ts`
Expected: FAIL with "Cannot find module '../verifyLoop'".

- [ ] **Step 3: Implement `verifyLoop.ts`**

```ts
// src/lib/audit/verifyLoop.ts
import type Anthropic from '@anthropic-ai/sdk';
import { verifyFindings, needsRevision, type CriticVerdict } from './critic';
import { reviseAudit } from './revise';
import type { ClaudeAnalysisResponse } from '@/types/audit';

/** Minimum headroom (ms) required before the deadline to attempt the revise call. */
export const REVISE_MIN_MS = 12000;

export async function runVerificationLoop(opts: {
  client: Anthropic;
  imageBlocks: Anthropic.ImageBlockParam[];
  systemPrompt?: string;
  draft: ClaudeAnalysisResponse;
  /** Absolute epoch-ms wall-clock budget. */
  deadlineMs: number;
  now?: () => number;
  criticModel?: string;
  reviseModel?: string;
}): Promise<{ result: ClaudeAnalysisResponse; revised: boolean; verdict: CriticVerdict | null }> {
  const now = opts.now ?? Date.now;

  // Not enough budget to even run the critic + a possible revise: bail early.
  if (opts.deadlineMs - now() < REVISE_MIN_MS) {
    return { result: opts.draft, revised: false, verdict: null };
  }

  const critic = await verifyFindings({
    client: opts.client,
    imageBlocks: opts.imageBlocks,
    draft: opts.draft,
    model: opts.criticModel,
  });
  if (!critic.ok) return { result: opts.draft, revised: false, verdict: null };
  if (!needsRevision(critic.data)) return { result: opts.draft, revised: false, verdict: critic.data };

  // Re-check budget before the (larger) revise call.
  if (opts.deadlineMs - now() < REVISE_MIN_MS) {
    return { result: opts.draft, revised: false, verdict: critic.data };
  }

  const revised = await reviseAudit({
    client: opts.client,
    imageBlocks: opts.imageBlocks,
    systemPrompt: opts.systemPrompt,
    draft: opts.draft,
    verdicts: critic.data,
    model: opts.reviseModel,
  });
  const changed = revised !== opts.draft;
  return { result: revised, revised: changed, verdict: critic.data };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/audit/__tests__/verifyLoop.test.ts`
Expected: PASS (all 4 cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/audit/verifyLoop.ts src/lib/audit/__tests__/verifyLoop.test.ts
git commit -m "feat(audit): verification loop orchestrator with time budget"
```

---

### Task 6: Wire the loop into the analyze route

**Files:**
- Modify: `src/app/api/patterns/analyze/route.ts`

**Interfaces:**
- Consumes: `runVerificationLoop` from `@/lib/audit/verifyLoop`.
- Produces: no new exports beyond `maxDuration`.

- [ ] **Step 1: Add the route time cap and import (top of file)**

Add the import alongside the other `@/lib/audit/*` imports (after line 9):

```ts
import { runVerificationLoop } from '@/lib/audit/verifyLoop';
```

Add near the top-level exports (below the `anthropic` client init, before `POST`):

```ts
// The verify loop can make up to 3 sequential Sonnet vision calls. The default
// ~15s serverless cap is not enough; raise it (Vercel Pro allows up to 300s).
export const maxDuration = 60;

// Wall-clock headroom the loop must respect so the function never hard-times-out.
// Leaves ~5s under maxDuration for JSON serialization + the after() sample write.
const LOOP_DEADLINE_MS = 55000;
```

- [ ] **Step 2: Insert the loop after draft parse, inside the context-first branch**

In the context-first branch, immediately AFTER `const analysisData = parseResult.data;` (line 259) and BEFORE `const id = ...` (line 262), replace the single `analysisData` use by threading the loop result. Insert:

```ts
    // Verification-critic loop (flag-gated). Re-examines the screenshot(s),
    // drops/sharpens unverifiable findings, and falls back to the draft on any
    // failure or when the time budget is spent. Context-first flow only.
    let finalData = analysisData;
    if (isContextFirst && process.env.AUDIT_VERIFY_LOOP === '1') {
      try {
        const loop = await runVerificationLoop({
          client: anthropic,
          imageBlocks,
          systemPrompt,
          draft: analysisData,
          deadlineMs: startedAt + LOOP_DEADLINE_MS,
        });
        finalData = loop.result;
        console.log('[Pattern Audit] Verify loop:', loop.revised ? 'revised' : 'kept draft');
      } catch (loopErr) {
        // The loop is best-effort; never let it break the response.
        console.error('[Pattern Audit] Verify loop error (using draft):', loopErr);
        finalData = analysisData;
      }
    }
```

Then, in the context-first `results` object (lines 266-293), replace every `analysisData.` reference with `finalData.`. Specifically: `finalData.maxScore`, `finalData.score`, `finalData.productTypeSummary`, `finalData.surfaceDescription`, `finalData.applicablePatterns`, `finalData.topGaps`, `finalData.quickWins`, `finalData.generalObservations`, `finalData.chatContext`, `finalData.detectedComponent`, `finalData.patterns`, `finalData.summary`, and the `finalData.topGaps` in the `criticalMissing` filter.

Leave the legacy branch (lines 338-351) untouched — it still reads `analysisData`.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors. (If `tsc` flags an unused `analysisData` in the context-first branch, that is expected only if you renamed it — do NOT rename; keep `analysisData` as the draft and add `finalData` as above.)

- [ ] **Step 4: Verify the loop is skipped in E2E and unit paths**

Run: `npx jest src/lib/audit`
Expected: PASS (all critic/revise/loop tests still green).

Run: `npm run e2e -- audit-flow`
Expected: PASS. (E2E_MODE short-circuits before any Claude call, so the loop is never reached; the flag defaults off anyway.)

- [ ] **Step 5: Manual smoke test with the flag on (real API, one screenshot)**

Run a local dev server and post one real screenshot with `AUDIT_VERIFY_LOOP=1` in `.env.local`, confirming the response still matches the schema and the log prints `Verify loop: revised` or `kept draft`.

```bash
AUDIT_VERIFY_LOOP=1 npm run dev
# In another shell, POST a base64 screenshot to http://localhost:3000/api/patterns/analyze
# with a JSON body { productType: "chat-interface", imageBase64: "<...>" } and confirm 200 + valid shape.
```

Expected: HTTP 200, well-formed context-first result, and a `[Pattern Audit] Verify loop:` log line.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/patterns/analyze/route.ts
git commit -m "feat(audit): wire verify loop into analyze route behind AUDIT_VERIFY_LOOP flag"
```

---

### Task 7: Eval harness — dedupe rubric + with/without-loop A/B

**Files:**
- Modify: `tests/audit-evals/judge.ts`
- Modify: `tests/audit-evals/run.ts`

**Interfaces:**
- Consumes: `AUDIT_QUALITY_RUBRIC` from `../../src/lib/audit/criticRubric`; `runVerificationLoop` from `../../src/lib/audit/verifyLoop`; `ClaudeAnalysisResponse`.
- Produces: `run.ts` writes `last-run.json` (loop off) or `last-run-loop.json` (loop on, when `EVAL_WITH_LOOP=1`).

- [ ] **Step 1: Point judge.ts at the shared rubric (no behavior change)**

In `tests/audit-evals/judge.ts`, import the shared rubric and reference it in the scoring rubric section instead of the hand-maintained inline copy. Add at the top:

```ts
import { AUDIT_QUALITY_RUBRIC } from '../../src/lib/audit/criticRubric';
```

In `buildJudgePrompt`, keep the numbered 0-5 axis instructions but add, just above the `## Output` line:

```ts
`\n## Reference: what a good finding is\n${AUDIT_QUALITY_RUBRIC}\n`
```

(Do not delete the axis definitions — the judge still emits 0-5 per axis. This only anchors both consumers to one shared definition.)

- [ ] **Step 2: Add the optional loop pass in run.ts**

In `tests/audit-evals/run.ts`, add the import:

```ts
import { runVerificationLoop } from '../../src/lib/audit/verifyLoop';
```

In `callAnalyze`, after `const parsed = parseAnalysisResponse(rawText);` and the `if (!parsed.ok)` guard, before `return { ok: true, ... }`, insert:

```ts
  let data = parsed.data;
  if (process.env.EVAL_WITH_LOOP === '1') {
    const loop = await runVerificationLoop({
      client: opts.client,
      imageBlocks: [
        { type: 'image', source: { type: 'base64', media_type: opts.mediaType, data: opts.imageBase64 } },
      ],
      draft: parsed.data,
      deadlineMs: Date.now() + 300000, // eval is offline; give it plenty of room
    });
    data = loop.result;
  }
  return { ok: true, data, rawText };
```

(Change the existing `return { ok: true, data: parsed.data, rawText };` to use `data`.)

- [ ] **Step 3: Write the report to a loop-specific file when the loop is on**

In `run.ts` `main()`, change the fixed `REPORT_PATH` write to branch on the flag:

```ts
const reportPath = process.env.EVAL_WITH_LOOP === '1'
  ? path.join(__dirname, 'last-run-loop.json')
  : REPORT_PATH;
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
```

(Update the two `console.log(\`Report: ${REPORT_PATH}\`)` / summary lines to print `reportPath`.)

- [ ] **Step 4: Type-check the eval harness**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no new errors.

- [ ] **Step 5: Run the A/B (requires ANTHROPIC_API_KEY; uses real API on the 2 existing fixtures)**

```bash
npm run eval:audit                       # baseline → last-run.json
EVAL_WITH_LOOP=1 npm run eval:audit      # with loop → last-run-loop.json
node -e 'const a=require("./tests/audit-evals/last-run.json").axisMeans,b=require("./tests/audit-evals/last-run-loop.json").axisMeans;console.table(Object.fromEntries(Object.keys(a).map(k=>[k,{off:a[k].toFixed(2),on:b[k].toFixed(2),delta:(b[k]-a[k]).toFixed(2)}])))'
```

Expected: both runs complete; the printed table shows per-axis off/on/delta. On only 2 fixtures this is DIRECTIONAL, not the ship decision (see Track 1). Do not conclude success or failure from this run alone.

- [ ] **Step 6: Commit**

```bash
git add tests/audit-evals/judge.ts tests/audit-evals/run.ts
git commit -m "test(audit-evals): share rubric + optional with-loop A/B pass"
```

---

## Track 1 — grow the golden corpus (parallel with Track 2)

### Task 8: Corpus coverage validator + new fixtures

**Files:**
- Create: `tests/audit-evals/validate-corpus.ts`
- Create: `tests/audit-evals/fixtures/<slug>/expected.json` + `screenshot.*` (many)
- Modify: `package.json` (add `eval:corpus-check` script)

**Interfaces:**
- Consumes: `ExpectedFixtureSchema` from `./types`.
- Produces: `eval:corpus-check` npm script that exits non-zero when coverage targets are unmet.

**Note on screenshots (human/browser input required):** each fixture needs a real screenshot of an AI product surface. Capture these from public AI product UIs (e.g. a chat product's thread, a settings/billing page for the empty-surface cases, a chat WITH visible thumbs-up/down for a fabrication trap). An agent with the `claude-in-chrome` browser tools can capture them; otherwise the operator supplies them. `expected.json` for each is authored by hand per `ExpectedFixtureSchema`.

- [ ] **Step 1: Write the failing coverage validator test-runner**

```ts
// tests/audit-evals/validate-corpus.ts
#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { ExpectedFixtureSchema } from './types';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const ALL_PRODUCT_TYPES = [
  'chat-interface', 'ai-agent', 'recommendation-system', 'content-generation',
  'dashboard-analytics', 'embedded-ai-feature', 'search-discovery', 'reports-documents', 'general',
] as const;
const MIN_EMPTY_SURFACE = 2;   // expectEmptyTopGaps fixtures
const MIN_FABRICATION_TRAP = 3; // fixtures whose notes tag them as traps + carry mustNotFindPatterns

function main() {
  const entries = fs.existsSync(FIXTURES_DIR)
    ? fs.readdirSync(FIXTURES_DIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    : [];

  const byType = new Map<string, number>();
  let emptyCount = 0;
  let trapCount = 0;
  const problems: string[] = [];

  for (const e of entries) {
    const dir = path.join(FIXTURES_DIR, e.name);
    const files = fs.readdirSync(dir);
    const hasShot = files.some((f) => /^screenshot\.(png|jpe?g|webp|gif)$/i.test(f));
    if (!hasShot) { problems.push(`${e.name}: missing screenshot.*`); continue; }
    let fx;
    try {
      fx = ExpectedFixtureSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, 'expected.json'), 'utf-8')));
    } catch (err) {
      problems.push(`${e.name}: expected.json invalid — ${err instanceof Error ? err.message : 'parse error'}`);
      continue;
    }
    byType.set(fx.productType, (byType.get(fx.productType) ?? 0) + 1);
    if (fx.expectEmptyTopGaps) emptyCount++;
    if (/\btrap\b/i.test(fx.notes) && fx.mustNotFindPatterns.length > 0) trapCount++;
  }

  const missingTypes = ALL_PRODUCT_TYPES.filter((t) => (byType.get(t) ?? 0) === 0);
  if (missingTypes.length) problems.push(`missing product types: ${missingTypes.join(', ')}`);
  if (emptyCount < MIN_EMPTY_SURFACE) problems.push(`need >= ${MIN_EMPTY_SURFACE} empty-surface fixtures, have ${emptyCount}`);
  if (trapCount < MIN_FABRICATION_TRAP) problems.push(`need >= ${MIN_FABRICATION_TRAP} fabrication-trap fixtures, have ${trapCount}`);

  console.log(`[corpus-check] ${entries.length} fixtures; types covered: ${byType.size}/${ALL_PRODUCT_TYPES.length}; empty: ${emptyCount}; traps: ${trapCount}`);
  if (problems.length) {
    console.error('[corpus-check] FAIL:\n  - ' + problems.join('\n  - '));
    process.exit(1);
  }
  console.log('[corpus-check] PASS');
}
main();
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, add:

```json
"eval:corpus-check": "ts-node tests/audit-evals/validate-corpus.ts"
```

- [ ] **Step 3: Run it to see it fail on the current 2-fixture corpus**

Run: `npm run eval:corpus-check`
Expected: FAIL listing the 7 missing product types and insufficient empty/trap counts.

- [ ] **Step 4: Author fixtures until the check passes**

For each missing product type, create `tests/audit-evals/fixtures/<slug>/` with a `screenshot.*` and an `expected.json`. Use `_template` as the shape. Example for a fabrication-trap fixture:

```json
{
  "description": "Claude chat thread with visible thumbs-up/down feedback icons under each AI message",
  "productType": "chat-interface",
  "productDescription": "A conversational AI assistant",
  "mustFindPatterns": [],
  "mustNotFindPatterns": ["Feedback Loops"],
  "maxApplicablePatterns": 6,
  "expectEmptyTopGaps": false,
  "notes": "TRAP: feedback icons ARE visible under each message. A finding claiming 'no thumbs-up/down' is a false-absence fabrication and must NOT appear."
}
```

Example for an empty-surface fixture:

```json
{
  "description": "Plain SaaS billing/usage page, no AI output on screen",
  "productType": "general",
  "productDescription": "Billing page of an AI product",
  "mustFindPatterns": [],
  "mustNotFindPatterns": ["Confidence Visualization", "Explainable AI", "Error Recovery"],
  "expectEmptyTopGaps": true,
  "notes": "No AI product surface visible. Expect empty topGaps and generalObservations populated."
}
```

Author enough fixtures to satisfy: ≥1 per product type (9), ≥2 `expectEmptyTopGaps`, ≥3 with `TRAP` in notes + `mustNotFindPatterns`. Target ~15–20 total.

- [ ] **Step 5: Run the coverage check until green**

Run: `npm run eval:corpus-check`
Expected: PASS with `types covered: 9/9`.

- [ ] **Step 6: Establish the baseline run on the grown corpus**

Run: `npm run eval:audit`
Expected: completes; note the axis means in `last-run.json`. If a fixture legitimately fails hard-asserts at baseline, fix its `expected.json` or record it as known-hard in its `notes` — do not delete it silently.

- [ ] **Step 7: Commit**

```bash
git add tests/audit-evals/validate-corpus.ts tests/audit-evals/fixtures package.json
git commit -m "test(audit-evals): corpus coverage validator + grown golden fixtures"
```

---

## Ship gate (after both tracks)

Run the A/B on the GROWN corpus and apply the bar from the spec:

```bash
npm run eval:corpus-check                 # must PASS (9/9 types, >=2 empty, >=3 traps)
npm run eval:audit                        # baseline → last-run.json
EVAL_WITH_LOOP=1 npm run eval:audit       # with loop → last-run-loop.json
# compare axis means (Task 7 Step 5 one-liner)
```

Ship the flag ON (`AUDIT_VERIFY_LOOP=1` in Vercel prod env) only if: axis means are up-or-hold on every axis, hard-assert pass count does not regress, and the manual smoke test (Task 6 Step 5) stayed well under `maxDuration`. Otherwise keep the flag off and iterate on the critic/revise prompts against the same corpus.

---

## Self-Review

**Spec coverage:**
- Track 1 corpus (≥15–20, all 9 types, ≥2 empty, ≥3 traps) → Task 8. ✓
- Per-finding verdict critic (not axis scores) → Tasks 2–3. ✓
- Shared rubric module between judge + critic → Task 1, Task 7 Step 1. ✓
- Conditional single revise, fall back to draft → Tasks 4–5. ✓
- maxDuration + internal time budget → Task 5 (`REVISE_MIN_MS`), Task 6 (`maxDuration`, `LOOP_DEADLINE_MS`). ✓
- Feature flag for A/B → Task 6 (`AUDIT_VERIFY_LOOP`), Task 7 (`EVAL_WITH_LOOP`). ✓
- Loop after E2E check, context-first only → Task 6 Step 2 + Global Constraints. ✓
- No prompt unhobbling → Global Constraints (enforced by not touching prompts.ts). ✓
- Success = eval axis means up/hold, no hard-assert regression → Ship gate. ✓
- Critic at higher effort/different model → `AUDIT_CRITIC_MODEL` / `criticModel` param (Task 3, Task 5); A/B decides the value. ✓

**Placeholder scan:** no TBD/TODO; every code step shows full code; the one human input (screenshots) is explicitly flagged with how to source it. ✓

**Type consistency:** `verifyFindings`, `needsRevision`, `parseCriticResponse`, `buildCriticPrompt`, `reviseAudit`, `runVerificationLoop`, `REVISE_MIN_MS`, `CriticVerdict`, `CriticResult`, `AUDIT_QUALITY_RUBRIC` are named identically across producing and consuming tasks. `runVerificationLoop` returns `{ result, revised, verdict }` and the route consumes `.result`/`.revised`. ✓
