import { Pattern, Guide } from '@/types';

/**
 * Generate JSON-LD structured data for Article schema
 * Helps search engines understand pattern pages and improves SEO
 */
export function generateArticleSchema(pattern: Pattern, url: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pattern.title,
    description: pattern.description,
    image: pattern.thumbnail ? `https://aiuxdesign.guide${pattern.thumbnail}` : undefined,
    author: {
      '@type': 'Person',
      name: 'Imran Mohammed',
      url: 'https://aiuxdesign.guide'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Design Patterns',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aiuxdesign.guide/logo.png'
      }
    },
    datePublished: pattern.datePublished,
    dateModified: pattern.dateModified || pattern.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    articleSection: pattern.category,
    keywords: pattern.tags?.join(', ')
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(schema));
}

/**
 * Generate JSON-LD structured data for FAQ schema
 * Helps pattern pages appear in Google's "People Also Ask" and featured snippets
 */
export function generateFAQSchema(pattern: Pattern) {
  if (!pattern.introduction) return null;

  // Append click-through hooks to FAQ answers so users visit the page
  // instead of getting the full answer from the featured snippet alone
  const exampleProducts = pattern.products?.slice(0, 3).join(', ') || 'leading AI products';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${pattern.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${pattern.introduction} See real-world examples from ${exampleProducts}, interactive demos, and implementation guidelines.`
        }
      },
      {
        '@type': 'Question',
        name: `When should I use ${pattern.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${pattern.content.solution} Includes code examples, design considerations, and Figma prompts for implementation.`
        }
      },
      {
        '@type': 'Question',
        name: `What problem does ${pattern.title} solve?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${pattern.content.problem} See how ${exampleProducts} solved this with before-and-after comparisons.`
        }
      }
    ]
  };

  return schema;
}

/**
 * Generate JSON-LD structured data for BreadcrumbList schema
 * Helps search engines understand site navigation structure
 */
export function generateBreadcrumbSchema(pattern: Pattern) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://aiuxdesign.guide'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Patterns',
        item: 'https://aiuxdesign.guide/#patterns'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pattern.category,
        item: `https://aiuxdesign.guide/#${pattern.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: pattern.title,
        item: `https://aiuxdesign.guide/patterns/${pattern.slug}`
      }
    ]
  };

  return schema;
}

/**
 * Generate JSON-LD structured data for HowTo schema
 * Helps implementation guidelines appear in rich results
 */
export function generateHowToSchema(pattern: Pattern) {
  if (!pattern.content.guidelines || pattern.content.guidelines.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Implement ${pattern.title}`,
    description: pattern.description,
    step: pattern.content.guidelines.map((guideline, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: guideline
    }))
  };

  return schema;
}

/**
 * Generate complete structured data for a pattern page
 * Combines all relevant schemas into a single JSON-LD block
 */
export function generatePatternStructuredData(pattern: Pattern) {
  const url = `https://aiuxdesign.guide/patterns/${pattern.slug}`;

  const schemas = [
    generateArticleSchema(pattern, url),
    generateBreadcrumbSchema(pattern),
    generateFAQSchema(pattern),
    generateHowToSchema(pattern)
  ].filter(Boolean); // Remove null values

  return schemas;
}

// --- Guide structured data ---

/**
 * Generate Course JSON-LD for guide pages
 * Helps Google show course rich results
 */
export function generateGuideCourseSchema(guide: Guide) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: guide.title,
    description: guide.excerpt || guide.description,
    provider: {
      '@type': 'Organization',
      name: 'AI UX Design Guide',
      url: 'https://aiuxdesign.guide',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      category: 'Free',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: `PT${guide.readTime}M`,
    },
    educationalLevel: guide.skillLevel,
    about: {
      '@type': 'Thing',
      name: guide.tool,
    },
    url: `https://aiuxdesign.guide/guides/${guide.slug}`,
    datePublished: guide.publishedDate,
    dateModified: guide.lastUpdatedDate || guide.publishedDate,
  };

  return schema;
}

/**
 * Generate Breadcrumb JSON-LD for guide pages
 */
export function generateGuideBreadcrumbSchema(guide: Guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://aiuxdesign.guide',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://aiuxdesign.guide/guides',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: `https://aiuxdesign.guide/guides/${guide.slug}`,
      },
    ],
  };
}

/**
 * Generate Article JSON-LD for guide pages
 */
export function generateGuideArticleSchema(guide: Guide) {
  const url = `https://aiuxdesign.guide/guides/${guide.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt || guide.description,
    image: guide.thumbnail ? (guide.thumbnail.startsWith('http') ? guide.thumbnail : `https://aiuxdesign.guide${guide.thumbnail}`) : undefined,
    author: {
      '@type': 'Person',
      name: 'Imran Mohammed',
      url: 'https://aiuxdesign.guide',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Design Patterns',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aiuxdesign.guide/logo.png',
      },
    },
    datePublished: guide.publishedDate,
    dateModified: guide.lastUpdatedDate || guide.publishedDate,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: guide.tags?.join(', '),
  };

  return JSON.parse(JSON.stringify(schema));
}

/**
 * Generate complete structured data for a guide page
 */
export function generateGuideStructuredData(guide: Guide) {
  return [
    generateGuideArticleSchema(guide),
    generateGuideBreadcrumbSchema(guide),
    generateGuideCourseSchema(guide),
  ];
}
