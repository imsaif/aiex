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

  const currentIndex = scenarios.findIndex((s) => s.id === scenarioId)
  const currentScenario = scenarios[currentIndex]
  const previousScenario = currentIndex > 0 ? scenarios[currentIndex - 1] : null
  const nextScenario = currentIndex < scenarios.length - 1 ? scenarios[currentIndex + 1] : null

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
          {/* Top Navigation */}
          <div className="flex items-center justify-between text-sm mb-10">
            <button
              onClick={() => router.push('/simulator')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:cursor-pointer transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Back to Use Cases</span>
            </button>

            {nextScenario && (
              <button
                onClick={() => router.push(`/simulator/${nextScenario.id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:cursor-pointer transition-colors"
              >
                <span>Next: {nextScenario.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Scenario Header with Compare Button */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex-1 flex items-center gap-3">
              <div className="text-gray-700 flex-shrink-0">{getScenarioIcon(currentScenario.icon, 'w-8 h-8')}</div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{currentScenario.title}</h1>
                <p className="text-gray-600">{currentScenario.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap mt-1 ${
                showComparison
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showComparison ? '← Back to Simulation' : '⇄ Compare'}
            </button>
          </div>

          {/* Simulation Area */}
          <div>

            {/* Main Layout: Simulation + Impact Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
              {/* Left: Simulation Area (full width, relative for floating patterns) */}
              <div className="lg:col-span-3 relative">
                {/* Conditional View: Simulation or Comparison */}
                {showComparison ? (
                  <ComparisonView patterns={activePatterns} onToggleComparison={() => setShowComparison(false)} />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {/* Pattern Controls - As a section inside the card */}
                    {controlsPanelOpen && (
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Active Patterns</p>
                        <PatternControls
                          patterns={activePatterns}
                          setPatterns={setActivePatterns}
                          availablePatterns={currentScenario.availablePatterns || []}
                          horizontal={true}
                        />
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

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-8 mt-12">
            {previousScenario ? (
              <button
                onClick={() => router.push(`/simulator/${previousScenario.id}`)}
                className="flex items-center text-gray-600 hover:text-gray-800 hover:cursor-pointer group mb-4 sm:mb-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>
                  <span className="block text-sm text-gray-500">Previous Use Case</span>
                  <span className="font-medium">{previousScenario.title}</span>
                </span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={() => router.push('/simulator')}
              className="px-5 py-2 bg-gradient-to-r from-pink-500/10 to-violet-500/10 text-gray-700 rounded-full hover:from-pink-500/20 hover:to-violet-500/20 hover:cursor-pointer transition-colors font-medium border border-gray-200"
            >
              View All Use Cases
            </button>

            {nextScenario ? (
              <button
                onClick={() => router.push(`/simulator/${nextScenario.id}`)}
                className="flex items-center text-gray-600 hover:text-gray-800 hover:cursor-pointer text-right group mt-4 sm:mt-0"
              >
                <span>
                  <span className="block text-sm text-gray-500">Next Use Case</span>
                  <span className="font-medium">{nextScenario.title}</span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 group-hover:transform group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
