import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "A home AI that watches you vs. one that shows its work",
    description: "The same quiet helper, two ways. The surveillance hum acts on signals you never offered — an overheard call, how tense you sounded, who walked in — and leaves no trace. Accountable ambient AI acts only on signals you handed it and logs every change with a reason and an undo. Quiet isn't the same as trustworthy.",
    language: "tsx",
    componentId: "ambient-intelligence-demo",
    code: `'use client';

import React, { useState } from 'react';

type Step = 0 | 1 | 2;

// Step 1 — the surveillance hum: the first line is a signal you offered (your
// alarm); the rest are things it noticed that you never meant to tell it, with
// no record you can inspect or undo.
const HUM = [
  { action: 'Brightened the lights', from: 'your wake-up alarm' },
  { action: 'Turned the music down', from: 'a phone call it overheard' },
  { action: 'Reordered your tea', from: 'how tense you sounded on that call' },
  { action: 'Switched to guest mode', from: 'someone new it noticed in the room' },
];

// Step 2 — accountable ambient: every change traces back to a signal you
// actually handed it, and shows its work with an undo.
const TRACE = [
  { sensed: 'You set a 10:00 PM wind-down', action: 'Dimmed the lights' },
  { sensed: 'Your calendar said focus block', action: 'Silenced notifications' },
  { sensed: 'You opened the blinds each morning', action: 'Opened them at sunrise' },
];

export default function AmbientIntelligenceDemo() {
  const [step, setStep] = useState<Step>(0);

  return (
    <div>
      {step === 1 && (
        <ul>
          {HUM.map((row, i) => (
            <li key={i}>{row.action} — from {row.from}</li>
          ))}
          <li>No record kept. Nothing to look back on.</li>
        </ul>
      )}

      {step === 2 && (
        <ul>
          {TRACE.map((row, i) => (
            <li key={i}>
              {row.action} — because {row.sensed.toLowerCase()} · Undo
            </li>
          ))}
        </ul>
      )}

      {step === 0 && <button onClick={() => setStep(1)}>See what it does for you</button>}
      {step === 1 && <button onClick={() => setStep(2)}>Make it show its work</button>}
      {step === 2 && <button onClick={() => setStep(0)}>Start over</button>}
    </div>
  );
}`
  }
];
