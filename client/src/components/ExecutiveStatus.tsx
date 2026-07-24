import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldCheck, AlertCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const ExecutiveStatus: React.FC = () => {
  const { language, cases, keyDates, setCurrentView, isRTL } = useApp();

  // Sentiment / Status Analysis
  const pendingDecisions = cases.filter(
    (c) => c.clientState === '🔔 Aguardando você' && c.decision && !c.decision.resolvedOptionId
  );
  const inHandCases = cases.filter((c) => c.clientState === '✅ Em nossas mãos');
  const completedCases = cases.filter((c) => c.clientState === '✔️ Concluído');

  const totalTracked = cases.length;
  const pendingCount = pendingDecisions.length;

  // Sentiment calculation: 100% minus 12% per pending action, min 65%
  const sentimentScore = Math.max(65, Math.min(100, Math.round(100 - pendingCount * 15)));

  // Life Status metrics according to sentiment score
  let statusKey: 'optimal' | 'attention' | 'actionRequired' = 'optimal';
  if (pendingCount === 1) {
    statusKey = 'attention';
  } else if (pendingCount > 1) {
    statusKey = 'actionRequired';
  }

  const translations = {
    title: {
      pt: 'Status Executivo de Vida',
      en: 'Executive Life Status',
      he: 'סטטוס חיים מנהלי'
    },
    optimalHeadline: {
      pt: 'Tudo sob controle',
      en: 'Everything under control',
      he: 'הכל בשליטה מלאה'
    },
    attentionHeadline: {
      pt: 'Atenção necessária',
      en: 'Needs attention',
      he: 'נדרשת תשומת לב'
    },
    actionHeadline: {
      pt: 'Ação executiva requerida',
      en: 'Executive action required',
      he: 'נדרשת פעולה מנהלית'
    },
    optimalDesc: {
      pt: `Todos os ${totalTracked} assuntos familiares e patrimoniais estão sendo geridos perfeitamente pelo Mimo.`,
      en: `All ${totalTracked} personal and family affairs are being managed seamlessly by Mimo.`,
      he: `כל ${totalTracked} העניינים האישיים והמשפחתיים מנוהלים בצורה מושלמת על ידי מימו.`
    },
    attentionDesc: {
      pt: `1 decisão aguarda sua validação rápida (apenas 30 segundos) para manter o fluxo 100% contínuo.`,
      en: `1 decision requires your quick greenlight (30 seconds) to maintain 100% momentum.`,
      he: `החלטה אחת ממתינה לאישורך המהיר (30 שניות) כדי לשמור על רציפות מלאה.`
    },
    actionDesc: {
      pt: `${pendingCount} decisões aguardam sua orientação executiva para que a equipe prossiga imediatamente.`,
      en: `${pendingCount} decisions await your executive guidance so the team can proceed immediately.`,
      he: `${pendingCount} החלטות ממתינות להנחייתך כדי שהצוות יוכל להמשיך מיד.`
    },
    managedStat: {
      pt: 'Em nossas mãos',
      en: 'Under management',
      he: 'בטיפולנו'
    },
    completedStat: {
      pt: 'Concluídos e auditados',
      en: 'Completed & audited',
      he: 'הושלמו ובוקרו'
    },
    pendingStat: {
      pt: 'Aguardando você',
      en: 'Awaiting you',
      he: 'ממתינים לך'
    }
  };

  const getStatusBadge = () => {
    switch (statusKey) {
      case 'optimal':
        return {
          label: language === 'pt' ? '100% Protegido' : language === 'he' ? '100% מוגן' : '100% Protected',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />
        };
      case 'attention':
        return {
          label: language === 'pt' ? 'Atenção Pontual' : language === 'he' ? 'תשומת לב נקודתית' : '1 Action Needed',
          bg: 'bg-[#FFF8E7] text-[#8F6C19] border-[#B8912E]/30',
          icon: <Clock className="w-4 h-4 text-[#B8912E] animate-pulse" />
        };
      case 'actionRequired':
        return {
          label: language === 'pt' ? `${pendingCount} Ações Pendentes` : language === 'he' ? `${pendingCount} פעולות ממתינות` : `${pendingCount} Actions Needed`,
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: <AlertCircle className="w-4 h-4 text-amber-700 animate-bounce" />
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className={`bg-[#F7F5F1] rounded-2xl p-5 sm:p-6 border-y border-r border-[#E2DDD5] shadow-xs relative overflow-hidden transition-all duration-300 ${
      isRTL ? 'border-r-[4px] border-r-[#B8912E] border-l-0' : 'border-l-[4px] border-l-[#B8912E]'
    }`}>
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white rounded-xl border border-[#E2DDD5] text-[#0E3F3A] shadow-xs">
            <Activity className="w-5 h-5 text-[#B8912E]" />
          </div>
          <div>
            <h2 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] leading-tight">
              {translations.title[language]}
            </h2>
            <p className="text-xs text-[#62726F] font-sans">
              Análise de sentimento operacional em tempo real
            </p>
          </div>
        </div>

        {/* Life Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-sans ${badge.bg}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Main Life Status Metric Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E2DDD5] mb-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0E3F3A]">
                {statusKey === 'optimal'
                  ? translations.optimalHeadline[language]
                  : statusKey === 'attention'
                  ? translations.attentionHeadline[language]
                  : translations.actionHeadline[language]}
              </span>
              <Sparkles className="w-4 h-4 text-[#B8912E]" />
            </div>
            <p className="card-body-text">
              {statusKey === 'optimal'
                ? translations.optimalDesc[language]
                : statusKey === 'attention'
                ? translations.attentionDesc[language]
                : translations.actionDesc[language]}
            </p>
          </div>

          {/* Sentiment Gauge Pill */}
          <div className="flex items-center gap-3 bg-[#F7F5F1] px-4 py-2.5 rounded-xl border border-[#E2DDD5] shrink-0">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-[#62726F] tracking-wider">
                Índice de Paz
              </span>
              <span className="font-serif-display font-bold text-xl text-[#0E3F3A]">
                {sentimentScore}%
              </span>
            </div>
            {/* Visual Sentiment Circle Progress */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#E2DDD5"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#B8912E"
                  strokeWidth="3.5"
                  strokeDasharray={100}
                  strokeDashoffset={100 - sentimentScore}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#0E3F3A]">
                {sentimentScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Life Status Operational Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white/80 p-2.5 rounded-xl border border-[#E2DDD5]">
          <span className="block font-serif-display font-bold text-lg text-[#0E3F3A]">
            {inHandCases.length}
          </span>
          <span className="text-[11px] text-[#62726F] font-sans">
            {translations.managedStat[language]}
          </span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-[#E2DDD5]">
          <span className="block font-serif-display font-bold text-lg text-[#145A52]">
            {completedCases.length}
          </span>
          <span className="text-[11px] text-[#62726F] font-sans">
            {translations.completedStat[language]}
          </span>
        </div>

        <div
          onClick={() => {
            if (pendingCount > 0) {
              const el = document.getElementById('decisions-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`p-2.5 rounded-xl border transition-all ${
            pendingCount > 0
              ? 'bg-[#FFFBF2] border-[#B8912E]/40 text-[#8F6C19] cursor-pointer hover:border-[#B8912E]'
              : 'bg-white/80 border-[#E2DDD5] text-[#62726F]'
          }`}
        >
          <span className={`block font-serif-display font-bold text-lg ${pendingCount > 0 ? 'text-[#B8912E]' : 'text-[#0E3F3A]'}`}>
            {pendingCount}
          </span>
          <span className="text-[11px] font-sans">
            {translations.pendingStat[language]}
          </span>
        </div>
      </div>
    </div>
  );
};
