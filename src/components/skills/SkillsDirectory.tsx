'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UnifiedSearchBar from '../ui/UnifiedSearchBar';
import SaveToDashboardButton from '../handoff/SaveToDashboardButton';

export interface SkillRow {
  slug: string;
  skillName: string;
  title: string;
  category: string;
  trigger: string;
  products: { name: string; logo?: string }[];
  command: string;
}

interface SkillsDirectoryProps {
  rows: SkillRow[];
  categories: string[];
}

export function SkillsDirectory({ rows, categories }: SkillsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [failedSlug, setFailedSlug] = useState<string | null>(null);

  async function copyCommand(row: SkillRow) {
    try {
      await navigator.clipboard.writeText(row.command);
      setCopiedSlug(row.slug);
      setFailedSlug(null);
      window.clarity?.('event', 'skill-copy');
      window.clarity?.('set', 'skill-copy-slug', row.skillName);
    } catch {
      setFailedSlug(row.slug);
      setCopiedSlug(null);
    }
  }

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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar (stacks above the grid on mobile, fixed rail on desktop) */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="bg-surface-primary dark:bg-surface-elevated rounded-2xl p-6 border border-border-primary shadow-card lg:sticky lg:top-24">
          <h3 className="font-semibold text-xl mb-4 text-text-primary">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => setSelectedCategory('All Skills')}
                aria-pressed={selectedCategory === 'All Skills'}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  selectedCategory === 'All Skills'
                    ? 'bg-white font-semibold shadow-sm text-black'
                    : 'hover:bg-white text-gray-700 dark:text-white hover:text-black'
                }`}
              >
                All Skills
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === category
                      ? 'bg-white font-semibold shadow-sm text-black'
                      : 'hover:bg-white text-gray-700 dark:text-white hover:text-black'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Skills Grid */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="mb-6 bg-surface-primary dark:bg-surface-elevated rounded-2xl p-5 border border-border-primary shadow-card">
          <UnifiedSearchBar
            placeholder="Search any skill you need"
            value={searchQuery}
            onChange={setSearchQuery}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Copy install (skills-specific addition) */}
                <div className="mt-6">
                {failedSlug === row.slug && (
                  <>
                    <p className="mb-tight text-sm text-text-secondary">
                      Copy failed. Select the command below manually.
                    </p>
                    <pre className="mb-tight overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary">
                      {row.command}
                    </pre>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => copyCommand(row)}
                  className="w-full rounded-input border border-border-primary px-snug py-tight text-sm text-text-primary hover:bg-surface-secondary"
                >
                  {copiedSlug === row.slug ? 'Copied' : 'Copy install'}
                  <span aria-live="polite" className="sr-only">
                    {copiedSlug === row.slug ? 'Copied' : failedSlug === row.slug ? 'Copy failed' : ''}
                  </span>
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No skills found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
