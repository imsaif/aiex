'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useEventBooking } from '@/components/events/useEventBooking';
import RoughIcon from '@/components/events/RoughIcon';
import { eventTheme, type EventTheme } from '@/components/events/theme';

/** The hero's call to action: "Book your seat", or a booked state for someone who already has. */
export function HeroBookingAction({ slug, theme }: { slug: string; theme?: EventTheme }) {
  const booked = useEventBooking(slug);

  if (booked) {
    return (
      <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
        <span className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium ${eventTheme(theme).soft} text-text-primary`}>
          <RoughIcon icon={CheckCircleIcon} />
          You&apos;re booked
        </span>
        <Link
          href={`/events/${slug}/booked`}
          className="text-sm text-center sm:text-right text-text-secondary underline underline-offset-2 hover:text-text-primary"
        >
          See your setup steps
        </Link>
      </div>
    );
  }

  return (
    <a
      href="#book"
      className="flex w-full sm:w-auto shrink-0 items-center justify-center px-7 py-3.5 rounded-xl font-medium bg-accent-primary text-text-on-accent hover:bg-accent-hover transition-colors"
    >
      Book your seat
    </a>
  );
}

export default HeroBookingAction;
