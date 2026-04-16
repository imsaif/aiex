import { MetadataRoute } from 'next';
import { patterns } from '@/data/patterns';
import categories from '@/data/categories';
import { guides } from '@/data/guides';
import { getAllLessonParams } from '@/lib/guides/lesson-urls';
import { siteConfig } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages with fixed priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    // /privacy and /terms removed — noindexed thin utility pages, frees crawl budget
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      // Patterns index — top of the patterns URL tree
      url: `${baseUrl}/patterns`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      // Guides index
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/audit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prompts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/agent-readability-audit-kit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // /search excluded — blocked in robots.txt
    // /aiuxdesign.gist.design removed — static file, not an indexable page
  ];

  // Pattern category index pages - 8 categories at /patterns/category/[slug]
  const patternCategoryPages: MetadataRoute.Sitemap = categories.map(
    (category) => ({
      url: `${baseUrl}/patterns/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })
  );

  // Pattern pages - 36 AI design patterns
  const patternPages: MetadataRoute.Sitemap = patterns.map((pattern) => ({
    url: `${baseUrl}/patterns/${pattern.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Guide course overview pages (5 courses)
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.lastUpdatedDate || guide.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Individual lesson pages — one URL per lesson across all courses (~66 pages)
  // Each lesson is indexable long-form content; this is where the guides SEO
  // traffic actually lives. Priority matches course overviews since lessons are
  // the primary entry points for tutorial search queries.
  const lessonPages: MetadataRoute.Sitemap = getAllLessonParams().map(
    ({ course, lesson }) => {
      const guide = guides.find((g) => g.slug === course);
      return {
        url: `${baseUrl}/guides/${course}/${lesson}`,
        lastModified: new Date(guide?.lastUpdatedDate || guide?.publishedDate || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    }
  );

  return [
    ...staticPages,
    ...patternCategoryPages,
    ...patternPages,
    ...guidePages,
    ...lessonPages,
  ];
}
