export default function MetricSlider({ label, value, onChange, color = '#7C5CFC', icon }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-ink-dim">
          {icon} {label}
        </span>
        <span className="font-mono text-sm font-semibold" style={{ color }}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--slider-color)]"
        style={{ '--slider-color': color, accentColor: color }}
      />
    </div>
  )
}
