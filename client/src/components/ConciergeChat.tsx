import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Send, X, Sparkles, User, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { hapticTap, hapticSuccess, hapticWarning } from '../utils/haptics';
import { askConcierge, buildGroundingData } from '../services/concierge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: string;
  requiresHandoff?: boolean;
  confirmedByMimo?: boolean;
}

export const ConciergeChat: React.FC = () => {
  const { language, cases, briefing, utilities, keyDates, addHandoff, isRTL } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'concierge',
      text: {
        pt: 'Olá Layla. Sou o seu assistente Concierge. Em que posso auxiliá-la hoje com a gestão executiva?',
        en: 'Hello Layla. I am your Concierge assistant. How may I assist you today with executive operations?',
        he: 'שלום לילה. אני עוזר הקונסיירז׳ שלך. כיצד אוכל לסייע לך היום בניהול המנהלי?'
      }[language] || 'Olá Layla. Sou o assistente Concierge.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confirmedByMimo: true
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleOpen = () => {
    hapticTap();
    setIsOpen(!isOpen);
  };

  const quickQuestions = {
    pt: [
      'O que precisa da minha aprovação?',
      'Quando vence a DEWA?',
      'Qual o status do contrato de aluguel?'
    ],
    en: [
      'What needs my approval?',
      'When is DEWA due?',
      'What is the status of the lease?'
    ],
    he: [
      'מה דורש את אישורי?',
      'מתי פג תוקף DEWA?',
      'מה סטטוס חוזה השכירות?'
    ]
  }[language] || [
    'O que precisa da minha aprovação?',
    'Quando vence a DEWA?',
    'Qual o status do contrato de aluguel?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    hapticTap();
    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: userMsgTime
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    // Sanitized snapshot only — internal fields and account numbers never leave the app
    const groundingData = buildGroundingData(cases, utilities, keyDates, briefing, language);
    const { reply, fallback } = await askConcierge(query, language, groundingData);
    const botMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (fallback) {
      hapticWarning();
      // Concierge could not answer — log to the operator handoff queue
      addHandoff(query);
    } else {
      hapticSuccess();
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: 'concierge',
        text: reply,
        timestamp: botMsgTime,
        requiresHandoff: fallback
      }
    ]);
    setIsLoading(false);
  };

  const titleText = {
    pt: 'Concierge Mimo\'s Collective',
    en: 'Concierge Mimo\'s Collective',
    he: 'קונסיירז׳ Mimo\'s Collective'
  }[language];

  const subTitleText = {
    pt: 'Assistente Executivo Privado',
    en: 'Private Executive Assistant',
    he: 'עוזר מנהלי פרטי'
  }[language];

  return (
    <>
      {/* Floating Discreet Bubble (Bottom-Right, No Robot Iconography) */}
      <button
        onClick={toggleOpen}
        id="concierge-trigger-button"
        aria-label="Abrir Concierge AI"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-[#145A52] to-[#0E3F3A] text-white px-4 py-3 rounded-full shadow-2xl border border-[#B8912E]/40 hover:border-[#B8912E] transition-all duration-300 active:scale-95 flex items-center gap-2 group"
      >
        <div className="relative flex items-center justify-center">
          <Bell className="w-5 h-5 text-[#B8912E] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B8912E] rounded-full animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B8912E] rounded-full" />
        </div>
        <span className="font-serif-display font-semibold text-xs tracking-wide text-[#F7F5F1]">
          Concierge
        </span>
      </button>

      {/* Full Screen Sheet / Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div
            className={`w-full sm:max-w-md bg-[#F7F5F1] h-full shadow-2xl flex flex-col relative border-l border-[#E2DDD5] ${
              isRTL ? 'font-hebrew' : ''
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#145A52] to-[#0E3F3A] text-white p-4 border-b border-[#1A7067] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B8912E]/20 border border-[#B8912E]/40 flex items-center justify-center text-[#B8912E]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-sm text-[#F7F5F1]">
                    {titleText}
                  </h3>
                  <p className="text-[11px] text-[#B8912E] font-sans">
                    {subTitleText} • <span className="text-emerald-400">On-line 🛎️</span>
                  </p>
                </div>
              </div>

              <button
                onClick={toggleOpen}
                className="p-2 rounded-full hover:bg-white/10 text-[#E2DDD5] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#145A52] text-white rounded-br-none'
                        : 'bg-white text-[#1C2826] border border-[#E2DDD5] rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs font-normal">{msg.text}</p>

                    {/* Footer indicators */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5 text-[10px] text-[#8F9A97]">
                      <span>{msg.timestamp}</span>

                      {msg.requiresHandoff && (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Encaminhado ao Mimo
                        </span>
                      )}

                      {msg.confirmedByMimo && !msg.requiresHandoff && (
                        <span className="inline-flex items-center gap-1 text-[#145A52] font-semibold">
                          <Check className="w-3 h-3 text-[#B8912E]" />
                          Confirmado pelo Mimo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="bg-white rounded-2xl px-4 py-3 border border-[#E2DDD5] w-fit flex items-center gap-1.5">
                  <span className="lami-typing-dot w-2 h-2 rounded-full bg-[#B8912E] inline-block" />
                  <span className="lami-typing-dot w-2 h-2 rounded-full bg-[#B8912E] inline-block" />
                  <span className="lami-typing-dot w-2 h-2 rounded-full bg-[#B8912E] inline-block" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-3 py-2 bg-[#EFECE6] border-t border-[#E2DDD5] shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-[#62726F] font-semibold mb-1.5 px-1">
                Sugestões rápidas:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="text-[11px] bg-white text-[#1C2826] border border-[#D5CFB9] hover:border-[#145A52] px-2.5 py-1 rounded-full transition active:scale-95 disabled:opacity-50 text-left truncate max-w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E2DDD5] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    language === 'pt'
                      ? 'Pergunte sobre seus casos, contas ou prazos...'
                      : language === 'en'
                      ? 'Ask about your cases, bills, or deadlines...'
                      : 'שאלי על תיקים, חשבונות או מועדים...'
                  }
                  className="flex-1 bg-[#F7F5F1] text-xs text-[#1C2826] placeholder-[#8F9A97] rounded-xl px-3.5 py-2.5 border border-[#E2DDD5] focus:outline-none focus:border-[#145A52]"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-[#145A52] hover:bg-[#0E3F3A] text-white p-2.5 rounded-xl transition disabled:opacity-40 shrink-0"
                >
                  <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
