# 0008 — Newsletter delivery moves from a beehiiv paste to Resend broadcasts

**Status:** Accepted (supersedes the delivery half of [0006](./0006-beehiiv-resend-email.md))

## Context

Every issue reached subscribers by pasting the generated HTML into a beehiiv
post. In October 2026 beehiiv was downgraded to its free plan, and pasting
custom HTML into a post turned out to be a Scale feature (about $43/month).
The designed email could no longer go out without paying for a plan whose only
remaining use was that paste.

## Decision

Resend sends the newsletter as a broadcast. **The review workflow does not
change**: the cron writes a draft, the admin reviews, edits and publishes it at
`/admin/newsletter` exactly as before. Only the last step changes. "Copy HTML →
paste into beehiiv" becomes **Send test to me**, then **Send to subscribers**.

- The local `Subscriber` table stays the source of truth. Before each send,
  `syncSegment()` (`src/lib/newsletter/resend-send.ts`) brings the Resend
  segment "AI UX Daily" in line with it. People who unsubscribed through a
  Resend email are mirrored back as inactive first and are never re-added.
- `wrapEmail()` adds what beehiiv's footer used to provide: the unsubscribe
  link (`{{{RESEND_UNSUBSCRIBE_URL}}}`, handled by Resend) and the postal
  address CAN-SPAM requires (`NEWSLETTER_POSTAL_ADDRESS`). It also utm-tags our
  own links. The stored issue HTML is untouched, so /news never shows the footer.
- `POST /api/newsletter/send` sends each issue once. The issue is claimed in
  `structuredData.send` before sending and released if nothing went out.
- The first import of about 300 contacts runs locally with
  `npm run newsletter:import-resend`, because it doesn't fit the 60s function cap.

## Alternatives considered

- **Pay for beehiiv Scale.** It works with no code, but costs about $43 a month
  for one feature, and the paste stays manual.
- **Brevo free.** It takes raw HTML, but caps at 300 emails a day, which the
  list would outgrow.
- **Resend transactional emails, one per subscriber.** The free plan caps these
  at 100 a day. Broadcasts are priced by contacts (1,000 free) with unlimited
  sends.

## Consequences

- Free up to 1,000 contacts, then $40/month for 5,000.
- One manual step disappears: no more paste. Sending stays a human click after
  review.
- beehiiv still receives signups (`addSubscriberToBeehiiv`) and sends welcome
  emails, if its free plan still runs Automations (unverified). Moving welcome
  emails is a separate decision.
- Two unsubscribe surfaces now exist: Resend's, for newsletter emails, and our
  `/unsubscribe` page, for audit and other emails. Both end in
  `Subscriber.active = false`. Resend-side unsubscribes reach the local table on
  the next send's sync, not instantly.
