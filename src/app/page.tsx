import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AuditClient from '@/components/audit/AuditClient';
import { PATTERN_COUNT } from '@/data/pattern-count';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `AI UX Audit: Turn Your Design Into Claude Skills`,
  description:
    `Upload any AI interface screenshot. See which of ${PATTERN_COUNT} patterns from 50+ shipped products you are missing, and take them away as Claude Code skills. Free, no signup.`,
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
    // Added Aug 2026 with the skills repositioning. Deliberately additive: the
    // audit terms above are what the page ranks for today, so they lead and stay.
    'claude skills',
    'claude code skills',
    'ai ux skills',
    'design skills for claude code',
  ],
  alternates: {
    canonical: 'https://www.aiuxdesign.guide/',
  },
  openGraph: {
    title: `AI UX Audit: Turn Your Design Into Claude Skills`,
    description:
      `Upload a screenshot. See which of ${PATTERN_COUNT} patterns you are missing and take them as Claude skills. Free, no signup.`,
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
    title: `AI UX Audit: Turn Your Design Into Claude Skills`,
    description:
      `Upload a screenshot. See which of ${PATTERN_COUNT} patterns you are missing and take them as Claude skills. Free.`,
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
        text: `An AI UX audit analyzes your AI interface design against proven UX patterns, identifying which ones your product handles well and which are missing. At aiuxdesign.guide the audit is free and hands back the patterns you are missing as Claude skills: a pack that installs into Claude Code and keeps applying them as you build, plus one-off fixes for the screen you uploaded. Scored against ${PATTERN_COUNT} research-backed patterns.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI UX audit tool work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Upload a screenshot of your AI interface (chatbot, code assistant, dashboard, and so on) and it is analyzed against ${PATTERN_COUNT} research-backed AI UX patterns. You get the patterns your design is missing, each one downloadable as a Claude skill, in a pack that unzips into .claude/skills/ and triggers on its own while you work. Examples are drawn from ChatGPT, GitHub Copilot, and 50+ shipped products.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What AI interfaces can I audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can audit any AI-powered interface: chatbots (like ChatGPT or Claude), code assistants (like GitHub Copilot or Cursor), AI dashboards, content generators, AI agents, and more. Mobile and desktop screenshots both work. Upload yours at aiuxdesign.guide and take the matching skills away with you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the AI UX audit tool free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The audit is free, includes a small number of runs, and the skill pack downloads free with it. No signup or account is required, and your screenshots are never stored. Get started at aiuxdesign.guide.',
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
    `Free tool that audits AI interface designs against ${PATTERN_COUNT} proven UX patterns and returns the missing ones as Claude skills. Upload a screenshot, download a pack that installs into Claude Code.`,
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
    'Missing patterns returned as installable Claude Code skills',
    'Downloadable skill pack, plus one-off fixes for the audited screen',
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
