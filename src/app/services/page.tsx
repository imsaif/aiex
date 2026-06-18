import { Metadata } from 'next';
import {
  DocumentMagnifyingGlassIcon,
  ListBulletIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ServiceIntakeForm from './ServiceIntakeForm';

export const metadata: Metadata = {
  title: 'Audit My Product | Done-for-You AI UX Audit',
  description:
    'A senior, done-for-you AI-UX audit of your product. We score your real surfaces against 36 research-backed patterns and deliver a detailed report with prioritized recommendations, a walkthrough call, and an implementation-ready handoff for your engineers.',
  openGraph: {
    title: 'Audit My Product | Done-for-You AI UX Audit',
    description:
      'A senior, done-for-you AI-UX audit of your product: a detailed report scored against 36 patterns, prioritized recommendations, a walkthrough call, and an implementation-ready handoff.',
    url: 'https://www.aiuxdesign.guide/services',
    siteName: 'aiuxdesign.guide',
    type: 'website',
  },
  alternates: { canonical: 'https://www.aiuxdesign.guide/services' },
};

const DELIVERABLES = [
  {
    Icon: DocumentMagnifyingGlassIcon,
    title: 'A detailed report',
    body: 'Your real screens scored against 36 patterns, annotated and ranked by severity.',
  },
  {
    Icon: ListBulletIcon,
    title: 'Prioritized recommendations',
    body: 'A specific fix for each gap, with examples from leading AI products.',
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: 'A walkthrough call',
    body: 'A live session to talk through the findings and your roadmap.',
  },
  {
    Icon: CodeBracketIcon,
    title: 'Engineering handoff',
    body: 'A spec your team can ship, with a Claude Code or Cursor prompt.',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                Done-for-you audit
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: 'var(--text-hero)' }}
            >
              Get an AI-UX audit of your product
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              An AI design engineer reviews your whole product against 36 research-backed patterns
              and hands your team a report they can act on.
            </p>
            <a
              href="#start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-full font-medium hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Request an audit
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <p className="mt-4 text-sm text-text-tertiary">
              Priced per product. No payment now, just a quote first.
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10">What you get</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DELIVERABLES.map((d) => (
            <div
              key={d.title}
              className="rounded-card border border-border-primary bg-surface-primary p-6"
            >
              <div className="w-10 h-10 mb-4 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                <d.Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{d.title}</h3>
              <p className="text-text-secondary leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intake form */}
      <section id="start" className="border-t border-border-primary scroll-mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Request an audit</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Tell us about your product and we&apos;ll reply within 1-2 business days with a quote.
            </p>
          </div>
          <ServiceIntakeForm />
          <p className="mt-6 text-center text-sm text-text-tertiary">
            Prefer email?{' '}
            <a
              href="mailto:imranrizom@gmail.com?subject=Product%20audit%20enquiry"
              className="text-accent-primary hover:text-accent-hover transition-colors"
            >
              imranrizom@gmail.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
