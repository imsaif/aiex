import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearnShell from '@/components/learn/LearnShell';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { EVAL_AFTERNOON } from '@/data/eval-afternoon';
import { siteConfig } from '@/config/seo';
import { EvalDownload } from './eval-download';

/**
 * The quick version of the AI Evals for Designers course (2026-10-29): five
 * steps a designer can run in an afternoon. The steps are open and rendered on
 * the server so the page can be linked from articles and indexed; only the
 * PDF is behind an email.
 */

const URL = `${siteConfig.url}/eval-your-ai-product`;
const DESCRIPTION =
  'A five-step eval for designers: collect 20 real AI answers, mark pass or fail, group the notes, write one rule, then re-check. About two hours, no code. Free review sheet and PDF.';

export const metadata: Metadata = {
  title: 'Eval Your AI Product in an Afternoon | Free Checklist',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Eval Your AI Product in an Afternoon',
    description: DESCRIPTION,
    url: URL,
    siteName: siteConfig.name,
    type: 'article',
    images: [{ url: '/api/og/page?slug=eval-your-ai-product', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eval Your AI Product in an Afternoon',
    description: DESCRIPTION,
    images: ['/api/og/page?slug=eval-your-ai-product'],
  },
};

export default function EvalAfternoonPage() {
  const { title, lead, steps } = EVAL_AFTERNOON;
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: DESCRIPTION,
    totalTime: 'PT2H',
    url: URL,
    step: steps.map((s) => ({ '@type': 'HowToStep', position: s.number, name: s.title, text: s.body })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <Navbar inConsole />
      <LearnShell sidebar={<LearnSidebar active="none" />}>
        <main id="main-content" className="pt-10 pb-16 text-text-primary">
          <nav className="mb-6 text-sm text-text-secondary" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-tight">
              <li>
                <Link prefetch={false} href="/resources" className="hover:text-text-primary">
                  Resources
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-text-primary">{title}</li>
            </ol>
          </nav>

          <header className="max-w-3xl">
            <p className="type-eyebrow text-text-secondary">Free checklist · about 2 hours</p>
            <h1 className="type-h1 mt-tight text-text-primary">{title}</h1>
            <p className="type-lead mt-default text-text-secondary">{lead}</p>
          </header>

          <ol className="mt-roomy max-w-3xl space-y-loose">
            {steps.map((step) => (
              <li key={step.number} className="flex gap-default">
                <span className="type-eyebrow font-mono mt-1 shrink-0 text-text-secondary" aria-hidden>
                  {String(step.number).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="type-h3 text-text-primary">{step.title}</h2>
                  <p className="mt-tight text-text-secondary">{step.body}</p>
                  <p className="mt-snug rounded-card bg-background-secondary px-default py-snug text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">From a real study: </span>
                    {step.example}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <section className="mt-roomy max-w-4xl" aria-labelledby="downloads-heading">
            <h2 id="downloads-heading" className="type-h2 text-text-primary">
              Take it with you
            </h2>
            <div className="mt-default">
              <EvalDownload />
            </div>
          </section>

          <section className="mt-roomy max-w-3xl border-t border-border-primary pt-loose" aria-labelledby="next-heading">
            <h2 id="next-heading" className="type-h3 text-text-primary">
              When you want more
            </h2>
            <p className="mt-tight text-text-secondary">
              After one afternoon you know where your product fails and what to fix first. To check every release
              without re-reading everything by hand, the course shows how to hand your rule to an AI reviewer and test
              that it agrees with you.
            </p>
            <div className="mt-default flex flex-wrap gap-snug">
              <Link
                prefetch={false}
                href="/guides/ai-evals-for-designers"
                className="rounded-pill bg-accent-primary px-loose py-tight text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover"
              >
                AI Evals for Designers course
              </Link>
              <Link
                prefetch={false}
                href="/guides/ai-evals-for-designers/the-study"
                className="rounded-pill border border-border-secondary px-loose py-tight text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary"
              >
                Read the full study
              </Link>
            </div>
          </section>
        </main>
      </LearnShell>
      <Footer />
    </>
  );
}
