'use client';

import { useState, useCallback, useEffect } from 'react';
import { FREE_AUDIT_LIMIT, UNLOCKED_AUDIT_LIMIT } from '@/lib/audit/constants';

export { FREE_AUDIT_LIMIT, UNLOCKED_AUDIT_LIMIT };

const COUNT_KEY = 'aiux_audit_count';
const UNLOCKED_KEY = 'aiux_audit_unlocked';

function getStoredCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(COUNT_KEY);
    return stored ? parseInt(stored, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function getStoredUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(UNLOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function useAuditCount() {
  const [auditCount, setAuditCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setAuditCount(getStoredCount());
    setIsUnlocked(getStoredUnlocked());
  }, []);

  const incrementAuditCount = useCallback(() => {
    setAuditCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(COUNT_KEY, String(next));
      } catch {
        // localStorage full or unavailable — count still works in-memory
      }
      return next;
    });
  }, []);

  const markUnlocked = useCallback(() => {
    setIsUnlocked(true);
    try {
      localStorage.setItem(UNLOCKED_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  const effectiveLimit = isUnlocked ? UNLOCKED_AUDIT_LIMIT : FREE_AUDIT_LIMIT;
  const needsUnlock = !isUnlocked && auditCount >= FREE_AUDIT_LIMIT;
  const atFinalCap = isUnlocked && auditCount >= UNLOCKED_AUDIT_LIMIT;

  return {
    auditCount,
    incrementAuditCount,
    isUnlocked,
    markUnlocked,
    needsUnlock,
    atFinalCap,
    // Legacy contract — "paywalled" now means either needs unlock OR hit final cap.
    isPaywalled: needsUnlock || atFinalCap,
    auditsRemaining: Math.max(0, effectiveLimit - auditCount),
    effectiveLimit,
  };
}
