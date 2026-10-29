import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LearnShell from '@/components/learn/LearnShell';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { EVAL_AFTERNOON } from '@/data/eval-afternoon';
import { siteConfig } from '@/config/seo';
import { EvalDownload } from './eval-download';
import { STEP_ICONS, STEP_VISUALS } from './step-visuals';
import { BeakerIcon, ClockIcon } from '@heroicons/react/24/outline';

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

          {/* Overview: the whole afternoon at a glance. */}
          <ol className="mt-roomy grid max-w-5xl grid-cols-2 gap-snug sm:grid-cols-5" aria-label="The five steps">
            {steps.map((step) => {
              const Icon = STEP_ICONS[step.number];
              return (
                <li key={step.number}>
                  <a
                    href={`#step-${step.number}`}
                    className="group flex h-full flex-col gap-tight rounded-card border border-border-primary bg-surface-primary p-snug transition-colors hover:border-accent-primary"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-input bg-accent-subtle">
                        <Icon className="h-5 w-5 text-accent-primary" aria-hidden />
                      </span>
                      <span className="type-caption font-mono text-text-secondary">{String(step.number).padStart(2, '0')}</span>
                    </span>
                    <span className="font-semibold text-text-primary">{step.short}</span>
                    <span className="type-caption text-text-secondary">~{step.minutes} min</span>
                  </a>
                </li>
              );
            })}
          </ol>

          {/* The steps, each with a diagram of the work. */}
          <div className="mt-roomy max-w-5xl space-y-default">
            {steps.map((step) => {
              const Icon = STEP_ICONS[step.number];
              const Visual = STEP_VISUALS[step.number];
              return (
                <section
                  key={step.number}
                  id={`step-${step.number}`}
                  className="scroll-mt-24 grid gap-loose rounded-card border border-border-primary bg-surface-primary p-loose md:grid-cols-[minmax(0,1fr)_17rem]"
                  aria-labelledby={`step-${step.number}-title`}
                >
                  <div>
                    <div className="flex items-center gap-snug">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-input bg-accent-subtle">
                        <Icon className="h-5 w-5 text-accent-primary" aria-hidden />
                      </span>
                      <span className="type-eyebrow font-mono text-text-secondary">Step {step.number}</span>
                      <span className="ml-auto inline-flex items-center gap-1 type-caption text-text-secondary">
                        <ClockIcon className="h-4 w-4" aria-hidden />~{step.minutes} min
                      </span>
                    </div>
                    <h2 id={`step-${step.number}-title`} className="type-h3 mt-snug text-text-primary">
                      {step.title}
                    </h2>
                    <p className="mt-tight text-text-secondary">{step.body}</p>
                    <p className="mt-default flex gap-tight border-l-2 border-accent-primary/40 pl-snug text-sm text-text-secondary">
                      <BeakerIcon className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
                      <span>
                        <span className="font-semibold text-text-primary">In the study: </span>
                        {step.example}
                      </span>
                    </p>
                  </div>
                  <Visual />
                </section>
              );
            })}
          </div>

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
