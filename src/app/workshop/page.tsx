import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WorkshopCheckout from '@/components/workshop/WorkshopCheckout';
import { WORKSHOP } from '@/lib/workshop-offer';

export const metadata: Metadata = {
  title: `Claude Code workshop | ${WORKSHOP.formatLabel}, ${WORKSHOP.durationLabel}`,
  description: `A live online session where you build one real feature with Claude Code in ${WORKSHOP.durationLabel}, with help when you get stuck.`,
  openGraph: {
    title: `Claude Code workshop | ${WORKSHOP.formatLabel}, ${WORKSHOP.durationLabel}`,
    description: `Build one real feature with Claude Code in ${WORKSHOP.durationLabel}, live and online.`,
    url: 'https://www.aiuxdesign.guide/workshop',
    siteName: 'aiuxdesign.guide',
    type: 'website',
  },
  alternates: { canonical: 'https://www.aiuxdesign.guide/workshop' },
};

// Said before the pay button, not after it: the cost of a Claude plan sits on
// top of the ticket, and a buyer who learns that after paying asks for a refund.
const BEFORE_YOU_PAY = [
  'Your own paid Claude plan (Pro or higher) or Anthropic API credits. Free Claude accounts cannot run Claude Code.',
  'A laptop running macOS, Windows or Linux, where you can install software.',
  'About 20 minutes before the day to install Claude Code and check it runs.',
];

const HOW_IT_WORKS = [
  {
    title: 'Pay to hold your seat',
    body: 'Checkout takes a minute and accepts UPI and cards. Your seat is held the moment payment goes through.',
  },
  {
    title: 'Show Claude Code running',
    body: 'The next page walks you through setup. Send a screenshot of Claude Code running on your own account, so setup problems are solved before the session, not during it.',
  },
  {
    title: 'Get the session link',
    body: 'Once your setup is confirmed, the link arrives by email. On the day, we spend the whole session building.',
  },
];

export default function WorkshopPage() {
  const when = [WORKSHOP.dateLabel, WORKSHOP.timeLabel].filter(Boolean).join(', ');

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                {WORKSHOP.formatLabel} · {WORKSHOP.durationLabel}
                {WORKSHOP.seats > 0 ? ` · ${WORKSHOP.seats} seats` : ''}
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: 'var(--text-hero)' }}
            >
              Build a real feature with Claude Code
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-4">
              A live session where you build one working feature on your own project in{' '}
              {WORKSHOP.durationLabel}, with help on hand when you get stuck.
            </p>
            {when && <p className="text-lg font-medium text-text-primary mb-8">{when}</p>}
            <WorkshopCheckout />
          </div>
        </div>
      </section>

      {/* Before you pay */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What you need before you pay</h2>
          <ul className="space-y-3">
            {BEFORE_YOU_PAY.map((item) => (
              <li
                key={item}
                className="p-4 rounded-xl border border-border-primary bg-surface-primary text-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-text-secondary">
            New to Claude Code? The free{' '}
            <Link
              href="/guides/claude-code-learning-path"
              className="text-accent-primary hover:text-accent-hover font-medium underline underline-offset-2"
            >
              Claude Code course
            </Link>{' '}
            covers installation step by step.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.title}
                className="p-6 rounded-2xl border border-border-primary bg-surface-primary"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-subtle text-accent-primary text-sm font-semibold mb-4">
                  {i + 1}
                </span>
                <h3 className="font-semibold mb-2 text-text-primary">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
