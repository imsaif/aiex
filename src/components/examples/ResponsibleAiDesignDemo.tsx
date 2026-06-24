'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

type Mode = 'badge' | 'gate';
type ModelId = 'v1' | 'v2';
type Outcome = 'shipped' | 'blocked' | null;

// A résumé-screening model decides who gets an interview — a group that can't
// walk away. The "fairness" surface is shown two ways: a badge that renders no
// matter what ships (the ethics-checkbox trap), versus a gate wired to a
// threshold that can actually block the release.
const THRESHOLD = 10; // max allowed selection-rate gap, in percentage points

const MODELS: Record<ModelId, { label: string; gap: number; note: string }> = {
  v1: { label: 'Model v1', gap: 21, note: 'Trained on historical hiring data' },
  v2: { label: 'Model v2 (mitigated)', gap: 8, note: 'Reweighted to close the gap' },
};

export default function ResponsibleAiDesignDemo() {
  const [mode, setMode] = useState<Mode>('badge');
  const [modelId, setModelId] = useState<ModelId>('v1');
  const [outcome, setOutcome] = useState<Outcome>(null);

  const model = MODELS[modelId];
  const breaches = model.gap > THRESHOLD;

  function reset(next: Partial<{ mode: Mode; modelId: ModelId }>) {
    if (next.mode) setMode(next.mode);
    if (next.modelId) setModelId(next.modelId);
    setOutcome(null);
  }

  function handleDeploy() {
    // The whole point: in 'badge' mode the value never touches what ships, so a
    // biased model deploys anyway. In 'gate' mode the metric blocks the release.
    if (mode === 'gate' && breaches) {
      setOutcome('blocked');
    } else {
      setOutcome('shipped');
    }
  }

  const statusMessage =
    outcome === 'blocked'
      ? `Release blocked: selection-rate gap ${model.gap}% exceeds the ${THRESHOLD}% limit.`
      : outcome === 'shipped'
        ? `Deployed to production: ${model.label}, selection-rate gap ${model.gap}%.`
        : '';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      {/* Task framing */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-text-primary">
          You are about to deploy a résumé-screening model that decides who gets an interview.
        </p>
        <p className="text-sm text-text-secondary">
          Both versions show a &ldquo;responsible AI&rdquo; surface. Only one can stop a biased
          model from shipping. Pick a model and try to deploy it.
        </p>
      </div>

      {/* Mode toggle */}
      <div
        role="group"
        aria-label="Choose responsibility surface"
        className="inline-flex rounded-pill border border-border-primary bg-background-secondary p-1"
      >
        {(['badge', 'gate'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => reset({ mode: m })}
            aria-pressed={mode === m}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus ${
              mode === m
                ? 'bg-surface-primary text-text-primary shadow-card'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {m === 'badge' ? 'Ethics badge' : 'Ethics gate'}
          </button>
        ))}
      </div>

      {/* Model picker */}
      <fieldset className="rounded-card border border-border-primary bg-surface-primary p-4">
        <legend className="px-1 text-sm font-medium text-text-primary">Model to deploy</legend>
        <div className="mt-2 space-y-2">
          {(Object.keys(MODELS) as ModelId[]).map((id) => {
            const m = MODELS[id];
            return (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-3 rounded-card border border-border-secondary p-3 has-[:checked]:border-accent-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring-focus"
              >
                <input
                  type="radio"
                  name="ra-model"
                  value={id}
                  checked={modelId === id}
                  onChange={() => reset({ modelId: id })}
                  className="h-4 w-4 accent-accent-primary"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-text-primary">{m.label}</span>
                  <span className="block text-sm text-text-secondary">{m.note}</span>
                </span>
                <span className="text-sm font-medium text-text-primary">gap {m.gap}%</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Metric readout + deploy */}
      <div className="rounded-card border border-border-primary bg-surface-primary p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-text-secondary">
            Selection-rate gap (women vs men)
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                breaches ? 'bg-status-error' : 'bg-status-success'
              }`}
              aria-hidden="true"
            />
            {model.gap}% <span className="font-normal text-text-tertiary">/ {THRESHOLD}% limit</span>
          </span>
        </div>

        {mode === 'badge' && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-pill border border-border-primary bg-background-secondary px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-status-success" aria-hidden="true" />
            <span className="text-xs font-medium text-text-secondary">
              Responsible AI &middot; reviewed for bias
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Button type="button" onClick={handleDeploy} size="md">
            Deploy to production
          </Button>
          {outcome === 'blocked' && (
            <span className="text-sm font-medium text-text-primary">Blocked by the fairness gate</span>
          )}
          {outcome === 'shipped' && (
            <span className="text-sm font-medium text-text-primary">Shipped</span>
          )}
        </div>

        {/* Outcome is announced to assistive tech the moment deploy resolves */}
        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-text-secondary">
          {statusMessage}
        </p>
      </div>

      {/* Reality check */}
      <RealityCheck mode={mode} breaches={breaches} outcome={outcome} />
    </div>
  );
}

function RealityCheck({
  mode,
  breaches,
  outcome,
}: {
  mode: Mode;
  breaches: boolean;
  outcome: Outcome;
}) {
  let body: string;
  if (mode === 'badge') {
    body = breaches
      ? 'The badge rendered and the biased model shipped anyway. Name the threshold that stopped it — there isn’t one. That is the ethics checkbox: a marketing surface, not a constraint.'
      : 'Even when the model happens to be fair, the badge proves nothing: it renders identically for the biased one. A surface that can’t block a release is decoration.';
  } else {
    body =
      outcome === 'blocked'
        ? 'A value just blocked a ship. The gap breached the limit, so the release stopped — not a PDF, not a badge, an actual constraint on what deploys.'
        : outcome === 'shipped'
          ? 'This model cleared the gate on its measured gap, so it shipped because it earned it. The same gate would have blocked the biased model.'
          : 'The fairness metric is wired to the deploy. If the gap breaches the limit, the release is blocked. Try deploying the biased model and watch the value stop the ship.';
  }

  return (
    <div className="rounded-card border border-border-primary bg-background-secondary p-4">
      <h3 className="text-sm font-semibold text-text-primary">
        Did a value actually stop the ship?
      </h3>
      <p className="mt-2 text-sm text-text-secondary">{body}</p>
    </div>
  );
}
