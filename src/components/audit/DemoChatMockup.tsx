'use client';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import { DEMO_PINS } from './DemoProductMockup';

interface DemoChatMockupProps {
  activePin: number | null;
  onPinClick: (index: number) => void;
  onPinHover?: (index: number | null) => void;
}

const FINDINGS: Record<number, { status: 'missing' | 'weak'; finding: string }> = {
  1: { status: 'weak', finding: 'No probability or certainty bands on KPI deltas.' },
  2: { status: 'missing', finding: 'No reviewer step before forecast actions.' },
  3: { status: 'missing', finding: 'Failed forecast offers no retry or fallback.' },
  4: { status: 'missing', finding: 'Insights show conclusions, not the reasoning.' },
  5: { status: 'weak', finding: 'No memory of which insights you dismissed.' },
};

/**
 * Phone-screen content: the AI Assistant findings panel — same visual
 * language as the laptop's right-side panel, showing the 5 audit pins
 * as tappable rows with pulsating numbered indicators. Tapping a row
 * fires onPinClick (wired to the same GapSidePanel state as the
 * laptop pins).
 */
export function DemoChatMockup({ activePin, onPinClick, onPinHover }: DemoChatMockupProps) {
  return (
    <div className="h-full flex flex-col bg-background-primary text-text-primary overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 text-[9px] font-semibold text-text-primary">
        <span>9:41</span>
        <div className="flex items-center gap-0.5">
          <span className="w-3 h-1.5 rounded-[1px] bg-text-primary/60" />
          <span className="w-3 h-1.5 rounded-[1px] bg-text-primary/40" />
          <span className="w-3 h-1.5 rounded-[1px] bg-text-primary/80" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-3 border-b border-border-primary">
        <ChatBubbleOvalLeftIcon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold leading-tight text-text-primary">AI Assistant</p>
          <p className="text-[9px] text-text-tertiary leading-tight">5 audit findings</p>
        </div>
      </div>

      {/* Findings list — each row matches the laptop pin styling
          (filled-accent numbered circle) so the visual story stays
          consistent across devices. */}
      <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
        {DEMO_PINS.map((pin) => {
          const data = FINDINGS[pin.index];
          const isActive = activePin === pin.index;
          return (
            <button
              key={pin.index}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                onPinClick(pin.index);
                (e.currentTarget as HTMLButtonElement).blur();
              }}
              onMouseEnter={() => onPinHover?.(pin.index)}
              onMouseLeave={() => onPinHover?.(null)}
              aria-label={`Finding ${pin.index}: ${pin.label}`}
              className={`w-full flex items-start gap-2 rounded-md border p-2 text-left transition-all ${
                isActive
                  ? 'border-accent-primary bg-accent-subtle shadow-sm'
                  : 'border-border-primary bg-background-secondary hover:border-accent-primary/50'
              }`}
            >
              {/* Numbered pin — filled accent (dark in light mode, white in
                  dark mode), no pulse. */}
              <span className="relative flex-shrink-0 mt-0.5">
                <span
                  className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-accent-primary text-white dark:text-gray-900 border-white dark:border-gray-900 scale-110 shadow'
                      : 'bg-accent-primary text-white dark:text-gray-900 border-white dark:border-gray-900'
                  }`}
                >
                  {pin.index}
                </span>
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[10px] font-semibold leading-tight truncate">{pin.label}</p>
                  <span
                    className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      data?.status === 'missing'
                        ? 'bg-status-error/15 text-status-error'
                        : 'bg-status-warning/15 text-status-warning'
                    }`}
                  >
                    {data?.status === 'missing' ? 'Missing' : 'Weak'}
                  </span>
                </div>
                <p className="text-[9px] text-text-secondary leading-snug line-clamp-2">
                  {data?.finding}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
