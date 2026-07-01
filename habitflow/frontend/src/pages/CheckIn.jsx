import { useEffect, useState } from 'react'
import { Check, BookOpen } from 'lucide-react'
import * as checkinApi from '../api/checkin.js'
import MoodSelector from '../components/checkin/MoodSelector.jsx'
import MetricSlider from '../components/checkin/MetricSlider.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'

export default function CheckIn() {
  const [form, setForm] = useState({
    mood: 'GOOD',
    productivityScore: 5,
    energyLevel: 5,
    stressLevel: 5,
    journal: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    checkinApi
      .getTodayCheckIn()
      .then((existing) => {
        if (existing) {
          setForm({
            mood: existing.mood,
            productivityScore: existing.productivityScore ?? 5,
            energyLevel: existing.energyLevel ?? 5,
            stressLevel: existing.stressLevel ?? 5,
            journal: existing.journal || '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await checkinApi.upsertCheckIn(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-violet border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <GlassCard className="animate-fadeUp">
        <h3 className="mb-1 font-display text-sm font-semibold">How was your day?</h3>
        <p className="mb-4 text-xs text-ink-faint">Pick the mood that best matches today</p>
        <MoodSelector value={form.mood} onChange={(mood) => setForm({ ...form, mood })} />
      </GlassCard>

      <GlassCard className="space-y-6 animate-fadeUp">
        <h3 className="font-display text-sm font-semibold">Daily metrics</h3>
        <MetricSlider
          label="Productivity score"
          icon="⚡"
          color="#7C5CFC"
          value={form.productivityScore}
          onChange={(v) => setForm({ ...form, productivityScore: v })}
        />
        <MetricSlider
          label="Energy level"
          icon="🔋"
          color="#34D399"
          value={form.energyLevel}
          onChange={(v) => setForm({ ...form, energyLevel: v })}
        />
        <MetricSlider
          label="Stress level"
          icon="😮‍💨"
          color="#F87171"
          value={form.stressLevel}
          onChange={(v) => setForm({ ...form, stressLevel: v })}
        />
      </GlassCard>

      <GlassCard className="animate-fadeUp">
        <h3 className="mb-1 flex items-center gap-2 font-display text-sm font-semibold">
          <BookOpen size={15} /> Journal
        </h3>
        <p className="mb-3 text-xs text-ink-faint">Write a quick reflection — what happened, what you learned</p>
        <textarea
          rows={6}
          className="input-field resize-none"
          placeholder="Today I..."
          value={form.journal}
          onChange={(e) => setForm({ ...form, journal: e.target.value })}
        />
      </GlassCard>

      <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full">
        <Check size={16} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save check-in'}
      </button>
    </div>
  )
}
