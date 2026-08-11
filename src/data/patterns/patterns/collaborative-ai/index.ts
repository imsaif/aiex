import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const collaborativeai: Pattern = {
  id: "collaborative-ai",
  title: "Collaborative AI",
  slug: "collaborative-ai",
  description: "Enable effective collaboration between multiple users and AI within shared workflows.",
  category: "Human-AI Collaboration",
  thumbnail: "/images/examples/notion-ai.gif",
  introduction: "Collaborative AI is an AI design pattern where multiple team members work together with AI in shared spaces, maintaining coordination and collective understanding. Instead of each person using AI separately, this pattern lets teams collaborate with AI as a shared resource that understands group context, contributes to discussions, and helps coordinate work. It's perfect for remote teams making group decisions, collaborative documents where multiple people edit together, or project management where AI helps coordinate tasks across team members. Think of how Notion AI helps teams draft documents together, or how Miro's AI assists in collaborative brainstorming sessions with multiple participants.",
  datePublished: "2024-01-15",
  dateModified: "2026-06-23",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when several people and an AI share one workflow: team workspaces with AI, shared documents or channels, 'AI in our group project', coordinating human and AI contributions. Collaborative AI keeps teams coordinated while AI participates.",
    problem: "Teams need effective AI collaboration while maintaining coordination, shared understanding, and human relationships.",
    solution: "Create AI interfaces that enhance team collaboration via shared decision-making, context maintenance, and group workflow support.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop",
      "Mixed-Initiative Control"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The work is genuinely shared: multiple people plus AI editing the same artifact, where the risk is losing track of who changed what and why.",
        "The AI can contribute something a teammate can't, or won't: an outside perspective, a missed edge case, a draft nobody wanted to write. A partner earns its seat by disagreeing usefully, not by agreeing fast.",
        "Attribution and reversibility matter: people need to see which edits are AI's, weigh them, and roll them back without untangling everyone else's work."
      ],
      dontWhen: [
        "The AI only ever validates. If every contribution is 'great point, here's more of it,' you've added a cheerleader, not a collaborator, and the team will mistake agreement for review.",
        "The task is one person's call and the 'collaboration' is set dressing. Forcing a group ritual onto a solo decision just adds latency and diffuses ownership.",
        "You can't tell AI edits from human edits after the fact. Unattributed AI contributions quietly become 'the team decided,' and nobody can audit a decision no one remembers making."
      ],
      trap: "The yes-man collaborator: an AI teammate whose only real move is to agree. It affirms the direction, polishes the phrasing, and stacks on confident-sounding support, so the document gets more assertive without getting more correct. It feels like a productive partner because something is always happening, but a collaborator that never pushes back is just a mirror with good grammar. The danger is social, not technical: praise from a participant reads as validation, the group's confidence climbs, and the one role the team actually needed filled, the person who says 'wait, are we sure?', stays empty."
    },
    installPrompt: `You are implementing the Collaborative AI design pattern in this codebase.

The pattern in one line: make the AI a teammate that earns its seat by adding judgment and clear attribution, not a participant that just agrees faster.

Apply the following moves wherever this codebase has multiple people working with AI on a shared artifact (docs, canvases, code, plans, decisions). DO NOT force a collaboration ritual onto solo, single-owner decisions; there the group framing only adds latency and diffuses ownership.

1. Attribute every AI contribution at the source.
   Each AI edit, suggestion, or comment must be tagged as AI-authored in the data model and visibly in the UI, distinct from human edits. Persist authorship on the contribution record, not just in a transient label. If a surface mixes AI and human changes with no way to tell them apart after the fact, fix that before adding more AI output.

2. Make AI contributions reviewable and reversible, not auto-merged.
   A teammate proposes, the team decides. Every AI contribution needs an explicit accept / modify / reject affordance and an undo that works alongside human history. Never silently fold AI edits into the shared document.

3. Let the AI disagree, and make disagreement a first-class output.
   Audit where the AI only ever affirms or elaborates. Add at least one contribution type that pushes back: a flagged risk, a missing case, a "this contradicts the section above." If the AI cannot currently produce a dissent, treat that as the gap to close, not a feature to hide.

4. Show shared context, not per-user silos.
   The AI's view of the work, and its contribution history, should be visible to everyone in the session, so the group reasons from the same state. Avoid giving each user a private AI side-channel that fragments the team's understanding.

5. Keep a human owner for any group decision the AI touches.
   For decisions (not just edits), name the human accountable for the outcome. The AI's role is input; the sign-off is a person's. Make that ownership explicit in the UI so AI agreement never quietly becomes "the team decided."

The trap to avoid: the yes-man collaborator. An AI that only validates makes the group more confident without making it more correct. If your AI's contributions can't disagree, you've built a cheerleader, not a teammate.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. solo decision, no shared artifact, no attribution model yet)
- New data fields / contribution types you added (authorship tagging, dissent/flag type, decision-owner field) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "A collaborator earns its seat by disagreeing usefully.",
        body: "If the AI's only moves are to agree, elaborate, and polish, you've added a cheerleader, not a teammate. The contribution that matters most is the one nobody else made: a flagged risk, a missed case, a 'wait, are we sure?' An AI that can't push back is a mirror with good grammar."
      },
      {
        heading: "Attribute AI contributions at the source, not as an afterthought.",
        body: "Tag every AI edit as AI-authored in the data model and the UI, distinct from human edits. Unattributed AI output quietly becomes 'the team decided,' and a decision no one remembers making is one no one can audit. Authorship lives on the record, not in a label that disappears on refresh."
      },
      {
        heading: "Propose, don't auto-merge.",
        body: "A teammate suggests; the team decides. Every AI contribution needs accept / modify / reject and an undo that works alongside human history. The moment AI edits fold silently into the shared artifact, you've swapped a collaborator for an uninvited co-author."
      },
      {
        heading: "Don't manufacture collaboration for a solo call.",
        body: "Forcing a group ritual onto a one-person decision adds latency and diffuses ownership without adding judgment. Collaborative AI is for genuinely shared work. If the decision is one person's, give them a sharp assistant, not a committee."
      },
      {
        heading: "Keep a named human on the hook.",
        body: "For any group decision the AI touches, name the person accountable for the outcome. The AI's role is input; the sign-off is a human's. Make that ownership visible so the AI's agreement can never quietly stand in for the team's."
      }
    ]
  }
};
