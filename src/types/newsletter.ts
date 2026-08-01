/**
 * Single source of truth for newsletter subscription sources.
 * Used by: /api/newsletter/subscribe (Zod schema), InlineNewsletterSignup
 * (prop type), Beehiiv `signup_source` custom field, and any landing page
 * with email capture.
 *
 * To add a new source: add it here → everything else picks it up.
 *
 * Every `source` literal the app sends to /api/newsletter/subscribe MUST be in
 * this list. The route validates with `z.enum(NEWSLETTER_SOURCES)`, so an
 * unlisted value is a 400 "Invalid email address" on a perfectly valid email,
 * and the caller never completes. This happened: `audit-unlock` shipped in
 * ce7632e (2026-05-25) without being added here, and the audit paywall captured
 * zero emails for two months (31 modal views, 0 submissions).
 * `newsletter-sources.test.ts` scans the codebase and fails if it recurs.
 */
export const NEWSLETTER_SOURCES = [
  'footer',
  'handbook',
  'direct',
  'news',
  'toolkit',
  'audit',
  'audit-kit',
  'audit-report',
  'audit-waitlist',
  'audit-unlock',
  'agentic-checklist',
  'accessibility-checklist',
  'design-with-claude',
  'guides',
  'patterns',
  'about',
  'homepage-hero',
  'homepage-hero-pre-audit',
] as const;

export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

/** Sources that deliver a PDF — existing subscribers still get the email */
export const PDF_DOWNLOAD_SOURCES: NewsletterSource[] = [
  'handbook',
  'audit-kit',
  'agentic-checklist',
  'accessibility-checklist',
];
