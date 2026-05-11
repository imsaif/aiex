# Audit Tool — Golden Corpus Evals

Layer 1 of the audit-tool QA strategy (see `/Users/imranmohammed/.claude/plans/staged-purring-hoare.md`). Measures the audit's output quality against a hand-curated set of screenshots with known expected gaps.

## What this does

For each fixture under `fixtures/<slug>/`:

1. Loads `screenshot.{png|jpg|webp}` + `expected.json`
2. Calls Claude Sonnet 4 vision with the **production** `buildSystemPrompt` / `buildUserPrompt` from `src/lib/audit/prompts.ts`
3. Parses the response with the **production** `parseAnalysisResponse`
4. Runs hard assertions: must-find patterns, must-not-find patterns, applicable-pattern cap, empty-topGaps expectation
5. Asks a Claude-based judge (also vision) to score the audit across 5 rubric axes (0–5 each):
   - **faithfulness** — does each finding's `evidence` quote match the screenshot?
   - **specificity** — are findings anchored on visible UI elements, not generic pattern descriptions?
   - **patternFit** — are the patterns actually relevant to the surface shown?
   - **actionability** — are recommendations specific and shippable?
   - **noFabrication** — are there any findings about UI that isn't in the screenshot?
6. Aggregates axis means across the corpus and exits non-zero if any mean drops below 4.0 or any hard assert fails.

## Adding a fixture

```bash
mkdir tests/audit-evals/fixtures/my-fixture
cp tests/audit-evals/fixtures/_template/expected.json tests/audit-evals/fixtures/my-fixture/
# drop a screenshot into the same dir, named screenshot.png / .jpg / .webp
```

Then edit `expected.json`:

| Field | Purpose |
|---|---|
| `description` | Short surface description ("Claude chat thread mid-conversation") |
| `productType` | One of `chat-interface`, `ai-agent`, `recommendation-system`, `content-generation`, `other` |
| `productDescription` | One-sentence product context |
| `mustFindPatterns` | Patterns the audit MUST surface in `topGaps`. Each name lowercased-matched. |
| `mustNotFindPatterns` | Patterns the audit MUST NOT surface — anti-assertions. Use for surfaces where it would be wrong (e.g., agentic patterns on a billing page). |
| `maxApplicablePatterns` | Optional cap on `applicablePatterns.length`. Use to prevent padding. |
| `expectEmptyTopGaps` | `true` for surfaces where NO AI UX pattern meaningfully applies (e.g., a pure terms-of-service page). Tests the "empty array is a valid answer" rule. |
| `notes` | Free-form. Surface description + why these patterns + why the anti-asserts. Read by the LLM judge. |

## Corpus coverage targets (15–25 fixtures, per plan)

| Bucket | Count | Why |
|---|---|---|
| Chat interfaces (ChatGPT-style, Claude, Gemini) | 3–4 | Largest user segment |
| AI agent dashboards (Cursor agent, Devin, Replit Agent) | 2–3 | Tests agentic pattern routing |
| Recommendation UIs (Spotify, YouTube, Netflix AI surfaces) | 2 | |
| Code assistants (Copilot inline, Cursor chat) | 2 | |
| Image/content generation (Midjourney, DALL-E, Suno) | 2 | |
| Settings/billing/legal pages within AI products | 2–3 | **Negative cases.** Should produce empty or minimal topGaps. This is the regression class we already shipped once (Apr 28). |
| Non-AI UIs (a generic SaaS dashboard, a static marketing page) | 1–2 | Stress-test surface classification |
| Edge cases: blurry, multilingual, dark mode, mobile | 2 | |

Start with 3–5 high-confidence fixtures (chat + settings + agent) before going wide.

## Running

```bash
npm run eval:audit                       # full corpus
npm run eval:audit -- chat               # only fixtures whose slug contains "chat"
npm run eval:audit -- chat agent         # union: "chat" OR "agent"
```

Requires `ANTHROPIC_API_KEY` in `.env.local` (loaded via dotenv).

**Cost**: each fixture is ~2 Claude Sonnet 4 vision calls (analyze + judge). At ~$0.01–0.03/call, a 15-fixture run is roughly $0.30–$0.90. Run locally before pushing; in CI, gate on PRs that touch prompts only.

## Report

Writes `tests/audit-evals/last-run.json` after every run — per-fixture hard-assert results, judge scores, judge comments, axis means. Commit-ignore this file or rotate it; do not check it in.

## CI integration (deferred)

Once the corpus reaches ~10 real fixtures, wire `.github/workflows/evals.yml` to run nightly + on PRs touching:

- `src/lib/audit/prompts.ts`
- `src/app/api/patterns/analyze/**`
- `src/lib/audit/parseAnalysis.ts`

Don't run on every PR — vision calls are slow and not free.

## Why not Promptfoo (deviation from plan)

The original plan called for Promptfoo. Building it instead as a custom TS runner because the eval needs to import the **exact** production `buildSystemPrompt` / `buildUserPrompt` / `parseAnalysisResponse` from `src/lib/audit/`. Mirroring the prompts in Promptfoo YAML would drift from production; writing a Promptfoo custom JS provider would be more wrapper than value. Direct TS import gets us prompt-fidelity for free and reuses the same parser the API route runs.

Trade-off accepted: no Promptfoo HTML report, no built-in CLI for variant comparison. We can revisit if/when we start A/B-testing prompt variants.
