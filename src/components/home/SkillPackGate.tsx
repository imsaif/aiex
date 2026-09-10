'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CheckIcon,
  ArrowDownTrayIcon,
  LightBulbIcon,
  HandRaisedIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { PATTERN_COUNT } from '@/data/pattern-count';
import type { NewsletterSource } from '@/types/newsletter';

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
  /**
   * Which surface this instance sits on. Kept per-placement so Beehiiv and the
   * local Subscriber row both record where the address came from, and the
   * homepage can be compared against the pattern pages. MUST exist in
   * NEWSLETTER_SOURCES — an unlisted value is a silent 400 on a valid email.
   */
  source?: NewsletterSource;
}

export function SkillPackGate({
  variant = 'section',
  onDone,
  source = 'homepage-skills-pack',
}: SkillPackGateProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Which package shape to build. See composeSingleSkill.ts for why one library
  // needs two: Claude Code reads a project tree, Claude's own uploader takes one
  // skill folder.
  const [target, setTarget] = useState<'code' | 'claude'>('code');
  const shown = useRef(false);

  useEffect(() => {
    // Once per mount. The homepage does not remount this on step changes, but
    // guard anyway so the denominator of the conversion rate stays honest.
    if (shown.current) return;
    shown.current = true;
    trackAuditEvent('skills_gate_shown', { source });
  }, [source]);

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
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      // An existing subscriber is not a failure: they still get the pack.
      if (!response.ok && !/already subscribed/i.test(data.error || '')) {
        throw new Error(data.error || 'Something went wrong');
      }

      trackAuditEvent('skills_gate_submitted', { source, target });

      // Build the pack from the whole library. No audit is involved, so there
      // are no audits to attach.
      const [
        { default: patterns },
        { composeSkillPack, skillPackFilename },
        { composeSingleSkillZipEntries, singleSkillFilename },
        { saveBlob },
      ] = await Promise.all([
        import('@/data/patterns'),
        import('@/lib/skills/composePack'),
        import('@/lib/skills/composeSingleSkill'),
        import('@/lib/skills/auditPack'),
      ]);

      // Same guidance either way — only the arrangement differs.
      const files =
        target === 'claude'
          ? composeSingleSkillZipEntries(patterns)
          : composeSkillPack(patterns, []);
      const filename = target === 'claude' ? singleSkillFilename() : skillPackFilename();

      const { zipSync, strToU8 } = await import('fflate');
      const zippable = Object.fromEntries(
        Object.entries(files).map(([path, contents]) => [path, strToU8(contents)])
      );
      saveBlob(
        new Blob([zipSync(zippable, { level: 6 }) as BlobPart], { type: 'application/zip' }),
        filename
      );

      trackAuditEvent('skills_gate_pack_downloaded', { skillCount: patterns.length, source, target });
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
  // Three versions preceded this one and each failed differently: a bare email
  // field made no argument at all; a prose rewrite made the argument but asked a
  // designer to read four paragraphs for it; a side-by-side mock of one AI card
  // was visual but narrow, showing a single example rather than what the pack
  // is for — and its captions collided with the copy beneath them.
  //
  // Cards carry it better. Three named changes to the interface itself, each one
  // a real pattern from the library, scannable without reading a sentence.
  //
  // Deliberately SKIPPABLE: a hard gate would protect nothing and the audit
  // only completes about four times a week, so blocking it to harvest an email
  // would cost the one qualification step the site has. Skipping is tracked, so
  // the skip rate is itself the finding.
  if (variant === 'interstitial') {
    const BENEFIT_CARDS = [
      {
        // Was "Confidence made visible". Dropped: confidence visualisation is an
        // insider term, and a designer reading it fast does not picture anything.
        // "It says why" is the same trust problem in language that lands.
        icon: LightBulbIcon,
        title: 'Shows its working',
        body: 'Sources sit under each reply, so people can check it.',
      },
      {
        icon: HandRaisedIcon,
        title: 'A confirm step',
        body: 'It asks before it sends, books or deletes anything.',
      },
      {
        icon: ArrowUturnLeftIcon,
        title: 'An undo path',
        body: 'Any reply can be undone.',
      },
    ];

    return (
      <div>
        <p className="text-sm text-text-secondary">
          AI features usually ship without these. The skills put them in the first build.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BENEFIT_CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-card border border-border-primary bg-surface-primary p-4"
            >
              <Icon className="w-6 h-6 text-accent-primary mb-3" aria-hidden="true" />
              <p className="text-sm font-semibold text-text-primary leading-snug">{title}</p>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-text-primary leading-relaxed">
          Three of {PATTERN_COUNT} patterns. Claude reads them before it writes.
        </p>

        <fieldset className="mt-5">
          <legend className="text-sm text-text-secondary mb-2">Where will you use them?</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {([
              {
                value: 'code' as const,
                label: 'Claude Code',
                hint: 'Unzip into your project. Cursor and Copilot read them too.',
              },
              {
                value: 'claude' as const,
                label: 'Claude Design or Claude app',
                hint: 'One upload at Customize \u2192 Skills.',
              },
            ]).map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-2.5 p-3 rounded-card border cursor-pointer transition-colors ${
                  target === option.value
                    ? 'border-accent-primary bg-surface-primary'
                    : 'border-border-primary bg-surface-primary hover:border-accent-primary'
                }`}
              >
                <input
                  type="radio"
                  name="skill-pack-target"
                  value={option.value}
                  checked={target === option.value}
                  onChange={() => setTarget(option.value)}
                  className="mt-0.5 accent-accent-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-text-primary">{option.label}</span>
                  <span className="block text-sm text-text-secondary">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <form onSubmit={handleSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
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
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-pill bg-accent-primary text-white text-sm font-semibold hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-60 transition-all"
          >
            <ArrowDownTrayIcon className="w-4 h-4" aria-hidden="true" />
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
              trackAuditEvent('skills_gate_skipped', { source });
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
