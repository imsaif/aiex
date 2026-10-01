import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WorkshopBookedTracker from '@/components/workshop/WorkshopBookedTracker';
import { WORKSHOP } from '@/lib/workshop-offer';

// The Dodo link's redirect_url points here. Reached after paying, so it stays
// out of the index and the sitemap. It is still public to anyone with the URL,
// which is why the session link is never shown here: it goes out by email.
export const metadata: Metadata = {
  title: 'Your seat is held',
  robots: { index: false, follow: false },
};

const SETUP_STEPS = [
  {
    title: 'Install Claude Code',
    body: (
      <>
        Follow the install lesson in the free{' '}
        <Link
          href="/guides/claude-code-learning-path"
          className="text-accent-primary hover:text-accent-hover font-medium underline underline-offset-2"
        >
          Claude Code course
        </Link>
        . On Windows, use a new PowerShell window after installing, so the{' '}
        <code>claude</code> command is found.
      </>
    ),
  },
  {
    title: 'Sign in with your own account',
    body: (
      <>
        Run <code>claude</code> in a terminal and sign in with your paid Claude plan, or
        use your own Anthropic API key.
      </>
    ),
  },
  {
    title: 'Send a screenshot',
    body: (
      <>
        Ask Claude Code anything, then email a screenshot of its reply to{' '}
        <a
          href={`mailto:${WORKSHOP.contactEmail}?subject=Workshop%20setup%20check`}
          className="text-accent-primary hover:text-accent-hover font-medium underline underline-offset-2"
        >
          {WORKSHOP.contactEmail}
        </a>{' '}
        from the email you paid with.
      </>
    ),
  },
];

export default function WorkshopBookedPage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />
      <WorkshopBookedTracker />

      <section className="pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Payment received. Your seat is held.
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              One step left. Get Claude Code running on your own account before the day,
              and the session link comes to you by email once I have seen it working.
            </p>
          </div>

          <ol className="space-y-4">
            {SETUP_STEPS.map((step, i) => (
              <li
                key={step.title}
                className="p-6 rounded-2xl border border-border-primary bg-surface-primary"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-subtle text-accent-primary text-sm font-semibold mb-4">
                  {i + 1}
                </span>
                <h2 className="font-semibold mb-2 text-text-primary">{step.title}</h2>
                <p className="text-sm text-text-secondary">{step.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Stuck on setup? Email the error message to {WORKSHOP.contactEmail} and I will
            help you fix it before the session.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
