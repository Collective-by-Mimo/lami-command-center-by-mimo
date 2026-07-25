/**
 * LaMi Concierge — 🛎️ floating button (dark teal, gold ring pulse), slide-up
 * sheet chat. Answers ONLY from app data (cases, bills, key dates, briefing)
 * in Layla's active language, warm première-classe tone. Calls the secure
 * server-side Gemini endpoint (POST /api/concierge) with a sanitized
 * grounding payload — no keys or internal fields ever leave the server/client
 * boundary they belong to.
 */
import React, { useEffect, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';
import { askConcierge, buildGroundingData } from '../services/concierge';

interface ChatMsg {
  role: 'user' | 'ai';
  text: string;
}

const QUICK_CHIPS: Record<string, string[]> = {
  pt: ['O que está pendente?', 'Próximas contas?', 'Status da bolsa Chanel', 'O que vence esta semana?'],
  en: ["What's pending?", 'Upcoming bills?', 'Chanel bag status', 'What is due this week?'],
  he: ['מה ממתין לי?', 'חשבונות קרובים?', 'סטטוס תיק שאנל', 'מה מסתיים השבוע?']
};

const GREETINGS: Record<string, string> = {
  pt: 'Olá, Layla. Como posso ajudar com seus casos hoje? 🌸',
  en: 'Hello, Layla. How may I help with your matters today? 🌸',
  he: 'שלום ליילה, איך אפשר לעזור לך היום? 🌸'
};

export const ConciergeAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { language, cases, briefing, utilities, keyDates, isRTL } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || isTyping) return;
    hapticTap();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Sanitized snapshot only — internal fields and account numbers never leave the app
    const groundingData = buildGroundingData(cases, utilities, keyDates, briefing, language);
    const { reply } = await askConcierge(userMsg, language, groundingData);
    setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    setIsTyping(false);
  };

  const placeholder = {
    pt: 'Escreva sua pergunta...',
    en: 'Type your question...',
    he: 'כתבי את שאלתך...'
  }[language];

  return (
    <>
      {/* Floating bell button */}
      <motion.button
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.6 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          hapticTap();
          setIsOpen(true);
        }}
        className={`fixed bottom-24 ${isRTL ? 'right-5' : 'left-5'} w-[52px] h-[52px] bg-[#0E3F3A] rounded-full flex items-center justify-center z-40 text-[22px]`}
        style={{ boxShadow: '0 4px 20px rgba(14,63,58,0.4), 0 0 0 2px rgba(184,145,46,0.5)' }}
        aria-label="Concierge"
      >
        🛎️
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40 flex items-end justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F7F5F1] w-full max-w-2xl h-[86vh] rounded-t-3xl flex flex-col overflow-hidden"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Chat header */}
              <div className="bg-[#0E3F3A] text-white px-5 py-4 flex items-center justify-between border-b border-[#B8912E]">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#B8912E] flex items-center justify-center text-lg">🛎️</span>
                  <div>
                    <h2 className="font-serif-display italic text-[20px] leading-tight">Concierge LaMi</h2>
                    <p className="text-[11px] text-[#CFE3DE]">
                      {{ pt: 'Sempre à disposição', en: 'Always at your service', he: 'תמיד לשירותך' }[language]}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 opacity-80 hover:opacity-100" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <div className="bg-white rounded-2xl p-3.5 text-[14px] text-[#2C2C2C] shadow-[0_2px_10px_rgba(14,63,58,0.06)] max-w-[85%]">
                  <span className="font-serif-display italic text-[15px]">{GREETINGS[language]}</span>
                </div>

                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QUICK_CHIPS[language].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => send(chip)}
                        className="px-3.5 py-2 bg-white rounded-full text-[13px] text-[#145A52] font-medium shadow-[0_1px_6px_rgba(14,63,58,0.08)] border border-[#145A52]/15 active:scale-[0.96] transition-transform"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3.5 rounded-2xl text-[14px] leading-[1.6] max-w-[85%] whitespace-pre-wrap ${
                      m.role === 'user'
                        ? `bg-[#145A52] text-white ${isRTL ? 'mr-auto' : 'ml-auto'}`
                        : `bg-white text-[#2C2C2C] shadow-[0_2px_10px_rgba(14,63,58,0.06)] ${isRTL ? 'ml-auto border-r-[3px] border-r-[#B8912E]' : 'mr-auto border-l-[3px] border-l-[#B8912E]'}`
                    }`}
                  >
                    {m.text}
                  </motion.div>
                ))}

                {isTyping && (
                  <div className={`bg-white rounded-2xl px-4 py-3 shadow-[0_2px_10px_rgba(14,63,58,0.06)] w-fit flex items-center gap-1.5 ${isRTL ? 'ml-auto' : 'mr-auto'}`}>
                    <span className="lami-typing-dot w-2 h-2 rounded-full bg-[#B8912E] inline-block" />
                    <span className="lami-typing-dot w-2 h-2 rounded-full bg-[#B8912E] inline-block" />
                    <span className="lami-typing-dot w-2 h-2 rounded-full bg-[#B8912E] inline-block" />
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 pb-safe bg-white border-t border-[#E2DDD5]">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder={placeholder}
                    className="flex-1 h-11 px-4 rounded-full bg-[#F7F5F1] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#145A52]/30"
                  />
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => send()}
                    disabled={isTyping || !input.trim()}
                    className="w-11 h-11 bg-[#145A52] text-white rounded-full flex items-center justify-center disabled:opacity-40 shrink-0"
                    aria-label="Send"
                  >
                    <Send className={`w-4.5 h-4.5 w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
