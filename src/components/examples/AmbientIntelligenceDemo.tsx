'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Step = 0 | 1 | 2;

// Plain-language demo of the "surveillance hum" trap: ambient AI that keeps
// widening what it senses, acting on signals the user never offered as input
// (an overheard call, how tense they sounded, who else walked in) and leaving
// no trace they can inspect or undo. Step 1 embodies the trap; step 2 inverts
// it — the same quiet helper, but acting only on signals the user handed it and
// showing its work in a log they can read, undo, and pause.

// Step 1 — the surveillance hum. First line is a signal you offered (your
// alarm); the rest are things it noticed that you never meant to tell it.
const HUM = [
  { action: 'Brightened the lights', from: 'your wake-up alarm', overreach: false },
  { action: 'Turned the music down', from: 'a phone call it overheard', overreach: true },
  { action: 'Reordered your tea', from: 'how tense you sounded on that call', overreach: true },
  { action: 'Switched to “guest” mode', from: 'someone new it noticed in the room', overreach: true },
];

// Step 2 — accountable ambient. Every change traces back to a signal you
// actually handed it, and every row shows its work with an undo.
const TRACE = [
  { sensed: 'You set a 10:00 PM wind-down', action: 'Dimmed the lights', time: '10:00 PM' },
  { sensed: 'Your calendar said “focus block”', action: 'Silenced notifications', time: '2:00 PM' },
  { sensed: 'You opened the blinds each morning this week', action: 'Opened them at sunrise', time: '6:42 AM' },
];

export default function AmbientIntelligenceDemo() {
  const [step, setStep] = useState<Step>(0);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Setup */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-text-primary">
          An AI runs quietly in your home, adjusting things for you. It never asks &mdash; it just
          senses what&rsquo;s going on and acts.
        </p>
        <p className="text-base text-text-secondary">
          That&rsquo;s the appeal. It&rsquo;s also where it can quietly go wrong. Watch what it starts
          noticing.
        </p>
      </div>

      {/* Step 1: the surveillance hum — an activity feed with no trace.
          The card is inert (pointer-events-none) so nothing reads as a dead click;
          the rows stay readable for screen readers. */}
      {step === 1 && (
        <div className="pointer-events-none select-none rounded-card border border-border-primary bg-surface-primary p-5">
          <p className="mb-4 text-base font-semibold text-text-primary">Today, your AI quietly&hellip;</p>
          <ul className="space-y-3">
            {HUM.map((row, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-xl leading-tight" aria-hidden="true">
                  {row.overreach ? '👁️' : '✨'}
                </span>
                <span className="text-base leading-relaxed text-text-primary">
                  {row.action}{' '}
                  <span className="text-text-secondary">&mdash; from {row.from}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border-secondary pt-3 text-sm text-text-tertiary">
            No record kept. Nothing to look back on.
          </p>
        </div>
      )}

      {/* Step 2: accountable ambient — an inspectable activity log with an
          obvious off-switch. Undo / Pause are illustrative chips inside the inert
          card; the trace rows are the readable focal content. */}
      {step === 2 && (
        <div className="pointer-events-none select-none rounded-card border border-border-primary bg-surface-primary p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-base font-semibold text-text-primary">Ambient activity</p>
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-1.5 rounded-pill border border-border-primary bg-background-secondary px-3 py-1"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-status-success" />
              <span className="text-sm font-medium text-text-secondary">Pause anytime</span>
            </span>
          </div>
          <ul className="space-y-3">
            {TRACE.map((row, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 border-b border-border-secondary pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-base leading-relaxed text-text-primary">
                  {row.action}{' '}
                  <span className="text-text-secondary">&mdash; because {row.sensed.toLowerCase()}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-sm text-text-tertiary">{row.time}</span>
                  <span
                    aria-hidden="true"
                    className="rounded-pill bg-accent-subtle px-3 py-1 text-sm font-medium text-accent-primary"
                  >
                    Undo
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Caption + action */}
      <div className="space-y-4">
        {step === 1 && (
          <p className="text-base leading-relaxed text-text-secondary">
            It&rsquo;s acting on things you never told it &mdash; what you said on a call, how you
            sounded, who walked in. And there&rsquo;s nothing to look back at: you can&rsquo;t see what it
            noticed or undo it. Every quiet little adjustment starts to feel like being watched.
          </p>
        )}
        {step === 2 && (
          <p className="text-base leading-relaxed text-text-secondary">
            Now it only acts on things you actually handed it &mdash; your alarm, your calendar, a
            habit you set. And it shows its work: every change, why it made it, with an undo and a way
            to pause. Easy to see, easy to stop.
          </p>
        )}

        <div>
          {step === 0 && (
            <Button type="button" onClick={() => setStep(1)}>
              See what it does for you
            </Button>
          )}
          {step === 1 && (
            <Button type="button" onClick={() => setStep(2)}>
              Make it show its work
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
          ? 'The AI acted on things it was never told — an overheard call, your tone, who was in the room — and kept no record you can inspect or undo.'
          : step === 2
            ? 'The AI now acts only on signals you gave it, and logs every change with a reason and an undo, plus a way to pause it.'
            : ''}
      </p>

      {/* Takeaway */}
      <div className="rounded-card border border-border-primary bg-background-secondary p-5">
        <p className="text-base leading-relaxed text-text-primary">
          <span className="font-semibold">The lesson:</span> quiet isn&rsquo;t the same as trustworthy.
          Ambient AI earns trust by acting only on what you gave it and showing its work &mdash; so you
          can always ask &ldquo;what did you just do, and why?&rdquo; and get a straight answer.
        </p>
      </div>
    </div>
  );
}
