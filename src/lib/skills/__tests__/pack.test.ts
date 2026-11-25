import patterns from '@/data/patterns';
import { composeSkillInstaller, composeSkillPack, skillPackFilename, SKILLS_FOLDER, START_FILE } from '../composePack';
import { composeSingleSkillZipEntries, singleSkillFilename, SINGLE_SKILL_NAME } from '../composeSingleSkill';
import { renderPackEmail } from '../packEmail';
import {
  DESIGN_REVIEW_PROMPT,
  FIX_PROMPT,
  INSTALL_FILE,
  INSTALL_PROMPT,
  NOTES_LINE,
  PACK_FOLDER,
  PACK_GUIDES,
  PACK_TARGETS,
  SCREEN_REVIEW_PROMPT,
  guideUrl,
} from '../packSteps';

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
    const text = [files[START_FILE], composeSkillInstaller(patterns, []).split('---')[0], ...PACK_TARGETS.map((t) => renderPackEmail(t).html), JSON.stringify(PACK_GUIDES)].join(' ');
    expect(text).not.toMatch(/on its own|automatically|picks the right skill/i);
  });

  it('names each skill after its folder, which Copilot requires', () => {
    for (const p of paths.filter((x) => x.endsWith('/SKILL.md'))) {
      const folder = p.split('/')[1];
      expect(files[p]).toMatch(new RegExp(`^name: "?${folder}"?$`, 'm'));
    }
  });
});

describe('one name for every choice', () => {
  it('names both zips, the folder and the Claude app skill aiux-skills', () => {
    expect(PACK_FOLDER).toBe('aiux-skills');
    expect(SINGLE_SKILL_NAME).toBe(PACK_FOLDER);
    expect(skillPackFilename()).toBe('aiux-skills.zip');
    expect(singleSkillFilename()).toBe('aiux-skills.zip');
  });

  it('can tell the two zips apart by what the pages say to look for', () => {
    const code = Object.keys(composeSkillPack(patterns, []));
    const app = Object.keys(composeSingleSkillZipEntries(patterns));
    expect(code).toContain(START_FILE);
    expect(START_FILE).toContain(INSTALL_FILE);
    expect(code).not.toContain('SKILL.md');
    expect(app.some((p) => p.includes(INSTALL_FILE))).toBe(false);
    expect(app).toContain('aiux-skills/SKILL.md');
    const help = JSON.stringify([PACK_GUIDES.code.steps, PACK_GUIDES.claude.steps]);
    expect(help).toContain('you have the Claude app zip');
    expect(help).toContain('you have the Claude Code zip');
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

describe('what to do after downloading', () => {
  it('leads with the tested design review, word for word, then the fix', () => {
    expect(DESIGN_REVIEW_PROMPT).toBe(
      "Use the aiux skills to do a design review of this project. Don't change anything yet."
    );
    const said = PACK_GUIDES.code.steps.map((s) => s.say).filter(Boolean);
    expect(said).toEqual([INSTALL_PROMPT, DESIGN_REVIEW_PROMPT, FIX_PROMPT]);
  });

  it('gives the Claude app, which has no project, a screenshot review', () => {
    const said = PACK_GUIDES.claude.steps.map((s) => s.say);
    expect(said).toContain(SCREEN_REVIEW_PROMPT);
    expect(said).not.toContain(DESIGN_REVIEW_PROMPT);
  });

  it('says the same words in START HERE and in the emails', () => {
    const start = composeSkillPack(patterns, [])[START_FILE];
    for (const words of [DESIGN_REVIEW_PROMPT, FIX_PROMPT, SCREEN_REVIEW_PROMPT, guideUrl('code')]) {
      expect(start).toContain(words);
    }
    expect(renderPackEmail('code').html).toContain(DESIGN_REVIEW_PROMPT);
  });

  it.each([...PACK_TARGETS])('%s: the email links to its own page', (target) => {
    expect(renderPackEmail(target).html).toContain(guideUrl(target));
  });

  it('uses no em dashes and names no label that is not on screen', () => {
    const text = JSON.stringify(PACK_GUIDES) + PACK_TARGETS.map((t) => renderPackEmail(t).html).join(' ');
    expect(text).not.toContain('\u2014');
    expect(text).not.toMatch(/coding tool/i);
  });
});
