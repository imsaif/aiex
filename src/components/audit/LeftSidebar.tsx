'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';

const PATTERN_CATEGORIES = [
  { id: 'transparency', name: 'Transparency & Trust', count: 10, icon: '🔍' },
  { id: 'control', name: 'Control & Autonomy', count: 8, icon: '🎮' },
  { id: 'personalization', name: 'Personalization', count: 7, icon: '✨' },
  { id: 'error', name: 'Error Handling', count: 6, icon: '⚠️' },
  { id: 'privacy', name: 'Privacy & Security', count: 8, icon: '🔒' },
  { id: 'feedback', name: 'Feedback & Communication', count: 6, icon: '💬' },
];

export function LeftSidebar() {
  return (
    <aside className="w-[250px] flex-shrink-0 p-6 border-r border-border-primary bg-background-primary">
      {/* Description */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-2">50+ Product Patterns</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          We analyze your design against industry-leading AI/UX patterns to help you build better products.
        </p>
      </div>

      {/* What We Check */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
          What We Check
        </h3>
        <div className="space-y-3">
          {PATTERN_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{category.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    {category.name}
                  </span>
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs text-text-tertiary">
                  {category.count} patterns
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto pt-6 border-t border-border-primary">
        <p className="text-sm font-semibold text-text-primary mb-1">
          Ready to get started?
        </p>
        <p className="text-xs text-text-secondary">
          Upload your screenshot to receive instant analysis
        </p>
      </div>
    </aside>
  );
}
