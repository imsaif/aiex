'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { trackAuditEvent } from '@/lib/audit/analytics';

const SELECT_CLASS =
  'w-full rounded-input bg-surface-primary text-text-primary border border-border-primary type-body py-snug px-default focus:outline-none focus:ring-2 focus:ring-focus transition-colors';

const PRODUCT_TYPES = [
  'Chat interface',
  'AI agent / workflow',
  'Recommendation system',
  'Content generation',
  'Other',
];
const BUDGETS = ['Not sure yet', 'Under $1k', '$1k–$5k', '$5k+'];
const TIMELINES = ['ASAP', 'This month', 'This quarter', 'Just exploring'];

export default function ServiceIntakeForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Lead provenance — set from ?from=post-audit-cta so we can tell warm
  // post-audit leads from cold direct visits in the ServiceLead table.
  const [source, setSource] = useState<'services-page' | 'post-audit-cta'>('services-page');
  const startedRef = useRef(false);

  useEffect(() => {
    trackAuditEvent('service_page_viewed');
    if (new URLSearchParams(window.location.search).get('from') === 'post-audit-cta') {
      setSource('post-audit-cta');
    }
  }, []);

  const markStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackAuditEvent('service_intake_started');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      company: String(fd.get('company') || '').trim(),
      productUrl: String(fd.get('productUrl') || '').trim(),
      productType: String(fd.get('productType') || '').trim(),
      message: String(fd.get('message') || '').trim(),
      budget: String(fd.get('budget') || '').trim(),
      timeline: String(fd.get('timeline') || '').trim(),
      // Honeypot — must stay empty for real users.
      website_url: String(fd.get('website_url') || ''),
      source,
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError('Please fill in your name, email, and what you want audited.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/services/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setSuccess(true);
      trackAuditEvent('service_intake_submitted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-card border border-border-primary bg-surface-primary p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-status-success/10 rounded-full flex items-center justify-center">
          <CheckIcon className="w-6 h-6 text-status-success" strokeWidth={2.5} />
        </div>
        <h3 className="type-h3 text-text-primary mb-2">Request received</h3>
        <p className="text-text-secondary leading-relaxed max-w-md mx-auto">
          Thanks for reaching out. We&apos;ll review your product and reply within 1–2 business
          days with scope, timeline, and a quote.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={markStarted}
      className="rounded-card border border-border-primary bg-surface-primary p-6 md:p-8 space-y-5"
      noValidate
    >
      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden p-0 border-0">
        <label htmlFor="website_url">Leave this field empty</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input name="name" label="Name" placeholder="Your name" required autoComplete="name" />
        <Input
          name="email"
          type="email"
          label="Work email"
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input name="company" label="Company (optional)" placeholder="Company name" />
        <Input
          name="productUrl"
          label="Product URL (optional)"
          placeholder="https://"
          inputMode="url"
        />
      </div>

      <div>
        <label htmlFor="productType" className="type-caption font-semibold text-text-primary block mb-tight">
          What kind of product is it? (optional)
        </label>
        <select id="productType" name="productType" defaultValue="" className={SELECT_CLASS}>
          <option value="">Select one…</option>
          {PRODUCT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="type-caption font-semibold text-text-primary block mb-tight">
          What do you want audited?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your product, which surfaces or flows you want reviewed, and what you're hoping to get out of the audit."
          className="w-full rounded-input bg-surface-primary text-text-primary placeholder:text-text-tertiary border border-border-primary type-body py-snug px-default focus:outline-none focus:ring-2 focus:ring-focus transition-colors resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="budget" className="type-caption font-semibold text-text-primary block mb-tight">
            Budget (optional)
          </label>
          <select id="budget" name="budget" defaultValue="" className={SELECT_CLASS}>
            <option value="">Select one…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="type-caption font-semibold text-text-primary block mb-tight">
            Timeline (optional)
          </label>
          <select id="timeline" name="timeline" defaultValue="" className={SELECT_CLASS}>
            <option value="">Select one…</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="type-caption text-status-error" role="alert">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Request an audit'}
        </Button>
        <p className="type-caption text-text-tertiary">
          No payment now. We&apos;ll reply with scope and a quote first.
        </p>
      </div>
    </form>
  );
}
