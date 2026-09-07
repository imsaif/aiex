import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const sessiondegradationprevention: Pattern = {
  id: "session-degradation-prevention",
  title: "Session Degradation Prevention",
  slug: "session-degradation-prevention",
  category: "Safety & Harm Prevention",
  description: "Strengthen safety checks during extended conversations with session limits.",
  thumbnail: "/images/examples/wysasessions.webp",
  introduction: "Session Degradation Prevention strengthens safety checks during extended conversations instead of letting boundaries erode. Instead of becoming more agreeable in long sessions, the system uses circuit breakers, session limits, and mandatory breaks. It's essential for conversational AI, mental health chatbots, or multi-turn dialogue systems. Real concern: ChatGPT maintained harmful conversations for 4+ hours. This pattern prevents such risks through progressive safety reinforcement and automatic session termination.",
  datePublished: "2024-11-11",
  dateModified: "2026-09-07",
  status: "implemented",
  priority: "high",
  complexity: 8,
  hideFAQ: true,
  content: {
    skillDescription:
      "Use when long conversations erode safety or quality: multi-hour chats, 'the AI gets too agreeable over time', boundary drift, session limits and refreshed checks. Session Degradation Prevention keeps late-session behavior as safe as the first message.",
    problem: "AI safety weakens during extended conversations - the system becomes more agreeable and less cautious. ChatGPT maintained harmful conversations for 4+ hours with degrading boundaries.",
    solution: "Strengthen safety checks over time with circuit breaker patterns, session limits, and mandatory breaks.",
    overview: "Safety should strengthen during long conversations and sensitive topics, not weaken.",
    whenToUse: [
      "Conversational AI with extended sessions",
      "Mental health or therapeutic chat",
      "Multi-turn dialogue over 30+ messages"
    ],
    benefits: [
      "Prevents boundary erosion in long conversations",
      "Reduces liability from extended harmful engagement",
      "Maintains consistent safety standards"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["crisis-detection-escalation", "vulnerable-user-protection", "anti-manipulation-safeguards"],
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "Sessions run long by design and the subject matter is sensitive: mental health, self-harm, medical, legal, financial distress.",
        "The conversation accumulates context that can be used to reframe a refused request as a continuation of an accepted one.",
        "Emotional attachment to the assistant is a plausible outcome, so the user's own judgment about when to stop is compromised."
      ],
      dontWhen: [
        "The session is transactional and short. Adding limits to a support chat about a delayed order is friction with no safety benefit.",
        "The real problem is one bad response, not accumulated drift. Fix the response.",
        "You cannot yet measure late-session behaviour. A limit imposed without measurement is a guess that mostly interrupts safe conversations."
      ],
      trap: "The rapport discount: treating a long, friendly history as evidence the user is safe, so scrutiny relaxes exactly as the conversation reaches the point where it matters most. The system mistakes familiarity for verification, and the hundredth message is checked less carefully than the first."
    },
    installPrompt: `You are implementing the Session Degradation Prevention design pattern in this codebase.

The pattern in one line: the last message in a long conversation must be checked at least as carefully as the first.

This is a safety pattern. Apply it only to conversational surfaces that run long and touch sensitive subject matter (mental health, self-harm, medical, legal, financial distress) or where emotional attachment to the assistant is plausible. DO NOT apply to short transactional chat. Session limits there are friction with no safety benefit.

1. Measure the drift before you prevent it.
   Instrument refusal rate, safety-classifier score, and sentiment against message index within a session. Output the distribution for existing traffic. Do not add limits until you can see whether late-session behaviour actually differs from early-session behaviour. If it does not, stop and report that.

2. Make safety checks a function of session state, not just the current message.
   Safety evaluation must receive message index, elapsed session time, and cumulative sensitive-topic count. Thresholds tighten as those rise. Never let accumulated conversational history lower a classifier threshold. Log every threshold change with the session state that caused it.

3. Re-anchor, do not only cut off.
   Before any hard limit, insert a re-grounding turn: restate what the assistant is and is not, and re-run the full safety check on the conversation as a whole rather than the last message alone. A hard cutoff with no re-anchor pushes the user to restart in a fresh session, which resets every counter you built.

4. Make the break honest and survivable.
   If a session must end, state why in plain language, preserve the user's context so nothing is lost, and surface a human or crisis route where relevant. Never end a sensitive session with a generic timeout message.

The trap to avoid: the rapport discount. Long friendly history being read as evidence of safety, so scrutiny relaxes precisely when it matters most.

When you're done, output a Markdown report with three sections:
- Drift measured: the distribution you found, per surface
- Checks made session-aware: file path + which state fields now feed the threshold
- Re-anchor and break behaviour added, plus anything that needs human or clinical sign-off

Ask before adding dependencies. Flag anything that needs review by someone with clinical or safety expertise rather than deciding it yourself.`,
    takeaways: [
      {
        heading: "Measure the drift before you build the limit.",
        body: "Plot refusal rate and classifier scores against message number in real sessions. If late messages are not treated differently from early ones, you do not have this problem and a session cap will only interrupt safe conversations."
      },
      {
        heading: "Never let history soften the check.",
        body: "Accumulated rapport is not evidence. A request that would be refused at message three is refused at message three hundred. If your thresholds move at all with session length, they move in one direction only: tighter."
      },
      {
        heading: "Re-anchor before you cut off.",
        body: "A hard stop with no warning teaches users to open a fresh session, which resets every counter you built. A re-grounding turn that restates what the assistant is, and re-checks the whole conversation rather than the last message, keeps the person in a session you can still see."
      },
      {
        heading: "A break has to be honest about why.",
        body: "Generic timeout copy in a sensitive conversation reads as rejection at the worst possible moment. Say what happened, keep their context so nothing is lost, and offer a human route where one exists."
      },
      {
        heading: "Design for the person who will not stop on their own.",
        body: "This pattern exists for sessions where the user's own judgment about when to stop is the thing that has been compromised. Defaults set for a healthy user at message ten are the wrong defaults at hour four, and hour four is the case that put this pattern on the list."
      }
    ]
  }
};
