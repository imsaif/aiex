'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  ArrowDownTrayIcon,
  CommandLineIcon,
  SwatchIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { PATTERN_COUNT } from '@/data/pattern-count';
import type { NewsletterSource } from '@/types/newsletter';
import { PACK_GUIDES, PACK_GUIDE_LIST, guidePath, type PackTarget } from '@/lib/skills/packSteps';
import { PackSteps } from '@/components/skills/PackSteps';

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
  'Ask your AI tool to use them while it designs',
  'Daily AI UX newsletter (unsubscribe anytime)',
];

const TARGET_ICONS: Record<PackTarget, typeof CommandLineIcon> = {
  code: CommandLineIcon,
  claude: SwatchIcon,
  unsure: QuestionMarkCircleIcon,
};

const CHOOSE_ERROR = 'Choose where you will use them, or pick Not sure yet.';

/**
 * Where the skills will be used. Nothing is selected to start with: a preset
 * answer sent Claude Code instructions to people who never chose Claude Code.
 *
 * One control, not three more cards. A segmented control reads as a single
 * choice, and only the chosen option's hint is on screen.
 */
function TargetChooser({
  value,
  onChange,
  invalid,
}: {
  value: PackTarget | null;
  onChange: (next: PackTarget) => void;
  invalid: boolean;
}) {
  return (
    <fieldset aria-describedby={invalid ? 'skill-pack-error' : undefined}>
      <legend className="mb-2.5 text-sm text-text-secondary">Where will you use them?</legend>
      <div className="inline-flex flex-wrap max-w-full p-1 rounded-card sm:rounded-pill border border-border-primary bg-surface-secondary">
        {PACK_GUIDE_LIST.map(({ target, label }) => {
          const Icon = TARGET_ICONS[target];
          return (
            <label key={target} className="relative cursor-pointer">
              <input
                type="radio"
                name="skill-pack-target"
                value={target}
                checked={value === target}
                onChange={() => onChange(target)}
                className="sr-only peer"
              />
              {/* peer-* is a sibling combinator, so it styles this span but
                  cannot reach the icon nested inside it: that reads state. */}
              <span className="flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium text-text-secondary transition-colors peer-checked:bg-surface-primary peer-checked:text-text-primary peer-checked:shadow-card peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary peer-focus-visible:ring-offset-2">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    value === target ? 'text-accent-primary' : 'text-text-secondary'
                  }`}
                  aria-hidden="true"
                />
                {label}
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-2.5 min-h-5 text-sm text-text-secondary" aria-live="polite">
        {value && PACK_GUIDES[value].hint}
      </p>
    </fieldset>
  );
}

/**
 * What the skills teach, as three examples. These describe the skills, not a
 * promised result: in the November 2026 tests Claude often asked first without
 * them, and no result offered undo, which an earlier card promised.
 */
const mini = 'inline-block rounded-input px-2.5 py-1 text-sm font-medium';

const SKILL_CARDS = [
  {
    title: 'Show the source',
    body: 'So people can check the answer.',
    pattern: 'Explainable AI',
    picture: (
      <>
        <span className="h-2 w-full rounded-pill bg-border-primary" />
        <span className="h-2 w-2/3 rounded-pill bg-border-primary" />
        <span className="text-sm font-medium text-text-primary underline underline-offset-4">From Priya, Tuesday</span>
      </>
    ),
  },
  {
    title: 'Ask first',
    body: 'Before it sends or deletes.',
    pattern: 'Human-in-the-Loop',
    picture: (
      <>
        <span className="w-full truncate rounded-input border border-border-primary bg-surface-primary px-2.5 py-1 text-sm text-text-primary">
          Hi Priya, thanks for your time
        </span>
        <span className="flex gap-tight">
          <span className={`${mini} border border-border-primary bg-surface-primary text-text-primary`}>Cancel</span>
          <span className={`${mini} bg-accent-primary text-text-on-accent`}>Send</span>
        </span>
      </>
    ),
  },
  {
    title: 'Help when it fails',
    body: 'Say what failed and what to do next.',
    pattern: 'Error Recovery',
    picture: (
      <>
        <span className="flex items-start gap-1.5 text-sm font-medium text-text-primary">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-status-error" />
          Not sent: address not found
        </span>
        <span className={`${mini} bg-accent-primary text-text-on-accent`}>Edit address</span>
      </>
    ),
  },
];

/** The steps for whatever they chose, once the download has started. */
function DoneSteps({ target, source }: { target: PackTarget; source: NewsletterSource }) {
  const guide = PACK_GUIDES[target];
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The form they were in has gone, so put focus on what replaced it.
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <div className="text-left motion-safe:animate-[fadeIn_180ms_ease-out]">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-8 pr-8 text-xl sm:text-2xl font-semibold tracking-tight leading-[1.2] text-text-primary focus:outline-none"
      >
        {guide.doneTitle}
      </h2>
      <p className="mt-2 mb-6 text-sm text-text-secondary">{guide.doneIntro}</p>
      <PackSteps steps={guide.steps} />
      <Link
        href={guidePath(target)}
        prefetch={false}
        onClick={() => trackAuditEvent('skills_walkthrough_opened', { source, target })}
        className="mt-7 inline-flex items-center justify-center px-6 py-3 rounded-pill bg-accent-primary text-text-on-accent text-sm font-semibold hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 transition-all"
      >
        {target === 'unsure' ? 'See the example' : 'See an example and the full steps'}
      </Link>
    </div>
  );
}

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
  /**
   * 'interstitial' only. Closing the dialog without going anywhere. Separate from
   * `onDone` on purpose: dismissing means "I did not want this", not "take me to
   * the audit", and wiring both to one handler is what made a backdrop click
   * silently navigate people away.
   */
  onDismiss?: () => void;
}

export function SkillPackGate({
  variant = 'section',
  onDone,
  onDismiss,
  source = 'homepage-skills-pack',
}: SkillPackGateProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Which package to build; null until they choose. See composeSingleSkill.ts for
  // why one library needs two packages.
  const [chosen, setChosen] = useState<PackTarget | null>(null);
  const shown = useRef(false);
  // Attached to whichever variant's root element renders, so the impression
  // event can wait for that element to be on screen.
  const rootRef = useRef<HTMLElement | null>(null);

  // Fire "shown" when the gate actually enters the viewport, not on mount.
  //
  // It used to fire from a mount effect, which counted every page load that
  // RENDERED the gate. On pattern pages it sits near the bottom, below the audit
  // CTA, so most of those loads were people who never scrolled to it. That made
  // the denominator meaningless: 424 "impressions" across 151 visitors with zero
  // submissions read as a catastrophic conversion rate, when the truth was that
  // nobody could be shown to have seen it at all.
  //
  // Same approach as CallOfferBlock, deliberately: placement is the open question
  // for both, and they need to be comparable.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // No observer (old browser, jsdom): fall back to counting the render, so a
      // missing API under-reports nothing rather than silently recording zero.
      if (shown.current) return;
      shown.current = true;
      trackAuditEvent('skills_gate_shown', { source });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (shown.current) return;
          shown.current = true;
          trackAuditEvent('skills_gate_shown', { source });
          observer.disconnect();
        }
      },
      // Half the block visible, matching CallOfferBlock. A lower threshold would
      // count a gate that only clipped the bottom of the viewport as "seen".
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [source]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // The compact variant has no chooser, so it counts as not sure.
    const target = chosen ?? (variant === 'compact' ? 'unsure' : null);
    if (!target) {
      setError(CHOOSE_ERROR);
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
        target === 'code'
          ? composeSkillPack(patterns, [])
          : composeSingleSkillZipEntries(patterns);
      const filename = target === 'code' ? skillPackFilename() : singleSkillFilename();

      const { zipSync, strToU8 } = await import('fflate');
      const zippable = Object.fromEntries(
        Object.entries(files).map(([path, contents]) => [path, strToU8(contents)])
      );
      saveBlob(
        new Blob([zipSync(zippable, { level: 6 }) as BlobPart], { type: 'application/zip' }),
        filename
      );

      trackAuditEvent('skills_gate_pack_downloaded', { skillCount: patterns.length, source, target });

      // Email a copy too, best-effort. The download above races the navigation
      // that follows, and some browsers cancel a blob download when the page
      // navigates; an emailed copy means giving an address always ends in having
      // the files. A failure here must never surface as a failed signup, so it is
      // deliberately not awaited into the error path.
      fetch('/api/skills/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, target }),
      }).catch(() => {
        /* already downloaded; nothing to tell the visitor */
      });

      setSuccess(true);
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
  // Kept deliberately sparse. An earlier pass had six bordered boxes stacked in
  // one dialog: three benefit cards, two option cards, an input. Every one of
  // them was drawing a line around something that did not need one, and the
  // whole thing read as busy. The benefits are borderless now; the only boxes
  // left are the two that are actually controls.
  //
  // Deliberately SKIPPABLE: a hard gate would protect nothing and the audit
  // only completes about four times a week, so blocking it to harvest an email
  // would cost the one qualification step the site has. Skipping is tracked, so
  // the skip rate is itself the finding.
  if (variant === 'interstitial') {
    // Confirm before continuing rather than navigating on the same tick the
    // download starts. The previous version set this state and immediately called
    // onDone, so nobody ever saw it and the download raced the route change.
    if (success) {
      return (
        <div className="py-1">
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-input text-text-secondary hover:text-text-primary hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors"
            >
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <DoneSteps target={chosen ?? 'unsure'} source={source} />
          <div className="mt-7 pt-5 border-t border-border-primary text-center">
            <button
              type="button"
              onClick={() => onDone?.()}
              className="text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-input px-1 py-0.5"
            >
              Start my audit
            </button>
          </div>
        </div>
      );
    }

    return (
      <div ref={rootRef as React.RefObject<HTMLDivElement>} className="py-1">
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-input text-text-secondary hover:text-text-primary hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors"
          >
            <XMarkIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <h2 className="pr-8 mb-3 text-xl sm:text-2xl font-semibold tracking-tight leading-[1.2] text-text-primary">
          Help your AI tool design better AI products
        </h2>

        <p className="text-sm text-text-secondary">
          Add {PATTERN_COUNT} skills to the AI tool you already use. Each one teaches it an AI UX pattern, like these:
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SKILL_CARDS.map(({ title, body, pattern, picture }) => (
            <div
              key={title}
              className="flex flex-col overflow-hidden rounded-card border border-border-primary bg-surface-primary"
            >
              {/* Dropped on phones, where three stacked pictures push the form away. */}
              <div
                aria-hidden="true"
                className="hidden sm:flex min-h-32 flex-col items-start justify-center gap-tight bg-surface-secondary p-default"
              >
                {picture}
              </div>
              <div className="flex flex-1 flex-col items-start p-default">
                <p className="text-sm font-semibold text-text-primary leading-snug">{title}</p>
                <p className="mt-1 mb-3 text-sm text-text-secondary leading-relaxed">{body}</p>
                <span className="mt-auto rounded-pill border border-border-primary bg-surface-secondary px-2.5 py-0.5 text-sm text-text-primary">
                  {pattern}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9">
          <TargetChooser
            value={chosen}
            onChange={(next) => {
              setChosen(next);
              if (error === CHOOSE_ERROR) setError(null);
            }}
            invalid={error === CHOOSE_ERROR}
          />
        </div>

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
            disabled={isLoading}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'skill-pack-error' : 'skill-pack-terms'}
            className="flex-1 min-w-0 px-4 py-3 rounded-pill border border-border-primary bg-surface-primary text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-pill bg-accent-primary text-text-on-accent text-sm font-semibold hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:opacity-60 transition-all"
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
          Free and MIT licensed. Includes the daily newsletter, unsubscribe anytime.
        </p>

        {/* The no-email path, stated rather than implied. Someone who does not
            want to hand over an address should be able to see that they do not
            have to, without having to guess that the dialog is dismissible. */}
        <div className="mt-7 pt-5 border-t border-border-primary text-center">
          <button
            type="button"
            onClick={() => {
              trackAuditEvent('skills_gate_skipped', { source });
              onDone?.();
            }}
            className="text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-input px-1 py-0.5"
          >
            No thanks, start my audit
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
          ref={rootRef as React.RefObject<HTMLButtonElement>}
          type="button"
          onClick={() => {
            setExpanded(true);
            trackAuditEvent('skills_gate_expanded');
          }}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill border-2 border-accent-primary bg-surface-primary text-accent-primary text-base font-semibold hover:bg-accent-primary hover:text-text-on-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 transition-all"
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
            className="shrink-0 px-5 py-2.5 rounded-pill bg-accent-primary text-text-on-accent text-sm font-medium hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:opacity-60 transition-all"
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
      ref={rootRef as React.RefObject<HTMLElement>}
      aria-labelledby="skill-pack-heading"
      className="w-full border-t border-border-primary bg-surface-secondary"
    >
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:py-20 text-center">
        <h2
          id="skill-pack-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.15] text-text-primary"
        >
          Take all {PATTERN_COUNT} patterns as skills for your AI tool
        </h2>
        <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
          A skill is a short note your AI tool reads while it designs. Get one for every
          pattern, for Claude Code or the Claude app.
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
          <div className="mt-8 rounded-card border border-border-primary bg-surface-primary p-loose">
            <DoneSteps target={chosen ?? 'unsure'} source={source} />
          </div>
        ) : (
          <>
          <div className="mt-8">
            <TargetChooser
              value={chosen}
              onChange={(next) => {
                setChosen(next);
                if (error === CHOOSE_ERROR) setError(null);
              }}
              invalid={error === CHOOSE_ERROR}
            />
          </div>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent-primary text-text-on-accent font-medium hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 disabled:opacity-60 transition-all"
            >
              <ArrowDownTrayIcon className="w-4 h-4" aria-hidden="true" />
              {isLoading ? 'Building your pack…' : `Send me the ${PATTERN_COUNT} skills`}
            </button>
          </form>
          </>
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
