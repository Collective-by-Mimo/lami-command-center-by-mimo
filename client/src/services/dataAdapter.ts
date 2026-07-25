import { CaseItem, BriefingData, UtilityItem, KeyDateItem, HandoffItem, I18nText, TimelineEntry, ClientState, InternalStatus, Priority, Language, FinanceTransaction } from '../types';
import { INITIAL_CASES, INITIAL_BRIEFING, INITIAL_UTILITIES, INITIAL_TRANSACTIONS } from '../data/seedData';
import INITIAL_KEYDATES from '../data/keydates.json';

const CASES_STORAGE_KEY = 'lami_cases_data_v1';
const BRIEFING_STORAGE_KEY = 'lami_briefing_data_v1';
const UTILITIES_STORAGE_KEY = 'lami_utilities_data_v1';
const KEYDATES_STORAGE_KEY = 'lami_keydates_data_v1';
const HANDOFFS_STORAGE_KEY = 'lami_handoffs_data_v1';
const FINANCE_STORAGE_KEY = 'lami_finance_data_v1';

// Helper to safely load from LocalStorage or fall back to seed
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

const INITIAL_HANDOFFS: HandoffItem[] = [
  {
    id: 'handoff-seed-1',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    clientQuestion: 'Qual o valor exato da taxa de renovação do visto da babá e quando vence o pagamento?',
    language: 'pt',
    resolved: false
  },
  {
    id: 'handoff-seed-2',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    clientQuestion: 'Can you confirm if DEWA auto-pay is set up with my Emirates NBD card?',
    language: 'en',
    resolved: false
  },
  {
    id: 'handoff-seed-3',
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    clientQuestion: 'Preciso solicitar autorização para a mudança da mobília da varanda neste sábado.',
    language: 'pt',
    resolved: false
  }
];

export class DataAdapter {
  private static cases: CaseItem[] = loadFromStorage<CaseItem[]>(CASES_STORAGE_KEY, INITIAL_CASES);
  private static briefing: BriefingData = loadFromStorage<BriefingData>(BRIEFING_STORAGE_KEY, INITIAL_BRIEFING);
  private static utilities: UtilityItem[] = loadFromStorage<UtilityItem[]>(UTILITIES_STORAGE_KEY, INITIAL_UTILITIES);
  private static keyDates: KeyDateItem[] = loadFromStorage<KeyDateItem[]>(KEYDATES_STORAGE_KEY, INITIAL_KEYDATES as KeyDateItem[]);
  private static handoffs: HandoffItem[] = loadFromStorage<HandoffItem[]>(HANDOFFS_STORAGE_KEY, INITIAL_HANDOFFS);
  // Finance ledger — localStorage for Phase 1. TODO cloud storage (receipts are base64 for now)
  private static transactions: FinanceTransaction[] = loadFromStorage<FinanceTransaction[]>(FINANCE_STORAGE_KEY, INITIAL_TRANSACTIONS);

  // Get all active or archived cases
  public static getCases(): CaseItem[] {
    return [...this.cases];
  }

  // Get key dates
  public static getKeyDates(): KeyDateItem[] {
    return [...this.keyDates];
  }

  // Get handoffs (operator requests)
  public static getHandoffs(): HandoffItem[] {
    return [...this.handoffs];
  }

  // Add a new handoff logged from Concierge AI
  public static addHandoff(question: string, language: Language = 'pt'): HandoffItem {
    const item: HandoffItem = {
      id: `handoff-${Date.now()}`,
      createdAt: new Date().toISOString(),
      clientQuestion: question,
      language,
      resolved: false
    };
    this.handoffs.unshift(item);
    saveToStorage(HANDOFFS_STORAGE_KEY, this.handoffs);
    return item;
  }

  // Resolve/archive handoff by operator
  public static resolveHandoff(id: string, operatorResponse?: string): void {
    const item = this.handoffs.find(h => h.id === id);
    if (item) {
      item.resolved = true;
      if (operatorResponse) {
        item.operatorResponse = operatorResponse;
      }
      item.resolvedAt = new Date().toISOString();
      saveToStorage(HANDOFFS_STORAGE_KEY, this.handoffs);
    }
  }

  // Accept a proactive key date suggestion (creates a new case automatically)
  public static acceptKeyDateSuggestion(keyDateId: string): CaseItem | undefined {
    const kd = this.keyDates.find(k => k.id === keyDateId);
    if (!kd) return undefined;

    kd.status = 'accepted';
    saveToStorage(KEYDATES_STORAGE_KEY, this.keyDates);

    const categoryEmojis: Record<string, string> = {
      lease: '🔑',
      document: '📄',
      bill: '⚡',
      pattern: '🍷'
    };

    // Auto-create case
    const created = this.createCase({
      emoji: categoryEmojis[kd.category] || '🎯',
      title: kd.label,
      clientState: '✅ Em nossas mãos',
      internalStatus: 'Aberto',
      priority: 'Alta',
      isRecurring: kd.category === 'bill' || kd.category === 'pattern',
      nextStep: {
        pt: `Sugestão antecipada aceita pela cliente. Providências iniciadas pelo Mimo.`,
        en: `Proactive suggestion accepted by client. Actions initiated by Mimo.`,
        he: `הצעה מראש אושרה על ידי הלקוחה. פעולות הותחלו על ידי מימו.`
      },
      timeline: [
        {
          id: `tl-rad-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          addedBy: 'client',
          content: {
            pt: `Sugestão antecipada ("Radar"): "${kd.suggestion.pt}" aprovada com um toque pela cliente.`,
            en: `Proactive suggestion ("Radar"): "${kd.suggestion.en}" approved with one tap by client.`,
            he: `הצעה מראש ("מכ"ם"): "${kd.suggestion.he}" אושרה בלחיצה אחת על ידי הלקוחה.`
          }
        }
      ]
    });

    return created;
  }

  // Dismiss a key date suggestion
  public static dismissKeyDateSuggestion(keyDateId: string): void {
    const kd = this.keyDates.find(k => k.id === keyDateId);
    if (kd) {
      kd.status = 'dismissed';
      saveToStorage(KEYDATES_STORAGE_KEY, this.keyDates);
    }
  }

  // Get single case by ID
  public static getCaseById(id: string): CaseItem | undefined {
    return this.cases.find(c => c.id === id);
  }

  // Save or update an entire case item
  public static updateCase(updatedCase: CaseItem): CaseItem {
    const index = this.cases.findIndex(c => c.id === updatedCase.id);
    if (index >= 0) {
      this.cases[index] = { ...updatedCase };
    } else {
      this.cases.unshift(updatedCase);
    }
    saveToStorage(CASES_STORAGE_KEY, this.cases);
    return updatedCase;
  }

  // Create a new case (Operator mode)
  public static createCase(newCase: Partial<CaseItem> & { emoji: string; title: I18nText }): CaseItem {
    const now = new Date().toISOString().split('T')[0];
    const created: CaseItem = {
      id: `case-${Date.now()}`,
      emoji: newCase.emoji || '💼',
      title: newCase.title,
      clientState: newCase.clientState || '✅ Em nossas mãos',
      internalStatus: newCase.internalStatus || 'Aberto',
      priority: newCase.priority || 'Normal',
      isRecurring: newCase.isRecurring || false,
      nextStep: newCase.nextStep || { pt: 'Análise inicial', en: 'Initial analysis', he: 'ניתוח ראשוני' },
      timeline: newCase.timeline || [
        {
          id: `tl-${Date.now()}`,
          date: now,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          addedBy: 'operator',
          content: {
            pt: 'Caso criado pelo Mimo.',
            en: 'Case created by Mimo.',
            he: 'תיק נוצר על ידי מימו.'
          }
        }
      ],
      quotations: newCase.quotations || [],
      decision: newCase.decision,
      category: newCase.category
    };

    this.cases.unshift(created);
    saveToStorage(CASES_STORAGE_KEY, this.cases);
    return created;
  }

  // Add timeline entry to a case
  public static addTimelineEntry(
    caseId: string,
    content: I18nText,
    photos: string[] = [],
    addedBy: 'operator' | 'client' = 'operator'
  ): CaseItem | undefined {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) return undefined;

    const now = new Date();
    const entry: TimelineEntry = {
      id: `tl-${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      addedBy,
      content,
      photos
    };

    caseItem.timeline.unshift(entry);
    return this.updateCase(caseItem);
  }

  // Client resolves a decision (One-tap decision approval!)
  public static resolveDecision(
    caseId: string,
    optionId: string,
    comment?: string
  ): CaseItem | undefined {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem || !caseItem.decision) return undefined;

    const chosenOption = caseItem.decision.options.find(o => o.id === optionId);
    const nowStr = new Date().toISOString().split('T')[0];

    caseItem.decision.resolvedOptionId = optionId;
    caseItem.decision.resolvedAt = nowStr;
    caseItem.decision.resolvedComment = comment;

    // Transition state from "🔔 Aguardando você" to "✅ Em nossas mãos"
    caseItem.clientState = '✅ Em nossas mãos';
    caseItem.internalStatus = 'Aberto';
    caseItem.nextStep = {
      pt: `Decisão aprovada (${chosenOption?.label.pt || optionId}). Em execução pelo Mimo.`,
      en: `Decision approved (${chosenOption?.label.en || optionId}). In execution by Mimo.`,
      he: `החלטה אושרה (${chosenOption?.label.he || optionId}). בטיפול על ידי מימו.`
    };

    // Log decision in timeline
    caseItem.timeline.unshift({
      id: `tl-dec-${Date.now()}`,
      date: nowStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      addedBy: 'client',
      content: {
        pt: `Decisão tomada pela cliente Layla: "${chosenOption?.label.pt || optionId}".`,
        en: `Decision made by Layla: "${chosenOption?.label.en || optionId}".`,
        he: `החלטה התקבלה על ידי לילה: "${chosenOption?.label.he || optionId}".`
      }
    });

    return this.updateCase(caseItem);
  }

  // Complete a case with proof (Moves to Archive)
  public static markCaseComplete(
    caseId: string,
    proofNote: I18nText,
    photoUrl?: string
  ): CaseItem | undefined {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) return undefined;

    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    caseItem.clientState = '✔️ Concluído';
    caseItem.internalStatus = 'Concluído';
    caseItem.completedMonth = monthStr;
    caseItem.nextStep = {
      pt: 'Assunto resolvido e arquivado com sucesso.',
      en: 'Matter resolved and archived successfully.',
      he: 'העניין טופל ואורכב בהצלחה.'
    };

    caseItem.completionProof = {
      note: proofNote,
      photoUrl,
      completedAt: dateStr
    };

    caseItem.timeline.unshift({
      id: `tl-comp-${Date.now()}`,
      date: dateStr,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      addedBy: 'operator',
      content: {
        pt: `Caso marcado como concluído pelo Mimo. Comprovante anexado.`,
        en: `Case marked as completed by Mimo. Proof attached.`,
        he: `התיק סומן כושלם על ידי מימו. אישור צורף.`
      },
      photos: photoUrl ? [photoUrl] : []
    });

    return this.updateCase(caseItem);
  }

  // ——— Finance ledger ———
  public static getTransactions(): FinanceTransaction[] {
    return [...this.transactions];
  }

  public static addTransaction(tx: Omit<FinanceTransaction, 'id'>): FinanceTransaction {
    const created: FinanceTransaction = { ...tx, id: `tx-${Date.now()}` };
    this.transactions.unshift(created);
    saveToStorage(FINANCE_STORAGE_KEY, this.transactions);
    return created;
  }

  public static updateTransaction(updated: FinanceTransaction): FinanceTransaction {
    const index = this.transactions.findIndex((t) => t.id === updated.id);
    if (index >= 0) {
      this.transactions[index] = { ...updated };
    } else {
      this.transactions.unshift(updated);
    }
    saveToStorage(FINANCE_STORAGE_KEY, this.transactions);
    return updated;
  }

  public static deleteTransaction(id: string): void {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    saveToStorage(FINANCE_STORAGE_KEY, this.transactions);
  }

  // Get briefing prose
  public static getBriefing(): BriefingData {
    return { ...this.briefing };
  }

  // Update briefing prose (Operator mode)
  public static updateBriefing(prose: I18nText): BriefingData {
    this.briefing = {
      lastUpdated: new Date().toISOString(),
      prose
    };
    saveToStorage(BRIEFING_STORAGE_KEY, this.briefing);
    return { ...this.briefing };
  }

  // Get utilities list
  public static getUtilities(): UtilityItem[] {
    return [...this.utilities];
  }

  // Export all data as JSON string for backup/Notion sync
  public static exportDataJSON(): string {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      client: 'Layla Karoline Aparecida',
      operator: 'Movsum "Mimo" Mirzazada',
      briefing: this.briefing,
      cases: this.cases,
      utilities: this.utilities,
      transactions: this.transactions
    };
    return JSON.stringify(exportObject, null, 2);
  }

  // Import data from JSON
  public static importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.cases && Array.isArray(parsed.cases)) {
        this.cases = parsed.cases;
        saveToStorage(CASES_STORAGE_KEY, this.cases);
      }
      if (parsed.briefing) {
        this.briefing = parsed.briefing;
        saveToStorage(BRIEFING_STORAGE_KEY, this.briefing);
      }
      if (parsed.utilities && Array.isArray(parsed.utilities)) {
        this.utilities = parsed.utilities;
        saveToStorage(UTILITIES_STORAGE_KEY, this.utilities);
      }
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        this.transactions = parsed.transactions;
        saveToStorage(FINANCE_STORAGE_KEY, this.transactions);
      }
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  }

  // Reset to original seed data
  public static resetToDefaultSeed(): void {
    this.cases = [...INITIAL_CASES];
    this.briefing = { ...INITIAL_BRIEFING };
    this.utilities = [...INITIAL_UTILITIES];
    this.keyDates = [...(INITIAL_KEYDATES as KeyDateItem[])];
    this.handoffs = [];
    this.transactions = [...INITIAL_TRANSACTIONS];
    saveToStorage(CASES_STORAGE_KEY, this.cases);
    saveToStorage(BRIEFING_STORAGE_KEY, this.briefing);
    saveToStorage(UTILITIES_STORAGE_KEY, this.utilities);
    saveToStorage(KEYDATES_STORAGE_KEY, this.keyDates);
    saveToStorage(HANDOFFS_STORAGE_KEY, this.handoffs);
    saveToStorage(FINANCE_STORAGE_KEY, this.transactions);
  }
}
