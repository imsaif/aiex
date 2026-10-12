'use client';

import { useState } from 'react';
import { BAND_ICONS, TOPIC_ICONS, bandIconTitle, bandSlugFromHtml } from '@/lib/newsletter/band-icons';

const byTitle = (icons: Readonly<Record<string, string>>) => Object.entries(icons).sort(([, a], [, b]) => a.localeCompare(b));
// Patterns first (what the generator picks from), then topics for issues no
// pattern fits.
const GROUPS = [
  { label: 'Patterns', icons: byTitle(BAND_ICONS) },
  { label: 'Topics', icons: byTitle(TOPIC_ICONS) },
];

/**
 * Lets the reviewer override the band icon the generator picked. The pick
 * follows the lead story's pattern tag, which can miss what the issue is about.
 * Renders nothing for drafts without a band (issues from before Oct 2026).
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
          Band icon: <span className="font-medium text-text-primary">{bandIconTitle(current) ?? current}</span>
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
          {GROUPS.map((group) => (
            <section key={group.label} className="mt-default">
              <h4 className="type-eyebrow text-text-secondary">
                {group.label} <span className="text-text-tertiary">· {group.icons.length}</span>
              </h4>
              <ul className="mt-tight grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-tight" aria-label={`${group.label} icons`}>
                {group.icons.map(([slug, title]) => {
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
