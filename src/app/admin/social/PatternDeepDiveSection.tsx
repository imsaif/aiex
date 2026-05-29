'use client';

import { useMemo, useState } from 'react';
import patterns from '@/data/patterns';

interface CompanyToTag {
  product: string;
  x?: string;
  linkedinName?: string;
  needsHandle: boolean;
}

interface DeepDive {
  featuredProduct: string;
  patternTitle: string;
  linkedin: string;
  x: string;
  companiesToTag: CompanyToTag[];
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
  const [linkedinDraft, setLinkedinDraft] = useState('');
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
      setLinkedinDraft(data.deepDive.linkedin);
      setXDraft(data.deepDive.x);
      flash('success', 'Draft generated. Review, edit, then copy into the native composer to tag companies.');
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
          Generates a draft for review. LinkedIn company tags only fire from the native composer, so
          copy the text in, then tag the companies listed below using @-autocomplete. Nothing is auto-posted.
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
            Pick a pattern and generate a product-first teardown for LinkedIn + X.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LinkedIn draft */}
          <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">
                LinkedIn draft
                <span className="ml-2 font-normal text-text-tertiary">
                  {linkedinDraft.length} chars
                </span>
              </h3>
              <button
                onClick={() => copy(linkedinDraft, 'LinkedIn draft')}
                className="px-3 py-1.5 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors text-xs font-medium"
              >
                Copy for LinkedIn
              </button>
            </div>
            <textarea
              value={linkedinDraft}
              onChange={(e) => setLinkedinDraft(e.target.value)}
              rows={16}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm focus:ring-2 focus:ring-accent-primary focus:border-accent-primary resize-y"
            />
          </div>

          {/* X draft + companies to tag */}
          <div className="space-y-6">
            <div className="bg-surface-primary rounded-lg border border-border-primary p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  X draft
                  <span className={`ml-2 font-normal ${xDraft.length > 280 ? 'text-status-error' : 'text-text-tertiary'}`}>
                    {xDraft.length}/280
                  </span>
                </h3>
                <button
                  onClick={() => copy(xDraft, 'X draft')}
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
          </div>
        </div>
      )}
    </div>
  );
}
