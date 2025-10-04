import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Collaborative AI Workspace",
    description: "A simple example showing how AI can assist teams working together on shared documents by providing suggestions that anyone can apply.",
    language: "tsx",
    componentId: "collaborative-ai-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';

interface Suggestion {
  id: string;
  text: string;
}

const teamMembers = ['Alice 👩‍💼', 'Bob 👨‍💻', 'You 👤'];

export default function CollaborativeAIDemo() {
  const [document, setDocument] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    // Generate AI suggestion when document has content
    if (document.length > 20 && suggestions.length === 0) {
      const timer = setTimeout(() => {
        setSuggestions([
          {
            id: '1',
            text: 'Consider adding specific examples to strengthen your points'
          }
        ]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [document, suggestions.length]);

  const applySuggestion = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion) {
      setDocument(prev => prev + ' [AI suggestion applied]');
      setSuggestions(prev => prev.filter(s => s.id !== id));
    }
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Document</h2>
        <p className="text-gray-600">Collaborate with your team and get AI suggestions</p>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600">Team:</span>
        {teamMembers.map((member, i) => (
          <span key={i} className="text-sm">{member}</span>
        ))}
      </div>

      <textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        placeholder="Start typing to collaborate... AI will suggest improvements"
        className="w-full h-40 p-4 border rounded-lg resize-none"
      />

      {suggestions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-3">🤖 AI Suggestion</h3>
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="space-y-2">
              <p className="text-sm text-gray-700">{suggestion.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => applySuggestion(suggestion.id)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Apply
                </button>
                <button
                  onClick={() => dismissSuggestion(suggestion.id)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`
  }
];
