import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ScheduleItem {
  id: string
  date: string
  subject: string
  topic: string
  duration: number
  completed: boolean
}

interface CalendarViewProps {
  schedule: ScheduleItem[]
  selectedDate: string
  setSelectedDate: (date: string) => void
  calendarMonth: Date
  setCalendarMonth: (date: Date) => void
  calendarDays: (number | null)[]
  getDateStr: (day: number) => string
}

export default function CalendarView({
  schedule,
  selectedDate,
  setSelectedDate,
  calendarMonth,
  setCalendarMonth,
  calendarDays,
  getDateStr
}: CalendarViewProps) {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];
  
  const selectedTasks = schedule.filter(s => s.date === selectedDate);
  const todayTasks = schedule.filter(s => s.date === todayStr);

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 surface-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-[Orbitron] tracking-wider text-[var(--color-accent)]">
            {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[var(--color-surface2)] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[var(--color-surface2)] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm text-[var(--color-muted)] font-medium">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="aspect-square rounded-xl bg-[var(--color-surface2)] opacity-20" />;
            const dateStr = getDateStr(day);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;
            const dayTasks = schedule.filter(s => s.date === dateStr);
            const allCompleted = dayTasks.length > 0 && dayTasks.every(t => t.completed);
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-xl border relative flex flex-col items-center justify-center transition-all ${
                  isSelected ? 'border-[var(--color-accent)] bg-[rgba(255,199,55,0.1)] shadow-[0_0_15px_rgba(255,199,55,0.2)]' 
                  : isToday ? 'border-[var(--color-blue)] bg-[rgba(91,168,245,0.1)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface2)]'
                }`}
              >
                <span className={`text-lg font-bold ${isToday ? 'text-[var(--color-blue)]' : isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                  {day}
                </span>
                
                {/* Task Indicators */}
                {dayTasks.length > 0 && (
                  <div className="absolute bottom-2 flex gap-1">
                    {allCompleted ? (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-green)] shadow-[0_0_5px_var(--color-green)]" />
                    ) : (
                      dayTasks.map((_, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                      ))
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-6">
        <div className="surface-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="text-[var(--color-accent)]" /> 
            {selectedDate === todayStr ? "Today's Quests" : "Scheduled Quests"}
          </h3>
          
          {selectedTasks.length === 0 ? (
            <div className="text-center p-8 bg-[var(--color-surface2)] rounded-xl border border-[var(--color-border)]">
              <p className="text-[var(--color-muted)]">No quests scheduled for this cycle.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedTasks.map((task, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={task.id} 
                  onClick={() => navigate(`/module?topic=${encodeURIComponent(task.topic)}&subject=${encodeURIComponent(task.subject)}`)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                    task.completed 
                      ? 'bg-[var(--color-green)]/10 border-[var(--color-green)]/30' 
                      : 'bg-[var(--color-surface2)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">{task.subject}</span>
                    {task.completed ? (
                      <CheckCircle2 size={18} className="text-[var(--color-green)] drop-shadow-[0_0_8px_rgba(92,216,160,0.8)]" />
                    ) : (
                      <Circle size={18} className="text-[var(--color-muted)]" />
                    )}
                  </div>
                  <h4 className={`font-semibold ${task.completed ? 'text-[var(--color-text)]' : 'text-white'}`}>{task.topic}</h4>
                  <div className="mt-2 text-xs text-[var(--color-muted)]">
                    Est. {task.duration} mins • +25 XP Quiz available
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
