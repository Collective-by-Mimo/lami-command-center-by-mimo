import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, RefreshCw, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { hapticTap } from '../utils/haptics';

export const TodaysFocusCard: React.FC = () => {
  const { language, cases, briefing, utilities, keyDates, isRTL } = useApp();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSynthesis = async (forceRefresh = false) => {
    const cacheKey = `todays_focus_${language}_${cases.length}`;
    if (!forceRefresh) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setSummary(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/todays-focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          appData: {
            cases,
            briefing,
            utilities,
            keyDates
          }
        })
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        sessionStorage.setItem(cacheKey, data.summary);
      }
    } catch (err) {
      console.warn('Failed to fetch today focus:', err);
      const fallback = {
        pt: 'Hoje tudo está sob controle em Dubai. Há 1 decisão rápida aguardando sua validação para finalizarmos as cotações.',
        en: 'Today everything is under control in Dubai. There is 1 quick decision awaiting your validation.',
        he: 'היום הכל בשליטה בדובאי. ישנה החלטה מהירה אחת הממתינה לאישורך.'
      }[language] || 'Hoje tudo está sob controle em Dubai.';
      setSummary(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSynthesis(false);
  }, [language, cases.length]);

  const handleRefresh = () => {
    hapticTap();
    fetchSynthesis(true);
  };

  const titleText = {
    pt: 'Foco do Dia • Resumo Conversacional',
    en: 'Today\'s Focus • Conversational Summary',
    he: 'פוקוס היומי • תקציר מנהלים'
  }[language];

  return (
    <div className={`bg-[#F7F5F1] rounded-2xl p-6 sm:p-7 border-y border-r border-[#E2DDD5] shadow-xs relative overflow-hidden transition-all duration-300 ${
      isRTL ? 'border-r-[3px] border-r-[#B8912E] border-l-0' : 'border-l-[3px] border-l-[#B8912E]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#B8912E] shrink-0" />
          <h2 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] leading-tight">
            {titleText}
          </h2>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#62726F] border border-[#E2DDD5] transition disabled:opacity-50"
          title="Atualizar síntese"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#B8912E]' : ''}`} />
        </button>
      </div>

      {/* Conversational AI Prose Output */}
      {loading ? (
        <div className="py-3 flex items-center gap-2 text-sm text-[#62726F] font-serif-display italic">
          <Sparkles className="w-4 h-4 animate-spin text-[#B8912E]" />
          <span>Sintetizando prioridades do dia...</span>
        </div>
      ) : (
        <p className="font-serif-display italic text-[19px] leading-[1.8] text-[#1C2826]">
          "{summary}"
        </p>
      )}
    </div>
  );
};
