import { useEffect, useState } from 'react'
import { Target, Flame, ListChecks, TrendingUp } from 'lucide-react'
import * as authApi from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    authApi.getProfile().then(setProfile)
  }, [])

  const initials = (profile?.fullName || profile?.username || 'U').slice(0, 1).toUpperCase()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="flex items-center gap-5 animate-fadeUp">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-violet text-2xl font-bold text-white shadow-glow">
          {initials}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">{profile?.fullName || profile?.username || user?.username}</h2>
          <p className="text-sm text-ink-faint">{profile?.email || user?.email}</p>
          {profile?.goal && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-accent-violet/30 bg-accent-violet/10 px-2.5 py-1 text-xs text-accent-violet">
              <Target size={12} /> Goal: {profile.goal}
            </p>
          )}
        </div>
      </GlassCard>

      {profile && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard icon={ListChecks} label="Total habits" value={profile.totalHabits} color="#7C5CFC" />
          <StatCard icon={Flame} label="Longest streak ever" value={profile.longestStreakEver} color="#FF8A4C" />
          <StatCard icon={TrendingUp} label="Overall consistency" value={`${profile.overallConsistency}%`} color="#34D399" />
        </div>
      )}

      <GlassCard className="animate-fadeUp">
        <h3 className="mb-3 font-display text-sm font-semibold">Account</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-base-border py-2">
            <span className="text-ink-faint">Username</span>
            <span>{profile?.username}</span>
          </div>
          <div className="flex justify-between border-b border-base-border py-2">
            <span className="text-ink-faint">Email</span>
            <span>{profile?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-ink-faint">Theme</span>
            <span>Dark mode (default)</span>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
