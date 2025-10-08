/**
 * SEO Configuration
 * Central configuration for all SEO-related metadata across the site
 */

export const siteConfig = {
  name: 'AI Design Patterns',
  description: 'Discover comprehensive AI design patterns with real examples, code samples, and best practices. Learn how to design better AI experiences.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxdesign.guide',
  ogImage: '/images/og/og-home.png',
  links: {
    github: 'https://github.com/imsaif',
    linkedin: 'https://www.linkedin.com/in/imsaif/',
    portfolio: 'https://www.imranaidesign.com/',
  },
  creator: {
    name: 'Imran',
    twitter: '@imsaif',
  },
};

export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'AI design patterns',
    'AI UX patterns',
    'machine learning UI',
    'artificial intelligence design',
    'AI user experience',
    'design patterns',
    'AI interface design',
    'UX best practices',
    'AI product design',
  ],
  authors: [
    {
      name: siteConfig.creator.name,
      url: siteConfig.links.portfolio,
    },
  ],
  creator: siteConfig.creator.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
    creator: siteConfig.creator.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};
