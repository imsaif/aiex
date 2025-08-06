import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Error Recovery & Graceful Degradation Interactive Demo",
    description: "This React component demonstrates error recovery & graceful degradation with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "error-recovery-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIError {
  id: string;
  type: 'confidence' | 'timeout' | 'unavailable' | 'unexpected';
  message: string;
  recoveryOptions: RecoveryOption[];
  confidence?: number;
}

interface RecoveryOption {
  id: string;
  label: string;
  action: 'retry' | 'fallback' | 'manual' | 'feedback';
  description: string;
}

type SystemState = 'working' | 'low-confidence' | 'error' | 'recovering';

export default function ErrorRecoveryDemo() {
  const [query, setQuery] = useState('');
  const [systemState, setSystemState] = useState<SystemState>('working');
  const [currentError, setCurrentError] = useState<AIError | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(100);
  const [retryCount, setRetryCount] = useState(0);

  const simulateAIProcess = async (input: string) => {
    if (input.length === 0) return;

    setResults([]);
    
    // Simulate different error scenarios based on input
    const scenarios: { [key: string]: () => void } = {
      'error': () => simulateError(),
      'timeout': () => simulateTimeout(),
      'low confidence': () => simulateLowConfidence(),
      'unavailable': () => simulateUnavailable(),
    };

    const lowerInput = input.toLowerCase();
    const matchedScenario = Object.keys(scenarios).find(key => lowerInput.includes(key));
    
    if (matchedScenario) {
      scenarios[matchedScenario]();
    } else {
      // Normal successful operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSystemState('working');
      setConfidence(Math.random() * 30 + 70);
      setResults([
        \`Result 1 for "\${input}"\`,
        \`Result 2 for "\${input}"\`,
        \`Result 3 for "\${input}"\`
      ]);
    }
  };

  const simulateError = () => {
    setSystemState('error');
    setCurrentError({
      id: 'unexpected-error',
      type: 'unexpected',
      message: 'An unexpected error occurred while processing your request.',
      recoveryOptions: [
        {
          id: 'retry',
          label: 'Try Again',
          action: 'retry',
          description: 'Retry the same request'
        },
        {
          id: 'simplify',
          label: 'Simplify Query',
          action: 'fallback',
          description: 'Try a simpler version of your request'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Switch to traditional search'
        },
        {
          id: 'feedback',
          label: 'Report Issue',
          action: 'feedback',
          description: 'Help us improve by reporting this error'
        }
      ]
    });
  };

  const simulateTimeout = () => {
    setSystemState('error');
    setCurrentError({
      id: 'timeout-error',
      type: 'timeout',
      message: 'The AI is taking longer than expected to respond.',
      recoveryOptions: [
        {
          id: 'wait',
          label: 'Wait Longer',
          action: 'retry',
          description: 'Give the AI more time to process'
        },
        {
          id: 'fallback',
          label: 'Quick Results',
          action: 'fallback',
          description: 'Get faster, simpler results'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Switch to traditional search'
        }
      ]
    });
  };

  const simulateLowConfidence = () => {
    setSystemState('low-confidence');
    setConfidence(35);
    setCurrentError({
      id: 'low-confidence',
      type: 'confidence',
      message: 'AI confidence is low for this query. Results may not be accurate.',
      confidence: 35,
      recoveryOptions: [
        {
          id: 'proceed',
          label: 'Show Results Anyway',
          action: 'fallback',
          description: 'View results with caution'
        },
        {
          id: 'rephrase',
          label: 'Rephrase Query',
          action: 'manual',
          description: 'Try asking in a different way'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Use traditional search instead'
        }
      ]
    });
  };

  const simulateUnavailable = () => {
    setSystemState('error');
    setCurrentError({
      id: 'unavailable',
      type: 'unavailable',
      message: 'AI service is temporarily unavailable.',
      recoveryOptions: [
        {
          id: 'fallback',
          label: 'Basic Search',
          action: 'fallback',
          description: 'Use simplified search functionality'
        },
        {
          id: 'notify',
          label: 'Notify When Available',
          action: 'feedback',
          description: 'Get notified when AI is back online'
        },
        {
          id: 'manual',
          label: 'Manual Search',
          action: 'manual',
          description: 'Use traditional search'
        }
      ]
    });
  };

  const handleRecovery = async (option: RecoveryOption) => {
    setSystemState('recovering');
    setCurrentError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (option.action) {
      case 'retry':
        setRetryCount(prev => prev + 1);
        if (retryCount < 2) {
          simulateAIProcess(query);
        } else {
          // After multiple retries, show fallback
          setSystemState('working');
          setResults(['Simplified result for: ' + query]);
        }
        break;
      case 'fallback':
        setSystemState('working');
        setResults(['Fallback result for: ' + query]);
        break;
      case 'manual':
        setSystemState('working');
        setResults(['Manual search result for: ' + query]);
        break;
      case 'feedback':
        setSystemState('working');
        alert('Thank you for your feedback! Our team will review this issue.');
        break;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      simulateAIProcess(query);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const getSystemStatusColor = () => {
    switch (systemState) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'low-confidence': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'recovering': return 'bg-blue-100 text-blue-800';
    }
  };

  const getSystemStatusText = () => {
    switch (systemState) {
      case 'working': return 'AI Working Normally';
      case 'low-confidence': return 'Low Confidence Warning';
      case 'error': return 'Error Detected';
      case 'recovering': return 'Recovering...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Error Recovery System</h2>
        <p className="text-gray-600">Demonstrating graceful error handling and recovery options</p>
      </header>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            AI Search Query
          </label>
          <div className={\`px-3 py-1 rounded-full text-xs font-medium \${getSystemStatusColor()}\`}>
            {getSystemStatusText()}
          </div>
        </div>
        
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Try: 'error', 'timeout', 'low confidence', 'unavailable', or any other query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <div className="mt-2 text-sm text-gray-500">
          Test different error scenarios: "error", "timeout", "low confidence", "unavailable"
        </div>
      </div>

      <AnimatePresence>
        {currentError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  {currentError.type.charAt(0).toUpperCase() + currentError.type.slice(1)} Error
                </h3>
                <p className="text-sm text-red-700 mb-3">{currentError.message}</p>
                
                {currentError.confidence && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-red-600 mb-1">
                      <span>Confidence Level</span>
                      <span>{currentError.confidence}%</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: \`\${currentError.confidence}%\` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-800">Recovery Options:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentError.recoveryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleRecovery(option)}
                        className="text-left p-3 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <div className="font-medium text-red-800 text-sm">{option.label}</div>
                        <div className="text-xs text-red-600 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {systemState === 'working' && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Search Results</span>
            {confidence < 70 && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                Confidence: {Math.round(confidence)}%
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-800">{result}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {systemState === 'recovering' && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
          <span className="text-gray-600">Applying recovery solution...</span>
        </div>
      )}
    </div>
  );
}`
  }
];
