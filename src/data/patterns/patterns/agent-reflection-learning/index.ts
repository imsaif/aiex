import { Pattern } from '../../../../types';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { figmaPrompt } from './figma-prompt';
import { codeExamples } from './code-examples';

export const agentReflectionLearning: Pattern = {
  id: "agent-reflection-learning",
  title: "Agent Reflection & Learning",
  slug: "agent-reflection-learning",
  status: 'implemented',
  description: "Surface when and how AI agents learn from their mistakes, showing users error retrospectives, confidence adjustments, and behavioral changes to build long-term trust in evolving systems.",
  category: "Adaptive & Intelligent Systems",
  tags: [
    "agent",
    "trust",
    "transparency",
    "learning",
    "error-handling",
    "autonomy",
    "feedback",
    "adaptive-ui"
  ],
  thumbnail: "/images/patterns/placeholder.png",
  introduction: "AI agents that silently repeat the same mistakes erode user trust faster than agents that make mistakes transparently and visibly improve. Agent Reflection & Learning is the design pattern for making the improvement loop visible — not just to engineers monitoring logs, but to the users who depend on the agent daily.\n\nThis pattern covers the interfaces and interactions that communicate retrospection: a summary after a failed workflow explaining what went wrong and what the agent now understands differently, a confidence indicator that drops after repeated errors in a domain and rises as the agent succeeds, or a 'what I learned this week' digest that gives users a mental model of how the system is evolving. Anthropic's internal 'Dreaming' feature — where agents replay and reprocess past experiences during idle time — is a concrete example of reflection infrastructure that deserves a UI counterpart.\n\nThe core insight is that trust in autonomous systems is built through demonstrated accountability, not just capability. Users who can see that an agent recognized its own failure, articulated what it misunderstood, and adjusted its approach are far more willing to delegate complex tasks than users who receive only opaque success/failure signals. This pattern is distinct from real-time error recovery (handling failures in the moment) and feedback loops (collecting human input) — it operates at the meta-level of showing that the system is genuinely learning over time.",
  datePublished: "2026-05-20",
  dateModified: "2026-05-20",
  hideFAQ: true,
  content: {
    problem: "AI agents make mistakes in production workflows, but users have no visibility into whether the system is improving from those errors or will repeat them. This creates uncertainty about reliability and makes it difficult to trust agents with increasingly complex tasks.",
    solution: "Design interfaces that surface when and how AI agents are learning from their mistakes. Show users that the agent has 'reflected' on errors, what it learned, and how it will behave differently next time. This might include error retrospectives, learning summaries, or confidence adjustments based on past failures.",
    examples: [],
    guidelines,
    considerations,
    relatedPatterns: [],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
        "explainWhen": [
            "The agent operates autonomously on high-stakes or multi-step workflows where repeated failures have real cost, and users need confidence that errors won't recur.",
            "Users are deciding whether to delegate increasingly complex tasks to the agent — visible learning history gives them evidence to make that decision.",
            "The system has genuine memory or fine-tuning infrastructure that actually updates agent behavior from errors, making learning signals truthful.",
            "You're building a long-term relationship product (daily assistant, workflow automation) where trust compounds over weeks, not a one-shot tool."
        ],
        "dontWhen": [
            "The underlying model has no mechanism to actually update from errors — showing learning UI on a stateless system is deceptive and will destroy trust when mistakes repeat.",
            "The agent handles simple, low-stakes tasks where users don't think about reliability over time and reflection signals add unnecessary cognitive load.",
            "Errors are so rare that a learning narrative feels performative — if the agent succeeds 99% of the time, retrospectives on the 1% may amplify rather than reduce anxiety.",
            "You're in early prototype stages where the error taxonomy isn't stable enough to generate meaningful retrospectives without confusing users."
        ],
        "trap": "Showing a 'learning' message after every failure as a UX band-aid, without any actual behavioral update in the system. Users will notice the same mistakes recurring and the learning signal becomes a trust-destroying lie."
    },
    installPrompt: "I want to implement the Agent Reflection & Learning design pattern in this codebase. This pattern makes AI agent learning visible to users by surfacing error retrospectives, confidence adjustments, and behavioral change summaries.\n\nPlease do the following:\n\n1. AUDIT: Find all places where agent errors or task failures are currently handled. Look for error boundaries, catch blocks, failure states, and any existing logging of agent outcomes. List what you find.\n\n2. DATA MODEL: Create or extend a data model for AgentReflection with these fields: taskId, failureDescription (plain language), rootCauseAnalysis, behavioralUpdate (what changed), confidenceDelta (numeric), domainTag, timestamp, and confirmedByUser (boolean). Store this in whatever persistence layer the project uses.\n\n3. RETROSPECTIVE GENERATOR: Add a function generateRetrospective(failedTask, errorContext) that calls the existing AI/LLM integration to produce a plain-language retrospective in this format: 'What I understood: [X]. What actually happened: [Y]. What I'll do differently: [Z].' Cap output at 3 sentences. Only call this when the agent has a memory or update mechanism — add a guard that checks for this.\n\n4. UI COMPONENT: Create a ReflectionCard component that displays: the plain-language retrospective, a confidence indicator for the relevant domain (shown as a simple labeled bar or badge, not a raw percentage), and a 'Does this match what you observed?' confirmation with Yes/No. Style it as a non-blocking notification, not a modal.\n\n5. SESSION BOUNDARY HOOK: Add logic to surface the most recent unconfirmed ReflectionCard at the start of the next user session, not immediately after failure. If there are multiple, show the highest-impact one and link to a history view.\n\n6. LEARNING HISTORY VIEW: Create a simple list view of past reflections filterable by domain and date. Each entry should show the task type, what changed, and whether the agent has since succeeded at similar tasks (recovered capability indicator).\n\n7. GUARD RAILS: Add a check that prevents showing any learning signal if the same failure has occurred more than once since the last reflection was generated for that error type — this prevents the 'false learning' anti-pattern.\n\nUse the existing component library and state management patterns in this codebase. Do not add new dependencies unless necessary. Prioritize truthfulness over polish — a simple accurate signal beats a polished deceptive one.",
    takeaways: [
        {
            "heading": "Only show learning signals when the system has actually updated — truthfulness is the foundation",
            "body": "A learning indicator that precedes an identical repeated mistake is worse than no indicator at all. Audit your agent's memory and update mechanisms before designing any reflection UI. If the system is stateless, build the infrastructure first or don't use this pattern."
        },
        {
            "heading": "Write retrospectives in plain language that names the specific misunderstanding, not the error code",
            "body": "Users don't trust 'an error occurred in step 3.' They trust 'I misread your deadline as the submission date rather than the review date, so I scheduled the wrong task. I've updated how I parse date references in your calendar context.' Specificity signals genuine comprehension."
        },
        {
            "heading": "Surface learning at session boundaries, not immediately after failure",
            "body": "Injecting a retrospective mid-workflow interrupts recovery and feels defensive. The right moment is the start of the next session ('Since last time, I've adjusted how I handle X') or a weekly digest — when the user is in a reflective, forward-looking mindset rather than frustrated."
        },
        {
            "heading": "Show recovered capabilities as positive milestones, not just failures",
            "body": "Track when an agent successfully completes a task type it previously failed at multiple times and surface this as a trust signal: 'I've now handled 5 invoice reconciliations without errors since the issue in March.' Progress narratives build confidence more effectively than apology narratives."
        }
    ],
  },
};
