'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CacheEntry {
  query: string;
  response: string;
  timestamp: number;
  hits: number;
  freshness: 'fresh' | 'stale' | 'expired';
}

interface QueryOption {
  id: string;
  query: string;
  popularity: number;
}

export default function IntelligentCachingDemo() {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [cacheHit, setCacheHit] = useState(false);
  const [responseTime, setResponseTime] = useState(0);

  const queryOptions: QueryOption[] = [
    { id: '1', query: 'What is React?', popularity: 10 },
    { id: '2', query: 'How to use TypeScript?', popularity: 8 },
    { id: '3', query: 'What are AI design patterns?', popularity: 6 },
    { id: '4', query: 'Explain caching strategies', popularity: 7 }
  ];

  // Cache freshness evaluation (5 seconds = fresh, 10 seconds = stale, 15 seconds = expired)
  const evaluateFreshness = (timestamp: number): 'fresh' | 'stale' | 'expired' => {
    const age = Date.now() - timestamp;
    if (age < 5000) return 'fresh';
    if (age < 10000) return 'stale';
    return 'expired';
  };

  // Simulate AI response generation
  const generateResponse = async (query: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return `AI response for: "${query}". This is a simulated response generated at ${new Date().toLocaleTimeString()}.`;
  };

  // Pre-fetch popular queries on mount
  useEffect(() => {
    const popularQueries = queryOptions
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 2);

    popularQueries.forEach(async ({ query }) => {
      const response = await generateResponse(query);
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(query, {
          query,
          response,
          timestamp: Date.now(),
          hits: 0,
          freshness: 'fresh'
        });
        return newCache;
      });
    });
  }, []);

  // Update cache freshness periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.forEach((entry, key) => {
          newCache.set(key, {
            ...entry,
            freshness: evaluateFreshness(entry.timestamp)
          });
        });
        return newCache;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleQuery = async (query: string) => {
    setCurrentQuery(query);
    setIsLoading(true);
    const startTime = Date.now();

    const cached = cache.get(query);

    if (cached && cached.freshness !== 'expired') {
      // Cache hit
      setCacheHit(true);
      setLastResponse(cached.response);
      setResponseTime(Date.now() - startTime);

      // Update cache stats
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(query, { ...cached, hits: cached.hits + 1 });
        return newCache;
      });

      // If stale, refresh in background
      if (cached.freshness === 'stale') {
        generateResponse(query).then(response => {
          setCache(prev => {
            const newCache = new Map(prev);
            newCache.set(query, {
              query,
              response,
              timestamp: Date.now(),
              hits: cached.hits + 1,
              freshness: 'fresh'
            });
            return newCache;
          });
        });
      }
    } else {
      // Cache miss or expired
      setCacheHit(false);
      const response = await generateResponse(query);
      setLastResponse(response);
      setResponseTime(Date.now() - startTime);

      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(query, {
          query,
          response,
          timestamp: Date.now(),
          hits: 1,
          freshness: 'fresh'
        });
        return newCache;
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Try this:</strong> Click queries to see intelligent caching in action. Popular queries are pre-cached. Watch freshness indicators!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {queryOptions.map(option => {
          const cached = cache.get(option.query);
          return (
            <motion.button
              key={option.id}
              onClick={() => handleQuery(option.query)}
              disabled={isLoading}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium mb-1">{option.query}</div>
              <div className="flex items-center gap-2 text-xs">
                {cached && (
                  <>
                    <span className={`px-2 py-0.5 rounded ${
                      cached.freshness === 'fresh' ? 'bg-green-100 text-green-700' :
                      cached.freshness === 'stale' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {cached.freshness}
                    </span>
                    <span className="text-gray-500">{cached.hits} hits</span>
                  </>
                )}
                {!cached && <span className="text-gray-400">Not cached</span>}
              </div>
            </motion.button>
          );
        })}
      </div>

      {lastResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Response:</h3>
            <div className="flex items-center gap-2 text-xs">
              {cacheHit ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  Cache Hit - {responseTime}ms
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Generated - {responseTime}ms
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-700">{lastResponse}</p>
        </motion.div>
      )}

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Cache Statistics</h4>
        <div className="text-sm text-gray-600">
          <p>Total cached queries: {cache.size}</p>
          <p>Cache hit rate: {cache.size > 0 ?
            Math.round((Array.from(cache.values()).filter(e => e.hits > 0).length / cache.size) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
