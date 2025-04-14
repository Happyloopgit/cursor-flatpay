# FlatPay - Build Sequence (Phased)

*(Derived from Spec v3.0, Section 8)*

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