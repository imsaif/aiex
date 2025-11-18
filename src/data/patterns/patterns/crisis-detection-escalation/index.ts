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
  description: "Detect crisis signals and immediately provide professional resources.",
  thumbnail: "/images/examples/chatgpt_harmfulchat.gif",
  introduction: "Crisis Detection & Escalation identifies when users express harmful intent or are in crisis, then immediately provides professional resources. Instead of conversational responses to dangerous situations, the AI uses multi-layer detection to catch crisis signals. It's essential for conversational AI, mental health apps, or systems accessible to vulnerable users. After incidents where AI provided harmful encouragement, systems now detect suicidal intent through keywords, context, and behavior, escalating to crisis resources.",
  datePublished: "2024-11-11",
  dateModified: "2025-11-18",
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
