# FlatPay - Workflow Rules

**Date:** 2025-04-14 (Updated: 2025-04-14)

This document outlines agreed-upon workflow conventions for this project.

## 1. GitHub Push Workflow

1.  **Local Changes First:** All code and documentation changes will be made locally in the workspace.
2.  **Explicit Push Trigger:** Changes will only be pushed to the `cursor-flatpay` GitHub repository when:
    *   The user explicitly asks for files to be pushed.
    *   OR, after a major update or milestone is completed, the AI assistant will ask the user if accumulated changes should be pushed.

## 2. Git Branching Strategy

*   **`main`:** This branch represents the latest stable state. Code is merged into `main` via Pull Requests ONLY. Direct commits are disallowed.
*   **`feature/<feature-name>`:** New features or significant tasks (e.g., `feature/auth-ui`, `feature/settings-crud`) are developed on these branches, created from `main`. The assistant will confirm the branch name before starting work on a new feature.
*   **`fix/<issue-or-bug-name>`:** Bug fixes for issues found in `main` are developed on these branches, created from `main`.
*   **`chore/<task-name>`:** Non-feature, non-fix tasks (e.g., `chore/update-deps`, `chore/configure-linting`) are done on these branches.

## 3. Commit Messages (Conventional Commits)

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification. The format is:

```
type(scope): subject

[optional body]

[optional footer]
```

*   **`type`:** `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor`, `test`, `chore`, `build`, `ci`.
*   **`(scope)`:** Optional context (e.g., `auth`, `db`, `settings`, `invoice`, `deps`).
*   **`subject`:** Concise description in imperative mood (e.g., `feat(auth): add login form component`).
*   **`body`:** Optional longer explanation of the change.
*   **`footer`:** Optional, for breaking changes or linking issues (e.g., `BREAKING CHANGE: ...`, `Closes #12`).
*   **Frequency:** Commit frequently with meaningful, atomic changes locally on the working branch.

## 4. Integration Workflow (Pull Requests)

*   Work happens locally on `feature/`, `fix/`, or `chore/` branches with frequent commits.
*   The local working branch is pushed to GitHub based on the rule in Section 1.
*   When a branch is complete and ready for integration, a **Pull Request (PR)** is created on GitHub to merge the branch into `main`.
*   The PR description should summarize the changes and link to relevant Memory Bank sections or tasks.
*   Code review can happen within the PR.
*   Once approved/reviewed, the PR is merged into `main`.

## 5. Memory Bank Update Workflow

*   **`activeContext.md`:** This file will be updated frequently, typically after each commit or small group of related commits, to reflect the latest actions (e.g., adding the commit message to "Recent Changes").
*   **`progress.md`:** This file will be updated less frequently, primarily when a significant milestone or step (or sub-step) outlined in `buildSequence.md` is completed.
*   **Other Files:** Other Memory Bank files (`projectbrief.md`, `techContext.md`, etc.) will be updated as needed when underlying decisions or context change.
