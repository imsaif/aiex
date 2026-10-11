import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getResend } from '@/lib/resend';
import {
  NEWSLETTER_FROM,
  UNSUBSCRIBE_PLACEHOLDER,
  syncSegment,
  wrapEmail,
  type LocalSubscriber,
} from '@/lib/newsletter/resend-send';

// Sends an issue by email through Resend (admin only). Replaces the manual
// paste into beehiiv, whose free plan no longer accepts custom HTML (Oct 2026).
// See src/lib/newsletter/resend-send.ts for the list sync and the footer.
//
// mode 'check'       — dry run: who would receive it, and anything blocking the send
// mode 'test'        — sends one copy to ADMIN_EMAIL
// mode 'subscribers' — syncs the segment and sends the broadcast, once per issue

export const maxDuration = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
// A live request can add or remove this many contacts inside the 60s cap
// (about two Resend calls per second). Bigger changes go through the import script.
const MAX_SYNC_WRITES = 40;

type SendRecord = { status: 'sending' | 'sent'; startedAt?: string; sentAt?: string; broadcastId?: string; recipients?: number };

function sendRecordOf(structuredData: unknown): SendRecord | null {
  if (!structuredData || typeof structuredData !== 'object') return null;
  return ((structuredData as Record<string, unknown>).send as SendRecord | undefined) ?? null;
}

async function localSubscribers(): Promise<LocalSubscriber[]> {
  return prisma.subscriber.findMany({ select: { email: true, active: true, emailFrequency: true } });
}

async function markUnsubscribed(emails: string[]) {
  await prisma.subscriber.updateMany({
    where: { email: { in: emails, mode: 'insensitive' } },
    data: { active: false, unsubscribedAt: new Date(), unsubscribeReason: 'Unsubscribed via Resend email' },
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, mode } = (await request.json().catch(() => ({}))) as { id?: string; mode?: string };
  if (!id || !['check', 'test', 'subscribers'].includes(mode ?? '')) {
    return NextResponse.json({ error: 'id and mode (check | test | subscribers) are required' }, { status: 400 });
  }

  const draft = await prisma.newsletterDraft.findUnique({ where: { id } });
  if (!draft) return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  if (!draft.content) return NextResponse.json({ error: 'This draft has no email content' }, { status: 400 });

  const postalAddress = process.env.NEWSLETTER_POSTAL_ADDRESS?.trim() ?? '';
  const record = sendRecordOf(draft.structuredData);
  const resend = getResend();

  // Reasons a real send is refused, shown to the reviewer before they confirm.
  const blockers: string[] = [];
  if (!postalAddress) blockers.push('No postal address set (NEWSLETTER_POSTAL_ADDRESS). The law requires one in every newsletter.');
  if (draft.status !== 'published') blockers.push('Publish the issue first, so the email and /news match.');
  if (record?.status === 'sent') blockers.push(`Already sent to ${record.recipients ?? '?'} subscribers on ${record.sentAt?.slice(0, 16).replace('T', ' ')} UTC.`);
  if (record?.status === 'sending') blockers.push('A send for this issue is already in progress.');

  try {
    if (mode === 'check') {
      const plan = await syncSegment(resend, await localSubscribers(), markUnsubscribed, { dryRun: true });
      return NextResponse.json({ recipients: plan.recipients, toAdd: plan.added, toRemove: plan.removed, newUnsubscribes: plan.mirroredUnsubscribes.length, blockers, sent: record?.status === 'sent' ? record : null });
    }

    if (mode === 'test') {
      const to = process.env.ADMIN_EMAIL;
      if (!to) return NextResponse.json({ error: 'ADMIN_EMAIL is not set' }, { status: 500 });
      const html = wrapEmail({
        content: draft.content,
        siteUrl: SITE_URL,
        campaign: draft.slug,
        postalAddress: postalAddress || '[postal address goes here]',
        unsubscribeUrl: `${SITE_URL}/unsubscribe`,
      });
      const { data, error } = await resend.emails.send({ from: NEWSLETTER_FROM, to, subject: `[Test] ${draft.title}`, html });
      if (error) throw new Error(error.message);
      return NextResponse.json({ sentTo: to, id: data?.id });
    }

    // mode === 'subscribers'
    if (blockers.length) return NextResponse.json({ error: blockers.join(' ') }, { status: 409 });

    // Claim the issue atomically so a double click or two tabs can't send twice.
    const claimed = await prisma.$executeRaw`
      UPDATE "NewsletterDraft"
      SET "structuredData" = jsonb_set(COALESCE("structuredData", '{}'::jsonb), '{send}', ${JSON.stringify({ status: 'sending', startedAt: new Date().toISOString() })}::jsonb)
      WHERE id = ${id} AND (("structuredData" -> 'send') IS NULL OR "structuredData" -> 'send' = 'null'::jsonb)`;
    if (claimed !== 1) return NextResponse.json({ error: 'This issue is already being sent or was sent.' }, { status: 409 });

    let broadcastId: string;
    let recipients: number;
    try {
      const sync = await syncSegment(resend, await localSubscribers(), markUnsubscribed, { maxWrites: MAX_SYNC_WRITES });
      recipients = sync.recipients;
      const html = wrapEmail({ content: draft.content, siteUrl: SITE_URL, campaign: draft.slug, postalAddress, unsubscribeUrl: UNSUBSCRIBE_PLACEHOLDER });
      const { data, error } = await resend.broadcasts.create({
        segmentId: sync.segmentId,
        from: NEWSLETTER_FROM,
        replyTo: 'imran@aiuxdesign.guide',
        subject: draft.title,
        previewText: draft.summary,
        name: draft.slug,
        html,
      });
      if (error || !data) throw new Error(error?.message ?? 'Resend returned no broadcast');
      broadcastId = data.id;
      const sendRes = await resend.broadcasts.send(broadcastId);
      if (sendRes.error) {
        // Created but not sent: delete the draft broadcast so a retry starts clean.
        await resend.broadcasts.remove(broadcastId).catch(() => undefined);
        throw new Error(sendRes.error.message);
      }
    } catch (err) {
      // Nothing went out: release the claim so the send can be retried.
      await prisma.$executeRaw`UPDATE "NewsletterDraft" SET "structuredData" = "structuredData" - 'send' WHERE id = ${id}`;
      throw err;
    }

    const sent: SendRecord = { status: 'sent', sentAt: new Date().toISOString(), broadcastId, recipients };
    await prisma.$executeRaw`
      UPDATE "NewsletterDraft" SET "structuredData" = jsonb_set("structuredData", '{send}', ${JSON.stringify(sent)}::jsonb) WHERE id = ${id}`;
    return NextResponse.json({ sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Send failed';
    console.error('[newsletter/send]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
