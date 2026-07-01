import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  ListChecks,
  Smile,
  User,
  Flame,
  BarChart3,
  BookOpen,
  Calendar,
  Target,
  Settings,
  Timer,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDashboard } from '../../api/dashboard.js'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/checkin', label: 'Mood Tracker', icon: Smile },
  { to: '/focus', label: 'Focus & DSA', icon: Timer },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const FlowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
)

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    getDashboard()
      .then((data) => {
        setStreak(data.longestCurrentStreak || data.activeStreakCount || 0)
      })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-base-border bg-base-950 px-4 py-6 md:flex">
      {/* Branding */}
      <div className="mb-6 flex items-center gap-2.5 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-900 border border-zinc-800">
          <FlowIcon />
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-white">HabitFlow</span>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-zinc-900 text-white border border-zinc-800'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white border border-transparent'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Streak display */}
      <div className="mt-auto mb-4 border border-zinc-800 bg-base-950 p-4 rounded-md">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={16} className="text-orange-500" />
          <span className="font-display text-xl font-bold text-white">{streak}</span>
          <span className="text-xs text-zinc-500">Day Streak</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-tight">
          Keep going! You're doing great.
        </p>
      </div>

      {/* Log out */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-md border border-zinc-800 bg-base-950 px-3 py-2 text-left text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
      >
        <LogOut size={16} /> Log out
      </button>
    </aside>
  )
}
