'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

// --- Types ---

interface BotMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  links?: Array<{ label: string; href: string }>;
}

interface ConversationNode {
  response: string;
  links?: Array<{ label: string; href: string }>;
  followUps: string[];
}

// --- Conversation Tree ---

const CONVERSATION: Record<string, ConversationNode> = {
  // --- Top-level topics ---
  'What can you teach me?': {
    response:
      'I can walk you through building a conversational UI from scratch. Pick a topic:\n\n' +
      '1. The basics: message bubbles, layout, input design\n' +
      '2. Making it feel alive: typing indicators, streaming, status cues\n' +
      '3. Helping users start: suggested prompts and conversation starters\n' +
      '4. Keeping context across turns\n' +
      '5. Handling errors gracefully\n' +
      '6. Voice interface design\n' +
      '7. Agentic AI: when your chat takes actions\n' +
      '8. Accessibility\n\n' +
      'Or ask me about any specific topic.',
    links: [
      { label: 'Full guide: 11 lessons', href: '/guides/conversational-ui-guide' },
      { label: 'Conversational UI pattern', href: '/patterns/conversational-ui' },
    ],
    followUps: [
      'Teach me the basics',
      'How do I add typing indicators?',
      'How do suggested prompts work?',
      'Tell me about agentic chat',
    ],
  },

  // --- Basics ---
  'Teach me the basics': {
    response:
      'Every chat interface has 5 core components:\n\n' +
      '1. Message area: scrollable container, user messages right-aligned, AI left-aligned\n' +
      '2. Input bar: text field, send button, optional file upload and voice toggle\n' +
      '3. Suggested prompts: clickable chips to help users start or continue\n' +
      '4. Status indicators: typing dots, thinking spinners, streaming text\n' +
      '5. Header: AI name/avatar, conversation title, actions\n\n' +
      'Message bubbles should have a max-width of 60-75% of the container. User bubbles get your accent color, AI bubbles get a neutral background. Use 8-12px spacing between messages from the same sender.\n\n' +
      'The empty state is critical. Users who see a blank input will leave. Show a welcome message and 3-4 suggested prompts.',
    links: [
      { label: 'Lesson 2: Chat anatomy', href: '/guides/conversational-ui-guide' },
      { label: 'Lesson 3: Building in React', href: '/guides/conversational-ui-guide' },
    ],
    followUps: [
      'How do I handle auto-scrolling?',
      'What about rich content in messages?',
      'How do I add typing indicators?',
      'Show me resources to get started',
    ],
  },

  'How do I handle auto-scrolling?': {
    response:
      'Auto-scroll to the latest message, but only when the user is already near the bottom. If they scrolled up to read history, don\'t yank them down.\n\n' +
      'The pattern: check if scrollHeight - scrollTop - clientHeight is less than 100px. If yes, scroll. If no, leave them where they are. Use behavior: "smooth" to avoid jarring jumps.\n\n' +
      'Test on mobile especially. Touch scrolling has momentum, so a new message might arrive while the user is still mid-scroll.',
    followUps: [
      'What about rich content in messages?',
      'How do I add typing indicators?',
      'Tell me about accessibility',
    ],
  },

  'What about rich content in messages?': {
    response:
      'AI responses often include code blocks, tables, lists, images, and buttons. Design these as first-class elements within the bubble, not plain text.\n\n' +
      'ChatGPT renders markdown with syntax highlighting. Claude shows structured outputs inline. The key is that rich content should feel native to the conversation, not like an embedded iframe.\n\n' +
      'For action buttons within messages (like "Copy code" or "Try again"), place them at the bottom of the message bubble with subtle styling.',
    links: [
      { label: 'Progressive Disclosure pattern', href: '/patterns/progressive-disclosure' },
      { label: 'Multimodal Interaction pattern', href: '/patterns/multimodal-interaction' },
    ],
    followUps: [
      'How do I add typing indicators?',
      'How do suggested prompts work?',
      'Tell me about agentic chat',
    ],
  },

  // --- Typing & Streaming ---
  'How do I add typing indicators?': {
    response:
      'Three patterns for showing the AI is working:\n\n' +
      '1. Typing indicator (three bouncing dots): Use for short waits under 3 seconds. Shows "thinking" without committing to a response format.\n\n' +
      '2. Streaming text: The modern standard. Tokens appear as they are generated, giving users something to read immediately. ChatGPT and Claude both use this. Consume a Server-Sent Events stream and append tokens.\n\n' +
      '3. Status phases: For complex tasks, show distinct phases like "Searching..." then "Reading 3 documents..." then "Writing response..." Perplexity uses this pattern.\n\n' +
      'Add a blinking cursor at the end of streaming text to signal "more is coming."',
    links: [
      { label: 'Lesson 4: Streaming responses', href: '/guides/conversational-ui-guide' },
      { label: 'Agent Status Monitoring pattern', href: '/patterns/agent-status-monitoring' },
    ],
    followUps: [
      'How do suggested prompts work?',
      'How do I handle errors?',
      'What about voice interfaces?',
    ],
  },

  // --- Suggested Prompts ---
  'How do suggested prompts work?': {
    response:
      'Three types of prompts solve the "blank input" problem:\n\n' +
      '1. Conversation starters (empty state): 3-4 prompts showcasing the AI\'s range. "Summarize a document", "Help me write an email."\n\n' +
      '2. Follow-up suggestions (after AI responds): Contextual based on what was discussed. After code, show "Explain this" or "Add error handling." After a list, show "Tell me more about #1."\n\n' +
      '3. Quick actions (always visible): Buttons for common tasks like "New chat" or "Upload file."\n\n' +
      'Place suggestions above the input bar, not below the AI message. Users\' eyes move from reading the response down to the input. Prompts in that path get clicked 3-4x more.\n\n' +
      'Fun fact: this chatbot you\'re using right now demonstrates all three types.',
    links: [
      { label: 'Lesson 5: Suggested prompts', href: '/guides/conversational-ui-guide' },
      { label: 'Contextual Assistance pattern', href: '/patterns/contextual-assistance' },
      { label: 'Predictive Anticipation pattern', href: '/patterns/predictive-anticipation' },
    ],
    followUps: [
      'How do I keep context across turns?',
      'How do I handle errors?',
      'Tell me about agentic chat',
    ],
  },

  // --- Context ---
  'How do I keep context across turns?': {
    response:
      'The difference between good and great conversational UI is context. Users expect the AI to remember what was said 5 messages ago.\n\n' +
      'The sliding window pattern:\n' +
      '1. Always include the system prompt (personality, instructions)\n' +
      '2. Include the last N messages verbatim\n' +
      '3. Summarize older messages as compressed history\n' +
      '4. Inject relevant retrieved context (RAG/search results)\n\n' +
      'Users expect pronoun resolution ("make it shorter" referring to the previous output), topic branching (switching subjects and coming back), and corrections ("actually I meant Python not JavaScript").\n\n' +
      'For conversation history UX: auto-generate titles from the first message, add search across conversations, and consider branching (editing and regenerating from a previous point).',
    links: [
      { label: 'Context Switching pattern', href: '/patterns/context-switching' },
      { label: 'Selective Memory pattern', href: '/patterns/selective-memory' },
      { label: 'Session Degradation Prevention', href: '/patterns/session-degradation-prevention' },
    ],
    followUps: [
      'How do I handle errors?',
      'Tell me about agentic chat',
      'What tools can help me build this?',
    ],
  },

  // --- Errors ---
  'How do I handle errors?': {
    response:
      'Four failure modes to design for:\n\n' +
      '1. "I don\'t understand": Ask a specific clarifying question, never a generic error.\n' +
      '2. "I can\'t do that": Be honest and suggest an alternative that IS possible.\n' +
      '3. "Something went wrong" (API error/timeout): Show a retry button with the original message pre-filled. Never lose the user\'s message.\n' +
      '4. "The response is wrong" (hallucination): Make it easy to regenerate. Add feedback buttons (thumbs up/down).\n\n' +
      'Style errors as messages in the conversation, not modal dialogs. The golden rule: never silently swallow errors. Even "Something went wrong, click to retry" is infinitely better than silence.',
    links: [
      { label: 'Error Recovery pattern', href: '/patterns/error-recovery' },
      { label: 'Graceful Handoff pattern', href: '/patterns/graceful-handoff' },
      { label: 'Escalation Pathways pattern', href: '/patterns/escalation-pathways' },
    ],
    followUps: [
      'What about voice interfaces?',
      'Tell me about agentic chat',
      'How do I make it accessible?',
    ],
  },

  // --- Voice ---
  'What about voice interfaces?': {
    response:
      'Voice changes everything about conversation design:\n\n' +
      'Keep responses short: 2-3 sentences max, not 500 words. Break complex answers into chunks with "Want me to go deeper?"\n\n' +
      'Confirm before acting: "I\'ll delete the Monday meeting. Should I go ahead?"\n\n' +
      'Handle interruptions: Stop speaking immediately when the user cuts in.\n\n' +
      'Always show visual feedback: pulsing orb while listening, spinner while processing, transcription of what was heard. Siri, Alexa, and Google Assistant all do this.\n\n' +
      'When info doesn\'t work in voice (long lists, URLs, code), the voice says a summary and the screen shows detail. "I found 7 restaurants nearby. Here they are on your screen."',
    links: [
      { label: 'Lesson 8: Voice design', href: '/guides/conversational-ui-guide' },
      { label: 'Multimodal Interaction pattern', href: '/patterns/multimodal-interaction' },
    ],
    followUps: [
      'Tell me about agentic chat',
      'How do I make it accessible?',
      'What tools can help me build this?',
    ],
  },

  // --- Agentic ---
  'Tell me about agentic chat': {
    response:
      'Agentic AI doesn\'t just answer questions, it takes actions: sending emails, running code, modifying files. This creates new design challenges.\n\n' +
      'Five essential patterns:\n\n' +
      '1. Intent Preview: Show what the AI plans to do before it acts. "I\'ll send this email to Sarah. Proceed?"\n' +
      '2. Plan Summary: For multi-step tasks, show the full plan upfront with approve/modify/reject.\n' +
      '3. Agent Status Monitoring: Real-time progress with step indicators and the ability to pause.\n' +
      '4. Escalation Pathways: Define when the AI should stop and ask for human input.\n' +
      '5. Trust Calibration: Gradually increase autonomy as users build trust.\n\n' +
      'The golden rule: never take an irreversible action without explicit confirmation. For reversible actions, act first and let users undo.',
    links: [
      { label: 'Intent Preview pattern', href: '/patterns/intent-preview' },
      { label: 'Plan Summary pattern', href: '/patterns/plan-summary' },
      { label: 'Agent Status Monitoring', href: '/patterns/agent-status-monitoring' },
      { label: 'Escalation Pathways pattern', href: '/patterns/escalation-pathways' },
      { label: 'Trust Calibration pattern', href: '/patterns/trust-calibration' },
      { label: 'Agentic UX Checklist (PDF)', href: '/downloads/agentic-ux-checklist.pdf' },
    ],
    followUps: [
      'How do I make it accessible?',
      'What tools can help me build this?',
      'How do I audit my chat UI?',
    ],
  },

  // --- Accessibility ---
  'How do I make it accessible?': {
    response:
      'Chat interfaces have unique accessibility challenges:\n\n' +
      'Screen readers: Use role="log" with aria-live="polite" on the message container. Label message roles clearly ("You said" vs "AI Assistant said"). Announce status changes with role="status".\n\n' +
      'Keyboard: Auto-focus the input. Return focus after sending. Support Enter to send, Shift+Enter for newline. Make prompt chips navigable with arrow keys.\n\n' +
      'Visual: Meet WCAG AA contrast (4.5:1) on message bubbles. Don\'t rely on color alone for user vs AI distinction, use position and labels too. Minimum 14px for chat text. Respect prefers-reduced-motion for animations.\n\n' +
      'The Universal Access Patterns page has a complete accessibility checklist for AI interfaces.',
    links: [
      { label: 'Universal Access Patterns', href: '/patterns/universal-access-patterns' },
      { label: 'Lesson 9: Accessibility', href: '/guides/conversational-ui-guide' },
    ],
    followUps: [
      'What tools can help me build this?',
      'How do I audit my chat UI?',
      'Show me the production checklist',
    ],
  },

  // --- Tools & Resources ---
  'What tools can help me build this?': {
    response:
      'Here is everything on AIUX that can help you build:\n\n' +
      'Design resources:\n' +
      '- AI Interaction Toolkit: a 2-page framework for deciding when AI should talk vs act\n' +
      '- AIUX Design Checklist: printable PDF with all 36 patterns for design reviews\n' +
      '- Agentic UX Checklist: 8-pattern checklist for AI agents\n' +
      '- Agent Readability Audit Kit: test how AI agents read your product\n\n' +
      'Development resources:\n' +
      '- Prompt Builder: generates custom prompts for Claude, Cursor, ChatGPT, Copilot\n' +
      '- 36 Figma Make prompts: copy-paste ready design prompts for each pattern\n' +
      '- Code examples: every pattern page has working React demos\n\n' +
      'Learning:\n' +
      '- This guide plus guides for Claude Code, Cursor, GitHub Copilot, and GitHub\n' +
      '- AI UX News: daily updates on ChatGPT, Claude, Gemini with design insights',
    links: [
      { label: 'Toolkit', href: '/toolkit' },
      { label: 'AIUX Checklist (PDF)', href: '/handbook' },
      { label: 'Prompt Builder', href: '/prompt-builder' },
      { label: 'Figma Prompts', href: '/prompts' },
      { label: 'All Resources', href: '/resources' },
      { label: 'Agent Readability Kit', href: '/agent-readability-audit-kit' },
      { label: 'AI UX News', href: '/news' },
      { label: 'All Guides', href: '/guides' },
    ],
    followUps: [
      'How do I audit my chat UI?',
      'Show me the production checklist',
      'What can you teach me?',
    ],
  },

  'Show me resources to get started': {
    response:
      'Start here:\n\n' +
      '1. Read the full 11-lesson guide for step-by-step implementation\n' +
      '2. Check the Conversational UI pattern page for real-world examples from ChatGPT, Claude, Slack, and Siri\n' +
      '3. Use the Prompt Builder to generate a custom CLAUDE.md or .cursorrules for your project\n' +
      '4. Download the AIUX Checklist PDF to keep next to you during design reviews\n' +
      '5. Run your first design through the free Audit Tool to see how it scores',
    links: [
      { label: 'Full guide (11 lessons)', href: '/guides/conversational-ui-guide' },
      { label: 'Conversational UI pattern', href: '/patterns/conversational-ui' },
      { label: 'Prompt Builder', href: '/prompt-builder' },
      { label: 'AIUX Checklist (PDF)', href: '/handbook' },
      { label: 'Free Audit Tool', href: '/audit' },
    ],
    followUps: [
      'Teach me the basics',
      'How do I add typing indicators?',
      'Tell me about agentic chat',
    ],
  },

  // --- Audit ---
  'How do I audit my chat UI?': {
    response:
      'Use the free AI UX Audit Tool. Upload a screenshot of your conversational interface and it scores your design against all 36 AIUX patterns. You get:\n\n' +
      '- An overall score\n' +
      '- Pattern-by-pattern breakdown (strong, weak, missing)\n' +
      '- Top gaps with specific recommendations\n' +
      '- A chat with an AI design mentor for deeper insights\n\n' +
      'It works for any AI interface: chatbots, voice UIs, code assistants, dashboards. 3 free analyses per day, no signup required.',
    links: [
      { label: 'Open Audit Tool', href: '/audit' },
      { label: 'AIUX Checklist (PDF)', href: '/handbook' },
    ],
    followUps: [
      'Show me the production checklist',
      'What tools can help me build this?',
      'What can you teach me?',
    ],
  },

  // --- Production Checklist ---
  'Show me the production checklist': {
    response:
      'Ship-ready conversational UI checklist:\n\n' +
      'Core:\n' +
      '- Message sending and receiving\n' +
      '- Streaming or typing indicator\n' +
      '- Auto-scroll (respecting user scroll position)\n' +
      '- Suggested prompts (empty state + contextual)\n' +
      '- Error handling with retry\n' +
      '- Conversation history (if multi-session)\n\n' +
      'Polish:\n' +
      '- Enter to send, Shift+Enter for newline\n' +
      '- Copy and regenerate buttons on messages\n' +
      '- Mobile responsive layout\n' +
      '- Dark mode support\n\n' +
      'Accessibility:\n' +
      '- ARIA live regions for new messages\n' +
      '- Keyboard navigation for all elements\n' +
      '- WCAG AA contrast on bubbles\n\n' +
      'Performance:\n' +
      '- Virtualized message list for long conversations\n' +
      '- Lazy load conversation history\n' +
      '- Optimistic UI for sent messages',
    links: [
      { label: 'Lesson 10: Full checklist', href: '/guides/conversational-ui-guide' },
      { label: 'Download AIUX Checklist', href: '/handbook' },
      { label: 'Audit your design', href: '/audit' },
    ],
    followUps: [
      'How do I audit my chat UI?',
      'What tools can help me build this?',
      'What can you teach me?',
    ],
  },
};

const INITIAL_SUGGESTIONS = [
  'What can you teach me?',
  'Teach me the basics',
  'What tools can help me build this?',
  'How do I audit my chat UI?',
];

// --- Streaming helper ---
const STREAM_SPEED = 18; // ms per character

// --- Component ---

export function ConversationalUIBot() {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: '0',
      role: 'bot',
      content:
        'Hi! I\'m a guided chatbot built to teach you how to build conversational UIs. I\'m also a live demo of the patterns I teach: suggested prompts, typing indicators, contextual follow-ups, and resource links.\n\nWhat would you like to learn?',
      links: [
        { label: 'Conversational UI pattern', href: '/patterns/conversational-ui' },
        { label: 'Full 11-lesson guide', href: '/guides/conversational-ui-guide' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingLinks, setStreamingLinks] = useState<Array<{ label: string; href: string }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBusy = isTyping || isStreaming;

  // Scroll chat container to bottom (never the page)
  const scrollChat = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    // Only auto-scroll if user is near the bottom
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  // Force scroll (for after user sends, always scroll)
  const forceScrollChat = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (isBusy) return;

    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setSuggestions([]);
    setIsTyping(true);

    // Scroll to show user message
    setTimeout(forceScrollChat, 30);

    // Find matching response
    const node = CONVERSATION[text];
    const fallback: ConversationNode = {
      response:
        'I\'m a guided chatbot, so I work best with the suggested prompts. Pick a topic below and I\'ll walk you through it with links to patterns, tools, and resources.',
      followUps: INITIAL_SUGGESTIONS,
    };
    const match = node || fallback;

    // Phase 1: Show typing indicator for 700ms
    setTimeout(() => {
      setIsTyping(false);
      setIsStreaming(true);
      setStreamingContent('');
      setStreamingLinks(match.links || []);

      // Scroll to show the streaming bubble
      setTimeout(forceScrollChat, 30);

      // Phase 2: Stream characters
      const fullText = match.response;
      let charIndex = 0;

      streamIntervalRef.current = setInterval(() => {
        // Stream in chunks of 2-3 chars for a natural feel
        const chunkSize = Math.random() < 0.3 ? 3 : 2;
        charIndex = Math.min(charIndex + chunkSize, fullText.length);
        setStreamingContent(fullText.slice(0, charIndex));

        // Auto-scroll during streaming
        scrollChat();

        if (charIndex >= fullText.length) {
          // Phase 3: Streaming complete
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;

          // Finalize: add full message, clear streaming state
          setIsStreaming(false);
          setStreamingContent('');
          setStreamingLinks([]);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: fullText,
            links: match.links,
          }]);

          // Show suggestions after a beat
          setTimeout(() => {
            setSuggestions(match.followUps);
            setTimeout(scrollChat, 50);
          }, 200);

          // Return focus to input
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }, STREAM_SPEED);
    }, 700);
  }, [isBusy, forceScrollChat, scrollChat]);

  return (
    <div className="flex flex-col h-[640px] md:h-[700px] rounded-2xl border border-border-primary bg-background-primary shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-primary bg-background-secondary flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center text-accent-primary text-base font-bold flex-shrink-0">
          AI
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold text-text-primary truncate">Conversational UI Guide</p>
          <p className="text-sm text-text-tertiary">Interactive learning assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 p-5 md:p-6 overflow-y-auto space-y-5"
      >
        {/* Rendered messages */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent-primary text-sm font-bold flex-shrink-0 mt-0.5">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user'
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-secondary border border-border-primary text-text-primary'
              }`}
              aria-label={`${msg.role === 'user' ? 'You' : 'Guide'} said`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-line">{msg.content}</p>
              {msg.links && msg.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border-primary/30">
                  {msg.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-accent-subtle text-accent-primary hover:bg-accent-primary hover:text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3" role="status" aria-label="Guide is typing">
            <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent-primary text-sm font-bold flex-shrink-0">
              AI
            </div>
            <div className="bg-background-secondary border border-border-primary rounded-2xl px-5 py-3.5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Streaming message */}
        {isStreaming && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-accent-primary text-sm font-bold flex-shrink-0 mt-0.5">
              AI
            </div>
            <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-background-secondary border border-border-primary text-text-primary">
              <p className="text-[15px] leading-relaxed whitespace-pre-line">
                {streamingContent}
                <span className="inline-block w-[2px] h-[1em] bg-text-tertiary ml-0.5 align-middle animate-pulse" />
              </p>
              {/* Links appear once streaming is done — handled by final message */}
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      {suggestions.length > 0 && !isBusy && (
        <div className="px-5 py-3 border-t border-border-primary bg-background-secondary">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-sm px-4 py-2 rounded-full border border-border-primary text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={e => {
          e.preventDefault();
          const input = inputRef.current;
          if (input && input.value.trim()) {
            sendMessage(input.value.trim());
            input.value = '';
          }
        }}
        className="border-t border-border-primary p-4 bg-background-primary"
      >
        <div className="flex gap-3">
          <input
            ref={inputRef}
            name="msg"
            type="text"
            placeholder="Ask about building a chat UI..."
            className="flex-1 bg-background-secondary border border-border-primary rounded-xl py-2.5 px-4 text-[15px] text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
            disabled={isBusy}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isBusy}
            className="bg-accent-primary text-white px-5 py-2.5 rounded-xl text-[15px] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
