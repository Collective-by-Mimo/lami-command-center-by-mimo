/**
 * LaMi bottom navigation — 4 tabs, gold active indicator (layoutId spring),
 * trilingual labels, pending gold dot on Briefing.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Newspaper, Layers, Receipt, Archive } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, cases, language } = useApp();

  // Updated to reflect new tabs and icon/badge logic
  const navItems = [
    { id: 'briefing', label: { pt: 'Briefing', en: 'Briefing', he: 'תדריך' }[language], icon: Newspaper },
    { id: 'cases', label: { pt: 'Casos', en: 'Cases', he: 'תיקים' }[language], icon: Layers },
    { id: 'utilities', label: { pt: 'Contas', en: 'Bills', he: 'חשבונות' }[language], icon: Receipt },
    { id: 'archive', label: { pt: 'Arquivo', en: 'Archive', he: 'ארכיון' }[language], icon: Archive },
  ];

  // Logic for notification dot (if any pending decisions in cases)
  const hasPending = cases.some(c => c.clientState === '🔔 Aguardando você');

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] pb-safe bg-white border-t border-[#F0EDED] flex items-center justify-around shadow-[0_-4px_20px_rgba(14,63,58,0.08)] z-50">
      {navItems.map((item) => {
        const isActive = currentView === item.id || (currentView === 'caseDetail' && item.id === 'cases');
        
        return (
          <button
            key={item.id}
            onClick={() => {
              hapticTap();
              setCurrentView(item.id as any);
            }}
            className="flex flex-col items-center justify-center gap-1.5 h-full relative flex-1"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute top-0 left-3 right-3 h-[3px] bg-[#B8912E] rounded-b-lg"
              />
            )}
            
            <div className="relative">
              <item.icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-[#145A52]' : 'text-[#AAAAAA]'
                }`}
              />
              {item.id === 'briefing' && hasPending && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#B8912E] rounded-full" />
              )}
            </div>
            
            <span
              className={`text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#145A52]' : 'text-[#AAAAAA]'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
