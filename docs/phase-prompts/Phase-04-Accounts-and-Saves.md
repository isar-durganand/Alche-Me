# Phase 04 — Accounts and persistence

## Mandatory working rules
- Read `docs/Alche-Me_Master_Specification.md` first and treat it as the source of truth.
- Inspect the current repository and existing vertical slice before editing. Preserve working functionality; do not overwrite the project with a new scaffold.
- The product is named **Alche-Me**. Update user-facing names and metadata safely; do not break the local path merely to rename a folder.
- Use the current stack and conventions already present unless you can justify a necessary change. Prefer React + TypeScript + Vite + Tailwind CSS and existing test tooling if already configured.
- No in-game generative AI. Chemistry explanations and answers must be curated/reviewed.
- English first; make text localization-ready for optional Hindi.
- Single-player first. Do not implement multiplayer in early phases.
- Free/near-zero-cost first. Never introduce a paid service, paid API, or mandatory subscription without documenting the cost and asking for approval.
- Do not fabricate chemistry facts or claim syllabus coverage without checking supplied source material.
- Make responsive, keyboard-accessible and touch-friendly UI. Include loading, empty, error, and success states.
- Keep components modular, typed, reusable and testable. Avoid giant single-file implementations and unnecessary dependencies.
- Run relevant tests and a production build. Report exact commands and outcomes honestly.
- Update `docs/Alche-Me_Progress_Tracker.md` and relevant documentation.
- At the end, report: summary, files changed, commands run, test/build results, known limitations, manual verification steps, and next phase.


## Objective
Create a safe persistence architecture with guest/local play first and a clearly separated optional account/cloud path.

## Tasks
1. Audit current persistence and identify the smallest safe upgrade.
2. Define interfaces for local save, account identity, remote save and sync status; keep UI independent from a specific provider.
3. Provide guest play and migration path from local progress to an account if account service is selected.
4. If Firebase or another backend is already configured, inspect its actual configuration and security rules before changes. Do not expose secrets.
5. If no backend is configured, implement interfaces and local adapter first; present provider choice and costs before provisioning anything.
6. Define conflict resolution, offline behavior, retry, sign-out and account deletion behavior.
7. Add validation and security tests; never trust client-side XP/reward values as authoritative for a future competitive backend.

## Acceptance criteria
- Guest progress works offline.
- Save schema is versioned and can be migrated.
- Errors and sync status are visible and understandable.
- No secrets are committed.
- Cloud behavior is not claimed unless end-to-end tested with a real configured service.
