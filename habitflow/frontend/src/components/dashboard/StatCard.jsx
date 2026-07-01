import GlassCard from '../ui/GlassCard.jsx'

export default function StatCard({ icon: Icon, label, value, sublabel, color = '#7C5CFC' }) {
  return (
    <GlassCard hover className="flex items-center gap-4 animate-fadeUp">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1A`, border: `1px solid ${color}33` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-2xl font-bold leading-tight">{value}</p>
        <p className="truncate text-xs text-ink-faint">{label}</p>
        {sublabel && <p className="text-[11px] text-ink-faint">{sublabel}</p>}
      </div>
    </GlassCard>
  )
}
