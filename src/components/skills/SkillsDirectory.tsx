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

                  <ul className="min-w-0">
                    {categoryRows.map((row, index) => (
                      <li
                        key={row.slug}
                        className={index > 0 ? 'border-t border-border-primary' : ''}
                      >
                        <div className="group relative flex items-start gap-4 py-4">
                          <Link
                            href={`/patterns/${row.slug}`}
                            className="min-w-0 flex-1"
                          >
                            {/* The skill's own name leads: it is what you type
                                and what appears in your project, so it is the
                                identifier, not the prose title. */}
                            <p className="type-caption mb-1 font-mono text-text-secondary">
                              {row.skillName}
                            </p>
                            <h3 className="type-body mb-1 font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                              {row.title}
                            </h3>
                            <p className="type-caption text-text-secondary">
                              {row.trigger}
                            </p>
                          </Link>

                          <SaveToDashboardButton
                            slug={row.slug}
                            variant="icon"
                            className="shrink-0"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
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
              <SaveToDashboardButton
                slug={row.slug}
                variant="icon"
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
