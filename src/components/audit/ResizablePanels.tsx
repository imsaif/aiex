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
}

// Width configurations based on device type
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

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultRightWidth = 450,
  minRightWidth = 350,
  maxRightWidthPercent = 0.6,
  storageKey = 'audit-panel-width',
  deviceType,
  preferWiderPanel = false,
}: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get width configuration based on device type
  // If deviceType is provided, use it; otherwise fall back to preferWiderPanel for backwards compatibility
  const config = deviceType
    ? DEVICE_CONFIG[deviceType]
    : (preferWiderPanel ? DEVICE_CONFIG.mobile : DEVICE_CONFIG.default);

  const smartDefaultWidth = config.defaultWidth;
  const effectiveMinWidth = config.minWidth;
  const effectiveMaxPercent = config.maxPercent;

  // Always initialize with the default to avoid hydration mismatch
  const [rightWidth, setRightWidth] = useState(smartDefaultWidth);
  const [isHydrated, setIsHydrated] = useState(false);

  // Determine storage key based on device type
  const deviceStorageKey = deviceType
    ? `${storageKey}-${deviceType}`
    : (preferWiderPanel ? `${storageKey}-mobile` : `${storageKey}-desktop`);

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem(deviceStorageKey);

    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= effectiveMinWidth) {
        setRightWidth(parsed);
        return;
      }
    }
    // No stored preference, use smart default
    setRightWidth(smartDefaultWidth);
  }, [deviceStorageKey, effectiveMinWidth, smartDefaultWidth]);

  // Persist width to localStorage (device-specific) - only after hydration
  useEffect(() => {
    if (isHydrated && !isDragging) {
      localStorage.setItem(deviceStorageKey, rightWidth.toString());
    }
  }, [rightWidth, isDragging, deviceStorageKey, isHydrated]);

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
        className="flex-shrink-0 will-change-[width] h-full overflow-hidden"
      >
        {rightPanel}
      </div>
    </div>
  );
}
