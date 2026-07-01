import { Flame, Pencil, Trash2, Check } from 'lucide-react'
import { getCategoryMeta } from '../../constants.js'
import GlassCard from '../ui/GlassCard.jsx'

export default function HabitCard({ habit, onToggle, onEdit, onDelete, busy }) {
  const meta = getCategoryMeta(habit.category)

  return (
    <GlassCard hover className="flex flex-col gap-4 animate-fadeUp">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: `${habit.color || meta.color}22`, border: `1px solid ${habit.color || meta.color}44` }}
          >
            {habit.icon || meta.icon}
          </div>
          <div>
            <h3 className="font-semibold leading-tight">{habit.name}</h3>
            <p className="text-[11px] text-ink-faint mt-0.5">
              {meta.label}
              {habit.timeOfDay ? ` • ${habit.timeOfDay}` : ''}
              {habit.duration ? ` • ${habit.duration} min` : ''}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <button onClick={() => onEdit(habit)} className="rounded-md p-1.5 text-ink-faint hover:bg-base-700 hover:text-ink">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(habit)} className="rounded-md p-1.5 text-ink-faint hover:bg-base-700 hover:text-accent-red">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {habit.description && <p className="text-sm text-ink-dim line-clamp-2">{habit.description}</p>}

      <div className="flex items-center justify-between text-xs text-ink-faint">
        <div className="flex items-center gap-1.5">
          <Flame size={14} className="text-accent-amber animate-flame" />
          <span className="font-mono text-ink">{habit.currentStreak}</span> day streak
        </div>
        <div>
          Best: <span className="font-mono text-ink">{habit.longestStreak}</span>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${habit.completionPercentage}%`, backgroundColor: habit.color || meta.color }}
        />
      </div>
      <p className="-mt-2 text-[11px] text-ink-faint">{habit.completionPercentage}% completion (30d)</p>

      <button
        onClick={() => onToggle(habit)}
        disabled={busy}
        className={`flex items-center justify-center gap-2 rounded-md border py-2 text-xs font-medium transition-all duration-150 ${
          habit.completedToday
            ? 'border-green-500 bg-green-500/10 text-green-400'
            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
        } disabled:opacity-50`}
      >
        <Check size={14} />
        {habit.completedToday ? 'Completed today' : 'Mark as done'}
      </button>
    </GlassCard>
  )
}
