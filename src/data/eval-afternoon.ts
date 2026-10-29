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
      example: 'Six piles. The biggest was advice about things a single screenshot cannot show.',
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

export const EVAL_PDF_PATH = '/downloads/ai-evals-checklist.pdf';
export const EVAL_SHEET_PATH = '/downloads/eval-review-sheet.csv';
