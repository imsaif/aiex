'use client'

import { getScenarioIcon } from '@/utils/scenarioIcons'
import type { Scenario } from '@/types/simulator'

interface ScenarioCardProps {
  scenario: Scenario
  onSelect: (scenarioId: string) => void
  index: number
}

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <button
      onClick={() => onSelect(scenario.id)}
      className="p-6 rounded-lg border border-gray-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md text-left cursor-pointer"
    >
      {/* Icon */}
      <div className="mb-3 text-gray-700">
        {getScenarioIcon(scenario.icon, 'w-8 h-8')}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{scenario.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>

      {/* Available Patterns */}
      <div className="flex flex-wrap gap-1">
        {scenario.availablePatterns.slice(0, 2).map((pattern) => (
          <span key={pattern} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {pattern}
          </span>
        ))}
        {scenario.availablePatterns.length > 2 && (
          <span className="text-xs text-gray-500">+{scenario.availablePatterns.length - 2} more</span>
        )}
      </div>
    </button>
  )
}
