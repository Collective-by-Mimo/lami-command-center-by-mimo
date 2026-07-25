/**
 * Vercel serverless entry for GET /api/finance/status — reports whether
 * Google Sheets credentials are configured (never the credentials themselves).
 */
import { getSheetsConfig } from "../../server/lib/sheets";
import type { ApiRequest, ApiResponse } from "../../server/lib/apiTypes";

export default function handler(_req: ApiRequest, res: ApiResponse) {
  res.status(200).json({ sheetsConfigured: getSheetsConfig() !== null });
}
