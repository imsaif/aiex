'use client'

// Updated to include search and new layout
import { useState, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { ScenarioCard } from './ScenarioCard'
import { PatternControls } from './PatternControls'
import { ImpactMetrics } from './ImpactMetrics'
import { ComparisonView } from './ComparisonView'
import { EmailWriter } from './scenarios/EmailWriter'
import { Chatbot } from './scenarios/Chatbot'
import { Recommender } from './scenarios/Recommender'
import { ContentGen } from './scenarios/ContentGen'
import { Predictor } from './scenarios/Predictor'
import { getScenarioIcon } from '@/utils/scenarioIcons'
import { scenarios } from '@/lib/simulator/patterns'
import type { PatternState } from '@/types/simulator'

interface SimulatorContainerProps {
  selectedScenario: string | null
  setSelectedScenario: (scenarioId: string | null) => void
  activePatterns: PatternState
  setActivePatterns: (patterns: PatternState) => void
  showComparison: boolean
  setShowComparison: (show: boolean) => void
}

export function SimulatorContainer({
  selectedScenario,
  setSelectedScenario,
  activePatterns,
  setActivePatterns,
  showComparison,
  setShowComparison
}: SimulatorContainerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const currentScenario = scenarios.find((s) => s.id === selectedScenario)

  // Filter scenarios based on search
  const filteredScenarios = useMemo(() => {
    if (!searchQuery.trim()) return scenarios

    const query = searchQuery.toLowerCase()
    return scenarios.filter(
      (scenario) =>
        scenario.title.toLowerCase().includes(query) ||
        scenario.description.toLowerCase().includes(query) ||
        scenario.availablePatterns.some((p) => p.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    // Reset patterns when selecting a new scenario
    setActivePatterns({
      explainableAI: false,
      confidenceIndicators: false,
      humanInTheLoop: false,
      progressiveDisclosure: false,
      undoRedo: false,
      gracefulDegradation: false,
      contextualAssistance: false
    })
  }

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      <div className="pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Center Aligned */}
          <div className="mb-12 text-center">
            {!selectedScenario && (
              <div className="mb-4 flex justify-center">
                <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                  {filteredScenarios.length} AI Scenarios
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Test AI Patterns in Real Scenarios
            </h1>
            <p className="text-lg text-gray-600 mx-auto max-w-2xl">
              Compare patterns side-by-side and explore their potential impact.
            </p>
          </div>

          {/* Search Bar - Moved to Hero Section */}
          {!selectedScenario && (
            <div className="relative mx-auto max-w-2xl mb-12">
              <input
                type="text"
                placeholder="Search by use case or AI pattern..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-lg bg-white border border-gray-200 shadow-sm text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          )}

          {/* Main Layout */}
          {!selectedScenario ? (
            // Scenario Selection View - Grid Only
            <div>
              {/* Scenarios Grid */}
              {filteredScenarios.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredScenarios.map((scenario, index) => (
                    <ScenarioCard
                      key={scenario.id}
                      scenario={scenario}
                      onSelect={handleScenarioSelect}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No scenarios found matching "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Active Scenario View
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Scenario & Simulation */}
              <div className="lg:col-span-2 space-y-8">
                {/* Back Button */}
                <button
                onClick={() => setSelectedScenario(null)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium"
              >
                ← Back to scenarios
              </button>

              {/* Scenario Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 text-gray-700">{currentScenario && getScenarioIcon(currentScenario.icon, 'w-12 h-12')}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentScenario?.title}</h2>
                  <p className="text-gray-600">{currentScenario?.description}</p>
                </div>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ml-4 ${
                    showComparison
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showComparison ? '← Back to Simulation' : '⇄ Compare'}
                </button>
              </div>

              {/* Conditional View: Simulation or Comparison */}
              {showComparison ? (
                <ComparisonView patterns={activePatterns} onToggleComparison={() => setShowComparison(false)} />
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Live Simulation</h3>
                  {selectedScenario === 'email-writer' && <EmailWriter patterns={activePatterns} />}
                  {selectedScenario === 'chatbot' && <Chatbot patterns={activePatterns} />}
                  {selectedScenario === 'recommender' && <Recommender patterns={activePatterns} />}
                  {selectedScenario === 'content-gen' && <ContentGen patterns={activePatterns} />}
                  {selectedScenario === 'predictor' && <Predictor patterns={activePatterns} />}
                </div>
              )}
            </div>

              {/* Right Column: Controls & Metrics */}
              <div className="space-y-8">
                {/* Pattern Controls */}
                <PatternControls
                  patterns={activePatterns}
                  setPatterns={setActivePatterns}
                  availablePatterns={currentScenario?.availablePatterns || []}
                />

                {/* Impact Metrics */}
                <ImpactMetrics patterns={activePatterns} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
