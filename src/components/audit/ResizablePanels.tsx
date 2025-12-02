'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultRightWidth?: number;
  minRightWidth?: number;
  maxRightWidthPercent?: number;
  storageKey?: string;
  /** When true, uses a wider default for the right panel (better for narrow content like mobile screenshots) */
  preferWiderPanel?: boolean;
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultRightWidth = 450,
  minRightWidth = 350,
  maxRightWidthPercent = 0.6,
  storageKey = 'audit-panel-width',
  preferWiderPanel = false,
}: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate smart default based on content type
  // Mobile screenshots are narrow, so give even more room to results panel
  // Desktop screenshots still benefit from a wider panel since image is already in a frame
  const smartDefaultWidth = preferWiderPanel ? 650 : 550;

  // Always initialize with the default to avoid hydration mismatch
  const [rightWidth, setRightWidth] = useState(smartDefaultWidth);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true);
    const deviceStorageKey = preferWiderPanel ? `${storageKey}-mobile` : `${storageKey}-desktop`;
    const stored = localStorage.getItem(deviceStorageKey);

    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= minRightWidth) {
        setRightWidth(parsed);
        return;
      }
    }
    // No stored preference, use smart default
    setRightWidth(smartDefaultWidth);
  }, [preferWiderPanel, storageKey, minRightWidth, smartDefaultWidth]);

  // Persist width to localStorage (device-specific) - only after hydration
  useEffect(() => {
    if (isHydrated && !isDragging) {
      const deviceStorageKey = preferWiderPanel ? `${storageKey}-mobile` : `${storageKey}-desktop`;
      localStorage.setItem(deviceStorageKey, rightWidth.toString());
    }
  }, [rightWidth, isDragging, storageKey, preferWiderPanel, isHydrated]);

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
      const maxWidth = containerRect.width * maxRightWidthPercent;

      setRightWidth(Math.min(Math.max(newRightWidth, minRightWidth), maxWidth));
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
  }, [isDragging, minRightWidth, maxRightWidthPercent]);

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
        className="flex-shrink-0 will-change-[width]"
      >
        {rightPanel}
      </div>
    </div>
  );
}
