import { Pattern } from '../../../../types';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { figmaPrompt } from './figma-prompt';
import { codeExamples } from './code-examples';
import { examples } from './examples';

export const workspaceNativeAgents: Pattern = {
  id: "workspace-native-agents",
  title: "Workspace-Native Agent Integration",
  slug: "workspace-native-agents",
  status: 'implemented',
  description: "Embed AI capabilities inside existing tools so users never leave their working context to get help.",
  category: "Human-AI Collaboration",
  tags: [
    "Human-AI Collaboration",
    "Workflow Integration",
    "Embedded AI",
    "Context Preservation",
    "Agent Design"
  ],
  thumbnail: "/images/patterns/placeholder.png",
  introduction: "Workspace-native integration means the agent lives where the work happens, not in a separate tab. The moment users must switch interfaces to access AI, you've added friction that compounds every single time they need it.",
  datePublished: "2026-05-20",
  dateModified: "2026-05-20",
  hideFAQ: true,
  content: {
    problem: "AI agents are being added to existing professional tools but feel like separate tools, creating context-switching overhead.",
    solution: "Embed AI capabilities directly into existing workflow contexts where users already work, rather than requiring switch to separate interfaces.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
        "explainWhen": [
            "The user's primary task is document, code, or message creation inside an established tool.",
            "Context-switching to a separate AI tool would require re-explaining work already visible on screen.",
            "The team has a stable, shared workflow the agent can attach to without retraining habits."
        ],
        "dontWhen": [
            "The AI task is exploratory research with no clear home in an existing workspace surface.",
            "The tool's interface is already overloaded and adding inline AI creates visual noise.",
            "Users are early in adoption and need a contained space to experiment without affecting live work."
        ],
        "trap": "Shallow embedding: a floating chat button bolted onto an existing tool. It looks native but forces the same context switch. Real integration means the agent reads and writes to the artifact the user is already touching."
    },
    installPrompt: "Audit your product for workspace-native agent integration gaps.\n\nApply these moves:\n\n1. List every surface where users create or edit artifacts. Mark which surfaces currently require leaving to access AI assistance.\n2. For each surface, identify the closest trigger point: selection, pause, command shortcut. Note whether the agent can read the artifact's current state without user re-input.\n3. Check where agent output currently lands. Flag any output that appears outside the artifact being edited.\n4. Review dismissal paths. Flag any agent interaction that blocks task continuation until resolved.\n\nAvoid flagging surfaces where the task is exploratory or has no stable artifact to attach to, forced embedding there creates noise, not value.\n\nOutput: a Markdown report listing surfaces updated and surfaces flagged.",
    takeaways: [
        {
            "heading": "Anchor the agent to the artifact, not the app.",
            "body": "The agent should act on the document, ticket, or message in focus. If it can't see what the user sees, it's just another chatbot with extra steps."
        },
        {
            "heading": "Make invocation zero-cost or automatic.",
            "body": "Every required click to summon the agent is a reason not to use it. Trigger on selection, on pause, or on explicit shortcut, never on navigation."
        },
        {
            "heading": "Output must land where the work lands.",
            "body": "Suggestions shown in a side panel get ignored. Output inserted inline, into the actual artifact, gets used. Place the result where the cursor already is."
        },
        {
            "heading": "Let users ignore the agent without penalty.",
            "body": "Inline AI that demands resolution before the user can continue is a blocker, not a collaborator. Dismiss must always be one key or zero clicks."
        }
    ],
  },
};
