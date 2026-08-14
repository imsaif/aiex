---
paths:
  - "src/config/seo.ts"
  - "src/app/sitemap.ts"
  - "src/app/robots.ts"
  - "src/app/sitemap.xml/**"
---

# SEO Troubleshooting

> Note: GSC-analysis work is usually phrase-triggered via the `.claude/skills/seo-review/` skill (auto-triggers on SEO-review phrases), not by editing files. This rule loads when touching SEO config/sitemap/robots; the skill covers the rest.

Recurring failure modes from past SEO review sessions. Consult this before forming hypotheses.

| Issue | Date | Solution |
|-------|------|----------|
| **robots.txt wildcard blocked our own sitemap for 3.5 months** | Aug 2026 | `robots.ts` carried `Disallow: /*.xml$` (and `/*.json$`), aimed at build artifacts. That pattern matches `/sitemap.xml` itself, so GSC showed **"Couldn't fetch"** with a last-read of **Apr 30** while the sitemap served 350 URLs to curl just fine. Google had been working from the 138 URLs it read in April: every skill, course, and news page shipped since then was invisible. The tell was sitting in the same GSC table as a natural control: `/sitemap-images` (no `.xml` extension, same host, same day) read **Success**. **Diagnostic order: GSC → Sitemaps → read the Status and Last-read columns BEFORE theorising about indexation.** A sitemap that curls fine can still be robots-blocked, because Google honours robots.txt when fetching sitemaps. Never use extension wildcards in robots disallow lists; `/.next/` and `/api/` already cover build output. Both the `*` and `Googlebot` groups must change together. |
| **"Crawled - currently not indexed" is not a thin-content signal by default** | Aug 2026 | Seven URLs sat in this bucket; the instinct was "thin pages". Measured: the rejected pattern pages were 28-36 KB of content while the *smallest* patterns (20 KB: explainable-ai, progressive-disclosure, multimodal-interaction) were indexed fine. Depth was ruled out. What the seven shared was topic — four of six were the AI-safety cluster (escalation-pathways, crisis-detection-escalation, vulnerable-user-protection, anti-manipulation-safeguards), all low search demand on a low-authority domain. **Measure content size against indexed peers before accepting a thinness hypothesis.** Fix is authority and internal linking from pages that already rank, not rewriting the page. Also: the Pages report is **filtered by the sitemap in the top dropdown** — switch to "All known pages" before quoting a count. Don't press VALIDATE FIX until something actually changed; a failed validation resets the counter. |
| **"No SEO improvements" framing conflates 4 different metrics** | Apr 2026 | "Improvements" can mean: (a) indexed page count, (b) impressions, (c) clicks, (d) average position. The diagnostic path differs for each. Always ask which one the user means. Apr 22 investigation found impressions +35% / clicks +4% over 28d — the "no improvement" read came from watching clicks only, missing that the real problem was a CTR-collapse downstream of successful ranking growth. |
| **Direction-of-change tax on GSC comparison exports** | Apr 2026 | Comparison CSVs order columns as `Last N days Clicks, Previous N days Clicks, ...` — recent-first, older-second. Counterintuitive. `analyze.js` in `.claude/skills/seo-review/` normalizes this to chronological `prev → last` output. When reading raw CSVs by hand, verify column meaning from the header before reasoning about deltas. Apr 22: misread direction on the (1) export, concluded "no growth"; re-checking on the (2) export with clear headers flipped the entire narrative. |
| **CTR appears to drop when impressions grow faster than clicks** | Apr 2026 | When page-2 URLs get promoted to pos 18-22 (e.g., from 28 → 18 on conversational-ui), they add impressions at naturally-lower CTR positions, dragging aggregate CTR down even if per-page CTR is fine. A dropping aggregate CTR isn't a red flag on its own — check per-page to see if specific pages genuinely under-convert their ranking. |
| **Page-1 rankings with <1% CTR are the real leak** | Apr 2026 | Positions 1-10 should have 2-30% CTR depending on rank. If a page sits at pos 5-7 with 0.1-0.5% CTR across 1000+ impressions, the title/description isn't winning against competitors in SERP. Rewrite meta. The Apr 22 skill flagged 13 such pages; manual review caught only 6. Use the skill first. |
| **"Discovered - not indexed" isn't always a bug** | Apr 2026 | Google holds ~30-50% of discovered URLs out of the index for low-authority sites — not a technical problem, a priority signal. 77 such URLs per Apr 16 coverage. Fixing on-page SEO won't move these; backlinks, internal linking, and content quality improvements do. Stop shipping new content until this number decreases. |
| **Intent mismatch on high-impression queries** | Apr 2026 | "privacy first ai" at pos 22 (330 imp, 0 clicks) vs. our "Privacy-First AI Design — Data Protection & User Consent" title. Users searching "privacy first ai" want product recommendations (ProtonAI, DuckDuckGo's AI) or a checklist, not a design-pattern taxonomy. Match query intent, not keyword presence. |
| **CWV field data is a ranking signal on a 28-day lag** | Apr 2026 | Google uses rolling 28-day p75 field Core Web Vitals. After fixing perf regressions (e.g., the Apr 22 `/news` ISR + audit-kit framer-motion + lazy chat-previews fixes), expect ranking signal recovery in 2-3 weeks, not immediately. |
| **Guide lesson queries have tiny search volume** | Apr 2026 | "Claude for designers course" = 62 imp/month. "Claude code for designers course" = 36 imp/month. Even winning these queries cleanly generates <100 clicks/month per guide. Demand ceiling is a distribution problem, not an SEO problem. Stop optimizing meta on guide index pages; ship the lessons and let individual long-tail queries carry them. |

## SEO Troubleshooting Checklist

When GSC performance "isn't improving":

0. **Check the plumbing before the content.** GSC → Sitemaps: is the sitemap Status "Success", and is Last-read recent? A stale or failed read means Google is ranking an old snapshot of the site and no amount of content or meta work will show up. See the Aug 2026 robots.txt entry above.

1. **Run the skill first**: `node .claude/skills/seo-review/analyze.js <folder>` against a GSC comparison export (not a plain single-period export). The skill catches patterns humans miss.

2. **Classify the problem**: indexation (Coverage report) vs. ranking (avg position) vs. CTR (imp/clicks ratio per page) vs. demand (low query volume). Each has a different playbook.

3. **Cross-check CWV**: a page with a ranking regression may be caught in the 28-day CWV window from a perf issue. Check `gh issue list --label performance --state open` to see if the page is in the LHCI breach list.

4. **Check timelines honestly**:
   - Sitemap → crawl: 1-7 days
   - First crawl → indexation: 7-30 days (often longer for thin pages)
   - Indexation → stable ranking: 4-12 weeks of ranking jiggle
   - Content refresh → re-ranking: 2-8 weeks
   - Meta rewrite → visible CTR delta: 14-21 days

5. **If stuck on "discovered not indexed"**: the fix is authority signals (backlinks, internal linking from high-authority pages, original cite-able research) and content quality, not more URLs.

## SEO Monitoring Setup

- **GSC Performance export (manual, weekly or biweekly)** — Set to comparison mode (toggle "Compare" → "Previous period") before exporting. Drop the folder path to Claude and invoke `/seo-review` or just mention "check GSC".
- **GSC Coverage report (monthly)** — Check indexed page count, "discovered not indexed" bucket, "crawled not indexed" bucket. Manual review in GSC UI.
- **LHCI nightly + Clarity field data** — Automated. See `.claude/rules/performance.md`.

**Claude Code skill for SEO work**: this repo has `.claude/skills/seo-review/` which standardizes the GSC comparison CSV diff analysis. Script at `analyze.js`, entrypoint at `SKILL.md`. Auto-triggers on SEO-review phrases. Pairs with Addy Osmani's generic `seo` skill (installed in `~/.claude/skills/` with the other web-quality skills) for keyword research and on-page SEO best practices.
