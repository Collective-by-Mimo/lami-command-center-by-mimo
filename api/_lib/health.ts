/**
 * Safe health helpers — perform non-networking checks of environment and
 * configuration readiness. These helpers intentionally do NOT call external
 * services or exchange credentials. They only validate presence and basic
 * structure of environment variables so CI/ops can verify readiness.
 */

export function getConciergeConfig(): { geminiConfigured: boolean; geminiKeyLooksLike?: boolean } {
  const key = process.env.GEMINI_API_KEY || '';
  const looksLike = typeof key === 'string' && key.length > 20; // best-effort
  return { geminiConfigured: !!key, geminiKeyLooksLike: looksLike };
}

export function getSheetsEnvStatus(): {
  sheetsConfigured: boolean;
  spreadsheetIdPresent: boolean;
  credentialsValidJSON: boolean | null;
  missingFields?: string[];
} {
  const raw = process.env.GOOGLE_SHEETS_CREDENTIALS || '';
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
  if (!raw && !spreadsheetId) return { sheetsConfigured: false, spreadsheetIdPresent: false, credentialsValidJSON: null };
  let creds: any = null;
  let credentialsValidJSON: boolean | null = null;
  const missing: string[] = [];
  try {
    creds = JSON.parse(raw || 'null');
    credentialsValidJSON = !!creds && typeof creds.client_email === 'string' && typeof creds.private_key === 'string';
    if (!credentialsValidJSON) {
      if (!creds) { missing.push('credentials_parse_failed') }
      else {
        if (!creds.client_email) { missing.push('client_email') }
        if (!creds.private_key) { missing.push('private_key') }
      }
    }
  } catch (e) {
    credentialsValidJSON = false;
    missing.push('credentials_not_json');
  }
  return { sheetsConfigured: !!raw && !!spreadsheetId, spreadsheetIdPresent: !!spreadsheetId, credentialsValidJSON, missingFields: missing };
}

export function getDevPlaceholders(): Record<string, boolean> {
  return {
    builtInForgeConfigured: !!(process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY),
    whatsappPlaceholders: !!(process.env.VITE_WHATSAPP_TOKEN || process.env.VITE_WHATSAPP_PHONE_ID || process.env.VITE_LAYLA_WHATSAPP),
    analyticsPlaceholders: !!(process.env.VITE_ANALYTICS_ENDPOINT || process.env.VITE_ANALYTICS_WEBSITE_ID),
  };
}

export function getSupabasePlaceholders(): { expected: string[]; present: string[] } {
  const expected = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  const present = expected | Where-Object { !!(Get-Item env:\$_).Value } | ForEach-Object { $_ } # noop for types, will compute below
  # Fallback compute present using process.env via node at runtime; here we just return expected and empty present for static check
  return @{ expected = expected; present = @() }
}
