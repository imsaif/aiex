'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Context Switching Pattern Demo
 *
 * The point of the pattern is not "a sidebar of chats". It is that each thread
 * carries its own memory, so the SAME question gets a thread-specific answer and
 * one thread's facts never leak into another. This demo makes that visible:
 * a "Remembers" chip per thread, and quick questions that resolve against the
 * active thread only.
 */

type Role = 'user' | 'ai';

interface Message {
  id: string;
  role: Role;
  text: string;
}

interface Thread {
  id: string;
  name: string;
  subtitle: string;
  // The one fact this thread holds. Shown as a chip so isolation is legible.
  remembers: string;
  messages: Message[];
  // Grounded answers, resolved only against this thread.
  answers: { when: string; catchUp: string };
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 'launch',
    name: 'Q3 launch plan',
    subtitle: 'Shipping the new dashboard',
    remembers: 'Ships Friday',
    messages: [
      { id: 'launch-1', role: 'user', text: "Let's lock the Q3 launch plan." },
      { id: 'launch-2', role: 'ai', text: 'Got it. We are targeting Friday to ship the new dashboard.' },
    ],
    answers: {
      when: 'The Q3 launch ships this Friday.',
      catchUp: 'We are locking the Q3 launch plan, aiming to ship the dashboard on Friday.',
    },
  },
  {
    id: 'japan',
    name: 'Trip to Japan',
    subtitle: 'Spring travel planning',
    remembers: 'Going in April',
    messages: [
      { id: 'japan-1', role: 'user', text: 'Help me plan the Japan trip.' },
      { id: 'japan-2', role: 'ai', text: 'Happy to. You are going in April, so I will plan around cherry-blossom season.' },
    ],
    answers: {
      when: 'Your Japan trip is in April.',
      catchUp: 'We are planning your April trip to Japan, around cherry-blossom season.',
    },
  },
];

// The same question in every thread. The answer is what differs, because it is
// grounded in the active thread alone.
const QUICK_ASKS: { key: 'when' | 'catchUp' | 'isolation'; label: string; question: string }[] = [
  { key: 'when', label: 'When is it?', question: 'When is it again?' },
  { key: 'catchUp', label: 'Catch me up', question: 'Catch me up on this.' },
  { key: 'isolation', label: 'Anything from my other chats?', question: 'Anything from my other chats?' },
];

const ISOLATION_ANSWER =
  "I only see this conversation. Open the other thread and I'll pick that up there.";

export default function ContextSwitchingDemo() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeId, setActiveId] = useState('launch');

  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  const ask = (key: 'when' | 'catchUp' | 'isolation', question: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeId) return t;
        const n = t.messages.length;
        const answer = key === 'isolation' ? ISOLATION_ANSWER : t.answers[key];
        return {
          ...t,
          messages: [
            ...t.messages,
            { id: `${t.id}-${n + 1}`, role: 'user', text: question },
            { id: `${t.id}-${n + 2}`, role: 'ai', text: answer },
          ],
        };
      })
    );
  };

  return (
    <div className="w-full p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-text-primary">Two conversations, two memories</h2>
        <p className="text-sm text-text-secondary mt-1">
          Ask the same question in each thread. The answer changes, because each one is grounded only in its own history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar: each thread shows the one fact it holds */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Conversations</p>
          <div className="space-y-2">
            {threads.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  aria-pressed={isActive}
                  className={`w-full text-left rounded-card border p-3 transition-colors ${
                    isActive
                      ? 'border-accent-primary bg-accent-subtle'
                      : 'border-border-primary bg-surface-primary hover:border-border-secondary'
                  }`}
                >
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{t.messages.length} messages</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-surface-primary border border-border-primary px-2 py-0.5 text-xs text-text-primary">
                    <span className="text-text-secondary">Remembers:</span>
                    {t.remembers}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active thread */}
        <div className="rounded-card border border-border-primary bg-surface-primary overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border-primary px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{active.name}</p>
              <p className="text-xs text-text-secondary truncate">{active.subtitle}</p>
            </div>
            <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-pill bg-accent-subtle border border-border-primary px-2 py-0.5 text-xs text-text-primary">
              <span className="text-text-secondary">Remembers:</span>
              {active.remembers}
            </span>
          </div>

          {/* The isolation reminder, stated plainly */}
          <div className="flex items-center gap-1.5 px-4 py-2 text-xs text-text-tertiary border-b border-border-primary">
            <ArrowPathIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Viewing this thread only. The assistant can&apos;t see the other conversation.
          </div>

          {/* Message history, swapped per active thread */}
          <div className="p-4 space-y-3 min-h-[220px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-card px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-accent-primary text-white'
                          : 'bg-background-secondary text-text-primary'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick asks: same questions, thread-specific answers */}
          <div className="border-t border-border-primary px-4 py-3">
            <p className="text-xs text-text-secondary mb-2">Ask this thread:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ASKS.map((qa) => (
                <button
                  key={qa.key}
                  type="button"
                  onClick={() => ask(qa.key, qa.question)}
                  className="rounded-pill border border-border-primary px-3 py-1.5 text-xs text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works: one calm note, not three colored boxes */}
      <div className="mt-5 rounded-card border border-border-primary bg-accent-subtle p-4">
        <p className="text-sm font-semibold text-text-primary mb-2">How it works</p>
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-text-secondary">
          <li>Each conversation keeps its own history and its own memory (the &ldquo;Remembers&rdquo; chip).</li>
          <li>The same question gets a different answer per thread, grounded only in that thread.</li>
          <li>Switching preserves everything. Nothing from one thread leaks into another.</li>
          <li>That leak is the trap: <em>context bleed</em>. Isolation is the whole feature.</li>
        </ul>
      </div>
    </div>
  );
}
