'use client';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ProgressRing({
  percentage,
  size = 48,
  strokeWidth = 3,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ overflow: 'visible' }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border-primary"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-accent-primary transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(37, 99, 235, 0.3))',
            }}
          />
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-bold text-accent-primary"
          style={{ fontSize: `${Math.max(8, size / 4)}px` }}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
}
