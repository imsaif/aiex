import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const vulnerableuserprotection: Pattern = {
  id: "vulnerable-user-protection",
  title: "Vulnerable User Protection",
  slug: "vulnerable-user-protection",
  category: "Safety & Harm Prevention",
  description: "Detect vulnerable users and apply graduated protections for age, crisis, and dependency risks",
  thumbnail: "/images/examples/AI-Woebot-Health.png",
  status: "implemented",
  priority: "high",
  complexity: 9,
  content: {
    problem: "Systems fail to protect minors, crisis users, and those with mental health challenges. Replika enabled romantic interactions with minors and created unhealthy dependency patterns.",
    solution: "Detect user vulnerability and apply graduated protections (age, crisis, mental health, dependency).",
    overview: "Different users need different protections based on vulnerability.",
    whenToUse: [
      "Any AI accessible to minors",
      "Mental health or therapeutic AI",
      "Systems where users disclose personal info",
      "Chat interfaces where relationships form"
    ],
    benefits: [
      "Protects minors from inappropriate content",
      "Prevents unhealthy AI relationships",
      "Identifies crisis situations for escalation",
      "Demonstrates duty of care"
    ],
    guidelines,
    considerations,
    examples,
    codeExamples,
    relatedPatterns: ["crisis-detection-escalation", "session-degradation-prevention", "anti-manipulation-safeguards"],
    figmaPrompt
  }
};
