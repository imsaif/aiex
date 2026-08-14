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

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow,
        crawlDelay: 0.5,
      },
    ],
    // Primary sitemap plus the image sitemap. The image sitemap was reachable
    // only because it had been submitted by hand in Search Console; declaring
    // it here survives a property reset and exposes it to other crawlers.
    // Note it has no .xml extension, which is why it kept being fetched
    // successfully while /sitemap.xml was blocked by the rule dropped above.
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images`],
    host: baseUrl,
  };
}
