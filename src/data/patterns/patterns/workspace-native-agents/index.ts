import { Pattern } from '../../../../types';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { figmaPrompt } from './figma-prompt';
import { codeExamples } from './code-examples';

export const workspaceNativeAgents: Pattern = {
  id: "workspace-native-agents",
  title: "Workspace-Native Agent Integration",
  slug: "workspace-native-agents",
  status: 'implemented',
  description: "Embed AI agent capabilities directly into the native workspace interface where users already work, making agents feel like natural extensions of existing workflows rather than separate destinations.",
  category: "Natural Interaction",
  tags: [
    "agent-integration",
    "workspace",
    "embedded-ai",
    "developer-tools",
    "design-tools",
    "adoption",
    "in-context",
    "natural-interaction"
  ],
  thumbnail: "/images/patterns/placeholder.png",
  introduction: "When AI agents live outside the tools people already use, adoption dies at the door. Users don't want to copy-paste between their IDE and a chat window, or leave Figma to describe a design problem to an external assistant. Workspace-native integration means the agent's controls, outputs, and feedback appear exactly where the work is happening—inline in the editor, as a panel in the design tool, or as a command in the application's own command palette.\n\nThe pattern is about architectural placement, not just visual proximity. Figma's image generation lives inside the canvas workflow. GitHub Copilot appears as inline suggestions in the editor buffer. SketchUp's Claude integration responds to spatial context from the 3D viewport. In each case, the agent has access to the workspace's data model and can write back to it directly—no copy-paste, no context-switch, no separate destination.\n\nThe payoff is compounding: when agents are native, users discover them through existing habits rather than needing to form new ones. The learning curve collapses because the interaction vocabulary is already familiar. And because the agent can read and write the workspace's actual state, its outputs are immediately actionable rather than advisory.",
  datePublished: "2026-05-20",
  dateModified: "2026-05-20",
  hideFAQ: true,
  content: {
    problem: "AI agents are often bolted onto existing tools as separate chat interfaces or external services, forcing users to context-switch between their primary workspace and the AI assistant. This breaks flow and creates friction in adoption.",
    solution: "Embed AI agent capabilities directly into the native workspace interface where users already work—whether that's design tools, IDEs, or business applications. Agents should feel like natural extensions of existing workflows rather than separate destinations, with controls and outputs appearing in-context.",
    examples: [],
    guidelines,
    considerations,
    relatedPatterns: [],
    codeExamples,
    figmaPrompt,
    judgmentCall: {
        "explainWhen": [
            "Users spend the majority of their working time in a single tool (IDE, design app, spreadsheet) and the AI task is directly related to work happening there.",
            "The agent needs to read from or write to the workspace's data model to be useful—advisory-only agents that can't act on the workspace gain little from native embedding.",
            "Adoption is blocked by context-switching friction, not by lack of awareness of the AI capability.",
            "The host application has a mature, stable plugin or extension API that supports the required level of integration."
        ],
        "dontWhen": [
            "The AI task spans multiple tools or requires a broad research/conversation phase that doesn't map to any single workspace.",
            "The host application's extension API is too limited to give the agent meaningful workspace context or write-back capability.",
            "Users are already comfortable with a separate AI tool and the integration would add UI clutter without reducing friction.",
            "The agent's outputs are long-form documents or reports that are better consumed outside the workspace than inline."
        ],
        "trap": "Building a chat panel docked to the side of the workspace and calling it 'native integration.' A side panel that doesn't read workspace state or write back to it is just a reframed context-switch—users still have to manually bridge the gap between the AI's output and their actual work."
    },
    installPrompt: "I want to implement a workspace-native AI agent integration in this codebase. Please analyze the existing application structure and implement the following:\n\n1. AUDIT EXISTING ENTRY POINTS\n   - Find the application's command palette, context menus, toolbar, and keyboard shortcut registry\n   - Identify where new commands can be registered without adding new navigation destinations\n   - Note the application's undo/redo or history management system\n\n2. CREATE AN AGENT CONTEXT PROVIDER\n   - Build a WorkspaceAgentContext that captures: current selection/cursor position, active file or document, visible viewport content, and user's recent actions\n   - Implement a getWorkspaceContext() function that returns the tightest relevant scope first (selection > open file > project)\n   - Add a writeBackToWorkspace(agentOutput, targetLocation) function that applies agent results directly to the workspace data model\n\n3. REGISTER NATIVE ENTRY POINTS\n   - Add an 'Ask AI' command to the existing command palette with keyboard shortcut (Cmd+Shift+K or equivalent)\n   - Add context-sensitive agent actions to right-click/context menus based on what's selected (e.g., 'Explain this', 'Refactor this', 'Generate from this')\n   - If there's a toolbar, add a single agent icon that opens an inline popover (not a new page or modal)\n\n4. BUILD THE INLINE INTERACTION COMPONENT\n   - Create an InlineAgentPopover component that appears anchored to the current selection or cursor position\n   - The popover should show: a text input for the user's request, the detected workspace context (with a 'expand context' toggle), and streaming response output\n   - Response output should include an 'Apply' button that calls writeBackToWorkspace() and an 'Insert at cursor' option\n   - Match the host application's existing component library for all UI elements\n\n5. INTEGRATE WITH UNDO/REDO\n   - Wrap all writeBackToWorkspace() calls in the application's existing history/transaction API\n   - Ensure agent edits appear in the undo stack as a single named action (e.g., 'AI: Refactor function')\n   - If no history API exists, implement a simple action stack with Cmd+Z support\n\n6. ADD PROVENANCE MARKERS\n   - Tag all AI-generated content with a lightweight metadata marker (comment, attribute, or annotation depending on the content type)\n   - Add a workspace-level toggle to show/hide AI provenance highlights\n\nUse the existing tech stack and component patterns. Do not introduce a new routing destination or full-page AI view. All agent interactions should be completable without leaving the current workspace context.",
    takeaways: [
        {
            "heading": "Write back to the workspace data model, not just to a text output",
            "body": "The defining difference between a native agent and a docked chat window is whether the agent can directly modify the workspace state. If users have to copy the agent's output and paste it into their work, you haven't solved the context-switch problem—you've just moved it one step later. Prioritize write-back capability above all other integration features."
        },
        {
            "heading": "Hook into existing entry points before adding new UI",
            "body": "Command palettes, right-click menus, and keyboard shortcuts are already part of the user's muscle memory. Registering agent actions in these existing affordances means users discover the capability through habits they already have, not through onboarding flows they'll skip. Add new UI only when no existing affordance fits."
        },
        {
            "heading": "Respect undo/redo as a non-negotiable contract",
            "body": "Users trust a tool when they know they can reverse any action. If agent edits bypass the workspace's undo stack, users will treat the agent as dangerous and avoid it for anything consequential. Integrate with the host app's history API from day one—retrofitting this later is significantly harder."
        },
        {
            "heading": "Scope context to the selection before the whole project",
            "body": "Agents that always send the entire project as context are slow and often less accurate than agents that start with what's selected or visible. Default to the tightest relevant scope—current selection, open file, active component—and expand only when the user explicitly asks for broader context. This also keeps latency low, which is critical for in-flow interactions."
        }
    ],
  },
};
