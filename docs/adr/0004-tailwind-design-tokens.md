# 0004 — Tailwind CSS v4 with enforced design tokens

**Status:** Accepted

## Context

A small team needs to ship UI quickly while keeping a visually coherent brand
across dozens of pattern pages, demos, and marketing surfaces. Without a large
team of reviewers to police consistency, the discipline a design system usually
relies on has to come from automation instead.

## Decision

Use **Tailwind CSS v4** (utility-first) on top of a **custom design-token
system**, and **enforce the token contract automatically**: a brand validator
(`scripts/analysis/brand-validator.js`) runs as a Husky pre-commit hook and
*blocks* commits that introduce raw hex colors, off-grid spacing, ad-hoc
z-index, or non-token radii. Details live in `.claude/rules/design-system.md`
and `docs/DESIGN_SYSTEM_ENFORCEMENT.md`.

## Alternatives considered

- **CSS-in-JS (styled-components, Emotion).** Rejected. Runtime cost and weaker
  alignment with React Server Components; Tailwind keeps styling static and fast.
- **Plain CSS / CSS Modules.** Workable, but slower to author and far harder to
  keep consistent without strong conventions and tooling.
- **A prebuilt component kit (MUI, Chakra) as the design foundation.** Rejected
  as the base layer — too opinionated to carry a custom brand cleanly. (Some
  utility libraries like `antd` and `@heroicons/react` are used selectively, but
  the brand layer is our own tokens.)

## Consequences

- **Buys us:** fast UI development; brand consistency enforced by a machine, not
  by reviewer vigilance; styling stays static and SSR-friendly; tokens give a
  single source of truth for color/spacing/scale.
- **Costs us:** a real learning curve and process friction — the pre-commit gate
  will reject non-conforming code, so contributors must work through tokens; a
  migration backlog exists for older code predating the contract (tracked in the
  design-system rule).
</content>
