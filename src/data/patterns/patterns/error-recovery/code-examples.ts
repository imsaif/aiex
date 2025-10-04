import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Error Recovery & Graceful Degradation",
    description: "Demonstrates how to handle AI errors gracefully with recovery options and fallback solutions.",
    language: "tsx",
    componentId: "error-recovery-demo",
    code: `'use client';

import React, { useState } from 'react';

type Status = 'idle' | 'loading' | 'error' | 'success';

export default function ErrorRecoveryDemo() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState('');

  const handleSearch = async () => {
    setStatus('loading');
    setResult('');

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate error for queries containing "error"
    if (query.toLowerCase().includes('error')) {
      setStatus('error');
    } else {
      setStatus('success');
      setResult(\`AI result for: "\${query}"\`);
    }
  };

  const handleRetry = () => {
    handleSearch();
  };

  const handleFallback = () => {
    setStatus('success');
    setResult(\`Basic search result for: "\${query}"\`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">AI Search with Error Recovery</h2>

      <div className="space-y-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try typing 'error' to trigger an error"
          className="w-full p-3 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          disabled={!query || status === 'loading'}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          {status === 'loading' ? 'Searching...' : 'Search'}
        </button>
      </div>

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Error Processing Request</h3>
          <p className="text-sm text-red-600 mb-3">The AI encountered an error. Choose a recovery option:</p>

          <div className="space-y-2">
            <button
              onClick={handleRetry}
              className="w-full p-2 bg-white border border-red-200 rounded hover:bg-red-50 text-sm"
            >
              Try Again
            </button>
            <button
              onClick={handleFallback}
              className="w-full p-2 bg-white border border-red-200 rounded hover:bg-red-50 text-sm"
            >
              Use Basic Search Instead
            </button>
          </div>
        </div>
      )}

      {status === 'success' && result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{result}</p>
        </div>
      )}
    </div>
  );
}`
  }
];
