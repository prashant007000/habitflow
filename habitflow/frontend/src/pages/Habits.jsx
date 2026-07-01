import { useEffect, useState } from 'react'
import { Plus, Sparkles, X } from 'lucide-react'
import * as habitsApi from '../api/habits.js'
import { getAiRecommendations } from '../api/ai.js'
import { GOALS, getCategoryMeta } from '../constants.js'
import HabitCard from '../components/habits/HabitCard.jsx'
import HabitFormModal from '../components/habits/HabitFormModal.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'

export default function Habits() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const [aiOpen, setAiOpen] = useState(false)
  const [goal, setGoal] = useState(GOALS[0])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const load = () => {
    setLoading(true)
    habitsApi
      .getHabits()
      .then(setHabits)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleToggle = async (habit) => {
    setBusyId(habit.id)
    try {
      const updated = await habitsApi.toggleHabit(habit.id)
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (habit) => {
    if (!confirm(`Archive "${habit.name}"? You can recreate it any time.`)) return
    await habitsApi.deleteHabit(habit.id)
    setHabits((prev) => prev.filter((h) => h.id !== habit.id))
  }

  const handleEdit = (habit) => {
    setEditing(habit)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleSubmit = async (form) => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await habitsApi.updateHabit(editing.id, form)
        setHabits((prev) => prev.map((h) => (h.id === editing.id ? updated : h)))
      } else {
        const created = await habitsApi.createHabit(form)
        setHabits((prev) => [created, ...prev])
      }
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleGetRecommendations = async () => {
    setAiLoading(true)
    setAiResult(null)
    try {
      const result = await getAiRecommendations(goal)
      setAiResult(result)
    } finally {
      setAiLoading(false)
    }
  }

  const handleAddSuggested = async (suggested) => {
    const meta = getCategoryMeta(suggested.category)
    const created = await habitsApi.createHabit({
      name: suggested.name,
      description: suggested.description,
      category: suggested.category || 'CUSTOM',
      icon: suggested.icon || meta.icon,
      color: meta.color,
    })
    setHabits((prev) => [created, ...prev])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-faint">{habits.length} active habit{habits.length !== 1 ? 's' : ''}</p>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className="btn-secondary">
            <Sparkles size={16} className="text-accent-violet" /> AI suggestions
          </button>
          <button onClick={handleCreate} className="btn-primary">
            <Plus size={16} /> New habit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-violet border-t-transparent" />
        </div>
      ) : habits.length === 0 ? (
        <GlassCard className="flex flex-col items-center gap-3 py-16 text-center">
          <Sparkles size={28} className="text-accent-violet" />
          <h2 className="font-display text-lg font-semibold">Create your first habit</h2>
          <p className="max-w-sm text-sm text-ink-faint">
            Track anything — coding, fitness, reading, study, health, or something custom.
          </p>
          <button onClick={handleCreate} className="btn-primary mt-2">
            <Plus size={16} /> New habit
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              busy={busyId === habit.id}
            />
          ))}
        </div>
      )}

      <HabitFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={saving}
      />

      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg p-6 animate-fadeUp max-h-[85vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Sparkles size={18} className="text-accent-violet" /> AI habit recommendations
              </h2>
              <button onClick={() => setAiOpen(false)} className="rounded-md p-1.5 text-ink-faint hover:bg-base-700 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <label className="label-text">Your goal</label>
            <div className="mb-4 flex gap-2">
              <select className="input-field" value={goal} onChange={(e) => setGoal(e.target.value)}>
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <button onClick={handleGetRecommendations} disabled={aiLoading} className="btn-primary whitespace-nowrap">
                {aiLoading ? 'Thinking…' : 'Get habits'}
              </button>
            </div>

            {aiResult && (
              <div className="space-y-4">
                <p className="rounded-lg bg-accent-violet/10 px-3 py-2.5 text-xs text-ink-dim">{aiResult.advice}</p>
                <div className="space-y-2">
                  {aiResult.suggestedHabits?.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-base-border bg-base-800/50 p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg">{s.icon}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{s.name}</p>
                          <p className="truncate text-xs text-ink-faint">{s.description}</p>
                        </div>
                      </div>
                      <button onClick={() => handleAddSuggested(s)} className="btn-secondary shrink-0 !py-1.5 !px-3 text-xs">
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
