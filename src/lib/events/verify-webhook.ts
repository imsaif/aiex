import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies a Dodo Payments webhook. Dodo follows the Standard Webhooks spec
 * (https://standardwebhooks.com): the signed content is `${id}.${timestamp}.${body}`,
 * signed with HMAC-SHA256 using the base64 part of the `whsec_...` secret, and the
 * `webhook-signature` header carries one or more space-separated `v1,<base64>`
 * values. Done by hand rather than with the `standardwebhooks` package because it
 * is twenty lines and keeps a dependency out of the payment path.
 */

/** Reject deliveries older or newer than this, so a captured request cannot be replayed later. */
const TOLERANCE_SECONDS = 5 * 60;

export interface WebhookHeaders {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
}

export function verifyWebhook(
  secret: string,
  body: string,
  headers: WebhookHeaders,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): boolean {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSeconds - ts) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret, 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest();

  return signature.split(' ').some((part) => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const given = Buffer.from(value, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
