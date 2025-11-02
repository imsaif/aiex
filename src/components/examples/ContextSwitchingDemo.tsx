'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Context Switching Pattern Demo
 *
 * This component demonstrates how to manage multiple conversation contexts,
 * allowing users to switch between different topics while maintaining relevant
 * history for each context. This pattern is essential for:
 * - Reducing context loss when switching between tasks
 * - Improving user productivity by preserving conversation history
 * - Maintaining semantic coherence in multi-topic conversations
 */

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
  // Initialize with multiple contexts to demonstrate context isolation
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

  /**
   * Switch to a different context
   * This action:
   * - Updates the active context ID
   * - Updates the lastActive timestamp (useful for sorting/organizing contexts)
   * - Preserves all history in non-active contexts
   */
  const switchContext = (contextId: string) => {
    setActiveContextId(contextId);
    setContexts(prev => prev.map(c =>
      c.id === contextId ? { ...c, lastActive: new Date() } : c
    ));
  };

  /**
   * Send a message to the current context
   * Important: Messages are added to the specific context only,
   * other contexts remain completely unaffected.
   */
  const sendMessage = () => {
    if (!newMessage.trim() || !activeContext) return;

    const userMessage: Message = {
      id: `${activeContext.id}-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const aiResponse: Message = {
      id: `${activeContext.id}-${Date.now() + 1}`,
      text: `I understand you're asking about "${newMessage}" in the context of ${activeContext.name}.`,
      sender: 'ai',
      timestamp: new Date()
    };

    // Update only the active context, preserving all other contexts
    setContexts(prev => prev.map(c =>
      c.id === activeContextId
        ? { ...c, messages: [...c.messages, userMessage, aiResponse], lastActive: new Date() }
        : c
    ));

    setNewMessage('');
  };

  return (
    <div className="w-full">
      {/* Educational Header */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>📚 Pattern in Action:</strong> Switch between conversation contexts and observe how the AI maintains separate context for each topic. Messages in one context don't affect the others.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8 w-full">
        {/* Context List - Left Sidebar */}
        <div className="col-span-1 min-w-0">
          <h3 className="font-semibold mb-3">Conversations</h3>

          <div className="space-y-2">
            {contexts.map(context => (
              <motion.div
                key={context.id}
                onClick={() => switchContext(context.id)}
                className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                  activeContextId === context.id
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
                whileHover={{ scale: 1.02 }}
                title={`Click to switch to ${context.name}`}
              >
                <h4 className="font-medium text-sm">{context.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{context.topic}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {context.messages.length} messages
                </p>
                {activeContextId === context.id && (
                  <p className="text-xs text-blue-600 mt-2 font-medium">✓ Active</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Context Display - Right Side */}
        <div className="col-span-3 min-w-0">
          <AnimatePresence mode="wait">
            {activeContext && (
              <motion.div
                key={activeContext.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                {/* Context Header */}
                <div className="mb-5 pb-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xl">{activeContext.name}</h3>
                    <p className="text-sm text-gray-600">{activeContext.topic}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {activeContext.messages.length} messages
                  </p>
                </div>

                {/* Message History */}
                <div className="space-y-4 mb-5 max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
                  {activeContext.messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-base py-6">
                      No messages yet. Start a conversation!
                    </p>
                  ) : (
                    activeContext.messages.map(message => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-base">{message.text}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message ${activeContext.name}...`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    aria-label={`Message input for ${activeContext.name}`}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Key Learning Section - Below Demo */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-semibold text-green-900 mb-2">✨ Pattern Applied</p>
          <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
            <li>Independent message history per context</li>
            <li>Seamless switching preserves all messages</li>
            <li>Topic-aware context understanding</li>
            <li>Zero context bleeding between conversations</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="font-semibold text-purple-900 mb-2">🎯 Best Practices</p>
          <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
            <li>Meaningful context names ("Project Planning" not "Chat 1")</li>
            <li>Visible context switching indicator</li>
            <li>Preserve full conversation history</li>
            <li>Show timestamp of last activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
