import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink } from 'lucide-react';

export const ProofModal: React.FC = () => {
  const { selectedImageModalUrl, closeImageModal } = useApp();

  if (!selectedImageModalUrl) return null;

  return (
    <div
      onClick={closeImageModal}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-[#1C2826] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
      >
        <button
          onClick={closeImageModal}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-2 bg-black flex items-center justify-center min-h-[300px] max-h-[80vh]">
          <img
            src={selectedImageModalUrl}
            alt="High-resolution proof"
            className="max-h-[75vh] w-auto object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-4 bg-[#0E3F3A] text-white flex items-center justify-between text-xs">
          <span className="font-serif-display font-semibold text-[#B8912E]">
            Official Operation Proof · LaMi
          </span>
          <a
            href={selectedImageModalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#E2DDD5] hover:text-white underline"
          >
            <span>Abrir original</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
