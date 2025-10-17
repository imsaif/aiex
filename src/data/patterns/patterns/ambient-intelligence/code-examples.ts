import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Ambient Intelligence - Interactive Timeline",
    description: "Explore how AI quietly adjusts your environment throughout the day with a simple timeline slider.",
    language: "tsx",
    componentId: "ambient-intelligence-demo",
    code: `'use client';

import React, { useState } from 'react';

export default function AmbientIntelligenceDemo() {
  const [currentHour, setCurrentHour] = useState(9); // Start at 9 AM

  // Get AI action and environment state based on time
  const getEnvironmentState = (hour: number) => {
    // Morning (6-11)
    if (hour >= 6 && hour < 12) {
      return {
        brightness: 95,
        temperature: 72,
        notifications: 'normal',
        action: hour < 9
          ? '☀️ Increased brightness for your morning routine'
          : '🔔 Notifications active - morning work session',
        gradient: 'from-blue-100 to-blue-50',
        timeOfDay: 'Morning'
      };
    }
    // Afternoon (12-17)
    else if (hour >= 12 && hour < 17) {
      return {
        brightness: 90,
        temperature: 71,
        notifications: hour >= 14 && hour < 16 ? 'quiet' : 'normal',
        action: hour >= 14 && hour < 16
          ? '🔕 Quieted notifications for your deep focus session'
          : '🌡️ Adjusted temperature for optimal afternoon comfort',
        gradient: 'from-gray-100 to-gray-50',
        timeOfDay: 'Afternoon'
      };
    }
    // Evening (17-23)
    else {
      return {
        brightness: hour >= 20 ? 40 : 60,
        temperature: 74,
        notifications: 'quiet',
        action: hour >= 20
          ? '💡 Dimmed lighting to reduce eye strain in the evening'
          : '🔕 Enabled quiet mode for end-of-day wrap-up',
        gradient: 'from-amber-100 to-amber-50',
        timeOfDay: 'Evening'
      };
    }
  };

  const state = getEnvironmentState(currentHour);

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return \`\${displayHour}:00 \${period}\`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ambient Intelligence Through Your Day</h2>
        <p className="text-sm text-gray-600">Move the slider to see AI adjustments</p>
      </div>

      {/* Time Slider */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">Time</span>
          <span className="text-2xl font-bold text-purple-600">{formatTime(currentHour)}</span>
        </div>
        <input
          type="range"
          min="6"
          max="23"
          value={currentHour}
          onChange={(e) => setCurrentHour(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* Workspace Visualization */}
      <div className={\`bg-gradient-to-br \${state.gradient} border rounded-xl p-8 min-h-[300px] transition-all duration-700\`}>
        <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs">
          {state.timeOfDay}
        </div>

        <div className="bg-white/70 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              💻
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-around pt-4 border-t">
            <div className="text-center">
              <div>💡</div>
              <span className="text-xs">{state.brightness}%</span>
            </div>
            <div className="text-center">
              <div>🌡️</div>
              <span className="text-xs">{state.temperature}°F</span>
            </div>
            <div className="text-center">
              <div>{state.notifications === 'quiet' ? '🔕' : '🔔'}</div>
              <span className="text-xs">{state.notifications}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Action */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span>🤖</span>
          <div>
            <p className="text-sm font-medium text-purple-900">AI Action</p>
            <p className="text-sm text-purple-700">{state.action}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`
  }
];
