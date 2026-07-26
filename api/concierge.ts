/**
 * Vercel serverless entry for POST /api/concierge.
 * GEMINI_API_KEY is read from the environment inside conciergeReply and
 * never reaches the client; without it (or on ANY error) the response is
 * the graceful WhatsApp fallback with HTTP 200 — never a raw error.
 */
import { conciergeReply, CONCIERGE_FALLBACK } from "./_lib/concierge.js";
import type { ApiRequest, ApiResponse } from "./_lib/apiTypes.js";

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
    res.status(200).json({ reply: CONCIERGE_FALLBACK, fallback: true });
  }
}
