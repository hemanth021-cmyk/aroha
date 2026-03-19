import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, Clock, ArrowRight } from 'lucide-react'

export default function RevisionAlerts() {
  const navigate = useNavigate()
  
  const alerts = useMemo(() => {
    const history = JSON.parse(localStorage.getItem('aroha_study_history') || '[]')
    const today = new Date()
    
    // Group by topic, keep latest completion
    const latestCompletions: Record<string, any> = {}
    history.forEach((h: any) => {
      const existing = latestCompletions[h.topic]
      if (!existing || new Date(h.timestamp) > new Date(existing.timestamp)) {
        latestCompletions[h.topic] = h
      }
    })

    // Filter topics studied 3+ days ago
    return Object.values(latestCompletions)
      .filter((h: any) => {
        const diffDays = Math.ceil((today.getTime() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 3 && diffDays <= 14 // Alert if studied 3-14 days ago
      })
      .slice(0, 3) // Show top 3
  }, [])

  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw size={16} className="text-[var(--color-accent)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Revision Required</h3>
      </div>
      
      {alerts.map((a: any, i) => {
        const diffDays = Math.ceil((new Date().getTime() - new Date(a.timestamp).getTime()) / (1000 * 60 * 60 * 24))
        return (
          <motion.div key={a.topic}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="surface-card p-4 flex items-center justify-between group hover:border-[var(--color-accent)]/30 transition-all cursor-pointer"
            onClick={() => navigate(`/module?topic=${encodeURIComponent(a.topic)}&subject=${encodeURIComponent(a.subject)}`)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{a.topic}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-[var(--color-muted)] uppercase">{a.subject}</span>
                <span className="text-[var(--color-border)]">·</span>
                <span className="text-[9px] text-[var(--color-orange)] flex items-center gap-1 font-medium">
                  <Clock size={10} /> {diffDays} days since last study
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-all group-hover:translate-x-1" />
          </motion.div>
        )
      })}
    </div>
  )
}
