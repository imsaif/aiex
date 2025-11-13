import { patterns } from '@/data/patterns';
import { guides } from '@/data/guides';
import { siteConfig } from '@/config/seo';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = siteConfig.url;

  // Build image sitemap XML
  const patternImageEntries = patterns
    .filter((pattern) => pattern.thumbnail)
    .map((pattern) => {
      const thumbnail = pattern.thumbnail!; // Safe because we filtered for truthiness above
      const imageUrl = thumbnail.startsWith('http')
        ? thumbnail
        : `${baseUrl}${thumbnail}`;

      return `
  <url>
    <loc>${baseUrl}/patterns/${pattern.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(pattern.title)}</image:title>
      <image:caption>${escapeXml(pattern.description)}</image:caption>
    </image:image>
  </url>`;
    })
    .join('');

  const guideImageEntries = guides
    .filter((guide) => guide.thumbnail)
    .map((guide) => {
      const thumbnail = guide.thumbnail!; // Safe because we filtered for truthiness above
      const imageUrl = thumbnail.startsWith('http')
        ? thumbnail
        : `${baseUrl}${thumbnail}`;

      return `
  <url>
    <loc>${baseUrl}/guides/${guide.slug}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(guide.title)}</image:title>
      <image:caption>${escapeXml(guide.description)}</image:caption>
    </image:image>
  </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${patternImageEntries}${guideImageEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * Escape special XML characters to prevent parsing errors
 */
function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
