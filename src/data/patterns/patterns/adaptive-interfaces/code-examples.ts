import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Learn from usage, surface to the edges",
    description: "The interface observes what the user actually uses and promotes the frequently-used actions into a Quick access rail, but only after a real usage threshold, never on a single click. The core menu stays a fixed anchor, and every promotion is reversible.",
    language: "tsx",
    componentId: "adaptive-dashboard",
    code: `'use client';

import React, { useState } from 'react';

// The core never reorders. Muscle memory depends on it staying put.
const CORE_NAV = ['Home', 'Inbox', 'Calendar', 'Reports', 'Settings'];

// Earn the change: adapt only after a strong, repeated signal.
const THRESHOLD = 3;

export default function AdaptiveDashboard() {
  const [actions, setActions] = useState([
    { id: 'invoice', label: 'New invoice', count: 0 },
    { id: 'export', label: 'Export report', count: 0 },
    { id: 'expense', label: 'Add expense', count: 0 },
  ]);

  const use = (id: string) =>
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, count: a.count + 1 } : a)));

  // The adaptive rail is derived from observed behaviour, ranked.
  const promoted = actions
    .filter((a) => a.count >= THRESHOLD)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Fixed anchor */}
      <nav className="rounded-lg border border-gray-200 p-2">
        <p className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">Main menu</p>
        {CORE_NAV.map((label) => (
          <div key={label} className="rounded px-2 py-2 text-sm text-gray-900">{label}</div>
        ))}
      </nav>

      <div className="col-span-2 space-y-4">
        {/* Adaptive zone, fed by real usage */}
        <div className="rounded-lg border border-gray-200 p-3">
          <p className="mb-2 text-sm font-semibold text-gray-900">Quick access</p>
          {promoted.length === 0 ? (
            <p className="text-xs text-gray-500">Use an action {THRESHOLD} times to pin it here.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {promoted.map((a) => (
                <span key={a.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-900">
                  {a.label} · used {a.count}×
                </span>
              ))}
            </div>
          )}
        </div>

        {/* The behaviour the interface observes */}
        <div className="grid grid-cols-3 gap-2">
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={() => use(a.id)}
              className="rounded-lg border border-gray-200 px-3 py-3 text-left hover:border-gray-900"
            >
              <span className="block text-sm font-medium text-gray-900">{a.label}</span>
              <span className="block text-xs text-gray-500">Used {a.count}×</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`
  }
];
