import { CaseItem, BriefingData, UtilityItem } from '../types';

export const INITIAL_BRIEFING: BriefingData = {
  lastUpdated: '2026-07-24T09:00:00Z',
  prose: {
    pt: "Bem-vinda ao seu painel. Tudo o que está sendo cuidado para você aparece aqui, em tempo real. Hoje: a bolsa Louis Vuitton entra em cotação amanhã cedo no Dubai Mall; o vazamento do banheiro será comunicado à administração do prédio; sua conta Tasleem já foi analisada — o saldo de −3.216,08 AED aparenta ser crédito a seu favor, e vou confirmar por telefone. Um orçamento de lavanderia aguarda sua aprovação.",
    en: "Welcome to your dashboard. Everything being handled for you appears here in real time. Today: the Louis Vuitton bag goes for quotations tomorrow morning at Dubai Mall; the bathroom leak will be reported to building management; your Tasleem account has been analyzed — the −3,216.08 AED balance appears to be credit in your favor, which I will confirm by phone. One laundry quotation awaits your approval.",
    he: "ברוכה הבאה ללוח הבקרה שלך. כל מה שמטופל עבורך מופיע כאן בזמן אמת. היום: תיק הלואי ויטון יוצא להצעות מחיר מחר בבוקר בדובאי מול; הנזילה בחדר האמבטיה תדווח להנהלת הבניין; חשבון ה-Tasleem שלך נותח — היתרה של −3,216.08 AED נראית כזכות לטובתך, ואאשר זאת טלפונית. הצעת מחיר אחת מהמכבסה ממתינה לאישורך."
  }
};

export const INITIAL_UTILITIES: UtilityItem[] = [
  {
    id: 'ut-dewa',
    name: 'DEWA (Electricity & Water)',
    type: 'DEWA',
    contractAccount: '2060863309',
    notes: {
      pt: 'Débito automático ativo. Acompanhamento mensal do consumo.',
      en: 'Auto-pay active. Monthly consumption monitoring.',
      he: 'חיוב אוטומטי פעיל. מעקב צריכה חודשי.'
    },
    statusText: {
      pt: 'Em dia · Próximo ciclo em processamento',
      en: 'Up to date · Next cycle processing',
      he: 'מעודכן · מחזור הבא בטיפול'
    }
  },
  {
    id: 'ut-tasleem',
    name: 'Tasleem (Central A/C & Cooling)',
    type: 'Tasleem',
    customerNumber: '2144145',
    notes: {
      pt: 'Análise de saldo em andamento pelo operador. Saldo atual: −3.216,08 AED (crédito estimado).',
      en: 'Balance verification in progress by operator. Current balance: −3,216.08 AED (estimated credit).',
      he: 'בדיקת יתרה בביצוע על ידי המפעיל. יתרה נוכחית: −3,216.08 AED (זיכוי מוערך).'
    },
    statusText: {
      pt: 'Em verificação telefônica · Sem pendência de pagamento',
      en: 'Under phone verification · No payment due',
      he: 'באימות טלפוני · אין תשלום פתוח'
    }
  },
  {
    id: 'ut-lootah',
    name: 'Lootah Gas (Central Gas Supply)',
    type: 'Lootah Gas',
    phone: '+971 58 592 9669',
    notes: {
      pt: 'Central: 800 5224 · Atendimento via WhatsApp e telefone.',
      en: 'Call center: 800 5224 · Support via WhatsApp & Phone.',
      he: 'מוקד: 800 5224 · תמיכה ב-WhatsApp ובטלפון.'
    },
    statusText: {
      pt: 'Conta ativa · Registro verificado',
      en: 'Account active · Registration verified',
      he: 'חשבון פעיל · רישום מאומת'
    }
  }
];

export const INITIAL_CASES: CaseItem[] = [
  {
    id: 'case-lv-bag',
    emoji: '👜',
    title: {
      pt: 'Bolsa Louis Vuitton — Reparo',
      en: 'Louis Vuitton Bag — Repair',
      he: 'תיק לואי ויטון — תיקון'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Alta',
    isRecurring: false,
    nextStep: {
      pt: 'Coletar 4 orçamentos no Dubai Mall',
      en: 'Collect 4 quotes at Dubai Mall',
      he: 'לאסוף 4 הצעות מחיר בדובאי מול'
    },
    subtasks: [
      { id: 'st-lv-1', title: { pt: 'Visitar boutiques no Dubai Mall', en: 'Visit boutiques at Dubai Mall', he: 'לבקר בבוטיקים בדובאי מול' }, completed: true },
      { id: 'st-lv-2', title: { pt: 'Obter 4 orçamentos e prazos de reparo', en: 'Obtain 4 repair quotes & timelines', he: 'לקבל 4 הצעות מחיר ולוחות זמנים' }, completed: true },
      { id: 'st-lv-3', title: { pt: 'Formular recomendação oficial do Mimo', en: 'Formulate Mimo’s official recommendation', he: 'לגבש המלצה רשמית של מימו' }, completed: true },
      { id: 'st-lv-4', title: { pt: 'Aprovação final pela cliente Layla', en: 'Final approval from client Layla', he: 'אישור סופי מהלקוחה לילה' }, completed: false },
      { id: 'st-lv-5', title: { pt: 'Entregar a peça no ateliê e emitir recibo', en: 'Drop off item at atelier & issue receipt', he: 'מסירת הפריט בסדנה והפקת קבלה' }, completed: false }
    ],
    timeline: [
      {
        id: 'tl-lv-1',
        date: '2026-07-24',
        time: '10:00',
        addedBy: 'operator',
        content: {
          pt: 'Caso aberto. Objetivo: reparo da bolsa LV. Plano: visitar 4 lojas no Dubai Mall, comparar orçamentos (loja, preço, prazo) e apresentar recomendação para aprovação.',
          en: 'Case opened. Goal: LV bag repair. Plan: visit 4 stores in Dubai Mall, compare quotes (store, price, timeline) and present recommendation for approval.',
          he: 'תיק נפתח. יעד: תיקון תיק לואי ויטון. תוכנית: לבקר ב-4 חנויות בדובאי מול, להשוות הצעות מחיר ולהציג המלצה לאישור.'
        }
      }
    ],
    quotations: [
      {
        id: 'q-lv-1',
        title: {
          pt: 'Dubai Mall Main Boutique (LV Official)',
          en: 'Dubai Mall Main Boutique (LV Official)',
          he: 'דובאי מול בוטיק ראשי (LV רשמי)'
        },
        priceAED: 850,
        timeline: { pt: '10 dias úteis', en: '10 business days', he: '10 ימי עסקים' },
        observation: {
          pt: 'Peças 100% originais com garantia de fábrica Louis Vuitton.',
          en: '100% genuine parts with official Louis Vuitton warranty.',
          he: 'חלקים מקוריים 100% עם אחריות רשמית של לואי ויטון.'
        },
        isRecommended: true,
        recommendationReason: {
          pt: 'Recomendado: Preserva a garantia e valor de revenda original da peça.',
          en: 'Recommended: Preserves warranty and original resale value.',
          he: 'מומלץ: שומר על האחריות וערך המכירה המקורי.'
        }
      },
      {
        id: 'q-lv-2',
        title: {
          pt: 'The Leather Doctor (Mall of the Emirates)',
          en: 'The Leather Doctor (Mall of the Emirates)',
          he: 'דוקטור העור (קניון האמירויות)'
        },
        priceAED: 650,
        timeline: { pt: '5 dias úteis', en: '5 business days', he: '5 ימי עסקים' },
        observation: {
          pt: 'Ateliê especializado em artigos de luxo.',
          en: 'Specialized luxury leather atelier.',
          he: 'סטודיו מתמחה במוצרי יוקרה.'
        },
        isRecommended: false
      },
      {
        id: 'q-lv-3',
        title: {
          pt: 'Minutes Key & Shoe Repair (Dubai Mall)',
          en: 'Minutes Key & Shoe Repair (Dubai Mall)',
          he: 'מינוטס תיקונים (דובאי מול)'
        },
        priceAED: 450,
        timeline: { pt: '3 dias úteis', en: '3 business days', he: '3 ימי עסקים' },
        observation: {
          pt: 'Apenas ajuste de costura rápida sem troca de couro.',
          en: 'Quick stitching touch-up without leather replacement.',
          he: 'תיקון תפרים מהיר בלבד ללא החלפת עור.'
        },
        isRecommended: false
      },
      {
        id: 'q-lv-4',
        title: {
          pt: 'Luxury Care Atelier (DIFC)',
          en: 'Luxury Care Atelier (DIFC)',
          he: 'סטודיו אטלייה יוקרה (DIFC)'
        },
        priceAED: 920,
        timeline: { pt: '7 dias úteis', en: '7 business days', he: '7 ימי עסקים' },
        observation: {
          pt: 'Tratamento completo de couro e polimento de ferragens banhadas a ouro.',
          en: 'Full leather conditioning and gold-plated hardware polish.',
          he: 'טיפול מלא בעור והברקת פרזול מצופה זהב.'
        },
        isRecommended: false
      }
    ]
  },
  {
    id: 'case-laundry',
    emoji: '🧺',
    title: {
      pt: 'Lavanderia — Orçamento e envio',
      en: 'Laundry — Quote & Dispatch',
      he: 'מכבסה — הצעת מחיר ומשלוח'
    },
    clientState: '🔔 Aguardando você',
    internalStatus: 'Aguardando aprovação',
    priority: 'Normal',
    isRecurring: false,
    nextStep: {
      pt: 'Enviar orçamento para aprovação',
      en: 'Send quotation for approval',
      he: 'שליחת הצעת מחיר לאישור'
    },
    subtasks: [
      { id: 'st-lau-1', title: { pt: 'Triagem e contagem das 5 peças delicadas', en: 'Sorting & inventory of 5 delicate items', he: 'מיון וספירת 5 פריטים עדינים' }, completed: true },
      { id: 'st-lau-2', title: { pt: 'Cotação especial com coleta residencial', en: 'Special quote with door-to-door pickup', he: 'הצעת מחיר מיוחדת כולל איסוף מביתי' }, completed: true },
      { id: 'st-lau-3', title: { pt: 'Aprovação do orçamento de 640 AED pela cliente', en: 'Client approval of 640 AED quote', he: 'אישור הלקוחה להצעת המחיר על סך 640 AED' }, completed: false },
      { id: 'st-lau-4', title: { pt: 'Agendamento da coleta da lavanderia', en: 'Schedule laundry pickup', he: 'תיאום איסוף המכבסה' }, completed: false },
      { id: 'st-lau-5', title: { pt: 'Conferência de qualidade na devolução', en: 'Quality inspection upon return', he: 'בדיקת איכות בהחזרה' }, completed: false }
    ],
    timeline: [
      {
        id: 'tl-lau-1',
        date: '2026-07-24',
        time: '09:30',
        addedBy: 'operator',
        content: {
          pt: 'Caso aberto. Peças serão enviadas à lavanderia após aprovação do orçamento.',
          en: 'Case opened. Items will be sent to the laundry following quotation approval.',
          he: 'תיק נפתח. הפריטים יישלחו למכבסה לאחר אישור הצעת המחיר.'
        }
      }
    ],
    quotations: [
      {
        id: 'q-lau-1',
        title: {
          pt: 'Vestidos de seda delicada (2x)',
          en: 'Delicate silk dresses (2x)',
          he: 'שמלות משי עדינות (2x)'
        },
        priceAED: 180,
        quantity: 2,
        observation: {
          pt: 'Lavagem ecológica a seco e engomagem manual',
          en: 'Eco dry cleaning & hand pressing',
          he: 'ניקוי יבש ירוק וגיהוץ ידני'
        }
      },
      {
        id: 'q-lau-2',
        title: {
          pt: 'Casacos de lã italiana (2x)',
          en: 'Italian wool coats (2x)',
          he: 'מעילי צמר איטלקי (2x)'
        },
        priceAED: 240,
        quantity: 2,
        observation: {
          pt: 'Tratamento anti-pilling e higienização térmica',
          en: 'Anti-pilling & thermal sanitization',
          he: 'טיפול מונע סיבים וחיטוי תרמי'
        }
      },
      {
        id: 'q-lau-3',
        title: {
          pt: 'Jogo de cama fios egípcios',
          en: 'Egyptian cotton bedding set',
          he: 'סט מצעים כותנה מצרית'
        },
        priceAED: 220,
        quantity: 1,
        observation: {
          pt: 'Lavadura suave neutra e calandragem',
          en: 'Gentle neutral wash & crisp pressing',
          he: 'כביסה עדינה וגיהוץ מקצועי'
        }
      }
    ],
    decision: {
      prompt: {
        pt: 'Orçamento total da lavanderia especial: 640 AED para 5 peças delicadas com coleta e entrega na residência. Deseja aprovar?',
        en: 'Specialty laundry quote total: 640 AED for 5 delicate items with door-to-door collection & delivery. Would you like to approve?',
        he: 'הצעת מחיר כוללת למכבסה: 640 AED עבור 5 פריטים עדינים כולל איסוף והחזרה עד הבית. לאשר?'
      },
      options: [
        {
          id: 'approve',
          label: {
            pt: 'Aprovar 640 AED e autorizar coleta',
            en: 'Approve 640 AED & authorize pickup',
            he: 'אשר 640 AED והוראה לאיסוף'
          },
          variant: 'primary'
        },
        {
          id: 'adjust',
          label: {
            pt: 'Solicitar ajuste de itens',
            en: 'Request item adjustment',
            he: 'בקש עדכון פריטים'
          },
          variant: 'secondary'
        }
      ]
    }
  },
  {
    id: 'case-bathroom-leak',
    emoji: '🚿',
    title: {
      pt: 'Vazamento no teto do banheiro',
      en: 'Bathroom Ceiling Leak',
      he: 'נזילה בתקרת חדר הרחצה'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Alta',
    isRecurring: false,
    nextStep: {
      pt: 'Contatar administração do prédio e agendar vistoria',
      en: 'Contact building management and schedule inspection',
      he: 'ליצור קשר עם הנהלת הבניין ולתאם בדיקה'
    },
    subtasks: [
      { id: 'st-leak-1', title: { pt: 'Notificar administração do condomínio', en: 'Notify building management', he: 'דיווח להנהלת הבניין' }, completed: true },
      { id: 'st-leak-2', title: { pt: 'Vistoria técnica no teto do banheiro', en: 'Technical inspection of bathroom ceiling', he: 'בדיקה טכנית בתקרת חדר הרחצה' }, completed: true },
      { id: 'st-leak-3', title: { pt: 'Acompanhar reparo hidráulico superior', en: 'Oversee upper floor plumbing repair', he: 'מעקב אחר תיקון השרברבות בקומה העליונה' }, completed: false },
      { id: 'st-leak-4', title: { pt: 'Pintura e restauração do gesso', en: 'Plaster restoration & painting', he: 'שיקום גבס וצביעה' }, completed: false }
    ],
    timeline: [
      {
        id: 'tl-leak-1',
        date: '2026-07-24',
        time: '08:45',
        addedBy: 'operator',
        content: {
          pt: 'Vazamento no teto do banheiro. Ação: comunicar a administração do prédio, agendar visita técnica e acompanhar o reparo até a verificação final.',
          en: 'Bathroom ceiling leak. Action: notify building management, schedule technical visit, and oversee repair until final verification.',
          he: 'נזילה בתקרת חדר הרחצה. פעולה: דיווח להנהלת הבניין, תיאום ביקור טכנאי ומעקב עד לסיום התיקון.'
        }
      }
    ]
  },
  {
    id: 'case-tasleem-balance',
    emoji: '❄️',
    title: {
      pt: 'Tasleem (district cooling) — Verificação do saldo',
      en: 'Tasleem (district cooling) — Balance Verification',
      he: 'Tasleem (מיזוג מרכזי) — בדיקת יתרה'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Alta',
    isRecurring: false,
    utilityType: 'Tasleem',
    nextStep: {
      pt: 'Ligar para a Tasleem e esclarecer o saldo e o ajuste de 17/04',
      en: 'Call Tasleem to clarify balance and the 17/04 adjustment',
      he: 'להתקשר ל-Tasleem ולברר את היתרה ואת העדכון מ-17/04'
    },
    timeline: [
      {
        id: 'tl-tas-1',
        date: '2026-07-24',
        time: '09:00',
        addedBy: 'operator',
        content: {
          pt: 'Análise inicial da fatura: saldo atual de −3.216,08 AED. Em sistemas de cobrança, saldo negativo normalmente significa crédito a favor do cliente — não dívida.',
          en: 'Initial invoice analysis: current balance is −3,216.08 AED. In utility billing systems, negative balance typically indicates credit in customer favor — not debt.',
          he: 'ניתוח ראשוני של החשבונית: יתרה נוכחית של −3,216.08 AED. במערכות חיוב, יתרה שלילית פירושה בדרך כלל זיכוי לטובת הלקוח — ולא חוב.'
        }
      },
      {
        id: 'tl-tas-2',
        date: '2026-07-24',
        time: '09:15',
        addedBy: 'operator',
        content: {
          pt: 'Pagamentos identificados em 24/07/2026: 804,02 + 1.608,04 = 2.412,06 AED.',
          en: 'Payments identified on 24/07/2026: 804.02 + 1,608.04 = 2,412.06 AED.',
          he: 'תשלומים שזוהו ב-24/07/2026: 804.02 + 1,608.04 = 2,412.06 AED.'
        }
      },
      {
        id: 'tl-tas-3',
        date: '2026-07-24',
        time: '09:20',
        addedBy: 'operator',
        content: {
          pt: 'Ponto a esclarecer: em 17/04/2026 há um ajuste de +1.500,00 AED e um recebimento de −1.710,00 AED sem justificativa visível.',
          en: 'Point to clarify: on 17/04/2026 there is a +1,500.00 AED adjustment and a −1,710.00 AED receipt without visible breakdown.',
          he: 'נקודה להבהרה: ב-17/04/2026 מופיע עדכון של +1,500.00 AED וקבלה של −1,710.00 AED ללא פירוט גלוי.'
        }
      },
      {
        id: 'tl-tas-4',
        date: '2026-07-24',
        time: '09:30',
        addedBy: 'operator',
        content: {
          pt: 'Próxima ação: contato com a Tasleem para confirmar se o saldo é crédito e o motivo do ajuste.',
          en: 'Next action: contact Tasleem customer care to confirm that the balance is credit and verify adjustment details.',
          he: 'פעולה הבאה: פנייה לשירות לקוחות Tasleem לאישור שהיתרה היא זיכוי ולבירור סיבת העדכון.'
        }
      }
    ]
  },
  {
    id: 'case-dewa-cycle',
    emoji: '⚡',
    title: {
      pt: 'DEWA — Ciclo mensal',
      en: 'DEWA — Monthly Billing Cycle',
      he: 'DEWA — מחזור חודשי'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Normal',
    isRecurring: true,
    utilityType: 'DEWA',
    nextStep: {
      pt: 'Confirmar data de vencimento do ciclo atual',
      en: 'Confirm current cycle due date',
      he: 'אישור תאריך הפירוע של המחזור הנוכחי'
    },
    timeline: [
      {
        id: 'tl-dew-1',
        date: '2026-07-20',
        time: '11:00',
        addedBy: 'operator',
        content: {
          pt: 'Caso recorrente. Acompanhamento mensal da fatura DEWA. Contract account 2060863309.',
          en: 'Recurring case. Monthly tracking of DEWA bill. Contract account 2060863309.',
          he: 'תיק חוזר. מעקב חודשי אחר חשבון DEWA. חשבון חוזה 2060863309.'
        }
      }
    ]
  },
  {
    id: 'case-lootah-gas',
    emoji: '🔥',
    title: {
      pt: 'Lootah Gas — Registro e contato',
      en: 'Lootah Gas — Registration & Contact',
      he: 'Lootah Gas — רישום ויצירת קשר'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Normal',
    isRecurring: false,
    utilityType: 'Lootah Gas',
    nextStep: {
      pt: 'Verificar situação da conta de gás',
      en: 'Verify gas account status',
      he: 'בדיקת מצב חשבון הגז'
    },
    timeline: [
      {
        id: 'tl-gas-1',
        date: '2026-07-22',
        time: '14:00',
        addedBy: 'operator',
        content: {
          pt: 'Caso aberto. Verificação do registro de gás e confirmação da conta ativa.',
          en: 'Case opened. Gas registration verification and active account check.',
          he: 'תיק נפתח. אימות רישום הגז ואישור חשבון פעיל.'
        }
      }
    ]
  },
  {
    id: 'case-just-life',
    emoji: '🧹',
    title: {
      pt: 'Just Life — Cobrança fim do aluguel',
      en: 'Just Life — End of Lease Billing',
      he: 'Just Life — חיוב סוף שכירות'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Normal',
    isRecurring: true,
    utilityType: 'Just Life',
    nextStep: {
      pt: 'Chamar Just Life sobre cobrança no fim do aluguel; serviço 1x por semana',
      en: 'Contact Just Life regarding end-of-lease billing; weekly service schedule',
      he: 'פנייה ל-Just Life בנוגע לחיוב סוף שכירות; שירות פעם בשבוע'
    },
    timeline: [
      {
        id: 'tl-jl-1',
        date: '2026-07-21',
        time: '15:30',
        addedBy: 'operator',
        content: {
          pt: 'Alinhamento com a Just Life para serviço de limpeza semanal e ajuste da cobrança de encerramento do contrato de aluguel.',
          en: 'Alignment with Just Life for weekly cleaning service and final lease billing adjustments.',
          he: 'תיאום מול Just Life לשירות ניקיון שבועי והסדרת חיוב סוף השכירות.'
        }
      }
    ]
  },
  {
    id: 'case-carpets-ana',
    emoji: '🧶',
    title: {
      pt: 'Carpetes — Tratar com a Ana',
      en: 'Carpet Care — Coordinate with Ana',
      he: 'שטיחים — תיאום מול אנה'
    },
    clientState: '✅ Em nossas mãos',
    internalStatus: 'Aberto',
    priority: 'Normal',
    isRecurring: false,
    nextStep: {
      pt: 'Falar com a Ana sobre os carpetes',
      en: 'Speak with Ana about the carpets',
      he: 'לדבר עם אנה בנוגע לשטיחים'
    },
    timeline: [
      {
        id: 'tl-car-1',
        date: '2026-07-23',
        time: '16:00',
        addedBy: 'operator',
        content: {
          pt: 'Caso aberto para higienização e organização dos carpetes em coordenação com a Ana.',
          en: 'Case opened for carpet cleaning and arrangement in coordination with Ana.',
          he: 'תיק נפתח לניקוי וארגון השטיחים בתיאום מול אנה.'
        }
      }
    ]
  },

  // Completed cases for Archive
  {
    id: 'case-orchids-completed',
    emoji: '🌸',
    title: {
      pt: 'Orquídeas e arranjos florais da residência',
      en: 'Residence Orchids & Floral Arrangements',
      he: 'סחלבים וסידורי פרחים למגורים'
    },
    clientState: '✔️ Concluído',
    internalStatus: 'Concluído',
    priority: 'Normal',
    isRecurring: true,
    completedMonth: '2026-06',
    nextStep: {
      pt: 'Concluído com sucesso',
      en: 'Successfully completed',
      he: 'הושלם בהצלחה'
    },
    timeline: [
      {
        id: 'tl-orc-1',
        date: '2026-06-12',
        time: '11:00',
        addedBy: 'operator',
        content: {
          pt: 'Renovação dos vasos de orquídeas brancas da sala principal e hall de entrada realizada.',
          en: 'Replacement of white orchid pots in main living room and entrance foyer completed.',
          he: 'החלפת עציצי הסחלבים הלבנים בסלון הראשי ובמבואת הכניסה הושלמה.'
        }
      }
    ],
    completionProof: {
      note: {
        pt: 'Entregue e posicionado na residência conforme especificações.',
        en: 'Delivered and placed at residence according to specifications.',
        he: 'נמסר ומוקם בבית בהתאם למפרט.'
      },
      completedAt: '2026-06-12'
    }
  },
  {
    id: 'case-rta-car-completed',
    emoji: '🚗',
    title: {
      pt: 'Renovação do registro do veículo no RTA',
      en: 'RTA Vehicle Registration Renewal',
      he: 'חידוש רישיון רכב ב-RTA'
    },
    clientState: '✔️ Concluído',
    internalStatus: 'Concluído',
    priority: 'Alta',
    isRecurring: false,
    completedMonth: '2026-05',
    nextStep: {
      pt: 'Concluído com sucesso',
      en: 'Successfully completed',
      he: 'הושלם בהצלחה'
    },
    timeline: [
      {
        id: 'tl-rta-1',
        date: '2026-05-18',
        time: '14:20',
        addedBy: 'operator',
        content: {
          pt: 'Inspeção veicular realizada no مرکز שרמו / RTA Tasjeel, seguro renovado e e-Mulkiya emitido.',
          en: 'Vehicle inspection completed at RTA Tasjeel, insurance renewed and e-Mulkiya issued.',
          he: 'בדיקת רכב הושלמה ב-RTA Tasjeel, הביטוח חודש והופק רישיון e-Mulkiya.'
        }
      }
    ],
    completionProof: {
      note: {
        pt: 'Documento digital e cartão Mulkiya atualizados até Maio de 2027.',
        en: 'Digital document and Mulkiya card updated until May 2027.',
        he: 'מסמך דיגיטלי וכרטיס Mulkiya עודכנו עד מאי 2027.'
      },
      completedAt: '2026-05-18'
    }
  }
];
