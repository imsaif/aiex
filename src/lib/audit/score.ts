/**
 * Clamp an audit score into the valid [0, maxScore] range.
 *
 * The analysis model occasionally returns a score above its own maxScore (we saw
 * a 157% in the sample data), which reads as broken and erodes trust. The score
 * comes straight from the model with no guardrail; this is the guardrail.
 */
export function clampScore(score: number, maxScore: number): number {
  const max = Number.isFinite(maxScore) && maxScore > 0 ? maxScore : 0;
  if (!Number.isFinite(score) || score < 0) return 0;
  return Math.min(score, max);
}
