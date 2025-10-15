'use client';

import React, { useState, useEffect } from 'react';

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

export default function CollaborativeAiDemo() {
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
  const [isGeneratingContribution, setIsGeneratingContribution] = useState(false);

  const generateAIContribution = async (document: string) => {
    if (document.length < 20 || isGeneratingContribution) return;

    setIsGeneratingContribution(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const contributionTypes = ['suggestion', 'edit', 'analysis'] as const;
    const type = contributionTypes[Math.floor(Math.random() * contributionTypes.length)];
    
    const contributions = {
      suggestion: [
        'Consider adding more specific examples to support your main points',
        'This section could benefit from a clearer transition to the next topic',
        'The conclusion might be stronger with a call-to-action',
        'Try breaking this into smaller, more digestible paragraphs',
        'Consider adding subheadings to improve readability'
      ],
      edit: [
        'Grammar improvement: Replace "very good" with "excellent" for stronger impact',
        'Style suggestion: Consider making this sentence more concise',
        'Word choice: "utilize" could be simplified to "use"',
        'Punctuation: Consider adding a comma before this clause',
        'Clarity: This phrase could be reworded for better understanding'
      ],
      analysis: [
        'Document sentiment: Positive (87% confidence)',
        'Readability score: Grade 8 level - appropriate for general audience',
        'Key themes identified: Innovation, collaboration, efficiency',
        'Word count: Approaching optimal length for this format',
        'Tone analysis: Professional and engaging'
      ]
    };

    const newContribution: AIContribution = {
      id: Date.now().toString(),
      type,
      content: contributions[type][Math.floor(Math.random() * contributions[type].length)],
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 30) + 70
    };

    setSession(prev => ({
      ...prev,
      aiContributions: [...prev.aiContributions.slice(-4), newContribution]
    }));
    
    setIsGeneratingContribution(false);
  };

  const applyAIContribution = (contributionId: string) => {
    const contribution = session.aiContributions.find(c => c.id === contributionId);
    if (!contribution) return;

    // Simulate applying the AI contribution
    if (contribution.type === 'edit') {
      const improvedDocument = session.document + ' [AI improvement applied]';
      setSession(prev => ({ ...prev, document: improvedDocument }));
    } else if (contribution.type === 'suggestion') {
      // For suggestions, we just acknowledge the application
      setSession(prev => ({ 
        ...prev, 
        document: prev.document + ' [AI suggestion noted]' 
      }));
    }

    // Remove the applied contribution
    setSession(prev => ({
      ...prev,
      aiContributions: prev.aiContributions.filter(c => c.id !== contributionId)
    }));
  };

  const dismissAIContribution = (contributionId: string) => {
    setSession(prev => ({
      ...prev,
      aiContributions: prev.aiContributions.filter(c => c.id !== contributionId)
    }));
  };

  const simulateTeamActivity = () => {
    setSession(prev => {
      // Randomly adjust which team members are active
      const possibleActive = prev.members.filter(() => Math.random() > 0.2);
      const activeUsers = possibleActive.length > 0 
        ? possibleActive.map(m => m.id)
        : [prev.members[0].id]; // Always keep at least one active
      
      return { ...prev, activeUsers };
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateAIContribution(session.document);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [session.document]);

  useEffect(() => {
    const interval = setInterval(simulateTeamActivity, 8000);
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

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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

      <div className="space-y-6">
        {/* Shared Document */}
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
                      title={`${member.name} - ${member.status}`}
                    >
                      <span className="text-sm">{member.avatar}</span>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                  ))}
              </div>
              <span className="text-xs text-gray-500">
                {session.activeUsers.length} active
              </span>
            </div>
          </div>
          <textarea
            className="w-full p-4 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start collaborating... AI will provide suggestions as your team works together. Try typing at least 20 characters to see AI contributions."
            value={session.document}
            onChange={(e) => setSession(prev => ({ ...prev, document: e.target.value }))}
          />
        </div>

        {/* AI Contributions Panel - Full Width Below Document */}
        {showAIInsights && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                <span className="mr-2 text-2xl">🤖</span>
                AI Contributions
              </h3>
              {isGeneratingContribution && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  <span className="text-sm text-purple-700">AI is analyzing...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.aiContributions.length > 0 ? (
                session.aiContributions.map(contribution => (
                  <div
                    key={contribution.id}
                    className="bg-white border-2 border-purple-200 rounded-lg p-4 cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all"
                    onClick={() => setSelectedContribution(
                      selectedContribution === contribution.id ? null : contribution.id
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getContributionIcon(contribution.type)}</span>
                        <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                          {getTypeLabel(contribution.type)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {contribution.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">{contribution.content}</p>

                    {selectedContribution === contribution.id && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              applyAIContribution(contribution.id);
                            }}
                            className="flex-1 text-sm px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                          >
                            Apply
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAIContribution(contribution.id);
                            }}
                            className="flex-1 text-sm px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-purple-600 italic">
                    AI will provide suggestions as you collaborate...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats and Tips - Side by Side Below AI Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collaboration Stats */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">Collaboration Stats</h3>
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
              <div className="flex justify-between">
                <span className="text-green-700">Status:</span>
                <span className="font-medium">
                  {isGeneratingContribution ? 'AI Analyzing' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Collaboration Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-3">Collaboration Tips</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                AI provides suggestions based on content length and context
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Click on AI contributions to see apply/dismiss options
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Team member activity updates automatically
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                Toggle AI insights to focus on writing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}