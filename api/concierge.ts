/**
 * Vercel serverless entry for POST /api/concierge.
 * GEMINI_API_KEY is read from the environment inside conciergeReply and
 * never reaches the client; without it (or on any error) the response is
 * the localized graceful WhatsApp fallback with HTTP 200.
 */
import { conciergeReply } from "../server/lib/concierge";
import type { ApiRequest, ApiResponse } from "../server/lib/apiTypes";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  res.status(200).json(await conciergeReply(req.body));
}
