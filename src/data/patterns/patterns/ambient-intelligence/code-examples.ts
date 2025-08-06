import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Ambient Intelligence Interactive Demo",
    description: "This React component demonstrates ambient intelligence with practical implementation following best practices for user experience and accessibility.",
    language: "tsx",
    componentId: "ambient-intelligence-demo",
    code: `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AmbientInsight {
  id: string;
  type: 'contextual' | 'predictive' | 'adaptive' | 'proactive';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  dismissed?: boolean;
}

interface UserContext {
  timeOfDay: string;
  activity: string;
  location: string;
  focus: number;
}

export default function AmbientIntelligenceDemo() {
  const [userContext, setUserContext] = useState<UserContext>({
    timeOfDay: 'morning',
    activity: 'working',
    location: 'office',
    focus: 85
  });

  const [ambientInsights, setAmbientInsights] = useState<AmbientInsight[]>([]);
  const [showInsights, setShowInsights] = useState(true);
  const [ambientMode, setAmbientMode] = useState<'active' | 'minimal' | 'off'>('active');

  const generateAmbientInsights = () => {
    const insights: AmbientInsight[] = [];
    
    // Time-based insights
    if (userContext.timeOfDay === 'morning') {
      insights.push({
        id: 'morning-productivity',
        type: 'contextual',
        title: 'Peak Productivity Window',
        description: 'Your focus levels are typically highest right now. Consider tackling complex tasks.',
        confidence: 87,
        priority: 'medium'
      });
    }

    // Activity-based insights
    if (userContext.activity === 'working' && userContext.focus < 70) {
      insights.push({
        id: 'focus-break',
        type: 'proactive',
        title: 'Break Suggestion',
        description: 'Your focus has decreased. A 5-minute break might help restore concentration.',
        confidence: 78,
        priority: 'low'
      });
    }

    // Location-based insights
    if (userContext.location === 'office') {
      insights.push({
        id: 'meeting-prep',
        type: 'predictive',
        title: 'Upcoming Meeting',
        description: 'You have a meeting in 30 minutes. Would you like to review the agenda?',
        confidence: 92,
        priority: 'high'
      });
    }

    // Adaptive insights based on patterns
    insights.push({
      id: 'workflow-optimization',
      type: 'adaptive',
      title: 'Workflow Pattern Detected',
      description: 'You tend to check email every 15 minutes. Batching could improve focus.',
      confidence: 65,
      priority: 'low'
    });

    return insights.filter(insight => !insight.dismissed);
  };

  const dismissInsight = (insightId: string) => {
    setAmbientInsights(prev =>
      prev.map(insight =>
        insight.id === insightId ? { ...insight, dismissed: true } : insight
      )
    );
  };

  const actOnInsight = (insightId: string) => {
    const insight = ambientInsights.find(i => i.id === insightId);
    if (insight) {
      // Simulate acting on the insight
      switch (insight.type) {
        case 'proactive':
          setUserContext(prev => ({ ...prev, focus: Math.min(100, prev.focus + 15) }));
          break;
        case 'adaptive':
          // Simulate workflow adjustment
          break;
      }
      dismissInsight(insightId);
    }
  };

  const updateContext = (changes: Partial<UserContext>) => {
    setUserContext(prev => ({ ...prev, ...changes }));
  };

  useEffect(() => {
    if (ambientMode !== 'off') {
      const insights = generateAmbientInsights();
      setAmbientInsights(insights);
    } else {
      setAmbientInsights([]);
    }
  }, [userContext, ambientMode]);

  useEffect(() => {
    // Simulate ambient intelligence monitoring
    const interval = setInterval(() => {
      // Gradually decrease focus over time
      setUserContext(prev => ({
        ...prev,
        focus: Math.max(20, prev.focus - Math.random() * 5)
      }));

      // Update time of day
      const hour = new Date().getHours();
      let timeOfDay = 'morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17) timeOfDay = 'evening';
      
      setUserContext(prev => ({ ...prev, timeOfDay }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contextual': return '🎯';
      case 'predictive': return '🔮';
      case 'adaptive': return '🧠';
      case 'proactive': return '⚡';
      default: return '🤖';
    }
  };

  const visibleInsights = ambientInsights.filter(insight => !insight.dismissed);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ambient Intelligence Dashboard</h2>
          <p className="text-gray-600">AI that works quietly in the background</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={ambientMode}
            onChange={(e) => setAmbientMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="active">Active Mode</option>
            <option value="minimal">Minimal Mode</option>
            <option value="off">Off</option>
          </select>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showInsights ? 'Hide' : 'Show'} Insights
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Context Simulation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                <select
                  value={userContext.timeOfDay}
                  onChange={(e) => updateContext({ timeOfDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                <select
                  value={userContext.activity}
                  onChange={(e) => updateContext({ activity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="working">Working</option>
                  <option value="meeting">In Meeting</option>
                  <option value="break">On Break</option>
                  <option value="commuting">Commuting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={userContext.location}
                  onChange={(e) => updateContext({ location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="office">Office</option>
                  <option value="home">Home</option>
                  <option value="cafe">Cafe</option>
                  <option value="travel">Traveling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Level: {userContext.focus}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userContext.focus}
                  onChange={(e) => updateContext({ focus: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={\`h-2 rounded-full transition-all duration-300 \${
                      userContext.focus >= 70 ? 'bg-green-500' :
                      userContext.focus >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }\`}
                    style={{ width: \`\${userContext.focus}%\` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Main Workspace</span>
            </div>
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <p>Your main work area</p>
              <p className="text-sm">AI observes context and provides subtle assistance</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3">Ambient Mode</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Status:</span>
                <span className={\`font-medium \${ambientMode === 'active' ? 'text-green-600' : ambientMode === 'minimal' ? 'text-yellow-600' : 'text-gray-600'}\`}>
                  {ambientMode.charAt(0).toUpperCase() + ambientMode.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Active Insights:</span>
                <span className="font-medium">{visibleInsights.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Context Updates:</span>
                <span className="font-medium">Real-time</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showInsights && ambientMode !== 'off' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <h3 className="font-medium text-gray-900">Ambient Insights</h3>
                {visibleInsights.length > 0 ? (
                  visibleInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={\`border rounded-lg p-3 \${getPriorityColor(insight.priority)}\`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span>{getTypeIcon(insight.type)}</span>
                          <span className="text-xs font-medium uppercase text-gray-600">
                            {insight.type}
                          </span>
                        </div>
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                        {insight.type === 'proactive' && (
                          <button
                            onClick={() => actOnInsight(insight.id)}
                            className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Act
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <p>No ambient insights at the moment</p>
                    <p className="text-xs mt-1">AI is quietly monitoring context...</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Privacy Controls</h3>
            <div className="space-y-2 text-sm text-green-700">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Context awareness
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Productivity insights
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Location tracking
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Biometric monitoring
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
