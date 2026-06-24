'use client';

import { useMemo, useState, useCallback } from 'react';
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
import { useSavedAudits } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff, combinedHandoffFilename } from '@/lib/handoff/composeCombined';
import { trackAuditEvent } from '@/lib/audit/analytics';
import { SelectCheckbox } from '@/components/ui/SelectCheckbox';
import { UndoSnackbar } from '@/components/ui/UndoSnackbar';
import SavedAuditsSection from './SavedAuditsSection';

/** "a chat interface" -> "Chat interface" for the undo message. */
function auditTitle(productLabel: string): string {
  const s = productLabel.replace(/^an?\s+/i, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function DashboardClient() {
  const { savedSlugs, add: addPattern, remove: removePattern, clear: clearPatterns, isLoading } = useHandoffKit();
  const { savedAudits, save: saveAudit, remove: removeAudit, isLoading: auditsLoading } = useSavedAudits();
  const [copied, setCopied] = useState(false);
  // Undo for accidental deletes: stash a restore closure + show a snackbar.
  // Only the most recent removal is undoable (a new removal replaces it).
  const [undo, setUndo] = useState<{ message: string; restore: () => void } | null>(null);
  const dismissUndo = useCallback(() => setUndo(null), []);
  const handleUndo = useCallback(() => {
    setUndo((prev) => {
      prev?.restore();
      return null;
    });
  }, []);

  // Selection modelled as *deselected* sets: empty ⇒ everything selected, and a
  // newly-saved item is auto-included (it's simply not in the deselected set).
  // This survives the async localStorage hydration that would defeat a seeded
  // selected-set.
  const [deselectedAuditIds, setDeselectedAuditIds] = useState<Set<string>>(new Set());
  const [deselectedPatternSlugs, setDeselectedPatternSlugs] = useState<Set<string>>(new Set());

  // Resolve saved slugs to full patterns, preserving save order, dropping any
  // slug that no longer maps to a pattern.
  const savedPatterns = useMemo<Pattern[]>(() => {
    const bySlug = new Map(patterns.map((p) => [p.slug, p]));
    return savedSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Pattern => Boolean(p));
  }, [savedSlugs]);

  const hasPatterns = savedPatterns.length > 0;
  const hasAudits = savedAudits.length > 0;
  const isEmpty = !hasPatterns && !hasAudits;

  const isAuditSelected = (id: string) => !deselectedAuditIds.has(id);
  const isPatternSelected = (slug: string) => !deselectedPatternSlugs.has(slug);

  const toggleAudit = (id: string) =>
    setDeselectedAuditIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const togglePattern = (slug: string) =>
    setDeselectedPatternSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const handleRemoveAudit = (id: string) => {
    const removed = savedAudits.find((a) => a.id === id);
    removeAudit(id);
    setDeselectedAuditIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (removed) {
      setUndo({
        message: `Removed ${auditTitle(removed.productLabel)} audit`,
        restore: () => saveAudit(removed),
      });
    }
  };

  const handleRemovePattern = (slug: string) => {
    const removed = savedPatterns.find((p) => p.slug === slug);
    removePattern(slug);
    setDeselectedPatternSlugs((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
    if (removed) {
      setUndo({
        message: `Removed ${removed.title}`,
        restore: () => addPattern(slug),
      });
    }
  };

  const handleClearPatterns = () => {
    const removedSlugs = [...savedSlugs];
    clearPatterns();
    setDeselectedPatternSlugs(new Set());
    if (removedSlugs.length) {
      setUndo({
        message: `Cleared ${removedSlugs.length} pattern${removedSlugs.length === 1 ? '' : 's'}`,
        // Re-add in original order so positions are preserved on undo.
        restore: () => removedSlugs.forEach((s) => addPattern(s)),
      });
    }
  };

  const selectedAudits = savedAudits.filter((a) => isAuditSelected(a.id));
  const selectedPatterns = savedPatterns.filter((p) => isPatternSelected(p.slug));
  const nA = selectedAudits.length;
  const nP = selectedPatterns.length;
  const canGenerate = nA + nP > 0;

  const summaryText = (() => {
    const parts: string[] = [];
    if (nA) parts.push(`${nA} audit${nA === 1 ? '' : 's'}`);
    if (nP) parts.push(`${nP} pattern${nP === 1 ? '' : 's'}`);
    return parts.length ? `Includes ${parts.join(' + ')}.` : 'Select at least one item to include.';
  })();

  const handleDownload = () => {
    if (!canGenerate) return;
    const content = composeCombinedHandoff(selectedAudits, selectedPatterns);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = combinedHandoffFilename();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackAuditEvent('dashboard_handoff_generated', { action: 'download', audits: nA, patterns: nP, count: nA + nP });
    trackAuditEvent('handoff_file_downloaded', { audits: nA, patterns: nP, count: nA + nP });
  };

  const handleCopy = async () => {
    if (!canGenerate) return;
    const content = composeCombinedHandoff(selectedAudits, selectedPatterns);
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
    trackAuditEvent('dashboard_handoff_generated', { action: 'copy', audits: nA, patterns: nP, count: nA + nP });
  };

  const header = (
    <div className="mb-8">
      <p className="type-eyebrow text-accent-primary mb-2">Your dashboard</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-3">
        Saved audits &amp; patterns
      </h1>
      <p className="text-lg text-text-secondary max-w-2xl">
        Audits are fixes for your own product. Patterns are reference for what you want to build.
        Pick what to include, then generate one handoff file for Claude Code, Cursor, or any AI
        coding agent.
      </p>
      <p className="mt-4 text-base text-text-secondary max-w-2xl">
        Want a senior set of eyes instead?{' '}
        <Link href="/services" className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
          Get your whole product audited for you →
        </Link>
      </p>
    </div>
  );

  return (
    <section className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {isLoading || auditsLoading ? (
        <>
          {header}
          <div className="h-40 rounded-card bg-surface-secondary animate-pulse" aria-hidden="true" />
        </>
      ) : isEmpty ? (
        /* Empty state */
        <>
          {header}
          <div className="rounded-card border border-border-primary bg-surface-primary p-8 sm:p-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-subtle">
            <BookmarkIcon className="h-7 w-7 text-accent-primary" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Nothing saved yet
          </h2>
          <p className="text-base text-text-secondary max-w-md mx-auto mb-6">
            Run an audit and tap <span className="font-medium text-text-primary">Save audit</span>, or
            browse the library and tap <span className="font-medium text-text-primary">Save</span> on
            any pattern. Everything you save collects here, ready to export as a handoff file.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-pill bg-accent-primary px-5 py-2.5 text-base font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Run an audit
            </Link>
            <Link
              href="/patterns"
              className="inline-flex items-center gap-2 rounded-pill border border-border-primary bg-surface-primary px-5 py-2.5 text-base font-medium text-text-secondary hover:text-text-primary hover:border-accent-primary transition-colors"
            >
              Browse patterns
            </Link>
          </div>
        </div>
        </>
      ) : (
        <div className="rounded-card border border-border-primary bg-surface-primary shadow-card p-5 sm:p-8 lg:p-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:items-start">
          {/* Left column — saved items */}
          <div>
          {header}
          {/* Section A — Audits ("fix now") */}
          {hasAudits && (
            <SavedAuditsSection
              audits={savedAudits}
              isSelected={isAuditSelected}
              onToggleSelect={toggleAudit}
              onRemove={handleRemoveAudit}
            />
          )}

          {/* Section B — Patterns ("build / reference") */}
          {hasPatterns && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                  {savedPatterns.length} pattern{savedPatterns.length === 1 ? '' : 's'}
                </p>
                <button
                  type="button"
                  onClick={handleClearPatterns}
                  className="text-sm text-text-secondary hover:text-status-error transition-colors"
                >
                  Clear all
                </button>
              </div>
              <p className="mt-1 mb-3 text-sm text-text-secondary">
                Patterns you want to build. Keep for reference.
              </p>
              <ul className="divide-y divide-border-primary border-t border-border-primary">
                {savedPatterns.map((pattern) => (
                  <li
                    key={pattern.slug}
                    className="flex items-start gap-3 py-4 sm:py-5"
                  >
                    <SelectCheckbox
                      checked={isPatternSelected(pattern.slug)}
                      onChange={() => togglePattern(pattern.slug)}
                      label={`Include ${pattern.title} in the handoff`}
                      className="mt-1"
                    />
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
                      <p className="mt-1 text-sm text-text-secondary">{pattern.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePattern(pattern.slug)}
                      aria-label={`Remove ${pattern.title} from dashboard`}
                      title="Remove"
                      className="shrink-0 rounded-full p-2 text-text-tertiary hover:text-status-error hover:bg-surface-secondary transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </div>
          {/* /left column */}

          {/* Right rail — single primary CTA, sticky on desktop so it stays in
              view while the user selects items */}
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-24 self-start">
            <div className="rounded-card border border-border-primary bg-background-grain p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <CommandLineIcon className="h-5 w-5 text-accent-primary shrink-0" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-text-primary">Generate handoff</h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                One Markdown file for Claude Code or Cursor: fixes from your audits plus the patterns
                you want to build. Drop it in your repo and it implements each item, then reports back.
              </p>
              <p className="text-sm mb-4 text-text-secondary">
                {summaryText}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canGenerate}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-accent-primary px-5 py-2.5 text-base font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                  Download handoff file
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!canGenerate}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-pill border border-border-primary bg-surface-primary px-5 py-2.5 text-base font-medium text-text-secondary hover:text-text-primary hover:border-accent-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
              </div>
              <p className="mt-3 text-center text-sm text-text-secondary">{combinedHandoffFilename()}</p>
            </div>
          </div>
        </div>
        </div>
      )}

      {undo && (
        <UndoSnackbar message={undo.message} onUndo={handleUndo} onDismiss={dismissUndo} />
      )}
    </section>
  );
}
