import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const crisisdetectionescalation: Pattern = {
  id: "crisis-detection-escalation",
  title: "Crisis Detection & Escalation",
  slug: "crisis-detection-escalation",
  category: "Safety & Harm Prevention",
  description: "Detect crisis signals and immediately provide professional resources.",
  thumbnail: "/images/examples/chatgpt_harmfulchat.gif",
  introduction: "Crisis Detection & Escalation identifies when users express harmful intent or are in crisis, then immediately provides professional resources. Instead of conversational responses to dangerous situations, the AI uses multi-layer detection to catch crisis signals. It's essential for conversational AI, mental health apps, or systems accessible to vulnerable users. After incidents where AI provided harmful encouragement, systems now detect suicidal intent through keywords, context, and behavior, escalating to crisis resources.",
  datePublished: "2024-11-11",
  dateModified: "2025-11-18",
  status: "implemented",
  priority: "high",
  complexity: 9,
  hideFAQ: true,
  content: {
    problem: "AI systems fail to respond appropriately to crisis signals, sometimes providing harmful encouragement instead of resources. Real case: Zane Shamblin chatted with ChatGPT for hours expressing suicidal intent; the bot responded encouragingly instead of escalating.",
    solution: "Use multi-layer detection (keywords, context, behavior, manipulation) to catch crisis signals at multiple levels and immediately provide resources.",
    overview: "Crisis detection is critical safety infrastructure addressing foreseeable harm documented in recent OpenAI lawsuits.",
    whenToUse: [
      "Any conversational AI system",
      "Mental health or wellness applications",
      "Systems accessible to vulnerable populations"
    ],
    benefits: [
      "Prevents foreseeable harm",
      "Provides immediate professional resources",
      "Demonstrates duty of care"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["session-degradation-prevention", "anti-manipulation-safeguards", "vulnerable-user-protection"],
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "Your product can be reached by someone in crisis: a chatbot, a companion app, a mental-health or wellness tool, anything open to minors or vulnerable users. If a person can type 'I want to die' into it, you own a duty of care.",
        "You have a real destination on the other side of detection: a vetted, current hotline, a routed human, or warm contact information, not just a number printed on a banner.",
        "The cost of a missed signal is irreversible. When the worst case is a death rather than a bad recommendation, conservative detection and a hard stop on the conversation are the correct defaults."
      ],
      dontWhen: [
        "You cannot stand behind the resource you would surface. A stale or wrong hotline number is not a neutral placeholder; sending a person in crisis to a dead line or a closed service can do active harm. Build the destination before you build the trigger.",
        "You would tune detection so wide that ordinary distress, grief, or a clinician discussing a patient gets flagged. Over-triggering teaches people that honesty gets them shut down, so they learn to hide the exact signals you most need to see.",
        "You are reaching for detection to limit liability rather than to help. A flag that fires to protect the company, then drops the person, is the failure mode this pattern exists to prevent."
      ],
      trap: "The smoke alarm wired to nothing. Detection fires, a canned 'If you are in crisis, call 988' banner appears, the conversation ends, and nothing else happens: no warm handoff, no check that the line is live, no human, no follow-up. The system has performed concern without providing help, and it has done so at the precise moment a person reached out. Worse than silence, because it looks like a response and lets the team mark the duty of care as discharged. The mirror failure is just as dangerous: an over-eager alarm that shrieks at every mention of sadness until users learn to whisper, and the one real signal arrives disguised so it never trips at all."
    },
    installPrompt: `You are implementing the Crisis Detection & Escalation design pattern in this codebase.

The pattern in one line: detect when a user is in crisis and connect them to real help, not a banner that ends the conversation.

Apply the following moves wherever this codebase accepts free-text from a user who could be in crisis (chat, support, companion, journaling, any input a person in distress can reach). DO NOT add detection to a surface until its escalation destination is real and verified; a trigger wired to a dead resource is worse than no trigger. DO NOT tune detection so wide that ordinary sadness or a clinician discussing a case gets flagged.

1. Build the destination before the trigger.
   Stand up a single source of truth for crisis resources (region-aware where you serve multiple regions), with a freshness check or last-verified date on every entry. If a surface has no verified destination, flag it and do not enable detection there yet.

2. Detect in layers, not on keywords alone.
   Combine direct phrases, contextual patterns across recent history, behavioral signals, and bypass framing ("for a story", "hypothetically"). Any single layer triggering escalates. Bias toward recall: a missed crisis is irreversible, a false positive is recoverable.

3. Make the escalation a hard stop with a path, not a banner.
   On detection, interrupt the normal flow, surface the verified resources prominently and non-dismissibly inside the conversation, and route to a human or warm handoff where one exists. Never present a hotline and silently resume the conversation as if nothing happened.

4. Close the loop and watch the seams.
   Log every escalation (severity, layers fired, timestamp) for review, never the raw content beyond what safety review requires. Track false-positive and missed-signal rates so over-triggering and under-triggering both surface. Never explain the detection method to the user, since that teaches evasion.

The trap to avoid: the smoke alarm wired to nothing. If detection fires and nothing real happens on the other side, you have performed concern without providing help. Verify the destination is live before you ship the trigger.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the four moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. no verified destination yet, not user-facing, out of scope for this region)
- New resources/endpoints you added (resource source of truth, escalation routing, escalation logging) and what still needs human sign-off, especially clinical review of detection thresholds

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Build the destination before the trigger.",
        body: "Detection is the easy half. The hard, load-bearing half is a resource that is current, reachable, and right for the person's region. A trigger that surfaces a dead hotline does active harm at the worst possible moment. If you cannot stand behind the destination, do not ship the detection."
      },
      {
        heading: "Detect in layers, and bias toward recall.",
        body: "Keywords alone miss the person who says 'nobody would miss me' and the one who hides behind 'asking for a story.' Combine direct phrases, context across the session, behavior, and bypass framing. A false positive costs an awkward moment. A missed signal can cost a life, so the defaults are not symmetric."
      },
      {
        heading: "Escalation is a hard stop with a path, not a banner.",
        body: "Printing '988' and then continuing the chat is the smoke alarm wired to nothing: it looks like a response and provides no help. Interrupt the flow, hold the resources in front of the user, and route to a human where one exists. Performing concern is not the same as providing it."
      },
      {
        heading: "Over-triggering is its own failure.",
        body: "An alarm that fires at every mention of sadness teaches people that honesty gets them shut down, so they learn to hide the signals you most need to see. Watch your false-positive rate as closely as your miss rate. A system everyone routes around protects no one."
      },
      {
        heading: "Treat detection thresholds as clinical decisions, and log the seams.",
        body: "Where to draw the line between distress and crisis is not a product call to make alone; review thresholds with people trained in this. Log every escalation for safety review, never raw content beyond what that review needs, and never explain the detection method to users, since that just teaches evasion."
      }
    ]
  }
};
