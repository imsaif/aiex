import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

interface SocialPostResponse {
  id: string;
  newsletterId: string;
  platform: 'twitter' | 'linkedin';
  content: string;
  threadContent: string[] | null;
  hashtags: string[];
  status: 'draft' | 'posted' | 'failed';
  platformPostId: string | null;
  platformPostUrl: string | null;
  errorMessage: string | null;
  postedAt: string | null;
  account: {
    id: string;
    accountName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Get social posts for a newsletter
 * GET /api/social/posts?newsletterId=xxx
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newsletterId = request.nextUrl.searchParams.get('newsletterId');

  if (!newsletterId) {
    return NextResponse.json(
      { error: 'newsletterId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const posts = await prisma.socialPost.findMany({
      where: { newsletterId },
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
          },
        },
      },
      orderBy: {
        platform: 'asc',
      },
    });

    const response: SocialPostResponse[] = posts.map((post) => ({
      id: post.id,
      newsletterId: post.newsletterId,
      platform: post.platform as 'twitter' | 'linkedin',
      content: post.content,
      threadContent: post.threadContent ? parseJsonArray(post.threadContent) : null,
      hashtags: parseJsonArray(post.hashtags),
      status: post.status as 'draft' | 'posted' | 'failed',
      platformPostId: post.platformPostId,
      platformPostUrl: post.platformPostUrl,
      errorMessage: post.errorMessage,
      postedAt: post.postedAt?.toISOString() || null,
      account: post.account
        ? {
            id: post.account.id,
            accountName: post.account.accountName,
          }
        : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return NextResponse.json({ posts: response });
  } catch (error) {
    console.error('Failed to fetch social posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social posts' },
      { status: 500 }
    );
  }
}

/**
 * Create a new social post
 * POST /api/social/posts
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { newsletterId, platform, content, threadContent, hashtags } = body;

    // Validate required fields
    if (!newsletterId || !platform || !content) {
      return NextResponse.json(
        { error: 'newsletterId, platform, and content are required' },
        { status: 400 }
      );
    }

    if (platform !== 'twitter' && platform !== 'linkedin') {
      return NextResponse.json(
        { error: 'platform must be "twitter" or "linkedin"' },
        { status: 400 }
      );
    }

    // Verify newsletter exists
    const newsletter = await prisma.newsletterDraft.findUnique({
      where: { id: newsletterId },
      select: { id: true },
    });

    if (!newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
    }

    // Get default account for platform
    const defaultAccount = await prisma.socialAccount.findFirst({
      where: {
        platform,
        isActive: true,
      },
      select: { id: true },
    });

    // Create the post
    const post = await prisma.socialPost.create({
      data: {
        newsletterId,
        platform,
        content,
        threadContent: threadContent ? JSON.stringify(threadContent) : null,
        hashtags: JSON.stringify(hashtags || []),
        status: 'draft',
        accountId: defaultAccount?.id || null,
      },
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
        newsletterId: post.newsletterId,
        platform: post.platform,
        content: post.content,
        threadContent: post.threadContent,
        hashtags: post.hashtags,
        status: post.status,
        account: post.account,
        createdAt: post.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to create social post:', error);
    return NextResponse.json(
      { error: 'Failed to create social post' },
      { status: 500 }
    );
  }
}
