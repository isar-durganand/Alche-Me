# Phase 07 — Virtual 3D laboratory

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
Implement one safe, complete, interactive virtual experiment selected from the actual supplied laboratory manual.

## Tasks
1. Read the real syllabus/lab manual and create a source-to-feature mapping for candidate experiments.
2. Choose the smallest representative experiment and document why it is first.
3. Model the experiment as explicit state: setup, available apparatus, actions, measurements, calculations, errors, completion and report.
4. Implement only the apparatus required for this experiment. Prefer procedural geometry or small, optimized GLB assets.
5. Provide camera controls, selection/highlighting, accessible alternate controls, undo/reset and clear instructions.
6. Use realistic but educationally appropriate interactions; never imply the simulation replaces supervised lab safety.
7. Calculate outputs from transparent formulas with units and significant figures. Add reproducible tests.
8. Generate a lab notebook/report with observations, calculations, result and limitations.
9. Include safety notes and no dangerous real-world procedural advice beyond the approved curriculum context.

## Acceptance criteria
- One experiment is playable end-to-end and repeatable.
- The user can identify apparatus, perform supported actions, record readings and finish a report.
- Measurements/calculations are deterministic and tested.
- All apparatus assets are optimized and licensed.
- Mapping to the source manual is documented; broader coverage is not claimed.
