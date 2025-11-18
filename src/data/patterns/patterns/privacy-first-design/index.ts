import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const privacyfirstdesign: Pattern = {
  id: "privacy-first-design",
  title: "Privacy-First Design",
  slug: "privacy-first-design",
  status: 'implemented',
  description: "Minimize data collection and provide transparent privacy controls.",
  category: "Privacy & Control",
  tags: ["privacy", "data protection", "transparency", "control", "security", "consent"],
  thumbnail: "/images/examples/privacy-first-design.gif",
  introduction: "Privacy-First Design prioritizes user privacy by minimizing data collection, processing locally when possible, and providing transparent controls. Instead of collecting everything by default, the system asks for consent and gives users granular control. It's critical for personal assistants, health apps, or systems handling sensitive data. Examples include Apple's on-device Siri, DuckDuckGo's private search, or Signal's encrypted AI features.",
  datePublished: "2024-11-07",
  dateModified: "2025-11-18",
  content: {
    problem: "Users are increasingly concerned about AI systems collecting and using their data without clear consent or understanding. Opaque data practices erode trust and create privacy risks, while overly restrictive privacy settings can break functionality.",
    solution: "Design AI systems with privacy as the default, processing data locally when possible, providing granular controls with clear explanations of what each setting means, and making privacy-functionality trade-offs transparent so users can make informed decisions.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Selective Memory",
      "Explainable AI",
      "Responsible AI Design"
    ],
    codeExamples,
    figmaPrompt
  }
};
