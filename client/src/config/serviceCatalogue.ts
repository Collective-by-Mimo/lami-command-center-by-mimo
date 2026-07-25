/**
 * LaMi Service Catalogue — the full client-facing service list from the
 * presentation brief, rendered in-app on the Services screen. English-only.
 * status: 'live' = built & operational · 'ready' = can start immediately,
 * no build needed · 'phase2' = planned.
 */

export type ServiceStatus = 'live' | 'ready' | 'phase2';

export interface ServiceItem {
  name: string;
  status: ServiceStatus;
  note?: string;
}

export interface ServiceDomain {
  id: string;
  title: string;
  emoji: string; // lightweight domain marker (kept subtle in the UI)
  services: ServiceItem[];
}

export const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = {
  live: 'Live',
  ready: 'Ready',
  phase2: 'Phase 2'
};

export const PROPOSITION = {
  headline: 'One portal replaces twenty apps, twenty logins and twenty phone calls.',
  sub: 'You never chase a status. The status arrives.'
};

export const SERVICE_DOMAINS: ServiceDomain[] = [
  {
    id: 'home',
    title: 'Home & Property',
    emoji: '🏠',
    services: [
      { name: 'Cleaning schedule, standards & vendor management', status: 'live' },
      { name: 'Maintenance & repairs — report, chase, verify completion', status: 'live' },
      { name: 'DEWA, district cooling (Tasleem), gas — accounts, bills, disputes, credits', status: 'live' },
      { name: 'Wardrobe organisation & seasonal rotation', status: 'ready' },
      { name: 'Room refresh, climate & air-quality management', status: 'ready' },
      { name: 'Household consumables — stock levels & reorder before they run out', status: 'ready' },
      { name: 'Contractor & handover supervision', status: 'ready' }
    ]
  },
  {
    id: 'health',
    title: 'Health & Routine',
    emoji: '🌿',
    services: [
      { name: 'Supplement tracking — reorder before the last dose', status: 'ready' },
      { name: 'Grocery ordering aligned to her nutrition plan', status: 'ready' },
      { name: 'Gym & class scheduling, coordination with her trainer', status: 'ready' },
      { name: 'Appointment booking — clinic, dentist, physio, aesthetics', status: 'ready' },
      { name: 'Weekly & monthly routine calendar, maintained', status: 'ready' }
    ]
  },
  {
    id: 'travel',
    title: 'Travel & Mobility',
    emoji: '✈️',
    services: [
      { name: 'Flights, hotels, reservations — booking, changes, cancellations', status: 'ready' },
      { name: 'Full itinerary in the app, confirmations attached', status: 'phase2' },
      { name: 'Airport transfers & personal driving', status: 'ready', note: 'Confirm UAE licence status' },
      { name: 'Travel accompaniment at short notice', status: 'ready' },
      { name: 'Travel document expiry tracking', status: 'ready' },
      { name: '"Take me home" — one tap to navigation', status: 'live' }
    ]
  },
  {
    id: 'finance',
    title: 'Financial & Administrative',
    emoji: '📊',
    services: [
      { name: 'Bill tracking, deadlines & payment confirmation', status: 'live' },
      { name: 'Finance ledger — every case with its cost', status: 'live' },
      { name: 'Consolidated reporting — one screen instead of twenty portals', status: 'live' },
      { name: 'Expense categorisation across categories', status: 'live' },
      { name: 'Refund, credit & dispute recovery', status: 'live', note: 'Recovered AED 3,216.08 on one case' },
      { name: 'Consumer-rights claims & formal escalation', status: 'live' },
      { name: 'Monthly household report — spend, cases closed, money recovered', status: 'ready' }
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Procurement',
    emoji: '🛍️',
    services: [
      { name: 'Sourcing with multiple competing quotes before purchase', status: 'live', note: 'Louis Vuitton request answered with four quotes' },
      { name: 'Order placement, tracking & delivery coordination', status: 'live' },
      { name: 'Returns, exchanges & warranty claims', status: 'ready' },
      { name: 'Gift sourcing & occasion reminders', status: 'ready' }
    ]
  },
  {
    id: 'concierge',
    title: 'Concierge & Communication',
    emoji: '🛎️',
    services: [
      { name: 'AI concierge answering from her live case history, any hour', status: 'live' },
      { name: '"What’s my plan tomorrow?" — briefed on request', status: 'live' },
      { name: 'Recall of any case, however long ago', status: 'live' },
      { name: 'WhatsApp per case, message pre-written', status: 'live' },
      { name: 'English interface', status: 'live' },
      { name: 'Internal calling inside the app', status: 'phase2' }
    ]
  },
  {
    id: 'documents',
    title: 'Documents & Compliance',
    emoji: '📁',
    services: [
      { name: 'Renewal radar — Emirates ID, tenancy, insurance, vehicle, passport', status: 'ready' },
      { name: 'Document vault, retrievable in seconds', status: 'phase2' },
      { name: 'Formal correspondence & official letters', status: 'live' }
    ]
  }
];
