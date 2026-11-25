import { PATTERN_COUNT } from '@/data/pattern-count';

/**
 * What to do after downloading the pack, per answer to "Where will you use
 * them?". One source for the dialog, the walkthrough pages, the email and START
 * HERE, so the four can never tell someone different things.
 *
 * 'code' is labelled Claude Code, the only coding tool these steps have been
 * tried in. The value stays 'code' because past analytics events carry it.
 */
export const PACK_TARGETS = ['code', 'claude', 'unsure'] as const;
export type PackTarget = (typeof PACK_TARGETS)[number];

/**
 * One name whichever choice they make: the zip, the folder it unzips to, and
 * the skill inside the Claude app zip. The contents differ by choice, so every
 * page says how to tell which zip you have.
 */
export const PACK_FOLDER = 'aiux-skills';

/** What the Claude Code zip has at the top, and the Claude app zip does not. */
export const INSTALL_FILE = 'START HERE';

/** What to say to a coding tool. Shown in the email, the pack and the site. */
export const INSTALL_PROMPT = `Read ${INSTALL_FILE} in ${PACK_FOLDER} and install the skills.`;

/**
 * The line an install adds to the project's notes. Without it Claude Code opened
 * a skill in 3 of 6 real edits; with it, 6 of 6 (audit, Nov 2026).
 */
export const NOTES_LINE =
  'When building or changing any AI feature, check the aiux skills first and use the ones that fit.';

/**
 * The first thing to try. Word for word what was tested (skills opened 6 of 6,
 * judged better than a plain review 6 of 6, Nov 2026), including the second
 * sentence: it keeps the first answer safe to run on real work.
 */
export const DESIGN_REVIEW_PROMPT =
  "Use the aiux skills to do a design review of this project. Don't change anything yet.";
export const FIX_PROMPT = 'Fix the most important one.';

/** For the Claude app, and for anyone with a screenshot and no project. */
export const SCREEN_REVIEW_PROMPT =
  "Use the aiux skills to review this screen. What's missing, and why?";
export const CHANGE_PROMPT = 'Show me how to change this.';
export const MORE = [
  { title: 'Compare two versions', say: 'Use the aiux skills to compare these two versions.' },
  { title: 'See how to change it', say: CHANGE_PROMPT },
  { title: 'Hand it over', say: 'Write a brief for my developer.' },
];
export const MORE_PROMPTS = MORE.map((m) => m.say);

const SITE = 'https://www.aiuxdesign.guide';

export interface PackHelp {
  question: string;
  answer: string;
  /** Link text to reopen the dialog for the right zip. */
  getZip?: string;
}

export interface PackStep {
  /** Heading on the full page. */
  title: string;
  /** The instruction. Plain text, so every surface can render it. */
  text: string;
  /** Words to type to the tool, exactly. */
  say?: string;
  /** What they will see. The full page draws this instead of saying it. */
  expect?: string;
  /** What to do or check afterwards. */
  then?: string;
  /** Extra help, on the full page only. */
  help?: PackHelp[];
}

export interface PackGuide {
  target: PackTarget;
  /** URL segment under /skills/start/. */
  slug: string;
  label: string;
  /** One line under the chooser. */
  hint: string;
  /** Dialog heading once the download has started. */
  doneTitle: string;
  doneIntro: string;
  pageTitle: string;
  pageIntro: string;
  steps: PackStep[];
}

export const PACK_GUIDES: Record<PackTarget, PackGuide> = {
  code: {
    target: 'code',
    slug: 'claude-code',
    label: 'Claude Code',
    hint: 'Works inside your project.',
    doneTitle: `Your ${PATTERN_COUNT} skills are downloading`,
    doneIntro: 'Four steps. We are emailing you a copy too.',
    pageTitle: 'Use your skills in Claude Code',
    pageIntro: 'Set them up once, then try them on something you are already working on.',
    steps: [
      {
        title: 'Add the folder to your project',
        text: `Open the zip and put the ${PACK_FOLDER} folder in your project, the folder you open in Claude Code.`,
        help: [
          { question: 'No project?', answer: 'Make an empty folder and open that in Claude Code.' },
          {
            question: `Don't see ${INSTALL_FILE}?`,
            answer: 'If you see SKILL.md, you have the Claude app zip.',
            getZip: 'Get the Claude Code one',
          },
          {
            question: `Is the folder called "${PACK_FOLDER} (1)" or "${PACK_FOLDER} 2"?`,
            answer: `You have downloaded it before. Rename this one to ${PACK_FOLDER}, so the next step finds it.`,
          },
        ],
      },
      {
        title: 'Install the skills',
        text: 'In Claude Code, say:',
        say: INSTALL_PROMPT,
        expect: 'It asks before it adds the files, and before it adds one line to your project notes. Say yes to both.',
        then: 'Then start a new chat, so the skills load.',
      },
      {
        title: 'Ask for a design review',
        text: 'In the new chat, say:',
        say: DESIGN_REVIEW_PROMPT,
        expect: 'It opens several aiux skills, then lists what it found and what to fix first.',
        then: 'It can get things wrong, so check what it says.',
        help: [
          {
            question: 'Only have a screenshot?',
            answer: `Drag it in and say: "${SCREEN_REVIEW_PROMPT}"`,
          },
        ],
      },
      {
        title: 'Fix the most important one',
        text: 'Then say:',
        say: FIX_PROMPT,
        then: 'Check the change before you keep it.',
      },
    ],
  },
  claude: {
    target: 'claude',
    slug: 'claude-app',
    label: 'Claude app',
    hint: 'One upload in Claude, on the web or desktop.',
    doneTitle: `Your ${PATTERN_COUNT} patterns are downloading, as one skill`,
    doneIntro: 'Four steps. Keep the zip closed. We are emailing you a copy too.',
    pageTitle: 'Use your skills in the Claude app',
    pageIntro: 'Upload the zip once, then try it on a screenshot.',
    steps: [
      {
        title: 'Open Skills in Claude',
        text: 'On the web or desktop, open Customize, then Skills.',
      },
      {
        title: 'Upload the zip',
        text: `Press +, then Create skill, then Upload a skill, and choose ${PACK_FOLDER}.zip. Keep it closed.`,
        expect: 'If Claude asks you to turn on code execution, turn it on. Skills need it.',
        help: [
          {
            question: 'Does Claude refuse the zip?',
            answer: `If you open it and see ${INSTALL_FILE}, you have the Claude Code zip.`,
            getZip: 'Get the Claude app one',
          },
        ],
      },
      {
        title: 'Ask what is missing',
        text: 'Start a new chat, add a screenshot of any AI screen and say:',
        say: SCREEN_REVIEW_PROMPT,
        then: 'It can get things wrong, so check what it says.',
      },
      {
        title: 'Ask how to change it',
        text: 'Then say:',
        say: CHANGE_PROMPT,
      },
    ],
  },
  unsure: {
    target: 'unsure',
    slug: 'not-sure',
    label: 'Not sure yet',
    hint: 'See an example first. You can set them up later.',
    doneTitle: 'Start with an example',
    doneIntro: 'Your skills are downloading, but you do not need them yet.',
    pageTitle: 'See what the skills do first',
    pageIntro: 'Read one example, then choose how you want to use them.',
    steps: [
      { title: 'See an example', text: 'Read one example: a screen, what the skills found and what changed.' },
      { title: 'Set them up later', text: 'If you use Claude, upload the zip when you are ready. The Claude app page shows how.' },
      { title: 'Just read', text: `Or read all ${PATTERN_COUNT} patterns on the site, with nothing to install.` },
    ],
  },
};

export const PACK_GUIDE_LIST = PACK_TARGETS.map((t) => PACK_GUIDES[t]);

export const guidePath = (target: PackTarget) => `/skills/start/${PACK_GUIDES[target].slug}`;
export const guideUrl = (target: PackTarget) => `${SITE}${guidePath(target)}`;
