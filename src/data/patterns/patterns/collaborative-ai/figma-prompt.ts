import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a collaborative interface similar to GitHub Copilot or Figma AI, showing human-AI co-creation. Show split workspace with human and AI contributions. Include: main work area (document/canvas/code editor), AI suggestion panel positioned alongside (not overlaying), accept/reject/modify buttons for each suggestion, real-time collaboration indicators showing who (human/AI) is working, version history timeline with color-coded human vs AI edits, and attribution tags on AI-generated content. Style: Balanced, equal visual weight for human and AI. Use distinct but harmonious colors for human (blue) vs AI (purple) contributions. Platform: Web application, supports real-time updates.",
  figmaFileUrl: undefined,
  tips: [
    "Give AI suggestions equal visual prominence to avoid subordination",
    "Use color-coding consistently: one color for human, another for AI",
    "Add keyboard shortcuts for quick accept/reject (Tab/Esc pattern)",
    "Show confidence scores on AI suggestions when relevant",
    "For mobile: consider a swipe gesture to accept/reject suggestions",
    "Include undo/redo that works across both human and AI actions"
  ]
};
