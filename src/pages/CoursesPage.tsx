import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { motion } from 'framer-motion'
import {
  ChevronRight, GraduationCap, BarChart3, Cpu, FlaskConical, Stethoscope,
  LogOut, Scale, BookOpen, Palette, Briefcase, Shield, Atom
} from 'lucide-react'

const examTracks = [
  // ═══ Engineering & Tech ═══
  {
    id: 'engineering', name: 'Engineering', icon: Cpu, category: 'Engineering & Tech',
    color: 'var(--color-violet)', bgColor: 'rgba(176,122,245,0.1)', borderColor: 'rgba(176,122,245,0.25)',
    description: 'B.E./B.Tech semester exam preparation',
    branches: ['CSE', 'ECE', 'EEE', 'ME', 'CE'], modules: '500+',
  },
  {
    id: 'gate', name: 'GATE', icon: GraduationCap, category: 'Engineering & Tech',
    color: 'var(--color-blue)', bgColor: 'rgba(91,168,245,0.1)', borderColor: 'rgba(91,168,245,0.25)',
    description: 'M.Tech/PSU entrance — core engineering + aptitude',
    branches: ['CSE', 'ECE', 'EEE', 'ME', 'CE'], modules: '300+',
  },
  {
    id: 'jee', name: 'JEE Mains', icon: FlaskConical, category: 'Engineering & Tech',
    color: 'var(--color-green)', bgColor: 'rgba(92,216,160,0.1)', borderColor: 'rgba(92,216,160,0.25)',
    description: 'Engineering entrance — Physics, Chemistry, Maths',
    branches: null, modules: '250+',
  },
  // ═══ Medical ═══
  {
    id: 'neet', name: 'NEET', icon: Stethoscope, category: 'Medical',
    color: 'var(--color-red)', bgColor: 'rgba(242,112,109,0.1)', borderColor: 'rgba(242,112,109,0.25)',
    description: 'Medical entrance — Physics, Chemistry, Biology',
    branches: null, modules: '280+',
  },
  // ═══ Management ═══
  {
    id: 'cat', name: 'CAT 2026', icon: BarChart3, category: 'Management',
    color: 'var(--color-accent)', bgColor: 'rgba(232,184,75,0.1)', borderColor: 'rgba(232,184,75,0.25)',
    description: 'MBA entrance — QA, VARC, DILR',
    branches: null, modules: '180',
  },
  {
    id: 'ipmat', name: 'IPMAT', icon: Briefcase, category: 'Management',
    color: 'var(--color-orange)', bgColor: 'rgba(240,148,77,0.1)', borderColor: 'rgba(240,148,77,0.25)',
    description: 'IIM Indore/Rohtak — QA, Verbal, Logical Reasoning',
    branches: null, modules: '160',
  },
  // ═══ Law ═══
  {
    id: 'clat', name: 'CLAT', icon: Scale, category: 'Law',
    color: '#E8A87C', bgColor: 'rgba(232,168,124,0.1)', borderColor: 'rgba(232,168,124,0.25)',
    description: 'NLU admissions — Legal Reasoning, English, GK, QA',
    branches: null, modules: '200+',
  },
  // ═══ University Admissions ═══
  {
    id: 'cuet', name: 'CUET', icon: BookOpen, category: 'University Admissions',
    color: 'var(--color-teal)', bgColor: 'rgba(78,205,196,0.1)', borderColor: 'rgba(78,205,196,0.25)',
    description: 'Central universities — English, GK, Domain Subjects',
    branches: null, modules: '220+',
  },
  // ═══ Design ═══
  {
    id: 'nid', name: 'NID', icon: Palette, category: 'Design',
    color: '#FF69B4', bgColor: 'rgba(255,105,180,0.1)', borderColor: 'rgba(255,105,180,0.25)',
    description: 'Design aptitude — Drawing, GK, Studio Test',
    branches: null, modules: '120',
  },
  {
    id: 'nift', name: 'NIFT', icon: Palette, category: 'Design',
    color: '#DDA0DD', bgColor: 'rgba(221,160,221,0.1)', borderColor: 'rgba(221,160,221,0.25)',
    description: 'Fashion design — Creative Ability, GAT, Situation Test',
    branches: null, modules: '130',
  },
  // ═══ Defense ═══
  {
    id: 'nda', name: 'NDA', icon: Shield, category: 'Defense',
    color: '#4CAF50', bgColor: 'rgba(76,175,80,0.1)', borderColor: 'rgba(76,175,80,0.25)',
    description: 'National Defence Academy — Maths, English, GK, Science',
    branches: null, modules: '240+',
  },
  // ═══ Science Research ═══
  {
    id: 'iiser', name: 'IISER', icon: Atom, category: 'Science Research',
    color: '#00BCD4', bgColor: 'rgba(0,188,212,0.1)', borderColor: 'rgba(0,188,212,0.25)',
    description: 'IISER Aptitude Test — Physics, Chemistry, Maths, Biology',
    branches: null, modules: '200+',
  },
  {
    id: 'nest', name: 'NEST', icon: Atom, category: 'Science Research',
    color: '#9C27B0', bgColor: 'rgba(156,39,176,0.1)', borderColor: 'rgba(156,39,176,0.25)',
    description: 'NISER/CBS entrance — Physics, Chemistry, Maths, Biology',
    branches: null, modules: '190+',
  },
]

export default function CoursesPage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()

  const handleSelectTrack = (trackId: string) => {
    updateUser({ selectedTrack: trackId })
    navigate('/setup')
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider gradient-text" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '4px' }}>
            AROHA
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-muted)]">
              Hi, <span className="text-[var(--color-text)]">{user?.name}</span>
            </span>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-red)] hover:bg-[rgba(242,112,109,0.1)] transition-all"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3">
              Choose Your Exam Track
            </h2>
            <p className="text-[var(--color-muted)] max-w-lg mx-auto">
              Select the exam you're preparing for. We'll build a personalised day-by-day study schedule tailored to your timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examTracks.map((track, i) => {
              const Icon = track.icon
              return (
                <motion.button
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => handleSelectTrack(track.id)}
                  className="group relative text-left p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-current transition-all duration-300 overflow-hidden"
                  style={{ '--tw-border-opacity': 1, color: track.color } as React.CSSProperties}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at 50% 100%, ${track.bgColor}, transparent 70%)` }} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: track.bgColor, border: `1px solid ${track.borderColor}` }}>
                      <Icon size={24} style={{ color: track.color }} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1 flex items-center gap-2">
                      {track.name}
                      <ChevronRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" style={{ color: track.color }} />
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[var(--color-muted)] mb-4 leading-relaxed">
                      {track.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{ backgroundColor: track.bgColor, color: track.color, border: `1px solid ${track.borderColor}` }}>
                        {track.modules} modules
                      </span>
                      {track.branches && (
                        <span className="text-xs text-[var(--color-muted)]">
                          {track.branches.length} branches
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
