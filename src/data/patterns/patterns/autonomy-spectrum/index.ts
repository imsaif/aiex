import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const autonomyspectrum: Pattern = {
  id: "autonomy-spectrum",
  title: "Autonomy Spectrum",
  slug: "autonomy-spectrum",
  status: 'implemented',
  description: "Provide a spectrum of autonomy levels  -  from passive suggestions to full autonomy  -  that users can adjust per task type, enabling granular control over how independently an AI agent operates.",
  category: "Human-AI Collaboration",
  tags: ["agentic", "autonomy", "control", "delegation", "trust", "agent settings"],
  thumbnail: "/api/og/patterns?slug=autonomy-spectrum",
  introduction: "The Autonomy Spectrum pattern replaces binary AI controls (on/off, assist/don't assist) with a graduated range of independence levels. Traditional AI interactions are either fully manual or fully automated, but agentic workflows demand nuance. A user might want their email agent to auto-sort messages without asking, but require explicit approval before sending any reply. This pattern provides four core levels  -  Observe & Suggest, Propose & Confirm, Act & Notify, and Full Autonomy  -  adjustable per task type. The key insight is that trust isn't global: users develop different comfort levels for different domains based on the agent's track record. By making autonomy granular and visible, this pattern prevents the all-or-nothing dynamic where a single bad experience causes users to abandon the agent entirely.",
  datePublished: "2026-02-16",
  dateModified: "2026-07-08",
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when deciding how independently the AI may act: autonomy levels, 'ask before doing vs just do it', per-task permissions, supervised vs autonomous modes. Autonomy Spectrum gives users a dial instead of an on/off switch.",
    problem: "Traditional AI controls are binary  -  the AI is either on or off. But agents operate across a wide range of independence, and users need granular control over how much freedom the agent has per task type. Without this, a single bad experience at high autonomy causes users to abandon the agent entirely.",
    solution: "Provide a spectrum of autonomy levels (Observe & Suggest, Propose & Confirm, Act & Notify, Full Autonomy) that users can adjust per task or domain. Default to lower autonomy for new users and let trust build through demonstrated reliability before offering higher levels.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Human-in-the-Loop",
      "Trust Calibration",
      "Intent Preview",
      "Mixed-Initiative Control"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The tasks genuinely span a range of stakes and reversibility, so one setting can't fit all: auto-sorting mail unattended is fine, sending a reply in your name is not. A spectrum lets each task sit where its risk belongs.",
        "Trust is earned unevenly and over time. Users get comfortable with an agent in one domain long before another, and the control has to track that per-domain record, not a single global toggle.",
        "The user can see and change the level, and each level maps to visibly different agent behavior (asks first vs. acts then tells). A control that changes what the agent does, not just a label on a screen."
      ],
      dontWhen: [
        "Every task on the surface sits at one end: all low-stakes and reversible, or all high-stakes and irreversible. A spectrum there is fake choice. Ship the one correct default instead of four levels that collapse into it.",
        "The levels don't actually change behavior. If 'Propose & Confirm' and 'Act & Notify' produce the same agent actions with different wording, you have a settings screen, not autonomy.",
        "You can't reliably step autonomy back down. If the agent can be promoted on a good streak but nothing demotes it after a bad call, don't offer the higher rungs. One-way autonomy is a trap dressed as trust."
      ],
      trap: "Autonomy creep: the level the user set and the freedom the agent actually takes quietly drift apart. Either the product defaults everyone to high autonomy because it demos well, or the agent promotes itself on a good streak and never steps back down after a mistake. The spectrum becomes decoration. It advertises graduated, revocable control while the agent operates a rung (or three) above what the user consented to, and the gap only surfaces when an irreversible action lands that the user assumed still needed their sign-off. Worse than a plain on/off switch, because at least a switch makes the user flip it themselves."
    },
    installPrompt: `You are implementing the Autonomy Spectrum design pattern in this codebase.

The pattern in one line: give the user graduated, per-task, revocable control over how independently the agent acts, and keep the agent's real behavior honest to the level they set.

Apply the following moves wherever an agent takes an action on the user's behalf. DO NOT add autonomy levels that don't change agent behavior, and DO NOT let the agent operate above the level the user set (no silent self-promotion, no defaulting everyone to high autonomy because it looks impressive).

1. Define levels that map to real behavior.
   Implement the levels as distinct code paths at each action surface (observe & suggest, propose & confirm, act & notify, full autonomy). If two levels would execute the same action with only different copy, collapse them. A level that doesn't branch behavior is a lie.

2. Scope the setting per task or domain, not globally.
   Store autonomy as a per-capability setting keyed by task type, not one account-wide flag. Default every new capability to the most cautious level.

3. Gate every action by the current level at execution time.
   Before the agent acts, read the level for that task and route accordingly: block-and-suggest, request-confirm, act-then-log, or act-silently. Never let an action run at a higher effective autonomy than the stored level.

4. Make de-escalation first-class.
   Provide a one-move way to drop a capability's level, both user-initiated and automatic on a failed or reversed action. Autonomy that only ever increases is a bug. Log every level change with what caused it.

5. Surface the active level at the point of action.
   Render the current autonomy level on the surface where the agent acts, not only in a settings page, so the user always knows whether it will ask first. Consent has to stay current, not be set once and forgotten.

The trap to avoid: autonomy creep. If the agent's real freedom can drift above the level the user set, or the level can only go up, you have built the illusion of graduated control, not the thing itself.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + the levels you implemented and how each one branches behavior
- Surfaces flagged but not updated: file path + why (e.g. single-stakes surface, levels wouldn't change behavior, no reliable de-escalation)
- New things you added (per-capability autonomy store, execution-time gating, de-escalation + level-change log, point-of-action level indicator) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Trust isn't global, so autonomy can't be either.",
        body: "Make the level per task or domain. A user who lets the agent auto-file receipts may never let it email a client. One dial for everything forces them to set it to the most dangerous task, which leaves the safe tasks manual and the whole feature feeling useless."
      },
      {
        heading: "The level has to change what the agent does, not what it's called.",
        body: "If moving from 'Propose & Confirm' to 'Act & Notify' doesn't change a single agent action, you built a labeled radio group, not autonomy. Each rung must map to a visibly different behavior: asks first, acts then tells, or acts silently."
      },
      {
        heading: "Autonomy must move down as easily as up.",
        body: "Trust is earned slowly and lost fast. If a good streak promotes the agent but a bad call doesn't demote it, you've built a ratchet, and ratchets are how autonomy creep happens. Let the user, and a failure, drop the level in one move."
      },
      {
        heading: "Default low, earn the rest.",
        body: "Start new users and new domains at the cautious end and let demonstrated reliability unlock the higher levels. Defaulting everyone to high autonomy because it demos well is the fastest way to burn trust the first time the agent is wrong."
      },
      {
        heading: "Show the current level where the action happens.",
        body: "The user should never have to guess whether the agent will ask first. Surface the active level at the point of action, not buried three screens deep in settings, so consent stays informed and current instead of set once and forgotten."
      }
    ]
  }
};
