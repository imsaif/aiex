import type { PatternState, Metrics } from '@/types/simulator'

export function calculateMetrics(patterns: PatternState): Metrics {
  let trustScore = 55
  let completionTime = 100
  let errorRate = 15
  let userSatisfaction = 60

  if (patterns.explainableAI) {
    trustScore += 25
    userSatisfaction += 15
  }

  if (patterns.confidenceIndicators) {
    trustScore += 20
    errorRate -= 5
  }

  if (patterns.humanInTheLoop) {
    errorRate -= 8
    completionTime += 20
    trustScore += 15
  }

  if (patterns.undoRedo) {
    userSatisfaction += 20
    errorRate -= 3
  }

  if (patterns.progressiveDisclosure) {
    userSatisfaction += 25
    completionTime -= 15
  }

  if (patterns.gracefulDegradation) {
    trustScore += 20
    errorRate -= 4
  }

  if (patterns.contextualAssistance) {
    completionTime -= 10
    userSatisfaction += 10
  }

  // Ensure values stay within bounds
  trustScore = Math.min(100, Math.max(0, trustScore))
  completionTime = Math.min(150, Math.max(50, completionTime))
  errorRate = Math.min(30, Math.max(0, errorRate))
  userSatisfaction = Math.min(100, Math.max(0, userSatisfaction))

  return {
    trustScore,
    completionTime,
    errorRate,
    userSatisfaction
  }
}

export function getInsights(metrics: Metrics): string[] {
  const insights: string[] = []

  if (metrics.trustScore > 75) {
    insights.push('✓ High user trust achieved')
  }

  if (metrics.errorRate < 5) {
    insights.push('✓ Excellent error prevention')
  }

  if (metrics.completionTime > 110) {
    insights.push('⚠ Consider automation vs control trade-off')
  }

  if (metrics.userSatisfaction > 80) {
    insights.push('✓ Users highly satisfied with experience')
  }

  if (metrics.trustScore < 60) {
    insights.push('⚠ Consider adding trust-building patterns')
  }

  return insights
}
