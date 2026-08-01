# 12 — Open Questions

Everything below cannot be determined from static reading of the repository alone (no code execution, no deployment access, and no access to external systems referenced by the repository was used in producing this audit).

## Deployment / Runtime Verification

1. **Is the application currently deployed and live** at the URL claimed in `AI_CONTEXT.md` (`https://lami-command-center-by-mimo.vercel.app`)? Not verified — this audit did not make outbound network requests to confirm.
2. **Does the application actually run correctly** (`pnpm install && pnpm run dev`, `pnpm run build`, `pnpm run check`)? Not executed as part of this audit. Static reading found no obvious import-path or type errors, but this is not equivalent to a successful build/typecheck/runtime pass.
3. What are the current values of any environment variables set in the actual Vercel project (or any other hosting environment)? Unknown — not present in this repository by design (secrets are excluded via `.gitignore`).
4. Is `GEMINI_API_KEY` currently configured in production? Unknown — determines whether the Concierge is actually answering via Gemini or always falling back to the static WhatsApp message in the live deployment.
5. Are `GOOGLE_SHEETS_CREDENTIALS`/`GOOGLE_SHEETS_SPREADSHEET_ID` currently configured in production? Unknown — same reasoning.

## Code Behavior Requiring Execution to Confirm

6. **Is `AppContext.addHandoff()` actually called anywhere in the real Concierge chat flow?** `ConciergeAI.tsx`'s fallback-to-server path (`askConcierge`) does not appear, from static reading, to call `addHandoff` on an unanswered/fallback response. If it is genuinely never called, the Handoff Queue feature only ever shows its 3 hardcoded seed entries in a fresh browser. This needs either a deeper code trace (a call could exist through a path not read in full during this audit) or manual testing to confirm definitively.
7. **Does any UI actually call `/api/finance/status` or `DataAdapter.importDataJSON()`?** No calling code was found in the components read during this audit, but not every file's every code path (e.g., all 54 `ui/*.tsx` files) was read line-by-line, and it is possible a call exists in a location not captured.
8. **Does `client/src/context/AppContext.tsx`'s `utilities` collection (from `DataAdapter.getUtilities()`) get rendered anywhere**, given `UtilitiesPanel.tsx` uses its own separate hardcoded `BILLS` array instead? If no component renders `utilities`, that entire data collection and its seed seed seed data may be fully inert. Not conclusively determined in this audit's component-by-component read (all 21 non-`ui` components were read, and no additional consumer of `utilities` was found, but this should be double-checked with a project-wide symbol search tool rather than manual reading alone).

## Documentation Discrepancies Needing an Authoritative Answer

9. The Finance screen's dev banner says *"do not publish with real financial data until Phase 2"*, while `AI_CONTEXT.md`'s phase numbering has "Phase 2" already marked DONE (the category-taxonomy rebuild) and describes real authentication as a "Phase 2 integration point" in a **different**, code-comment sense (`// AUTH: Supabase multi-user — Phase 2 integration point.`). Are these two "Phase 2" references meant to be the same milestone, or is there a numbering drift between the product roadmap in `AI_CONTEXT.md` and inline code comments? Unknown without asking whoever maintains the roadmap.
10. Is `ideas.md`'s trilingual/RTL design brief still meant to represent any future direction, or is it fully obsolete and safe to disregard/delete? Not stated anywhere in the repository.
11. `package.json`'s `packageManager` field pins pnpm `10.4.1+sha512...` while `devDependencies` lists `pnpm: ^10.15.1`. Which is authoritative, and is the mismatch intentional (e.g., a controlled upgrade in progress) or an oversight? Cannot be determined from the files alone.
12. Is `client/src/config/serviceCatalogue.ts`'s "Live" status per service line item kept in sync with actual shipped functionality by some external process (e.g., a manual review checklist), or is it maintained ad hoc? Not documented anywhere in the repo.

## Content Not Fully Enumerated in This Audit

13. The complete contents of `client/src/index.css` (195 lines) were not exhaustively catalogued line-by-line in this audit beyond confirming its `@import` statements (`tailwindcss`, `tw-animate-css`) — a full inventory of every custom animation/utility class it defines (e.g., `lami-card`, `lami-pulse`, `lami-sparkle`, `lami-status-pulse`, `lami-typing-dot`, referenced across multiple components) was not produced as a standalone artifact.
14. `tsconfig.node.json`'s exact compiler options were not read/detailed in this audit beyond confirming the file's existence.
15. Whether `@tailwindcss/typography`, `postcss`, and `autoprefixer` are truly unused (no `postcss.config.*` file was found, and no `@plugin`/`prose`-class usage was confirmed in the spot checks performed), versus used implicitly by some Tailwind v4/Vite mechanism not fully traced in this audit, is a "likely but not certain" finding — see `09_Dependency_Report.md`.
16. The full list of `localStorage` keys used across the codebase was compiled from the files read during this audit (`dataAdapter.ts`, `AppContext.tsx`, `appConfig.ts`, `whatsapp.ts`, `haptics.ts`, `webauthn.ts`, `BriefingScreen.tsx`, `InstallBanner.tsx`) but a project-wide automated grep for every `localStorage.` call site was not separately re-verified against this list as a final cross-check.
17. Git history beyond the ~20 most recent commits shown by `git log --oneline -20` was not examined; the full commit history, branch structure beyond `main` and the current audit branch, and any other historical branches/tags were not inventoried.
18. Whether any GitHub repository-level configuration exists outside this checkout (branch protection rules, required status checks, GitHub Environments/secrets, Dependabot config, issue/PR templates other than what may exist under `.github/` — a `.github/` directory was **not found** in this checkout, but this only confirms its absence from the code tree, not from repository *settings* which are not stored as files) is Unknown to this audit.

## Business/Product Context Not Derivable From Code

19. The exact real-world relationship and current status between "Mimo's Collective," the operator, and the named client ("Layla") — i.e., whether this is a live, paying client engagement or a demo/prototype build — is Unknown from the repository alone (the code and seed data strongly suggest a real, specific business relationship, given specific names, phone numbers, and figures appearing in source, but this audit does not independently confirm real-world facts).
20. Whether the Notion databases referenced in `AI_CONTEXT.md` ("Casos"/"Seus casos", "My Tasks") actually exist and in what schema is Unknown — no code in this repository reads or writes Notion, and this audit did not have access to any external Notion workspace to verify.
21. What specific hosting/runtime resource limits (function timeout, memory, concurrency) apply to the deployed Vercel serverless functions is Unknown — `vercel.json` does not override platform defaults, and platform defaults depend on the Vercel account/plan, which is outside this repository.
