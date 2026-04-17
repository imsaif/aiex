export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface GradeResult {
  grade: LetterGrade;
  percentage: number;
  label: string;
  color: string;
  bgColor: string;
  ringColor: string;
}

export function computeGrade(score: number, maxScore: number): GradeResult {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  if (percentage >= 90) {
    return { grade: 'A', percentage, label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', ringColor: 'stroke-emerald-500' };
  }
  if (percentage >= 75) {
    return { grade: 'B', percentage, label: 'Good', color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-50 dark:bg-teal-950/30', ringColor: 'stroke-teal-500' };
  }
  if (percentage >= 60) {
    return { grade: 'C', percentage, label: 'Fair', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/30', ringColor: 'stroke-amber-500' };
  }
  if (percentage >= 40) {
    return { grade: 'D', percentage, label: 'Needs Work', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/30', ringColor: 'stroke-orange-500' };
  }
  return { grade: 'F', percentage, label: 'Critical', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30', ringColor: 'stroke-red-500' };
}
