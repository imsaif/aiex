'use client';

import Link from 'next/link';
import SaveToDashboardButton from '@/components/handoff/SaveToDashboardButton';
import type { PatternSummary, Category } from '@/types';

/**
 * One category, as a labelled band rather than a slice of an undifferentiated
 * card grid.
 *
 * The flat grid gave all 38 patterns the same weight — same card, same padding,
 * same shadow — so the page had no hierarchy of its own and the filter pills
 * were carrying all of the structure. Nothing told you the library was
 * organised, only that it was long.
 *
 * The shape here is a label column and a list column: the category names
 * itself once on the left, and its patterns are dense rows on the right,
 * separated by hairlines instead of boxed individually. Weight comes from type
 * size and rules, not from surfaces, which is what lets a heading read as a
 * heading at a glance.
 *
 * Rows, not cards, because a pattern in this view is a thing you scan past on
 * the way to the one you want. The full card treatment still appears in the
 * filtered and search results, where the set is small and each result deserves
 * the space.
 */
export default function PatternCategorySection({
  category,
  patterns,
}: {
  category: Category;
  patterns: PatternSummary[];
}) {
  if (patterns.length === 0) return null;

  return (
    <section
      className="grid gap-loose border-t border-border-primary py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12"
      aria-labelledby={`category-${category.slug}`}
    >
      {/* Label column. It stays put while the list does the scrolling, so the
          category name is readable against any row you happen to be on. */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <h2
          id={`category-${category.slug}`}
          className="type-h3 mb-2 text-text-primary"
        >
          {category.title}
        </h2>
        <p className="type-caption mb-3 text-text-secondary">
          {category.description}
        </p>
        <p className="type-eyebrow uppercase text-text-secondary">
          {patterns.length} {patterns.length === 1 ? 'pattern' : 'patterns'}
        </p>
      </div>

      {/* List column. Each row is its own hairline-separated band; the first
          has none, so the section's own top rule is not doubled. */}
      <ul className="min-w-0">
        {patterns.map((pattern, index) => (
          <li
            key={pattern.id}
            className={index > 0 ? 'border-t border-border-primary' : ''}
          >
            <div className="group relative flex items-start gap-4 py-4">
              <Link
                href={`/patterns/${pattern.slug}`}
                className="min-w-0 flex-1 rounded-card transition-colors"
              >
                <h3 className="type-body mb-1 font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                  {pattern.title}
                  {pattern.tags?.includes('agentic') && (
                    <span className="type-eyebrow ml-2 align-middle uppercase text-text-secondary">
                      Agentic
                    </span>
                  )}
                </h3>
                <p className="type-caption text-text-secondary">
                  {pattern.description}
                </p>
              </Link>

              <SaveToDashboardButton
                slug={pattern.slug}
                variant="icon"
                className="shrink-0"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
