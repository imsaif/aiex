import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Figma AI Make Design - Interruptible Generation",
    description: "Designers can interrupt the AI mid-generation, manually adjust elements on the canvas, then ask the AI to continue from the modified state. The AI doesn't lock the canvas while working — designers tweak spacing, swap components, or rewrite copy in parallel, and the AI picks up from whatever state the designer left.",
    image: "/images/examples/figma-ai-design.gif",
    altText: "Figma AI generating a layout while a designer edits adjacent elements; the AI continues from the designer-modified state without a formal handoff"
  },
  {
    title: "Notion AI - Parallel Workspace Editing",
    description: "User and Notion AI operate in the same document simultaneously. The user can keep typing while Notion AI generates content into a different section. Manual edits take precedence — if both touch the same paragraph, the user's input wins and the AI rebases its suggestion against the new text.",
    image: "/images/examples/notion-collaborative-ai.gif",
    altText: "Notion document showing a user editing one section while Notion AI fills another section in parallel, with no blocking modal"
  },
  {
    title: "Claude Artifacts - Inline Editing with AI Continuation",
    description: "Claude generates a draft inside an Artifact panel; the user edits the draft inline while Claude is still composing. When Claude resumes, it treats the user's edits as the new baseline rather than overwriting them — co-authoring rather than turn-taking.",
    image: "/images/examples/claudepropose.gif",
    altText: "Claude Artifacts panel showing an in-progress draft with user edits applied directly in the panel and Claude continuing from the modified state"
  }
];
