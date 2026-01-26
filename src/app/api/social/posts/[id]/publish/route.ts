import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import * as twitter from '@/lib/social/twitter';
import * as linkedin from '@/lib/social/linkedin';

/**
 * Publish a social post to its platform
 * POST /api/social/posts/[id]/publish
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Get the post with its account
    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: {
        account: true,
        newsletter: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.status === 'posted') {
      return NextResponse.json(
        { error: 'Post has already been published', platformPostUrl: post.platformPostUrl },
        { status: 400 }
      );
    }

    if (!post.account) {
      return NextResponse.json(
        { error: 'No social account linked to this post. Please connect an account first.' },
        { status: 400 }
      );
    }

    if (!post.account.isActive) {
      return NextResponse.json(
        { error: 'The linked social account is not active' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (post.account.tokenExpiry && new Date() > post.account.tokenExpiry) {
      // Try to refresh token
      try {
        await refreshAccountToken(post.account.id, post.platform as 'twitter' | 'linkedin');
      } catch (refreshError) {
        return NextResponse.json(
          { error: 'Access token expired. Please reconnect your account.' },
          { status: 401 }
        );
      }
    }

    let platformPostId: string;
    let platformPostUrl: string;

    if (post.platform === 'twitter') {
      const result = await publishToTwitter(post);
      platformPostId = result.postId;
      platformPostUrl = result.postUrl;
    } else if (post.platform === 'linkedin') {
      const result = await publishToLinkedIn(post);
      platformPostId = result.postId;
      platformPostUrl = result.postUrl;
    } else {
      return NextResponse.json(
        { error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    // Update post status
    const updatedPost = await prisma.socialPost.update({
      where: { id },
      data: {
        status: 'posted',
        platformPostId,
        platformPostUrl,
        postedAt: new Date(),
        errorMessage: null,
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: updatedPost.id,
        status: updatedPost.status,
        platformPostId: updatedPost.platformPostId,
        platformPostUrl: updatedPost.platformPostUrl,
        postedAt: updatedPost.postedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to publish social post:', error);

    // Update post with error message
    const errorMessage = error instanceof Error ? error.message : 'Publishing failed';

    await prisma.socialPost.update({
      where: { id },
      data: {
        status: 'failed',
        errorMessage,
      },
    });

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

interface PostWithAccount {
  id: string;
  content: string;
  threadContent: string | null;
  hashtags: string;
  account: {
    id: string;
    accessToken: string;
    refreshToken: string | null;
    platformId: string | null;
    accountName: string;
  } | null;
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

async function publishToTwitter(
  post: PostWithAccount
): Promise<{ postId: string; postUrl: string }> {
  if (!post.account) {
    throw new Error('No Twitter account linked');
  }

  // Decrypt access token
  const tokens = twitter.decryptTokens({
    accessToken: post.account.accessToken,
    refreshToken: post.account.refreshToken,
  });

  // Build content with hashtags
  const hashtags = parseJsonArray(post.hashtags);
  const hashtagString = hashtags.length > 0
    ? '\n\n' + hashtags.map((h) => `#${h}`).join(' ')
    : '';

  const threadContent = parseJsonArray(post.threadContent);

  if (threadContent && threadContent.length > 0) {
    // Post as thread
    const allTweets = [post.content, ...threadContent];
    const result = await twitter.postThread(tokens.accessToken, allTweets);

    // Extract username from accountName (remove @ prefix)
    const username = post.account.accountName.replace('@', '');
    const postUrl = twitter.getTweetUrl(username, result.firstTweetId);

    return {
      postId: result.firstTweetId,
      postUrl,
    };
  } else {
    // Single tweet
    const tweetContent = post.content + hashtagString;
    const result = await twitter.postTweet(tokens.accessToken, tweetContent);

    const username = post.account.accountName.replace('@', '');
    const postUrl = twitter.getTweetUrl(username, result.id);

    return {
      postId: result.id,
      postUrl,
    };
  }
}

async function publishToLinkedIn(
  post: PostWithAccount
): Promise<{ postId: string; postUrl: string }> {
  if (!post.account) {
    throw new Error('No LinkedIn account linked');
  }

  if (!post.account.platformId) {
    throw new Error('LinkedIn account missing platform ID');
  }

  // Decrypt access token
  const tokens = linkedin.decryptTokens({
    accessToken: post.account.accessToken,
    refreshToken: post.account.refreshToken,
  });

  // Build content with hashtags
  const hashtags = parseJsonArray(post.hashtags);
  const hashtagString = hashtags.length > 0
    ? '\n\n' + hashtags.map((h) => `#${h}`).join(' ')
    : '';

  const fullContent = post.content + hashtagString;

  const result = await linkedin.createPost(
    tokens.accessToken,
    post.account.platformId,
    fullContent
  );

  const postUrl = linkedin.getPostUrl(result.activity);

  return {
    postId: result.id,
    postUrl,
  };
}

async function refreshAccountToken(
  accountId: string,
  platform: 'twitter' | 'linkedin'
): Promise<void> {
  const account = await prisma.socialAccount.findUnique({
    where: { id: accountId },
    select: {
      refreshToken: true,
    },
  });

  if (!account?.refreshToken) {
    throw new Error('No refresh token available');
  }

  let newTokens;

  if (platform === 'twitter') {
    const decryptedRefresh = twitter.decryptTokens({
      accessToken: '',
      refreshToken: account.refreshToken,
    }).refreshToken;

    if (!decryptedRefresh) {
      throw new Error('Failed to decrypt refresh token');
    }

    newTokens = await twitter.refreshAccessToken(decryptedRefresh);
    const encrypted = twitter.encryptTokens(newTokens);

    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        tokenExpiry: newTokens.expiresIn
          ? new Date(Date.now() + newTokens.expiresIn * 1000)
          : null,
      },
    });
  } else {
    const decryptedRefresh = linkedin.decryptTokens({
      accessToken: '',
      refreshToken: account.refreshToken,
    }).refreshToken;

    if (!decryptedRefresh) {
      throw new Error('Failed to decrypt refresh token');
    }

    newTokens = await linkedin.refreshAccessToken(decryptedRefresh);
    const encrypted = linkedin.encryptTokens(newTokens);

    await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        accessToken: encrypted.accessToken,
        refreshToken: encrypted.refreshToken,
        tokenExpiry: newTokens.expiresIn
          ? new Date(Date.now() + newTokens.expiresIn * 1000)
          : null,
      },
    });
  }
}
