/**
 * LaMi Concierge — 🛎️ floating button (dark teal, gold ring pulse), slide-up
 * sheet chat. Answers ONLY from app data (cases, bills, key dates, briefing)
 * in Layla's active language, warm première-classe tone. Uses the built-in
 * Manus LLM proxy directly from the frontend.
 */
import React, { useEffect, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

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
  const { language, cases, briefing, keyDates, isRTL } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const buildContext = () => {
    const caseLines = cases.map((c) => {
      const parts = [
        `• ${c.emoji} ${c.title.pt} — estado: ${c.clientState}; próximo passo: ${c.nextStep?.pt || '—'}`
      ];
      if (c.quotations?.length) {
        parts.push(
          `  Orçamentos: ${c.quotations.map((q) => `${q.title.pt} ${q.priceAED} AED${q.isRecommended ? ' (recomendado)' : ''}`).join(' | ')}`
        );
      }
      if (c.completionProof) parts.push(`  Concluído em ${c.completionProof.completedAt}`);
      return parts.join('\n');
    });
    const dateLines = keyDates
      .filter((k) => k.status !== 'dismissed')
      .map((k) => `• ${k.date}: ${k.label.pt} (${k.category})`);
    return [
      `BRIEFING DE HOJE: ${briefing.prose.pt}`,
      `CASOS (${cases.length}):`,
      ...caseLines,
      'DATAS-CHAVE:',
      ...dateLines,
      'CONTAS: DEWA conta 2060863309 (débito automático ativo); Tasleem cliente 2144145 (crédito de -3.216 AED em investigação); Lootah Gas central 800 5224 / +97158 592 9669; Just Life limpeza semanal quintas 9h.'
    ].join('\n');
  };

  /**
   * Local knowledge-base answer engine (fallback when the LLM endpoint is
   * unreachable from a static deployment). Answers from live app state in
   * the active language with the same première-classe tone.
   */
  const localAnswer = (q: string): string => {
    const query = q.toLowerCase();
    const L = language;
    const t = (pt: string, en: string, he: string) => ({ pt, en, he }[L]);
    const caseTitle = (c: (typeof cases)[number]) => c.title[L] || c.title.pt;

    const pending = cases.filter((c) => c.clientState === '🔔 Aguardando você');
    const active = cases.filter((c) => c.clientState === '✅ Em nossas mãos');
    const done = cases.filter((c) => c.clientState === '✔️ Concluído');

    // Specific case lookup (bag, chanel, vuitton, laundry, leak, lease...)
    const keywords: [string[], string | undefined][] = [
      [['chanel', 'vuitton', 'bolsa', 'bag', 'תיק שאנל'], cases.find((c) => /chanel|vuitton|bolsa|bag/i.test(c.title.pt + c.title.en))?.id],
      [['lavander', 'laundry', 'roupa', 'כביסה'], cases.find((c) => /lavander|laundry/i.test(c.title.pt + c.title.en))?.id],
      [['vazamento', 'leak', 'banheiro', 'נזילה'], cases.find((c) => /vazamento|leak/i.test(c.title.pt + c.title.en))?.id],
      [['contrato', 'lease', 'aluguel', 'חוזה'], cases.find((c) => /lease|contrato/i.test(c.title.pt + c.title.en))?.id],
      [['tasleem', 'טסלים'], cases.find((c) => /tasleem/i.test(c.title.pt + c.title.en))?.id]
    ];
    for (const [words, id] of keywords) {
      if (id && words.some((w) => query.includes(w))) {
        const c = cases.find((x) => x.id === id)!;
        const next = c.nextStep?.[L] || c.nextStep?.pt;
        return t(
          `Sobre "${caseTitle(c)}": o estado atual é ${c.clientState}. ${next ? `Próximo passo: ${next}.` : ''} Estamos cuidando de tudo para você. 🌸`,
          `Regarding "${caseTitle(c)}": the current state is ${c.clientState}. ${next ? `Next step: ${next}.` : ''} We are taking care of everything for you. 🌸`,
          `לגבי "${caseTitle(c)}": המצב הנוכחי הוא ${c.clientState}. ${next ? `הצעד הבא: ${next}.` : ''} אנחנו מטפלים בהכל בשבילך. 🌸`
        );
      }
    }

    // Pending / awaiting
    if (/pendente|pending|aguard|awaiting|ממתין|מה יש/.test(query)) {
      if (pending.length === 0)
        return t(
          'Nada aguarda sua decisão neste momento — está tudo em nossas mãos. 🌸',
          'Nothing awaits your decision right now — everything is in our hands. 🌸',
          'שום דבר לא ממתין להחלטתך כרגע — הכל בידיים שלנו. 🌸'
        );
      const list = pending.map((c) => `${c.emoji} ${caseTitle(c)}`).join(', ');
      return t(
        `Aguardando sua aprovação: ${list}. Basta abrir o caso e escolher — o resto é conosco. 🌸`,
        `Awaiting your approval: ${list}. Simply open the case and choose — we handle the rest. 🌸`,
        `ממתין לאישורך: ${list}. פשוט פתחי את התיק ובחרי — השאר עלינו. 🌸`
      );
    }

    // Bills / utilities
    if (/conta|bill|dewa|gas|lootah|utilit|fatura|חשבון/.test(query)) {
      return t(
        'Suas contas: DEWA está em débito automático (conta 2060863309). A Tasleem mostra um crédito de 3.216,08 AED a seu favor — estamos confirmando por telefone. O gás Lootah e a limpeza Just Life seguem em dia. Tudo sob controle. 🌸',
        'Your bills: DEWA is on autopay (account 2060863309). Tasleem shows a 3,216.08 AED credit in your favor — we are confirming by phone. Lootah gas and Just Life cleaning are all current. Everything under control. 🌸',
        'החשבונות שלך: DEWA בהוראת קבע (חשבון 2060863309). בטסלים מופיע זיכוי של 3,216.08 AED לטובתך — אנחנו מאמתים טלפונית. גז לוטה וניקיון Just Life מעודכנים. הכל תחת שליטה. 🌸'
      );
    }

    // This week / due dates
    if (/semana|week|vence|due|prazo|datas|שבוע|מתי/.test(query)) {
      const upcoming = keyDates.filter((k) => k.status !== 'dismissed').slice(0, 3);
      const list = upcoming.map((k) => `${k.label[L] || k.label.pt} (${k.date})`).join('; ');
      return t(
        `No radar: ${list}. Nada disso exige ação sua hoje — avisaremos no momento certo. 🌸`,
        `On the radar: ${list}. None of these require your action today — we will alert you at the right moment. 🌸`,
        `על הרדאר: ${list}. אף אחד מהם לא דורש פעולה ממך היום — נעדכן אותך ברגע הנכון. 🌸`
      );
    }

    // Completed
    if (/conclu|complet|resolvid|done|finaliz|הושלם|נסגר/.test(query)) {
      const list = done.slice(0, 4).map((c) => `${c.emoji} ${caseTitle(c)}`).join(', ');
      return t(
        `Recentemente concluídos: ${list}. Os comprovantes estão no Arquivo. 🌸`,
        `Recently completed: ${list}. Proofs are in the Archive. 🌸`,
        `הושלמו לאחרונה: ${list}. האסמכתאות בארכיון. 🌸`
      );
    }

    // General status summary
    return t(
      `Resumo: ${active.length} casos em nossas mãos, ${pending.length} aguardando sua decisão e ${done.length} concluídos. ${briefing.prose[L]?.slice(0, 180) || ''}... Para algo específico, é só perguntar — ou a equipe Mimo entra em contato pessoalmente. 🌸`,
      `Summary: ${active.length} cases in our hands, ${pending.length} awaiting your decision, and ${done.length} completed. For anything specific just ask — or the Mimo team will follow up personally. 🌸`,
      `סיכום: ${active.length} תיקים בטיפולנו, ${pending.length} ממתינים להחלטתך ו-${done.length} הושלמו. לכל שאלה ספציפית פשוט שאלי — או שצוות מימו יחזור אלייך אישית. 🌸`
    );
  };

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || isTyping) return;
    hapticTap();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const langName = { pt: 'Portuguese (Brazilian)', en: 'English', he: 'Hebrew' }[language];

    try {
      const res = await fetch(`${import.meta.env.VITE_FRONTEND_FORGE_API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_FRONTEND_FORGE_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gemini-3-flash-preview',
          max_tokens: 2048,
          messages: [
            {
              role: 'system',
              content: `You are the LaMi Concierge, the private lifestyle assistant of Mimo's Collective in Dubai, speaking to the client Layla. Tone: warm, discreet, première-classe — like the concierge of a private members' club. Always address her respectfully and end with a calm reassurance when appropriate.

RULES:
1. Answer ONLY using the app data below. Never invent cases, prices, or dates.
2. If the question is outside the data, say the Mimo team will follow up personally.
3. Respond in ${langName}. Keep answers concise (2-5 sentences), elegant, no bullet spam.
4. Currency is AED. Dates in a friendly format.

APP DATA:
${buildContext()}`
            },
            ...messages.slice(-6).map((m) => ({
              role: m.role === 'ai' ? ('assistant' as const) : ('user' as const),
              content: m.text
            })),
            { role: 'user', content: userMsg }
          ]
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      setMessages((prev) => [...prev, { role: 'ai', text: reply || localAnswer(userMsg) }]);
    } catch {
      // Static deployments cannot reach the LLM proxy — answer locally from app state
      await new Promise((r) => setTimeout(r, 600));
      setMessages((prev) => [...prev, { role: 'ai', text: localAnswer(userMsg) }]);
    } finally {
      setIsTyping(false);
    }
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
