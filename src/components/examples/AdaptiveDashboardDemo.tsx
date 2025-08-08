import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple dashboard item interface
interface DashboardItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  usage: number;
}

// Simple, focused dashboard items
const initialDashboardItems: DashboardItem[] = [
  { id: 'messages', title: 'Messages', icon: '💬', color: 'bg-blue-100 text-blue-800', usage: 0 },
  { id: 'calendar', title: 'Calendar', icon: '📅', color: 'bg-green-100 text-green-800', usage: 0 },
  { id: 'tasks', title: 'Tasks', icon: '✅', color: 'bg-purple-100 text-purple-800', usage: 0 },
  { id: 'files', title: 'Files', icon: '📁', color: 'bg-orange-100 text-orange-800', usage: 0 },
  { id: 'settings', title: 'Settings', icon: '⚙️', color: 'bg-gray-100 text-gray-800', usage: 0 }
];

export default function AdaptiveDashboardDemo() {
  const [dashboardItems, setDashboardItems] = useState(initialDashboardItems);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [totalClicks, setTotalClicks] = useState(0);

  // Handle item click
  const handleItemClick = (itemId: string) => {
    setDashboardItems(prev => {
      const updated = prev.map(item => 
        item.id === itemId 
          ? { ...item, usage: item.usage + 1 }
          : item
      );

      // Show adaptation notification if order changes
      if (adaptiveMode) {
        const originalOrder = prev.map(item => item.id).join(',');
        const sortedItems = [...updated].sort((a, b) => b.usage - a.usage);
        const newOrder = sortedItems.map(item => item.id).join(',');
        
        if (originalOrder !== newOrder) {
          const clickedItem = updated.find(item => item.id === itemId);
          setNotification(`"${clickedItem?.title}" moved up! The interface learned from your behavior.`);
          setTimeout(() => setNotification(null), 3000);
        }
        
        return sortedItems;
      }
      
      return updated;
    });
    
    setTotalClicks(prev => prev + 1);
  };

  // Reset the demo
  const resetDemo = () => {
    setDashboardItems(initialDashboardItems);
    setTotalClicks(0);
    setNotification('Demo reset - try clicking different items!');
    setTimeout(() => setNotification(null), 2000);
  };

  // Toggle adaptive mode
  const toggleAdaptiveMode = () => {
    setAdaptiveMode(prev => !prev);
    setNotification(adaptiveMode ? 'Adaptive mode disabled' : 'Adaptive mode enabled');
    setTimeout(() => setNotification(null), 2000);
  };

  // Sort items by usage when adaptive mode is on
  const sortedItems = adaptiveMode 
    ? [...dashboardItems].sort((a, b) => b.usage - a.usage)
    : dashboardItems;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Adaptive Interface Demo</h2>
        <p className="text-blue-100">
          Click on the items below and watch how the interface learns from your usage patterns
        </p>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              <p className="text-yellow-800 font-medium">{notification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total clicks: <strong>{totalClicks}</strong>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Adaptive Mode Toggle */}
          <label className="flex items-center cursor-pointer">
            <span className="text-sm text-gray-600 mr-2">Adaptive Mode</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={adaptiveMode}
                onChange={toggleAdaptiveMode}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                adaptiveMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adaptiveMode ? 'transform translate-x-4' : ''
              }`}></div>
            </div>
          </label>

          {/* Reset Button */}
          <button
            onClick={resetDemo}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {/* Dashboard Items */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedItems.map((item, index) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, layout: { duration: 0.5 } }}
              onClick={() => handleItemClick(item.id)}
              className={`${item.color} p-6 rounded-lg text-center hover:shadow-md transition-all duration-200 transform hover:scale-105 relative group`}
            >
              {/* Usage Badge */}
              {item.usage > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold"
                >
                  {item.usage}
                </motion.div>
              )}

              {/* Position Badge (for adaptive mode) */}
              {adaptiveMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-2 left-2 bg-white bg-opacity-80 text-gray-700 text-xs px-2 py-1 rounded font-medium"
                >
                  #{index + 1}
                </motion.div>
              )}

              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-medium">{item.title}</div>
              
              {/* Click instruction */}
              <div className="text-xs opacity-70 mt-1 group-hover:opacity-100 transition-opacity">
                Click me!
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="p-6 bg-blue-50 border-t">
        <h3 className="font-semibold text-gray-800 mb-3">💡 How it works:</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">1.</span>
            <span>Click on different items to simulate usage</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">2.</span>
            <span>The interface automatically reorders items based on frequency of use</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">3.</span>
            <span>Most used items move to the top for easier access</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">4.</span>
            <span>Toggle &quot;Adaptive Mode&quot; to see the difference with/without learning</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-400">
          <p className="text-xs text-gray-600">
            <strong>Real-world applications:</strong> Navigation menus, tool palettes, feature lists, 
            app shortcuts, and any interface where usage patterns can improve user efficiency.
          </p>
        </div>
      </div>
    </div>
  );
} 