import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  // Per robots.txt spec, when a user-agent-specific group exists, that bot
  // ignores the wildcard groups entirely. So Googlebot's disallow list must
  // be explicit — don't rely on the `*` group to cascade.
  const disallow = [
    '/api/',
    '/admin/',
    // No blanket '/*.xml$' / '/*.json$' here: those patterns matched
    // /sitemap.xml itself, so Googlebot refused to read the sitemap
    // ("Sitemap could not be read" in Search Console). Build artifacts are
    // already covered by /.next/ and /api/.
    '/.next/',
    '/search',
    '/favorites',
    '/audit/results/',
    '/handbook/preview',
    '/download/',
  ];

  // Every page's og:image is generated under /api/, which the '/api/' rule
  // above blocks — so Google could not fetch a preview image for any post
  // (139 such URLs sat in "Blocked by robots.txt" in the 2026-09-11 Search
  // Console export). That rules the news section out of image-rich results and
  // Discover, where a crawlable image is effectively required. These four
  // routes are the only image generators; the rest of /api/ stays blocked.
  // Google resolves conflicts by longest match, so '/api/og/' (8 chars) wins
  // over '/api/' (5) without needing the disallow list to change.
  const allow = ['/', '/api/og/', '/api/newsletter/og'];

  return {
    rules: [
      {
        userAgent: '*',
        allow,
        disallow,
      },
      {
        userAgent: 'Googlebot',
        allow,
        disallow,
        crawlDelay: 0.5,
      },
    ],
    // Primary sitemap plus the image sitemap. The image sitemap was reachable
    // only because it had been submitted by hand in Search Console; declaring
    // it here survives a property reset and exposes it to other crawlers.
    // Note it has no .xml extension, which is why it kept being fetched
    // successfully while /sitemap.xml was blocked by the rule dropped above.
    // The news feed is listed alongside the sitemaps deliberately: Google accepts
    // an RSS/Atom feed as a discovery source, and because it carries only the
    // newest posts it gets picked up sooner than a full sitemap recrawl.
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images`, `${baseUrl}/news/rss.xml`],
    host: baseUrl,
  };
}
