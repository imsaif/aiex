'use client';

import {
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  DocumentTextIcon,
  BellIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

export interface MockupPin {
  index: number;
  xPct: number;
  yPct: number;
  label: string;
}

// Pin coordinates correspond to the dashboard mockup below.
// Order matches the first 5 topGaps in DEMO_ANALYSIS_RESULTS.
export const DEMO_PINS: MockupPin[] = [
  { index: 1, xPct: 96, yPct: 32, label: 'Confidence Visualization' },
  { index: 2, xPct: 76, yPct: 11, label: 'Human-in-the-Loop' },
  { index: 3, xPct: 78, yPct: 56, label: 'Error Recovery' },
  { index: 4, xPct: 96, yPct: 44, label: 'Explainable AI' },
  { index: 5, xPct: 76, yPct: 21, label: 'Selective Memory' },
];

interface DemoProductMockupProps {
  activePin: number | null;
  onPinClick: (index: number) => void;
  onPinHover?: (index: number | null) => void;
}

export function DemoProductMockup({ activePin, onPinClick, onPinHover }: DemoProductMockupProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border-primary bg-background-primary shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            P
          </div>
          <span className="font-semibold text-sm text-text-primary">PulseMetrics</span>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {[
              { Icon: HomeIcon, label: 'Dashboard', active: true },
              { Icon: ChartBarIcon, label: 'Reports' },
              { Icon: DocumentTextIcon, label: 'Insights' },
              { Icon: Cog6ToothIcon, label: 'Settings' },
            ].map(({ Icon, label, active }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs ${
                  active
                    ? 'bg-background-secondary text-text-primary font-medium'
                    : 'text-text-tertiary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <BellIcon className="w-4 h-4 text-text-tertiary" />
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-orange-500" />
        </div>
      </div>

      {/* Main grid: dashboard left, AI assistant right */}
      <div className="grid grid-cols-12 gap-3 p-3 sm:p-4 bg-background-secondary min-h-[460px]">
        {/* LEFT — Dashboard content */}
        <div className="col-span-7 space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold text-sm text-text-primary">Sales overview</h2>
            <span className="text-[10px] text-text-tertiary">Last 30 days</span>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Revenue', value: '$48.2K', delta: '+12%', up: true },
              { label: 'Orders', value: '1,284', delta: '+4%', up: true },
              { label: 'Conv. rate', value: '3.4%', delta: '−0.2%', up: false },
              { label: 'AOV', value: '$37.50', delta: '+1.8%', up: true },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-border-primary bg-background-primary p-2.5">
                <p className="text-[10px] text-text-tertiary mb-1">{kpi.label}</p>
                <p className="font-semibold text-sm text-text-primary">{kpi.value}</p>
                <p className={`text-[10px] mt-0.5 inline-flex items-center gap-0.5 ${
                  kpi.up ? 'text-status-success' : 'text-status-error'
                }`}>
                  {kpi.up
                    ? <ArrowTrendingUpIcon className="w-2.5 h-2.5" />
                    : <ArrowTrendingDownIcon className="w-2.5 h-2.5" />}
                  {kpi.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Chart card */}
          <div className="rounded-lg border border-border-primary bg-background-primary p-3">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-xs font-medium text-text-secondary">Revenue trend</p>
              <span className="text-[10px] text-text-tertiary">Daily</span>
            </div>
            <svg viewBox="0 0 300 80" className="w-full h-20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,55 L30,48 L60,52 L90,38 L120,42 L150,30 L180,34 L210,22 L240,28 L270,16 L300,20 L300,80 L0,80 Z"
                fill="url(#chartFill)"
              />
              <path
                d="M0,55 L30,48 L60,52 L90,38 L120,42 L150,30 L180,34 L210,22 L240,28 L270,16 L300,20"
                fill="none"
                stroke="rgb(16,185,129)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Activity table */}
          <div className="rounded-lg border border-border-primary bg-background-primary p-3">
            <p className="text-xs font-medium text-text-secondary mb-2">Recent orders</p>
            <div className="space-y-1.5">
              {[
                { id: '#10248', cust: 'Ada Lovelace', amt: '$128.40' },
                { id: '#10247', cust: 'Grace Hopper', amt: '$74.00' },
                { id: '#10246', cust: 'Alan Turing', amt: '$220.95' },
              ].map((o) => (
                <div key={o.id} className="flex items-center justify-between text-[11px]">
                  <span className="text-text-tertiary font-mono">{o.id}</span>
                  <span className="text-text-secondary">{o.cust}</span>
                  <span className="text-text-primary font-medium">{o.amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — AI Assistant panel */}
        <div className="col-span-5 rounded-lg border border-border-primary bg-background-primary flex flex-col">
          {/* Assistant header */}
          <div className="px-3 py-2.5 border-b border-border-primary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent-primary flex items-center justify-center">
                <SparklesIcon className="w-3.5 h-3.5 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">AI Assistant</p>
                <p className="text-[10px] text-text-tertiary">Insights for this dashboard</p>
              </div>
            </div>
          </div>

          {/* Insights stream */}
          <div className="flex-1 px-3 py-3 space-y-2.5">
            <div className="rounded-md bg-accent-subtle border border-accent-primary/20 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-primary mb-1">Key insight</p>
              <p className="text-[11px] text-text-primary leading-relaxed">
                Revenue is up <strong>12%</strong> MoM, driven mostly by mobile checkout improvements.
              </p>
            </div>

            <div className="rounded-md bg-accent-subtle border border-accent-primary/20 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-primary mb-1">Recommendation</p>
              <p className="text-[11px] text-text-primary leading-relaxed">
                Consider a Tuesday email campaign — engagement is highest then.
              </p>
            </div>

            {/* Failed forecast block */}
            <div className="rounded-md border border-status-error/30 bg-status-error/10 p-2.5 flex items-start gap-1.5">
              <ExclamationCircleIcon className="w-3.5 h-3.5 text-status-error flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-status-error leading-relaxed">
                Couldn&apos;t load forecast.
              </p>
            </div>
          </div>

          {/* Input footer */}
          <div className="px-3 py-2 border-t border-border-primary">
            <div className="flex items-center gap-1.5 rounded-md border border-border-primary px-2 py-1.5">
              <span className="flex-1 text-[10px] text-text-tertiary">Ask the assistant&hellip;</span>
              <PaperAirplaneIcon className="w-3 h-3 text-text-tertiary" />
            </div>
          </div>
        </div>
      </div>

      {/* Numbered pins */}
      {DEMO_PINS.map((pin) => {
        const isActive = activePin === pin.index;
        return (
          <button
            key={pin.index}
            onClick={() => onPinClick(pin.index)}
            onMouseEnter={() => onPinHover?.(pin.index)}
            onMouseLeave={() => onPinHover?.(null)}
            aria-label={`Issue ${pin.index}: ${pin.label}`}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
          >
            <span
              className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all ${
                isActive
                  ? 'bg-accent-primary text-white dark:text-gray-900 border-white scale-125 shadow-lg'
                  : 'bg-white text-accent-primary border-accent-primary shadow-md group-hover:scale-110'
              }`}
            >
              {pin.index}
              <span
                className={`absolute inset-0 rounded-full border-2 border-accent-primary ${isActive ? '' : 'animate-ping opacity-60'}`}
                aria-hidden
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
