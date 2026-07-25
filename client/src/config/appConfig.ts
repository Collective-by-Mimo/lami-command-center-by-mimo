/**
 * LaMi operator-editable configuration — home address, phone directory,
 * provider portals and the case category taxonomy.
 * Everything here is plain data: Mimo can adjust numbers, labels and
 * categories without touching component code.
 */
import { I18nText, CaseItem } from '../types';

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

// ——— Case category taxonomy (extensible — add entries here to grow it) ———
export interface CaseCategoryDef {
  id: string;
  emoji: string;
  label: I18nText;
}

export const CASE_CATEGORIES: CaseCategoryDef[] = [
  { id: 'viagens-reservas', emoji: '✈️', label: { pt: 'Viagens & Reservas', en: 'Travel & Reservations', he: 'נסיעות והזמנות' } },
  { id: 'moda-luxo', emoji: '👜', label: { pt: 'Moda & Luxo', en: 'Fashion & Luxury', he: 'אופנה ויוקרה' } },
  { id: 'lavanderia', emoji: '🧺', label: { pt: 'Lavanderia', en: 'Laundry', he: 'מכבסה' } },
  { id: 'locacao-apartamento', emoji: '🔑', label: { pt: 'Locação & Apartamento', en: 'Lease & Apartment', he: 'שכירות ודירה' } },
  { id: 'manutencao-condominio', emoji: '🔧', label: { pt: 'Manutenção & Condomínio', en: 'Maintenance & Building', he: 'תחזוקה וועד בית' } },
  { id: 'utilidades', emoji: '⚡', label: { pt: 'Utilidades', en: 'Utilities', he: 'שירותים ציבוריים' } },
  { id: 'mae-bebe', emoji: '🍼', label: { pt: 'Mãe & Bebê', en: 'Mother & Baby', he: 'אם ותינוק' } },
  { id: 'funcionarios-vistos', emoji: '🛂', label: { pt: 'Funcionários & Vistos', en: 'Staff & Visas', he: 'עובדים ואשרות' } },
  { id: 'transporte', emoji: '🚗', label: { pt: 'Transporte', en: 'Transport', he: 'תחבורה' } },
  { id: 'limpeza', emoji: '🧹', label: { pt: 'Limpeza', en: 'Cleaning', he: 'ניקיון' } },
  { id: 'colegas-quarto', emoji: '🛏️', label: { pt: 'Colegas de Quarto', en: 'Roommates', he: 'שותפים לדירה' } },
  { id: 'saude', emoji: '🩺', label: { pt: 'Saúde', en: 'Health', he: 'בריאות' } },
  { id: 'emergencia', emoji: '🚨', label: { pt: 'Emergência', en: 'Emergency', he: 'חירום' } },
  { id: 'pessoal', emoji: '🌸', label: { pt: 'Pessoal', en: 'Personal', he: 'אישי' } }
];

export function getCaseCategory(id?: string): CaseCategoryDef | undefined {
  return CASE_CATEGORIES.find((c) => c.id === id);
}

// Legacy emoji → category fallback for cases persisted before the taxonomy existed
const EMOJI_CATEGORY_FALLBACK: Record<string, string> = {
  '👜': 'moda-luxo',
  '🌸': 'pessoal',
  '🧺': 'lavanderia',
  '🚿': 'manutencao-condominio',
  '🔧': 'manutencao-condominio',
  '🧹': 'limpeza',
  '🧶': 'limpeza',
  '⚡': 'utilidades',
  '❄️': 'utilidades',
  '🔥': 'utilidades',
  '🚗': 'transporte',
  '🛂': 'funcionarios-vistos',
  '🔑': 'locacao-apartamento',
  '✈️': 'viagens-reservas',
  '🍼': 'mae-bebe',
  '🩺': 'saude',
  '🚨': 'emergencia'
};

export function resolveCaseCategory(caseItem: CaseItem): string {
  if (caseItem.category && getCaseCategory(caseItem.category)) return caseItem.category;
  return EMOJI_CATEGORY_FALLBACK[caseItem.emoji] || 'pessoal';
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
