# 0003 — Vercel for hosting

**Status:** Accepted

## Context

We chose Next.js (ADR 0001) and needed a host that runs it with minimal
operational overhead for a small team, gives us a global CDN for a
search-driven content site, and provides the performance tooling we care about.
Cost matters — the project runs on free/hobby tiers wherever possible.

## Decision

Deploy on **Vercel** (production domain `aiuxdesign.guide`), using Git-push
deploys, edge CDN delivery, serverless functions for API routes, and Vercel's
`@vercel/analytics`, `@vercel/speed-insights`, and `@vercel/og` packages.

## Alternatives considered

- **Netlify / Cloudflare Pages.** Capable Next hosts, but Vercel is the
  first-party Next.js platform — new framework features land there first and
  config is closest to zero.
- **Self-managed (VPS, Docker, AWS).** Rejected. Far more operational burden
  (scaling, TLS, CDN, CI/CD) than a small team should carry for this workload.

## Consequences

- **Buys us:** zero-config Next deploys; global edge CDN; preview deploys per
  PR; built-in Web Vitals/analytics and OG image generation; generous free tier.
- **Costs us:** platform lock-in (some features assume Vercel primitives) and
  hard **Hobby-tier limits** that have actively shaped the architecture — the
  60s function timeout and unreliable Hobby cron drove the move to an external
  cron trigger (see ADR 0007) and forced newsletter generation onto a faster
  model. These incidents are logged in `.claude/rules/newsletter-and-infra.md`.
</content>
