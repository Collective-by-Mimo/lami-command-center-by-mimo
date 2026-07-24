import React from 'react';
import { useApp } from '../context/AppContext';
import { CalendarDays, Clock, Zap, CheckCircle2, ChevronRight, ShieldCheck, FileText } from 'lucide-react';
import { hapticTap } from '../utils/haptics';

export const WeeklyPreviewCard: React.FC = () => {
  const { language, cases, keyDates, utilities, navigateToCaseDetail, isRTL } = useApp();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);

  // 1. Pending Decisions
  const pendingDecisions = cases.filter(
    (c) => c.clientState === '🔔 Aguardando você' && c.decision && !c.decision.resolvedOptionId
  );

  // 2. Upcoming Key Dates in next 7-10 days
  const upcomingKeyDates = keyDates.filter((kd) => {
    if (kd.status === 'dismissed') return false;
    const itemDate = new Date(kd.date);
    itemDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((itemDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= -1 && diffDays <= 14; // Within 14 days or slightly past due
  });

  // 3. Active cases in hand with upcoming steps
  const activeCases = cases.filter((c) => c.clientState === '✅ Em nossas mãos');

  const titleText = {
    pt: 'Visão Semanal • Próximos 7 Dias',
    en: 'Weekly Preview • Next 7 Days',
    he: 'תקציר שבועי • 7 הימים הקרובים'
  }[language];

  const subTitleText = {
    pt: 'Sua semana resumida em absoluta paz e clareza',
    en: 'Your week summarized in calm clarity and absolute peace of mind',
    he: 'השבוע שלך מתומצת בשלווה ובהירות מוחלטת'
  }[language];

  const emptyText = {
    pt: 'Sem pendências operacionais para os próximos 7 dias. Tudo sob controle!',
    en: 'No operational pending items for the next 7 days. Everything is under control!',
    he: 'אין משימות פתוחות ב-7 הימים הקרובים. הכל בשליטה!'
  }[language];

  const categoryBadge: Record<string, { label: string; color: string }> = {
    bill: { label: language === 'pt' ? 'Conta' : language === 'en' ? 'Bill' : 'חשבון', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    lease: { label: language === 'pt' ? 'Aluguel' : language === 'en' ? 'Lease' : 'שכירות', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    document: { label: language === 'pt' ? 'Documento' : language === 'en' ? 'Document' : 'מסמך', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    pattern: { label: language === 'pt' ? 'Reserva' : language === 'en' ? 'Reservation' : 'הזמנה', color: 'bg-purple-100 text-purple-800 border-purple-300' }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2DDD5] shadow-sm relative overflow-hidden space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#145A52]/10 border border-[#145A52]/20 flex items-center justify-center text-[#145A52]">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] leading-tight flex items-center gap-2">
              <span>{titleText}</span>
            </h3>
            <p className="text-[14px] text-[#3D3D3D] leading-[1.6]">
              {subTitleText}
            </p>
          </div>
        </div>

        <span className="text-xs bg-[#F7F5F1] text-[#145A52] font-semibold px-2.5 py-1 rounded-full border border-[#E2DDD5]">
          7 Dias
        </span>
      </div>

      {/* Grid of Weekly Focus Areas */}
      <div className="space-y-4">
        {/* Pending Client Actions / Decisions */}
        {pendingDecisions.length > 0 && (
          <div className="bg-[#FFFBF2] p-4 rounded-2xl border border-[#B8912E]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px]">
                <Clock className="w-4 h-4 text-[#B8912E] animate-pulse" />
                <span>Ações necessárias ({pendingDecisions.length})</span>
              </span>
              <span className="text-xs text-[#8F6C19]">30 seg</span>
            </div>

            <div className="space-y-1.5">
              {pendingDecisions.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    hapticTap();
                    navigateToCaseDetail(c.id);
                  }}
                  className="bg-white p-3 rounded-xl border border-[#B8912E]/20 flex items-center justify-between cursor-pointer hover:border-[#B8912E] transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{c.emoji}</span>
                    <span className="text-[14px] font-semibold text-[#1C2826] truncate leading-[1.6]">
                      {c.title[language] || c.title.pt}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#B8912E] shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Key Dates & Bills */}
        {upcomingKeyDates.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-serif-display text-[18px] font-semibold text-[#0E3F3A] tracking-[-0.3px] px-1">
              Contas & compromissos agendados
            </h4>
            <div className="space-y-2">
              {upcomingKeyDates.map((kd) => {
                const badge = categoryBadge[kd.category] || { label: 'Geral', color: 'bg-gray-100 text-gray-800' };
                return (
                  <div
                    key={kd.id}
                    className={`bg-white rounded-[16px] px-4 py-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-y border-r border-[#E2DDD5]/40 flex items-center justify-between gap-2 ${
                      isRTL ? 'border-r-4 border-r-[#7B9E87] border-l-0' : 'border-l-4 border-l-[#7B9E87]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-[#62726F]">
                          {new Date(kd.date).toLocaleDateString(language === 'he' ? 'he-IL' : language === 'en' ? 'en-US' : 'pt-BR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold text-[#1C2826] truncate leading-[1.6]">
                        {kd.label[language] || kd.label.pt}
                      </p>
                    </div>

                    <span className="text-xs bg-[#145A52]/10 text-[#145A52] font-medium px-2.5 py-1 rounded-full border border-[#145A52]/20 shrink-0">
                      ✓ Em andamento
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Matters Snapshot */}
        {activeCases.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] px-1">
              Em nossas mãos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeCases.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    hapticTap();
                    navigateToCaseDetail(c.id);
                  }}
                  className="p-3 bg-white rounded-xl border border-[#E2DDD5] hover:border-[#145A52] transition cursor-pointer flex items-center gap-2.5"
                >
                  <span className="text-xl p-1.5 rounded-lg bg-[#F7F5F1] shrink-0">{c.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-[#1C2826] truncate leading-[1.6]">
                      {c.title[language] || c.title.pt}
                    </p>
                    <p className="text-xs text-[#62726F] truncate">
                      {c.nextStep[language] || c.nextStep.pt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calm Empty State if nothing is upcoming */}
        {pendingDecisions.length === 0 && upcomingKeyDates.length === 0 && (
          <div className="p-4 bg-[#F7F5F1] rounded-2xl text-center border border-[#E2DDD5] text-xs text-[#145A52] flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#145A52]" />
            <span>{emptyText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
