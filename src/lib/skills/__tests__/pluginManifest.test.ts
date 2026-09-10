import { patterns } from '@/data/patterns';
import { composeSkillMd, skillName } from '../composeSkill';
import {
  PLUGIN_NAME,
  marketplaceManifest,
  pluginManifest,
  skillFolders,
} from '../pluginManifest';

const SITE = 'https://aiuxdesign.guide';

/**
 * A Claude Code plugin fails quietly. Install one whose skills the scanner
 * cannot see and you get a success message, an entry in the plugin list, and
 * zero skills — indistinguishable from a working install until someone notices
 * the guidance never fires. These tests cover the parts with no visible failure
 * mode.
 */
describe('aiux plugin manifests', () => {
  const plugin = JSON.parse(pluginManifest(patterns, SITE));
  const marketplace = JSON.parse(marketplaceManifest(patterns, SITE));

  it('points the skill scan at the repo root', () => {
    // The 38 skill folders sit at the root for `npx skills add`. Claude Code
    // scans `skills/` by default and would find nothing without this.
    expect(plugin.skills).toEqual(['.']);
  });

  it('names the plugin consistently across both manifests', () => {
    expect(plugin.name).toBe(PLUGIN_NAME);
    expect(marketplace.plugins).toHaveLength(1);
    expect(marketplace.plugins[0].name).toBe(PLUGIN_NAME);
  });

  it('points source at the repo root, where the manifests live', () => {
    expect(marketplace.plugins[0].source).toBe('./');
  });

  it('states the real pattern count in both descriptions', () => {
    // The count is copied into text a directory renders and we do not control.
    // A stale number there outlives the change that made it wrong.
    expect(plugin.description).toContain(String(patterns.length));
    expect(marketplace.plugins[0].description).toContain(String(patterns.length));
  });

  it('carries the fields a directory listing renders', () => {
    expect(plugin.homepage).toBe(SITE);
    expect(plugin.license).toBe('MIT');
    expect(plugin.repository).toMatch(/^https:\/\/github\.com\//);
  });
});

describe('generated skill folders', () => {
  it('emits one folder per pattern, with no collisions', () => {
    const folders = skillFolders(patterns);
    expect(folders).toHaveLength(patterns.length);
    expect(new Set(folders).size).toBe(patterns.length);
  });

  it('names every folder aiux-<slug>', () => {
    for (const pattern of patterns) {
      expect(skillName(pattern)).toBe(`aiux-${pattern.slug}`);
    }
  });

  /**
   * The frontmatter `description` is the trigger line — the only thing that
   * decides whether Claude ever loads a skill. An empty or absent one makes
   * that skill dead weight, and nothing in `claude plugin validate` checks it.
   */
  it('gives every skill a non-empty trigger line', () => {
    for (const pattern of patterns) {
      const md = composeSkillMd(pattern);
      const frontmatter = md.match(/^---\n([\s\S]*?)\n---/);
      expect(frontmatter).not.toBeNull();

      const description = frontmatter![1].match(/^description:\s*(.+)$/m);
      expect(description).not.toBeNull();
      expect(description![1].replace(/^["']|["']$/g, '').trim().length).toBeGreaterThan(20);
    }
  });

  it('gives every skill a name matching its folder', () => {
    for (const pattern of patterns) {
      const name = composeSkillMd(pattern).match(/^name:\s*(.+)$/m);
      expect(name).not.toBeNull();
      expect(name![1].trim()).toBe(skillName(pattern));
    }
  });
});
