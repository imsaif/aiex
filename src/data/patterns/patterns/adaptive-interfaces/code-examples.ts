import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Adapt the periphery, anchor the core",
    description: "The naive version sorts everything by usage and destroys muscle memory, the rug-pull. This keeps the main menu fixed and adapts only a 'Suggested for you' rail, ranked by what the user actually uses, with each suggestion labelled by reason and removable.",
    language: "tsx",
    componentId: "adaptive-dashboard",
    code: `'use client';

import React, { useState } from 'react';

// The core never reorders. Muscle memory depends on it staying put.
const CORE_NAV = ['Home', 'Inbox', 'Calendar', 'Reports', 'Settings'];

// The user's real behaviour. Only the suggestion rail ranks by this.
const USAGE = [
  { id: 'invoice', label: 'New invoice', count: 14 },
  { id: 'export', label: 'Export report', count: 11 },
  { id: 'standup', label: 'Start team standup', count: 9 },
];

export default function AdaptiveDashboard() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const suggestions = [...USAGE]
    .sort((a, b) => b.count - a.count)
    .filter((u) => !dismissed.includes(u.id));

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Fixed anchor: same place, same order, every time */}
      <nav className="rounded-lg border border-gray-200 p-2">
        <p className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">Main menu</p>
        {CORE_NAV.map((label) => (
          <div key={label} className="rounded px-2 py-2 text-sm text-gray-900">{label}</div>
        ))}
      </nav>

      {/* The only adaptive zone */}
      <div className="col-span-2 rounded-lg border border-gray-200 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">Suggested for you</p>
        <div className="space-y-2">
          {suggestions.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-500">Used {s.count} times this week</p>
              </div>
              {/* Reversible: the user can always remove a suggestion */}
              <button
                onClick={() => setDismissed((d) => [...d, s.id])}
                aria-label={\`Remove \${s.label}\`}
                className="text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
  }
];
