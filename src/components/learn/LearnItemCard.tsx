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
  // Sentence case. `item.badge` arrives as "COURSE" / "PATTERN" for the old
  // pill treatment; lower-cased here rather than at the source, because the
  // badge is still shown in caps elsewhere and this is a presentation choice
  // local to the card.
  const badge = item.badge.charAt(0) + item.badge.slice(1).toLowerCase();
  const meta = [badge];
  if (item.lessonCount) meta.push(`${item.lessonCount} lessons`);
  if (item.readTime) meta.push(`${item.readTime} min`);

  return (
    <li>
      <Link
        href={item.href}
        // Figure and ground, the other way round: the PAGE is tinted and the
        // card is white. Same problem solved — surface-primary on
        // background-primary is #ffffff on #ffffff, so there was no card — but
        // the card is now the light thing on a darker field, which is how a
        // card normally reads.
        //
        // That leaves hover almost nothing to do, which is the point. A white
        // card on a tint is already legible as a target, so the state change is
        // the border alone. Both a fill swap and a shadow were louder than the
        // event they were reporting.
        className="group flex items-start gap-5 rounded-card border border-border-primary bg-surface-primary px-6 py-5 transition-colors hover:border-border-secondary"
      >
        <span
          aria-hidden="true"
          className="type-caption mt-0.5 w-6 shrink-0 font-mono text-text-secondary"
        >
          {String(ordinal).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          {/* Title first. Capped measure, not the full row. */}
          {/* Same fix as the patterns list: `font-bold` beside a .type-*
              class does nothing, because the class sets font-weight from a
              variable. This heading has been rendering at 400. */}
          <h3
            className="type-lead max-w-[820px] text-text-primary group-hover:text-accent-primary"
            style={{ ['--type-lead-weight' as string]: 600 }}
          >
            {item.title}
          </h3>
          <p className="type-caption mt-1.5 line-clamp-2 max-w-[820px] text-text-secondary">
            {item.description}
          </p>

          {/* Last, not first.

              This started as a bordered pill above the title, then as small caps
              above the title, and it kept pulling the eye either way — because
              the problem was never the styling. Anything at the top of a card is
              read first, and setting it in caps only added to that. It is the
              least important thing here: you decide from the title whether you
              want the item, and the format and length tell you what it will cost
              once you already care.

              Sentence case for the same reason. Caps are for labels that need
              finding; this one needs to be available, not found. */}
          <p className="type-footnote mt-2.5 text-text-secondary">
            {meta.join(' · ')}
          </p>
        </div>

        {/* Centred on the card, not aligned to its first line. The ordinal
            belongs to the top line because it numbers the title; the arrow
            belongs to the whole card, and on a three-line item it looked
            stranded up beside the badge. `self-center` rather than switching
            the row to items-center, which would drag the ordinal down with
            it. */}
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-pill border border-border-primary text-text-secondary transition-colors group-hover:border-accent-primary/40 group-hover:text-accent-primary"
        >
          →
        </span>
      </Link>
    </li>
  );
}
