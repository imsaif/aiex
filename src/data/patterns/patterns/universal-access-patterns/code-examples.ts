import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Access built in, not bolted on",
    description: "The same task — send a message using only the keyboard — built two ways: a bolt-on overlay that performs accessibility with a badge and a floating widget over div-soup controls, versus real semantics (a labelled input, a real button, an aria-live status region) that a keyboard or screen-reader user can actually operate.",
    language: "tsx",
    componentId: "universal-access-patterns-demo",
    code: `'use client';

import React, { useState } from 'react';

type Mode = 'overlay' | 'builtin';

// The same task — "send a message using only the keyboard" — built two ways.
// The bolt-on overlay performs accessibility (a badge + a floating widget over
// div-soup controls); the real version uses semantics a keyboard or screen
// reader can operate. Access lives in the DOM, not a costume on top of it.
export default function UniversalAccessDemo() {
  const [mode, setMode] = useState<Mode>('overlay');
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setStatus('Message sent: ' + draft.trim());
    setDraft('');
  }

  // THE TRAP: a visual-only mockup. Rendered aria-hidden with no focusable
  // controls, so a keyboard / screen-reader user is genuinely locked out — yet
  // a badge in the corner claims it is compliant. Worse than an honest gap.
  if (mode === 'overlay') {
    return (
      <div>
        <ModeToggle mode={mode} onChange={setMode} />
        <div aria-hidden="true">
          <div>Type message...</div>     {/* a div, not an <input> */}
          <div>Send</div>                {/* a div, not a <button> */}
          <span>WCAG AA Certified</span> {/* the alibi */}
        </div>
        <p>Try to Tab to Send: focus never lands on it. No control is real.</p>
      </div>
    );
  }

  // THE FIX: real semantics. A linked label, a real button, and an aria-live
  // region that announces the result — reachable and operable by assistive tech.
  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />
      <form onSubmit={handleSend}>
        <label htmlFor="msg">Your message</label>
        <input id="msg" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button type="submit" aria-label="Send message">Send</button>
      </form>
      <p aria-live="polite">{status}</p>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div role="group" aria-label="Choose implementation">
      <button type="button" aria-pressed={mode === 'overlay'} onClick={() => onChange('overlay')}>
        Bolt-on overlay
      </button>
      <button type="button" aria-pressed={mode === 'builtin'} onClick={() => onChange('builtin')}>
        Fix the DOM
      </button>
    </div>
  );
}`
  }
];
