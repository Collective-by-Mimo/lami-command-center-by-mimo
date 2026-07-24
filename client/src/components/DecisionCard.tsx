import React from 'react';
import { CaseItem } from '../types';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, FileText } from 'lucide-react';
import { getTranslation } from '../i18n/translations';

interface DecisionCardProps {
  caseItem: CaseItem;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ caseItem }) => {
  const { language, resolveDecision, navigateToCaseDetail, isRTL } = useApp();
  const decision = caseItem.decision;

  if (!decision) return null;

  const promptText = decision.prompt[language] || decision.prompt.pt;
  const titleText = caseItem.title[language] || caseItem.title.pt;
  const subtitleText = caseItem.nextStep[language] || caseItem.nextStep.pt || getTranslation('stateWaiting', language);

  return (
    <div
      className={`bg-white rounded-[16px] px-4 py-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-y border-r border-[#E2DDD5]/40 relative overflow-hidden transition-all ${
        isRTL ? 'border-r-4 border-r-[#B8912E] border-l-0' : 'border-l-4 border-l-[#B8912E]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[36px] h-[36px] rounded-full bg-[#145A52] flex items-center justify-center text-white text-base shrink-0 shadow-xs">
            {caseItem.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="font-serif-display text-[18px] font-semibold text-[#0E3F3A] leading-tight truncate">
              {titleText}
            </h3>
            <p className="font-sans text-[13px] text-[#888888] truncate mt-0.5">
              {subtitleText}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateToCaseDetail(caseItem.id)}
          className="text-xs font-medium text-[#145A52] hover:underline flex items-center gap-1 shrink-0 bg-[#145A52]/5 px-2.5 py-1.5 rounded-lg border border-[#145A52]/10"
        >
          <span>{getTranslation('viewDetails', language)}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Decision Prompt */}
      <p className="text-sm text-[#3E4E4B] leading-relaxed mb-3 bg-[#F7F5F1]/80 p-3 rounded-xl border border-[#E2DDD5]/80 font-normal">
        {promptText}
      </p>

      {/* Quotations / Itemized Preview if present */}
      {caseItem.quotations && caseItem.quotations.length > 0 && (
        <div className="mb-3 bg-white rounded-xl border border-[#E2DDD5] p-3 divide-y divide-[#E2DDD5]/60 text-xs">
          {caseItem.quotations.map((q) => (
            <div key={q.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
              <div>
                <span className="font-medium text-[#1C2826]">
                  {q.title[language] || q.title.pt}
                </span>
                {q.observation && (
                  <p className="text-[11px] text-[#62726F]">
                    {q.observation[language] || q.observation.pt}
                  </p>
                )}
              </div>
              <span className="font-semibold text-[#145A52] shrink-0 font-mono">
                {q.priceAED} AED
              </span>
            </div>
          ))}
          <div className="pt-2 flex justify-between font-bold text-sm text-[#145A52]">
            <span>Total:</span>
            <span>
              {caseItem.quotations.reduce((sum, q) => sum + (Number(q.priceAED) || 0), 0)} AED
            </span>
          </div>
        </div>
      )}

      {/* Decision Option Buttons - One Tap Action! */}
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        {decision.options.map((opt) => {
          const isPrimary = opt.variant === 'primary' || opt.id === 'approve';
          const label = opt.label[language] || opt.label.pt;

          return (
            <button
              key={opt.id}
              onClick={() => resolveDecision(caseItem.id, opt.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isPrimary
                  ? 'bg-[#145A52] text-white hover:bg-[#0E3F3A] shadow-xs'
                  : 'bg-[#F7F5F1] text-[#1C2826] hover:bg-[#E2DDD5] border border-[#E2DDD5]'
              }`}
            >
              {isPrimary && <Check className="w-4 h-4 text-[#B8912E]" />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
