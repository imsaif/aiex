import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { timingSafeEqual } from 'crypto';

// Accepts an explicit issue date (ISO string or ms epoch) for the rare case where
// a draft genuinely needs re-dating. Returns null for anything unparseable so the
// caller can reject rather than silently fall back to "now" — falling back to now
// is the exact bug this route had.
function parsePublishDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// POST — publish a draft (admin only). Marks the draft as published in our DB
// and revalidates the public /news pages. Admin copies the HTML from the admin
// UI and pastes into a new Beehiiv post to actually email subscribers
// (Beehiiv free/Launch tier has no Posts API).
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, summary, content, publishDate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    // publishDate is the ISSUE date, not the moment the button was pressed. It is
    // set at generation time and encoded in the slug (ai-ux-daily-aug-12-...), and
    // /news uses it for BOTH orderBy and the displayed date. Re-stamping it here
    // moved a backlog draft to today, reordered /news and stacked two issues on
    // one date (2026-08-03, again 2026-08-13). So we no longer write it on publish;
    // an explicit override is honoured for the rare deliberate re-date.
    const overrideDate = parsePublishDate(publishDate);
    if (publishDate !== undefined && !overrideDate) {
      return NextResponse.json({ error: 'Invalid publishDate' }, { status: 400 });
    }

    const draft = await prisma.newsletterDraft.update({
      where: { id },
      data: {
        title: title || undefined,
        summary: summary || undefined,
        content: content || undefined,
        status: 'published',
        ...(overrideDate ? { publishDate: overrideDate } : {}),
      },
    });

    revalidatePath('/news');
    revalidatePath(`/news/${draft.slug}`);

    return NextResponse.json({
      success: true,
      draft,
      message: 'Published to /news. Now copy the HTML and paste into Beehiiv to send.',
    });
  } catch (error) {
    console.error('Failed to publish newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}

function secureCompareSecret(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) {
    timingSafeEqual(Buffer.from(provided), Buffer.from(expected.padEnd(provided.length, '0').slice(0, provided.length)));
    return false;
  }
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

// GET — quick approve via email link. Shows confirmation page to prevent email
// client prefetching from auto-approving. Add &confirm=true to actually approve.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');
  const confirmed = searchParams.get('confirm') === 'true';

  const adminSecret = process.env.ADMIN_APPROVE_SECRET;

  if (!secret || !adminSecret || !secureCompareSecret(secret, adminSecret)) {
    return NextResponse.json({ error: 'Invalid or missing secret' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
          <p>Approving publishes the post on-site. To email subscribers, open the admin dashboard after approving, copy the HTML, and paste into a new Beehiiv post.</p>
          <div>
            <a href="${confirmUrl}" class="btn btn-primary">Publish</a>
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

  try {
    // Status only — publishDate stays as generated. See the note on the POST path.
    const draft = await prisma.newsletterDraft.update({
      where: { id },
      data: {
        status: 'published',
      },
    });

    revalidatePath('/news');
    revalidatePath(`/news/${draft.slug}`);

    return NextResponse.redirect(`${siteUrl}/news/${draft.slug}?published=true`);
  } catch (error) {
    console.error('Failed to quick-approve newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}
