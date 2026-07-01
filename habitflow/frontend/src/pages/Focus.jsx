import { useEffect, useState, useRef } from 'react'
import { Timer as TimerIcon, Play, Pause, RotateCcw, BookOpen, Check, Award } from 'lucide-react'
import * as focusApi from '../api/focus.js'

export default function Focus() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Timer State
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timerType, setTimerType] = useState('POMODORO')
  
  // Log Form State
  const [logType, setLogType] = useState('FOCUS')
  const [duration, setDuration] = useState(25)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const intervalRef = useRef(null)

  const loadSessions = () => {
    focusApi.getFocusSessions()
      .then(setSessions)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSessions()
    return () => clearInterval(intervalRef.current)
  }, [])

  // Timer Tick Logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer Finished
            clearInterval(intervalRef.current)
            setIsActive(false)
            handleTimerComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        }
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, minutes, seconds])

  const handleStartPause = () => {
    setIsActive(!isActive)
  }

  const handleReset = () => {
    setIsActive(false)
    setMinutes(timerType === 'POMODORO' ? 25 : 5)
    setSeconds(0)
  }

  const handleSetTimerType = (type) => {
    setIsActive(false)
    setTimerType(type)
    setMinutes(type === 'POMODORO' ? 25 : 5)
    setSeconds(0)
  }

  const handleTimerComplete = async () => {
    alert('Focus session completed! Great job. Logging session and awarding XP...')
    try {
      const logged = await focusApi.createFocusSession({
        type: timerType,
        durationMinutes: timerType === 'POMODORO' ? 25 : 5,
        notes: `Completed Pomodoro Timer Session (${timerType})`
      })
      setSessions([logged, ...sessions])
      // Trigger profile reload or alert updates if necessary
    } catch (err) {
      console.error(err)
    }
  }

  const handleManualLog = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const logged = await focusApi.createFocusSession({
        type: logType,
        durationMinutes: parseInt(duration, 10),
        notes
      })
      setSessions([logged, ...sessions])
      setNotes('')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Pomodoro Timer Card */}
      <div className="lg:col-span-2 border border-zinc-800 bg-base-800 p-8 rounded-md flex flex-col items-center justify-center text-center space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => handleSetTimerType('POMODORO')}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              timerType === 'POMODORO'
                ? 'border-white bg-white text-black font-medium'
                : 'border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Pomodoro Focus (25m)
          </button>
          <button
            onClick={() => handleSetTimerType('FOCUS')}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              timerType === 'FOCUS'
                ? 'border-white bg-white text-black font-medium'
                : 'border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
        </div>

        {/* Timer Face */}
        <div className="font-mono text-7xl font-bold tracking-tight text-white py-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Timer Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleStartPause}
            className="btn-primary flex items-center gap-1.5 !px-5"
          >
            {isActive ? <Pause size={15} /> : <Play size={15} />}
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary !p-2"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Manual Focus Logger */}
      <div className="border border-zinc-800 bg-base-800 p-6 rounded-md space-y-4">
        <h3 className="text-sm font-medium text-white">Log Focus Session</h3>
        
        <form onSubmit={handleManualLog} className="space-y-4">
          <div>
            <label className="label-text">Focus Type</label>
            <select
              className="input-field bg-base-850"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
            >
              <option value="FOCUS">General Focus</option>
              <option value="POMODORO">Pomodoro Session</option>
              <option value="DSA">DSA Practice</option>
              <option value="LEARNING">New Skill / Learning</option>
            </select>
          </div>

          <div>
            <label className="label-text">Duration (minutes)</label>
            <input
              type="number"
              className="input-field"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="480"
              required
            />
          </div>

          <div>
            <label className="label-text">Notes / Focus Objective</label>
            <textarea
              className="input-field h-20 resize-none"
              placeholder="e.g. Solved 3 Array questions on Leetcode, read chapters 3-4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-1.5"
          >
            <Check size={14} /> Log Focus Session
          </button>
        </form>
      </div>

      {/* Focus History Grid */}
      <div className="lg:col-span-3 border border-zinc-800 bg-base-800 p-6 rounded-md space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <TimerIcon size={16} className="text-zinc-400" />
          <h3 className="text-sm font-medium text-white">Focus & Growth Log</h3>
        </div>

        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No focus sessions logged yet. Fire up the timer above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase font-semibold text-zinc-500">
                  <th className="py-2">Type</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Notes</th>
                  <th className="py-2">XP Gained</th>
                  <th className="py-2 text-right">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs">
                {sessions.map((session) => (
                  <tr key={session.id} className="text-zinc-300 hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 font-medium text-white">{session.type}</td>
                    <td className="py-2.5 text-zinc-400">{session.durationMinutes} mins</td>
                    <td className="py-2.5 max-w-xs truncate text-zinc-400" title={session.notes}>
                      {session.notes || '-'}
                    </td>
                    <td className="py-2.5 text-green-400 font-mono">+{session.durationMinutes * 2} XP</td>
                    <td className="py-2.5 text-right text-zinc-500">
                      {new Date(session.completedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
