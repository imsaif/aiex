import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Publish a draft (called from admin dashboard)
export async function POST(request: NextRequest) {
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
      message: 'Newsletter published successfully',
    });
  } catch (error) {
    console.error('Failed to publish newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}

// GET - Quick approve via email link (with secret token)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const secret = searchParams.get('secret');

  // Validate secret
  if (secret !== process.env.ADMIN_APPROVE_SECRET) {
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

    // Redirect to the published newsletter
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${siteUrl}/news/${draft.slug}?published=true`);
  } catch (error) {
    console.error('Failed to quick-approve newsletter:', error);
    return NextResponse.json({ error: 'Failed to publish newsletter' }, { status: 500 });
  }
}
