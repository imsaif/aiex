import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const universalaccesspatterns: Pattern = {
  id: "universal-access-patterns",
  title: "Universal Access Patterns",
  slug: "universal-access-patterns",
  status: 'implemented',
  description: "AI interfaces that adapt to different abilities, languages, literacy levels, and assistive technologies, ensuring equitable access through multiple interaction modalities.",
  category: "Accessibility & Inclusion",
  tags: ["accessibility", "inclusion", "multimodal", "assistive technology", "language", "diversity"],
  thumbnail: "/images/examples/copilotaccessibility.gif",
  content: {
    problem: "Many AI interfaces are designed for able-bodied, literate users with specific language backgrounds, creating barriers for users with disabilities, different language needs, or varying levels of technical expertise. This excludes large populations from benefiting from AI capabilities.",
    solution: "Design AI systems that support multiple interaction modalities (voice, text, gesture, visual), integrate seamlessly with assistive technologies, provide multilingual support, and offer adjustable complexity levels. Ensure equitable access for all users regardless of ability, language, or expertise.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Multimodal Interaction",
      "Adaptive Interfaces",
      "Conversational UI"
    ],
    codeExamples
  }
};
