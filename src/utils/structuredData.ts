import { Pattern } from '@/types';

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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${pattern.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pattern.introduction
        }
      },
      {
        '@type': 'Question',
        name: `When should I use ${pattern.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pattern.content.solution
        }
      },
      {
        '@type': 'Question',
        name: `What problem does ${pattern.title} solve?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pattern.content.problem
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
