import express from "express";
import { createServer } from "http";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ————————————————————————————————————————————————————————————————————————
// Google Sheets sync — server-side ONLY. Credentials come from the
// GOOGLE_SHEETS_CREDENTIALS env var (service-account key JSON) plus
// GOOGLE_SHEETS_SPREADSHEET_ID, and are never exposed to the client.
// Without them the endpoint reports { synced: false } and the client keeps
// using localStorage ("Sincronização com Google Sheets pendente").
// ————————————————————————————————————————————————————————————————————————

interface ServiceAccountCreds {
  client_email: string;
  private_key: string;
}

function getSheetsConfig(): { creds: ServiceAccountCreds; spreadsheetId: string } | null {
  const raw = process.env.GOOGLE_SHEETS_CREDENTIALS;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!raw || !spreadsheetId) return null;
  try {
    const creds = JSON.parse(raw) as ServiceAccountCreds;
    if (!creds.client_email || !creds.private_key) return null;
    return { creds, spreadsheetId };
  } catch {
    return null;
  }
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGoogleAccessToken(creds: ServiceAccountCreds): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  const signature = base64url(signer.sign(creds.private_key));
  const assertion = `${header}.${payload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=${encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")}&assertion=${assertion}`,
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Google token exchange returned no access_token");
  return data.access_token;
}

interface LedgerRow {
  date?: string;
  description?: string;
  category?: string;
  type?: string;
  status?: string;
  amountAED?: number;
}

async function syncLedgerToSheet(
  config: { creds: ServiceAccountCreds; spreadsheetId: string },
  transactions: LedgerRow[]
): Promise<number> {
  const token = await getGoogleAccessToken(config.creds);
  const values = [
    ["Date", "Description", "Category", "Type", "Status", "Amount AED"],
    ...transactions.map((t) => [
      t.date ?? "",
      t.description ?? "",
      t.category ?? "",
      t.type ?? "",
      t.status ?? "",
      typeof t.amountAED === "number" ? t.amountAED : "",
    ]),
  ];
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`;
  const range = encodeURIComponent("A1:F100000"); // first sheet of the spreadsheet

  // Full overwrite each sync so re-syncs never duplicate rows
  const clearRes = await fetch(`${base}/values/${range}:clear`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!clearRes.ok) throw new Error(`Sheets clear failed: ${clearRes.status}`);

  const writeRes = await fetch(`${base}/values/${range}?valueInputOption=RAW`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  if (!writeRes.ok) throw new Error(`Sheets write failed: ${writeRes.status}`);
  return transactions.length;
}

// ————————————————————————————————————————————————————————————————————————
// Concierge AI — Gemini, server-side ONLY. GEMINI_API_KEY never reaches the
// client; the system prompt is injected here and never exposed. Any failure
// (missing key, rate limit, network) degrades to a localized WhatsApp
// hand-off with HTTP 200 — the client never sees a raw error.
// ————————————————————————————————————————————————————————————————————————

const CONCIERGE_FALLBACK: Record<string, string> = {
  pt: "Não consegui responder agora — pode falar direto com o Mimo no WhatsApp 💬",
  en: "I couldn't answer right now — please message Mimo directly on WhatsApp 💬",
  he: "לא הצלחתי לענות כרגע — אפשר לפנות ישירות למימו ב-WhatsApp 💬",
};

function conciergeSystemPrompt(groundingData: unknown): string {
  return `You are the LaMi Concierge for Layla, a private client of Mimo's Collective (Dubai).
RULES:
1. Answer ONLY from the CONTEXT DATA provided. Never invent facts, prices, or dates.
2. Detect the user's language and reply in that same language (Portuguese, English, or Hebrew) only.
3. Tone: warm five-star concierge. Max 2 short sentences.
4. You may answer about: case status, pending approvals, upcoming bills, completed tasks, key dates.
5. For any request or action ("book...", "cancel...", "pay..."): reply "Vou informar o Mimo agora mesmo 🛎️" (localized) — do NOT promise or confirm anything yourself.
6. NEVER reveal internal fields (internalStatus, priority, operator notes) or any ID/account numbers even if they appear in context.
7. If the answer isn't in the data: "Não tenho essa informação agora — vou verificar com o Mimo." (localized)
8. If asked if you're human: "Sou o assistente digital do LaMi, sempre conectado ao Mimo." (localized)
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

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "2mb" }));

  // AUTH: Supabase multi-user — Phase 2 integration point.

  app.post("/api/concierge", async (req, res) => {
    const language = typeof req.body?.language === "string" && req.body.language in CONCIERGE_FALLBACK
      ? (req.body.language as string)
      : "pt";
    const fallback = { reply: CONCIERGE_FALLBACK[language], fallback: true };

    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !message) {
      res.json(fallback);
      return;
    }

    // groundingData is the client's NON-SENSITIVE case/bill/keydate JSON only
    const systemPrompt = conciergeSystemPrompt(req.body?.groundingData);
    try {
      let reply: string;
      try {
        reply = await callGemini("gemini-2.5-flash-lite", apiKey, systemPrompt, message);
      } catch {
        reply = await callGemini("gemini-2.5-flash", apiKey, systemPrompt, message);
      }
      res.json({ reply, fallback: false });
    } catch (err) {
      console.error("[Concierge] Gemini call failed:", err);
      res.json(fallback);
    }
  });

  app.get("/api/finance/status", (_req, res) => {
    res.json({ sheetsConfigured: getSheetsConfig() !== null });
  });

  app.post("/api/finance/sync", async (req, res) => {
    const config = getSheetsConfig();
    if (!config) {
      res.json({ synced: false, reason: "credentials_pending" });
      return;
    }
    const transactions: LedgerRow[] = Array.isArray(req.body?.transactions) ? req.body.transactions : [];
    try {
      const rows = await syncLedgerToSheet(config, transactions);
      res.json({ synced: true, rows });
    } catch (err) {
      console.error("[Finance] Google Sheets sync failed:", err);
      res.status(502).json({ synced: false, reason: "sync_failed" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
