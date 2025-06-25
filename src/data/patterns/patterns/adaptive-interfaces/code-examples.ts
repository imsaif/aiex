import { CodeExample } from '../../../../types';

export const codeExamples: CodeExample[] = [
  {
    title: "Adaptive Dashboard with Usage-Based Layout",
    description: "A React component that learns from user interactions and automatically reorganizes widgets based on usage frequency.",
    language: "tsx",
    componentId: "adaptive-dashboard",
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardWidget {
  id: string;
  title: string;
  usage: number;
  content: React.ReactNode;
}

// Sample widgets with more variety
const widgets = [
  { 
    id: 'sales', 
    title: 'Sales', 
    usage: 10,
    content: (
      <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg h-32">
        <h3 className="text-lg font-semibold">Sales Overview</h3>
        <p className="text-2xl font-bold">$124,500</p>
        <p className="text-sm opacity-90">+12% from last month</p>
      </div>
    )
  },
  { 
    id: 'analytics', 
    title: 'Analytics', 
    usage: 5,
    content: (
      <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg h-32">
        <h3 className="text-lg font-semibold">User Analytics</h3>
        <p className="text-2xl font-bold">15,234</p>
        <p className="text-sm opacity-90">Active users this week</p>
      </div>
    )
  },
  { 
    id: 'tasks', 
    title: 'Tasks', 
    usage: 15,
    content: (
      <div className="p-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg h-32">
        <h3 className="text-lg font-semibold">Task Progress</h3>
        <p className="text-2xl font-bold">8/12</p>
        <p className="text-sm opacity-90">Completed today</p>
      </div>
    )
  },
  { 
    id: 'messages', 
    title: 'Messages', 
    usage: 3,
    content: (
      <div className="p-4 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-lg h-32">
        <h3 className="text-lg font-semibold">Messages</h3>
        <p className="text-2xl font-bold">23</p>
        <p className="text-sm opacity-90">Unread messages</p>
      </div>
    )
  },
  { 
    id: 'reports', 
    title: 'Reports', 
    usage: 7,
    content: (
      <div className="p-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-lg h-32">
        <h3 className="text-lg font-semibold">Reports</h3>
        <p className="text-2xl font-bold">5</p>
        <p className="text-sm opacity-90">Pending review</p>
      </div>
    )
  },
  { 
    id: 'calendar', 
    title: 'Calendar', 
    usage: 2,
    content: (
      <div className="p-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg h-32">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <p className="text-2xl font-bold">3</p>
        <p className="text-sm opacity-90">Meetings today</p>
      </div>
    )
  }
];

export default function AdaptiveDashboardDemo() {
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(widgets);
  const [autoArrange, setAutoArrange] = useState(true);
  const [showUsageStats, setShowUsageStats] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [adaptationCount, setAdaptationCount] = useState(0);

  const handleWidgetClick = (widgetId: string) => {
    setDashboardWidgets(prev => {
      const updated = prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, usage: widget.usage + 1 }
          : widget
      );

      // Auto-arrange by usage if enabled
      if (autoArrange) {
        const sorted = [...updated].sort((a, b) => b.usage - a.usage);
        const changedWidget = updated.find(w => w.id === widgetId);
        
        // Check if order actually changed
        const originalOrder = updated.map(w => w.id).join(',');
        const newOrder = sorted.map(w => w.id).join(',');
        
        if (originalOrder !== newOrder) {
          setAdaptationCount(prev => prev + 1);
          setNotification(\`Moved "\${changedWidget?.title}" up based on usage (Adaptation #\${adaptationCount + 1})\`);
          setTimeout(() => setNotification(null), 3000);
        }
        
        return sorted;
      }
      
      return updated;
    });
  };

  const resetDashboard = () => {
    setDashboardWidgets(widgets);
    setAdaptationCount(0);
    setNotification('Dashboard reset to default layout');
    setTimeout(() => setNotification(null), 2000);
  };

  const sortedWidgets = autoArrange 
    ? [...dashboardWidgets].sort((a, b) => b.usage - a.usage)
    : dashboardWidgets;

  const totalUsage = dashboardWidgets.reduce((sum, widget) => sum + widget.usage, 0);
  const mostUsedWidget = dashboardWidgets.reduce((prev, current) => 
    prev.usage > current.usage ? prev : current
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Adaptive Dashboard</h1>
        <p className="text-gray-600">Click widgets to see adaptive reordering in action</p>
      </div>

      {/* Enhanced Controls */}
      <div className="mb-6 p-6 bg-white rounded-lg border shadow-sm">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoArrange}
                onChange={(e) => setAutoArrange(e.target.checked)}
                className="mr-2"
              />
              Auto-arrange by usage
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showUsageStats}
                onChange={(e) => setShowUsageStats(e.target.checked)}
                className="mr-2"
              />
              Show usage statistics
            </label>
          </div>
          
          {/* Stats display */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Total clicks: <strong>{totalUsage}</strong></span>
            <span>Adaptations: <strong>{adaptationCount}</strong></span>
            <span>Most used: <strong>{mostUsedWidget.title}</strong></span>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <span className="text-green-800 text-sm">🔄 {notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Grid - Now wider with 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <AnimatePresence>
          {sortedWidgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, layout: { duration: 0.5 } }}
              className="relative cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => handleWidgetClick(widget.id)}
            >
              {widget.content}
              
              {/* Enhanced usage badge */}
              {showUsageStats && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
                  <span className="mr-1">👆</span>
                  {widget.usage}
                </div>
              )}
              
              {/* Position badge */}
              {autoArrange && (
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded font-medium">
                  #{index + 1}
                </div>
              )}
              
              {/* Click ripple effect */}
              <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity rounded-lg"></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Enhanced footer with more controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={resetDashboard}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Reset Layout
        </button>
        
        <div className="text-sm text-gray-500">
          💡 Tip: Click widgets multiple times to see them move up in the layout
        </div>
        
        <div className="text-xs text-gray-400">
          Adaptive Algorithm: Usage-based sorting with real-time reordering
        </div>
      </div>
    </div>
  );
}`
  }
]; 