import { Metadata } from 'next';
import { siteConfig } from '@/config/seo';

interface GenerateMetadataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  authors?: string[];
}

/**
 * Generate complete metadata for a page
 */
export function generateMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  keywords,
  publishedTime,
  authors,
}: GenerateMetadataProps): Metadata {
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const ogImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    keywords: keywords || undefined,
    authors: authors
      ? authors.map((name) => ({ name }))
      : [{ name: siteConfig.creator.name, url: siteConfig.links.portfolio }],
    openGraph: {
      type,
      locale: 'en_US',
      url: pageUrl,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime
        ? { publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator.twitter,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Custom SEO metadata for specific patterns
 */
const customPatternMetadata: Record<string, { title: string; description: string }> = {
  'progressive-disclosure': {
    title: 'Progressive Disclosure in AI — Pattern, Examples & Best Practices',
    description: 'Learn progressive disclosure for AI interfaces: gradually reveal complexity to reduce cognitive load. Real examples from ChatGPT, Claude, and Notion with interactive demos and implementation guidelines.',
  },
  'conversational-ui': {
    title: 'Conversational UI Design Pattern — Chat & Voice Interface Examples',
    description: 'Conversational UI design patterns with real examples from Slack, ChatGPT, and Siri. Interactive demos, implementation guidelines, and best practices for building chat and voice interfaces.',
  },
  'privacy-first-design': {
    title: 'Privacy-First AI Design — Data Minimization & Transparent Controls',
    description: 'Design AI products that prioritize user privacy. Patterns for data minimization, transparent consent, local-first processing, and privacy controls used by Apple, Signal, and DuckDuckGo.',
  },
  'confidence-visualization': {
    title: 'AI Confidence Scores UX — How to Show Confidence Levels to Users',
    description: 'How to display AI confidence scores and uncertainty to users. Patterns for confidence gauges, probability indicators, and trust signals with examples from GitHub Copilot and medical AI.',
  },
  'adaptive-interfaces': {
    title: 'Adaptive Interfaces — AI-Powered UX That Learns User Behavior',
    description: 'Design interfaces that adapt to individual users. AI-driven layout changes, smart defaults, and personalized workflows with examples from Spotify, Netflix, and Notion.',
  },
  'context-switching': {
    title: 'Context Switching in AI — Helping Users Switch Between Tasks Seamlessly',
    description: 'How to handle context switching in AI chatbots and tools. Patterns for preserving state, managing multiple conversations, and reducing cognitive load across projects.',
  },
  'multimodal-interaction': {
    title: 'Multimodal Interaction Design — Voice, Touch, Gesture & Text Input Patterns',
    description: 'Design multimodal AI interfaces combining voice, touch, gesture, and text input. Examples from Siri, Google Lens, and GPT-4V with implementation guidelines for natural interaction.',
  },
  'feedback-loops': {
    title: 'AI Feedback Loops — Continuous Learning from User Input (Diagram & Examples)',
    description: 'Design effective AI feedback loops that learn from user corrections. Patterns for thumbs up/down, implicit signals, and corrective feedback with diagrams and real-world examples.',
  },
  'error-recovery': {
    title: 'Graceful Error Recovery in AI — Helping Users Recover from AI Mistakes',
    description: 'Design graceful error recovery for AI products. Patterns for handling wrong predictions, failed generations, and AI hallucinations with undo, retry, and fallback strategies.',
  },
  'contextual-assistance': {
    title: 'Contextual Assistance — Proactive AI Help Based on User Behavior',
    description: 'Design AI that offers help at the right moment without interrupting. Patterns for contextual suggestions, smart tooltips, and proactive assistance from Gmail, Notion, and GitHub Copilot.',
  },
};

/**
 * Generate metadata for pattern pages
 */
export function generatePatternMetadata({
  title,
  description,
  slug,
  category,
  tags,
  thumbnail,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  slug: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  datePublished?: string;
  dateModified?: string;
}): Metadata {
  // Check if this pattern has custom SEO metadata
  const customMetadata = customPatternMetadata[slug];

  // Use custom title or default format
  const pageTitle = customMetadata?.title || `${title} | AI Design Patterns`;

  // Use custom description or truncate default
  const pageDescription = customMetadata?.description ||
    (description.length > 160 ? `${description.substring(0, 157)}...` : description);

  // Use pattern thumbnail as OG image if available, otherwise use default
  const ogImage = thumbnail && thumbnail.startsWith('/images/')
    ? thumbnail
    : '/images/og/og-pattern-default.png';

  // Generate keywords from tags and category
  const keywords = [
    'AI design pattern',
    category.toLowerCase(),
    ...(tags || []),
    'AI UX',
    'machine learning interface',
  ];

  // Use dateModified if available, otherwise use datePublished
  const publishedTime = dateModified || datePublished;

  return generateMetadata({
    title: pageTitle,
    description: pageDescription,
    image: ogImage,
    url: `/patterns/${slug}`,
    type: 'article',
    keywords,
    publishedTime,
  });
}

/**
 * Generate metadata for the homepage
 */
export function generateHomeMetadata(): Metadata {
  return generateMetadata({
    title: 'AIUX — AI UX Design Patterns | 36 Patterns from 50+ Shipped Products',
    description:
      'A framework of 36 AI UX design patterns documented from ChatGPT, Claude, GitHub Copilot, Midjourney, and 50+ shipped AI products. Real examples, code demos, and actionable guidance for designing AI-powered experiences.',
    url: '/',
    keywords: [
      'AI design patterns',
      'AI UX patterns',
      'machine learning UI',
      'artificial intelligence design',
      'AI user experience',
      'design system',
      'UX best practices',
      'AI interface design',
    ],
  });
}

/**
 * Generate metadata for the search page
 */
export function generateSearchMetadata(): Metadata {
  return generateMetadata({
    title: 'Search AI Design Patterns',
    description:
      'Search through AI design patterns to find the perfect solution for your AI-powered product. Filter by category, tags, and keywords.',
    url: '/search',
    keywords: [
      'search AI patterns',
      'find AI design patterns',
      'AI UX search',
      'design pattern search',
    ],
  });
}
