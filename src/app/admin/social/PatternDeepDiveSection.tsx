'use client';

import { useMemo, useState } from 'react';
import patterns from '@/data/patterns';

interface CompanyToTag {
  product: string;
  x?: string;
  linkedinName?: string;
  needsHandle: boolean;
}

interface DeepDiveImage {
  url: string;
  caption: string;
  alt?: string;
}

interface DeepDive {
  featuredProduct: string;
  patternTitle: string;
  patternUrl: string;
  article: string;
  x: string;
  companiesToTag: CompanyToTag[];
  images: DeepDiveImage[];
}

function extractProductName(title: string): string {
  const cleaned = title.replace(/^[\s✅❌⚠️🚫]+/g, '').trim();
  return cleaned.split(' ')[0] || cleaned;
}

export default function PatternDeepDiveSection() {
  // Lightweight pattern list with the products each one features.
  const patternOptions = useMemo(
    () =>
      patterns
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          products: Array.from(
            new Set(
              (p.content.examples || [])
                .filter((e) => e.title)
                .map((e) => extractProductName(e.title))
            )
          ),
        }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    []
  );

  const [selectedSlug, setSelectedSlug] = useState('');
  const [featuredProduct, setFeaturedProduct] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deepDive, setDeepDive] = useState<DeepDive | null>(null);
  const [articleDraft, setArticleDraft] = useState('');
  const [xDraft, setXDraft] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedPattern = patternOptions.find((p) => p.slug === selectedSlug);

  const flash = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const generate = async () => {
    if (!selectedSlug) return;
    setIsGenerating(true);
    setMessage(null);
    try {
      const res = await fetch('/api/social/deepdive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patternSlug: selectedSlug, featuredProduct: featuredProduct || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setDeepDive(data.deepDive);
      setArticleDraft(data.deepDive.article);
      setXDraft(data.deepDive.x);
      flash('success', 'Article generated. Review, edit, then publish as a LinkedIn Article and tag the companies below.');
    } catch (error) {
      flash('error', error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    flash('success', `${label} copied. Paste into the native composer and tag the companies below.`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Pattern</label>
            <select
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                setFeaturedProduct('');
              }}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
            >
              <option value="">Choose a pattern to tear down...</option>
              {patternOptions.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {selectedPattern && selectedPattern.products.length > 0 && (
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Lead with (optional)
              </label>
              <select
                value={featuredProduct}
                onChange={(e) => setFeaturedProduct(e.target.value)}
                className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
              >
                <option value="">First example ({selectedPattern.products[0]})</option>
                {selectedPattern.products.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={generate}
            disabled={!selectedSlug || isGenerating}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {isGenerating ? 'Generating...' : deepDive ? 'Regenerate' : 'Generate draft'}
          </button>
        </div>

        <p className="mt-3 text-xs text-text-tertiary">
          Generates a long-form article draft for review. Real code from the pattern is spliced in
          verbatim. Paste it into LinkedIn&apos;s Article editor, attach the images listed below, and tag the
          companies using @-autocomplete. Nothing is auto-posted.
        </p>

        {message && (
          <div
            className={`mt-3 p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-status-success/10 text-status-success'
                : 'bg-status-error/10 text-status-error'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {!deepDive ? (
        <div className="bg-surface-primary rounded-lg border border-border-primary p-6">
          <p className="text-center text-text-tertiary py-8">
            Pick a pattern and generate a long-form article for LinkedIn, with a short X teaser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Long-form article (primary) */}
          <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">
                LinkedIn article
                <span className="ml-2 font-normal text-text-tertiary">
                  {articleDraft.trim() ? articleDraft.trim().split(/\s+/).length : 0} words · {articleDraft.length} chars
                </span>
              </h3>
              <button
                onClick={() => copy(articleDraft, 'Article')}
                className="px-3 py-1.5 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-xs font-medium"
              >
                Copy for LinkedIn Article
              </button>
            </div>
            <textarea
              value={articleDraft}
              onChange={(e) => setArticleDraft(e.target.value)}
              rows={24}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm font-mono focus:ring-2 focus:ring-accent-primary focus:border-accent-primary resize-y"
            />
            <p className="mt-2 text-xs text-text-tertiary">
              Markdown. Paste into LinkedIn&apos;s Article editor (headings, code blocks, and bullets carry over).
              Links back to{' '}
              <a href={deepDive.patternUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {deepDive.patternUrl}
              </a>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* X teaser */}
            <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  X teaser
                  <span className={`ml-2 font-normal ${xDraft.length > 280 ? 'text-status-error' : 'text-text-tertiary'}`}>
                    {xDraft.length}/280
                  </span>
                </h3>
                <button
                  onClick={() => copy(xDraft, 'X teaser')}
                  className="px-3 py-1.5 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-xs font-medium"
                >
                  Copy for X
                </button>
              </div>
              <textarea
                value={xDraft}
                onChange={(e) => setXDraft(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm focus:ring-2 focus:ring-accent-primary focus:border-accent-primary resize-y"
              />
            </div>

            {/* Companies to tag + images to include */}
            <div className="space-y-6">
              <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-1">Companies to tag</h3>
                <p className="text-xs text-text-tertiary mb-3">
                  Tag these in the composer. LinkedIn: type @ and pick the page. X: the handle is shown.
                </p>
                <div className="flex flex-wrap gap-2">
                  {deepDive.companiesToTag.map((c) => (
                    <span
                      key={c.product}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                        c.needsHandle
                          ? 'bg-status-warning/10 text-status-warning border-status-warning/20'
                          : 'bg-background-secondary text-text-primary border-border-primary'
                      }`}
                      title={c.needsHandle ? 'No verified handle on file — verify before tagging' : undefined}
                    >
                      <span className="font-medium">{c.product}</span>
                      {c.x ? (
                        <span className="text-text-tertiary">@{c.x}</span>
                      ) : (
                        <span className="text-status-warning">verify handle</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {deepDive.images.length > 0 && (
                <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Images to include</h3>
                  <p className="text-xs text-text-tertiary mb-3">
                    Download and attach these to the article. Copy a URL to open or save it.
                  </p>
                  <ul className="space-y-2">
                    {deepDive.images.map((img) => (
                      <li
                        key={img.url}
                        className="flex items-center justify-between gap-3 rounded-md border border-border-primary bg-background-secondary px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-text-primary">{img.caption || 'Image'}</p>
                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-xs text-text-tertiary underline"
                          >
                            {img.url}
                          </a>
                        </div>
                        <button
                          onClick={() => copy(img.url, 'Image URL')}
                          className="shrink-0 px-2.5 py-1 bg-background-primary border border-border-primary text-text-primary rounded-md hover:bg-surface-primary transition-colors text-xs font-medium"
                        >
                          Copy URL
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
