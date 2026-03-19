import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Zap, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizModalProps {
  topic: string;
  subject: string;
  onSuccess: () => void;
  onClose: () => void;
}

// Procedural basic mock quiz generator based on topic string length
function generateMockQuiz(topic: string) {
  const seed = topic.length;
  
  return [
    {
      question: `Which of the following is core to understanding ${topic}?`,
      options: [
        "Ignoring algorithmic complexity",
        `Implementing ${topic.split(' ')[0]} correctly`,
        "Relying solely on global variables",
        "Using deprecated API methods"
      ],
      answerIndex: 1
    },
    {
      question: `What happens if ${topic} is misconfigured?`,
      options: [
        "Memory leaks or unhandled exceptions",
        "The compiler automatically fixes it",
        "Performance increases",
        "Nothing, it is optional"
      ],
      answerIndex: 0
    },
    {
      question: `In modern architectures, ${topic} is typically used alongside:`,
      options: [
        "Punch cards",
        "Vacuum tubes",
        "Advanced design patterns",
        "Floppy disks"
      ],
      answerIndex: 2
    }
  ];
}

export default function QuizModal({ topic, subject, onSuccess, onClose }: QuizModalProps) {
  const questions = generateMockQuiz(topic);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const handleSelect = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;

    if (!isAnswerChecked) {
      // Check answer
      if (selectedOpt === questions[currentQ].answerIndex) {
        setScore(s => s + 1);
      }
      setIsAnswerChecked(true);
    } else {
      // Move to next
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
        setSelectedOpt(null);
        setIsAnswerChecked(false);
      } else {
        setShowResult(true);
      }
    }
  };

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]">
          <div>
            <div className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-widest">{subject}</div>
            <h2 className="text-xl font-bold font-[Orbitron]">{topic} Mastery Check</h2>
          </div>
          {!showResult && (
            <button onClick={onClose} className="p-2 hover:bg-[var(--color-surface2)] rounded-lg text-[var(--color-muted)] transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div 
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between text-sm text-[var(--color-muted)] font-medium mb-4">
                  <span>Question {currentQ + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>

                <h3 className="text-lg font-semibold leading-relaxed">
                  {questions[currentQ].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQ].options.map((opt, idx) => {
                    let btnClass = "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/50";
                    if (isAnswerChecked) {
                      if (idx === questions[currentQ].answerIndex) {
                        btnClass = "border-[var(--color-green)] bg-[rgba(92,216,160,0.1)] text-[var(--color-green)]"; // Correct
                      } else if (idx === selectedOpt) {
                        btnClass = "border-[var(--color-red)] bg-[rgba(242,112,109,0.1)] text-[var(--color-red)]"; // Wrong selected
                      } else {
                        btnClass = "border-[var(--color-border)] bg-[var(--color-bg)] opacity-50"; // Unselected wrong
                      }
                    } else if (selectedOpt === idx) {
                      btnClass = "border-[var(--color-accent)] bg-[rgba(232,184,75,0.1)] shadow-[0_0_15px_rgba(232,184,75,0.1)]"; // Selected
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={isAnswerChecked}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleNext}
                    disabled={selectedOpt === null}
                    className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                      selectedOpt !== null 
                        ? 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:brightness-110 shadow-[0_0_20px_rgba(232,184,75,0.3)]' 
                        : 'bg-[var(--color-surface2)] text-[var(--color-muted)] cursor-not-allowed'
                    }`}
                  >
                    {isAnswerChecked ? (currentQ === questions.length - 1 ? 'See Results' : 'Next Question') : 'Check Answer'}
                    {!isAnswerChecked && <CheckCircle2 size={18} />}
                    {isAnswerChecked && <ArrowRight size={18} />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${passed ? 'border-[var(--color-green)] text-[var(--color-green)]' : 'border-[var(--color-red)] text-[var(--color-red)]'}`}>
                  {passed ? <CheckCircle2 size={48} /> : <AlertTriangle size={48} />}
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold font-[Orbitron] mb-2">{percentage}% Score</h2>
                  <p className="text-[var(--color-muted)]">
                    {passed 
                      ? "Module Mastered! You've validated your knowledge." 
                      : "Revision Recommended. You need 70% to master this module."}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                  {passed ? (
                    <button 
                      onClick={() => { onClose(); onSuccess(); }}
                      className="w-full py-3.5 bg-[var(--color-green)] text-[var(--color-bg)] font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(92,216,160,0.3)]"
                    >
                      <Zap size={20} /> Claim XP & Complete Module
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button 
                        onClick={onClose}
                        className="flex-1 py-3 bg-[var(--color-surface2)] text-white font-medium rounded-xl hover:bg-[var(--color-border)] transition-all"
                      >
                        Return to Study
                      </button>
                      <button 
                        onClick={() => { setCurrentQ(0); setScore(0); setSelectedOpt(null); setShowResult(false); setIsAnswerChecked(false); }}
                        className="flex-1 py-3 bg-transparent border border-[var(--color-accent)] text-[var(--color-accent)] font-medium rounded-xl hover:bg-[rgba(232,184,75,0.1)] transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} /> Retry Quiz
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
