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
          className={`rounded-pill border px-snug py-tight text-sm ${
            activeCategory === null
              ? 'border-accent-primary text-text-primary'
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
            className={`rounded-pill border px-snug py-tight text-sm ${
              activeCategory === category
                ? 'border-accent-primary text-text-primary'
                : 'border-border-primary text-text-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <ol className="mt-loose divide-y divide-border-primary">
        {visible.map((row, index) => (
          <li key={row.slug} className="flex flex-wrap items-start gap-default py-default">
            <span className="type-caption w-6 shrink-0 text-text-secondary">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <Link href={`/patterns/${row.slug}`} className="font-medium text-text-primary hover:underline">
                {row.skillName}
              </Link>
              <span className="ml-snug rounded-pill border border-border-primary px-tight text-sm text-text-secondary">
                {row.category}
              </span>
              <p className="mt-tight text-sm text-text-secondary" title={row.trigger}>
                {row.trigger}
              </p>
              {failedSlug === row.slug && (
                <pre className="mt-tight overflow-x-auto rounded-input bg-surface-secondary p-snug text-sm text-text-primary">
                  {row.command}
                </pre>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-tight" aria-label={`Products using ${row.title}`}>
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
            <button
              type="button"
              onClick={() => copyCommand(row)}
              className="shrink-0 rounded-input border border-border-primary px-snug py-tight text-sm text-text-primary hover:bg-surface-secondary"
            >
              {copiedSlug === row.slug ? 'Copied' : 'Copy install'}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
