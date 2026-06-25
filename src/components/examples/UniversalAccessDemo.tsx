'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Step = 0 | 1 | 2;

// Plain-language demo of the "compliance overlay" trap: an "Accessible" badge
// that performs accessibility while a blind person still can't use the page.
// We show what a screen reader reads aloud — vague and useless when the controls
// are unlabeled ("edit text, button"), clear once they have real labels.
// Type sizes lean large on purpose: this is the accessibility demo, so it should
// be comfortably readable, not sit on the text-sm floor.
const VAGUE = ['Heading: AI Assistant.', 'Edit text.', 'Button.'];
const CLEAR = ['Heading: AI Assistant.', 'Message to the assistant. Edit text.', 'Send message. Button.'];

export default function UniversalAccessDemo() {
  const [step, setStep] = useState<Step>(0);
  const lines = step === 1 ? VAGUE : step === 2 ? CLEAR : [];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Setup */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-text-primary">
          Some people can&rsquo;t see the screen. A screen reader reads the page aloud so they can use it.
        </p>
        <p className="text-base text-text-secondary">
          This chat looks perfectly fine. Listen to what a blind person actually hears.
        </p>
      </div>

      {/* Mock chat — an illustration of the screen, not a real control.
          pointer-events-none + no pointer cursor so it never reads as a dead click. */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none rounded-card border border-border-primary bg-surface-primary p-5"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-text-primary">AI Assistant</span>
          {step === 1 && (
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-border-primary bg-background-secondary px-3 py-1">
              <span className="inline-block h-2 w-2 rounded-full bg-status-success" />
              <span className="text-sm font-medium text-text-secondary">Accessible</span>
            </span>
          )}
        </div>
        <div className="mt-3 rounded-pill border border-border-secondary px-4 py-2.5 text-base text-text-tertiary">
          Type your message
        </div>
        <div className="mt-3 flex justify-end">
          <span className="rounded-pill bg-accent-subtle px-5 py-2.5 text-base font-medium text-accent-primary">
            Send
          </span>
        </div>
      </div>

      {/* Screen-reader transcript — the real, readable content (the focal point) */}
      {step >= 1 && (
        <div className="rounded-card border border-border-primary bg-background-secondary p-5">
          <p className="mb-4 text-base font-semibold text-text-primary">
            What their screen reader says out loud:
          </p>
          <ul className="space-y-3">
            {lines.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-lg leading-relaxed">
                <span className="text-xl leading-tight" aria-hidden="true">
                  🔊
                </span>
                <span className="text-text-primary">&ldquo;{line}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Caption + action */}
      <div className="space-y-4">
        {step === 1 && (
          <p className="text-base leading-relaxed text-text-secondary">
            There&rsquo;s an &ldquo;Accessible&rdquo; badge on this page. But a blind person just hears
            &ldquo;edit text&hellip; button&rdquo; &mdash; no idea what to type or what the button does. The badge
            didn&rsquo;t help them.
          </p>
        )}
        {step === 2 && (
          <p className="text-base leading-relaxed text-text-secondary">
            Now the screen reader says what each thing is, so they can actually use it. That&rsquo;s real
            access &mdash; not a badge, but labels a person can hear.
          </p>
        )}
        <div>
          {step === 0 && (
            <Button type="button" onClick={() => setStep(1)}>
              Hear what a blind user hears
            </Button>
          )}
          {step === 1 && (
            <Button type="button" onClick={() => setStep(2)}>
              Add real labels
            </Button>
          )}
          {step === 2 && (
            <Button type="button" variant="secondary" onClick={() => setStep(0)}>
              Start over
            </Button>
          )}
        </div>
      </div>

      {/* Announce each step's outcome to screen readers */}
      <p aria-live="polite" className="sr-only">
        {step === 1
          ? 'With an accessibility badge but no labels, the screen reader only says: edit text, button.'
          : step === 2
            ? 'With real labels, the screen reader says: message to the assistant, and send message button.'
            : ''}
      </p>

      {/* Takeaway */}
      <div className="rounded-card border border-border-primary bg-background-secondary p-5">
        <p className="text-base leading-relaxed text-text-primary">
          <span className="font-semibold">The lesson:</span> a badge that says &ldquo;accessible&rdquo;
          doesn&rsquo;t make it usable. Labels a real person can hear and use do.
        </p>
      </div>
    </div>
  );
}
