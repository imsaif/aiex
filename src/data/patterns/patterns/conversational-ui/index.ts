import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const conversationalui: Pattern = {
  id: "conversational-ui",
  title: "Conversational UI",
  slug: "conversational-ui",
  category: "Natural Interaction",
  description: "Design intuitive, engaging, human-like interactions via chat and voice interfaces.",
  thumbnail: "/images/examples/slack-ai.gif",
  introduction: "Conversational UI is an AI design pattern where users interact with systems through natural language, either via text or voice, just like talking to another person. Instead of learning complex menus and buttons, you simply type or speak what you need and the AI understands your intent. It's perfect for customer support chatbots, voice assistants in cars or smart homes, or any application where natural language is faster than clicking. Examples include Siri understanding your voice commands, Slack AI responding in team conversations, or ChatGPT engaging in back-and-forth dialogue to solve complex problems.",
  datePublished: "2024-01-15",
  dateModified: "2025-11-18",
  content: {
    problem: "Traditional interfaces are rigid, requiring users to learn specific patterns. Users prefer natural language but struggle with AI lacking context or nuance.",
    solution: "Create conversational interfaces that understand natural language, maintain context, and respond naturally. Design for text and voice with appropriate personality and tone.",
    examples: [
      {
        title: "Slack",
        description: "Integrates naturally into team conversations, understanding context and providing relevant assistance without disrupting workflow. **Why it works:** Understands workspace context (channels, people, files) and offers both conversational and command-style input.",
        image: "/images/examples/slack-ai.gif",
        altText: "Slack AI conversational interface"
      },
      {
        title: "Microsoft Copilot",
        description: "Provides intelligent assistance across Microsoft 365, understanding context from documents, emails, and meetings to offer suggestions and automate tasks. **Why it works:** Integrates conversational AI across multiple apps, maintaining context and adapting tone based on workspace.",
        image: "/images/examples/microsoft-copilot.gif",
        altText: "Microsoft Copilot conversational interface"
      },
      {
        title: "Siri",
        description: "Apple's voice assistant handles natural speech, maintains context, and integrates with iOS to perform tasks via voice commands. **Why it works:** Seamlessly switches between voice and visual responses, integrates with device context, and handles interruptions naturally.",
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
      "Use appropriate personality and tone matching your brand.",
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
    ],
    figmaPrompt: {
      prompt: `Design a conversational AI interface that feels natural and engaging:

Create a chat interface showing:
1. **Message Area**: Clear distinction between user and AI messages with appropriate spacing
2. **AI Personality**: Subtle visual elements that reflect brand personality (avatar, colors, tone)
3. **Context Indicators**: Show when AI is typing, thinking, or has understood the request
4. **Input Options**: Text input with suggested prompts or quick actions
5. **Conversation History**: Easy access to previous messages with smooth scrolling

Include visual cues for conversation state (listening, processing, responding). Add example starter prompts to guide users.`,
      tips: [
        "Use distinct message bubbles for user vs AI",
        "Add typing indicators for natural flow",
        "Include quick action buttons for common tasks",
        "Show conversation history with search",
        "Provide suggested prompts to help users start"
      ]
    }
  }
};
