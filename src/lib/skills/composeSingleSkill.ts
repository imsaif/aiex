import type { Pattern } from '@/types';
import { composeSkillMd, skillName } from './composeSkill';

/**
 * The whole library packaged as ONE skill, for Claude's own skill uploader.
 *
 * Why this exists alongside `composeSkillPack`:
 *
 * `composeSkillPack` emits a project tree — `.claude/skills/aiux-<slug>/SKILL.md`
 * thirty-eight times over — which is exactly right for Claude Code, where skills
 * live in the repo and load themselves by their frontmatter `description`.
 *
 * It is the wrong shape everywhere else. Claude on the web and desktop takes
 * skills at Customize -> Skills, and that uploader accepts ONE skill folder per
 * zip: a `SKILL.md` at the root, plus whatever supporting files it references.
 * Hand it a tree of thirty-eight and nothing installs. That matters because
 * Claude Design lives on that surface, and designers — the audience this site is
 * written for — are far likelier to be there than in a terminal.
 *
 * So this composes a router: one `SKILL.md` whose frontmatter description covers
 * the whole library, whose body indexes every pattern with the symptom that
 * should send Claude to it, and one `references/<slug>.md` per pattern carrying
 * the guidance already written by `composeSkillMd`. One upload, all 38 patterns,
 * and it applies anywhere Claude runs.
 *
 * The per-pattern bodies are deliberately NOT re-written here. They are the same
 * text the Claude Code pack ships, so guidance cannot drift between the two
 * packages — only the packaging differs.
 */

/** Folder and frontmatter name for the combined skill. */
export const SINGLE_SKILL_NAME = 'aiux-ai-ux-patterns';

/** Suggested filename for the combined download. */
export function singleSkillFilename(): string {
  return `${SINGLE_SKILL_NAME}.zip`;
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Reference filename for one pattern, e.g. `references/human-in-the-loop.md`. */
function referencePath(pattern: Pattern): string {
  return `references/${pattern.slug}.md`;
}

/**
 * The router body. Claude reads `SKILL.md` in full when the skill loads, then
 * opens only the reference files the task calls for — so the index lines have to
 * carry enough symptom to route on, without pulling all 38 bodies into context.
 */
function composeRouterMd(patterns: Pattern[]): string {
  const lines: string[] = [
    '---',
    `name: ${SINGLE_SKILL_NAME}`,
    `description: "Use when designing, reviewing or building any AI-powered interface — chat, agents, suggestions, automation, or AI inside an existing product. Covers ${patterns.length} AI UX patterns: how the interface should show its reasoning, ask before it acts, recover from wrong answers, hand off to a person, and stay understandable. Load a reference file from references/ for the pattern that matches the task."`,
    '---',
    '',
    '# AI UX patterns',
    '',
    `${patterns.length} patterns for designing AI interfaces, drawn from products already shipping them.`,
    '',
    '## How to use this skill',
    '',
    '1. Read the index below and pick the patterns that match what is being designed or built.',
    '2. Open the matching file in `references/` and follow the moves in it.',
    '3. Apply more than one when they overlap — most AI surfaces need several.',
    '',
    'Do not guess at a pattern from its name alone. The reference files carry the',
    'specifics, including what to avoid, and those are the part worth following.',
    '',
    '## Index',
    '',
  ];

  patterns.forEach((pattern) => {
    const why = oneLine(pattern.content?.problem || pattern.description || '');
    const summary = why.length > 160 ? `${why.slice(0, 157).trimEnd()}...` : why;
    lines.push(`- **${pattern.title}** — \`${referencePath(pattern)}\``);
    if (summary) lines.push(`  ${summary}`);
  });

  lines.push(
    '',
    '## Where these came from',
    '',
    'Each pattern is documented at https://www.aiuxdesign.guide/patterns, with real',
    'examples from shipped products and the reasoning behind each move.',
    ''
  );

  return lines.join('\n');
}

/**
 * Build the combined skill as a path -> contents map, ready to zip.
 *
 * Shape (one skill folder, which is what the uploader expects):
 *
 *   SKILL.md
 *   references/<slug>.md   x N
 */
export function composeSingleSkillPack(patterns: Pattern[]): Record<string, string> {
  const files: Record<string, string> = {
    'SKILL.md': composeRouterMd(patterns),
  };

  patterns.forEach((pattern) => {
    // Reuse the per-pattern body verbatim. It carries its own frontmatter, which
    // is harmless in a reference file and keeps the two packages byte-identical
    // in content — the only difference between them is how they are arranged.
    files[referencePath(pattern)] = composeSkillMd(pattern);
  });

  return files;
}

/** Exported for tests: the directory name every path sits under once zipped. */
export function singleSkillRoot(): string {
  return SINGLE_SKILL_NAME;
}

/** Names each file under the skill folder, which is how the uploader reads it. */
export function composeSingleSkillZipEntries(patterns: Pattern[]): Record<string, string> {
  const files = composeSingleSkillPack(patterns);
  return Object.fromEntries(
    Object.entries(files).map(([path, contents]) => [`${SINGLE_SKILL_NAME}/${path}`, contents])
  );
}

/** Also used by `skillName` consumers so the two packages stay in step. */
export { skillName };
