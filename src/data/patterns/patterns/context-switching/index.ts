import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const contextswitching: Pattern = {
  id: "context-switching",
  title: "Context Switching",
  slug: "context-switching",
  status: 'implemented',
  description: "Smooth transitions between tasks or topics while maintaining conversation continuity.",
  category: "Natural Interaction",
  tags: ["context", "memory", "sessions", "conversation", "continuity", "multi-tasking"],
  thumbnail: "/images/examples/chatgptcontextswitch.gif",
  introduction: "Context Switching is an AI pattern that enables smooth transitions between tasks or topics without losing information. Instead of starting fresh each time, the AI maintains separate threads for different contexts. It's essential for multitasking professionals or anyone using AI across multiple projects. Examples include ChatGPT's conversation threads, Notion AI understanding your workspace, or Siri remembering your shopping list while helping with calendar events.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  hideFAQ: true,
  content: {
    problem: "Users frequently switch between different tasks, topics, or projects when working with AI systems, but lose context and have to repeat information each time they switch. This creates friction and reduces productivity.",
    solution: "Implement intelligent context management that tracks multiple conversation threads, remembers relevant information for each context, and provides seamless transitions between different topics while maintaining continuity within each context.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Selective Memory",
      "Conversational UI",
      "Adaptive Interfaces"
    ],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
      explainWhen: [
        "The same user genuinely juggles parallel, long-running threads (multiple projects, clients, or workspaces) where re-establishing context on every switch is the real cost.",
        "Continuity within a thread compounds: the system's value grows the longer it holds one context's history accurately, not just across a single sitting.",
        "Switches are frequent and the boundaries between contexts are clear enough to keep cleanly separated."
      ],
      dontWhen: [
        "Tasks are one-off and independent. A fresh conversation is clearer and cheaper than naming, saving, and managing contexts nobody ever revisits.",
        "You can't make the active context legible. Memory that silently shapes answers without the user knowing which thread they're in is a confusion engine, not a feature.",
        "You can't keep stored context fresh or private. Stale facts resurfacing as current, or cross-context data you won't secure, is liability dressed up as convenience."
      ],
      trap: "Context bleed: the model leaks one thread's facts into another. You ask about the Q3 client and it answers with the Q2 client's numbers, confidently. It's worse than no memory, because a fresh start is at least honestly blank, but bleed is confidently wrong, and the user can't tell which context an answer came from, so one leak poisons trust in every thread."
    },
    installPrompt: `You are implementing the Context Switching design pattern in this codebase.

The pattern in one line: keep separate threads truly separate, so each context carries its own history and never leaks into another.

Apply the following moves wherever this codebase maintains AI context across more than one task, topic, project, or conversation. DO NOT build saved/named/synced contexts for one-off independent tasks where a fresh conversation is clearer and cheaper.

1. Enforce isolation at the boundary, not just in the UI.
   For each place context is retrieved to build a prompt or answer, scope the retrieval to the active context's ID. If a query can pull records from another context, that's a bleed bug. Fix the scoping. Isolation is the feature; memory is the easy part.

2. Make the active context legible before every answer.
   The UI must always show which thread the user is in and, on demand, what it remembers. An answer is only trustworthy if the user knows which context produced it.

3. Name what carried over, and let the user cut it.
   When you bring context forward into a switch, label it ("Continuing from your Q3 planning") and provide a one-click way to drop or correct it. Continuity the user can't see or sever is leakage they haven't caught yet.

4. Timestamp and decay stored context.
   Every remembered fact needs an age and a freshness policy. Do not surface a stale value as current. When context is old enough to be doubtful, flag it or re-confirm rather than asserting it.

5. Default to a clean break when the switch is real.
   Detect genuinely independent tasks and offer a fresh start instead of force-fitting them into a saved thread. Don't manufacture context-management overhead for work nobody revisits.

The trap to avoid: context bleed. If an answer in Context A can be shaped by Context B's data, you haven't built context switching, you've built one confused context with tabs on top.

When you're done, output a Markdown report with three sections:
- Surfaces updated: file path + which of the five moves you applied at each
- Surfaces flagged but not updated: file path + why (e.g. one-off task, no real parallel threads, can't make context legible)
- New scoping / data fields you added (e.g. context_id on retrieval, freshness timestamps, carried-over labels with a drop control) and what still needs human sign-off

Ask before adding dependencies.`,
    takeaways: [
      {
        heading: "Isolation is the feature, not memory.",
        body: "Anyone can store history. The hard part is keeping Context A's facts out of Context B's answers. If threads bleed into each other, you haven't built context switching, you've built one big confused context with tabs on top of it."
      },
      {
        heading: "Make the active context impossible to miss.",
        body: "The user must always know which thread they're in and what it remembers before they read an answer. Invisible context is how a perfectly correct answer to the wrong question slips through and quietly erodes trust."
      },
      {
        heading: "Show what carried over, and let them cut it.",
        body: "When you bring context forward, name it ('Continuing from your Q3 planning') and give a one-click way to drop it. Continuity the user can't see or sever is just leakage they haven't caught yet."
      },
      {
        heading: "Stale context is worse than no context.",
        body: "A fact that was true last week, resurfaced as current, is a confident lie. Timestamp what you remember and let it decay, or you'll keep answering today's question with yesterday's truth."
      },
      {
        heading: "Default to a clean break when the switch is real.",
        body: "Not every topic change needs a saved, named, synced thread. When tasks are genuinely independent, a fresh start beats the overhead of managing contexts nobody comes back to."
      }
    ]
  }
};
