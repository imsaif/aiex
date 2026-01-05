import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { timingSafeEqual } from 'crypto';
import { resend } from '@/lib/resend';

// Send newsletter to all active subscribers
async function sendNewsletterToSubscribers(
  newsletter: { title: string; summary: string; content: string; slug: string; type: string }
): Promise<{ successCount: number; failureCount: number; totalSubscribers: number }> {
  const subscribers = await prisma.subscriber.findMany({
    where: { active: true },
  });

  if (subscribers.length === 0) {
    return { successCount: 0, failureCount: 0, totalSubscribers: 0 };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
  const isWeekly = newsletter.type === 'weekly';
  const subjectPrefix = isWeekly ? '📬' : '📰';

  // Send emails in batches of 10 to avoid rate limits
  const batchSize = 10;
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    const emailPromises = batch.map(async (subscriber) => {
      const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
      const viewOnlineUrl = `${baseUrl}/news/${newsletter.slug}`;

      try {
        await resend.emails.send({
          from: 'AI UX Design Guide <noreply@aiuxdesign.guide>',
          to: subscriber.email,
          subject: `${subjectPrefix} ${newsletter.title}`,
          html: wrapNewsletterForEmail(newsletter.content, unsubscribeUrl, viewOnlineUrl),
        });
        return true;
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        return false;
      }
    });

    const results = await Promise.all(emailPromises);
    successCount += results.filter(Boolean).length;
    failureCount += results.filter((r) => !r).length;

    // Small delay between batches to respect rate limits
    if (i + batchSize < subscribers.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { successCount, failureCount, totalSubscribers: subscribers.length };
}

// Wrap newsletter HTML content for email delivery
function wrapNewsletterForEmail(content: string, unsubscribeUrl: string, viewOnlineUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="text-align: center; font-size: 12px; color: #666; margin-bottom: 20px;">
            <a href="${viewOnlineUrl}" style="color: #666;">View in browser</a>
          </p>
          ${content}
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
              Unsubscribe from these emails
            </a>
          </p>
        </div>
      </body>
    </html>
  `;
}

// Send a single test email to admin
async function sendTestEmail(
  newsletter: { title: string; summary: string; content: string; slug: string; type: string }
): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { success: false, error: 'ADMIN_EMAIL not configured' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';
  const isWeekly = newsletter.type === 'weekly';
  const subjectPrefix = isWeekly ? '📬' : '📰';
  const viewOnlineUrl = `${baseUrl}/news/${newsletter.slug}`;
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=test-preview`;

  try {
    await resend.emails.send({
      from: 'AI UX Design Guide <noreply@aiuxdesign.guide>',
      to: adminEmail,
      subject: `[TEST] ${subjectPrefix} ${newsletter.title}`,
      html: wrapNewsletterForEmail(newsletter.content, unsubscribeUrl, viewOnlineUrl),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send test email:', error);
    return { success: false, error: String(error) };
  }
}

// POST - Publish a draft (requires admin auth)
// Pass sendEmail=true to also send to subscribers
// Pass sendTest=true to send a test email to admin first
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, summary, content, sendEmail = false, sendTest = false } = body;

    if (!id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    // If sendTest, just send test email without publishing
    if (sendTest) {
      // Get current draft (with any pending edits)
      const currentDraft = await prisma.newsletterDraft.findUnique({
        where: { id },
      });

      if (!currentDraft) {
        return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
      }

      const testResult = await sendTestEmail({
        title: title || currentDraft.title,
        summary: summary || currentDraft.summary,
        content: content || currentDraft.content,
        slug: currentDraft.slug,
        type: currentDraft.type,
      });

      return NextResponse.json({
        success: testResult.success,
        message: testResult.success
          ? `Test email sent to ${process.env.ADMIN_EMAIL}`
          : `Failed to send test email: ${testResult.error}`,
        testEmail: process.env.ADMIN_EMAIL,
      });
    }

    // Update the draft with any final edits and mark as published
    const draft = await prisma.newsletterDraft.update({
      where: { id },
      data: {
        title: title || undefined,
        summary: summary || undefined,
        content: content || undefined,
        status: 'published',
        publishDate: new Date(),
      },
    });

    let emailResult = null;
    if (sendEmail) {
      emailResult = await sendNewsletterToSubscribers({
        title: draft.title,
        summary: draft.summary,
        content: draft.content,
        slug: draft.slug,
        type: draft.type,
      });
    }

    return NextResponse.json({
      success: true,
      draft,
      message: sendEmail
        ? `Newsletter published and sent to ${emailResult?.successCount} subscribers`
        : 'Newsletter published successfully',
      emailResult,
    });
  } catch (error) {
    console.error('Failed to publish newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}

// Timing-safe secret comparison
function secureCompareSecret(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) {
    timingSafeEqual(Buffer.from(provided), Buffer.from(provided));
    return false;
  }
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

// GET - Quick approve via email link (with secret token)
// Shows confirmation page to prevent email client link prefetching from auto-approving
// Add &confirm=true to actually approve (user clicks button on confirmation page)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');
  const shouldSend = searchParams.get('send') === 'true';
  const confirmed = searchParams.get('confirm') === 'true';

  const adminSecret = process.env.ADMIN_APPROVE_SECRET;

  // Validate secret using timing-safe comparison
  if (!secret || !adminSecret || !secureCompareSecret(secret, adminSecret)) {
    return NextResponse.json({ error: 'Invalid or missing secret' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // If not confirmed, show confirmation page (prevents email client prefetch from auto-approving)
  if (!confirmed) {
    try {
      const draft = await prisma.newsletterDraft.findUnique({
        where: { id },
        select: { title: true, summary: true, status: true, slug: true },
      });

      if (!draft) {
        return new NextResponse('Newsletter not found', { status: 404 });
      }

      if (draft.status === 'published') {
        return NextResponse.redirect(`${siteUrl}/news/${draft.slug}?already_published=true`);
      }

      // Return confirmation page
      const confirmUrl = `${siteUrl}/api/newsletter/publish?id=${id}&secret=${secret}&confirm=true`;
      const confirmAndSendUrl = `${siteUrl}/api/newsletter/publish?id=${id}&secret=${secret}&confirm=true&send=true`;
      const previewUrl = `${siteUrl}/admin/newsletter?id=${id}`;

      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Approve Newsletter</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #0f172a; }
            .card { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .btn { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: 500; }
            .btn-primary { background: #10b981; color: white; }
            .btn-secondary { background: #0f172a; color: white; }
            .btn-outline { background: white; color: #0f172a; border: 1px solid #e2e8f0; }
            .note { color: #64748b; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Approve Newsletter?</h1>
          <div class="card">
            <h2 style="margin: 0 0 10px;">${draft.title}</h2>
            <p style="margin: 0; color: #64748b;">${draft.summary}</p>
          </div>
          <p>Click a button below to publish this newsletter:</p>
          <div>
            <a href="${confirmUrl}" class="btn btn-primary">Publish Only</a>
            <a href="${confirmAndSendUrl}" class="btn btn-secondary">Publish & Send to Subscribers</a>
            <a href="${previewUrl}" class="btn btn-outline">Preview First</a>
          </div>
          <p class="note">This page prevents accidental approval from email client link scanning.</p>
        </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } catch (error) {
      console.error('Failed to load draft:', error);
      return NextResponse.json({ error: 'Failed to load draft' }, { status: 500 });
    }
  }

  // Confirmed - actually publish
  try {
    const draft = await prisma.newsletterDraft.update({
      where: { id },
      data: {
        status: 'published',
        publishDate: new Date(),
      },
    });

    // Send to subscribers if requested
    if (shouldSend) {
      await sendNewsletterToSubscribers({
        title: draft.title,
        summary: draft.summary,
        content: draft.content,
        slug: draft.slug,
        type: draft.type,
      });
    }

    // Redirect to the published newsletter
    const sentParam = shouldSend ? '&sent=true' : '';
    return NextResponse.redirect(`${siteUrl}/news/${draft.slug}?published=true${sentParam}`);
  } catch (error) {
    console.error('Failed to quick-approve newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}
