import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * Get a single social post
 * GET /api/social/posts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
          },
        },
        newsletter: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        id: post.id,
        newsletterId: post.newsletterId,
        newsletter: post.newsletter,
        platform: post.platform,
        content: post.content,
        threadContent: post.threadContent,
        hashtags: post.hashtags,
        status: post.status,
        platformPostId: post.platformPostId,
        platformPostUrl: post.platformPostUrl,
        errorMessage: post.errorMessage,
        postedAt: post.postedAt?.toISOString() || null,
        account: post.account,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to fetch social post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social post' },
      { status: 500 }
    );
  }
}

/**
 * Update a social post (content, hashtags, account)
 * PATCH /api/social/posts/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { content, threadContent, hashtags, accountId } = body;

    // Check if post exists and is still a draft
    const existingPost = await prisma.socialPost.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.status === 'posted') {
      return NextResponse.json(
        { error: 'Cannot edit a post that has already been published' },
        { status: 400 }
      );
    }

    // Build update data - using Prisma's expected types
    const updateData: Parameters<typeof prisma.socialPost.update>[0]['data'] = {};

    if (content !== undefined) {
      updateData.content = content;
    }

    if (threadContent !== undefined) {
      updateData.threadContent = threadContent || undefined;
    }

    if (hashtags !== undefined) {
      updateData.hashtags = hashtags;
    }

    if (accountId !== undefined) {
      // Verify account exists and is active
      if (accountId) {
        const account = await prisma.socialAccount.findUnique({
          where: { id: accountId },
          select: { id: true, isActive: true },
        });

        if (!account) {
          return NextResponse.json(
            { error: 'Account not found' },
            { status: 404 }
          );
        }

        if (!account.isActive) {
          return NextResponse.json(
            { error: 'Account is not active' },
            { status: 400 }
          );
        }
      }
      updateData.accountId = accountId;
    }

    // Reset status to draft if it was failed and content is being updated
    if (existingPost.status === 'failed' && content !== undefined) {
      updateData.status = 'draft';
      updateData.errorMessage = null;
    }

    const post = await prisma.socialPost.update({
      where: { id },
      data: updateData,
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        threadContent: post.threadContent,
        hashtags: post.hashtags,
        status: post.status,
        account: post.account,
        updatedAt: post.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to update social post:', error);
    return NextResponse.json(
      { error: 'Failed to update social post' },
      { status: 500 }
    );
  }
}

/**
 * Delete a social post
 * DELETE /api/social/posts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const post = await prisma.socialPost.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.socialPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete social post:', error);
    return NextResponse.json(
      { error: 'Failed to delete social post' },
      { status: 500 }
    );
  }
}
