import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Event pages sit outside the guides and patterns: no site navbar or footer, so
 * the page reads as an event, not as another article. Only a slim top bar back
 * to the site and a one-line footer.
 */
export function EventShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background-secondary text-text-primary">
      <header className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-text-primary hover:text-accent-primary">
          aiux <span className="font-normal text-text-secondary">events</span>
        </Link>
      </header>
      {children}
      <footer className="max-w-6xl mx-auto px-4 md:px-6 py-10 text-xs text-text-secondary">
        Hosted on aiuxdesign.guide
      </footer>
    </main>
  );
}

export default EventShell;
