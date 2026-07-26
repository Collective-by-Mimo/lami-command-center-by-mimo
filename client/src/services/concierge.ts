/**
 * LaMi Concierge client — talks to the server-side Gemini endpoint
 * (POST /api/concierge). The API key and system prompt live only in
 * server/index.ts; this module's job is building a SAFE grounding payload:
 * no internalStatus, priority, operator notes, IDs or account numbers.
 */
import { BriefingData, CaseItem, KeyDateItem, Language, UtilityItem } from '../types';
import { getCaseCategory } from '../config/appConfig';

export const CONCIERGE_CLIENT_FALLBACK = "I couldn't answer right now — please message Mimo directly on WhatsApp 💬";

export interface ConciergeGroundingData {
  briefing: string;
  cases: {
    title: string;
    clientState: string;
    nextStep?: string;
    dueDate?: string;
    category?: string;
    completedAt?: string;
    quotations?: { title: string; priceAED: number | string; recommended?: boolean; timeline?: string }[];
  }[];
  bills: { name: string; status: string; notes: string }[];
  keyDates: { label: string; date: string; category: string }[];
}

export function buildGroundingData(
  cases: CaseItem[],
  utilities: UtilityItem[],
  keyDates: KeyDateItem[],
  briefing: BriefingData,
  language: Language
): ConciergeGroundingData {
  return {
    briefing: briefing.prose || '',
    cases: cases.map((c) => ({
      title: c.title || '',
      clientState: c.clientState,
      nextStep: c.nextStep,
      dueDate: c.dueDate,
      category: getCaseCategory(c.category) ? getCaseCategory(c.category)!.label : c.category,
      completedAt: c.completionProof?.completedAt,
      quotations: c.quotations?.map((q) => ({
        title: q.title || '',
        priceAED: q.priceAED,
        recommended: q.isRecommended,
        timeline: q.timeline
      }))
      // Excluded on purpose: id, internalStatus, priority, timeline/operator
      // notes, decision internals, utilityType account linkage
    })),
    bills: utilities.map((u) => ({
      name: u.name,
      status: u.statusText || '',
      notes: u.notes || ''
      // Excluded on purpose: contractAccount, customerNumber, phone, id
    })),
    keyDates: keyDates
      .filter((k) => k.status !== 'dismissed')
      .map((k) => ({ label: k.label || '', date: k.date, category: k.category }))
  };
}

export interface ConciergeResponse {
  reply: string;
  fallback: boolean;
}

/** Ask the server-side concierge. Never throws — degrades to the localized fallback. */
export async function askConcierge(
  message: string,
  language: Language,
  groundingData: ConciergeGroundingData
): Promise<ConciergeResponse> {
  try {
    const res = await fetch('/api/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, groundingData })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data?.reply === 'string' && data.reply.trim()) {
      return { reply: data.reply, fallback: !!data.fallback };
    }
    throw new Error('empty reply');
  } catch {
    return { reply: CONCIERGE_CLIENT_FALLBACK, fallback: true };
  }
}
