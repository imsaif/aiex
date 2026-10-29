'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { EVAL_PDF_PATH, EVAL_SHEET_PATH } from '@/data/eval-afternoon';

/**
 * The PDF is behind an email (same newsletter signup the other checklists
 * use, source 'eval-checklist'); the review sheet is open, so it can be
 * shared freely. Existing subscribers are let straight through by the
 * subscribe route for PDF sources.
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
    <div className="grid gap-default md:grid-cols-2">
      <div className="rounded-card border border-border-primary bg-surface-primary p-loose">
        <ArrowDownTrayIcon className="h-6 w-6 text-text-primary" aria-hidden />
        <h3 className="type-h3 mt-snug text-text-primary">One-page PDF</h3>
        <p className="mt-tight text-sm text-text-secondary">
          The five steps and a blank review table, to print or keep beside you while you review.
        </p>
        {status === 'success' ? (
          <p className="mt-default text-sm text-text-primary" role="status">
            Your download has started.{' '}
            <button type="button" onClick={download} className="underline underline-offset-2">
              Download again
            </button>
          </p>
        ) : (
          <form onSubmit={submit} className="mt-default flex flex-col gap-tight sm:flex-row">
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
              className="min-w-0 flex-1 rounded-pill border border-border-secondary bg-background-primary px-default py-tight text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-pill bg-accent-primary px-loose py-tight text-sm font-semibold text-text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Get the PDF'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-tight text-sm text-status-error" role="alert">
            {message}
          </p>
        )}
        <p className="mt-tight type-caption text-text-secondary">Also signs you up to AI UX Daily. Unsubscribe any time.</p>
      </div>

      <div className="rounded-card border border-border-primary bg-surface-primary p-loose">
        <TableCellsIcon className="h-6 w-6 text-text-primary" aria-hidden />
        <h3 className="type-h3 mt-snug text-text-primary">Review sheet</h3>
        <p className="mt-tight text-sm text-text-secondary">
          A spreadsheet with the columns already set up: input, output, pass or fail, the first thing wrong, and group.
          Opens in Google Sheets, Excel or Numbers.
        </p>
        <a
          href={EVAL_SHEET_PATH}
          download="eval-review-sheet.csv"
          className="mt-default inline-flex rounded-pill border border-border-secondary px-loose py-tight text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary"
        >
          Download the sheet
        </a>
      </div>
    </div>
  );
}
