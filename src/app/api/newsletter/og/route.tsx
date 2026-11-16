import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OG, OgCard } from '@/lib/social/og-card';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide';

// Product icon filenames (match /public/images/email/{name}.png)
const PRODUCT_ICON_NAMES: string[] = [
  'openai', 'vercel', 'figma', 'github', 'google', 'microsoft',
  'supabase', 'replit', 'claude', 'anthropic', 'cursor', 'notion',
  'linear', 'perplexity', 'ubereats', 'posthog',
];

function getProductIconUrl(productName: string): string {
  const name = productName.toLowerCase().replace(/\s+/g, '');
  for (const key of PRODUCT_ICON_NAMES) {
    if (name.includes(key)) return `${SITE_URL}/images/email/${key}.png`;
  }
  return `${SITE_URL}/images/email/fallback.png`;
}

interface NewsletterItem {
  product?: string;
  headline?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');

  if (!id && !slug) {
    return new Response('Missing newsletter id or slug', { status: 400 });
  }

  const newsletter = id
    ? await prisma.newsletterDraft.findUnique({
        where: { id },
        select: { title: true, type: true, publishDate: true, structuredData: true },
      })
    : await prisma.newsletterDraft.findFirst({
        where: { slug: slug!, status: 'published' },
        select: { title: true, type: true, publishDate: true, structuredData: true },
      });

  if (!newsletter) {
    return new Response('Newsletter not found', { status: 404 });
  }

  const data = newsletter.structuredData as { items?: NewsletterItem[] } | null;
  const items = (data?.items || []).slice(0, 5);

  const date = new Date(newsletter.publishDate);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isWeekly = newsletter.type === 'weekly';
  const label = isWeekly ? 'Weekly' : 'Daily';

  // Clean title: strip "AI UX Daily: " prefix
  const cleanTitle = newsletter.title
    .replace(/^AI UX (Daily|Weekly):\s*/i, '')
    .trim();

  return new ImageResponse(
    (
      <OgCard
        brandLabel={`AI UX ${label}`}
        date={dateStr}
        accent={isWeekly ? OG.purple : OG.navy}
        pill="aiuxdesign.guide"
        title={cleanTitle}
        items={items.map((item) => ({ ...item, icon: getProductIconUrl(item.product || '') }))}
        ctaText="Detailed product analysis & UX implications inside"
        ctaButton={`Read the full ${label.toLowerCase()} →`}
      />
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
