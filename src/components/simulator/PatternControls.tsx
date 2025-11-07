'use client'

import { patternInfo } from '@/lib/simulator/patterns'
import type { PatternState } from '@/types/simulator'

interface PatternControlsProps {
  patterns: PatternState
  setPatterns: (patterns: PatternState) => void
  availablePatterns: (keyof PatternState)[]
}

export function PatternControls({
  patterns,
  setPatterns,
  availablePatterns
}: PatternControlsProps) {
  const togglePattern = (key: keyof PatternState) => {
    setPatterns({
      ...patterns,
      [key]: !patterns[key]
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Active Patterns</h3>

      <div className="space-y-4">
        {availablePatterns.map((key) => {
          const info = patternInfo[key]

          return (
            <div
              key={key}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{info.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{info.description}</div>
                  <div className="text-xs text-green-600 mt-2 font-medium">{info.impact}</div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => togglePattern(key)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                    patterns[key] ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                      patterns[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Active patterns:</span> {Object.values(patterns).filter(Boolean).length}
        </p>
      </div>
    </div>
  )
}
