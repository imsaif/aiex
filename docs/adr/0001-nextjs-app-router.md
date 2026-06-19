# 0001 — Next.js 15 App Router as the framework

**Status:** Accepted

## Context

This is a content site whose entire value depends on being discovered through
search. Around 36 AI design patterns, plus guides, a newsletter archive, and a
paid audit funnel, all need to be reliably crawlable and fast to load. SEO and
Core Web Vitals are first-order product requirements, not afterthoughts — the
project maintains a Lighthouse/LHCI budget and a documented Web Vitals incident
log to prove it.

We also wanted strong TypeScript support and a single codebase that could host
both static content pages and a handful of dynamic API routes (newsletter
subscribe/publish, audit analysis, health checks).

## Decision

Use **Next.js 15 with the App Router** (React 19, Turbopack in dev), rendering
content pages with SSG/SSR and serving dynamic behavior through App Router API
routes.

## Alternatives considered

- **Plain React SPA (Vite/CRA).** Rejected. Client-only rendering is hostile to
  crawlers and ships a worse initial load — disqualifying for a search-driven
  content site.
- **Remix.** Strong SSR story, but a smaller ecosystem and weaker first-class
  hosting integration than Next + Vercel at the time. No compelling advantage
  for a content-first site.
- **A static-site generator (Astro, Eleventy, Hugo).** Excellent for pure
  content, but we also need real server-side API routes (subscribe, audit
  funnel, crons). A SSG-only tool would force a second backend.

## Consequences

- **Buys us:** server-rendered, crawlable pages; built-in image optimization;
  API routes co-located with the frontend; tight Vercel integration (see ADR
  0003); a large ecosystem and React 19 features.
- **Costs us:** App Router complexity (server vs. client components, caching/ISR
  semantics — the cause of at least one cached-degraded-page incident, logged in
  `.claude/rules/newsletter-and-infra.md`); framework lock-in to Next conventions;
  exposure to Next's faster release cadence.
</content>
