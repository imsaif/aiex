import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Simple Conversational Bot Interface",
    description: "A clean, minimal chat interface demonstrating conversational UI patterns with user and bot message bubbles.",
    language: "tsx",
    componentId: "conversational-ui-bot",
    code: `import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'bot';
}

// Simple bot responses
const getBotResponse = (message: string): string => {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm here to help. What can I do for you?";
  }

  if (lower.includes('help')) {
    return "I can assist you with questions, provide information, or just chat. What would you like to know?";
  }

  if (lower.includes('thanks') || lower.includes('thank')) {
    return "You're welcome! Anything else I can help with?";
  }

  if (lower.includes('bye') || lower.includes('goodbye')) {
    return "Goodbye! Feel free to come back anytime.";
  }

  return "I understand. Could you tell me more about what you need help with?";
};

export default function ConversationalUiDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant. How can I help you today?",
      role: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll only when sending messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Scroll after user message
    setTimeout(scrollToBottom, 100);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(userInput),
        role: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Scroll after bot message
      setTimeout(scrollToBottom, 100);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-300 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3 rounded-t-lg flex items-center">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 text-2xl">
          🤖
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
          <p className="text-sm text-blue-100">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={\`flex items-end gap-2 \${message.role === 'user' ? 'justify-end' : 'justify-start'}\`}
          >
            {message.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-lg flex-shrink-0">
                🤖
              </div>
            )}
            <div
              className={\`rounded-lg py-2 px-4 max-w-xs \${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }\`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                👤
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div className="bg-white border border-gray-200 rounded-lg py-2 px-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputValue.trim() || isTyping}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}`
  }
]; 