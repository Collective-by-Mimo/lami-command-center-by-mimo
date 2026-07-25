/**
 * LaMi Case Detail — slides in from the right (Framer Motion), quiet-luxury
 * cards, quotation comparison with gold "Recomendado" star, morphing approve
 * buttons, completion proof, story timeline (operator can add updates).
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { CaseItem, I18nText } from '../types';
import { SubtaskProgressChart } from './SubtaskProgressChart';
import { motion, AnimatePresence } from 'motion/react';
import { notifyCaseCompleted, notifyAwaitingApproval, openMimoCaseWhatsApp } from '../services/whatsapp';
import { hapticSuccess, hapticTap } from '../utils/haptics';
import {
  ArrowLeft,
  Clock,
  Star,
  Check,
  Send,
  ShieldCheck,
  Sparkles,
  Award,
  MessageCircle
} from 'lucide-react';

export const CaseDetailScreen: React.FC = () => {
  const {
    selectedCaseId,
    cases,
    language,
    setCurrentView,
    resolveDecision,
    addTimelineUpdate,
    updateCaseDetails,
    markComplete,
    isOperator,
    openImageModal,
    showToast,
    isRTL
  } = useApp();

  const caseItem = cases.find((c) => c.id === selectedCaseId);

  // New timeline entry input state for operator
  const [newTimelineText, setNewTimelineText] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [approvedOptionId, setApprovedOptionId] = useState<string | null>(null);

  // Mark complete modal/input state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [proofNoteText, setProofNoteText] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');

  if (!caseItem) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm text-[#62726F]">Caso não encontrado.</p>
        <button
          onClick={() => setCurrentView('cases')}
          className="text-xs font-semibold bg-[#145A52] text-white px-4 py-2 rounded-xl"
        >
          {getTranslation('backToCases', language)}
        </button>
      </div>
    );
  }

  const titleText = caseItem.title[language] || caseItem.title.pt;
  const nextStepText = caseItem.nextStep[language] || caseItem.nextStep.pt;

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineText.trim()) return;

    const content: I18nText = {
      pt: newTimelineText,
      en: newTimelineText,
      he: newTimelineText
    };

    const photos = photoUrlInput.trim() ? [photoUrlInput.trim()] : [];
    addTimelineUpdate(caseItem.id, content, photos);
    setNewTimelineText('');
    setPhotoUrlInput('');
  };

  const handleConfirmComplete = () => {
    if (!proofNoteText.trim()) {
      showToast('Por favor, informe a nota do comprovante para concluir.');
      return;
    }

    const proofNote: I18nText = {
      pt: proofNoteText,
      en: proofNoteText,
      he: proofNoteText
    };

    markComplete(caseItem.id, proofNote, proofPhotoUrl || undefined);
    notifyCaseCompleted(caseItem.title.pt);
    hapticSuccess();
    setShowCompleteModal(false);
  };

  const handleApprove = (optId: string) => {
    hapticSuccess();
    setApprovedOptionId(optId);
    // Morph to checkmark, then resolve after the animation beat
    setTimeout(() => {
      resolveDecision(caseItem.id, optId);
    }, 900);
  };

  return (
    <motion.div
      initial={{ x: isRTL ? -60 : 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-5 pb-28 pt-4 px-4"
    >
      
      {/* Top Back Navigation Bar */}
      <button
        onClick={() => {
          hapticTap();
          setCurrentView('cases');
        }}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#145A52] bg-white px-3.5 py-2 rounded-full border border-[#E7E1D5] active:scale-[0.97] transition-transform"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        <span>{getTranslation('backToCases', language)}</span>
      </button>

      {/* Case Header Card */}
      <div className="lami-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={() => {
              hapticTap();
              openMimoCaseWhatsApp(titleText, language);
            }}
            aria-label="WhatsApp Mimo"
            className="order-2 shrink-0 w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center active:scale-90 transition-transform shadow-[0_2px_10px_rgba(37,211,102,0.35)]"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl p-3 bg-[#EEF7F5] rounded-2xl">
              {caseItem.emoji}
            </span>
            <div>
              <h1 className="font-serif-display text-[28px] font-semibold text-[#0E3F3A] leading-tight">
                {titleText}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className={`text-xs font-semibold px-3 py-0.5 rounded-full ${
                    caseItem.clientState === '🔔 Aguardando você'
                      ? 'bg-[#FBF6E8] text-[#B8912E] border border-[#B8912E]/40 lami-pulse'
                      : caseItem.clientState === '✔️ Concluído'
                        ? 'bg-[#F1F1EF] text-[#6B7280] border border-[#D5D5D0]'
                        : 'bg-[#EEF7F5] text-[#145A52] border border-[#145A52]/20'
                  }`}
                >
                  {caseItem.clientState}
                </span>

                {isOperator && (
                  <span className="text-xs font-mono bg-[#0E3F3A] text-white px-2.5 py-0.5 rounded-full">
                    Interno: {caseItem.internalStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next Step Box */}
        <div className="bg-[#EEF7F5] p-4 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold text-[#145A52] uppercase tracking-wider block">
            {getTranslation('nextStepLabel', language)}
          </span>
          <p className="text-[14px] text-[#1A1A1A] font-medium leading-[1.6]">
            {nextStepText}
          </p>
        </div>

        {/* Operator controls inline */}
        {isOperator && (
          <div className="pt-2 border-t border-[#E2DDD5] flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#62726F]">Estado Cliente:</span>
              <select
                value={caseItem.clientState}
                onChange={(e) => {
                  updateCaseDetails({
                    ...caseItem,
                    clientState: e.target.value as any
                  });
                }}
                className="bg-[#F7F5F1] border border-[#E2DDD5] rounded-lg px-2 py-1 font-semibold text-[#145A52]"
              >
                <option value="🔔 Aguardando você">🔔 Aguardando você</option>
                <option value="✅ Em nossas mãos">✅ Em nossas mãos</option>
                <option value="✔️ Concluído">✔️ Concluído</option>
              </select>
            </div>

            {caseItem.clientState !== '✔️ Concluído' && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="bg-[#B8912E] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#967422] transition flex items-center gap-1 shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{getTranslation('markComplete', language)}</span>
              </button>
            )}
            {caseItem.clientState === '✅ Em nossas mãos' && caseItem.decision && !caseItem.decision.resolvedOptionId && (
              <button
                onClick={() => {
                  updateCaseDetails({ ...caseItem, clientState: '🔔 Aguardando você' });
                  notifyAwaitingApproval(caseItem.title.pt);
                  showToast('Cliente notificada — aguardando aprovação.');
                }}
                className="bg-[#145A52] text-white px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 shadow-xs"
              >
                🔔 <span>Pedir aprovação</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subtask Progress Visualization Component (Recharts) */}
      <SubtaskProgressChart caseItem={caseItem} />

      {/* Quotations Comparison Table (If quotations exist) */}
      {caseItem.quotations && caseItem.quotations.length > 0 && (
        <section className="lami-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] flex items-center gap-2">
              <span>{getTranslation('quotationTitle', language)}</span>
            </h2>
          </div>

          <div className="space-y-3">
            {caseItem.quotations.map((q) => {
              const qTitle = q.title[language] || q.title.pt;
              const qObs = q.observation ? (q.observation[language] || q.observation.pt) : '';
              const qReason = q.recommendationReason ? (q.recommendationReason[language] || q.recommendationReason.pt) : '';

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    q.isRecommended
                      ? 'bg-[#FBF6E8] border-[#B8912E]/50 ring-1 ring-[#B8912E]/20'
                      : 'bg-[#F7F5F1] border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {q.isRecommended && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#B8912E] px-2.5 py-0.5 rounded-full mb-1">
                          <Star className="w-3 h-3 text-white fill-white" />
                          {getTranslation('recommendedBadge', language)}
                        </span>
                      )}
                      <h3 className="font-serif-display font-semibold text-[18px] text-[#0E3F3A]">
                        {qTitle}
                      </h3>
                      {qObs && <p className="text-xs text-[#62726F]">{qObs}</p>}
                      {qReason && (
                        <p className="text-xs text-[#145A52] font-semibold pt-1">
                          💡 {qReason}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-lg font-bold text-[#0E3F3A]">
                        {q.priceAED} AED
                      </span>
                      {q.timeline && (
                        <span className="block text-[11px] text-[#62726F]">
                          {q.timeline[language] || q.timeline.pt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Decision Inline Approval Button */}
          {caseItem.decision && !caseItem.decision.resolvedOptionId && (
            <div className="pt-2">
              <div className="bg-[#FBF6E8] p-4 rounded-2xl border border-[#B8912E]/30 space-y-3">
                <p className="text-xs text-[#1C2826] font-medium leading-relaxed">
                  {caseItem.decision.prompt[language] || caseItem.decision.prompt.pt}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {caseItem.decision.options.map((opt) => {
                    const isApproved = approvedOptionId === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        layout
                        disabled={!!approvedOptionId}
                        onClick={() => handleApprove(opt.id)}
                        animate={
                          isApproved
                            ? { backgroundColor: '#B8912E', scale: [1, 1.04, 1] }
                            : { backgroundColor: '#145A52' }
                        }
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-90"
                      >
                        {isApproved ? (
                          <motion.span
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                            className="flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4 text-white" />
                            <span>{language === 'pt' ? 'Aprovado ✓' : language === 'en' ? 'Approved ✓' : '✓ אושר'}</span>
                          </motion.span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#B8912E]" />
                            <span>{opt.label[language] || opt.label.pt}</span>
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Completion Proof Section if completed */}
      {caseItem.completionProof && (
        <div className="bg-gradient-to-br from-[#145A52] to-[#0E3F3A] text-white rounded-3xl p-6 shadow-md border border-[#B8912E]/40 space-y-3">
          <div className="flex items-center gap-2 text-[#B8912E] font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>{getTranslation('proofTitle', language)}</span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-[#F7F5F1]">
            {caseItem.completionProof.note[language] || caseItem.completionProof.note.pt}
          </p>
          {caseItem.completionProof.photoUrl && (
            <div
              onClick={() => openImageModal(caseItem.completionProof!.photoUrl!)}
              className="relative rounded-2xl overflow-hidden border border-white/20 max-h-48 cursor-pointer group"
            >
              <img
                src={caseItem.completionProof.photoUrl}
                alt="Comprovante"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white font-medium bg-black/60 px-3 py-1.5 rounded-full">
                  Ampliar Comprovante
                </span>
              </div>
            </div>
          )}
          <span className="text-[10px] text-[#E2DDD5]/70 block font-mono">
            Concluído em: {caseItem.completionProof.completedAt}
          </span>
        </div>
      )}

      {/* Story Timeline (Newest first) */}
      <section className="lami-card space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
          <h2 className="font-serif-display text-[22px] font-semibold text-[#0E3F3A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#145A52]" />
            <span>{getTranslation('timelineTitle', language)}</span>
          </h2>
          <span className="text-xs text-[#62726F] font-mono">
            {caseItem.timeline.length} registros
          </span>
        </div>

        {/* Operator Add Timeline Form */}
        {isOperator && (
          <form onSubmit={handleAddTimeline} className="bg-[#F7F5F1] p-4 rounded-2xl border border-[#E2DDD5] space-y-3">
            <span className="text-xs font-semibold text-[#145A52] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B8912E]" />
              Nova Atualização do Operador (Mimo)
            </span>
            <textarea
              value={newTimelineText}
              onChange={(e) => setNewTimelineText(e.target.value)}
              placeholder="Digite o andamento ou novidade do caso..."
              rows={2}
              className="w-full p-3 bg-white border border-[#E2DDD5] rounded-xl text-xs text-[#1C2826] focus:outline-none focus:border-[#145A52]"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="URL da Foto / Comprovante (opcional)"
                className="flex-1 p-2 bg-white border border-[#E2DDD5] rounded-xl text-xs text-[#1C2826]"
              />
              <button
                type="submit"
                className="bg-[#145A52] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#0E3F3A] transition flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>
          </form>
        )}

        {/* Timeline Items */}
        <div className="relative pl-4 border-l-2 border-[#145A52]/20 space-y-6">
          {caseItem.timeline.map((entry) => {
            const contentText = entry.content[language] || entry.content.pt;

            return (
              <div key={entry.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-[#145A52] border-2 border-white shadow-xs" />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#62726F]">
                    <span className="font-mono font-semibold text-[#145A52]">{entry.date}</span>
                    {entry.time && <span>· {entry.time}</span>}
                    <span className="text-[10px] bg-[#E2DDD5]/60 px-1.5 py-0.2 rounded text-[#3E4E4B]">
                      {entry.addedBy === 'operator' ? 'Mimo' : 'Layla'}
                    </span>
                  </div>

                  <p className="text-xs text-[#1C2826] leading-relaxed bg-[#F7F5F1]/60 p-3 rounded-xl border border-[#E2DDD5]/60">
                    {contentText}
                  </p>

                  {/* Photos attached */}
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="flex gap-2 pt-1 overflow-x-auto">
                      {entry.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt="Foto do histórico"
                          onClick={() => openImageModal(photo)}
                          className="w-20 h-20 object-cover rounded-xl border border-[#E2DDD5] cursor-pointer hover:opacity-90 transition"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Operator Complete Modal */}
      <AnimatePresence>
      {showCompleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <h3 className="font-serif-display text-xl font-bold text-[#1C2826]">
              Concluir Caso & Enviar para o Arquivo
            </h3>
            <p className="text-xs text-[#62726F]">
              Pela regra de qualidade, cada conclusão precisa de uma nota de entrega/comprovante para o arquivo do cliente.
            </p>

            <textarea
              value={proofNoteText}
              onChange={(e) => setProofNoteText(e.target.value)}
              placeholder="Ex: Entrega realizada na residência e nota fiscal armazenada."
              rows={3}
              className="w-full p-3 bg-[#F7F5F1] border border-[#E2DDD5] rounded-xl text-xs focus:outline-none focus:border-[#145A52]"
            />

            <input
              type="text"
              value={proofPhotoUrl}
              onChange={(e) => setProofPhotoUrl(e.target.value)}
              placeholder="URL da foto do comprovante/recibo (opcional)"
              className="w-full p-2.5 bg-[#F7F5F1] border border-[#E2DDD5] rounded-xl text-xs"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-[#E2DDD5] text-[#62726F] hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmComplete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#145A52] text-white hover:bg-[#0E3F3A]"
              >
                Confirmar Conclusão
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </motion.div>
  );
};
