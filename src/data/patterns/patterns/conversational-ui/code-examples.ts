import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Guided Learning Chatbot",
    description: "An interactive chatbot that teaches you conversational UI patterns while demonstrating them: suggested prompts, typing indicators, contextual follow-ups, and resource links. Try it to learn how to build chat interfaces.",
    language: "tsx",
    componentId: "conversational-ui-guided",
    code: `import React, { useState, useRef, useCallback } from 'react';

// Guided chatbot with conversation tree, contextual follow-ups, and resource links.
// Demonstrates: suggested prompts, typing indicator, rich content, and fallback handling.

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

// Define the conversation tree - each key is a user prompt, value is the bot's response
const CONVERSATION: Record<string, ConversationNode> = {
  'What can you help with?': {
    response: 'I can teach you about building chat interfaces: message bubbles, ' +
      'typing indicators, suggested prompts, context management, and error handling.',
    links: [{ label: 'Full guide', href: '/guides/conversational-ui-guide' }],
    followUps: ['Tell me about message bubbles', 'How do typing indicators work?'],
  },
  'Tell me about message bubbles': {
    response: 'Message bubbles need: right-alignment for user, left for AI, ' +
      'max-width of 60-75%, distinct colors, and 8-12px spacing between messages.',
    followUps: ['How do typing indicators work?', 'What can you help with?'],
  },
  'How do typing indicators work?': {
    response: 'Three patterns: bouncing dots for short waits, streaming text ' +
      'for AI responses, and status phases for complex tasks.',
    followUps: ['What can you help with?'],
  },
};

const INITIAL_PROMPTS = ['What can you help with?', 'Tell me about message bubbles'];

export default function GuidedChatbot() {
  const [messages, setMessages] = useState<BotMessage[]>([
    { id: '0', role: 'bot', content: 'Hi! Ask me about building chat interfaces.' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_PROMPTS);
  const endRef = useRef<HTMLDivElement>(null);

  const send = useCallback((text: string) => {
    if (isTyping) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setSuggestions([]);
    setIsTyping(true);

    const node = CONVERSATION[text] || {
      response: 'I work best with the suggested prompts. Try one below!',
      followUps: INITIAL_PROMPTS,
    };

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: node.response,
        links: node.links,
      }]);
      setIsTyping(false);
      setSuggestions(node.followUps);
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 700);
  }, [isTyping]);

  return (
    <div className="flex flex-col h-[400px] border rounded-lg bg-white">
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={\\\`flex \\\${msg.role === 'user' ? 'justify-end' : ''}\\\`}>
            <div className={\\\`max-w-[75%] rounded-xl px-3 py-2 text-sm \\\${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }\\\`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-1 px-3 py-2 bg-gray-100 rounded-xl w-fit">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>
      {suggestions.length > 0 && (
        <div className="px-3 py-2 border-t flex gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border text-blue-600 hover:bg-blue-50">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}`
  }
];
