import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "An ethics gate that can block a ship",
    description: "The same fairness metric shown two ways: a badge that renders no matter what deploys (the ethics-checkbox trap), versus a gate that blocks the release when the selection-rate gap breaches the threshold. The test of responsible AI is whether a value can actually stop a ship.",
    language: "tsx",
    componentId: "responsible-ai-design-demo",
    code: `'use client';

import React, { useState } from 'react';

type Mode = 'badge' | 'gate';

// A résumé-screening model decides who gets an interview. The "responsibility"
// surface is shown two ways. A badge renders no matter what ships (the ethics-
// checkbox trap). A gate wires the fairness metric to a threshold that can
// actually block the release. The test: name the last time a value stopped a ship.
const THRESHOLD = 10; // max allowed selection-rate gap (percentage points)

export default function ResponsibleAiDesignDemo() {
  const [mode, setMode] = useState<Mode>('badge');
  const [gap] = useState(21); // measured selection-rate gap for the chosen model
  const [outcome, setOutcome] = useState<'shipped' | 'blocked' | null>(null);

  function handleDeploy() {
    // THE TRAP vs THE FIX, in one branch:
    // 'badge' never inspects the metric, so a biased model deploys anyway.
    // 'gate' blocks the release when the gap breaches the threshold.
    if (mode === 'gate' && gap > THRESHOLD) {
      setOutcome('blocked');
    } else {
      setOutcome('shipped');
    }
  }

  return (
    <div>
      <ModeToggle mode={mode} onChange={(m) => { setMode(m); setOutcome(null); }} />

      <p>Selection-rate gap: {gap}% / {THRESHOLD}% limit</p>

      {/* The trap: a badge that renders regardless of what deploys */}
      {mode === 'badge' && <span>Responsible AI · reviewed for bias</span>}

      <button type="button" onClick={handleDeploy}>Deploy to production</button>

      <p aria-live="polite">
        {outcome === 'blocked'
          ? 'Release blocked: gap ' + gap + '% exceeds the ' + THRESHOLD + '% limit. A value stopped the ship.'
          : outcome === 'shipped'
            ? 'Deployed to production with a ' + gap + '% gap.'
            : ''}
      </p>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div role="group" aria-label="Choose responsibility surface">
      <button type="button" aria-pressed={mode === 'badge'} onClick={() => onChange('badge')}>
        Ethics badge
      </button>
      <button type="button" aria-pressed={mode === 'gate'} onClick={() => onChange('gate')}>
        Ethics gate
      </button>
    </div>
  );
}`
  }
];
