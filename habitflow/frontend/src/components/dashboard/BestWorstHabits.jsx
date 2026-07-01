import { TrendingUp, TrendingDown } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'

function HabitRow({ h }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{h.icon}</span>
        <span className="text-sm text-ink-dim">{h.name}</span>
      </div>
      <span className="font-mono text-sm font-semibold">{h.completionPercentage}%</span>
    </div>
  )
}

export default function BestWorstHabits({ best = [], worst = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <GlassCard className="animate-fadeUp">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp size={16} className="text-accent-green" />
          <h3 className="font-display text-sm font-semibold">Best performing</h3>
        </div>
        <div className="divide-y divide-base-border">
          {best.length ? best.map((h) => <HabitRow key={h.habitId} h={h} />) : <p className="py-2 text-xs text-ink-faint">No data yet</p>}
        </div>
      </GlassCard>

      <GlassCard className="animate-fadeUp">
        <div className="mb-2 flex items-center gap-2">
          <TrendingDown size={16} className="text-accent-red" />
          <h3 className="font-display text-sm font-semibold">Needs attention</h3>
        </div>
        <div className="divide-y divide-base-border">
          {worst.length ? worst.map((h) => <HabitRow key={h.habitId} h={h} />) : <p className="py-2 text-xs text-ink-faint">No data yet</p>}
        </div>
      </GlassCard>
    </div>
  )
}
