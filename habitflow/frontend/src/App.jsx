import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Habits from './pages/Habits.jsx'
import CheckIn from './pages/CheckIn.jsx'
import Profile from './pages/Profile.jsx'
import GoalsPage from './pages/GoalsPage.jsx'
import Focus from './pages/Focus.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/focus" element={<Focus />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
