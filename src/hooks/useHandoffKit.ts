'use client';

import { useState, useEffect, useCallback } from 'react';
import { trackEvent } from '../utils/analytics';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Saved-patterns "handoff kit" — the set of pattern slugs a user has saved to
 * their dashboard so they can generate a Claude Code / IDE handoff file.
 *
 * Storage is localStorage (anonymous, no auth), keyed by slug. This is a
 * SEPARATE feature from the audit flow's screenshot → handoff path; it does
 * not touch src/lib/audit/* at all.
 *
 * Same-tab reactivity: localStorage writes don't notify other hook instances
 * in the same tab, so every mutation dispatches a `HANDOFF_KIT_EVENT` window
 * event that all instances listen for (keeps the nav badge in sync with the
 * save buttons). Cross-tab reactivity comes from the native `storage` event.
 */
const STORAGE_KEY = 'aiux-handoff-kit';
const HANDOFF_KIT_EVENT = 'aiux:handoff-kit-change';

function readStore(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch (error) {
    console.warn('Failed to read handoff kit:', error);
    return [];
  }
}

function writeStore(slugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    // Notify other hook instances in this tab (storage event only fires cross-tab).
    window.dispatchEvent(new CustomEvent(HANDOFF_KIT_EVENT));
  } catch (error) {
    console.warn('Failed to write handoff kit:', error);
  }
}

export function useHandoffKit() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from storage on mount and subscribe to changes (same-tab + cross-tab).
  useEffect(() => {
    setSlugs(readStore());
    setIsLoading(false);

    const sync = () => setSlugs(readStore());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    window.addEventListener(HANDOFF_KIT_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(HANDOFF_KIT_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isSaved = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const add = useCallback((slug: string) => {
    const current = readStore();
    if (current.includes(slug)) return;
    const next = [...current, slug];
    writeStore(next);
    setSlugs(next);
    trackEvent('handoff', { action: 'add', slug, count: next.length });
    trackAuditEvent('dashboard_pattern_saved', { slug, count: next.length });
  }, []);

  const remove = useCallback((slug: string) => {
    const current = readStore();
    const next = current.filter((s) => s !== slug);
    writeStore(next);
    setSlugs(next);
    trackEvent('handoff', { action: 'remove', slug, count: next.length });
    trackAuditEvent('dashboard_pattern_removed', { slug, count: next.length });
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = readStore();
    if (current.includes(slug)) {
      const next = current.filter((s) => s !== slug);
      writeStore(next);
      setSlugs(next);
      trackEvent('handoff', { action: 'remove', slug, count: next.length });
      trackAuditEvent('dashboard_pattern_removed', { slug, count: next.length });
    } else {
      const next = [...current, slug];
      writeStore(next);
      setSlugs(next);
      trackEvent('handoff', { action: 'add', slug, count: next.length });
      trackAuditEvent('dashboard_pattern_saved', { slug, count: next.length });
    }
  }, []);

  const clear = useCallback(() => {
    writeStore([]);
    setSlugs([]);
    trackEvent('handoff', { action: 'clear' });
    trackAuditEvent('dashboard_kit_cleared');
  }, []);

  return {
    /** Saved pattern slugs, in the order they were added. */
    savedSlugs: slugs,
    count: slugs.length,
    isSaved,
    add,
    remove,
    toggle,
    clear,
    isLoading,
  };
}

export default useHandoffKit;
