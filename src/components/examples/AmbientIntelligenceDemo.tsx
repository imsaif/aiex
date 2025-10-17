'use client';

import React, { useState, useEffect } from 'react';

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
    return `${displayHour}:00 ${period}`;
  };

  const getNotificationIcon = () => {
    return state.notifications === 'quiet' ? '🔕' : '🔔';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ambient Intelligence Through Your Day</h2>
        <p className="text-sm text-gray-600">Move the slider to see how AI quietly adjusts your environment throughout the day</p>
      </div>

      {/* Time Slider */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">Time</span>
          <span className="text-2xl font-bold text-purple-600">{formatTime(currentHour)}</span>
        </div>
        <input
          type="range"
          min="6"
          max="23"
          value={currentHour}
          onChange={(e) => setCurrentHour(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Workspace Visualization */}
      <div className={`relative bg-gradient-to-br ${state.gradient} border border-gray-200 rounded-xl p-8 min-h-[300px] transition-all duration-700`}>
        {/* Time of Day Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700">
          {state.timeOfDay}
        </div>

        {/* Workspace Content */}
        <div className="relative z-10">
          <div className="text-gray-700 mb-8">
            <p className="text-lg font-medium">Your Workspace</p>
            <p className="text-sm text-gray-500">AI monitors and adjusts automatically</p>
          </div>

          {/* Simple Desk/Work Area */}
          <div className="bg-white/70 backdrop-blur rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                💻
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-around pt-4 border-t border-gray-200">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl">
                  💡
                </div>
                <span className="text-xs font-medium text-gray-600">{state.brightness}%</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl">
                  🌡️
                </div>
                <span className="text-xs font-medium text-gray-600">{state.temperature}°F</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl">
                  {getNotificationIcon()}
                </div>
                <span className="text-xs font-medium text-gray-600 capitalize">{state.notifications}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>AI monitoring</span>
        </div>
      </div>

      {/* AI Action Message */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-xl">🤖</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900 mb-1">AI Action</p>
            <p className="text-sm text-purple-700">{state.action}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
