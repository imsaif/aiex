'use client';

import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { AcademicCapIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

// Real questions people searched to reach this site (Search Console, Aug-Nov 2026).
const STARTERS = [
  'What does calibrated trust mean in practice?',
  'What is Claude Docs?',
  'How do I start learning AI UX?',
];

/** Plain text with site links made clickable and **bold** markers dropped. */
function renderAnswer(text: string): ReactNode[] {
  const parts = text.replace(/\*\*/g, '').split(/(https?:\/\/[^\s)\]]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part.replace(/[.,]+$/, '')}
        className="text-accent-primary underline underline-offset-2 break-all"
      >
        {part.replace(/^https?:\/\/(www\.)?/, '')}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function GuidebotCard() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [turns, loading]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setError(null);
    setDraft('');
    const history = turns.slice(-8);
    setTurns((t) => [...t, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/guidebot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok || !data.answer) throw new Error(data.error ?? 'Guidebot could not answer just now.');
      setTurns((t) => [...t, { role: 'assistant', content: data.answer as string }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Guidebot could not answer just now.');
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(draft);
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-default rounded-card border border-border-primary bg-surface-primary p-loose">
        <AcademicCapIcon className="w-8 h-8 text-accent-primary shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="type-h3 text-text-primary">Not sure where to start?</p>
          <p className="type-body text-text-secondary">Ask Guidebot. It knows every pattern, course and lesson on the site.</p>
        </div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Ask Guidebot
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Guidebot"
        size="lg"
      >
        <div className="flex flex-col gap-default">
          <div className="flex flex-col gap-snug max-h-[55vh] overflow-y-auto" aria-live="polite">
            {turns.length === 0 && (
              <div className="flex flex-col gap-snug">
                <p className="type-body text-text-secondary">Try one of the questions people ask most:</p>
                <div className="flex flex-wrap gap-tight">
                  {STARTERS.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => void ask(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((t, i) => (
              <div
                key={i}
                className={
                  t.role === 'user'
                    ? 'animate-fade-in motion-reduce:animate-none self-end max-w-[85%] rounded-card bg-surface-secondary px-default py-snug type-body text-text-primary'
                    : 'animate-fade-in motion-reduce:animate-none self-start max-w-[95%] type-body text-text-primary whitespace-pre-wrap'
                }
              >
                {t.role === 'user' ? t.content : renderAnswer(t.content)}
              </div>
            ))}
            {loading && <p className="type-caption text-text-secondary">Guidebot is looking through the site…</p>}
            {error && (
              <p className="type-caption text-text-primary" role="alert">
                {error}
              </p>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={onSubmit} className="flex items-end gap-snug">
            <div className="flex-1 min-w-0">
              <Input
                id="guidebot-question"
                aria-label="Your question"
                placeholder="Ask about a pattern, a course or a lesson"
                value={draft}
                maxLength={600}
                onChange={(e) => setDraft(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" variant="primary" disabled={loading || draft.trim().length < 2} aria-label="Send">
              <PaperAirplaneIcon className="w-5 h-5" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </Dialog>
    </>
  );
}

export default GuidebotCard;
