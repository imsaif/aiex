'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultRightWidth?: number;
  minRightWidth?: number;
  maxRightWidthPercent?: number;
  storageKey?: string;
  /** Device type of uploaded screenshot - controls panel sizing */
  deviceType?: 'mobile' | 'desktop';
  /** @deprecated Use deviceType instead. When true, uses a wider default for the right panel */
  preferWiderPanel?: boolean;
  /** Whether analysis results are showing - triggers wider panel */
  hasResults?: boolean;
}

// Width configurations based on device type (legacy, kept for backwards compatibility)
const DEVICE_CONFIG = {
  mobile: {
    defaultWidth: 600,      // Wider right panel for mobile (narrow canvas needed)
    minWidth: 450,          // Higher minimum since mobile frame is small
    maxPercent: 0.7,        // Allow up to 70% for results
  },
  desktop: {
    defaultWidth: 480,      // Narrower right panel for desktop (larger canvas needed)
    minWidth: 380,          // Lower minimum since desktop frame needs space
    maxPercent: 0.5,        // Only allow up to 50% to preserve canvas space
  },
  default: {
    defaultWidth: 480,      // Before upload, balanced default
    minWidth: 380,
    maxPercent: 0.6,
  },
};

// State-based width configuration (percentage-based for responsive sizing)
const STATE_CONFIG = {
  welcome: {
    defaultPercent: 0.5,    // 50% for welcome state
    minWidth: 380,
    maxPercent: 0.6,
  },
  results: {
    defaultPercent: 0.5,    // 50% for results state (balanced split)
    minWidth: 380,
    maxPercent: 0.65,
  },
};

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultRightWidth = 450,
  minRightWidth = 350,
  maxRightWidthPercent = 0.6,
  storageKey = 'audit-panel-width',
  deviceType,
  preferWiderPanel = false,
  hasResults = false,
}: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUserResized, setHasUserResized] = useState(false);
  const prevHasResults = useRef(hasResults);

  // Get state-based configuration (primary method now)
  const stateConfig = hasResults ? STATE_CONFIG.results : STATE_CONFIG.welcome;

  // Get width configuration based on device type (kept for manual drag constraints)
  // If deviceType is provided, use it; otherwise fall back to preferWiderPanel for backwards compatibility
  const deviceConfig = deviceType
    ? DEVICE_CONFIG[deviceType]
    : (preferWiderPanel ? DEVICE_CONFIG.mobile : DEVICE_CONFIG.default);

  // Use state-based config for defaults, device config for constraints during manual resize
  const effectiveMinWidth = stateConfig.minWidth;
  const effectiveMaxPercent = stateConfig.maxPercent;

  // Calculate initial width based on a reasonable default container width
  const estimatedContainerWidth = 1200;
  const smartDefaultWidth = Math.round(estimatedContainerWidth * stateConfig.defaultPercent);

  // Always initialize with the default to avoid hydration mismatch
  const [rightWidth, setRightWidth] = useState(smartDefaultWidth);
  const [isHydrated, setIsHydrated] = useState(false);

  // Determine storage key based on state (welcome vs results)
  const stateStorageKey = `${storageKey}-${hasResults ? 'results' : 'welcome'}`;

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem(stateStorageKey);

    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= effectiveMinWidth) {
        setRightWidth(parsed);
        setHasUserResized(true);
        return;
      }
    }

    // No stored preference, calculate percentage-based default
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const targetWidth = Math.round(containerWidth * stateConfig.defaultPercent);
      setRightWidth(Math.max(targetWidth, effectiveMinWidth));
    } else {
      setRightWidth(smartDefaultWidth);
    }
    setHasUserResized(false);
  }, [stateStorageKey, effectiveMinWidth, smartDefaultWidth, stateConfig.defaultPercent]);

  // Handle state transition (welcome <-> results) with smooth resize
  useEffect(() => {
    if (prevHasResults.current !== hasResults && isHydrated) {
      // State changed, animate to new target width (unless user manually resized)
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        const targetPercent = hasResults ? STATE_CONFIG.results.defaultPercent : STATE_CONFIG.welcome.defaultPercent;
        const targetWidth = Math.round(containerWidth * targetPercent);
        const minWidth = hasResults ? STATE_CONFIG.results.minWidth : STATE_CONFIG.welcome.minWidth;
        setRightWidth(Math.max(targetWidth, minWidth));
        setHasUserResized(false);
      }
    }
    prevHasResults.current = hasResults;
  }, [hasResults, isHydrated]);

  // Persist width to localStorage (state-specific) - only after hydration
  useEffect(() => {
    if (isHydrated && !isDragging && hasUserResized) {
      localStorage.setItem(stateStorageKey, rightWidth.toString());
    }
  }, [rightWidth, isDragging, stateStorageKey, isHydrated, hasUserResized]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle drag movement and end
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newRightWidth = containerRect.right - e.clientX;
      const maxWidth = containerRect.width * effectiveMaxPercent;

      setRightWidth(Math.min(Math.max(newRightWidth, effectiveMinWidth), maxWidth));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setHasUserResized(true);
    };

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, effectiveMinWidth, effectiveMaxPercent]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Panel (Canvas) */}
      <div className="flex-1 min-w-0 relative">
        {leftPanel}
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          w-2 cursor-col-resize relative group flex-shrink-0
          ${isDragging ? 'bg-accent-primary/20' : 'bg-transparent hover:bg-accent-primary/10'}
          transition-colors duration-150
        `}
      >
        {/* Visual handle indicator */}
        <div
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-1 h-16 rounded-full transition-all duration-150
            ${isDragging
              ? 'bg-accent-primary scale-y-125'
              : 'bg-border-primary group-hover:bg-accent-primary/60'
            }
          `}
        />

        {/* Larger hit area for easier grabbing */}
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Right Panel (Results) */}
      <div
        style={{ width: rightWidth }}
        className={`flex-shrink-0 will-change-[width] h-full overflow-hidden ${
          isDragging ? '' : 'transition-[width] duration-300 ease-out'
        }`}
      >
        {rightPanel}
      </div>
    </div>
  );
}
