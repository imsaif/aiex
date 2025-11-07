'use client'

import { useState } from 'react'
import type { PatternState } from '@/types/simulator'

interface Product {
  id: string
  name: string
  price: string
  rating: number
  image: string
  confidence: number
  reason: string
}

interface RecommenderProps {
  patterns: PatternState
}

export function Recommender({ patterns }: RecommenderProps) {
  const [selectedCategory, setSelectedCategory] = useState('electronics')
  const [expandedReason, setExpandedReason] = useState<string | null>(null)

  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: '$79.99',
      rating: 4.8,
      image: '🎧',
      confidence: 92,
      reason: 'Based on your purchase history of audio equipment and 5-star reviews'
    },
    {
      id: '2',
      name: 'Phone Case Pro',
      price: '$24.99',
      rating: 4.6,
      image: '📱',
      confidence: 88,
      reason: 'Compatible with your recent phone purchase and preferred color'
    },
    {
      id: '3',
      name: 'USB-C Hub',
      price: '$49.99',
      rating: 4.7,
      image: '🔌',
      confidence: 81,
      reason: 'Popular with customers who bought similar electronics'
    }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Category Filter */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Browse Category:</label>
        <div className="flex flex-wrap gap-2">
          {['electronics', 'accessories', 'home', 'fashion'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product Image Area */}
            <div className="bg-gray-50 h-40 flex items-center justify-center text-6xl border-b border-gray-200">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-lg font-bold text-blue-600 mt-1">{product.price}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <span className="text-sm">⭐ {product.rating}</span>
                <span className="text-xs text-gray-500">(324 reviews)</span>
              </div>

              {/* Pattern: Confidence Indicators */}
              {patterns.confidenceIndicators && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">Match Score</span>
                    <span className="text-xs font-bold text-gray-900">{product.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        product.confidence > 85 ? 'bg-green-500' :
                        product.confidence > 70 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${product.confidence}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Pattern: Explainable AI - Show Why */}
              {patterns.explainableAI && (
                <button
                  onClick={() => setExpandedReason(expandedReason === product.id ? null : product.id)}
                  className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
                >
                  {expandedReason === product.id ? '▼ Hide' : '▶ Why recommended?'}
                </button>
              )}

              {expandedReason === product.id && patterns.explainableAI && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">{product.reason}</p>
                </div>
              )}

              {/* Add to Cart */}
              <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pattern: Progressive Disclosure */}
      {patterns.progressiveDisclosure && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
          <p className="text-sm font-semibold text-purple-900">More Options Available</p>
          <div className="flex gap-2">
            <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition-colors">
              View Similar Items
            </button>
            <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition-colors">
              See Trending Now
            </button>
            <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition-colors">
              Browse All Products
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <span className="font-semibold">AI Powered:</span> These recommendations are personalized based on your browsing and purchase history.
        </p>
      </div>
    </div>
  )
}
