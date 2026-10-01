import { createHmac, timingSafeEqual } from 'crypto';

/**
 * A booking token lets a buyer reopen the event page on any device and see that
 * they are booked, without accounts or a database. It is the Dodo payment id plus
 * an HMAC over `${slug}.${paymentId}`, so only this server can mint one and a
 * token for one event does not work on another.
 *
 * It carries no personal data (no email or name), because it travels in a URL.
 * Leaking one reveals nothing except that "someone" booked; it grants no access.
 *
 * Signed with EVENT_BOOKING_SECRET, falling back to the Dodo webhook key so a
 * single secret is enough to get started.
 */

const secret = () => process.env.EVENT_BOOKING_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_KEY || '';

const mac = (key: string, slug: string, paymentId: string) =>
  createHmac('sha256', key).update(`${slug}.${paymentId}`).digest().subarray(0, 16);

export function signBookingToken(slug: string, paymentId: string, key = secret()): string {
  if (!key) throw new Error('No EVENT_BOOKING_SECRET or DODO_PAYMENTS_WEBHOOK_KEY to sign booking tokens');
  return `${Buffer.from(paymentId).toString('base64url')}.${mac(key, slug, paymentId).toString('base64url')}`;
}

/** Returns the payment id when the token is genuine for this event, else null. */
export function verifyBookingToken(slug: string, token: string, key = secret()): string | null {
  if (!key || !token) return null;
  const [idPart, sigPart] = token.split('.');
  if (!idPart || !sigPart) return null;
  const paymentId = Buffer.from(idPart, 'base64url').toString();
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) return null;
  const given = Buffer.from(sigPart, 'base64url');
  const expected = mac(key, slug, paymentId);
  return given.length === expected.length && timingSafeEqual(given, expected) ? paymentId : null;
}
