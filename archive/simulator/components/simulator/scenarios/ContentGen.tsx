'use client'

import { useState } from 'react'
import type { PatternState } from '@/types/simulator'

interface ContentGenProps {
  patterns: PatternState
}

export function ContentGen({ patterns }: ContentGenProps) {
  const [topic, setTopic] = useState('Artificial Intelligence Trends')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [editHistory, setEditHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [status, setStatus] = useState<'idle' | 'approved' | 'rejected' | 'pending'>('idle')

  const sampleContent = `
    Artificial intelligence is transforming how we work and live. From natural language processing to computer vision, AI technologies are becoming more sophisticated every day.

    Key trends in 2024 include:
    • Multimodal AI models that process both text and images
    • Enhanced reasoning capabilities in language models
    • Improved AI safety and alignment techniques
    • Greater focus on energy efficiency in AI training

    As organizations adopt AI, the focus remains on ethical implementation and responsible deployment.
  `.trim()

  const handleGenerate = () => {
    setIsGenerating(true)
    setStatus('pending')

    setTimeout(() => {
      setGeneratedContent(sampleContent)
      setConfidence(Math.floor(Math.random() * 20) + 75)

      const newHistory = editHistory.slice(0, historyIndex + 1)
      newHistory.push(sampleContent)
      setEditHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      setIsGenerating(false)
    }, 2000)
  }

  const handleEdit = (value: string) => {
    setGeneratedContent(value)
    setConfidence(0)
    setStatus('idle')

    const newHistory = editHistory.slice(0, historyIndex + 1)
    newHistory.push(value)
    setEditHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleApprove = () => {
    setStatus('approved')
  }

  const handleReject = () => {
    setStatus('rejected')
    setGeneratedContent('')
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setGeneratedContent(editHistory[historyIndex - 1] || '')
    }
  }

  const redo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setGeneratedContent(editHistory[historyIndex + 1] || '')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Configuration Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tone:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
            <option value="creative">Creative</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Length:</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="short">Short (100-200 words)</option>
            <option value="medium">Medium (300-500 words)</option>
            <option value="long">Long (800+ words)</option>
          </select>
        </div>
      </div>

      {/* Content Display Area */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Generated Content:</label>

        {isGenerating ? (
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-300">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3" />
              <p className="text-gray-600 font-medium">AI is generating your content...</p>
              <p className="text-sm text-gray-500 mt-1">This usually takes 30-60 seconds</p>
            </div>
          </div>
        ) : (
          <>
            <textarea
              value={generatedContent}
              onChange={(e) => handleEdit(e.target.value)}
              placeholder={`Your ${length} AI-generated content will appear here...`}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            {/* Pattern: Confidence Indicators */}
            {patterns.confidenceIndicators && confidence > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Content Quality Score:</span>
                  <span className="text-sm font-bold text-gray-900">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      confidence > 85 ? 'bg-green-500' : confidence > 70 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generatedContent ? 'Regenerate' : 'Generate Content'}
        </button>

        {/* Pattern: Human-in-the-Loop */}
        {patterns.humanInTheLoop && generatedContent && (
          <>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
            >
              👎 Reject
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              👍 Approve & Publish
            </button>
          </>
        )}
      </div>

      {/* Pattern: Undo/Redo */}
      {patterns.undoRedo && generatedContent && (
        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= editHistory.length - 1}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↷ Redo
          </button>
        </div>
      )}

      {/* Status Indicator */}
      {status !== 'idle' && (
        <div
          className={`p-4 rounded-lg border ${
            status === 'approved'
              ? 'bg-green-50 border-green-200 text-green-900'
              : status === 'rejected'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-yellow-50 border-yellow-200 text-yellow-900'
          }`}
        >
          <p className="text-sm font-semibold">
            {status === 'approved'
              ? '✓ Content approved and ready to publish!'
              : status === 'rejected'
                ? '✗ Content rejected. Ready to regenerate.'
                : '⏳ Awaiting your review...'}
          </p>
        </div>
      )}
    </div>
  )
}
