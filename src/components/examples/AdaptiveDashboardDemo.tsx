import React, { useState } from 'react';

// Simple dashboard item interface
interface DashboardItem {
  id: string;
  title: string;
  icon: string;
  usage: number;
}

// Simple, focused dashboard items
const initialDashboardItems: DashboardItem[] = [
  { id: 'messages', title: 'Messages', icon: '💬', usage: 0 },
  { id: 'calendar', title: 'Calendar', icon: '📅', usage: 0 },
  { id: 'tasks', title: 'Tasks', icon: '✅', usage: 0 },
  { id: 'files', title: 'Files', icon: '📁', usage: 0 },
  { id: 'settings', title: 'Settings', icon: '⚙️', usage: 0 }
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
          setNotification(`"${clickedItem?.title}" moved up based on your usage.`);
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
    setNotification('Demo reset');
    setTimeout(() => setNotification(null), 2000);
  };

  // Toggle adaptive mode
  const toggleAdaptiveMode = () => {
    setAdaptiveMode(prev => !prev);
    setNotification(adaptiveMode ? 'Adaptive mode off' : 'Adaptive mode on');
    setTimeout(() => setNotification(null), 2000);
  };

  // Sort items by usage when adaptive mode is on
  const sortedItems = adaptiveMode
    ? [...dashboardItems].sort((a, b) => b.usage - a.usage)
    : dashboardItems;

  return (
    <div className="w-full bg-surface-primary border border-primary rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-primary p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-1">Adaptive Interface Demo</h2>
        <p className="text-base text-text-secondary">
          Click items to see them reorder by usage frequency
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div className="px-6 py-4 bg-surface-secondary border-b border-primary">
          <p className="text-base text-text-secondary">{notification}</p>
        </div>
      )}

      {/* Controls */}
      <div className="px-6 py-4 bg-surface-secondary border-b border-primary flex justify-between items-center">
        <span className="text-base text-text-secondary">
          Clicks: <span className="text-text-primary font-medium">{totalClicks}</span>
        </span>

        <div className="flex items-center gap-5">
          {/* Adaptive Mode Toggle */}
          <label className="flex items-center cursor-pointer">
            <span className="text-base text-text-secondary mr-3">Adaptive</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={adaptiveMode}
                onChange={toggleAdaptiveMode}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                adaptiveMode ? 'bg-accent-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}></div>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                adaptiveMode ? 'translate-x-5' : ''
              }`}></div>
            </div>
          </label>

          {/* Reset Button */}
          <button
            onClick={resetDemo}
            className="px-4 py-2 text-base text-text-secondary hover:text-text-primary border border-secondary rounded-lg hover:border-primary transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Dashboard Items */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="bg-surface-secondary hover:bg-surface-elevated border border-secondary hover:border-primary p-6 rounded-xl text-center transition-colors relative cursor-pointer"
            >
              {/* Usage Badge */}
              {item.usage > 0 && (
                <div className="absolute -top-2 -right-2 bg-accent-primary text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-medium">
                  {item.usage}
                </div>
              )}

              {/* Position Badge (for adaptive mode) */}
              {adaptiveMode && (
                <div className="absolute top-3 left-3 text-text-tertiary text-sm font-medium">
                  #{index + 1}
                </div>
              )}

              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-base font-medium text-text-primary">{item.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="px-6 py-5 border-t border-primary">
        <p className="text-sm text-text-tertiary">
          <span className="font-medium text-text-secondary">How it works:</span> Items reorder based on click frequency.
          Most-used items appear first for faster access.
        </p>
      </div>
    </div>
  );
}
