import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const explainableai: Pattern = {
  id: "explainable-ai",
  title: "Explainable AI (XAI)",
  slug: "explainable-ai",
  category: "Trustworthy & Reliable AI",
  description: "Make AI decisions understandable via visualizations, explanations, and transparent reasoning.",
  thumbnail: "/images/examples/claudethinking.gif",
  introduction: "Explainable AI (XAI) is a design pattern that makes AI decisions understandable by showing how and why the system reached its conclusions. Instead of treating AI as a mysterious black box, this pattern uses visualizations, natural language explanations, and transparent reasoning to build trust and enable verification. It's essential for high-stakes decisions like medical diagnosis or loan approvals, debugging AI systems, or any application where users need to understand the logic behind recommendations. Real examples include Claude showing step-by-step thinking, Perplexity citing sources for every claim, or credit scoring systems explaining which factors influenced your score.",
  datePublished: "2024-01-15",
  dateModified: "2026-05-18",
  hideFAQ: true,
  content: {
    problem: "AI systems often act as 'black boxes,' hindering understanding of decisions. This reduces trust, complicates debugging, and allows biased or incorrect decisions to go unnoticed.",
    solution: "Explain AI conclusions using visualizations, natural language, and interactive elements. Help users understand reasoning, data sources, and confidence levels.",
    examples: [
      {
        title: "Claude Reasoning",
        description: "Notice the choice: reasoning is expandable, not forced inline. The explanation never blocks the answer. You opt into depth, you're not taxed with it.",
        image: "/images/examples/claudethinking.gif",
        altText: "Claude AI step-by-step reasoning process"
      },
      {
        title: "Perplexity AI Citations",
        description: "Shows exact sources for each answer, allowing users to verify information.",
        image: "/images/examples/perplexity-attribution.gif",
        altText: "Perplexity AI source attribution"
      },
      {
        title: "Hugging Face Model Cards",
        description: "Provides detailed documentation on model capabilities, limitations, training data, and biases to help users understand AI decision-making.",
        image: "/images/examples/huggingface-models.gif",
        altText: "Hugging Face Model Card example"
      }
    ],
    guidelines: [
      "Provide explanations at appropriate detail levels for different user types.",
      "Use visual aids (heatmaps, charts, diagrams) to illustrate decision factors.",
      "Show confidence levels and uncertainty ranges for AI predictions.",
      "Explain both what and why the AI decided.",
      "Provide source attribution when applicable.",
      "Use natural language explanations for non-experts.",
      "Allow users to drill down for more detailed explanations.",
      "Show alternative options considered but not chosen.",
      "Highlight the most important factors influencing the decision."
    ],
    considerations: [
      "Balance explanation detail with cognitive load and usability.",
      "Consider different explanation needs for varying expertise levels.",
      "Ensure explanations are accurate without oversimplifying.",
      "Account for cases where AI reasoning is too complex for simple explanations.",
      "Consider privacy implications of showing detailed decision factors.",
      "Plan for scenarios where explanations might reveal system vulnerabilities.",
      "Test explanations with real users to ensure helpfulness.",
      "Consider cultural and linguistic differences in explanation preferences.",
      "Balance transparency with intellectual property protection."
    ],
    relatedPatterns: [
      "Transparent Feedback",
      "Human-in-the-Loop",
      "Responsible AI Design",
      "Error Recovery",
      "Plan Summary"
    ],
    codeExamples: codeExamples,
    judgmentCall: {
      explainWhen: [
        "The decision is high-stakes and contestable (medical, credit, moderation), and the user needs grounds to challenge it.",
        "The user can act on the explanation: change an input, correct data, appeal.",
        "Trust, not speed, is the bottleneck to adoption."
      ],
      dontWhen: [
        "The decision is low-stakes and reversible. Explanation is friction.",
        "The explanation would be post-hoc rationalization the model didn't actually use to decide. That is lying with UI.",
        "Real reasoning exposed would let users game the system."
      ],
      trap: "Fake transparency: a confidence number and three tidy 'factors' that look rigorous but aren't how the model decided. Worse than no explanation. It manufactures unearned trust and collapses the first time a user catches the seam."
    },
    installPrompt: `You are implementing the Explainable AI (XAI) design pattern in this codebase.

The pattern in one line: make AI decisions understandable, contestable, and mappable to an action the user can take.

Apply the following four moves wherever this codebase surfaces an AI decision (model output, recommendation, score, classification). DO NOT apply to low-stakes or uncontestable surfaces (sentiment readouts, simple suggestions, non-binding recommendations). Explanation there is friction, not transparency.

1. Decide what the user can DO with the explanation first.
   For each AI decision surface you find, identify the single action a user takes after seeing the explanation (change an input, correct data, escalate, appeal). If no such action exists, flag the surface. Do not add an explanation. Improve the decision instead.

2. Show the real drivers, ranked. Not a flat list.
   Driver data must carry a numeric weight field. Sort descending. Cap to 3. If weight is missing on any driver, throw. Do not silently fall back to insertion order.

3. Make confidence legible, not decorative.
   Replace every confidence percentage rendered to users with a sentence backed by cohort size (e.g. "Matches 1,200 similar cases with a 1.2% default rate"). If cohort size is unavailable at a surface, add a TODO and skip that surface. Do not fabricate a number.

4. Give an exit.
   Every AI decision surface needs an appeal/correct/dispute affordance within one click. Persist the original decision payload (decisionId, drivers, confidence) so a human reviewer sees what the user saw. Confirmation UI replaces the appeal button, not the decision card.

The trap to avoid: "fake transparency". A confidence number plus three tidy factors that look rigorous but aren't how the model decided. Worse than no explanation. If you can't honestly rank the drivers, say so instead of faking it.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. low-stakes, no user action, missing cohort data)
- New endpoints / data fields you added (e.g. /api/appeals, weight field on drivers) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "First, decide what the user can do with the explanation.",
        body: "If the answer is 'nothing,' you don't need an explanation, you need a better decision. Every explanation should map to an action the user can take: change an input, correct data, escalate, appeal. No action, no explanation."
      },
      {
        heading: "Show the real drivers, ranked. Not a flat list.",
        body: "Three drivers in order of weight beats nine unordered. If you can't rank them, you don't understand the model well enough to explain it yet, and the right move is to say so, not to fake the ranking."
      },
      {
        heading: "Make confidence legible, not decorative.",
        body: "'87%' means nothing to a human deciding whether to act. 'Confident: matches 1,200 similar cases' is an explanation. A bare number is theater dressed as rigor."
      },
      {
        heading: "Give an exit.",
        body: "Every explanation needs 'this is wrong → correct or appeal.' An explanation the user can't contest is a press release. The exit is what turns transparency from a marketing claim into a feedback loop."
      }
    ]
  }
};
