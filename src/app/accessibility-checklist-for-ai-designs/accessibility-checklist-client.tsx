'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  NewspaperIcon,
  Squares2X2Icon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

type Check = {
  number: string;
  title: string;
  desc: ReactNode;
  pct?: string;
  /** severity heat token index (1 = highest failure rate) */
  severity: number;
};

const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-white/10 px-1 py-0.5 text-[0.9em] text-gray-200">{children}</code>
);

const checks: Check[] = [
  {
    number: '1',
    title: 'Skip navigation link',
    desc: 'A link that lets keyboard users jump past repeated nav. Tab into the page: does "skip to main content" appear?',
    pct: '95%',
    severity: 1,
  },
  {
    number: '2',
    title: 'Labeled main content area',
    desc: (
      <>
        The primary region must use <Code>&lt;main&gt;</Code> or <Code>role=&quot;main&quot;</Code>.
        Does a landmark wrap the content?
      </>
    ),
    pct: '53%',
    severity: 2,
  },
  {
    number: '3',
    title: 'Labels on every form field',
    desc: 'Every input needs a programmatically associated label. Placeholder text does not count: it disappears on typing.',
    pct: '49%',
    severity: 2,
  },
  {
    number: '4',
    title: 'One h1, headings step down',
    desc: 'One page title (h1), then h2s for sections, h3s for subsections. No skipped levels (h1 to h3).',
    pct: '42%',
    severity: 3,
  },
  {
    number: '5',
    title: 'Real buttons, not styled links',
    desc: (
      <>
        Actions use <Code>&lt;button&gt;</Code>, navigation uses <Code>&lt;a&gt;</Code>. A{' '}
        <Code>div onClick</Code> is neither. Can you activate every action with Enter and Space?
      </>
    ),
    pct: '36%',
    severity: 4,
  },
  {
    number: '6',
    title: 'No skipped heading levels',
    desc: 'AI often drops components with their own h2 inside a section already using h2. Run a second heading pass after components are added.',
    pct: '29%',
    severity: 5,
  },
  {
    number: '7',
    title: 'Names on icon-only buttons',
    desc: (
      <>
        A button with only an icon needs <Code>aria-label</Code> or a visually-hidden label. What
        does a screen reader announce when focused?
      </>
    ),
    pct: '19%',
    severity: 6,
  },
  {
    number: 'A',
    title: 'Motion respects prefers-reduced-motion',
    desc: '1 in 3 AI-generated screens miss this. Make it a standing review question alongside loading states.',
    pct: '33%',
    severity: 7,
  },
  {
    number: 'B',
    title: 'Copy rewritten by hand',
    desc: 'Generic CTAs ("click here") appeared in 95% of projects. AI defaults to vague language; specific, action-first copy still needs a human.',
    pct: '95%',
    severity: 7,
  },
  {
    number: 'C',
    title: 'Two separate sign-offs',
    desc: '"Looks right" and "is accessible" are different approvals. A missing label or a fake button is a defect, same as a broken checkout.',
    severity: 7,
  },
];

const useCases = [
  'Design reviews of AI-generated UI',
  'Accessibility QA before handoff',
  'Auditing AI-built prototypes',
  'EU Accessibility Act compliance',
  'Aligning design and dev on a11y',
];

/** How many of the 10 checks are visible before the email gate. Kept low so the
 * whole right panel fits one viewport without scrolling, like the agentic page. */
const PREVIEW_COUNT = 4;

/** Severity hues light enough to need dark (navy) chip text for WCAG AA contrast. */
const DARK_CHIP_TEXT = new Set([2, 3, 5, 6]);

function CheckCard({ check }: { check: Check }) {
  const darkText = DARK_CHIP_TEXT.has(check.severity);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
      <span className="w-4 flex-shrink-0 pt-0.5 text-xs font-bold text-gray-400">
        {check.number}
      </span>
      <div className="flex-1">
        <h3 className="mb-1 text-sm font-medium leading-tight text-white">{check.title}</h3>
        <p className="text-xs leading-relaxed text-gray-300">{check.desc}</p>
      </div>
      {check.pct && (
        <span
          className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${darkText ? '' : 'text-white'}`}
          style={{
            backgroundColor: `var(--severity-${check.severity})`,
            ...(darkText ? { color: 'var(--severity-7)' } : {}),
          }}
        >
          {check.pct}
        </span>
      )}
    </div>
  );
}

export function AccessibilityChecklistClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const previewChecks = checks.slice(0, PREVIEW_COUNT);
  const gatedChecks = checks.slice(PREVIEW_COUNT);

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = '/downloads/accessibility-checklist.pdf';
    link.download = 'accessibility-checklist-for-ai-designs.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'accessibility-checklist', website_url: '' }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnlocked(true);
        setStatus('idle');
        triggerDownload();
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Split Layout */}
      <section className="flex flex-col lg:min-h-screen lg:flex-row">
        {/* LEFT SIDE */}
        <div className="flex flex-1 flex-col justify-between bg-background px-6 py-8 sm:px-8 lg:px-16 lg:py-20 xl:px-20">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="mb-4 lg:mb-8">
              <span className="inline-block rounded-full bg-accent-primary/10 px-3 py-1.5 text-xs font-semibold text-accent-primary lg:px-4 lg:py-2">
                Free Download
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-text-primary lg:mb-6 lg:text-5xl">
              Accessibility Checklist for AI-Generated Designs
            </h1>

            {/* Subheading */}
            <p className="mb-6 text-base leading-relaxed text-text-secondary lg:mb-10 lg:text-lg">
              We audited <span className="font-semibold text-text-primary">123 AI-generated designs</span>{' '}
              and 74% failed at least one accessibility check. This 10-point review is what a design
              handoff now has to catch, ordered by how often each item breaks: skip links, landmarks,
              form labels, heading structure, and more.
            </p>

            {/* Use Cases - Pills (desktop) */}
            <div className="mb-10 hidden lg:block">
              <h2 className="mb-4 text-sm font-semibold text-text-primary">Use it for</h2>
              <div className="flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="inline-flex items-center rounded-full border border-primary bg-background-secondary px-4 py-2 text-sm text-text-secondary transition hover:border-accent-primary"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>

            {/* Continue Learning (desktop) */}
            <div className="hidden border-t border-primary pt-8 lg:block">
              <h2 className="mb-4 text-sm font-semibold text-text-primary">Continue Learning</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/news"
                  className="group flex items-center gap-3 rounded-xl border border-primary px-4 py-3 transition hover:border-accent-primary hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                    <NewspaperIcon className="h-5 w-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-text-primary transition group-hover:text-accent-primary">
                      Newsletter
                    </span>
                    <span className="text-xs text-text-secondary">Daily AI UX news</span>
                  </div>
                </Link>
                <Link
                  href="/#patterns"
                  className="group flex items-center gap-3 rounded-xl border border-primary px-4 py-3 transition hover:border-accent-primary hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                    <Squares2X2Icon className="h-5 w-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-text-primary transition group-hover:text-accent-primary">
                      36 Patterns
                    </span>
                    <span className="text-xs text-text-secondary">Browse the full library</span>
                  </div>
                </Link>
                <Link
                  href="/audit"
                  className="group flex items-center gap-3 rounded-xl border border-primary px-4 py-3 transition hover:border-accent-primary hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                    <BeakerIcon className="h-5 w-5 text-accent-primary" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-text-primary transition group-hover:text-accent-primary">
                      Pattern Audit Tool
                    </span>
                    <span className="text-xs text-text-secondary">Audit your AI patterns</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Back Link (desktop) */}
          <Link
            href="/"
            className="mt-10 hidden items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary lg:inline-flex"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* RIGHT SIDE - Accent Background */}
        <div className="flex flex-1 flex-col justify-center overflow-y-auto bg-accent-primary px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="mx-auto w-full max-w-lg">
            {/* What's Inside */}
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-300">
              What&apos;s Inside: 10 Checks
            </h2>

            {/* Preview: first checks, in the open */}
            <div className="space-y-3">
              {previewChecks.map((check) => (
                <CheckCard key={check.number} check={check} />
              ))}
            </div>

            {/* Gated remainder */}
            <div className="relative mt-3">
              <div
                className={
                  unlocked
                    ? 'space-y-3'
                    : 'pointer-events-none max-h-64 select-none space-y-3 overflow-hidden blur-sm'
                }
                aria-hidden={!unlocked}
              >
                {gatedChecks.map((check) => (
                  <CheckCard key={check.number} check={check} />
                ))}
              </div>

              {/* Gate overlay + email capture */}
              {!unlocked && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-b from-transparent via-accent-primary to-accent-primary pb-1 pt-20">
                  <div className="w-full rounded-lg border border-gray-700 bg-gray-900 p-5">
                    <p className="mb-1 text-base font-semibold text-white">
                      Unlock all 10 checks + the PDF
                    </p>
                    <p className="mb-4 text-xs leading-relaxed text-gray-300">
                      Enter your email to reveal the full checklist and download the printable PDF.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website_url"
                        value=""
                        onChange={() => {}}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: '-9999px',
                          top: '-9999px',
                          opacity: 0,
                          height: 0,
                          width: 0,
                          overflow: 'hidden',
                        }}
                      />
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <label htmlFor="a11y-email" className="sr-only">
                            Email address
                          </label>
                          <EnvelopeIcon
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                            aria-hidden="true"
                          />
                          <input
                            id="a11y-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            disabled={status === 'loading'}
                            className="w-full rounded-lg border border-gray-700 bg-gray-900 py-3 pl-12 pr-4 text-white placeholder:text-gray-400 transition-colors focus:border-white focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {status === 'loading' ? (
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <>
                              <ArrowDownTrayIcon className="h-5 w-5" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                      {status === 'error' && errorMessage && (
                        <p className="text-center text-sm text-red-400">{errorMessage}</p>
                      )}
                    </form>
                    <p className="mt-3 text-center text-xs leading-relaxed text-gray-300">
                      Downloads instantly. You&apos;ll also join{' '}
                      <span className="font-medium text-white">AI UX Daily</span>, our free
                      newsletter. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Post-unlock confirmation */}
            {unlocked && (
              <div className="mt-4">
                <div className="mb-3 rounded-lg border border-emerald-500 bg-emerald-500/20 p-4">
                  <p className="mb-1 font-semibold text-white">All 10 checks unlocked!</p>
                  <p className="text-sm text-emerald-200">Your PDF is downloading now.</p>
                </div>
                <button
                  onClick={triggerDownload}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download again
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <DocumentIcon className="mb-2 h-5 w-5 text-white" />
                <span className="text-xs text-gray-400">10 checks</span>
              </div>
              <div className="flex flex-col items-center">
                <CurrencyDollarIcon className="mb-2 h-5 w-5 text-white" />
                <span className="text-xs text-gray-400">100% free</span>
              </div>
              <div className="flex flex-col items-center">
                <BoltIcon className="mb-2 h-5 w-5 text-white" />
                <span className="text-xs text-gray-400">Instant download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only: Use Cases & Continue Learning */}
      <section className="border-t border-primary bg-background px-6 py-8 lg:hidden">
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">Use it for</h2>
          <div className="flex flex-wrap gap-2">
            {useCases.map((useCase) => (
              <span
                key={useCase}
                className="inline-flex items-center rounded-full border border-primary bg-background-secondary px-3 py-1.5 text-sm text-text-secondary"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">Continue Learning</h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/news"
              className="flex items-center gap-3 rounded-xl border border-primary px-4 py-3"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                <NewspaperIcon className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <span className="block text-sm font-medium text-text-primary">Newsletter</span>
                <span className="text-xs text-text-secondary">Daily AI UX news</span>
              </div>
            </Link>
            <Link
              href="/#patterns"
              className="flex items-center gap-3 rounded-xl border border-primary px-4 py-3"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                <Squares2X2Icon className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <span className="block text-sm font-medium text-text-primary">36 Patterns</span>
                <span className="text-xs text-text-secondary">Browse the full library</span>
              </div>
            </Link>
            <Link
              href="/audit"
              className="flex items-center gap-3 rounded-xl border border-primary px-4 py-3"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                <BeakerIcon className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <span className="block text-sm font-medium text-text-primary">Pattern Audit Tool</span>
                <span className="text-xs text-text-secondary">Audit your AI patterns</span>
              </div>
            </Link>
          </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Home
        </Link>
      </section>
    </div>
  );
}
