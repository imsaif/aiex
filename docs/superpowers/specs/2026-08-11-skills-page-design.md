# /skills — free AI UX skills directory

**Date:** 2026-08-11
**Status:** Approved (brainstormed with user; "full page, discoverability is the point")

## Purpose

A public, nav-level directory where anyone can browse the 38 pattern skills and install any of them with one copied command, free, no save/checkout ceremony. Modeled on skills.sh's directory anatomy, adapted to a single publisher. Discoverability is the point: a landable, rankable, shareable surface announcing that the skills exist.

The existing save-card → pack → checkout → dashboard flow is untouched and coexists; it serves curated multi-skill bundles (and audit bundling). The new page serves the grab-one-now visitor and search/social traffic.

## Route and nav

- New page at `/skills` (App Router `page.tsx`). It coexists with the existing raw-file route `/skills/[slug]/route.ts` (`/skills/aiux-<slug>.md`), which stays the machine-readable source the install command curls.
- Navbar (desktop and mobile): add **Skills** between Patterns and Courses.

## Page anatomy (top to bottom)

1. **Hero.** Headline in the spirit of "38 free Claude Code skills, one per AI UX pattern" (count rendered from the registry, not hardcoded). Subline explains what a skill is in one sentence (persistent design guidance that triggers when the work matches). A copy box shows the generic install command form. No email gate, no accounts.
2. **Category filter chips.** One chip per pattern category plus "All". Filtering is client-side; default shows all 38 grouped in a stable, curated order (category order from the existing category registry, alphabetical within).
3. **Skills table.** One row per pattern skill:
   - Number (stable rank within current filter)
   - Skill name (`aiux-<slug>`) and pattern title, linking to `/patterns/<slug>` for depth (no per-skill HTML pages — pattern pages already rank; don't compete with them)
   - Category chip
   - The symptom-first trigger line (`skillDescription`), truncated with title attribute for full text
   - **Used by** cell: 3–4 product logos from that pattern's real-world examples (text name fallback when no logo asset matches)
   - **Copy install** button
4. **Footer cross-links.** "Want several? Save patterns as you browse and download them as one pack" → existing flow. Link to the audit as the way to find which patterns your product needs.

## Install command (what Copy puts on the clipboard)

One line, per skill:

```
mkdir -p .claude/skills/aiux-<slug> && curl -fsSL https://aiuxdesign.guide/skills/aiux-<slug>.md -o .claude/skills/aiux-<slug>/SKILL.md
```

Built by a small pure helper (`skillInstallCommand(pattern)`) in `src/lib/skills/` next to the existing composers, unit-tested. The hero shows the generic form of the same command.

## Data flow

Everything derives from the existing pattern registry at build/render time; no new data files.

- Slug + skill name: `skillName(pattern)` (existing)
- Trigger line: `pattern.content.skillDescription` (authored 2026-08-11 for all 38; fall back to `skillTrigger()` behavior if ever absent)
- Category: existing category registry
- **Used by**: derive product names from `pattern.content.examples[].title` via a small mapper (`exampleProducts(pattern)`) that extracts the product name and matches it against the self-hosted logo assets in `public/images/logos/` (simple-icons set). Unmatched products render as text. Mapper is pure and unit-tested; unmatched-logo cases must degrade to text, never break the row.

Adding a new pattern automatically adds its row.

## Visual design

Reuse the existing design system exclusively: token contract (enforced by `brand:check`), existing chip/card/table primitives where present, Satoshi type stack. The skills.sh reference is structural (hero + command + ranked table), not visual; no ASCII art, no dark-terminal cosplay. Follows the site's existing look. Logos get explicit width/height attributes (CSS-resilience rule).

## Tracking

Copy clicks fire a Microsoft Clarity custom event (`skill-copy`, with the slug). No backend, no schema change. If real usage ranking is ever wanted, this event history is the seed.

## SEO

- Page metadata (title/description) targeting "Claude Code skills for AI UX" and adjacent queries
- `ItemList` structured data listing the 38 skills
- Sitemap entry for `/skills`
- The raw `.md` routes stay `noindex`-irrelevant (they're plain text fetched by tools)

## Error handling

The page is fully static data from the registry; the only runtime failure modes are clipboard write (show a brief "copied"/"copy failed — select manually" state with the command revealed in a `<pre>`) and missing logo assets (text fallback, covered by the mapper contract).

## Testing

- Unit: `skillInstallCommand()` output shape; `exampleProducts()` extraction + logo matching + text fallback
- Component: table renders 38 rows from registry fixtures; filter chips filter; copy button writes to clipboard (mocked) and fires the Clarity event (mocked)
- No new e2e; existing suite untouched

## Out of scope (explicitly)

- Per-skill HTML pages
- Install counts / leaderboard ordering (revisit only with real event data)
- GitHub repo + skills.sh ecosystem listing (Approach B — separate future session)
- Any change to the save/pack/checkout/dashboard flow
- Copy variants (Cursor/other agents) — Claude Code only for now
