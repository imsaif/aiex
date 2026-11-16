import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { loadFonts } from '@/app/api/og/shared';
import { generateAside, generateReviewQuestion, parseNewsletterStructuredData } from '@/lib/social/content-generator';
import { DEFAULT_BAND_SLUG } from '@/lib/newsletter/band';
import { resolveStoryLogo } from '@/lib/social/story-logos';
import { buildSlides, SLIDE_COUNT, SLIDE_HEIGHT, SLIDE_WIDTH } from '@/lib/social/slides';
import { SlideImage, type Assets } from '@/lib/social/slide-render';

export const runtime = 'nodejs';

/**
 * One of the four LinkedIn/X images for an issue, in the newsletter's look.
 * GET /api/social/slides?id=<newsletterId>&n=1..4        → the PNG
 * GET /api/social/slides?id=<newsletterId>&format=json   → slide text + alt text
 * Admin only: it can render an issue that has not been published yet.
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams, origin } = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return new Response('Missing newsletter id', { status: 400 });

  const newsletter = await prisma.newsletterDraft.findUnique({
    where: { id },
    select: { title: true, summary: true, slug: true, type: true, publishDate: true, structuredData: true },
  });
  if (!newsletter) return new Response('Newsletter not found', { status: 404 });

  const data = parseNewsletterStructuredData(newsletter.structuredData);
  if (!data) return new Response('Newsletter has no structured data', { status: 400 });
  data.title = newsletter.title || data.title;
  data.summary = newsletter.summary || data.summary;
  data.type = newsletter.type === 'weekly' ? 'weekly' : 'daily';

  const dateLabel = new Date(newsletter.publishDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  // Slide 3's review question and aside are written once, on first need, and kept on the issue.
  const format = searchParams.get('format');
  const want = searchParams.get('n');
  const extras: Record<string, string> = {};
  if ((format === 'json' || want === '3') && !data.reviewQuestion) {
    const question = await generateReviewQuestion(data);
    if (question) extras.reviewQuestion = data.reviewQuestion = question;
  }
  if ((format === 'json' || want === '3') && !data.aside) {
    const aside = await generateAside(data);
    if (aside) extras.aside = data.aside = aside;
  }
  if (Object.keys(extras).length) {
    try {
      await prisma.newsletterDraft.update({
        where: { id },
        data: { structuredData: { ...(newsletter.structuredData as Prisma.JsonObject), ...extras } },
      });
    } catch (error) {
      console.error('Failed to store slide extras:', error);
    }
  }

  const slides = buildSlides(data, { dateLabel });

  if (searchParams.get('format') === 'json') {
    return Response.json({ slides: slides.map(({ kind, alt }, i) => ({ n: i + 1, kind, alt })) });
  }

  const n = Number(searchParams.get('n') || '1');
  if (!Number.isInteger(n) || n < 1 || n > SLIDE_COUNT) {
    return new Response(`n must be 1 to ${SLIDE_COUNT}`, { status: 400 });
  }

  const { regular, bold } = await loadFonts();
  const assets: Assets = {
    name: 'aiux',
    mark: `${origin}/images/email/aiux-mark.png`,
    // Noto Emoji 1f914 (Apache-2.0), kept locally so the slide never depends on an emoji CDN.
    thinking: `${origin}/images/social/thinking.svg`,
    band: `${origin}/images/newsletter/band/${data.bandSlug || data.idea?.patternSlug || DEFAULT_BAND_SLUG}.png`,
  };

  const slide = slides[n - 1];
  const logos =
    slide.kind === 'stories' ? await Promise.all(slide.stories.map((s) => resolveStoryLogo(s.product, origin))) : [];

  return new ImageResponse(<SlideImage slide={slide} n={n} assets={assets} edition={data.type} logos={logos} />, {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    fonts: [
      { name: 'Satoshi', data: regular, weight: 400, style: 'normal' },
      { name: 'Satoshi', data: bold, weight: 700, style: 'normal' },
    ],
    headers: {
      'Content-Disposition': `inline; filename="${newsletter.slug}-${n}.png"`,
      'Cache-Control': 'private, max-age=300',
    },
  });
}
