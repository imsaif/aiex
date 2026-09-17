/**
 * The robot mark that means "this pattern is about agents".
 *
 * Extracted because it is now in two places — the filter pill that turns
 * agentic patterns on, and the rows that answer it — and a path copied into two
 * files is a path that drifts. The filter and the thing it filters have to keep
 * looking like each other or the connection is lost.
 *
 * `label` renders for screen readers only. In the rows the mark replaced the
 * word "Agentic", and dropping the word from the accessible name as well would
 * have taken the fact away from anyone not looking at it.
 */
export function AgenticMark({
  className = 'h-3.5 w-3.5',
  label,
}: {
  className?: string;
  /** Announced text. Omit where a visible "Agentic" already sits beside it. */
  label?: string;
}) {
  return (
    <>
      <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </>
  );
}
