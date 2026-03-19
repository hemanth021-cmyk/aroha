import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Flame, Zap, LogOut, ChevronLeft, ChevronRight, Menu,
  CheckCircle2, Circle, BookOpen, Target, TrendingUp, ArrowRight, Users,
  User, Trophy, Bookmark, LayoutDashboard, Bot
} from 'lucide-react'
import { getTier, getNextTier, getMockLeaderboard } from '../data/tierSystem'
import AnalyticsChart from '../components/AnalyticsChart'
import DailyGoals from '../components/DailyGoals'
import RevisionAlerts from '../components/RevisionAlerts'
import Universe from '../components/Universe'
import Preloader from '../components/Preloader'
import Starmap from '../components/Starmap'
import CalendarView from '../components/CalendarView'
import PlanetBotHUD from '../components/PlanetBotHUD'

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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isBotOpen, setIsBotOpen] = useState(false)

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

  // Starmap topics
  const allTopics = useMemo(() => {
    const subjects = getSubjectsForTrack(user?.selectedTrack || 'engineering', user?.selectedBranch);
    const completedSet = new Set(schedule.filter(s => s.completed).map(s => s.topic));
    const topics: any[] = [];
    let counter = 0;
    subjects.forEach(subject => {
      const subjTopics = topicsBySubject[subject] || [`${subject} — Topic 1`];
      subjTopics.forEach(topic => {
        topics.push({
          id: `starmap-node-${counter++}`,
          subject,
          topic,
          completed: completedSet.has(topic)
        });
      });
    });
    return topics;
  }, [user?.selectedTrack, user?.selectedBranch, schedule]);


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

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 border-b border-[var(--color-border2)]/10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">{streakMotivation()}</p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] w-fit mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            {[
              { id: 'study', label: 'Study', icon: <BookOpen size={16} /> },
              { id: 'constellation', label: 'Constellation', icon: <Zap size={16} /> },
              { id: 'calendar', label: 'Calendar', icon: <Calendar size={16} /> },
              { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'gradient-accent text-[var(--color-bg)] shadow-[0_4px_12px_rgba(232,184,75,0.2)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'study' && (
              <motion.div 
                key="study-tab"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative h-[75vh] w-full mt-2 rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-sm"
              >
                {/* 3D WebGL Background Layer */}
                <Universe 
                  onPlanetClick={() => setIsBotOpen(!isBotOpen)} 
                  isBotActive={isBotOpen} 
                />

                {/* 2D Glassmorphism Overlay (HUD) */}
                <div className="absolute inset-0 z-10 pointer-events-none p-4 lg:p-8 flex flex-col justify-between">
                  {/* Top Row: Mission Status */}
                  <div className="flex justify-between items-start">
                    <div className="glass p-5 rounded-2xl border-l-[4px] border-l-[var(--color-accent)] animate-fade-in-up bg-black/20">
                      <h4 className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-widest mb-1 flex items-center gap-2">
                         <Target size={12} /> Current Mission
                      </h4>
                      <div className="text-xl font-bold font-[Orbitron] tracking-wider mb-1">KNOWLEDGE UNIVERSE</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(userXP / 5, 100)}%` }}
                            className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-orange)]"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-tighter">Sync: {Math.min(Math.floor(userXP/5), 100)}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 animate-fade-in-right">
                       <button 
                        onClick={() => setIsBotOpen(!isBotOpen)}
                        className="pointer-events-auto p-3 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] shadow-[0_0_30px_rgba(232,184,75,0.4)] hover:scale-110 transition-transform active:scale-95"
                       >
                         <Bot size={24} />
                       </button>
                    </div>
                  </div>

                  {/* Bottom Row: Quest Log */}
                  <div className="max-w-xs animate-fade-in-up">
                     <div className="flex items-center gap-2 mb-3 px-2">
                       <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                       <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Orbital Quests</span>
                       <span className="ml-auto text-[10px] font-medium text-[var(--color-muted)]">
                         {todayTasks.filter(t=>t.completed).length}/{todayTasks.length} Active
                       </span>
                     </div>
                     
                     <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 scrollbar-hide pointer-events-auto">
                       {todayTasks.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[var(--color-muted)] border border-dashed border-white/10 rounded-2xl bg-white/5">No celestial events scheduled for today.</div>
                       ) : (
                         todayTasks.map((task) => (
                           <div key={task.id} 
                             onClick={() => navigate(`/module?topic=${encodeURIComponent(task.topic)}&subject=${encodeURIComponent(task.subject)}`)}
                             className="glass p-4 rounded-2xl border border-white/5 hover:border-[var(--color-accent)]/50 transition-all cursor-pointer group/task bg-[var(--color-surface2)]/40 hover:bg-[var(--color-surface2)]/60"
                           >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${task.completed ? 'bg-[var(--color-green)]/10 border-[var(--color-green)]/30 text-[var(--color-green)]' : 'bg-white/5 border-white/10 text-[var(--color-muted)] group-hover/task:border-[var(--color-accent)]/30'}`}>
                                  {task.completed ? <CheckCircle2 size={16} /> : <Circle size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[10px] font-bold uppercase tracking-tight" style={{ color: (subjectColors[task.subject] || subjectColors.default).text }}>{task.subject}</div>
                                  <div className="text-xs font-semibold truncate group-hover/task:text-[var(--color-accent)] transition-colors">{task.topic}</div>
                                </div>
                                <ArrowRight size={14} className="text-white/20 group-hover/task:text-[var(--color-accent)] transition-all group-hover/task:translate-x-1" />
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
              <motion.div 
                key="constellation-tab"
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative h-[80vh] w-full mt-2 rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-black/40"
              >
                <Starmap
                  topics={allTopics}
                  onNodeClick={(subject, topic) => navigate(`/module?topic=${encodeURIComponent(topic)}&subject=${encodeURIComponent(subject)}`)}
                />
                <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-end">
                    <div className="glass p-4 rounded-2xl text-center self-center animate-fade-in-up border border-white/10 bg-black/60 backdrop-blur-xl">
                       <p className="text-[var(--color-accent)] font-mono text-[10px] uppercase tracking-[0.3em] font-bold"><Target size={14} className="inline mr-2" /> Drag to explore • Click star to study</p>
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div 
                key="calendar-tab"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }}
              >
                <CalendarView
                    schedule={schedule}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    calendarMonth={calendarMonth}
                    setCalendarMonth={setCalendarMonth}
                    calendarDays={calendarDays}
                    getDateStr={getDateStr}
                />
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div 
                key="leaderboard-tab"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="surface-card p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold font-[Orbitron] flex items-center gap-3 mb-8">
                    <Trophy className="text-[var(--color-accent)]" size={28} /> GLOBAL RANKINGS
                  </h2>
                  <div className="space-y-4">
                    {leaderboard.map((lb, idx) => {
                      const tier = getTier(lb.xp)
                      const isUser = lb.id === 'current-user'
                      return (
                        <div key={lb.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${isUser ? 'bg-[rgba(232,184,75,0.08)] border-[var(--color-accent)] shadow-[0_0_20px_rgba(232,184,75,0.1)]' : 'border-[var(--color-border)] bg-[var(--color-surface2)]/30 hover:border-white/20'}`}>
                          <div className="w-8 text-center font-bold text-[var(--color-muted)] text-lg">{idx + 1}</div>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-[var(--color-bg)] shrink-0 shadow-lg" style={{ backgroundColor: tier.color }}>
                            {lb.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-[var(--color-text)]">{lb.name}</span>
                              <span className="text-lg">{tier.icon}</span>
                            </div>
                            <div className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest">{lb.track}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[var(--color-accent)]">{lb.xp} XP</div>
                            <div className="text-xs font-bold text-[var(--color-red)] flex items-center justify-end gap-1">
                              <Flame size={12} /> {lb.streak}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <RevisionAlerts />
        </main>
      </div>

      <PlanetBotHUD 
        isOpen={isBotOpen} 
        onClose={() => setIsBotOpen(false)} 
        userName={user?.name} 
      />
    </div>
    </>
  )
}
