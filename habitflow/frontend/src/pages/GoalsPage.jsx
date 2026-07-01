import { useEffect, useState } from 'react'
import { Plus, Target, Check, Trash2, Calendar } from 'lucide-react'
import * as goalsApi from '../api/goals.js'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('MONTHLY')
  const [targetDate, setTargetDate] = useState('')
  const [saving, setSaving] = useState(false)

  const loadGoals = () => {
    setLoading(false)
    goalsApi.getGoals()
      .then(setGoals)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleCreateGoal = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const newGoal = await goalsApi.createGoal({
        title,
        category,
        targetDate: targetDate || null,
        progress: 0,
        completed: false
      })
      setGoals([newGoal, ...goals])
      setTitle('')
      setTargetDate('')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateProgress = async (goal, newProgress) => {
    const updated = await goalsApi.updateGoal(goal.id, {
      title: goal.title,
      category: goal.category,
      progress: parseInt(newProgress, 10),
      completed: newProgress >= 100,
      targetDate: goal.targetDate
    })
    setGoals(goals.map(g => g.id === goal.id ? updated : g))
  }

  const handleToggleComplete = async (goal) => {
    const nextCompleted = !goal.completed
    const updated = await goalsApi.updateGoal(goal.id, {
      title: goal.title,
      category: goal.category,
      progress: nextCompleted ? 100 : 0,
      completed: nextCompleted,
      targetDate: goal.targetDate
    })
    setGoals(goals.map(g => g.id === goal.id ? updated : g))
  }

  const handleDeleteGoal = async (id) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    await goalsApi.deleteGoal(id)
    setGoals(goals.filter(g => g.id !== id))
  }

  const categories = [
    { value: 'MONTHLY', label: 'Monthly Goals' },
    { value: 'SKILL', label: 'Skill Goals' },
    { value: 'LEARNING', label: 'Learning Goals' }
  ]

  return (
    <div className="space-y-6">
      {/* Create New Goal */}
      <form onSubmit={handleCreateGoal} className="border border-zinc-800 bg-base-800 p-6 rounded-md">
        <h3 className="text-sm font-medium text-white mb-4">Create New Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="label-text">Goal Title</label>
            <input
              type="text"
              placeholder="e.g. Master React hooks, Read 2 books"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label-text">Category</label>
            <select
              className="input-field bg-base-850"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full h-[38px] flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Goal
            </button>
          </div>
        </div>
      </form>

      {/* Goals Display List */}
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : goals.length === 0 ? (
        <div className="border border-zinc-800 bg-base-800 p-12 text-center rounded-md">
          <Target className="mx-auto text-zinc-600 mb-3" size={24} />
          <h4 className="text-sm font-medium text-white">No goals defined</h4>
          <p className="text-xs text-zinc-500 mt-1">Set monthly, skill, or learning goals to track your growth OS.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map(cat => {
            const catGoals = goals.filter(g => g.category === cat.value)
            return (
              <div key={cat.value} className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{cat.label}</h4>
                  <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                    {catGoals.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {catGoals.map(goal => (
                    <div key={goal.id} className="border border-zinc-800 bg-base-800 p-4 rounded-md space-y-3 group hover:border-zinc-700 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleComplete(goal)}
                            className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                              goal.completed
                                ? 'border-green-500 bg-green-500/20 text-green-400'
                                : 'border-zinc-700 hover:border-zinc-500 text-transparent'
                            }`}
                          >
                            <Check size={10} strokeWidth={3} />
                          </button>
                          <span className={`text-xs font-medium ${goal.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                            {goal.title}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Progress Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500">Progress</span>
                          <span className="text-zinc-300 font-mono">{goal.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => handleUpdateProgress(goal, e.target.value)}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>
                    </div>
                  ))}

                  {catGoals.length === 0 && (
                    <p className="text-[11px] text-zinc-600 italic">No {cat.label.toLowerCase()} added yet.</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
