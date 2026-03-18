'use client';

import { useState, useEffect } from 'react';
import { ChevronDoubleRightIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FloatingResultsSidebarProps {
  children: React.ReactNode;
  isVisible: boolean;
  /** Increment to force-expand the sidebar (e.g. from external "Chat" button) */
  expandTrigger?: number;
}

export function FloatingResultsSidebar({ children, isVisible, expandTrigger = 0 }: FloatingResultsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Trigger slide-in animation after mount
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [isVisible]);

  // Force expand when triggered externally
  useEffect(() => {
    if (expandTrigger > 0) setIsCollapsed(false);
  }, [expandTrigger]);

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop: Floating sidebar on right */}
      <div className="hidden lg:block absolute right-4 top-4 bottom-4 z-20">
        <div
          className={`
            h-full transition-all duration-500 ease-out
            ${mounted && !isCollapsed
              ? 'w-[420px] xl:w-[460px] opacity-100 translate-x-0'
              : isCollapsed
                ? 'w-12 opacity-100 translate-x-0'
                : 'w-[420px] xl:w-[460px] opacity-0 translate-x-8'
            }
          `}
        >
          {isCollapsed ? (
            /* Collapsed state — just a tab to expand */
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="h-full w-12 bg-background-primary/95 backdrop-blur-xl border border-border-primary/50 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-background-secondary transition-colors"
            >
              <ChevronUpIcon className="w-5 h-5 text-text-secondary -rotate-90" />
            </button>
          ) : (
            /* Expanded state */
            <div className="relative h-full bg-background-primary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border-primary/50 overflow-hidden">
              {/* Collapse button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-background-secondary transition-colors"
                title="Collapse panel"
              >
                <ChevronDoubleRightIcon className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="h-full overflow-hidden">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Bottom sheet */}
      <div className="lg:hidden">
        <div
          className={`
            fixed inset-x-0 bottom-0 z-30 transition-transform duration-500 ease-out
            ${mounted && !isCollapsed ? 'translate-y-0' : isCollapsed ? 'translate-y-[calc(100%-48px)]' : 'translate-y-full'}
          `}
          style={{ maxHeight: '85vh' }}
        >
          {/* Drag handle / header */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center py-3 bg-background-primary/95 backdrop-blur-xl border-t border-x border-border-primary/50 rounded-t-2xl"
          >
            <div className="w-10 h-1 rounded-full bg-border-primary" />
          </button>

          {/* Content */}
          <div
            className="bg-background-primary/95 backdrop-blur-xl border-x border-border-primary/50 overflow-y-auto"
            style={{ maxHeight: 'calc(85vh - 48px)' }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
