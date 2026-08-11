'use client';

import React, { useState } from 'react';
import SaveToDashboardButton from '@/components/handoff/SaveToDashboardButton';

interface Props {
  patternTitle: string;
  patternSlug: string;
  skillMd: string;
}

/**
 * Headless "save this pattern as a Claude skill" card. The caller provides the
 * surrounding <section> and (typically) the section H2, so the parent can
 * compose this side-by-side with TakeawaysList under a shared heading.
 *
 * Replaces the old install card, which offered three actions (copy a command,
 * download a file, inspect the skill) and competed with both the Save pill near
 * the title and the audit card directly below it. The library reads as a
 * cookbook now: this card only collects, and everything you collected is
 * downloaded together at checkout on the dashboard.
 *
 * The disclosure survives that cut deliberately. It is not a competing call to
 * action, it is the only way to see what you are about to save.
 */
export default function SavePatternSkillCard({ patternTitle, patternSlug, skillMd }: Props) {
  const [showSkill, setShowSkill] = useState(false);

  return (
    <div className="bg-surface-primary border-2 border-accent-primary/30 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="text-xs font-semibold text-accent-primary uppercase tracking-wide mb-3">
          Save as a Claude skill
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight">
          Save {patternTitle} as a Claude skill
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          Saved skills collect on your dashboard, ready to download one at a time or as a pack for
          your repo. Once a skill is in place, Claude Code applies it whenever you work on a surface
          this pattern covers.
        </p>

        <SaveToDashboardButton
          slug={patternSlug}
          variant="block"
          labels={{ idle: 'Save this skill', saved: 'Saved. Download it at checkout.' }}
        />

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
          {showSkill ? 'Hide the skill' : 'Inspect the skill'}
        </button>
      </div>

      {showSkill && (
        <div className="border-t border-primary bg-surface-secondary">
          {/* text-sm, not text-xs: this is the skill content we tell the reader
              to inspect before saving, so the design system's accessibility
              rule against text-xs for meaningful content applies. */}
          <pre className="p-5 text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-96 overflow-y-auto">
            {skillMd}
          </pre>
        </div>
      )}
    </div>
  );
}
