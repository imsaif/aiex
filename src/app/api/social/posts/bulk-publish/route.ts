import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

/**
 * Bulk publish all pending social posts for a newsletter
 * POST /api/social/posts/bulk-publish
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { newsletterId } = body;

    if (!newsletterId) {
      return NextResponse.json(
        { error: 'newsletterId is required' },
        { status: 400 }
      );
    }

    // Get all draft posts for this newsletter
    const draftPosts = await prisma.socialPost.findMany({
      where: {
        newsletterId,
        status: 'draft',
      },
      select: {
        id: true,
        platform: true,
      },
    });

    if (draftPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No draft posts to publish',
        results: [],
      });
    }

    // Get base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Get auth cookie for internal requests
    const cookies = request.headers.get('cookie') || '';

    // Publish each post sequentially to avoid rate limits
    const results: Array<{
      id: string;
      platform: string;
      success: boolean;
      postUrl?: string;
      error?: string;
    }> = [];

    for (const post of draftPosts) {
      try {
        const publishResponse = await fetch(
          `${baseUrl}/api/social/posts/${post.id}/publish`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: cookies,
            },
          }
        );

        const publishResult = await publishResponse.json();

        if (publishResponse.ok) {
          results.push({
            id: post.id,
            platform: post.platform,
            success: true,
            postUrl: publishResult.post?.platformPostUrl,
          });
        } else {
          results.push({
            id: post.id,
            platform: post.platform,
            success: false,
            error: publishResult.error || 'Unknown error',
          });
        }
      } catch (error) {
        results.push({
          id: post.id,
          platform: post.platform,
          success: false,
          error: error instanceof Error ? error.message : 'Publishing failed',
        });
      }

      // Small delay between posts to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: failCount === 0,
      message: `Published ${successCount}/${results.length} posts${failCount > 0 ? ` (${failCount} failed)` : ''}`,
      results,
    });
  } catch (error) {
    console.error('Failed to bulk publish posts:', error);
    return NextResponse.json(
      { error: 'Failed to bulk publish posts' },
      { status: 500 }
    );
  }
}
