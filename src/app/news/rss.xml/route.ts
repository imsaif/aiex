import { getNewsletters } from '@/data/newsletters';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/config/seo';

// Feed discovery surface for crawlers and readers. Mirrors /news: DB-published
// drafts merged with the static newsletters, static slug winning a collision.
// Regenerated hourly, plus on-demand from publish/route.ts so a new post shows
// up in the feed immediately rather than waiting out the TTL.
export const revalidate = 3600;

const FEED_LIMIT = 50;

type FeedItem = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: Date;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getDbItems(): Promise<FeedItem[]> {
  try {
    const drafts = await prisma.newsletterDraft.findMany({
      // Same quiet-day exclusion as the sitemap: those entries have no body and
      // their detail page 404s, so a reader clicking through would hit nothing.
      where: { status: 'published', readMinutes: { gt: 0 } },
      // `content` is deliberately not selected — it is the heaviest column and
      // the feed only needs the summary. See the note in /news/page.tsx.
      select: { title: true, slug: true, summary: true, publishDate: true },
      orderBy: { publishDate: 'desc' },
      take: FEED_LIMIT,
    });
    return drafts.map((d) => ({
      title: d.title,
      slug: d.slug,
      summary: d.summary ?? '',
      publishedAt: d.publishDate,
    }));
  } catch {
    // A feed missing its newest entries beats a 500 that makes readers drop it.
    return [];
  }
}

export async function GET() {
  const baseUrl = siteConfig.url;

  const staticItems: FeedItem[] = getNewsletters().map((n) => ({
    title: n.title,
    slug: n.slug,
    summary: n.summary ?? '',
    publishedAt: new Date(n.publishedAt),
  }));
  const staticSlugs = new Set(staticItems.map((i) => i.slug));

  const items = [...staticItems, ...(await getDbItems()).filter((d) => !staticSlugs.has(d.slug))]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, FEED_LIMIT);

  const lastBuild = (items[0]?.publishedAt ?? new Date()).toUTCString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI UX News</title>
    <link>${baseUrl}/news</link>
    <description>Daily UX-focused updates on ChatGPT, Claude, Gemini, Cursor and the rest of the AI product landscape.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${baseUrl}/news/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${baseUrl}/news/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/news/${item.slug}</guid>
      <description>${escapeXml(item.summary)}</description>
      <pubDate>${item.publishedAt.toUTCString()}</pubDate>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
