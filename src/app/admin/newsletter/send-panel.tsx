'use client';

import { useEffect, useState } from 'react';

interface SentRecord {
  sentAt?: string;
  recipients?: number;
}

interface Check {
  recipients: number;
  toAdd: number;
  toRemove: number;
  newUnsubscribes: number;
  blockers: string[];
  sent: SentRecord | null;
}

type Status = { kind: 'idle' } | { kind: 'busy'; label: string } | { kind: 'confirm'; check: Check } | { kind: 'done'; text: string } | { kind: 'error'; text: string };

const button =
  'px-3 md:px-4 py-2 rounded-md transition-colors text-xs md:text-sm font-medium whitespace-nowrap disabled:opacity-50';

/**
 * Sends a published issue through Resend (replaces pasting into beehiiv).
 * Test goes to the admin inbox; the real send asks for confirmation with the
 * recipient count from a dry run, and the server refuses a second send.
 */
export function SendPanel({ draftId, dirty, initialSent }: { draftId: string; dirty: boolean; initialSent: SentRecord | null }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [sent, setSent] = useState<SentRecord | null>(initialSent);

  // Reset only when a different draft (or a different send record) is shown;
  // keying on the object itself would reset on every parent render.
  const initialSentAt = initialSent?.sentAt;
  useEffect(() => {
    setStatus({ kind: 'idle' });
    setSent(initialSent);
  }, [draftId, initialSentAt]); // eslint-disable-line react-hooks/exhaustive-deps

  async function call(mode: 'check' | 'test' | 'subscribers') {
    const res = await fetch('/api/newsletter/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: draftId, mode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  async function sendTest() {
    setStatus({ kind: 'busy', label: 'Sending test...' });
    try {
      const data = await call('test');
      setStatus({ kind: 'done', text: `Test sent to ${data.sentTo}. Check it before sending to everyone.` });
    } catch (err) {
      setStatus({ kind: 'error', text: (err as Error).message });
    }
  }

  async function prepare() {
    setStatus({ kind: 'busy', label: 'Checking the list...' });
    try {
      setStatus({ kind: 'confirm', check: await call('check') });
    } catch (err) {
      setStatus({ kind: 'error', text: (err as Error).message });
    }
  }

  async function sendAll() {
    setStatus({ kind: 'busy', label: 'Sending...' });
    try {
      const data = await call('subscribers');
      setSent(data.sent);
      setStatus({ kind: 'done', text: `Sent to ${data.sent.recipients} subscribers.` });
    } catch (err) {
      setStatus({ kind: 'error', text: (err as Error).message });
    }
  }

  if (sent?.sentAt) {
    return (
      <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
        Emailed to {sent.recipients ?? '?'} ✓ · {new Date(sent.sentAt).toLocaleString()}
      </span>
    );
  }

  const busy = status.kind === 'busy';
  return (
    <div className="flex flex-col items-end gap-tight">
      <div className="flex items-center gap-tight">
        <button onClick={sendTest} disabled={busy || dirty} className={`${button} bg-background-secondary text-text-primary hover:bg-background-tertiary`}>
          Send test to me
        </button>
        <button onClick={prepare} disabled={busy || dirty} className={`${button} bg-accent-primary text-text-on-accent hover:bg-accent-hover`}>
          Send to subscribers
        </button>
      </div>
      <div aria-live="polite" className="text-sm text-right">
        {dirty && <p className="text-text-secondary">Save your changes first. The email uses the saved issue.</p>}
        {status.kind === 'busy' && <p className="text-text-secondary">{status.label}</p>}
        {status.kind === 'done' && <p className="text-text-primary">{status.text}</p>}
        {status.kind === 'error' && <p className="text-text-error">{status.text}</p>}
        {status.kind === 'confirm' &&
          (status.check.blockers.length ? (
            <ul className="text-text-error list-none">
              {status.check.blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-end gap-tight flex-wrap">
              <span className="text-text-primary">
                Send to <strong>{status.check.recipients}</strong> subscribers?
                {status.check.toAdd + status.check.toRemove + status.check.newUnsubscribes > 0 &&
                  ` (list update: +${status.check.toAdd}, -${status.check.toRemove}, ${status.check.newUnsubscribes} new unsubscribes)`}
              </span>
              <button onClick={sendAll} className={`${button} bg-accent-primary text-text-on-accent hover:bg-accent-hover`}>
                Confirm send
              </button>
              <button onClick={() => setStatus({ kind: 'idle' })} className={`${button} text-text-secondary hover:bg-background-secondary`}>
                Cancel
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
