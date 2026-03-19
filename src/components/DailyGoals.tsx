import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Check } from 'lucide-react'

export default function DailyGoals() {
  const [goal, setGoal] = useState(3)
  const [completedToday, setCompletedToday] = useState(0)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('aroha_study_history') || '[]')
    const today = new Date().toISOString().split('T')[0]
    const count = history.filter((h: any) => h.timestamp.startsWith(today)).length
    setCompletedToday(count)
    
    const savedGoal = localStorage.getItem('aroha_daily_goal')
    if (savedGoal) setGoal(parseInt(savedGoal))
  }, [])

  const progress = Math.min((completedToday / goal) * 100, 100)
  const isMet = completedToday >= goal

  const updateGoal = (newGoal: number) => {
    setGoal(newGoal)
    localStorage.setItem('aroha_daily_goal', newGoal.toString())
  }

  return (
    <div className="surface-card p-5 flex items-center gap-6">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-border)" strokeWidth="6" />
          <motion.circle 
            cx="40" cy="40" r="36" fill="none" 
            stroke={isMet ? 'var(--color-green)' : 'var(--color-accent)'} 
            strokeWidth="6" 
            strokeDasharray="226.2"
            initial={{ strokeDashoffset: 226.2 }}
            animate={{ strokeDashoffset: 226.2 - (226.2 * progress) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[var(--color-text)]">{completedToday}</span>
          <span className="text-[8px] text-[var(--color-muted)] uppercase tracking-tighter">/ {goal}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Target size={14} className="text-[var(--color-accent)]" />
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Daily Goal</h3>
        </div>
        <p className="text-xs text-[var(--color-muted)] mb-3 leading-tight">
          {isMet ? "Goal reached! You're crushing it! 🎉" : `${goal - completedToday} more modules to reach your daily target.`}
        </p>
        
        <div className="flex items-center gap-2">
          {[1, 2, 3, 5].map(g => (
            <button key={g} onClick={() => updateGoal(g)}
              className={`text-[9px] px-2 py-1 rounded transition-all border ${
                goal === g 
                ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/30' 
                : 'text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-border2)]'
              }`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      
      {isMet && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-2 rounded-full bg-[var(--color-green)]/10 border border-[var(--color-green)]/30">
          <Check size={16} className="text-[var(--color-green)]" />
        </motion.div>
      )}
    </div>
  )
}
