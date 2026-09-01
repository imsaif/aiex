/**
 * Paid 1:1 call offer — a $49 / 45-minute session sold to readers of the two
 * Claude learning paths.
 *
 * Deliberately mirrors the /services decision (see the ServiceLead comment in
 * prisma/schema.prisma): payment happens on a Dodo Static Payment Link, NOT in
 * this repo. There is no checkout code, no webhook, no accounts, and no payment
 * state in the database. The only thing the site does is send people to the link
 * and catch them on the way back.
 *
 * Flow: offer block on a learning path -> /call -> Dodo checkout -> /call/booked
 * (Cal.com embed). The Dodo link's `redirect_url` MUST point at /call/booked, or
 * a paying customer lands nowhere and never books.
 */

export const CALL_OFFER = {
  /** Shown to the buyer. Keep in sync with the amount configured on the Dodo link. */
  priceLabel: '$49',
  durationLabel: '45 minutes',
  /** Used in headings and the page title. */
  name: '45 minutes with me on your Claude Code project',
} as const;

/**
 * The Dodo Static Payment Link. Public because it is just a URL the user is sent
 * to — no secret is involved. When unset (local dev, or before the link exists)
 * every call-offer surface renders nothing rather than a button that 404s.
 */
export const DODO_CALL_LINK = process.env.NEXT_PUBLIC_DODO_CALL_LINK ?? '';

/**
 * Full Cal.com booking URL, e.g. https://cal.com/imran/claude-45.
 * Embedded in an iframe on /call/booked.
 */
export const CAL_BOOKING_URL = process.env.NEXT_PUBLIC_CAL_BOOKING_URL ?? '';

/** True once the offer can actually be bought. Gates every surface. */
export const isCallOfferLive = (): boolean => DODO_CALL_LINK.length > 0;

/**
 * Guides that carry the offer. Slug-gated rather than gated on `tool`, because
 * `ai-ux-skills-guide` is also tool: 'Claude Code' but is product onboarding —
 * putting a paid CTA on it would sell to people who came to install a free skill.
 */
export const CALL_OFFER_GUIDE_SLUGS: readonly string[] = [
  'claude-code-learning-path',
  'claude-design-learning-path',
];

export const guideCarriesCallOffer = (slug: string): boolean =>
  CALL_OFFER_GUIDE_SLUGS.includes(slug);
