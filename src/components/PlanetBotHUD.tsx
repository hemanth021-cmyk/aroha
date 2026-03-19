import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, User, Zap } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface PlanetBotHUDProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function PlanetBotHUD({ isOpen, onClose, userName = "Explorer" }: PlanetBotHUDProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Greetings, ${userName}! I am VARA, your cosmic AI companion. Click my core anytime you need guidance across the knowledge universe. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let response = "That's an interesting question! I am scanning the database for the best study materials on that topic.";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        response = "Greetings! The stars are aligned for a great study session today.";
      } else if (lowerInput.includes('xp') || lowerInput.includes('score')) {
        response = "Remember, you earn 25 XP per module, but only if you pass the mastery quiz with 70% or more!";
      } else if (lowerInput.includes('exam')) {
        response = "I've analyzed your schedule in the Calendar. You're right on track for your upcoming target date.";
      } else if (lowerInput.includes('constellation') || lowerInput.includes('map')) {
        response = "Your constellation is looking bright! Keep completing modules to light up all the stars in your track.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          className="fixed bottom-24 right-8 w-80 md:w-96 z-50 flex flex-col glass-card border border-[var(--color-accent)]/30 shadow-[0_0_50px_rgba(232,184,75,0.1)] overflow-hidden h-[500px]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)] bg-[rgba(232,184,75,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold font-[Orbitron] tracking-wider">VARA CORE</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
                  <span className="text-[10px] text-[var(--color-muted)] uppercase font-bold">Online</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-[var(--color-muted)]">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg)] rounded-tr-none' 
                    : 'bg-[var(--color-surface2)] text-[var(--color-text)] border border-[var(--color-border)] rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--color-surface2)] p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[var(--color-border)] bg-black/20">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Vara anything..."
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-[var(--color-muted)]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 rounded-lg transition-all disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-[9px] text-[var(--color-muted)] uppercase font-bold tracking-tight flex items-center gap-1">
                <Sparkles size={10} /> Powered by Aroha AI
              </span>
              <span className="text-[9px] text-[var(--color-muted)] uppercase font-bold tracking-tight flex items-center gap-1">
                <Zap size={10} /> Fast Response
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
