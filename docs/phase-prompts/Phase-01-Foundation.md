# Phase 01 — Repository audit and foundation

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
Understand the existing app, preserve all working work, establish a reliable baseline, and safely introduce the Alche-Me product identity.

## Tasks
1. Inspect repository tree, package scripts, current app routes, current state/persistence, tests, assets and existing documentation.
2. Run existing install/check/test/build commands where feasible. Record failures before changing code.
3. Identify already implemented vertical-slice features and avoid rebuilding them unnecessarily.
4. Create/update README and docs references to Alche-Me. Update visible title, metadata and package display name where safe. Use `alche-me` for package/repository slug where valid.
5. Do not rename the Windows folder automatically. If proposing a folder rename, provide safe manual steps and identify path dependencies first.
6. Add a basic project health/status section and update the progress tracker.
7. Make only small, low-risk foundation changes. Do not begin new major game features in this phase.

## Acceptance criteria
- Existing app can still start or any pre-existing blockers are documented.
- Existing tests/build are run and results recorded.
- No working vertical-slice feature has been removed.
- Product-facing naming is consistent where practical.
- Master spec, roadmap, asset manifest and progress tracker are discoverable.
- A clear list of implemented vs missing features exists.
