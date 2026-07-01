import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import GlassCard from '../ui/GlassCard.jsx'
import { MOODS } from '../../constants.js'

const moodLabels = { 1: '💀', 2: '😔', 3: '😐', 4: '😊', 5: '😄' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="rounded-lg border border-base-border bg-base-850 px-3 py-2 text-xs shadow-glass">
      <p className="mb-1 text-ink-faint">{label}</p>
      <p className="text-ink">{moodLabels[p.value]} {p.payload.mood}</p>
    </div>
  )
}

export default function MoodTrendChart({ data }) {
  return (
    <GlassCard className="animate-fadeUp">
      <h3 className="mb-1 font-display text-sm font-semibold">Mood trend</h3>
      <p className="mb-4 text-xs text-ink-faint">How you've felt day to day</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6980' }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => moodLabels[v]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="moodScore"
            stroke="#FF8A4C"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#FF8A4C' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
