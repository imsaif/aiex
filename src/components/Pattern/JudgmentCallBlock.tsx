import React from 'react';
import type { JudgmentCall } from '../../types';

interface Props {
  data: JudgmentCall;
  patternTitle: string;
}

export default function JudgmentCallBlock({ data, patternTitle }: Props) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-text-primary pb-3 mb-6 border-b border-gray-300 dark:border-gray-600">
        When to use {patternTitle}, and when it backfires
      </h2>

      <div className="bg-surface-primary border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Explain when */}
          <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-status-success" />
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Use it when</h3>
            </div>
            <ul className="space-y-3">
              {data.explainWhen.map((item, i) => (
                <li key={i} className="text-text-secondary leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          {/* Don't when */}
          <div className="flex-1 p-6 md:p-8 bg-[#F0F1F5] dark:bg-[#162036] bg-grain">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-status-error" />
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Don&apos;t, or minimize, when</h3>
            </div>
            <ul className="space-y-3">
              {data.dontWhen.map((item, i) => (
                <li key={i} className="text-text-secondary leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* The trap — full-width footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8 bg-surface-primary">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-status-warning" />
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">The trap</h3>
          </div>
          <p className="text-text-secondary leading-relaxed">{data.trap}</p>
        </div>
      </div>
    </section>
  );
}
