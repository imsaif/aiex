import Link from 'next/link';
import type { ReactNode } from 'react';
import { RoughIconFilter } from '@/components/events/RoughIcon';
import { eventTheme, type EventTheme } from '@/components/events/theme';

/**
 * Event pages sit outside the guides and patterns: no site navbar or footer, so
 * the page reads as an event, not as another article. Only a slim top bar back
 * to the site and a one-line footer.
 *
 * `hero` renders on the event band (the cover's own ground colour) together with
 * the top bar, so the cover blends into the page instead of sitting in a box.
 */
export function EventShell({
  hero,
  theme,
  children,
}: {
  hero?: ReactNode;
  /** Colour of the hero band. Site pages leave it unset (the site's own look). */
  theme?: EventTheme;
  children: ReactNode;
}) {
  const header = (
    <header className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex items-center justify-between">
      <span className="text-sm">
        <Link href="/" className="font-semibold text-text-primary hover:text-text-secondary">
          aiux
        </Link>{' '}
        <Link href="/events" className="text-text-secondary hover:text-text-primary">
          events
        </Link>
      </span>
    </header>
  );

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <RoughIconFilter />
      {hero ? (
        <div className={eventTheme(theme).band}>
          {header}
          {hero}
        </div>
      ) : (
        <div className="mb-4 md:mb-10">{header}</div>
      )}
      {children}
      <footer className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-12 text-xs text-text-secondary">
        Hosted on aiuxdesign.guide
      </footer>
    </main>
  );
}

export default EventShell;
