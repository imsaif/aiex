import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Collaborative AI Interactive Demo",
    description: "This React component demonstrates collaborative ai with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "collaborative-ai-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
}

interface AIContribution {
  id: string;
  type: 'suggestion' | 'edit' | 'analysis';
  content: string;
  timestamp: Date;
  confidence: number;
}

interface CollaborationSession {
  document: string;
  members: TeamMember[];
  aiContributions: AIContribution[];
  activeUsers: string[];
}

export default function CollaborativeAIDemo() {
  const [session, setSession] = useState<CollaborationSession>({
    document: '',
    members: [
      { id: '1', name: 'Alice Johnson', avatar: '👩‍💼', status: 'online' },
      { id: '2', name: 'Bob Smith', avatar: '👨‍💻', status: 'online' },
      { id: '3', name: 'Carol Williams', avatar: '👩‍🎨', status: 'away' }
    ],
    aiContributions: [],
    activeUsers: ['1', '2']
  });

  const [showAIInsights, setShowAIInsights] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<string | null>(null);

  const generateAIContribution = async (document: string) => {
    if (document.length < 20) return;

    await new Promise(resolve => setTimeout(resolve, 2000));

    const contributionTypes = ['suggestion', 'edit', 'analysis'] as const;
    const type = contributionTypes[Math.floor(Math.random() * contributionTypes.length)];
    
    const contributions = {
      suggestion: [
        "Consider adding more specific examples to support your main points",
        "This section could benefit from a clearer transition to the next topic",
        "The conclusion might be stronger with a call-to-action"
      ],
      edit: [
        "Suggested edit: Replace 'very good' with 'excellent' for stronger impact",
        "Grammar improvement: 'which are' should be 'that are' in this context",
        "Style suggestion: Consider breaking this long sentence into two shorter ones"
      ],
      analysis: [
        "Document sentiment: Positive (87% confidence)",
        "Readability score: Grade 8 level - appropriate for general audience",
        "Key themes identified: Innovation, collaboration, efficiency"
      ]
    };

    const newContribution: AIContribution = {
      id: Date.now().toString(),
      type,
      content: contributions[type][Math.floor(Math.random() * contributions[type].length)],
      timestamp: new Date(),
      confidence: Math.random() * 30 + 70
    };

    setSession(prev => ({
      ...prev,
      aiContributions: [...prev.aiContributions.slice(-4), newContribution]
    }));
  };

  const applyAIContribution = (contributionId: string) => {
    const contribution = session.aiContributions.find(c => c.id === contributionId);
    if (!contribution) return;

    // Simulate applying the AI contribution
    if (contribution.type === 'edit') {
      const improvedDocument = session.document + " [AI improvement applied]";
      setSession(prev => ({ ...prev, document: improvedDocument }));
    }

    // Remove the applied contribution
    setSession(prev => ({
      ...prev,
      aiContributions: prev.aiContributions.filter(c => c.id !== contributionId)
    }));
  };

  const simulateTeamActivity = () => {
    // Simulate team members joining/leaving
    setSession(prev => {
      const activeUsers = prev.members
        .filter(() => Math.random() > 0.3)
        .map(m => m.id);
      
      return { ...prev, activeUsers };
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateAIContribution(session.document);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [session.document]);

  useEffect(() => {
    const interval = setInterval(simulateTeamActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return '💡';
      case 'edit': return '✏️';
      case 'analysis': return '📊';
      default: return '🤖';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Collaborative AI Workspace</h2>
          <p className="text-gray-600">Real-time collaboration with AI assistance</p>
        </div>
        <button
          onClick={() => setShowAIInsights(!showAIInsights)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAIInsights ? 'Hide' : 'Show'} AI Insights
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Shared Document</span>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {session.members
                    .filter(member => session.activeUsers.includes(member.id))
                    .map(member => (
                      <div
                        key={member.id}
                        className="relative w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white"
                        title={member.name}
                      >
                        <span className="text-sm">{member.avatar}</span>
                        <div className={\`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white \${getStatusColor(member.status)}\`}></div>
                      </div>
                    ))}
                </div>
                <span className="text-xs text-gray-500">
                  {session.activeUsers.length} active
                </span>
              </div>
            </div>
            <textarea
              className="w-full p-4 h-96 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start collaborating... AI will provide suggestions as your team works together"
              value={session.document}
              onChange={(e) => setSession(prev => ({ ...prev, document: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Team Members</h3>
            <div className="space-y-2">
              {session.members.map(member => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm">{member.avatar}</span>
                    </div>
                    <div className={\`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white \${getStatusColor(member.status)}\`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{member.status}</div>
                  </div>
                  {session.activeUsers.includes(member.id) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showAIInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-purple-50 border border-purple-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-purple-900 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Contributions
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {session.aiContributions.length > 0 ? (
                    session.aiContributions.map(contribution => (
                      <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-purple-200 rounded-md p-3 cursor-pointer hover:bg-purple-50 transition-colors"
                        onClick={() => setSelectedContribution(
                          selectedContribution === contribution.id ? null : contribution.id
                        )}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{getContributionIcon(contribution.type)}</span>
                            <span className="text-xs font-medium text-purple-700 uppercase">
                              {contribution.type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round(contribution.confidence)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{contribution.content}</p>
                        
                        <AnimatePresence>
                          {selectedContribution === contribution.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 pt-2 border-t border-purple-200"
                            >
                              <div className="flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyAIContribution(contribution.id);
                                  }}
                                  className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSession(prev => ({
                                      ...prev,
                                      aiContributions: prev.aiContributions.filter(c => c.id !== contribution.id)
                                    }));
                                  }}
                                  className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-purple-600 italic">
                      AI will provide suggestions as you collaborate...
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Collaboration Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Active Members:</span>
                <span className="font-medium">{session.activeUsers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">AI Contributions:</span>
                <span className="font-medium">{session.aiContributions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Document Length:</span>
                <span className="font-medium">{session.document.length} chars</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
