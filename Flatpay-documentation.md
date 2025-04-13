# FlatPay - Application Specification & Strategy Document (v3.0 - Cursor Restart)

**Document Version:** 3.0
**Date:** 2024-07-16
**Status:** Initial Draft for Restart

## 1. Introduction

### 1.1. Product
FlatPay

### 1.2. Vision
To be the preferred, user-friendly, secure, and affordable financial and operational management platform for small-to-medium residential communities (approx. 10-150 units) in India, focused on automating tedious tasks and providing clear financial visibility.

### 1.3. Core Problem
Manual spreadsheet-based society management is inefficient, error-prone, lacks transparency, hinders timely collections, and consumes excessive volunteer time. Existing complex HOA software is often unsuitable or too costly for smaller communities.

### 1.4. Solution
FlatPay provides a secure, Supabase-powered **Responsive Web Application** with an intuitive interface for society managers. It automates billing cycles, incorporates various charge types (recurring, allocated expenses, metered usage), streamlines communication (WhatsApp), facilitates payment collection (manual & automated UPI), and offers clear reporting.

## 2. Target Audience

### 2.1. Primary User
*   **Role:** Society Manager / Secretary / Treasurer.
*   **Needs:** Time savings, accuracy, ease of use, clear financial overview, simple communication tools, robust security.
*   **Assumed Skill Level:** Basic computer literacy.

### 2.2. Secondary (Indirect) User
*   **Role:** Residents.
*   **Interaction:** Primarily receive communications (WhatsApp invoices/receipts) and make payments.
*   **Future:** A resident-facing portal is a potential future enhancement (Phase 3), not part of MVP.

## 3. UI/UX Design Principles (Inspired by Churnkey Examples)

*   **3.1. Clean & Minimalist:** Prioritize clarity, reduce clutter, use ample whitespace, establish clear visual hierarchy.
*   **3.2. Intuitive Navigation:** Logical sidebar for main modules, grouped settings, clear calls to action.
*   **3.3. Consistent Branding & Components:** Utilize **shadcn/ui** components over Tailwind CSS. Define a simple, professional color palette. Use icons (e.g., `lucide-react`) effectively.
*   **3.4. Data Visualization:** Clear summary cards (Dashboard), well-structured tables. Charts/graphs for reporting in later phases.
*   **3.5. Responsive Design:** Ensure usability across desktop, tablet, and mobile.
*   **3.6. User Feedback:** Clear loading states (spinners, skeletons), immediate feedback via toasts (e.g., shadcn/ui Sonner), descriptive error messages.
*   **3.7. Accessibility:** Adhere to basic principles (semantic HTML, keyboard navigation, contrast).

## 4. Core Principles & Architecture Philosophy

*   **4.1. Supabase Native First:** Maximize use of Supabase built-in features (Auth, Postgres DB, RLS, Storage, Edge Functions, DB Functions/RPC).
*   **4.2. Security by Design:** Mandatory MFA for admins, strict RLS, secure secrets (Vault/env vars), input validation (client & server), webhook signature verification, secure function contexts.
*   **4.3. Clear Boundaries:** Frontend (React) uses `supabase-js` ONLY. Backend (DB/Edge Functions) handles internal logic & ALL external API calls.
*   **4.4. Type Safety & Synchronization:** TypeScript throughout. **CRITICAL:** Regenerate Supabase types (`npx supabase gen types ...`) via Cursor terminal **immediately** after ANY DB schema/function change and *before* implementing dependent frontend code. Verify build (`npm run build`) after type generation.
*   **4.5. Component-Based UI:** Modular React components (shadcn/ui base).
*   **4.6. Iterative Development:** Build module-by-module per sequence. Frequent Git commits to feature branches (`feature/`).

## 5. Technology Stack

*   **5.1. Backend Platform:** Supabase (Cloud Hosted)
*   **5.2. Database:** Supabase PostgreSQL
*   **5.3. Authentication:** Supabase Auth (Email/Password + TOTP MFA)
*   **5.4. Backend Logic:**
    *   Supabase Edge Functions (Deno/TypeScript) - Complex logic, external APIs, webhooks.
    *   Supabase Database Functions (PL/pgSQL) - Data validation/manipulation, atomicity, called via `.rpc()`.
*   **5.5. File Storage:** Supabase Storage (receipts, generated PDFs).
*   **5.6. Frontend Framework:** React / TypeScript (likely via Vite).
*   **5.7. UI Components:** shadcn/ui library, Tailwind CSS.
*   **5.8. Icons:** `lucide-react`.
*   **5.9. Frontend State Management:** React Context (Auth), TanStack Query (React Query) (Server state), Zustand/Jotai (Optional global).
*   **5.10. Forms:** `react-hook-form`, `zod`.
*   **5.11. Utility Libraries:** `date-fns`.
*   **5.12. Client Libraries:** `supabase-js`.
*   **5.13. PDF Generation:** Server-side library (e.g., `pdfkit`, Puppeteer) or service via Edge Function.
*   **5.14. Development Environment:** Cursor IDE.
*   **5.15. Version Control:** Git / GitHub (Repo: `https://github.com/Happyloopgit/flatpay-community-ledger.git`).

## 6. Database Schema (Supabase PostgreSQL - Key Tables)

*(Assumes `public` schema, RLS enabled, `created_at`/`updated_at` TIMESTAMPTZ columns with defaults/triggers, appropriate indexing)*

*   **`auth.users` (Built-in):** Core auth data (ID: UUID).
*   **`public.profiles`:** App user data.
    *   `id` (UUID, PK, FK -> `auth.users.id` ON DELETE CASCADE)
    *   `name` (VARCHAR, NOT NULL)
    *   `phone_number` (VARCHAR)
    *   `role` (VARCHAR, NOT NULL, DEFAULT 'society_admin')
    *   `society_id` (INTEGER, FK -> `public.societies.id`, Nullable)
    *   `two_factor_enabled` (BOOLEAN, NOT NULL, DEFAULT false)
*   **`public.societies`:** Society details.
    *   `id` (SERIAL, PK)
    *   `name` (VARCHAR, NOT NULL)
    *   `address` (TEXT)
    *   `timezone` (VARCHAR, NOT NULL, DEFAULT 'UTC')
    *   `due_date_days` (INTEGER, NOT NULL, DEFAULT 15)
    *   `late_fee_amount` (DECIMAL(15,2), DEFAULT 0.00)
    *   `late_fee_grace_period_days` (INTEGER, DEFAULT 5)
*   **`public.society_blocks`:** Block/wing names.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id` ON DELETE CASCADE)
    *   `block_name` (VARCHAR, NOT NULL)
    *   `UNIQUE` (`society_id`, `block_name`)
*   **`public.units`:** Physical units.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `unit_number` (VARCHAR, NOT NULL)
    *   `block_id` (INTEGER, Nullable, FK -> `society_blocks.id` ON DELETE SET NULL)
    *   `size_sqft` (DECIMAL(10, 2), Nullable)
    *   `occupancy_status` (VARCHAR, DEFAULT 'vacant')
    *   `UNIQUE` (`society_id`, `unit_number`, `block_id`)
*   **`public.residents`:** People/occupants.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `name` (VARCHAR, NOT NULL)
    *   `email` (VARCHAR, Nullable)
    *   `phone_number` (VARCHAR, NOT NULL)
    *   `primary_unit_id` (INTEGER, Nullable, FK -> `units.id` ON DELETE SET NULL)
    *   `move_in_date`, `move_out_date` (DATE, Nullable)
    *   `is_active` (BOOLEAN, DEFAULT true)
    *   `whatsapp_opt_in` (BOOLEAN, NOT NULL, DEFAULT false)
    *   `virtual_payment_upi_id` (VARCHAR, UNIQUE, Nullable)
    *   `UNIQUE` (`society_id`, `email`)
*   **`public.expenses`:** Society expenses.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `expense_date` (DATE, NOT NULL)
    *   `category` (VARCHAR)
    *   `description` (TEXT)
    *   `amount` (DECIMAL(15,2), NOT NULL)
    *   `receipt_url` (VARCHAR, Nullable)
    *   `entered_by_profile_id` (UUID, NOT NULL, FK -> `public.profiles.id`)
*   **`public.recurring_charges`:** Recurring fee definitions.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `charge_name` (VARCHAR, NOT NULL)
    *   `calculation_type` (VARCHAR, NOT NULL) - 'fixed_per_unit', 'per_sqft'
    *   `amount_or_rate` (DECIMAL(15, 2), NOT NULL)
    *   `frequency` (VARCHAR, NOT NULL, DEFAULT 'monthly')
    *   `is_active` (BOOLEAN, DEFAULT true)
    *   `UNIQUE` (`society_id`, `charge_name`)
*   **`public.utility_rates`:** (Phase 2) Metered utility rates.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `utility_type` (VARCHAR, NOT NULL) - 'Water', 'Electricity'
    *   `rate_per_unit` (DECIMAL(15, 4), NOT NULL)
    *   `unit_of_measurement` (VARCHAR) - 'KL', 'kWh'
    *   `is_active` (BOOLEAN, DEFAULT true)
*   **`public.meter_readings`:** (Phase 2) Meter readings per unit.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `unit_id` (INTEGER, NOT NULL, FK -> `units.id`)
    *   `utility_rate_id` (INTEGER, NOT NULL, FK -> `utility_rates.id`)
    *   `reading_date` (DATE, NOT NULL)
    *   `reading_value` (DECIMAL(12, 2), NOT NULL)
    *   `consumption` (DECIMAL(12, 2), Nullable) - Calculated
    *   `charge_calculated` (DECIMAL(15, 2), Nullable) - Calculated
    *   `entered_by_profile_id` (UUID, NOT NULL, FK -> `public.profiles.id`)
*   **`public.invoice_batches`:** Tracks monthly generation runs.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `billing_period_start` (DATE, NOT NULL)
    *   `billing_period_end` (DATE, NOT NULL)
    *   `status` (VARCHAR NOT NULL, DEFAULT 'Draft') - 'Draft', 'Pending', 'Sent', 'Cancelled'
    *   `generated_at` (TIMESTAMPTZ, NOT NULL, DEFAULT now())
    *   `finalized_at`, `sent_at` (TIMESTAMPTZ, Nullable)
    *   `generated_by_profile_id` (UUID, NOT NULL, FK -> `public.profiles.id`)
    *   `total_invoice_count` (INTEGER, DEFAULT 0)
    *   `total_amount` (DECIMAL(15, 2), DEFAULT 0.00)
    *   `UNIQUE` (`society_id`, `billing_period_start`)
*   **`public.invoices`:** Individual generated invoices.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `invoice_batch_id` (INTEGER, Nullable, FK -> `invoice_batches.id` ON DELETE SET NULL)
    *   `unit_id` (INTEGER, NOT NULL, FK -> `units.id`)
    *   `resident_id` (INTEGER, NOT NULL, FK -> `residents.id`)
    *   `invoice_number` (VARCHAR, UNIQUE, NOT NULL)
    *   `billing_period_start`, `billing_period_end` (DATE, NOT NULL)
    *   `generation_date` (DATE, DEFAULT CURRENT_DATE)
    *   `due_date` (DATE, NOT NULL)
    *   `total_amount` (DECIMAL(15,2), NOT NULL)
    *   `amount_paid` (DECIMAL(15,2), DEFAULT 0.00)
    *   `balance_due` (DECIMAL(15,2), GENERATED ALWAYS AS (total_amount - amount_paid) STORED)
    *   `status` (VARCHAR, NOT NULL, DEFAULT 'draft') - 'draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled'
    *   `invoice_pdf_url` (VARCHAR, Nullable)
    *   `generated_by_profile_id` (UUID, NOT NULL, FK -> `public.profiles.id`)
    *   `cancelled_at` (TIMESTAMPTZ, Nullable)
    *   `cancelled_by_profile_id` (UUID, Nullable, FK -> `public.profiles.id`)
*   **`public.invoice_items`:** Line items for invoices.
    *   `id` (SERIAL, PK)
    *   `invoice_id` (INTEGER, NOT NULL, FK -> `invoices.id` ON DELETE CASCADE)
    *   `item_type` (VARCHAR, NOT NULL) - 'recurring_charge', 'expense_allocation', 'meter_charge', 'adhoc', 'late_fee', 'arrears', 'credit'
    *   `description` (TEXT, NOT NULL)
    *   `related_charge_id` (INTEGER, Nullable, FK -> `recurring_charges.id` ON DELETE SET NULL)
    *   *(Add `related_expense_id`, `related_meter_reading_id` later)*
    *   `amount` (DECIMAL(15, 2), NOT NULL)
*   **`public.payments`:** Received payments.
    *   `id` (SERIAL, PK)
    *   `society_id` (INTEGER, NOT NULL, FK -> `societies.id`)
    *   `resident_id` (INTEGER, NOT NULL, FK -> `residents.id`)
    *   `invoice_id` (INTEGER, Nullable, FK -> `invoices.id` ON DELETE SET NULL) - For linking payment to invoice
    *   `amount_paid` (DECIMAL(15, 2), NOT NULL)
    *   `payment_date` (TIMESTAMPTZ, NOT NULL, DEFAULT now())
    *   `payment_method` (VARCHAR, NOT NULL) - 'upi_auto', 'cash_manual', 'cheque_manual', 'neft_manual', 'gateway'
    *   `transaction_id` (VARCHAR, Nullable) - Reference from bank/gateway
    *   `status` (VARCHAR, DEFAULT 'success') - 'success', 'pending', 'failed'
    *   `notes` (TEXT, Nullable)
    *   `recorded_by_profile_id` (UUID, NOT NULL, FK -> `public.profiles.id`)

*   **(Future Tables):** `AuditLogs`, `WhatsAppLogs`, `PasswordResetTokens` (if needed beyond Supabase default), etc.

## 7. Key Features & User Flows (MVP Focus + Phase 2)

### 7.1. Onboarding & Setup
*   **Flow:** Login -> MFA Setup -> Dashboard (prompt) -> Settings.
*   **Settings Page (`/settings`):** Tabbed UI.
    *   **Profile:** Edit Society details (Name, Address, Timezone, Due Days, Late Fee).
    *   **Blocks:** CRUD UI for managing `society_blocks`.
    *   **Charges:** CRUD UI for managing `recurring_charges`.
    *   **Units:** CRUD UI for managing `units`. Assign Block via dropdown.
    *   **Residents:** CRUD UI for managing `residents`. Assign Unit via dropdown. Validation (Email unique, Phone format, Active Resident/Unit check). Activate/Deactivate.
    *   **(Phase 2) Utility Rates:** CRUD UI for managing `utility_rates`.
    *   **Security:** MFA Management (Enroll/Disable).

### 7.2. Expense Management
*   **Flow:** Navigate to Expenses -> Add Expense (Modal) -> Fill Form -> Save. View List -> Edit/Delete.
*   **Expenses Page (`/expenses`):** Displays `ExpensesList` (Realtime). "Add Expense" button.
*   **Expense Form/Modals:** Handles Add/Edit. Calls DB functions (`create_expense` / direct update). *(Phase 2: Receipt Upload to Supabase Storage)*. Delete with confirmation.

### 7.3. Meter Reading Management (Phase 2)
*   **Flow:** Navigate to Meter Readings -> Select Period -> Enter readings per unit -> Save.
*   **UI:** Page to list units for selected period, input fields for current readings. Save action calls backend to insert `meter_readings`, calculate consumption/charge.

### 7.4. Monthly Invoice Cycle (Batch Workflow)
*   **Flow:** Navigate Billing (`/billing`) -> Select Period (defaults prev month) -> Click "Generate Draft Batch" -> View Batch List -> Click "View Details" on Draft Batch -> Review Invoices -> Click "Finalize Batch" -> Click "Send Batch via WhatsApp".
*   **Billing Page (`/billing`):** Shows `InvoiceBatchList`. Month/Year selector. "Generate Draft Batch" button calls `generate-invoices` Edge Function.
*   **Batch Details Page (`/billing/batches/[batchId]`):** Shows batch summary. Filtered `InvoiceList`. Conditional buttons ("Finalize", "Cancel", "Send"). Calls DB functions (`finalize_batch`, `cancel_batch`) or Edge Function (`send_invoice_batch`).
*   **`generate-invoices` Edge Function:** Creates `invoice_batches` (Draft), `invoices` (Draft), `invoice_items`. MVP calculates based on Recurring Charges. *Phase 2: Includes Meter Charges, Allocated Expenses, Late Fees, Arrears.*
*   **PDF Generation (Phase 2):** `generate_pdf` Edge Function creates PDF from invoice data, saves to Storage, updates `invoice_pdf_url`. Triggered during finalize or send step.
*   **WhatsApp Sending (Phase 2):** `send_invoice_batch` Edge Function calls WhatsApp API with PDF attachment and payment link. Updates statuses.

### 7.5. Viewing Invoices & Payments
*   **Invoice List (`@/components/invoices/InvoiceList`):** Reusable component displays *finalized* invoices (non-draft) by default, or filtered by batch ID on Batch Details page. Shows key details, status badge. "View Details" action. Realtime updates.
*   **Invoice Details (`InvoiceDetailsModal`):** Shows invoice header and table of `invoice_items`. *(Future: Show linked payments)*.
*   **Payment List (Future):** Dedicated page or component to list all `payments` received, potentially linked to invoices/residents.

### 7.6. Payment Recording & Reconciliation
*   **Manual Recording (MVP):** UI (button on Invoice List/Details -> Modal) to record offline payments. Inserts into `payments`, updates `invoices.amount_paid` & `status`.
*   **Automated Reconciliation (Phase 2 - UPI VPA):**
    *   *Setup:* Admin configures Payment Provider keys. Backend assigns unique VPAs (`virtual_payment_upi_id`) to residents via Provider API.
    *   *Webhook:* `/api/webhooks/payment` Edge Function receives provider notification. **Verify signature.** Parses payload, identifies resident, inserts into `payments` (method 'upi_auto'), updates `invoices.amount_paid` / `status`.
    *   *UI:* Invoice status updates via Realtime.

### 7.7. Adhoc Invoices (Phase 2)
*   **Flow:** Separate "Create Adhoc Invoice" button -> Form to select Resident/Unit, manually add line items (description, amount), set due date -> Save.
*   **Backend:** Inserts directly into `invoices` (status 'pending') and `invoice_items` (type 'adhoc').

## 8. Build Sequence (Phased)

*   **Phase 1 (Core Setup & Manual Flow - MVP):**
    1.  Project Init, Supabase Setup, Git Repo.
    2.  DB Schema: Societies, Profiles, Blocks, Units, Residents, Expenses, Charges, Batches, Invoices, Invoice Items, Payments. Triggers/RLS. **Gen Types.**
    3.  Auth UI: Login, MFA Setup/Challenge, AuthContext, Protected Routes.
    4.  Layout: MainLayout (Sidebar/Topbar).
    5.  Settings UI: Profile, Blocks, Charges Tabs (CRUD).
    6.  Units UI: CRUD Page/Modals (use Block dropdown). Realtime. **Gen Types.**
    7.  Residents UI: CRUD Page/Modals (use Unit dropdown), Activate/Deactivate, Validation. DB Functions (create/update). Realtime. **Gen Types.**
    8.  Expenses UI: CRUD Page/Modals. DB Function (create). Realtime. **Gen Types.**
    9.  Billing - Generate Drafts: Edge Func (`generate-invoices` - *recurring only*). Billing page UI (selector, button calls func). **Deploy Func. Gen Types.**
    10. Billing - Batch Workflow UI: Batch List on Billing page. Batch Details page (filtered InvoiceList, placeholder buttons). Navigation. DB Funcs (`finalize_batch`, `cancel_batch`). **Gen Types.** Implement Finalize/Cancel frontend logic.
    11. Billing - View Invoice: Invoice Details modal shows line items.
    12. Payments - Manual Recording: Implement UI/backend. **Gen Types.**
*   **Phase 2 (Automation & Enhancements):**
    13. PDF Generation: Implement Edge function/library. Integrate into Send Batch. Store URL.
    14. WhatsApp Integration: Setup provider. Implement `send_invoice_batch` Edge func. Webhook handler. **Gen Types.**
    15. Automated Payments (UPI): Setup provider. Assign VPAs. Implement Webhook handler (Verify Signature, Update Payments/Invoices). **Deploy Func. Gen Types.**
    16. Meter Readings: DB Tables/Settings UI/Input UI. Update generation logic. **Gen Types.**
    17. Expense Allocation: Define rules. Update generation logic.
    18. Adhoc Invoices: Implement UI/backend.
    19. Reporting: Dashboard summaries, Reports page.
*   **Phase 3 (Future):** Resident Portal, Advanced Settings, User Roles, etc.

## 9. Development Workflow Reminder (Cursor)

*   Use `@` references. Give clear, single-task prompts. Review AI changes. Commit frequently (`feature/` branches).
*   **Use integrated terminal:** `npx supabase gen types...` AFTER DB changes, `npm run build` to verify, `npx supabase functions deploy...`.

---
