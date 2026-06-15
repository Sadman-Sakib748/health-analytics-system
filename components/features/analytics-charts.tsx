'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartDataPoint {
  name: string
  value?: number
  patients?: number
  prescriptions?: number
  activeUsers?: number
  count?: number
}

interface AnalyticsChartsProps {
  title: string
  type: 'line' | 'bar' | 'pie'
  data: ChartDataPoint[]
  dataKey?: string
  color?: string
  colors?: string[]
}

const DEFAULT_COLORS = ['#1e40af', '#0f766e', '#dc2626', '#f59e0b', '#8b5cf6']

export default function AnalyticsCharts({
  title,
  type,
  data,
  dataKey = 'value',
  color = '#1e40af',
  colors = DEFAULT_COLORS,
}: AnalyticsChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
              }}
            />
            <Legend />
            {dataKey && (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                dot={{ fill: color }}
                strokeWidth={2}
              />
            )}
          </LineChart>
        )}

        {type === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
              }}
            />
            <Legend />
            {dataKey && (
              <Bar dataKey={dataKey} fill={color} />
            )}
            {!dataKey && (
              <>
                {['patients', 'prescriptions', 'activeUsers', 'count'].map((key, idx) => (
                  data[0] && key in data[0] && (
                    <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} />
                  )
                ))}
              </>
            )}
          </BarChart>
        )}

        {type === 'pie' && (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border)`,
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
