import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "An 'accessible' badge vs. labels you can hear",
    description: "A chat that looks fine, heard through a screen reader. With just an 'Accessible' badge the controls read aloud as 'edit text, button' — useless. With real labels they read as 'message to the assistant, send message button.' A badge doesn't make something usable; labels a real person can hear do.",
    language: "tsx",
    componentId: "universal-access-patterns-demo",
    code: `'use client';

import React, { useState } from 'react';

type Step = 0 | 1 | 2;

// An "Accessible" badge doesn't make a page usable. What a blind person's screen
// reader reads aloud is what matters: vague and useless when controls are
// unlabeled, clear once they have real labels.
const VAGUE = ['Heading: AI Assistant.', 'Edit text.', 'Button.'];
const CLEAR = ['Heading: AI Assistant.', 'Message to the assistant. Edit text.', 'Send message. Button.'];

export default function UniversalAccessDemo() {
  const [step, setStep] = useState<Step>(0);
  const lines = step === 1 ? VAGUE : step === 2 ? CLEAR : [];

  return (
    <div>
      <p>This chat looks fine. Here is what a blind person's screen reader says out loud:</p>

      {/* The trap: a sticker that helps no one */}
      {step === 1 && <span>Accessible</span>}

      <ul>
        {lines.map((line, i) => (
          <li key={i}>🔊 "{line}"</li>
        ))}
      </ul>

      {step === 0 && <button onClick={() => setStep(1)}>Hear what a blind user hears</button>}
      {step === 1 && <button onClick={() => setStep(2)}>Add real labels</button>}
      {step === 2 && <button onClick={() => setStep(0)}>Start over</button>}
    </div>
  );
}`
  }
];
