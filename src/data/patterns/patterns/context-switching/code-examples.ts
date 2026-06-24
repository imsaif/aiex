import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Threads that keep their own memory",
    description: "Context switching is not just a list of chats, it is isolation. Each thread holds its own history, so the same question gets a thread-specific answer and one thread's facts never leak into another. Switching preserves continuity within a thread and keeps the others sealed off.",
    language: "tsx",
    componentId: "context-switching-demo",
    code: `'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface Thread {
  id: string;
  name: string;
  remembers: string;          // the one fact this thread holds
  messages: Message[];
  answerWhen: string;         // grounded in THIS thread only
}

const INITIAL: Thread[] = [
  {
    id: 'launch',
    name: 'Q3 launch plan',
    remembers: 'Ships Friday',
    messages: [{ id: 'l1', role: 'ai', text: 'We are targeting Friday to ship.' }],
    answerWhen: 'The Q3 launch ships this Friday.',
  },
  {
    id: 'japan',
    name: 'Trip to Japan',
    remembers: 'Going in April',
    messages: [{ id: 'j1', role: 'ai', text: 'You are going in April.' }],
    answerWhen: 'Your Japan trip is in April.',
  },
];

export default function ContextSwitchingDemo() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL);
  const [activeId, setActiveId] = useState('launch');
  const active = threads.find((t) => t.id === activeId)!;

  // The answer is resolved against the ACTIVE thread, never the others.
  const askWhen = () =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: \`\${t.id}-q\${t.messages.length}\`, role: 'user', text: 'When is it again?' },
                { id: \`\${t.id}-a\${t.messages.length}\`, role: 'ai', text: t.answerWhen },
              ],
            }
          : t // other threads are untouched: no context bleed
      )
    );

  return (
    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto p-4">
      {/* Each thread advertises the one fact it remembers */}
      <div className="space-y-2">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={\`w-full text-left rounded-lg border p-3 \${
              t.id === activeId ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
            }\`}
          >
            <p className="text-sm font-semibold text-gray-900">{t.name}</p>
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              Remembers: {t.remembers}
            </span>
          </button>
        ))}
      </div>

      {/* The active thread, swapped in on switch with its own history intact */}
      <div className="col-span-2 rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-3">
          Viewing {active.name} only. The assistant can&apos;t see the other thread.
        </p>
        <div className="space-y-2 mb-4">
          {active.messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className={\`inline-block rounded-lg px-3 py-2 text-sm \${
                m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
              }\`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <button onClick={askWhen} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:border-gray-900">
          When is it?
        </button>
      </div>
    </div>
  );
}`
  }
];
