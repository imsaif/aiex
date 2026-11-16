'use client';

import { useState } from 'react';
import { DWIC_ARTICLES } from '@/lib/social/dwic';
import SlidesPanel from './SlidesPanel';

/**
 * The dwic view of the Social page: the same blocks as a newsletter issue (post text,
 * the four slides, the share image), with an article picked instead of a newsletter.
 * Article text lives in src/lib/social/dwic.ts.
 */
export default function DwicArticlePanel({ onCopied }: { onCopied: (text: string) => void }) {
  const [slug, setSlug] = useState(DWIC_ARTICLES[0].slug);
  const article = DWIC_ARTICLES.find((a) => a.slug === slug) ?? DWIC_ARTICLES[0];
  const ogPath = `/api/social/dwic/og?article=${article.slug}`;

  const copy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    onCopied(message);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[280px]">
            <label htmlFor="dwic-article" className="block text-sm font-medium text-text-secondary mb-1.5">
              Select Article
            </label>
            <select
              id="dwic-article"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
            >
              {DWIC_ARTICLES.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.title} ({a.date})
                </option>
              ))}
            </select>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-sm"
          >
            Open article
          </a>
        </div>
      </div>

      <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-text-primary">LinkedIn post</p>
          <button
            onClick={() => copy(article.post, 'Post text copied')}
            className="px-3 py-1.5 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-sm font-medium"
          >
            Copy post text
          </button>
        </div>
        <p className="whitespace-pre-wrap text-sm text-text-secondary">{article.post}</p>
      </div>

      <SlidesPanel base={`/api/social/dwic?article=${article.slug}`} prefix="dwic" onCopied={onCopied} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-text-primary">Share Image</p>
            <button
              onClick={() => copy(`${window.location.origin}${ogPath}`, 'Image URL copied to clipboard!')}
              className="px-3 py-1.5 bg-background-tertiary text-text-secondary rounded-md hover:bg-border-primary transition-colors text-xs font-medium"
            >
              Copy URL
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ogPath} alt={`Social share image for ${article.title}`} className="w-full rounded-md border border-border-primary" />
        </div>
      </div>
    </div>
  );
}
