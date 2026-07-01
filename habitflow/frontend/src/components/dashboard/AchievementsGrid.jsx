import clsx from 'clsx'
import GlassCard from '../ui/GlassCard.jsx'

export default function AchievementsGrid({ achievements = [] }) {
  return (
    <GlassCard className="animate-fadeUp">
      <h3 className="mb-1 font-display text-sm font-semibold">Achievements</h3>
      <p className="mb-4 text-xs text-ink-faint">Badges you've unlocked along the way</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements.map((a) => (
          <div
            key={a.key}
            title={a.description}
            className={clsx(
              'flex flex-col items-center gap-1.5 rounded-xl2 border p-3 text-center transition-all duration-200',
              a.unlocked
                ? 'border-accent-amber/30 bg-accent-amber/10'
                : 'border-base-border bg-base-800/40 opacity-40 grayscale'
            )}
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-[11px] font-medium leading-tight text-ink-dim">{a.title}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
