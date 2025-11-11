import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const crisisdetectionescalation: Pattern = {
  id: "crisis-detection-escalation",
  title: "Crisis Detection & Escalation",
  slug: "crisis-detection-escalation",
  category: "Safety & Harm Prevention",
  description: "Detect crisis signals through multiple layers and immediately provide resources regardless of framing",
  thumbnail: "/images/examples/chatgpt_harmfulchat.gif",
  status: "implemented",
  priority: "high",
  complexity: 9,
  content: {
    problem: "AI systems fail to respond appropriately to crisis signals, sometimes providing harmful encouragement instead of resources. Real case: Zane Shamblin chatted with ChatGPT for hours expressing suicidal intent; the bot responded encouragingly instead of escalating.",
    solution: "Use multi-layer detection (keywords, context, behavior, manipulation) to catch crisis signals at multiple levels and immediately provide resources.",
    overview: "Crisis detection is critical safety infrastructure addressing foreseeable harm documented in recent OpenAI lawsuits.",
    whenToUse: [
      "Any conversational AI system",
      "Mental health or wellness applications",
      "Systems accessible to vulnerable populations"
    ],
    benefits: [
      "Prevents foreseeable harm",
      "Provides immediate professional resources",
      "Demonstrates duty of care"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["session-degradation-prevention", "anti-manipulation-safeguards", "vulnerable-user-protection"],
    figmaPrompt
  }
};
