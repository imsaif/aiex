'use client'

import { useState } from 'react'
import type { PatternState } from '@/types/simulator'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  confidence?: number
  fallbackUsed?: boolean
}

interface ChatbotProps {
  patterns: PatternState
}

export function Chatbot({ patterns }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello! I\'m the customer support assistant. How can I help you today?',
      confidence: 95
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    // Simulate bot response
    setTimeout(() => {
      const confidence = Math.floor(Math.random() * 30) + 65 // 65-95%
      const shouldFallback = Math.random() > 0.7 // 30% chance

      const botMessage: Message = {
        id: Date.now().toString(),
        role: 'bot',
        content: shouldFallback
          ? "I'm not entirely sure about that. Let me connect you with a human agent who can better assist you."
          : "Thanks for your question! Based on our system, I can help you with: 1) Account information, 2) Order status, 3) Returns & refunds, 4) Technical support. Which would you like help with?",
        confidence,
        fallbackUsed: shouldFallback
      }

      setMessages((prev) => [...prev, botMessage])
      setIsProcessing(false)
    }, 1000)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col h-[600px] hover:shadow-md transition-shadow">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-lg p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>

                {/* Pattern: Confidence Indicators */}
                {patterns.confidenceIndicators && message.role === 'bot' && message.confidence !== undefined && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-80">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${
                            message.confidence > 80 ? 'bg-green-500' :
                            message.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${message.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs opacity-80">{message.confidence}%</span>
                    </div>
                  </div>
                )}

                {/* Pattern: Graceful Degradation */}
                {patterns.gracefulDegradation && message.fallbackUsed && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <p className="text-xs opacity-80 italic">
                      ⚠ AI confidence was low. Human escalation available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pattern: Contextual Assistance */}
      {patterns.contextualAssistance && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Quick Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {['Check Order Status', 'Return Item', 'Account Settings', 'Contact Support'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Pattern: Human-in-the-Loop */}
        {patterns.humanInTheLoop && messages.length > 2 && (
          <div className="mt-3 pt-3 border-t">
            <button className="w-full px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium">
              🤝 Request Human Agent
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
