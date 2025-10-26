# Pattern Usage Feature - Removed

## Overview
This directory contains the "I Use This" pattern tracking feature that was removed from the main application.

## Feature Description
The Pattern Usage feature allowed users to mark AI design patterns they are actively using and see aggregate usage statistics.

### What It Did
- **Button Component**: `PatternUsageButton.tsx` - Interactive button displayed on pattern detail pages
- **State Management**: `usePatternUsage.ts` - Custom React hook managing user's pattern usage state
- **Location on Page**: Top-right of pattern header (next to category badge)
- **Functionality**:
  - Mark/unmark patterns as "using"
  - Display usage count badge
  - Persist state in localStorage via `utils/patternUsage.ts`
  - Track analytics events
  - Two UI variants: default (full text) and compact (icon only)

## Files Included
1. `PatternUsageButton.tsx` - Main UI component (147 lines)
2. `usePatternUsage.ts` - Custom React hook (112 lines)

## Related Files (Not Included)
These files were not removed but may need adjustments if restoring:
- `src/utils/patternUsage.ts` - Utility functions (storage, analytics tracking)
- `src/hooks/index.ts` - Hook exports (export was removed)
- `src/app/patterns/[slug]/client-page.tsx` - Pattern page (button usage was removed)

## How to Restore

If you want to bring this feature back:

1. **Copy files back**:
   ```bash
   cp PatternUsageButton.tsx ../../../src/components/ui/
   cp usePatternUsage.ts ../../../src/hooks/
   ```

2. **Update `src/hooks/index.ts`** to re-export the hook:
   ```typescript
   export { usePatternUsage } from './usePatternUsage';
   ```

3. **Update `src/app/patterns/[slug]/client-page.tsx`**:
   - Add back the dynamic import (around line 20):
     ```typescript
     const PatternUsageButton = dynamic(() => import('@/components/ui/PatternUsageButton'), {
       loading: () => <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg"></div>,
       ssr: false
     });
     ```

   - Add back the button in the header (around line 118):
     ```typescript
     <PatternUsageButton patternId={pattern.id} size="md" showCount={true} />
     ```

## Removal Date
October 26, 2025

## Notes
- The underlying storage utility (`src/utils/patternUsage.ts`) was left in place but is no longer used
- No migration needed - old localStorage data (if any) will simply be ignored
- This was a low-priority feature and removal frees up bundle size
