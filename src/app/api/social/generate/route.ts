import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  generateSocialContent,
  parseNewsletterStructuredData,
  regeneratePlatformContent,
} from '@/lib/social/content-generator';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

function safeParseJson(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Generate social posts for a newsletter
 * POST /api/social/generate
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { newsletterId, regenerate, platform } = body;

    if (!newsletterId) {
      return NextResponse.json(
        { error: 'newsletterId is required' },
        { status: 400 }
      );
    }

    // Get the newsletter
    const newsletter = await prisma.newsletterDraft.findUnique({
      where: { id: newsletterId },
      select: {
        id: true,
        title: true,
        summary: true,
        slug: true,
        type: true,
        structuredData: true,
        socialPosts: {
          select: {
            id: true,
            platform: true,
            status: true,
          },
        },
      },
    });

    if (!newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
    }

    // Parse structured data
    const newsletterData = parseNewsletterStructuredData(newsletter.structuredData);

    if (!newsletterData) {
      return NextResponse.json(
        { error: 'Newsletter has no structured data for content generation' },
        { status: 400 }
      );
    }

    // Add title and summary from newsletter if not in structured data
    newsletterData.title = newsletterData.title || newsletter.title;
    newsletterData.summary = newsletterData.summary || newsletter.summary;
    newsletterData.type = (newsletter.type as 'daily' | 'weekly') || newsletterData.type;

    // Newsletter URL
    const newsletterUrl = `${SITE_URL}/news/${newsletter.slug}`;

    // Check for existing posts
    const existingTwitterPost = newsletter.socialPosts.find((p) => p.platform === 'twitter');
    const existingLinkedInPost = newsletter.socialPosts.find((p) => p.platform === 'linkedin');
    const existingRedditPost = newsletter.socialPosts.find((p) => p.platform === 'reddit');

    // If regenerating a specific platform
    if (regenerate && platform) {
      if (platform !== 'twitter' && platform !== 'linkedin' && platform !== 'reddit') {
        return NextResponse.json(
          { error: 'Invalid platform. Must be "twitter", "linkedin", or "reddit"' },
          { status: 400 }
        );
      }

      const content = await regeneratePlatformContent(platform, newsletterData, newsletterUrl);

      const existingPost = platform === 'twitter' ? existingTwitterPost : platform === 'reddit' ? existingRedditPost : existingLinkedInPost;

      if (existingPost) {
        // Update existing post
        if (existingPost.status === 'posted') {
          return NextResponse.json(
            { error: 'Cannot regenerate content for a post that has already been published' },
            { status: 400 }
          );
        }

        // For reddit, store title in threadContent; for twitter, store thread tweets
        const threadData = platform === 'reddit' && 'title' in content
          ? JSON.stringify([(content as { title: string }).title])
          : 'threadContent' in content && content.threadContent ? JSON.stringify(content.threadContent) : undefined;
        const updatedPost = await prisma.socialPost.update({
          where: { id: existingPost.id },
          data: {
            content: content.content,
            threadContent: threadData,
            hashtags: JSON.stringify('hashtags' in content ? content.hashtags : []),
            status: 'draft',
            errorMessage: null,
          },
        });

        return NextResponse.json({
          success: true,
          regenerated: true,
          posts: [
            {
              id: updatedPost.id,
              platform: updatedPost.platform,
              content: updatedPost.content,
              threadContent: updatedPost.threadContent ? safeParseJson(updatedPost.threadContent) : null,
              hashtags: safeParseJson(updatedPost.hashtags),
            },
          ],
        });
      } else {
        // Create new post
        const threadData = platform === 'reddit' && 'title' in content
          ? [(content as { title: string }).title]
          : ('threadContent' in content && content.threadContent) ? (content.threadContent as string[]) : null;
        const newPost = await createSocialPost(
          newsletterId,
          platform,
          content.content,
          threadData,
          'hashtags' in content ? content.hashtags : []
        );

        return NextResponse.json({
          success: true,
          regenerated: false,
          posts: [newPost],
        });
      }
    }

    // Generate content for both platforms
    const generatedContent = await generateSocialContent(newsletterData, newsletterUrl);

    const createdPosts: Array<{
      id: string;
      platform: string;
      content: string;
      threadContent?: string[] | null;
      hashtags: string[];
      isNew: boolean;
    }> = [];

    // Handle Twitter post
    if (existingTwitterPost) {
      if (existingTwitterPost.status !== 'posted' && regenerate) {
        const twitterThreadData = generatedContent.twitter.threadContent
          ? JSON.stringify(generatedContent.twitter.threadContent)
          : undefined;
        const updatedPost = await prisma.socialPost.update({
          where: { id: existingTwitterPost.id },
          data: {
            content: generatedContent.twitter.content,
            threadContent: twitterThreadData,
            hashtags: JSON.stringify(generatedContent.twitter.hashtags),
            status: 'draft',
            errorMessage: null,
          },
        });

        createdPosts.push({
          id: updatedPost.id,
          platform: 'twitter',
          content: updatedPost.content,
          threadContent: updatedPost.threadContent ? safeParseJson(updatedPost.threadContent) : null,
          hashtags: safeParseJson(updatedPost.hashtags),
          isNew: false,
        });
      }
      // Skip if post exists and not regenerating
    } else {
      const newPost = await createSocialPost(
        newsletterId,
        'twitter',
        generatedContent.twitter.content,
        generatedContent.twitter.threadContent,
        generatedContent.twitter.hashtags
      );
      createdPosts.push({ ...newPost, isNew: true });
    }

    // Handle LinkedIn post
    if (existingLinkedInPost) {
      if (existingLinkedInPost.status !== 'posted' && regenerate) {
        const updatedPost = await prisma.socialPost.update({
          where: { id: existingLinkedInPost.id },
          data: {
            content: generatedContent.linkedin.content,
            hashtags: JSON.stringify(generatedContent.linkedin.hashtags),
            threadContent: undefined,
            status: 'draft',
            errorMessage: null,
          },
        });

        createdPosts.push({
          id: updatedPost.id,
          platform: 'linkedin',
          content: updatedPost.content,
          hashtags: safeParseJson(updatedPost.hashtags),
          isNew: false,
        });
      }
      // Skip if post exists and not regenerating
    } else {
      const newPost = await createSocialPost(
        newsletterId,
        'linkedin',
        generatedContent.linkedin.content,
        undefined,
        generatedContent.linkedin.hashtags
      );
      createdPosts.push({ ...newPost, isNew: true });
    }

    // Handle Reddit post
    // Reddit content stores title in threadContent field as a single-element array
    if (existingRedditPost) {
      if (existingRedditPost.status !== 'posted' && regenerate) {
        const updatedPost = await prisma.socialPost.update({
          where: { id: existingRedditPost.id },
          data: {
            content: generatedContent.reddit.content,
            threadContent: JSON.stringify([generatedContent.reddit.title]),
            hashtags: JSON.stringify([]),
            status: 'draft',
            errorMessage: null,
          },
        });

        createdPosts.push({
          id: updatedPost.id,
          platform: 'reddit',
          content: updatedPost.content,
          threadContent: safeParseJson(updatedPost.threadContent),
          hashtags: [],
          isNew: false,
        });
      }
    } else {
      const newPost = await createSocialPost(
        newsletterId,
        'reddit',
        generatedContent.reddit.content,
        [generatedContent.reddit.title],
        []
      );
      createdPosts.push({ ...newPost, isNew: true });
    }

    return NextResponse.json({
      success: true,
      posts: createdPosts,
    });
  } catch (error) {
    console.error('Failed to generate social posts:', error);
    return NextResponse.json(
      { error: 'Failed to generate social posts' },
      { status: 500 }
    );
  }
}

async function createSocialPost(
  newsletterId: string,
  platform: 'twitter' | 'linkedin' | 'reddit',
  content: string,
  threadContent: string[] | null | undefined,
  hashtags: string[]
): Promise<{
  id: string;
  platform: string;
  content: string;
  threadContent?: string[] | null;
  hashtags: string[];
}> {
  // Get default account for platform
  const defaultAccount = await prisma.socialAccount.findFirst({
    where: {
      platform,
      isActive: true,
    },
    select: { id: true },
  });

  const post = await prisma.socialPost.create({
    data: {
      newsletterId,
      platform,
      content,
      threadContent: threadContent ? JSON.stringify(threadContent) : undefined,
      hashtags: JSON.stringify(hashtags),
      status: 'draft',
      accountId: defaultAccount?.id || null,
    },
  });

  return {
    id: post.id,
    platform: post.platform,
    content: post.content,
    threadContent: post.threadContent ? safeParseJson(post.threadContent) : null,
    hashtags: safeParseJson(post.hashtags),
  };
}
