import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../../constants.js'

const EMOJI_OPTIONS = ['💻', '🏋️', '📚', '🧠', '🌿', '✨', '🏃', '🧘', '✍️', '🎯', '💧', '🍎', '😴', '🎸', '🗣️']
const COLOR_OPTIONS = ['#7C5CFC', '#FF8A4C', '#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA']

const empty = { name: '', description: '', category: 'CUSTOM', icon: '✨', color: '#7C5CFC', timeOfDay: '', duration: '' }

export default function HabitFormModal({ open, initial, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) setForm(initial ? { ...empty, ...initial } : empty)
  }, [open, initial])

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="border border-zinc-800 bg-base-800 w-full max-w-md p-6 rounded-md animate-fadeUp">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-white">{initial ? 'Edit habit' : 'New habit'}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Name</label>
            <input
              className="input-field"
              placeholder="e.g. Solve 2 DSA problems"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <label className="label-text">Description (optional)</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Why does this habit matter to you?"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Time of Day (optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 06:00 AM, All Day"
                value={form.timeOfDay || ''}
                onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Duration (minutes)</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 10, 45"
                value={form.duration || ''}
                onChange={(e) => setForm({ ...form, duration: e.target.value ? parseInt(e.target.value, 10) : '' })}
              />
            </div>
          </div>

          <div>
            <label className="label-text">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    form.category === c.value
                      ? 'border-accent-violet/50 bg-accent-violet/15 text-white'
                      : 'border-base-border text-ink-dim hover:bg-base-800'
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setForm({ ...form, icon: e })}
                    className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm ${
                      form.icon === e ? 'border-accent-violet bg-accent-violet/15' : 'border-base-border hover:bg-base-800'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-text">Color</label>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className="h-8 w-8 rounded-md border-2"
                    style={{ backgroundColor: c, borderColor: form.color === c ? '#fff' : 'transparent' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving...' : initial ? 'Save changes' : 'Create habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
