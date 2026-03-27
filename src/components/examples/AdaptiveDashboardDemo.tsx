import React, { useState, useRef, useCallback } from 'react';

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

// Predefined usage scenario that demonstrates the adaptive reordering
const demoScenario: { itemId: string; count: number }[] = [
  { itemId: 'tasks', count: 5 },
  { itemId: 'messages', count: 4 },
  { itemId: 'files', count: 3 },
  { itemId: 'calendar', count: 1 },
  { itemId: 'settings', count: 1 },
];

export default function AdaptiveDashboardDemo() {
  const [dashboardItems, setDashboardItems] = useState(initialDashboardItems);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const simulationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Apply a single usage increment (used by both manual click and simulation)
  const applyUsage = useCallback((itemId: string, currentItems: DashboardItem[], isAdaptive: boolean): DashboardItem[] => {
    const updated = currentItems.map(item =>
      item.id === itemId ? { ...item, usage: item.usage + 1 } : item
    );

    if (isAdaptive) {
      const originalOrder = currentItems.map(item => item.id).join(',');
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
  }, []);

  // Handle item click (single click per item)
  const handleItemClick = (itemId: string) => {
    if (isSimulating) return;

    setDashboardItems(prev => applyUsage(itemId, prev, adaptiveMode));
    setTotalClicks(prev => prev + 1);
  };

  // Run the auto demo simulation
  const runSimulation = useCallback(() => {
    if (isSimulating) return;

    // Reset first
    setDashboardItems(initialDashboardItems);
    setTotalClicks(0);
    setIsSimulating(true);
    setNotification('Simulating user activity...');

    // Build a sequence of individual increments from the scenario
    const steps: string[] = [];
    for (const { itemId, count } of demoScenario) {
      for (let i = 0; i < count; i++) {
        steps.push(itemId);
      }
    }

    // Shuffle to make it feel more natural (Fisher-Yates)
    for (let i = steps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [steps[i], steps[j]] = [steps[j], steps[i]];
    }

    let currentItems = [...initialDashboardItems];
    let clickCount = 0;

    steps.forEach((itemId, index) => {
      const timer = setTimeout(() => {
        setHighlightedItem(itemId);
        currentItems = applyUsage(itemId, currentItems, true);
        clickCount++;
        setDashboardItems([...currentItems]);
        setTotalClicks(clickCount);

        // Clear highlight after a short delay
        setTimeout(() => setHighlightedItem(null), 300);

        // End simulation after last step
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setNotification('Simulation complete — items reordered by usage!');
            setTimeout(() => setNotification(null), 3000);
          }, 500);
        }
      }, (index + 1) * 400);

      simulationRef.current.push(timer);
    });
  }, [isSimulating, applyUsage]);

  // Reset the demo
  const resetDemo = () => {
    // Clear any running simulation
    simulationRef.current.forEach(clearTimeout);
    simulationRef.current = [];
    setIsSimulating(false);
    setHighlightedItem(null);

    setDashboardItems(initialDashboardItems);
    setTotalClicks(0);
    setNotification('Demo reset');
    setTimeout(() => setNotification(null), 2000);
  };

  // Toggle adaptive mode
  const toggleAdaptiveMode = () => {
    if (isSimulating) return;
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
          Click &quot;Simulate Usage&quot; to watch items reorder by frequency, or click items individually
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div className="px-6 py-4 bg-surface-secondary border-b border-primary">
          <p className="text-base text-text-secondary">{notification}</p>
        </div>
      )}

      {/* Controls */}
      <div className="px-6 py-4 bg-surface-secondary border-b border-primary flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-4">
          {/* Simulate Button */}
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className={`px-4 py-2 text-base font-medium rounded-lg transition-colors ${
              isSimulating
                ? 'bg-accent-primary/50 text-white cursor-not-allowed'
                : 'bg-accent-primary text-white hover:bg-accent-primary/90 active:scale-95'
            }`}
          >
            {isSimulating ? 'Simulating...' : 'Simulate Usage'}
          </button>

          <span className="text-base text-text-secondary">
            Interactions: <span className="text-text-primary font-medium">{totalClicks}</span>
          </span>
        </div>

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
            className="px-4 py-2 text-base text-text-secondary hover:text-text-primary border border-secondary rounded-lg hover:border-primary active:scale-95 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Dashboard Items */}
      <div className="p-6" data-clarity-region="demo-interactive">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              data-clarity-region="demo-button"
              className={`bg-surface-secondary hover:bg-surface-elevated border p-6 rounded-xl text-center transition-all relative cursor-pointer active:scale-95 ${
                highlightedItem === item.id
                  ? 'border-accent-primary ring-2 ring-accent-primary/30 scale-[1.02]'
                  : 'border-secondary hover:border-primary'
              }`}
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
          <span className="font-medium text-text-secondary">How it works:</span> Items reorder based on usage frequency.
          Most-used items rise to the top for faster access. Try the simulation or click items yourself.
        </p>
      </div>
    </div>
  );
}
