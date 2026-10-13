'use client';

import { useState } from 'react';

// Builds a link to share on social, carrying a tag the Growth page counts.
const PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'instagram', label: 'Instagram' },
];

const SITE = 'https://www.aiuxdesign.guide';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export default function LinkTagger() {
  const [page, setPage] = useState('/');
  const [platform, setPlatform] = useState('linkedin');
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  let url = '';
  try {
    const u = new URL(page.startsWith('http') ? page : `${SITE}${page.startsWith('/') ? '' : '/'}${page}`);
    u.searchParams.set('utm_source', platform);
    if (slugify(name)) u.searchParams.set('utm_campaign', slugify(name));
    url = u.toString();
  } catch {
    url = '';
  }

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the link is visible to copy by hand */
    }
  };

  const field = 'w-full rounded-input border border-border-primary bg-background-secondary px-snug py-tight text-sm text-text-primary';

  return (
    <div className="mt-loose border-t border-border-primary pt-default">
      <h3 className="text-sm font-bold text-text-primary">Make a link to share</h3>
      <div className="mt-tight grid grid-cols-1 gap-tight sm:grid-cols-3">
        <label className="text-xs text-text-secondary">
          Page
          <input className={field} value={page} onChange={(e) => setPage(e.target.value)} placeholder="/patterns/conversational-ui" />
        </label>
        <label className="text-xs text-text-secondary">
          Where
          <select className={field} value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-text-secondary">
          Post name
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="agent oversight weekly" />
        </label>
      </div>
      <div className="mt-tight flex items-center gap-tight">
        <code className="flex-1 truncate rounded-input bg-background-secondary px-snug py-tight text-xs text-text-primary">{url || 'Enter a page'}</code>
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          className="rounded-input bg-accent-primary px-default py-tight text-sm font-medium text-white transition-colors hover:bg-accent-primary/90 disabled:opacity-50"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
