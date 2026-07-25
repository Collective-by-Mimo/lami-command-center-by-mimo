/**
 * LaMi Briefing (home) — cream bg, no dark heroes. Sections:
 * A greeting (time-aware) · B daily briefing card (gold 3px border) ·
 * C requires-your-attention (gold tinted, pulse chips) · D week pills ·
 * E proactive radar suggestion (max 1) · F recently completed chips ·
 * G quick access — Take me home + Contacts/Connections tiles ("More" grid).
 */
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadarCard } from './RadarCard';
import { WeekStrip } from './WeekStrip';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';
import { HOME_CONFIG } from '../config/appConfig';
import { Phone, Link2, ChevronRight } from 'lucide-react';

const sectionAnim = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] as any }
});

export const BriefingScreen: React.FC = () => {
  const {
    language,
    cases,
    briefing,
    setCurrentView,
    navigateToCaseDetail,
    activeRadarSuggestion,
    isRTL,
    isOperator,
    updateBriefingText
  } = useApp();
  const [isBriefingCollapsed, setIsBriefingCollapsed] = useState(true);
  const [editingBriefing, setEditingBriefing] = useState(false);
  const [draft, setDraft] = useState('');

  const attentionCases = cases.filter((c) => c.clientState === '🔔 Aguardando você');
  const completedCases = cases
    .filter((c) => c.clientState === '✔️ Concluído')
    .sort((a, b) => (b.completionProof?.completedAt || '').localeCompare(a.completionProof?.completedAt || ''))
    .slice(0, 3);

  useEffect(() => {
    const visited = localStorage.getItem('briefing-visited');
    if (visited) {
      setIsBriefingCollapsed(true);
    } else {
      setIsBriefingCollapsed(false);
      localStorage.setItem('briefing-visited', 'true');
    }
  }, []);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting =
    hour >= 6 && hour < 12
      ? { pt: 'Bom dia, Layla 🌸', en: 'Good morning, Layla 🌸', he: 'בוקר טוב, ליילה 🌸' }
      : hour >= 12 && hour < 18
        ? { pt: 'Boa tarde, Layla 🌸', en: 'Good afternoon, Layla 🌸', he: 'צהריים טובים, ליילה 🌸' }
        : { pt: 'Boa noite, Layla 🌸', en: 'Good evening, Layla 🌸', he: 'ערב טוב, ליילה 🌸' };

  const locale = language === 'he' ? 'he-IL' : language === 'en' ? 'en-US' : 'pt-BR';
  const today = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });

  const briefingText = briefing.prose[language] || briefing.prose.pt;
  const showReadMore = briefingText.length > 180;

  const t = {
    briefingLabel: { pt: '📋 Briefing de hoje', en: "📋 Today's briefing", he: '📋 סיכום יומי' }[language],
    readMore: { pt: 'Ler mais ↓', en: 'Read more ↓', he: 'קרא עוד ↓' }[language],
    readLess: { pt: 'Ler menos ↑', en: 'Read less ↑', he: 'קרא פחות ↑' }[language],
    attention: { pt: 'Requer sua atenção', en: 'Requires your attention', he: 'דורש את תשומת לבך' }[language],
    week: { pt: 'Esta semana', en: 'This week', he: 'השבוע' }[language],
    empty: { pt: 'Tudo em nossas mãos', en: 'Everything in our hands', he: 'הכל בטיפולנו' }[language],
    completed: { pt: 'Recentemente concluído', en: 'Recently completed', he: 'הושלם לאחרונה' }[language],
    seeAll: { pt: 'Ver todos →', en: 'See all →', he: '→ הצג הכל' }[language],
    awaitingChip: { pt: '🔔 Aguardando você', en: '🔔 Awaiting you', he: '🔔 ממתין לך' }[language],
    quickAccess: { pt: 'Acesso rápido', en: 'Quick access', he: 'גישה מהירה' }[language],
    takeMeHome: { pt: '🏠 Levar-me para casa', en: '🏠 Take me home', he: '🏠 קחו אותי הביתה' }[language],
    contactsTile: { pt: 'Contatos', en: 'Contacts', he: 'אנשי קשר' }[language],
    contactsTileSub: { pt: 'Ligações em um toque', en: 'One-tap calls', he: 'חיוג בלחיצה אחת' }[language],
    connectionsTile: { pt: 'Conexões', en: 'Connections', he: 'חיבורים' }[language],
    connectionsTileSub: { pt: 'Portais dos provedores', en: 'Provider portals', he: 'פורטלים של ספקים' }[language]
  };

  return (
    <div className="space-y-6 pb-28 pt-4 px-4">
      {/* A — Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-end justify-between gap-3 pt-4"
      >
        <h1 className="font-serif-display italic text-[32px] leading-[1.15] text-[#0E3F3A]">
          {greeting[language]}
        </h1>
        <span className="text-[13px] text-[#999999] mb-1.5 capitalize shrink-0">{today}</span>
      </motion.div>

      {/* B — Daily briefing card */}
      <motion.div
        {...sectionAnim(0.2)}
        className={`relative bg-white rounded-2xl p-[18px] shadow-[0_2px_16px_rgba(14,63,58,0.08)] overflow-hidden`}
      >
        <motion.span
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-[3px] bg-[#B8912E]`}
        />
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#B8912E] mb-2" style={{ fontFamily: 'Inter' }}>
          {t.briefingLabel}
        </p>
        {editingBriefing ? (
          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              className="w-full text-[15px] font-serif-display italic leading-[1.8] text-[#2C2C2C] border border-[#E2DDD5] rounded-xl p-3 focus:outline-none focus:border-[#145A52]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateBriefingText({ ...briefing.prose, [language]: draft });
                  setEditingBriefing(false);
                }}
                className="px-4 py-1.5 bg-[#145A52] text-white text-[13px] font-semibold rounded-full"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditingBriefing(false)}
                className="px-4 py-1.5 text-[#6B7280] text-[13px] font-medium rounded-full border border-[#E2DDD5]"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              onClick={() => {
                if (isOperator) {
                  setDraft(briefingText);
                  setEditingBriefing(true);
                }
              }}
              className={`font-serif-display italic text-[18px] text-[#2C2C2C] leading-[1.9] ${
                isBriefingCollapsed && showReadMore ? 'line-clamp-3' : ''
              } ${isOperator ? 'cursor-text' : ''}`}
            >
              {briefingText}
            </p>
            {showReadMore && (
              <button
                onClick={() => setIsBriefingCollapsed(!isBriefingCollapsed)}
                className="text-[#145A52] text-[13px] mt-2 font-medium"
              >
                {isBriefingCollapsed ? t.readMore : t.readLess}
              </button>
            )}
          </>
        )}
      </motion.div>

      {/* C — Requires your attention */}
      <motion.section {...sectionAnim(0.28)} className="space-y-3">
        {attentionCases.length > 0 ? (
          <>
            <h2 className="font-serif-display text-[18px] text-[#0E3F3A]">
              <span className="text-[#B8912E]">— </span>
              {t.attention}
            </h2>
            <div className="bg-[#FBF6E8] rounded-xl p-3 space-y-2.5">
              {attentionCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    hapticTap();
                    navigateToCaseDetail(c.id);
                  }}
                  className={`bg-white rounded-2xl p-[14px] shadow-[0_2px_10px_rgba(14,63,58,0.06)] cursor-pointer active:scale-[0.99] transition-transform ${
                    isRTL ? 'border-r-4 border-r-[#B8912E]' : 'border-l-4 border-l-[#B8912E]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-full bg-[#EEF7F5] flex items-center justify-center text-lg shrink-0">
                        {c.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="font-serif-display text-[17px] text-[#0E3F3A] leading-tight truncate">
                          {c.title[language] || c.title.pt}
                        </p>
                        <p className="text-[13px] text-[#6B7280] truncate">{c.nextStep[language] || c.nextStep.pt}</p>
                      </div>
                    </div>
                    <span className="lami-pulse text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FFF8E7] text-[#B8912E] border border-[#B8912E] whitespace-nowrap shrink-0">
                      {t.awaitingChip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <h3 className="font-serif-display italic text-[22px] text-[#145A52]">
              {t.empty} <span className="lami-sparkle">✨</span>
            </h3>
          </div>
        )}
      </motion.section>

      {/* G — Quick access: Take me home + Contacts/Connections tiles */}
      <motion.section {...sectionAnim(0.32)} className="space-y-3">
        <h2 className="font-serif-display text-[18px] text-[#0E3F3A]">
          <span className="text-[#B8912E]">— </span>
          {t.quickAccess}
        </h2>

        <a
          href={HOME_CONFIG.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => hapticTap()}
          className="block bg-white rounded-2xl p-[14px] shadow-[0_2px_16px_rgba(14,63,58,0.08)] active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-serif-display text-[17px] font-semibold text-[#0E3F3A] leading-tight">
                {t.takeMeHome}
              </p>
              <p className="text-[12px] text-[#6B7280] truncate mt-0.5">{HOME_CONFIG.label}</p>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-[#B8912E] shrink-0 ${isRTL ? 'rotate-180' : ''}`}
            />
          </div>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              hapticTap();
              setCurrentView('contacts');
            }}
            className="bg-white rounded-2xl p-[14px] shadow-[0_2px_16px_rgba(14,63,58,0.08)] active:scale-[0.98] transition-transform text-start"
          >
            <span className="w-10 h-10 rounded-full bg-[#EEF7F5] flex items-center justify-center mb-2">
              <Phone className="w-4 h-4 text-[#145A52]" />
            </span>
            <p className="font-serif-display text-[16px] font-semibold text-[#0E3F3A] leading-tight">
              {t.contactsTile}
            </p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">{t.contactsTileSub}</p>
          </button>

          <button
            onClick={() => {
              hapticTap();
              setCurrentView('connections');
            }}
            className="bg-white rounded-2xl p-[14px] shadow-[0_2px_16px_rgba(14,63,58,0.08)] active:scale-[0.98] transition-transform text-start"
          >
            <span className="w-10 h-10 rounded-full bg-[#FBF6E8] flex items-center justify-center mb-2">
              <Link2 className="w-4 h-4 text-[#B8912E]" />
            </span>
            <p className="font-serif-display text-[16px] font-semibold text-[#0E3F3A] leading-tight">
              {t.connectionsTile}
            </p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">{t.connectionsTileSub}</p>
          </button>
        </div>
      </motion.section>

      {/* D — Upcoming this week */}
      <motion.section {...sectionAnim(0.36)} className="space-y-3">
        <h2 className="font-serif-display text-[18px] text-[#0E3F3A]">
          <span className="text-[#B8912E]">— </span>
          {t.week}
        </h2>
        <WeekStrip />
      </motion.section>

      {/* E — Proactive radar suggestion (max 1) */}
      {activeRadarSuggestion && (
        <motion.section {...sectionAnim(0.44)}>
          <RadarCard keyDate={activeRadarSuggestion} />
        </motion.section>
      )}

      {/* F — Recently completed */}
      {completedCases.length > 0 && (
        <motion.section {...sectionAnim(0.52)} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-[18px] text-[#0E3F3A]">
              <span className="text-[#B8912E]">— </span>
              {t.completed}
            </h2>
            <button
              onClick={() => setCurrentView('archive')}
              className="text-[13px] text-[#145A52] font-medium"
            >
              {t.seeAll}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {completedCases.map((c) => (
              <button
                key={c.id}
                onClick={() => navigateToCaseDetail(c.id)}
                className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-[13px] text-[#6B7280] shadow-[0_1px_6px_rgba(14,63,58,0.06)]"
              >
                <span>✔️</span>
                <span className="max-w-[180px] truncate">{c.title[language] || c.title.pt}</span>
              </button>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};
