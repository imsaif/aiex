'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type Topic = 'AI' | 'Climate' | 'Finance' | 'Sports' | 'Design' | 'Health';

interface Story {
  id: string;
  title: string;
  source: string;
  topic: Topic;
}

// A small content pool, interleaved by topic so the opening feed is a mix.
// Each topic has two stories, so boosting a topic can surface a *new* one
// and suppressing a topic visibly drops it out of view.
const POOL: Story[] = [
  { id: 'ai-1', title: 'Anthropic ships a faster Claude model', source: 'The Verge', topic: 'AI' },
  { id: 'cl-1', title: 'Grid-scale batteries hit a price tipping point', source: 'Bloomberg', topic: 'Climate' },
  { id: 'fi-1', title: 'What the rate cut actually means for savers', source: 'Reuters', topic: 'Finance' },
  { id: 'sp-1', title: 'The underdog run that broke the bracket', source: 'ESPN', topic: 'Sports' },
  { id: 'de-1', title: 'The quiet death of the hamburger menu', source: 'Smashing Magazine', topic: 'Design' },
  { id: 'he-1', title: 'Sleep researchers rethink the 8-hour rule', source: 'Nature', topic: 'Health' },
  { id: 'ai-2', title: 'How three-person teams ship with AI agents', source: 'Wired', topic: 'AI' },
  { id: 'cl-2', title: 'Cities are ripping up asphalt to cool streets', source: 'The Atlantic', topic: 'Climate' },
  { id: 'fi-2', title: 'Index funds quietly beat the pros again', source: 'WSJ', topic: 'Finance' },
  { id: 'sp-2', title: 'Why marathon times keep falling', source: 'Runner’s World', topic: 'Sports' },
  { id: 'de-2', title: 'Design systems that survive a rebrand', source: 'A List Apart', topic: 'Design' },
  { id: 'he-2', title: 'The quiet case for walking meetings', source: 'NYT', topic: 'Health' },
];

const VISIBLE = 4;

export default function FeedbackLoopsDemo() {
  // The learned preference: a weight per topic. 0 is neutral, positive means
  // "more of this", negative means "less". This is the whole loop in one object.
  const [affinity, setAffinity] = useState<Record<string, number>>({});
  // The last change, used to name the consequence back to the user.
  const [lastChange, setLastChange] = useState<{ topic: Topic; dir: 'more' | 'less' } | null>(null);

  const score = (s: Story) => affinity[s.topic] ?? 0;

  // The feed: re-ranked by what the user has taught it, then the top slots shown.
  // Sorting by affinity is a stand-in for a recommender; the point is that
  // feedback changes the output the user sees next, not a thank-you toast.
  const feed = useMemo(() => {
    return POOL
      .map((s, i) => ({ s, i }))
      .sort((a, b) => score(b.s) - score(a.s) || a.i - b.i)
      .slice(0, VISIBLE)
      .map(({ s }) => s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affinity]);

  // What the system has learned, for the visible, undoable taste profile.
  const taught = (Object.keys(affinity) as Topic[])
    .filter((t) => (affinity[t] ?? 0) !== 0)
    .map((t) => ({ topic: t, dir: (affinity[t] ?? 0) > 0 ? 'more' : 'less' as 'more' | 'less' }));

  const nudge = (topic: Topic, dir: 'more' | 'less') => {
    setAffinity((prev) => {
      const next = Math.max(-2, Math.min(2, (prev[topic] ?? 0) + (dir === 'more' ? 1 : -1)));
      return { ...prev, [topic]: next };
    });
    setLastChange({ topic, dir });
  };

  const reset = (topic: Topic) => {
    setAffinity((prev) => {
      const next = { ...prev };
      delete next[topic];
      return next;
    });
    setLastChange(null);
  };

  const reason = (s: Story) => {
    const a = affinity[s.topic] ?? 0;
    if (a > 0) return `Because you asked for more ${s.topic}`;
    return `Popular in ${s.topic}`;
  };

  return (
    <div className="w-full p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-text-primary">Your Discover feed</h2>
        <p className="text-sm text-text-secondary mt-1">
          Tell it what you want more or less of. Watch the feed actually change, not just say thanks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Left column: the live feed */}
        <div>
          {/* The consequence, named. Not "thanks for your feedback" but what changed. */}
          <AnimatePresence mode="wait">
            {lastChange && (
              <motion.div
                key={`${lastChange.topic}-${lastChange.dir}-${affinity[lastChange.topic]}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mb-3 flex items-center gap-2 rounded-card border border-success bg-status-success/10 px-3 py-2"
              >
                <SparklesIcon className="h-4 w-4 text-text-primary flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-text-primary">
                  {lastChange.dir === 'more'
                    ? `Got it. More ${lastChange.topic} moved up your feed.`
                    : `Got it. You’ll see less ${lastChange.topic}.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The feed re-ranks in place. Layout animation makes the change legible. */}
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {feed.map((story) => (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-card border border-border-primary bg-surface-primary p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-block rounded-pill bg-background-secondary px-2 py-0.5 text-xs text-text-secondary mb-1.5">
                        {story.topic}
                      </span>
                      <p className="text-sm font-semibold text-text-primary">{story.title}</p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {story.source} &middot; {reason(story)}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => nudge(story.topic, 'more')}
                        aria-label={`More like ${story.topic}`}
                        className="inline-flex items-center gap-1 rounded-input border border-border-primary px-2.5 py-1.5 text-xs text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
                      >
                        <HandThumbUpIcon className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">More</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => nudge(story.topic, 'less')}
                        aria-label={`Less like ${story.topic}`}
                        className="inline-flex items-center gap-1 rounded-input border border-border-primary px-2.5 py-1.5 text-xs text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
                      >
                        <HandThumbDownIcon className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Less</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column: the learned profile (the undoable "dent") above the teaching note. */}
        <div className="space-y-4 lg:self-start lg:sticky lg:top-6">
          {/* The learned profile, visible and undoable. The "dent" the user can see and reverse. */}
          {taught.length > 0 && (
            <div className="rounded-card border border-border-primary bg-background-secondary px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">
                What it has learned about you
              </p>
              <div className="flex flex-wrap gap-2">
                {taught.map(({ topic, dir }) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 rounded-pill bg-surface-primary border border-border-primary px-2.5 py-1 text-xs text-text-primary"
                  >
                    <span className="text-text-secondary">{dir === 'more' ? 'More' : 'Less'}</span>
                    {topic}
                    <button
                      type="button"
                      onClick={() => reset(topic)}
                      aria-label={`Undo ${dir} ${topic}`}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-background-secondary"
                    >
                      <XMarkIcon className="h-3.5 w-3.5 text-text-tertiary" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* The teaching note, contrasting a closed loop with feedback theater. */}
          <aside className="rounded-card border border-border-primary bg-accent-subtle p-4">
            <p className="text-sm font-semibold text-text-primary mb-2">How it works</p>
            <ul className="ml-4 list-disc space-y-2 text-sm text-text-secondary">
              <li>Every nudge changes what you see <em>next</em>. The feed re-ranks in front of you.</li>
              <li>The consequence is named (&ldquo;less Sports&rdquo;), not a generic &ldquo;thanks for your feedback&rdquo;.</li>
              <li>What it learned is visible as a profile, and one click undoes any of it.</li>
              <li>That is the loop closing. A thumbs-up that only fires a toast is feedback theater.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
