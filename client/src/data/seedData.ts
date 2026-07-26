import { CaseItem, BriefingData, UtilityItem, FinanceTransaction } from '../types';

export const INITIAL_BRIEFING: BriefingData = {
  lastUpdated: '2026-07-24T09:00:00Z',
  prose: "Welcome to your dashboard. Everything being handled for you appears here in real time. Today: the Louis Vuitton bag goes for quotations tomorrow morning at Dubai Mall; the bathroom leak will be reported to building management; your Tasleem account has been analyzed — the −3,216.08 AED balance appears to be credit in your favor, which I will confirm by phone. One laundry quotation awaits your approval."
};

export const INITIAL_UTILITIES: UtilityItem[] = [
  {
    id: 'ut-dewa',
    name: 'DEWA (Electricity & Water)',
    type: 'DEWA',
    contractAccount: '2060863309',
    notes: 'Auto-pay active. Monthly consumption monitoring.',
    statusText: 'Up to date · Next cycle processing'
  },
  {
    id: 'ut-tasleem',
    name: 'Tasleem (Central A/C & Cooling)',
    type: 'Tasleem',
    customerNumber: '2144145',
    notes: 'Balance verification in progress by operator. Current balance: −3,216.08 AED (estimated credit).',
    statusText: 'Under phone verification · No payment due'
  },
  {
    id: 'ut-lootah',
    name: 'Lootah Gas (Central Gas Supply)',
    type: 'Lootah Gas',
    phone: '+971 58 592 9669',
    notes: 'Call center: 800 5224 · Support via WhatsApp & Phone.',
    statusText: 'Account active · Registration verified'
  }
];

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx-2026-07-01',
    date: '2026-07-24',
    description: 'Laundry — 5 delicate pieces (home pickup)',
    category: 'lavanderia',
    amountAED: 640,
    type: 'expense',
    status: 'pending'
  },
  {
    id: 'tx-2026-07-02',
    date: '2026-07-20',
    description: 'DEWA — July monthly bill',
    category: 'utilidades',
    amountAED: 1240.55,
    type: 'expense',
    status: 'confirmed'
  },
  {
    id: 'tx-2026-07-03',
    date: '2026-07-18',
    description: 'Tasleem — credit under review (−3,216.08 AED)',
    category: 'utilidades',
    amountAED: 3216.08,
    type: 'reimbursement',
    status: 'pending'
  },
  {
    id: 'tx-2026-07-04',
    date: '2026-07-15',
    description: 'Monthly advance — household fund',
    category: 'casa',
    amountAED: 5000,
    type: 'income',
    status: 'confirmed'
  },
  {
    id: 'tx-2026-07-05',
    date: '2026-07-10',
    description: 'Just Life — weekly cleaning (full month)',
    category: 'limpeza',
    amountAED: 780,
    type: 'expense',
    status: 'confirmed'
  },
  {
    id: 'tx-2026-06-01',
    date: '2026-06-28',
    description: 'Orchids — residence arrangements',
    category: 'pessoal',
    amountAED: 420,
    type: 'expense',
    status: 'reimbursed'
  }
];

export const INITIAL_CASES: CaseItem[] = [
  {
    id: 'case-lv-bag',
    category: 'moda-luxo',
    emoji: '👜',
    title: 'Louis Vuitton Bag — Repair',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'High',
    isRecurring: false,
    nextStep: 'Collect 4 quotes at Dubai Mall',
    subtasks: [
      { id: 'st-lv-1', title: 'Visit boutiques at Dubai Mall', completed: true },
      { id: 'st-lv-2', title: 'Obtain 4 repair quotes & timelines', completed: true },
      { id: 'st-lv-3', title: 'Formulate Mimo’s official recommendation', completed: true },
      { id: 'st-lv-4', title: 'Final approval from client Layla', completed: false },
      { id: 'st-lv-5', title: 'Drop off item at atelier & issue receipt', completed: false }
    ],
    timeline: [
      {
        id: 'tl-lv-1',
        date: '2026-07-24',
        time: '10:00',
        addedBy: 'operator',
        content: 'Case opened. Goal: LV bag repair. Plan: visit 4 stores in Dubai Mall, compare quotes (store, price, timeline) and present recommendation for approval.'
      }
    ],
    quotations: [
      {
        id: 'q-lv-1',
        title: 'Dubai Mall Main Boutique (LV Official)',
        priceAED: 850,
        timeline: '10 business days',
        observation: '100% genuine parts with official Louis Vuitton warranty.',
        isRecommended: true,
        recommendationReason: 'Recommended: Preserves warranty and original resale value.'
      },
      {
        id: 'q-lv-2',
        title: 'The Leather Doctor (Mall of the Emirates)',
        priceAED: 650,
        timeline: '5 business days',
        observation: 'Specialized luxury leather atelier.',
        isRecommended: false
      },
      {
        id: 'q-lv-3',
        title: 'Minutes Key & Shoe Repair (Dubai Mall)',
        priceAED: 450,
        timeline: '3 business days',
        observation: 'Quick stitching touch-up without leather replacement.',
        isRecommended: false
      },
      {
        id: 'q-lv-4',
        title: 'Luxury Care Atelier (DIFC)',
        priceAED: 920,
        timeline: '7 business days',
        observation: 'Full leather conditioning and gold-plated hardware polish.',
        isRecommended: false
      }
    ]
  },
  {
    id: 'case-laundry',
    category: 'lavanderia',
    emoji: '🧺',
    title: 'Laundry — Quote & Dispatch',
    clientState: '🔔 Awaiting you',
    internalStatus: 'Awaiting approval',
    priority: 'Normal',
    isRecurring: false,
    nextStep: 'Send quotation for approval',
    subtasks: [
      { id: 'st-lau-1', title: 'Sorting & inventory of 5 delicate items', completed: true },
      { id: 'st-lau-2', title: 'Special quote with door-to-door pickup', completed: true },
      { id: 'st-lau-3', title: 'Client approval of 640 AED quote', completed: false },
      { id: 'st-lau-4', title: 'Schedule laundry pickup', completed: false },
      { id: 'st-lau-5', title: 'Quality inspection upon return', completed: false }
    ],
    timeline: [
      {
        id: 'tl-lau-1',
        date: '2026-07-24',
        time: '09:30',
        addedBy: 'operator',
        content: 'Case opened. Items will be sent to the laundry following quotation approval.'
      }
    ],
    quotations: [
      {
        id: 'q-lau-1',
        title: 'Delicate silk dresses (2x)',
        priceAED: 180,
        quantity: 2,
        observation: 'Eco dry cleaning & hand pressing'
      },
      {
        id: 'q-lau-2',
        title: 'Italian wool coats (2x)',
        priceAED: 240,
        quantity: 2,
        observation: 'Anti-pilling & thermal sanitization'
      },
      {
        id: 'q-lau-3',
        title: 'Egyptian cotton bedding set',
        priceAED: 220,
        quantity: 1,
        observation: 'Gentle neutral wash & crisp pressing'
      }
    ],
    decision: {
      prompt: 'Specialty laundry quote total: 640 AED for 5 delicate items with door-to-door collection & delivery. Would you like to approve?',
      options: [
        {
          id: 'approve',
          label: 'Approve 640 AED & authorize pickup',
          variant: 'primary'
        },
        {
          id: 'adjust',
          label: 'Request item adjustment',
          variant: 'secondary'
        }
      ]
    }
  },
  {
    id: 'case-bathroom-leak',
    category: 'manutencao-condominio',
    emoji: '🚿',
    title: 'Bathroom Ceiling Leak',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'High',
    isRecurring: false,
    nextStep: 'Contact building management and schedule inspection',
    subtasks: [
      { id: 'st-leak-1', title: 'Notify building management', completed: true },
      { id: 'st-leak-2', title: 'Technical inspection of bathroom ceiling', completed: true },
      { id: 'st-leak-3', title: 'Oversee upper floor plumbing repair', completed: false },
      { id: 'st-leak-4', title: 'Plaster restoration & painting', completed: false }
    ],
    timeline: [
      {
        id: 'tl-leak-1',
        date: '2026-07-24',
        time: '08:45',
        addedBy: 'operator',
        content: 'Bathroom ceiling leak. Action: notify building management, schedule technical visit, and oversee repair until final verification.'
      }
    ]
  },
  {
    id: 'case-tasleem-balance',
    category: 'utilidades',
    emoji: '❄️',
    title: 'Tasleem (district cooling) — Balance Verification',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'High',
    isRecurring: false,
    utilityType: 'Tasleem',
    nextStep: 'Call Tasleem to clarify balance and the 17/04 adjustment',
    timeline: [
      {
        id: 'tl-tas-1',
        date: '2026-07-24',
        time: '09:00',
        addedBy: 'operator',
        content: 'Initial invoice analysis: current balance is −3,216.08 AED. In utility billing systems, negative balance typically indicates credit in customer favor — not debt.'
      },
      {
        id: 'tl-tas-2',
        date: '2026-07-24',
        time: '09:15',
        addedBy: 'operator',
        content: 'Payments identified on 24/07/2026: 804.02 + 1,608.04 = 2,412.06 AED.'
      },
      {
        id: 'tl-tas-3',
        date: '2026-07-24',
        time: '09:20',
        addedBy: 'operator',
        content: 'Point to clarify: on 17/04/2026 there is a +1,500.00 AED adjustment and a −1,710.00 AED receipt without visible breakdown.'
      },
      {
        id: 'tl-tas-4',
        date: '2026-07-24',
        time: '09:30',
        addedBy: 'operator',
        content: 'Next action: contact Tasleem customer care to confirm that the balance is credit and verify adjustment details.'
      }
    ]
  },
  {
    id: 'case-dewa-cycle',
    category: 'utilidades',
    emoji: '⚡',
    title: 'DEWA — Monthly Billing Cycle',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'Normal',
    isRecurring: true,
    utilityType: 'DEWA',
    nextStep: 'Confirm current cycle due date',
    timeline: [
      {
        id: 'tl-dew-1',
        date: '2026-07-20',
        time: '11:00',
        addedBy: 'operator',
        content: 'Recurring case. Monthly tracking of DEWA bill. Contract account 2060863309.'
      }
    ]
  },
  {
    id: 'case-lootah-gas',
    category: 'utilidades',
    emoji: '🔥',
    title: 'Lootah Gas — Registration & Contact',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'Normal',
    isRecurring: false,
    utilityType: 'Lootah Gas',
    nextStep: 'Verify gas account status',
    timeline: [
      {
        id: 'tl-gas-1',
        date: '2026-07-22',
        time: '14:00',
        addedBy: 'operator',
        content: 'Case opened. Gas registration verification and active account check.'
      }
    ]
  },
  {
    id: 'case-just-life',
    category: 'limpeza',
    emoji: '🧹',
    title: 'Just Life — End of Lease Billing',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'Normal',
    isRecurring: true,
    utilityType: 'Just Life',
    nextStep: 'Contact Just Life regarding end-of-lease billing; weekly service schedule',
    timeline: [
      {
        id: 'tl-jl-1',
        date: '2026-07-21',
        time: '15:30',
        addedBy: 'operator',
        content: 'Alignment with Just Life for weekly cleaning service and final lease billing adjustments.'
      }
    ]
  },
  {
    id: 'case-carpets-ana',
    category: 'limpeza',
    emoji: '🧶',
    title: 'Carpet Care — Coordinate with Ana',
    clientState: '✅ In our hands',
    internalStatus: 'Open',
    priority: 'Normal',
    isRecurring: false,
    nextStep: 'Speak with Ana about the carpets',
    timeline: [
      {
        id: 'tl-car-1',
        date: '2026-07-23',
        time: '16:00',
        addedBy: 'operator',
        content: 'Case opened for carpet cleaning and arrangement in coordination with Ana.'
      }
    ]
  },

  // Completed cases for Archive
  {
    id: 'case-orchids-completed',
    category: 'pessoal',
    emoji: '🌸',
    title: 'Residence Orchids & Floral Arrangements',
    clientState: '✔️ Completed',
    internalStatus: 'Completed',
    priority: 'Normal',
    isRecurring: true,
    completedMonth: '2026-06',
    nextStep: 'Successfully completed',
    timeline: [
      {
        id: 'tl-orc-1',
        date: '2026-06-12',
        time: '11:00',
        addedBy: 'operator',
        content: 'Replacement of white orchid pots in main living room and entrance foyer completed.'
      }
    ],
    completionProof: {
      note: 'Delivered and placed at residence according to specifications.',
      completedAt: '2026-06-12'
    }
  },
  {
    id: 'case-rta-car-completed',
    category: 'transporte',
    emoji: '🚗',
    title: 'RTA Vehicle Registration Renewal',
    clientState: '✔️ Completed',
    internalStatus: 'Completed',
    priority: 'High',
    isRecurring: false,
    completedMonth: '2026-05',
    nextStep: 'Successfully completed',
    timeline: [
      {
        id: 'tl-rta-1',
        date: '2026-05-18',
        time: '14:20',
        addedBy: 'operator',
        content: 'Vehicle inspection completed at RTA Tasjeel, insurance renewed and e-Mulkiya issued.'
      }
    ],
    completionProof: {
      note: 'Digital document and Mulkiya card updated until May 2027.',
      completedAt: '2026-05-18'
    }
  }
];
