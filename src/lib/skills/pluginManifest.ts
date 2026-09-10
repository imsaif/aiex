import type { Pattern } from '@/types';
import { skillName } from './composeSkill';

/**
 * Claude Code plugin manifests for the generated `imsaif/aiux-skills` repo.
 *
 * Why these live here rather than inline in the sync script: the script writes
 * files and exits, so nothing in it can be imported by a test without running
 * it. The manifests are the part most likely to be wrong in a way no one
 * notices — a plugin that installs but surfaces zero skills looks identical to
 * one that works until you go looking — so they need to be testable.
 *
 * The `skills: ['.']` line is the whole reason one repo can serve two
 * installers. `npx skills add` expects `<name>/SKILL.md` at the repo root;
 * Claude Code scans `skills/` by default and treats the `skills` field as
 * additive, so pointing it at `.` makes the existing root folders load as
 * plugin skills. Nothing is moved, and there is no second copy to drift.
 */

export const PLUGIN_NAME = 'aiux';
export const MARKETPLACE_NAME = 'aiux-skills';
const REPO = 'https://github.com/imsaif/aiux-skills';

/**
 * Plugin skills are namespaced `/<plugin>:<skill>`, so these read
 * `/aiux:aiux-error-recovery`. The repeated prefix is deliberate: `aiux-<slug>`
 * is the skill's name on every other surface (the site's `/skills/aiux-<slug>.md`
 * route, the downloadable pack, the installer, and the ubiquitous-language
 * rule), and renaming it here to win a cosmetic point would put two names on one
 * thing. Skills are model-invoked from their description, so the typed form is
 * the rare case.
 */
export function pluginManifest(patterns: Pattern[], site: string): string {
  return (
    JSON.stringify(
      {
        name: PLUGIN_NAME,
        description: `${patterns.length} AI UX design patterns as skills, one per pattern. Each carries the symptoms it applies to and the interface moves that make it real, distilled from shipped AI products: showing reasoning, asking before acting, recovering from wrong answers, handing off to a person.`,
        version: '1.0.0',
        author: { name: 'Imran Mohammed', url: site },
        homepage: site,
        repository: REPO,
        license: 'MIT',
        keywords: ['ai', 'ux', 'design', 'patterns', 'accessibility', 'design-system'],
        skills: ['.'],
      },
      null,
      2,
    ) + '\n'
  );
}

/** Lets `/plugin marketplace add imsaif/aiux-skills` find the plugin. */
export function marketplaceManifest(patterns: Pattern[], site: string): string {
  return (
    JSON.stringify(
      {
        name: MARKETPLACE_NAME,
        owner: { name: 'imsaif', url: site },
        metadata: {
          description: `${patterns.length} AI UX design patterns as Claude Code skills, generated from aiuxdesign.guide`,
        },
        plugins: [
          {
            name: PLUGIN_NAME,
            source: './',
            description: `${patterns.length} AI UX design patterns as skills: chat and conversational interfaces, agent autonomy and status, confidence and explainability, error recovery, human handoff, and more. Triggers on its own when your work matches a pattern.`,
            version: '1.0.0',
            category: 'design',
            keywords: ['ai', 'ux', 'design', 'patterns', 'accessibility'],
          },
        ],
      },
      null,
      2,
    ) + '\n'
  );
}

/** Folder name each skill occupies in the generated repo. */
export function skillFolders(patterns: Pattern[]): string[] {
  return patterns.map((pattern) => skillName(pattern));
}
