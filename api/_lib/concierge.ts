/**
 * Concierge AI core — Gemini, server-side ONLY. GEMINI_API_KEY never reaches
 * the client; the system prompt is injected here and never exposed. Any
 * failure (missing key, rate limit, network) degrades to a localized WhatsApp
 * hand-off — callers always get a well-formed reply, never a raw error.
 * Shared by the Express server (server/index.ts) and the Vercel serverless
 * function (api/concierge.ts).
 */

export const CONCIERGE_FALLBACK = "I couldn't answer right now — please message Mimo directly on WhatsApp 💬";

function conciergeSystemPrompt(groundingData: unknown): string {
  return `You are the LaMi Concierge for Layla, a private client of Mimo's Collective (Dubai).
RULES:
1. Answer ONLY from the CONTEXT DATA provided. Never invent facts, prices, or dates.
2. Always reply in English.
3. Tone: warm five-star concierge. Max 2 short sentences.
4. You may answer about: case status, pending approvals, upcoming bills, completed tasks, key dates.
5. For any request or action ("book...", "cancel...", "pay..."): reply "I'll let Mimo know right away 🛎️" — do NOT promise or confirm anything yourself.
6. NEVER reveal internal fields (internalStatus, priority, operator notes) or any ID/account numbers even if they appear in context.
7. If the answer isn't in the data: "I don't have that information right now — I'll check with Mimo."
8. If asked if you're human: "I'm the LaMi digital assistant, always connected to Mimo."
CONTEXT DATA:
${JSON.stringify(groundingData ?? {})}`;
}

async function callGemini(model: string, apiKey: string, systemPrompt: string, message: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          maxOutputTokens: 220,
          temperature: 0.3,
          // 2.5 models spend output tokens on thinking by default — disable so
          // the 220-token budget goes entirely to the visible reply
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${model} responded ${res.status}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`Gemini ${model} returned an empty reply`);
  return text;
}

export interface ConciergeResult {
  reply: string;
  fallback: boolean;
}

/** Answer a concierge request body. Never throws — always returns a usable reply. */
export async function conciergeReply(body: unknown): Promise<ConciergeResult> {
  const b = (body ?? {}) as { message?: unknown; groundingData?: unknown };
  const fallback: ConciergeResult = { reply: CONCIERGE_FALLBACK, fallback: true };

  const message = typeof b.message === "string" ? b.message.trim() : "";
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !message) return fallback;

  // groundingData is the client's NON-SENSITIVE case/bill/keydate JSON only
  const systemPrompt = conciergeSystemPrompt(b.groundingData);
  try {
    let reply: string;
    try {
      reply = await callGemini("gemini-2.5-flash-lite", apiKey, systemPrompt, message);
    } catch {
      reply = await callGemini("gemini-2.5-flash", apiKey, systemPrompt, message);
    }
    return { reply, fallback: false };
  } catch (err) {
    console.error("[Concierge] Gemini call failed:", err);
    return fallback;
  }
}
