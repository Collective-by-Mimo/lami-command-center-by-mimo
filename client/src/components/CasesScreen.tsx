/**
 * LaMi Cases — pill search bar, scrollable filter pills, elegant mixed-case
 * category dividers with thin extending line, Framer Motion layout animation,
 * operator FAB (56px teal spring) opening a New Case modal.
 */
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CaseCard } from './CaseCard';
import { getTranslation } from '../i18n/translations';
import { Search, Plus, X } from 'lucide-react';
import { CaseItem } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { notifyNewCase } from '../services/whatsapp';

const CATEGORY_ORDER = ['Moda & Luxo', 'Residência', 'Utilidades', 'Documentos & Mobilidade', 'Serviços'];

const CATEGORY_LABELS: Record<string, { pt: string; en: string; he: string }> = {
  'Moda & Luxo': { pt: 'Moda & Luxo', en: 'Fashion & Luxury', he: 'אופנה ויוקרה' },
  'Residência': { pt: 'Residência', en: 'Residence', he: 'מגורים' },
  'Utilidades': { pt: 'Utilidades', en: 'Utilities', he: 'שירותים' },
  'Documentos & Mobilidade': { pt: 'Documentos & Mobilidade', en: 'Documents & Mobility', he: 'מסמכים וניידות' },
  'Serviços': { pt: 'Serviços', en: 'Services', he: 'שירותים כלליים' }
};

// Visual-only category mapping by emoji/case id
function categorize(c: CaseItem): string {
  if (c.category && CATEGORY_LABELS[c.category]) return c.category;
  if (['👜', '🌸'].includes(c.emoji)) return 'Moda & Luxo';
  if (['🚿', '🧺', '🧶', '🧹'].includes(c.emoji)) return 'Residência';
  if (['⚡', '❄️', '🔥'].includes(c.emoji)) return 'Utilidades';
  if (['🚗', '🛂'].includes(c.emoji)) return 'Documentos & Mobilidade';
  return 'Serviços';
}

export const CasesScreen: React.FC = () => {
  const { cases, language, navigateToCaseDetail, isOperator, createNewCase, isRTL } = useApp();
  const [filterState, setFilterState] = useState<'all' | 'waiting' | 'inHand' | 'completed'>('all');
  const [query, setQuery] = useState('');
  const [showNewCase, setShowNewCase] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');
  const [newCategory, setNewCategory] = useState('Serviços');

  const filters = [
    { id: 'all', label: { pt: 'Todos', en: 'All', he: 'הכל' } },
    { id: 'waiting', label: { pt: '🔔 Aguardando', en: '🔔 Awaiting', he: '🔔 ממתין' } },
    { id: 'inHand', label: { pt: '✅ Em andamento', en: '✅ In progress', he: '✅ בתהליך' } },
    { id: 'completed', label: { pt: '✔️ Concluídos', en: '✔️ Completed', he: '✔️ הושלמו' } }
  ];

  const searchPlaceholder = { pt: 'Buscar casos...', en: 'Search cases...', he: 'חיפוש תיקים...' }[language];

  const filteredCases = useMemo(
    () =>
      cases.filter((c) => {
        if (filterState === 'waiting' && c.clientState !== '🔔 Aguardando você') return false;
        if (filterState === 'inHand' && c.clientState !== '✅ Em nossas mãos') return false;
        if (filterState === 'completed' && c.clientState !== '✔️ Concluído') return false;
        if (query.trim()) {
          const q = query.trim().toLowerCase();
          const hay = `${c.title.pt} ${c.title.en} ${c.title.he} ${c.emoji}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [cases, filterState, query]
  );

  const groupedCases = useMemo(() => {
    const acc: Record<string, CaseItem[]> = {};
    filteredCases.forEach((c) => {
      const cat = categorize(c);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(c);
    });
    return CATEGORY_ORDER.filter((cat) => acc[cat]?.length).map((cat) => [cat, acc[cat]] as const);
  }, [filteredCases]);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const title = { pt: newTitle.trim(), en: newTitle.trim(), he: newTitle.trim() };
    createNewCase({
      emoji: newEmoji || '✨',
      title,
      clientState: '✅ Em nossas mãos',
      internalStatus: 'Aberto',
      priority: 'Normal',
      category: newCategory
    });
    notifyNewCase(newTitle.trim());
    setShowNewCase(false);
    setNewTitle('');
    setNewEmoji('✨');
  };

  return (
    <div className="space-y-5 pb-28 pt-6 px-4 relative">
      {/* Screen title */}
      <h1 className="font-serif-display text-[28px] text-[#0E3F3A]">
        {getTranslation('navCases', language)}
      </h1>

      {/* Search pill */}
      <div className="relative">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] ${isRTL ? 'right-4' : 'left-4'}`}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(14,63,58,0.06)] text-[14px] placeholder:text-[#9AA3A0] focus:outline-none focus:ring-2 focus:ring-[#145A52]/30 ${
            isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
          }`}
        />
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterState(f.id as any)}
            className={`px-4 py-1.5 rounded-[20px] text-[13px] font-medium whitespace-nowrap border border-[#145A52] transition-colors ${
              filterState === f.id ? 'bg-[#145A52] text-white' : 'bg-white text-[#145A52]'
            }`}
          >
            {f.label[language]}
          </button>
        ))}
      </div>

      {/* Grouped case list */}
      {groupedCases.length > 0 ? (
        <div className="space-y-6">
          {groupedCases.map(([category, catCases]) => (
            <div key={category} className="space-y-2.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[13px] font-semibold text-[#999999] tracking-[0.5px] shrink-0 font-serif-display">
                  {CATEGORY_LABELS[category]?.[language] || category}
                </h3>
                <span className="flex-1 h-px bg-[#E2DDD5]" />
              </div>
              <motion.div layout className="space-y-3">
                <AnimatePresence initial={false}>
                  {catCases.map((caseItem) => (
                    <motion.div
                      key={caseItem.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <CaseCard caseItem={caseItem} onClick={() => navigateToCaseDetail(caseItem.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#999999]">
          <p className="font-serif-display italic text-[18px]">
            {{ pt: 'Nenhum caso encontrado 🌿', en: 'No cases found 🌿', he: 'לא נמצאו תיקים 🌿' }[language]}
          </p>
        </div>
      )}

      {/* Operator FAB */}
      {isOperator && (
        <motion.button
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowNewCase(true)}
          className={`fixed bottom-24 ${isRTL ? 'left-5' : 'right-5'} w-14 h-14 bg-[#145A52] text-white rounded-full flex items-center justify-center z-40`}
          style={{ boxShadow: '0 4px 20px rgba(14,63,58,0.35)' }}
          aria-label="New case"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* New Case modal */}
      <AnimatePresence>
        {showNewCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowNewCase(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-[18px] w-full max-w-sm shadow-[0_12px_40px_rgba(14,63,58,0.25)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-[22px] text-[#0E3F3A]">Novo caso</h3>
                <button onClick={() => setShowNewCase(false)} className="p-1 text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className="w-14 h-11 text-center rounded-xl border border-[#E2DDD5] text-lg focus:outline-none focus:border-[#145A52]"
                  maxLength={4}
                  aria-label="Emoji"
                />
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nome do caso"
                  className="flex-1 h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] focus:outline-none focus:border-[#145A52]"
                />
              </div>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] bg-white focus:outline-none focus:border-[#145A52]"
              >
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCreate}
                className="w-full h-11 bg-[#145A52] text-white rounded-full text-[14px] font-semibold active:scale-[0.98] transition-transform"
              >
                Criar caso
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
