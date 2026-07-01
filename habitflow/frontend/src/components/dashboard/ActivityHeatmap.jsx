import { useMemo, useState } from 'react'
import GlassCard from '../ui/GlassCard.jsx'

function intensityColor(intensity) {
  if (intensity <= 0) return 'rgba(255,255,255,0.06)'
  if (intensity < 0.25) return 'rgba(124,92,252,0.25)'
  if (intensity < 0.5) return 'rgba(124,92,252,0.45)'
  if (intensity < 0.75) return 'rgba(124,92,252,0.7)'
  return '#7C5CFC'
}

export default function ActivityHeatmap({ data = [] }) {
  const [hovered, setHovered] = useState(null)

  // group into weeks (columns), 7 rows (days)
  const weeks = useMemo(() => {
    const result = []
    let week = []
    data.forEach((day, idx) => {
      const date = new Date(day.date)
      const dow = date.getDay()
      if (idx === 0) {
        for (let i = 0; i < dow; i++) week.push(null)
      }
      week.push(day)
      if (dow === 6) {
        result.push(week)
        week = []
      }
    })
    if (week.length) result.push(week)
    return result
  }, [data])

  return (
    <GlassCard className="animate-fadeUp">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold">Activity heatmap</h3>
          <p className="text-xs text-ink-faint">Last 30 days of habit completions</p>
        </div>
        {hovered && (
          <span className="text-xs text-ink-dim">
            {hovered.date}: <span className="font-mono">{hovered.completedCount}/{hovered.totalCount}</span>
          </span>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) =>
              day ? (
                <div
                  key={di}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  className="h-3.5 w-3.5 rounded-[3px] transition-transform hover:scale-125"
                  style={{ backgroundColor: intensityColor(day.intensity) }}
                  title={`${day.date}: ${day.completedCount}/${day.totalCount}`}
                />
              ) : (
                <div key={di} className="h-3.5 w-3.5" />
              )
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-faint">
        Less
        {[0, 0.2, 0.5, 0.75, 1].map((i) => (
          <div key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: intensityColor(i) }} />
        ))}
        More
      </div>
    </GlassCard>
  )
}
