import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import CoursesPage from './pages/CoursesPage'
import ExamSetupPage from './pages/ExamSetupPage'
import DashboardPage from './pages/DashboardPage'
import ModulePage from './pages/ModulePage'
import ProfilePage from './pages/ProfilePage'
import AchievementsPage from './pages/AchievementsPage'
import BookmarksPage from './pages/BookmarksPage'
import { useState, createContext, useContext, useEffect } from 'react'

// ═══════════ AUTH CONTEXT ═══════════
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  xp: number
  level: number
  streak: number
  selectedTrack?: string
  selectedBranch?: string
  examDate?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

// ═══════════ APP ═══════════
function App() {
  const location = useLocation()

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('aroha_user')
    return stored ? JSON.parse(stored) : null
  })

  // Save last visited path for session resume
  useEffect(() => {
    if (user && !['/login', '/signup'].includes(location.pathname)) {
      localStorage.setItem('aroha_last_path', location.pathname + location.search)
    }
  }, [location.pathname, location.search, user])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('aroha_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('aroha_user')
    localStorage.removeItem('aroha_last_path')
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data }
      setUser(updated)
      localStorage.setItem('aroha_user', JSON.stringify(updated))
    }
  }

  // Determine where to redirect on root/wildcard
  const getDefaultRoute = () => {
    if (!user) return '/login'
    const lastPath = localStorage.getItem('aroha_last_path')
    if (lastPath && lastPath !== '/' && lastPath !== '/login' && lastPath !== '/signup') {
      return lastPath
    }
    return user.examDate ? '/dashboard' : '/courses'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={getDefaultRoute()} /> : <AuthPage mode="login" />} />
        <Route path="/signup" element={user ? <Navigate to={getDefaultRoute()} /> : <AuthPage mode="signup" />} />
        <Route path="/courses" element={user ? <CoursesPage /> : <Navigate to="/login" />} />
        <Route path="/setup" element={user ? <ExamSetupPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/module" element={user ? <ModulePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/achievements" element={user ? <AchievementsPage /> : <Navigate to="/login" />} />
        <Route path="/bookmarks" element={user ? <BookmarksPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
      </Routes>
    </AuthContext.Provider>
  )
}

export default App

