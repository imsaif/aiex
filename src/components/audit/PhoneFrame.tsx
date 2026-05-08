'use client';

import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Glass-style iPhone chrome — translucent frosted bezel that lets the
 * hero gradient bleed through subtly. Sits at the laptop's right edge
 * vertically with no tilt, like the inspiration shot. Pure CSS, design
 * tokens, decorative only.
 */
export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`relative rounded-[2rem] p-1.5 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-md ${className}`}
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(245,247,252,0.65) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.04), 0 30px 60px -20px rgba(22,32,54,0.18)',
      }}
    >
      {/* Inner bezel — frosted ring */}
      <div className="relative rounded-[1.6rem] overflow-hidden bg-background-primary border border-white/40 ring-1 ring-black/[0.04]">
        {/* Dynamic Island (subtle, not jet-black on glass) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="w-14 h-3.5 bg-gradient-to-b from-gray-900 to-black rounded-full" />
        </div>

        {/* Screen surface */}
        <div className="relative w-[230px] h-[480px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
