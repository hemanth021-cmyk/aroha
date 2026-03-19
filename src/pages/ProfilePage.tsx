import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, Flame, BookOpen, Calendar } from 'lucide-react'
import { getTier, tiers } from '../data/tierSystem'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const xp = user?.xp || 0
  const tier = getTier(xp)

  // Calculate mock study stats
  const completedModules = Math.floor(xp / 25)
  const totalStudyHours = Math.round(completedModules * 0.3 * 10) / 10

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)] transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-semibold text-[var(--color-text)]">Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="surface-card p-6 text-center" style={{ border: `1px solid ${tier.borderColor}`, boxShadow: `0 0 30px ${tier.glow}` }}>
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4"
            style={{ backgroundColor: tier.bgColor, border: `3px solid ${tier.borderColor}`, color: tier.color }}>
            {user?.name?.charAt(0) || '?'}
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">{user?.name}</h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-lg">{tier.icon}</span>
            <span className="font-semibold" style={{ color: tier.color }}>{tier.name}</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Zap, label: 'Total XP', value: xp, color: 'var(--color-accent)' },
            { icon: Flame, label: 'Streak', value: `${user?.streak || 0} days`, color: 'var(--color-red)' },
            { icon: BookOpen, label: 'Modules', value: completedModules, color: 'var(--color-blue)' },
            { icon: Calendar, label: 'Study Hours', value: `${totalStudyHours}h`, color: 'var(--color-green)' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="surface-card p-4 text-center">
              <s.icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tier progress */}
        <div className="surface-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Tier Progress</h3>
          <div className="space-y-3">
            {tiers.map((t, i) => {
              const isActive = tier.name === t.name
              const isPast = xp >= t.minXP
              return (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isActive ? 'bg-[var(--color-surface2)]' : ''}`}>
                  <span className={`text-lg ${isPast ? '' : 'opacity-30 grayscale'}`}>{t.icon}</span>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${isPast ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'}`} style={isPast ? { color: t.color } : {}}>{t.name}</span>
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">{t.minXP.toLocaleString()} XP</span>
                  {isActive && <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)]" style={{ color: t.color }}>CURRENT</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Study info */}
        <div className="surface-card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Study Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Exam Track</span><span className="text-[var(--color-text)] capitalize">{user?.selectedTrack || '—'}</span></div>
            {user?.selectedBranch && <div className="flex justify-between"><span className="text-[var(--color-muted)]">Branch</span><span className="text-[var(--color-text)]">{user.selectedBranch}</span></div>}
            <div className="flex justify-between"><span className="text-[var(--color-muted)]">Exam Date</span><span className="text-[var(--color-text)]">{user?.examDate ? new Date(user.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span></div>
          </div>
        </div>
      </main>
    </div>
  )
}
