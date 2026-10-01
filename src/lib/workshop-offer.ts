/**
 * Paid online Claude Code workshop, sold on this site instead of Luma.
 *
 * Why not Luma: on Luma a free ticket with "Require approval" left ~100 people
 * believing they were already in, so nobody paid and nobody came (Sep 2026).
 * Here the only way in is paying, so there is no pending state to misread.
 *
 * Same shape as the /call offer (src/lib/call-offer.ts): payment happens on a
 * Dodo Static Payment Link, NOT in this repo. No checkout code, no webhook, no
 * payment state in the database. Flow: /workshop -> Dodo checkout ->
 * /workshop/booked (setup check). The Dodo link's `redirect_url` MUST point at
 * /workshop/booked.
 *
 * The session link is never shown on the site. /workshop/booked is noindex but
 * public, so anything on it is free to anyone who guesses the URL. The link goes
 * out by email once a buyer has shown Claude Code running on their own account.
 */

export const WORKSHOP = {
  name: 'Claude Code, hands-on: build a real feature in 90 minutes',
  durationLabel: '90 minutes',
  formatLabel: 'Online, live',
  /** e.g. 'Saturday 18 October 2026'. Empty keeps the page closed. */
  dateLabel: '',
  /** Include the timezone, e.g. '10:00 to 11:30 IST'. */
  timeLabel: '',
  /** Keep in sync with the amount on the Dodo link, e.g. '₹499'. Empty keeps the page closed. */
  priceLabel: '',
  /** Shown on the page. Dodo links do not cap quantity, so closing early is manual. */
  seats: 0,
  /** Where buyers send their setup screenshot. Already public on the site. */
  contactEmail: 'imranrizom@gmail.com',
} as const;

/** The Dodo Static Payment Link. Public: it is only a URL. */
export const DODO_WORKSHOP_LINK = process.env.NEXT_PUBLIC_DODO_WORKSHOP_LINK ?? '';

/** True only once there is a link to pay on and the facts a buyer needs to decide. */
export const isWorkshopLive = (): boolean =>
  DODO_WORKSHOP_LINK.length > 0 &&
  WORKSHOP.dateLabel.length > 0 &&
  WORKSHOP.timeLabel.length > 0 &&
  WORKSHOP.priceLabel.length > 0;
