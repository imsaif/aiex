---
name: SEO Review
description: Project-specific entrypoint for analyzing Google Search Console exports for aiuxdesign.guide. Auto-triggers on SEO-review phrases. Standardizes the CSV diff analysis, flags known patterns (CTR problems, near-page-1 opportunities, regressions, breakouts), cross-references LHCI perf issues, and points Claude at CLAUDE.md's SEO troubleshooting section before interpretation. Use when the user mentions "check GSC", "SEO review", "GSC export", "search console data", "any SEO improvements", "GSC performance", or pastes a path to a GSC export folder.
---

# SEO Review (project-specific)

This skill is the **first** thing to consult for any SEO performance review on aiuxdesign.guide. The interpretation work is still yours — this skill just eliminates the repetitive data-munging and makes sure you consult the right context before forming hypotheses.

## When to Use This Skill

Trigger phrases (interactive auto-trigger):

- "check GSC", "GSC review", "SEO review", "SEO performance"
- "search console data", "GSC export", "GSC performance"
- "any SEO improvements", "has SEO improved", "SEO numbers"
- User pastes a path containing `Performance-on-Search` or `gsc` or `aiuxseo`

## Required First Actions (do in order)

### 1. Read `CLAUDE.md` → "Known Issues & Learnings" → "SEO Troubleshooting"

Read the documented recurring failure modes and the SEO Troubleshooting Checklist before forming hypotheses. Direction-of-change mistakes (confusing "Last" / "Previous" column order in comparison exports) have burned us before — that section is the tax.

### 2. Confirm export shape with the user

GSC exports come in two shapes. Only the **comparison** shape unlocks the full analysis. Check:

- **Comparison export** — Pages.csv header contains `Last N days Clicks, Previous N days Clicks, ...`. This is what you want. User enables it in GSC by toggling "Compare" → "Previous period."
- **Single-period export** — Pages.csv header is `Top pages, Clicks, Impressions, CTR, Position`. Workable but won't surface deltas, regressions, or breakouts.

If the user only has a single-period export, ask for the comparison version before proceeding. The single-period view cannot answer "did the recent work help?" — that's literally what comparison is for.

### 3. Run the standardized analysis

```bash
node .claude/skills/seo-review/analyze.js <path-to-gsc-export-folder>
```

The script outputs a markdown report with:

- Headline totals (Clicks/Impressions/CTR deltas)
- 🚀 Breakouts (3x+ click growth)
- 🎯 CTR problems (page-1 ranked but <1% CTR — rewrite candidates)
- 📈 Near-page-1 opportunities (pos 11-25 with >500 imp — content depth / backlink candidates)
- ⚠️ Regressions (position dropped 3+ OR clicks dropped ≥50%)
- Top 15 pages by impressions with deltas
- New queries (≥20 imp, not in prior period)
- Fading queries (prior ≥50 imp, dropped ≥50%)
- Device split

**The script does NOT make recommendations.** Pattern flags only. Interpretation is your job.

### 4. Cross-reference LHCI perf issues

```bash
gh issue list --label performance --state open --limit 10
```

If any flagged CTR-problem or near-page-1-opportunity page is also one of the URLs breaching LHCI budget, Google's Core Web Vitals ranking signal is part of the problem. Mention this overlap explicitly — CWV fixes compound with content fixes.

Current LHCI audit URLs (defined in `lighthouserc.json`):

- `/`, `/audit`, `/news`, `/agent-readability-audit-kit`
- `/patterns/conversational-ui`, `/patterns/graceful-handoff`, `/patterns/explainable-ai`, `/patterns/progressive-disclosure`

### 5. Read the user's stated goal before interpreting

SEO "no improvement" can mean any of:
- Indexed page count not growing
- Impressions flat
- Clicks flat
- Average position stuck
- Coverage errors not clearing
- Specific query not ranking

The diagnostic path is different for each. Ask if it's not explicit.

## Interpretation guardrails

### Direction-of-change tax
In comparison exports, columns are ordered `Last N days, Previous N days` — i.e., **recent (newer) comes first**, **older second**. This is counterintuitive. `analyze.js` normalizes to chronological `prev → last` direction in output, but when reading raw CSVs yourself, verify column meaning from the header before reasoning about deltas.

### Position number direction
Lower position = better ranking. A page moving from pos 22 → 7 is a 15-position **improvement** even though the number went down. `analyze.js` computes `lastPos - prevPos` and reports `+` as "got worse."

### CTR is mechanically inversely correlated with impressions at page-2
When impressions grow because Google promotes pages from position 30 → 18 (page 3 → page 2), CTR mathematically drops — because page-2 CTR is ~1-3% vs. page-1 CTR of 5-30%. A dropping aggregate CTR doesn't automatically mean a CTR problem; check per-page.

### Don't prescribe "more content" as a reflex
If "discovered not indexed" URL count is high (check GSC Coverage separately), adding more URLs likely dilutes crawl budget. Validate indexation headroom before recommending new content.

## What this skill will NOT do

- **Run autonomously on a schedule.** Review cadence is weekly-to-monthly and judgment-heavy. Automating it produces reports nobody reads.
- **Pull GSC data via API.** OAuth setup overhead > saving 30 seconds of manual CSV export.
- **Make SEO changes autonomously.** Meta rewrites, internal linking, schema additions all require human sign-off — the cost of a bad meta rewrite at scale is measured in weeks of degraded CTR.
- **Generate recommendations from templates.** Reasoning on the specific data beats templated suggestions.

## Recommended cadence

- **Weekly:** skim the analysis output for regressions and breakouts
- **Biweekly:** deep dive on CTR problems (pick top 3, rewrite meta)
- **Monthly:** near-page-1 opportunity audit (pick one, commit to content depth or linking investment)
- **Quarterly:** revisit strategy — are impression/click trends up vs. same-period-last-year?

## After a review, document what you changed

If the review leads to edits (meta rewrites, schema additions, content depth work), record them in the relevant session's `docs/SESSION-LOG.md` `/save` notes so the next review has a baseline. Pattern we use:
- what changed + file path
- which pages/queries it targeted
- what success looks like (imp/click/pos delta at N days)
- when to re-check
