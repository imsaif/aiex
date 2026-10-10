'use client';

import { useState } from 'react';
import { BAND_ICONS, bandSlugFromHtml } from '@/lib/newsletter/band-icons';

const ICONS = Object.entries(BAND_ICONS).sort(([, a], [, b]) => a.localeCompare(b));

/**
 * Lets the reviewer override the band icon the generator picked. The pick
 * follows the lead story's pattern tag, which can miss what the issue is about.
 * Renders nothing for drafts without a band (weekly issues, older dailies).
 */
export function BandIconPicker({ html, onPick }: { html: string; onPick: (slug: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = bandSlugFromHtml(html);
  if (!current) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-snug">
        {/* eslint-disable-next-line @next/next/no-img-element -- the email's own PNG, shown as-is */}
        <span className="block w-10 h-10 rounded-input overflow-hidden"><img src={`/images/newsletter/band/${current}.png`} alt="" width={40} height={40} className="block w-full h-auto scale-200" /></span>
        <div className="text-sm text-text-secondary">
          Band icon: <span className="font-medium text-text-primary">{BAND_ICONS[current] ?? current}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="ml-auto text-sm font-medium text-accent-primary hover:underline"
        >
          {open ? 'Done' : 'Change'}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <ul className="mt-snug grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-tight" aria-label="Band icons">
            {ICONS.map(([slug, title]) => {
              const selected = slug === current;
              return (
                <li key={slug}>
                  <button
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onClick={() => onPick(slug)}
                    aria-pressed={selected}
                    title={title}
                    className={`block w-full rounded-input overflow-hidden ring-offset-2 transition-shadow ${selected ? 'ring-2 ring-accent-primary' : 'hover:ring-2 hover:ring-border-secondary'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- the email's own PNG, shown as-is */}
                    <img src={`/images/newsletter/band/${slug}.png`} alt={title} width={64} height={64} loading="lazy" className="block w-full h-auto scale-200" />
                  </button>
                  <div className="mt-tight type-caption text-text-secondary line-clamp-2">{title}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
