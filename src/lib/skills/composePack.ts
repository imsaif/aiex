import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff } from '@/lib/handoff/composeCombined';
import { composeSkillMd, skillName } from '@/lib/skills/composeSkill';
import { INSTALL_PROMPT, PACK_FOLDER } from '@/lib/skills/packEmail';

/**
 * Builds the skill pack as a plain {path: contents} map, ready to zip.
 *
 * Nothing in here may start with a dot. The pack used to unzip to
 * `.claude/skills/`, which Finder hides, so on a Mac it looked like a folder
 * holding one README (Nov 2026). Double-clicking a zip also adds a wrapper
 * folder, which left the skills nested where Claude Code does not load them at
 * startup. So the skills travel in a visible folder and the reader's own tool
 * puts them in place, following START HERE.
 *
 * Two shapes ride together because they have different lifetimes:
 *
 *   - Saved patterns become SKILLS: persistent guidance for later conversations.
 *   - Saved audits stay HANDOFF-SHAPED. They are one-shot fixes for gaps in the
 *     user's own product, so they ride along as a task file, not a skill.
 *
 * Kept free of `fflate` so the zip shape is testable without the zipper.
 */

/** Plain text, not markdown: a double-click has to open it on any machine. */
export const START_FILE = 'START HERE.txt';

/** The visible folder the skills sit in. */
export const SKILLS_FOLDER = 'skills';

const AUDIT_FILE = 'aiux-audit-fixes.md';

function startHere(patterns: Pattern[], auditCount: number): string {
  const n = patterns.length;
  const lines: string[] = [
    'YOUR AI UX SKILLS',
    'From aiuxdesign.guide',
    '',
    `This folder has ${n} skill${n === 1 ? '' : 's'}. A skill is a short note your AI tool reads while it designs.`,
    '',
    'TO INSTALL THEM',
    '',
    `1. Put this whole folder (${PACK_FOLDER}) inside your project, the folder you open in Claude Code, Cursor, GitHub Copilot or Codex.`,
    `2. Tell your tool: "${INSTALL_PROMPT}" Say yes when it asks to add the files.`,
    '3. Start a new chat. Your tool picks the right skill when your work matches it.',
    '',
    'Using the Claude app instead? It needs a different zip. Get it at https://www.aiuxdesign.guide (choose "Claude app").',
    '',
    'Just want to read? Every pattern is at https://www.aiuxdesign.guide/patterns',
    '',
  ];

  if (auditCount > 0) {
    lines.push(
      `${AUDIT_FILE} is different. It lists the gaps found in your own product. Give it to your tool once, work through it, then delete it.`,
      '',
    );
  }

  lines.push(
    '',
    'FOR THE AI TOOL DOING THE INSTALL',
    '',
    `Copy every folder inside "${SKILLS_FOLDER}" to the project root, keeping the folder names:`,
    '- Claude Code: .claude/skills/',
    '- Cursor, GitHub Copilot or Codex: .agents/skills/',
    'Each skill must end up as <that folder>/<skill name>/SKILL.md. Create the folder if it is missing. Do not change the files or run anything in them. If a skill with the same name already exists, ask before replacing it. Then say how many skills you installed and where, and that a new chat is needed to load them.',
    '',
  );

  return lines.join('\n');
}

/** Map of zip-relative path to file contents. */
export function composeSkillPack(patterns: Pattern[], audits: SavedAudit[]): Record<string, string> {
  const files: Record<string, string> = {
    [START_FILE]: startHere(patterns, audits.length),
  };

  patterns.forEach((pattern) => {
    files[`${SKILLS_FOLDER}/${skillName(pattern)}/SKILL.md`] = composeSkillMd(pattern);
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
  return `${PACK_FOLDER}.zip`;
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
    'The paths are relative, so work from the root of the repo these skills are for. If this file was opened outside a project, install the skills to ~/.claude/skills/ instead (user-level, available in every repo) and say where you put them.',
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
