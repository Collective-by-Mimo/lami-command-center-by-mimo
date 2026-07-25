/**
 * Vercel serverless entry for POST /api/concierge.
 * GEMINI_API_KEY is read from the environment inside conciergeReply and
 * never reaches the client; without it (or on ANY error) the response is
 * the localized graceful WhatsApp fallback with HTTP 200 — never a raw error.
 */
import { conciergeReply, CONCIERGE_FALLBACK } from "./_lib/concierge";
import type { ApiRequest, ApiResponse } from "./_lib/apiTypes";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  try {
    res.status(200).json(await conciergeReply(req.body));
  } catch (err) {
    // Last-resort guard: the concierge must never surface a raw error.
    console.error("[Concierge] handler failure:", err);
    const b = (req.body ?? {}) as { language?: unknown };
    const language = typeof b.language === "string" && b.language in CONCIERGE_FALLBACK ? b.language : "pt";
    res.status(200).json({ reply: CONCIERGE_FALLBACK[language], fallback: true });
  }
}
