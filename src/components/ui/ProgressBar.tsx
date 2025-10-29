'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md';
  showPercentage?: boolean;
}

export default function ProgressBar({ percentage, size = 'sm', showPercentage = true }: ProgressBarProps) {
  const heightClasses = size === 'sm' ? 'h-1.5' : 'h-2';
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-border-primary rounded-full overflow-hidden ${heightClasses}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-accent-primary to-accent-primary/70 rounded-full"
        />
      </div>
      {showPercentage && (
        <span className="text-xs font-medium text-text-secondary min-w-fit">{clampedPercentage}%</span>
      )}
    </div>
  );
}
