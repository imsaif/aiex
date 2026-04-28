import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Beehiiv subscription webhook receiver.
 *
 * Set BEEHIIV_WEBHOOK_SECRET to the signing secret shown in Beehiiv when you
 * create the webhook (Settings → Integrations → Webhooks). Beehiiv signs every
 * request with HMAC-SHA256 of the raw body using that secret, sent in the
 * `X-Beehiiv-Signature` header (some Beehiiv setups use `svix-signature`
 * format — both shapes are accepted below).
 *
 * Events handled:
 *   - subscription.deleted  → local row marked active=false with Beehiiv's reason
 *   - subscription.updated  → if status flipped to inactive, mirror locally
 *   - subscription.created  → log only (signup flow already inserts the row)
 *
 * Other events are accepted with 200 so Beehiiv doesn't retry.
 */

interface BeehiivWebhookPayload {
  event?: string;
  type?: string;
  data?: {
    id?: string;
    email?: string;
    status?: string;
    unsubscribe_reason?: string;
    deactivation_reason?: string;
    reason?: string;
  };
}

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

  // Accept either a plain hex digest, or Svix-style "v1,<base64>" / "t=...,v1=..." formats.
  const candidates: string[] = [];
  candidates.push(header.trim());
  for (const part of header.split(/[\s,]+/)) {
    if (part.startsWith('v1=') || part.startsWith('v1,')) {
      candidates.push(part.replace(/^v1[=,]/, ''));
    } else if (part.startsWith('sha256=')) {
      candidates.push(part.slice('sha256='.length));
    } else {
      candidates.push(part);
    }
  }

  for (const cand of candidates) {
    try {
      const a = Buffer.from(cand, cand.length === expected.length ? 'hex' : 'base64');
      const b = Buffer.from(expected, 'hex');
      if (a.length === b.length && timingSafeEqual(a, b)) return true;
    } catch {
      // ignore decode errors and try next candidate
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret = process.env.BEEHIIV_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[beehiiv-webhook] BEEHIIV_WEBHOOK_SECRET not set — rejecting');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const sigHeader =
    request.headers.get('x-beehiiv-signature') ||
    request.headers.get('beehiiv-signature') ||
    request.headers.get('svix-signature');

  if (!verifySignature(rawBody, sigHeader, secret)) {
    console.warn('[beehiiv-webhook] signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: BeehiivWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const event = payload.event || payload.type || '';
  const data = payload.data || {};
  const email = data.email?.toLowerCase();

  console.log('[beehiiv-webhook] received', { event, email, status: data.status });

  if (!email) {
    return NextResponse.json({ ok: true, skipped: 'no email in payload' });
  }

  const reason =
    data.unsubscribe_reason ||
    data.deactivation_reason ||
    data.reason ||
    `beehiiv:${event || 'unknown'}`;

  try {
    if (event === 'subscription.deleted') {
      await prisma.subscriber.updateMany({
        where: { email, active: true },
        data: { active: false, unsubscribeReason: reason, unsubscribedAt: new Date() },
      });
      return NextResponse.json({ ok: true, action: 'deactivated' });
    }

    if (event === 'subscription.updated') {
      const status = (data.status || '').toLowerCase();
      const inactiveStatuses = ['inactive', 'unsubscribed', 'bounced', 'complained', 'cleaned'];
      if (inactiveStatuses.includes(status)) {
        await prisma.subscriber.updateMany({
          where: { email, active: true },
          data: { active: false, unsubscribeReason: reason, unsubscribedAt: new Date() },
        });
        return NextResponse.json({ ok: true, action: 'deactivated' });
      }
      if (status === 'active') {
        await prisma.subscriber.updateMany({
          where: { email, active: false },
          data: { active: true, unsubscribeReason: null, unsubscribedAt: null },
        });
        return NextResponse.json({ ok: true, action: 'reactivated' });
      }
      return NextResponse.json({ ok: true, action: 'noop', status });
    }

    return NextResponse.json({ ok: true, action: 'logged', event });
  } catch (error) {
    console.error('[beehiiv-webhook] handler failed:', error);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
