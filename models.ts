// models.ts

// Profile
export interface Profile {
  id: string; // UUID
  name: string;
  phone_number?: string;
  role: string;
  society_id?: number;
  two_factor_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

// Society
export interface Society {
  id: number;
  name: string;
  address?: string;
  timezone: string;
  due_date_days: number;
  late_fee_amount?: number;
  late_fee_grace_period_days?: number;
  created_at?: string;
  updated_at?: string;
}

// SocietyBlock
export interface SocietyBlock {
  id: number;
  society_id: number;
  block_name: string;
  created_at?: string;
  updated_at?: string;
}

// Unit
export interface Unit {
  id: number;
  society_id: number;
  unit_number: string;
  block_id?: number;
  size_sqft?: number;
  occupancy_status?: string;
  created_at?: string;
  updated_at?: string;
}

// Resident
export interface Resident {
  id: number;
  society_id: number;
  name: string;
  email?: string;
  phone_number: string;
  primary_unit_id?: number;
  move_in_date?: string;
  move_out_date?: string;
  is_active: boolean;
  whatsapp_opt_in: boolean;
  virtual_payment_upi_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Expense
export interface Expense {
  id: number;
  society_id: number;
  expense_date: string;
  category?: string;
  description?: string;
  amount: number;
  receipt_url?: string;
  entered_by_profile_id: string; // UUID
  created_at?: string;
  updated_at?: string;
}

// RecurringCharge
export interface RecurringCharge {
  id: number;
  society_id: number;
  charge_name: string;
  calculation_type: string; // 'fixed_per_unit', 'per_sqft'
  amount_or_rate: number;
  frequency: string; // 'monthly'
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// UtilityRate
export interface UtilityRate {
  id: number;
  society_id: number;
  utility_type: string; // 'Water', 'Electricity'
  rate_per_unit: number;
  unit_of_measurement?: string; // 'KL', 'kWh'
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// MeterReading
export interface MeterReading {
  id: number;
  society_id: number;
  unit_id: number;
  utility_rate_id: number;
  reading_date: string;
  reading_value: number;
  consumption?: number;
  charge_calculated?: number;
  entered_by_profile_id: string; // UUID
  created_at?: string;
  updated_at?: string;
}

// InvoiceBatch
export interface InvoiceBatch {
  id: number;
  society_id: number;
  billing_period_start: string;
  billing_period_end: string;
  status: string; // 'Draft', 'Pending', 'Sent', 'Cancelled'
  generated_at: string;
  finalized_at?: string;
  sent_at?: string;
  generated_by_profile_id: string; // UUID
  total_invoice_count?: number;
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
}

// Invoice
export interface Invoice {
  id: number;
  society_id: number;
  invoice_batch_id?: number;
  unit_id: number;
  resident_id: number;
  invoice_number: string;
  billing_period_start: string;
  billing_period_end: string;
  generation_date?: string;
  due_date: string;
  total_amount: number;
  amount_paid?: number;
  balance_due?: number;
  status: string; // 'draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled'
  invoice_pdf_url?: string;
  generated_by_profile_id: string; // UUID
  cancelled_at?: string;
  cancelled_by_profile_id?: string; // UUID
  created_at?: string;
  updated_at?: string;
}

// InvoiceItem
export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_type: string; // 'recurring_charge', 'expense_allocation', 'meter_charge', 'adhoc', 'late_fee', 'arrears', 'credit'
  description: string;
  related_charge_id?: number;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

// Payment
export interface Payment {
  id: number;
  society_id: number;
  resident_id: number;
  invoice_id?: number;
  amount_paid: number;
  payment_date: string;
  payment_method: string; // 'upi_auto', 'cash_manual', 'cheque_manual', 'neft_manual', 'gateway'
  transaction_id?: string;
  status?: string; // 'success', 'pending', 'failed'
  notes?: string;
  recorded_by_profile_id: string; // UUID
  created_at?: string;
  updated_at?: string;
}