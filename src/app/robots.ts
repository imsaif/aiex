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
    '/*.json$',
    '/*.xml$',
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
    // Primary sitemap reference
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
