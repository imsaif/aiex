# Audit Eval Baseline

Reference scores and known issues to compare against on every prompt/model change. Update the **Latest baseline** section when a tune produces a durable improvement; keep prior baselines in **History** so deltas stay visible.

---

## Latest baseline — 2026-05-11

**Setup**
- Model: `claude-sonnet-4-20250514`
- Temperature: `0` (analyze) / `0` (judge, implicit)
- Corpus: 2 fixtures (`chat-claude`, `agent-claude-code`)
- Prompts: `src/lib/audit/prompts.ts` post-tune (cap 8, visible-inventory rule, re-check-before-claiming-absent rule)

**Scores**

| Axis | Mean | Threshold | Status |
|---|---|---|---|
| faithfulness | 4.75 | 4.0 | ✓ |
| specificity | 4.25 | 4.0 | ✓ |
| patternFit | 3.00 | 4.0 | ✗ |
| actionability | 4.00 | 4.0 | ✓ |
| noFabrication | 4.75 | 4.0 | ✓ |
| hard-asserts | 2 / 2 | all | ✓ |

**Per-fixture**

| Fixture | Hard | F | S | P | A | NF |
|---|---|---|---|---|---|---|
| chat-claude | PASS | 4.5 | 3.5 | 1 | 3 | 4.5 |
| agent-claude-code | PASS | 5 | 5 | 5 | 5 | 5 |

`patternFit` mean = 3.0 is pulled down entirely by chat-claude scoring 1.0. agent-claude-code (negative-case) is perfect.

---

## Verification loop (`AUDIT_VERIFY_LOOP`) — first A/B measurement, 2026-08-19

Run with `npm run eval:audit:ab` (paired: one analyze call, both arms scored
from that same draft). Two fixtures, run separately.

**Result: the loop did not fire on either fixture.** Both returned
`outcome: budget-precritic` — analyze consumed the wall-clock budget before the
critic could start. No verdicts, no revisions, zero delta on every axis.

| Fixture | analyze latency | budget left of 55s | outcome |
|---|---|---|---|
| chat-claude | 49.6s | ~5.4s (needs ≥12s) | `budget-precritic` |
| agent-claude-code | 975.8s ⚠️ | none | `budget-precritic` |

⚠️ The 975s analyze is not a normal call — almost certainly SDK retries against
a degraded or rate-limited endpoint. Treat that row's *scores* as unusable; only
its outcome is informative, and it agrees with the other.

**What this reframes.** The open question was "does the critic improve audit
quality?" The measurement says we cannot answer that yet, because the prior
question is unanswered: **can the loop run at all inside the 55s budget?** On
these runs, no. Enabling `AUDIT_VERIFY_LOOP` today would most likely be a no-op
in production — it would bail at the same gate — while adding a failure surface.

**Caveat before acting.** These are local latencies, not Vercel's. A ~50s
analyze may reflect local network or API load rather than production behaviour.
Confirm against real production timing before concluding the loop is unusable.

**Next steps, in order**
1. Measure real production analyze latency (the analyze route already logs
   `latencyMs`). If p50 is well under ~35s, the loop has room and this local
   result was an artefact.
2. If production analyze really does run ~50s, the loop cannot work as designed.
   The options are a faster critic model (Haiku), running the critic
   concurrently rather than after analyze, or dropping the loop.
3. Only once the loop demonstrably fires: re-run the A/B for a quality delta,
   on a corpus larger than 2.

**Do not flip the flag on this evidence.** n=2, the loop never executed, and one
of the two runs was anomalous.

### ⚠️ Possible regression, unconfirmed — `agent-claude-code`

This fixture scored 5/5/5/5/5 with hard-asserts PASS in the May baseline. In the
Aug 19 run it scored F=3 S=3 P=1 A=3 NF=1 with hard-asserts **FAIL**. The
May baseline used `claude-sonnet-4-20250514`; the harness now runs
`claude-sonnet-4-6`, so this may be model drift rather than a prompt problem.

Unconfirmed: it comes from the anomalous 975s run, whose output quality is
suspect. **Re-run this fixture on a healthy connection before treating it as a
real regression.**

---

## Known open issues (NOT FIXED — gated on more fixtures)

### Bug 4 — CV / Explainable AI scope on conversational vs research surfaces

**Symptom.** On a vanilla Claude.ai chat thread, the audit still flags Confidence Visualization and Explainable AI. The prompt's current definitions say CV applies "where the AI returns a substantive answer/result" and XAI applies "to AI-generated answers/recommendations" — so the audit is technically rule-consistent. A long instructional Claude response qualifies under those definitions.

**The right fix.** Narrow the CV/XAI scope to **fact claims about external state of the world** (search/citation/research surfaces) and explicitly exclude conversational dialog, instruction-following, opinion, creative output.

**Why not yet.** No research/citation fixture (Perplexity, ChatGPT search mode, Claude with citations) in the corpus. Narrowing the rule without a positive-case safety net risks swinging too far — CV/XAI must still fire on a search/citation surface where they legitimately apply. **Add `research-perplexity` (or equivalent) fixture before touching this.**

---

## What changed in this baseline (vs no-baseline / pre-tune)

| Change | File | Why |
|---|---|---|
| Hard cap: `applicablePatterns` ≤ 8 | `src/lib/audit/prompts.ts` Step 2 + Hard rules | Audit previously returned 19 on a chat thread despite soft "3-7" guidance |
| Step-1 visible-control inventory rule | `src/lib/audit/prompts.ts` Step 1 | Anchors later "X is missing" findings against visible UI |
| "Re-check before claiming absent" rule | `src/lib/audit/prompts.ts` Hard rules | Audit hallucinated absence of thumbs-up/down on 2 of 3 runs |
| `temperature: 0` on analyze call | `src/app/api/patterns/analyze/route.ts` | Run-to-run vision variance was ±3 on faithfulness axis |
| `temperature: 0` on eval runner | `tests/audit-evals/run.ts` | Match production behavior in the eval |
| Zod parser + 502 on schema fail | `src/lib/audit/parseAnalysis.ts`, analyze route | Replaced fragile greedy regex; bad responses now surface as typed errors |

## What this baseline does NOT yet measure

- Research/citation chat (gated — see Bug 4)
- Settings / billing / legal pages (negative case beyond terminal)
- Multi-screenshot uploads (API supports, runner currently picks first)
- Mobile-device-type screenshots
- Image-generation / multimodal interfaces
- Non-English surfaces

Each gap = a missing fixture. Plan target is 15-25 (see `README.md`).

---

## How to use this doc

**Before any prompt change**
1. Run `npm run eval:audit` against current `main` — record the scores under "Pre-tune" in your branch's note.
2. Apply the change.
3. Re-run — record "Post-tune."
4. Diff per-axis. Don't ship if any axis regressed by ≥0.5 without justification.

**When a tune lands durably**
1. Update the "Latest baseline" block above with new scores + setup.
2. Move the prior block into "History" below.
3. Remove from "Known open issues" if resolved; otherwise update the why-not-yet.

**Before adding fixtures**
- Adding a fixture changes the corpus → scores shift even with no prompt change. Re-baseline after curation so the next tune compares apples-to-apples.

---

## History

### Pre-tune snapshot — 2026-05-11 (n=2 fixtures, temperature default ~1)

| Axis | Mean | Notes |
|---|---|---|
| faithfulness | 3.00 | Hallucinated absence of visible UI on chat-claude |
| specificity | 1.75 | Generic pattern restatements |
| patternFit | 0.50 | 19 applicablePatterns on chat; 0 on agent (misread as terminal) |
| actionability | 2.00 | Generic recommendations |
| noFabrication | 2.75 | Invented missing thumbs-up/down |
| hard-asserts | 0 / 2 | chat over-cap, agent zero-patterns |

Run-to-run variance on chat-claude before temperature=0:
- faithfulness: 2 → 4.5 → 1 (across 3 runs)
- noFabrication: 2 → 4.5 → 0.5

That variance is what motivated the temperature=0 change.
