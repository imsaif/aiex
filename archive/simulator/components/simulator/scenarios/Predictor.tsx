'use client'

import { useState } from 'react'
import type { PatternState } from '@/types/simulator'

interface Prediction {
  text: string
  confidence: number
}

interface PredictorProps {
  patterns: PatternState
}

export function Predictor({ patterns }: PredictorProps) {
  const [inputText, setInputText] = useState('')
  const [suggestions, setSuggestions] = useState<Prediction[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const predictionDatabase: Record<string, Prediction[]> = {
    hello: [
      { text: 'hello world', confidence: 95 },
      { text: 'hello there', confidence: 87 },
      { text: 'hello everyone', confidence: 73 }
    ],
    the: [
      { text: 'the quick brown', confidence: 92 },
      { text: 'the best way', confidence: 84 },
      { text: 'the future of', confidence: 78 }
    ],
    ai: [
      { text: 'AI technology', confidence: 96 },
      { text: 'AI model', confidence: 89 },
      { text: 'AI assistant', confidence: 82 }
    ],
    how: [
      { text: 'how to use', confidence: 91 },
      { text: 'how does it work', confidence: 85 },
      { text: 'how can i', confidence: 79 }
    ]
  }

  const handleInputChange = (value: string) => {
    setInputText(value)
    setSelectedIndex(-1)

    // Find predictions based on last word
    const words = value.trim().toLowerCase().split(' ')
    const lastWord = words[words.length - 1]

    if (lastWord && lastWord.length > 0) {
      const matches = Object.entries(predictionDatabase)
        .filter(([key]) => key.startsWith(lastWord))
        .flatMap(([, preds]) => preds)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)

      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (prediction: Prediction) => {
    const words = inputText.trim().split(' ')
    words[words.length - 1] = prediction.text
    const newText = words.join(' ')
    setInputText(newText + ' ')
    setSuggestions([])
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Start typing:</label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Try typing: 'hello', 'the', 'ai', 'how'..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {/* Pattern: Progressive Disclosure - Suggestions Panel */}
          {patterns.progressiveDisclosure && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              <div className="p-3 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600">AI Suggestions</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-900">{suggestion.text}</span>
                      {patterns.confidenceIndicators && (
                        <span className="text-xs font-medium text-gray-500">
                          {suggestion.confidence}%
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pattern: Contextual Assistance - Inline Suggestions */}
          {patterns.contextualAssistance && suggestions.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-600">Quick completions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{inputText.length}</div>
          <div className="text-xs text-blue-700 mt-1">Characters typed</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">{inputText.trim().split(' ').filter(w => w).length}</div>
          <div className="text-xs text-purple-700 mt-1">Words entered</div>
        </div>
      </div>

      {/* How it works */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
        <p className="text-sm font-semibold text-gray-900">How Predictive Text Works:</p>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• <span className="font-medium">Pattern Recognition:</span> AI learns from millions of text samples</li>
          <li>• <span className="font-medium">Context Aware:</span> Predictions improve based on your writing style</li>
          <li>• <span className="font-medium">Speed Boost:</span> Complete words in fewer keystrokes</li>
          {patterns.confidenceIndicators && (
            <li>• <span className="font-medium">Confidence Score:</span> Higher % = more likely to be correct</li>
          )}
          {patterns.progressiveDisclosure && (
            <li>• <span className="font-medium">Progressive:</span> More options available as you keep typing</li>
          )}
        </ul>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-xs font-semibold text-amber-900 mb-2">💡 Tip:</p>
        <p className="text-xs text-amber-800">
          Click suggestions to accept them, or continue typing to refine predictions. The AI learns your preferences over time.
        </p>
      </div>
    </div>
  )
}
