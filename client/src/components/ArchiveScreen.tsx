/**
 * LaMi Archive — completed cases grouped by month, gold count badges,
 * quiet grey accent strips, staggered entrance animation.
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { CaseItem } from '../types';
import { Search, Archive, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const ArchiveScreen: React.FC = () => {
  const { cases, language, navigateToCaseDetail, isRTL } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter completed cases
  const completedCases = cases.filter((c) => c.clientState === '✔️ Concluído');

  const filtered = completedCases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const titleText = (c.title[language] || c.title.pt).toLowerCase();
    const query = searchQuery.toLowerCase();
    return titleText.includes(query) || c.emoji.includes(query);
  });

  // Group cases by completedMonth
  const groupedByMonth = filtered.reduce((acc, c) => {
    const month = c.completedMonth || '2026-07';
    if (!acc[month]) acc[month] = [];
    acc[month].push(c);
    return acc;
  }, {} as Record<string, CaseItem[]>);

  // Format month string nicely
  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : language === 'en' ? 'en-US' : 'pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-5 pb-28 pt-6 px-4">
      
      {/* Screen Header */}
      <div>
        <h1 className="font-serif-display text-[28px] text-[#0E3F3A] tracking-[-0.3px] flex items-center gap-2">
          <Archive className="w-6 h-6 text-[#145A52]" />
          <span>{getTranslation('archiveTitle', language)}</span>
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-1">
          {completedCases.length} {getTranslation('resolvedMatters', language)}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-[#A8B4B1] ${isRTL ? 'right-4' : 'left-4'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getTranslation('searchPlaceholder', language)}
          className={`w-full h-11 bg-white rounded-full border border-[#E7E1D5] text-[14px] text-[#1A1A1A] placeholder:text-[#9AA3A0] focus:outline-none focus:ring-2 focus:ring-[#145A52]/30 ${
            isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
          }`}
        />
      </div>

      {/* Grouped Month Sections */}
      <div className="space-y-6">
        {Object.keys(groupedByMonth).length > 0 ? (
          Object.keys(groupedByMonth).sort().reverse().map((monthKey, gi) => {
            const monthCases = groupedByMonth[monthKey];

            return (
              <motion.div
                key={monthKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * gi, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-3"
              >
                {/* Monthly Recap Line */}
                <div className="flex items-center justify-between bg-[#EEF7F5] px-4 py-2.5 rounded-xl">
                  <span className="font-serif-display font-semibold text-[18px] text-[#0E3F3A] capitalize">
                    {formatMonthLabel(monthKey)}
                  </span>
                  <span className="text-xs font-semibold text-[#B8912E] bg-white px-2.5 py-0.5 rounded-full border border-[#B8912E]/30">
                    {monthCases.length} {getTranslation('resolvedMatters', language)}
                  </span>
                </div>

                {/* Case Cards */}
                <div className="space-y-2.5">
                  {monthCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigateToCaseDetail(c.id)}
                      className={`bg-white rounded-[16px] px-4 py-[14px] border border-[#E7E1D5] hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group opacity-90 ${
                        isRTL ? 'border-r-4 border-r-[#CCCCCC]' : 'border-l-4 border-l-[#CCCCCC]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#F1F1EF] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform grayscale-[0.3]">
                          {c.emoji}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif-display text-[18px] font-semibold text-[#0E3F3A] leading-tight truncate">
                            {c.title[language] || c.title.pt}
                          </h4>
                          <p className="font-sans text-[13px] text-[#888888] truncate mt-0.5 flex items-center gap-1">
                            {c.completionProof ? (
                              <span className="flex items-center gap-1 text-[#145A52]">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#B8912E]" />
                                {{ pt: 'Comprovante anexado', en: 'Proof attached', he: 'אסמכתה מצורפת' }[language]}
                              </span>
                            ) : (
                              { pt: 'Concluído e arquivado', en: 'Completed and archived', he: 'הושלם ותויק' }[language]
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full border border-gray-200">
                          {{ pt: '✓ Concluído', en: '✓ Completed', he: '✓ הושלם' }[language]}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-[#A8B4B1] group-hover:text-[#145A52] shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center py-12 border border-[#E7E1D5]">
            <p className="text-sm text-[#62726F] font-serif-display italic text-[16px]">
              {{ pt: 'Nenhum caso concluído no arquivo com esta pesquisa.', en: 'No completed cases match this search.', he: 'לא נמצאו תיקים שהושלמו בחיפוש זה.' }[language]}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
