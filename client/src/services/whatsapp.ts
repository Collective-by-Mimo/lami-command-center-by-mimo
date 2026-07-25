/**
 * LaMi — WhatsApp Business Cloud API notification service (Feature 8).
 * READY infrastructure: activates the moment Meta business verification
 * completes and VITE_WHATSAPP_TOKEN / VITE_WHATSAPP_PHONE_ID are configured.
 * Until then, calls are safely no-ops (logged + queued in localStorage).
 */

import { Language } from '../types';
import { MIMO_WHATSAPP_NUMBER } from '../config/appConfig';

const QUEUE_KEY = 'lami_whatsapp_queue_v1';

interface QueuedNotification {
  message: string;
  phone: string;
  queuedAt: string;
}

function queueNotification(message: string, phone: string) {
  try {
    const queue: QueuedNotification[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    queue.push({ message, phone, queuedAt: new Date().toISOString() });
    // Keep last 50 queued notifications
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-50)));
  } catch {
    /* storage unavailable — ignore */
  }
}

export async function sendWhatsAppNotification(message: string, phone?: string): Promise<boolean> {
  const token = import.meta.env.VITE_WHATSAPP_TOKEN;
  const phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_ID;
  const targetPhone = phone || import.meta.env.VITE_LAYLA_WHATSAPP;

  if (!token || !phoneNumberId || !targetPhone) {
    console.log('[WhatsApp] Token not configured — notification queued');
    queueNotification(message, targetPhone || 'unset');
    return false;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: targetPhone,
        type: 'text',
        text: { preview_url: true, body: message }
      })
    });
    if (!res.ok) {
      console.warn('[WhatsApp] API error', res.status);
      queueNotification(message, targetPhone);
      return false;
    }
    console.log('[WhatsApp] Notification sent');
    return true;
  } catch (err) {
    console.warn('[WhatsApp] Network error — notification queued', err);
    queueNotification(message, targetPhone);
    return false;
  }
}

const APP_URL = 'lami.mimoscollective.com';

/** 1. New case created */
export function notifyNewCase(caseName: string) {
  return sendWhatsAppNotification(`🛎️ LaMi: Novo caso criado — ${caseName}. Acompanhe: ${APP_URL}`);
}

/** 2. Case awaiting approval */
export function notifyAwaitingApproval(caseName: string) {
  return sendWhatsAppNotification(`🔔 LaMi: ${caseName} aguarda sua aprovação. ${APP_URL}`);
}

/** 3. Case completed */
export function notifyCaseCompleted(caseName: string) {
  return sendWhatsAppNotification(`✅ LaMi: ${caseName} concluído. Foto e comprovante disponíveis.`);
}

/** 4. Proactive suggestion triggered */
export function notifySuggestion(suggestionText: string) {
  return sendWhatsAppNotification(`🔮 LaMi: ${suggestionText} ${APP_URL}`);
}

/** 5. Per-case wa.me deep link — opens a chat with Mimo about a specific case */
export function getMimoCaseWhatsAppUrl(caseTitle: string, language: Language): string {
  const text = {
    pt: `Oi Mimo 🛎️ sobre: ${caseTitle}`,
    en: `Hi Mimo 🛎️ about: ${caseTitle}`,
    he: `היי מימו 🛎️ בנוגע ל: ${caseTitle}`
  }[language];
  return `https://wa.me/${MIMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function openMimoCaseWhatsApp(caseTitle: string, language: Language): void {
  window.open(getMimoCaseWhatsAppUrl(caseTitle, language), '_blank', 'noopener,noreferrer');
}
