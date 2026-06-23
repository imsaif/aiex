import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "A feedback loop that actually closes",
    description: "Feedback only matters if it changes what the user sees next. This recommendation feed re-ranks in front of the user, names the consequence instead of saying a generic thanks, and exposes what it learned as an undoable profile, the opposite of a thumbs-up that just fires a toast.",
    language: "tsx",
    componentId: "feedback-loops-demo",
    code: `'use client';

import React, { useMemo, useState } from 'react';

interface Story {
  id: string;
  title: string;
  topic: string;
}

const POOL: Story[] = [
  { id: 'ai-1', title: 'A faster AI model ships', topic: 'AI' },
  { id: 'sp-1', title: 'The underdog run that broke the bracket', topic: 'Sports' },
  { id: 'fi-1', title: 'What the rate cut means for savers', topic: 'Finance' },
  { id: 'de-1', title: 'The quiet death of the hamburger menu', topic: 'Design' },
  { id: 'ai-2', title: 'How small teams ship with AI agents', topic: 'AI' },
  { id: 'sp-2', title: 'Why marathon times keep falling', topic: 'Sports' },
];

export default function FeedbackLoopsDemo() {
  // The learned preference IS the loop: one weight per topic.
  const [affinity, setAffinity] = useState<Record<string, number>>({});

  // The feed re-ranks by what the user taught it. This is the output that
  // visibly changes after feedback, not a thank-you message.
  const feed = useMemo(() => {
    return [...POOL]
      .sort((a, b) => (affinity[b.topic] ?? 0) - (affinity[a.topic] ?? 0))
      .slice(0, 4);
  }, [affinity]);

  const taught = Object.keys(affinity).filter((t) => affinity[t] !== 0);

  const nudge = (topic: string, dir: 1 | -1) =>
    setAffinity((p) => ({ ...p, [topic]: (p[topic] ?? 0) + dir }));

  const reset = (topic: string) =>
    setAffinity((p) => ({ ...p, [topic]: 0 }));

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      {/* The dent, visible and undoable */}
      {taught.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {taught.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800">
              {affinity[t] > 0 ? 'More' : 'Less'} {t}
              <button onClick={() => reset(t)} aria-label={\`Undo \${t}\`} className="text-gray-400 hover:text-gray-700">×</button>
            </span>
          ))}
        </div>
      )}

      {/* The feed re-ranks in place after every nudge */}
      {feed.map((story) => (
        <div key={story.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <span className="text-xs text-gray-500">{story.topic}</span>
            <p className="text-sm font-semibold text-gray-900">{story.title}</p>
            {affinity[story.topic] > 0 && (
              <p className="text-xs text-gray-500">Because you asked for more {story.topic}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => nudge(story.topic, 1)} className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:border-gray-900">
              👍 More
            </button>
            <button onClick={() => nudge(story.topic, -1)} className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:border-gray-900">
              👎 Less
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}`
  }
];
