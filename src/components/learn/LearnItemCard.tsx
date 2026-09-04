import Link from 'next/link';
import type { ResolvedLearnItem } from '@/lib/learn-map';

/**
 * One item in a Learn Map section, as a full-width row.
 *
 * Rows rather than a card grid: the order of a section is the editorial
 * product, and a stacked list reads as a sequence where a grid reads as a
 * catalogue. It also gives each item a real internal hierarchy — ordinal,
 * type, title, description.
 *
 * The card is full width but the TEXT is not. Left to fill the row, a
 * description ran well over a thousand pixels of small type and the list read
 * as a wall rather than a set of choices. Capping the text block is what makes
 * the reference feel breathable at the same card width.
 *
 * Everything sizes off the scale in globals.css. No raw font sizes.
 *
 * Server component by design — see the header of `src/lib/learn-map.ts`.
 */
export default function LearnItemCard({
  item,
  ordinal,
}: {
  item: ResolvedLearnItem;
  /** Position within the section, shown as 01, 02 … like the reference. */
  ordinal: number;
}) {
  // Duration only exists for courses. Kept beside the type rather than on its
  // own line — three facts stacked above the title was most of the clutter.
  const meta = [item.badge];
  if (item.lessonCount) meta.push(`${item.lessonCount} lessons`);
  if (item.readTime) meta.push(`${item.readTime} min`);

  return (
    <li>
      <Link
        href={item.href}
        className="group flex items-start gap-5 rounded-card border border-border-primary bg-surface-primary px-6 py-6 transition-all hover:border-accent-primary/40 hover:shadow-card"
      >
        <span
          aria-hidden="true"
          className="type-caption mt-0.5 w-6 shrink-0 font-mono text-text-secondary"
        >
          {String(ordinal).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <p className="type-eyebrow text-text-secondary">{meta.join(' · ')}</p>

          {/* Capped measure, not the full row. */}
          <h3 className="type-lead mt-1.5 max-w-[640px] font-semibold text-text-primary group-hover:text-accent-primary">
            {item.title}
          </h3>
          <p className="type-caption mt-1.5 line-clamp-2 max-w-[640px] text-text-secondary">
            {item.description}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-border-primary text-text-secondary transition-colors group-hover:border-accent-primary/40 group-hover:text-accent-primary"
        >
          →
        </span>
      </Link>
    </li>
  );
}
