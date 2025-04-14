# FlatPay - Product Context

**Document Version:** 1.0 (Derived from Spec v3.0)
**Date:** 2024-07-16

## 1. Target Audience

### 1.1. Primary User
*   **Role:** Society Manager / Secretary / Treasurer.
*   **Needs:** Time savings, accuracy, ease of use, clear financial overview, simple communication tools, robust security.
*   **Assumed Skill Level:** Basic computer literacy.

### 1.2. Secondary (Indirect) User
*   **Role:** Residents.
*   **Interaction:** Primarily receive communications (WhatsApp invoices/receipts) and make payments.
*   **Future:** A resident-facing portal is a potential future enhancement (Phase 3), not part of MVP.

## 2. UI/UX Design Principles

*   **Clean & Minimalist:** Prioritize clarity, reduce clutter, use ample whitespace, establish clear visual hierarchy.
*   **Intuitive Navigation:** Logical sidebar for main modules, grouped settings, clear calls to action.
*   **Consistent Branding & Components:** Utilize **shadcn/ui** components over Tailwind CSS. Define a simple, professional color palette. Use icons (e.g., `lucide-react`) effectively.
*   **Data Visualization:** Clear summary cards (Dashboard), well-structured tables. Charts/graphs for reporting in later phases.
*   **Responsive Design:** Ensure usability across desktop, tablet, and mobile.
*   **User Feedback:** Clear loading states (spinners, skeletons), immediate feedback via toasts (e.g., shadcn/ui Sonner), descriptive error messages.
*   **Accessibility:** Adhere to basic principles (semantic HTML, keyboard navigation, contrast).