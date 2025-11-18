import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';
import { figmaPrompt } from './figma-prompt';

export const responsibleaidesign: Pattern = {
  id: "responsible-ai-design",
  title: "Responsible AI Design",
  slug: "responsible-ai-design",
  description: "Prioritize fairness, transparency, and accountability throughout AI lifecycle.",
  category: "Trustworthy & Reliable AI",
  thumbnail: "/images/examples/openai-human-feedback.png",
  introduction: "Responsible AI Design prioritizes fairness, transparency, accountability, and user welfare throughout the AI lifecycle. Instead of treating ethics as afterthought, this approach embeds responsible practices from design through deployment. It's essential for systems affecting people's lives in hiring, lending, healthcare, or content moderation. Examples include OpenAI's RLHF reducing harmful outputs, Google's Model Cards documenting biases, or LinkedIn's recruitment bias detection.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "AI systems can perpetuate biases, make unfair decisions, or cause harm without ethical design.",
    solution: "Prioritize fairness, transparency, accountability, and user welfare throughout the AI system lifecycle.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt
  }
};
