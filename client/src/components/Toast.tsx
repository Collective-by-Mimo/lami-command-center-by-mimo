import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-[#0E3F3A] text-white px-4 py-3 rounded-2xl border border-[#B8912E]/50 shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-bounce-short">
      <Sparkles className="w-4 h-4 text-[#B8912E] shrink-0" />
      <span className="flex-1 text-[#F7F5F1]">{toastMessage}</span>
    </div>
  );
};
