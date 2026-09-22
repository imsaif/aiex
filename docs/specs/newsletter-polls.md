# Newsletter polls, self-hosted

**Status:** spec, not built
**Date:** 21 September 2026
**Replaces:** the Beehiiv poll block (one poll ever run, 3 votes from 2 people)

## Why

Beehiiv's polls were the only feature worth keeping when the account downgrades.
They are also trivial to rebuild: an email poll is a set of ordinary links, one
per answer. No JavaScript, no embed, works in every mail client — which is how
Beehiiv does it too.

## The constraint that shapes everything

The newsletter is sent by pasting one HTML document into a Beehiiv post. Every
recipient receives byte-identical links. There is no per-person token to put in
a URL, so **votes are anonymous**.

This is fine. The poll has ever collected 3 votes; the bottleneck is volume, not
attribution. Anonymity also removes any consent question about storing an opinion
against a named person.

De-duplication is therefore best-effort (see below), not guaranteed. Accept that.

## Shape

### The email side

A new `renderPoll()` in `src/app/api/cron/generate-newsletter/route.ts`, called
from `renderFooterCTA()` where the `POLL SLOT` comment currently sits. It emits
one `<a>` per choice, styled as the existing pill buttons:

```
https://aiuxdesign.guide/poll/<issueSlug>?c=<choiceId>
```

`issueSlug` is the `NewsletterDraft.slug` already being generated. `choiceId` is a
short stable string (`yes`, `skim`, `no`) — not a database id, so the link is
readable and survives a reseed.

Keep `stripFeedUtm()` away from these; they are first-party and untagged on
purpose, so Beehiiv appends its own campaign UTMs and the vote is attributable to
an issue two ways.

### The landing side

`src/app/poll/[slug]/page.tsx` — a server component, not an API route, so the
click lands on a real page rather than a redirect:

1. Read `slug` and `c`.
2. Validate `c` against the choice set for that issue. Unknown choice → record
   nothing, show the results page anyway.
3. Write a `PollVote` row.
4. Render a thank-you that shows the running tally for that issue, plus the
   audit CTA. A vote is the highest-intent moment in the whole issue — do not
   waste it on a dead-end "thanks!".

Mark the route `noindex`. It must not compete with `/news` in search.

### Data

```prisma
model PollVote {
  id         String   @id @default(cuid())
  issueSlug  String
  choiceId   String
  createdAt  DateTime @default(now())

  // Best-effort de-duplication only. Anonymous votes mean there is no subscriber
  // id to key on, so a coarse fingerprint is the only handle available. Never
  // treat this as identity and never surface it.
  voterHash  String?

  @@index([issueSlug])
  @@unique([issueSlug, voterHash])
}
```

`voterHash` = SHA-256 of (IP + user-agent + issueSlug + a server-side salt).
Salting per issue means the same hash cannot be followed across issues. On a
unique-constraint collision, update the existing row's `choiceId` instead of
inserting — the last answer wins, which matches how people actually behave when
they misclick.

Store no IP address. The hash is the only trace.

### Where the questions live

Add to the existing `structuredData` JSON on `NewsletterDraft`:

```json
"poll": {
  "question": "Was this issue worth your time?",
  "choices": [
    { "id": "yes",  "label": "Yes, genuinely useful" },
    { "id": "skim", "label": "Skimmed it, some value" },
    { "id": "no",   "label": "Not really" }
  ]
}
```

Absent key → `renderPoll()` returns an empty string and the issue ships without a
poll. Default the standard three choices in the cron so every issue gets one
without manual work.

### Reading results

Add a panel to `/admin/newsletter`: issue, question, counts per choice, response
rate against that issue's delivered count. One query, grouped by `issueSlug` and
`choiceId`.

## Deliberately not doing

- **Free-text comments.** Beehiiv's version collected zero in the one poll that
  ran. An open box on an anonymous endpoint is a spam target with no upside at
  this volume. Revisit if vote counts pass ~20 per issue.
- **Per-person attribution via Beehiiv merge tags.** Beehiiv can interpolate
  subscriber fields into a pasted post, which would make votes identified. It
  would also tie the whole design to Beehiiv at the exact moment we are leaving.
  Skip it.
- **One-click vote confirmation inside the email.** No such thing works across
  clients. The landing page is the confirmation.

## Sequence

1. `PollVote` model + migration.
2. `renderPoll()` and the `structuredData.poll` default in the cron.
3. `/poll/[slug]` page with the tally and the audit CTA.
4. Admin panel readout.
5. Ship one issue with it, check votes land, then delete the `POLL SLOT` comment.

Steps 1-3 are the working product; 4 can follow.

## Open question

Response rate is the thing to watch. Beehiiv's poll got 3 votes across the issues
it ran in. If a self-hosted one does not clearly beat that within five issues,
the conclusion is that this audience does not vote, and the slot should go back
to being audit CTA space.
