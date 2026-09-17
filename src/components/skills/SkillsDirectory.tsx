'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeFilter } from '@/hooks/useTheme';
import UnifiedSearchBar from '../ui/UnifiedSearchBar';
import SaveToDashboardButton from '../handoff/SaveToDashboardButton';

export interface SkillRow {
  slug: string;
  skillName: string;
  title: string;
  category: string;
  trigger: string;
  products: { name: string; logo?: string }[];
}

interface SkillsDirectoryProps {
  rows: SkillRow[];
  categories: string[];
}

export function SkillsDirectory({ rows, categories }: SkillsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  // Same monochrome treatment the pattern-grid and ProductsSection logos get:
  // colored raster brand assets fall in line with the simple-icons set.
  const logoFilter = useThemeFilter('grayscale(100%)');

  // Nothing narrowed yet: the visitor is browsing the whole directory, which
  // is the state the grouped-by-category view is for.
  const isBrowsingAll =
    searchQuery.trim() === '' && selectedCategory === 'All Skills';

  const filteredRows = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        row.skillName.toLowerCase().includes(query) ||
        row.title.toLowerCase().includes(query) ||
        row.trigger.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All Skills' || row.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [rows, searchQuery, selectedCategory]);

  return (
    <div>
      {/* Categories as a horizontal filter row rather than a left column, the
          same as /patterns. Inside the console that column sat beside the rail,
          so the page had two nav columns before the first card. */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('All Skills')}
          aria-pressed={selectedCategory === 'All Skills'}
          className={`type-caption rounded-pill border px-4 py-2 transition-colors ${
            selectedCategory === 'All Skills'
              ? 'border-border-secondary bg-surface-secondary font-semibold text-text-primary'
              : 'border-border-primary text-text-secondary hover:border-accent-primary/40 hover:text-text-primary'
          }`}
        >
          All Skills
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
            className={`type-caption rounded-pill border px-4 py-2 transition-colors ${
              selectedCategory === category
                ? 'border-transparent bg-text-primary font-semibold text-background-primary'
                : 'border-border-primary text-text-secondary hover:border-accent-primary/40 hover:text-text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div>
        {/* Search Bar */}
        <div className="mb-6 bg-surface-primary dark:bg-surface-elevated rounded-2xl p-5 border border-border-primary shadow-card">
          <UnifiedSearchBar
            placeholder="Search any skill you need"
            value={searchQuery}
            onChange={setSearchQuery}
            size="sm"
          />
        </div>

        {/* Browsing everything: the directory groups itself by category, the
            same shape /patterns uses. 38 identical cards in a flat run gave
            the page no structure of its own and left the filter pills carrying
            all of it. Searching or filtering brings the cards back, where the
            set is small enough that each result earns the space. */}
        {isBrowsingAll && (
          <div className="border-b border-border-primary">
            {categories.map((category) => {
              const categoryRows = rows.filter((r) => r.category === category);
              if (categoryRows.length === 0) return null;

              return (
                <section
                  key={category}
                  className="grid gap-loose border-t border-border-primary py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12"
                >
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <h2 className="type-h3 mb-2 text-text-primary">{category}</h2>
                    <p className="type-eyebrow uppercase text-text-secondary">
                      {categoryRows.length}{' '}
                      {categoryRows.length === 1 ? 'skill' : 'skills'}
                    </p>
                  </div>

                  {/* One line per skill while browsing.

                      Each row used to be three: the name, the title, then the
                      whole trigger sentence. Across 38 skills that is several
                      screens, and the length is what made the library feel
                      shapeless — you could never see a category whole, so the
                      grouping did no work.

                      The trigger is not lost. It is the reason to open a skill,
                      not a thing to read 38 times, so it appears on search and
                      filter, where the set is small enough for it to earn the
                      space. */}
                  <div className="min-w-0">
                    {/* "Seen in" once, over the column, not on all 38 rows:
                        inline it became the same two words repeated down the
                        page, which is what the bookmarks were doing before they
                        came out.
                        
                        Aligned by mirroring the row rather than right-aligning
                        to the container. The marks are not the last thing in a
                        row — the save button is — so text-right pushed the
                        label past them by that button's own width. The spacer
                        stands in for it at the same gap, so the two edges stay
                        together without a magic number. */}
                    <div className="mb-1.5 hidden items-center gap-4 sm:flex">
                      <span className="flex-1" />
                      <p className="type-footnote uppercase tracking-wide text-text-secondary">
                        Seen in
                      </p>
                      <span aria-hidden="true" className="h-9 w-9 shrink-0" />
                    </div>
                    <ul className="min-w-0">
                    {categoryRows.map((row, index) => (
                      <li
                        key={row.slug}
                        className={index > 0 ? 'border-t border-border-primary' : ''}
                      >
                        <div className="group relative flex items-center gap-4 py-2.5">
                          <Link
                            href={`/patterns/${row.slug}`}
                            className="flex min-w-0 flex-1 flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline"
                          >
                            {/* Title first, identifier second.

                                The mono name led at first, on the reasoning
                                that it is what you type and what lands in your
                                project. But a column of slugs is a column of
                                lowercase-and-hyphens, and the eye has to parse
                                each one to get the meaning that the title
                                states outright. The slug is how you refer to a
                                skill once you want it; the title is how you
                                find the one you want.

                                Fixed width at the sizes that have room, so the
                                two line up as columns and either can be read
                                straight down. */}
                            <span className="type-body shrink-0 font-medium text-text-primary transition-colors group-hover:text-accent-primary sm:w-60">
                              {row.title}
                            </span>
                            <span className="type-caption min-w-0 truncate font-mono text-text-secondary">
                              {row.skillName}
                            </span>
                          </Link>

                          {/* The products this pattern was observed in.

                              This column used to be 38 identical bookmark
                              icons — the same control repeated down the page,
                              carrying no information and reading as chrome. The
                              logos are content: they say the pattern was taken
                              from shipped products rather than invented, and
                              they differ row to row, which is what makes a long
                              list worth scanning. */}
                          {row.products.length > 0 && (
                            <ul className="hidden shrink-0 items-center gap-3 sm:flex">
                              {row.products.slice(0, 3).map((product) => (
                                // Grouped so the name can appear on hovering
                                // THIS logo rather than the whole row — with
                                // three marks in a row, a row-level reveal
                                // would not say which one you are pointing at.
                                <li
                                  key={product.name}
                                  className="group/logo relative flex items-center"
                                >
                                  {product.logo ? (
                                    <Image
                                      src={product.logo}
                                      alt={product.name}
                                      width={18}
                                      height={18}
                                      // Grey at rest so a row of marks reads as
                                      // one quiet group rather than three
                                      // competing black shapes, and comes up to
                                      // full strength under the pointer.
                                      className="h-[18px] w-[18px] opacity-50 transition-opacity group-hover/logo:opacity-100"
                                      style={{ filter: logoFilter }}
                                    />
                                  ) : (
                                    <span className="type-footnote text-text-secondary">
                                      {product.name}
                                    </span>
                                  )}
                                  {/* The name, on hovering the mark. Pointer
                                      events off so it cannot sit between the
                                      cursor and the row link underneath. */}
                                  <span
                                    aria-hidden="true"
                                    className="type-footnote pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-card bg-text-primary px-2 py-1 text-background-primary opacity-0 transition-opacity group-hover/logo:opacity-100"
                                  >
                                    {product.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Save stays, but stops shouting. It reveals on
                              hover and on keyboard focus — and stays put where
                              there is no hover at all, because a control only
                              a mouse can find is not a control on a phone. */}
                          <SaveToDashboardButton
                            slug={row.slug}
                            variant="icon"
                            showLabelOnHover
                            className="shrink-0 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                          />
                        </div>
                      </li>
                    ))}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Not merely hidden when grouped — not rendered. Two copies of every
            skill in the DOM is a screen-reader duplicate and a doubled
            document. */}
        {!isBrowsingAll && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRows.map((row) => (
            <div
              key={row.slug}
              className="relative transition-transform duration-200 ease-out hover:-translate-y-1.5"
            >
              {/* Card overlay, so the label hangs below: above it would sit
                  off the card's top edge. Always visible here, unlike in the
                  list — on a card it is the only control, and there is no row
                  of 38 identical copies for it to disappear into. */}
              <SaveToDashboardButton
                slug={row.slug}
                variant="icon"
                showLabelOnHover
                labelPlacement="bottom"
                className="absolute top-4 right-4"
              />
              <div
                className="bg-surface-primary rounded-2xl p-8 border border-border-primary shadow-card
                            hover:shadow-card-hover hover:border-border-primary transition-all duration-300 h-full
                            flex flex-col"
              >
                <Link href={`/patterns/${row.slug}`} className="group flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text-primary mb-1 transition-colors">
                    {row.title}
                  </h3>
                  <span className="text-sm text-text-secondary mb-4">{row.skillName}</span>

                  {/* Trigger (description) */}
                  <p className="text-lg text-text-secondary leading-relaxed line-clamp-3 flex-grow mb-8">
                    {row.trigger}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-border-primary mb-6"></div>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-accent-subtle dark:bg-surface-elevated text-text-secondary">
                      {row.category}
                    </span>
                  </div>

                  {/* Used By */}
                  {row.products.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-text-secondary font-medium">Used by:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {row.products.map((product) =>
                          product.logo ? (
                            <Image
                              key={product.name}
                              src={product.logo}
                              alt={product.name}
                              title={product.name}
                              width={20}
                              height={20}
                              className="h-5 w-5"
                              style={{ filter: logoFilter }}
                            />
                          ) : (
                            <span key={product.name} className="text-sm text-text-secondary">
                              {product.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

        {filteredRows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No skills found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
