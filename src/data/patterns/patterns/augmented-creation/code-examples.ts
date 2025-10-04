import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "AI Writing Assistant Interactive Demo",
    description: "A focused writing assistant that demonstrates augmented creation through real-time suggestions, tone adjustment, and intelligent continuations - showcasing how AI collaborates with users while preserving creative control.",
    language: "tsx",
    componentId: "augmented-creation-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';

interface Suggestion {
  id: string;
  type: 'grammar' | 'style' | 'continuation';
  original: string;
  replacement: string;
  reason: string;
  position: number;
}

interface ContinuationOption {
  id: string;
  text: string;
  tone: 'formal' | 'casual' | 'neutral';
}

export default function AugmentedCreationDemo() {
  const [content, setContent] = useState('I think AI is very good for helping people write better.');
  const [tone, setTone] = useState<'formal' | 'casual' | 'neutral'>('neutral');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [continuations, setContinuations] = useState<ContinuationOption[]>([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate suggestions based on content and tone
  useEffect(() => {
    if (content.length < 5) {
      setSuggestions([]);
      setContinuations([]);
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const newSuggestions: Suggestion[] = [];

      // Detect common phrases that can be improved
      if (content.includes('very good')) {
        newSuggestions.push({
          id: '1',
          type: 'style',
          original: 'very good',
          replacement: tone === 'formal' ? 'highly effective' : tone === 'casual' ? 'awesome' : 'excellent',
          reason: 'Stronger word choice',
          position: content.indexOf('very good')
        });
      }

      if (content.includes('I think')) {
        newSuggestions.push({
          id: '2',
          type: 'style',
          original: 'I think',
          replacement: tone === 'formal' ? 'It is evident that' : tone === 'casual' ? 'Honestly,' : 'Research shows that',
          reason: tone === 'formal' ? 'More authoritative' : 'Better engagement',
          position: content.indexOf('I think')
        });
      }

      setSuggestions(newSuggestions);

      // Generate continuation options
      const continuationOptions: ContinuationOption[] = [
        {
          id: 'c1',
          tone: 'formal',
          text: ' Furthermore, artificial intelligence systems demonstrate remarkable capability in enhancing written communication through contextual analysis.'
        },
        {
          id: 'c2',
          tone: 'casual',
          text: ' Plus, it catches those embarrassing typos and helps you sound way more professional!'
        },
        {
          id: 'c3',
          tone: 'neutral',
          text: ' It can improve clarity, fix grammar mistakes, and suggest better phrasing in real-time.'
        }
      ];

      setContinuations(continuationOptions);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [content, tone]);

  const applySuggestion = (suggestion: Suggestion) => {
    const newContent = content.substring(0, suggestion.position) +
                      suggestion.replacement +
                      content.substring(suggestion.position + suggestion.original.length);
    setContent(newContent);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    setAcceptedCount(prev => prev + 1);
  };

  const applyContinuation = (continuation: ContinuationOption) => {
    setContent(prev => prev + continuation.text);
    setContinuations([]);
    setAcceptedCount(prev => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Writing Assistant</h2>
        <p className="text-gray-600">Real-time suggestions to enhance your writing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Tone Slider */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Writing Tone</label>
              <span className="text-sm text-gray-600 capitalize">{tone}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">Casual</span>
              <input
                type="range"
                min="0"
                max="2"
                value={tone === 'casual' ? 0 : tone === 'neutral' ? 1 : 2}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setTone(value === 0 ? 'casual' : value === 1 ? 'neutral' : 'formal');
                }}
                className="flex-1 accent-blue-600"
              />
              <span className="text-xs text-gray-500">Formal</span>
            </div>
          </div>

          {/* Text Editor */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <span className="text-sm font-medium">Your Content</span>
            </div>
            <textarea
              className="w-full p-4 min-h-[300px] resize-none focus:outline-none"
              placeholder="Start writing... AI will suggest improvements"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Suggestions */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3">AI Suggestions</h3>
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white border rounded p-3">
                    <div className="text-sm mb-2">
                      <span className="line-through text-gray-500">{suggestion.original}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium text-green-700">{suggestion.replacement}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{suggestion.reason}</p>
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-600 italic">
                {isAnalyzing ? 'Analyzing...' : 'Keep writing for suggestions!'}
              </p>
            )}
          </div>

          {/* Continuations */}
          {continuations.length > 0 && content.endsWith('.') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-3">Continue Writing</h3>
              <div className="space-y-2">
                {continuations.map((continuation) => (
                  <button
                    key={continuation.id}
                    onClick={() => applyContinuation(continuation)}
                    className="w-full text-left p-3 bg-white border rounded hover:bg-green-50"
                  >
                    <span className="text-xs font-medium text-green-700 uppercase block mb-1">
                      {continuation.tone}
                    </span>
                    <p className="text-sm text-gray-700">{continuation.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Words:</span>
                <span className="font-medium">{content.split(/\\s+/).filter(w => w).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accepted:</span>
                <span className="font-medium text-green-600">{acceptedCount}</span>
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
