/**
 * LaMi Bills (Contas) — utility accounts as quiet-luxury cards:
 * #7B9E87 left strip, tap-to-copy account numbers (gold toast), status chips
 * (autopay teal / investigating gold pulse), Lootah call button, security note.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { Copy, PhoneCall, ShieldCheck, Zap, Flame, Snowflake, Wifi, Receipt, Search, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

interface BillRow {
  id: string;
  icon: React.ReactNode;
  name: string;
  detail: { pt: string; en: string; he: string };
  copyValue?: string;
  copyLabel?: string;
  status: 'autopay' | 'investigating' | 'ok';
  statusText: { pt: string; en: string; he: string };
  phone?: string;
}

const BILLS: BillRow[] = [
  {
    id: 'dewa',
    icon: <Zap className="w-5 h-5" />,
    name: 'DEWA · Electricity & Water',
    detail: {
      pt: 'Conta contrato: 2060863309 · Débito automático ativo',
      en: 'Contract account: 2060863309 · Auto-pay active',
      he: 'חשבון חוזה: 2060863309 · חיוב אוטומטי פעיל'
    },
    copyValue: '2060863309',
    copyLabel: 'DEWA',
    status: 'autopay',
    statusText: { pt: 'Débito automático', en: 'Auto-pay', he: 'חיוב אוטומטי' }
  },
  {
    id: 'tasleem',
    icon: <Snowflake className="w-5 h-5" />,
    name: 'Tasleem · District Cooling',
    detail: {
      pt: 'Cliente: 2144145 · Crédito de −3.216 AED em análise',
      en: 'Customer: 2144145 · −3,216 AED credit under review',
      he: 'לקוח: 2144145 · זיכוי של ‎−3,216 AED בבדיקה'
    },
    copyValue: '2144145',
    copyLabel: 'Tasleem',
    status: 'investigating',
    statusText: { pt: 'Em investigação', en: 'Investigating', he: 'בבדיקה' }
  },
  {
    id: 'lootah',
    icon: <Flame className="w-5 h-5" />,
    name: 'Lootah Gas · Gás Central',
    detail: {
      pt: 'Central: 800 5224 · Suporte 24/7',
      en: 'Center: 800 5224 · 24/7 support',
      he: 'מוקד: 800 5224 · תמיכה 24/7'
    },
    status: 'ok',
    statusText: { pt: 'Em dia', en: 'Up to date', he: 'מעודכן' },
    phone: '+97158 592 9669'
  },
  {
    id: 'justlife',
    icon: <Wifi className="w-5 h-5" />,
    name: 'Just Life · Home Services',
    detail: {
      pt: 'Assinatura semanal de limpeza · Quintas, 9h',
      en: 'Weekly cleaning subscription · Thursdays, 9am',
      he: 'מנוי ניקיון שבועי · ימי חמישי, 9:00'
    },
    status: 'autopay',
    statusText: { pt: 'Assinatura ativa', en: 'Subscription active', he: 'מנוי פעיל' }
  }
];

export const UtilitiesPanel: React.FC = () => {
  const { language, showToast, isRTL } = useApp();

  const handleCopy = (text: string, label: string) => {
    hapticTap();
    navigator.clipboard.writeText(text);
    showToast(`${label}: ${text} ${getTranslation('copiedSuccess', language)}`);
  };

  return (
    <div className="space-y-4 pb-28 pt-6 px-4">
      {/* Panel Header */}
      <div>
        <h1 className="font-serif-display text-[28px] text-[#0E3F3A] flex items-center gap-2.5">
          <Receipt className="w-6 h-6 text-[#B8912E]" strokeWidth={1.75} />
          {getTranslation('utilitiesTitle', language)}
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">{getTranslation('utilitiesSub', language)}</p>
      </div>

      {/* Utility cards */}
      <div className="space-y-3">
        {BILLS.map((bill, i) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className={`bg-white rounded-[16px] px-4 py-[14px] border border-[#E7E1D5] flex flex-col gap-3 ${
              isRTL ? 'border-r-4 border-r-[#7B9E87]' : 'border-l-4 border-l-[#7B9E87]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-[40px] h-[40px] rounded-full bg-[#145A52] flex items-center justify-center text-white shrink-0">
                {bill.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif-display text-[18px] font-semibold text-[#0E3F3A] leading-tight truncate">
                  {bill.name}
                </h3>
                <p className="font-sans text-[13px] text-[#888888] mt-0.5">{bill.detail[language]}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                  bill.status === 'investigating'
                    ? 'bg-[#FBF6E8] text-[#B8912E] border border-[#B8912E]/40 lami-status-pulse'
                    : 'bg-[#EEF7F5] text-[#145A52] border border-[#145A52]/20'
                }`}
              >
                {bill.status === 'investigating' ? (
                  <Search className="w-3 h-3" strokeWidth={2.25} />
                ) : (
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                )}
                {bill.statusText[language]}
              </span>

              <div className="flex items-center gap-2">
                {bill.copyValue && (
                  <button
                    onClick={() => handleCopy(bill.copyValue!, bill.copyLabel!)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#F7F5F1] rounded-full text-[#145A52] hover:bg-[#145A52] hover:text-white transition-colors active:scale-[0.96]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{getTranslation('copyNumber', language)}</span>
                  </button>
                )}
                {bill.phone && (
                  <a
                    href={`tel:${bill.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#145A52] text-white rounded-full hover:bg-[#0E3F3A] transition-colors active:scale-[0.96]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#B8912E]" />
                    <span>{getTranslation('callNow', language)}</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Rule Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#EEF7F5] p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-[#145A52]"
      >
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-snug">{getTranslation('securityNotice', language)}</p>
      </motion.div>
    </div>
  );
};
