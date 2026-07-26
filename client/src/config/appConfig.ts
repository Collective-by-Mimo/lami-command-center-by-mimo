/**
 * LaMi operator-editable configuration — home address, phone directory,
 * provider portals and the case category taxonomy.
 * Everything here is plain data: Mimo can adjust numbers, labels and
 * categories without touching component code.
 */
import { I18nText, CaseItem, PaidBy, PaymentMethod } from '../types';

// ——— Mimo / LaMi direct line ———
export const MIMO_WHATSAPP_NUMBER = '971585929669'; // digits only, for wa.me links
export const MIMO_PHONE_DISPLAY = '+971 58 592 9669';
export const MIMO_PHONE_TEL = '+971585929669';

// ——— Home address ("Take me home") ———
export const HOME_CONFIG = {
  label: 'Opera Tower 2, Apt 0304, Floor 3, Downtown, Dubai',
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Opera+Tower+2+Downtown+Dubai'
};

// ——— Contacts directory (tap-to-call) ———
export interface ContactPhone {
  display: string;
  tel: string;
}

export interface ContactEntry {
  id: string;
  name: string;
  phones: ContactPhone[];
  whatsapp?: string; // digits only, enables a wa.me action next to the call button
}

export interface ContactCategory {
  id: string;
  emoji: string;
  label: I18nText;
  entries: ContactEntry[];
}

export const CONTACT_CATEGORIES: ContactCategory[] = [
  {
    id: 'emergency',
    emoji: '🚨',
    label: { pt: 'Emergência', en: 'Emergency', he: 'חירום' },
    entries: [
      { id: 'police', name: 'Police', phones: [{ display: '999', tel: '999' }] },
      { id: 'ambulance', name: 'Ambulance', phones: [{ display: '998', tel: '998' }] },
      { id: 'civil-defence', name: 'Civil Defence', phones: [{ display: '997', tel: '997' }] }
    ]
  },
  {
    id: 'utilities',
    emoji: '⚡',
    label: { pt: 'Utilidades', en: 'Utilities', he: 'שירותים ציבוריים' },
    entries: [
      {
        id: 'dewa',
        name: 'DEWA',
        phones: [
          { display: '04 601 9999', tel: '+97146019999' },
          { display: '991', tel: '991' }
        ]
      },
      { id: 'tasleem', name: 'Tasleem', phones: [{ display: '800 827 5336', tel: '8008275336' }] },
      { id: 'lootah', name: 'Lootah Gas', phones: [{ display: '800 5224', tel: '8005224' }] },
      { id: 'empower', name: 'Empower', phones: [{ display: '800 3672697', tel: '8003672697' }] }
    ]
  },
  {
    id: 'home-community',
    emoji: '🏠',
    label: { pt: 'Casa & Condomínio', en: 'Home & Community', he: 'בית וקהילה' },
    entries: [{ id: 'emaar', name: 'Emaar', phones: [{ display: '800 36227', tel: '80036227' }] }]
  },
  {
    id: 'health',
    emoji: '🩺',
    label: { pt: 'Saúde', en: 'Health', he: 'בריאות' },
    entries: [{ id: 'dha', name: 'DHA', phones: [{ display: '800 342', tel: '800342' }] }]
  },
  {
    id: 'transport',
    emoji: '🚗',
    label: { pt: 'Transporte', en: 'Transport', he: 'תחבורה' },
    entries: [
      { id: 'rta', name: 'RTA', phones: [{ display: '800 9090', tel: '8009090' }] },
      { id: 'dubai-taxi', name: 'Dubai Taxi', phones: [{ display: '04 208 0808', tel: '+97142080808' }] }
    ]
  },
  {
    id: 'mimo',
    emoji: '🛎️',
    label: { pt: 'Mimo / LaMi', en: 'Mimo / LaMi', he: 'מימו / LaMi' },
    entries: [
      {
        id: 'mimo-direct',
        name: 'Mimo — Private Office',
        phones: [{ display: MIMO_PHONE_DISPLAY, tel: MIMO_PHONE_TEL }],
        whatsapp: MIMO_WHATSAPP_NUMBER
      }
    ]
  }
];

// ——— Connections — provider portal shortcuts (launcher only, no stored credentials) ———
export interface ConnectionProvider {
  id: string;
  name: string;
  url: string;
  host: string;
  badgeBg: string; // brand-inspired badge colors (styled text, not scraped logos)
  badgeFg: string;
  tagline: I18nText;
}

export const CONNECTION_PROVIDERS: ConnectionProvider[] = [
  {
    id: 'dewa',
    name: 'DEWA',
    url: 'https://www.dewa.gov.ae',
    host: 'dewa.gov.ae',
    badgeBg: '#00693C',
    badgeFg: '#FFFFFF',
    tagline: { pt: 'Água & Energia', en: 'Water & Power', he: 'מים וחשמל' }
  },
  {
    id: 'tasleem',
    name: 'Tasleem',
    url: 'https://www.tabreed.ae',
    host: 'tabreed.ae',
    badgeBg: '#0072BC',
    badgeFg: '#FFFFFF',
    tagline: { pt: 'Ar-condicionado central', en: 'District cooling', he: 'מיזוג מרכזי' }
  },
  {
    id: 'lootah',
    name: 'Lootah',
    url: 'https://www.lootahgas.ae',
    host: 'lootahgas.ae',
    badgeBg: '#E87722',
    badgeFg: '#FFFFFF',
    tagline: { pt: 'Gás central', en: 'Central gas', he: 'גז מרכזי' }
  },
  {
    id: 'du',
    name: 'du',
    url: 'https://www.du.ae',
    host: 'du.ae',
    badgeBg: '#753BBD',
    badgeFg: '#FFFFFF',
    tagline: { pt: 'Internet & Telefonia', en: 'Internet & Mobile', he: 'אינטרנט וסלולר' }
  },
  {
    id: 'emaar',
    name: 'Emaar',
    url: 'https://www.emaar.com',
    host: 'emaar.com',
    badgeBg: '#1A1A1A',
    badgeFg: '#D4AF37',
    tagline: { pt: 'Condomínio & Comunidade', en: 'Community & Building', he: 'קהילה ובניין' }
  },
  {
    id: 'eand',
    name: 'e&',
    url: 'https://www.eand.com',
    host: 'eand.com',
    badgeBg: '#E00800',
    badgeFg: '#FFFFFF',
    tagline: { pt: 'Telecom & Serviços', en: 'Telecom & Services', he: 'תקשורת ושירותים' }
  }
];

// ——— Case category taxonomy (nested; English-only display) ———
// I18nText is retained as the label shape for compatibility; only English is
// filled and rendered. `L` keeps the definitions terse.
const L = (s: string): I18nText => ({ pt: s, en: s, he: s });

export interface CaseSubcategory {
  id: string;
  label: I18nText;
}

export interface CaseCategoryDef {
  id: string;
  emoji: string;
  label: I18nText;
  subcategories?: CaseSubcategory[];
}

export const CASE_CATEGORIES: CaseCategoryDef[] = [
  { id: 'home', emoji: '🏠', label: L('Home & Accommodation'), subcategories: [
    { id: 'electricity', label: L('Electricity (DEWA)') },
    { id: 'water', label: L('Water') },
    { id: 'cooling', label: L('District Cooling (Tasleem)') },
    { id: 'gas', label: L('Gas (Lootah)') },
    { id: 'internet', label: L('Internet & Telecom') },
    { id: 'cleaning', label: L('Cleaning') },
    { id: 'maintenance', label: L('Maintenance & Repairs') },
    { id: 'furniture', label: L('Furniture & Décor') },
    { id: 'community', label: L('Community & Building') },
    { id: 'moving', label: L('Moving & Handover') }
  ] },
  { id: 'transportation', emoji: '🚗', label: L('Transportation'), subcategories: [
    { id: 'car', label: L('Car') },
    { id: 'fuel', label: L('Fuel') },
    { id: 'taxi', label: L('Taxi & RTA') },
    { id: 'parking', label: L('Parking & Salik') },
    { id: 'registration', label: L('Registration & Insurance') },
    { id: 'driver', label: L('Driver') }
  ] },
  { id: 'reservations', emoji: '🎟️', label: L('Reservations & Bookings'), subcategories: [
    { id: 'restaurants', label: L('Restaurants & Cafés') },
    { id: 'entertainment', label: L('Arts & Entertainment') },
    { id: 'cinema', label: L('Cinema') },
    { id: 'events', label: L('Events & Occasions') },
    { id: 'hotels', label: L('Hotels') },
    { id: 'emergency-booking', label: L('Emergency Bookings') }
  ] },
  { id: 'fashion', emoji: '👜', label: L('Fashion & Luxury'), subcategories: [
    { id: 'repair', label: L('Bag & Shoe Repair') },
    { id: 'shopping', label: L('Shopping') },
    { id: 'tailoring', label: L('Tailoring & Alterations') },
    { id: 'laundry', label: L('Laundry & Dry Cleaning') },
    { id: 'jewelry', label: L('Jewelry') }
  ] },
  { id: 'health', emoji: '🩺', label: L('Health & Wellness'), subcategories: [
    { id: 'appointments', label: L('Appointments') },
    { id: 'supplements', label: L('Supplements') },
    { id: 'gym', label: L('Gym & Classes') },
    { id: 'pharmacy', label: L('Pharmacy') }
  ] },
  { id: 'mother-daughter', emoji: '👶', label: L('Mother & Daughter'), subcategories: [
    { id: 'school', label: L('School & Nursery') },
    { id: 'activities', label: L("Kids' Activities") },
    { id: 'pediatric', label: L('Pediatric & Health') },
    { id: 'clothing', label: L('Clothing & Supplies') },
    { id: 'nanny', label: L('Nanny') }
  ] },
  { id: 'finance', emoji: '📊', label: L('Finance & Admin'), subcategories: [
    { id: 'bills', label: L('Bills') },
    { id: 'payments', label: L('Payments') },
    { id: 'reimbursements', label: L('Reimbursements') },
    { id: 'disputes', label: L('Disputes & Credits') },
    { id: 'reports', label: L('Reports') },
    { id: 'subscriptions', label: L('Subscriptions') }
  ] },
  { id: 'documents', emoji: '📁', label: L('Documents & Compliance'), subcategories: [
    { id: 'emirates-id', label: L('Emirates ID') },
    { id: 'visa', label: L('Visa') },
    { id: 'tenancy', label: L('Tenancy & Ejari') },
    { id: 'insurance', label: L('Insurance') },
    { id: 'passport', label: L('Passport') },
    { id: 'licences', label: L('Licences') },
    { id: 'letters', label: L('Official Letters') }
  ] },
  { id: 'staff', emoji: '🧹', label: L('Staff & Household Help'), subcategories: [
    { id: 'cleaner', label: L('Cleaner') },
    { id: 'nanny', label: L('Nanny') },
    { id: 'driver', label: L('Driver') },
    { id: 'handyman', label: L('Handyman') },
    { id: 'vendor', label: L('Vendor') }
  ] },
  { id: 'groceries', emoji: '🛒', label: L('Groceries & Consumables'), subcategories: [
    { id: 'grocery', label: L('Grocery Orders') },
    { id: 'household', label: L('Household Supplies') }
  ] },
  { id: 'travel', emoji: '✈️', label: L('Travel & Mobility'), subcategories: [
    { id: 'international', label: L('International Travel') },
    { id: 'itineraries', label: L('Itineraries') },
    { id: 'accompaniment', label: L('Accompaniment') },
    { id: 'travel-docs', label: L('Travel Documents') }
  ] },
  { id: 'personal', emoji: '🌸', label: L('Personal & Lifestyle'), subcategories: [
    { id: 'gifts', label: L('Gifts') },
    { id: 'salon', label: L('Salon & Beauty') },
    { id: 'errands', label: L('Errands') },
    { id: 'preferences', label: L('Preferences') }
  ] },
  { id: 'emergency', emoji: '🚨', label: L('Emergency'), subcategories: [
    { id: 'urgent', label: L('Urgent Contacts') },
    { id: 'emergency-card', label: L('Emergency Card') }
  ] }
];

// ——— User-added ("add your own") categories, persisted in localStorage ———
const CUSTOM_CATEGORIES_KEY = 'lami_custom_categories_v1';

export function getCustomCategories(): CaseCategoryDef[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addCustomCategory(name: string, emoji = '🏷️'): CaseCategoryDef {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat: CaseCategoryDef = { id: `custom-${slug || 'cat'}-${Date.now().toString(36)}`, emoji, label: L(name.trim()) };
  const list = getCustomCategories();
  list.push(cat);
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — ignore */
  }
  return cat;
}

/** Built-in categories plus any user-added ones. */
export function getAllCaseCategories(): CaseCategoryDef[] {
  return [...CASE_CATEGORIES, ...getCustomCategories()];
}

export function getCaseCategory(id?: string): CaseCategoryDef | undefined {
  if (!id) return undefined;
  return getAllCaseCategories().find((c) => c.id === id);
}

export function getSubcategory(catId?: string, subId?: string): CaseSubcategory | undefined {
  if (!catId || !subId) return undefined;
  return getCaseCategory(catId)?.subcategories?.find((s) => s.id === subId);
}

// Map pre-Phase-2 category ids onto the new taxonomy so existing cases keep a group.
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  'viagens-reservas': 'travel',
  'moda-luxo': 'fashion',
  'lavanderia': 'fashion',
  'locacao-apartamento': 'home',
  'manutencao-condominio': 'home',
  'utilidades': 'home',
  'mae-bebe': 'mother-daughter',
  'funcionarios-vistos': 'staff',
  'transporte': 'transportation',
  'limpeza': 'staff',
  'colegas-quarto': 'personal',
  'saude': 'health',
  'emergencia': 'emergency',
  'pessoal': 'personal'
};

// Emoji → category fallback for cases with no / unknown category id.
const EMOJI_CATEGORY_FALLBACK: Record<string, string> = {
  '👜': 'fashion', '🌸': 'personal', '🧺': 'fashion', '🚿': 'home', '🔧': 'home',
  '🧹': 'staff', '🧶': 'home', '⚡': 'home', '❄️': 'home', '🔥': 'home',
  '🚗': 'transportation', '🛂': 'documents', '🔑': 'home', '✈️': 'travel',
  '🍼': 'mother-daughter', '🩺': 'health', '🚨': 'emergency'
};

export function resolveCaseCategory(caseItem: CaseItem): string {
  const cat = caseItem.category;
  if (cat && getCaseCategory(cat)) return cat;
  if (cat && LEGACY_CATEGORY_MAP[cat]) return LEGACY_CATEGORY_MAP[cat];
  return EMOJI_CATEGORY_FALLBACK[caseItem.emoji] || 'personal';
}

// ——— Finance ledger categories ———
export const FINANCE_CATEGORIES: CaseCategoryDef[] = [
  { id: 'casa', emoji: '🏠', label: { pt: 'Casa', en: 'Home', he: 'בית' } },
  { id: 'utilidades', emoji: '⚡', label: { pt: 'Utilidades', en: 'Utilities', he: 'שירותים ציבוריים' } },
  { id: 'lavanderia', emoji: '🧺', label: { pt: 'Lavanderia', en: 'Laundry', he: 'מכבסה' } },
  { id: 'limpeza', emoji: '🧹', label: { pt: 'Limpeza', en: 'Cleaning', he: 'ניקיון' } },
  { id: 'compras', emoji: '🛍️', label: { pt: 'Compras', en: 'Shopping', he: 'קניות' } },
  { id: 'transporte', emoji: '🚗', label: { pt: 'Transporte', en: 'Transport', he: 'תחבורה' } },
  { id: 'saude', emoji: '🩺', label: { pt: 'Saúde', en: 'Health', he: 'בריאות' } },
  { id: 'pessoal', emoji: '🌸', label: { pt: 'Pessoal', en: 'Personal', he: 'אישי' } },
  { id: 'outros', emoji: '📎', label: { pt: 'Outros', en: 'Other', he: 'אחר' } }
];

export function getFinanceCategory(id?: string): CaseCategoryDef | undefined {
  return FINANCE_CATEGORIES.find((c) => c.id === id);
}

// Phase 3 — cash-flow attribution
export const PAID_BY_OPTIONS: PaidBy[] = ['Layla', 'Lior', 'Mimo', 'Other'];

export const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = [
  'Cash',
  'Card',
  'Bank Transfer',
  'PayPal',
  'Voucher',
  'Exchange',
  'Crypto'
];
