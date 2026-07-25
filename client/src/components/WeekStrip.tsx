/**
 * LaMi — "Esta semana" horizontal day pills (Mon..Sun), 48px pills, dot when
 * events exist, teal active day, tap to expand items via AnimatePresence.
 */
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

interface DayEvent {
  id: string;
  emoji: string;
  label: string;
  sub?: string;
  caseId?: string;
}

export const WeekStrip: React.FC = () => {
  const { language, cases, keyDates, navigateToCaseDetail } = useApp();
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const locale = language === 'he' ? 'he-IL' : language === 'en' ? 'en-US' : 'pt-BR';

  const days = useMemo(() => {
    const out: { key: string; date: Date; events: DayEvent[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const events: DayEvent[] = [];
      keyDates.forEach((kd) => {
        if (kd.status === 'dismissed') return;
        if (kd.date === key) {
          events.push({
            id: `kd-${kd.id}`,
            emoji: kd.category === 'bill' ? '⚡' : kd.category === 'lease' ? '🏠' : kd.category === 'document' ? '🛂' : '📅',
            label: kd.label[language] || kd.label.pt
          });
        }
      });
      cases.forEach((c) => {
        if (c.dueDate === key && c.clientState !== '✔️ Concluído') {
          events.push({
            id: `case-${c.id}`,
            emoji: c.emoji,
            label: c.title[language] || c.title.pt,
            sub: c.nextStep[language] || c.nextStep.pt,
            caseId: c.id
          });
        }
      });
      out.push({ key, date: d, events });
    }
    return out;
  }, [cases, keyDates, language]);

  const activeEvents = days.find((d) => d.key === activeDay)?.events || [];

  const emptyDayText = {
    pt: 'Dia tranquilo — nada agendado.',
    en: 'A calm day — nothing scheduled.',
    he: 'יום רגוע — אין אירועים מתוכננים.'
  }[language];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" dir="ltr">
        {days.map(({ key, date, events }) => {
          const isActive = activeDay === key;
          const dayName = date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '');
          return (
            <button
              key={key}
              onClick={() => {
                hapticTap();
                setActiveDay(isActive ? null : key);
              }}
              className={`w-12 shrink-0 rounded-2xl py-2 flex flex-col items-center gap-0.5 transition-colors ${
                isActive ? 'bg-[#145A52] text-white' : 'bg-white text-[#0E3F3A] border border-[#E7E1D5]'
              }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">{dayName}</span>
              <span className="text-[15px] font-semibold">{date.getDate()}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  events.length > 0 ? (isActive ? 'bg-[#B8912E]' : 'bg-[#B8912E]') : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {activeDay && (
          <motion.div
            key={activeDay}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {activeEvents.length === 0 ? (
                <p className="text-[13px] text-[#6B7280] italic px-1 py-2">{emptyDayText}</p>
              ) : (
                activeEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => ev.caseId && navigateToCaseDetail(ev.caseId)}
                    className={`lami-card !p-3.5 flex items-center gap-3 ${ev.caseId ? 'cursor-pointer active:scale-[0.99]' : ''}`}
                  >
                    <span className="w-9 h-9 rounded-full bg-[#EEF7F5] flex items-center justify-center text-base shrink-0">
                      {ev.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#1A1A1A] truncate">{ev.label}</p>
                      {ev.sub && <p className="text-[12px] text-[#6B7280] truncate">{ev.sub}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
