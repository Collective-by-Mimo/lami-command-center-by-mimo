/**
 * LaMi — PWA install banner. Appears after 30s on page, teal bg, Inter 13px,
 * dismiss X, never shown again after dismissal (localStorage).
 */
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowDownToLine } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const DISMISS_KEY = 'lami_install_banner_dismissed';

export const InstallBanner: React.FC = () => {
  const { language, canInstallPWA, installPWA } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === 'true') return;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;
    const timer = setTimeout(() => setVisible(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  const label = {
    pt: 'Adicione ao ecrã inicial para acesso instantâneo ↓',
    en: 'Add to your home screen for instant access ↓',
    he: 'הוסיפי למסך הבית לגישה מיידית ↓'
  }[language];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-[84px] left-4 right-4 z-[60] max-w-md mx-auto"
        >
          <div className="bg-[#145A52] text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_8px_30px_rgba(14,63,58,0.35)]">
            <ArrowDownToLine className="w-4 h-4 shrink-0 text-[#CFE3DE]" />
            <button
              onClick={() => {
                if (canInstallPWA) installPWA();
                dismiss();
              }}
              className="text-[13px] font-medium text-left flex-1"
            >
              {label}
            </button>
            <button onClick={dismiss} aria-label="Dismiss" className="p-1 opacity-80 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
