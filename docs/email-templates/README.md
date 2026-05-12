# Beehiiv Welcome Email Templates

Three welcome emails keyed on the `signup_source` custom field, mirroring the
newsletter publish design (DM Sans wrapper, navy `#162036` ink, `#e5e7eb`
hairlines, white card on neutral background).

| File | `signup_source` Automation trigger | Cohort |
| --- | --- | --- |
| `homepage-hero-pre-audit.html` | `homepage-hero-pre-audit` | Audit-curious — opted into news on the hero before running an audit |
| `audit-saved.html` | `audit` | Saved their results to a local download (no transactional email sent) |
| `audit-waitlist.html` | `audit-waitlist` | High-intent — hit the paywall and joined the waitlist |

> **Note on `audit-report`:** Do **not** create a Beehiiv welcome for this source.
> Users who submit the EmailReportModal already receive a per-user transactional
> report email via Resend (`/api/audit/send-report`) at the moment of submission —
> a Beehiiv welcome minutes later would feel like spam. The Resend email is
> their welcome.

## How to use

1. Open the `.html` file in a browser to preview.
2. View source, copy the entire `<body>` contents (everything inside the outer
   `<div style="font-family: 'DM Sans'…">` wrapper, **including** the wrapper).
3. In Beehiiv: Automations → New Automation → Trigger: `Subscriber added` with
   condition `signup_source equals <value>` → Send Email → paste the HTML into
   the email body via the source/HTML view.
4. Set the subject line from the `<!-- subject: … -->` comment at the top of
   each file.

## Design tokens (kept in sync with `src/app/api/cron/generate-newsletter/route.ts`)

- Ink: `#162036` (brand navy)
- Muted: `#64748b`
- Hairline: `#e5e7eb`
- Card bg: `#ffffff`
- Page bg: Beehiiv default (don't override — it respects the publication theme)
- Font: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Max width: 640px
