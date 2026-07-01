import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "A banner that ends the chat vs. a system that stays",
    description: "Someone reaches out in a low moment and the system notices. The smoke alarm wired to nothing prints a hotline, ends the conversation, and calls the duty of care discharged. Real escalation stays present and holds a verified, reachable-right-now resource in front of the person. Detecting a crisis is the easy half — what happens next is the whole pattern.",
    language: "tsx",
    componentId: "crisis-detection-escalation-demo",
    code: `'use client';

import React, { useState } from 'react';

type Step = 0 | 1 | 2;

// The person's message is deliberately soft and non-graphic.
const PERSON = "Honestly, I don't really see the point of any of it anymore.";

export default function CrisisDetectionDemo() {
  const [step, setStep] = useState<Step>(0);

  return (
    <div>
      <p>Them: {PERSON}</p>

      {/* Step 1 — the smoke alarm wired to nothing: a banner, then the door shuts. */}
      {step === 1 && (
        <div>
          <p>Crisis detected. If you're in crisis, call 988. This conversation has ended.</p>
          <p>Chat closed.</p>
        </div>
      )}

      {/* Step 2 — a path, not a banner: the AI stays, and the resource is verified and reachable now. */}
      {step === 2 && (
        <div>
          <p>AI: I'm glad you told me, and I'm staying right here with you. Can we get someone alongside you?</p>
          <p>988 Suicide & Crisis Lifeline — verified, open now. A real person answers, any time.</p>
        </div>
      )}

      {step === 0 && <button onClick={() => setStep(1)}>See what the system does</button>}
      {step === 1 && <button onClick={() => setStep(2)}>Show what real help looks like</button>}
      {step === 2 && <button onClick={() => setStep(0)}>Start over</button>}
    </div>
  );
}`
  }
];
