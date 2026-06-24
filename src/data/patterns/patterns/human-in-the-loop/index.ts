import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const humanintheloop: Pattern = {
  id: "human-in-the-loop",
  title: "Human-in-the-Loop",
  slug: "human-in-the-loop",
  category: "Human-AI Collaboration",
  description: "Balance automation with human oversight for critical decisions, ensuring AI augments human judgment.",
  thumbnail: "/images/examples/grammarly-suggestions.gif",
  introduction: "Human-in-the-Loop is an AI design pattern where humans review and approve critical AI decisions before they're finalized. Instead of full automation, this pattern keeps humans as active participants who validate outputs and maintain control. It's essential for high-stakes decisions, situations requiring ethical judgment, or when building trust in new AI systems. Examples include Grammarly suggesting edits that you approve, content moderation tools that flag issues for human review, and medical AI that provides recommendations for doctors to confirm.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    problem: "Fully automated AI systems risk critical errors and lack transparency. Users need review and override capabilities for safety and trust.",
    solution: "Design systems for human intervention, review, or approval of AI outputs. Provide clear handoff points, easy override mechanisms, and transparent explanations.",
    examples: [
      {
        title: "Grammarly Writing Assistant",
        description: "Grammarly suggests grammar, spelling, and style improvements, requiring human approval to maintain control over final text.",
        image: "/images/examples/grammarly-suggestions.gif",
        altText: "Grammarly human-in-the-loop suggestions"
      },
      {
        title: "Google Photos Face Detection",
        description: "Google Photos detects faces, but users confirm identities for verification.",
        image: "/images/examples/google-face-detection.gif",
        altText: "Google Photos face detection"
      },
      {
        title: "OpenAI RLHF",
        description: "OpenAI uses Reinforcement Learning from Human Feedback (RLHF); humans rate AI outputs to train reward models for refinement.",
        image: "/images/examples/openai-human-feedback.png",
        altText: "OpenAI human feedback"
      }
    ],
    codeExamples,
    guidelines: [
      "Clearly indicate when human review is required or possible.",
      "Facilitate easy override, correction, or feedback on AI outputs.",
      "Log interventions for transparency and improvement.",
      "Explain AI decisions to support human judgment.",
      "Design workflows that minimize AI-human handoff friction."
    ],
    considerations: [
      "Balance efficiency with safety; too many interventions can slow workflows.",
      "Avoid overwhelming humans with excessive review requests.",
      "Address potential bias in AI and human decisions.",
      "Provide training and support for users in review roles.",
      "Monitor and refine human-in-the-loop trigger thresholds."
    ],
    relatedPatterns: [
      "Transparent Feedback",
      "Contextual Assistance",
      "Progressive Disclosure",
      "Autonomy Spectrum",
      "Mixed-Initiative Control"
    ],
    figmaPrompt: {
      prompt: `Design an interface where humans can review and approve AI suggestions before they're applied:

Create a review card showing:
1. **AI Suggestion**: Display the AI-generated content/action with a confidence indicator
2. **Action Buttons**: Clear Approve/Reject/Modify options
3. **Context**: Brief explanation of why AI made this suggestion
4. **Override Option**: Allow users to edit or provide their own input

Show visual distinction between AI suggestions (blue/purple) and human-approved items (green).`,
      tips: [
        "Use distinct colors for AI vs human decisions",
        "Include confidence scores to guide review priority",
        "Make approve/reject buttons clear and accessible",
        "Add undo option for quick corrections",
        "Show what happens when user approves/rejects"
      ]
    },
    judgmentCall: {
      explainWhen: [
        "The decision is high-stakes and hard to reverse: a ban, a payout, a diagnosis, a published claim. A human in front of it is the difference between a recoverable mistake and a public one.",
        "The AI is right often but not always, and the failure cases are the expensive ones. Review earns its cost when the misses are the part that hurts.",
        "Someone needs to be accountable for the call, and that accountability has to be real: the reviewer has the time, the context, and the authority to say no."
      ],
      dontWhen: [
        "Volume is high, time-per-item is seconds, and approving is one click with no cost for being wrong. You haven't added oversight, you've built a rubber stamp.",
        "The AI is accurate enough that a human almost never overturns it. The review is now a tax that slows the system and trains the reviewer to stop reading.",
        "The human can't actually act on what they see: the context is missing, the reject path is buried, or overruling the AI gets them second-guessed. A loop the human can't break is decoration."
      ],
      trap: "The rubber stamp: a review queue where approve is the fast path, the AI is right often enough that nothing looks worth stopping for, and the reviewer learns to click through without reading. It is worse than full automation, not better. Automation is at least honest that no human looked. A rubber stamp manufactures a 'human-approved' record on top of an unreviewed decision, laundering the AI's call into fake accountability and parking a person in the blame seat for a judgment they never made."
    },
    installPrompt: `You are implementing the Human-in-the-Loop design pattern in this codebase.

The pattern in one line: put a human in front of the AI decisions that are expensive to get wrong, and make sure that human can actually say no.

Apply the following moves wherever this codebase finalizes a consequential AI decision (a ban, payout, publish, irreversible write, or anything a user would contest). DO NOT add a review step to high-volume, low-stakes, reversible decisions where the human would just click approve all day. That builds a rubber stamp, not oversight; leave those automated and honest.

1. Decide what the human is actually deciding.
   For each surface you gate, write the one question the reviewer answers (approve / reject / escalate) and the consequence of each. If the answer is always "approve" in practice, the review is theater. Remove it or raise the threshold so only genuine edge cases reach a human.

2. Give the reviewer enough to overrule, not just to agree.
   Each review item must surface the AI's decision, its confidence, the reason, and the underlying content the user saw. Reject and escalate must be as reachable as approve. If approve is the only one-click path, you have designed the rubber stamp.

3. Make overruling cheap and approving accountable.
   Wire a real reject/escalate flow that does something (routes elsewhere, reverses the action, logs a correction). Capture who approved, when, and on what evidence. Persist the decision payload so the audit trail reflects a real review, not a click.

4. Route by stakes, not by default.
   Auto-resolve the cases the AI is reliably right on; reserve human review for the consequential and uncertain ones. Tune the trigger threshold so reviewers see few enough items to read each one. A queue no one can keep up with becomes a queue no one reads.

The trap to avoid: the rubber stamp. If approving is the fast path and nothing has a cost for being wrong, you are laundering unreviewed AI decisions into a fake "human-approved" record. Either make the review real or remove it.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + the decision the human now makes + the four moves you applied
- Surfaces flagged but not updated: file path + why (e.g. low-stakes, reversible, reviewer can't act, would be a rubber stamp)
- New flows/data you added (reject/escalate routing, approver+evidence logging, threshold routing) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "First, decide if the human can actually say no.",
        body: "Human-in-the-loop is only a loop if the human can break it. If reject is buried, the context is missing, or overruling the AI gets the reviewer second-guessed, you have a spectator, not an approver. Design the no before you design the yes."
      },
      {
        heading: "Route by stakes, not by reflex.",
        body: "Reviewing everything trains people to review nothing. Auto-resolve the cases the AI is reliably right on and reserve a human for the consequential and uncertain ones. The fewer items in the queue, the more likely each one actually gets read."
      },
      {
        heading: "Approving has to cost something to mean something.",
        body: "If approve is one click and there is no consequence for waving through a bad call, you have built a rubber stamp. Show the reviewer what they are signing, make reject as easy as approve, and record who approved on what evidence. A click is not a review."
      },
      {
        heading: "Give the reviewer enough to overrule, not just to agree.",
        body: "Confidence, reason, and the raw content the user saw are the minimum. A reviewer who only sees the AI's verdict will defer to it every time. Show the work behind the call so a human can disagree with it."
      },
      {
        heading: "A rubber stamp is worse than honest automation.",
        body: "Full automation at least admits no one looked. A review queue people click through manufactures a 'human-approved' record on top of an unreviewed decision and parks a person in the blame seat. If you can't make the review real, don't fake it: automate openly and own the risk."
      }
    ]
  }
};
