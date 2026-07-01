import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function HabitCompletionChart({ activityData }) {
  // Generate Mon-Sun data from activity or fall back to mockup default trend
  const defaultData = [
    { name: 'Mon', percentage: 25 },
    { name: 'Tue', percentage: 55 },
    { name: 'Wed', percentage: 50 },
    { name: 'Thu', percentage: 40 },
    { name: 'Fri', percentage: 50 },
    { name: 'Sat', percentage: 65 },
    { name: 'Sun', percentage: 87 },
  ]

  // Map backend activity (last 7 entries) to days if present
  let chartData = defaultData
  if (activityData && activityData.length >= 7) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const last7 = activityData.slice(-7)
    chartData = last7.map((act) => {
      const d = new Date(act.date)
      const dayName = days[d.getDay()]
      const pct = act.totalCount > 0 ? (act.completedCount / act.totalCount) * 100 : 0
      return {
        name: dayName,
        percentage: Math.round(pct),
      }
    })
  }

  return (
    <div className="border border-zinc-800 bg-base-800 p-6 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Habit Completion Overview</h3>
        </div>
        <select className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-md outline-none">
          <option>This Week</option>
        </select>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#71717A"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#71717A' }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="#71717A"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#71717A' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 rounded-md text-[11px] text-white">
                      <span className="font-medium">{payload[0].payload.name}: </span>
                      <span className="font-mono">{payload[0].value}%</span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#ffffff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#completionGradient)"
              dot={{ r: 3, fill: '#ffffff', strokeWidth: 1, stroke: '#050505' }}
              activeDot={{ r: 5, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
