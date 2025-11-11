'use client'

import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { ScenarioCard } from './ScenarioCard'
import { scenarios } from '@/lib/simulator/patterns'

export function ScenarioListView() {
  const router = useRouter()

  const handleScenarioSelect = (scenarioId: string) => {
    router.push(`/simulator/${scenarioId}`)
  }

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      <div className="pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Center Aligned */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center">
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                {scenarios.length} AI Use Cases
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Test AI Patterns in Real Use Cases
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Compare patterns side-by-side and explore their potential impact.
            </p>
          </div>

          {/* Scenarios Grid */}
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario, index) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={handleScenarioSelect}
                  index={index}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
