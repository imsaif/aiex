import type { SVGProps } from 'react';

/**
 * Guidebot's mark: Heroicons' academic cap with the tassel removed and two
 * eyes on the board, so the cap itself reads as the character. Same 24px
 * outline grid and 1.5 stroke as the site's other icons.
 */
export function GuidebotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Academic cap (Heroicons outline), board and band only */}
      <path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      {/* Eyes on the board */}
      <circle cx="10.1" cy="8.6" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="13.9" cy="8.6" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default GuidebotIcon;
