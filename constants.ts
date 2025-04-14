// constants.ts

// Roles
export const ROLES = {
  SOCIETY_ADMIN: 'society_admin',
  // Add other roles as needed
};

// Invoice Statuses
export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  UPI_AUTO: 'upi_auto',
  CASH_MANUAL: 'cash_manual',
  CHEQUE_MANUAL: 'cheque_manual',
  NEFT_MANUAL: 'neft_manual',
  GATEWAY: 'gateway',
};

// Calculation Types
export const CALCULATION_TYPES = {
  FIXED_PER_UNIT: 'fixed_per_unit',
  PER_SQFT: 'per_sqft',
};

// Frequency
export const FREQUENCY = {
  MONTHLY: 'monthly',
};

// Item Types
export const INVOICE_ITEM_TYPES = {
  RECURRING_CHARGE: 'recurring_charge',
  EXPENSE_ALLOCATION: 'expense_allocation',
  METER_CHARGE: 'meter_charge',
  ADHOC: 'adhoc',
  LATE_FEE: 'late_fee',
  ARREARS: 'arrears',
  CREDIT: 'credit',
};