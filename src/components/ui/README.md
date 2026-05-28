# UI Primitives

Shared components in this directory. Visual reference + token vocabulary at [`/design-system`](../../app/design-system/page.tsx).

## What's here

| Primitive | When to use |
|---|---|
| `Button` | Every clickable action. 3 variants (primary / secondary / outline) × 3 sizes. |
| `Card` | Grouped content. Use the shared chrome: `rounded-card`, `border-border-primary`, `bg-surface-primary`, padding from the spacing scale. |
| `Dialog` | Modal surfaces. Handles backdrop, scroll lock, focus trap, Escape, return-focus, `aria-modal`. |
| `Input` | Form inputs. Label + description + error state + leading/trailing icon slots. `forwardRef` for native ref. |
| `CompanyLogoCarousel` | Logo strip — ambient marquee, 100s default duration, navy filter. |

## The token contract

In new code, never:

- Use raw Tailwind colors (`bg-blue-500`, `text-gray-700`). Use semantic tokens: `bg-surface-primary`, `text-text-secondary`, `border-status-error`, `text-status-success`, etc.
- Use raw z-index (`z-50`). Use `z-dropdown` / `z-sticky` / `z-overlay` / `z-modal` / `z-toast` / `z-tooltip`.
- Use arbitrary radii (`rounded-[12px]`). Use `rounded-input` / `rounded-card` / `rounded-modal` / `rounded-pill` / `rounded-mockup`.
- Use arbitrary shadows. Use `shadow-card` / `shadow-card-hover` / `shadow-elevated` / `shadow-modal` / `shadow-popover`.
- Use arbitrary spacing under 2rem. Use the semantic aliases: `tight` (8px) / `snug` (12px) / `default` (16px) / `loose` (24px) / `roomy` (32px). Layout spacing above 2rem may use arbitrary values.
- Use arbitrary font sizes. Use `.type-display` / `.type-h1` / `.type-h2` / `.type-h3` / `.type-body` / `.type-caption` / `.type-eyebrow`.

If you need a token that doesn't exist, add it to `src/app/globals.css` and `tailwind.config.mjs` before using it.

## Commands

- `npm run brand:check` — validate staged files (runs on pre-commit)
- `npm run brand:check:all` — validate the whole `src/` tree
- `npm run brand:fix` — auto-fix staged violations where possible
- `npm run design-audit:report` — summary report (count + by-rule + top offender files)

## Adding a primitive

A feature component graduates to a primitive when:

1. Three or more features need the same shape.
2. The shape has cross-cutting concerns (accessibility, focus, scroll, keyboard) that warrant centralized handling.
3. The token vocabulary needed already exists. If it doesn't, add tokens first.

Until those three are true, keep the component in its feature folder. Premature primitives are worse than three near-duplicates — duplication is visible, abstraction is invisible.

## Supporting hooks

Lower-level utilities the primitives compose. Reuse before reinventing.

- `useScrollLock(active)` — locks body scroll, preserves scrollbar gutter so layout doesn't shift
- `useClickOutside(ref, handler, active?)` — fires on pointer events outside `ref`; defers one tick so the opener click doesn't immediately close
- `useFocusTrap(ref, active)` — Tab cycles inside the container; restores focus to the previous element on cleanup

## Migration backlog

The primitives above are shipped. Several existing components still inline the same logic and should migrate:

- `PaywallModal`, `WelcomeModal`, `EmailReportModal`, `DownloadPDFModal`, `SearchModal` → `Dialog`
- `SearchBar`, `UnifiedSearchBar`, `AdvancedSearchBar`, `SmartSearchChat` → `Input`
- 9 card-like components (`PatternCard`, `GapCard`, `IssueCard`, `FigmaPromptCard`, `GuideCard`, `LessonStepCard`, `PromptCard`, `SaveResultsCard`, `IssueCard`) → variants of `Card`

Run `npm run design-audit:report` for the live count of remaining token violations.
