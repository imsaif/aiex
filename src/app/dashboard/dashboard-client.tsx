'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  XMarkIcon,
  BookmarkIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import patterns from '@/data/patterns';
import type { Pattern } from '@/types';
import { useHandoffKit } from '@/hooks/useHandoffKit';
import { composeHandoffFile, handoffFilename } from '@/lib/handoff/composeHandoff';
import { trackEvent } from '@/utils/analytics';

export default function DashboardClient() {
  const { savedSlugs, remove, clear, isLoading } = useHandoffKit();
  const [copied, setCopied] = useState(false);

  // Resolve saved slugs to full patterns, preserving save order, dropping any
  // slug that no longer maps to a pattern.
  const savedPatterns = useMemo<Pattern[]>(() => {
    const bySlug = new Map(patterns.map((p) => [p.slug, p]));
    return savedSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Pattern => Boolean(p));
  }, [savedSlugs]);

  const hasPatterns = savedPatterns.length > 0;

  const handleDownload = () => {
    const content = composeHandoffFile(savedPatterns);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = handoffFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackEvent('handoff', { action: 'download', count: savedPatterns.length });
  };

  const handleCopy = async () => {
    const content = composeHandoffFile(savedPatterns);
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // Fallback for private browsing / older browsers
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent('handoff', { action: 'copy', count: savedPatterns.length });
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="mb-8">
        <p className="type-eyebrow text-accent-primary mb-2">Your dashboard</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-3">
          Saved patterns
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          Save the AI UX patterns you want to build, then generate a handoff file you can drop
          into your repo and hand to Claude Code, Cursor, or any AI coding agent.
        </p>
      </div>

      {isLoading ? (
        <div className="h-40 rounded-card bg-surface-secondary animate-pulse" aria-hidden="true" />
      ) : !hasPatterns ? (
        /* Empty state */
        <div className="rounded-card border border-border-primary bg-surface-primary p-8 sm:p-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-subtle">
            <BookmarkIcon className="h-7 w-7 text-accent-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            No saved patterns yet
          </h2>
          <p className="text-base text-text-secondary max-w-md mx-auto mb-6">
            Browse the library and tap <span className="font-medium text-text-primary">Save</span> on
            any pattern. Saved patterns collect here, ready to export as a handoff file.
          </p>
          <Link
            href="/patterns"
            className="inline-flex items-center gap-2 rounded-pill bg-accent-primary px-5 py-2.5 text-base font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Browse patterns
          </Link>
        </div>
      ) : (
        <>
          {/* Generate handoff card */}
          <div className="rounded-card border border-border-primary bg-surface-primary p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <CommandLineIcon className="h-6 w-6 text-accent-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Generate your handoff file
                </h2>
                <p className="text-base text-text-secondary mt-1">
                  One Markdown file covering all {savedPatterns.length} saved pattern
                  {savedPatterns.length === 1 ? '' : 's'}. Drop it in your repo and your AI
                  coding agent will implement each pattern in the right files, then report back.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-pill bg-accent-primary px-5 py-2.5 text-base font-medium text-white hover:bg-accent-hover transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                Download handoff file
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-pill border border-border-primary bg-surface-primary px-5 py-2.5 text-base font-medium text-text-secondary hover:text-text-primary hover:border-accent-primary transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-accent-primary" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-5 w-5" aria-hidden="true" />
                    Copy to clipboard
                  </>
                )}
              </button>
              <span className="text-sm text-text-tertiary">{handoffFilename()}</span>
            </div>
          </div>

          {/* Saved patterns list */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
              {savedPatterns.length} pattern{savedPatterns.length === 1 ? '' : 's'}
            </h2>
            <button
              type="button"
              onClick={clear}
              className="text-sm text-text-tertiary hover:text-status-error transition-colors"
            >
              Clear all
            </button>
          </div>
          <ul className="space-y-3">
            {savedPatterns.map((pattern) => (
              <li
                key={pattern.slug}
                className="flex items-start gap-4 rounded-card border border-border-primary bg-surface-primary p-4 sm:p-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/patterns/${pattern.slug}`}
                      className="text-lg font-semibold text-text-primary hover:text-accent-primary transition-colors"
                    >
                      {pattern.title}
                    </Link>
                    {pattern.content.installPrompt && (
                      <span className="rounded-pill bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent-primary">
                        Install-ready
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">{pattern.description}</p>
                  <p className="mt-1 text-xs text-text-tertiary">{pattern.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(pattern.slug)}
                  aria-label={`Remove ${pattern.title} from dashboard`}
                  title="Remove"
                  className="shrink-0 rounded-full p-2 text-text-tertiary hover:text-status-error hover:bg-surface-secondary transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
