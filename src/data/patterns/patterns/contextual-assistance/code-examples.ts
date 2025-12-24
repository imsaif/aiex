import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Smart Compose with Inline Suggestions",
    description: "An email composer that shows inline ghost text suggestions as you type, similar to Gmail's Smart Compose. Press Tab to accept.",
    language: "tsx",
    componentId: "contextual-assistance-editor",
    code: `'use client';

import React, { useState, useEffect, useRef } from 'react';

// Simulated suggestions based on what user types
function getSuggestion(text: string): string | null {
  const completions: Record<string, string> = {
    "thanks for": " your email. I'll get back to you shortly.",
    "looking forward to": " hearing from you soon.",
    "please let me know": " if you have any questions.",
    "i hope this email finds": " you well.",
    "would it be possible": " to schedule a call this week?",
  };

  const lowerText = text.toLowerCase();
  for (const [trigger, completion] of Object.entries(completions)) {
    if (lowerText.endsWith(trigger)) {
      return completion;
    }
  }
  return null;
}

export default function SmartCompose() {
  const [text, setText] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    setSuggestion(getSuggestion(text));
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setText(text + suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="relative">
      {/* Ghost text layer */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="invisible">{text}</span>
        {suggestion && <span className="text-gray-400">{suggestion}</span>}
      </div>

      {/* Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent"
        placeholder="Start typing..."
      />
    </div>
  );
}`
  }
];
