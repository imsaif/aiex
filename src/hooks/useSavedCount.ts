'use client';

import { useHandoffKit } from './useHandoffKit';
import { useSavedAudits } from './useSavedAudits';

/**
 * The combined "how much have I saved" number, in one place.
 *
 * Saved patterns and saved audits live in two independent localStorage stores
 * with two independent hooks. Two surfaces show their sum: the navbar badge and
 * the sticky pack bar on pattern routes. Those two must never disagree, so the
 * addition happens here once rather than being re-derived at each call site,
 * where a later change to one could silently drift from the other.
 *
 * `isLoading` is the OR of both stores: a consumer that hides itself at zero
 * needs to know the count is settled, otherwise it flashes "0 saved" during
 * hydration and then pops.
 */
export function useSavedCount(): {
  count: number;
  patternCount: number;
  auditCount: number;
  isLoading: boolean;
} {
  const { count: patternCount, isLoading: patternsLoading } = useHandoffKit();
  const { count: auditCount, isLoading: auditsLoading } = useSavedAudits();

  return {
    count: patternCount + auditCount,
    patternCount,
    auditCount,
    isLoading: patternsLoading || auditsLoading,
  };
}

export default useSavedCount;
