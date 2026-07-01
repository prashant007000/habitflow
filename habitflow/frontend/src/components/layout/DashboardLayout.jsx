import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const titles = {
  '/': { title: 'Dashboard', subtitle: 'Momentum, habits, and focus metrics' },
  '/habits': { title: 'Habits', subtitle: 'Manage and toggle your daily routines' },
  '/analytics': { title: 'Analytics', subtitle: 'Comprehensive performance and growth analytics' },
  '/checkin': { title: 'Mood Tracker', subtitle: 'Log mood, metrics, and reflect on your day' },
  '/focus': { title: 'Focus & DSA', subtitle: 'Track study sessions and DSA problem progress' },
  '/goals': { title: 'Goals', subtitle: 'Manage skill, monthly, and learning goals' },
  '/profile': { title: 'Profile', subtitle: 'User progress and stats overview' },
  '/settings': { title: 'Settings', subtitle: 'Personal Growth OS settings' },
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const meta = titles[pathname] || { title: 'HabitFlow' }

  return (
    <div className="flex min-h-screen bg-base-950 text-white">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 px-6 pb-12 pt-1 md:px-8 md:pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
