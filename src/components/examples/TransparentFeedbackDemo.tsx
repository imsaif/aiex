'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Confidence Indicator Component
interface ConfidenceIndicatorProps {
  confidence: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Export the ConfidenceIndicator component directly for use in live preview
export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  label,
  showPercentage = true,
  size = 'md',
  className = '',
}) => {
  // Ensure confidence is between 0 and 1
  const normalizedConfidence = Math.max(0, Math.min(1, confidence));
  
  // Convert to percentage for display
  const percentage = Math.round(normalizedConfidence * 100);
  
  // Determine color based on confidence level
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Determine the size of the indicator
  const getSize = () => {
    switch(size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  return (
    <div className={`${className} w-full`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSize()}`}>
        <motion.div
          className={`${getColor()} rounded-full ${getSize()}`}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {!label && showPercentage && (
        <span className="text-xs text-gray-500 mt-1">
          {percentage}% confidence
        </span>
      )}
    </div>
  );
};

// Simple demo component for the live preview
export const ConfidenceIndicatorDemo: React.FC = () => {
  const examples = [
    { label: 'Content is non-toxic', confidence: 0.92 },
    { label: 'Sentiment is positive', confidence: 0.78 },
    { label: 'Topic relevance', confidence: 0.85 },
    { label: 'Free of personal information', confidence: 0.35 }
  ];

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Analysis Results</h3>
      
      {examples.map((example, index) => (
        <ConfidenceIndicator
          key={index}
          confidence={example.confidence}
          label={example.label}
          size="md"
        />
      ))}
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Higher confidence scores (80%+) indicate stronger predictions, while lower scores suggest uncertainty.
          Consider human review for decisions with confidence below 70%.
        </p>
      </div>
    </div>
  );
};

// For the component preview system - using ConfidenceIndicatorDemo to provide a visual example
export default function ConfidenceIndicatorPreview() {
  return <AITransparencyDemo />;
}

// Mock content analyzer tool
interface ContentAnalysis {
  toxicity: number;
  sentiment: number;
  topicRelevance: number;
  personalInfo: number;
  factualAccuracy?: number;
}

// Enhanced AI Transparency Demo
export const AITransparencyDemo: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Simulate content analysis with AI
  const analyzeContent = () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate mock analysis results based on text content
      // In a real application, this would be an API call to an AI service
      const mockAnalysis: ContentAnalysis = {
        toxicity: text.includes('terrible') || text.includes('hate') ? 0.65 : 0.08,
        sentiment: text.includes('love') || text.includes('great') ? 0.85 : 
                   text.includes('bad') || text.includes('terrible') ? 0.35 : 0.62,
        topicRelevance: text.length > 30 ? 0.78 : 0.45,
        personalInfo: text.includes('phone') || text.includes('email') || text.includes('address') ? 0.92 : 0.15,
        factualAccuracy: text.length > 50 ? 0.73 : 0.45
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700">
        <p>This demo shows how AI confidence indicators help users understand the reliability of AI predictions. 
           Try typing some text and analyze it to see the confidence levels for different aspects.</p>
      </div>
      
      {/* Grid layout for side-by-side display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Form */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Analysis Tool</h3>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter some text to analyze with AI. Try including positive/negative words or personal information to see how it affects the analysis."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            disabled={isAnalyzing}
          />
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={analyzeContent}
              disabled={!text.trim() || isAnalyzing}
              className={`px-4 py-2 rounded-md font-medium text-white ${!text.trim() || isAnalyzing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : 'Analyze with AI'}
            </button>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="flex items-start h-full">
          {analysis ? (
            <div className="w-full space-y-4 bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Analysis Results</h3>
              
              <ConfidenceIndicator
                confidence={1 - analysis.toxicity}
                label="Content is non-toxic"
                size="md"
              />
              
              <ConfidenceIndicator
                confidence={analysis.sentiment}
                label="Sentiment is positive"
                size="md"
              />
              
              <ConfidenceIndicator
                confidence={analysis.topicRelevance}
                label="Topic relevance"
                size="md"
              />
              
              <ConfidenceIndicator
                confidence={1 - analysis.personalInfo}
                label="Free of personal information"
                size="md"
              />
              
              {analysis.factualAccuracy && (
                <ConfidenceIndicator
                  confidence={analysis.factualAccuracy}
                  label="Factual accuracy"
                  size="md"
                />
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">Understanding AI Confidence</h4>
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {showExplanation ? 'Hide explanation' : 'Learn more'}
                  </button>
                </div>
                
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2"
                  >
                    <p className="text-xs text-gray-600 mb-2">
                      Higher confidence scores (80%+) indicate stronger predictions, while lower scores suggest uncertainty.
                      Consider human review for decisions with confidence below 70%.
                    </p>
                    <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                      <li><span className="text-green-500 font-medium">Green bars (80-100%)</span>: High confidence in prediction</li>
                      <li><span className="text-yellow-500 font-medium">Yellow bars (60-79%)</span>: Moderate confidence, exercise caution</li>
                      <li><span className="text-orange-500 font-medium">Orange bars (40-59%)</span>: Low confidence, consider human review</li>
                      <li><span className="text-red-500 font-medium">Red bars (0-39%)</span>: Very low confidence, human review recommended</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center bg-white p-8 rounded-lg border border-gray-200 h-full">
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="text-sm">Enter some text and click &quot;Analyze with AI&quot; to see confidence indicators</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// For the full interactive demo in the examples section
export function TransparentFeedbackDemo({ example: _example = "confidence" }: { example?: string }) {
  // _example parameter is intentionally unused in this demo implementation
  return (
    <div className="w-full mx-auto">
      <AITransparencyDemo />
    </div>
  );
} 