# Phase 10 — Quality, accessibility and release

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
Prepare the implemented slice for reliable use across supported devices.

## Tasks
1. Run and fix unit/component/integration tests and production build.
2. Audit responsive layout, touch, keyboard navigation, focus management, screen-reader semantics, reduced motion, contrast and text scaling.
3. Audit performance: bundle size, 3D draw calls, texture sizes, lazy loading, memory cleanup and low-end device behavior.
4. Audit errors, loading states, offline state, persistence failures and recovery.
5. Audit security: dependency risks, input validation, access rules if a backend exists, secret handling and privacy/data deletion.
6. Add README setup instructions, architecture notes, content/asset attribution, troubleshooting and known limitations.
7. Add a reproducible release checklist and do not claim compatibility without testing.

## Acceptance criteria
- Production build succeeds.
- Tests pass or remaining failures are explicitly listed.
- No secrets or unlicensed assets are included.
- Critical journeys work at mobile and desktop widths.
- Setup instructions have been followed from a clean install if feasible.
