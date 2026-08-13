'use client';

import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  BookmarkIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import patterns from '@/data/patterns';
import type { Pattern } from '@/types';
import { useHandoffKit } from '@/hooks/useHandoffKit';
import { useSavedAudits } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff, combinedHandoffFilename } from '@/lib/handoff/composeCombined';
import {
  composeSkillPack,
  skillPackFilename,
  composeSkillInstaller,
  skillInstallerFilename,
} from '@/lib/skills/composePack';
import { composeSkillMd, skillFilename } from '@/lib/skills/composeSkill';
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
  const [packError, setPackError] = useState<string | null>(null);
  // Both shapes install the same skills; they differ only in how they arrive.
  // Shipped together deliberately so real usage decides which one to keep.
  const [format, setFormat] = useState<'zip' | 'installer'>('zip');
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

  /** Shared blob-to-disk step for both download shapes. */
  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!canGenerate) return;
    setPackError(null);

    // Audits with no patterns: nothing to turn into a skill, so keep the plain
    // markdown handoff (and its existing events) exactly as it was.
    if (nP === 0) {
      const content = composeCombinedHandoff(selectedAudits, selectedPatterns);
      saveBlob(new Blob([content], { type: 'text/markdown;charset=utf-8' }), combinedHandoffFilename());
      trackAuditEvent('dashboard_handoff_generated', { action: 'download', audits: nA, patterns: nP, count: nA + nP });
      trackAuditEvent('handoff_file_downloaded', { audits: nA, patterns: nP, count: nA + nP });
      return;
    }

    try {
      if (format === 'installer') {
        // One markdown file Claude Code unpacks into the same skill directories.
        // No zipper needed, so nothing is dynamically imported on this path.
        saveBlob(
          new Blob([composeSkillInstaller(selectedPatterns, selectedAudits)], {
            type: 'text/markdown;charset=utf-8',
          }),
          skillInstallerFilename(),
        );
      } else {
        // Loaded on click only. A static import would put the zipper in the
        // initial dashboard bundle for every visitor who never exports.
        const { zipSync, strToU8 } = await import('fflate');
        const files = composeSkillPack(selectedPatterns, selectedAudits);
        const zippable = Object.fromEntries(
          Object.entries(files).map(([path, contents]) => [path, strToU8(contents)]),
        );
        saveBlob(
          new Blob([zipSync(zippable, { level: 6 }) as BlobPart], { type: 'application/zip' }),
          skillPackFilename(),
        );
      }
      trackAuditEvent('dashboard_handoff_generated', { action: 'download', audits: nA, patterns: nP, count: nA + nP });
      // One event name for "a pack left the site", tagged with which shape it
      // took, so the total stays intact and the two formats stay comparable.
      trackAuditEvent('skill_pack_downloaded', { audits: nA, patterns: nP, count: nA + nP, format });
    } catch (err) {
      // No partial zips: nothing was saved, so say so and leave the selection intact.
      console.warn('Failed to build the skill pack:', err);
      setPackError('We could not build the pack just now. Try again in a moment.');
    }
  };

  /**
   * Download one saved pattern's SKILL.md on its own.
   *
   * Deliberately ignores the selection checkboxes. Those govern what goes INTO
   * the pack; this is a direct action on one named row, so disabling it because
   * the row happens to be unchecked would be inexplicable to someone who just
   * clicked download on that exact row.
   *
   * The filename matches what /skills/aiux-<slug>.md serves, so a user who gets
   * the same skill either way ends up with an identically named file.
   */
  const handleDownloadOne = (pattern: Pattern) => {
    saveBlob(
      new Blob([composeSkillMd(pattern)], { type: 'text/markdown;charset=utf-8' }),
      skillFilename(pattern),
    );
    trackAuditEvent('skill_file_downloaded', { slug: pattern.slug, source: 'dashboard' });
  };

  const header = (
    <div className="mb-8">
      <p className="type-eyebrow text-accent-primary mb-2">Your dashboard</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-3">
        Your pack
      </h1>
      {/* Deliberately short. The right rail already explains what the download
          contains and how it arrives, so repeating it here just doubles the
          reading before anyone reaches a control. */}
      <p className="text-lg text-text-secondary max-w-2xl">
        Patterns become skills. Audits are fixes for your product. Pick what to include.
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
            Save a pattern from the library, or save an audit. Whatever you collect lands here.
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
                Each one becomes a skill.
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
                      label={`Include ${pattern.title} in the skill pack`}
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
                      onClick={() => handleDownloadOne(pattern)}
                      aria-label={`Download the ${pattern.title} skill`}
                      title="Download this skill"
                      className="shrink-0 rounded-full p-2 text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
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
                <h2 className="text-lg font-semibold text-text-primary">Download skill pack</h2>
              </div>
              <p className="text-sm mb-4 text-text-secondary">
                {summaryText}
              </p>

              {/* Format choice sits above one button rather than becoming two rival
                  buttons: the default path stays a single obvious click. Both shapes
                  install the same skills, so this is presentation, not capability.
                  Only shown when there are patterns to pack; an audits-only export is
                  a plain markdown file with no format question to ask. */}
              {nP > 0 && (
                <fieldset className="mb-4">
                  <legend className="text-sm font-medium text-text-primary mb-2">
                    How do you want it?
                  </legend>
                  <div className="flex gap-2" role="radiogroup" aria-label="Download format">
                    {([
                      { id: 'zip', label: 'Folder (.zip)' },
                      { id: 'installer', label: 'One file (.md)' },
                    ] as const).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={format === option.id}
                        onClick={() => setFormat(option.id)}
                        className={`flex-1 rounded-pill border px-3 py-2 text-sm font-medium transition-colors ${
                          format === option.id
                            ? 'border-accent-primary bg-accent-subtle text-accent-primary'
                            : 'border-border-primary bg-surface-primary text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">
                    {format === 'zip'
                      ? 'Unzip it at the root of your repo and the skills are in place. Nothing to run. Full walkthrough in the skills guide below.'
                      : 'One file to commit. Hand it to Claude Code and it writes the skills for you. Full walkthrough in the skills guide below.'}
                  </p>
                </fieldset>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canGenerate}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-pill bg-accent-primary px-5 py-2.5 text-base font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                  Download skill pack
                </button>
                {packError && (
                  <p role="alert" className="mt-3 text-sm text-text-secondary">
                    {packError}
                  </p>
                )}
              </div>
              {/* The filename is a promise about what the button produces, so it
                  branches the same way handleDownload does. */}
              <p className="mt-3 text-center text-sm text-text-secondary">
                {nP === 0
                  ? combinedHandoffFilename()
                  : format === 'installer'
                    ? skillInstallerFilename()
                    : skillPackFilename()}
              </p>
              <Link
                href="/guides/ai-ux-skills-guide"
                className="mt-4 flex items-start gap-2.5 rounded-input border border-info bg-accent-subtle p-snug text-sm text-text-primary hover:border-accent-primary transition-colors"
              >
                <AcademicCapIcon className="h-5 w-5 shrink-0 text-accent-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold">New to skills?</span> Learn what they are and how
                  they trigger in a 10 minute course.
                  <span className="mt-0.5 block font-medium text-accent-primary">
                    Read the guide →
                  </span>
                </span>
              </Link>
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
