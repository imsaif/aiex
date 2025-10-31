'use client';

import React from 'react';

interface Module {
  name: string;
  duration: number;
  description: string;
  items: string[];
}

interface LessonModuleOverviewProps {
  modules: Module[];
  className?: string;
}

export default function LessonModuleOverview({
  modules,
  className = '',
}: LessonModuleOverviewProps) {
  return (
    <div className={className}>
      {/* Sequential Flow */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0">
          {modules.map((module, index) => (
            <React.Fragment key={module.name}>
              <div className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg text-center">
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {index + 1}. {module.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {module.duration} minutes
                </div>
              </div>
              {index < modules.length - 1 && (
                <div className="flex items-center justify-center text-gray-400 font-bold text-sm sm:text-lg px-1">
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detailed Module Breakdown */}
      <div className="grid gap-4">
        {modules.map((module, index) => (
          <div
            key={module.name}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold text-sm">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {module.name} ({module.duration} minutes)
                </h3>
                <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                <ul className="mt-2 space-y-1">
                  {module.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
