'use client';

import { useEffect, useState } from 'react';
import type { LessonHeading } from '@/lib/guides/headings';

interface OnThisPageProps {
  headings: LessonHeading[];
}

/**
 * Right-sidebar "On this page" TOC. Renders anchor links to every h2/h3
 * heading inside the lesson body. Sticky, desktop-only.
 *
 * Client component because of the scroll-spy behavior — it watches which
 * heading is currently in the top 30% of the viewport via IntersectionObserver
 * and highlights the matching TOC entry as the user scrolls.
 *
 * The full list is still rendered in the initial HTML payload (anchors and
 * labels come from the server-passed `headings` prop), so the only thing the
 * client JS adds is the `activeId` highlight — zero SEO impact.
 */
export default function OnThisPage({ headings }: OnThisPageProps) {
  // Only show h2 and h3 in the sidebar — h4 is too granular
  const visible = headings.filter((h) => h.level === 'h2' || h.level === 'h3');

  const [activeId, setActiveId] = useState<string | null>(
    visible[0]?.id ?? null
  );

  useEffect(() => {
    if (visible.length === 0) return;

    // Track the set of headings currently inside the "reading zone" so we can
    // pick the topmost one deterministically instead of reacting to the last
    // intersection event.
    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        }

        if (visibleIds.size > 0) {
          // Pick the earliest heading (in document order from `visible`) that
          // is currently inside the reading zone.
          const topmost = visible.find((h) => visibleIds.has(h.id));
          if (topmost) setActiveId(topmost.id);
        }
      },
      {
        // Detection zone = top 30% of the viewport (below the ~80px navbar).
        // A heading is considered "active" once it scrolls into this band.
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    const elements: HTMLElement[] = [];
    for (const h of visible) {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) observer.unobserve(el);
      observer.disconnect();
    };
  }, [visible]);

  if (visible.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-3">
        On this page
      </p>
      <ul className="space-y-2">
        {visible.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li
              key={heading.id}
              className={heading.level === 'h3' ? 'pl-4' : ''}
            >
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`block leading-snug transition-colors ${
                  isActive
                    ? 'text-accent-primary font-medium'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
