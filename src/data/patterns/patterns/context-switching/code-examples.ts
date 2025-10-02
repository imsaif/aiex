import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Multi-Context Conversation Manager",
    description: "This React component demonstrates how to manage multiple conversation contexts, allowing users to switch between different topics while maintaining relevant history for each context.",
    language: "tsx",
    componentId: "context-switching-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Context {
  id: string;
  name: string;
  topic: string;
  messages: Message[];
  lastActive: Date;
}

export default function ContextSwitchingDemo() {
  const [contexts, setContexts] = useState<Context[]>([
    {
      id: '1',
      name: 'Project Planning',
      topic: 'Discussing project timeline',
      messages: [
        { id: '1-1', text: "Let's plan the project timeline", sender: 'user', timestamp: new Date() },
        { id: '1-2', text: "I'll help you create a timeline. What's your deadline?", sender: 'ai', timestamp: new Date() }
      ],
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Code Review',
      topic: 'Reviewing React components',
      messages: [
        { id: '2-1', text: "Can you review this component?", sender: 'user', timestamp: new Date() },
        { id: '2-2', text: "Sure! I'll analyze the code structure and best practices.", sender: 'ai', timestamp: new Date() }
      ],
      lastActive: new Date()
    }
  ]);

  const [activeContextId, setActiveContextId] = useState('1');
  const [newMessage, setNewMessage] = useState('');

  const activeContext = contexts.find(c => c.id === activeContextId);

  const switchContext = (contextId: string) => {
    setActiveContextId(contextId);
    setContexts(prev => prev.map(c =>
      c.id === contextId ? { ...c, lastActive: new Date() } : c
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeContext) return;

    const userMessage: Message = {
      id: \`\${activeContext.id}-\${Date.now()}\`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const aiResponse: Message = {
      id: \`\${activeContext.id}-\${Date.now() + 1}\`,
      text: \`I understand you're asking about "\${newMessage}" in the context of \${activeContext.name}.\`,
      sender: 'ai',
      timestamp: new Date()
    };

    setContexts(prev => prev.map(c =>
      c.id === activeContextId
        ? { ...c, messages: [...c.messages, userMessage, aiResponse], lastActive: new Date() }
        : c
    ));

    setNewMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Switch between conversation contexts and see how the AI maintains separate context for each topic
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Context List */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-semibold mb-2">Conversations</h3>
          {contexts.map(context => (
            <motion.div
              key={context.id}
              onClick={() => switchContext(context.id)}
              className={\`p-3 rounded-lg cursor-pointer border-2 transition-colors \${
                activeContextId === context.id
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }\`}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium text-sm">{context.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{context.topic}</p>
              <p className="text-xs text-gray-400 mt-1">
                {context.messages.length} messages
              </p>
            </motion.div>
          ))}
        </div>

        {/* Active Context */}
        <div className="col-span-2">
          <AnimatePresence mode="wait">
            {activeContext && (
              <motion.div
                key={activeContext.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-4 pb-3 border-b">
                  <h3 className="font-semibold">{activeContext.name}</h3>
                  <p className="text-sm text-gray-600">{activeContext.topic}</p>
                </div>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {activeContext.messages.map(message => (
                    <div
                      key={message.id}
                      className={\`flex \${message.sender === 'user' ? 'justify-end' : 'justify-start'}\`}
                    >
                      <div
                        className={\`max-w-[80%] p-3 rounded-lg \${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }\`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}`
  }
];
