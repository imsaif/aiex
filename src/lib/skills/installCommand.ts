import type { Pattern } from '@/types';
import { SITE } from '@/lib/handoff/composeHandoff';
import { skillName } from './composeSkill';

/**
 * The one-line command the /skills directory puts on the clipboard.
 * Targets the raw skill route (`/skills/aiux-<slug>.md`), which is the
 * machine-readable source of truth for a skill.
 */
export function skillInstallCommand(pattern: Pattern): string {
  const name = skillName(pattern);
  const dir = `.claude/skills/${name}`;
  return `mkdir -p ${dir} && curl -fsSL ${SITE}/skills/${name}.md -o ${dir}/SKILL.md`;
}
