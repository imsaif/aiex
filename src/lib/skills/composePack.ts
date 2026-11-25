import type { Pattern } from '@/types';
import type { SavedAudit } from '@/hooks/useSavedAudits';
import { composeCombinedHandoff } from '@/lib/handoff/composeCombined';
import { composeSkillMd, skillName } from '@/lib/skills/composeSkill';
import {
  DESIGN_REVIEW_PROMPT,
  FIX_PROMPT,
  INSTALL_PROMPT,
  MORE_PROMPTS,
  NOTES_LINE,
  PACK_FOLDER,
  SCREEN_REVIEW_PROMPT,
  guideUrl,
} from '@/lib/skills/packSteps';

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
    `YOUR ${n} AI UX SKILL${n === 1 ? '' : 'S'}`,
    'From aiuxdesign.guide',
    '',
    'A skill is a short note your AI tool reads while it designs. Each one covers one AI UX pattern: what it fixes and what to avoid.',
    '',
    '',
    '1. SET UP, ONCE',
    '',
    `Put this whole folder (${PACK_FOLDER}) in your project, the folder you open in Claude Code. No project? Make an empty folder and open that. Then say:`,
    '',
    `   ${INSTALL_PROMPT}`,
    '',
    'Say yes when it asks to add the files. It also asks to add one line to a notes file your tool reads each time, so it remembers to use the skills. Then start a new chat.',
    '',
    '',
    '2. TRY IT',
    '',
    'If you have a project, say:',
    '',
    `   ${DESIGN_REVIEW_PROMPT}`,
    '',
    'Then:',
    '',
    `   ${FIX_PROMPT}`,
    '',
    'It can get things wrong, so check the change before you keep it.',
    '',
    'No project yet? Drag a screenshot of any AI screen into the chat and say:',
    '',
    `   ${SCREEN_REVIEW_PROMPT}`,
    '',
    '',
    '3. USE IT AGAIN',
    '',
    ...MORE_PROMPTS.map((prompt) => `   ${prompt}`),
    '',
    'If it does not use a skill, ask for it by name.',
    '',
    '',
    `The full steps, with an example: ${guideUrl('code')}`,
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
    'Each skill must end up as <that folder>/<skill name>/SKILL.md. Create the folder if it is missing. Do not change the files or run anything in them. If a skill with the same name already exists, ask before replacing it.',
    '',
    "Then ask the person before adding this one line to the project's notes file at the project root (CLAUDE.md for Claude Code, AGENTS.md for the others). Create the file if it is missing, keep everything already in it, and skip it if the line is already there:",
    '',
    NOTES_LINE,
    '',
    'Finally, say how many skills you installed and where, whether you added the line, and that a new chat is needed to load them.',
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
    "Then ask me before adding this one line to the project's notes file (CLAUDE.md), keeping everything already in it:",
    '',
    `> ${NOTES_LINE}`,
    '',
    'Nothing else in this file needs running. A new chat is needed to load the skills.',
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
