'use client';

import { ReactNode } from 'react';

interface LaptopFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * MacBook-style chrome wrapper for the demo dashboard. Built in pure CSS so
 * we don't ship an asset; uses design tokens so light/dark mode swap follows
 * the same vars as the rest of the site.
 *
 * Decorative chrome only — pointer events pass through to children, so pins
 * and hover states inside the framed dashboard work unchanged.
 */
export function LaptopFrame({ children, className = '' }: LaptopFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Laptop screen — thin bezels around the content, top bezel hosts a camera dot */}
      <div className="relative rounded-t-2xl rounded-b-md md:rounded-t-3xl md:rounded-b-md bg-background-secondary border border-border-primary border-b-0 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
        {/* Top bezel with camera dot */}
        <div className="hidden md:flex h-6 items-center justify-center bg-background-secondary pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary/40" />
        </div>

        {/* Inner screen — actual product mockup */}
        <div className="relative bg-background-primary">
          {children}
        </div>
      </div>

      {/* Laptop base — subtle platform under the screen, desktop only */}
      <div className="hidden md:block relative h-3 -mx-6 rounded-b-2xl bg-gradient-to-b from-background-secondary to-background-tertiary border-x border-b border-border-primary shadow-2xl shadow-black/5 dark:shadow-black/30 pointer-events-none">
        {/* Hinge notch */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-1 rounded-b-lg bg-border-primary/60" />
      </div>
    </div>
  );
}
