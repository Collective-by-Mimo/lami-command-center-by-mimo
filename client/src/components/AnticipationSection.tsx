import React from 'react';
import { useApp } from '../context/AppContext';
import { RadarCard } from './RadarCard';
import { Sparkles, Radar, ShieldCheck } from 'lucide-react';

export const AnticipationSection: React.FC = () => {
  const { language, activeRadarSuggestions } = useApp();

  const titleText = {
    pt: 'Antecipação Concierge',
    en: 'Concierge Anticipation',
    he: 'חיזוי קונסיירז׳'
  }[language];

  const subTitleText = {
    pt: 'Sugestões preventivas baseadas na sua agenda e documentos',
    en: 'Proactive suggestions analyzed from your timeline and key documents',
    he: 'הצעות מראש המבוססות על מועדים ומסמכים'
  }[language];

  const emptyText = {
    pt: 'Todas as antecipações foram atendidas. Nenhuma renovação ou ação pendente por enquanto! ✨',
    en: 'All proactive suggestions addressed. No pending renewals or actions right now! ✨',
    he: 'כל ההצעות מראש טופלו. אין חידושים או פעולות ממתינות כרגע! ✨'
  }[language];

  return (
    <section className="space-y-3 bg-gradient-to-b from-[#FFFDF7] to-[#FDF8EC] p-4 sm:p-5 rounded-3xl border border-[#B8912E]/30 shadow-xs relative overflow-hidden">
      {/* Decorative Gold Glow Watermark */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8912E]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#B8912E]/15 border border-[#B8912E]/30 flex items-center justify-center text-[#8F6C19]">
            <Radar className="w-4 h-4 text-[#B8912E] animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] tracking-[-0.3px] flex items-center gap-2">
              <span>{titleText}</span>
              {activeRadarSuggestions.length > 0 && (
                <span className="bg-[#B8912E] text-white text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                  {activeRadarSuggestions.length}
                </span>
              )}
            </h2>
            <p className="text-[11px] text-[#8F6C19]/80 font-sans">
              {subTitleText}
            </p>
          </div>
        </div>
      </div>

      {activeRadarSuggestions.length > 0 ? (
        <div className="space-y-3 pt-1">
          {activeRadarSuggestions.map((keyDate) => (
            <RadarCard key={keyDate.id} keyDate={keyDate} />
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 text-center border border-[#B8912E]/20 text-xs text-[#8F6C19] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#B8912E] shrink-0" />
          <span>{emptyText}</span>
        </div>
      )}
    </section>
  );
};
