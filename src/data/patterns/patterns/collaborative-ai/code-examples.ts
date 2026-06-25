import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "A yes-man in the group chat vs. a real teammate",
    description: "A team is converging on a risky call. A yes-man AI just piles on more agreement and the group barrels ahead; a real collaborator holds the context the team missed and helps them decide. Collaborative AI is a participant in the shared decision, not a cheerleader.",
    language: "tsx",
    componentId: "collaborative-ai-demo",
    code: `'use client';

import React, { useState } from 'react';

type Step = 0 | 1 | 2;

// Collaborative AI is AI as a real participant in a TEAM's shared decision. The
// yes-man trap bites in a group: three people already agree, the AI piles on,
// and nobody fills the "wait, are we sure?" role. A real collaborator holds the
// context the team missed and helps them decide.
const TEAM = [
  'Priya: Let us skip user testing and launch Friday',
  'Marco: Love it, I am in!',
  'Dev: Same — let us ship it.',
];

export default function CollaborativeAiDemo() {
  const [step, setStep] = useState<Step>(0);

  const ai =
    step === 1
      ? 'Amazing plan, team — you have got this!' // yes-man: just more agreement
      : step === 2
        ? 'Before we lock it in: we have not tested signup, and Friday is our busiest day. Want me to flag the riskiest paths?' // real collaborator
        : '';

  return (
    <div>
      {TEAM.map((line, i) => (
        <p key={i}>{line}</p>
      ))}

      {step >= 1 && <p>AI teammate: {ai}</p>}

      {step === 0 && <button onClick={() => setStep(1)}>See what the AI adds</button>}
      {step === 1 && <button onClick={() => setStep(2)}>Make it a real collaborator</button>}
      {step === 2 && <button onClick={() => setStep(0)}>Start over</button>}
    </div>
  );
}`
  }
];
