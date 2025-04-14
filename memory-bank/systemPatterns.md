# FlatPay - System Patterns & Architecture

**Document Version:** 1.0 (Derived from Spec v3.0)
**Date:** 2024-07-16

## 1. Core Principles & Architecture Philosophy

*   **Supabase Native First:** Maximize use of Supabase built-in features (Auth, Postgres DB, RLS, Storage, Edge Functions, DB Functions/RPC).
*   **Security by Design:** Mandatory MFA for admins, strict RLS, secure secrets (Vault/env vars), input validation (client & server), webhook signature verification, secure function contexts.
*   **Clear Boundaries:** Frontend (React) uses `supabase-js` ONLY. Backend (DB/Edge Functions) handles internal logic & ALL external API calls.
*   **Type Safety & Synchronization:** TypeScript throughout. **CRITICAL:** Regenerate Supabase types (`npx supabase gen types ...`) via Cursor terminal **immediately** after ANY DB schema/function change and *before* implementing dependent frontend code. Verify build (`npm run build`) after type generation.
*   **Component-Based UI:** Modular React components (shadcn/ui base).
*   **Iterative Development:** Build module-by-module per sequence. Frequent Git commits to feature branches (`feature/`).

## 2. High-Level Data Structure

The database utilizes Supabase PostgreSQL with Row Level Security (RLS) enabled. Key entities include Societies, Users (Profiles linked to Auth), Units, Residents, Expenses, Recurring Charges, Invoices (generated in Batches), Invoice Line Items, and Payments. Detailed schema is in `databaseSchema.md`.