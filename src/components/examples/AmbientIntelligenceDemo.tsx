'use client';

import React, { useState, useEffect } from 'react';

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
  const [privacySettings, setPrivacySettings] = useState({
    contextAwareness: true,
    productivityInsights: true,
    locationTracking: false,
    biometricMonitoring: false
  });

  const generateAmbientInsights = () => {
    const insights: AmbientInsight[] = [];
    
    // Time-based insights
    if (userContext.timeOfDay === 'morning' && privacySettings.contextAwareness) {
      insights.push({
        id: 'morning-productivity',
        type: 'contextual',
        title: 'Peak Productivity Window',
        description: 'Your focus levels are typically highest right now. Consider tackling complex tasks.',
        confidence: 87,
        priority: 'medium'
      });
    }

    if (userContext.timeOfDay === 'afternoon' && privacySettings.contextAwareness) {
      insights.push({
        id: 'afternoon-dip',
        type: 'contextual',
        title: 'Energy Dip Expected',
        description: 'Most people experience lower energy in early afternoon. Light activity might help.',
        confidence: 73,
        priority: 'low'
      });
    }

    // Activity-based insights
    if (userContext.activity === 'working' && userContext.focus < 70 && privacySettings.productivityInsights) {
      insights.push({
        id: 'focus-break',
        type: 'proactive',
        title: 'Break Suggestion',
        description: 'Your focus has decreased. A 5-minute break might help restore concentration.',
        confidence: 78,
        priority: 'low'
      });
    }

    if (userContext.activity === 'meeting' && privacySettings.contextAwareness) {
      insights.push({
        id: 'meeting-mode',
        type: 'contextual',
        title: 'Meeting Mode Active',
        description: 'Notifications are minimized to avoid interruptions during your meeting.',
        confidence: 95,
        priority: 'medium'
      });
    }

    // Location-based insights
    if (userContext.location === 'office' && privacySettings.locationTracking) {
      insights.push({
        id: 'meeting-prep',
        type: 'predictive',
        title: 'Upcoming Meeting',
        description: 'You have a meeting in 30 minutes. Would you like to review the agenda?',
        confidence: 92,
        priority: 'high'
      });
    }

    if (userContext.location === 'home' && userContext.timeOfDay === 'evening' && privacySettings.contextAwareness) {
      insights.push({
        id: 'wind-down',
        type: 'contextual',
        title: 'Wind Down Time',
        description: 'Consider reviewing tomorrow\'s schedule and setting work boundaries.',
        confidence: 81,
        priority: 'low'
      });
    }

    // Adaptive insights based on patterns
    if (privacySettings.productivityInsights && userContext.focus > 80) {
      insights.push({
        id: 'workflow-optimization',
        type: 'adaptive',
        title: 'High Focus Detected',
        description: 'You\'re in a flow state. Consider tackling your most challenging task now.',
        confidence: 89,
        priority: 'medium'
      });
    } else if (privacySettings.productivityInsights && userContext.focus < 50) {
      insights.push({
        id: 'focus-recovery',
        type: 'adaptive',
        title: 'Focus Recovery Needed',
        description: 'Consider switching to lighter tasks or taking a longer break.',
        confidence: 74,
        priority: 'medium'
      });
    }

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
          if (insight.id === 'focus-break') {
            setUserContext(prev => ({ ...prev, focus: Math.min(100, prev.focus + 15) }));
          }
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

  const updatePrivacySetting = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  useEffect(() => {
    if (ambientMode !== 'off') {
      const insights = generateAmbientInsights();
      setAmbientInsights(insights);
    } else {
      setAmbientInsights([]);
    }
  }, [userContext, ambientMode, privacySettings]);

  useEffect(() => {
    // Simulate ambient intelligence monitoring
    const interval = setInterval(() => {
      if (ambientMode === 'active') {
        // Gradually decrease focus over time
        setUserContext(prev => ({
          ...prev,
          focus: Math.max(20, prev.focus - Math.random() * 3)
        }));

        // Update time of day
        const hour = new Date().getHours();
        let timeOfDay = 'morning';
        if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17) timeOfDay = 'evening';
        
        setUserContext(prev => ({ ...prev, timeOfDay }));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [ambientMode]);

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

  const getFocusColor = () => {
    if (userContext.focus >= 70) return 'bg-green-500';
    if (userContext.focus >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getModeStatusColor = () => {
    if (ambientMode === 'active') return 'text-green-600';
    if (ambientMode === 'minimal') return 'text-yellow-600';
    return 'text-gray-600';
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
            onChange={(e) => setAmbientMode(e.target.value as 'active' | 'minimal' | 'off')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {/* Context Simulation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Context Simulation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                <select
                  value={userContext.timeOfDay}
                  onChange={(e) => updateContext({ timeOfDay: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className={`h-2 rounded-full transition-all duration-300 ${getFocusColor()}`}
                    style={{ width: `${userContext.focus}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Main Workspace</span>
            </div>
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <p className="font-medium">Your main work area</p>
              <p className="text-sm mt-2">AI observes context and provides subtle assistance</p>
              <div className="mt-4 text-xs text-gray-400">
                Currently: {userContext.activity} at {userContext.location} ({userContext.timeOfDay})
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Ambient Mode Status */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3">Ambient Mode</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Status:</span>
                <span className={`font-medium ${getModeStatusColor()}`}>
                  {ambientMode.charAt(0).toUpperCase() + ambientMode.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Active Insights:</span>
                <span className="font-medium">{visibleInsights.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Context Updates:</span>
                <span className="font-medium">
                  {ambientMode === 'active' ? 'Real-time' : ambientMode === 'minimal' ? 'Periodic' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Privacy Mode:</span>
                <span className="font-medium">
                  {Object.values(privacySettings).filter(Boolean).length > 2 ? 'Standard' : 'Enhanced'}
                </span>
              </div>
            </div>
          </div>

          {/* Ambient Insights */}
          {showInsights && ambientMode !== 'off' && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Ambient Insights</h3>
              {visibleInsights.length > 0 ? (
                visibleInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`border rounded-lg p-3 transition-all duration-300 ${getPriorityColor(insight.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span>{getTypeIcon(insight.type)}</span>
                        <span className="text-xs font-medium uppercase text-gray-600">
                          {insight.type}
                        </span>
                        <span className={`text-xs px-1 rounded ${
                          insight.priority === 'high' ? 'bg-red-200 text-red-800' :
                          insight.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {insight.priority}
                        </span>
                      </div>
                      <button
                        onClick={() => dismissInsight(insight.id)}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                        aria-label="Dismiss insight"
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
                          className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Act
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm border border-gray-200 rounded-lg bg-gray-50">
                  <p>No ambient insights at the moment</p>
                  <p className="text-xs mt-1">AI is quietly monitoring context...</p>
                </div>
              )}
            </div>
          )}

          {/* Privacy Controls */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">Privacy Controls</h3>
            <div className="space-y-2 text-sm text-green-700">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={privacySettings.contextAwareness}
                  onChange={(e) => updatePrivacySetting('contextAwareness', e.target.checked)}
                />
                Context awareness
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={privacySettings.productivityInsights}
                  onChange={(e) => updatePrivacySetting('productivityInsights', e.target.checked)}
                />
                Productivity insights
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={privacySettings.locationTracking}
                  onChange={(e) => updatePrivacySetting('locationTracking', e.target.checked)}
                />
                Location tracking
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={privacySettings.biometricMonitoring}
                  onChange={(e) => updatePrivacySetting('biometricMonitoring', e.target.checked)}
                />
                Biometric monitoring
              </label>
            </div>
            <p className="text-xs text-green-600 mt-2">
              {Object.values(privacySettings).filter(Boolean).length} of 4 features enabled
            </p>
          </div>

          {/* Context Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Usage Tips</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Adjust context settings to see different insights
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Focus level automatically decreases over time
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Privacy settings affect which insights appear
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Try different modes to see varying levels of activity
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}