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

export function SkillPackGate() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
    } catch (err) {
      // Say what happened rather than leaving a dead button.
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
          No audit needed. Get the whole library as skill files, so Claude applies these
          patterns while it builds instead of after you catch them in review.
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
