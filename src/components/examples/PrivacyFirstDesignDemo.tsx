'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Feature {
  id: string;
  name: string;
  benefit: string;
  // Data this feature sends to the server when enabled. Empty = runs on-device.
  collects: string[];
  onDevice: boolean;
  tradeoff: string;
  enabled: boolean;
}

const INITIAL_FEATURES: Feature[] = [
  {
    id: 'draft',
    name: 'Draft assistant',
    benefit: 'Suggests phrasing as you type',
    collects: [],
    onDevice: true,
    tradeoff: 'You write without inline suggestions',
    enabled: true,
  },
  {
    id: 'memory',
    name: 'Conversation memory',
    benefit: 'Remembers context across chats',
    collects: ['Your messages'],
    onDevice: false,
    tradeoff: 'Each chat starts fresh',
    enabled: false,
  },
  {
    id: 'personalize',
    name: 'Personalized suggestions',
    benefit: 'Tailors results to how you work',
    collects: ['What you click', 'Your preferences'],
    onDevice: false,
    tradeoff: 'Everyone sees the same generic results',
    enabled: false,
  },
  {
    id: 'sync',
    name: 'Cross-device sync',
    benefit: 'Pick up where you left off anywhere',
    collects: ['All your activity'],
    onDevice: false,
    tradeoff: 'Your data stays on this device only',
    enabled: false,
  },
];

export default function PrivacyFirstDesignDemo() {
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [lastChange, setLastChange] = useState<{ kind: 'added' | 'deleted'; items: string[] } | null>(null);

  // What actually sits on the server right now: the union of collected fields
  // from enabled, non-on-device features. On-device features add nothing.
  const onServer = Array.from(
    new Set(features.filter((f) => f.enabled && !f.onDevice).flatMap((f) => f.collects))
  );

  const toggle = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const next = !f.enabled;
        if (!f.onDevice && f.collects.length) {
          // Turning ON collects the data; turning OFF deletes it (off = deleted).
          setLastChange({ kind: next ? 'added' : 'deleted', items: f.collects });
        }
        return { ...f, enabled: next };
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-text-primary">Collect less by default</h2>
        <p className="text-sm text-text-secondary mt-1">
          Everything is off until you turn it on for a benefit you can name. Watch exactly what reaches our servers, and watch it get deleted the moment you turn a feature back off.
        </p>
      </div>

      {/* The dent: what is actually on the server right now */}
      <div className="mb-3 rounded-card border border-border-primary bg-accent-subtle p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheckIcon className="h-4 w-4 text-accent-primary" aria-hidden="true" />
          <p className="text-sm font-semibold text-text-primary">On our servers right now</p>
        </div>
        {onServer.length === 0 ? (
          <p className="text-sm text-text-secondary">
            Nothing. The assistant runs on your device and sends us nothing until you opt in.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {onServer.map((d) => (
              <span
                key={d}
                className="inline-block rounded-pill bg-surface-primary border border-border-primary px-2.5 py-1 text-xs text-text-primary"
              >
                {d}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* The consequence of the last toggle, named */}
      <AnimatePresence mode="wait">
        {lastChange && (
          <motion.div
            key={`${lastChange.kind}-${lastChange.items.join()}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mb-4 text-xs text-text-secondary"
          >
            {lastChange.kind === 'added'
              ? `Now collecting: ${lastChange.items.join(', ')}.`
              : `Deleted: ${lastChange.items.join(', ')} removed from our servers.`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features: opt-in per field, trade-off named, on-device flagged */}
      <div className="space-y-2">
        {features.map((f) => (
          <div key={f.id} className="rounded-card border border-border-primary bg-surface-primary p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary">{f.name}</p>
                  {f.onDevice && (
                    <span className="inline-block rounded-pill bg-accent-subtle border border-border-primary px-2 py-0.5 text-xs text-accent-primary">
                      On your device
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{f.benefit}</p>

                <p className="text-xs text-text-tertiary mt-2">
                  {f.onDevice ? (
                    <>Runs on your device. Nothing leaves it.</>
                  ) : f.enabled ? (
                    <>Collecting: {f.collects.join(', ')}</>
                  ) : (
                    <>If off: {f.tradeoff}</>
                  )}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={f.enabled}
                aria-label={f.name}
                onClick={() => toggle(f.id)}
                className={`mt-0.5 flex-shrink-0 relative h-5 w-9 rounded-pill border transition-colors ${
                  f.enabled ? 'bg-accent-primary border-accent-primary' : 'bg-background-secondary border-border-secondary'
                }`}
              >
                <span
                  className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-surface-primary border border-border-secondary shadow-card transition-all ${
                    f.enabled ? 'left-[1.125rem]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-5 rounded-card border border-border-primary bg-accent-subtle p-4">
        <p className="text-sm font-semibold text-text-primary mb-2">How it works</p>
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-text-secondary">
          <li>The default is collect-nothing. Each feature is off until you opt in for a benefit you can name.</li>
          <li>Turn a feature off and its data is deleted, not just hidden. &ldquo;On our servers&rdquo; shrinks immediately.</li>
          <li>On-device features never send anything, so there is nothing to leak or delete.</li>
          <li>The trap this avoids is <em>the privacy alibi</em>: a settings panel that launders a collect-everything default instead of collecting less.</li>
        </ul>
      </div>
    </div>
  );
}
