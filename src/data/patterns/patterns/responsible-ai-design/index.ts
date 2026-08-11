import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const responsibleaidesign: Pattern = {
  id: "responsible-ai-design",
  title: "Responsible AI Design",
  slug: "responsible-ai-design",
  description: "Prioritize fairness, transparency, and accountability throughout AI lifecycle.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/openai-human-feedback.png",
  introduction: "Responsible AI Design prioritizes fairness, transparency, accountability, and user welfare throughout the AI lifecycle. Instead of treating ethics as afterthought, this approach embeds responsible practices from design through deployment. It's essential for systems affecting people's lives in hiring, lending, healthcare, or content moderation. Examples include OpenAI's RLHF reducing harmful outputs, Google's Model Cards documenting biases, or LinkedIn's recruitment bias detection.",
  datePublished: "2024-01-15",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when fairness, bias, or accountability is at stake: bias audits, 'could this harm or exclude someone', ethical review of AI decisions, accountability for automated outcomes. Responsible AI Design builds these checks into the lifecycle.",
    problem: "AI systems can perpetuate biases, make unfair decisions, or cause harm without ethical design.",
    solution: "Prioritize fairness, transparency, accountability, and user welfare throughout the AI system lifecycle.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The system makes decisions about people who can't easily walk away: hiring, lending, housing, healthcare, content moderation, benefits eligibility. The asymmetry of power is the reason this pattern exists.",
        "A fairness or safety failure would harm a specific group differently than the average user, and you can name who. 'It works for most people' is exactly the sentence that hides the harm.",
        "You can wire a principle to a gate that blocks a release: a bias threshold the eval must clear, a red-team result that holds the deploy, an audit a human signs before launch. If a value can stop a ship, it belongs here."
      ],
      dontWhen: [
        "The stakes are genuinely low and reversible and no group is differentially affected. A bias dashboard on a font-suggestion feature is compliance cosplay, not responsibility.",
        "You're adding a principles page, a values statement, or a one-time fairness audit that touches nothing in the pipeline. A document that can't block a release is decoration, and decoration is worse than nothing because it buys you the feeling of having acted.",
        "The 'responsible' surface exists to reassure the user rather than to constrain the system: a trust badge, an ethics score, a 'reviewed for bias' stamp with no review behind it. You are now lying about your own conduct."
      ],
      trap: "The ethics checkbox: an AI-principles doc, a values page, or a one-time fairness audit that lives next to the product and never touches what ships. The score gets computed, the badge gets rendered, the PDF gets filed, and the model deploys on exactly the same decision it would have made without any of it. It is worse than skipping the pattern, because the artifact launders the harm: leadership points to the principles, users see the badge, and nobody can name the threshold that ever stopped a release. Responsibility becomes a marketing surface instead of a constraint on the system. The test is brutally simple: name the last time one of your values blocked a ship. If you can't, you don't have responsible AI, you have responsibility washing."
    },
    installPrompt: `You are implementing the Responsible AI Design pattern in this codebase.

The pattern in one line: turn stated values (fairness, safety, accountability) into enforced gates that can actually block what ships, not documents that sit beside the product.

DO NOT add principles pages, trust badges, ethics scores, or "reviewed for bias" stamps that aren't backed by a gate that can stop a release. A reassurance surface with nothing behind it is the failure mode, not the pattern.

1. Find the high-stakes decision surfaces.
   Locate every place the system makes a decision about a person where the outcome is consequential and hard to reverse (ranking people, approving/denying, moderating, scoring eligibility). List them. Low-stakes, reversible, non-differential surfaces are out of scope; flag and skip them.

2. Attach a gate to each value, not a label.
   For each surface, define a measurable check that can FAIL the build or hold the deploy: a fairness metric across named subgroups with a threshold, a red-team/eval suite that must pass, or a required human sign-off persisted with the decision. If a value can't be expressed as something that blocks a ship, say so; don't render a badge in its place.

3. Make accountability legible and durable.
   Persist who/what decided, the inputs, the model version, and the sign-off, so a decision is reconstructable months later. An audit trail that isn't queryable is not accountability.

4. Give the affected person a real exit.
   Every high-stakes decision needs a contest/appeal path that reaches a human and surfaces the same evidence the system used. A "Report" button that goes nowhere is part of the trap.

The trap to avoid: the ethics checkbox. If none of your values can point to a release they blocked, you've built responsibility washing. Wire the value to a gate or cut it.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + the gate you attached and what it blocks
- Surfaces flagged but not updated: file path + why (low-stakes, reversible, no differential harm, or a label with no gate you removed instead of wiring)
- New gates / audit fields / appeal paths you added and what still needs human sign-off (especially subgroup thresholds, which need a human to set)

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "If a value can't block a ship, it isn't a value yet.",
        body: "The whole pattern reduces to one question: name the last time fairness or safety stopped one of your releases. A principle wired to a threshold that can fail the build is responsibility. A principle on a slide is a press release. Everything else in responsible AI is downstream of this."
      },
      {
        heading: "Name who gets harmed, or you've hidden the harm.",
        body: "'It works for most users' is the exact sentence that buries differential failure. Responsible design means measuring outcomes across the specific subgroups who can't walk away, not the average. If your metrics only report aggregates, you've built a tool that can't see the people the pattern exists to protect."
      },
      {
        heading: "A score is not a safeguard.",
        body: "An ethics score, a bias dashboard, or a 'reviewed' badge that computes a number and changes nothing about what deploys is the signature failure. It manufactures the feeling of having acted while the model ships unchanged. Worse than doing nothing, because the artifact launders the harm and buys everyone false comfort."
      },
      {
        heading: "Accountability means a decision is reconstructable later.",
        body: "When a bad outcome surfaces months after launch, can you say who decided, on what inputs, with which model version, and who signed off? If the answer lives only in someone's memory, you don't have accountability, you have a story. Persist the chain so it survives the people who built it."
      },
      {
        heading: "The affected person needs a door, not a badge.",
        body: "The user on the wrong end of a high-stakes decision doesn't need to see your principles. They need a contest path that reaches a human and shows the same evidence the system used. An appeal button that goes nowhere is the trap wearing the costume of the cure."
      }
    ]
  }
};
