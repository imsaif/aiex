'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';
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

  const items = [
    { Icon: DocumentTextIcon, name: 'One-page checklist (PDF)', text: 'The five steps and a blank review table, to print or keep open while you review.' },
    { Icon: TableCellsIcon, name: 'Review sheet', text: 'Input, output, pass or fail, first thing wrong, group. Opens in Google Sheets, Excel or Numbers.' },
  ];

  return (
    <div className="rounded-card bg-accent-primary p-loose text-text-on-accent md:p-roomy">
      <p className="type-eyebrow text-text-on-accent/70">What&apos;s inside</p>
      <ul className="mt-default grid gap-snug md:grid-cols-2">
        {items.map(({ Icon, name, text }) => (
          <li key={name} className="flex gap-snug rounded-card border border-text-on-accent/20 p-default">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-input bg-text-on-accent/10">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">{name}</span>
              <span className="mt-1 block text-sm text-text-on-accent/70">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-loose grid gap-default md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
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
                className="inline-flex items-center justify-center gap-tight rounded-pill bg-background-primary px-loose py-snug font-semibold text-text-primary transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <ArrowDownTrayIcon className="h-5 w-5" aria-hidden />
                {status === 'loading' ? 'Sending…' : 'Get the PDF'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-tight text-sm font-semibold" role="alert">
              {message}
            </p>
          )}
          <p className="mt-tight text-sm text-text-on-accent/70">Free · also signs you up to AI UX Daily · unsubscribe any time</p>
        </div>
        <a
          href={EVAL_SHEET_PATH}
          download="ai-evals-review-sheet.csv"
          className="inline-flex items-center justify-center gap-tight rounded-pill border border-text-on-accent/40 px-loose py-snug font-semibold transition-colors hover:border-text-on-accent"
        >
          <TableCellsIcon className="h-5 w-5" aria-hidden />
          Review sheet, no email
        </a>
      </div>
    </div>
  );
}
