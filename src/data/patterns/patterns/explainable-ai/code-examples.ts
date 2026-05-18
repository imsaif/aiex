export const codeExamples = [
  {
    title: "Loan-decision explainer",
    description: "The shape of an XAI surface for a high-stakes contestable decision. Ranked drivers (not a flat list), confidence as a sentence (not a number), an explicit appeal exit, and a 'what the model actually did' disclosure that guards against fake transparency.",
    language: "typescript",
    componentId: "explainable-ai-demo",
    code: `'use client';

import React, { useState } from 'react';

interface Driver {
  label: string;
  detail: string;
  direction: 'pos' | 'neg';
}

interface Decision {
  headline: string;          // "Approved", "Conditional", "Declined"
  amount: string;            // "$12,000 at 7.4% APR over 36 months"
  drivers: Driver[];         // RANKED top-first — never a flat list
  confidence: string;        // SENTENCE — "matches 1,200 similar cases", not "0.87"
  modelDisclosure: string;   // What the model actually did (vs. post-hoc rationalization)
  nextSteps: { label: string; rationale: string }[];  // Maps explanation → action
}

export default function LoanDecisionExplainer({ decision }: { decision: Decision }) {
  const [appealed, setAppealed] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 p-6 space-y-5">
      {/* The decision itself */}
      <div>
        <h3 className="text-lg font-semibold">{decision.headline}</h3>
        <p className="text-gray-700">{decision.amount}</p>
      </div>

      {/* Ranked drivers — three, in order of weight, not nine unordered */}
      <section>
        <h4 className="font-semibold mb-1">Why — ranked by weight</h4>
        <p className="text-xs text-gray-500 mb-3">Top driver first. Three, not nine.</p>
        <ol className="space-y-3">
          {decision.drivers.map((d, i) => (
            <li key={i} className="flex gap-3">
              <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <div>
                  <span className="font-medium">{d.label}</span>{' '}
                  <span className={d.direction === 'pos' ? 'text-green-700' : 'text-red-700'}>
                    {d.direction === 'pos' ? 'helped' : 'hurt'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{d.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Legible confidence — a sentence, not a percentage */}
      <section>
        <h4 className="font-semibold mb-2">Confidence — in plain English</h4>
        <p className="text-gray-700">{decision.confidence}</p>
      </section>

      {/* Model disclosure — guards against the "tidy three factors" trap */}
      <section>
        <h4 className="font-semibold mb-2">What the model actually did</h4>
        <p className="text-gray-700">{decision.modelDisclosure}</p>
      </section>

      {/* Actionable next steps — every explanation maps to action */}
      <section>
        <h4 className="font-semibold mb-3">What you can do</h4>
        <ul className="space-y-3">
          {decision.nextSteps.map((n, i) => (
            <li key={i}>
              <div className="font-medium">{n.label}</div>
              <p className="text-sm text-gray-600">{n.rationale}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* The exit — every explanation needs one. A decision the user
          cannot contest is a press release, not transparency. */}
      <div className="border-t pt-5">
        {appealed ? (
          <div className="rounded-lg border p-4">
            <strong>Appeal submitted.</strong> A reviewer will contact you within 2 business days.
          </div>
        ) : (
          <button
            onClick={() => setAppealed(true)}
            className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
          >
            This looks wrong → appeal
          </button>
        )}
      </div>
    </div>
  );
}`
  }
];
