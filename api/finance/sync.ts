/**
 * Vercel serverless entry for POST /api/finance/sync.
 * GOOGLE_SHEETS_CREDENTIALS / GOOGLE_SHEETS_SPREADSHEET_ID come from the
 * environment only; without them the client keeps using localStorage
 * ("Google Sheets sync pending").
 */
import { getSheetsConfig, syncLedgerToSheet, LedgerRow } from "../_lib/sheets.js";
import type { ApiRequest, ApiResponse } from "../_lib/apiTypes.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  try {
    const config = getSheetsConfig();
    if (!config) {
      res.status(200).json({ synced: false, reason: "credentials_pending" });
      return;
    }
    const body = (req.body ?? {}) as { transactions?: unknown };
    const transactions: LedgerRow[] = Array.isArray(body.transactions) ? (body.transactions as LedgerRow[]) : [];
    const rows = await syncLedgerToSheet(config, transactions);
    res.status(200).json({ synced: true, rows });
  } catch (err) {
    console.error("[Finance] Google Sheets sync failed:", err);
    res.status(502).json({ synced: false, reason: "sync_failed" });
  }
}
