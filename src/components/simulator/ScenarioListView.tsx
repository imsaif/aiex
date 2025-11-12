'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { ScenarioCard } from './ScenarioCard'
import { scenarios } from '@/lib/simulator/patterns'
import { CameraIcon } from '@heroicons/react/24/outline'

interface AnalysisResult {
  detected_patterns: Record<string, boolean>
  pattern_count: number
  summary: string
}

export function ScenarioListView() {
  const router = useRouter()
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScenarioSelect = (scenarioId: string) => {
    router.push(`/simulator/${scenarioId}`)
  }

  const getMockAnalysis = (): AnalysisResult => {
    // Generate different mock results for variety
    const mockScenarios: AnalysisResult[] = [
      {
        detected_patterns: {
          explainableAI: true,
          confidenceIndicators: true,
          humanInTheLoop: true,
          progressiveDisclosure: false,
          undoRedo: true,
          gracefulDegradation: false,
          contextualAssistance: true,
        },
        pattern_count: 5,
        summary: 'This design demonstrates strong AI transparency with clear explanations, confidence indicators, and human oversight controls.',
      },
      {
        detected_patterns: {
          explainableAI: false,
          confidenceIndicators: true,
          humanInTheLoop: false,
          progressiveDisclosure: true,
          undoRedo: false,
          gracefulDegradation: true,
          contextualAssistance: true,
        },
        pattern_count: 4,
        summary: 'This interface shows moderate AI integration with smart information disclosure and contextual help, but lacks transparency features.',
      },
      {
        detected_patterns: {
          explainableAI: true,
          confidenceIndicators: false,
          humanInTheLoop: true,
          progressiveDisclosure: true,
          undoRedo: true,
          gracefulDegradation: false,
          contextualAssistance: false,
        },
        pattern_count: 4,
        summary: 'Strong human control and reversibility features present, with progressive disclosure of AI capabilities.',
      },
    ]

    // Randomly select a mock scenario for variety
    return mockScenarios[Math.floor(Math.random() * mockScenarios.length)]
  }

  const analyzeImage = async (imageBase64: string) => {
    console.log('Starting pattern analysis...')
    setIsAnalyzing(true)
    setError(null)

    // Check if mock mode is enabled
    const isMockMode = process.env.NEXT_PUBLIC_MOCK_ANALYSIS === 'true'

    try {
      if (isMockMode) {
        // Mock mode: Simulate API delay and return mock data
        console.log('🎭 Running in MOCK MODE (no API call)')
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate 2s delay

        const mockResult = getMockAnalysis()
        console.log('✅ Mock Analysis complete:', mockResult)
        console.log('📊 Detected patterns:', mockResult.detected_patterns)
        console.log('🔢 Pattern count:', mockResult.pattern_count)
        console.log('📝 Summary:', mockResult.summary)
        setAnalysisResults(mockResult)
      } else {
        // Real mode: Call actual API
        const response = await fetch('/api/analyze-patterns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 }),
        })

        const result = await response.json()

        if (result.success) {
          console.log('✅ Analysis complete:', result.analysis)
          console.log('📊 Detected patterns:', result.analysis.detected_patterns)
          console.log('🔢 Pattern count:', result.analysis.pattern_count)
          console.log('📝 Summary:', result.analysis.summary)
          setAnalysisResults(result.analysis)
        } else {
          throw new Error(result.error || 'Analysis failed')
        }
      }
    } catch (err) {
      console.error('❌ Analysis failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze patterns')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset previous state
    setError(null)
    setAnalysisResults(null)

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large. Please upload under 10MB')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result as string
      setAnalyzedImage(base64)
      await analyzeImage(base64)
    }
    reader.onerror = () => {
      setError('Failed to read image. Please try again')
    }
    reader.readAsDataURL(file)
  }

  const formatPatternName = (pattern: string): string => {
    // Convert camelCase to Title Case
    const formatted = pattern
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim()
    return formatted
  }

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_ANALYSIS === 'true'

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

          {/* Analyze Mode - Upload Section */}
          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-2xl font-semibold">Analyze Your Design</h2>
                  {isMockMode && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                      DEMO MODE
                    </span>
                  )}
                </div>
                <p className="text-text-secondary">
                  {isMockMode
                    ? 'Upload any image to see a demo analysis (no API required)'
                    : 'Upload a screenshot to detect AI UX patterns'}
                </p>
              </div>

              {/* Upload Button */}
              <div className="text-center mb-6">
                {!isAnalyzing ? (
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer shadow-lg hover:shadow-xl">
                    <CameraIcon className="w-5 h-5" />
                    Upload Design
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                ) : (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      Analyzing patterns...
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              {/* Analysis Results - Phase 1: Basic Display */}
              {analysisResults && analyzedImage && (
                <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  {/* Uploaded Image Preview */}
                  <div className="mb-4">
                    <img
                      src={analyzedImage}
                      alt="Analyzed design"
                      className="w-full h-48 object-contain rounded-lg bg-gray-50 dark:bg-gray-900"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-3">Analysis Results</h3>

                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                      <span className="font-semibold">Found {analysisResults.pattern_count} AI patterns</span> in your design
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {analysisResults.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(analysisResults.detected_patterns).map(([pattern, detected]) => (
                      <div
                        key={pattern}
                        className={`p-3 rounded text-sm font-medium ${
                          detected
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <span className="mr-2">{detected ? '✓' : '○'}</span>
                        {formatPatternName(pattern)}
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 italic">
                    {isMockMode
                      ? '🎭 Demo Mode: These are simulated results. Add ANTHROPIC_API_KEY to .env.local for real analysis.'
                      : 'Phase 1: Check browser console for detailed results'}
                  </div>
                </div>
              )}
            </div>
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
