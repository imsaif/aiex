import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const antimanipulationsafeguards: Pattern = {
  id: "anti-manipulation-safeguards",
  title: "Anti-Manipulation Safeguards",
  slug: "anti-manipulation-safeguards",
  category: "Safety & Harm Prevention",
  description: "Detect actual harmful intent beyond surface framing regardless of how it's disguised",
  thumbnail: "/images/examples/chatgpt_harmfulchat.gif",
  status: "implemented",
  priority: "high",
  complexity: 9,
  content: {
    problem: "Users bypass safety with 'fiction research,' 'roleplay,' 'hypothetical' framing. Real case: Adam Raine (16) bypassed ChatGPT safety using fiction excuse and received harmful information.",
    solution: "Detect actual intent beyond framing. Identify bypass patterns and treat all harmful requests consistently.",
    overview: "Real safety requires understanding actual intent, not just stated framing.",
    whenToUse: [
      "Any AI system (users will try to bypass)",
      "Systems with clear safety boundaries",
      "Content generation systems",
      "Multi-turn dialogue"
    ],
    benefits: [
      "Prevents sophisticated bypass attempts",
      "Catches gradual escalation patterns",
      "Consistent safety regardless of framing",
      "Reduces liability from harmful content"
    ],
    usedBy: [
      "Claude",
      "Bing Chat",
      "OpenAI (GPT-4 with guardrails)",
      "Google Bard",
      "Any AI system with safety boundaries"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["crisis-detection-escalation", "vulnerable-user-protection", "session-degradation-prevention"],
    figmaPrompt
  }
};
