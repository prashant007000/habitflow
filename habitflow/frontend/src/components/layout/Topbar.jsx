import { useState } from 'react'
import { LogOut, ChevronDown, Menu, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate, NavLink } from 'react-router-dom'

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (user?.fullName || user?.username || 'U').slice(0, 1).toUpperCase()

  return (
    <header className="z-20 bg-base-950 px-6 py-5 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <button className="mb-1 md:hidden" onClick={() => setMobileNavOpen((v) => !v)}>
            <Menu size={20} className="text-white" />
          </button>
          {/* We only render standard title if not on the main dashboard to avoid double headers */}
          {title !== 'Dashboard' && (
            <>
              <h1 className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h1>
              {subtitle && <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all">
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-zinc-500" />
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 transition-colors hover:bg-zinc-900"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
                {initials}
              </div>
              <span className="hidden text-xs font-medium text-white sm:block">
                {user?.fullName || user?.username}
              </span>
              <ChevronDown size={12} className="text-zinc-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-44 rounded-md border border-zinc-800 bg-base-850 p-1 shadow-lg">
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                  View profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-400 hover:bg-zinc-900"
                >
                  <LogOut size={12} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="mt-3 flex flex-col gap-1 border-t border-zinc-800 pt-3 md:hidden">
          {[
            ['/', 'Dashboard'],
            ['/habits', 'Habits'],
            ['/analytics', 'Analytics'],
            ['/checkin', 'Mood Tracker'],
            ['/focus', 'Focus & DSA'],
            ['/goals', 'Goals'],
            ['/profile', 'Profile'],
            ['/settings', 'Settings'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileNavOpen(false)}
              className="rounded-md px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
