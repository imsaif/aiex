import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const trustcalibration: Pattern = {
  id: "trust-calibration",
  title: "Trust Calibration",
  slug: "trust-calibration",
  status: 'implemented',
  description: "Design a system that progressively builds appropriate trust through demonstrated competence  -  showing track records per domain, celebrating milestones, and adjusting oversight based on actual agent performance.",
  category: "Trustworthy & Reliable AI",
  tags: ["agentic", "trust", "calibration", "performance", "reliability", "progressive"],
  thumbnail: "/api/og/patterns?slug=trust-calibration",
  introduction: "Users either over-trust or under-trust AI agents. Over-trust leads to passive reliance on inaccurate outputs where users stop checking and mistakes compound. Under-trust means users micromanage every action, defeating the purpose of delegation. Trust calibration is the design challenge of aligning a user's perception of the agent's reliability with its actual performance over time. Unlike one-time confidence scores, this is a relationship that evolves  -  the agent earns more or less trust based on its track record with that specific user. The pattern starts agents supervised with high visibility, shows per-domain track records, proactively repairs trust after mistakes, and offers autonomy upgrades only when earned. Trust builds slowly and breaks quickly, and the design must account for this asymmetry.",
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when users trust the AI too much or too little: over-reliance on wrong output, micromanaging a capable agent, per-domain track records, 'earn more autonomy over time'. Trust Calibration aligns perceived reliability with actual performance.",
    problem: "Users either over-trust or under-trust AI agents. Over-trust leads to missed errors; under-trust leads to micromanagement. Trust calibration aligns user perception of agent reliability with actual performance, but it evolves over time per domain.",
    solution: "Build appropriate trust through demonstrated competence: start supervised, show per-domain track records, celebrate milestones, proactively repair trust after errors, and only offer autonomy upgrades when performance warrants it.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Confidence Visualization",
      "Autonomy Spectrum",
      "Escalation Pathways",
      "Action Audit Trail"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The agent acts over time and across domains, so a single static confidence score would misrepresent it. Trust needs to evolve with the track record.",
        "Mis-set trust is costly: over-trust lets errors compound unnoticed, under-trust makes users micromanage and abandon the agent.",
        "Reliability genuinely varies by domain, so a blanket 'trust the AI' is wrong and a per-domain record actually means something."
      ],
      dontWhen: [
        "The interaction is one-shot or stateless. There's no relationship to calibrate; a per-output confidence score is the right tool, not a track record.",
        "You don't actually measure outcomes. A trust score with no performance data behind it is theater, the same calibration lie as a fabricated confidence number.",
        "Reliability is uniformly high or the stakes are trivial. Elaborate trust-building UI is just friction."
      ],
      trap: "The vanity trust score: a 'trust level' that climbs with usage or time rather than with measured accuracy. It manufactures trust the agent hasn't earned, encourages the exact over-trust the pattern exists to prevent, and collapses the first time a 'highly trusted' agent makes a visible mistake. Trust must track competence, not engagement."
    },
    installPrompt: `You are implementing the Trust Calibration design pattern in this codebase.

The pattern in one line: align the user's trust with the agent's measured competence over time, and never let the trust signal outrun the evidence.

Apply the following moves wherever this codebase lets an AI agent take actions on a user's behalf over time. DO NOT apply to one-shot or stateless features (a single classification, a one-off suggestion); there a per-output confidence score fits, not a track record.

1. Default new agents to supervised.
   Every new agent, and every new domain for an existing agent, starts with high visibility and human confirmation. Autonomy is a state you unlock from measured performance, not a default. Do not ship an agent that acts unattended on day one.

2. Track performance per domain, not globally.
   Record outcomes (success, failure, user correction) keyed by domain or task type, not a single global counter. Surface a per-domain track record. If a domain has no outcome history, show "not enough history", never a number.

3. Drive the trust signal from outcomes, not engagement.
   The displayed trust level must be a pure function of measured accuracy. It must never move with time-spent, session count, or actions taken. If you cannot compute it from real outcomes, do not render a level.

4. Build a trust-repair path.
   When an error is detected or reported, log it, show the user what happened and what changed, and automatically raise oversight for that domain until performance recovers. Trust breaks faster than it builds; the UI must account for that asymmetry.

5. Gate autonomy upgrades on an explicit, visible threshold.
   Offer more autonomy only when the per-domain record crosses a stated bar (e.g. "auto-approve after 20 consecutive correct actions"). Make the criteria visible and always let the user decline or revoke.

The trap to avoid: the vanity trust score that rises with usage. If the number isn't backed by measured outcomes, show "not enough history" instead of inventing confidence.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. stateless feature, no outcome data, uniform reliability)
- New data/endpoints you added (per-domain outcome store, repair flow, autonomy thresholds) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Start supervised, earn autonomy.",
        body: "Default a new agent to high visibility and human-in-the-loop, then widen its latitude only when its track record warrants it. Granting autonomy on day one is borrowing trust the agent hasn't earned, and the bill comes due on the first unattended mistake."
      },
      {
        heading: "Show the track record, per domain.",
        body: "'Trustworthy' is not global. An agent excellent at scheduling may be unreliable at spending. Show competence per domain so users calibrate where it actually matters, instead of collapsing everything into one misleading score."
      },
      {
        heading: "Tie the trust signal to performance, not usage.",
        body: "A trust level that rises with time-spent or clicks is a vanity metric. It has to move with measured accuracy and outcomes, or it's the same lie as a fabricated confidence number, and it quietly trains users to over-trust."
      },
      {
        heading: "Repair trust proactively after a mistake.",
        body: "Trust builds slowly and breaks fast. After an error, surface what happened, what changed, and dial oversight back up yourself. Don't wait for the user to lose faith in silence and walk away, you rarely get told why they left."
      },
      {
        heading: "Treat under-trust as a failure too.",
        body: "If a user is double-checking every action the agent reliably gets right, calibration has failed on the other side: the agent is being micromanaged into uselessness. Surface the track record to earn back appropriate delegation, not only to warn."
      }
    ]
  }
};
