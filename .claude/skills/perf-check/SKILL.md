---
name: Performance Check
description: Project-specific performance investigation entrypoint for aiuxdesign.guide. Auto-triggers on perf-related phrases and points Claude at CLAUDE.md's documented incidents and the LHCI workflow before delegating to generic perf skills. Use when the user mentions "site is slow", "performance regression", "LCP", "CLS", "INP", "Core Web Vitals", "lighthouse score", "clarity numbers", or "speed insights".
---

# Performance Check (project-specific)

This skill is the **first** thing to consult during any performance investigation on the aiuxdesign.guide project. After running through the steps below, fall back to Addy Osmani's generic skills (`performance`, `core-web-vitals`, `web-quality-audit`) for general optimization knowledge.

## When to Use This Skill

Trigger phrases (interactive auto-trigger):

- "site is slow", "performance regression", "perf issue", "feels slow"
- "LCP", "CLS", "INP", "TBT", "Core Web Vitals", "Web Vitals"
- "lighthouse score", "lighthouse audit", "LHCI"
- "clarity numbers", "clarity dashboard", "speed insights"
- "carousel video", "image is too big" (when discussed in a perf context)
- "performance budget", "performance regression"

## Required First Actions (do in order)

### 1. Read `CLAUDE.md` → "Known Issues & Learnings" → "Performance & Web Vitals"

The 13 documented incidents in that table cover most failure modes for this codebase. Use them as the **first hypothesis pool**, not the last resort. Walk the "Performance Troubleshooting Checklist" in the same section before forming new hypotheses.

### 2. Check the LHCI workflow status

- Look at the latest run of `.github/workflows/perf.yml` (`gh run list --workflow=perf.yml --limit 5`)
- Check for any open GitHub issue tagged `performance` (`gh issue list --label performance --state open`)
- The issue body links to the LHCI report (LHCI temporary public storage) and tells you which URL+metric breached the budget defined in `budget.json`

### 3. Check `perf-audit-log.json` staleness

- If the most recent local run is more than 7 days old, suggest running `npm run perf-audit` (production) before forming hypotheses
- If the user is investigating a specific URL, run the script targeting just that URL

### 4. Cross-check lab vs field

- **Lab**: GitHub Actions LHCI artifact + `perf-audit-log.json`
- **Field**: Vercel dashboard → Speed Insights tab + Microsoft Clarity URL performance export
- The Apr 10 incident was a lab-vs-field gap: Lighthouse showed 98, Clarity showed 49. **Always check both** before declaring a fix done.
- Lab green + field red → real-user issue (slow networks, mobile devices, font rendering variance)
- Both red → structural issue, easier to reproduce locally

### 5. Then delegate to Addy Osmani's generic skills

Once you've ruled out (or confirmed) the documented incidents, fall back to:

- `performance` — loading and runtime performance optimization
- `core-web-vitals` — LCP/INP/CLS deep dives
- `web-quality-audit` — comprehensive review across all categories

These skills are installed at `~/.claude/skills/` and auto-trigger on the same phrases.

## Project-Specific Anti-Patterns

**Never do these on aiuxdesign.guide** (each one is a real incident — see the Performance & Web Vitals table for the receipt):

- ❌ Don't add `priority` to `<Image>` or `OptimizedMedia` for below-the-fold content. The Apr 10 carousel incident was caused by exactly this — `priority={current === 0}` mis-promoted a 14MB carousel video to LCP candidate.
- ❌ Don't add manual `<link rel="preload">` tags for fonts that `next/font/local` is already preloading via `preload: true`. Triggers "preloaded but not used" warnings.
- ❌ Don't set `adjustFontFallback: false` on `next/font` config. It causes site-wide CLS because the fallback font's metrics don't match Satoshi. Use `'Arial'` instead so Next generates a size-adjusted fallback.
- ❌ Don't put Lighthouse / puppeteer / chromium in a Vercel cron API route. The 60s Hobby timeout is already tight for the newsletter cron. Use the GitHub Action (`.github/workflows/perf.yml`) instead.
- ❌ Don't return `<ClientComponent />` from a server `page.tsx` with no SSR'd hero content. Real users see catastrophic LCP because nothing renders until JS parses + framer-motion hydrates. The agent-readability-audit-kit page is the canonical example (106s real-user LCP).
- ❌ Don't import framer-motion into a homepage-reachable component without first measuring bundle impact via `npm run build:analyze`. One transitive import pulls the full ~85KB library into the critical path.
- ❌ Don't commit a video > 2MB or an image > 500KB to `public/images/examples/` without running it through the ffmpeg/sharp pipeline first (see Issue #6 in the Performance & Web Vitals table for the exact commands).
- ❌ Don't disable Microsoft Clarity in a way that lets it fire on `localhost` or preview deploys. Both `process.env.NODE_ENV === 'production'` AND a hostname check are required.

## When You Fix a NEW Issue

After landing the fix, **add the new lesson to the Performance & Web Vitals table in `CLAUDE.md`** with: Issue, Date, Solution. This is the contract — every new failure mode gets documented so the next investigation starts smarter. Without this, the table will go stale and we'll keep hitting the same problems.

Use the existing entries as a template — be specific about the file path, the symptom, and the exact fix command/code change.

## Where Things Live

- **Documented incidents**: `CLAUDE.md` → "Known Issues & Learnings" → "Performance & Web Vitals"
- **Daily monitor**: `.github/workflows/perf.yml` (runs at 04:00 UTC)
- **Budget thresholds**: `budget.json` (repo root)
- **LHCI config**: `lighthouserc.json` (repo root)
- **Local audit script**: `scripts/analysis/perf-audit.js` (`npm run perf-audit`)
- **Local audit history**: `perf-audit-log.json` (gitignored)
- **Generic perf skills**: `~/.claude/skills/{performance,core-web-vitals,web-quality-audit,...}` (Addy Osmani's collection)
- **Field data dashboards**: Vercel → Speed Insights tab; Microsoft Clarity → URL performance export
