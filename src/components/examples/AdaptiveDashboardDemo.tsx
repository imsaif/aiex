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
 * The lesson is "adapt the edges, never the anchors". So the main menu is a
 * FIXED core that never reorders, and only a "Suggested for you" rail adapts.
 * The adaptation is labelled with its reason and is reversible (dismiss a
 * suggestion, or pause personalization entirely).
 */

const CORE_NAV = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'inbox', label: 'Inbox', Icon: InboxIcon },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDaysIcon },
  { id: 'reports', label: 'Reports', Icon: ChartBarIcon },
  { id: 'settings', label: 'Settings', Icon: Cog6ToothIcon },
];

// Shown before any personalization, and whenever personalization is paused.
const DEFAULT_SHORTCUTS = [
  { id: 'templates', label: 'Browse templates', reason: 'A good place to start' },
  { id: 'import', label: 'Import data', reason: 'A good place to start' },
  { id: 'invite', label: 'Invite a teammate', reason: 'A good place to start' },
];

// The user's real behaviour over a simulated week. The rail ranks by this.
const USAGE = [
  { id: 'invoice', label: 'New invoice', count: 14 },
  { id: 'export', label: 'Export report', count: 11 },
  { id: 'standup', label: 'Start team standup', count: 9 },
  { id: 'expense', label: 'Add expense', count: 6 },
];

export default function AdaptiveDashboardDemo() {
  const [simulated, setSimulated] = useState(false);
  const [personalizing, setPersonalizing] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const showPersonalized = simulated && personalizing;

  const shortcuts = showPersonalized
    ? [...USAGE]
        .sort((a, b) => b.count - a.count)
        .filter((u) => !dismissed.includes(u.id))
        .map((u) => ({ id: u.id, label: u.label, reason: `Used ${u.count} times this week` }))
    : DEFAULT_SHORTCUTS;

  return (
    <div className="w-full p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-text-primary">Adapt the edges, not the anchors</h2>
        <p className="text-sm text-text-secondary mt-1">
          Simulate a week of use. The menu on the left never moves. Only the suggestions adapt, and you can always undo them.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Fixed core: the anchors that never move */}
        <nav className="rounded-card border border-border-primary bg-surface-primary p-2">
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
          <p className="px-2 pt-2 text-xs text-text-tertiary">Always here, in the same order.</p>
        </nav>

        {/* The only adaptive zone */}
        <div className="rounded-card border border-border-primary bg-surface-primary p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
              <SparklesIcon className="h-4 w-4 text-accent-primary" aria-hidden="true" />
              Suggested for you
            </div>
            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
              Personalize
              <button
                type="button"
                role="switch"
                aria-checked={personalizing}
                onClick={() => setPersonalizing((v) => !v)}
                className={`relative h-5 w-9 rounded-pill transition-colors ${
                  personalizing ? 'bg-accent-primary' : 'bg-background-secondary border border-border-primary'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface-primary shadow-card transition-transform ${
                    personalizing ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          </div>

          <div className="space-y-2 min-h-[150px]">
            <AnimatePresence initial={false} mode="popLayout">
              {shortcuts.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 rounded-card border border-border-primary bg-background-secondary px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{s.label}</p>
                    <p className="text-xs text-text-tertiary truncate">{s.reason}</p>
                  </div>
                  {showPersonalized && (
                    <button
                      type="button"
                      onClick={() => setDismissed((d) => [...d, s.id])}
                      aria-label={`Remove ${s.label} suggestion`}
                      className="flex-shrink-0 rounded-full p-1 text-text-tertiary hover:bg-surface-primary hover:text-text-primary transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSimulated(true)}
              className="rounded-input bg-accent-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Simulate a week of use
            </button>
            {(simulated || dismissed.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSimulated(false);
                  setDismissed([]);
                  setPersonalizing(true);
                }}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {showPersonalized && (
            <p className="mt-3 text-xs text-text-tertiary">
              Your main menu didn&apos;t move. Only these suggestions changed, and you can dismiss any of them.
            </p>
          )}
        </div>
      </div>

      {/* How it works: one calm note */}
      <div className="mt-5 rounded-card border border-border-primary bg-accent-subtle p-4">
        <p className="text-sm font-semibold text-text-primary mb-2">How it works</p>
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-text-secondary">
          <li>The core menu is an anchor. It never reorders, so your muscle memory keeps working.</li>
          <li>Only the periphery adapts: a &ldquo;Suggested for you&rdquo; rail, ranked by what you actually use.</li>
          <li>Each suggestion says why it&apos;s there, and one click removes it or pauses personalization.</li>
          <li>The trap this avoids is <em>the rug-pull</em>: moving the things people have already memorized.</li>
        </ul>
      </div>
    </div>
  );
}
