'use client';

import React, { useState, useEffect, useRef } from 'react';

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

const reasoningSteps = [
  "Reading the input text...",
  "Tokenizing words and phrases...",
  "Analyzing word choice and vocabulary...",
  "Detecting emotional tone indicators...",
  "Evaluating sentence structure patterns...",
  "Checking for negative sentiment markers...",
  "Assessing context and communication style...",
  "Calculating confidence scores...",
  "Generating prediction...",
];

const positiveWords = ['great', 'amazing', 'excellent', 'love', 'wonderful', 'fantastic', 'good', 'happy', 'excited', 'awesome', 'best', 'beautiful', 'brilliant', 'perfect', 'recommend', 'enjoy', 'thank', 'helpful', 'impressive', 'outstanding'];
const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointed', 'frustrating', 'annoying', 'poor', 'useless', 'waste', 'angry', 'sad', 'broken', 'fail', 'problem', 'issue', 'wrong', 'never'];

function analyzeText(text: string): PredictionResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;

  let prediction: string;
  let confidence: number;
  let factors: PredictionFactor[];
  let reasoning: string[];
  let alternatives: { option: string; confidence: number }[];

  if (positiveCount > negativeCount) {
    const ratio = positiveCount / Math.max(totalSentimentWords, 1);
    confidence = Math.min(0.95, 0.6 + (ratio * 0.3) + (positiveCount * 0.02));
    prediction = "Positive Sentiment";
    factors = [
      { name: "Positive Words", value: 0.35, impact: "positive", description: `Found ${positiveCount} positive expression${positiveCount !== 1 ? 's' : ''}` },
      { name: "Sentence Structure", value: 0.25, impact: "positive", description: "Constructive sentence patterns detected" },
      { name: "Emotional Tone", value: 0.20, impact: "positive", description: "Optimistic tone indicators present" },
      { name: "Context", value: 0.15, impact: "positive", description: "Content aligns with positive communication" },
      ...(negativeCount > 0 ? [{ name: "Mixed Signals", value: -0.05, impact: "negative" as const, description: `${negativeCount} contrasting term${negativeCount !== 1 ? 's' : ''} found` }] : [])
    ];
    reasoning = [
      `Detected ${positiveCount} positive language pattern${positiveCount !== 1 ? 's' : ''} in the text`,
      "Sentence structure suggests constructive intent",
      negativeCount > 0 ? `Found ${negativeCount} negative term${negativeCount !== 1 ? 's' : ''}, but positive signals dominate` : "No significant negative indicators detected",
      "Overall context aligns with positive communication style"
    ];
    alternatives = [
      { option: "Neutral Sentiment", confidence: Math.max(0.05, 0.15 - (positiveCount * 0.02)) },
      { option: "Negative Sentiment", confidence: Math.max(0.02, negativeCount * 0.03) }
    ];
  } else if (negativeCount > positiveCount) {
    const ratio = negativeCount / Math.max(totalSentimentWords, 1);
    confidence = Math.min(0.95, 0.6 + (ratio * 0.3) + (negativeCount * 0.02));
    prediction = "Negative Sentiment";
    factors = [
      { name: "Negative Words", value: 0.40, impact: "negative", description: `Found ${negativeCount} negative expression${negativeCount !== 1 ? 's' : ''}` },
      { name: "Emotional Tone", value: 0.25, impact: "negative", description: "Critical or frustrated tone detected" },
      { name: "Sentence Structure", value: 0.15, impact: "negative", description: "Patterns suggest dissatisfaction" },
      ...(positiveCount > 0 ? [{ name: "Mitigating Factors", value: 0.08, impact: "positive" as const, description: `${positiveCount} positive term${positiveCount !== 1 ? 's' : ''} noted` }] : [])
    ];
    reasoning = [
      `Detected ${negativeCount} negative language pattern${negativeCount !== 1 ? 's' : ''} in the text`,
      "Emotional tone suggests frustration or criticism",
      positiveCount > 0 ? `Found ${positiveCount} positive term${positiveCount !== 1 ? 's' : ''}, but negative signals are stronger` : "No significant positive indicators to offset",
      "Overall sentiment leans toward dissatisfaction"
    ];
    alternatives = [
      { option: "Neutral Sentiment", confidence: Math.max(0.05, 0.15 - (negativeCount * 0.02)) },
      { option: "Positive Sentiment", confidence: Math.max(0.02, positiveCount * 0.03) }
    ];
  } else {
    confidence = 0.65 + (Math.random() * 0.15);
    prediction = "Neutral Sentiment";
    factors = [
      { name: "Balanced Tone", value: 0.30, impact: "positive", description: "No strong emotional bias detected" },
      { name: "Objective Language", value: 0.25, impact: "positive", description: "Factual or informational style" },
      { name: "Mixed Signals", value: 0.10, impact: "negative", description: totalSentimentWords > 0 ? "Equal positive and negative indicators" : "No clear sentiment markers" }
    ];
    reasoning = [
      totalSentimentWords > 0 ? "Found balanced mix of positive and negative indicators" : "No strong emotional language detected",
      "Text appears factual or informational in nature",
      "Sentence structure suggests neutral communication",
      "No dominant sentiment pattern identified"
    ];
    alternatives = [
      { option: "Positive Sentiment", confidence: 0.15 + (positiveCount * 0.02) },
      { option: "Negative Sentiment", confidence: 0.10 + (negativeCount * 0.02) }
    ];
  }

  return { prediction, confidence, factors, reasoning, alternatives };
}

export default function ExplainableAiDemo() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentReasoningStep, setCurrentReasoningStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const reasoningRef = useRef<HTMLDivElement>(null);

  // Auto-scroll reasoning panel
  useEffect(() => {
    if (reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [visibleSteps]);

  const analyzeInput = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setVisibleSteps([]);
    setCurrentReasoningStep(0);

    // Show reasoning steps one by one
    for (let i = 0; i < reasoningSteps.length; i++) {
      setCurrentReasoningStep(i);
      setVisibleSteps(prev => [...prev, reasoningSteps[i]]);
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    }

    // Analyze the actual input
    const analysis = analyzeText(input);

    setResult(analysis);
    setShowDetails(false);
    setLoading(false);
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setShowDetails(false);
    setVisibleSteps([]);
    setCurrentReasoningStep(0);
  };

  return (
    <div className="w-full bg-surface-primary border border-primary rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-primary px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">AI Decision Explainer</h3>
          <p className="text-sm text-text-secondary mt-1">
            See how AI makes decisions with transparent reasoning
          </p>
        </div>
        {(result || loading) && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-secondary rounded-lg hover:border-primary transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-secondary">
              Enter text for sentiment analysis:
            </label>
            <span className={`text-xs ${input.length > 200 ? 'text-red-500' : 'text-text-tertiary'}`}>
              {input.length}/200
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 200))}
            placeholder="Type a short sentence to analyze..."
            className="w-full p-4 border border-secondary rounded-xl bg-surface-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition text-base"
            rows={2}
            disabled={loading}
            maxLength={200}
          />
          <button
            onClick={analyzeInput}
            disabled={!input.trim() || loading}
            className="mt-4 px-6 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>

        {/* Live Reasoning Panel - Shows during analysis */}
        {loading && visibleSteps.length > 0 && (
          <div className="bg-surface-secondary border border-primary rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-primary flex items-center gap-2">
              <div className="w-2 h-2 bg-status-warning rounded-full animate-pulse" />
              <span className="text-sm font-medium text-text-primary">AI Reasoning</span>
            </div>
            <div
              ref={reasoningRef}
              className="p-5 max-h-48 overflow-y-auto font-mono text-sm space-y-2"
            >
              {visibleSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    index === visibleSteps.length - 1 ? 'text-text-primary' : 'text-text-tertiary'
                  }`}
                >
                  <span className="text-text-tertiary select-none">&gt;</span>
                  <span>{step}</span>
                  {index === visibleSteps.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-text-primary animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-5">
            {/* Completed Reasoning Panel */}
            <div className="bg-surface-secondary border border-primary rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-primary flex items-center gap-2">
                <div className="w-2 h-2 bg-status-success rounded-full" />
                <span className="text-sm font-medium text-text-primary">AI Reasoning Complete</span>
              </div>
              <div className="p-5 max-h-36 overflow-y-auto font-mono text-sm space-y-1">
                {visibleSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-text-tertiary">
                    <span className="select-none">&gt;</span>
                    <span>{step}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2 text-status-success font-medium pt-2">
                  <span className="select-none">&gt;</span>
                  <span>Analysis complete. Result: {result.prediction}</span>
                </div>
              </div>
            </div>

            {/* Main Prediction */}
            <div className="bg-surface-secondary border border-primary rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-text-primary">
                  Prediction: {result.prediction}
                </h4>
                <span className="text-2xl font-bold text-status-success">
                  {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-surface-primary rounded-full h-2 border border-secondary">
                <div
                  className="bg-accent-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <p className="text-sm text-text-tertiary mt-2">Confidence score</p>
            </div>

            {/* Explanation Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium transition-all active:scale-95 cursor-pointer"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{showDetails ? 'Hide' : 'Show'} Detailed Breakdown</span>
            </button>

            {/* Detailed Explanation */}
            {showDetails && (
              <div className="space-y-4">
                {/* Contributing Factors */}
                <div className="bg-surface-secondary rounded-xl p-5">
                  <h5 className="font-semibold text-text-primary mb-4">Contributing Factors</h5>
                  <div className="space-y-3">
                    {result.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            factor.impact === 'positive'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {factor.impact === 'positive' ? '+' : '-'}{Math.abs(factor.value * 100).toFixed(0)}%
                          </span>
                          <span className="text-text-primary font-medium">{factor.name}</span>
                        </div>
                        <span className="text-sm text-text-tertiary text-right">{factor.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reasoning Steps */}
                <div className="bg-surface-secondary rounded-xl p-5">
                  <h5 className="font-semibold text-text-primary mb-4">Summary</h5>
                  <ol className="list-decimal list-inside space-y-2">
                    {result.reasoning.map((step, index) => (
                      <li key={index} className="text-text-secondary">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Alternative Predictions */}
                <div className="bg-surface-secondary rounded-xl p-5">
                  <h5 className="font-semibold text-text-primary mb-4">Alternative Predictions</h5>
                  <div className="space-y-3">
                    {result.alternatives.map((alt, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-text-secondary">{alt.option}</span>
                        <span className="text-text-tertiary text-sm">
                          {(alt.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example prompt */}
        {!input && !result && !loading && (
          <div className="p-4 bg-surface-secondary rounded-xl">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-text-primary">Try this example:</span> &quot;I&apos;m really excited about the new features in this product. The team has done an amazing job!&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
