import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthPageProps {
  mode: 'login' | 'signup'
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!isLogin && !form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!isLogin && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))

    login({
      id: crypto.randomUUID(),
      name: form.name || form.email.split('@')[0],
      email: form.email,
      xp: 0,
      level: 1,
      streak: 0,
    })

    setLoading(false)
    navigate('/courses')
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    login({
      id: crypto.randomUUID(),
      name: 'Google User',
      email: 'user@gmail.com',
      xp: 0,
      level: 1,
      streak: 0,
    })
    setLoading(false)
    navigate('/courses')
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    navigate(isLogin ? '/signup' : '/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-[30%] -right-[15%] w-[50%] h-[50%] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--color-violet) 0%, transparent 70%)' }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(30,37,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,37,53,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-wider gradient-text mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '6px' }}>
            AROHA
          </h1>
          <p className="text-[var(--color-muted)] text-sm italic">
            Your personalised exam journey starts here
          </p>
        </div>

        {/* Card */}
        <div className="surface-card p-8 relative overflow-hidden">
          {/* Shimmer top border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-accent" />

          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface2)] text-[var(--color-text)] hover:bg-[var(--color-border)] hover:border-[var(--color-border2)] transition-all duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.11-.85 2.05-1.81 2.68v2.23h2.93c1.71-1.58 2.7-3.9 2.7-6.55z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.93-2.23c-.8.54-1.84.86-3.03.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
              <path d="M3.96 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.18.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l3-2.33z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33c.71-2.13 2.7-3.71 5.04-3.71z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-muted)] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          {/* Tabs */}
          <div className="flex mb-6 rounded-lg overflow-hidden border border-[var(--color-border)]">
            <button
              onClick={() => { if (!isLogin) switchMode() }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${isLogin ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'bg-[var(--color-surface2)] text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { if (isLogin) switchMode() }}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${!isLogin ? 'bg-[var(--color-accent)] text-[var(--color-bg)]' : 'bg-[var(--color-surface2)] text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name (signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-faint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-[var(--color-red)] mt-1">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-faint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                  />
                </div>
                {errors.email && <p className="text-xs text-[var(--color-red)] mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-12 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-faint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-[var(--color-red)] mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password (signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-faint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-[var(--color-red)] mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Forgot Password */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent2)] transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-[var(--color-bg)] gradient-accent hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Log In' : 'Create Account'
                )}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-muted)] mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={switchMode} className="text-[var(--color-accent)] hover:text-[var(--color-accent2)] transition-colors">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
