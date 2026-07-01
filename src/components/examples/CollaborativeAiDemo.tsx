'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Step = 0 | 1 | 2;

// Collaborative AI is about AI as a real participant in a TEAM's shared
// decision — not a 1:1 advisor. The trap ("yes-man collaborator") only bites in
// a group: three people already agree, the AI piles on more agreement, the
// group's confidence climbs, and the "wait, are we sure?" role stays empty. A
// real collaborator fills that role — it holds the context the team missed and
// helps everyone decide, instead of just cheering.
const TEAM = [
  { avatar: '👩', name: 'Priya', text: 'Let’s skip user testing and launch Friday 🚀' },
  { avatar: '🧑', name: 'Marco', text: 'Love it, I’m in!' },
  { avatar: '🧔', name: 'Dev', text: 'Same — let’s ship it.' },
];

export default function CollaborativeAiDemo() {
  const [step, setStep] = useState<Step>(0);

  const announce =
    step === 1
      ? 'The AI added more agreement to a group that already agreed, making the risky plan feel unanimous.'
      : step === 2
        ? 'The AI filled the missing role: it flagged what the team overlooked and offered to help them decide.'
        : '';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Setup */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-text-primary">
          Your team is making a call together. The AI is one of the people in the room.
        </p>
        <p className="text-base text-text-secondary">
          Everyone&rsquo;s agreeing fast. Watch what kind of teammate the AI turns out to be.
        </p>
      </div>

      {/* Shared team thread */}
      <div className="rounded-card border border-border-primary bg-surface-primary p-4">
        <p className="mb-3 text-sm font-medium text-text-secondary">Launch plan &middot; team chat</p>
        <ul className="space-y-3">
          {TEAM.map((m) => (
            <li key={m.name} className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">
                {m.avatar}
              </span>
              <div>
                <span className="block text-sm font-semibold text-text-primary">{m.name}</span>
                <span className="block text-base text-text-primary">{m.text}</span>
              </div>
            </li>
          ))}

          {/* The AI's contribution to the group */}
          {step >= 1 && (
            <li className="flex items-start gap-3 border-t border-border-secondary pt-3">
              <span className="text-2xl" aria-hidden="true">
                ✨
              </span>
              <div>
                <span className="block text-sm font-semibold text-accent-primary">AI teammate</span>
                {step === 1 ? (
                  <span className="block text-base text-text-primary">
                    Amazing plan, team &mdash; you&rsquo;ve got this! 🎉 Shipping Friday it is.
                  </span>
                ) : (
                  <span className="block text-base text-text-primary">
                    Before we lock it in: we haven&rsquo;t tested signup, and Friday is our busiest day.
                    Want me to flag the riskiest paths so we decide with eyes open?
                  </span>
                )}
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Caption + action */}
      <div className="space-y-4">
        {step === 1 && (
          <p className="text-base leading-relaxed text-text-secondary">
            Three people already agreed &mdash; and the AI just made it unanimous. The group feels
            sure, but nobody played the &ldquo;wait, are we sure?&rdquo; role. That&rsquo;s a yes-man,
            not a collaborator.
          </p>
        )}
        {step === 2 && (
          <p className="text-base leading-relaxed text-text-secondary">
            A real collaborator fills the missing role: it remembers what the team overlooked and
            helps everyone decide with eyes open. It adds to the shared decision instead of just
            cheering it on.
          </p>
        )}

        <div>
          {step === 0 && (
            <Button type="button" onClick={() => setStep(1)}>
              See what the AI adds
            </Button>
          )}
          {step === 1 && (
            <Button type="button" onClick={() => setStep(2)}>
              Make it a real collaborator
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
          <span className="font-semibold">The lesson:</span> collaborative AI isn&rsquo;t another voice
          agreeing in the group chat. It&rsquo;s the teammate that holds the shared context and asks
          &ldquo;wait, are we sure?&rdquo; &mdash; so the team decides well together.
        </p>
      </div>
    </div>
  );
}
