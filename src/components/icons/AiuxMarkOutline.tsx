/**
 * The aiux mark as a line icon: heart with a sparkle inside.
 *
 * The logo in the bar is a solid heart with the sparkle knocked out in white,
 * which only works on the tinted disc it sits on. This is the same shape drawn
 * as strokes, so it matches the heroicons outline set used by every other nav
 * item — same 24 viewBox, same 1.5 stroke, currentColor throughout.
 */
export function AiuxMarkOutline({
  className = 'w-5 h-5',
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={20}
      height={20}
      className={className}
      aria-hidden="true"
    >
      {/* heart */}
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      {/* sparkle */}
      <path d="M12 8.6l1.05 2.35L15.4 12l-2.35 1.05L12 15.4l-1.05-2.35L8.6 12l2.35-1.05L12 8.6z" />
    </svg>
  );
}

export default AiuxMarkOutline;
