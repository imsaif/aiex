/**
 * Regenerates the public imsaif/aiux-skills repo from the pattern registry.
 *
 * The skills repo is a build artifact: never hand-edit it. This script owns
 * every file in it (38 skill folders + README + LICENSE). Run after any
 * pattern or skill-composer change, then commit and push the target repo.
 *
 * Usage:
 *   npm run skills:sync -- /path/to/aiux-skills-checkout
 */
import * as fs from 'fs';
import * as path from 'path';
import { patterns } from '@/data/patterns';
import { composeSkillMd, skillName } from '@/lib/skills/composeSkill';

const SITE = 'https://aiuxdesign.guide';
const UTM = 'utm_source=github&utm_medium=skills-repo&utm_campaign=aiux-skills';

const target = process.argv[2];
if (!target || !fs.existsSync(target)) {
  console.error('Usage: npm run skills:sync -- /path/to/aiux-skills-checkout');
  process.exit(1);
}

/** The funnel travels inside the artifact: every skill links back. */
function skillFooter(slug: string): string {
  return [
    '',
    '---',
    '',
    `Generated from [aiuxdesign.guide](${SITE}/?${UTM}), a library of ${patterns.length} AI UX patterns from shipped products. Full pattern with examples and demos: [${SITE}/patterns/${slug}](${SITE}/patterns/${slug}?${UTM}). Not sure which patterns your product needs? [Run the free audit](${SITE}/audit?${UTM}).`,
    '',
  ].join('\n');
}

function readme(): string {
  const bySkill = [...patterns].sort((a, b) => a.title.localeCompare(b.title));
  const rows = bySkill
    .map(
      (p) =>
        `| \`${skillName(p)}\` | ${p.title} | [pattern page](${SITE}/patterns/${p.slug}?${UTM}) |`
    )
    .join('\n');

  return `# AIUX Skills for Claude Code

${patterns.length} Claude Code skills, one per AI UX design pattern, generated from [aiuxdesign.guide](${SITE}/?${UTM}).

A skill is persistent design guidance for your coding agent: install it once and it triggers on its own whenever your work matches, with no prompting. Each skill carries one pattern's judgment (the symptoms it applies to and the moves that make it real), distilled from how 50+ shipped AI products design their experiences.

## Install

All of them:

\`\`\`bash
npx skills add imsaif/aiux-skills
\`\`\`

Works with Claude Code, Cursor, GitHub Copilot, and every agent the [skills CLI](https://skills.sh) supports. Prefer a hand-picked set? [Browse and save skills on the site](${SITE}/skills?${UTM}) and download them as one pack.

## New to skills?

Free 6-lesson course (about 20 minutes), written for designers starting from zero: [Using AI UX Skills with Claude Code](${SITE}/guides/ai-ux-skills-guide?${UTM}).

## The skills

| Skill | Pattern | Learn more |
|-------|---------|------------|
${rows}

## Which ones does your product need?

Upload a screenshot of your AI interface and get scored against all ${patterns.length} patterns: [free AI UX audit](${SITE}/audit?${UTM}).

Daily AI UX news and pattern insights: [newsletter](${SITE}/news?${UTM}).

---

This repo is generated from the pattern registry at aiuxdesign.guide. Do not edit files here by hand; changes land via the site's pattern data.
`;
}

const LICENSE = `MIT License

Copyright (c) ${new Date().getFullYear()} Imran Mohammed / aiuxdesign.guide

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

// Remove previously generated skill folders so renames and deletions sync.
for (const entry of fs.readdirSync(target)) {
  if (entry.startsWith('aiux-')) {
    fs.rmSync(path.join(target, entry), { recursive: true });
  }
}

let written = 0;
for (const pattern of patterns) {
  const dir = path.join(target, skillName(pattern));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'SKILL.md'),
    composeSkillMd(pattern).trimEnd() + '\n' + skillFooter(pattern.slug)
  );
  written += 1;
}

fs.writeFileSync(path.join(target, 'README.md'), readme());
fs.writeFileSync(path.join(target, 'LICENSE'), LICENSE);

console.log(`Wrote ${written} skills + README + LICENSE to ${target}`);
