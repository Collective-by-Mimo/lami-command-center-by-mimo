/**
 * LaMi Cases — pill search bar, state filter pills, category filter chips
 * (extensible taxonomy from appConfig) with collapsible groups (collapsed by
 * default so the list stays navigable at 100+ cases), Framer Motion layout
 * animation, operator FAB (56px teal spring) opening a New Case modal.
 */
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CaseCard } from './CaseCard';
import { Search, Plus, X, ChevronDown } from 'lucide-react';
import { CaseItem } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { notifyNewCase } from '../services/whatsapp';
import { getAllCaseCategories, addCustomCategory, resolveCaseCategory } from '../config/appConfig';
import { hapticTap } from '../utils/haptics';

export const CasesScreen: React.FC = () => {
  const { cases, language, navigateToCaseDetail, isOperator, createNewCase, isRTL } = useApp();
  const [filterState, setFilterState] = useState<'all' | 'waiting' | 'inHand' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [showNewCase, setShowNewCase] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');
  const [newCategory, setNewCategory] = useState('home');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [catVersion, setCatVersion] = useState(0); // bump to re-read custom categories
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'waiting', label: '🔔 Awaiting' },
    { id: 'inHand', label: '✅ In progress' },
    { id: 'completed', label: '✔️ Completed' }
  ];

  const searchPlaceholder = 'Search cases...';
  const allCategoriesLabel = 'All';
  const casesWord = 'cases';
  const caseWord = 'case';

  const stateFilteredCases = useMemo(
    () =>
      cases.filter((c) => {
        if (filterState === 'waiting' && c.clientState !== '🔔 Awaiting you') return false;
        if (filterState === 'inHand' && c.clientState !== '✅ In our hands') return false;
        if (filterState === 'completed' && c.clientState !== '✔️ Completed') return false;
        if (query.trim()) {
          const q = query.trim().toLowerCase();
          const hay = `${c.title} ${c.emoji}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [cases, filterState, query]
  );

  // All categories (built-in + custom) are always selectable as filter chips.
  const allCategories = useMemo(() => getAllCaseCategories(), [catVersion]);

  const filteredCases = useMemo(
    () =>
      selectedCategory === 'all'
        ? stateFilteredCases
        : stateFilteredCases.filter((c) => resolveCaseCategory(c) === selectedCategory),
    [stateFilteredCases, selectedCategory]
  );

  // Groups in taxonomy order — only categories that have cases after filtering
  const groupedCases = useMemo(() => {
    const acc: Record<string, CaseItem[]> = {};
    filteredCases.forEach((c) => {
      const cat = resolveCaseCategory(c);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(c);
    });
    return allCategories.filter((cat) => acc[cat.id]?.length).map(
      (cat) => [cat, acc[cat.id]] as const
    );
  }, [filteredCases, allCategories]);

  // Groups auto-expand while searching or when a single category is selected;
  // otherwise they start collapsed so 100+ cases stay scannable.
  const isExpanded = (catId: string) =>
    query.trim().length > 0 || selectedCategory !== 'all' || !!expandedCats[catId];

  const toggleCategory = (catId: string) => {
    hapticTap();
    setExpandedCats((prev) => ({ ...prev, [catId]: !isExpanded(catId) }));
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    createNewCase({
      emoji: newEmoji || '✨',
      title,
      clientState: '✅ In our hands',
      internalStatus: 'Open',
      priority: 'Normal',
      category: newCategory,
      subcategory: newSubcategory || undefined
    });
    notifyNewCase(newTitle.trim());
    setShowNewCase(false);
    setNewTitle('');
    setNewEmoji('✨');
    setNewSubcategory('');
  };

  // "Add your own" category — persisted, then selected for this case.
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const cat = addCustomCategory(newCatName.trim(), newEmoji && newEmoji !== '✨' ? newEmoji : '🏷️');
    setCatVersion((v) => v + 1);
    setNewCategory(cat.id);
    setNewSubcategory('');
    setNewCatName('');
    setAddingCategory(false);
  };

  const selectedCatDef = allCategories.find((c) => c.id === newCategory);

  return (
    <div className="space-y-5 pb-28 pt-6 px-4 relative">
      {/* Screen title */}
      <h1 className="font-serif-display text-[28px] text-[#0E3F3A]">
        {"Your Cases"}
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
          className={`w-full h-11 rounded-full bg-white border border-[#E7E1D5] text-[14px] placeholder:text-[#9AA3A0] focus:outline-none focus:ring-2 focus:ring-[#145A52]/30 ${
            isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
          }`}
        />
      </div>

      {/* State filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterState(f.id as any)}
            className={`px-4 py-1.5 rounded-[20px] text-[13px] font-medium whitespace-nowrap border border-[#145A52] transition-colors ${
              filterState === f.id ? 'bg-[#145A52] text-white' : 'bg-white text-[#145A52]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <button
          onClick={() => {
            hapticTap();
            setSelectedCategory('all');
          }}
          className={`px-3.5 py-1.5 rounded-[20px] text-[12px] font-medium whitespace-nowrap border border-[#B8912E] transition-colors ${
            selectedCategory === 'all' ? 'bg-[#B8912E] text-white' : 'bg-white text-[#B8912E]'
          }`}
        >
          {allCategoriesLabel}
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              hapticTap();
              setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-[20px] text-[12px] font-medium whitespace-nowrap border border-[#B8912E] transition-colors ${
              selectedCategory === cat.id ? 'bg-[#B8912E] text-white' : 'bg-white text-[#B8912E]'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Collapsible category groups */}
      {groupedCases.length > 0 ? (
        <div className="space-y-4">
          {groupedCases.map(([category, catCases]) => {
            const open = isExpanded(category.id);
            return (
              <div key={category.id} className="space-y-2.5">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-3"
                >
                  <h3 className="text-[13px] font-semibold text-[#999999] tracking-[0.5px] shrink-0 font-serif-display">
                    {category.emoji} {category.label}
                  </h3>
                  <span className="flex-1 h-px bg-[#E2DDD5]" />
                  <span className="text-[11px] font-medium text-[#145A52] bg-[#EEF7F5] px-2 py-0.5 rounded-full shrink-0">
                    {catCases.length} {catCases.length === 1 ? caseWord : casesWord}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-[#999999]" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="group"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[#999999]">
          <p className="font-serif-display italic text-[18px]">
            {'No cases found 🌿'}
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
                <h3 className="font-serif-display text-[22px] text-[#0E3F3A]">New case</h3>
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
                  placeholder="Case name"
                  className="flex-1 h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] focus:outline-none focus:border-[#145A52]"
                />
              </div>
              {/* Category */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-[#6B7280]">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setNewSubcategory('');
                  }}
                  className="w-full h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] bg-white focus:outline-none focus:border-[#145A52]"
                >
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>

                {/* Subcategory (if the chosen category has any) */}
                {selectedCatDef?.subcategories && selectedCatDef.subcategories.length > 0 && (
                  <select
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] bg-white focus:outline-none focus:border-[#145A52]"
                  >
                    <option value="">— Subcategory (optional) —</option>
                    {selectedCatDef.subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Add your own category */}
                {addingCategory ? (
                  <div className="flex gap-2">
                    <input
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 h-10 rounded-xl border border-[#E2DDD5] px-3 text-[13px] focus:outline-none focus:border-[#145A52]"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="h-10 px-3 rounded-xl bg-[#B8912E] text-white text-[13px] font-semibold shrink-0"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingCategory(true)}
                    className="text-[12px] font-medium text-[#B8912E]"
                  >
                    + Add your own category
                  </button>
                )}
              </div>

              <button
                onClick={handleCreate}
                className="w-full h-11 bg-[#145A52] text-white rounded-full text-[14px] font-semibold active:scale-[0.98] transition-transform"
              >
                Create case
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
