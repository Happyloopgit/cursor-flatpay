// api.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, WHATSAPP_API_KEY, WHATSAPP_API_ENDPOINT, PAYMENT_GATEWAY_API_KEY, PAYMENT_GATEWAY_API_ENDPOINT } from './config';
import { Profile, Society, SocietyBlock, Unit, Resident, Expense, RecurringCharge, UtilityRate, MeterReading, InvoiceBatch, Invoice, InvoiceItem, Payment } from './models';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Supabase API Functions ---

// Generic function to fetch data
async function fetchData<T>(table: string, select: string = '*', filter?: { column: string; operator: string; value: any }): Promise<T[]> {
  try {
    let query = supabase.from<any, T>(table).select(select);
    if (filter) {
      query = query.eq(filter.column, filter.value);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching data from', table, error);
      return [];
    }
    return data as T[] || [];
  } catch (error) {
    console.error('Error fetching data from', table, error);
    return [];
  }
}

// Generic function to create data
async function createData<T>(table: string, data: T): Promise<{ data: T[] | null; error: any }> {
  try {
    const { data: result, error } = await supabase.from<any, T>(table).insert([data]);
    if (error) {
      console.error('Error creating data in', table, error);
    }
    return { data: result ? (result as T[]) : null, error };
  } catch (error) {
    console.error('Error creating data in', table, error);
    return { data: null, error };
  }
}

// Generic function to update data
async function updateData<T>(table: string, id: number, data:  T): Promise<{ data: T[] | null; error: any }> {
  try {
    const { data: result, error } = await supabase.from<any, T>(table).update(data).eq('id', id);
    if (error) {
      console.error('Error updating data in', table, error);
    }
    return { data: result ? (result as T[]) : null, error };
  } catch (error) {
    console.error('Error updating data in', table, error);
    return { data: null, error };
  }
}

// Generic function to delete data
async function deleteData(table: string, id: number): Promise<{ error: any }> {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error('Error deleting data from', table, error);
    }
    return { error };
  } catch (error) {
    console.error('Error deleting data from', table, error);
    return { error };
  }
}

// --- Specific API Functions (Examples) ---

// Profiles
export const getProfiles = () => fetchData<Profile>('profiles');
export const createProfile = (profile: Partial<Profile>) => createData<Profile>('profiles', profile);
export const updateProfile = (id: number, profile: Partial<Profile>) => updateData<Profile>('profiles', id, profile);
// Societies
export const getSocieties = () => fetchData<Society>('societies');
export const createSociety = (society: Partial<Society>) => createData<Society>('societies', society);
export const updateSociety = (id: number, society: Partial<Society>) => updateData<Society>('societies', id, society);
// SocietyBlocks
export const getSocietyBlocks = () => fetchData<SocietyBlock>('society_blocks');
export const createSocietyBlock = (societyBlock: Partial<SocietyBlock>) => createData<SocietyBlock>('society_blocks', societyBlock);
export const updateSocietyBlock = (id: number, societyBlock: Partial<SocietyBlock>) => updateData<SocietyBlock>('society_blocks', id, societyBlock);
// Units
export const getUnits = () => fetchData<Unit>('units');
export const createUnit = (unit: Partial<Unit>) => createData<Unit>('units', unit);
export const updateUnit = (id: number, unit: Partial<Unit>) => updateData<Unit>('units', id, unit);
// Residents
export const getResidents = () => fetchData<Resident>('residents');
export const createResident = (resident: Partial<Resident>) => createData<Resident>('residents', resident);
export const updateResident = (id: number, resident: Partial<Resident>) => updateData<Resident>('residents', id, resident);
// Expenses
export const getExpenses = () => fetchData<Expense>('expenses');
export const createExpense = (expense: Partial<Expense>) => createData<Expense>('expenses', expense);
export const updateExpense = (id: number, expense: Partial<Expense>) => updateData<Expense>('expenses', id, expense);
// RecurringCharges
export const getRecurringCharges = () => fetchData<RecurringCharge>('recurring_charges');
export const createRecurringCharge = (recurringCharge: Partial<RecurringCharge>) => createData<RecurringCharge>('recurring_charges', recurringCharge);
export const updateRecurringCharge = (id: number, recurringCharge: Partial<RecurringCharge>) => updateData<RecurringCharge>('recurring_charges', id, recurringCharge);
// UtilityRates
export const getUtilityRates = () => fetchData<UtilityRate>('utility_rates');
export const createUtilityRate = (utilityRate: Partial<UtilityRate>) => createData<UtilityRate>('utility_rates', utilityRate);
export const updateUtilityRate = (id: number, utilityRate: Partial<UtilityRate>) => updateData<UtilityRate>('utility_rates', id, utilityRate);
// MeterReadings
export const getMeterReadings = () => fetchData<MeterReading>('meter_readings');
export const createMeterReading = (meterReading: Partial<MeterReading>) => createData<MeterReading>('meter_readings', meterReading);
export const updateMeterReading = (id: number, meterReading: Partial<MeterReading>) => updateData<MeterReading>('meter_readings', id, meterReading);
// InvoiceBatches
export const getInvoiceBatches = () => fetchData<InvoiceBatch>('invoice_batches');
export const createInvoiceBatch = (invoiceBatch: Partial<InvoiceBatch>) => createData<InvoiceBatch>('invoice_batches', invoiceBatch);
export const updateInvoiceBatch = (id: number, invoiceBatch: Partial<InvoiceBatch>) => updateData<InvoiceBatch>('invoice_batches', id, invoiceBatch);
// Invoices
export const getInvoices = () => fetchData<Invoice>('invoices');
export const createInvoice = (invoice: Partial<Invoice>) => createData<Invoice>('invoices', invoice);
export const updateInvoice = (id: number, invoice: Partial<Invoice>) => updateData<Invoice>('invoices', id, invoice);
// InvoiceItems
export const getInvoiceItems = () => fetchData<InvoiceItem>('invoice_items');
export const createInvoiceItem = (invoiceItem: Partial<InvoiceItem>) => createData<InvoiceItem>('invoice_items', invoiceItem);
export const updateInvoiceItem = (id: number, invoiceItem: Partial<InvoiceItem>) => updateData<InvoiceItem>('invoice_items', id, invoiceItem);
// Payments
export const getPayments = () => fetchData<Payment>('payments');
export const createPayment = (payment: Partial<Payment>) => createData<Payment>('payments', payment);
export const updatePayment = (id: number, payment: Partial<Payment>) => updateData<Payment>('payments', id, payment);

// --- External API Functions (Placeholders) ---

// WhatsApp API (Example)
async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  try {
    if (!WHATSAPP_API_KEY || !WHATSAPP_API_ENDPOINT) {
      console.warn('WhatsApp API not configured.');
      return;
    }
    // Implement API call to WhatsApp
    const response = await fetch(`${WHATSAPP_API_ENDPOINT}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
      },
      body: JSON.stringify({
        to,
        text: { body: message },
      }),
    });

    if (!response.ok) {
      console.error('Error sending WhatsApp message:', await response.text());
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Payment Gateway API (Example)
async function initiatePayment(amount: number, residentId: number, invoiceId: number): Promise<string | null> {
  try {
    if (!PAYMENT_GATEWAY_API_KEY || !PAYMENT_GATEWAY_API_ENDPOINT) {
      console.warn('Payment Gateway API not configured.');
      return null;
    }
    // Implement API call to Payment Gateway
    const response = await fetch(`${PAYMENT_GATEWAY_API_ENDPOINT}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYMENT_GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        residentId,
        invoiceId,
      }),
    });

    if (!response.ok) {
      console.error('Error initiating payment:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.paymentUrl || null; // Assuming the API returns a payment URL
  } catch (error) {
    console.error('Error initiating payment:', error);
    return null;
  }
}

export { sendWhatsAppMessage, initiatePayment };