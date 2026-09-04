import Link from 'next/link';
import type { ResolvedLearnItem } from '@/lib/learn-map';

/**
 * One item in a Learn Map section.
 *
 * Server component by design — see the header of `src/lib/learn-map.ts`. Adding
 * `'use client'` here would pull the whole pattern registry into the browser
 * bundle for /guides.
 *
 * The meta line renders only when a read time exists, which is the minority
 * case: only courses and lessons carry durations. A pattern showing its badge
 * alone is the normal state, not a broken card.
 */
export default function LearnItemCard({ item }: { item: ResolvedLearnItem }) {
  const meta: string[] = [];
  if (item.lessonCount) meta.push(`${item.lessonCount} lessons`);
  if (item.readTime) meta.push(`${item.readTime} min`);

  return (
    <li>
      <Link
        href={item.href}
        className="group flex h-full flex-col gap-1.5 rounded-card border border-border-primary bg-surface-primary p-5 transition-all hover:border-accent-primary/40 hover:shadow-lg sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="type-caption rounded-pill border border-accent-primary/20 bg-accent-subtle px-3 py-0.5 font-semibold text-accent-primary">
            {item.badge}
          </span>
          {meta.length > 0 && (
            <span className="type-caption text-text-secondary">
              {meta.join(' · ')}
            </span>
          )}
        </div>

        <h3 className="type-h3 text-text-primary group-hover:text-accent-primary">
          {item.title}
        </h3>

        {/* Clamped: source descriptions vary from one line to a full paragraph,
            and an unclamped card sets the height of everything beside it. */}
        <p className="type-body line-clamp-3 text-text-secondary">
          {item.description}
        </p>
      </Link>
    </li>
  );
}
