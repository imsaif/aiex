import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { timingSafeEqual } from 'crypto';

// POST - Publish a draft to site (requires admin auth)
// Newsletter emails are now sent via Beehiiv dashboard, not from this route.
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, summary, content } = body;

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

    return NextResponse.json({
      success: true,
      draft,
      message: 'Published to site. Send newsletter via Beehiiv dashboard.',
    });
  } catch (error) {
    console.error('Failed to publish newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}

// Timing-safe secret comparison
function secureCompareSecret(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) {
    // Still do a comparison to prevent timing attacks revealing length mismatch
    timingSafeEqual(Buffer.from(provided), Buffer.from(expected.padEnd(provided.length, '0').slice(0, provided.length)));
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
          <p>Click a button below:</p>
          <div>
            <a href="${confirmUrl}" class="btn btn-primary">Publish to Site</a>
            <a href="${previewUrl}" class="btn btn-outline">Preview First</a>
          </div>
          <p class="note">After publishing, send the newsletter to subscribers via Beehiiv dashboard.</p>
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

    // Redirect to the published newsletter
    return NextResponse.redirect(`${siteUrl}/news/${draft.slug}?published=true`);
  } catch (error) {
    console.error('Failed to quick-approve newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}
