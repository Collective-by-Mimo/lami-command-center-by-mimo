/**
 * Local, zero-dependency concierge brain. Answers common questions directly
 * from the app's own data (cases, bills, key dates, finance) — no API key, no
 * network, nothing to break. Used as the primary responder; open-ended
 * questions it can't match fall through to the server endpoint (Gemini/Azure
 * if configured, otherwise the graceful WhatsApp hand-off).
 */
import { CaseItem, UtilityItem, KeyDateItem, FinanceTransaction, BriefingData } from '../types';

export interface ConciergeData {
  cases: CaseItem[];
  utilities: UtilityItem[];
  keyDates: KeyDateItem[];
  transactions: FinanceTransaction[];
  briefing: BriefingData;
}

const AED = (n: number) => `AED ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const has = (msg: string, ...words: string[]) => words.some((w) => msg.includes(w));

const bullet = (c: CaseItem) => `• ${c.title}${c.nextStep ? ` — ${c.nextStep}` : ''}`;

export function answerLocally(message: string, data: ConciergeData): string | null {
  const msg = message.toLowerCase().trim();
  const { cases, utilities, transactions } = data;

  const awaiting = cases.filter((c) => c.clientState === '🔔 Awaiting you');
  const inHand = cases.filter((c) => c.clientState === '✅ In our hands');
  const completed = cases.filter((c) => c.clientState === '✔️ Completed');

  // Greetings
  if (has(msg, 'hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening') || msg === 'hi') {
    return 'Hello, Layla 🌸 Everything is being handled. Ask me what is pending, what was completed, your bills, or your balance.';
  }
  if (has(msg, 'thank', 'thanks', 'merci', 'shukran')) {
    return 'My pleasure, Layla 🌸 Always here for you.';
  }

  // Finance / cash-flow
  if (has(msg, 'balance', 'cash', 'petty', 'spent', 'spend', 'money', 'finance', 'budget', 'expense', 'expenses', 'income')) {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountAED, 0);
    const reimb = transactions.filter((t) => t.type === 'reimbursement').reduce((s, t) => s + t.amountAED, 0);
    const spent = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountAED, 0);
    const balance = income + reimb - spent;
    return `Cash-flow summary: money in ${AED(income + reimb)}, spent ${AED(spent)}, remaining ${AED(balance)}. Full breakdown with Paid By and Payment Method is in the Finance tab.`;
  }

  // Bills / utilities
  if (has(msg, 'bill', 'bills', 'utility', 'utilities', 'dewa', 'tasleem', 'lootah', 'gas', 'electricity', 'water', 'cooling', 'account')) {
    if (!utilities.length) return 'Your bills are all in order. Full details are in the Bills tab.';
    const lines = utilities.map((u) => `• ${u.name} — ${u.statusText}`).join('\n');
    return `Here are your accounts & utilities:\n${lines}`;
  }

  // Pending / awaiting decision
  if (has(msg, 'pending', 'awaiting', 'waiting', 'approve', 'approval', 'decision', 'decide', 'to do', 'todo', 'need from me', 'my attention')) {
    if (!awaiting.length) return 'Nothing needs your decision right now — everything is in our hands ✨';
    return `These are awaiting you, Layla:\n${awaiting.map(bullet).join('\n')}`;
  }

  // Completed
  if (has(msg, 'completed', 'complete', 'done', 'finished', 'closed', 'today', 'resolved')) {
    if (!completed.length) return 'Nothing marked completed yet — work is in progress.';
    return `Completed and closed:\n${completed.map((c) => `• ${c.title}`).join('\n')}`;
  }

  // In progress
  if (has(msg, 'progress', 'in our hands', 'working', 'ongoing', 'active', 'handling', 'status of everything', 'update')) {
    if (!inHand.length && !awaiting.length) return 'All caught up — nothing open at the moment.';
    const parts: string[] = [];
    if (inHand.length) parts.push(`In our hands:\n${inHand.map(bullet).join('\n')}`);
    if (awaiting.length) parts.push(`Awaiting you:\n${awaiting.map(bullet).join('\n')}`);
    return parts.join('\n\n');
  }

  // Upcoming / this week (key dates + due dates)
  if (has(msg, 'week', 'upcoming', 'due', 'soon', 'deadline', 'renew', 'expire', 'next')) {
    const kd = data.keyDates.filter((k) => k.status !== 'dismissed').map((k) => `• ${k.label} — ${k.date}`);
    const due = cases.filter((c) => c.dueDate).map((c) => `• ${c.title} — due ${c.dueDate}`);
    const all = [...kd, ...due];
    if (!all.length) return 'Nothing time-sensitive coming up. I will flag anything the moment it appears.';
    return `Coming up:\n${all.slice(0, 6).join('\n')}`;
  }

  // Contact / call
  if (has(msg, 'call', 'whatsapp', 'reach', 'contact you', 'phone', 'speak', 'talk to')) {
    return 'Of course — tap the Call button to reach Mimo, or send a WhatsApp anytime. I am always connected 💬';
  }

  // How many / counts
  if (has(msg, 'how many', 'count', 'total', 'number of')) {
    return `You have ${awaiting.length} awaiting your decision, ${inHand.length} in our hands, and ${completed.length} completed.`;
  }

  // Direct case-name / topic match (e.g. "the bag", "dress", "shoe", "rug", "laundry")
  const topicMatch = cases.find((c) => {
    const t = c.title.toLowerCase();
    return (
      (has(msg, 'bag', 'louis', 'vuitton', 'lv') && has(t, 'bag', 'vuitton')) ||
      (has(msg, 'dress', 'tailor', 'alteration', 'sew') && has(t, 'dress', 'tailor', 'alteration')) ||
      (has(msg, 'shoe', 'boot', 'heel') && has(t, 'shoe', 'boot')) ||
      (has(msg, 'rug', 'mat', 'bath') && has(t, 'rug', 'mat', 'bath')) ||
      (has(msg, 'carpet', 'upholstery', 'sofa', 'apartment') && has(t, 'carpet', 'upholstery', 'apartment')) ||
      (has(msg, 'laundry') && has(t, 'laundry')) ||
      (has(msg, 'photo', 'photograph', 'resale', 'sell') && has(t, 'photo', 'resale'))
    );
  });
  if (topicMatch) {
    const state = topicMatch.clientState.replace(/^[^\w]+/, '').trim();
    return `${topicMatch.title}: ${state}. Next step — ${topicMatch.nextStep || 'in progress by Mimo'}.`;
  }

  // Broad "list / everything"
  if (has(msg, 'list', 'all', 'everything', 'cases', 'tasks', 'overview', 'summary', 'what is happening')) {
    return `Quick overview — ${awaiting.length} awaiting you, ${inHand.length} in our hands, ${completed.length} completed. Say "what's pending", "what's completed", "my bills" or "my balance" for detail.`;
  }

  return null;
}
