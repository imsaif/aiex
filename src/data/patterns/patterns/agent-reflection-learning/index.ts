import { Pattern } from '../../../../types';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { figmaPrompt } from './figma-prompt';
import { codeExamples } from './code-examples';
import { examples } from './examples';

export const agentReflectionLearning: Pattern = {
  id: "agent-reflection-learning",
  title: "Agent Reflection & Learning",
  slug: "agent-reflection-learning",
  status: 'implemented',
  description: "Show users what the agent has learned from corrections so trust builds through visible, cumulative improvement.",
  category: "Trustworthy & Reliable AI",
  tags: [
    "agent",
    "trust",
    "transparency",
    "learning",
    "correction",
    "autonomy",
    "feedback"
  ],
  thumbnail: "/images/patterns/placeholder.png",
  introduction: "Agent Reflection surfaces the agent's learning history: corrections absorbed, mistakes acknowledged, behavior changed. Without it, users repeat corrections indefinitely and assume the agent is broken, not improving.",
  datePublished: "2026-05-20",
  dateModified: "2026-05-20",
  hideFAQ: true,
  content: {
    problem: "As AI agents gain autonomy, users struggle to understand what the agent has learned from past interactions and corrections, making it hard to trust the agent over time.",
    solution: "Surface what the agent has learned from corrections and past sessions through visible learning indicators, correction acknowledgements, and improvement summaries that build trust incrementally.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
        "explainWhen": [
            "The agent operates autonomously across sessions and users cannot observe its behavior directly.",
            "Users have corrected the same behavior more than once and cannot tell if it stuck.",
            "The agent makes consequential decisions where knowing its learning history affects user trust."
        ],
        "dontWhen": [
            "The agent is stateless and genuinely learns nothing between sessions: surfacing nothing is honest.",
            "The interaction is a single-turn task with no continuity where learning history is irrelevant.",
            "Showing learning history would expose sensitive inferences users never intended to share."
        ],
        "trap": "Fake learning: a confirmation message that says 'I'll remember that' when the model has no persistent memory. Users discover the lie on the next session and trust collapses permanently."
    },
    installPrompt: "Audit your agent surfaces for visible learning signals.\n\nApply these moves:\n1. Find every correction flow and check whether the confirmation names the specific behavior change or just acknowledges input.\n2. Identify all session boundaries and flag where a learning summary could surface what changed.\n3. Review stored learning states: mark which are permanent behavior changes versus session-only adjustments, and verify the UI communicates the difference.\n4. Check every learning claim against actual model persistence: if the model is stateless, remove or rewrite any language implying memory.\n\nAvoid surfacing learning indicators that are cosmetic: if the agent cannot demonstrate the change in the next interaction, the indicator is a liability.\n\nOutput: a Markdown report listing surfaces updated and surfaces flagged.",
    takeaways: [
        {
            "heading": "Confirm the correction, not just the intent.",
            "body": "Generic acknowledgements mean nothing. Name what changed: 'I'll stop suggesting X' beats 'Got it!' every time. Specificity is the only proof of learning."
        },
        {
            "heading": "Separate one-time fixes from permanent rules.",
            "body": "Users need to know what sticks. If a correction only applies now, say so. If it changes future behavior, say that too. Ambiguity breeds repeated corrections."
        },
        {
            "heading": "Make the learning history editable.",
            "body": "Users who can delete a bad correction trust the system more than users who cannot. Control is the fastest path to confidence in an autonomous agent."
        },
        {
            "heading": "Never surface learning you cannot actually act on.",
            "body": "If the model is stateless, say nothing. A false memory claim destroys more trust than silence. Only show learning that is real, persistent, and verifiable."
        }
    ],
  },
};
