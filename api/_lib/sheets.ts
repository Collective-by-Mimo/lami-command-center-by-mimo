/**
 * Google Sheets sync core — server-side ONLY. Credentials come from the
 * GOOGLE_SHEETS_CREDENTIALS env var (service-account key JSON) plus
 * GOOGLE_SHEETS_SPREADSHEET_ID, and are never exposed to the client.
 * Shared by the Express server (server/index.ts) and the Vercel serverless
 * functions (api/finance/*.ts).
 */
import crypto from "crypto";

export interface ServiceAccountCreds {
  client_email: string;
  private_key: string;
}

export interface SheetsConfig {
  creds: ServiceAccountCreds;
  spreadsheetId: string;
}

export function getSheetsConfig(): SheetsConfig | null {
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

export interface LedgerRow {
  date?: string;
  description?: string;
  category?: string;
  type?: string;
  status?: string;
  amountAED?: number;
  paidBy?: string;
  paidByOther?: string;
  paymentMethod?: string; // flattened, e.g. "Cash+Card"
  runningBalance?: number;
}

export async function syncLedgerToSheet(config: SheetsConfig, transactions: LedgerRow[]): Promise<number> {
  const token = await getGoogleAccessToken(config.creds);
  const values = [
    [
      "Date",
      "Description",
      "Category",
      "Type",
      "Status",
      "Paid By",
      "Payment Method",
      "Amount AED",
      "Running Balance",
    ],
    ...transactions.map((t) => [
      t.date ?? "",
      t.description ?? "",
      t.category ?? "",
      t.type ?? "",
      t.status ?? "",
      t.paidBy === "Other" ? t.paidByOther || "Other" : t.paidBy ?? "",
      t.paymentMethod ?? "",
      typeof t.amountAED === "number" ? t.amountAED : "",
      typeof t.runningBalance === "number" ? t.runningBalance : "",
    ]),
  ];
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`;
  const range = encodeURIComponent("A1:I100000"); // first sheet of the spreadsheet

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
