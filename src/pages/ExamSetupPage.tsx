import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft, ChevronRight, Loader2, AlertTriangle, Clock } from 'lucide-react'

const trackNames: Record<string, string> = {
  engineering: 'Engineering',
  cat: 'CAT 2026',
  gate: 'GATE',
  jee: 'JEE Mains',
  neet: 'NEET',
}

const trackBranches: Record<string, string[]> = {
  engineering: ['CSE — Computer Science', 'ECE — Electronics & Communication', 'EEE — Electrical Engineering', 'ME — Mechanical Engineering', 'CE — Civil Engineering'],
  gate: ['CSE — Computer Science', 'ECE — Electronics & Communication', 'EEE — Electrical Engineering', 'ME — Mechanical Engineering', 'CE — Civil Engineering'],
}

const trackSubjects: Record<string, Record<string, string[]>> = {
  engineering: {
    'CSE': ['C Programming', 'C++', 'Java', 'Python', 'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'Compiler Design', 'Theory of Computation', 'Software Engineering', 'Web Technologies', 'Machine Learning', 'Artificial Intelligence'],
    'ECE': ['Signals & Systems', 'Digital Electronics', 'Analog Circuits', 'Communication Systems', 'Microprocessors', 'VLSI Design', 'Control Systems', 'Electromagnetic Theory'],
    'EEE': ['Power Systems', 'Electrical Machines', 'Power Electronics', 'Circuit Theory', 'Measurements & Instrumentation', 'Control Systems'],
    'ME': ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Manufacturing', 'Machine Design', 'Heat Transfer', 'Theory of Machines'],
    'CE': ['Structural Analysis', 'Geotechnical Engineering', 'Fluid Mechanics', 'Surveying', 'Environmental Engineering', 'RCC Design'],
  },
  cat: {
    'default': ['Quantitative Aptitude', 'Verbal & Reading Comprehension', 'Data Interpretation & Logical Reasoning'],
  },
  gate: {
    'CSE': ['Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'TOC', 'Compiler Design', 'Digital Logic', 'Computer Architecture', 'Engineering Mathematics', 'General Aptitude'],
    'ECE': ['Signals & Systems', 'Digital Circuits', 'Analog Circuits', 'Communication Systems', 'Control Systems', 'Electromagnetics', 'Electronic Devices', 'Engineering Mathematics', 'General Aptitude'],
    'EEE': ['Power Systems', 'Electrical Machines', 'Power Electronics', 'Control Systems', 'Circuit Theory', 'Measurements', 'Engineering Mathematics', 'General Aptitude'],
    'ME': ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Manufacturing', 'Machine Design', 'Heat Transfer', 'Theory of Machines', 'Engineering Mathematics', 'General Aptitude'],
    'CE': ['Structural Analysis', 'Geotechnical Engineering', 'Water Resources', 'Environmental Engineering', 'Surveying', 'Transportation', 'Engineering Mathematics', 'General Aptitude'],
  },
  jee: {
    'default': ['Physics', 'Chemistry', 'Mathematics'],
  },
  neet: {
    'default': ['Physics', 'Chemistry', 'Biology — Botany', 'Biology — Zoology'],
  },
}

const studyTimeOptions = [
  { value: 30, label: '30 min/day', desc: 'Casual pace' },
  { value: 60, label: '1 hr/day', desc: 'Steady pace' },
  { value: 120, label: '2 hrs/day', desc: 'Focused pace' },
  { value: 180, label: '3 hrs/day', desc: 'Intensive' },
]

export default function ExamSetupPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const track = user?.selectedTrack || 'engineering'
  const hasBranches = !!trackBranches[track]

  const [step, setStep] = useState(1)
  const totalSteps = hasBranches ? 3 : 2
  const [selectedBranch, setSelectedBranch] = useState('')
  const [examDate, setExamDate] = useState('')
  const [studyTime, setStudyTime] = useState(60)
  const [loading, setLoading] = useState(false)

  const today = new Date()
  const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const daysRemaining = examDate
    ? Math.ceil((new Date(examDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const branchKey = selectedBranch ? selectedBranch.split(' —')[0] : 'default'
  const subjects = trackSubjects[track]?.[branchKey] || trackSubjects[track]?.['default'] || []

  const handleGenerate = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    updateUser({
      selectedBranch: selectedBranch || undefined,
      examDate,
    })
    setLoading(false)
    navigate('/dashboard')
  }

  const canProceed = () => {
    if (step === 1 && hasBranches) return !!selectedBranch
    if ((step === 1 && !hasBranches) || (step === 2 && hasBranches)) return !!examDate
    return true
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/courses')} className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)] transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">
              {trackNames[track]}
            </h1>
            <p className="text-xs text-[var(--color-muted)]">Configure your study plan</p>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--color-border)]">
              <motion.div
                className="h-full rounded-full gradient-accent"
                initial={{ width: 0 }}
                animate={{ width: step > i ? '100%' : '0%' }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-muted)]">Step {step} of {totalSteps}</p>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1 for branched tracks: Branch selection */}
          {step === 1 && hasBranches && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Select Your Branch</h2>
              <p className="text-[var(--color-muted)] mb-6">Choose your engineering branch to get the right subjects.</p>
              <div className="space-y-2">
                {trackBranches[track].map((branch) => (
                  <button
                    key={branch}
                    onClick={() => setSelectedBranch(branch)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      selectedBranch === branch
                        ? 'border-[var(--color-accent)] bg-[rgba(232,184,75,0.06)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border2)]'
                    }`}
                  >
                    <span className={`font-medium ${selectedBranch === branch ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                      {branch}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date selection step */}
          {((step === 1 && !hasBranches) || (step === 2 && hasBranches)) && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">When is Your Exam?</h2>
              <p className="text-[var(--color-muted)] mb-6">We'll plan your daily schedule backwards from this date.</p>

              <div className="surface-card p-6 mb-6">
                <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">Exam Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                  <input
                    type="date"
                    value={examDate}
                    min={minDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                  />
                </div>

                {examDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 flex items-center gap-3"
                  >
                    <div className={`flex items-center gap-2 text-sm ${daysRemaining < 30 ? 'text-[var(--color-red)]' : 'text-[var(--color-green)]'}`}>
                      {daysRemaining < 30 && <AlertTriangle size={16} />}
                      <span className="font-semibold">{daysRemaining} days</span>
                      <span className="text-[var(--color-muted)]">remaining</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Study time */}
              <div className="surface-card p-6">
                <label className="block text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">
                  <Clock size={14} className="inline mr-1.5 -mt-0.5" />
                  Daily Study Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {studyTimeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setStudyTime(opt.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        studyTime === opt.value
                          ? 'border-[var(--color-accent)] bg-[rgba(232,184,75,0.06)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-border2)]'
                      }`}
                    >
                      <div className={`text-sm font-medium ${studyTime === opt.value ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Final step: Preview & Generate */}
          {((step === 2 && !hasBranches) || (step === 3 && hasBranches)) && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Ready to Generate Your Plan</h2>
              <p className="text-[var(--color-muted)] mb-6">Here's a summary of your study configuration.</p>

              <div className="surface-card p-6 space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Exam Track</span>
                  <span className="text-sm font-medium text-[var(--color-accent)]">{trackNames[track]}</span>
                </div>
                {selectedBranch && (
                  <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                    <span className="text-sm text-[var(--color-muted)]">Branch</span>
                    <span className="text-sm font-medium text-[var(--color-text)]">{selectedBranch}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Exam Date</span>
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {new Date(examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Days Available</span>
                  <span className="text-sm font-semibold text-[var(--color-green)]">{daysRemaining} days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[var(--color-border)]">
                  <span className="text-sm text-[var(--color-muted)]">Daily Study Time</span>
                  <span className="text-sm font-medium text-[var(--color-text)]">{studyTime} min/day</span>
                </div>
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm text-[var(--color-muted)]">Subjects</span>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[280px]">
                    {subjects.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface2)] text-[var(--color-muted)] border border-[var(--color-border)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-[var(--color-bg)] gradient-accent hover:opacity-90 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating your personalised plan...
                  </>
                ) : (
                  <>
                    Generate My Study Plan
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border2)] transition-all"
            >
              Back
            </button>
          )}
          {step < totalSteps && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="ml-auto px-6 py-2.5 rounded-lg font-medium text-[var(--color-bg)] gradient-accent hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
