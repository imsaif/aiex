'use client';

import React, { useState, useRef, useEffect } from 'react';

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
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
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
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Suggestions
              {isGenerating && (
                <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </h3>
            
            {session.suggestions.length > 0 ? (
              <div className="space-y-3">
                {session.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        suggestion.type === 'text' 
                          ? 'bg-green-100 text-green-800' 
                          : suggestion.type === 'style'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {suggestion.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.content}</p>
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full py-2 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-700 text-sm">
                {isGenerating 
                  ? 'Generating suggestions...' 
                  : 'Start typing to get AI-powered creative suggestions'
                }
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Words:</span>
                <span className="font-medium">{session.content.split(' ').filter(w => w.length > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Characters:</span>
                <span className="font-medium">{session.content.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">History:</span>
                <span className="font-medium">{session.history.length} changes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}