import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { findArticle } from '@/lib/social/dwic';
import { OG, OgCard } from '@/lib/social/og-card';

export const runtime = 'nodejs';

/**
 * The 1200x630 share card for a designwithclaude.com article, in the newsletter's design.
 * GET /api/social/dwic/og?article=<slug>
 * Public, like the newsletter's card, so its URL can be pasted into a post.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const article = findArticle(searchParams.get('article'));
  if (!article) return new Response('Unknown article', { status: 404 });

  const icon = `${origin}/images/social/dwic-mark-dark.svg`;
  return new ImageResponse(
    (
      <OgCard
        markSrc={`${origin}/images/social/dwic-mark.svg`}
        brandLabel="Design Research"
        date={article.date}
        accent={OG.navy}
        pill="designwithclaude.com"
        title={article.title}
        items={article.card.items.map((item) => ({ ...item, icon }))}
        ctaText={article.card.ctaText}
        ctaButton={article.card.ctaButton}
      />
    ),
    { width: 1200, height: 630 }
  );
}
