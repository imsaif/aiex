---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "src/app/globals.css"
  - "tailwind.config.mjs"
---

# Design System

Live reference at [`/design-system`](src/app/design-system/page.tsx) on aiux. Contributor docs at [`src/components/ui/README.md`](src/components/ui/README.md).

## Token contract (read before writing any UI)

Tokens live in `src/app/globals.css` and are exposed as Tailwind utilities through `tailwind.config.mjs`. **In new code, never:**

- Use raw Tailwind colors (`bg-blue-500`, `text-gray-700`) → use semantic tokens (`bg-surface-primary`, `text-text-secondary`, `text-status-success`, `border-status-error`)
- Use raw z-index (`z-50`) → use `z-dropdown` / `z-sticky` / `z-overlay` / `z-modal` / `z-toast` / `z-tooltip`
- Use arbitrary radii (`rounded-[12px]`) → use `rounded-input` / `rounded-card` / `rounded-modal` / `rounded-pill` / `rounded-mockup`
- Use arbitrary shadows → use `shadow-card` / `shadow-card-hover` / `shadow-elevated` / `shadow-modal` / `shadow-popover`
- Use component-internal arbitrary spacing under 2rem → use the semantic aliases `tight` (8px) / `snug` (12px) / `default` (16px) / `loose` (24px) / `roomy` (32px). Layout-level spacing above 2rem may use arbitrary values.
- Use arbitrary font sizes → use the `.type-*` classes (`.type-display`, `.type-h1`–`.type-h3`, `.type-body`, `.type-caption`, `.type-eyebrow`)

If you need a token that doesn't exist, **add it to `globals.css` and `tailwind.config.mjs` first**, then use it. Do not introduce one-off arbitrary values.

## Shipped primitives (`src/components/ui/`)

- `Button` — 3 variants × 3 sizes
- `Card` — base chrome (rounded-card / border / surface / spacing)
- `Dialog` — modal surface; handles backdrop, scroll lock, focus trap, Escape, return-focus, `aria-modal`
- `Input` — label + description + error + leading/trailing icon, `forwardRef` for native ref
- `CompanyLogoCarousel` — ambient logo marquee, 100s default, navy filter

Supporting hooks in `src/hooks/`: `useScrollLock`, `useClickOutside`, `useFocusTrap`.

## Enforcement

- **Pre-commit** — `npm run brand:check` runs on staged files via husky. Blocks commits with new raw-color / raw-z / arbitrary-radius / arbitrary-spacing / hardcoded-hex violations.
- **Whole-repo audit** — `npm run design-audit:report` prints summary (count + by-rule + top offender files). Does not block. Use to track migration progress.
- **Auto-fix** — `npm run brand:fix` rewrites hex → token where the validator can map them.

Other design-consistency commands:
- `npm run design-audit` - Scan for hardcoded colors and design token violations (runs on every commit)
- `npm run design-analyze` - Analyze design consistency
- `npm run design-report` - Generate design consistency report
- `npm run design-style-guide` - Generate style guide
- `npm run design-fix` / `npm run design-fix-all` - Fix design issues
- **See** [Design System Enforcement](../../docs/DESIGN_SYSTEM_ENFORCEMENT.md) for automatic pre-commit validation

## Gotcha: `brand:check` scans whole staged files, not changed lines

Touching one line of a pre-token component stages the whole file and blocks the
commit on **every** pre-existing violation in it. This has now cost two
sessions: 2026-08-31 shipped a commit with `--no-verify` after 20 violations in
`ScreenshotUpload.tsx` / `FullPageResults.tsx`, and 2026-09-04 a two-line change
to lesson headings forced migrating 19 raw greys in `LessonRenderer.tsx`.

**Before planning a small edit to a legacy file, check what it will drag in:**

```bash
npx eslint --no-eslintrc >/dev/null 2>&1; npm run brand:check 2>&1 | grep -c '✗'
```

Then choose deliberately: migrate the file (and say so, it is real scope), or
achieve the change without touching it. `--no-verify` leaves the debt and the
next person hits it again.

The validator and its allowlist live in `scripts/analysis/brand-validator.js`. Documented exceptions (grain texture, news strip Today pill, macOS browser-chrome traffic-light hexes) are kept narrow; do not broaden the allowlist when fixing a violation — fix the violation instead.

## Migration backlog (don't "fix" these casually)

The codebase has ~1,247 critical violations concentrated in pre-token code. They migrate incrementally — do not bulk-rewrite without scoping. Live counts via `npm run design-audit:report`. The five existing modals (`PaywallModal`, `WelcomeModal`, `EmailReportModal`, `DownloadPDFModal`, `SearchModal`) and four search inputs (`SearchBar`, `UnifiedSearchBar`, `AdvancedSearchBar`, `SmartSearchChat`) should migrate to the `Dialog` and `Input` primitives respectively, but only as part of an intentional pass — not as a side-effect of touching the file.

## Accessibility (applies to all UI)

- Body/informational text: use `.type-*` classes or at least `text-sm`; avoid `text-xs` for content that conveys meaning.
- Color contrast: `text-text-tertiary` is borderline in light mode and FAILS WCAG AA in dark mode (~4.0:1) — use `text-text-secondary` (≈7:1 dark, ≈13:1 light) or `text-text-primary` for anything that must be read.
- The fixed `status-*` colors (`success #10b981`, `warning #f59e0b`) FAIL contrast as TEXT. Use them for tinted backgrounds/borders/dots only; keep the text itself `text-text-primary`/`text-text-secondary`, and never rely on color alone to convey meaning (pair with a label/icon).

## Motion: a click should never snap

**Rule: any click that changes what is on screen gets a transition. No exceptions for "it is just a page change".**

An instant swap gives the reader no sense of having gone anywhere. The old view is simply gone and a new one is in its place, which reads as a glitch rather than as navigation, and it costs the reader a moment of re-orientation every single time. This was reported on the guides rail, where clicking through lessons replaced the whole page in one frame.

How it is handled here:

- **Route changes** are covered globally. `experimental.viewTransition` in `next.config.mjs` wraps client-side navigation in the browser's View Transitions API, and `::view-transition-old(root)` / `::view-transition-new(root)` in `globals.css` give it its shape: out in 120ms, in over 180ms with a 4px rise. Nothing per-page is needed, and nothing should re-implement it locally.
- **In-place changes** (tabs, filters, accordions, expanding rows, showing results) get their own transition on the property that actually changes. Prefer `transition-colors`, `transition-opacity` or a height/`grid-template-rows` transition over a bare conditional render that pops.
- **Never animate `display`.** Toggle with `hidden`/`el.hidden` and transition opacity or transform instead, or the transition silently does nothing.

Timing: 120-200ms for anything a reader triggers repeatedly, and ease-out so it settles rather than decelerating into place. Longer than ~250ms and a reader clicking through six lessons starts waiting for the UI.

**Always pair it with `@media (prefers-reduced-motion: reduce)`.** A transition the reader did not ask for is worse than no transition, and this is a WCAG requirement, not a preference. The existing block in `globals.css` covers the route transition; new motion adds itself to that pattern.
