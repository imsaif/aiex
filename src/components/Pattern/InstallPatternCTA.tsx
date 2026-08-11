'use client';

import React, { useState, useCallback } from 'react';
import { CommandLineIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { trackAuditEvent } from '@/lib/audit/analytics';

interface Props {
  patternTitle: string;
  patternSlug: string;
  skillName: string;
  skillMd: string;
}

/**
 * Headless skill-install card. The caller provides the surrounding <section>
 * and (typically) the section H2, so the parent can compose this side-by-side
 * with TakeawaysList under a shared "Take it into your own product" heading.
 *
 * A prompt runs once. A skill persists in the reader's repo and shapes every
 * later design conversation, so this card installs a skill rather than copying
 * a prompt. The pattern's `installPrompt` still powers the audit flow and the
 * dashboard handoff composer; it just no longer drives this card.
 */
export default function InstallPatternCTA({ patternTitle, patternSlug, skillName, skillMd }: Props) {
  const [showSkill, setShowSkill] = useState(false);
  const [copied, setCopied] = useState(false);

  const installCommand =
    `mkdir -p .claude/skills/${skillName} && curl -fsSL https://aiuxdesign.guide/skills/${skillName}.md -o .claude/skills/${skillName}/SKILL.md`;

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(installCommand);
      } else {
        const ta = document.createElement('textarea');
        ta.value = installCommand;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      trackAuditEvent('skill_install_command_copied', { slug: patternSlug });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy install command:', err);
    }
  }, [installCommand, patternSlug]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([skillMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackAuditEvent('skill_file_downloaded', { slug: patternSlug });
  }, [skillMd, patternSlug]);

  return (
    <div className="bg-surface-primary border-2 border-accent-primary/30 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="text-xs font-semibold text-accent-primary uppercase tracking-wide mb-3">
          Install as a Claude skill
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight">
          Add {patternTitle} as a Claude skill
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          Run this in your repo and Claude Code picks the skill up from then on. It encodes the moves
          on the left, so Claude applies them whenever you work on a surface this pattern covers,
          not just once.
        </p>

        <button
          type="button"
          onClick={handleCopy}
          disabled={copied}
          className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
            copied
              ? 'bg-status-success/10 text-status-success border-status-success/30'
              : 'bg-accent-primary text-white border-accent-primary hover:bg-accent-hover'
          }`}
          aria-label="Copy install command"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied. Run it in your repo.
            </>
          ) : (
            <>
              <CommandLineIcon className="h-4 w-4" />
              Copy install command
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border border-primary bg-surface-secondary text-text-primary hover:text-accent-primary transition-colors cursor-pointer"
          aria-label="Download SKILL.md for this pattern"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Download SKILL.md
        </button>

        <button
          type="button"
          onClick={() => setShowSkill((s) => !s)}
          aria-expanded={showSkill}
          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform ${showSkill ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {showSkill ? 'Hide the skill' : 'Inspect before you copy'}
        </button>
      </div>

      {showSkill && (
        <div className="border-t border-primary bg-surface-secondary">
          {/* text-sm, not text-xs: this is the skill content we tell the reader
              to inspect before installing, so the design system's accessibility
              rule against text-xs for meaningful content applies. */}
          <pre className="p-5 text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
            {skillMd}
          </pre>
        </div>
      )}
    </div>
  );
}
