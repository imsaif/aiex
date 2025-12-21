import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all drafts
export async function GET() {
  try {
    const drafts = await prisma.newsletterDraft.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(drafts);
  } catch (error) {
    console.error('Failed to fetch drafts:', error);
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}

// PATCH - Update a draft
export async function PATCH(request: NextRequest) {
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

// DELETE - Delete a draft
export async function DELETE(request: NextRequest) {
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
