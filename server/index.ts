import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { conciergeReply } from "../api/_lib/concierge";
import { getSheetsConfig, syncLedgerToSheet, LedgerRow } from "../api/_lib/sheets";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "2mb" }));

  // AUTH: Supabase multi-user — Phase 2 integration point.

  // Concierge AI — GEMINI_API_KEY stays server-side; failures degrade to a
  // localized WhatsApp hand-off with HTTP 200, never a raw error.
  app.post("/api/concierge", async (req, res) => {
    res.json(await conciergeReply(req.body));
  });

  app.get("/api/finance/status", (_req, res) => {
    res.json({ sheetsConfigured: getSheetsConfig() !== null });
  });

  // Google Sheets sync — credentials from env only; without them the client
  // keeps localStorage ("Sincronização com Google Sheets pendente").
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
