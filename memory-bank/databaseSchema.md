# FlatPay - Database Schema (Supabase PostgreSQL)

*(Derived from Spec v3.0, Section 6)*
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