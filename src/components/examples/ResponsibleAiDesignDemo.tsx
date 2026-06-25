'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Step = 0 | 1 | 2;
type Decision = 'interview' | 'rejected' | null;

// The lesson, in plain terms: a badge that says "fair" doesn't make something
// fair — a check that can actually stop the unfair thing does. Told as a short
// story about two equally-qualified people so a non-technical audience feels it.
// Type sizes lean large for comfortable reading, matching the other demos.
export default function ResponsibleAiDesignDemo() {
  const [step, setStep] = useState<Step>(0);

  // step 0: undecided · step 1: AI rejects Maria · step 2: a real check fixes it
  const mariaDecision: Decision = step === 0 ? null : step === 1 ? 'rejected' : 'interview';
  const johnDecision: Decision = step === 0 ? null : 'interview';

  const announce =
    step === 1
      ? 'The AI chose to interview John and reject Maria, with a checked-for-fairness badge.'
      : step === 2
        ? 'A fairness check stopped the unfair decision. Maria and John are both invited to interview.'
        : '';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Setup */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-text-primary">
          An AI helps a company decide who to interview.
        </p>
        <p className="text-base text-text-secondary">
          Two people apply with the exact same experience. Watch what happens.
        </p>
      </div>

      {/* Candidate cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CandidateCard emoji="👩" name="Maria" decision={mariaDecision} />
        <CandidateCard emoji="👨" name="John" decision={johnDecision} />
      </div>
      <p className="text-center text-base text-text-tertiary">Same experience. Both applied.</p>

      {/* The trap: a "fairness" badge that sits next to an unfair result */}
      {step === 1 && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-border-primary bg-background-secondary px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-status-success" aria-hidden="true" />
            <span className="text-sm font-medium text-text-secondary">Checked for fairness</span>
          </span>
        </div>
      )}

      {/* The fix: a real check that stops the unfair result */}
      {step === 2 && (
        <div className="rounded-card border border-border-primary bg-surface-primary p-5 text-center">
          <p className="text-base font-semibold text-text-primary">Hold on — these two are equal.</p>
          <p className="mt-1 text-base text-text-secondary">
            The AI can&rsquo;t reject one and keep the other. Both are invited to interview.
          </p>
        </div>
      )}

      {/* Caption + action */}
      <div className="space-y-4">
        {step === 1 && (
          <p className="text-base leading-relaxed text-text-secondary">
            Same experience &mdash; but Maria&rsquo;s rejected. That badge says this was
            &ldquo;checked for fairness.&rdquo; It&rsquo;s just a sticker. It changed nothing for Maria.
          </p>
        )}
        {step === 2 && (
          <p className="text-base leading-relaxed text-text-secondary">
            A real check actually stopped the unfair decision. That&rsquo;s the whole difference:
            saying you&rsquo;re fair, versus being fair.
          </p>
        )}

        <div>
          {step === 0 && (
            <Button type="button" onClick={() => setStep(1)}>
              See what the AI decides
            </Button>
          )}
          {step === 1 && (
            <Button type="button" onClick={() => setStep(2)}>
              Add a real fairness check
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
        {announce}
      </p>

      {/* Takeaway */}
      <div className="rounded-card border border-border-primary bg-background-secondary p-5">
        <p className="text-base leading-relaxed text-text-primary">
          <span className="font-semibold">The lesson:</span> a badge that says &ldquo;fair&rdquo;
          doesn&rsquo;t make it fair. A check that can stop the unfair thing does.
        </p>
      </div>
    </div>
  );
}

function CandidateCard({
  emoji,
  name,
  decision,
}: {
  emoji: string;
  name: string;
  decision: Decision;
}) {
  const tone =
    decision === 'interview'
      ? 'border-status-success bg-status-success/10'
      : decision === 'rejected'
        ? 'border-status-error bg-status-error/10'
        : 'border-border-primary bg-surface-primary';

  return (
    <div className={`flex items-center gap-3 rounded-card border p-4 transition-colors ${tone}`}>
      <span className="text-3xl" aria-hidden="true">
        {emoji}
      </span>
      <div className="flex-1">
        <span className="block text-base font-semibold text-text-primary">{name}</span>
        <span className="block text-base text-text-secondary">5 years experience</span>
      </div>
      {decision && (
        <span className="text-base font-semibold text-text-primary">
          {decision === 'interview' ? '✓ Interview' : '✗ Rejected'}
        </span>
      )}
    </div>
  );
}
