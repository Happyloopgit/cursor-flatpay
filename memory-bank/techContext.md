# FlatPay - Technology Context

**Document Version:** 1.0 (Derived from Spec v3.0)
**Date:** 2024-07-16

## 1. Technology Stack

*   **Backend Platform:** Supabase (Cloud Hosted)
*   **Database:** Supabase PostgreSQL
*   **Authentication:** Supabase Auth (Email/Password + TOTP MFA)
*   **Backend Logic:**
    *   Supabase Edge Functions (Deno/TypeScript) - Complex logic, external APIs, webhooks.
    *   Supabase Database Functions (PL/pgSQL) - Data validation/manipulation, atomicity, called via `.rpc()`.
*   **File Storage:** Supabase Storage (receipts, generated PDFs).
*   **Frontend Framework:** React / TypeScript (likely via Vite).
*   **UI Components:** shadcn/ui library, Tailwind CSS.
*   **Icons:** `lucide-react`.
*   **Frontend State Management:** React Context (Auth), TanStack Query (React Query) (Server state), Zustand/Jotai (Optional global).
*   **Forms:** `react-hook-form`, `zod`.
*   **Utility Libraries:** `date-fns`.
*   **Client Libraries:** `supabase-js`.
*   **PDF Generation:** Server-side library (e.g., `pdfkit`, Puppeteer) or service via Edge Function.
*   **Development Environment:** Cursor IDE.
*   **Version Control:** Git / GitHub (Repo: `https://github.com/Happyloopgit/cursor-flatpay.git`).