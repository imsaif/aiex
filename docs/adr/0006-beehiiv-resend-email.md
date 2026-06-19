# 0006 — Beehiiv + Resend for email

**Status:** Accepted

## Context

The product needs two distinct kinds of email: **newsletter broadcasts** to
subscribers (an audience product, with growth/automation tooling) and
**transactional** messages (audit reports to a single user, admin alerts, cron
failure notices). These have different volumes, deliverability needs, and
tooling needs, and the project runs on free tiers.

## Decision

Split the two concerns:

- **Beehiiv (free tier)** owns the subscriber audience: subscriber sync, welcome
  emails via Automations (keyed on a `signup_source` custom field), and
  newsletter delivery. Because Beehiiv's free/Launch tier has no Posts API,
  broadcast delivery is intentionally **manual** — an admin copies generated HTML
  from our admin UI into a new Beehiiv post.
- **Resend (free tier)** owns transactional email (audit reports, admin
  watchdog/cron alerts). Volume is ~150/month, well under the 3,000/month cap.

No transactional sends go directly to subscribers — every subscriber-facing
email is a Beehiiv automation or broadcast. Full details in
`.claude/rules/newsletter-and-infra.md`.

## Alternatives considered

- **One provider for everything (e.g. all-Resend, or all-Mailchimp).** Rejected.
  Transactional ESPs lack audience/newsletter-growth tooling; newsletter
  platforms are poor at one-off transactional mail. The two jobs are genuinely
  different.
- **Self-hosted/SMTP (SES + own templates).** Rejected. Deliverability,
  suppression, and subscriber management would all be ours to build and babysit.
- **Paid Beehiiv tier for Posts API automation.** Deferred on cost — manual
  compose is an acceptable trade at current volume.

## Consequences

- **Buys us:** the right tool for each job on free tiers; Beehiiv's growth and
  automation features for the audience; reliable transactional delivery via
  Resend; clear separation of concerns.
- **Costs us:** a **manual step** in newsletter publishing (copy HTML → paste
  into Beehiiv → send) that can't be automated until a paid Beehiiv tier; two
  providers plus the local DB to keep in sync (subscriber mirroring); free-tier
  caps to stay under.
</content>
