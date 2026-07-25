/**
 * LaMi Services — the full service catalogue rendered in-app so the whole
 * offering is visible for the presentation, even where a service isn't
 * operational yet. Quiet-luxury: hairline cards, Cormorant headings, Inter
 * body, teal/gold/cream tokens. English-only, LTR.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_DOMAINS, SERVICE_STATUS_LABEL, PROPOSITION, ServiceStatus } from '../config/serviceCatalogue';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

const badgeStyle: Record<ServiceStatus, string> = {
  live: 'bg-[#145A52] text-white border-[#145A52]',
  ready: 'bg-white text-[#B8912E] border-[#B8912E]',
  phase2: 'bg-[#F1F1EF] text-[#8A8A85] border-[#D9D5CC]'
};

const dotStyle: Record<ServiceStatus, string> = {
  live: 'bg-[#145A52]',
  ready: 'bg-[#B8912E]',
  phase2: 'bg-[#C7C2B8]'
};

export const ServicesScreen: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="space-y-6 pb-28 pt-4 px-4">
      <button
        onClick={() => {
          hapticTap();
          setCurrentView('briefing');
        }}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#145A52] bg-white px-3.5 py-2 rounded-full border border-[#E7E1D5] active:scale-[0.97] transition-transform"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Briefing</span>
      </button>

      {/* Proposition */}
      <div>
        <h1 className="font-serif-display text-[28px] text-[#0E3F3A] flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-[#B8912E]" strokeWidth={1.75} />
          Services
        </h1>
        <p className="font-serif-display italic text-[17px] text-[#2C2C2C] leading-snug mt-2">
          {PROPOSITION.headline}
        </p>
        <p className="text-[13px] text-[#6B7280] mt-1">{PROPOSITION.sub}</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
        {(['live', 'ready', 'phase2'] as ServiceStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dotStyle[s]}`} />
            {SERVICE_STATUS_LABEL[s]}
          </span>
        ))}
      </div>

      {/* Domains */}
      <div className="space-y-5">
        {SERVICE_DOMAINS.map((domain, idx) => (
          <motion.section
            key={domain.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * idx, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-2xl border border-[#E7E1D5] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#F0EDE6] flex items-center gap-2.5">
              <span className="text-[18px]">{domain.emoji}</span>
              <h2 className="font-serif-display text-[19px] font-semibold text-[#0E3F3A]">{domain.title}</h2>
            </div>
            <ul>
              {domain.services.map((svc, i) => (
                <li
                  key={i}
                  className={`px-4 py-3 flex items-start justify-between gap-3 ${
                    i > 0 ? 'border-t border-[#F4F1EA]' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[14px] text-[#1A1A1A] leading-snug">{svc.name}</p>
                    {svc.note && (
                      <p className="text-[12px] text-[#B8912E] mt-0.5 italic">{svc.note}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badgeStyle[svc.status]}`}
                  >
                    {SERVICE_STATUS_LABEL[svc.status]}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>

      <p className="text-[12px] text-[#9AA3A0] text-center italic pt-2">
        Everything runs on one system. She sees a clear, current answer — the work stays out of sight.
      </p>
    </div>
  );
};
