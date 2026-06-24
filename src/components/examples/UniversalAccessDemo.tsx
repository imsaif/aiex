'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Mode = 'overlay' | 'builtin';

/**
 * Universal Access Patterns demo.
 *
 * Embodies the pattern's trap, "the compliance overlay": a bolt-on widget and a
 * footer badge that perform accessibility while the underlying flow stays broken.
 *
 * The same task ("send a message using only your keyboard") is shown two ways:
 *  - "Bolt-on overlay": a visual-only, aria-hidden mockup. The Send control is a
 *    <div>, the field has no label, status is silent, but a widget floats in the
 *    corner and a badge claims WCAG AA. A keyboard / screen-reader user is locked
 *    out. It is rendered as an inert specimen so it never traps a real AT user.
 *  - "Fix the DOM": a real <label>, a real <button>, and an aria-live status
 *    region. Tab reaches the controls, Enter sends, the result is announced.
 */
export default function UniversalAccessDemo() {
  const [mode, setMode] = useState<Mode>('overlay');
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setSent(null);
    setStatus('');
    setDraft('');
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const message = draft.trim();
    if (!message) return;
    setSent(message);
    setDraft('');
    setStatus(`Message sent: ${message}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      {/* Task framing */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-text-primary">
          Task: send a message to the assistant using only your keyboard.
        </p>
        <p className="text-sm text-text-secondary">
          Both versions look accessible. Only one lets a keyboard or screen-reader
          user finish the task. Switch between them and try to Tab to Send, then press Enter.
        </p>
      </div>

      {/* Mode toggle */}
      <div
        role="group"
        aria-label="Choose implementation"
        className="inline-flex rounded-pill border border-border-primary bg-background-secondary p-1"
      >
        {(['overlay', 'builtin'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus ${
              mode === m
                ? 'bg-surface-primary text-text-primary shadow-card'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {m === 'overlay' ? 'Bolt-on overlay' : 'Fix the DOM'}
          </button>
        ))}
      </div>

      {mode === 'overlay' ? (
        <OverlaySpecimen />
      ) : (
        <BuiltinChat
          draft={draft}
          setDraft={setDraft}
          sent={sent}
          status={status}
          onSend={handleSend}
        />
      )}

      {/* AT reality check — real, accessible content describing the surface above */}
      <RealityCheck mode={mode} />
    </div>
  );
}

/**
 * A visual-only mockup of a bolt-on accessibility overlay. The whole block is
 * aria-hidden and contains no focusable elements, so a keyboard / screen-reader
 * user genuinely skips it: nothing here can be reached or activated. That inertia
 * IS the point, and it keeps the demo from trapping a real assistive-tech user.
 */
function OverlaySpecimen() {
  return (
    <div>
      <div
        aria-hidden="true"
        className="relative rounded-card border border-border-primary bg-surface-primary p-4"
      >
        {/* Floating "accessibility" widget — pure decoration */}
        <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent-subtle text-base text-accent-primary shadow-card">
          <span aria-hidden="true">&#9855;</span>
        </div>

        <span className="text-base font-bold text-text-primary">AI Assistant</span>

        <div className="mt-3 rounded-card bg-background-secondary p-3 text-sm text-text-secondary">
          How can I help?
        </div>

        {/* Fake input: a div, not an <input> — no name for a screen reader */}
        <div className="mt-3 flex gap-2">
          <div className="flex-1 rounded-pill border border-border-secondary px-3 py-2 text-sm text-text-tertiary">
            Type message...
          </div>
          {/* Fake Send: a div, not a <button> — no role, no keyboard handler */}
          <div className="rounded-pill bg-accent-subtle px-4 py-2 text-sm font-medium text-accent-primary">
            Send
          </div>
        </div>

        {/* The compliance badge that makes the team think the box is checked */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-pill border border-border-primary bg-background-secondary px-3 py-1">
          <span className="inline-block h-2 w-2 rounded-full bg-status-success" aria-hidden="true" />
          <span className="text-xs font-medium text-text-secondary">WCAG AA Certified</span>
        </div>
      </div>

      <p className="mt-2 text-sm text-text-secondary">
        A mockup of a bolt-on overlay. Try to Tab to its Send button: your focus never
        lands on it, because nothing here is a real control.
      </p>
    </div>
  );
}

interface BuiltinChatProps {
  draft: string;
  setDraft: (value: string) => void;
  sent: string | null;
  status: string;
  onSend: (e: React.FormEvent) => void;
}

/**
 * The same surface built on real semantics: a labelled input, a real button, and
 * an aria-live region. Reachable by keyboard, announced to screen readers, with
 * no badge or widget — access is part of the same DOM everyone uses.
 */
function BuiltinChat({ draft, setDraft, sent, status, onSend }: BuiltinChatProps) {
  return (
    <div className="rounded-card border border-border-primary bg-surface-primary p-4">
      <span className="text-base font-bold text-text-primary">AI Assistant</span>

      <div className="mt-3 space-y-2">
        <div className="rounded-card bg-background-secondary p-3 text-sm text-text-secondary">
          How can I help?
        </div>
        {sent && (
          <div className="ml-auto max-w-[80%] rounded-card bg-accent-subtle p-3 text-sm text-text-primary">
            {sent}
          </div>
        )}
      </div>

      <form onSubmit={onSend} className="mt-3 flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="universal-access-message" className="mb-1 block text-sm font-medium text-text-primary">
            Your message
          </label>
          <input
            id="universal-access-message"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type message..."
            className="w-full rounded-pill border border-border-secondary bg-surface-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus"
          />
        </div>
        <Button type="submit" size="md" aria-label="Send message">
          Send
        </Button>
      </form>

      {/* Live status: announced to screen readers the moment a message sends */}
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-text-secondary">
        {status}
      </p>
    </div>
  );
}

const OVERLAY_CHECKS = [
  { ok: false, text: 'The Send control is a <div>, not a <button>. Keyboard focus skips it and Enter does nothing.' },
  { ok: false, text: 'The input is a <div> with no <label>. A screen reader finds no field to type in.' },
  { ok: false, text: 'Sending is silent. There is no aria-live region, so a screen-reader user never hears it worked.' },
  { ok: true, text: 'But a widget floats in the corner and a footer badge says WCAG AA Certified.' },
];

const BUILTIN_CHECKS = [
  { ok: true, text: 'Send is a real <button> named "Send message". Tab reaches it; Enter and Space activate it.' },
  { ok: true, text: 'The input has a linked <label>, so screen readers announce its name.' },
  { ok: true, text: 'An aria-live region announces "Message sent" the moment it happens.' },
  { ok: true, text: 'No badge, no widget. Access lives in the same DOM everyone uses.' },
];

function RealityCheck({ mode }: { mode: Mode }) {
  const checks = mode === 'overlay' ? OVERLAY_CHECKS : BUILTIN_CHECKS;
  const locked = mode === 'overlay';

  return (
    <div className="rounded-card border border-border-primary bg-background-secondary p-4">
      <h3 className="text-sm font-semibold text-text-primary">
        What an assistive-tech user actually experiences
      </h3>
      <ul className="mt-3 space-y-2">
        {checks.map((check, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border bg-surface-primary text-xs font-bold text-text-primary ${
                check.ok ? 'border-status-success' : 'border-status-error'
              }`}
              aria-hidden="true"
            >
              {check.ok ? '✓' : '✗'}
            </span>
            <span className="text-sm text-text-secondary">
              <span className="sr-only">{check.ok ? 'Pass: ' : 'Fail: '}</span>
              {check.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-medium text-text-primary">
        {locked
          ? 'The badge is checked. The user is still locked out. That is the compliance overlay.'
          : 'No badge to defend, because the task actually works. Access is the product, not a costume on top of it.'}
      </p>
    </div>
  );
}
