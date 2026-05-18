'use client';

/**
 * Scripted loan-decision scenario. Demonstrates Explainable AI on a high-stakes
 * contestable decision — the inverse of sentiment, which was low-stakes and
 * uncontestable. The demo enacts the four moves from the page's takeaways:
 *  1. Decision maps to actions the user can take.
 *  2. Drivers are ranked, not flat.
 *  3. Confidence is legible ("matches 1,200 similar cases"), not "0.87".
 *  4. Every decision has a visible "this looks wrong → appeal" exit.
 */

import React, { useState } from 'react';

type DecisionKind = 'approve' | 'conditional' | 'decline';

interface Driver {
  label: string;        // "Credit score"
  detail: string;       // "720 — above our 700 threshold for this loan size"
  direction: 'pos' | 'neg';
}

interface ActionableNext {
  label: string;        // "Add a co-signer with credit ≥720"
  rationale: string;    // "Most-likely path to approval given the income gap"
}

interface ScenarioResult {
  kind: DecisionKind;
  headline: string;                 // "Approved" / "Approved with conditions" / "Declined"
  amount: string;                   // "$12,000 at 7.4% APR over 36 months"
  drivers: Driver[];                // Ranked, top-first
  confidence: string;               // Legible sentence — not a number
  modelDisclosure: string;          // What the model actually did — guards against fake transparency
  nextSteps: ActionableNext[];      // What the applicant can actually do
}

interface Scenario {
  id: string;
  label: string;
  profile: string;                  // One-line applicant summary
  request: string;                  // "Auto loan, $12,000"
  result: ScenarioResult;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sarah',
    label: 'Sarah · auto loan',
    profile: '$84,000/yr · credit 720 · 2 yrs at current employer',
    request: 'Auto loan · $12,000 · 36 months',
    result: {
      kind: 'approve',
      headline: 'Approved',
      amount: '$12,000 at 7.4% APR over 36 months',
      drivers: [
        { label: 'Debt-to-income ratio', detail: '18%, well below our 36% ceiling for this product', direction: 'pos' },
        { label: 'Credit score', detail: '720, above our 700 threshold for the requested loan size', direction: 'pos' },
        { label: 'Employment tenure', detail: '24 months, above our 12-month minimum', direction: 'pos' },
      ],
      confidence: 'High confidence. This profile matches ~1,200 approved auto loans in the last 24 months with a 1.2% default rate.',
      modelDisclosure: 'A gradient-boosted model produced this decision from 14 features. The three drivers above account for ~80% of the score. The remaining features (loan-to-value, prior history with us, requested term) were within normal ranges and not load-bearing.',
      nextSteps: [
        { label: 'Accept the offer as presented', rationale: 'No changes recommended. Terms reflect your full profile.' },
        { label: 'Request a longer term to lower monthly payment', rationale: 'Available; will increase total interest paid by ~$340.' },
      ],
    },
  },
  {
    id: 'marcus',
    label: 'Marcus · personal loan',
    profile: '$52,000/yr · credit 690 · 5 yrs at current employer',
    request: 'Personal loan · $18,000 · 48 months',
    result: {
      kind: 'conditional',
      headline: 'Approved with conditions',
      amount: '$15,000 (reduced from $18,000) at 11.9% APR over 48 months',
      drivers: [
        { label: 'Requested amount vs income', detail: 'Loan-to-income at requested level is 34.6%, above our 30% comfort band; reducing to $15k brings it to 28.8%.', direction: 'neg' },
        { label: 'Employment tenure', detail: '60 months, strong stability signal, the reason the loan was not declined outright', direction: 'pos' },
        { label: 'Credit score', detail: '690, within our acceptable band for this product but priced at the upper end of the APR range', direction: 'neg' },
      ],
      confidence: 'Moderate confidence. ~430 similar profiles in the last 24 months; 78% accepted the reduced amount and the default rate on that cohort is 3.1%.',
      modelDisclosure: 'The reduction is a hard rule, not a model output: any request above 30% of annual income is auto-reduced to the 28-30% band. The APR was set by the credit-score band, not by the model.',
      nextSteps: [
        { label: 'Accept the $15,000 offer', rationale: 'No additional documentation required.' },
        { label: 'Reapply for $18,000 with a co-signer (credit ≥720)', rationale: 'Bypasses the loan-to-income rule; typical approval in 1–2 business days.' },
        { label: 'Provide proof of additional income (e.g., spouse, 1099)', rationale: 'If verified income reaches $60k, the full $18,000 is approvable at the same APR.' },
      ],
    },
  },
  {
    id: 'priya',
    label: 'Priya · auto loan',
    profile: '$61,000/yr · credit 645 · 8 months at current employer',
    request: 'Auto loan · $25,000 · 60 months',
    result: {
      kind: 'decline',
      headline: 'Declined',
      amount: 'No offer at the requested amount',
      drivers: [
        { label: 'Employment tenure', detail: '8 months, below our 12-month minimum for loans over $20,000', direction: 'neg' },
        { label: 'Credit score', detail: '645, below our 660 floor for loans over $20,000 without additional security', direction: 'neg' },
        { label: 'Debt-to-income ratio', detail: '41% with current obligations, above our 36% ceiling', direction: 'neg' },
      ],
      confidence: 'High confidence in the decline, low confidence that nothing here is approvable. Roughly 1-in-4 declined profiles like this get approved after the steps below.',
      modelDisclosure: 'This decline is driven by three hard rules (employment minimum, credit floor for loan size, DTI ceiling), not a model probability. A model score was computed but is not the basis for the decline; we are telling you the rules instead of a number so you know what to change.',
      nextSteps: [
        { label: 'Reapply for an amount under $20,000', rationale: 'Drops the credit-score floor to 640 and the employment minimum to 6 months. Both currently met.' },
        { label: 'Reapply in 4 months', rationale: 'Will clear the 12-month employment minimum; credit and DTI must still meet the >$20k thresholds.' },
        { label: 'Reapply with a co-signer (credit ≥700, DTI ≤25%)', rationale: 'Bypasses all three driving factors.' },
      ],
    },
  },
];

const KIND_META: Record<DecisionKind, { ring: string; chip: string; chipLabel: string }> = {
  approve:     { ring: 'border-status-success/40', chip: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',   chipLabel: 'Approved' },
  conditional: { ring: 'border-status-warning/40', chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',   chipLabel: 'Conditional' },
  decline:     { ring: 'border-status-error/40',   chip: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',           chipLabel: 'Declined' },
};

type DisclosureKey = 'why' | 'confidence' | 'how' | 'next';

interface DisclosureDef {
  key: DisclosureKey;
  prompt: (kind: DecisionKind) => string;   // what the user asks
  hint: string;                              // tiny subline above the row
}

const DISCLOSURES: DisclosureDef[] = [
  {
    key: 'why',
    prompt: (k) => k === 'decline' ? 'Why was this declined?' : k === 'conditional' ? 'Why the change?' : 'Why was this approved?',
    hint: 'Drivers, ranked. Top first',
  },
  {
    key: 'confidence',
    prompt: () => 'How confident is this?',
    hint: 'Confidence in plain English, not a percent',
  },
  {
    key: 'next',
    prompt: () => 'What can I do now?',
    hint: 'Every explanation should map to an action',
  },
  {
    key: 'how',
    prompt: () => 'How was this actually decided?',
    hint: 'Model disclosure: guards against fake transparency',
  },
];

export default function ExplainableAiDemo() {
  const [activeId, setActiveId] = useState<string>(SCENARIOS[0].id);
  const [opened, setOpened] = useState<Record<string, Set<DisclosureKey>>>({});
  const [appealed, setAppealed] = useState<Record<string, boolean>>({});

  const scenario = SCENARIOS.find(s => s.id === activeId) ?? SCENARIOS[0];
  const meta = KIND_META[scenario.result.kind];
  const isAppealed = !!appealed[scenario.id];
  const openedSet = opened[scenario.id] ?? new Set<DisclosureKey>();

  const toggle = (key: DisclosureKey) => {
    setOpened(prev => {
      const next = new Set(prev[scenario.id] ?? []);
      if (next.has(key)) next.delete(key); else next.add(key);
      return { ...prev, [scenario.id]: next };
    });
  };

  const pickScenario = (id: string) => {
    setActiveId(id);
  };

  return (
    <div className="w-full bg-surface-primary border border-primary rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-primary px-6 py-5">
        <h3 className="text-xl font-semibold text-text-primary">Loan decision, explained</h3>
        <p className="text-sm text-text-secondary mt-1">
          Pick a profile, then pull the parts of the explanation you want. The decision is the answer. Depth is opt-in.
        </p>
      </div>

      {/* Step 1 — scenario picker */}
      <div className="px-6 pt-5">
        <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">1 · Pick an applicant</div>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map(s => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => pickScenario(s.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                  active
                    ? 'bg-accent-primary text-white border-accent-primary'
                    : 'bg-surface-primary text-text-secondary border-secondary hover:border-primary hover:text-text-primary'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pt-5 pb-6 space-y-5">
        {/* Applicant + request — compact */}
        <div className="bg-surface-secondary border border-primary rounded-xl p-4">
          <div className="text-text-primary text-sm font-medium">{scenario.profile}</div>
          <div className="text-sm text-text-secondary mt-0.5">{scenario.request}</div>
        </div>

        {/* The decision — always visible. This is the "answer". */}
        <div>
          <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">2 · The decision</div>
          <div className={`bg-surface-secondary border-2 ${meta.ring} rounded-xl p-5`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${meta.chip}`}>{meta.chipLabel}</span>
              <h4 className="text-lg font-semibold text-text-primary">{scenario.result.headline}</h4>
            </div>
            <p className="text-text-primary">{scenario.result.amount}</p>
          </div>
        </div>

        {/* Step 3 — pull-on-demand disclosures. The pattern in action. */}
        <div>
          <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">
            3 · Ask what you want to know
          </div>
          <div className="space-y-2">
            {DISCLOSURES.map(({ key, prompt, hint }) => {
              const open = openedSet.has(key);
              return (
                <div key={key} className="bg-surface-secondary border border-primary rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggle(key)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-background-secondary transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-text-primary font-medium">{prompt(scenario.result.kind)}</div>
                      <div className="text-xs text-text-tertiary mt-0.5">{hint}</div>
                    </div>
                    <svg
                      className={`flex-shrink-0 h-5 w-5 text-text-secondary transition-transform ${open ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {open && (
                    <div className="px-4 pb-4 pt-1 border-t border-primary">
                      {key === 'why' && (
                        <ol className="space-y-3 mt-3">
                          {scenario.result.drivers.map((d, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-background-secondary border border-secondary flex items-center justify-center text-xs font-semibold text-text-secondary mt-0.5">
                                {i + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-text-primary font-medium">{d.label}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    d.direction === 'pos'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {d.direction === 'pos' ? 'helped' : 'hurt'}
                                  </span>
                                </div>
                                <p className="text-sm text-text-secondary mt-0.5">{d.detail}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      )}

                      {key === 'confidence' && (
                        <p className="text-text-secondary mt-3">{scenario.result.confidence}</p>
                      )}

                      {key === 'next' && (
                        <ul className="space-y-3 mt-3">
                          {scenario.result.nextSteps.map((n, i) => (
                            <li key={i}>
                              <div className="text-text-primary font-medium">{n.label}</div>
                              <p className="text-sm text-text-secondary mt-0.5">{n.rationale}</p>
                            </li>
                          ))}
                        </ul>
                      )}

                      {key === 'how' && (
                        <p className="text-text-secondary mt-3">{scenario.result.modelDisclosure}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* The exit — always available, regardless of how deep the user went */}
        <div>
          <div className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">4 · Disagree?</div>
          {isAppealed ? (
            <div className="bg-surface-secondary border border-primary rounded-lg p-4 flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-status-success/20 text-status-success flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</div>
              <div>
                <div className="text-text-primary font-medium">Appeal submitted.</div>
                <p className="text-sm text-text-secondary mt-0.5">
                  A reviewer will contact you within 2 business days with the specific drivers they re-examined.
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAppealed(prev => ({ ...prev, [scenario.id]: true }))}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium border border-primary rounded-lg text-text-primary hover:bg-background-secondary transition-colors cursor-pointer"
            >
              This looks wrong → appeal to a human reviewer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
