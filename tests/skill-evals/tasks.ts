import type { EvalTask } from './types';

/**
 * The corpus.
 *
 * Rules these follow, because breaking them makes the eval lie:
 *
 * 1. Phrased as a designer actually types, not as the skills phrase themselves. A prompt
 *    that echoes a trigger line tests string matching, not usefulness.
 * 2. Enough product context to be answerable, so a weak answer cannot hide behind
 *    "it depends".
 * 3. At least two cases where no aiux pattern applies, so the harness can detect harm
 *    rather than only benefit.
 */
export const TASKS: EvalTask[] = [
  {
    slug: 'invoice-prefill',
    prompt:
      "I design an invoicing tool for small agencies. When someone starts a new invoice we pre-fill the customer and the amount based on what they've billed before. It's wrong maybe half the time and people have to clear the fields before typing. My PM wants to 'make the prediction smarter'. What should I actually do to the design?",
    expectedPattern: 'predictive-anticipation',
    notes:
      'Over-anticipation complaint. The interesting answer questions committing the prediction at all rather than improving accuracy. Tests whether the answer pushes back on the PM framing.',
  },
  {
    slug: 'support-escalation',
    prompt:
      "Our AI support assistant handles billing questions for a consumer banking app. Sometimes people type things that clearly need a human — distress, fraud panic, threats of legal action. Right now it just keeps answering in its own voice. What should the design do at those moments?",
    expectedPattern: 'escalation-pathways',
    notes:
      'High-stakes handoff. A good answer covers the moment of transfer and what the human receives, not just a "talk to a human" button.',
  },
  {
    slug: 'summary-trust',
    prompt:
      "We built a feature that summarises long email threads for sales reps. Reps tell us they don't trust the summaries and re-read the thread anyway, so the feature saves nobody any time. Usage is flat. How should I change the design?",
    expectedPattern: 'confidence-visualization',
    notes:
      'Trust failure where the obvious answer (add a confidence score) is probably wrong. Rewards an answer that reaches for verifiability instead.',
  },
  {
    slug: 'bulk-approve',
    prompt:
      "Our moderation tool shows AI-flagged posts in a queue and a human approves or rejects each one. Reviewers get through 400 a day and I'm fairly sure they're just hammering approve. Leadership treats the queue as proof a human checked. What do I change?",
    expectedPattern: 'human-in-the-loop',
    notes:
      'Rubber-stamp review. The strong answer addresses the volume and the false assurance, not just the button layout.',
  },
  {
    slug: 'settings-sprawl',
    prompt:
      "The settings screen in our AI writing tool has grown to 40-odd options across one long page. New users can't find the three things they actually need; power users say don't you dare hide anything. Where do I start?",
    expectedPattern: 'progressive-disclosure',
    notes:
      'Classic disclosure problem, deliberately easy. If the pack cannot beat baseline here it likely cannot anywhere. Also the pattern whose skill body a reviewer called mostly restatement.',
  },
  {
    slug: 'agent-long-run',
    prompt:
      "We shipped an agent that reorganises a customer's whole product catalogue. It can run for 20 minutes. Right now the user gets a spinner and then a done screen. People cancel halfway because they assume it's stuck, and support gets tickets asking if it broke.",
    expectedPattern: 'agent-status-monitoring',
    notes:
      'Long-running opacity. Tests whether the answer gets to intermediate evidence of progress rather than a nicer spinner.',
  },
  {
    slug: 'memory-creep',
    prompt:
      "Our assistant remembers things people mention in chat and uses them later. A user complained it brought up their divorce, months after they'd mentioned it once. Nobody on the team can tell me what it stores or how to remove one thing. What does the design need?",
    expectedPattern: 'selective-memory',
    notes:
      'Memory control, with a real human cost in the prompt. Rewards an answer covering inspection and deletion, not just a settings toggle.',
  },
  {
    slug: 'onboarding-tips',
    prompt:
      "We added coachmarks to teach people our AI features. They appear over the thing the user is reading and everyone X's out of them immediately. Completion of the tour is 4%. My instinct is to make them prettier but I don't think that's it.",
    expectedPattern: 'contextual-assistance',
    notes:
      'Intrusive help. The prompt already rejects the cosmetic fix, so a response that suggests restyling scores badly on diagnosis.',
  },

  // --- Negative cases. No aiux pattern meaningfully applies. ---
  {
    slug: 'pricing-page',
    prompt:
      "I need to design the pricing page for our B2B analytics product. Three tiers, annual and monthly toggle, and a sales-assisted enterprise option. What's the layout and what do I put where?",
    expectedPattern: null,
    notes:
      'NEGATIVE CASE. Ordinary marketing design, no AI surface. If the pack degrades this answer by forcing pattern-shaped advice onto it, that is harm and the report must show it.',
  },
  {
    slug: 'csv-import',
    prompt:
      "Users upload a CSV of their contacts and we need to map their column headers to our fields. Files are messy — wrong order, missing columns, occasional junk rows. How should the mapping step work?",
    expectedPattern: null,
    notes:
      'NEGATIVE CASE. A data-mapping problem with no AI in it. Adjacent enough that a pattern-primed model might reach for the pack anyway.',
  },
];
