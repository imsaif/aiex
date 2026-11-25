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

/** The folder a Mac or Windows unzip produces from aiux-skill-pack.zip. */
export const PACK_FOLDER = 'aiux-skill-pack';

/** What to say to a coding tool. Shown in the email, the pack and the site. */
export const INSTALL_PROMPT = `Read START HERE in ${PACK_FOLDER} and install the skills.`;

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
export const MORE_PROMPTS = [
  'Use the aiux skills to compare these two versions.',
  CHANGE_PROMPT,
  'Write a brief for my developer.',
];

const SITE = 'https://www.aiuxdesign.guide';

export interface PackStep {
  /** The instruction. Plain text, so every surface can render it. */
  text: string;
  /** Words to type to the tool, exactly. */
  say?: string;
  /** What happens next, or what to check. */
  then?: string;
  /** Extra help, on the full page only. */
  more?: string;
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
    hint: 'Works inside your project. The steps come next.',
    doneTitle: `Your ${PATTERN_COUNT} skills are downloading`,
    doneIntro: 'Four steps. We are emailing you a copy too.',
    pageTitle: 'Use your skills in Claude Code',
    pageIntro: 'Set them up once, then try them on something you are already working on.',
    steps: [
      {
        text: `Open the zip and put the ${PACK_FOLDER} folder in your project.`,
        then: 'Inside it you should see START HERE and a skills folder.',
        more: `Your project is the folder you open in Claude Code. If you have none, make an empty folder and open that. If the folder is called "${PACK_FOLDER} (1)", rename it to ${PACK_FOLDER}.`,
      },
      {
        text: 'In Claude Code, say:',
        say: INSTALL_PROMPT,
        then: 'It asks before it adds the files, and before it adds one line to your project notes so it remembers to use them. Say yes.',
      },
      {
        text: 'Start a new chat, so the skills load. Then say:',
        say: DESIGN_REVIEW_PROMPT,
        then: 'It opens several aiux skills, then lists what it found and what to fix first. It can get things wrong, so check what it says.',
        more: `No project to review yet? Drag in a screenshot of any AI screen and say: "${SCREEN_REVIEW_PROMPT}"`,
      },
      {
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
        text: 'In Claude, open Customize, then Skills.',
        more: 'Keep the zip closed. You upload it as it is.',
      },
      {
        text: 'Press +, then Create skill, then Upload a skill, and choose the zip.',
        then: 'If Claude asks you to turn on code execution, turn it on. Skills need it.',
      },
      {
        text: 'Start a new chat, add a screenshot of any AI screen and say:',
        say: SCREEN_REVIEW_PROMPT,
        then: 'It can get things wrong, so check what it says.',
      },
      {
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
      { text: 'Read one example: a screen, what the skills found and what changed.' },
      { text: 'If you use Claude, upload the zip when you are ready. The Claude app page shows how.' },
      { text: `Or read all ${PATTERN_COUNT} patterns on the site, with nothing to install.` },
    ],
  },
};

export const PACK_GUIDE_LIST = PACK_TARGETS.map((t) => PACK_GUIDES[t]);

export const guidePath = (target: PackTarget) => `/skills/start/${PACK_GUIDES[target].slug}`;
export const guideUrl = (target: PackTarget) => `${SITE}${guidePath(target)}`;
