/**
 * "AI Evals for Designers: Quick Checklist": the five-step quick version of the
 * AI Evals for Designers course. One source for the page at
 * /ai-evals-checklist and the downloadable PDF, so the two never disagree.
 * Each step carries one example from the real study
 * (/guides/ai-evals-for-designers/the-study); numbers match that page.
 */

export interface EvalStep {
  number: number;
  title: string;
  /** Short label for the overview strip. */
  short: string;
  /** Rough time for 20 answers; a guide, not a measurement. */
  minutes: number;
  body: string;
  example: string;
}

export const EVAL_AFTERNOON = {
  title: 'AI Evals for Designers: Quick Checklist',
  lead: 'A five-step check for designers. About two hours with 20 real answers from your product, and nothing beyond a spreadsheet.',
  steps: [
    {
      number: 1,
      short: 'Collect',
      minutes: 20,
      title: 'Collect 20 real answers',
      body: 'Pull 20 real conversations or outputs from your product. Include the awkward ones: off-topic requests, missing data, things it should refuse.',
      example: 'The study used 41 screenshots and deliberately included pricing, login and legal pages, where an AI audit has nothing to find.',
    },
    {
      number: 2,
      short: 'Mark',
      minutes: 40,
      title: 'Mark each one pass or fail',
      body: 'Ask one question: would I be happy if a real user got this? Write one plain line on the first thing wrong. No scores and no categories yet.',
      example: 'Each of the 41 audits got one verdict and, when it failed, one line naming the first thing wrong.',
    },
    {
      number: 3,
      short: 'Group',
      minutes: 20,
      title: 'Group the notes and count',
      body: 'Sort the notes into piles the way you would affinity-map research. Count each pile. The biggest one is your first problem.',
      example: 'Six piles. Two tied for biggest at 7 failed audits each: stating guesses as findings, and asking for confidence scores on ordinary chat.',
    },
    {
      number: 4,
      short: 'Write the rule',
      minutes: 10,
      title: 'Write the biggest problem down as one rule',
      body: 'Make it a yes or no question that anyone on the team could apply to an answer and get the same verdict.',
      example: 'The rule: every piece of advice is either seen (it points at something on the screen) or assumed. 93 of 116 pieces of advice were assumed.',
    },
    {
      number: 5,
      short: 'Re-check',
      minutes: 30,
      title: 'Fix, then re-check the same 20 plus 5 new ones',
      body: 'Change one thing, rerun the same examples and apply the same rule. Add a few answers the fix never saw, so you know it works beyond the ones you tuned it on.',
      example: 'Guessed advice fell from 80% to 68% on the tuned screens, but only from 92% to 88% on fresh ones.',
    },
  ] satisfies EvalStep[],
  sheetColumns: ['#', 'Input (what the user asked or did)', 'Output (what the AI said)', 'Pass / Fail', 'First thing wrong (one line)', 'Group'],
};

/**
 * One real audit from the study, followed through all five steps on the page.
 * Source: ~/Desktop/evals-study (f-chat-claude). The screenshot is cropped to
 * the chat reply; the full capture showed private sidebar titles and tabs.
 * Imran's note is his label, punctuation tidied only.
 */
export const WORKED_EXAMPLE = {
  image: '/images/resources/ai-evals-checklist/claude-chat-audit.webp',
  imageAlt: 'A Claude chat reply explaining two collapsed audit findings, with copy, thumbs up, thumbs down and retry buttons below it.',
  topGapBefore: { pattern: 'Confidence Visualization', status: 'Missing' },
  note: 'Not every chat interface needs confidence visualization. Same with explainable AI: it assumes this is the final state of the UI, whereas I can highlight and ask Claude to follow up. All the gaps here seem irrelevant to a simple chat UI.',
  groups: [
    { name: 'States guesses as findings', fails: 7, thisAudit: true },
    { name: 'Confidence flags on ordinary chat', fails: 7, thisAudit: true },
    { name: 'Wrong call on whether AI is there', fails: 5, thisAudit: false },
    { name: "Audits pictures that aren't a product", fails: 4, thisAudit: false },
    { name: 'Misreads what is on screen', fails: 3, thisAudit: false },
    { name: 'Prescribes fixes without context', fails: 1, thisAudit: false },
  ],
  rules: [
    'Does this advice point at something on the screen, or does it assume something the screen cannot show?',
    'Ask for confidence only where the AI outputs a score, a prediction or a classification.',
  ],
  after: {
    topGap: 'Progressive Disclosure: collapsed audit-finding cards are unresolvable from within the chat',
    worthChecking: [
      'Does clicking the right-arrow chevron on the collapsed-card bar expand the card content inline, or does it navigate away?',
      "Does the 'Adaptive' model selector label explain what 'Adaptive' means on hover or click?",
    ],
  },
  totals: { tunedBefore: 80, tunedAfter: 68, freshBefore: 92, freshAfter: 88 },
};

export const EVAL_PDF_PATH = '/downloads/ai-evals-checklist.pdf';
export const EVAL_SHEET_PATH = '/downloads/eval-review-sheet.csv';
