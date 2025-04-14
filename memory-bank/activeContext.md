# FlatPay - Active Context

**Date:** 2024-07-16 (Updated: 2025-04-14)
**Current Branch:** `feature/auth-ui`

## Current Focus
*   Phase 1, Step 3: Auth UI.
*   **Paused:** Debugging layout issues with `LoginPage.tsx` - the login card is not centering correctly despite applying standard Tailwind CSS flexbox centering and ensuring parent element heights.

## Next Steps
*   Resume debugging the `LoginPage.tsx` layout issue.
*   **Action:** Use browser developer tools to inspect the element hierarchy (`html`, `body`, `#root`, the component's wrapper `div`) and computed styles to identify conflicting CSS or height issues preventing `flex items-center justify-center min-h-screen` from working.
*   Once layout is fixed, proceed with implementing MFA setup/challenge, and protected routes.

## Recent Changes
*   Attempted to fix `LoginPage` centering by modifying `index.css` (removing body flex, adding height: 100% to html/body/#root).
*   Resolved Vite path alias (`@/`) and Tailwind PostCSS plugin issues in `vite.config.ts` and `postcss.config.js`.
*   Installed `@tailwindcss/postcss`.
*   Added `Alert` component (`shadcn/ui`).
*   Implemented basic `LoginPage.tsx` UI using `shadcn/ui` components and integrated `useAuth`.
*   Committed AuthContext setup (`feat(auth): implement basic AuthContext and provider`).
*   Committed UI library setup (`feat(ui): initialize shadcn/ui and configure tailwind css`).
*   Switched to local branch `feature/auth-ui`.
*   Committed Supabase client setup (`feat(core): setup supabase client and environment`).
*   Generated Supabase TypeScript types (`src/types/supabase.ts`).
*   Completed Phase 1, Step 2 (DB Schema, RLS, Triggers, Helper Functions).
*   Refined understanding of signup/creation flow and RLS strategy.
*   Added `debugLog.md`, `deferredFeatures.md`, `workflowRules.md` to Memory Bank.
*   Established detailed Git workflow conventions.
*   Resolved local Git authentication issues and completed initial repo/Supabase setup.