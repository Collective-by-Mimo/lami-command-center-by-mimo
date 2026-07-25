export type Language = 'pt' | 'en' | 'he';

export type ClientState = '🔔 Aguardando você' | '✅ Em nossas mãos' | '✔️ Concluído';

export type InternalStatus = 'Aberto' | 'Aguardando aprovação' | 'Pausado' | 'Concluído';

export type Priority = 'Alta' | 'Normal';

export interface I18nText {
  pt: string;
  en: string;
  he: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  time?: string;
  content: I18nText;
  photos?: string[];
  addedBy: 'operator' | 'client';
}

export interface QuotationRow {
  id: string;
  title: I18nText;
  priceAED: number | string;
  timeline?: I18nText;
  observation?: I18nText;
  isRecommended?: boolean;
  recommendationReason?: I18nText;
  quantity?: number;
}

export interface DecisionOption {
  id: string;
  label: I18nText;
  variant?: 'primary' | 'secondary' | 'accent';
}

export interface DecisionData {
  prompt: I18nText;
  options: DecisionOption[];
  resolvedOptionId?: string;
  resolvedAt?: string;
  resolvedComment?: string;
}

export interface CompletionProof {
  photoUrl?: string;
  note: I18nText;
  completedAt: string;
}

export interface SubTask {
  id: string;
  title: I18nText;
  completed: boolean;
  completedAt?: string;
}

export interface CaseItem {
  id: string;
  emoji: string;
  title: I18nText;
  clientState: ClientState;
  internalStatus: InternalStatus;
  priority: Priority;
  isRecurring: boolean;
  dueDate?: string;
  nextStep: I18nText;
  subtasks?: SubTask[];
  timeline: TimelineEntry[];
  quotations?: QuotationRow[];
  decision?: DecisionData;
  completionProof?: CompletionProof;
  completedMonth?: string; // e.g. "2026-06"
  utilityType?: 'DEWA' | 'Tasleem' | 'Lootah Gas' | 'Just Life';
  category?: string;
}

export interface BriefingData {
  lastUpdated: string;
  prose: I18nText;
}

export interface UtilityItem {
  id: string;
  name: string;
  type: 'DEWA' | 'Tasleem' | 'Lootah Gas';
  contractAccount?: string;
  customerNumber?: string;
  phone?: string;
  notes: I18nText;
  statusText: I18nText;
}

export interface KeyDateItem {
  id: string;
  label: I18nText;
  date: string; // "YYYY-MM-DD"
  category: 'document' | 'lease' | 'bill' | 'pattern';
  lead_time_days: number;
  suggestion: I18nText;
  status?: 'pending' | 'accepted' | 'dismissed';
}

export interface HandoffItem {
  id: string;
  createdAt: string;
  clientQuestion: string;
  language: Language;
  resolved?: boolean;
  operatorResponse?: string;
  resolvedAt?: string;
}

export type ViewMode =
  | 'briefing'
  | 'cases'
  | 'caseDetail'
  | 'archive'
  | 'utilities'
  | 'contacts'
  | 'connections'
  | 'finance'
  | 'services';

export type TransactionType = 'income' | 'expense' | 'reimbursement';

export type TransactionStatus = 'pending' | 'confirmed' | 'reimbursed';

export interface FinanceTransaction {
  id: string;
  date: string; // "YYYY-MM-DD"
  description: string;
  category: string; // FINANCE_CATEGORIES id
  amountAED: number;
  type: TransactionType;
  status: TransactionStatus;
  receiptBase64?: string; // TODO cloud storage — base64 in localStorage for Phase 1 only
}
