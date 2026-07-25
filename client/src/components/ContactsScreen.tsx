/**
 * LaMi Contacts — categorized tap-to-call directory (tel: links) driven by
 * the editable CONTACT_CATEGORIES config. Mimo entry also exposes WhatsApp.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { CONTACT_CATEGORIES } from '../config/appConfig';
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

export const ContactsScreen: React.FC = () => {
  const { language, setCurrentView, isRTL } = useApp();

  const t = {
    title: { pt: 'Contatos', en: 'Contacts', he: 'אנשי קשר' }[language],
    subtitle: {
      pt: 'Toque em um número para ligar imediatamente',
      en: 'Tap a number to call instantly',
      he: 'הקישו על מספר לחיוג מיידי'
    }[language],
    back: { pt: 'Voltar ao Briefing', en: 'Back to Briefing', he: 'חזרה לתדריך' }[language]
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
          <Phone className="w-6 h-6 text-[#B8912E]" strokeWidth={1.75} />
          {t.title}
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-1">{t.subtitle}</p>
      </div>

      <div className="space-y-6">
        {CONTACT_CATEGORIES.map((category, idx) => (
          <motion.section
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 * idx, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-2.5"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-[13px] font-semibold text-[#999999] tracking-[0.5px] shrink-0 font-serif-display">
                {category.emoji} {category.label[language] || category.label.pt}
              </h2>
              <span className="flex-1 h-px bg-[#E2DDD5]" />
            </div>

            <div className="space-y-2.5">
              {category.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl px-4 py-3.5 border border-[#E7E1D5] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-serif-display text-[17px] font-semibold text-[#0E3F3A] leading-tight truncate">
                      {entry.name}
                    </p>
                    <p className="font-mono text-[12px] text-[#6B7280] mt-0.5">
                      {entry.phones.map((p) => p.display).join(' · ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {entry.phones.map((phone) => (
                      <a
                        key={phone.tel}
                        href={`tel:${phone.tel}`}
                        onClick={() => hapticTap()}
                        aria-label={`${entry.name} — ${phone.display}`}
                        className="w-10 h-10 rounded-full bg-[#145A52] text-white flex items-center justify-center active:scale-95 transition-transform border border-[#E7E1D5]"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    ))}
                    {entry.whatsapp && (
                      <a
                        href={`https://wa.me/${entry.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => hapticTap()}
                        aria-label={`${entry.name} — WhatsApp`}
                        className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center active:scale-95 transition-transform shadow-[0_2px_10px_rgba(37,211,102,0.35)]"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};
