import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuditClient from './audit-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free AI UX Audit Tool — Screenshot to Actionable Feedback | AIUX',
  description: 'Upload your AI interface screenshot and get instant UX feedback. Scores your design against 36 proven AI UX patterns used by ChatGPT, GitHub Copilot, and Notion. Free, no signup required.',
  keywords: ['ai ux audit', 'ai ux audit tool', 'ai ux review', 'ux audit tool', 'ai interface review', 'ai-powered ux audit'],
  alternates: {
    canonical: 'https://www.aiuxdesign.guide/audit',
  },
  openGraph: {
    title: 'Free AI UX Audit Tool — Screenshot to Actionable Feedback',
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
    title: 'Free AI UX Audit Tool — Screenshot to Actionable Feedback',
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

export default function AuditPage() {
  return (
    <>
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <AuditClient />

      {/* Server-rendered SEO content — visible to Google, below the interactive canvas */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-text-primary mb-6">
          Free AI UX Audit Tool
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          An AI UX audit evaluates your AI interface against proven design patterns to identify usability strengths and gaps.
          Instead of relying on general UX heuristics, this tool scores your design against 36 patterns specifically researched
          for AI products — from <a href="/patterns/progressive-disclosure" className="text-accent-primary hover:underline">progressive disclosure</a> and <a href="/patterns/confidence-visualization" className="text-accent-primary hover:underline">confidence visualization</a> to <a href="/patterns/error-recovery" className="text-accent-primary hover:underline">error recovery</a> and <a href="/patterns/contextual-assistance" className="text-accent-primary hover:underline">contextual assistance</a>.
          Upload a screenshot of any AI interface (chatbot, code assistant, AI dashboard, or content generator) and get instant,
          actionable feedback on what to improve.
        </p>

        <h2 className="text-2xl font-bold text-text-primary mb-6">
          How it works
        </h2>
        <ol className="list-decimal list-inside text-text-secondary leading-relaxed space-y-3 mb-8">
          <li><strong className="text-text-primary">Upload</strong> a screenshot of your AI interface — supports desktop, mobile, and tablet designs</li>
          <li><strong className="text-text-primary">Analyze</strong> — the tool scores your design against 36 AI UX patterns used by products like ChatGPT, GitHub Copilot, and Notion</li>
          <li><strong className="text-text-primary">Get Insights</strong> — see which patterns are strong, weak, or missing, then chat with an AI design mentor for deeper guidance</li>
        </ol>

        <h2 className="text-2xl font-bold text-text-primary mb-6">
          What types of AI interfaces can you audit?
        </h2>
        <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-2 mb-8">
          <li><a href="/patterns/conversational-ui" className="text-accent-primary hover:underline">Chatbot and conversational AI</a> interfaces (ChatGPT, Claude, Gemini)</li>
          <li>Code assistants and AI coding tools (GitHub Copilot, Cursor, Replit)</li>
          <li>AI-powered dashboards and analytics tools</li>
          <li>Content generation and creative AI tools</li>
          <li>AI agents and automation interfaces</li>
        </ul>
      </section>

      <Footer />
    </>
  );
}
