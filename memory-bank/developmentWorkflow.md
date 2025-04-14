# FlatPay - Development Workflow Reminders (Cursor)

*(Derived from Spec v3.0, Section 9)*

*   Use `@` references. Give clear, single-task prompts. Review AI changes. Commit frequently (`feature/` branches).
*   **Use integrated terminal:** `npx supabase gen types ...` AFTER DB changes, `npm run build` to verify, `npx supabase functions deploy ...`.