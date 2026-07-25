/**
 * Vercel serverless entry for GET /api/finance/status — reports whether
 * Google Sheets credentials are configured (never the credentials themselves).
 */
import { getSheetsConfig } from "../_lib/sheets";
import type { ApiRequest, ApiResponse } from "../_lib/apiTypes";

export default function handler(_req: ApiRequest, res: ApiResponse) {
  try {
    res.status(200).json({ sheetsConfigured: getSheetsConfig() !== null });
  } catch (err) {
    console.error("[Finance] status handler failure:", err);
    res.status(200).json({ sheetsConfigured: false });
  }
}
