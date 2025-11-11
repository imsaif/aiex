import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const sessiondegradationprevention: Pattern = {
  id: "session-degradation-prevention",
  title: "Session Degradation Prevention",
  slug: "session-degradation-prevention",
  category: "Safety & Harm Prevention",
  description: "Strengthen safety checks over time in sensitive conversations with automatic session limits",
  thumbnail: "/images/examples/privacy-control.gif",
  status: "implemented",
  priority: "high",
  complexity: 8,
  content: {
    problem: "AI safety weakens during extended conversations - the system becomes more agreeable and less cautious. ChatGPT maintained harmful conversations for 4+ hours with degrading boundaries.",
    solution: "Strengthen safety checks over time with circuit breaker patterns, session limits, and mandatory breaks.",
    overview: "Safety should strengthen during long conversations and sensitive topics, not weaken.",
    whenToUse: [
      "Conversational AI with extended sessions",
      "Mental health or therapeutic chat",
      "Multi-turn dialogue over 30+ messages"
    ],
    benefits: [
      "Prevents boundary erosion in long conversations",
      "Reduces liability from extended harmful engagement",
      "Maintains consistent safety standards"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["crisis-detection-escalation", "vulnerable-user-protection", "anti-manipulation-safeguards"],
    figmaPrompt
  }
};
