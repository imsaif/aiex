'use client';

import React, { useState } from 'react';

type LearnedRule = { id: string; rule: string; type: 'permanent' | 'once'; confidence: number };
type Reflection = { tone: 'learn' | 'forget' | 'neutral'; text: string };
type Step = { id: string; task: string; defaultAction: string; why: string; correctionLabel: string; rule: string; type: 'permanent' | 'once'; ack: string };

// A guided, three-step loop. The user corrects an AI assistant's proposals and
// watches it (1) acknowledge the correction *specifically*, (2) record a rule it
// will reuse, and (3) APPLY what it learned on the final proposal without being
// asked. The last step is the payoff: proof the agent reflected and changed.
const STEPS: Step[] = [
  {
    id: 'timing',
    task: 'Schedule the project kickoff',
    defaultAction: 'Book it for 9:00 AM tomorrow',
    why: 'No timing preference learned yet, so I am using the default.',
    correctionLabel: 'I prefer meetings after 10 AM',
    rule: 'Schedule meetings after 10 AM',
    type: 'permanent',
    ack: "Noted. I'll schedule meetings after 10 AM from now on, not at 9.",
  },
  {
    id: 'recipients',
    task: 'Send the kickoff invite',
    defaultAction: 'Invite the entire team (12 people)',
    why: 'No recipient preference learned yet, so I am using the default.',
    correctionLabel: 'Only invite direct stakeholders',
    rule: 'Invite direct stakeholders only',
    type: 'permanent',
    ack: "Got it. I'll invite only direct stakeholders, not the whole team.",
  },
];

function AgentReflectionLearningDemo() {
  // step 0,1 = teaching steps; 2 = review (agent applies learning); 3 = done
  const [step, setStep] = useState(0);
  // phase within a step: 'proposing' | 'choosing' | 'resolved'
  const [phase, setPhase] = useState<'proposing' | 'choosing' | 'resolved'>('proposing');
  const [learned, setLearned] = useState<LearnedRule[]>([]);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const has = (id: string) => learned.some((l) => l.id === id);

  const reset = () => {
    setStep(0);
    setPhase('proposing');
    setLearned([]);
    setReflection(null);
    setHighlightId(null);
  };

  const teach = (s: Step) => {
    setLearned((prev) => {
      // Re-teaching an existing rule raises confidence instead of duplicating it.
      if (prev.some((p) => p.id === s.id)) {
        return prev.map((p) =>
          p.id === s.id ? { ...p, confidence: Math.min(p.confidence + 12, 99) } : p
        );
      }
      return [{ id: s.id, rule: s.rule, type: s.type, confidence: 78 }, ...prev];
    });
    setHighlightId(s.id);
    setReflection({ tone: 'learn', text: s.ack });
    setPhase('resolved');
  };

  const approveDefault = () => {
    setReflection({ tone: 'neutral', text: 'Approved as proposed. Nothing new to learn here.' });
    setPhase('resolved');
  };

  const advance = () => {
    setReflection(null);
    setHighlightId(null);
    setStep((s) => s + 1);
    setPhase('proposing');
  };

  const forget = (item: LearnedRule) => {
    setLearned((prev) => prev.filter((l) => l.id !== item.id));
    setReflection({ tone: 'forget', text: `Removed "${item.rule}". I'll ask about this again instead of assuming.` });
  };

  const approveReview = () => {
    setReflection({
      tone: appliedCount > 0 ? 'learn' : 'neutral',
      text:
        appliedCount > 0
          ? `I applied ${appliedCount} learned preference${appliedCount > 1 ? 's' : ''} on my own. That is the payoff: you stop repeating yourself.`
          : 'Nothing was learned this session, so I kept guessing. Run it again and correct me to see the difference.',
    });
    setPhase('resolved');
  };

  // ----- Review step (the payoff): agent proposes using what it learned -----
  const reviewTime = has('timing') ? '10:30 AM' : '9:30 AM';
  const reviewAudience = has('recipients') ? 'direct stakeholders only' : 'the entire team';
  const appliedCount = (has('timing') ? 1 : 0) + (has('recipients') ? 1 : 0);

  const tone = reflection?.tone;
  const reflectionStyles =
    tone === 'learn'
      ? 'border-status-success/40 bg-status-success/10'
      : tone === 'forget'
      ? 'border-status-warning/40 bg-status-warning/10'
      : 'border-border-primary bg-surface-secondary';
  const reflectionDot =
    tone === 'learn' ? 'bg-status-success' : tone === 'forget' ? 'bg-status-warning' : 'bg-text-tertiary';

  const current = STEPS[step];

  return (
    <div className="bg-background-primary p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-primary border border-border-primary rounded-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-text-secondary uppercase tracking-wide mb-1.5">Interactive demo</p>
              <h2 className="text-xl md:text-2xl font-semibold text-text-primary">Teach the assistant</h2>
            </div>
            <button onClick={reset} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Reset
            </button>
          </div>
          <p className="text-base text-text-secondary leading-relaxed mb-8 max-w-2xl">
            Correct the assistant&apos;s proposals below. Watch it confirm exactly what changed, remember the rule, and
            apply it on its own in the final step.
          </p>

          {/* Progress */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {['Teach timing', 'Teach recipients', 'Watch it apply'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${
                    i < step
                      ? 'border-status-success/40 bg-status-success/10 text-text-primary'
                      : i === step
                      ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                      : 'border-border-primary text-text-secondary'
                  }`}
                >
                  <span className="font-medium">{i + 1}</span>
                  <span>{label}</span>
                </div>
                {i < 2 && <span className="text-text-secondary">→</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
            {/* Left: the interaction */}
            <div className="md:col-span-3">
              {/* Teaching steps 0 and 1 */}
              {step < 2 && (
                <div className="border border-border-secondary bg-surface-secondary rounded-lg p-5 md:p-6">
                  <p className="text-sm text-text-secondary mb-2">The assistant wants to: {current.task}</p>
                  <p className="text-lg text-text-primary font-semibold mb-2">{current.defaultAction}</p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">Why: {current.why}</p>

                  {phase === 'proposing' && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={approveDefault}
                        className="px-4 py-2 text-sm font-medium border border-border-primary text-text-secondary rounded-md hover:text-text-primary transition-colors"
                      >
                        Looks right
                      </button>
                      <button
                        onClick={() => setPhase('choosing')}
                        className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity"
                      >
                        Correct it
                      </button>
                    </div>
                  )}

                  {phase === 'choosing' && (
                    <div>
                      <p className="text-sm text-text-secondary mb-2">Tell the assistant what to do instead:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => teach(current)}
                          className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity"
                        >
                          {current.correctionLabel}
                        </button>
                        <button
                          onClick={() => setPhase('proposing')}
                          className="px-4 py-2 text-sm font-medium border border-border-primary text-text-secondary rounded-md hover:text-text-primary transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}

                  {phase === 'resolved' && (
                    <div>
                      <div className={`flex items-start gap-3 rounded-lg border p-4 mb-5 ${reflectionStyles}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${reflectionDot}`} />
                        <div>
                          <p className="text-sm text-text-secondary mb-0.5">Assistant reflected</p>
                          <p className="text-sm text-text-primary">{reflection?.text}</p>
                        </div>
                      </div>
                      <button
                        onClick={advance}
                        className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity"
                      >
                        Continue →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Review step 2: the agent applies what it learned */}
              {step === 2 && (
                <div className="border border-border-secondary bg-surface-secondary rounded-lg p-5 md:p-6">
                  <p className="text-sm text-text-secondary mb-2">The assistant wants to: Schedule the design review</p>
                  <p className="text-lg text-text-primary font-semibold mb-2 leading-relaxed">
                    Book it for{' '}
                    <span className={has('timing') ? 'font-semibold underline decoration-status-success decoration-2 underline-offset-4' : ''}>{reviewTime}</span> and invite{' '}
                    <span className={has('recipients') ? 'font-semibold underline decoration-status-success decoration-2 underline-offset-4' : ''}>{reviewAudience}</span>
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {appliedCount > 0
                      ? `Applying ${appliedCount} preference${appliedCount > 1 ? 's' : ''} you taught me, without being asked.`
                      : 'You taught me nothing, so I am repeating the same defaults. This is what reflection prevents.'}
                  </p>

                  {phase === 'proposing' && (
                    <button
                      onClick={approveReview}
                      className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity"
                    >
                      Approve
                    </button>
                  )}

                  {phase === 'resolved' && (
                    <div>
                      <div className={`flex items-start gap-3 rounded-lg border p-4 mb-5 ${reflectionStyles}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${reflectionDot}`} />
                        <div>
                          <p className="text-sm text-text-secondary mb-0.5">Assistant reflected</p>
                          <p className="text-sm text-text-primary">{reflection?.text}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setStep(3);
                          setReflection(null);
                        }}
                        className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity"
                      >
                        See what changed
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Done */}
              {step === 3 && (
                <div className="border border-border-primary rounded-lg p-5 md:p-6">
                  <p className="text-lg font-semibold text-text-primary mb-2">
                    This session you taught the assistant {learned.length} preference
                    {learned.length === 1 ? '' : 's'}.
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    It confirmed each one specifically, kept them in view, and applied them on the next task on its own.
                    That visible loop is what builds trust over repeated corrections.
                  </p>
                  <button
                    onClick={reset}
                    className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    Start over
                  </button>
                </div>
              )}
            </div>

            {/* Right: what the assistant has learned (always visible) */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-text-secondary uppercase tracking-wide">What it has learned</p>
                <span className="text-sm text-text-secondary">{learned.length}/3</span>
              </div>

              {learned.length === 0 ? (
                <div className="border border-dashed border-border-primary rounded-lg p-8 text-center">
                  <p className="text-sm text-text-secondary">
                    Nothing yet. Correct a proposal to teach it a rule it will reuse.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {learned.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        item.id === highlightId
                          ? 'border-status-success bg-status-success/10'
                          : 'border-border-primary bg-surface-secondary'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm text-text-primary">{item.rule}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-sm px-1.5 py-0.5 rounded ${
                                item.type === 'permanent'
                                  ? 'bg-accent-primary/10 text-text-primary'
                                  : 'bg-status-warning/10 text-text-primary'
                              }`}
                            >
                              {item.type === 'permanent' ? 'Permanent rule' : 'Just this once'}
                            </span>
                            {item.id === highlightId && (
                              <span className="text-sm font-medium text-text-primary">· new</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => forget(item)}
                          className="text-lg leading-none px-1.5 -mt-0.5 text-text-secondary hover:text-status-error transition-colors shrink-0"
                          aria-label={`Forget rule: ${item.rule}`}
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 bg-border-primary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-primary rounded-full transition-all duration-700"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-secondary">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-text-secondary mt-1">
                    You can delete anything the assistant learned. It will ask again instead of assuming.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentReflectionLearningDemo;
