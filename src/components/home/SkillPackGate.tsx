'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { PATTERN_COUNT } from '@/data/pattern-count';

/**
 * Homepage-only email gate for the full pattern skill pack.
 *
 * Why this exists, and why here rather than after the audit:
 *
 * The post-audit unlock (`PaywallModal`) asks for an email in exchange for more
 * audits. Since the source-enum bug was fixed on 2026-08-01 it has been shown to
 * six people — too few to learn anything from, because the audit only completes
 * about four times a week. The homepage saw 770 visitors in 90 days. If the
 * question is "will anyone trade an email for Claude skills", the homepage is
 * the only surface with enough people to answer it this month.
 *
 * Deliberately NOT gating the audit. Uploading a screenshot stays free and
 * ungated: it is the only qualification step the site has and it is already
 * thin. This is a second, parallel offer that needs no audit to claim — the
 * whole library as skills, which is exactly what the hero promises.
 */

const BENEFITS = [
  `One skill file per pattern, all ${PATTERN_COUNT}`,
  'Drop them in .claude/skills and Claude applies them as it builds',
  'Daily AI UX newsletter (unsubscribe anytime)',
];

interface SkillPackGateProps {
  /**
   * 'compact' sits directly under the hero CTA: one quiet line that expands
   * into an email row when clicked. The two placements tried before this both
   * failed for the same reason in opposite directions — the full-width
   * 'section' variant sat below the social-proof block where nobody scrolls,
   * and a bordered card between the logo row and the device mockups read as a
   * second hero competing with the first and cut the logos off from the
   * product shot. A collapsed line is visible without competing, and the
   * reveal-on-intent is the site's own Progressive Disclosure pattern.
   */
  variant?: 'section' | 'compact' | 'interstitial';
  /**
   * 'interstitial' only. Called after the email is captured, and also when the
   * person skips. The caller decides where they go next — today, on to the
   * audit they just asked for.
   */
  onDone?: () => void;
}

export function SkillPackGate({ variant = 'section', onDone }: SkillPackGateProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    // Once per mount. The homepage does not remount this on step changes, but
    // guard anyway so the denominator of the conversion rate stays honest.
    if (shown.current) return;
    shown.current = true;
    trackAuditEvent('skills_gate_shown');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // This literal MUST exist in NEWSLETTER_SOURCES. An unlisted value is a
        // silent 400 on a valid email — that is exactly how `audit-unlock`
        // captured nothing for two months.
        body: JSON.stringify({ email, source: 'homepage-skills-pack' }),
      });

      const data = await response.json();

      // An existing subscriber is not a failure: they still get the pack.
      if (!response.ok && !/already subscribed/i.test(data.error || '')) {
        throw new Error(data.error || 'Something went wrong');
      }

      trackAuditEvent('skills_gate_submitted');

      // Build the pack from the whole library. No audit is involved, so there
      // are no audits to attach.
      const [{ default: patterns }, { composeSkillPack, skillPackFilename }, { saveBlob }] =
        await Promise.all([
          import('@/data/patterns'),
          import('@/lib/skills/composePack'),
          import('@/lib/skills/auditPack'),
        ]);

      const files = composeSkillPack(patterns, []);
      const { zipSync, strToU8 } = await import('fflate');
      const zippable = Object.fromEntries(
        Object.entries(files).map(([path, contents]) => [path, strToU8(contents)])
      );
      saveBlob(
        new Blob([zipSync(zippable, { level: 6 }) as BlobPart], { type: 'application/zip' }),
        skillPackFilename()
      );

      trackAuditEvent('skills_gate_pack_downloaded', { skillCount: patterns.length });
      setSuccess(true);
      // Hand control back so the caller can continue the journey. Deliberately
      // after the download starts, not before, so nobody navigates away from a
      // pack that has not begun writing.
      onDone?.();
    } catch (err) {
      // Say what happened rather than leaving a dead button.
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // --- interstitial: shown on the way into the audit ----------------------
  //
  // Asked at the highest-intent moment on the page — the click on the hero CTA
  // — rather than after the audit, where the equivalent ask has reached six
  // people since August.
  //
  // Shows rather than explains. Two earlier versions failed in the same
  // direction: a bare email field said nothing about the value, and the prose
  // rewrite that followed said everything but made a designer read four
  // paragraphs to get it. The same AI suggestion is rendered twice below —
  // once as Claude builds it by default, once as Claude builds it with the
  // skills loaded. The difference is the argument, and it is legible in about
  // two seconds without reading a word of body copy.
  //
  // Deliberately SKIPPABLE: a hard gate would protect nothing and the audit
  // only completes about four times a week, so blocking it to harvest an email
  // would cost the one qualification step the site has. Skipping is tracked, so
  // the skip rate is itself the finding.
  if (variant === 'interstitial') {
    return (
      <div>
        <p className="text-sm text-text-secondary">
          The same AI suggestion, built without the skills and with them.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Without ------------------------------------------------------ */}
          <div>
            <div className="rounded-card border border-border-primary bg-surface-primary p-4 h-full">
              <p className="text-sm text-text-secondary mb-2">AI Assistant</p>
              <p className="text-sm text-text-primary leading-relaxed">
                Revenue is up 12% this month, driven by mobile checkout.
              </p>
              <div className="mt-4">
                <span className="inline-block px-3 py-1.5 rounded-pill bg-accent-primary text-white text-sm font-medium">
                  Apply
                </span>
              </div>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <span
                className="w-2 h-2 rounded-full bg-status-error shrink-0"
                aria-hidden="true"
              />
              Without the skills
            </p>
          </div>

          {/* With --------------------------------------------------------- */}
          <div>
            <div className="rounded-card border-2 border-accent-primary bg-surface-primary p-4 h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-secondary">AI Assistant</p>
                <p className="text-sm text-text-primary font-medium">82% sure</p>
              </div>
              <div
                className="h-1.5 w-full rounded-pill bg-surface-secondary overflow-hidden mb-3"
                aria-hidden="true"
              >
                <div className="h-full w-[82%] rounded-pill bg-accent-primary" />
              </div>
              <p className="text-sm text-text-primary leading-relaxed">
                Revenue is up 12% this month, driven by mobile checkout.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1.5 rounded-pill bg-accent-primary text-white text-sm font-medium">
                  Review, then apply
                </span>
                <span className="text-sm text-text-secondary underline underline-offset-4">
                  Undo
                </span>
              </div>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm text-text-primary font-medium">
              <CheckIcon className="w-4 h-4 shrink-0 text-accent-primary" aria-hidden="true" />
              With the skills
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-text-primary leading-relaxed">
          Confidence made visible, a human check before it acts, a way back. In the first
          version, not in your review notes.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2">
          <label htmlFor="skill-pack-email" className="sr-only">
            Email address
          </label>
          <input
            id="skill-pack-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'skill-pack-error' : 'skill-pack-terms'}
            className="flex-1 min-w-0 px-4 py-3 rounded-pill border border-border-primary bg-surface-primary text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 px-6 py-3 rounded-pill bg-accent-primary text-white text-sm font-semibold hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-60 transition-all"
          >
            {isLoading ? 'Sending…' : `Send all ${PATTERN_COUNT} skills`}
          </button>
        </form>

        {error && (
          <p id="skill-pack-error" role="alert" className="mt-2 text-sm text-status-error">
            {error}
          </p>
        )}

        <p id="skill-pack-terms" className="mt-3 text-sm text-text-secondary">
          Free, MIT licensed, works with Cursor and Copilot too. Includes the daily
          newsletter, unsubscribe anytime.
        </p>

        <div className="mt-4 pt-4 border-t border-border-primary text-center">
          <button
            type="button"
            onClick={() => {
              trackAuditEvent('skills_gate_skipped');
              onDone?.();
            }}
            className="text-sm text-text-secondary underline underline-offset-4 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-input px-1 py-0.5"
          >
            Skip, just start my audit
          </button>
        </div>
      </div>
    );
  }

  // --- compact: one line under the hero CTA, expands on intent -------------
  if (variant === 'compact') {
    if (success) {
      return (
        <p role="status" className="flex items-center justify-center gap-2 text-sm text-text-secondary">
          <CheckIcon className="w-4 h-4 text-accent-primary" aria-hidden="true" />
          Your pack is downloading. Check your Downloads folder.
        </p>
      );
    }

    if (!expanded) {
      return (
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
            trackAuditEvent('skills_gate_expanded');
          }}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill border-2 border-accent-primary bg-surface-primary text-accent-primary text-base font-semibold hover:bg-accent-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-all"
        >
          <ArrowDownTrayIcon className="w-5 h-5" aria-hidden="true" />
          Get all {PATTERN_COUNT} skills
        </button>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto text-center">
        <p className="text-sm text-text-secondary mb-3">
          Where should we send the {PATTERN_COUNT} skill files?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="skill-pack-email" className="sr-only">
            Email address
          </label>
          <input
            id="skill-pack-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'skill-pack-error' : undefined}
            className="flex-1 min-w-0 px-4 py-2.5 rounded-pill border border-border-primary bg-surface-primary text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 px-5 py-2.5 rounded-pill bg-accent-primary text-white text-sm font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-60 transition-all"
          >
            {isLoading ? 'Building\u2026' : 'Send them'}
          </button>
        </form>
        {error && (
          <p id="skill-pack-error" role="alert" className="mt-2 text-sm text-status-error">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <section
      aria-labelledby="skill-pack-heading"
      className="w-full border-t border-border-primary bg-surface-secondary"
    >
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:py-20 text-center">
        <h2
          id="skill-pack-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.15] text-text-primary"
        >
          Take all {PATTERN_COUNT} patterns as Claude skills
        </h2>
        <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
          Get the whole library as skill files, so Claude applies these patterns while it
          builds instead of after you catch them in review.
        </p>

        <ul className="mt-6 space-y-2 text-left inline-block">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckIcon className="w-4 h-4 mt-0.5 shrink-0 text-accent-primary" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {success ? (
          <p
            role="status"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-text-primary"
          >
            <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
            Your pack is downloading. Check your Downloads folder.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <label htmlFor="skill-pack-email" className="sr-only">
              Email address
            </label>
            <input
              id="skill-pack-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'skill-pack-error' : undefined}
              className="flex-1 sm:max-w-xs px-4 py-3 rounded-full border border-border-primary bg-surface-primary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent-primary text-white font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-60 transition-all"
            >
              <ArrowDownTrayIcon className="w-4 h-4" aria-hidden="true" />
              {isLoading ? 'Building your pack…' : `Send me the ${PATTERN_COUNT} skills`}
            </button>
          </form>
        )}

        {error && (
          <p id="skill-pack-error" role="alert" className="mt-3 text-sm text-status-error">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default SkillPackGate;
