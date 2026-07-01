import { MOODS } from '../../constants.js'

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {MOODS.map((mood) => {
        const active = value === mood.value
        return (
          <button
            type="button"
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={`flex flex-col items-center gap-2 rounded-xl2 border p-3 sm:p-4 transition-all duration-200 ${
              active ? 'scale-105' : 'hover:bg-base-800'
            }`}
            style={{
              borderColor: active ? mood.color : 'rgba(255,255,255,0.08)',
              backgroundColor: active ? `${mood.color}1A` : 'transparent',
            }}
          >
            <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
            <span className="text-[10px] font-medium text-ink-dim sm:text-xs">{mood.label}</span>
          </button>
        )
      })}
    </div>
  )
}
