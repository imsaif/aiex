'use client'

import { ImpactMetrics } from './ImpactMetrics'
import type { PatternState } from '@/types/simulator'

interface ComparisonViewProps {
  patterns: PatternState
  onToggleComparison: () => void
}

export function ComparisonView({ patterns, onToggleComparison }: ComparisonViewProps) {
  // Create "patterns off" state
  const patternsOff: PatternState = {
    explainableAI: false,
    confidenceIndicators: false,
    humanInTheLoop: false,
    progressiveDisclosure: false,
    undoRedo: false,
    gracefulDegradation: false,
    contextualAssistance: false
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Side-by-Side Comparison</h3>
          <p className="text-gray-600 mt-1">See the impact of patterns with a direct comparison</p>
        </div>
        <button
          onClick={onToggleComparison}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          ✕ Close
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Without Patterns */}
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                ✕
              </span>
              <h4 className="text-lg font-semibold text-gray-900">Without Patterns</h4>
            </div>
            <p className="text-sm text-gray-600">Baseline AI experience</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
            {/* Baseline Features */}
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900">Available Features:</h5>
              <ul className="space-y-2">
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Basic AI output generation</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>No explanations provided</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>No confidence indicators</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Auto-accept outputs</span>
                </li>
              </ul>
            </div>

            {/* Metrics */}
            <div className="pt-6 border-t">
              <h5 className="font-semibold text-gray-900 mb-4">Experience Metrics:</h5>
              <ImpactMetrics patterns={patternsOff} />
            </div>
          </div>
        </div>

        {/* With Selected Patterns */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                ✓
              </span>
              <h4 className="text-lg font-semibold text-gray-900">With Selected Patterns</h4>
            </div>
            <p className="text-sm text-gray-600">Enhanced AI experience</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
            {/* Enhanced Features */}
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900">Active Patterns:</h5>
              <ul className="space-y-2">
                {Object.entries(patterns).map(([key, enabled]) => {
                  const patternLabels: Record<string, string> = {
                    explainableAI: 'Shows why AI made decisions',
                    confidenceIndicators: 'Displays AI confidence levels',
                    humanInTheLoop: 'Requires human approval',
                    progressiveDisclosure: 'Reveals info gradually',
                    undoRedo: 'Allows reversing actions',
                    gracefulDegradation: 'Handles failures gracefully',
                    contextualAssistance: 'Context-aware help'
                  }
                  if (!enabled) return null
                  return (
                    <li key={key} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>{patternLabels[key as keyof typeof patternLabels]}</span>
                    </li>
                  )
                })}
                {Object.values(patterns).every((v) => !v) && (
                  <li className="text-sm text-gray-500 italic">No patterns selected</li>
                )}
              </ul>
            </div>

            {/* Metrics */}
            <div className="pt-6 border-t">
              <h5 className="font-semibold text-gray-900 mb-4">Experience Metrics:</h5>
              <ImpactMetrics patterns={patterns} />
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <div className="p-6 bg-amber-50 rounded-lg border border-amber-200 space-y-3 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-semibold text-amber-900">Key Improvements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="text-sm text-amber-800">
            <span className="font-medium">✓ User Trust</span> - Increases with explainable AI and confidence indicators
          </div>
          <div className="text-sm text-amber-800">
            <span className="font-medium">✓ Error Prevention</span> - Reduced with human-in-the-loop oversight
          </div>
          <div className="text-sm text-amber-800">
            <span className="font-medium">✓ Satisfaction</span> - Improved with undo/redo and progressive disclosure
          </div>
          <div className="text-sm text-amber-800">
            <span className="font-medium">✓ Task Speed</span> - Optimized with contextual assistance
          </div>
        </div>
      </div>
    </div>
  )
}
