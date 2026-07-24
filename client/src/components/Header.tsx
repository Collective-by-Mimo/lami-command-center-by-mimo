/**
 * LaMi Header — 64px #0E3F3A, gold LM badge, "LaMi by Mimo's Collective",
 * flag-emoji language switcher (44px circles, gold ring active, spring tap),
 * 1px gold bottom border, backdrop blur on scroll.
 * Long-press logo 3s toggles operator mode.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { motion } from 'motion/react';

const LANGS: { code: Language; emoji: string; label: string }[] = [
  { code: 'pt', emoji: '🇧🇷', label: 'Português' },
  { code: 'en', emoji: '🇬🇧', label: 'English' },
  { code: 'he', emoji: '🇮🇱', label: 'עברית' }
];

export const Header: React.FC = () => {
  const { language, setLanguage, toggleOperator, isOperator } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      toggleOperator();
    }, 3000);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="sticky top-0 z-50 h-16 border-b border-[#B8912E]"
      style={{
        background: scrolled ? 'rgba(14,63,58,0.88)' : '#0E3F3A',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none'
      }}
    >
      <div className="max-w-2xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 select-none"
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onContextMenu={(e) => e.preventDefault()}
          title="LaMi Command Center"
        >
          <div className="w-9 h-9 rounded-full bg-[#B8912E] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(184,145,46,0.4)]">
            <span className="font-serif-display italic text-white text-[15px] font-semibold leading-none">LM</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white text-[18px] font-semibold tracking-tight" style={{ fontFamily: 'Inter' }}>
              LaMi
              {isOperator && (
                <span className="mx-2 text-[9px] font-medium uppercase tracking-widest text-[#B8912E] align-middle">
                  operator
                </span>
              )}
            </span>
            <span className="text-[11px] font-light text-[#CFE3DE]" style={{ fontFamily: 'Inter' }}>
              by Mimo's Collective
            </span>
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1.5" dir="ltr">
          {LANGS.map((lang) => {
            const isActive = language === lang.code;
            return (
              <motion.button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                whileTap={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.5 }}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[22px]"
                style={isActive ? { boxShadow: '0 0 0 2.5px #B8912E' } : undefined}
                aria-label={lang.label}
              >
                {lang.emoji}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
};
