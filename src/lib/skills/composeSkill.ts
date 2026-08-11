import type { Pattern } from '@/types';
import { SITE } from '@/lib/handoff/composeHandoff';

/**
 * Turns a Pattern into a Claude Code SKILL.md.
 *
 * This is the SKILL composer: persistent design guidance that lives in the
 * reader's repo at `.claude/skills/aiux-<slug>/SKILL.md` and shapes every
 * future conversation about that surface. It is deliberately separate from
 * `src/lib/handoff/composeHandoff.ts`, which composes a one-shot "implement
 * these patterns now" task file. Different lifetimes, different framing.
 *
 * The frontmatter `description` is the load-bearing line: it is the only text
 * Claude sees when deciding whether to load the skill. We prefer an authored
 * `skillDescription` and fall back to a line derived from `pattern.description`.
 */

/** Skill directory + frontmatter name, e.g. `aiux-human-in-the-loop`. */
export function skillName(pattern: Pattern): string {
  return `aiux-${pattern.slug}`;
}

/** Served filename, e.g. `aiux-human-in-the-loop.md`. */
export function skillFilename(pattern: Pattern): string {
  return `${skillName(pattern)}.md`;
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Quote a value as a single-line YAML scalar. Pattern descriptions routinely
 * contain colons ("The AI proposes, a person decides: ..."), which would make
 * an unquoted scalar invalid YAML and break skill loading.
 */
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function skillTrigger(pattern: Pattern): string {
  const authored = pattern.content.skillDescription?.trim();
  if (authored) return oneLine(authored);

  const desc = oneLine(pattern.description || '').replace(/\.+$/, '');
  const lead = desc ? desc.charAt(0).toLowerCase() + desc.slice(1) : 'working on this surface';
  return `Use when ${lead}. Apply the ${pattern.title} pattern.`;
}

/**
 * Same precedence as `patternMoves()` in composeHandoff.ts: ranked takeaways
 * win; otherwise the first five guidelines.
 */
function skillMoves(pattern: Pattern): string[] {
  const takeaways = pattern.content.takeaways;
  if (takeaways && takeaways.length > 0) {
    return takeaways
      .map((t) => {
        const heading = t.heading?.trim();
        const body = t.body?.trim();
        if (heading && body) return `**${heading}** ${body}`;
        return heading || body || '';
      })
      .filter(Boolean);
  }
  return (pattern.content.guidelines || []).slice(0, 5);
}

export function composeSkillMd(pattern: Pattern): string {
  const lines: string[] = [
    '---',
    `name: ${skillName(pattern)}`,
    `description: ${yamlString(skillTrigger(pattern))}`,
    '---',
    '',
    `# ${pattern.title}`,
    '',
  ];

  const why = oneLine(pattern.content.problem || pattern.description || '');
  if (why) lines.push(`Why it matters: ${why}`, '');

  const moves = skillMoves(pattern);
  if (moves.length > 0) {
    lines.push('## The moves', '');
    moves.forEach((move, i) => lines.push(`${i + 1}. ${move}`));
    lines.push('');
  }

  lines.push(
    `Reference: ${SITE}/patterns/${pattern.slug}`,
    '',
    'When this applies, make the smallest change that genuinely realises the pattern. Do not add UI the product does not need, and say what you changed and why.',
    '',
  );

  return lines.join('\n');
}
