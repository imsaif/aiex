---
name: Migrate Pattern To New Structure
description: Migrate an aiex pattern page to the value-forward structure (judgmentCall + takeaways + installPrompt + hideFAQ), audit its live demo, verify, and commit. Use when asked to "migrate pattern X", "continue the pattern migration", or work the pattern-new-structure-migration branch.
---

# Migrate Pattern To New Structure

The playbook for migrating one aiex pattern from the legacy structure (figmaPrompt + flat
guidelines/considerations + auto-FAQ) to the value-forward structure. Branch:
`pattern-new-structure-migration`. Reference page (always read first): `explainable-ai`.

This is a **content-authoring job**, not a mechanical one. Each page gets sharp, opinionated copy
specific to the pattern, in explainable-ai's voice, with one signature "trap". Keep the existing
intro / problem / solution / examples / codeExamples (the live demo) intact.

## The four fields to add to `src/data/patterns/patterns/<slug>/index.ts`

Add inside the pattern's `content` object (after `codeExamples` / `figmaPrompt`), plus `hideFAQ`
at the top level beside `dateModified`:

1. `hideFAQ: true` (top-level) — removes the redundant auto-FAQ and its FAQPage schema.
2. `judgmentCall: { explainWhen: string[], dontWhen: string[], trap: string }` — "When to use, and
   when it backfires". 3 bullets each; `trap` is the signature failure mode (one vivid paragraph).
3. `takeaways: [{ heading, body }]` — ~5, ranked, opinionated. Renders "Take it into your own product".
4. `installPrompt: string` — a paste-ready Claude Code prompt: one-line summary, a DO-NOT scope line,
   numbered moves (3–5), then a "When you're done, output a Markdown report with three sections"
   block (Surfaces updated / Surfaces flagged but not updated / New things you added). End with
   "Ask before adding dependencies."

Read `src/data/patterns/patterns/explainable-ai/index.ts` and `error-recovery/index.ts` as the
canonical shape every time before authoring.

## The signature "trap" — the hard, valuable part

Each pattern needs ONE memorable named trap (the thing that looks like the pattern but betrays it).
Already used — do NOT reuse these, find the pattern's own:
- explainable-ai → "fake transparency"
- error-recovery → "the dead-end apology"
- feedback-loops → "feedback theater"
- context-switching → "context bleed"
- adaptive-interfaces → "the rug-pull"

A good trap is concrete, names a real product failure, and is "worse than not doing the pattern at
all". Write `dontWhen` and the takeaways to circle it.

## Voice & quality bar

- Opinionated, declarative, specific. No hedging, no "it depends" filler.
- **No em-dashes** (project rule). Recast as commas / periods / colons / parens. Sweep `—` and `–`
  and `&mdash;` before declaring done.
- Match explainable-ai's cadence: short punchy headings, a sharp second sentence that turns the knife.

## Gotcha: the escaped backtick (happens EVERY time)

When you author a template-literal string via Edit/Write (the `installPrompt`, and the `code` string
in `code-examples.ts`), the **closing backtick keeps landing escaped** as `` \` `` →
`error TS1160: Unterminated template literal`. After any such edit:
```
grep -n 'Ask before adding dependencies' <file>   # for installPrompt
grep -nE '^\}\\`' <file>                            # for the code string close
```
and fix the trailing `` \` `` → `` ` ``.

## Verify (run every time)

```
npx tsc --noEmit 2>&1 | grep -i "<slug>" || echo "0 errors"      # 0 errors in the file
grep -rn "—\|–" src/data/patterns/patterns/<slug>/                # em-dash sweep -> none
# dev server is usually already running on :3000
html=$(curl -s http://localhost:3000/patterns/<slug>)
echo "$html" | grep -c backfires        # judgmentCall present (>=1)
echo "$html" | grep -c "Apply with Claude Code"   # install card (1)
echo "$html" | grep -c FAQPage           # want 0 (FAQ schema gone)
echo "$html" | grep -c "Frequently Asked" # want 0 (may show >0 on first compile; re-curl)
```

## Demo audit (FLAG, do not auto-rebuild in batch mode)

The legacy demos frequently (a) embody the trap instead of the lesson, and (b) use raw blue/green/
purple instead of design tokens. Every reviewer pass this session caught a demo problem.

1. Find it: `componentId` in `code-examples.ts` → the `case '<id>':` switch in
   `src/components/ui/CodeExampleBlock.tsx` → the component in `src/components/examples/*Demo.tsx`.
2. Screenshot it (Playwright; demos are `ssr:false` so curl can't see them):
   ```js
   import { chromium } from '/Users/imranmohammed/aiex/node_modules/playwright/index.mjs';
   const b = await chromium.launch();
   const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
   await p.goto('http://localhost:3000/patterns/<slug>', { waitUntil: 'networkidle' });
   // scroll the demo into view, interact, then region-screenshot the demo root
   ```
3. Verdict on three axes: **embodies the lesson (not the trap)?** / **tokenized (no raw colors)?** /
   **communicates the pattern's real positive intent, not just the guardrail?**
4. In batch mode: report the verdict + screenshot path and DEFER the rebuild to human review.
   Only rebuild when explicitly asked.

When you DO rebuild a demo:
- Tokens only (`bg-surface-primary`, `text-text-secondary`, `border-border-primary`, `accent-primary`,
  `bg-accent-subtle`, `bg-background-secondary`, `status-*`, `rounded-card/-input/-pill`). The
  `code` string in code-examples.ts keeps raw Tailwind (teaching code in a user's repo).
- Make the user DO something and SEE the consequence; the demo must teach the lesson, lead with the
  pattern's positive intent, not just trap-avoidance.
- Multi-column demos get crushed to 512px unless their `componentId` is in the `max-w-4xl` (or
  `max-w-6xl`) bucket in `CodeExampleBlock.tsx` `previewMaxWidth`.
- Tests in `src/components/examples/__tests__/` are GITIGNORED (run locally, not committed). Still
  rewrite the test to match and confirm it passes.

## Commit

- Content-only migration is one `index.ts` (sometimes the inline-figmaPrompt file): passes the
  pre-commit brand hook normally. `git commit -m "Migrate <slug> to new pattern structure"`.
- If a commit touches `CodeExampleBlock.tsx` (e.g. adding a width bucket) the brand hook may flag
  PRE-EXISTING raw-color debt in that file (lines ~663–746). When ONLY pre-existing debt is flagged,
  `git commit --no-verify` is sanctioned (policy: don't bulk-rewrite token debt). Confirm the
  flagged lines are not ones you added before bypassing.

## Bookkeeping

After each pattern, update the memory file
`~/.claude/projects/-Users-imranmohammed/memory/project_aiex_pattern_migration.md`: bump the
migrated count, record the slug + commit + angle, and set next-up.

Migrated so far (10, +adaptive-interfaces = 11): explainable-ai, agent-reflection-learning,
workspace-native-agents, conversational-ui, progressive-disclosure, confidence-visualization,
trust-calibration, error-recovery, feedback-loops, context-switching, adaptive-interfaces.

## Batch execution (the chosen workflow)

Run ~4 patterns per batch via subagents. Each subagent: read reference + target, author the four
fields, run the verify block, run the demo audit (flag only), and report back: the proposed `index.ts`
diff, the chosen trap angle, and the demo verdict. The main thread reviews the copy before committing.
Do not auto-commit content in batch mode unless told to; copy quality is the reason for the gate.
