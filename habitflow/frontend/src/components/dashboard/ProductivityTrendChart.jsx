import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import GlassCard from '../ui/GlassCard.jsx'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-base-border bg-base-850 px-3 py-2 text-xs shadow-glass">
      <p className="mb-1 text-ink-faint">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-mono">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function ProductivityTrendChart({ data }) {
  return (
    <GlassCard className="animate-fadeUp">
      <h3 className="mb-1 font-display text-sm font-semibold">Productivity, energy & stress</h3>
      <p className="mb-4 text-xs text-ink-faint">Daily self-reported metrics over the last 30 days</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34D399" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6980' }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#6B6980' }} tickLine={false} axisLine={false} width={24} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="productivity" name="Productivity" stroke="#7C5CFC" fill="url(#prodGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="energy" name="Energy" stroke="#34D399" fill="url(#energyGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="stress" name="Stress" stroke="#F87171" fill="url(#stressGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
