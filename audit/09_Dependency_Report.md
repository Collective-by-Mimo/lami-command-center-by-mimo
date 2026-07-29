# 09 — Dependency Report

Method: every package in `package.json` was checked against actual `import`/`from` usage across `client/src`, `server/`, and `api/` via repository-wide search. "Used only by `ui/`" means the only importing files are inside `client/src/components/ui/`, which — per `04_Feature_Catalog.md` item 20 — is itself never imported by any application screen. Such packages are therefore installed but have **no effect on the shipped, running application**, even though the import statements technically exist in the tree.

## Runtime Dependencies (`dependencies`)

| Package | Declared purpose | Actually used by app code? | Notes |
|---|---|---|---|
| `@hookform/resolvers` | Validation-resolver glue for `react-hook-form` | **No** — zero imports anywhere | Fully unused |
| `@radix-ui/react-accordion` | Radix primitive | Used only by `ui/accordion.tsx` | Unused by the app |
| `@radix-ui/react-alert-dialog` | Radix primitive | Used only by `ui/alert-dialog.tsx` | Unused by the app |
| `@radix-ui/react-aspect-ratio` | Radix primitive | Used only by `ui/aspect-ratio.tsx` | Unused by the app |
| `@radix-ui/react-avatar` | Radix primitive | Used only by `ui/avatar.tsx` | Unused by the app |
| `@radix-ui/react-checkbox` | Radix primitive | Used only by `ui/checkbox.tsx` | Unused by the app |
| `@radix-ui/react-collapsible` | Radix primitive | Used only by `ui/collapsible.tsx` | Unused by the app (note: `CasesScreen.tsx`'s collapsible category groups are hand-rolled with `motion`/`AnimatePresence`, not this package) |
| `@radix-ui/react-context-menu` | Radix primitive | Used only by `ui/context-menu.tsx` | Unused by the app |
| `@radix-ui/react-dialog` | Radix primitive | Used only by `ui/dialog.tsx`, `ui/sheet.tsx` | Unused by the app (all app modals are hand-rolled `motion.div` overlays) |
| `@radix-ui/react-dropdown-menu` | Radix primitive | Used only by `ui/dropdown-menu.tsx` | Unused by the app |
| `@radix-ui/react-hover-card` | Radix primitive | Used only by `ui/hover-card.tsx` | Unused by the app |
| `@radix-ui/react-label` | Radix primitive | Used only by `ui/label.tsx`, `ui/form.tsx`, `ui/checkbox.tsx`(via label), etc. | Unused by the app |
| `@radix-ui/react-menubar` | Radix primitive | Used only by `ui/menubar.tsx` | Unused by the app |
| `@radix-ui/react-navigation-menu` | Radix primitive | Used only by `ui/navigation-menu.tsx` | Unused by the app |
| `@radix-ui/react-popover` | Radix primitive | Used only by `ui/popover.tsx` | Unused by the app |
| `@radix-ui/react-progress` | Radix primitive | Used only by `ui/progress.tsx` | Unused by the app (subtask progress bars in `CaseCard.tsx`/`SubtaskProgressChart.tsx` are hand-rolled `<div>` widths) |
| `@radix-ui/react-radio-group` | Radix primitive | Used only by `ui/radio-group.tsx` | Unused by the app |
| `@radix-ui/react-scroll-area` | Radix primitive | Used only by `ui/scroll-area.tsx` | Unused by the app |
| `@radix-ui/react-select` | Radix primitive | Used only by `ui/select.tsx` | Unused by the app (all `<select>` elements in the app, e.g. `FinanceScreen.tsx`, are native HTML `<select>`) |
| `@radix-ui/react-separator` | Radix primitive | Used only by `ui/separator.tsx` | Unused by the app |
| `@radix-ui/react-slider` | Radix primitive | Used only by `ui/slider.tsx` | Unused by the app |
| `@radix-ui/react-slot` | Radix primitive | Used only by `ui/button.tsx` and others | Unused by the app |
| `@radix-ui/react-switch` | Radix primitive | Used only by `ui/switch.tsx` | Unused by the app |
| `@radix-ui/react-tabs` | Radix primitive | Used only by `ui/tabs.tsx` | Unused by the app (the app's own tab-like filters, e.g. state/category chips, are hand-rolled buttons) |
| `@radix-ui/react-toggle` | Radix primitive | Used only by `ui/toggle.tsx` | Unused by the app |
| `@radix-ui/react-toggle-group` | Radix primitive | Used only by `ui/toggle-group.tsx` | Unused by the app |
| `@radix-ui/react-tooltip` | Radix primitive | Used only by `ui/tooltip.tsx` | Unused by the app |
| `class-variance-authority` | Variant-class helper for shadcn/ui components | Used only inside `ui/*.tsx` | Unused by the app |
| `clsx` | Class-name concatenation | Used by `client/src/lib/utils.ts` (`cn()`) | `cn()` itself is only imported by `ui/*.tsx` files — **unused by the app** |
| `cmdk` | Command-palette primitive | Used only by `ui/command.tsx` | Unused by the app |
| `embla-carousel-react` | Carousel primitive | Used only by `ui/carousel.tsx` | Unused by the app |
| `express` | HTTP server framework | **Yes** — `server/index.ts` | Actively used (standalone/Express deployment path) |
| `input-otp` | OTP input primitive | Used only by `ui/input-otp.tsx` | Unused by the app (login has no OTP flow) |
| `lucide-react` | Icon set | **Yes** — imported throughout nearly every app component | Actively used, core dependency |
| `motion` | Animation (Framer Motion successor) | **Yes** — imported as `motion/react` in ~15 app files | Actively used, core dependency |
| `nanoid` | Unique ID generator | **No** — zero imports anywhere in app code | Fully unused. (Note: unrelated to the *transitive* `nanoid` pinned via the `pnpm.overrides` entry for `tailwindcss`'s own internal dependency — that override exists regardless of this top-level package.) |
| `next-themes` | Light/dark theme provider (Next.js-oriented) | Used only by `ui/sonner.tsx` | Unused by the app; also arguably a mismatched dependency for a non-Next.js Vite project |
| `react` / `react-dom` | Core framework | **Yes** | Core dependency |
| `react-day-picker` | Calendar/date-picker primitive | Used only by `ui/calendar.tsx` | Unused by the app (all date inputs in the app, e.g. `FinanceScreen.tsx`, are native `<input type="date">`) |
| `react-hook-form` | Form state library | Used only by `ui/form.tsx` | Unused by the app (all forms in the app use plain `useState`) |
| `react-resizable-panels` | Resizable pane layout | Used only by `ui/resizable.tsx` | Unused by the app |
| `recharts` | Charting library | **Yes** — `SubtaskProgressChart.tsx` (and, separately, `ui/chart.tsx`) | Actively used by the app for the case subtask donut/bar chart |
| `sonner` | Toast notification library | Used only by `ui/sonner.tsx` | Unused by the app — the app has its own hand-rolled `Toast.tsx` component wired through `AppContext.showToast`, entirely independent of this package |
| `streamdown` | Streaming-markdown renderer (typically for AI chat output) | **No** — zero imports anywhere | Fully unused. Notable because it is exactly the kind of package a Gemini-chat feature would use for rendering streamed markdown, yet the actual `ConciergeAI.tsx` implementation renders plain text with no streaming and no markdown parsing |
| `tailwind-merge` | Tailwind class de-duplication | Used by `client/src/lib/utils.ts` (`cn()`) | Same as `clsx` above — unused by the app |
| `tailwindcss-animate` | Tailwind v3-style animation utility plugin | **No import/`@import`/`@plugin` reference found** anywhere (checked `client/src/index.css` and all config files) | Appears unused — see duplicate note below |
| `vaul` | Drawer/sheet primitive | Used only by `ui/drawer.tsx` | Unused by the app |
| `zod` | Schema validation | **No** — zero imports anywhere, including the API routes that manually validate input with `typeof`/`Array.isArray` instead | Fully unused |

## Development Dependencies (`devDependencies`)

| Package | Declared purpose | Actually used? | Notes |
|---|---|---|---|
| `@builder.io/vite-plugin-jsx-loc` | Adds JSX source-location data attributes during dev | **Yes** — registered in `vite.config.ts` (`jsxLocPlugin()`) | Used, dev-only |
| `@tailwindcss/typography` | Tailwind `prose` utility plugin | Not confirmed used (no `@plugin`/`prose` class usage found in this audit's spot checks) | Likely unused — see `12_Open_Questions.md` |
| `@tailwindcss/vite` | Tailwind v4 Vite integration | **Yes** — `vite.config.ts` (`tailwindcss()`) | Used, core build dependency |
| `@types/express` | TS types for Express | **Yes** — supports `server/index.ts` typing | Used |
| `@types/node` | TS types for Node APIs | **Yes** — used throughout server/config code | Used |
| `@types/react` / `@types/react-dom` | TS types for React | **Yes** | Used |
| `@vitejs/plugin-react` | Vite's React plugin (JSX transform, Fast Refresh) | **Yes** — `vite.config.ts` | Used, core build dependency |
| `autoprefixer` | PostCSS vendor-prefixing | No `postcss.config.*` file exists in the repo, and Tailwind v4's `@tailwindcss/vite` plugin does not require a separate PostCSS pipeline for the app's own build | Likely unused/vestigial — see `12_Open_Questions.md` |
| `esbuild` | Server bundler | **Yes** — `package.json`'s `build` script | Used |
| `pnpm` | Package manager, listed as an installable devDependency (`^10.15.1`) in addition to being pinned via the top-level `packageManager` field (`10.4.1`) | Used as tooling, not imported code | The version declared here (`^10.15.1`) does not match the pinned `packageManager` version (`10.4.1...`) — a **version inconsistency**, see `12_Open_Questions.md` |
| `postcss` | CSS transform pipeline | No config file found (see `autoprefixer` above) | Likely unused/vestigial |
| `prettier` | Code formatter | **Yes** — `format` script, `.prettierrc`/`.prettierignore` present | Used |
| `tailwindcss` | Utility-CSS framework | **Yes** — core styling for every component | Used, core dependency |
| `tsx` | TypeScript execution for dev | **Yes** — `dev:server` script | Used |
| `tw-animate-css` | Tailwind v4-native animation utility import | **Yes** — `client/src/index.css` line 6: `@import "tw-animate-css";` | Used |
| `typescript` | Language/compiler | **Yes** | Used, core dependency |
| `vite` | Build tool/dev server | **Yes** | Used, core dependency |
| `vite-plugin-manus-runtime` | Third-party dev-platform runtime plugin | **Yes** — `vite.config.ts` | Used, dev-only, tied to the "Manus" platform (see `08_Configuration_Report.md`) |
| `vitest` | Test runner | Declared, but **zero test files exist** in the repository (`*.test.*`/`*.spec.*` search returned nothing) | Installed but has nothing to run — effectively unused |

## Why Each Dependency Exists (Summary)

- **Core application (actively used):** `react`, `react-dom`, `motion`, `lucide-react`, `recharts`, `express` (server path), `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `tailwindcss`, `tw-animate-css`, `typescript`, `tsx`, `esbuild`, `prettier`.
- **shadcn/ui scaffolding (installed, unused by the app):** all 24 `@radix-ui/*` packages, `class-variance-authority`, `clsx`, `tailwind-merge`, `cmdk`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `sonner`, `vaul`.
- **Fully unused, no importing file anywhere:** `zod`, `nanoid`, `streamdown`, `@hookform/resolvers`, `tailwindcss-animate`.
- **Type declarations:** `@types/express`, `@types/node`, `@types/react`, `@types/react-dom`.
- **Dev-platform tooling:** `@builder.io/vite-plugin-jsx-loc`, `vite-plugin-manus-runtime`, `pnpm` (as a devDependency, redundant with the pinned `packageManager` field).
- **Possibly vestigial (no confirmed usage, no config file found):** `postcss`, `autoprefixer`, `@tailwindcss/typography`.
- **Declared but with nothing to execute:** `vitest` (no test files).

## Potential Duplicates

| Pair | Observation |
|---|---|
| `tailwindcss-animate` (dependencies) vs. `tw-animate-css` (devDependencies) | Both are Tailwind animation-utility packages serving overlapping purposes (the former is the Tailwind v3-era plugin, the latter its Tailwind v4-native replacement). Only `tw-animate-css` is actually imported (`client/src/index.css`); `tailwindcss-animate` appears to be leftover from before a v3→v4 migration and was never removed. |
| `sonner` (dependencies, only used inside the unused `ui/sonner.tsx`) vs. the app's own hand-rolled `Toast.tsx` | Two independent toast-notification mechanisms exist in the dependency tree/codebase; only the custom one is actually wired into the running app. |
| `zod` (unused) vs. manual `typeof`/`Array.isArray` validation in `api/*.ts` | Not a package duplicate, but a case where a validation *library* is installed yet the code re-implements ad hoc validation by hand instead of using it. |
| `pnpm` listed both as `packageManager` (`10.4.1+sha512...`) and as a `devDependencies` entry (`^10.15.1`) | Same tool declared two ways with two different version constraints — see `12_Open_Questions.md` for whether this is intentional. |
