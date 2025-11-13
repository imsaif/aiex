import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*.json$',
          '/*.xml$',
          '/.next/',
        ],
      },
      {
        // GoogleBot specific rules for increased crawl depth
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.5,
      },
      {
        // Block low-value utility pages from indexing
        userAgent: '*',
        disallow: ['/search', '/favorites'],
      },
    ],
    // Primary sitemap reference
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
