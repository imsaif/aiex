# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 app (React 19, TypeScript, Tailwind CSS v4) showcasing **38 AI design patterns** across 8 categories, each with code examples, interactive demos, real-world examples, and design guidance. Plus a newsletter, a done-for-you audit service, and a paid audit funnel. Deployed on Vercel at **aiuxdesign.guide**.

## Core Development Commands

- `npm run dev` - Start dev server with Turbo (http://localhost:3000)
- `npm run build` - Full production build (⚠️ don't run while the dev server is up — use `npx tsc --noEmit` to type-check instead)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` / `npm run test:patterns` / `npm run test:components` - Tests (see testing rule)

## Critical always-on rules

- **Working directory**: stay in the current directory after `/clear`; don't `cd` unless asked. Use absolute paths.
- **Type-check, don't build, during dev**: `npm run build` clobbers `.next/` and breaks a running dev server — use `npx tsc --noEmit`.
- **Design tokens are enforced**: `npm run brand:check` runs pre-commit (husky) and blocks new raw-color/z-index/radius/spacing/hex violations. Follow the token contract for any UI work.
- **Code style**: reuse existing components and the design system; TypeScript strict; validate data against Zod schemas; proper error boundaries and loading states.
- **`avoid-em-dashes`** in any user-facing copy.

## Detailed guidance lives in `.claude/rules/` (path-scoped, loads on demand)

This file is intentionally lean. The detail loads automatically when you open matching files:

- **`.claude/rules/architecture.md`** (src/**, scripts/**) — architecture, directory structure, data flow, usage tracking, agent/automation tooling
- **`.claude/rules/design-system.md`** (*.tsx, *.css, tailwind config) — token contract, primitives, enforcement, migration backlog, accessibility
- **`.claude/rules/patterns.md`** (src/data/patterns/**, scripts/generators/**) — pattern list/categories, structure, dev workflow, generators
- **`.claude/rules/testing.md`** (test files) — coverage, tooling, test locations, requirements
- **`.claude/rules/performance.md`** (tsx, app/**, public/**, next.config, budget.json) — build/bundle, **the Web Vitals incident table**, troubleshooting + monitoring
- **`.claude/rules/newsletter-and-infra.md`** (api/**, news/**, scripts/newsletter/**, prisma/**) — newsletter system, cron setup, troubleshooting, deployment/infra incidents
- **`.claude/rules/seo.md`** (seo config, sitemap, robots) — SEO troubleshooting + GSC playbook (also via `/seo-review` skill)

When you hit a new recurring issue, add it to the relevant rule file (each table is a living incident log).

## Current Work Session

_No active pattern. Set one when you start focused pattern work._

## Session History

Full per-session history lives in **`docs/SESSION-LOG.md`** (not auto-loaded, to keep this file lean). `/save` appends a terse summary there. Read it only when you need historical context.
