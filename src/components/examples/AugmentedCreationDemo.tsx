'use client';

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

  // Generate suggestions based on content
  useEffect(() => {
    if (content.length < 5) {
      setSuggestions([]);
      setContinuations([]);
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      // Grammar and style suggestions
      const newSuggestions: Suggestion[] = [];

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

      // Generate continuation options based on tone
      const continuationOptions: ContinuationOption[] = [
        {
          id: 'c1',
          tone: 'formal',
          text: ' Furthermore, artificial intelligence systems demonstrate remarkable capability in enhancing written communication through contextual analysis and stylistic refinement.'
        },
        {
          id: 'c2',
          tone: 'casual',
          text: ' Plus, it catches those embarrassing typos and helps you sound way more professional without even trying!'
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

  const rejectSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
    setRejectedCount(prev => prev + 1);
  };

  const applyContinuation = (continuation: ContinuationOption) => {
    setContent(prev => prev + continuation.text);
    setContinuations([]);
    setAcceptedCount(prev => prev + 1);
  };

  const renderContentWithHighlights = () => {
    if (suggestions.length === 0) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    let lastIndex = 0;
    const parts: React.ReactElement[] = [];

    // Sort suggestions by position
    const sortedSuggestions = [...suggestions].sort((a, b) => a.position - b.position);

    sortedSuggestions.forEach((suggestion, idx) => {
      // Add text before suggestion
      if (suggestion.position > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {content.substring(lastIndex, suggestion.position)}
          </span>
        );
      }

      // Add highlighted suggestion
      parts.push(
        <span
          key={`suggestion-${idx}`}
          className="relative inline-block group cursor-pointer"
        >
          <span className="line-through text-status-error bg-status-error/10 px-1 rounded-input">
            {suggestion.original}
          </span>
          <span className="text-status-success bg-status-success/10 px-1 ml-1 rounded-input font-medium">
            {suggestion.replacement}
          </span>
          <span className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-64 p-2 bg-text-primary text-surface-primary text-xs rounded-input shadow-elevated z-tooltip">
            {suggestion.reason}
          </span>
        </span>
      );

      lastIndex = suggestion.position + suggestion.original.length;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key="text-end">
          {content.substring(lastIndex)}
        </span>
      );
    }

    return <div className="whitespace-pre-wrap leading-relaxed">{parts}</div>;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-surface-primary rounded-card shadow-card">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">AI Writing Assistant</h2>
        <p className="text-text-secondary">Real-time suggestions to enhance your writing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tone Slider */}
          <div className="bg-surface-secondary border border-border-primary rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-text-secondary">Writing Tone</label>
              <span className="text-sm text-text-secondary capitalize">{tone}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-text-tertiary">Casual</span>
              <input
                type="range"
                min="0"
                max="2"
                value={tone === 'casual' ? 0 : tone === 'neutral' ? 1 : 2}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setTone(value === 0 ? 'casual' : value === 1 ? 'neutral' : 'formal');
                }}
                className="flex-1 h-2 bg-background-tertiary rounded-pill appearance-none cursor-pointer accent-accent-primary"
              />
              <span className="text-xs text-text-tertiary">Formal</span>
            </div>
          </div>

          {/* Text Editor with Inline Suggestions */}
          <div className="border border-border-primary rounded-card overflow-hidden">
            <div className="bg-surface-secondary px-4 py-2 border-b border-border-primary">
              <span className="text-sm font-medium text-text-secondary">Your Content</span>
            </div>
            <div className="bg-surface-primary p-4 min-h-[300px]">
              <textarea
                className="w-full h-full min-h-[250px] resize-none focus:outline-none bg-transparent text-text-primary"
                placeholder="Start writing... AI will suggest improvements as you type"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          {/* Preview with Highlights */}
          {suggestions.length > 0 && (
            <div className="border border-border-primary bg-accent-subtle rounded-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">Preview with Suggestions</h3>
                <span className="text-xs text-accent-primary">Hover over highlights for details</span>
              </div>
              <div className="bg-surface-primary rounded-input p-4 text-text-primary">
                {renderContentWithHighlights()}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with Suggestions and Stats */}
        <div className="space-y-4">
          {/* Active Suggestions */}
          <div className="bg-accent-subtle border border-border-primary rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-text-primary">AI Suggestions</h3>
              {isAnalyzing && (
                <div className="animate-spin rounded-pill h-4 w-4 border-b-2 border-accent-primary"></div>
              )}
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-surface-primary border border-border-primary rounded-input p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium uppercase px-2 py-1 rounded-input ${
                        suggestion.type === 'grammar'
                          ? 'bg-status-error/10 text-status-error'
                          : 'bg-accent-subtle text-accent-primary'
                      }`}>
                        {suggestion.type}
                      </span>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="line-through text-text-tertiary">{suggestion.original}</span>
                      <span className="mx-2">&rarr;</span>
                      <span className="font-medium text-status-success">{suggestion.replacement}</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-3">{suggestion.reason}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="flex-1 px-3 py-1.5 bg-accent-primary text-surface-primary text-xs rounded-input hover:bg-accent-hover transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => rejectSuggestion(suggestion.id)}
                        className="px-3 py-1.5 bg-background-secondary text-text-secondary text-xs rounded-input hover:bg-background-tertiary transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary italic">
                {isAnalyzing ? 'Analyzing...' : 'No suggestions yet. Keep writing!'}
              </p>
            )}
          </div>

          {/* Continuation Options */}
          {continuations.length > 0 && content.endsWith('.') && (
            <div className="bg-surface-secondary border border-border-primary rounded-card p-4">
              <h3 className="font-medium text-text-primary mb-3">Continue Writing</h3>
              <div className="space-y-2">
                {continuations.map((continuation) => (
                  <button
                    key={continuation.id}
                    onClick={() => applyContinuation(continuation)}
                    className="w-full text-left p-3 bg-surface-primary border border-border-primary rounded-input hover:bg-surface-secondary transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-secondary uppercase">
                        {continuation.tone}
                      </span>
                      <svg className="w-4 h-4 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-3">{continuation.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-surface-secondary border border-border-primary rounded-card p-4">
            <h3 className="font-medium text-text-primary mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Words:</span>
                <span className="font-medium text-text-primary">{content.split(/\s+/).filter(w => w.length > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Characters:</span>
                <span className="font-medium text-text-primary">{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Accepted:</span>
                <span className="font-medium text-status-success">{acceptedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Rejected:</span>
                <span className="font-medium text-status-error">{rejectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Active Suggestions:</span>
                <span className="font-medium text-accent-primary">{suggestions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
