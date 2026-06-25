import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "A fairness badge vs. a fairness check",
    description: "Two people apply with the same experience. A 'checked for fairness' badge sits next to the AI rejecting one of them and changes nothing — until a real check steps in and stops the unfair decision. Saying you're fair is not the same as being fair.",
    language: "tsx",
    componentId: "responsible-ai-design-demo",
    code: `'use client';

import React, { useState } from 'react';

type Step = 0 | 1 | 2;

// The lesson: a badge that says "fair" doesn't make it fair — a check that can
// actually stop the unfair decision does. Two equally-qualified people apply.
export default function ResponsibleAiDesignDemo() {
  const [step, setStep] = useState<Step>(0);

  // What the AI does to Maria at each step:
  //   step 1 (badge only) -> rejected, while a "fairness" badge sits beside it
  //   step 2 (real check) -> the check stops it, so she is interviewed too
  const maria = step === 0 ? 'pending' : step === 1 ? 'rejected' : 'interview';
  const john = step === 0 ? 'pending' : 'interview';

  return (
    <div>
      <p>Maria and John apply with the exact same experience.</p>

      <Candidate name="Maria" decision={maria} />
      <Candidate name="John" decision={john} />

      {/* The trap: a sticker that sits beside an unfair result and stops nothing */}
      {step === 1 && <span>Checked for fairness</span>}

      {/* The fix: a real check that actually stops the unfair decision */}
      {step === 2 && <p>Hold on — these two are equal. Both are interviewed.</p>}

      {step === 0 && <button onClick={() => setStep(1)}>See what the AI decides</button>}
      {step === 1 && <button onClick={() => setStep(2)}>Add a real fairness check</button>}
      {step === 2 && <button onClick={() => setStep(0)}>Start over</button>}
    </div>
  );
}

function Candidate({ name, decision }: { name: string; decision: string }) {
  return (
    <div>
      {name} — 5 years experience
      {decision === 'rejected' && ' ✗ Rejected'}
      {decision === 'interview' && ' ✓ Interview'}
    </div>
  );
}`
  }
];
