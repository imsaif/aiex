'use client'

import { useState } from 'react'
import { SimulatorContainer } from '@/components/simulator/SimulatorContainer'
import type { PatternState } from '@/types/simulator'

export default function SimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [activePatterns, setActivePatterns] = useState<PatternState>({
    explainableAI: false,
    confidenceIndicators: false,
    humanInTheLoop: false,
    progressiveDisclosure: false,
    undoRedo: false,
    gracefulDegradation: false,
    contextualAssistance: false
  })

  return (
    <SimulatorContainer
      selectedScenario={selectedScenario}
      setSelectedScenario={setSelectedScenario}
      activePatterns={activePatterns}
      setActivePatterns={setActivePatterns}
      showComparison={showComparison}
      setShowComparison={setShowComparison}
    />
  )
}
