import { Pattern } from '../../../../types';
import { codeExamples } from './code-examples';

export const conversationalui: Pattern = {
  id: "conversational-ui",
  title: "Conversational UI",
  slug: "conversational-ui",
  category: "Natural Interaction",
  description: "Design intuitive, engaging, human-like interactions via chat and voice interfaces.",
  tags: [
    "conversational interface",
    "chat interface",
    "chatbot design",
    "voice assistant",
    "conversational UX",
    "natural language interface",
    "chat design patterns",
    "conversational AI",
  ],
  thumbnail: "/images/examples/slack-ai.gif",
  introduction: "Conversational UI is a design pattern where users interact with AI through natural language (text or voice) instead of traditional menus, forms, and buttons. Rather than learning a product's interface, users simply describe what they need and the AI interprets their intent.\n\nConversational interfaces come in many forms: text-based chatbots like ChatGPT and Claude, voice assistants like Siri and Alexa, embedded AI assistants like Slack AI and Microsoft Copilot, and hybrid interfaces that combine chat with traditional UI elements. What unites them is the principle that natural language is the primary input.\n\nThis pattern is especially powerful for customer support (answering questions without navigating help docs), complex workflows (generating code, writing emails, analyzing data through conversation), and accessibility (voice control for users who can't use traditional inputs). The best conversational UIs don't just respond to commands. They maintain context across turns, ask clarifying questions, and adapt their tone and detail level to the user.",
  datePublished: "2024-01-15",
  dateModified: "2026-05-26",
  content: {
    problem: "Traditional graphical interfaces require users to learn specific navigation patterns, menu hierarchies, and form layouts. As AI products grow more capable, the gap between what the system can do and what users can discover widens. Users prefer asking for what they need in plain language, but poorly designed conversational interfaces frustrate them with robotic responses, lost context, and dead-end conversations.",
    solution: "Design conversational interfaces that understand natural language, maintain context across multiple turns, and respond in a natural, human-like way. Support both text and voice input where appropriate. Provide conversation starters and suggested prompts to help users get started, use typing indicators and status cues for natural pacing, and design clear fallback paths for when the AI doesn't understand. The best conversational UIs blend chat with structured UI elements like buttons, cards, and carousels, so users can switch between typing and clicking based on what's fastest.",
    examples: [
      {
        title: "ChatGPT",
        description: "OpenAI's ChatGPT popularized the conversational AI interface. Users type questions or instructions and receive detailed responses in a multi-turn conversation. **Why it works:** Maintains full conversation context, supports follow-up questions, and offers suggested prompts to guide users. The interface blends rich content (code blocks, tables, images) within the chat flow rather than forcing users to leave the conversation.",
        image: "/images/examples/chatgpt-feedback.gif",
        altText: "ChatGPT conversational interface with multi-turn dialogue"
      },
      {
        title: "Claude",
        description: "Anthropic's Claude uses a clean chat interface with clarifying questions and transparent reasoning. **Why it works:** Asks for clarification when requests are ambiguous instead of guessing, shows thinking process for complex tasks, and provides structured outputs (code, lists, tables) inline. The conversation feels collaborative rather than transactional.",
        image: "/images/examples/claudeclarifying.gif",
        altText: "Claude AI conversational interface with clarifying questions"
      },
      {
        title: "Slack AI",
        description: "Slack AI integrates conversational AI directly into team messaging, understanding workspace context like channels, people, and shared files. **Why it works:** Meets users where they already communicate, no separate app to open. Understands workspace-specific context and offers both natural language queries and command-style shortcuts.",
        image: "/images/examples/slack-ai.gif",
        altText: "Slack AI embedded conversational interface in team chat"
      },
      {
        title: "Microsoft Copilot",
        description: "Microsoft Copilot brings conversational AI across Word, Excel, PowerPoint, Teams, and Outlook. Users ask questions about documents, generate content, and automate tasks through chat. **Why it works:** Maintains context from the document or email you're working in, adapts its tone and suggestions based on the app, and combines chat responses with direct document actions.",
        image: "/images/examples/microsoft-copilot.gif",
        altText: "Microsoft Copilot conversational interface across Office apps"
      },
      {
        title: "Gemini Voice Mode",
        description: "Google Gemini's voice mode enables natural spoken conversations with AI, handling interruptions, follow-ups, and multimodal responses. **Why it works:** Supports natural speech patterns including pauses, corrections, and topic changes. Seamlessly transitions between voice and visual responses, showing maps, images, or text when spoken answers aren't enough.",
        image: "/images/examples/geminivoicemode.gif",
        altText: "Google Gemini voice conversational interface"
      },
      {
        title: "Siri",
        description: "Apple's Siri handles voice commands with device-level integration: setting timers, sending messages, controlling smart home devices, and answering questions through natural speech. **Why it works:** Deep system integration means voice commands trigger real actions, not just text responses. Maintains brief context for follow-up questions and gracefully falls back to web search when it can't answer directly.",
        image: "/images/examples/siri-conversation.gif",
        altText: "Siri voice assistant conversational interface on iOS"
      }
    ],
    codeExamples,
    guidelines: [
      "Write in natural language. Avoid robotic, overly formal phrasing. Match the tone users expect from a helpful colleague, not a manual.",
      "Maintain conversation context across turns. Reference what the user said earlier and avoid asking them to repeat information.",
      "Provide conversation starters and suggested prompts so users aren't staring at a blank input. Show 3-4 example queries relevant to the current context.",
      "Handle misunderstandings gracefully. When the AI doesn't understand, ask a specific clarifying question rather than giving a generic error.",
      "Use typing indicators, streaming responses, and status cues (thinking, searching, generating) so users know the system is working.",
      "Blend chat with structured UI elements. Use buttons for quick choices, cards for rich results, and carousels for browsing. Don't force everything into plain text.",
      "Support both text and voice input where appropriate. Voice interfaces need different conversation design than text: shorter responses, confirmation prompts, and interruption handling.",
      "Design for conversation history. Users should be able to scroll back, search past conversations, and resume threads.",
      "Handle topic changes smoothly. Users will jump between subjects, and the AI should follow without losing context from earlier in the conversation.",
      "Set clear expectations about what the AI can and can't do. A brief onboarding message or capability description prevents frustration from impossible requests."
    ],
    considerations: [
      "Conversational UI vs chatbot UI: A chatbot typically follows scripted flows with predefined options, while conversational UI accepts free-form natural language. Choose based on whether your use case needs flexibility (conversational) or reliability (scripted).",
      "Text vs voice: Text interfaces allow complex queries, code, and formatted output. Voice interfaces are better for hands-free, quick-action scenarios. Many products support both; design each modality's strengths independently.",
      "Balance personality with professionalism. Customer support bots need different tone than creative writing assistants. Define your AI's voice guidelines early.",
      "Consider cultural and language differences. Conversational patterns vary across cultures. Directness, formality, and humor all need localization beyond simple translation.",
      "Plan for multilingual support from the start. Language detection, code-switching (users mixing languages), and character-set handling affect the entire conversation stack.",
      "Design appropriate fallback mechanisms. When the AI doesn't understand, offer: clarifying questions, suggested rephrasing, or escalation to human support.",
      "Privacy matters in conversation history. Users may share sensitive information in chat. Make data retention policies clear and give users control over conversation deletion.",
      "Accessibility is critical for both text and voice. Text interfaces need screen reader support, keyboard navigation, and sufficient contrast. Voice interfaces need visual alternatives and transcription.",
      "Plan for conversation handoffs between AI and human agents. When the AI reaches its limits, the transition should preserve context so users don't have to repeat themselves.",
      "Test with diverse user groups. Different users have vastly different expectations for conversational AI, from power users who chain complex prompts to first-time users who don't know what to ask."
    ],
    relatedPatterns: [
      "Contextual Assistance",
      "Human-in-the-Loop",
      "Progressive Disclosure",
      "Multimodal Interaction",
      "Graceful Handoff",
      "Context Switching"
    ],
    figmaPrompt: {
      prompt: `Design a conversational AI interface that feels natural and engaging:

Create a chat interface showing:
1. **Message Area**: Clear distinction between user and AI messages with appropriate spacing, timestamps, and read indicators
2. **AI Personality**: Subtle visual elements that reflect brand personality (avatar, colors, tone) without being distracting
3. **Context Indicators**: Show when AI is typing, thinking, searching, or generating. Each state should look distinct
4. **Rich Content**: AI responses that include formatted text, code blocks, images, buttons, and cards within the conversation flow
5. **Input Options**: Text input with suggested prompts, quick action buttons, file attachments, and voice input toggle
6. **Conversation History**: Sidebar or dropdown showing past conversations with search and resume functionality

Design for three scenarios:
- **First-time user**: Empty state with welcome message and 4 suggested prompts
- **Active conversation**: Multi-turn dialogue with mixed content types (text, code, image)
- **Error state**: AI doesn't understand. Show clarifying question with suggested rephrasing`,
      tips: [
        "Use distinct message bubbles for user vs AI with clear visual hierarchy",
        "Add typing indicators and streaming text animation for natural pacing",
        "Include quick action buttons for common follow-ups (copy, regenerate, share)",
        "Show conversation history with search and organized by date/topic",
        "Provide suggested prompts that update based on conversation context",
        "Design mobile-responsive. Chat interfaces are heavily used on phones",
        "Show a subtle capability description in the empty state so users know what to ask"
      ]
    }
  }
};
