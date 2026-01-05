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

// POST - Publish a draft (requires admin auth)
// Pass sendEmail=true to also send to subscribers
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, summary, content, sendEmail = false } = body;

    if (!id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
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
// Add &send=true to also send to subscribers
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');
  const shouldSend = searchParams.get('send') === 'true';

  const adminSecret = process.env.ADMIN_APPROVE_SECRET;

  // Validate secret using timing-safe comparison
  if (!secret || !adminSecret || !secureCompareSecret(secret, adminSecret)) {
    return NextResponse.json({ error: 'Invalid or missing secret' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
  }

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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const sentParam = shouldSend ? '&sent=true' : '';
    return NextResponse.redirect(`${siteUrl}/news/${draft.slug}?published=true${sentParam}`);
  } catch (error) {
    console.error('Failed to quick-approve newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}
