import { patterns } from '@/data/patterns';
import { skillInstallCommand } from '../installCommand';

const hitl = patterns.find((p) => p.slug === 'human-in-the-loop')!;

describe('skillInstallCommand', () => {
  it('produces the exact one-line install command', () => {
    expect(skillInstallCommand(hitl)).toBe(
      'mkdir -p .claude/skills/aiux-human-in-the-loop && curl -fsSL https://aiuxdesign.guide/skills/aiux-human-in-the-loop.md -o .claude/skills/aiux-human-in-the-loop/SKILL.md'
    );
  });

  it('produces a well-formed command for every pattern in the registry', () => {
    const shape =
      /^mkdir -p \.claude\/skills\/aiux-[a-z0-9-]+ && curl -fsSL https:\/\/aiuxdesign\.guide\/skills\/aiux-[a-z0-9-]+\.md -o \.claude\/skills\/aiux-[a-z0-9-]+\/SKILL\.md$/;
    for (const pattern of patterns) {
      expect(skillInstallCommand(pattern)).toMatch(shape);
    }
  });
});
