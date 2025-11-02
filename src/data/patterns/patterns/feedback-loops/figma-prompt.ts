import { FigmaPrompt } from '../../../../types';

export const figmaPrompt: FigmaPrompt = {
  prompt: "Design a feedback collection interface for AI systems that captures user sentiment on responses, suggestions, or code outputs. Draw inspiration from Claude Code Feedback (rating code suggestions) and ChatGPT Response Feedback (rating conversation responses). Include: AI output/response container, prominent feedback question ('How is the AI doing?'), binary feedback buttons (👍 Helpful / 👎 Not Helpful) with selected state styling, smooth animated confirmation message ('✓ Thank you for making our app improve!') that appears and disappears, feedback counter displaying total submissions ('X feedbacks received • We're learning from your responses'), subtle visual hierarchy with gray color palette (gray-900 for selected state, gray-100 for default, gray-50 background). Style: Minimal, professional, non-intrusive. Focus on clarity and quick interaction. Smooth transitions and micro-interactions. Platform: Web/mobile responsive design.",
  figmaFileUrl: undefined,
  tips: [
    "Position feedback buttons directly below the AI output for clear context and association",
    "Use binary choice (Helpful/Not Helpful) over complex ratings for higher engagement rates",
    "Trigger confirmation animation only on first interaction to avoid repetitive animations",
    "Keep feedback message brief (2-3 seconds duration) to not distract from content",
    "Use neutral gray colors instead of red/green to maintain professional tone",
    "Show aggregate feedback count to reinforce community learning and system improvement",
    "Maintain consistent button size and spacing across web and mobile views",
    "Test tap target sizes - ensure buttons are at least 44px for mobile accessibility"
  ]
};
