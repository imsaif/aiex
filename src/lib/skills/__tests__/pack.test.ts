import patterns from '@/data/patterns';
import { composeSkillInstaller, composeSkillPack, SKILLS_FOLDER, START_FILE } from '../composePack';
import { composeSingleSkillZipEntries, SINGLE_SKILL_NAME } from '../composeSingleSkill';
import { INSTALL_PROMPT, NOTES_LINE, PACK_FOLDER, PACK_TARGETS, renderPackEmail } from '../packEmail';

describe('coding tool pack', () => {
  const files = composeSkillPack(patterns, []);
  const paths = Object.keys(files);

  it('hides nothing: no path has a part that starts with a dot', () => {
    expect(paths.filter((p) => p.split('/').some((part) => part.startsWith('.')))).toEqual([]);
  });

  it('carries one SKILL.md per pattern, plus START HERE', () => {
    expect(paths.filter((p) => p.startsWith(`${SKILLS_FOLDER}/`) && p.endsWith('/SKILL.md'))).toHaveLength(patterns.length);
    expect(paths).toContain(START_FILE);
    expect(paths).toHaveLength(patterns.length + 1);
  });

  it('gives a reader the sentence to say, and the tool where to put things', () => {
    expect(files[START_FILE]).toContain(INSTALL_PROMPT);
    expect(files[START_FILE]).toContain('.claude/skills/');
    expect(files[START_FILE]).toContain('.agents/skills/');
    expect(files[START_FILE]).toContain(PACK_FOLDER);
  });

  it('has the install add the notes line, and ask first', () => {
    expect(files[START_FILE]).toContain(NOTES_LINE);
    expect(files[START_FILE]).toContain('ask the person before adding');
    expect(composeSkillInstaller(patterns, [])).toContain(NOTES_LINE);
  });

  it('never promises that skills load on their own', () => {
    const text = [files[START_FILE], composeSkillInstaller(patterns, []).split('---')[0], ...PACK_TARGETS.map((t) => renderPackEmail(t).html)].join(' ');
    expect(text).not.toMatch(/on its own|automatically|picks the right skill/i);
  });

  it('names each skill after its folder, which Copilot requires', () => {
    for (const p of paths.filter((x) => x.endsWith('/SKILL.md'))) {
      const folder = p.split('/')[1];
      expect(files[p]).toMatch(new RegExp(`^name: "?${folder}"?$`, 'm'));
    }
  });
});

describe('Claude app pack', () => {
  it('is one folder named after the skill, with SKILL.md and every pattern', () => {
    const files = composeSingleSkillZipEntries(patterns);
    expect(Object.keys(files).every((p) => p.startsWith(`${SINGLE_SKILL_NAME}/`))).toBe(true);
    expect(files[`${SINGLE_SKILL_NAME}/SKILL.md`]).toContain(`name: ${SINGLE_SKILL_NAME}`);
    expect(Object.keys(files)).toHaveLength(patterns.length + 1);
  });
});

describe('renderPackEmail', () => {
  it.each([...PACK_TARGETS])('%s: says what a skill is, has steps, names no hidden folder', (target) => {
    const { html } = renderPackEmail(target);
    expect(html).toContain('A skill is a short note');
    expect(html).toContain('>1</div>');
    expect(html).not.toContain('.claude');
    expect(html).not.toContain('—');
  });

  it('gives coding tools the install sentence and the app the upload path', () => {
    expect(renderPackEmail('code').html).toContain(INSTALL_PROMPT);
    expect(renderPackEmail('claude').html).toContain('Upload a skill');
  });

  it('gives someone unsure a way in without installing anything', () => {
    expect(renderPackEmail('unsure').html).toContain('/patterns');
    expect(renderPackEmail('unsure').html).toContain('nothing to install');
  });
});
