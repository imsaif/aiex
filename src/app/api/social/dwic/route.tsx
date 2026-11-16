import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { loadFonts } from '@/app/api/og/shared';
import { buildDwicSlides, findArticle } from '@/lib/social/dwic';
import { SLIDE_COUNT, SLIDE_HEIGHT, SLIDE_WIDTH } from '@/lib/social/slides';
import { SlideImage, type Assets } from '@/lib/social/slide-render';

export const runtime = 'nodejs';

/**
 * The four slides for a designwithclaude.com article, in the newsletter's design.
 * GET /api/social/dwic?article=<slug>&n=1..4        → the PNG
 * GET /api/social/dwic?article=<slug>&format=json   → slide kinds + alt text
 * Admin only, like the newsletter slides.
 */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams, origin } = request.nextUrl;
  const article = findArticle(searchParams.get('article'));
  if (!article) return new Response('Unknown article', { status: 404 });

  const slides = buildDwicSlides(article);
  if (searchParams.get('format') === 'json') {
    return Response.json({ slides: slides.map(({ kind, alt }, i) => ({ n: i + 1, kind, alt })) });
  }

  const n = Number(searchParams.get('n') || '1');
  if (!Number.isInteger(n) || n < 1 || n > SLIDE_COUNT) {
    return new Response(`n must be 1 to ${SLIDE_COUNT}`, { status: 400 });
  }

  const { regular, bold } = await loadFonts();
  const assets: Assets = {
    name: 'designwithclaude',
    mark: `${origin}/images/social/dwic-mark.svg`,
    thinking: `${origin}/images/social/thinking.svg`,
    band: `${origin}/images/social/${article.band}.svg`,
    // The doodles are 116x160, not square like the aiux bands.
    band1: { width: 290, height: 400 },
    band4: { width: 270, height: 372 },
  };

  return new ImageResponse(<SlideImage slide={slides[n - 1]} n={n} assets={assets} edition="research" logos={[]} />, {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    fonts: [
      { name: 'Satoshi', data: regular, weight: 400, style: 'normal' },
      { name: 'Satoshi', data: bold, weight: 700, style: 'normal' },
    ],
    headers: {
      'Content-Disposition': `inline; filename="dwic-${article.slug}-${n}.png"`,
      'Cache-Control': 'private, max-age=300',
    },
  });
}
