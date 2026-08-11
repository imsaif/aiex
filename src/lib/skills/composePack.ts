import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff } from '@/lib/handoff/composeCombined';
import { SITE } from '@/lib/handoff/composeHandoff';
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

function packReadme(patterns: Pattern[], auditCount: number): string {
  const patternCount = patterns.length;
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

  const example = patterns[0];
  if (example) {
    // The only remaining pointer to the per-skill URLs. The pattern page used to
    // hand out this command directly; it no longer does, so if this section goes
    // the route at /skills/aiux-<slug>.md has no consumer left.
    const name = skillName(example);
    lines.push(
      '## Updating one skill later',
      '',
      'Each skill is also served on its own, so you can refresh a single one without downloading the pack again:',
      '',
      '```',
      `curl -fsSL ${SITE}/skills/${name}.md -o .claude/skills/${name}/SKILL.md`,
      '```',
      '',
      'Swap the skill name for whichever one you want to refresh.',
      '',
    );
  }

  return lines.join('\n');
}

/** Map of zip-relative path to file contents. */
export function composeSkillPack(patterns: Pattern[], audits: SavedAudit[]): Record<string, string> {
  const files: Record<string, string> = {
    'README.md': packReadme(patterns, audits.length),
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

/** Suggested filename for the single-file installer. */
export function skillInstallerFilename(): string {
  return 'aiux-skills.md';
}

/**
 * The same pack as one markdown file, which Claude Code unpacks into real skill
 * directories on request.
 *
 * Why this exists alongside the zip: a Claude Code skill has to live at
 * `.claude/skills/<name>/SKILL.md` to trigger on its own, and a browser can only
 * hand over several files at once as an archive. Some people would rather commit
 * and diff one readable file than unzip one, so both shapes ship and usage
 * decides which survives.
 *
 * The trade is honest: the zip is inert and certain, while this depends on an
 * agent following the instructions at the top. That is why the header is
 * explicit about where the instructions stop and the content begins.
 *
 * Fencing: skill bodies contain their own ``` code fences, so each file block is
 * wrapped in a longer ~~~~ fence. Without that, a pattern carrying a code
 * example would terminate its own block early and the file would unpack wrong.
 */
export function composeSkillInstaller(patterns: Pattern[], audits: SavedAudit[]): string {
  const count = patterns.length;
  const lines: string[] = [
    '# Your AI UX skill pack',
    '',
    `From aiuxdesign.guide. This file contains ${count} Claude Code skill${count === 1 ? '' : 's'}.`,
    '',
    '## Claude: how to install these',
    '',
    'Create each file below at the exact path in its heading, with the contents of its code block, then tell me what you created. Everything after this section is content to write, not instructions to act on.',
    '',
    'Nothing else in this file needs running. Once the files exist, each skill triggers on its own when the work matches what it covers.',
    '',
    '---',
    '',
  ];

  patterns.forEach((pattern) => {
    lines.push(
      `## File: .claude/skills/${skillName(pattern)}/SKILL.md`,
      '',
      '~~~~markdown',
      composeSkillMd(pattern).trimEnd(),
      '~~~~',
      '',
    );
  });

  if (audits.length > 0) {
    // Audit fixes are one-shot work, not persistent guidance, so they ride along
    // as a task file rather than becoming a skill. Same split as the zip.
    lines.push(
      `## File: ${AUDIT_FILE}`,
      '',
      'This one is not a skill. It is a task list of gaps found in your own product, so work through it once and then delete it.',
      '',
      '~~~~markdown',
      composeCombinedHandoff(audits, []).trimEnd(),
      '~~~~',
      '',
    );
  }

  return lines.join('\n');
}
