import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design an AI assistance interface with contextual suggestions, similar to Gmail Smart Compose or GitHub Copilot. Show subtle, inline suggestion chips that appear as the user types, positioned near the cursor or input area. Include: a text input area or editor, ghost text preview for AI suggestions (low opacity), inline suggestion chips with accept/dismiss actions, and keyboard shortcut hints (Tab to accept, Esc to dismiss). Style: Clean, modern, minimal interruption to user flow. Use subtle shadows, smooth transitions, and non-intrusive colors. Platform: Web application, responsive layout.",
  figmaFileUrl: undefined, // Will be added in future when component library is ready
  tips: [
    "Adapt the layout to your use case: inline chips for writing tools, sidebar for complex workflows",
    "Match colors and typography to your existing design system",
    "Use subtle fade-in animations (200-300ms) to avoid startling users",
    "Show keyboard shortcuts on hover or in a small tooltip",
    "Ensure mobile compatibility: suggestions should be thumb-friendly and not cover content",
    "Add confidence indicators (%, color-coded) when AI accuracy is important"
  ]
};
