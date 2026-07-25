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

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "2mb" }));

  // AUTH: Supabase multi-user — Phase 2 integration point.

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
