'use client';

import React, { useState, useEffect } from 'react';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateAIProcess = async (input: string) => {
    if (input.length === 0) return;

    setIsProcessing(true);
    setResults([]);
    
    // Simulate different error scenarios based on input
    const scenarios: { [key: string]: () => void } = {
      'error': () => simulateError(),
      'timeout': () => simulateTimeout(),
      'low confidence': () => simulateLowConfidence(),
      'unavailable': () => simulateUnavailable(),
    };

    const normalScenarios: { [key: string]: () => void } = {
      'success': () => simulateSuccess(),
      'good': () => simulateSuccess(),
      'working': () => simulateSuccess(),
    };

    // Check for error scenarios
    const errorTrigger = Object.keys(scenarios).find(key => 
      input.toLowerCase().includes(key)
    );

    const successTrigger = Object.keys(normalScenarios).find(key => 
      input.toLowerCase().includes(key)
    );

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (errorTrigger) {
      scenarios[errorTrigger]();
    } else if (successTrigger) {
      normalScenarios[successTrigger]();
    } else {
      // Random scenario for other inputs
      const random = Math.random();
      if (random < 0.3) simulateLowConfidence();
      else if (random < 0.15) simulateError();
      else simulateSuccess();
    }

    setIsProcessing(false);
  };

  const simulateSuccess = () => {
    setSystemState('working');
    setCurrentError(null);
    setConfidence(Math.floor(Math.random() * 20) + 80); // 80-100%
    setResults([
      'Successfully processed your request',
      'Found relevant information',
      'Analysis complete with high confidence'
    ]);
    setRetryCount(0);
  };

  const simulateLowConfidence = () => {
    setSystemState('low-confidence');
    setCurrentError(null);
    setConfidence(Math.floor(Math.random() * 30) + 40); // 40-70%
    setResults([
      'Results found but with lower confidence',
      'Some information may be uncertain',
      'Consider verifying these results'
    ]);
  };

  const simulateError = () => {
    setSystemState('error');
    const error: AIError = {
      id: 'unexpected-error',
      type: 'unexpected',
      message: 'An unexpected error occurred while processing your request',
      recoveryOptions: [
        {
          id: 'retry',
          label: 'Try Again',
          action: 'retry',
          description: 'Retry the same operation'
        },
        {
          id: 'simplify',
          label: 'Simplify Query',
          action: 'fallback',
          description: 'Use a simpler version of your query'
        },
        {
          id: 'manual',
          label: 'Manual Mode',
          action: 'manual',
          description: 'Switch to manual processing'
        }
      ]
    };
    setCurrentError(error);
    setResults([]);
  };

  const simulateTimeout = () => {
    setSystemState('error');
    const error: AIError = {
      id: 'timeout-error',
      type: 'timeout',
      message: 'Request timed out. The AI service took too long to respond.',
      recoveryOptions: [
        {
          id: 'retry',
          label: 'Retry',
          action: 'retry',
          description: 'Try the request again'
        },
        {
          id: 'reduce-scope',
          label: 'Reduce Scope',
          action: 'fallback',
          description: 'Process a smaller portion of your request'
        }
      ]
    };
    setCurrentError(error);
    setResults([]);
  };

  const simulateUnavailable = () => {
    setSystemState('error');
    const error: AIError = {
      id: 'unavailable-error',
      type: 'unavailable',
      message: 'AI service is currently unavailable. Please try again later.',
      recoveryOptions: [
        {
          id: 'cache',
          label: 'Use Cached Results',
          action: 'fallback',
          description: 'Show previous similar results'
        },
        {
          id: 'offline-mode',
          label: 'Offline Mode',
          action: 'fallback',
          description: 'Switch to offline processing'
        },
        {
          id: 'feedback',
          label: 'Report Issue',
          action: 'feedback',
          description: 'Send feedback about this issue'
        }
      ]
    };
    setCurrentError(error);
    setResults([]);
  };

  const handleRecovery = async (option: RecoveryOption) => {
    setSystemState('recovering');
    setRetryCount(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (option.action) {
      case 'retry':
        simulateAIProcess(query);
        break;
      case 'fallback':
        setSystemState('working');
        setCurrentError(null);
        setResults([
          `${option.description} - showing fallback results`,
          'Limited functionality available',
          'Some features may not work as expected'
        ]);
        setConfidence(60);
        break;
      case 'manual':
        setSystemState('working');
        setCurrentError(null);
        setResults([
          'Switched to manual mode',
          'Processing without AI assistance',
          'Results may take longer to generate'
        ]);
        setConfidence(75);
        break;
      case 'feedback':
        setSystemState('working');
        setCurrentError(null);
        setResults([
          'Feedback sent successfully',
          'Thank you for reporting this issue',
          'Our team will investigate the problem'
        ]);
        setConfidence(90);
        break;
    }
  };

  const getSystemStateColor = () => {
    switch (systemState) {
      case 'working': return 'text-green-600';
      case 'low-confidence': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'recovering': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSystemStateIcon = () => {
    switch (systemState) {
      case 'working':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'low-confidence':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'recovering':
        return (
          <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateAIProcess(query);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Recovery & Graceful Degradation</h2>
        <p className="text-gray-600">Experience how AI systems handle failures and provide recovery options</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">AI Query Input</span>
                <div className="flex items-center">
                  {getSystemStateIcon()}
                  <span className={`ml-2 text-sm font-medium ${getSystemStateColor()}`}>
                    {systemState.charAt(0).toUpperCase() + systemState.slice(1).replace('-', ' ')}
                  </span>
                </div>
              </div>
              <input
                type="text"
                className="w-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Try keywords: 'error', 'timeout', 'unavailable', 'low confidence', 'success'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isProcessing || systemState === 'recovering'}
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing || systemState === 'recovering' || !query.trim()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Process Query'}
            </button>
          </form>

          {/* Error Display */}
          {currentError && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-start mb-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-red-900">{currentError.type.charAt(0).toUpperCase() + currentError.type.slice(1)} Error</h4>
                  <p className="text-red-800 mt-1">{currentError.message}</p>
                </div>
              </div>
              
              <h5 className="font-semibold text-red-900 mb-2">Recovery Options:</h5>
              <div className="space-y-2">
                {currentError.recoveryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRecovery(option)}
                    className="w-full text-left p-3 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
                    disabled={systemState === 'recovering'}
                  >
                    <div className="font-medium text-red-900">{option.label}</div>
                    <div className="text-sm text-red-700">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Display */}
          {results.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Processing Results</span>
                {systemState === 'low-confidence' && (
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Low Confidence
                  </span>
                )}
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {results.map((result, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* System Status Sidebar */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">State:</span>
                <span className={`font-medium ${getSystemStateColor()}`}>
                  {systemState.charAt(0).toUpperCase() + systemState.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Confidence:</span>
                <span className="font-medium">{confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Retry Count:</span>
                <span className="font-medium">{retryCount}</span>
              </div>
              {isProcessing && (
                <div className="flex items-center text-blue-700">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2"></div>
                  Processing...
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3">Error Types</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-white rounded border">
                <div className="font-medium text-green-900">Timeout</div>
                <div className="text-green-700">Service takes too long</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="font-medium text-green-900">Unavailable</div>
                <div className="text-green-700">Service is down</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="font-medium text-green-900">Low Confidence</div>
                <div className="text-green-700">Uncertain results</div>
              </div>
              <div className="p-2 bg-white rounded border">
                <div className="font-medium text-green-900">Unexpected</div>
                <div className="text-green-700">Unknown errors</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-3">Recovery Strategies</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Automatic retry with backoff
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Fallback to cached results
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Graceful degradation
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                User feedback collection
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}