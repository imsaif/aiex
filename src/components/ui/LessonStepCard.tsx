'use client';

import React from 'react';

interface LessonStepCardProps {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function LessonStepCard({
  stepNumber,
  title,
  children,
  className = '',
}: LessonStepCardProps) {
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors ${className}`}
    >
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold text-sm">
          {stepNumber}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <div className="text-gray-700 text-sm space-y-2">{children}</div>
      </div>
    </div>
  );
}
