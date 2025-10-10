import { Pattern } from '../../../../types';
import { examples } from './examples';
import { guidelines } from './guidelines';
import { considerations } from './considerations';
import { codeExamples } from './code-examples';

export const augmentedcreation: Pattern = {
  id: "augmented-creation",
  title: "Augmented Creation",
  slug: "augmented-creation",
  description: "Empower users to create content with AI as a collaborative partner.",
  category: "Human-AI Collaboration",
  thumbnail: "/images/examples/github-copilot-highlighting.gif",
  content: {
    problem: "Content creation is time-consuming, especially with creative blocks or need for high-quality output.",
    solution: "Provide AI tools that collaborate with users, offering suggestions and improvements while maintaining human control and authorship.",
    examples,
    guidelines,
    considerations,
    relatedPatterns: [
      "Contextual Assistance",
      "Progressive Disclosure",
      "Human-in-the-Loop"
    ],
    codeExamples,
    figmaPrompt: {
      prompt: `Design an AI-powered creation interface where AI assists without taking over:

Create a content editor showing:
1. **Creation Canvas**: Main workspace for user content (text, design, code)
2. **AI Suggestions Panel**: Side panel with AI-generated alternatives or improvements
3. **Accept/Modify Controls**: Easy buttons to accept, edit, or dismiss AI suggestions
4. **Collaboration Indicator**: Visual distinction between human-created and AI-suggested content
5. **Inspiration Mode**: Toggle for AI to generate multiple creative options

Show the workflow: User creates → AI suggests improvements → User chooses → Final output. Include clear attribution showing what's AI-assisted vs. human-created.`,
      tips: [
        "Keep AI suggestions non-intrusive (side panel)",
        "Provide multiple suggestion options",
        "Make accept/reject actions one-click",
        "Show clear attribution for AI contributions",
        "Allow users to easily iterate on AI suggestions"
      ]
    }
  }
};
