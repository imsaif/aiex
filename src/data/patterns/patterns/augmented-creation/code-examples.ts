import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Augmented Creation Interactive Demo",
    description: "This React component demonstrates augmented creation with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "augmented-creation-demo",
    code: `'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreativeSuggestion {
  id: string;
  type: 'text' | 'image' | 'style';
  content: string;
  confidence: number;
}

interface CreationSession {
  content: string;
  suggestions: CreativeSuggestion[];
  history: string[];
}

export default function AugmentedCreationDemo() {
  const [session, setSession] = useState<CreationSession>({
    content: '',
    suggestions: [],
    history: []
  });
  const [activeTab, setActiveTab] = useState<'write' | 'design' | 'code'>('write');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateSuggestions = async (content: string) => {
    if (content.length < 10) return;
    
    setIsGenerating(true);
    
    // Simulate AI suggestion generation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const suggestions: CreativeSuggestion[] = [
      {
        id: '1',
        type: 'text',
        content: 'Continue with: "This innovative approach could revolutionize how we think about..."',
        confidence: 0.85
      },
      {
        id: '2',
        type: 'style',
        content: 'Make this more conversational and engaging',
        confidence: 0.78
      },
      {
        id: '3',
        type: 'text',
        content: 'Add supporting examples or case studies here',
        confidence: 0.72
      }
    ];
    
    setSession(prev => ({ ...prev, suggestions }));
    setIsGenerating(false);
  };

  const applySuggestion = (suggestion: CreativeSuggestion) => {
    let newContent = session.content;
    
    if (suggestion.type === 'text') {
      newContent += ' ' + suggestion.content;
    }
    
    setSession(prev => ({
      ...prev,
      content: newContent,
      history: [...prev.history, prev.content],
      suggestions: prev.suggestions.filter(s => s.id !== suggestion.id)
    }));
  };

  const undoLastChange = () => {
    if (session.history.length > 0) {
      const previousContent = session.history[session.history.length - 1];
      setSession(prev => ({
        ...prev,
        content: previousContent,
        history: prev.history.slice(0, -1)
      }));
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSuggestions(session.content);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [session.content]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Creative Assistant</h2>
        <p className="text-gray-600">Collaborate with AI to enhance your creative process</p>
      </header>

      <div className="flex mb-4 space-x-1 bg-gray-100 rounded-lg p-1">
        {(['write', 'design', 'code'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={\`flex-1 py-2 px-4 rounded-md transition-colors \${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }\`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Creative Canvas</span>
              <button
                onClick={undoLastChange}
                disabled={session.history.length === 0}
                className="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="w-full p-4 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start creating... AI will suggest improvements as you work"
              value={session.content}
              onChange={(e) => setSession(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-blue-900">AI Suggestions</h3>
              {isGenerating && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>

            <AnimatePresence>
              {session.suggestions.length > 0 ? (
                <div className="space-y-2">
                  {session.suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-blue-200 rounded-md p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-blue-600 uppercase">
                          {suggestion.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{suggestion.content}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-600">
                  {isGenerating ? 'Analyzing your content...' : 'Start writing to get AI suggestions'}
                </p>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Creation Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Words:</span>
                <span className="font-medium">{session.content.trim().split(/\s+/).filter(w => w).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">AI Assists:</span>
                <span className="font-medium">{session.history.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Active Suggestions:</span>
                <span className="font-medium">{session.suggestions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
