import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SocialProof } from '@/components/audit/SocialProof';
import AuditClient from './audit-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free AI UX Audit Tool — Score Your AI Interface Design | AIUX',
  description: 'Free AI UX audit tool — upload a screenshot of your chatbot, AI agent, or dashboard and get instant feedback. Scores against 36 proven design patterns from ChatGPT, Copilot, and Notion. No signup required.',
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
    canonical: 'https://www.aiuxdesign.guide/audit',
  },
  openGraph: {
    title: 'Free AI UX Audit Tool — Score Your AI Interface Design',
    description: 'Upload your AI interface screenshot and get instant UX feedback scored against 36 proven design patterns. Free, no signup.',
    url: 'https://www.aiuxdesign.guide/audit',
    siteName: 'AI UX Design Guide',
    type: 'website',
    images: [
      {
        url: '/images/og/og-pattern-default.png',
        width: 1200,
        height: 630,
        alt: 'AI UX Audit Tool — Score your AI interface against 36 proven design patterns',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI UX Audit Tool — Score Your AI Interface Design',
    description: 'Upload your AI interface screenshot and get instant UX feedback scored against 36 proven design patterns. Free, no signup.',
    images: ['/images/og/og-pattern-default.png'],
    creator: '@aiuxdesignguide',
  },
};

// FAQ structured data for featured snippets
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an AI UX audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An AI UX audit analyzes your AI interface design against proven UX patterns. It identifies which patterns your product implements well, which need improvement, and which are missing — giving you a score and actionable recommendations. Try the free AI UX audit tool at aiuxdesign.guide/audit to score your design against 36 research-backed patterns.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI UX audit tool work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload a screenshot of your AI interface (chatbot, code assistant, dashboard, etc.) and the tool instantly analyzes it against 36 research-backed AI UX patterns. You get a score, pattern-by-pattern breakdown, and can chat with an AI design mentor for deeper insights. See real-world examples from ChatGPT, GitHub Copilot, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'What AI interfaces can I audit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can audit any AI-powered interface: chatbots (like ChatGPT or Claude), code assistants (like GitHub Copilot or Cursor), AI dashboards, content generators, AI agents, and more. The tool supports both mobile and desktop screenshots. Upload yours at aiuxdesign.guide/audit for instant feedback.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the AI UX audit tool free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the AI UX audit tool is completely free with a daily limit of 3 analyses. No signup or account is required. Your screenshots are never stored. Get started at aiuxdesign.guide/audit.',
      },
    },
  ],
};

// WebApplication structured data for tool rich results
const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI UX Audit Tool',
  url: 'https://www.aiuxdesign.guide/audit',
  description: 'Free tool that scores AI interface designs against 36 proven UX patterns. Upload a screenshot, get instant feedback on usability strengths and gaps.',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Screenshot-based AI interface analysis',
    'Scores against 36 AI UX design patterns',
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

// Breadcrumb structured data
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.aiuxdesign.guide',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'AI UX Audit Tool',
      item: 'https://www.aiuxdesign.guide/audit',
    },
  ],
};

export default function AuditPage() {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <AuditClient />
      {/* Server-rendered SEO content — visible during intake flow, hidden via JS during results */}
      <div id="audit-social-proof">
        <SocialProof />
      </div>
      <Footer />
    </>
  );
}
