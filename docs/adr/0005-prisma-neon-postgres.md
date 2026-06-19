# 0005 — Prisma + Neon Postgres for persistence

**Status:** Accepted

## Context

The static content is code (ADR 0002), but two features need genuine persistent
state: the **newsletter** (subscribers, generated drafts, publish status) and
operational data feeding the funnel and monitoring (e.g. audit samples, real-user
Web Vitals metrics). This was added when those features required it — not as
upfront architecture.

We wanted a datastore that fits the existing TypeScript/Zod world, stays on a
free tier, and works cleanly with Vercel's serverless functions.

## Decision

Use **Postgres hosted on Neon**, accessed through **Prisma ORM** (client
generated to `src/generated/prisma`, `prisma generate` wired into `postinstall`).
The local database is the source of truth for subscribers and is mirrored to
Beehiiv (see ADR 0006).

## Alternatives considered

- **No database (keep everything static/in-repo).** Insufficient — subscribers
  and generated newsletter drafts are inherently dynamic, per-user state.
- **A NoSQL/document store (Mongo, Firestore).** Rejected. The data is
  relational (subscribers, drafts, metrics) and benefits from Postgres
  constraints; Prisma's typed client matches our type-safety priority better.
- **Supabase / PlanetScale / Vercel Postgres.** All viable. Neon was chosen for
  serverless Postgres with scale-to-zero on a free tier; Prisma keeps us
  portable across Postgres providers if that changes.
- **Raw SQL or a query builder (Kysely).** Prisma's generated, typed client and
  migrations gave better DX for a small team than hand-managed SQL.

## Consequences

- **Buys us:** typed, relational persistence consistent with the rest of the
  stack; migrations and a generated client; serverless-friendly hosting that
  sleeps when idle.
- **Costs us:** Neon free-tier compute can auto-suspend, which interacts with
  cron cadence (a `*/5` health check was dialed back to hourly so Neon could
  sleep — see `.claude/rules/newsletter-and-infra.md`); serverless + Prisma needs
  care around connection pooling; transient DB errors on cached pages must
  re-throw rather than silently fall back (a logged incident).
</content>
