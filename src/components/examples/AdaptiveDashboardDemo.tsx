'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  InboxIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

/**
 * Adaptive Interfaces demo.
 *
 * The real intent: the interface LEARNS from what you do and surfaces it. So
 * here you actually use the actions, and the ones you reach for most get
 * promoted into a "Quick access" rail once they cross a usage threshold.
 * The guardrail (the lesson) rides along: the core menu is a fixed anchor that
 * never reorders, and every promotion is labelled and reversible.
 */

const CORE_NAV = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'inbox', label: 'Inbox', Icon: InboxIcon },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDaysIcon },
  { id: 'reports', label: 'Reports', Icon: ChartBarIcon },
  { id: 'settings', label: 'Settings', Icon: Cog6ToothIcon },
];

const INITIAL_ACTIONS = [
  { id: 'invoice', label: 'New invoice', count: 0 },
  { id: 'export', label: 'Export report', count: 0 },
  { id: 'expense', label: 'Add expense', count: 0 },
  { id: 'standup', label: 'Start standup', count: 0 },
  { id: 'task', label: 'Create task', count: 0 },
  { id: 'share', label: 'Share a file', count: 0 },
];

// How strong the signal has to be before the interface adapts. Earn the change.
const THRESHOLD = 3;

export default function AdaptiveDashboardDemo() {
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [personalizing, setPersonalizing] = useState(true);

  const use = (id: string) =>
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, count: a.count + 1 } : a)));

  const promoted = personalizing
    ? [...actions]
        .filter((a) => a.count >= THRESHOLD && !dismissed.includes(a.id))
        .sort((a, b) => b.count - a.count)
    : [];

  const reset = () => {
    setActions(INITIAL_ACTIONS);
    setDismissed([]);
    setPersonalizing(true);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">An interface that learns what you use</h2>
          <p className="text-sm text-text-secondary mt-1">
            Use the actions a few times. The ones you reach for most get promoted to Quick access, the main menu never moves.
          </p>
        </div>
        {(promoted.length > 0 || actions.some((a) => a.count > 0)) && (
          <button
            type="button"
            onClick={reset}
            className="flex-shrink-0 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        {/* Fixed core: the anchor that never reorders */}
        <nav className="rounded-card border border-border-primary bg-surface-primary p-2 lg:self-start">
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            <LockClosedIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Main menu
          </div>
          <ul className="mt-1 space-y-0.5">
            {CORE_NAV.map(({ id, label, Icon }) => (
              <li key={id}>
                <span className="flex items-center gap-2.5 rounded-input px-2.5 py-2 text-sm text-text-primary">
                  <Icon className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <p className="px-2 pt-2 text-xs text-text-tertiary">Always here, never reorders.</p>
        </nav>

        <div className="space-y-4">
          {/* The adaptive zone, fed by real usage */}
          <div className="rounded-card border border-border-primary bg-surface-primary p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                <SparklesIcon className="h-4 w-4 text-accent-primary" aria-hidden="true" />
                Quick access
              </div>
              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                Personalize
                <button
                  type="button"
                  role="switch"
                  aria-checked={personalizing}
                  aria-label="Personalize"
                  onClick={() => setPersonalizing((v) => !v)}
                  className={`relative h-5 w-9 rounded-pill border transition-colors ${
                    personalizing
                      ? 'bg-accent-primary border-accent-primary'
                      : 'bg-background-secondary border-border-secondary'
                  }`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-surface-primary border border-border-secondary shadow-card transition-all ${
                      personalizing ? 'left-[1.125rem]' : 'left-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>

            {promoted.length === 0 ? (
              <p className="rounded-card border border-dashed border-border-primary px-3 py-6 text-center text-xs text-text-tertiary">
                {personalizing
                  ? `Use an action ${THRESHOLD} times and it gets promoted here.`
                  : 'Personalization is paused. Turn it on to surface your most-used actions.'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence initial={false}>
                  {promoted.map((a) => (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2 rounded-pill bg-accent-subtle border border-border-primary py-1.5 pl-3 pr-1.5"
                    >
                      <span className="text-sm font-medium text-text-primary">{a.label}</span>
                      <span className="text-xs text-text-tertiary">used {a.count}&times;</span>
                      <button
                        type="button"
                        onClick={() => setDismissed((d) => [...d, a.id])}
                        aria-label={`Remove ${a.label} from Quick access`}
                        className="rounded-full p-0.5 text-text-tertiary hover:bg-surface-primary hover:text-text-primary transition-colors"
                      >
                        <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* All actions: clicking these is the behaviour the interface observes */}
          <div className="rounded-card border border-border-primary bg-surface-primary p-4">
            <p className="text-sm font-semibold text-text-primary mb-3">All actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {actions.map((a) => {
                const isPromoted = a.count >= THRESHOLD && !dismissed.includes(a.id) && personalizing;
                const remaining = THRESHOLD - a.count;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => use(a.id)}
                    className="rounded-card border border-border-primary bg-background-secondary px-3 py-3 text-left hover:border-accent-primary transition-colors"
                  >
                    <span className="block text-sm font-medium text-text-primary">{a.label}</span>
                    <span className="block text-xs text-text-tertiary mt-0.5">
                      {a.count === 0
                        ? 'Tap to use'
                        : isPromoted
                          ? 'In Quick access'
                          : a.count >= THRESHOLD
                            ? `Used ${a.count}×`
                            : `Used ${a.count}× · ${remaining} more to pin`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-5 rounded-card border border-border-primary bg-accent-subtle p-4">
        <p className="text-sm font-semibold text-text-primary mb-2">How it works</p>
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-text-secondary">
          <li>The interface watches what you actually use and surfaces it, the way Netflix reorders around what you watch.</li>
          <li>It only adapts after a real signal ({THRESHOLD} uses), not on a single click, so noise doesn&apos;t reshuffle anything.</li>
          <li>The core menu is a fixed anchor. It never reorders, so your muscle memory keeps working.</li>
          <li>Every promotion says why it&apos;s there and is reversible, dismiss it or pause personalization. The trap this avoids is <em>the rug-pull</em>.</li>
        </ul>
      </div>
    </div>
  );
}
