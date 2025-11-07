'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponseLevel {
  level: 'basic' | 'detailed' | 'comprehensive';
  content: string;
  timestamp: number;
}

export default function ProgressiveEnhancementDemo() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState<ResponseLevel[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'basic' | 'detailed' | 'comprehensive'>('basic');

  const sampleQueries = [
    "What is machine learning?",
    "Explain quantum computing",
    "How does photosynthesis work?"
  ];

  const generateResponse = async (query: string, level: 'basic' | 'detailed' | 'comprehensive'): Promise<string> => {
    const delays = { basic: 300, detailed: 1000, comprehensive: 1800 };
    await new Promise(resolve => setTimeout(resolve, delays[level]));

    const responses = {
      basic: {
        "What is machine learning?": "Machine learning is AI that learns from data.",
        "Explain quantum computing": "Quantum computing uses quantum mechanics for computation.",
        "How does photosynthesis work?": "Photosynthesis converts light into energy in plants."
      },
      detailed: {
        "What is machine learning?": "Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to find patterns in data.",
        "Explain quantum computing": "Quantum computing leverages quantum mechanics principles like superposition and entanglement to process information in ways classical computers cannot, potentially solving complex problems exponentially faster.",
        "How does photosynthesis work?": "Photosynthesis is a biochemical process where plants use chlorophyll to absorb light energy and convert carbon dioxide and water into glucose and oxygen through light-dependent and light-independent reactions."
      },
      comprehensive: {
        "What is machine learning?": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It uses statistical algorithms to find patterns in data and make predictions or decisions. Types include supervised learning (labeled data), unsupervised learning (pattern discovery), and reinforcement learning (reward-based). Applications range from image recognition to natural language processing, with frameworks like TensorFlow and PyTorch enabling implementation.",
        "Explain quantum computing": "Quantum computing leverages quantum mechanics principles—superposition (existing in multiple states) and entanglement (correlated particle states)—to process information fundamentally differently than classical computers. While classical bits are 0 or 1, quantum bits (qubits) can be both simultaneously. This enables parallel processing of vast solution spaces, potentially solving optimization, cryptography, and molecular simulation problems exponentially faster. Current challenges include quantum decoherence and error correction.",
        "How does photosynthesis work?": "Photosynthesis is a complex biochemical process where plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. The process occurs in two stages: light-dependent reactions in thylakoid membranes (where chlorophyll absorbs photons, splits water molecules, and produces ATP and NADPH) and light-independent reactions (Calvin cycle) in the stroma (where CO2 is fixed into glucose using ATP and NADPH). The overall equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2."
      }
    };

    return responses[level][query as keyof typeof responses.basic] || `${level} response for: ${query}`;
  };

  const handleQuery = async (selectedQuery: string) => {
    setQuery(selectedQuery);
    setResponses([]);
    setIsEnhancing(true);
    setCurrentLevel('basic');

    // Level 1: Basic (instant)
    const basicResponse = await generateResponse(selectedQuery, 'basic');
    setResponses([{ level: 'basic', content: basicResponse, timestamp: Date.now() }]);
    setCurrentLevel('detailed');

    // Level 2: Detailed
    const detailedResponse = await generateResponse(selectedQuery, 'detailed');
    setResponses(prev => [...prev, { level: 'detailed', content: detailedResponse, timestamp: Date.now() }]);
    setCurrentLevel('comprehensive');

    // Level 3: Comprehensive
    const comprehensiveResponse = await generateResponse(selectedQuery, 'comprehensive');
    setResponses(prev => [...prev, { level: 'comprehensive', content: comprehensiveResponse, timestamp: Date.now() }]);

    setIsEnhancing(false);
  };

  const stopEnhancement = () => {
    setIsEnhancing(false);
  };

  const resetDemo = () => {
    setQuery('');
    setResponses([]);
    setIsEnhancing(false);
    setCurrentLevel('basic');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-yellow-100 text-yellow-700';
      case 'detailed': return 'bg-blue-100 text-blue-700';
      case 'comprehensive': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Select a query to see progressive enhancement in action - basic answer first, then more detail!
        </p>
      </div>

      <div className="mb-4 space-y-2">
        {sampleQueries.map((q, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleQuery(q)}
            disabled={isEnhancing}
            className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {q}
          </motion.button>
        ))}
      </div>

      {query && (
        <div className="mb-4">
          <h3 className="font-semibold mb-3">Response for: "{query}"</h3>

          <AnimatePresence mode="wait">
            {responses.map((response, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="mb-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${getLevelColor(response.level)}`}>
                    {response.level.charAt(0).toUpperCase() + response.level.slice(1)} Response
                  </span>
                  {idx === responses.length - 1 && isEnhancing && (
                    <span className="text-xs text-gray-500 animate-pulse">Enhancing...</span>
                  )}
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-700">{response.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isEnhancing && responses.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={stopEnhancement}
              className="mt-2 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop Enhancement (Current response is sufficient)
            </motion.button>
          )}

          {!isEnhancing && responses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Enhancement complete - showing {responses[responses.length - 1].level} response
                </p>
              </div>
              <button
                onClick={resetDemo}
                className="w-full px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                ← Try Another Query
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
