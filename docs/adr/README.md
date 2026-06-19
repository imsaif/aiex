# Architecture Decision Records (ADRs)

This directory records the **why** behind the major technical choices in this
project — the stack, the data model, and the infrastructure. Each record is a
short, standalone document that captures the decision, the context that drove
it, the alternatives weighed, and the trade-offs accepted.

These are deliberately written *after the fact* for decisions that were made
implicitly. They reflect the logic the codebase actually embodies, drawn from
`docs/technical.md`, the `.claude/rules/` incident logs, and `package.json`.
Going forward, add a new ADR whenever you make a decision that future-you would
want explained.

## Format

Each ADR is a numbered Markdown file (`NNNN-short-title.md`) with this shape:

- **Status** — Accepted / Superseded / Deprecated
- **Context** — the forces and constraints at play
- **Decision** — what we chose
- **Alternatives considered** — what we didn't choose, and why
- **Consequences** — what this buys us, and what it costs

## Index

| #    | Decision                                                        | Status   |
|------|-----------------------------------------------------------------|----------|
| 0001 | [Next.js 15 App Router as the framework](./0001-nextjs-app-router.md) | Accepted |
| 0002 | [Content-as-code with Zod, not a CMS](./0002-content-as-code-zod.md)  | Accepted |
| 0003 | [Vercel for hosting](./0003-vercel-hosting.md)                  | Accepted |
| 0004 | [Tailwind CSS v4 with enforced design tokens](./0004-tailwind-design-tokens.md) | Accepted |
| 0005 | [Prisma + Neon Postgres for persistence](./0005-prisma-neon-postgres.md) | Accepted |
| 0006 | [Beehiiv + Resend for email](./0006-beehiiv-resend-email.md)    | Accepted |
| 0007 | [External cron (cron-job.org), not Vercel cron](./0007-external-cron.md) | Accepted |
</content>
</invoke>
