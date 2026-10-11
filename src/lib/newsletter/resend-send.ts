/**
 * Sends a newsletter issue to subscribers as a Resend broadcast.
 *
 * Why this exists (Oct 2026): beehiiv's free plan no longer allows pasting
 * custom HTML into a post, and the manual paste was the only way an issue
 * reached subscribers. Resend's free marketing plan covers 1,000 contacts with
 * unlimited broadcast sends (the 100/day cap is transactional only), takes raw
 * HTML, and runs the unsubscribe flow itself.
 *
 * Source of truth stays the local `Subscriber` table. Before every send the
 * "AI UX Daily" segment in Resend is synced from it, and anyone who unsubscribed
 * through a Resend email is mirrored back as inactive first, so an unsubscribe
 * can never be undone by a sync.
 *
 * The stored issue HTML is NOT changed: /news renders the same HTML, and the
 * unsubscribe placeholder and postal address only belong in the email. They are
 * added here, at send time, by wrapEmail().
 */

import type { Resend } from 'resend';

export const NEWSLETTER_SEGMENT_NAME = 'AI UX Daily';
export const NEWSLETTER_FROM = 'AI UX Daily <imran@aiuxdesign.guide>';
export const UNSUBSCRIBE_PLACEHOLDER = '{{{RESEND_UNSUBSCRIBE_URL}}}';

// Resend's default limit is 2 requests per second per team.
const WRITE_GAP_MS = 550;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Tags links to our own site with utm params, the job beehiiv used to do on
 * every link it sent. Links that already carry a utm_source keep theirs, and
 * third-party links are left exactly as written.
 */
export function tagSiteLinks(html: string, siteUrl: string, campaign: string): string {
  const host = new URL(siteUrl).host.replace(/^www\./, '');
  return html.replace(/href="(https?:\/\/[^"]+)"/g, (whole, href: string) => {
    let url: URL;
    try {
      url = new URL(href.replace(/&amp;/g, '&'));
    } catch {
      return whole;
    }
    if (url.host.replace(/^www\./, '') !== host || url.searchParams.has('utm_source')) return whole;
    url.searchParams.set('utm_source', 'newsletter');
    url.searchParams.set('utm_medium', 'email');
    url.searchParams.set('utm_campaign', campaign);
    return `href="${url.toString().replace(/&/g, '&amp;')}"`;
  });
}

export interface WrapEmailInput {
  /** The issue HTML exactly as stored (a fragment, may contain <style> blocks). */
  content: string;
  siteUrl: string;
  /** Issue slug, used as utm_campaign. */
  campaign: string;
  /** Mailing address required by CAN-SPAM. */
  postalAddress: string;
  /** Where the unsubscribe link points. The Resend placeholder for broadcasts. */
  unsubscribeUrl: string;
}

/**
 * Turns a stored issue into a complete email: a full document with the
 * <style> blocks moved into <head> (Gmail ignores them in <body>), our own site
 * links tagged, and a footer with the unsubscribe link and postal address,
 * which beehiiv's footer used to provide.
 */
export function wrapEmail({ content, siteUrl, campaign, postalAddress, unsubscribeUrl }: WrapEmailInput): string {
  const styles: string[] = [];
  const body = tagSiteLinks(content, siteUrl, campaign).replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (block) => {
    styles.push(block);
    return '';
  });
  const footer = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; margin: 0 auto;"><tr><td align="center" style="padding: 28px 24px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #5b6478;">
  You're getting AI UX Daily because you subscribed at <a href="${siteUrl}" style="color: #5b6478 !important; text-decoration: underline;">aiuxdesign.guide</a>.<br />
  <a href="${unsubscribeUrl}" style="color: #5b6478 !important; text-decoration: underline;">Unsubscribe</a><br />
  ${escapeHtml(postalAddress)}
</td></tr></table>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light dark" /><meta name="supported-color-schemes" content="light dark" />
${styles.join('\n')}
</head>
<body style="margin: 0; padding: 16px 0; background-color: #ffffff;">
${body}
${footer}
</body></html>`;
}

export interface LocalSubscriber {
  email: string;
  active: boolean;
  emailFrequency: string;
}

export interface SyncResult {
  segmentId: string;
  /** Contacts in the segment that will receive the send. */
  recipients: number;
  added: number;
  removed: number;
  /** Local rows switched to inactive because they unsubscribed in Resend. */
  mirroredUnsubscribes: string[];
}

/** Who gets the daily: active, and not opted down to weekly or none. */
export function wantsDaily(s: LocalSubscriber): boolean {
  return s.active && s.emailFrequency === 'all';
}

async function listAll<T>(fetchPage: (after?: string) => Promise<{ data: T[]; has_more: boolean }>, idOf: (item: T) => string): Promise<T[]> {
  const out: T[] = [];
  let after: string | undefined;
  for (;;) {
    const page = await fetchPage(after);
    out.push(...page.data);
    if (!page.has_more || page.data.length === 0) return out;
    after = idOf(page.data[page.data.length - 1]);
    await sleep(WRITE_GAP_MS);
  }
}

function unwrap<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error || !res.data) throw new Error(`Resend ${what} failed: ${res.error?.message ?? 'no data'}`);
  return res.data;
}

/** The segment's id, or null when it doesn't exist yet and `create` is false. */
export async function getNewsletterSegmentId(resend: Resend, { create = true } = {}): Promise<string | null> {
  const fromEnv = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (fromEnv) return fromEnv;
  const segments = unwrap(await resend.segments.list(), 'segments.list').data;
  const found = segments.find((s) => s.name === NEWSLETTER_SEGMENT_NAME);
  if (found) return found.id;
  if (!create) return null;
  return unwrap(await resend.segments.create({ name: NEWSLETTER_SEGMENT_NAME }), 'segments.create').id;
}

/**
 * Brings the Resend segment in line with the local list.
 *
 * Order matters: Resend-side unsubscribes are read and handed to
 * `onUnsubscribed` BEFORE anything is added, and a contact Resend marks
 * unsubscribed is never re-added, so a sync can't resubscribe anyone.
 *
 * `maxWrites` keeps a live request inside the 60s function cap. The first
 * import (hundreds of contacts) exceeds it on purpose and has to run from
 * scripts/newsletter/import-resend-contacts.mjs instead.
 */
export async function syncSegment(
  resend: Resend,
  local: LocalSubscriber[],
  onUnsubscribed: (emails: string[]) => Promise<void>,
  { maxWrites = Infinity, dryRun = false }: { maxWrites?: number; dryRun?: boolean } = {},
): Promise<SyncResult> {
  // A dry run never writes, not even the segment itself.
  const segmentId = (await getNewsletterSegmentId(resend, { create: !dryRun })) ?? '';
  await sleep(WRITE_GAP_MS);

  const contacts = await listAll(
    async (after) => unwrap(await resend.contacts.list({ limit: 100, ...(after ? { after } : {}) }), 'contacts.list'),
    (c) => c.id,
  );
  await sleep(WRITE_GAP_MS);
  const members = segmentId
    ? await listAll(
        async (after) => unwrap(await resend.contacts.list({ segmentId, limit: 100, ...(after ? { after } : {}) }), 'contacts.list(segment)'),
        (c) => c.id,
      )
    : [];

  const key = (email: string) => email.trim().toLowerCase();
  const contactByEmail = new Map(contacts.map((c) => [key(c.email), c]));
  const memberEmails = new Set(members.map((c) => key(c.email)));
  const localByEmail = new Map(local.map((s) => [key(s.email), s]));

  // 1. Mirror Resend-side unsubscribes back first.
  const mirrored = contacts
    .filter((c) => c.unsubscribed && localByEmail.get(key(c.email))?.active)
    .map((c) => key(c.email));
  if (mirrored.length && !dryRun) await onUnsubscribed(mirrored);
  for (const email of mirrored) localByEmail.get(email)!.active = false;

  // 2. Plan the writes.
  const toAdd = local.filter((s) => wantsDaily(s) && !contactByEmail.get(key(s.email))?.unsubscribed && !memberEmails.has(key(s.email)));
  const toRemove = members.filter((c) => {
    const s = localByEmail.get(key(c.email));
    return !s || !wantsDaily(s);
  });
  const writes = toAdd.reduce((n, s) => n + (contactByEmail.has(key(s.email)) ? 1 : 2), 0) + toRemove.length;
  if (writes > maxWrites) {
    throw new Error(`Segment needs ${writes} changes, more than fit in one request (${maxWrites}). Run scripts/newsletter/import-resend-contacts.mjs first.`);
  }

  const recipients = members.length + toAdd.length - toRemove.length;
  if (dryRun) return { segmentId, recipients, added: toAdd.length, removed: toRemove.length, mirroredUnsubscribes: mirrored };

  // 3. Apply.
  for (const s of toAdd) {
    if (!contactByEmail.has(key(s.email))) {
      unwrap(await resend.contacts.create({ email: key(s.email), unsubscribed: false }), `contacts.create(${s.email})`);
      await sleep(WRITE_GAP_MS);
    }
    unwrap(await resend.contacts.segments.add({ email: key(s.email), segmentId }), `segments.add(${s.email})`);
    await sleep(WRITE_GAP_MS);
  }
  for (const c of toRemove) {
    unwrap(await resend.contacts.segments.remove({ contactId: c.id, segmentId }), `segments.remove(${c.email})`);
    await sleep(WRITE_GAP_MS);
  }

  return { segmentId, recipients, added: toAdd.length, removed: toRemove.length, mirroredUnsubscribes: mirrored };
}
