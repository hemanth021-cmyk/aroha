import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { motion } from 'framer-motion'
import {
  Calendar, Flame, Zap, LogOut, ChevronLeft, ChevronRight, Menu,
  CheckCircle2, Circle, BookOpen, Target, TrendingUp, ArrowRight, Users,
  User, Trophy, Bookmark, LayoutDashboard
} from 'lucide-react'
import { getTier, getNextTier, getMockLeaderboard } from '../data/tierSystem'
import AnalyticsChart from '../components/AnalyticsChart'
import DailyGoals from '../components/DailyGoals'
import RevisionAlerts from '../components/RevisionAlerts'
import Universe from '../components/Universe'
import Preloader from '../components/Preloader'
import Starmap from '../components/Starmap'
import CalendarView from '../components/CalendarView'

// ═══════════ MOCK DATA GENERATOR ═══════════

const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  'C Programming': { bg: 'rgba(176,122,245,0.12)', text: 'var(--color-violet)', border: 'rgba(176,122,245,0.3)' },
  'C++': { bg: 'rgba(91,168,245,0.12)', text: 'var(--color-blue)', border: 'rgba(91,168,245,0.3)' },
  'Data Structures': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Algorithms': { bg: 'rgba(232,184,75,0.1)', text: 'var(--color-accent)', border: 'rgba(232,184,75,0.3)' },
  'DBMS': { bg: 'rgba(240,148,77,0.1)', text: 'var(--color-orange)', border: 'rgba(240,148,77,0.3)' },
  'Operating Systems': { bg: 'rgba(242,112,109,0.1)', text: 'var(--color-red)', border: 'rgba(242,112,109,0.3)' },
  'Computer Networks': { bg: 'rgba(78,205,196,0.1)', text: 'var(--color-teal)', border: 'rgba(78,205,196,0.3)' },
  'Java': { bg: 'rgba(176,122,245,0.12)', text: 'var(--color-violet)', border: 'rgba(176,122,245,0.3)' },
  'Python': { bg: 'rgba(91,168,245,0.12)', text: 'var(--color-blue)', border: 'rgba(91,168,245,0.3)' },
  'Quantitative Aptitude': { bg: 'rgba(232,184,75,0.1)', text: 'var(--color-accent)', border: 'rgba(232,184,75,0.3)' },
  'VARC': { bg: 'rgba(176,122,245,0.12)', text: 'var(--color-violet)', border: 'rgba(176,122,245,0.3)' },
  'DILR': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Physics': { bg: 'rgba(91,168,245,0.12)', text: 'var(--color-blue)', border: 'rgba(91,168,245,0.3)' },
  'Chemistry': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Mathematics': { bg: 'rgba(232,184,75,0.1)', text: 'var(--color-accent)', border: 'rgba(232,184,75,0.3)' },
  'Biology — Botany': { bg: 'rgba(92,216,160,0.1)', text: 'var(--color-green)', border: 'rgba(92,216,160,0.3)' },
  'Biology — Zoology': { bg: 'rgba(240,148,77,0.1)', text: 'var(--color-orange)', border: 'rgba(240,148,77,0.3)' },
  'default': { bg: 'rgba(108,122,156,0.1)', text: 'var(--color-muted)', border: 'rgba(108,122,156,0.3)' },
}



interface ScheduleItem {
  id: string
  date: string
  subject: string
  topic: string
  duration: number
  completed: boolean
}

const topicsBySubject: Record<string, string[]> = {
  'C Programming': ['Variables & Data Types', 'Control Flow — if/else', 'Loops — for, while', 'Functions & Recursion', 'Arrays & Strings', 'Pointers Basics', 'Pointer Arithmetic', 'Structures & Unions', 'File I/O', 'Preprocessor Directives', 'Dynamic Memory Allocation', 'Linked List Basics'],
  'C++': ['OOP Concepts', 'Classes & Objects', 'Constructors & Destructors', 'Inheritance', 'Polymorphism', 'Virtual Functions', 'Templates', 'STL — Vectors', 'STL — Maps & Sets', 'Exception Handling', 'Operator Overloading', 'Friend Functions'],
  'Data Structures': ['Arrays & Linked Lists', 'Stacks & Queues', 'Binary Trees', 'BST Operations', 'Heap & Priority Queue', 'Hashing', 'Graph Representation', 'Graph Traversals (BFS/DFS)', 'Trie & Segment Tree', 'Disjoint Set Union'],
  'Algorithms': ['Time Complexity Analysis', 'Sorting Algorithms', 'Binary Search', 'Divide & Conquer', 'Greedy Algorithms', 'Dynamic Programming Intro', 'DP on Sequences', 'DP on Grids', 'Graph Algorithms — Shortest Path', 'Minimum Spanning Tree', 'Backtracking'],
  'DBMS': ['Relational Model', 'SQL Basics', 'SQL Joins & Subqueries', 'Normalization', 'Transactions & ACID', 'Concurrency Control', 'Indexing & B-Trees', 'ER Diagrams'],
  'Operating Systems': ['Process Management', 'CPU Scheduling', 'Threads & Concurrency', 'Deadlocks', 'Memory Management', 'Virtual Memory', 'File Systems', 'Disk Scheduling'],
  'Computer Networks': ['OSI & TCP/IP Model', 'Physical Layer', 'Data Link Layer', 'Network Layer — IP', 'Transport Layer — TCP/UDP', 'Application Layer — DNS/HTTP', 'Subnetting', 'Network Security Basics'],
  'Quantitative Aptitude': ['Number Systems', 'Percentages & Profit/Loss', 'Ratio & Proportion', 'Time, Speed & Distance', 'Time & Work', 'Algebra — Linear Equations', 'Algebra — Quadratic Equations', 'Geometry Basics', 'Mensuration', 'Permutations & Combinations', 'Probability'],
  'VARC': ['Reading Comprehension Strategy', 'Parajumbles', 'Para Summary', 'Odd Sentence Out', 'Critical Reasoning', 'Sentence Correction', 'Vocabulary Building', 'RC Practice — Literature', 'RC Practice — Science'],
  'DILR': ['Tables & Caselets', 'Bar & Line Charts', 'Pie Charts', 'Logical Puzzles — Seating', 'Logical Puzzles — Scheduling', 'Binary Logic', 'Games & Tournaments', 'Networks & Routes'],
  'Physics': ['Kinematics', 'Newton\'s Laws of Motion', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation', 'Properties of Matter', 'Thermodynamics', 'Oscillations & Waves', 'Electrostatics', 'Current Electricity', 'Magnetism', 'Optics', 'Modern Physics'],
  'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Periodic Table', 'States of Matter', 'Thermochemistry', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry — Basics', 'Organic Chemistry — Reactions', 'Coordination Chemistry', 'Electrochemistry'],
  'Mathematics': ['Sets & Relations', 'Functions', 'Limits & Continuity', 'Differentiation', 'Integration', 'Differential Equations', 'Coordinate Geometry', 'Vectors & 3D Geometry', 'Matrices & Determinants', 'Probability & Statistics', 'Trigonometry', 'Sequences & Series'],
  'Biology — Botany': ['Cell Biology', 'Plant Anatomy', 'Plant Physiology', 'Genetics', 'Ecology', 'Plant Kingdom', 'Morphology of Plants', 'Cell Division'],
  'Biology — Zoology': ['Animal Kingdom', 'Structural Organisation', 'Human Physiology — Digestion', 'Human Physiology — Circulation', 'Human Physiology — Respiration', 'Neural Control', 'Reproductive Health', 'Evolution'],
  'Legal Reasoning': ['Indian Constitution — Basics', 'Fundamental Rights', 'Legal Maxims', 'Contract Law', 'Tort Law', 'Criminal Law Basics', 'Family Law', 'Property Law'],
  'English Language': ['Reading Comprehension', 'Vocabulary in Context', 'Grammar Fundamentals', 'Sentence Correction', 'Paragraph Writing', 'Précis Writing', 'Idioms & Phrases', 'Error Spotting'],
  'General Knowledge': ['Indian Polity', 'Indian History', 'Geography', 'Economics Basics', 'Science & Tech', 'Current Affairs', 'Awards & Honours', 'International Organisations'],
  'Logical Reasoning': ['Syllogisms', 'Blood Relations', 'Coding-Decoding', 'Direction Sense', 'Seating Arrangement', 'Puzzles', 'Inequalities', 'Data Sufficiency'],
  'Verbal Ability': ['Reading Comprehension', 'Para Completion', 'Sentence Correction', 'Vocabulary', 'Analogies', 'Critical Reasoning', 'Word Usage'],
  'Design Aptitude': ['Design Thinking', 'Colour Theory', 'Visual Perception', 'Perspective Drawing', 'Product Design', 'Material Understanding', 'Design History'],
  'Creative Ability': ['Sketching Fundamentals', 'Composition', 'Colour Schemes', 'Abstract Thinking', 'Pattern Design', 'Fashion Illustration', 'Textile Design'],
  'GAT': ['English Comprehension', 'Analytical Ability', 'GK & Current Affairs', 'Quantitative Ability', 'Communication'],
  'Biology': ['Cell Biology', 'Plant Physiology', 'Animal Physiology', 'Genetics', 'Ecology', 'Evolution', 'Biotechnology', 'Human Health'],
}

function generateSchedule(
  track: string,
  examDate: string,
  _branch?: string
): ScheduleItem[] {
  const subjects = getSubjectsForTrack(track, _branch)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exam = new Date(examDate)
  const totalDays = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const schedule: ScheduleItem[] = []

  for (let day = 0; day < totalDays; day++) {
    const date = new Date(today)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]
    const dayOfWeek = date.getDay()

    // Skip Sundays for revision
    if (dayOfWeek === 0) continue

    // 2-3 topics per day
    const numTopics = day % 3 === 0 ? 3 : 2
    for (let t = 0; t < numTopics; t++) {
      const subjectIdx = (day + t) % subjects.length
      const subject = subjects[subjectIdx]
      const topics = topicsBySubject[subject] || [`${subject} — Topic ${(day * numTopics + t) % 10 + 1}`]
      const topicIdx = Math.floor((day * numTopics + t) / subjects.length) % topics.length

      schedule.push({
        id: `${dateStr}-${t}`,
        date: dateStr,
        subject,
        topic: topics[topicIdx],
        duration: 15 + (t % 2) * 5,
        completed: date < today,
      })
    }
  }

  return schedule
}

function getSubjectsForTrack(track: string, branch?: string): string[] {
  const trackSubs: Record<string, Record<string, string[]>> = {
    engineering: {
      'CSE': ['C Programming', 'C++', 'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'Java', 'Python'],
      'ECE': ['Physics', 'Mathematics', 'C Programming', 'Data Structures'],
      'default': ['C Programming', 'C++', 'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems'],
    },
    cat: { 'default': ['Quantitative Aptitude', 'VARC', 'DILR'] },
    gate: {
      'CSE': ['Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'C Programming', 'Mathematics'],
      'default': ['Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Mathematics'],
    },
    jee: { 'default': ['Physics', 'Chemistry', 'Mathematics'] },
    neet: { 'default': ['Physics', 'Chemistry', 'Biology — Botany', 'Biology — Zoology'] },
    clat: { 'default': ['Legal Reasoning', 'English Language', 'Logical Reasoning', 'General Knowledge', 'Quantitative Aptitude'] },
    cuet: { 'default': ['English Language', 'General Knowledge', 'Logical Reasoning', 'Quantitative Aptitude'] },
    nid: { 'default': ['Design Aptitude', 'General Knowledge', 'English Language'] },
    nift: { 'default': ['Creative Ability', 'GAT', 'General Knowledge'] },
    ipmat: { 'default': ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning'] },
    nda: { 'default': ['Mathematics', 'English Language', 'General Knowledge', 'Physics', 'Chemistry'] },
    iiser: { 'default': ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
    nest: { 'default': ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
  }

  const branchKey = branch?.split(' —')[0] || 'default'
  return trackSubs[track]?.[branchKey] || trackSubs[track]?.['default'] || ['Data Structures', 'Algorithms']
}

// ═══════════ DASHBOARD COMPONENT ═══════════

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'study' | 'constellation' | 'calendar' | 'leaderboard'>('study')

  const schedule = useMemo(() => {
    if (!user?.examDate || !user?.selectedTrack) return []
    return generateSchedule(user.selectedTrack, user.examDate, user.selectedBranch)
  }, [user?.examDate, user?.selectedTrack, user?.selectedBranch])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayTasks = schedule.filter(s => s.date === todayStr)
  const selectedTasks = schedule.filter(s => s.date === selectedDate)
  const completedCount = schedule.filter(s => s.completed).length
  const totalModules = schedule.length
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

  const examDate = user?.examDate ? new Date(user.examDate) : null
  const daysRemaining = examDate ? Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0

  // Tier system
  const userXP = user?.xp || 0
  const currentTier = getTier(userXP)
  const nextTierInfo = getNextTier(userXP)

  // Leaderboard
  const leaderboard = useMemo(() => {
    return getMockLeaderboard(user?.name || 'You', userXP, user?.selectedTrack || 'Engineering')
  }, [user?.name, userXP, user?.selectedTrack])





  // Calendar helpers
  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0)
  const startDay = monthStart.getDay()
  const daysInMonth = monthEnd.getDate()

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    return days
  }, [startDay, daysInMonth])

  const getDateStr = (day: number) => {
    const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    return d.toISOString().split('T')[0]
  }



  const streakMotivation = () => {
    const s = user?.streak || 0
    if (s === 0) return "Let's start your streak today! 🚀"
    if (s < 3) return `${s}-day streak — building momentum! 💪`
    if (s < 7) return `${s}-day streak — keep it going! 🔥`
    if (s < 30) return `🔥 ${s}-day warrior — unstoppable!`
    return `💎 ${s}-day legend — absolutely incredible!`
  }

  const [sidebarOpen, setSidebarOpen] = useState(true)



  return (
    <>
    <Preloader />
    <div className="flex bg-[var(--color-bg)] min-h-screen font-sans selection:bg-[var(--color-accent)] selection:text-[var(--color-bg)]">
      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-[var(--color-border)] bg-[var(--color-bg)] transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h1 className="text-2xl font-bold tracking-wider gradient-text" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}>AROHA</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-[var(--color-surface2)] text-[var(--color-muted)]">
              <ChevronLeft size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <button onClick={() => { navigate('/dashboard'); setActiveTab('study') }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'study' ? 'text-[var(--color-accent)] bg-[rgba(232,184,75,0.06)] font-semibold border border-[rgba(232,184,75,0.1)]' : 'text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[rgba(232,184,75,0.04)]'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'leaderboard' ? 'text-[var(--color-accent)] bg-[rgba(232,184,75,0.06)] font-semibold border border-[rgba(232,184,75,0.1)]' : 'text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[rgba(232,184,75,0.04)]'}`}>
              <Trophy size={18} /> Leaderboard
            </button>
            <button onClick={() => navigate('/achievements')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[rgba(232,184,75,0.04)] transition-all">
              <Zap size={18} /> Achievements
            </button>
            <button onClick={() => navigate('/bookmarks')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[rgba(232,184,75,0.04)] transition-all">
              <Bookmark size={18} /> Bookmarks
            </button>
            <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[rgba(232,184,75,0.04)] transition-all">
              <User size={18} /> Profile
            </button>
          </nav>

          {user ? (
            <div className="mt-auto pt-4 border-t border-[var(--color-border)] px-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-bg)]" style={{ backgroundColor: currentTier.color }}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--color-text)] truncate">{user.name}</div>
                  <div className="text-[10px] text-[var(--color-muted)] truncate">{user.email}</div>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(232,184,75,0.06)] text-[10px]">
                  <Zap size={10} className="text-[var(--color-accent)]" />
                  <span className="text-[var(--color-accent)] font-semibold">{userXP}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(242,112,109,0.06)] text-[10px]">
                  <Flame size={10} className="text-[var(--color-red)]" />
                  <span className="text-[var(--color-red)] font-semibold">{user?.streak || 0}</span>
                </div>
              </div>
              <button onClick={() => { logout(); navigate('/login') }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--color-muted)] hover:text-[var(--color-red)] hover:bg-[rgba(242,112,109,0.06)] transition-all">
                <LogOut size={14} /> Log out
              </button>
            </div>
          ) : (
            <button onClick={() => { navigate('/login') }} className="w-full flex justify-center p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-all">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT area ═══════════ */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-wider gradient-text" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '3px' }}>AROHA</h1>
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[var(--color-surface2)] text-[var(--color-muted)]">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">{streakMotivation()}</p>
          </motion.div>

          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] w-fit mx-auto">
            <button onClick={() => setActiveTab('study')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'study' ? 'gradient-accent text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}>
              <BookOpen size={16} /> Study
            </button>
            <button onClick={() => setActiveTab('constellation')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'constellation' ? 'gradient-accent text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}>
              <Zap size={16} /> Constellation
            </button>
            <button onClick={() => setActiveTab('calendar')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'calendar' ? 'gradient-accent text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}>
              <Calendar size={16} /> Calendar
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'gradient-accent text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}>
              <Users size={16} /> Leaderboard
            </button>
          </div>

          {activeTab === 'study' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[75vh] w-full mt-2 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_0_40px_rgba(255,199,55,0.05)]">
              {/* 3D WebGL Background Layer */}
              <Universe />

              {/* 2D Glassmorphism Overlay (HUD) */}
              <div className="absolute inset-0 z-10 pointer-events-none p-4 lg:p-8 flex flex-col justify-between">
                
                {/* Top Row: Mission Status */}
                <div className="flex justify-between items-start">
                  <div className="glass p-4 rounded-xl border-l-[3px] border-l-[var(--color-accent)] animate-fade-in-up">
                     <h2 className="text-2xl font-[Orbitron] text-[var(--color-accent)] flex items-center gap-2">
                       <Zap size={24} /> Knowledge Universe
                     </h2>
                     <p className="text-[var(--color-text)] opacity-80 mt-1 font-mono text-xs tracking-widest uppercase">
                       Orbital Sync: {progressPercent}%
                     </p>
                  </div>

                  {/* Right side stats */}
                  <div className="flex gap-4 pointer-events-auto">
                    <div className="glass p-3 lg:p-4 text-center rounded-xl min-w-[80px]">
                      <Target size={20} className="mx-auto mb-1 text-[var(--color-accent)]" />
                      <div className="text-xl font-bold text-[var(--color-accent)]">{daysRemaining}</div>
                      <div className="text-[9px] text-[var(--color-muted)] uppercase tracking-widest mt-1">Days Left</div>
                    </div>
                    <div className="glass p-3 lg:p-4 text-center rounded-xl min-w-[80px]">
                      <BookOpen size={20} className="mx-auto mb-1 text-[var(--color-blue)]" />
                      <div className="text-xl font-bold text-[var(--color-blue)]">{completedCount}</div>
                      <div className="text-[9px] text-[var(--color-muted)] uppercase tracking-widest mt-1">Modules</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Today's Quests Panel */}
                <div className="self-end pointer-events-auto w-full max-w-md glass p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm tracking-widest font-[Orbitron] text-[var(--color-accent)] flex items-center gap-2">
                       <Target size={16} /> Orbital Quests
                     </h3>
                     <span className="text-xs bg-[var(--color-surface2)] px-2 py-1 rounded text-[var(--color-muted)]">
                       {todayTasks.length} Active
                     </span>
                   </div>
                   
                   <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
                     {todayTasks.length === 0 ? (
                        <div className="p-4 text-center text-xs text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-xl">No celestial events scheduled for today.</div>
                     ) : (
                        todayTasks.map((task, i) => (
                          <div key={task.id} onClick={() => navigate(`/module?topic=${encodeURIComponent(task.topic)}&subject=${encodeURIComponent(task.subject)}`)} className="group flex items-center justify-between p-3 rounded-lg border border-[var(--color-border2)] bg-[var(--color-surface)]/50 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface2)] transition-all cursor-pointer">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{task.topic}</span>
                              <span className="text-[10px] text-[var(--color-muted)] mt-1 font-mono">{task.subject} • {task.duration}m</span>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                               <ArrowRight size={14} />
                            </div>
                          </div>
                        ))
                     )}
                   </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'constellation' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[80vh] w-full mt-2 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_0_40px_rgba(176,122,245,0.05)]">
              {/* 3D WebGL Starmap */}
              <Starmap 
                topics={(() => {
                  const subjects = getSubjectsForTrack(user?.selectedTrack || 'engineering', user?.selectedBranch);
                  const completedSet = new Set(schedule.filter(s => s.completed).map(s => s.topic));
                  const allTopics: any[] = [];
                  let counter = 0;
                  subjects.forEach(subject => {
                    const subjTopics = topicsBySubject[subject] || [`${subject} — Topic 1`];
                    subjTopics.forEach(topic => {
                      allTopics.push({
                        id: `starmap-node-${counter++}`,
                        subject,
                        topic,
                        completed: completedSet.has(topic)
                      });
                    });
                  });
                  return allTopics;
                })()} 
                onNodeClick={(subject, topic) => navigate(`/module?topic=${encodeURIComponent(topic)}&subject=${encodeURIComponent(subject)}`)} 
              />
              
              {/* HUD Instructions */}
              <div className="absolute inset-0 z-10 pointer-events-none p-4 lg:p-8 flex flex-col justify-end">
                  <div className="glass p-4 rounded-xl text-center self-center animate-fade-in-up border border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
                     <p className="text-[var(--color-accent)] font-mono text-sm uppercase tracking-widest"><Target size={14} className="inline mr-2" /> Drag to explore • Click star to study</p>
                  </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
                schedule={schedule}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarMonth={calendarMonth}
                setCalendarMonth={setCalendarMonth}
                calendarDays={calendarDays}
                getDateStr={getDateStr}
            />
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <div className="surface-card p-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Trophy className="text-[var(--color-accent)]" /> Global Rankings</h2>
                <div className="space-y-3">
                  {leaderboard.map((lb, idx) => {
                    const tier = getTier(lb.xp)
                    const isUser = lb.id === 'current-user'
                    return (
                      <div key={lb.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isUser ? 'bg-[rgba(232,184,75,0.06)] border-[var(--color-accent)]' : 'border-[var(--color-border)] bg-[var(--color-surface2)]/30'}`}>
                        <div className="w-8 text-center font-bold text-[var(--color-muted)]">{idx + 1}</div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-bg)] shrink-0" style={{ backgroundColor: tier.color }}>
                          {lb.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[var(--color-text)]">{lb.name}</span>
                            <span>{tier.icon}</span>
                          </div>
                          <div className="text-[10px] text-[var(--color-muted)]">{lb.track}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[var(--color-accent)]">{lb.xp} XP</div>
                          <div className="text-[10px] text-[var(--color-red)]">🔥 {lb.streak}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  )
}
