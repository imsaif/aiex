import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AuditClient from '@/components/audit/AuditClient';
import { PATTERN_COUNT } from '@/data/pattern-count';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `AI UX Audit: Free Tool to Score Designs Against ${PATTERN_COUNT} Patterns`,
  description:
    `Upload any AI interface screenshot. Get instant feedback scored against ${PATTERN_COUNT} patterns from 50+ shipped products like ChatGPT, GitHub Copilot, and Notion. Free, no signup.`,
  keywords: [
    'ai ux audit',
    'ai ux audit tool',
    'ai ux review',
    'ux audit tool',
    'ai interface review',
    'ai-powered ux audit',
    'ai ux evaluation',
    'ux audit ai',
    'website ux audit ai',
    'free ai ux evaluation',
    'ai design review',
    'ai interface design audit',
  ],
  alternates: {
    canonical: 'https://www.aiuxdesign.guide/',
  },
  openGraph: {
    title: `AI UX Audit: Free Tool to Score Designs Against ${PATTERN_COUNT} Patterns`,
    description:
      `Upload any AI interface. Get instant feedback scored against ${PATTERN_COUNT} patterns from 50+ shipped products. Free, no signup.`,
    url: 'https://www.aiuxdesign.guide/',
    siteName: 'AI UX Design Guide',
    type: 'website',
    images: [
      {
        url: '/images/og/og-pattern-default.png',
        width: 1200,
        height: 630,
        alt: `AI UX Audit Tool — Score your AI interface against ${PATTERN_COUNT} proven design patterns`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `AI UX Audit Tool — ${PATTERN_COUNT} Pattern Analysis`,
    description:
      `Upload any AI interface. Get instant feedback against ${PATTERN_COUNT} patterns from 50+ products. Free.`,
    images: ['/images/og/og-pattern-default.png'],
    creator: '@aiuxdesignguide',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an AI UX audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `An AI UX audit analyzes your AI interface design against proven UX patterns. It identifies which patterns your product implements well, which need improvement, and which are missing — giving you a score and actionable recommendations. Try the free AI UX audit tool at aiuxdesign.guide to score your design against ${PATTERN_COUNT} research-backed patterns.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI UX audit tool work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Upload a screenshot of your AI interface (chatbot, code assistant, dashboard, etc.) and the tool instantly analyzes it against ${PATTERN_COUNT} research-backed AI UX patterns. You get a score, pattern-by-pattern breakdown, and can chat with an AI design mentor for deeper insights. See real-world examples from ChatGPT, GitHub Copilot, and more.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What AI interfaces can I audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can audit any AI-powered interface: chatbots (like ChatGPT or Claude), code assistants (like GitHub Copilot or Cursor), AI dashboards, content generators, AI agents, and more. The tool supports both mobile and desktop screenshots. Upload yours at aiuxdesign.guide for instant feedback.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the AI UX audit tool free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the AI UX audit tool is completely free and includes a small number of free audits. No signup or account is required. Your screenshots are never stored. Get started at aiuxdesign.guide.',
      },
    },
  ],
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI UX Audit Tool',
  url: 'https://www.aiuxdesign.guide/',
  description:
    `Free tool that scores AI interface designs against ${PATTERN_COUNT} proven UX patterns. Upload a screenshot, get instant feedback on usability strengths and gaps.`,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Screenshot-based AI interface analysis',
    `Scores against ${PATTERN_COUNT} AI UX design patterns`,
    'Pattern-by-pattern breakdown with recommendations',
    'AI design mentor chat for deeper insights',
    'Support for desktop and mobile screenshots',
  ],
  creator: {
    '@type': 'Organization',
    name: 'AI UX Design Guide',
    url: 'https://www.aiuxdesign.guide',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <Navbar />
      <AuditClient />
      <ScrollToTop />
    </>
  );
}
