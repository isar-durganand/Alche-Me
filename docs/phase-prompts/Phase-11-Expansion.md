# Phase 11 — Expansion

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
Expand content and game systems only after the core vertical slice is stable.

## Candidate features
- Additional chemistry worlds and curated level packs
- More 3D experiments and apparatus
- Daily quests and achievement collections
- Timed exam simulations and performance analytics
- Offline downloadable content packs
- Optional leaderboards with anti-cheat considerations and privacy controls
- Multiplayer research/prototype only after backend, moderation, safety and operating costs are approved

## Tasks
1. Rank features by learning value, technical risk, maintenance cost and asset requirements.
2. Build one expansion at a time behind tested interfaces.
3. Do not ship fake online leaderboards or pretend multiplayer.
4. Keep core learning functional if optional network features are unavailable.
5. Document hosting, moderation, privacy and recurring costs before any online competitive feature.

## Acceptance criteria
- Each new system has a focused specification and acceptance tests.
- Existing learning and saves remain compatible.
- Costs and dependencies are documented.
- New features are optional and do not destabilize the core loop.
