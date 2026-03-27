'use client';

import React, { useState, useEffect } from 'react';

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

export default function ResponsibleAiDesignDemo() {
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
        description: 'Potential gender bias detected - male pronouns used exclusively',
        suggestion: 'Consider using gender-neutral pronouns or including both male and female examples'
      });
    }
    
    if (text.toLowerCase().includes('young') && !text.toLowerCase().includes('old')) {
      biasAlerts.push({
        id: '2',
        type: 'age',
        severity: 'low',
        description: 'Age bias detected - only references to younger demographics',
        suggestion: 'Include diverse age representations to avoid ageism'
      });
    }
    
    if (text.toLowerCase().includes('see') || text.toLowerCase().includes('look')) {
      biasAlerts.push({
        id: '3',
        type: 'accessibility',
        severity: 'high',
        description: 'Accessibility concern - language assumes visual ability',
        suggestion: 'Use inclusive language that doesn\'t exclude users with visual impairments'
      });
    }
    
    // Calculate scores
    const inclusivityScore = Math.max(20, 95 - (biasAlerts.length * 15));
    const transparencyScore = 85;
    const overallScore = Math.round((inclusivityScore + transparencyScore) / 2);
    
    setEthicsReport({
      overallScore,
      biasAlerts,
      inclusivityScore,
      transparencyScore
    });
    
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeContent(content);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Responsible AI Design Assistant</h2>
        <p className="text-gray-600">Analyze content for bias, inclusivity, and ethical considerations</p>
      </header>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Content Analysis</h3>
        <button
          onClick={() => setShowPrinciples(!showPrinciples)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showPrinciples ? 'Hide' : 'Show'} AI Ethics Principles
        </button>
      </div>

      {showPrinciples && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">Core AI Ethics Principles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-blue-900">Fairness</h5>
                  <p className="text-sm text-blue-700">Avoid bias and discrimination in AI decisions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-blue-900">Transparency</h5>
                  <p className="text-sm text-blue-700">Make AI decisions explainable and understandable</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-blue-900">Inclusivity</h5>
                  <p className="text-sm text-blue-700">Design for all users regardless of background</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-blue-900">Accountability</h5>
                  <p className="text-sm text-blue-700">Take responsibility for AI system outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Content Input</span>
            </div>
            <textarea
              className="w-full p-4 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content to analyze for bias and ethical considerations... (Try using words like 'he', 'young', 'see' to trigger different alerts)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {ethicsReport && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Ethics Report</h4>
              
              {/* Overall Scores */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-medium text-gray-600 mb-1">Overall Score</h5>
                  <div className={`text-2xl font-bold ${getScoreColor(ethicsReport.overallScore)}`}>
                    {ethicsReport.overallScore}%
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-medium text-gray-600 mb-1">Inclusivity</h5>
                  <div className={`text-2xl font-bold ${getScoreColor(ethicsReport.inclusivityScore)}`}>
                    {ethicsReport.inclusivityScore}%
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <h5 className="text-sm font-medium text-gray-600 mb-1">Transparency</h5>
                  <div className={`text-2xl font-bold ${getScoreColor(ethicsReport.transparencyScore)}`}>
                    {ethicsReport.transparencyScore}%
                  </div>
                </div>
              </div>

              {/* Bias Alerts */}
              {ethicsReport.biasAlerts.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Bias Alerts</h5>
                  <div className="space-y-3">
                    {ethicsReport.biasAlerts.map((alert) => (
                      <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 mr-2">
                              {alert.type}
                            </span>
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60">
                              {alert.severity} severity
                            </span>
                          </div>
                        </div>
                        <p className="font-medium mb-2">{alert.description}</p>
                        <p className="text-sm opacity-90">
                          <strong>Suggestion:</strong> {alert.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analysis Status
              {isAnalyzing && (
                <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              )}
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Content Length:</span>
                <span className="font-medium">{content.length} characters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Analysis Status:</span>
                <span className="font-medium">
                  {isAnalyzing ? 'Analyzing...' : content.length >= 20 ? 'Complete' : 'Waiting for content'}
                </span>
              </div>
              {ethicsReport && (
                <div className="flex justify-between">
                  <span className="text-purple-700">Issues Found:</span>
                  <span className="font-medium">{ethicsReport.biasAlerts.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3">Best Practices</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Use inclusive language for all demographics
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Avoid assumptions about user abilities
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Provide clear explanations for AI decisions
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Test with diverse user groups regularly
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}