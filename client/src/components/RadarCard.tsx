import React from 'react';
import { KeyDateItem } from '../types';
import { useApp } from '../context/AppContext';
import { Radar, Check, X, Sparkles } from 'lucide-react';
import { hapticSuccess, hapticTap } from '../utils/haptics';

interface RadarCardProps {
  keyDate: KeyDateItem;
}

export const RadarCard: React.FC<RadarCardProps> = ({ keyDate }) => {
  const { language, acceptKeyDateSuggestion, dismissKeyDateSuggestion, isRTL } = useApp();

  const handleAccept = () => {
    hapticSuccess();
    acceptKeyDateSuggestion(keyDate.id);
  };

  const handleDismiss = () => {
    hapticTap();
    dismissKeyDateSuggestion(keyDate.id);
  };

  const acceptLabels = 'Yes, please';

  const dismissLabels = 'Not now';

  const titleText = keyDate.label;
  const subtitleText = keyDate.suggestion;

  return (
    <div
      className={`bg-[#FBF6E8] rounded-[16px] px-4 py-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-y border-r border-[#B8912E]/20 relative overflow-hidden transition-all ${
        isRTL ? 'border-r-4 border-r-[#B8912E] border-l-0' : 'border-l-4 border-l-[#B8912E]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[36px] h-[36px] rounded-full bg-[#145A52] flex items-center justify-center text-white text-base shrink-0 shadow-xs">
            <Radar className="w-5 h-5 text-white animate-pulse" />
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

        <span className="text-[11px] font-mono text-[#8F6C19] font-medium shrink-0 bg-white/60 px-2 py-0.5 rounded-full border border-[#B8912E]/20">
          {new Date(keyDate.date).toLocaleDateString(
            'en-US',
            { month: 'short', day: 'numeric' }
          )}
        </span>
      </div>

      {/* One-Tap Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#B8912E]/20">
        <button
          onClick={handleAccept}
          className="flex-1 bg-[#145A52] hover:bg-[#0E3F3A] text-white font-medium text-xs py-2 px-4 rounded-xl shadow-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4 text-[#B8912E]" />
          <span>{acceptLabels}</span>
        </button>

        <button
          onClick={handleDismiss}
          className="px-3.5 py-2 bg-black/5 hover:bg-black/10 text-[#62726F] font-medium text-xs rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>{dismissLabels}</span>
        </button>
      </div>
    </div>
  );
};
