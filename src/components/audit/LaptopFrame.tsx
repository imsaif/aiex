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
      {/* Glass screen bezel — heavily translucent so the hero gradient
          bleeds through and tints the frame itself, matching PhoneFrame */}
      <div
        className="relative rounded-t-2xl rounded-b-md md:rounded-t-3xl md:rounded-b-md p-2.5 border-b-0 overflow-hidden"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.04), 0 30px 60px -20px rgba(22,32,54,0.18)',
        }}
      >
        {/* Top bezel with camera dot */}
        <div className="hidden md:flex h-5 items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary/40" />
        </div>

        {/* Inner screen — ringed like the phone */}
        <div className="relative bg-background-primary rounded-[1rem] md:rounded-[1.4rem] overflow-hidden border border-white/40 ring-1 ring-black/[0.04]">
          {children}
        </div>
      </div>

      {/* Laptop base — frosted glass platform under the screen, desktop only */}
      <div
        className="hidden md:block relative h-3 -mx-6 rounded-b-2xl pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.05), 0 18px 30px -12px rgba(22,32,54,0.18)',
        }}
      >
        {/* Hinge notch */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-1 rounded-b-lg bg-black/10 dark:bg-white/15" />
      </div>
    </div>
  );
}
