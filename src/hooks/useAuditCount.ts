'use client';

import { useState, useCallback, useEffect } from 'react';
import { FREE_AUDIT_LIMIT } from '@/lib/audit/constants';

export { FREE_AUDIT_LIMIT };

const STORAGE_KEY = 'aiux_audit_count';

function getStoredCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function useAuditCount() {
  const [auditCount, setAuditCount] = useState(0);

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setAuditCount(getStoredCount());
  }, []);

  const incrementAuditCount = useCallback(() => {
    setAuditCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // localStorage full or unavailable — count still works in-memory
      }
      return next;
    });
  }, []);

  return {
    auditCount,
    incrementAuditCount,
    isPaywalled: auditCount >= FREE_AUDIT_LIMIT,
    auditsRemaining: Math.max(0, FREE_AUDIT_LIMIT - auditCount),
  };
}
