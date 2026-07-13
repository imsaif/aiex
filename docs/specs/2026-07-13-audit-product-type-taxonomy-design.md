# Spec: Audit product-type taxonomy redesign (remove "other", tailor audits per surface)

**Date:** 2026-07-13
**Status:** design — awaiting review before implementation

## Problem

The audit's product-type picker has a generic **"other" ("Something else")** option that is the single
biggest bucket in real usage (~25-40% of audits). It's a dumping ground: it tells us nothing, and it
gives the user no tailored audit — today only `ai-agent` changes the prompt; every other type
(including `other`) differs by a single label sentence.

Analysis of what actually lands in "other" (live `AuditSample.surfaceDescription`) shows it is **not
random** — it clusters into a few real AI-surface types the picker is missing, plus genuinely non-AI
surfaces (marketing/checkout/sign-in) that already resolve correctly to `no_ai_surface` and need no
category.

## Goals

1. Replace "other" with concrete, research-backed AI-surface categories.
2. Make the product type **actually tailor the audit** (per-type pattern emphasis), not just relabel.
3. Bring the audit's pattern library from 36 → **38** to match the site (add the two agentic patterns
   the audit is missing — one of which anchors a new type).

## Final taxonomy — 8 concrete types + hidden fallback

| slug | label | one-line | status |
|---|---|---|---|
| `chat-interface` | Chat interface | Conversational AI, bots, assistants | keep |
| `ai-agent` | AI agent | Multi-step tasks, automation, actions | keep |
| `recommendation-system` | Recommendations | Content surfacing, ranking, predictions | keep |
| `content-generation` | Content generation | Writing, design, code, creation | keep |
| `dashboard-analytics` | Dashboard & analytics | AI insights, metrics, admin overviews | **new** |
| `embedded-ai-feature` | Embedded AI feature | AI copilot/assist inside an existing tool | **new** |
| `search-discovery` | Search & discovery | AI/semantic search, discovery feeds | **new** |
| `reports-documents` | Reports & documents | AI-generated reports, extraction, enrichment | **new** |
| `general` | *(not shown)* | Internal fallback — base audit, no emphasis | **renamed from `other`** |

**Escape hatch / selection UX (revised 2026-07-13 — auto-detect-first):** the "other" tile is removed,
and the flow flips from *pick-first* to **auto-detect-first with one-tap override**:

- On screenshot upload, the existing auto-classifier runs and resolves to one of the 8 types (or
  `general` if it can't decide).
- The result shows as a **"Detected type: {label} · Change"** chip, not a mandatory picker.
- **"Change"** reveals the 8 manual tiles for override; picking one collapses the grid.
- Before any upload, a subtle line: *"Add a screenshot — we'll detect your product type automatically.
  Or pick it yourself."*
- **Analyze is no longer gated on a manual pick** (`canAnalyze = hasImages`). The type is a soft prompt
  nudge, so a missing/auto-detected type never blocks the audit; worst case it's `general` (base audit).

Rationale: removes a friction step before the audit (helps the conversion/volume lever) while keeping a
correction path and full use of the taxonomy. No user ever sees a dumping-ground option.

Historical `AuditSample`/`UiEvent` rows with `productType: 'other'` are left as-is (legacy data; the
admin renders whatever string is stored).

## Pattern library → 38

Add the two patterns the audit currently omits (both exist on the site; both agentic-flavored):

- **Agent Reflection & Learning** — "show users what the agent learned from corrections so trust builds through visible improvement."
- **Workspace-Native Agent Integration** — "embed AI inside existing tools so users never leave their working context." **This is the anchor pattern for the new `embedded-ai-feature` type.**

Update the prompt header copy "36 research-backed AI UX patterns" → "38". (Add the patterns first;
the count follows — not a find-replace. See the standing note against blindly sweeping 36→38.)

## Prompt structure change (`src/lib/audit/prompts.ts`)

Today: `basePatterns` (28 core) always; `agentPatterns` (8) only for `ai-agent`; no other tailoring.

New structure — three gated groups + a per-type emphasis line:

1. **Core patterns (28)** — always included. Unchanged.
2. **Autonomous-agent patterns (8)** — Autonomy Spectrum, Intent Preview, Plan Summary, Action Audit
   Trail, Escalation Pathways, Trust Calibration, Mixed-Initiative Control, Agent Status & Monitoring.
   Included **only for `ai-agent`** (avoids over-applying agentic patterns to passive surfaces).
3. **Embedded/learning-agent patterns (2, NEW)** — Workspace-Native Agent Integration, Agent
   Reflection & Learning. Included for **`ai-agent` and `embedded-ai-feature`**.
4. **Per-type emphasis block (NEW, all 8 types)** — a short directive: *"This is a {label}. Pay
   special attention to: {patterns}. Only include a pattern if it genuinely applies to what's shown."*
   The model still selects from the full applicable library and keeps the 8-pattern cap; emphasis
   steers, it does not force.

### Per-type emphasis mapping

| type | emphasis patterns |
|---|---|
| `chat-interface` | Conversational UI, Confidence Visualization, Error Recovery, Explainable AI, Session Degradation Prevention |
| `ai-agent` | Intent Preview, Action Audit Trail, Escalation Pathways, Autonomy Spectrum, Agent Status & Monitoring, Agent Reflection & Learning |
| `recommendation-system` | Explainable AI, Feedback Loops, Adaptive Interfaces, Confidence Visualization, Predictive Anticipation |
| `content-generation` | Augmented Creation, Safe Exploration, Human-in-the-Loop, Feedback Loops, Error Recovery |
| `dashboard-analytics` | Confidence Visualization, Explainable AI, Progressive Disclosure, Predictive Anticipation, Feedback Loops |
| `embedded-ai-feature` | Workspace-Native Agent Integration, Contextual Assistance, Ambient Intelligence, Augmented Creation, Progressive Enhancement, Human-in-the-Loop |
| `search-discovery` | Explainable AI, Confidence Visualization, Feedback Loops, Predictive Anticipation, Guided Learning |
| `reports-documents` | Explainable AI, Confidence Visualization, Human-in-the-Loop, Feedback Loops, Progressive Disclosure |
| `general` | *(none — base audit, generic label "an AI-powered product")* |

`productTypeLabels` (the one-sentence label in `buildUserPrompt`) gets the 4 new entries + `general`.

## Files to change (taxonomy is re-declared in several places — all must stay in sync)

1. **`src/types/audit.ts`** — `ProductType` union: drop `'other'`, add the 4 new slugs + `'general'`.
2. **`src/components/audit/productOptions.ts`** — add 4 new picker tiles (id, label, desc, icon,
   examplePatterns aligned to the emphasis above); remove the `other` tile. Icons: pick from the
   existing `@heroicons` set already imported (e.g. ChartBarIcon, PuzzlePieceIcon, MagnifyingGlassIcon,
   DocumentChartBarIcon). `general` is NOT a tile.
3. **`src/lib/audit/prompts.ts`** — the structure change above: new emphasis blocks, the 2 new
   patterns, the 3-group gating, `productTypeLabels` updated, header count → 38.
4. **`src/app/api/audit/classify-product/route.ts`** — `VALID_TYPES` + the inline classifier prompt
   copy updated to the 8 categories; fallback `'other'` → `'general'`.
5. **`src/components/audit/ScreenshotUpload.tsx`** — remove the `option.id === 'other'` full-width
   special-case (line ~369); add the "Not sure? Just upload — we'll detect it" affordance under the
   grid (triggers the existing auto-classify path already wired at lines ~115-133).
6. **Sample screenshots** (`SAMPLE_SCREENSHOTS`) — unaffected (use `chat-interface`).

## Edge cases & decisions

- **`no_ai_surface` unchanged** — it's a model judgment on screenshot content, decoupled from the
  picked type. Marketing/checkout/sign-in surfaces still resolve there correctly.
- **8 tiles + a link** is the picker ceiling; do not add a 9th tile without removing one.
- **Auto-classify remains fire-and-forget** and only runs if the user hasn't picked; its fallback is
  now `general`, not a visible option.
- **No DB migration** — `productType` is a free-text string column; new slugs just start appearing.

## Testing / verification

- `npx tsc --noEmit` clean (the `Record<ProductType, …>` in prompts.ts + `VALID_TYPES` will force
  exhaustive updates — a compile error is the safety net that catches a missed file).
- Unit: `buildSystemPrompt('embedded-ai-feature')` includes Workspace-Native Agent Integration and the
  embedded emphasis; `buildSystemPrompt('dashboard-analytics')` excludes the autonomous-agent block;
  `buildSystemPrompt('general')` == base audit (no emphasis).
- Manual: run one real audit per new type against a representative screenshot; confirm the emphasis
  patterns surface and the audit reads type-appropriate.
- Picker renders 8 tiles + the "Not sure" affordance; no "other" tile; a "Not sure" upload auto-detects.

## Out of scope

- Backfilling historical `productType: 'other'` rows (left as legacy).
- Any change to `no_ai_surface` / `empty_gaps` logic.
- The P1/P2/P3 funnel-instrumentation work (separate, already shipped/specced).
