import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

type NewsletterType = 'daily' | 'weekly';

interface WatchdogResult {
  status: 'ok' | 'retriggered' | 'failed';
  type: NewsletterType;
  checkedAt: string;
  newsletter?: { id: string; title: string; type: string; status: string; createdAt: string };
  retrigger?: { attempted: boolean; response?: string; error?: string };
  message: string;
}

function getUTCDayBoundaries(): { todayStart: Date; tomorrowStart: Date } {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  return { todayStart, tomorrowStart };
}

function getExpectedType(): NewsletterType {
  return new Date().getUTCDay() === 1 ? 'weekly' : 'daily';
}

async function findTodaysNewsletter(type: NewsletterType): Promise<WatchdogResult['newsletter'] | null> {
  const { todayStart, tomorrowStart } = getUTCDayBoundaries();

  const draft = await prisma.newsletterDraft.findFirst({
    where: {
      type,
      createdAt: { gte: todayStart, lt: tomorrowStart },
      status: { in: ['published', 'pending_review'] },
    },
    select: { id: true, title: true, type: true, status: true, createdAt: true },
  });

  if (!draft) return null;
  return { ...draft, createdAt: draft.createdAt.toISOString() };
}

async function triggerGeneration(type: NewsletterType): Promise<{ success: boolean; response?: string; error?: string }> {
  const generateUrl = `${SITE_URL}/api/cron/generate-newsletter${type === 'weekly' ? '?type=weekly' : ''}`;

  try {
    const res = await fetch(generateUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const body = await res.text();

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${body.slice(0, 200)}` };
    }
    return { success: true, response: body.slice(0, 200) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

async function sendWatchdogAlert(result: WatchdogResult) {
  if (!resend || !process.env.ADMIN_EMAIL) return;

  try {
    await resend.emails.send({
      from: 'AI UX Daily <imran@aiuxdesign.guide>',
      replyTo: 'imranrizom@gmail.com',
      to: process.env.ADMIN_EMAIL,
      subject: `🐕 Watchdog: ${result.type} newsletter ${result.status} (${new Date().toISOString().slice(0, 10)})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="font-size: 24px; color: ${result.status === 'failed' ? '#dc2626' : '#d97706'};">
            Newsletter Watchdog: ${result.status.toUpperCase()}
          </h1>
          <p><strong>Type:</strong> ${result.type}</p>
          <p><strong>Checked at:</strong> ${result.checkedAt}</p>
          <p><strong>Message:</strong> ${result.message}</p>
          ${result.retrigger ? `
            <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 8px; font-weight: 600;">Retrigger Details:</p>
              <p style="margin: 0;">Attempted: ${result.retrigger.attempted}</p>
              ${result.retrigger.response ? `<p style="margin: 4px 0 0;">Response: ${result.retrigger.response}</p>` : ''}
              ${result.retrigger.error ? `<p style="margin: 4px 0 0; color: #dc2626;">Error: ${result.retrigger.error}</p>` : ''}
            </div>
          ` : ''}
          <p style="margin-top: 20px;">Manual trigger:</p>
          <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px; overflow-x: auto;">curl -H "Authorization: Bearer $CRON_SECRET" \\
  "${SITE_URL}/api/cron/generate-newsletter${result.type === 'weekly' ? '?type=weekly' : ''}"</pre>
        </div>
      `,
    });
  } catch (err) {
    console.error('[watchdog] Failed to send alert email:', err);
  }
}

export async function GET(request: NextRequest) {
  // Auth check — same pattern as generate endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const type = getExpectedType();
  const checkOnly = request.nextUrl.searchParams.get('check-only') === 'true';
  const now = new Date().toISOString();

  console.log(`[watchdog] Checking ${type} newsletter (check-only: ${checkOnly})`);

  // Step 1: Check if today's newsletter exists
  const existing = await findTodaysNewsletter(type);

  if (existing) {
    const result: WatchdogResult = {
      status: 'ok',
      type,
      checkedAt: now,
      newsletter: existing,
      message: `${type} newsletter already exists: "${existing.title}"`,
    };
    console.log(`[watchdog] OK — ${type} newsletter found: ${existing.id}`);
    return NextResponse.json(result);
  }

  // Step 2: Newsletter missing
  console.log(`[watchdog] MISSING — no ${type} newsletter found for today`);

  if (checkOnly) {
    const result: WatchdogResult = {
      status: 'failed',
      type,
      checkedAt: now,
      message: `No ${type} newsletter found for today (check-only mode, no retrigger)`,
    };
    return NextResponse.json(result);
  }

  // Step 3: Trigger generation
  console.log(`[watchdog] Triggering ${type} newsletter generation...`);
  const trigger = await triggerGeneration(type);

  if (!trigger.success) {
    const result: WatchdogResult = {
      status: 'failed',
      type,
      checkedAt: now,
      retrigger: { attempted: true, error: trigger.error },
      message: `Retrigger failed: ${trigger.error}`,
    };
    console.error(`[watchdog] Retrigger failed:`, trigger.error);
    await sendWatchdogAlert(result);
    return NextResponse.json(result);
  }

  // Step 4: Wait for background generation to complete, then verify
  console.log(`[watchdog] Retrigger accepted, waiting 40s for generation...`);
  await new Promise((resolve) => setTimeout(resolve, 40000));

  const postTrigger = await findTodaysNewsletter(type);

  if (postTrigger) {
    const result: WatchdogResult = {
      status: 'retriggered',
      type,
      checkedAt: now,
      newsletter: postTrigger,
      retrigger: { attempted: true, response: trigger.response },
      message: `Newsletter was missing, retriggered successfully: "${postTrigger.title}"`,
    };
    console.log(`[watchdog] Retrigger SUCCESS — newsletter created: ${postTrigger.id}`);
    await sendWatchdogAlert(result);
    return NextResponse.json(result);
  }

  // Step 5: Retrigger didn't produce a newsletter
  const result: WatchdogResult = {
    status: 'failed',
    type,
    checkedAt: now,
    retrigger: { attempted: true, response: trigger.response },
    message: `Retrigger was accepted but no newsletter appeared after 40s — generation likely failed silently`,
  };
  console.error(`[watchdog] Retrigger accepted but no newsletter after 40s`);
  await sendWatchdogAlert(result);
  return NextResponse.json(result);
}
