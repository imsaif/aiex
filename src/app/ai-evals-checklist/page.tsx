import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearnShell from '@/components/learn/LearnShell';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { EVAL_AFTERNOON } from '@/data/eval-afternoon';
import { siteConfig } from '@/config/seo';
import { EvalDownload } from './eval-download';
import { MarkArtifact, RecheckArtifact } from './worked-example';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * The quick version of the AI Evals for Designers course (2026-10-29): five
 * steps a designer can run in an afternoon. The steps are open and rendered on
 * the server so the page can be linked from articles and indexed; only the
 * PDF is behind an email.
 */

const URL = `${siteConfig.url}/ai-evals-checklist`;
const DESCRIPTION =
  'A five-step eval for designers: collect 20 real AI answers, mark pass or fail, group the notes, write one rule, then re-check. About two hours, no code. Free review sheet and PDF.';

export const metadata: Metadata = {
  title: 'AI Evals for Designers: Quick Checklist',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'AI Evals for Designers: Quick Checklist',
    description: DESCRIPTION,
    url: URL,
    siteName: siteConfig.name,
    type: 'article',
    images: [{ url: '/api/og/page?slug=ai-evals-checklist', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Evals for Designers: Quick Checklist',
    description: DESCRIPTION,
    images: ['/api/og/page?slug=ai-evals-checklist'],
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

          {/* The five steps, written for any AI product. Examples on the right are
              made-up illustrations for common products, labelled as such. */}
          <ol className="relative mt-roomy max-w-5xl">
            <span className="absolute left-4 top-2 bottom-2 w-px bg-border-primary md:left-5" aria-hidden />
            {steps.map((step) => (
              <li
                key={step.number}
                id={`step-${step.number}`}
                className="relative scroll-mt-24 pb-roomy pl-12 last:pb-0 md:grid md:grid-cols-[minmax(0,1fr)_20rem] md:gap-loose md:pl-16"
              >
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-pill bg-accent-primary type-caption font-mono font-semibold text-text-on-accent md:h-10 md:w-10">
                  {step.number}
                </span>
                <div className="md:pt-1">
                  <h2 className="type-h3 text-text-primary">{step.title}</h2>
                  <p className="mt-tight text-text-secondary">{step.body}</p>
                  <p className="mt-snug inline-flex items-center gap-1 type-caption text-text-secondary">
                    <ClockIcon className="h-4 w-4" aria-hidden />
                    About {step.minutes} min for 20 answers
                  </p>
                </div>
                <div className="mt-default rounded-card border border-border-primary bg-surface-primary p-default md:mt-0">
                  <p className="type-eyebrow text-text-secondary">For example</p>
                  <ul className="mt-snug space-y-snug">
                    {step.examples.map((ex, i) => (
                      <li key={i} className="text-sm">
                        <span className="block type-caption font-semibold text-text-secondary">{ex.product}</span>
                        <span className="text-text-primary">{ex.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          {/* The real study, told as one case. Its failures were specific to a
              screenshot-to-advice tool, so it is shown as how we did it, not as
              the rule to copy. */}
          <section className="mt-roomy max-w-5xl rounded-card bg-background-secondary p-loose md:p-roomy" aria-labelledby="ours-heading">
            <p className="type-eyebrow text-text-secondary">How we did it</p>
            <h2 id="ours-heading" className="type-h2 mt-tight text-text-primary">
              The same five steps on our own AI tool
            </h2>
            <p className="mt-tight max-w-3xl text-text-secondary">
              Our audit tool takes a screenshot of an AI product and returns design advice, so it fails in ways a chat or
              support product would not. Your piles and your rule will be different. What carries over is the method.
            </p>
            <ol className="mt-loose divide-y divide-border-primary rounded-card border border-border-primary bg-surface-primary">
              {steps.map((step) => (
                <li key={step.number} className="grid gap-tight p-default md:grid-cols-[12rem_minmax(0,1fr)] md:gap-loose">
                  <span className="flex items-center gap-tight font-semibold text-text-primary">
                    <span className="type-eyebrow font-mono text-text-secondary">{String(step.number).padStart(2, '0')}</span>
                    {step.short}
                  </span>
                  <span className="text-sm text-text-secondary">{step.ours}</span>
                </li>
              ))}
            </ol>
            <div className="mt-loose grid gap-default md:grid-cols-2">
              <MarkArtifact />
              <RecheckArtifact />
            </div>
            <Link
              prefetch={false}
              href="/guides/ai-evals-for-designers/the-study"
              className="mt-loose inline-flex font-semibold text-text-primary underline underline-offset-4 hover:text-accent-primary"
            >
              Read the full study
            </Link>
          </section>

          <section className="mt-roomy max-w-4xl" aria-labelledby="downloads-heading">
            <h2 id="downloads-heading" className="type-h2 text-text-primary">
              Run it on your product
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
              After one pass you know where your product fails and what to fix first. To check every release
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
