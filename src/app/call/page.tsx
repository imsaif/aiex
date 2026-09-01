import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CallCheckout from '@/components/call/CallCheckout';
import { CALL_OFFER } from '@/lib/call-offer';

export const metadata: Metadata = {
  title: `Book a session | ${CALL_OFFER.priceLabel} for ${CALL_OFFER.durationLabel}`,
  description: `A ${CALL_OFFER.durationLabel} one-to-one working session on your own Claude Code or Claude Design project. Bring your codebase and your actual blockers.`,
  openGraph: {
    title: `Book a session | ${CALL_OFFER.priceLabel} for ${CALL_OFFER.durationLabel}`,
    description: `A ${CALL_OFFER.durationLabel} one-to-one working session on your own Claude Code or Claude Design project.`,
    url: 'https://www.aiuxdesign.guide/call',
    siteName: 'aiuxdesign.guide',
    type: 'website',
  },
  alternates: { canonical: 'https://www.aiuxdesign.guide/call' },
};

// A booking page has nothing to gain from being indexed on its own, but nothing
// to lose either — it is linked from the learning paths, which is how people
// will reach it.
const WHAT_HAPPENS = [
  {
    title: 'You send your project ahead',
    body: 'A repo, a Figma file, or a description of where you are stuck. Sent when you book, so no time is spent on setup.',
  },
  {
    title: `We work on it for ${CALL_OFFER.durationLabel}`,
    body: 'Live, screen shared, on your actual project rather than a worked example.',
  },
  {
    title: 'You keep whatever we make',
    body: 'Prompts, config, code, or a plan — written down in the call, not sent afterwards.',
  },
];

export default function CallPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-accent-primary border border-info">
                {CALL_OFFER.priceLabel} · {CALL_OFFER.durationLabel} · one to one
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: 'var(--text-hero)' }}
            >
              Work through your project with me
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              The courses on this site are free. This is the version where we open your
              project instead of an example, and spend {CALL_OFFER.durationLabel} on the
              part you are actually stuck on.
            </p>
            <CallCheckout />
          </div>
        </div>
      </section>

      {/* What happens */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {WHAT_HAPPENS.map((step, i) => (
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

      {/* Refund — a stranger paying up front needs this said plainly. */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-text-secondary">
            If the session is not useful, tell me and I will refund it. No form to fill in.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
