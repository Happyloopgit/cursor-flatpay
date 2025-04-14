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

## 3. Key Database Patterns

*   **Automatic Profile Creation:** A database trigger (`on_auth_user_created`) on `auth.users` automatically inserts a new row into `public.profiles` upon user signup. This new profile defaults to `role = 'society_admin'` and `society_id = NULL`.
*   **RLS Helper Functions:** To simplify RLS policies and ensure consistency, helper functions are used:
    *   `public.get_my_role()`: Returns the `role` from the `profiles` table for the current `auth.uid()`.
    *   `public.get_my_society_id()`: Returns the `society_id` from the `profiles` table for the current `auth.uid()`.
*   **RLS Policy Strategy:**
    *   RLS is enabled on all primary data tables.
    *   **Society Isolation:** Most policies restrict access based on matching the table's `society_id` with the result of `get_my_society_id()`.
    *   **Admin Role:** Most write operations are restricted to users where `get_my_role() = 'society_admin'`.
    *   **Special `societies` INSERT Policy:** Allows insertion only if `get_my_role() = 'society_admin'` AND `get_my_society_id() IS NULL` to support initial society creation by a new admin.
    *   **Profile Management:** Users can select/update their own `profiles` row based on `id = auth.uid()`.
*   **Timestamps:** `created_at` and `updated_at` columns are present on all primary tables, with `updated_at` maintained by the `trigger_set_timestamp` trigger.