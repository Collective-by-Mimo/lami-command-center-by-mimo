/**
 * LaMi Bills (Contas) — utility accounts as quiet-luxury cards:
 * #7B9E87 left strip, tap-to-copy account numbers (gold toast), status chips
 * (autopay teal / investigating gold pulse), Lootah call button, security note.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Copy, PhoneCall, ShieldCheck, Zap, Flame, Snowflake, Wifi, Receipt, Search, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';

interface BillRow {
  id: string;
  icon: React.ReactNode;
  name: string;
  detail: string;
  copyValue?: string;
  copyLabel?: string;
  status: 'autopay' | 'investigating' | 'ok';
  statusText: string;
  phone?: string;
}

const BILLS: BillRow[] = [
  {
    id: 'dewa',
    icon: <Zap className="w-5 h-5" />,
    name: 'DEWA · Electricity & Water',
    detail: 'Contract account: 2060863309 · Auto-pay active',
    copyValue: '2060863309',
    copyLabel: 'DEWA',
    status: 'autopay',
    statusText: 'Auto-pay'
  },
  {
    id: 'tasleem',
    icon: <Snowflake className="w-5 h-5" />,
    name: 'Tasleem · District Cooling',
    detail: 'Customer: 2144145 · −3,216 AED credit under review',
    copyValue: '2144145',
    copyLabel: 'Tasleem',
    status: 'investigating',
    statusText: 'Investigating'
  },
  {
    id: 'lootah',
    icon: <Flame className="w-5 h-5" />,
    name: 'Lootah Gas · Central Gas',
    detail: 'Center: 800 5224 · 24/7 support',
    status: 'ok',
    statusText: 'Up to date',
    phone: '+97158 592 9669'
  },
  {
    id: 'justlife',
    icon: <Wifi className="w-5 h-5" />,
    name: 'Just Life · Home Services',
    detail: 'Weekly cleaning subscription · Thursdays, 9am',
    status: 'autopay',
    statusText: 'Subscription active'
  }
];

export const UtilitiesPanel: React.FC = () => {
  const { showToast, isRTL } = useApp();

  const handleCopy = (text: string, label: string) => {
    hapticTap();
    navigator.clipboard.writeText(text);
    showToast(`${label}: ${text} Copied to clipboard!`);
  };

  return (
    <div className="space-y-4 pb-28 pt-6 px-4">
      {/* Panel Header */}
      <div>
        <h1 className="font-serif-display text-[28px] text-[#0E3F3A] flex items-center gap-2.5">
          <Receipt className="w-6 h-6 text-[#B8912E]" strokeWidth={1.75} />
          Your Bills & Utilities
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">Quick access to account numbers and direct operational contacts</p>
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
                <p className="font-sans text-[13px] text-[#888888] mt-0.5">{bill.detail}</p>
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
                {bill.statusText}
              </span>

              <div className="flex items-center gap-2">
                {bill.copyValue && (
                  <button
                    onClick={() => handleCopy(bill.copyValue!, bill.copyLabel!)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#F7F5F1] rounded-full text-[#145A52] hover:bg-[#145A52] hover:text-white transition-colors active:scale-[0.96]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Number</span>
                  </button>
                )}
                {bill.phone && (
                  <a
                    href={`tel:${bill.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#145A52] text-white rounded-full hover:bg-[#0E3F3A] transition-colors active:scale-[0.96]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#B8912E]" />
                    <span>Call Now</span>
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
        <p className="leading-snug">Secure Environment: Personal documents and Emirates ID are strictly protected and never displayed here by safety policy.</p>
      </motion.div>
    </div>
  );
};
