# 0007 — External cron (cron-job.org), not Vercel cron

**Status:** Accepted

## Context

Several jobs run on a schedule: daily and weekly newsletter generation, an
hourly audit-funnel health monitor, and a daily field Web Vitals check. The site
is hosted on Vercel's Hobby tier (ADR 0003), which offers built-in cron — but in
practice Hobby crons did **not** fire reliably (observed Jan–Mar 2026), and when
both Vercel cron and an external trigger were active they raced, causing silent
"every other day" newsletter failures.

## Decision

Use **cron-job.org** (free) as the **sole** external trigger. It calls our
App Router cron endpoints over HTTPS with an `Authorization: Bearer
<CRON_SECRET>` header. `vercel.json` must **not** contain a `crons` block —
this was removed and must not be re-added. The full schedule and the incident
history are documented in `.claude/rules/newsletter-and-infra.md`.

## Alternatives considered

- **Vercel Hobby cron.** Rejected — unreliable execution on Hobby tier, and the
  root cause of duplicate-run failures when combined with any other trigger.
- **Upgrade to Vercel Pro for reliable cron.** Deferred on cost; an external
  trigger solves it for free.
- **A dedicated scheduler/queue (GitHub Actions schedule, Upstash QStash,
  Inngest).** Viable and worth revisiting if scheduling needs grow, but
  cron-job.org is the simplest thing that works for a handful of HTTP triggers.

## Consequences

- **Buys us:** reliable scheduled execution on free infrastructure; a single,
  unambiguous trigger source (no races).
- **Costs us:** an external dependency that lives outside the repo and Vercel
  dashboard (its config and the `CRON_SECRET` must be kept in sync with
  production); the 60s Vercel function timeout still bounds each job, which is why
  newsletter generation uses a fast model and responds via `after()`. **Do not
  re-add `crons` to `vercel.json`** — doing so reintroduces the duplicate-run bug.
</content>
