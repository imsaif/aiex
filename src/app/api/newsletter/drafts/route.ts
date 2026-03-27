import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

// GET - List drafts with pagination (requires admin auth)
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // Single draft by ID — returns full content
    const id = searchParams.get('id');
    if (id) {
      const draft = await prisma.newsletterDraft.findUnique({ where: { id } });
      if (!draft) {
        return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
      }
      return NextResponse.json(draft);
    }

    // Paginated list — lightweight (no content/sources/structuredData)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const [drafts, total] = await Promise.all([
      prisma.newsletterDraft.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          status: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          publishDate: true,
        },
      }),
      prisma.newsletterDraft.count(),
    ]);

    return NextResponse.json({
      drafts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('Failed to fetch drafts:', error);
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}

// PATCH - Update a draft (requires admin auth)
export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, summary, content, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    const updateData: {
      title?: string;
      summary?: string;
      content?: string;
      status?: string;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;

    const draft = await prisma.newsletterDraft.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(draft);
  } catch (error) {
    console.error('Failed to update draft:', error);
    return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 });
  }
}

// DELETE - Delete a draft (requires admin auth)
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    await prisma.newsletterDraft.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete draft:', error);
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 });
  }
}
