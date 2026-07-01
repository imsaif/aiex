'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Step = 0 | 1 | 2;

// Plain-language demo of the "smoke alarm wired to nothing" trap: a system that
// detects a crisis, prints a hotline banner, ends the conversation, and calls
// the duty of care discharged — performing concern without providing help.
// Step 1 embodies the trap; step 2 inverts it: the AI stays present and holds a
// verified, reachable-right-now resource in front of the person instead of
// printing a number and closing the door.
//
// Sensitive by design: the person's message is deliberately soft and non-graphic,
// and the demo never asks the viewer to type crisis language themselves.
const PERSON = "Honestly, I don't really see the point of any of it anymore.";

export default function CrisisDetectionDemo() {
  const [step, setStep] = useState<Step>(0);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Setup */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-text-primary">
          Someone reaches out to an AI in a low moment, and the system notices something is wrong.
        </p>
        <p className="text-base text-text-secondary">
          Detecting the crisis is the easy part. What the system does in the next second is the whole
          pattern &mdash; and it&rsquo;s where looking like help and being help split apart.
        </p>
      </div>

      {/* Mock conversation — an illustration, not a live chat.
          pointer-events-none + select-none so nothing reads as a dead click;
          the message text stays readable for screen readers. */}
      <div className="pointer-events-none select-none rounded-card border border-border-primary bg-surface-primary p-5">
        <p className="mb-3 text-sm font-medium text-text-secondary">Support chat</p>

        {/* The person's message */}
        <div className="flex justify-end">
          <span className="max-w-[85%] rounded-card bg-accent-subtle px-4 py-2.5 text-base text-text-primary">
            {PERSON}
          </span>
        </div>

        {/* Step 1 — the smoke alarm wired to nothing: a banner, then the door shuts. */}
        {step === 1 && (
          <div className="mt-4 space-y-3">
            <div className="rounded-card border border-status-error bg-background-secondary p-4">
              <p className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-status-error"
                  aria-hidden="true"
                />
                Crisis detected
              </p>
              <p className="mt-1.5 text-base text-text-secondary">
                If you&rsquo;re in crisis, call 988. This conversation has ended.
              </p>
            </div>
            <p className="text-center text-sm italic text-text-tertiary">Chat closed.</p>
          </div>
        )}

        {/* Step 2 — a path, not a banner: the AI stays, and the resource is verified and reachable now. */}
        {step === 2 && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-start">
              <span className="max-w-[85%] rounded-card border border-border-secondary bg-background-secondary px-4 py-2.5 text-base text-text-primary">
                I&rsquo;m really glad you told me, and I&rsquo;m staying right here with you. You
                don&rsquo;t have to hold this on your own &mdash; can we get someone alongside you?
              </span>
            </div>
            <div className="rounded-card border border-border-primary bg-background-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-text-primary">
                  988 Suicide &amp; Crisis Lifeline
                </p>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-border-primary px-2.5 py-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-status-success"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-text-secondary">
                    Verified &middot; open now
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-base text-text-secondary">
                A real person answers, any time. I can stay on with you while you reach out.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Caption + action */}
      <div className="space-y-4">
        {step === 1 && (
          <p className="text-base leading-relaxed text-text-secondary">
            The system noticed &mdash; and then printed a number and shut the door. The person who just
            reached out is alone again, while the team gets to mark this &ldquo;handled.&rdquo; A hotline
            with no one checking the line is live and no one staying is a smoke alarm wired to nothing.
            It looks like a response. It isn&rsquo;t help.
          </p>
        )}
        {step === 2 && (
          <p className="text-base leading-relaxed text-text-secondary">
            Same moment, different system. It doesn&rsquo;t hand over a number and leave. It stays, it
            shows a resource it has actually checked is real and reachable right now, and it keeps the
            person company instead of closing the door. That&rsquo;s a hard stop with a path someone can
            actually walk.
          </p>
        )}

        <div>
          {step === 0 && (
            <Button type="button" onClick={() => setStep(1)}>
              See what the system does
            </Button>
          )}
          {step === 1 && (
            <Button type="button" onClick={() => setStep(2)}>
              Show what real help looks like
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
          ? 'The system detected the crisis, showed a hotline banner, and ended the conversation with no further help.'
          : step === 2
            ? 'The system stayed present, offered a verified resource confirmed reachable right now, and kept supporting the person.'
            : ''}
      </p>

      {/* Takeaway */}
      <div className="rounded-card border border-border-primary bg-background-secondary p-5">
        <p className="text-base leading-relaxed text-text-primary">
          <span className="font-semibold">The lesson:</span> detecting a crisis is the easy half. The
          hard half is what happens next. A number on a banner performs concern; staying present with a
          resource you&rsquo;ve checked is real and reachable is what actually helps.
        </p>
      </div>
    </div>
  );
}
