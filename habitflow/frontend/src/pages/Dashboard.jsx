import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Flame,
  TrendingUp,
  Target,
  Sparkles,
  RefreshCw,
  Award,
  Timer,
  ChevronRight,
  BookOpen,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard.js'
import { getHabits, toggleHabit } from '../api/habits.js'
import { upsertCheckIn } from '../api/checkin.js'
import { getWeeklySummary } from '../api/ai.js'
import { useAuth } from '../context/AuthContext.jsx'
import { MOODS } from '../constants.js'
import HabitCompletionChart from '../components/dashboard/HabitCompletionChart.jsx'
import HabitCategoryChart from '../components/dashboard/HabitCategoryChart.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  
  // AI Weekly Summary State
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  // Inline Mood Check-in State
  const [selectedMood, setSelectedMood] = useState('GOOD')
  const [journalNote, setJournalNote] = useState('')
  const [savingMood, setSavingMood] = useState(false)
  const [moodSaved, setMoodSaved] = useState(false)

  const loadData = async () => {
    try {
      const dashData = await getDashboard()
      setData(dashData)

      const habitsList = await getHabits()
      setHabits(habitsList)

      if (dashData.todayCheckIn) {
        setSelectedMood(dashData.todayCheckIn.mood || 'GOOD')
        setJournalNote(dashData.todayCheckIn.journal || '')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggle = async (habitId) => {
    try {
      await toggleHabit(habitId)
      // Reload stats and scores on toggle
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveMood = async (e) => {
    e.preventDefault()
    setSavingMood(true)
    setMoodSaved(false)
    try {
      await upsertCheckIn({
        mood: selectedMood,
        journal: journalNote,
        productivityScore: data?.todayCheckIn?.productivityScore || 7,
        energyLevel: data?.todayCheckIn?.energyLevel || 7,
        stressLevel: data?.todayCheckIn?.stressLevel || 3,
        sleepHours: data?.todayCheckIn?.sleepHours || 8.0
      })
      setMoodSaved(true)
      setTimeout(() => setMoodSaved(false), 2000)
      // Reload stats to update dynamic scores
      loadData()
    } catch (err) {
      console.error(err)
    } finally {
      setSavingMood(false)
    }
  }

  const handleLoadSummary = async () => {
    setSummaryLoading(true)
    try {
      const res = await getWeeklySummary()
      setSummary(res)
    } catch (err) {
      console.error(err)
    } finally {
      setSummaryLoading(false)
    }
  }

  const getGreeting = () => {
    const hr = new Date().getHours()
    if (hr < 12) return 'Good Morning'
    if (hr < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    )
  }

  const activeHabits = habits.filter(h => h.active)
  const completedTodayCount = activeHabits.filter(h => h.completedToday).length
  const totalHabitsCount = activeHabits.length
  const progressPercent = totalHabitsCount > 0 ? (completedTodayCount / totalHabitsCount) * 100 : 0

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border border-zinc-800 bg-base-800 p-6 rounded-md gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            {getGreeting()}, {user?.fullName || user?.username || 'Prashant'} 👋
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Let's build better habits, one day at a time.</p>
        </div>

        {/* Level and XP tracking card */}
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-md min-w-[200px]">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-850 border border-zinc-800 text-white font-bold text-sm shrink-0">
            Lvl {data?.userLevel || 1}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-semibold text-zinc-400">
              <span>Experience</span>
              <span className="font-mono text-white">{data?.userXp || 0} / {(data?.userLevel || 1) * 100} XP</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${Math.min(100, ((data?.userXp || 0) / ((data?.userLevel || 1) * 100)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Metric Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-800 bg-base-800 p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-semibold">Daily Score</span>
            <Award size={14} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{data?.dailyScore || 0}</div>
          <p className="text-[9px] text-zinc-500">Out of 100 today</p>
        </div>

        <div className="border border-zinc-800 bg-base-800 p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-semibold">Momentum Score</span>
            <TrendingUp size={14} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{data?.momentumScore || 0}</div>
          <p className="text-[9px] text-zinc-500">Rolling consistency</p>
        </div>

        <div className="border border-zinc-800 bg-base-800 p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-semibold">Completed Today</span>
            <CheckCircle2 size={14} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {completedTodayCount} <span className="text-sm font-normal text-zinc-500">/ {totalHabitsCount}</span>
          </div>
          <p className="text-[9px] text-zinc-500">Active habits</p>
        </div>

        <div className="border border-zinc-800 bg-base-800 p-4 rounded-md space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-semibold">Current Streak</span>
            <Flame size={14} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{data?.longestCurrentStreak || 0}</div>
          <p className="text-[9px] text-zinc-500">Days in a row</p>
        </div>
      </div>

      {/* Grid for habits checklist and mood logger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Habits Progress Card */}
        <div className="border border-zinc-800 bg-base-800 p-6 rounded-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Today's Habits</h3>
              <span className="text-[11px] text-zinc-400 font-mono">
                {completedTodayCount} / {totalHabitsCount} completed
              </span>
            </div>
            
            {/* Simple progress bar */}
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Habits List */}
            {activeHabits.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 italic">
                No active habits today. Add some to get started!
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {activeHabits.slice(0, 6).map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-2.5 rounded border border-zinc-900 bg-zinc-900/40 hover:border-zinc-800 transition-all">
                    <div className="flex items-center gap-3">
                      {/* Interactive toggle checkbox */}
                      <button
                        onClick={() => handleToggle(habit.id)}
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                          habit.completedToday
                            ? 'border-white bg-white text-black'
                            : 'border-zinc-700 hover:border-zinc-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={12} strokeWidth={3.5} />
                      </button>
                      <div>
                        <p className={`text-xs font-medium ${habit.completedToday ? 'line-through text-zinc-500' : 'text-white'}`}>
                          {habit.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {habit.timeOfDay || 'All Day'}
                          {habit.duration ? ` • ${habit.duration} min` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
                      {habit.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Link
            to="/habits"
            className="btn-secondary w-full text-center text-xs py-2 block font-medium"
          >
            View all habits
          </Link>
        </div>

        {/* How are you feeling today? (Check-in widget) */}
        <div className="border border-zinc-800 bg-base-800 p-6 rounded-md flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">How are you feeling today?</h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Emojis selector */}
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((mood) => {
                const active = selectedMood === mood.value
                return (
                  <button
                    type="button"
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${
                      active
                        ? 'border-white bg-zinc-900 text-white font-medium'
                        : 'border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800'
                    }`}
                  >
                    <span className="text-xl mb-1">{mood.emoji}</span>
                    <span className="text-[9px] truncate w-full text-center">{mood.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Note area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Add a note (optional)</label>
              <textarea
                className="input-field h-20 resize-none text-xs"
                placeholder="How was your day?"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSaveMood}
            disabled={savingMood}
            className="btn-primary w-full text-xs py-2 font-medium"
          >
            {savingMood ? 'Saving...' : moodSaved ? 'Mood Saved!' : 'Save Mood'}
          </button>
        </div>
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HabitCompletionChart activityData={data?.last30DaysActivity} />
        <HabitCategoryChart habits={habits} />
      </div>

      {/* AI Coaching Insights Card */}
      <div className="border border-zinc-800 bg-base-800 p-6 rounded-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-white" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">AI growth coach insight</h3>
          </div>
          <button
            onClick={handleLoadSummary}
            disabled={summaryLoading}
            className="btn-ghost !p-1 text-xs flex items-center gap-1 hover:text-white"
          >
            <RefreshCw size={12} className={summaryLoading ? 'animate-spin' : ''} />
            {summary ? 'Regenerate' : 'Generate Summary'}
          </button>
        </div>

        {!summary && !summaryLoading && (
          <p className="text-xs text-zinc-500">Generate an AI-powered summary of your week's habits performance, sleep levels, and mood dynamics.</p>
        )}

        {summaryLoading && <p className="text-xs text-zinc-400 animate-pulse">AI is reading your growth metrics...</p>}

        {summary && !summaryLoading && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-300 leading-relaxed border-l-2 border-zinc-700 pl-3">{summary.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Wins</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  {summary.wins?.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Improvement Areas</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  {summary.improvementAreas?.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Coach Suggestions</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  {summary.nextWeekSuggestions?.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
