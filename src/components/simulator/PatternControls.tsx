'use client'

import { patternInfo } from '@/lib/simulator/patterns'
import type { PatternState } from '@/types/simulator'

interface PatternControlsProps {
  patterns: PatternState
  setPatterns: (patterns: PatternState) => void
  availablePatterns: (keyof PatternState)[]
  horizontal?: boolean
}

export function PatternControls({
  patterns,
  setPatterns,
  availablePatterns,
  horizontal = false
}: PatternControlsProps) {
  const togglePattern = (key: keyof PatternState) => {
    setPatterns({
      ...patterns,
      [key]: !patterns[key]
    })
  }

  const activeCount = Object.values(patterns).filter(Boolean).length

  if (horizontal) {
    return (
      <div className="pr-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {availablePatterns.map((key) => {
            const info = patternInfo[key]

            return (
              <div key={key} className="flex items-center justify-between gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-900 truncate">{info.name}</span>
                <button
                  onClick={() => togglePattern(key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                    patterns[key] ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      patterns[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-gray-900">Patterns</h3>

      <div className="space-y-2">
        {availablePatterns.map((key) => {
          const info = patternInfo[key]

          return (
            <div
              key={key}
              className="flex items-start justify-between gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">{info.name}</div>
                <div className="text-xs text-green-600 font-medium">{info.impact}</div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => togglePattern(key)}
                className={`relative inline-flex h-6 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  patterns[key] ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    patterns[key] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>

      {activeCount > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">{activeCount}</span> pattern{activeCount !== 1 ? 's' : ''} active
          </p>
        </div>
      )}
    </div>
  )
}
