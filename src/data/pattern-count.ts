/**
 * Single source of truth for the pattern count used in user-facing copy.
 *
 * Deliberately a literal rather than `patterns.length`: most of the places that
 * quote this number are client components, and importing the pattern registry
 * would pull all 38 pattern modules into the client bundle.
 *
 * `src/data/__tests__/pattern-count.test.ts` fails if this ever drifts from the
 * library or from the list of patterns the audit actually evaluates.
 */
export const PATTERN_COUNT = 38;
