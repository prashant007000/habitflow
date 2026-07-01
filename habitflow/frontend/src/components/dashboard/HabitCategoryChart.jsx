import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function HabitCategoryChart({ habits }) {
  // Map categories dynamically from habits list
  const defaultData = [
    { name: 'Health', value: 3, percent: '37%' },
    { name: 'Productivity', value: 2, percent: '25%' },
    { name: 'Learning', value: 2, percent: '25%' },
    { name: 'Mindfulness', value: 1, percent: '13%' },
  ]

  let chartData = []
  let total = 0

  if (habits && habits.length > 0) {
    const counts = {}
    habits.forEach(h => {
      const cat = h.category || 'CUSTOM'
      const label = cat.charAt(0) + cat.slice(1).toLowerCase()
      counts[label] = (counts[label] || 0) + 1
    })

    total = habits.length
    chartData = Object.keys(counts).map(key => {
      const val = counts[key]
      const pct = Math.round((val / total) * 100)
      return {
        name: key,
        value: val,
        percent: `${pct}%`
      }
    })
  } else {
    chartData = defaultData
    total = 8
  }

  // Pure zinc grayscale shades
  const COLORS = ['#FFFFFF', '#A1A1AA', '#71717A', '#3F3F46', '#27272A', '#18181B']

  return (
    <div className="border border-zinc-800 bg-base-800 p-6 rounded-md space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Habits by Category</h3>

      <div className="flex items-center gap-4 h-[180px]">
        {/* Donut Chart with total count in center */}
        <div className="relative w-1/2 h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white font-display">{total}</span>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-1/2 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-zinc-400">{item.name}</span>
              </div>
              <span className="text-white font-mono text-[11px]">
                {item.value} <span className="text-zinc-500">({item.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
