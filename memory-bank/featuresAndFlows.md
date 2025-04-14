# FlatPay - Key Features & User Flows

*(Derived from Spec v3.0, Section 7)*
*(MVP Focus + Phase 2)*

## 7.1. Onboarding & Setup
*   **Flow:** Login -> MFA Setup -> Dashboard (prompt) -> Settings.
*   **Settings Page (`/settings`):** Tabbed UI.
    *   **Profile:** Edit Society details (Name, Address, Timezone, Due Days, Late Fee).
    *   **Blocks:** CRUD UI for managing `society_blocks`.
    *   **Charges:** CRUD UI for managing `recurring_charges`.
    *   **Units:** CRUD UI for managing `units`. Assign Block via dropdown.
    *   **Residents:** CRUD UI for managing `residents`. Assign Unit via dropdown. Validation (Email unique, Phone format, Active Resident/Unit check). Activate/Deactivate.
    *   **(Phase 2) Utility Rates:** CRUD UI for managing `utility_rates`.
    *   **Security:** MFA Management (Enroll/Disable).

## 7.2. Expense Management
*   **Flow:** Navigate to Expenses -> Add Expense (Modal) -> Fill Form -> Save. View List -> Edit/Delete.
*   **Expenses Page (`/expenses`):** Displays `ExpensesList` (Realtime). "Add Expense" button.
*   **Expense Form/Modals:** Handles Add/Edit. Calls DB functions (`create_expense` / direct update). *(Phase 2: Receipt Upload to Supabase Storage)*. Delete with confirmation.

## 7.3. Meter Reading Management (Phase 2)
*   **Flow:** Navigate to Meter Readings -> Select Period -> Enter readings per unit -> Save.
*   **UI:** Page to list units for selected period, input fields for current readings. Save action calls backend to insert `meter_readings`, calculate consumption/charge.

## 7.4. Monthly Invoice Cycle (Batch Workflow)
*   **Flow:** Navigate Billing (`/billing`) -> Select Period (defaults prev month) -> Click "Generate Draft Batch" -> View Batch List -> Click "View Details" on Draft Batch -> Review Invoices -> Click "Finalize Batch" -> Click "Send Batch via WhatsApp".
*   **Billing Page (`/billing`):** Shows `InvoiceBatchList`. Month/Year selector. "Generate Draft Batch" button calls `generate-invoices` Edge Function.
*   **Batch Details Page (`/billing/batches/[batchId]`):** Shows batch summary. Filtered `InvoiceList`. Conditional buttons ("Finalize", "Cancel", "Send"). Calls DB functions (`finalize_batch`, `cancel_batch`) or Edge Function (`send_invoice_batch`).
*   **`generate-invoices` Edge Function:** Creates `invoice_batches` (Draft), `invoices` (Draft), `invoice_items`. MVP calculates based on Recurring Charges. *Phase 2: Includes Meter Charges, Allocated Expenses, Late Fees, Arrears.*
*   **PDF Generation (Phase 2):** `generate_pdf` Edge Function creates PDF from invoice data, saves to Storage, updates `invoice_pdf_url`. Triggered during finalize or send step.
*   **WhatsApp Sending (Phase 2):** `send_invoice_batch` Edge Function calls WhatsApp API with PDF attachment and payment link. Updates statuses.

## 7.5. Viewing Invoices & Payments
*   **Invoice List (`@/components/invoices/InvoiceList`):** Reusable component displays *finalized* invoices (non-draft) by default, or filtered by batch ID on Batch Details page. Shows key details, status badge. "View Details" action. Realtime updates.
*   **Invoice Details (`InvoiceDetailsModal`):** Shows invoice header and table of `invoice_items`. *(Future: Show linked payments)*.
*   **Payment List (Future):** Dedicated page or component to list all `payments` received, potentially linked to invoices/residents.

## 7.6. Payment Recording & Reconciliation
*   **Manual Recording (MVP):** UI (button on Invoice List/Details -> Modal) to record offline payments. Inserts into `payments`, updates `invoices.amount_paid` & `status`.
*   **Automated Reconciliation (Phase 2 - UPI VPA):**
    *   *Setup:* Admin configures Payment Provider keys. Backend assigns unique VPAs (`virtual_payment_upi_id`) to residents via Provider API.
    *   *Webhook:* `/api/webhooks/payment` Edge Function receives provider notification. **Verify signature.** Parses payload, identifies resident, inserts into `payments` (method 'upi_auto'), updates `invoices.amount_paid` / `status`.
    *   *UI:* Invoice status updates via Realtime.

## 7.7. Adhoc Invoices (Phase 2)
*   **Flow:** Separate "Create Adhoc Invoice" button -> Form to select Resident/Unit, manually add line items (description, amount), set due date -> Save.
*   **Backend:** Inserts directly into `invoices` (status 'pending') and `invoice_items` (type 'adhoc').