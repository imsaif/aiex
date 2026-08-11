import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff } from '@/lib/handoff/composeCombined';
import { composeSkillMd, skillName } from '@/lib/skills/composeSkill';

/**
 * Builds the dashboard skill pack as a plain {path: contents} map, ready to zip.
 *
 * The pack unzips at the repo root, so the paths here are repo-relative on
 * purpose. Two shapes ride together because they have different lifetimes:
 *
 *   - Saved patterns become SKILLS. They are persistent guidance, so they belong
 *     in `.claude/skills/` where they shape every later conversation.
 *   - Saved audits stay HANDOFF-SHAPED. They are one-shot fixes for gaps in the
 *     user's own product, so they ride along as a task file, not a skill.
 *
 * Kept free of `fflate` so the zip shape is testable without the zipper.
 */

const AUDIT_FILE = 'aiux-audit-fixes.md';

function packReadme(patternCount: number, auditCount: number): string {
  const lines: string[] = [
    '# Your AI UX skill pack',
    '',
    `From aiuxdesign.guide. This pack contains ${patternCount} skill${patternCount === 1 ? '' : 's'}` +
      `${auditCount > 0 ? ` plus fixes from ${auditCount} saved audit${auditCount === 1 ? '' : 's'}` : ''}.`,
    '',
    '## How to use it',
    '',
    'Unzip this at the root of your repo. The skills land in `.claude/skills/`, where Claude Code picks them up automatically. Each skill triggers on its own when you work on a surface that pattern covers, so there is nothing to run.',
    '',
  ];

  if (auditCount > 0) {
    lines.push(
      `\`${AUDIT_FILE}\` is different. It is a one-off task list of the gaps we found in your own product, so hand it to Claude Code once and work through it. It is not a skill, because those fixes stop applying once they are done.`,
      '',
    );
  }

  lines.push(
    '## What is in here',
    '',
    '```',
    'README.md',
    '.claude/skills/aiux-<pattern>/SKILL.md',
    ...(auditCount > 0 ? [AUDIT_FILE] : []),
    '```',
    '',
  );

  return lines.join('\n');
}

/** Map of zip-relative path to file contents. */
export function composeSkillPack(patterns: Pattern[], audits: SavedAudit[]): Record<string, string> {
  const files: Record<string, string> = {
    'README.md': packReadme(patterns.length, audits.length),
  };

  patterns.forEach((pattern) => {
    files[`.claude/skills/${skillName(pattern)}/SKILL.md`] = composeSkillMd(pattern);
  });

  if (audits.length > 0) {
    // Reuse the combined composer with no patterns: it already knows how to
    // render audit gaps, and the patterns are shipping as skills instead.
    files[AUDIT_FILE] = composeCombinedHandoff(audits, []);
  }

  return files;
}

/** Suggested filename for the downloaded pack. */
export function skillPackFilename(): string {
  return 'aiux-skill-pack.zip';
}
