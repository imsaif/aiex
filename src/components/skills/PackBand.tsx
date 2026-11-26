import type { ReactNode, Ref } from 'react';
import Image from 'next/image';

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
  children,
  className = '',
  large = false,
}: {
  title: string;
  intro: string;
  headingRef?: Ref<HTMLHeadingElement>;
  headingId?: string;
  /** Top-right control, e.g. the dialog's close button. */
  action?: ReactNode;
  /** Shown under the intro, inside the band. */
  children?: ReactNode;
  className?: string;
  /** A large headline centred in a tall band, for side-by-side layouts. */
  large?: boolean;
}) {
  return (
    <div className={`relative flex flex-col overflow-hidden bg-band-surface px-loose pb-loose pt-default md:px-roomy md:pb-10 md:pt-loose ${className}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute hidden sm:block bg-[url('/images/newsletter/cta-grid.png')] bg-contain bg-no-repeat ${
          large ? '-bottom-28 -right-44 h-72 w-[27rem] opacity-50' : '-right-24 top-12 h-48 w-72 opacity-70'
        }`}
      />
      <div className="relative flex items-center justify-between gap-snug border-b border-band-border pb-snug">
        <p className="flex items-center gap-tight text-sm font-bold text-text-on-band">
          <Image src="/images/email/aiux-mark.png" alt="" width={24} height={24} className="rounded-input" />
          aiux <span className="font-normal text-text-on-band-muted">skills</span>
        </p>
        <div className="flex items-center gap-snug">
          {action}
        </div>
      </div>
      <div className={large ? 'md:my-auto md:py-roomy' : ''}>
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={headingRef ? -1 : undefined}
        className={`relative mt-loose max-w-lg scroll-mt-8 text-balance font-extrabold leading-[1.1] tracking-tight text-text-on-band focus:outline-none ${large ? 'text-3xl md:text-[2.6rem]' : 'text-2xl sm:text-[1.75rem]'}`}
      >
        {title}
      </h2>
      <p className={`relative mt-snug max-w-lg text-text-on-band-muted ${large ? 'text-base md:text-lg' : 'text-sm sm:text-base'}`}>{intro}</p>
      {children && <div className="relative mt-roomy">{children}</div>}
      </div>
    </div>
  );
}

export default PackBand;
