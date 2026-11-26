import type { ReactNode, Ref } from 'react';
import Image from 'next/image';
import { PATTERN_COUNT } from '@/data/pattern-count';

/**
 * The daily email's navy band (src/lib/newsletter/daily-email.ts): aiux mark,
 * a quiet label, then a large white title, with the email's grid-and-rings art
 * in the corner. Used at the top of the skill-pack dialog so the dialog and the
 * email a subscriber receives read as the same product.
 */
export function PackBand({
  title,
  intro,
  headingRef,
  headingId,
  action,
}: {
  title: string;
  intro: string;
  headingRef?: Ref<HTMLHeadingElement>;
  headingId?: string;
  /** Top-right control, e.g. the dialog's close button. */
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-band-surface px-loose pb-loose pt-default">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 hidden sm:block h-56 w-80 bg-[url('/images/newsletter/cta-grid.png')] bg-contain bg-no-repeat opacity-70"
      />
      <div className="relative flex items-center justify-between gap-snug border-b border-band-border pb-snug">
        <p className="flex items-center gap-tight text-sm font-bold text-text-on-band">
          <Image src="/images/email/aiux-mark.png" alt="" width={24} height={24} className="rounded-input" />
          aiux <span className="font-normal text-text-on-band-muted">skills</span>
        </p>
        <div className="flex items-center gap-snug">
          <p className="hidden sm:block font-mono text-sm tracking-wide text-text-on-band-muted">
            {PATTERN_COUNT} patterns · free
          </p>
          {action}
        </div>
      </div>
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={headingRef ? -1 : undefined}
        className="relative mt-loose max-w-lg scroll-mt-8 text-balance text-2xl sm:text-3xl font-extrabold leading-[1.12] tracking-tight text-text-on-band focus:outline-none"
      >
        {title}
      </h2>
      <p className="relative mt-snug max-w-lg text-sm sm:text-base text-text-on-band-muted">{intro}</p>
    </div>
  );
}

export default PackBand;
