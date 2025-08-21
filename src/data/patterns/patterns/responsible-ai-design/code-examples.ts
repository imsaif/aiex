import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Responsible AI Design Interactive Demo",
    description: "This React component demonstrates responsible ai design with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "responsible-ai-design-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BiasAlert {
  id: string;
  type: 'gender' | 'racial' | 'age' | 'accessibility';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

interface EthicsReport {
  overallScore: number;
  biasAlerts: BiasAlert[];
  inclusivityScore: number;
  transparencyScore: number;
}

export default function ResponsibleAIDemo() {
  const [content, setContent] = useState('');
  const [ethicsReport, setEthicsReport] = useState<EthicsReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrinciples, setShowPrinciples] = useState(false);

  const analyzeContent = async (text: string) => {
    if (text.length < 20) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI ethics analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const biasAlerts: BiasAlert[] = [];
    
    // Simulate bias detection
    if (text.toLowerCase().includes('he') && !text.toLowerCase().includes('she')) {
      biasAlerts.push({
        id: '1',
        type: 'gender',
        severity: 'medium',
        description: 'Potential gender bias detected in pronoun usage',
        suggestion: 'Consider using gender-neutral pronouns or inclusive language'
      });
    }
    
    if (text.toLowerCase().includes('simple') || text.toLowerCase().includes('easy')) {
      biasAlerts.push({
        id: '2',
        type: 'accessibility',
        severity: 'low',
        description: 'Language may not be accessible to all users',
        suggestion: 'Consider that complexity varies for different users'
      });
    }

    const report: EthicsReport = {
      overallScore: Math.max(60, 90 - biasAlerts.length * 15),
      biasAlerts,
      inclusivityScore: Math.random() * 40 + 60,
      transparencyScore: Math.random() * 30 + 70
    };
    
    setEthicsReport(report);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeContent(content);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [content]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Responsible AI Analyzer</h2>
          <p className="text-gray-600">Detect bias and ensure ethical AI practices</p>
        </div>
        <button
          onClick={() => setShowPrinciples(!showPrinciples)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          AI Ethics Principles
        </button>
      </header>

      <AnimatePresence>
        {showPrinciples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="font-semibold text-blue-900 mb-3">Core AI Ethics Principles</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Fairness:</span>
                    <span className="text-blue-700"> Avoid discriminatory outcomes</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Transparency:</span>
                    <span className="text-blue-700"> Make AI decisions understandable</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Accountability:</span>
                    <span className="text-blue-700"> Clear responsibility chains</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className="font-medium text-blue-800">Privacy:</span>
                    <span className="text-blue-700"> Protect user data and rights</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Content Analysis</span>
            </div>
            <textarea
              className="w-full p-4 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content to analyze for bias, inclusivity, and ethical concerns..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Ethics Score</h3>
              {isAnalyzing && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
            </div>

            {ethicsReport && (
              <div className="space-y-3">
                <div className="text-center">
                  <div className={\`text-3xl font-bold \${getScoreColor(ethicsReport.overallScore)}\`}>
                    {ethicsReport.overallScore}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inclusivity:</span>
                    <span className={\`font-medium \${getScoreColor(ethicsReport.inclusivityScore)}\`}>
                      {Math.round(ethicsReport.inclusivityScore)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transparency:</span>
                    <span className={\`font-medium \${getScoreColor(ethicsReport.transparencyScore)}\`}>
                      {Math.round(ethicsReport.transparencyScore)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {ethicsReport && ethicsReport.biasAlerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-3">Bias Alerts</h3>
              <div className="space-y-2">
                {ethicsReport.biasAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={\`p-3 rounded-md border \${getSeverityColor(alert.severity)}\`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium uppercase">
                        {alert.type} bias
                      </span>
                      <span className="text-xs">{alert.severity}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <p className="text-xs italic">{alert.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Best Practices</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Use inclusive language</li>
              <li>• Test with diverse users</li>
              <li>• Provide clear explanations</li>
              <li>• Enable user control</li>
              <li>• Regular bias audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
