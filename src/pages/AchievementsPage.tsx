import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const allAchievements = [
  { id: 'first_module', name: 'First Step', desc: 'Complete your first module', icon: '🎯', xpReq: 25 },
  { id: 'streak_3', name: 'Consistent', desc: 'Maintain a 3-day streak', icon: '🔥', xpReq: 75 },
  { id: 'xp_100', name: 'Century', desc: 'Earn 100 XP', icon: '💯', xpReq: 100 },
  { id: 'streak_7', name: 'Weekly Warrior', desc: '7-day streak', icon: '⚔️', xpReq: 175 },
  { id: 'xp_200', name: 'Silver Scholar', desc: 'Reach Silver tier (200 XP)', icon: '🥈', xpReq: 200 },
  { id: 'modules_10', name: 'Dedicated', desc: 'Complete 10 modules', icon: '📚', xpReq: 250 },
  { id: 'xp_500', name: 'Gold Standard', desc: 'Reach Gold tier (500 XP)', icon: '🥇', xpReq: 500 },
  { id: 'streak_30', name: 'Monthly Master', desc: '30-day streak', icon: '👑', xpReq: 750 },
  { id: 'xp_1000', name: 'Platinum Pro', desc: 'Reach Platinum (1000 XP)', icon: '💎', xpReq: 1000 },
  { id: 'modules_50', name: 'Half Century', desc: 'Complete 50 modules', icon: '🎓', xpReq: 1250 },
  { id: 'xp_2000', name: 'Diamond Dazzle', desc: 'Reach Diamond (2000 XP)', icon: '💠', xpReq: 2000 },
  { id: 'xp_5000', name: 'Ace Academy', desc: 'Reach Ace tier (5000 XP)', icon: '🔥', xpReq: 5000 },
  { id: 'xp_8000', name: 'Conqueror', desc: 'Reach max tier (8000 XP)', icon: '⚔️', xpReq: 8000 },
]

export default function AchievementsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const xp = user?.xp || 0
  const unlocked = allAchievements.filter(a => xp >= a.xpReq).length

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)] transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-semibold text-[var(--color-text)]">Achievements</h1>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-surface2)] text-[var(--color-accent)] border border-[var(--color-border)] ml-auto">
            {unlocked}/{allAchievements.length} unlocked
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allAchievements.map((a, i) => {
            const earned = xp >= a.xpReq
            return (
              <motion.div key={a.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`surface-card p-4 flex items-center gap-4 transition-all ${earned ? '' : 'opacity-40 grayscale'}`}
              >
                <div className={`text-2xl ${earned ? 'animate-[pulse-glow_2s_infinite]' : ''}`}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--color-text)] text-sm">{a.name}</div>
                  <div className="text-xs text-[var(--color-muted)]">{a.desc}</div>
                </div>
                {earned ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[rgba(92,216,160,0.1)] text-[var(--color-green)] border border-[rgba(92,216,160,0.2)]">EARNED</span>
                ) : (
                  <span className="text-[10px] text-[var(--color-muted)]">{a.xpReq} XP</span>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
