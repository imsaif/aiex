'use client'

import { useState } from 'react'
import type { PatternState } from '@/types/simulator'

interface EmailWriterProps {
  patterns: PatternState
}

export function EmailWriter({ patterns }: EmailWriterProps) {
  const [emailContent, setEmailContent] = useState('')
  const [subject, setSubject] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [explanations, setExplanations] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const generateEmail = () => {
    setIsGenerating(true)

    // Simulate AI generation delay
    setTimeout(() => {
      const generatedContent =
        "Thank you for your interest in our product.\n\nI wanted to follow up on the points we discussed in our previous conversation. Based on your feedback, I believe we have a solution that addresses your specific needs.\n\nWould you be available for a quick call next week to discuss further?\n\nBest regards"

      setEmailContent(generatedContent)
      setConfidence(Math.floor(Math.random() * 30) + 70) // 70-100%
      setExplanations([
        'Used formal tone based on recipient domain',
        'Included key points from your previous conversation',
        'Kept under 150 words for better engagement'
      ])

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(generatedContent)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      setIsGenerating(false)
    }, 1500)
  }

  const handleContentChange = (value: string) => {
    setEmailContent(value)
    setConfidence(0)
    setExplanations([])

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(value)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setEmailContent(history[historyIndex - 1] || '')
      setConfidence(0)
      setExplanations([])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setEmailContent(history[historyIndex + 1] || '')
      setConfidence(0)
      setExplanations([])
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Email Headers */}
      <div className="border-b border-gray-200 pb-4 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">To:</label>
          <input
            type="email"
            placeholder="sarah@company.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Subject:</label>
          <input
            type="text"
            placeholder="Project Update"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Email Content Area */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Message:</label>

        {isGenerating ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2" />
              <p className="text-gray-600">AI is writing...</p>
            </div>
          </div>
        ) : (
          <>
            <textarea
              value={emailContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Start typing or generate with AI..."
            />

            {/* Pattern: Confidence Indicators */}
            {patterns.confidenceIndicators && confidence > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">AI Confidence:</span>
                  <span className="text-sm font-bold text-gray-900">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      confidence > 80 ? 'bg-green-500' : confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            )}

            {/* Pattern: Explainable AI */}
            {patterns.explainableAI && explanations.length > 0 && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-semibold text-gray-900 mb-2">Why AI wrote this:</div>
                <ul className="text-sm space-y-2 text-gray-700">
                  {explanations.map((exp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pattern: Human-in-the-Loop Actions */}
      <div className="pt-4 border-t">
        {patterns.humanInTheLoop ? (
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-red-100 text-red-700 font-medium text-sm rounded-lg hover:bg-red-200 transition-colors">
              Reject
            </button>
            <button className="px-4 py-2 bg-yellow-100 text-yellow-700 font-medium text-sm rounded-lg hover:bg-yellow-200 transition-colors">
              Edit & Regenerate
            </button>
            <button className="px-4 py-2 bg-green-500 text-white font-medium text-sm rounded-lg hover:bg-green-600 transition-colors">
              Approve & Send
            </button>
          </div>
        ) : (
          <button
            onClick={generateEmail}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Email with AI'}
          </button>
        )}
      </div>

      {/* Pattern: Undo/Redo */}
      {patterns.undoRedo && (
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↷ Redo
          </button>
        </div>
      )}
    </div>
  )
}
