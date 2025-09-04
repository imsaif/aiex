import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const conversationalui: Pattern = {
  id: "conversational-ui",
  title: "Conversational UI",
  slug: "conversational-ui",
  category: "Natural Interaction",
  description: "Design intuitive, engaging, human-like interactions via chat and voice interfaces.",
  thumbnail: "/images/examples/slack-ai.gif",
  content: {
    problem: "Traditional interfaces are rigid, requiring users to learn specific patterns. Users prefer natural language but struggle with AI lacking context or conversational nuance.",
    solution: "Create conversational interfaces that understand natural language, maintain context, and respond human-like. Design for text and voice, with appropriate brand-matching personality and tone.",
    examples: [
      {
        title: "Slack AI Assistant",
        description: "Integrates naturally into team conversations, understanding context and providing relevant assistance without disrupting workflow.",
        image: "/images/examples/slack-ai.gif",
        altText: "Slack AI conversational interface"
      },
      {
        title: "Microsoft Copilot",
        description: "Provides intelligent assistance across Microsoft 365, understanding context from documents, emails, and meetings to offer suggestions and automate tasks via natural conversation.",
        image: "/images/examples/microsoft-copilot.gif",
        altText: "Microsoft Copilot conversational interface"
      },
      {
        title: "Siri",
        description: "Apple's voice assistant handles natural speech, maintains context, and integrates seamlessly with iOS to perform tasks via voice commands and follow-up questions.",
        image: "/images/examples/siri-conversation.gif",
        altText: "Siri voice assistant conversational interface"
      }
    ],
    codeExamples,
    guidelines: [
      "Use natural language; avoid overly formal or robotic responses.",
      "Maintain conversation context and reference previous interactions.",
      "Provide clear conversation starters and example prompts.",
      "Handle misunderstandings gracefully with clarifying questions.",
      "Use appropriate, brand-matching personality and tone.",
      "Support both structured commands and free-form natural language.",
      "Provide visual cues for conversation state (typing indicators, read receipts).",
      "Design for both synchronous and asynchronous conversation patterns.",
      "Include conversation history and search functionality.",
      "Handle interruptions and topic changes smoothly."
    ],
    considerations: [
      "Balance personality with professionalism based on use case.",
      "Consider cultural differences in communication styles.",
      "Plan for multilingual support and language detection.",
      "Design appropriate fallback mechanisms when AI doesn't understand.",
      "Consider privacy implications of conversation history storage.",
      "Account for accessibility needs in text and voice interfaces.",
      "Plan for conversation handoffs between AI and human agents.",
      "Consider the cognitive load of extended conversations.",
      "Design appropriate boundaries for AI personality and capabilities.",
      "Test with diverse user groups to validate conversational patterns."
    ],
    relatedPatterns: [
      "Contextual Assistance",
      "Human-in-the-Loop",
      "Progressive Disclosure",
      "Multimodal Interaction"
    ]
  }
};
