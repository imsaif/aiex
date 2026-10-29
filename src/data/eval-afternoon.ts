/**
 * "AI Evals for Designers: Quick Checklist": the five-step quick version of the
 * AI Evals for Designers course. One source for the page at
 * /ai-evals-checklist and the downloadable PDF, so the two never disagree.
 * Each step has generic examples for common AI products, plus what it was
 * in the real study (/guides/ai-evals-for-designers/the-study).
 */

export interface EvalStep {
  number: number;
  title: string;
  /** Short label for the overview strip. */
  short: string;
  /** Rough time for 20 answers; a guide, not a measurement. */
  minutes: number;
  body: string;
  /** Generic illustrations for common AI products. Made-up, and labelled as examples. */
  examples: Array<{ product: string; text: string }>;
  /** What this step was in the real study, on the aiux audit tool. */
  ours: string;
}

/**
 * The steps are written for any AI product. The real study is told
 * separately ("How we did it"), because its failures were specific to a tool
 * that turns one screenshot into design advice; a support bot or a writing
 * assistant fails in its own ways, so a reader should find their own rule,
 * not borrow ours.
 */
export const EVAL_AFTERNOON = {
  title: 'AI Evals for Designers: Quick Checklist',
  lead: 'Five steps to find where your AI product goes wrong, using 20 real answers and a spreadsheet. About two hours, no code.',
  steps: [
    {
      number: 1,
      short: 'Collect',
      minutes: 20,
      title: 'Collect 20 real answers',
      body: 'Pull 20 real conversations or outputs from your product. Include the awkward ones: requests it cannot handle, missing information, things it should refuse.',
      examples: [
        { product: 'Support bot', text: 'Real tickets, including refund requests and an angry customer' },
        { product: 'Writing assistant', text: 'Drafts from very short prompts and off-brand requests' },
        { product: 'Search or summary', text: 'Questions with no good answer in the sources' },
      ],
      ours: 'Our product turns a screenshot into design advice, so our answers were audits: 41 screenshots, including pricing, login and legal pages where there is nothing AI to find.',
    },
    {
      number: 2,
      short: 'Mark',
      minutes: 40,
      title: 'Mark each one pass or fail',
      body: 'Ask one question: would I be happy if a real user got this? When it fails, write one plain line on the first thing wrong. No scores and no categories yet.',
      examples: [
        { product: 'Support bot', text: 'Fail: promises a refund it cannot issue' },
        { product: 'Writing assistant', text: 'Fail: tone far too casual for a legal email' },
        { product: 'Search or summary', text: 'Fail: summary leaves out the main caveat' },
      ],
      ours: 'Imran marked all 41 audits. An AI gave a second opinion, and he made the final call where they disagreed.',
    },
    {
      number: 3,
      short: 'Group',
      minutes: 20,
      title: 'Group the notes and count',
      body: 'Sort the notes into piles the way you would affinity-map research. Count each pile. The biggest pile is your first problem.',
      examples: [
        { product: 'Support bot', text: 'Claims actions it cannot take' },
        { product: 'Writing assistant', text: 'Ignores the requested tone' },
        { product: 'Search or summary', text: 'Drops important caveats' },
      ],
      ours: 'Six piles. Two tied for biggest: advice about things a single screenshot cannot show, and asking for confidence scores on ordinary chat.',
    },
    {
      number: 4,
      short: 'Write the rule',
      minutes: 10,
      title: 'Turn the biggest pile into one rule',
      body: 'Write it as a yes or no question that anyone on the team could apply to an answer and get the same verdict.',
      examples: [
        { product: 'Support bot', text: 'Does it only promise actions the product can actually take?' },
        { product: 'Writing assistant', text: 'Does the draft match the tone the user asked for?' },
        { product: 'Search or summary', text: 'Does the summary keep every caveat from the source?' },
      ],
      ours: 'Does this advice point at something on the screen, or assume something the screen cannot show? 93 of 116 pieces of advice were assumed.',
    },
    {
      number: 5,
      short: 'Re-check',
      minutes: 30,
      title: 'Fix, then re-check the same 20 plus 5 new ones',
      body: 'Change one thing, rerun the same answers and apply the same rule. Add a few the fix never saw, so you know it works beyond the ones you tuned it on.',
      examples: [
        { product: 'Any product', text: 'Count how many answers break the rule, before and after' },
        { product: 'Any product', text: 'Read the new ones too: a fix can quietly break something else' },
      ],
      ours: 'Advice that guessed fell from 80% to 68% on the screens we tuned on, but only from 92% to 88% on fresh ones.',
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
