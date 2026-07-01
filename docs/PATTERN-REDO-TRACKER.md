# Pattern Redo Tracker

Living tracker for the two-layer effort to redo every pattern page, sequenced by **Google Search Console impressions** (highest-traffic first). Not auto-loaded — read/update when working the redo.

_Last updated: 2026-07-01 (crisis-detection-escalation done — all 5 flagged demos rebuilt; Layer 2 complete)._

## Layer 1 — New page structure (value-forward)

Each pattern's `index.ts` gains `judgmentCall` (a named trap + explainWhen/dontWhen), ranked `takeaways`, a paste-ready `installPrompt`, and `hideFAQ: true`.

**Progress: 31 / 38 done — all live in production (merged via PR #40).**

Check status anytime:
```bash
for d in src/data/patterns/patterns/*/; do grep -q judgmentCall "$d/index.ts" && echo "DONE  $(basename $d)" || echo "TODO  $(basename $d)"; done | sort
```

### Remaining (7), by GSC impressions
| # | Pattern | Impressions |
|---|---|---|
| 1 | safe-exploration | 235 |
| 2 | session-degradation-prevention | 176 |
| 3 | guided-learning | 159 |
| 4 | plan-summary | 106 |
| 5 | augmented-creation | 64 |
| 6 | vulnerable-user-protection | 14 |
| 7 | autonomy-spectrum | ~0 (not in export) |

## Layer 2 — Interactive demo rebuilds

Rebuild the demo to **embody its trap** in **plain language for designers/founders** (no dev jargon — see [[feedback_demos_non_technical_audience]]), dead-click-safe (see [[feedback_demos_no_dead_clicks]]), tokenized, accessible, readable type. Guided 2-step trap→resolution format.

A demo audit flagged **5 demos** that were still teaching the *anti-pattern*. (Many other demos were already rebuilt/tokenized during the migration: feedback-loops, context-switching, adaptive-interfaces, privacy-first-design, confidence-visualization + predictive-anticipation/agent-status-monitoring/human-in-the-loop tokenized.)

**Progress: 5 / 5 flagged demos done. 🎉** (responsible-ai + universal-access live via PR #43; collaborative-ai + ambient-intelligence in PR #45; crisis-detection-escalation committed on branch, folds into the PR #45 branch.)

| Pattern | Impressions | Status |
|---|---|---|
| ambient-intelligence | 551 | ✅ PR #45 (surveillance hum vs. ambient that shows its work) |
| crisis-detection-escalation | 315 | ✅ committed on branch (smoke alarm wired to nothing vs. a system that stays; verified-resource resolution, soft depiction) |
| collaborative-ai | 644 | ✅ PR #45 (team yes-man vs real collaborator) |
| universal-access-patterns | 315 | ✅ shipped (PR #43) |
| responsible-ai-design | — | ✅ shipped (PR #43) |

### Demo rebuild recipe (apply to each)
Guided 2-step trap→resolution story; plain language (no dev jargon); concrete human scenario; dead-click-safe (inert mockups `pointer-events-none`, only `<Button>`s clickable); tokenized (`brand:check` 0); readable type (lead `text-lg`, body `text-base`); real buttons + `aria-live`; regenerate paired `code-examples.ts`; verify with a scoped Playwright pass on the live page; commit component + code-examples only (leave anti-manipulation).

## Held / parked
- `anti-manipulation-safeguards/index.ts` — structure edit written but **held**: the new fields read "protect user from the product's dark patterns" while the existing body+demo read "jailbreak/bad-actor detection." Needs a coherence decision (realign / split / accept both) before committing. Tracked as a separate task.

## Working setup
- Demo rebuilds happen on branch `demo-rebuilds-embody-traps` in an isolated git worktree (`.claude/worktrees/demo-rebuilds`, dev on :3001) so they don't collide with parallel work in the main folder.
