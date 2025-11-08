'use client'

import { calculateMetrics, getInsights } from '@/lib/simulator/metrics'
import type { PatternState } from '@/types/simulator'

interface MetricBarProps {
  label: string
  value: number
  max: number
  color: 'blue' | 'green' | 'purple' | 'yellow'
}

function MetricBar({ label, value, max, color }: MetricBarProps) {
  const percentage = (value / max) * 100

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-900">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface ImpactMetricsProps {
  patterns: PatternState
}

export function ImpactMetrics({ patterns }: ImpactMetricsProps) {
  const metrics = calculateMetrics(patterns)
  const insights = getInsights(metrics)

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 text-gray-900">Impact Metrics</h3>

      <div className="space-y-3">
        <MetricBar label="User Trust" value={metrics.trustScore} max={100} color="blue" />
        <MetricBar label="Task Speed" value={100 - metrics.completionTime + 100} max={100} color="green" />
        <MetricBar label="Error Prevention" value={100 - metrics.errorRate} max={100} color="purple" />
        <MetricBar label="Satisfaction" value={metrics.userSatisfaction} max={100} color="yellow" />
      </div>

      {insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs font-semibold text-gray-900 mb-2">Insights:</div>
          <ul className="text-xs space-y-1 text-gray-600">
            {insights.slice(0, 2).map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
