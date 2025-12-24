'use client';

import React, { useState, useEffect, useRef } from 'react';

// Simulated suggestions based on what user types
function getSuggestion(text: string): string | null {
  const lowerText = text.toLowerCase();

  const completions: Record<string, string> = {
    "thanks for": " your email. I'll get back to you shortly.",
    "i wanted to follow up": " on our conversation from last week.",
    "looking forward to": " hearing from you soon.",
    "please let me know": " if you have any questions.",
    "i hope this email finds": " you well.",
    "just wanted to check": " in and see how things are going.",
    "i appreciate": " your help with this matter.",
    "would it be possible": " to schedule a call this week?",
    "as discussed": " in our meeting, here are the next steps.",
    "happy to": " help if you need anything else.",
  };

  for (const [trigger, completion] of Object.entries(completions)) {
    if (lowerText.endsWith(trigger)) {
      return completion;
    }
  }

  return null;
}

export default function ContextualAssistanceDemo() {
  const [text, setText] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  // Get suggestion when text changes
  useEffect(() => {
    const newSuggestion = getSuggestion(text);
    setSuggestion(newSuggestion);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab to accept suggestion
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setText(text + suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="w-full bg-surface-primary border border-primary rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-primary px-8 py-5">
        <h2 className="text-2xl font-semibold text-text-primary">Compose Email</h2>
      </div>

      {/* Email fields */}
      <div className="border-b border-primary px-8 py-4">
        <div className="flex items-center gap-4">
          <span className="text-base text-text-tertiary w-16">To:</span>
          <span className="text-base text-text-primary">colleague@company.com</span>
        </div>
      </div>
      <div className="border-b border-primary px-8 py-4">
        <div className="flex items-center gap-4">
          <span className="text-base text-text-tertiary w-16">Subject:</span>
          <span className="text-base text-text-primary">Quick follow up</span>
        </div>
      </div>

      {/* Compose area with ghost text */}
      <div className="px-8 py-6">
        <div className="relative">
          {/* Mirror div for ghost text */}
          <div
            ref={mirrorRef}
            className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-lg leading-relaxed p-0"
            aria-hidden="true"
          >
            <span className="invisible">{text}</span>
            {suggestion && (
              <span className="text-text-disabled">{suggestion}</span>
            )}
          </div>

          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your message..."
            className="w-full bg-transparent text-text-primary text-lg leading-relaxed resize-none focus:outline-none min-h-[280px] placeholder:text-text-tertiary"
            style={{ caretColor: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Hint */}
      <div className="px-8 py-5 border-t border-primary">
        {suggestion ? (
          <p className="text-base text-text-secondary">
            Press <kbd className="px-2 py-1 bg-surface-secondary border border-secondary rounded text-sm font-mono">Tab</kbd> to accept suggestion
          </p>
        ) : (
          <p className="text-base text-text-tertiary">
            Try typing: "Thanks for" or "Looking forward to"
          </p>
        )}
      </div>
    </div>
  );
}
