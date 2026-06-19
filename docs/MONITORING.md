# Monitoring: How We Know When Something Breaks

This is the map of every automated check on the site, what it watches, and how
it reaches you. If you're ever asked "how do we know if the site is down?",
this is the answer.

## TL;DR

The checks that **actually work** run *on Vercel* (or as GitHub Actions) and
reach you by **email (Resend)** or by **opening a GitHub issue**. If you are not
getting those, assume things are healthy.

## The monitoring layers

| Layer | Trigger | What it checks | How it alerts you | Auto-fix? |
|-------|---------|----------------|-------------------|-----------|
| **Newsletter watchdog** | cron-job.org → `/api/cron/newsletter-watchdog` (daily, after the 03:00 UTC generation cron) | Today's newsletter exists in the DB; `/news` renders real items (not the 2-item static fallback) | Email via Resend **on real failure** | ✅ Re-triggers generation, waits 40s, re-checks |
| **Audit health monitor** | cron-job.org → `/api/health/audit` (hourly) | 4 checks: env vars, homepage renders, audit `analyze` route, database | Email via Resend on failure; **silent when healthy** | ❌ |
| **Field Web Vitals** | cron-job.org → `/api/cron/check-web-vitals` (daily 05:00 UTC) | Rolling p75 of real-user LCP / INP / CLS from the `WebVitalMetric` table | Email via Resend **only on a "good"-threshold breach** | ❌ |
| **Lighthouse CI (perf)** | GitHub Action `.github/workflows/perf.yml` (nightly 04:00 UTC + on relevant PRs) | Lab performance budget on 8 representative URLs | **Opens a GitHub issue tagged `performance`** | ❌ |
| **Vercel Speed Insights** | Automatic | Real-user Core Web Vitals per route | Dashboard only (passive) | ❌ |
| **Microsoft Clarity** | Automatic (prod only) | Session replays, ad-hoc URL perf | Dashboard only (passive) | ❌ |

**So, in practice, a real outage reaches you via:**
1. A **Resend email** (newsletter / audit-health / web-vitals), or
2. A **GitHub issue tagged `performance`** (LHCI).

Everything else is a passive dashboard you check when investigating.

## What is NOT a real alert

> ⚠️ **GitHub issues titled "Newsletter watchdog failed/blocked — network egress
> blocked" or "Host not in allowlist" are FALSE ALARMS. They do not mean the site
> is down.**

These came from a **redundant Claude Code on the web scheduled session** that
tried to verify the newsletter by fetching `www.aiuxdesign.guide` from inside the
Claude sandbox. The sandbox's network egress policy blocks that host, so the
agent could not see the site and opened a "status unknown" issue. The error
`Host not in allowlist: www.aiuxdesign.guide` is the **Claude environment's own**
egress block — **not** Vercel, **not** a real outage.

This redundant session was **retired** (June 2026) because the on-Vercel
newsletter watchdog above already covers the same job and actually works. If
these issues reappear, the Claude Code web trigger was re-added — delete it again
in the Claude Code web UI (Environments → the scheduled trigger). See
https://code.claude.com/docs/en/claude-code-on-the-web

## Manual spot-checks

- **Is the newsletter current?** Open https://www.aiuxdesign.guide/news — if it
  shows ≤ 2 items it's in the static-fallback failure mode (see the
  `.claude/rules/newsletter-and-infra.md` incident log).
- **Force a newsletter run:**
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" \
    "https://www.aiuxdesign.guide/api/cron/generate-newsletter"
  ```
- **Transactional email logs:** https://resend.com/emails
- **Perf:** GitHub → Actions → "Performance", plus Vercel → Speed Insights.

## Gaps worth knowing

- If **Vercel itself is fully down**, the on-Vercel watchdog and its alert email
  cannot run — you would not get an email. The hourly audit-health check is your
  best early signal, but a true total-outage uptime monitor (an external pinger
  like UptimeRobot / Better Stack hitting the homepage) is not yet set up. Add
  one if total-outage detection becomes important.
</content>
