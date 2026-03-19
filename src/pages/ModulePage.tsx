import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../App'
import { getTopicContent } from '../data/topicContent'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2, Clock, BookOpen, Play, ExternalLink,
  Lightbulb, AlertTriangle, Zap, ChevronDown, ChevronUp, Bookmark, StickyNote
} from 'lucide-react'
import QuizModal from '../components/QuizModal'

const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  'C Programming': { bg: 'rgba(176,122,245,0.12)', text: 'var(--color-violet)', border: 'rgba(176,122,245,0.3)' },
  'C++': { bg: 'rgba(91,168,245,0.12)', text: 'var(--color-blue)', border: 'rgba(91,168,245,0.3)' },
  'Data Structures': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Algorithms': { bg: 'rgba(232,184,75,0.1)', text: 'var(--color-accent)', border: 'rgba(232,184,75,0.3)' },
  'DBMS': { bg: 'rgba(240,148,77,0.1)', text: 'var(--color-orange)', border: 'rgba(240,148,77,0.3)' },
  'Operating Systems': { bg: 'rgba(242,112,109,0.1)', text: 'var(--color-red)', border: 'rgba(242,112,109,0.3)' },
  'Computer Networks': { bg: 'rgba(78,205,196,0.1)', text: 'var(--color-teal)', border: 'rgba(78,205,196,0.3)' },
  'Quantitative Aptitude': { bg: 'rgba(232,184,75,0.1)', text: 'var(--color-accent)', border: 'rgba(232,184,75,0.3)' },
  'VARC': { bg: 'rgba(176,122,245,0.12)', text: 'var(--color-violet)', border: 'rgba(176,122,245,0.3)' },
  'DILR': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Physics': { bg: 'rgba(91,168,245,0.12)', text: 'var(--color-blue)', border: 'rgba(91,168,245,0.3)' },
  'Chemistry': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Mathematics': { bg: 'rgba(232,184,75,0.1)', text: 'var(--color-accent)', border: 'rgba(232,184,75,0.3)' },
  'default': { bg: 'rgba(108,122,156,0.1)', text: 'var(--color-muted)', border: 'rgba(108,122,156,0.3)' },
}

function getColor(subject: string) {
  return subjectColors[subject] || subjectColors['default']
}

export default function ModulePage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [searchParams] = useSearchParams()
  const topic = decodeURIComponent(searchParams.get('topic') || '')
  const subject = decodeURIComponent(searchParams.get('subject') || '')
  const [completed, setCompleted] = useState(false)
  const [showMistakes, setShowMistakes] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [notes, setNotes] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)

  const content = getTopicContent(topic, subject)
  const color = getColor(content.subject)

  // Load bookmark and notes from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('aroha_bookmarks') || '[]')
    setIsBookmarked(bookmarks.some((b: { topic: string }) => b.topic === topic))
    const savedNotes = localStorage.getItem(`aroha_notes_${topic}`)
    if (savedNotes) setNotes(savedNotes)
  }, [topic])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('aroha_bookmarks') || '[]')
    if (isBookmarked) {
      const updated = bookmarks.filter((b: { topic: string }) => b.topic !== topic)
      localStorage.setItem('aroha_bookmarks', JSON.stringify(updated))
    } else {
      bookmarks.push({ topic, subject, savedAt: new Date().toISOString() })
      localStorage.setItem('aroha_bookmarks', JSON.stringify(bookmarks))
    }
    setIsBookmarked(!isBookmarked)
  }

  const saveNotes = (value: string) => {
    setNotes(value)
    localStorage.setItem(`aroha_notes_${topic}`, value)
  }

  const handleComplete = () => {
    setCompleted(true)
    if (user) {
      const newXP = (user.xp || 0) + 25
      updateUser({
        xp: newXP,
        streak: (user.streak || 0) + 1,
      })

      // Save to study history
      const history = JSON.parse(localStorage.getItem('aroha_study_history') || '[]')
      history.push({
        topic,
        subject,
        xpEarned: 25,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('aroha_study_history', JSON.stringify(history))
    }
  }

  // Simple markdown-like rendering
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-[var(--color-text)] mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
      }

      // Code blocks
      if (line.startsWith('```')) {
        return null // Handled in blocks below
      }

      // Bullet points
      if (line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 ml-2 text-sm text-[var(--color-text)] leading-relaxed">
            <span className="text-[var(--color-accent)] mt-1">•</span>
            <span>{renderInline(line.slice(2))}</span>
          </div>
        )
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={i} className="flex gap-2 ml-2 text-sm text-[var(--color-text)] leading-relaxed">
            <span className="text-[var(--color-accent)] font-mono text-xs mt-0.5 min-w-[16px]">{line.match(/^\d+/)?.[0]}.</span>
            <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        )
      }

      // Empty line
      if (!line.trim()) return <div key={i} className="h-2" />

      // Regular text
      return <p key={i} className="text-sm text-[var(--color-text)] leading-relaxed">{renderInline(line)}</p>
    })
  }

  const renderInline = (text: string) => {
    // Handle inline code
    const parts = text.split(/(`[^`]+`)/)
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[var(--color-surface2)] text-[var(--color-accent)] text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        )
      }
      // Handle bold
      const boldParts = part.split(/(\*\*[^*]+\*\*)/)
      return boldParts.map((bp, j) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={`${i}-${j}`} className="font-semibold text-[var(--color-text)]">{bp.slice(2, -2)}</strong>
        }
        return <span key={`${i}-${j}`}>{bp}</span>
      })
    })
  }

  // Extract code blocks
  const renderCodeBlocks = (text: string) => {
    const blocks: { lang: string; code: string }[] = []
    const regex = /```(\w+)?\n([\s\S]*?)```/g
    let match
    while ((match = regex.exec(text)) !== null) {
      blocks.push({ lang: match[1] || '', code: match[2].trim() })
    }
    return blocks
  }

  const codeBlocks = renderCodeBlocks(content.explanation)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)] transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-[var(--color-text)] truncate">
              {content.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                {content.subject}
              </span>
              <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                <Clock size={12} /> {content.duration} min
              </span>
            </div>
          </div>
          {!completed ? (
            <button
              onClick={() => setShowQuiz(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-bg)] gradient-accent hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(232,184,75,0.4)]"
            >
              <Zap size={16} />
              Take Quiz
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(92,216,160,0.1)] border border-[rgba(92,216,160,0.2)]">
              <CheckCircle2 size={16} className="text-[var(--color-green)]" />
              <span className="text-sm font-medium text-[var(--color-green)]">+25 XP</span>
            </div>
          )}
          <button onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-all ${isBookmarked ? 'text-[var(--color-accent)] bg-[rgba(232,184,75,0.1)]' : 'text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface2)]'}`}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Completion banner */}
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="p-4 rounded-xl bg-[rgba(92,216,160,0.08)] border border-[rgba(92,216,160,0.2)] flex items-center gap-3"
          >
            <div className="text-2xl">🎉</div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-green)]">Module Completed! +25 XP earned</p>
              <p className="text-xs text-[var(--color-muted)]">Great job! Keep the momentum going.</p>
            </div>
          </motion.div>
        )}

        {/* ═══ OVERVIEW ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Overview</h2>
          </div>
          <p className="text-sm text-[var(--color-text)] leading-relaxed">
            {content.overview}
          </p>
        </motion.section>

        {/* ═══ KEY POINTS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Key Points</h2>
          </div>
          <div className="space-y-2">
            {content.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0"
                  style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                  {i + 1}
                </div>
                <span className="text-[var(--color-text)] leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ EXPLANATION ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Detailed Explanation</h2>
          </div>
          <div className="space-y-1">
            {renderText(content.explanation)}
          </div>

          {/* Code blocks */}
          {codeBlocks.length > 0 && (
            <div className="mt-4 space-y-3">
              {codeBlocks.map((block, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-[var(--color-border)]">
                  {block.lang && (
                    <div className="px-3 py-1.5 bg-[var(--color-surface2)] border-b border-[var(--color-border)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider font-mono">
                      {block.lang}
                    </div>
                  )}
                  <pre className="p-4 bg-[#080b12] overflow-x-auto">
                    <code className="text-xs font-mono text-[var(--color-text)] leading-relaxed whitespace-pre">
                      {block.code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Formula */}
          {content.formula && (
            <div className="mt-4 p-3 rounded-lg bg-[rgba(232,184,75,0.06)] border border-[rgba(232,184,75,0.15)]">
              <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-1">Key Formulas</div>
              <p className="text-sm text-[var(--color-accent)] font-mono">{content.formula}</p>
            </div>
          )}
        </motion.section>

        {/* ═══ YOUTUBE VIDEOS ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Play size={18} className="text-[#FF0000]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Recommended Videos</h2>
          </div>
          <div className="space-y-3">
            {content.youtubeVideos.map((video, i) => (
              <a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-3 rounded-lg border border-[var(--color-border)] hover:border-[#FF0000]/30 hover:bg-[rgba(255,0,0,0.03)] transition-all"
              >
                {/* YouTube-style thumbnail placeholder */}
                <div className="w-16 h-11 rounded-md bg-[var(--color-surface2)] flex items-center justify-center shrink-0 border border-[var(--color-border)] group-hover:border-[#FF0000]/20 transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Play size={16} className="text-[#FF0000] group-hover:scale-110 transition-transform" fill="#FF0000" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[#FF6666] transition-colors truncate">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--color-muted)]">{video.channel}</span>
                    <span className="text-[var(--color-border)]">·</span>
                    <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                      <Clock size={10} /> {video.duration}
                    </span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-[var(--color-muted)] group-hover:text-[#FF6666] transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </motion.section>

        {/* ═══ COMMON MISTAKES ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="surface-card overflow-hidden"
        >
          <button
            onClick={() => setShowMistakes(!showMistakes)}
            className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-surface2)]/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-[var(--color-orange)]" />
              <h2 className="text-base font-semibold text-[var(--color-text)]">Common Mistakes to Avoid</h2>
            </div>
            {showMistakes ? <ChevronUp size={18} className="text-[var(--color-muted)]" /> : <ChevronDown size={18} className="text-[var(--color-muted)]" />}
          </button>
          {showMistakes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-5 space-y-2"
            >
              {content.commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-[var(--color-red)] mt-0.5 shrink-0">✗</span>
                  <span className="text-[var(--color-text)] leading-relaxed">{mistake}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* ═══ PRACTICE QUESTIONS ═══ */}
        {content.practiceQuestions && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="surface-card overflow-hidden"
          >
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-surface2)]/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[var(--color-blue)]" />
                <h2 className="text-base font-semibold text-[var(--color-text)]">Practice Questions</h2>
              </div>
              {showQuestions ? <ChevronUp size={18} className="text-[var(--color-muted)]" /> : <ChevronDown size={18} className="text-[var(--color-muted)]" />}
            </button>
            {showQuestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-5 space-y-2"
              >
                {content.practiceQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-[rgba(91,168,245,0.1)] border border-[rgba(91,168,245,0.2)] flex items-center justify-center text-[10px] font-bold text-[var(--color-blue)] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[var(--color-text)] leading-relaxed">{q}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}

        {/* ═══ QUICK NOTES ═══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <StickyNote size={18} className="text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Quick Notes</h2>
            {notes && <span className="text-[10px] text-[var(--color-green)] ml-auto">Saved</span>}
          </div>
          <textarea
            value={notes}
            onChange={e => saveNotes(e.target.value)}
            placeholder="Jot down key takeaways, formulas, or anything you want to remember..."
            className="w-full h-32 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
          />
        </motion.section>

        {/* ═══ BACK TO DASHBOARD ═══ */}
        <div className="flex gap-3 pt-4 pb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 px-4 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border2)] transition-all text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
          {!completed && (
            <button
              onClick={() => setShowQuiz(true)}
              className="flex-1 py-3 px-4 rounded-lg text-sm font-semibold text-[var(--color-bg)] gradient-accent hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,184,75,0.3)]"
            >
              <Zap size={16} />
              Take Quiz to Earn 25 XP
            </button>
          )}
        </div>
      </main>

      {/* ═══ QUIZ MODAL ═══ */}
      {showQuiz && (
        <QuizModal 
          topic={topic} 
          subject={content.subject} 
          onClose={() => setShowQuiz(false)}
          onSuccess={() => {
            setShowQuiz(false);
            handleComplete();
          }}
        />
      )}
    </div>
  )
}
