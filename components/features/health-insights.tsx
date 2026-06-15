'use client'

import { Heart, Pill, Activity, AlertCircle, TrendingUp } from 'lucide-react'

interface HealthInsight {
  id: string
  type: 'medication' | 'health' | 'warning' | 'reminder'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  date: string
}

interface HealthInsightsProps {
  insights: HealthInsight[]
}

export default function HealthInsights({ insights }: HealthInsightsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-5 h-5" />
      case 'health':
        return <Heart className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'reminder':
        return <Activity className="w-5 h-5" />
      default:
        return <TrendingUp className="w-5 h-5" />
    }
  }

  const getColors = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 border-destructive/30 text-destructive'
      case 'medium':
        return 'bg-accent/10 border-accent/30 text-accent'
      case 'low':
        return 'bg-secondary/10 border-secondary/30 text-secondary'
      default:
        return 'bg-primary/10 border-primary/30 text-primary'
    }
  }

  if (insights.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-lg border border-border">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No health insights available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`p-4 rounded-lg border ${getColors(insight.priority)}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">{getIcon(insight.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{insight.title}</h4>
              <p className="text-sm opacity-90 mt-1">{insight.description}</p>
              <p className="text-xs opacity-60 mt-2">{insight.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
