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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Impact Analysis</h3>

      <div className="space-y-6">
        <MetricBar label="User Trust" value={metrics.trustScore} max={100} color="blue" />
        <MetricBar label="Task Speed" value={100 - metrics.completionTime + 100} max={100} color="green" />
        <MetricBar label="Error Prevention" value={100 - metrics.errorRate} max={100} color="purple" />
        <MetricBar label="Satisfaction" value={metrics.userSatisfaction} max={100} color="yellow" />
      </div>

      {insights.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-semibold text-gray-900 mb-3">Key Insights:</div>
          <ul className="text-sm space-y-2 text-gray-700">
            {insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
