import { Example } from '../../../../types';

export const examples: Example[] = [
  {
    title: "Cursor AI - Concurrent Human-AI Code Editing",
    description: "The developer and AI work in the same file simultaneously. The developer can type anywhere while the AI generates code in another section. Conflicts are shown as inline diffs for the developer to resolve.",
    altText: "Cursor AI showing human and AI editing the same file with inline diff conflict resolution"
  },
  {
    title: "Google Docs with Gemini - Parallel Content Creation",
    description: "The user can continue editing the document while Gemini generates content in a separate section. The user's manual edits take precedence if they conflict with AI-generated content.",
    altText: "Google Docs showing user editing while Gemini generates content in a different section simultaneously"
  },
  {
    title: "Figma AI Make Design - Interruptible Generation",
    description: "Designers can interrupt AI generation at any point, manually adjust elements, and then ask the AI to continue from the modified state. The AI adapts to human changes seamlessly.",
    altText: "Figma AI showing interrupted generation with manual adjustments and continuation from modified state"
  },
  {
    title: "ChatGPT Canvas - Inline Editing with AI Continuation",
    description: "Users can directly edit AI-generated text inline, and then ask the AI to continue working with the human's modifications as the new baseline, creating a fluid co-authoring experience.",
    altText: "ChatGPT Canvas showing inline human edits merged with AI continuation for collaborative editing"
  }
];
