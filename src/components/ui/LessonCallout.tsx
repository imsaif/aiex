'use client';

import React from 'react';

interface LessonCalloutProps {
  children: React.ReactNode;
  type?: 'tip' | 'note' | 'warning' | 'success';
  className?: string;
}

export default function LessonCallout({
  children,
  type = 'note',
  className = '',
}: LessonCalloutProps) {
  const baseClasses = 'p-4 rounded-lg border-l-4';

  const typeStyles = {
    tip: 'bg-gray-50 border-l-gray-400 text-gray-900',
    note: 'bg-gray-50 border-l-gray-400 text-gray-900',
    warning: 'bg-gray-50 border-l-gray-600 text-gray-900',
    success: 'bg-gray-50 border-l-gray-400 text-gray-900',
  };

  const icons = {
    tip: '💡',
    note: '📝',
    warning: '⚠️',
    success: '✅',
  };

  return (
    <div className={`${baseClasses} ${typeStyles[type]} ${className}`}>
      <div className="flex gap-3">
        <span className="text-lg flex-shrink-0">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
