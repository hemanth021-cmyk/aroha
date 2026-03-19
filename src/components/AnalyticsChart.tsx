import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function AnalyticsChart() {
  const studyHistory = useMemo(() => {
    return JSON.parse(localStorage.getItem('aroha_study_history') || '[]')
  }, [])

  const last7Days = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }
    return days
  }, [])

  const data = useMemo(() => {
    return last7Days.map(date => {
      const count = studyHistory.filter((h: any) => h.timestamp.startsWith(date)).length
      return { date, count }
    })
  }, [studyHistory, last7Days])

  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Weekly Activity</h3>
        <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Last 7 Days</span>
      </div>
      
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((d, i) => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group relative">
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--color-surface2)] text-[10px] text-[var(--color-text)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[var(--color-border)] z-10">
              {d.count} modules
            </div>
            
            <div className="w-full bg-[var(--color-surface2)] rounded-t-sm relative overflow-hidden h-full">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / maxCount) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 bg-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <span className="text-[9px] text-[var(--color-muted)] uppercase">
              {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
