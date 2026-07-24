import React from 'react';
import { CaseItem } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { ArrowRight, Clock, Repeat, AlertCircle } from 'lucide-react';

interface CaseCardProps {
  caseItem: CaseItem;
  onClick: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onClick }) => {
  const { language, isOperator, isRTL } = useApp();

  const isWaiting = caseItem.clientState === '🔔 Aguardando você';
  const isInProgress = caseItem.clientState === '✅ Em nossas mãos';
  const isCompleted = caseItem.clientState === '✔️ Concluído';

  const titleText = caseItem.title[language] || caseItem.title.pt;
  const nextStepText = caseItem.nextStep[language] || caseItem.nextStep.pt;

  const chipLabels = {
    waiting: { pt: '🔔 Aguardando você', en: '🔔 Awaiting you', he: '🔔 ממתין לך' }[language],
    inProgress: { pt: '✓ Em andamento', en: '✓ In progress', he: '✓ בתהליך' }[language],
    completed: { pt: '✓ Concluído', en: '✓ Completed', he: '✓ הושלם' }[language]
  };

  // Accent strip color based on card type
  const borderAccentClass = isWaiting
    ? isRTL ? 'border-r-4 border-r-[#B8912E] border-l-0' : 'border-l-4 border-l-[#B8912E]'
    : isInProgress
    ? isRTL ? 'border-r-4 border-r-[#145A52] border-l-0' : 'border-l-4 border-l-[#145A52]'
    : isRTL ? 'border-r-4 border-r-[#CCCCCC] border-l-0' : 'border-l-4 border-l-[#CCCCCC]';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[16px] px-4 py-[14px] shadow-[0_2px_16px_rgba(14,63,58,0.08)] transition-all cursor-pointer hover:shadow-md active:scale-[0.99] relative overflow-hidden group ${borderAccentClass} ${
        isCompleted ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Emoji & Case Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[40px] h-[40px] rounded-full bg-[#EEF7F5] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
            {caseItem.emoji}
          </div>

          <div className="min-w-0">
            <h3 className="font-serif-display text-[18px] font-semibold text-[#0E3F3A] leading-tight truncate">
              {titleText}
            </h3>
            <p className="font-sans text-[13px] text-[#888888] truncate mt-0.5">
              {nextStepText}
            </p>
          </div>
        </div>

        {/* Right Status Pill */}
        <div className="flex items-center gap-2 shrink-0">
          {isInProgress ? (
            <span className="text-xs bg-[#145A52]/10 text-[#145A52] font-medium px-2.5 py-1 rounded-full border border-[#145A52]/20 flex items-center gap-1">
              {chipLabels.inProgress}
            </span>
          ) : isWaiting ? (
            <span className="lami-pulse text-xs bg-[#FFF8E7] text-[#B8912E] font-medium px-2.5 py-1 rounded-full border border-[#B8912E] flex items-center gap-1">
              {chipLabels.waiting}
            </span>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full border border-gray-200 flex items-center gap-1">
              {chipLabels.completed}
            </span>
          )}

          <ArrowRight
            className={`w-4 h-4 text-[#A8B4B1] group-hover:text-[#145A52] shrink-0 transition-transform ${
              isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
            }`}
          />
        </div>
      </div>

      {/* Subtask progress bar indicator if subtasks exist */}
      {caseItem.subtasks && caseItem.subtasks.length > 0 && (
        <div className="mt-2.5 pt-1.5 border-t border-[#E2DDD5]/40 flex items-center gap-2 text-[11px] text-[#62726F]">
          <div className="flex-1 bg-[#E2DDD5] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#145A52] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.round(
                  (caseItem.subtasks.filter((s) => s.completed).length / caseItem.subtasks.length) * 100
                )}%`
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-[#145A52] font-semibold shrink-0">
            {caseItem.subtasks.filter((s) => s.completed).length}/{caseItem.subtasks.length} etapas ({Math.round(
              (caseItem.subtasks.filter((s) => s.completed).length / caseItem.subtasks.length) * 100
            )}%)
          </span>
        </div>
      )}

      {/* Operator internal metadata badges if operator active */}
      {isOperator && (
        <div className="mt-2 pt-2 border-t border-[#E2DDD5]/60 flex items-center gap-2 text-[10px]">
          <span className="bg-[#0E3F3A] text-white px-2 py-0.5 rounded-full font-mono">
            Interno: {caseItem.internalStatus}
          </span>
          {caseItem.priority === 'Alta' && (
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
              <AlertCircle className="w-2.5 h-2.5" />
              Alta
            </span>
          )}
        </div>
      )}
    </div>
  );
};
