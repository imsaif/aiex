export const codeExamples = [
  {
    title: "AI Decision Explainer Component",
    description: "Interactive component that shows how AI makes decisions with transparent reasoning, confidence scores, and contributing factors",
    language: "typescript",
    componentId: "explainable-ai-demo",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PredictionFactor {
  name: string;
  value: number;
  impact: 'positive' | 'negative';
  description: string;
}

interface PredictionResult {
  prediction: string;
  confidence: number;
  factors: PredictionFactor[];
  reasoning: string[];
  alternatives: { option: string; confidence: number }[];
}

export default function ExplainableAiDemo() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate AI analysis
  const analyzeInput = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis based on input
    const analysis: PredictionResult = {
      prediction: "Positive Sentiment",
      confidence: 0.87,
      factors: [
        {
          name: "Word Choice",
          value: 0.35,
          impact: "positive",
          description: "Contains positive keywords and expressions"
        },
        {
          name: "Sentence Structure",
          value: 0.25,
          impact: "positive",
          description: "Well-structured sentences indicate clarity"
        },
        {
          name: "Context Relevance",
          value: 0.20,
          impact: "positive",
          description: "Content aligns with expected context"
        },
        {
          name: "Emotional Tone",
          value: 0.15,
          impact: "positive",
          description: "Optimistic and constructive tone detected"
        },
        {
          name: "Ambiguity",
          value: -0.08,
          impact: "negative",
          description: "Some phrases could have multiple interpretations"
        }
      ],
      reasoning: [
        "The text contains predominantly positive language patterns",
        "Sentence structure suggests constructive intent",
        "No strong negative indicators were detected",
        "Context aligns with typical positive communication patterns"
      ],
      alternatives: [
        { option: "Neutral Sentiment", confidence: 0.09 },
        { option: "Negative Sentiment", confidence: 0.04 }
      ]
    };
    
    setResult(analysis);
    setLoading(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    return impact === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          AI Decision Explainer
        </h3>
        <p className="text-gray-600">
          See how AI makes decisions with transparent reasoning
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter text for sentiment analysis:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something to analyze..."
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows={3}
        />
        <button
          onClick={analyzeInput}
          disabled={!input.trim() || loading}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Prediction with Confidence */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">
                  Prediction: {result.prediction}
                </h4>
                <span className={\`text-2xl font-bold \${getConfidenceColor(result.confidence)}\`}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: \`\${result.confidence * 100}%\` }}
                />
              </div>
            </div>

            {/* Toggle for Detailed Explanation */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-blue-600"
            >
              <span>{showDetails ? 'Hide' : 'Show'} Detailed Explanation</span>
            </button>

            {/* Detailed Explanation */}
            {showDetails && (
              <div className="space-y-4">
                {/* Contributing Factors */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold mb-3">Contributing Factors:</h5>
                  {result.factors.map((factor, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={\`px-2 py-1 rounded text-xs \${getImpactColor(factor.impact)}\`}>
                          {factor.impact === 'positive' ? '+' : '-'}{Math.abs(factor.value * 100).toFixed(0)}%
                        </span>
                        <span>{factor.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{factor.description}</span>
                    </div>
                  ))}
                </div>

                {/* Reasoning Process */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold mb-3">Reasoning Process:</h5>
                  <ol className="list-decimal list-inside space-y-1">
                    {result.reasoning.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Alternative Predictions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold mb-3">Alternative Predictions:</h5>
                  {result.alternatives.map((alt, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{alt.option}</span>
                      <span className="text-gray-500">
                        {(alt.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`
  }
];