'use client'

import { motion } from 'framer-motion'
import { scenarios } from '@/lib/simulator/patterns'
import { getScenarioIcon } from '@/utils/scenarioIcons'
import type { Scenario } from '@/types/simulator'

interface ScenarioSelectorProps {
  selectedScenario: string | null
  onSelectScenario: (scenarioId: string) => void
}

export function ScenarioSelector({
  selectedScenario,
  onSelectScenario
}: ScenarioSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Scenario</h2>
        <p className="text-gray-600">Select an AI use case to explore different patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario: Scenario, index: number) => (
          <motion.button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className={`p-6 rounded-lg border transition-all text-left shadow-sm hover:shadow-md ${
              selectedScenario === scenario.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-3 text-gray-700">{getScenarioIcon(scenario.icon)}</div>
            <h3 className="text-lg font-bold mb-1">{scenario.title}</h3>
            <p className="text-sm text-gray-600">{scenario.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {scenario.availablePatterns.slice(0, 2).map((pattern) => (
                <span key={pattern} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {pattern}
                </span>
              ))}
              {scenario.availablePatterns.length > 2 && (
                <span className="text-xs text-gray-500">+{scenario.availablePatterns.length - 2} more</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
