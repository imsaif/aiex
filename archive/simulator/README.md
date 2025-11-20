# Simulator Archive

This directory contains the archived simulator feature that was taken offline on 2025-11-20.

## Archived Components

### Application Routes (`/app`)
- `/simulator` - Main simulator page
- `/simulator/[id]` - Individual scenario pages
- Includes layouts and page components

### Components (`/components`)
- `ComparisonView.tsx` - Side-by-side pattern comparison
- `ImpactMetrics.tsx` - Metrics visualization
- `PatternControls.tsx` - Pattern selection controls
- `ScenarioCard.tsx` - Scenario preview cards
- `ScenarioDetailView.tsx` - Detailed scenario view
- `ScenarioListView.tsx` - List of scenarios
- `ScenarioSelector.tsx` - Scenario selection interface
- `SimulatorContainer.tsx` - Main container component
- `scenarios/` - Individual scenario implementations:
  - `Chatbot.tsx`
  - `ContentGen.tsx`
  - `EmailWriter.tsx`
  - `Predictor.tsx`
  - `Recommender.tsx`

### Library Files (`/lib`)
- `metrics.ts` - Metrics calculation utilities
- `patterns.ts` - Pattern data and configuration

## Restoration Instructions

To restore the simulator feature:

1. Copy the contents back to their original locations:
   ```bash
   cp -r archive/simulator/app/simulator src/app/
   cp -r archive/simulator/components/simulator src/components/
   cp -r archive/simulator/lib/simulator src/lib/
   ```

2. Restore the navigation link in `src/components/layout/Navbar.tsx`:
   - Import `PlayIcon` from `@heroicons/react/24/outline`
   - Add the simulator link back to the navigation menu

3. Clear the Next.js cache and restart the dev server:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Archive Date
**2025-11-20**

## Reason for Archiving
Feature taken offline to be restored later when needed.
