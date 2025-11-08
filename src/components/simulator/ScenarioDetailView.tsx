'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
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

interface ScenarioDetailViewProps {
  scenarioId: string
}

export function ScenarioDetailView({ scenarioId }: ScenarioDetailViewProps) {
  const router = useRouter()
  const [showComparison, setShowComparison] = useState(false)
  const [controlsPanelOpen, setControlsPanelOpen] = useState(true)
  const [activePatterns, setActivePatterns] = useState<PatternState>({
    explainableAI: false,
    confidenceIndicators: false,
    humanInTheLoop: false,
    progressiveDisclosure: false,
    undoRedo: false,
    gracefulDegradation: false,
    contextualAssistance: false
  })

  const currentScenario = scenarios.find((s) => s.id === scenarioId)

  if (!currentScenario) {
    return (
      <main className="min-h-screen bg-background-primary text-text-primary">
        <Navbar />
        <div className="pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Scenario not found</h1>
            <p className="text-gray-600 mb-6">The scenario you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/simulator')}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Back to scenarios
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      <div className="pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/simulator')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium mb-6"
          >
            ← Back to scenarios
          </button>

          {/* Scenario Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-700">{getScenarioIcon(currentScenario.icon, 'w-8 h-8')}</div>
              <h1 className="text-3xl font-bold text-gray-900">{currentScenario.title}</h1>
            </div>
            <p className="text-gray-600">{currentScenario.description}</p>
          </div>

          {/* Simulation Area with Controls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Live Simulation</h2>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  showComparison
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showComparison ? '← Back to Simulation' : '⇄ Compare'}
              </button>
            </div>

            {/* Main Layout: Simulation + Impact Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
              {/* Left: Simulation Area (full width, relative for floating patterns) */}
              <div className="lg:col-span-3 relative">
                {/* Conditional View: Simulation or Comparison */}
                {showComparison ? (
                  <ComparisonView patterns={activePatterns} onToggleComparison={() => setShowComparison(false)} />
                ) : (
                  <div className="space-y-4">
                    {/* Pattern Controls - In normal flow, not floating */}
                    {controlsPanelOpen && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        {/* Pattern Controls - Horizontal Layout */}
                        <div>
                          <PatternControls
                            patterns={activePatterns}
                            setPatterns={setActivePatterns}
                            availablePatterns={currentScenario.availablePatterns || []}
                            horizontal={true}
                          />
                        </div>
                      </div>
                    )}

                    {/* Simulation Content */}
                    <div>
                      {scenarioId === 'email-writer' && <EmailWriter patterns={activePatterns} />}
                      {scenarioId === 'chatbot' && <Chatbot patterns={activePatterns} />}
                      {scenarioId === 'recommender' && <Recommender patterns={activePatterns} />}
                      {scenarioId === 'content-gen' && <ContentGen patterns={activePatterns} />}
                      {scenarioId === 'predictor' && <Predictor patterns={activePatterns} />}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Impact Metrics (Static, not floating) */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-24">
                  <ImpactMetrics patterns={activePatterns} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Controls Toggle Button */}
          {!controlsPanelOpen && (
            <button
              onClick={() => setControlsPanelOpen(true)}
              className="fixed bottom-8 right-8 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg"
            >
              ⚙ Show Controls
            </button>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
