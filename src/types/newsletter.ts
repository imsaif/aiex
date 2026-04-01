/**
 * Single source of truth for newsletter subscription sources.
 * Used by: API route (Zod schema), InlineNewsletterSignup (prop type),
 * sendWelcomeEmail, and any landing page with email capture.
 *
 * To add a new source: add it here → everything else picks it up.
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
  'agentic-checklist',
] as const;

export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

/** Sources that deliver a PDF — existing subscribers still get the email */
export const PDF_DOWNLOAD_SOURCES: NewsletterSource[] = [
  'handbook',
  'audit-kit',
  'agentic-checklist',
];
