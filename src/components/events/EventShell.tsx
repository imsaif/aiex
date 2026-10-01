import Link from 'next/link';
import type { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { RoughIconFilter } from '@/components/events/RoughIcon';
import { eventTheme, type EventTheme } from '@/components/events/theme';

/**
 * Two levels of chrome:
 *
 * - `site`: the /events list is a site page, so it gets the full site navbar
 *   and footer. Someone browsing events may well want the guides next.
 * - default: an individual event page stays focused on booking. A slim bar
 *   (Home · Guides · Events) gives the way back without a full menu competing
 *   with the booking card, and the site footer sits at the very bottom.
 *
 * `hero` renders on the band (the event's theme colour, or the site's own) so
 * the cover and title sit on one surface.
 */
export function EventShell({
  hero,
  theme,
  site = false,
  children,
}: {
  hero?: ReactNode;
  /** Colour of the hero band. Site pages leave it unset (the site's own look). */
  theme?: EventTheme;
  /** Full site navbar and footer, for site-level pages like the events list. */
  site?: boolean;
  children: ReactNode;
}) {
  const slimBar = (
    <header className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex items-center justify-between">
      <Link href="/" className="text-sm font-semibold text-text-primary hover:text-text-secondary">
        aiux
      </Link>
      <nav aria-label="Site" className="flex items-center gap-5 text-sm">
        <Link href="/" className="text-text-secondary hover:text-text-primary">
          Home
        </Link>
        <Link href="/guides" className="text-text-secondary hover:text-text-primary">
          Guides
        </Link>
        <Link href="/events" className="text-text-secondary hover:text-text-primary">
          Events
        </Link>
      </nav>
    </header>
  );

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <RoughIconFilter />
      {site && <Navbar />}
      {hero ? (
        <div className={`${eventTheme(theme).band} ${site ? 'pt-10 md:pt-14' : ''}`}>
          {!site && slimBar}
          {hero}
        </div>
      ) : (
        !site && <div className="mb-4 md:mb-10">{slimBar}</div>
      )}
      {children}
      <div className="pt-16">
        <Footer />
      </div>
    </main>
  );
}

export default EventShell;
