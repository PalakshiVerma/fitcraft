import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isSupabaseConfigured } from './config/supabase'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import History from './pages/History'
import Profile from './pages/Profile'
import './styles/index.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Generator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ConfigNotice() {
  if (isSupabaseConfigured) {
    return null
  }

  return (
    <div className="bg-primary-500/10 border-b border-primary-500/20 px-4 py-3 text-center text-sm text-primary-200">
      Supabase is not configured yet. Copy <code className="text-primary-100">.env.example</code> to{' '}
      <code className="text-primary-100">.env</code> and add your project URL and anon key to enable login.
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigNotice />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
