# FlatPay - Debug Log

**Date:** 2025-04-14

This log tracks technical issues, errors encountered, and their resolution during the development of FlatPay.

| Date       | Issue Description                             | Resolution/Status                                      |
|------------|-----------------------------------------------|--------------------------------------------------------|
| YYYY-MM-DD | *Example: Error connecting to Supabase Auth*  | *Example: Resolved by updating API key scopes (YYYY-MM-DD)* |
| 2025-04-14 | `git push` failed with 403 Permission denied. | Initially thought to be cached credential (`WWSapp`, then `192516969`). Keychain entry deleted. |
| 2025-04-14 | `git push` failed with `Invalid username or password.` | Authentication failed after providing credentials. Need to verify PAT validity, scopes (`Contents: R&W`), and SSO Org Authorization (`Happyloopgit`) on GitHub.com. |
|            |                                               |                                                        |
