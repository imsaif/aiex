# Tech Stack

A quick reference for "what's our stack?" This is the **what**; for the **why**
behind each choice (and the alternatives we weighed), see the
[Architecture Decision Records](./adr/README.md).

## One-liner

> A Next.js 15 / React 19 / TypeScript app, styled with Tailwind v4, deployed on
> Vercel. A content-driven site teaching ~36 AI design patterns, plus a
> newsletter and a paid audit funnel, backed by Postgres (Prisma + Neon).

## Core stack

| Layer       | Choice                                          | Why (ADR)                              |
|-------------|-------------------------------------------------|----------------------------------------|
| Framework   | Next.js 15 (App Router, Turbopack in dev)       | [0001](./adr/0001-nextjs-app-router.md) |
| UI          | React 19                                        | [0001](./adr/0001-nextjs-app-router.md) |
| Language    | TypeScript 5 (strict)                           | —                                      |
| Styling     | Tailwind CSS v4 + enforced design tokens        | [0004](./adr/0004-tailwind-design-tokens.md) |
| Hosting     | Vercel (`aiuxdesign.guide`)                     | [0003](./adr/0003-vercel-hosting.md)   |

## Supporting cast

| Concern        | Choice                                       | Why (ADR)                            |
|----------------|----------------------------------------------|--------------------------------------|
| Content        | Type-checked TS modules, validated by **Zod** (no CMS) | [0002](./adr/0002-content-as-code-zod.md) |
| Database       | **Prisma ORM** over **Postgres (Neon)**      | [0005](./adr/0005-prisma-neon-postgres.md) |
| Newsletter     | **Beehiiv** (audience + delivery)            | [0006](./adr/0006-beehiiv-resend-email.md) |
| Transactional email | **Resend**                              | [0006](./adr/0006-beehiiv-resend-email.md) |
| Scheduling     | **cron-job.org** (external trigger)          | [0007](./adr/0007-external-cron.md)  |
| AI tooling     | **Anthropic SDK** (audit + content generation) | —                                  |
| Animation      | Framer Motion                                | —                                    |
| Search         | Fuse.js (client-side fuzzy)                  | —                                    |
| PDF / images   | Puppeteer, jsPDF, html2canvas, react-pdf, Sharp | —                                |
| Analytics      | Vercel Analytics + Speed Insights            | —                                    |

## Quality & tooling

- **Testing:** Jest + React Testing Library (unit/component), Playwright (E2E)
- **Linting/format:** ESLint, Prettier
- **Git hooks:** Husky + lint-staged, including a **brand validator** that blocks
  commits with raw hex colors / off-grid spacing / ad-hoc z-index
- **Performance:** Lighthouse / LHCI budgets, field Web Vitals monitoring

## The two things worth knowing

1. **Content is code, not a CMS.** The ~36 patterns are TypeScript modules
   validated by Zod and served through React Context — full type safety and git
   history, no CMS. ([ADR 0002](./adr/0002-content-as-code-zod.md))
2. **The design system is machine-enforced.** A pre-commit validator rejects
   anything off the token contract, so consistency doesn't depend on reviewer
   vigilance. ([ADR 0004](./adr/0004-tailwind-design-tokens.md))

## Explaining it to different audiences

- **To a developer:** "Next.js 15 App Router, React 19, TS strict, Tailwind v4,
  Prisma/Postgres, Zod-validated content, Jest + Playwright, on Vercel."
- **To a non-technical person:** "A modern React website built with Next.js,
  hosted on Vercel, with a newsletter and a paid product funnel behind it."
- **The differentiator:** "Content is type-checked code, not a CMS, and the
  design system is enforced automatically on every commit."
</content>
