'use client';

import { useState } from 'react';
import { EVAL_PDF_PATH, EVAL_SHEET_PATH } from '@/data/eval-afternoon';

/**
 * Download panel in the same dark "What's inside" style as the other resource
 * pages (toolkit, checklists), built on tokens. The PDF is behind the
 * newsletter signup (source 'eval-checklist'); the review sheet is open.
 * Existing subscribers are let straight through by the subscribe route.
 */
export function EvalDownload() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const download = () => {
    const a = document.createElement('a');
    a.href = EVAL_PDF_PATH;
    a.download = 'ai-evals-checklist.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'eval-checklist', website_url: '' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        download();
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="rounded-card bg-accent-primary p-loose text-text-on-accent md:p-roomy">
      <h2 id="downloads-heading" className="type-h3">Get the one-page checklist</h2>
      <p className="mt-tight text-text-on-accent/70">The five steps and a blank review table, as a PDF.</p>
      <div className="mt-default max-w-xl">
        {status === 'success' ? (
          <p className="font-semibold" role="status">
            Your checklist is downloading.{' '}
            <button type="button" onClick={download} className="underline underline-offset-2">
              Download again
            </button>
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-tight sm:flex-row">
            <label htmlFor="eval-email" className="sr-only">
              Email
            </label>
            <input
              id="eval-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="min-w-0 flex-1 rounded-pill border border-text-on-accent/30 bg-transparent px-default py-snug text-text-on-accent placeholder:text-text-on-accent/50 focus:border-text-on-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-pill bg-background-primary px-loose py-snug font-semibold text-text-primary transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Get the PDF'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-tight text-sm font-semibold" role="alert">
            {message}
          </p>
        )}
        <p className="mt-snug text-sm text-text-on-accent/70">
          Free, and signs you up to AI UX Daily. Prefer a spreadsheet?{' '}
          <a href={EVAL_SHEET_PATH} download="ai-evals-review-sheet.csv" className="font-semibold text-text-on-accent underline underline-offset-2">
            Download the review sheet
          </a>
          , no email needed.
        </p>
      </div>
    </div>
  );
}
