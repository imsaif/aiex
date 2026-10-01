import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { verifyWebhook } from '@/lib/events/verify-webhook';
import { bookingEmail, hostNotification } from '@/lib/events/booking-email';
import { findEventForPayment } from '@/data/events';

/**
 * Dodo Payments webhook. On `payment.succeeded` for an event booking, emails the
 * buyer their confirmation (date, venue, setup steps) and the host a heads-up.
 *
 * This is the one place the site reacts to a payment. The /call offer still
 * deliberately does not: it needs nothing beyond Dodo's receipt and a Cal.com
 * redirect. Events do, because a buyer who closes the tab before the redirect
 * lands would otherwise get no setup steps and no venue at all.
 *
 * Still no payment state in the database. Duplicate deliveries are handled with
 * Resend idempotency keys built from the webhook id, so a retry never sends a
 * second email. Returning non-2xx makes Dodo retry, so we only do that when the
 * email itself failed and a retry could help.
 *
 * Setup: Dodo dashboard > Developer > Webhooks > add
 * https://www.aiuxdesign.guide/api/webhooks/dodo, subscribe to payment.succeeded,
 * and put its signing secret in DODO_PAYMENTS_WEBHOOK_KEY.
 */

export const runtime = 'nodejs';

interface DodoPayment {
  payment_id: string;
  customer?: { email?: string; name?: string } | null;
  product_cart?: { product_id: string }[] | null;
  metadata?: Record<string, unknown> | null;
}

export async function POST(request: Request) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!secret) {
    console.error('[webhooks/dodo] DODO_PAYMENTS_WEBHOOK_KEY missing');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  const body = await request.text();
  const webhookId = request.headers.get('webhook-id');
  const ok = verifyWebhook(secret, body, {
    id: webhookId,
    timestamp: request.headers.get('webhook-timestamp'),
    signature: request.headers.get('webhook-signature'),
  });
  if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 401 });

  let payload: { type?: string; data?: DodoPayment };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  if (payload.type !== 'payment.succeeded' || !payload.data) {
    return NextResponse.json({ ignored: payload.type ?? 'unknown' });
  }

  const payment = payload.data;
  const event = findEventForPayment(payment);
  if (!event) {
    // A payment for something else (the /call offer, say). Not ours to handle.
    return NextResponse.json({ ignored: 'not an event booking' });
  }

  const email = payment.customer?.email;
  const name = payment.customer?.name ?? '';
  if (!email) {
    console.error('[webhooks/dodo] booking without customer email', payment.payment_id);
    return NextResponse.json({ ignored: 'no email' });
  }

  try {
    const mail = bookingEmail(event, name);
    const sent = await resend.emails.send(
      {
        from: 'AIUX Design Guide <imran@aiuxdesign.guide>',
        replyTo: event.contactEmail,
        to: email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      },
      { idempotencyKey: `event-booking/${webhookId}` }
    );
    if (sent.error) throw new Error(sent.error.message);

    const note = hostNotification(event, { name, email }, payment.payment_id);
    await resend.emails.send(
      {
        from: 'AIUX Design Guide <imran@aiuxdesign.guide>',
        to: event.contactEmail,
        subject: note.subject,
        text: note.text,
      },
      { idempotencyKey: `event-booking-host/${webhookId}` }
    );
  } catch (err) {
    console.error('[webhooks/dodo] confirmation email failed', payment.payment_id, err);
    return NextResponse.json({ error: 'email failed' }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
