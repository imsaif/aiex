The nightly Lighthouse CI run failed against the production budget defined in `budget.json`.

**The failing URLs, budgets and measured values are recorded above**, at run time, by `scripts/ci/perf-issue-body.mjs`. They stay readable for the life of this issue. Everything below is the standing investigation checklist.

**Run**: see the "Performance" workflow in the [Actions tab](../../actions/workflows/perf.yml). Note the log expires after ~90 days — if this issue is older than that, the embedded numbers above are the only record.

**LHCI report**: linked above when available (uploaded to LHCI temporary public storage — the link expires after ~7 days, so click through soon).

## Investigate

1. **Check `CLAUDE.md` → Known Issues & Learnings → Performance & Web Vitals**.
   The 13 documented incidents cover most failure modes. Walk the
   "Performance Troubleshooting Checklist" in the same section before forming
   new hypotheses.

2. **Cross-check field data**:
   - Vercel dashboard → Speed Insights tab (real-user p75 mobile/desktop CWV)
   - Microsoft Clarity → URL performance export

3. **Run locally**:
   - `npm run perf-audit` (production)
   - `npm run perf-audit -- --compare` (run-over-run delta)

## Common causes

See the **Performance Troubleshooting Checklist** in `CLAUDE.md` — items
1 through 5 walk through the usual suspects in priority order.

## When you fix it

Add the new lesson to the **Performance & Web Vitals** table in `CLAUDE.md`
before closing this issue. That's the contract — every new failure mode
gets documented so the next investigation starts smarter.

<sub>Auto-opened by `.github/workflows/perf.yml`. Close once resolved.</sub>
