'use client';

import {
  SparklesIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PATTERN_CATEGORIES = [
  { name: 'Transparency & Trust', count: 10, icon: MagnifyingGlassIcon, color: 'text-blue-500' },
  { name: 'Control & Autonomy', count: 8, icon: AdjustmentsHorizontalIcon, color: 'text-purple-500' },
  { name: 'Personalization', count: 7, icon: UserIcon, color: 'text-yellow-500' },
  { name: 'Error Handling', count: 6, icon: ExclamationTriangleIcon, color: 'text-orange-500' },
  { name: 'Privacy & Security', count: 8, icon: ShieldCheckIcon, color: 'text-red-500' },
  { name: 'Feedback & Communication', count: 6, icon: ChatBubbleLeftRightIcon, color: 'text-cyan-500' },
  { name: 'Efficiency', count: 5, icon: BoltIcon, color: 'text-amber-500' },
  { name: 'Accessibility & Fairness', count: 4, icon: CheckBadgeIcon, color: 'text-indigo-500' },
  { name: 'Onboarding & Education', count: 4, icon: AcademicCapIcon, color: 'text-emerald-500' },
];

export function LeftSidebar() {
  return (
    <aside className="w-[300px] h-full flex-shrink-0 p-6 bg-background-primary/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border-primary/50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-text-primary">50+ Product Patterns</h2>
        </div>
        <p className="text-base text-text-secondary leading-relaxed">
          We analyze your design against industry-leading AI/UX patterns to help you build better products.
        </p>
      </div>

      {/* What We Check */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
          What We Check
        </h3>
        <div className="space-y-1">
          {PATTERN_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <span className="text-base text-text-primary">{category.name}</span>
              </div>
              <CheckCircleIcon className="w-5 h-5 text-text-tertiary" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="pt-4 mt-4 border-t border-border-primary">
        <p className="text-sm text-text-tertiary leading-relaxed">
          Our comprehensive analysis evaluates your design against proven patterns.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-4 p-4 bg-background-secondary rounded-xl text-center">
        <p className="text-base font-medium text-text-primary mb-1">Ready to get started?</p>
        <p className="text-sm text-text-tertiary">Upload your screenshot to receive instant analysis</p>
      </div>
    </aside>
  );
}
