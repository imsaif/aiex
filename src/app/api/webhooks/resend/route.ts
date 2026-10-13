import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getResend } from '@/lib/resend';
import { toEmailEventRow, type ResendEmailWebhook } from '@/lib/analytics/email-events';

// Receives Resend's email events (delivered, clicked, bounced, complained) for
// the admin Growth page. Registered once with scripts/newsletter/register-resend-webhook.cjs,
// which prints the signing secret to store as RESEND_WEBHOOK_SECRET.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const payload = await request.text();
  let event: ResendEmailWebhook;
  try {
    event = getResend().webhooks.verify({
      payload,
      headers: {
        id: request.headers.get('svix-id') || '',
        timestamp: request.headers.get('svix-timestamp') || '',
        signature: request.headers.get('svix-signature') || '',
      },
      webhookSecret: secret,
    }) as ResendEmailWebhook;
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const row = toEmailEventRow(event);
  if (!row) return NextResponse.json({ ok: true, ignored: true });

  try {
    await prisma.uiEvent.create({ data: row });
  } catch (err) {
    // A 500 makes Resend retry, which is what we want for a DB blip.
    console.error('[webhooks/resend] failed to store event:', err);
    return NextResponse.json({ error: 'Store failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
