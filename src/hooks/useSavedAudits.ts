'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductType, TopGap } from '@/types/audit';
import { trackAuditEvent } from '@/lib/audit/analytics';

/**
 * Saved audits — the full text of an audit a user chose to keep, so they can
 * revisit it on /dashboard and re-generate the Claude Code / IDE handoff prompt
 * later.
 *
 * Storage is localStorage (anonymous, no auth). This is a SEPARATE store from
 * the saved-patterns "handoff kit" (`useHandoffKit`) — patterns are saved by
 * slug, audits are saved as a self-contained text snapshot.
 *
 * TEXT ONLY — we deliberately never persist the screenshot. localStorage caps
 * at ~5MB/origin and audit images (≤1568px, up to ~4MB, +33% as base64) would
 * blow that and make `save` fail. We store exactly the inputs
 * `composeHandoffPrompt` needs (surfaceDescription, productType, gaps) plus the
 * fields the dashboard card renders, so "View" is a textual recap, not the
 * pinned-screenshot view.
 *
 * Same-tab reactivity: localStorage writes don't notify other hook instances in
 * the same tab, so every mutation dispatches a `SAVED_AUDITS_EVENT` window event
 * that all instances listen for (keeps the nav/dashboard in sync with the save
 * button). Cross-tab reactivity comes from the native `storage` event.
 */
export interface SavedAudit {
  /** Audit result id (results.id) — the dedupe key. */
  id: string;
  /** When the user saved it (epoch ms). */
  savedAt: number;
  productType?: ProductType;
  /** Human-readable product label, e.g. "a chat interface". */
  productLabel: string;
  surfaceDescription: string;
  score: number | null;
  maxScore: number | null;
  applicablePatternsCount: number;
  /** The actionable gaps (missing / needs-improvement) this audit surfaced. */
  gaps: TopGap[];
  quickWins: string[];
}

const STORAGE_KEY = 'aiux-saved-audits';
const SAVED_AUDITS_EVENT = 'aiux:saved-audits-change';

function readStore(): SavedAudit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((a): a is SavedAudit => Boolean(a) && typeof a.id === 'string')
      : [];
  } catch (error) {
    console.warn('Failed to read saved audits:', error);
    return [];
  }
}

/**
 * Persist the store. Returns true on success, false on failure (e.g.
 * QuotaExceededError). Callers must check the result — we never want a save
 * button to flip to "Saved" on a write that didn't land.
 */
function writeStore(audits: SavedAudit[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(audits));
    window.dispatchEvent(new CustomEvent(SAVED_AUDITS_EVENT));
    return true;
  } catch (error) {
    console.warn('Failed to write saved audits:', error);
    return false;
  }
}

export function useSavedAudits() {
  const [audits, setAudits] = useState<SavedAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate on mount and subscribe to changes (same-tab + cross-tab).
  useEffect(() => {
    setAudits(readStore());
    setIsLoading(false);

    const sync = () => setAudits(readStore());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    window.addEventListener(SAVED_AUDITS_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SAVED_AUDITS_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isSaved = useCallback((id: string) => audits.some((a) => a.id === id), [audits]);

  /**
   * Save an audit. Returns true if it persisted, false if storage rejected the
   * write (so the UI can surface an error instead of a false "Saved").
   * No-ops (returns true) if already saved.
   */
  const save = useCallback((audit: SavedAudit): boolean => {
    const current = readStore();
    if (current.some((a) => a.id === audit.id)) return true;
    const next = [audit, ...current];
    const ok = writeStore(next);
    if (ok) {
      setAudits(next);
      trackAuditEvent('audit_saved', { gapCount: audit.gaps.length, productType: audit.productType });
    }
    return ok;
  }, []);

  const remove = useCallback((id: string): boolean => {
    const current = readStore();
    const next = current.filter((a) => a.id !== id);
    const ok = writeStore(next);
    if (ok) {
      setAudits(next);
      trackAuditEvent('audit_save_removed', { count: next.length });
    }
    return ok;
  }, []);

  const clear = useCallback(() => {
    if (writeStore([])) setAudits([]);
  }, []);

  return {
    /** Saved audits, newest first. */
    savedAudits: audits,
    count: audits.length,
    isSaved,
    save,
    remove,
    clear,
    isLoading,
  };
}

export default useSavedAudits;
