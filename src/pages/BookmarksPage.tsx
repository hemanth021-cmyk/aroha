import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react'

interface BookmarkItem { topic: string; subject: string; savedAt: string }

export default function BookmarksPage() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('aroha_bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  const removeBookmark = (topic: string) => {
    const updated = bookmarks.filter(b => b.topic !== topic)
    setBookmarks(updated)
    localStorage.setItem('aroha_bookmarks', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)] transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-semibold text-[var(--color-text)]">Bookmarks</h1>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-surface2)] text-[var(--color-muted)] border border-[var(--color-border)] ml-auto">
            {bookmarks.length} saved
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark size={48} className="mx-auto mb-4 text-[var(--color-muted)] opacity-30" />
            <p className="text-[var(--color-text)] font-medium">No bookmarks yet</p>
            <p className="text-sm text-[var(--color-muted)] mt-1">Bookmark topics from the module viewer to access them quickly.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((b, i) => (
              <motion.div key={b.topic}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="surface-card p-4 flex items-center gap-4 cursor-pointer group hover:border-[var(--color-border2)] transition-all"
                onClick={() => navigate(`/module?topic=${encodeURIComponent(b.topic)}&subject=${encodeURIComponent(b.subject)}`)}
              >
                <Bookmark size={18} className="text-[var(--color-accent)] shrink-0" fill="currentColor" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--color-text)] text-sm group-hover:text-[var(--color-accent)] transition-colors">{b.topic}</div>
                  <div className="text-xs text-[var(--color-muted)]">{b.subject}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); removeBookmark(b.topic) }}
                  className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-red)] hover:bg-[rgba(242,112,109,0.08)] transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
