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
  description: "Detect vulnerable users and apply graduated age, crisis, and dependency protections.",
  thumbnail: "/images/examples/AI-Woebot-Health.png",
  introduction: "Vulnerable User Protection detects vulnerable populations like minors, users in crisis, or those developing unhealthy dependencies, then applies graduated protections. Instead of treating all users the same, the system identifies vulnerability signals and adapts safety measures accordingly. It's essential for AI accessible to children, mental health apps, or systems where emotional relationships form. Real concern: Replika enabled romantic interactions with minors. This pattern prevents such harms through proactive detection and risk-aware safeguards.",
  datePublished: "2024-11-11",
  dateModified: "2025-11-18",
  status: "implemented",
  priority: "high",
  complexity: 9,
  content: {
    skillDescription:
      "Use when minors or at-risk users may be present: age gating, dependency risks, mental-health-sensitive contexts, 'what if a teenager uses this', graduated protections. Vulnerable User Protection detects vulnerability and adjusts safeguards.",
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
