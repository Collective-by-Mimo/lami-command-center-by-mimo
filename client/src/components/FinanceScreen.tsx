/**
 * LaMi Finance — transaction ledger (AED), monthly summary cards, receipt
 * photos (base64 in localStorage — TODO cloud storage), CSV report export and
 * a server-gated Google Sheets sync (/api/finance/sync). Shows a dev banner
 * until real authentication lands in Phase 2.
 */
import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FinanceTransaction, TransactionStatus, TransactionType } from '../types';
import { FINANCE_CATEGORIES, getFinanceCategory } from '../config/appConfig';
import { AnimatePresence, motion } from 'motion/react';
import { hapticTap } from '../utils/haptics';
import {
  Plus,
  X,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Trash2,
  Paperclip,
  Wallet
} from 'lucide-react';

const AED = (value: number, locale: string) =>
  value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const FinanceScreen: React.FC = () => {
  const {
    language,
    isRTL,
    isOperator,
    transactions,
    addTransaction,
    deleteTransaction,
    openImageModal,
    showToast
  } = useApp();

  const locale = language === 'he' ? 'he-IL' : language === 'en' ? 'en-US' : 'pt-BR';

  const t = {
    title: { pt: 'Finanças', en: 'Finance', he: 'כספים' }[language],
    subtitle: {
      pt: 'Registro de despesas, entradas e reembolsos em AED',
      en: 'Ledger of expenses, income and reimbursements in AED',
      he: 'רישום הוצאות, הכנסות והחזרים ב-AED'
    }[language],
    devBanner: {
      pt: '⚠️ Autenticação real pendente — não publicar com dados financeiros reais até Fase 2.',
      en: '⚠️ Real authentication pending — do not publish with real financial data until Phase 2.',
      he: '⚠️ אימות אמיתי ממתין — אין לפרסם נתונים פיננסיים אמיתיים עד שלב 2.'
    }[language],
    income: { pt: 'Entradas', en: 'Income', he: 'הכנסות' }[language],
    expenses: { pt: 'Saídas', en: 'Expenses', he: 'הוצאות' }[language],
    reimbursements: { pt: 'Reembolsos', en: 'Reimbursements', he: 'החזרים' }[language],
    balance: { pt: 'Saldo do mês', en: 'Month balance', he: 'יתרת החודש' }[language],
    exportReport: { pt: 'Exportar relatório', en: 'Export report', he: 'ייצוא דוח' }[language],
    sync: { pt: 'Sincronizar com Google Sheets', en: 'Sync to Google Sheets', he: 'סנכרון ל-Google Sheets' }[language],
    syncPending: {
      pt: 'Sincronização com Google Sheets pendente',
      en: 'Google Sheets sync pending',
      he: 'סנכרון Google Sheets ממתין'
    }[language],
    syncPendingNote: {
      pt: 'Dados mantidos localmente neste dispositivo.',
      en: 'Data kept locally on this device.',
      he: 'הנתונים נשמרים מקומית במכשיר זה.'
    }[language],
    syncDone: {
      pt: 'Planilha do Google Sheets atualizada!',
      en: 'Google Sheet updated!',
      he: 'הגיליון של Google Sheets עודכן!'
    }[language],
    noTransactions: {
      pt: 'Nenhum lançamento neste mês 🌿',
      en: 'No transactions this month 🌿',
      he: 'אין תנועות החודש 🌿'
    }[language],
    newTransaction: { pt: 'Novo lançamento', en: 'New transaction', he: 'תנועה חדשה' }[language],
    descriptionPh: { pt: 'Descrição', en: 'Description', he: 'תיאור' }[language],
    amountPh: { pt: 'Valor (AED)', en: 'Amount (AED)', he: 'סכום (AED)' }[language],
    attachReceipt: { pt: 'Anexar recibo (foto)', en: 'Attach receipt (photo)', he: 'צירוף קבלה (תמונה)' }[language],
    save: { pt: 'Salvar lançamento', en: 'Save transaction', he: 'שמירת תנועה' }[language],
    typeLabels: {
      income: { pt: 'Entrada', en: 'Income', he: 'הכנסה' }[language],
      expense: { pt: 'Despesa', en: 'Expense', he: 'הוצאה' }[language],
      reimbursement: { pt: 'Reembolso', en: 'Reimbursement', he: 'החזר' }[language]
    },
    statusLabels: {
      pending: { pt: 'Pendente', en: 'Pending', he: 'ממתין' }[language],
      confirmed: { pt: 'Confirmado', en: 'Confirmed', he: 'מאושר' }[language],
      reimbursed: { pt: 'Reembolsado', en: 'Reimbursed', he: 'הוחזר' }[language]
    }
  };

  // ——— Month selection ———
  const months = useMemo(() => {
    const set = new Set(transactions.map((tx) => tx.date.slice(0, 7)));
    set.add(new Date().toISOString().slice(0, 7));
    return Array.from(set).sort().reverse();
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().slice(0, 7));

  const monthLabel = (month: string) => {
    const [y, m] = month.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  };

  const monthTransactions = useMemo(
    () =>
      transactions
        .filter((tx) => tx.date.startsWith(selectedMonth))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, selectedMonth]
  );

  const summary = useMemo(() => {
    const acc = { income: 0, expense: 0, reimbursement: 0 };
    monthTransactions.forEach((tx) => {
      acc[tx.type] += tx.amountAED;
    });
    return { ...acc, balance: acc.income + acc.reimbursement - acc.expense };
  }, [monthTransactions]);

  // ——— Google Sheets sync (server-side creds only — see /api/finance/sync) ———
  const [isSyncing, setIsSyncing] = useState(false);
  const [sheetsPending, setSheetsPending] = useState(false);

  const handleSync = async () => {
    hapticTap();
    setIsSyncing(true);
    try {
      // Receipts stay local — only ledger fields go to the spreadsheet
      const payload = transactions.map(({ receiptBase64, ...rest }) => rest);
      const res = await fetch('/api/finance/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: payload })
      });
      const data = res.ok ? await res.json() : { synced: false };
      if (data.synced) {
        setSheetsPending(false);
        showToast(t.syncDone);
      } else {
        setSheetsPending(true);
        showToast(t.syncPending);
      }
    } catch {
      setSheetsPending(true);
      showToast(t.syncPending);
    } finally {
      setIsSyncing(false);
    }
  };

  // ——— CSV report export ———
  const handleExport = () => {
    hapticTap();
    const header = ['Date', 'Description', 'Category', 'Type', 'Status', 'Amount AED'];
    const rows = monthTransactions.map((tx) => [
      tx.date,
      `"${tx.description.replace(/"/g, '""')}"`,
      getFinanceCategory(tx.category)?.label.en || tx.category,
      tx.type,
      tx.status,
      tx.amountAED.toFixed(2)
    ]);
    const csv = '\ufeff' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lami-financas-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ——— New transaction modal (operator) ———
  const [showNew, setShowNew] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('casa');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [newStatus, setNewStatus] = useState<TransactionStatus>('pending');
  const [newReceipt, setNewReceipt] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReceiptFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast(
        language === 'pt' ? 'Foto muito grande (máx. 2MB).' :
        language === 'en' ? 'Photo too large (max 2MB).' :
        'התמונה גדולה מדי (מקס׳ 2MB).'
      );
      return;
    }
    // TODO cloud storage — base64 in localStorage is Phase 1 only
    const reader = new FileReader();
    reader.onload = () => setNewReceipt(typeof reader.result === 'string' ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    const amount = parseFloat(newAmount.replace(',', '.'));
    if (!newDescription.trim() || !newDate || isNaN(amount) || amount <= 0) return;
    addTransaction({
      date: newDate,
      description: newDescription.trim(),
      category: newCategory,
      amountAED: Math.round(amount * 100) / 100,
      type: newType,
      status: newStatus,
      receiptBase64: newReceipt
    });
    setSelectedMonth(newDate.slice(0, 7));
    setShowNew(false);
    setNewDescription('');
    setNewAmount('');
    setNewReceipt(undefined);
  };

  const typeColor: Record<TransactionType, string> = {
    income: 'text-[#145A52]',
    expense: 'text-red-700',
    reimbursement: 'text-[#B8912E]'
  };

  const typeSign: Record<TransactionType, string> = {
    income: '+',
    expense: '−',
    reimbursement: '+'
  };

  return (
    <div className="space-y-5 pb-28 pt-6 px-4 relative">
      {/* Dev banner — remove at Phase 2 */}
      <div className="bg-[#FFF3E0] border border-[#E8A33D]/60 text-[#8A5A00] rounded-2xl px-4 py-3 text-[12px] font-medium leading-relaxed">
        {t.devBanner}
      </div>

      <div>
        <h1 className="font-serif-display text-[28px] text-[#0E3F3A] flex items-center gap-2.5">
          <Wallet className="w-6 h-6 text-[#B8912E]" strokeWidth={1.75} />
          {t.title}
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-1">{t.subtitle}</p>
      </div>

      {/* Month chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => {
              hapticTap();
              setSelectedMonth(month);
            }}
            className={`px-4 py-1.5 rounded-[20px] text-[13px] font-medium whitespace-nowrap border border-[#145A52] capitalize transition-colors ${
              selectedMonth === month ? 'bg-[#145A52] text-white' : 'bg-white text-[#145A52]'
            }`}
          >
            {monthLabel(month)}
          </button>
        ))}
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-2xl p-3 border border-[#E7E1D5]">
          <TrendingUp className="w-4 h-4 text-[#145A52] mb-1.5" />
          <p className="text-[11px] text-[#6B7280]">{t.income}</p>
          <p className="font-mono text-[14px] font-bold text-[#145A52] leading-tight">
            {AED(summary.income, locale)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-[#E7E1D5]">
          <TrendingDown className="w-4 h-4 text-red-700 mb-1.5" />
          <p className="text-[11px] text-[#6B7280]">{t.expenses}</p>
          <p className="font-mono text-[14px] font-bold text-red-700 leading-tight">
            {AED(summary.expense, locale)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-[#E7E1D5]">
          <RotateCcw className="w-4 h-4 text-[#B8912E] mb-1.5" />
          <p className="text-[11px] text-[#6B7280]">{t.reimbursements}</p>
          <p className="font-mono text-[14px] font-bold text-[#B8912E] leading-tight">
            {AED(summary.reimbursement, locale)}
          </p>
        </div>
      </div>

      {/* Month balance strip */}
      <div className="bg-gradient-to-br from-[#145A52] to-[#0E3F3A] text-white rounded-2xl px-4 py-3 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#E2DDD5]">{t.balance}</span>
        <span className="font-mono text-[18px] font-bold">
          {summary.balance < 0 ? '−' : ''}{AED(Math.abs(summary.balance), locale)} AED
        </span>
      </div>

      {/* Actions: export + sheets sync */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#145A52] bg-white border border-[#145A52] px-4 py-2 rounded-full active:scale-[0.97] transition-transform"
        >
          <Download className="w-3.5 h-3.5" />
          {t.exportReport}
        </button>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#145A52] px-4 py-2 rounded-full active:scale-[0.97] transition-transform disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {t.sync}
        </button>
      </div>

      {sheetsPending && (
        <div className="bg-[#FBF6E8] border border-[#B8912E]/40 rounded-2xl px-4 py-3">
          <p className="text-[12px] font-semibold text-[#B8912E]">{t.syncPending}</p>
          <p className="text-[11px] text-[#8A5A00] mt-0.5">{t.syncPendingNote}</p>
        </div>
      )}

      {/* Ledger */}
      {monthTransactions.length > 0 ? (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {monthTransactions.map((tx) => {
              const cat = getFinanceCategory(tx.category);
              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-white rounded-2xl px-4 py-3 border border-[#E7E1D5]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {tx.receiptBase64 ? (
                        <img
                          src={tx.receiptBase64}
                          alt="Recibo"
                          onClick={() => openImageModal(tx.receiptBase64!)}
                          className="w-11 h-11 object-cover rounded-xl border border-[#E2DDD5] cursor-pointer shrink-0"
                        />
                      ) : (
                        <span className="w-11 h-11 rounded-xl bg-[#EEF7F5] flex items-center justify-center text-lg shrink-0">
                          {cat?.emoji || '📎'}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-[#1A1A1A] leading-snug truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="font-mono text-[10px] text-[#6B7280]">{tx.date}</span>
                          <span className="text-[10px] bg-[#EEF7F5] text-[#145A52] px-1.5 py-0.5 rounded-full">
                            {cat ? `${cat.emoji} ${cat.label[language] || cat.label.pt}` : tx.category}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                              tx.status === 'pending'
                                ? 'bg-[#FBF6E8] text-[#B8912E] border-[#B8912E]/40'
                                : tx.status === 'reimbursed'
                                  ? 'bg-[#EEF7F5] text-[#145A52] border-[#145A52]/20'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {t.statusLabels[tx.status]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <p className={`font-mono text-[15px] font-bold ${typeColor[tx.type]}`}>
                        {typeSign[tx.type]}{AED(tx.amountAED, locale)}
                      </p>
                      <p className="text-[10px] text-[#999999]">{t.typeLabels[tx.type]} · AED</p>
                      {isOperator && (
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          aria-label="Delete transaction"
                          className="mt-1 text-[#999999] hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12 text-[#999999]">
          <p className="font-serif-display italic text-[18px]">{t.noTransactions}</p>
        </div>
      )}

      {/* Operator FAB */}
      {isOperator && (
        <motion.button
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowNew(true)}
          className={`fixed bottom-24 ${isRTL ? 'left-5' : 'right-5'} w-14 h-14 bg-[#145A52] text-white rounded-full flex items-center justify-center z-40`}
          style={{ boxShadow: '0 4px 20px rgba(14,63,58,0.35)' }}
          aria-label={t.newTransaction}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* New transaction modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowNew(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-[18px] w-full max-w-sm shadow-[0_12px_40px_rgba(14,63,58,0.25)] space-y-3 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-[22px] text-[#0E3F3A]">{t.newTransaction}</h3>
                <button onClick={() => setShowNew(false)} className="p-1 text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] bg-white focus:outline-none focus:border-[#145A52]"
              />
              <input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={t.descriptionPh}
                className="w-full h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] focus:outline-none focus:border-[#145A52]"
              />
              <div className="flex gap-2">
                <input
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder={t.amountPh}
                  inputMode="decimal"
                  className="flex-1 h-11 rounded-xl border border-[#E2DDD5] px-3 text-[14px] font-mono focus:outline-none focus:border-[#145A52]"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TransactionType)}
                  className="h-11 rounded-xl border border-[#E2DDD5] px-2 text-[13px] bg-white focus:outline-none focus:border-[#145A52]"
                >
                  <option value="expense">{t.typeLabels.expense}</option>
                  <option value="income">{t.typeLabels.income}</option>
                  <option value="reimbursement">{t.typeLabels.reimbursement}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 h-11 rounded-xl border border-[#E2DDD5] px-2 text-[13px] bg-white focus:outline-none focus:border-[#145A52]"
                >
                  {FINANCE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.label[language] || c.label.pt}
                    </option>
                  ))}
                </select>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TransactionStatus)}
                  className="flex-1 h-11 rounded-xl border border-[#E2DDD5] px-2 text-[13px] bg-white focus:outline-none focus:border-[#145A52]"
                >
                  <option value="pending">{t.statusLabels.pending}</option>
                  <option value="confirmed">{t.statusLabels.confirmed}</option>
                  <option value="reimbursed">{t.statusLabels.reimbursed}</option>
                </select>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleReceiptFile(e.target.files?.[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-11 rounded-xl border border-dashed border-[#B8912E]/60 text-[13px] font-medium text-[#B8912E] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
              >
                <Paperclip className="w-3.5 h-3.5" />
                {t.attachReceipt}
              </button>
              {newReceipt && (
                <img
                  src={newReceipt}
                  alt="Recibo"
                  className="w-16 h-16 object-cover rounded-xl border border-[#E2DDD5]"
                />
              )}

              <button
                onClick={handleCreate}
                className="w-full h-11 bg-[#145A52] text-white rounded-full text-[14px] font-semibold active:scale-[0.98] transition-transform"
              >
                {t.save}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
