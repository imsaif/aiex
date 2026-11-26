'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  ArrowDownTrayIcon,
  CommandLineIcon,
  ChatBubbleOvalLeftIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { PATTERN_COUNT } from '@/data/pattern-count';
import type { NewsletterSource } from '@/types/newsletter';
import { PACK_GUIDES, PACK_GUIDE_LIST, guidePath, type PackTarget } from '@/lib/skills/packSteps';
import { PackSteps } from '@/components/skills/PackSteps';
import { PackBand } from '@/components/skills/PackBand';
import { SkillFormatMarks } from '@/components/skills/SkillFormatMarks';

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
  claude: ChatBubbleOvalLeftIcon,
  unsure: QuestionMarkCircleIcon,
};

// The audit is the free screenshot check on this site. Say so: "the audit"
// meant nothing to someone who had not seen it.
const AUDIT_LINK_SKIP = 'No thanks, audit a screenshot here instead';
const AUDIT_LINK_AFTER = 'Or audit a screenshot here, nothing to install';

const CHOOSE_ERROR = 'Choose where you will use them, or pick Not sure yet.';

/**
 * Where the skills will be used. Starts on Not sure yet (see the state in
 * SkillPackGate): a Claude Code preset once sent Claude Code instructions to
 * people who never chose it.
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
      <div className="inline-flex flex-wrap lg:flex-nowrap max-w-full p-1 rounded-card lg:rounded-pill border border-border-primary bg-surface-secondary">
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
              <span className="flex items-center gap-2 px-4 py-2 rounded-pill border-2 border-transparent text-sm font-medium text-text-secondary transition-colors peer-checked:border-accent-primary peer-checked:bg-surface-primary peer-checked:font-semibold peer-checked:text-text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary peer-focus-visible:ring-offset-2">
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
 *
 * Each card carries its pattern's icon from the daily email's band art, and the
 * email's PATTERN pill, so the dialog reads like the newsletter it signs people
 * up to.
 */
// Outlined on white so each reads as a button against the grey panel, while the
// form's own button stays the only solid one.
const mini = 'inline-block rounded-input border border-border-secondary bg-tint-card px-2.5 py-1 text-sm font-medium text-text-primary';

// Drawn buttons stay grey so the form's own button is the only solid one.
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
        <span className="w-full truncate rounded-input border border-border-secondary bg-tint-card px-2.5 py-1 text-sm text-text-primary">
          Hi Priya, thanks for your time
        </span>
        <span className="flex gap-tight">
          <span className={mini}>Cancel</span>
          <span className={`${mini} font-semibold`}>Send</span>
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
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-status-error" aria-hidden="true" />
          Not sent: address not found
        </span>
        <span className={`${mini} font-semibold`}>Edit address</span>
      </>
    ),
  },
];

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      // Top right of the whole dialog. Phones stack the band on top, so there it
      // sits on navy; side by side it sits on the white form column.
      className="absolute right-4 top-4 z-dropdown p-1.5 rounded-input text-text-on-band-muted hover:text-text-on-band md:text-text-secondary md:hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors"
    >
      <XMarkIcon className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

/** The three findings from the real review, shown to people who chose Not sure yet. */
const EXAMPLE_FINDINGS = [
  { quote: 'One click does both the writing and the sending.', pattern: 'Human-in-the-Loop' },
  { quote: 'Failures are invisible \u2026 the user may believe the email went out.', pattern: 'Error Recovery' },
  { quote: 'It has no link back to the source messages.', pattern: 'Confidence and trust' },
];

/**
 * What replaces the form once the download has started: a confirmation strip,
 * then that choice's steps, then the way to the full walkthrough. The navy band
 * beside it stays put, so the dialog does not jump.
 */
function DoneSteps({
  target,
  source,
  footer,
  where = 'dialog',
}: {
  target: PackTarget;
  source: NewsletterSource;
  /** Which screen this sits on, so Copy presses can be told apart. */
  where?: 'dialog' | 'pattern_page';
  footer?: React.ReactNode;
}) {
  const guide = PACK_GUIDES[target];
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The form they were in has gone, so put focus on what replaced it.
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <div className="flex h-full flex-col text-left motion-safe:animate-[fadeIn_180ms_ease-out]">
      <div className="flex items-start gap-snug bg-tint-surface px-loose pb-loose pt-roomy md:px-roomy">
        <CheckCircleIcon className="h-9 w-9 shrink-0 text-text-primary" aria-hidden="true" />
        <div className="min-w-0 pr-8">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="scroll-mt-8 text-xl font-semibold leading-tight text-text-primary focus:outline-none"
          >
            {guide.doneTitle}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{guide.doneIntro}</p>
        </div>
      </div>

      <div className="flex-1 px-loose pt-loose md:px-roomy">
        <p className="mb-snug type-eyebrow font-semibold uppercase text-text-secondary">{guide.stepsLabel}</p>
        {target === 'unsure' ? (
          <>
            <ul className="space-y-tight" aria-label={guide.stepsLabel}>
              {EXAMPLE_FINDINGS.map((f) => (
                <li key={f.pattern} className="rounded-card border border-border-primary bg-tint-card p-default shadow-card">
                  <p className="text-sm font-semibold text-text-primary">&ldquo;{f.quote}&rdquo;</p>
                  <p className="text-sm text-text-secondary">{f.pattern}</p>
                </li>
              ))}
            </ul>
            <p className="mt-snug text-sm text-text-secondary">
              Asked to fix the first, it added a draft preview with Send and Cancel.
            </p>
          </>
        ) : (
          <PackSteps steps={guide.steps} track={{ where, target }} />
        )}
      </div>

      <div className="flex flex-col items-start gap-snug px-loose pb-loose pt-loose md:px-roomy">
        <Link
          href={guidePath(target)}
          prefetch={false}
          onClick={() => trackAuditEvent('skills_walkthrough_opened', { source, target })}
          className="inline-flex items-center justify-center px-6 py-3 rounded-pill bg-accent-primary text-text-on-accent text-sm font-semibold hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 transition-colors"
        >
          {target === 'unsure' ? 'See the whole example' : 'See an example and the full steps'}
        </Link>
        {footer}
      </div>
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
  // Which package to build. Starts on Not sure yet: it is right whatever tool
  // someone uses (an example first, then a choice). A Claude Code default once
  // sent Claude Code steps to people who never chose it.
  const [chosen, setChosen] = useState<PackTarget | null>('unsure');
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
    const band = (
        <PackBand
        large
        title="Help your AI tool design better AI products"
        intro={`Add ${PATTERN_COUNT} skills to the AI tool you already use. It learns the patterns behind AI features people can trust, and checks your designs against them.`}
      >
        <SkillFormatMarks />
      </PackBand>
    );

    // Confirm before continuing rather than navigating on the same tick the
    // download starts. The previous version set this state and immediately called
    // onDone, so nobody ever saw it and the download raced the route change.
    if (success) {
      return (
        <div className="relative">
          {onDismiss && <CloseButton onClick={onDismiss} />}
          <div className="grid md:grid-cols-2">
            {band}
            <DoneSteps
              target={chosen ?? 'unsure'}
              source={source}
              footer={
                <button
                  type="button"
                  onClick={() => {
                    trackAuditEvent('skills_gate_audit_chosen', { source, target: chosen ?? 'unsure' });
                    onDone?.();
                  }}
                  className="text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-input px-1 py-0.5 -mx-1"
                >
                  {AUDIT_LINK_AFTER}
                </button>
              }
            />
          </div>
        </div>
      );
    }

    return (
      <div ref={rootRef as React.RefObject<HTMLDivElement>} className="relative">
        {onDismiss && <CloseButton onClick={onDismiss} />}
        <div className="grid md:grid-cols-2">
        {band}

        <div className="flex flex-col">
        <div className="bg-tint-surface p-loose md:px-roomy md:pt-roomy">
          <p className="mb-snug type-eyebrow font-semibold uppercase text-text-secondary">Like these</p>
          <ul className="space-y-tight" aria-label="What the skills teach">
            {SKILL_CARDS.map(({ title, body, pattern, picture }) => (
              <li key={title} className="flex overflow-hidden rounded-card border border-border-primary bg-tint-card shadow-card">
                {/* Dropped on phones, where three pictures push the form away. */}
                <div
                  aria-hidden="true"
                  className="hidden sm:flex w-40 shrink-0 flex-col items-start justify-center gap-1.5 border-r border-border-primary bg-tint-panel p-snug [&_*]:text-xs"
                >
                  {picture}
                </div>
                <div className="min-w-0 flex-1 p-default">
                  <h3 className="text-sm font-semibold text-text-primary leading-snug">{title}</h3>
                  <p className="text-sm text-text-secondary leading-snug">{body}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Pattern: <span className="font-semibold text-text-primary">{pattern}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col p-loose md:px-roomy">
        {/* Sized to the three choices, so the email field and button line up
            with them. The small print wraps inside that width instead. */}
        <div className="inline-flex max-w-full flex-col self-start">
        <div>
          <TargetChooser
            value={chosen}
            onChange={(next) => {
              setChosen(next);
              if (error === CHOOSE_ERROR) setError(null);
            }}
            invalid={error === CHOOSE_ERROR}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-default flex flex-col gap-snug">
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
            {isLoading ? 'Sending…' : 'Send me the skills'}
          </button>
        </form>

        {error && (
          <p id="skill-pack-error" role="alert" className="mt-2 w-0 min-w-full text-sm text-status-error">
            {error}
          </p>
        )}

        <p id="skill-pack-terms" className="mt-3 w-0 min-w-full text-sm text-text-secondary">
          Free and MIT licensed. Includes the daily newsletter, unsubscribe anytime.
        </p>
        </div>

        {/* The no-email path, stated rather than implied. Someone who does not
            want to hand over an address should be able to see that they do not
            have to, without having to guess that the dialog is dismissible. */}
        </div>
        <div className="px-loose pb-loose text-center md:px-roomy">
          <button
            type="button"
            onClick={() => {
              trackAuditEvent('skills_gate_skipped', { source });
              onDone?.();
            }}
            className="text-sm font-medium text-text-primary underline underline-offset-4 hover:text-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-input px-1 py-0.5"
          >
            {AUDIT_LINK_SKIP}
          </button>
        </div>
        </div>
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
          <div className="mt-8 overflow-hidden rounded-card border border-border-primary bg-surface-primary">
            <DoneSteps target={chosen ?? 'unsure'} source={source} where="pattern_page" />
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
