import type { SVGProps } from 'react';

/**
 * Guidebot's mark: an academic cap with no tassel and two eyes on the board,
 * so the cap itself reads as the character. Solid since 2026-11-19: the cap is
 * filled with currentColor (navy via text-accent-primary) and the eyes take
 * the surface colour, so they read white on navy in light mode and flip with
 * the accent in dark mode. A thin gap between board and band keeps the two
 * shapes apart once filled.
 */
export function GuidebotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinejoin="round"
      {...props}
    >
      {/* Board */}
      <path d="M12 3.4 22.4 9.3 12 13.6 1.6 9.3Z" />
      {/* Band, set just below the board */}
      <path d="M4.5 11.6 12 14.9l7.5-3.3q.4 2.4.5 4.9-4.3 1.7-8 4.3-3.7-2.6-8-4.3.1-2.5.5-4.9Z" />
      {/* Eyes on the board */}
      <circle cx="10" cy="8.7" r="1" fill="var(--surface-primary)" stroke="none" />
      <circle cx="14" cy="8.7" r="1" fill="var(--surface-primary)" stroke="none" />
    </svg>
  );
}

export default GuidebotIcon;
