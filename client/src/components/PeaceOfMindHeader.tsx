import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Clock, CheckCircle2, Calendar, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';

export const PeaceOfMindHeader: React.FC = () => {
  const { language, briefing, cases, keyDates, setCurrentView, navigateToCaseDetail, isRTL } = useApp();

  // Decision cases awaiting response
  const decisionCases = cases.filter(
    (c) => c.clientState === '🔔 Aguardando você' && c.decision && !c.decision.resolvedOptionId
  );

  // Completed cases
  const completedCases = cases.filter((c) => c.clientState === '✔️ Concluído');
  const latestCompleted = completedCases.length > 0 ? completedCases[0] : null;

  // Upcoming items this week from keyDates & active cases
  const upcomingKeyDates = keyDates
    .filter((kd) => kd.status !== 'dismissed')
    .slice(0, 2);

  const hasDecisions = decisionCases.length > 0;

  const labels = {
    peaceStatusOk: {
      pt: 'Tudo sob controle • Vida 100% gerenciada',
      en: 'Everything under control • Life 100% managed',
      he: 'הכל בשליטה • החיים מנוהלים ב-100%'
    },
    peaceStatusAction: {
      pt: `${decisionCases.length} decisão aguarda seu toque (30 seg)`,
      en: `${decisionCases.length} decision needs you (30 seconds)`,
      he: `${decisionCases.length} החלטה דורשת את תשומת לבך (30 שניות)`
    },
    subtextOk: {
      pt: 'Nenhuma preocupação operacional no momento. O Mimo está no comando de todos os detalhes.',
      en: 'No operational concerns at this time. Mimo is taking care of every detail.',
      he: 'אין דאגות תפעוליות כרגע. מימו מטפל בכל הפרטים.'
    },
    subtextAction: {
      pt: 'Sua aprovação rápida é o único passo pendente para darmos continuidade imediata.',
      en: 'Your quick approval is the only step needed for us to proceed immediately.',
      he: 'אישורך המהיר הוא השלב היחיד שנותר להמשך טיפול מיידי.'
    },
    upcomingWeekTitle: {
      pt: 'Próximos esta semana',
      en: 'Upcoming this week',
      he: 'הקרובים השבוע'
    },
    recentlyCompletedTitle: {
      pt: 'Concluído recentemente',
      en: 'Recently completed',
      he: 'הושלם לאחרונה'
    },
    todaySnapshotTitle: {
      pt: 'Resumo diário',
      en: 'Daily executive snapshot',
      he: 'תקציר מנהלי יומי'
    }
  };

  const briefingText = briefing.prose[language] || briefing.prose.pt;

  return (
    <div className="space-y-4">
      {/* Primary Peace of Mind Hero Status Banner */}
      <div
        className={`rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all border ${
          hasDecisions
            ? 'bg-gradient-to-br from-[#2D220E] via-[#1F170A] to-[#140F06] border-[#B8912E]/50 text-white'
            : 'bg-gradient-to-br from-[#145A52] via-[#0E3F3A] to-[#0A2E2A] border-[#1A7067] text-white'
        }`}
      >
        {/* Ambient Glow */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            hasDecisions ? 'bg-[#B8912E]/20' : 'bg-[#B8912E]/15'
          }`}
        />

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                hasDecisions
                  ? 'bg-[#B8912E] text-[#1C2826] border-[#B8912E]'
                  : 'bg-[#B8912E]/20 text-[#B8912E] border-[#B8912E]/30'
              }`}
            >
              {hasDecisions ? (
                <Clock className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8912E]" />
              )}
              <span>
                {hasDecisions ? labels.peaceStatusAction[language] : labels.peaceStatusOk[language]}
              </span>
            </span>
          </div>

          <span className="text-[10px] bg-black/30 text-[#E2DDD5] px-2.5 py-0.5 rounded-full border border-white/10 font-mono">
            Dubai GST
          </span>
        </div>

        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F5F1] mb-2 leading-snug">
          {hasDecisions ? (
            <span>Sua vida sob controle — <span className="text-[#B8912E]">1 ação rápida</span></span>
          ) : (
            <span>Sua vida em perfeita ordem. ✨</span>
          )}
        </h1>

        <p className="text-xs text-[#E2DDD5]/90 leading-relaxed font-sans max-w-xl">
          {hasDecisions ? labels.subtextAction[language] : labels.subtextOk[language]}
        </p>
      </div>

      {/* 4 Executive Peace of Mind Grid Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pillar 1: Upcoming This Week */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[#8F6C19]">
            <span className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#B8912E]" />
              {labels.upcomingWeekTitle[language]}
            </span>
            <span className="text-xs bg-[#FFF8E7] px-2 py-0.5 rounded border border-[#B8912E]/20 text-[#8F6C19]">
              {upcomingKeyDates.length} itens
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {upcomingKeyDates.map((kd) => (
              <div key={kd.id} className="text-[14px] text-[#3D3D3D] leading-[1.6] font-medium flex items-center justify-between gap-2">
                <span className="truncate">{kd.label[language] || kd.label.pt}</span>
                <span className="text-xs text-[#62726F] shrink-0">
                  {new Date(kd.date).toLocaleDateString(language === 'he' ? 'he-IL' : language === 'en' ? 'en-US' : 'pt-BR', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Recently Completed */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2DDD5] shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-[#145A52]">
            <span className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#145A52]" />
              {labels.recentlyCompletedTitle[language]}
            </span>
            <button
              onClick={() => setCurrentView('archive')}
              className="text-xs text-[#145A52] font-semibold hover:underline"
            >
              Ver todos
            </button>
          </div>

          {latestCompleted ? (
            <div
              onClick={() => navigateToCaseDetail(latestCompleted.id)}
              className="cursor-pointer group flex items-center gap-2 pt-1"
            >
              <span className="text-lg p-1 bg-[#F7F5F1] rounded-lg shrink-0">
                {latestCompleted.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[#1C2826] truncate leading-[1.6] group-hover:text-[#145A52] transition">
                  {latestCompleted.title[language] || latestCompleted.title.pt}
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  ✔️ Concluído e verificado
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8F9A97] italic">Tudo atualizado recentemente.</p>
          )}
        </div>

        {/* Pillar 3: Today's Executive Prose Briefing */}
        <div className="bg-[#F7F5F1] rounded-2xl p-5 border-y border-r border-[#E2DDD5] border-l-[3px] border-l-[#B8912E] shadow-xs flex flex-col justify-between space-y-3 sm:col-span-1">
          <div className="flex items-center justify-between text-[#1C2826]">
            <span className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#B8912E]" />
              {labels.todaySnapshotTitle[language]}
            </span>
            <span className="text-xs text-[#B8912E] font-semibold">Mimo</span>
          </div>

          <p className="font-serif-display italic text-[19px] leading-[1.8] text-[#1C2826]">
            "{briefingText}"
          </p>
        </div>
      </div>
    </div>
  );
};
