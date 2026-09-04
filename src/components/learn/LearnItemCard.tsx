import Link from 'next/link';
import type { ResolvedLearnItem } from '@/lib/learn-map';

/**
 * One item in a Learn Map section, as a full-width row.
 *
 * Rows rather than a card grid: the order of a section is the editorial
 * product, and a stacked list reads as a sequence where a grid reads as a
 * catalogue. It also gives each item a real internal hierarchy — metadata,
 * title, description — instead of three similarly-weighted lines.
 *
 * Everything sizes off the scale in globals.css: `type-eyebrow` for the
 * metadata line, `type-lead` for the title, `type-caption` for the
 * description. No raw font sizes.
 *
 * Server component by design — see the header of `src/lib/learn-map.ts`.
 * Adding `'use client'` would pull the whole pattern registry into the browser
 * bundle for /guides.
 */
export default function LearnItemCard({ item }: { item: ResolvedLearnItem }) {
  // The type leads the metadata line rather than sitting in a pill. Read time
  // and lesson count only exist for courses, so most rows show the type alone.
  const meta = [item.badge];
  if (item.lessonCount) meta.push(`${item.lessonCount} lessons`);
  if (item.readTime) meta.push(`${item.readTime} min read`);

  return (
    <li>
      <Link
        href={item.href}
        className="group flex items-center gap-5 rounded-card border border-border-primary bg-surface-primary px-5 py-4 transition-all hover:border-accent-primary/40 hover:shadow-card sm:px-6"
      >
        <div className="min-w-0 flex-1">
          <p className="type-eyebrow text-text-secondary">{meta.join(' · ')}</p>
          <h3 className="type-lead mt-1 font-semibold text-text-primary group-hover:text-accent-primary">
            {item.title}
          </h3>
          {/* Clamped: source descriptions run from one line to a full
              paragraph, and an unclamped row makes the list ragged. */}
          <p className="type-caption mt-1 line-clamp-2 text-text-secondary">
            {item.description}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="type-lead shrink-0 text-text-secondary transition-colors group-hover:text-accent-primary"
        >
          →
        </span>
      </Link>
    </li>
  );
}
