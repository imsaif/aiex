import { computeGrade } from '@/lib/audit/scoring';

interface LetterGradeProps {
  score: number;
  maxScore: number;
  size?: 'sm' | 'lg';
}

export function LetterGrade({ score, maxScore, size = 'lg' }: LetterGradeProps) {
  const { grade, percentage, label, color, ringColor } = computeGrade(score, maxScore);

  const isLarge = size === 'lg';
  const radius = isLarge ? 70 : 40;
  const strokeWidth = isLarge ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentage / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        {/* Background ring */}
        <svg width={svgSize} height={svgSize} className="absolute inset-0 -rotate-90">
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-border-primary/30"
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* Grade letter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${isLarge ? 'text-6xl' : 'text-3xl'} font-bold ${color}`}>
            {grade}
          </span>
          <span className={`${isLarge ? 'text-sm' : 'text-xs'} text-text-tertiary`}>
            {percentage}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className={`font-semibold ${color} ${isLarge ? 'text-lg' : 'text-sm'}`}>{label}</p>
        <p className={`text-text-tertiary ${isLarge ? 'text-sm' : 'text-xs'}`}>
          {score} of {maxScore} patterns
        </p>
      </div>
    </div>
  );
}
