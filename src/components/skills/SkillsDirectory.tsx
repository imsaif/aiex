'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [failedSlug, setFailedSlug] = useState<string | null>(null);

  const visible = activeCategory ? rows.filter((r) => r.category === activeCategory) : rows;

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

  return (
    <div>
      <div className="flex flex-wrap gap-tight" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={`rounded-pill border px-snug py-tight text-sm ${
            activeCategory === null
              ? 'border-accent-primary font-semibold text-text-primary'
              : 'border-border-primary text-text-secondary'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`rounded-pill border px-snug py-tight text-sm ${
              activeCategory === category
                ? 'border-accent-primary font-semibold text-text-primary'
                : 'border-border-primary text-text-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <ol className="mt-loose grid grid-cols-1 gap-default md:grid-cols-2 lg:grid-cols-3">
        {visible.map((row) => (
          <li
            key={row.slug}
            className="flex flex-col rounded-card border border-border-primary bg-surface-primary p-default shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span className="mb-tight self-start rounded-pill border border-border-primary px-tight text-sm text-text-secondary">
              {row.category}
            </span>
            <Link href={`/patterns/${row.slug}`} className="font-medium text-text-primary hover:underline">
              {row.skillName}
            </Link>
            <span className="text-sm text-text-secondary">{row.title}</span>
            <p className="mt-tight text-sm text-text-secondary" title={row.trigger}>
              {row.trigger}
            </p>

            <div
              className="mt-default flex flex-wrap items-center gap-tight"
              role="group"
              aria-label={`Products using ${row.title}`}
            >
              <span className="text-sm text-text-secondary">Used by</span>
              {row.products.map((product) =>
                product.logo ? (
                  <Image
                    key={product.name}
                    src={product.logo}
                    alt={product.name}
                    title={product.name}
                    width={20}
                    height={20}
                  />
                ) : (
                  <span key={product.name} className="text-sm text-text-secondary">
                    {product.name}
                  </span>
                )
              )}
            </div>

            {failedSlug === row.slug && (
              <>
                <p className="mt-tight text-sm text-text-secondary">
                  Copy failed. Select the command below manually.
                </p>
                <pre className="mt-tight overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary">
                  {row.command}
                </pre>
              </>
            )}

            <button
              type="button"
              onClick={() => copyCommand(row)}
              className="mt-default w-full rounded-input border border-border-primary px-snug py-tight text-sm text-text-primary hover:bg-surface-secondary"
            >
              {copiedSlug === row.slug ? 'Copied' : 'Copy install'}
              <span aria-live="polite" className="sr-only">
                {copiedSlug === row.slug ? 'Copied' : failedSlug === row.slug ? 'Copy failed' : ''}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
