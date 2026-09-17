'use client';

import Link from 'next/link';
import Image from 'next/image';
import SaveToDashboardButton from '@/components/handoff/SaveToDashboardButton';
import { getProductLogoUrl, hasProductLogo } from '@/data/product-logos';
import { AgenticMark } from '@/components/patterns/AgenticMark';
import { useThemeFilter } from '@/hooks/useTheme';
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
  // Before the empty-list return, not after: a hook behind a conditional return
  // runs on some renders and not others, which is the one thing hooks cannot do.
  // Same monochrome treatment the rest of the site gives brand marks.
  const logoFilter = useThemeFilter('grayscale(100%)');

  // Superhuman is excluded to match the card view, which has skipped it since
  // before this list existed.
  const logoProducts = new Map(
    patterns.map((pattern) => [
      pattern.id,
      (pattern.products ?? [])
        .filter((product) => product !== 'Superhuman' && hasProductLogo(product))
        .slice(0, 3),
    ]),
  );

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
                {/* Weight is set through the token's own variable, not a
                    utility. `.type-*` declares font-weight from a CSS variable,
                    so a Tailwind weight class next to it loses silently — this
                    title carried `font-semibold` and computed to 400, while the
                    description under it computed to 500, because
                    --type-caption-weight is heavier than --type-body-weight.
                    The name was literally lighter than its own description.

                    type-lead is the right size class regardless: the token
                    comment for it reads "lead paragraphs, list-item titles",
                    which is exactly this. */}
                <h3
                  className="type-lead mb-1.5 text-text-primary transition-colors group-hover:text-accent-primary"
                  style={{ ['--type-lead-weight' as string]: 600 }}
                >
                  {pattern.title}
                  {pattern.tags?.includes('agentic') && (
                    // The mark instead of the word. "AGENTIC" set in caps beside
                    // the title competed with it for the start of the line, and
                    // the filter that turns these patterns on already uses this
                    // robot — so the mark is the thing a reader has been taught
                    // to recognise. The word survives for screen readers.
                    <span
                      title="Agentic"
                      className="ml-2 inline-flex align-middle text-text-secondary"
                    >
                      <AgenticMark label="Agentic" />
                    </span>
                  )}
                </h3>
                <p className="type-caption text-text-secondary">
                  {pattern.description}
                </p>

                {/* Under the description, on its own line, because it answers
                    the question the description raises: is this something
                    people actually ship, or a thing someone thought of? On the
                    skills list the marks sit to the right, where rows are one
                    line; here the row is two, so a right-hand column would
                    float beside the text rather than belong to it. */}
                {logoProducts.get(pattern.id)!.length > 0 && (
                  <ul className="mt-2.5 flex flex-wrap items-center gap-2.5">
                    <li className="type-footnote uppercase tracking-wide text-text-secondary">
                      Seen in
                    </li>
                    {logoProducts.get(pattern.id)!.map((product) => (
                      <li
                        key={product}
                        className="group/logo relative flex items-center"
                      >
                        <Image
                          src={getProductLogoUrl(product)}
                          alt={product}
                          width={14}
                          height={14}
                          // 14px at 40%, against a 18px/50% mark on the skills
                          // list. There the marks are alone in their column and
                          // can hold their own weight; here they sit under a
                          // title and a description and have to read as the
                          // third thing, not a competing third column.
                          className="h-3.5 w-3.5 opacity-40 transition-opacity group-hover/logo:opacity-100"
                          style={{ filter: logoFilter }}
                        />
                        <span
                          aria-hidden="true"
                          className="type-footnote pointer-events-none absolute bottom-full left-1/2 z-tooltip mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-card bg-text-primary px-2 py-1 text-background-primary opacity-0 transition-opacity group-hover/logo:opacity-100"
                        >
                          {product}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Link>

              {/* Same treatment as the skills list: one save control repeated
                  down a long list is chrome, not an affordance. It reveals on
                  hover and on keyboard focus, and stays put wherever there is
                  no hover at all, because a control only a mouse can find is
                  not a control on a phone. */}
              <SaveToDashboardButton
                slug={pattern.slug}
                variant="icon"
                showLabelOnHover
                className="shrink-0 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
