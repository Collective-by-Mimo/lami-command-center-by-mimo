/**
 * LaMi Connections — grid of provider portal shortcuts (styled text badges in
 * brand colors, opened in a new tab). Launcher only: no credentials stored.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { CONNECTION_PROVIDERS } from '../config/appConfig';
import { ArrowLeft, ExternalLink, Link2 } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

export const ConnectionsScreen: React.FC = () => {
  const { language, setCurrentView, isRTL } = useApp();

  const t = {
    title: { pt: 'Conexões', en: 'Connections', he: 'חיבורים' }[language],
    subtitle: {
      pt: 'Atalhos para os portais oficiais — sem credenciais armazenadas',
      en: 'Shortcuts to official portals — no credentials stored',
      he: 'קיצורי דרך לפורטלים הרשמיים — ללא שמירת פרטי התחברות'
    }[language],
    back: { pt: 'Voltar ao Briefing', en: 'Back to Briefing', he: 'חזרה לתדריך' }[language],
    open: { pt: 'Abrir portal', en: 'Open portal', he: 'פתח פורטל' }[language]
  };

  return (
    <div className="space-y-5 pb-28 pt-4 px-4">
      <button
        onClick={() => {
          hapticTap();
          setCurrentView('briefing');
        }}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#145A52] bg-white px-3.5 py-2 rounded-full border border-[#E7E1D5] active:scale-[0.97] transition-transform"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        <span>{t.back}</span>
      </button>

      <div>
        <h1 className="font-serif-display text-[28px] text-[#0E3F3A] flex items-center gap-2.5">
          <Link2 className="w-6 h-6 text-[#B8912E]" strokeWidth={1.75} />
          {t.title}
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CONNECTION_PROVIDERS.map((provider, idx) => (
          <motion.a
            key={provider.id}
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => hapticTap()}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * idx, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-2xl p-4 border border-[#E7E1D5] space-y-3 active:scale-[0.98] transition-transform group"
          >
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-lg font-sans font-bold text-[15px] tracking-wide"
              style={{ backgroundColor: provider.badgeBg, color: provider.badgeFg }}
            >
              {provider.name}
            </span>
            <div>
              <p className="text-[13px] text-[#2C2C2C] font-medium leading-snug">
                {provider.tagline[language] || provider.tagline.pt}
              </p>
              <p className="font-mono text-[11px] text-[#999999] mt-1">{provider.host}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#145A52] group-hover:text-[#0E3F3A]">
              {t.open}
              <ExternalLink className="w-3 h-3" />
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
