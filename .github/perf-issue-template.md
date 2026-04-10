The nightly Lighthouse CI run failed against the production budget defined in `budget.json`.

**Run**: see the "Performance" workflow in the [Actions tab](../../actions/workflows/perf.yml) for the failing URL(s) and the specific assertion that breached.

**LHCI report**: linked in the workflow run summary (uploaded to LHCI temporary public storage — link expires after ~7 days, so click through soon).

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
